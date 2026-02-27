"""
Payment processing with PayPal
- Create payment order
- Capture payment order
- PayPal webhook handler for order verification
- Transaction logging
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import logging

from ..database import get_db
from ..models import User, Transaction
from ..schemas import PaymentCreateOrder, PaymentCaptureOrder, TransactionResponse
from ..security import get_current_user
from ..config import PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MODE, DEBUG

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/payment", tags=["Payment"])

# TODO: Install paypalrestsdk: pip install paypalrestsdk
try:
    import paypalrestsdk
    paypalrestsdk.configure({
        "mode": PAYPAL_MODE,  # sandbox or live
        "client_id": PAYPAL_CLIENT_ID,
        "client_secret": PAYPAL_CLIENT_SECRET,
    })
    PAYPAL_AVAILABLE = True
except ImportError:
    logger.warning("⚠️ paypalrestsdk not installed. PayPal integration disabled.")
    PAYPAL_AVAILABLE = False


@router.post("/create-order", response_model=dict)
async def create_payment_order(
    data: PaymentCreateOrder,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create PayPal payment order
    Returns order_id to send to PayPal SDK
    
    Flow:
    1. Frontend calls this endpoint
    2. Gets order_id
    3. Passes to PayPal SDK for user approval
    4. User approves in PayPal
    5. Frontend calls /capture-order with order_id
    """
    
    if not PAYPAL_AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment service not available. Please contact support."
        )
    
    if not PAYPAL_CLIENT_ID or not PAYPAL_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Payment service not configured"
        )
    
    try:
        # Create payment with PayPal
        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "transactions": [{
                "amount": {
                    "total": f"{data.amount:.2f}",
                    "currency": data.currency,
                    "details": {
                        "subtotal": f"{data.amount:.2f}"
                    }
                },
                "description": f"Noukpikplon Premium - {data.plan.title()}",
                "custom": current_user.id  # Track user ID
            }],
            "redirect_urls": {
                "return_url": f"http://localhost:5173/subscription?status=success",
                "cancel_url": f"http://localhost:5173/subscription?status=cancel"
            }
        })
        
        if payment.create():
            logger.info(f"✅ PayPal order created: {payment.id} for user {current_user.id}")
            
            return {
                "status": "success",
                "order_id": payment.id,
                "approval_link": next((link.href for link in payment.links if link.rel == "approval_url"), None),
                "next_step": "Redirect user to approval_link or use PayPal SDK"
            }
        else:
            logger.error(f"❌ PayPal order creation failed: {payment.error}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create payment. Please try again."
            )
            
    except Exception as e:
        logger.error(f"❌ PayPal error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Payment processing error"
        )


@router.post("/capture-order", response_model=dict)
async def capture_payment_order(
    data: PaymentCaptureOrder,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Capture approved PayPal payment
    Called after user approves payment in PayPal
    
    Creates transaction record for auditing
    Updates user premium status if successful
    """
    
    if not PAYPAL_AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment service not available"
        )
    
    try:
        # Execute payment
        payment = paypalrestsdk.Payment.find(data.order_id)
        
        if payment.execute({"payer_id": payment.payer.payer_info.payer_id}):
            logger.info(f"✅ PayPal payment captured: {data.order_id}")
            
            # Create transaction record
            amount = int(float(payment.transactions[0].amount.total) * 100)  # Convert to cents
            transaction = Transaction(
                user_id=current_user.id,
                paypal_order_id=data.order_id,
                amount=amount,
                currency=payment.transactions[0].amount.currency,
                status="completed",
                webhook_verified=False  # Will be verified by webhook
            )
            
            db.add(transaction)
            
            # Update user premium status (temporary, finalizes on webhook)
            # In production, don't grant access until webhook confirms
            
            db.commit()
            db.refresh(transaction)
            
            return {
                "status": "success",
                "message": "Payment processed successfully",
                "transaction_id": transaction.id,
                "order_id": data.order_id,
                "note": "Premium access will be activated after webhook verification"
            }
        else:
            logger.error(f"❌ PayPal payment execution failed: {payment.error}")
            
            # Log failed transaction
            transaction = Transaction(
                user_id=current_user.id,
                paypal_order_id=data.order_id,
                amount=0,
                currency="XOF",
                status="failed",
                webhook_verified=False
            )
            db.add(transaction)
            db.commit()
            
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment execution failed. Please try again."
            )
            
    except Exception as e:
        logger.error(f"❌ Payment capture error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Payment processing error"
        )


# ============================================
# WEBHOOK: PayPal Order Verification
# ============================================

@router.post("/webhook/paypal", response_model=dict, include_in_schema=not DEBUG)
async def paypal_webhook(
    request: dict,
    db: Session = Depends(get_db)
):
    """
    PayPal webhook endpoint for order verification
    
    PayPal will POST to this endpoint when:
    - Payment is completed
    - Payment is refunded
    - etc.
    
    SECURITY: Must verify webhook signature (not shown for brevity)
    In production, verify webhook_id and signature from PayPal
    """
    
    # TODO: Verify webhook signature
    # See: https://developer.paypal.com/docs/api-basics/notifications/webhooks/
    
    event_type = request.get("event_type")
    
    if event_type not in ["PAYMENT.CAPTURE.COMPLETED", "PAYMENT.SALE.COMPLETED"]:
        return {"status": "ignored", "reason": f"Unhandled event type: {event_type}"}
    
    try:
        # Extract order ID from webhook
        order_id = request.get("resource", {}).get("id")
        
        if not order_id:
            logger.warning(f"⚠️ Webhook received without order_id: {request}")
            return {"status": "error", "reason": "Missing order_id"}
        
        # Find transaction
        transaction = db.query(Transaction).filter(
            Transaction.paypal_order_id == order_id
        ).first()
        
        if not transaction:
            logger.warning(f"⚠️ Webhook for unknown order: {order_id}")
            return {"status": "error", "reason": "Order not found"}
        
        # Mark as webhook verified
        transaction.webhook_verified = True
        transaction.verified_at = datetime.utcnow()
        transaction.status = "completed"
        
        # Get user and grant premium access
        user = db.query(User).filter(User.id == transaction.user_id).first()
        if user:
            user.is_premium = True
            # Set subscription expiry (e.g., 1 month from now)
            user.subscription_expires_at = datetime.utcnow() + timedelta(days=30)
            logger.info(f"✅ Premium activated for {user.email}")
        
        db.commit()
        
        return {
            "status": "success",
            "order_id": order_id,
            "user_id": transaction.user_id,
            "message": "Premium access activated"
        }
        
    except Exception as e:
        logger.error(f"❌ Webhook processing error: {str(e)}")
        return {
            "status": "error",
            "reason": str(e)
        }


@router.get("/transactions", response_model=list)
async def get_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user's payment transactions
    """
    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).order_by(Transaction.created_at.desc()).all()
    
    return [TransactionResponse.from_orm(t) for t in transactions]

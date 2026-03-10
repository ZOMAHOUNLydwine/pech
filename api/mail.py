import random
import string
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from database import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_otp_email(email_to: str, otp_code: str):
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; rounded-lg">
            <h2 style="color: #059669; text-align: center;">Vérification de votre compte PECH</h2>
            <p>Bonjour,</p>
            <p>Merci de vous être inscrit sur PECH. Pour finaliser la création de votre compte, veuillez utiliser le code de vérification suivant :</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #059669; background-color: #f0fdf4; padding: 10px 20px; border-radius: 8px;">{otp_code}</span>
            </div>
            <p>Ce code est valable pendant 10 minutes. Si vous n'avez pas demandé ce code, vous pouvez ignorer cet e-mail en toute sécurité.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666; text-align: center;">&copy; 2024 PECH App. Tous droits réservés.</p>
        </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="Votre code de vérification PECH",
        recipients=[email_to],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)

def generate_otp(length: int = 6):
    return ''.join(random.choices(string.digits, k=length))

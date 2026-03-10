import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, ArrowRight, Loader2, RefreshCcw } from 'lucide-react';

export default function VerifyOTP() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { verifyOTP, resendOTP } = useApp();

    const email = searchParams.get('email') || '';
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        if (!email) navigate('/signup');

        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer, email, navigate]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = code.join('');
        if (otpCode.length !== 6) {
            setError('Veuillez entrer le code complet');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await verifyOTP(email, otpCode);
            // Success! Now they can login
            navigate('/login', { state: { message: 'Compte vérifié ! Vous pouvez maintenant vous connecter.' } });
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Code invalide ou expiré');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            await resendOTP(email);
            setTimer(60);
            setError('');
        } catch (err) {
            setError('Erreur lors de l’envoi du code');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-earth-50 flex flex-col justify-center p-6">
            <div className="max-w-md w-full mx-auto space-y-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-benin-green/10 text-benin-green rounded-2xl mb-4">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-earth-900">Vérifiez votre e-mail</h2>
                    <p className="mt-2 text-sm text-earth-600">
                        Nous avons envoyé un code de 6 chiffres à <span className="font-semibold text-earth-900">{email}</span>
                    </p>
                </div>

                <div className="bg-white py-10 px-8 shadow-xl rounded-[2.5rem] border border-earth-100">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="flex justify-between gap-2">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold bg-earth-50 border border-earth-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-benin-green transition-all"
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading || code.includes('')}
                            className="w-full bg-benin-green hover:bg-green-700 text-white font-bold py-6 rounded-2xl text-lg shadow-lg hover:scale-[1.02] transition-transform active:scale-95"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    Vérifier <ArrowRight className="ml-2 w-5 h-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-earth-500">
                            Vous n'avez pas reçu le code ?
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={timer > 0 || isResending}
                            className="mt-2 inline-flex items-center text-benin-green font-bold hover:underline disabled:opacity-50 disabled:no-underline"
                        >
                            {isResending ? (
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCcw className="mr-2 w-4 h-4" />
                            )}
                            {timer > 0 ? `Renvoyer (${timer}s)` : "Renvoyer le code"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

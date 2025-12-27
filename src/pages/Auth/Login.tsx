import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { signInWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password });
        // TODO: Implement Firebase Auth
        navigate('/dashboard');
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to login", error);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none z-0"></div>

            <div className="relative z-10 w-full max-w-[400px] flex flex-col items-center gap-8">

                {/* Header / Logo */}
                <div className="flex flex-col items-center gap-6 text-center pt-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary to-accent-gold opacity-30 blur group-hover:opacity-50 transition duration-500"></div>
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white dark:bg-[#1a2e1d] shadow-xl border-2 border-white dark:border-white/10 overflow-hidden">
                            <img src="/favicon.png" alt="PB Sena Logo" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-text-primary-light dark:text-white text-[28px] font-bold leading-tight tracking-tight">
                            PB Sena
                        </h2>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal">
                            Seus jogos da Mega-Sena, organizados.
                        </p>
                    </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
                    <div className="space-y-4">
                        <Input
                            type="email"
                            placeholder="seu@email.com"
                            label="E-mail"
                            leftIcon="mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="********"
                            label="Senha"
                            leftIcon="lock"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                            Esqueceu a senha?
                        </a>
                    </div>

                    <Button type="submit" variant="primary" fullWidth>
                        Entrar
                    </Button>
                </form>

                {/* Divider */}
                <div className="relative w-full flex items-center py-2">
                    <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase">ou</span>
                    <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
                </div>

                {/* Social Actions */}
                <div className="w-full">
                    <Button
                        type="button"
                        variant="secondary"
                        fullWidth
                        onClick={handleGoogleLogin}
                        className="border border-gray-200 dark:border-gray-700"
                        // Simple Google Icon SVG inline or typical G icon
                        leftIcon="account_circle"
                    >
                        Entrar com Google
                    </Button>
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Não tem uma conta?{' '}
                    <a href="#" className="font-bold text-primary hover:text-primary-dark transition-colors">
                        Cadastre-se
                    </a>
                </p>

            </div>

            {/* Footer / Legal */}
            <div className="absolute bottom-4 w-full text-center z-10">
                <div className="flex items-center justify-center gap-4 text-xs font-medium text-gray-400 dark:text-gray-600">
                    <a href="#" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Termos</a>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                    <a href="#" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Privacidade</a>
                </div>
            </div>
        </div>
    );
};

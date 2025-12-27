import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Button } from '../../components/ui/Button';
import { auth } from '../../lib/firebase';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            toast.success('Você saiu com sucesso.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao sair.');
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark pb-24">
            <Header title="Perfil" />

            <main className="flex-1 w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center gap-6">

                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-3">
                    <div className="size-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-md">
                        {currentUser?.photoURL ? (
                            <img src={currentUser.photoURL} alt={currentUser.displayName || "User"} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                                <span className="material-symbols-outlined text-5xl">person</span>
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-text-primary-light dark:text-white">
                            {currentUser?.displayName || 'Usuário'}
                        </h2>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            {currentUser?.email}
                        </p>
                    </div>
                </div>

                <div className="w-full border-t border-gray-100 dark:border-gray-800 my-2"></div>

                <div className="w-full flex-col gap-3 flex">
                    <div className="w-full">
                        <label className="text-xs font-semibold text-gray-500 uppercase ml-1 mb-1 block">Ações da Conta</label>
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => toast('Em breve: Editar Perfil', { icon: '🚧' })}
                            leftIcon="edit"
                            className="bg-white dark:bg-surface-dark border !border-gray-300 dark:!border-gray-600 text-text-primary-light dark:text-white justify-start pl-4 shadow-sm"
                        >
                            Editar Meus Dados
                        </Button>
                    </div>

                    <div className="w-full">
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => navigate('/groups')}
                            leftIcon="groups"
                            className="bg-white dark:bg-surface-dark border !border-gray-300 dark:!border-gray-600 text-text-primary-light dark:text-white justify-start pl-4 shadow-sm"
                        >
                            Gerenciar Meus Bolões
                        </Button>
                    </div>

                    <div className="w-full pt-4 border-t border-gray-100 dark:border-gray-800">
                        <label className="text-xs font-semibold text-gray-500 uppercase ml-1 mb-1 block">Administração</label>
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => navigate('/new-result')}
                            leftIcon="stars"
                            className="bg-amber-50 dark:bg-amber-900/20 border !border-amber-200 dark:!border-amber-800/50 text-amber-800 dark:text-amber-400 justify-start pl-4 shadow-sm font-semibold"
                        >
                            Cadastrar Resultado Oficial
                        </Button>
                    </div>

                    <Button
                        variant="primary"
                        fullWidth
                        className="!bg-red-50 !text-red-600 !border-red-100 dark:!bg-red-900/20 dark:!text-red-400 dark:!border-red-900/30 mt-4"
                        onClick={handleLogout}
                        leftIcon="logout"
                    >
                        Sair da Conta
                    </Button>
                </div>

                <div className="mt-auto text-center">
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark/50">
                        PB Sena v0.1.0 (Beta)
                    </p>
                </div>

            </main>

            <BottomNav
                activeTab="profile"
                onNavigate={(tab) => {
                    if (tab === 'home') navigate('/dashboard');
                    if (tab === 'groups') navigate('/groups');
                    if (tab === 'profile') navigate('/profile');
                }}
            />
        </div>
    );
};

import React from 'react';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { NumberBall } from '../../components/game/NumberBall';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    // Mock data for now
    const nextDraw = {
        contest: 2670,
        date: 'Amanhã, 20:00',
        prize: 'R$ 52.000.000,00',
        accumulated: true,
    };

    const recentGames = [
        {
            id: 1,
            name: 'Bolão da Firma',
            contest: 2670,
            quota: 15,
            status: 'Aguardando',
            type: 'group',
            numbers: [4, 11, 25, 33, 42, 59]
        },
        {
            id: 2,
            name: 'Aposta Individual',
            contest: 2670,
            description: 'Surpresinha',
            status: 'Aguardando',
            type: 'individual',
            numbers: [2, 18, 29, 31, 45, 51]
        }
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark pb-24">
            <Header
                title="PB Sena"
                actions={
                    <div className="flex items-center gap-3">
                        <button className="flex items-center justify-center size-9 bg-white dark:bg-surface-dark rounded-full shadow-sm text-text-primary-light dark:text-white">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="size-9 rounded-full bg-gray-200 overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Dan+Buck&background=11d432&color=fff" alt="User" />
                        </div>
                    </div>
                }
            />

            <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">

                {/* Next Draw Card */}
                <section className="relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800 p-5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                                    Próximo Sorteio
                                </p>
                                <h2 className="text-2xl font-bold mt-1 text-text-primary-light dark:text-white">
                                    Concurso {nextDraw.contest}
                                </h2>
                            </div>
                            <div className="bg-primary/10 text-primary-dark dark:text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">timer</span>
                                {nextDraw.date}
                            </div>
                        </div>

                        <div className="py-2">
                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Prêmio Estimado</p>
                            <p className="text-4xl font-extrabold text-primary tracking-tight">{nextDraw.prize}</p>
                        </div>

                        {nextDraw.accumulated && (
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/50 mt-1">
                                <span className="material-symbols-outlined text-amber-500 text-lg">stars</span>
                                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                                    Acumulado!
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Stats Row */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-1">
                        <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-xl">receipt_long</span>
                        </div>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium">Meus Jogos</p>
                        <p className="text-2xl font-bold text-text-primary-light dark:text-white">2</p>
                    </div>
                    <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-1">
                        <div className="size-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-xl">attach_money</span>
                        </div>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium">Ganhos</p>
                        <p className="text-2xl font-bold text-text-primary-light dark:text-white">R$ 0,00</p>
                    </div>
                </section>

                {/* Recent Games */}
                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-bold text-text-primary-light dark:text-white">Jogos Recentes</h3>
                        <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">Ver todos</button>
                    </div>

                    {recentGames.map((game) => (
                        <div key={game.id} className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center size-10 rounded-full shrink-0 ${game.type === 'group' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'}`}>
                                        <span className="material-symbols-outlined">{game.type === 'group' ? 'groups' : 'person'}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-primary-light dark:text-white">{game.name}</p>
                                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                            Concurso {game.contest} {game.type === 'group' && `• ${game.quota} Cotas`}
                                        </p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs font-semibold border border-yellow-100 dark:border-yellow-900/30">
                                    {game.status}
                                </span>
                            </div>

                            {/* Numbers Scroll */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                                {game.numbers.map((num) => (
                                    <NumberBall key={num} number={num} size="sm" />
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

            </main>

            {/* FAB - Add Game */}
            <div className="fixed bottom-24 right-4 z-40 max-w-lg mx-auto w-full pointer-events-none flex justify-end px-4">
                <button
                    onClick={() => navigate('/new-game')}
                    className="pointer-events-auto size-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/40 hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
                >
                    <span className="material-symbols-outlined text-3xl">add</span>
                </button>
            </div>

            <BottomNav
                activeTab="home"
                onNavigate={(tab) => {
                    console.log('Navigating to', tab);
                    if (tab === 'profile') navigate('/login'); // Mock logout/profile nav
                }}
            />
        </div>
    );
};

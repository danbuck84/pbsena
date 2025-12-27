import React from 'react';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { NumberBall } from '../../components/game/NumberBall';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { checkGamesAgainstResult } from '../../utils/gameLogic';
import toast from 'react-hot-toast';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [recentGames, setRecentGames] = React.useState<any[]>([]);
    const [lastResult, setLastResult] = React.useState<any>(null);

    // Mock data for Next Draw (could be fetched later)
    const nextDraw = {
        contest: lastResult ? lastResult.contest + 1 : 2671,
        date: 'Próximo',
        prize: 'A definir',
        accumulated: true,
    };

    React.useEffect(() => {
        if (!currentUser) return;

        const fetchData = async () => {
            try {
                // 1. Fetch latest result
                const rQuery = query(collection(db, 'results'));
                const rSnap = await getDocs(rQuery);
                const results = rSnap.docs.map(doc => doc.data());
                // Sort by contest desc
                results.sort((a: any, b: any) => b.contest - a.contest);
                const latest = results.length > 0 ? results[0] : null;
                setLastResult(latest);

                // 2. Fetch User Games
                const q = query(
                    collection(db, 'games'),
                    where("userId", "==", currentUser.uid)
                );
                const querySnapshot = await getDocs(q);
                const games = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Client side sort by date (desc)
                // @ts-ignore
                games.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0));

                setRecentGames(games);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [currentUser]);

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark pb-24">
            <Header
                title={
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#1a2e1d] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <img src="/favicon.png" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span>PB Sena</span>
                    </div>
                }
                // Adding custom title component to include Logo
                actions={
                    <div className="flex items-center gap-3">
                        <button className="flex items-center justify-center size-9 bg-white dark:bg-surface-dark rounded-full shadow-sm text-text-primary-light dark:text-white">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="size-9 rounded-full bg-gray-200 overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=User&background=11d432&color=fff" alt="User" />
                        </div>
                    </div>
                }
            />

            <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">

                {/* Next Draw Card / Last Result */}
                <section className="relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800 p-5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                                    {lastResult ? 'Último Resultado' : 'Próximo Sorteio'}
                                </p>
                                <h2 className="text-2xl font-bold mt-1 text-text-primary-light dark:text-white">
                                    Concurso {lastResult ? lastResult.contest : nextDraw.contest}
                                </h2>
                            </div>
                            {/* Only show date if it's next draw, or result date */}
                        </div>

                        {lastResult ? (
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar mt-2">
                                {lastResult.numbers.map((n: number) => (
                                    <NumberBall key={n} number={n} size="sm" isResult />
                                ))}
                            </div>
                        ) : (
                            <div className="py-2">
                                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Prêmio Estimado</p>
                                <p className="text-4xl font-extrabold text-primary tracking-tight">{nextDraw.prize}</p>
                            </div>
                        )}

                        {!lastResult && nextDraw.accumulated && (
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
                        <p className="text-2xl font-bold text-text-primary-light dark:text-white">{recentGames.length}</p>
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

                    {recentGames.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">Nenhum jogo encontrado.</div>
                    ) : (
                        recentGames.map((game) => {
                            // Logic to check hits
                            let hits: number[] = [];
                            let statusLabel = game.status === 'pending' ? 'Aguardando' : game.status;
                            let isWinner = false;

                            if (lastResult) {
                                const check = checkGamesAgainstResult(game.numbers, lastResult.numbers);
                                hits = check.hits;
                                if (check.status !== 'Não premiado') {
                                    statusLabel = check.status;
                                    isWinner = true;
                                } else if (game.status === 'pending') {
                                    statusLabel = `${check.hitCount} acertos`;
                                }
                            }

                            return (
                                <div key={game.id} className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center justify-center size-10 rounded-full shrink-0 ${game.type === 'group' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'}`}>
                                                <span className="material-symbols-outlined">{game.type === 'group' ? 'groups' : 'person'}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-text-primary-light dark:text-white">
                                                    {game.type === 'group' ? 'Bolão' : 'Aposta Simples'}
                                                </p>
                                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                                    {game.date?.seconds ? new Date(game.date.seconds * 1000).toLocaleDateString('pt-BR') : 'Data n/a'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${isWinner
                                            ? 'bg-green-100 text-green-700 border-green-200'
                                            : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                            }`}>
                                            {statusLabel}
                                        </span>
                                    </div>

                                    {/* Numbers Scroll */}
                                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                                        {game.numbers && game.numbers.map((num: number) => (
                                            <NumberBall
                                                key={num}
                                                number={num}
                                                size="sm"
                                                isMatched={hits.includes(num)}
                                            />
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-3 mt-1 pt-2 border-t border-gray-50 dark:border-gray-800">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate('/new-game', { state: { editGame: game } });
                                            }}
                                            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-primary transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-base">edit</span>
                                            Editar
                                        </button>
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (window.confirm('Tem certeza que deseja excluir este jogo?')) {
                                                    try {
                                                        await deleteDoc(doc(db, 'games', game.id));
                                                        setRecentGames(prev => prev.filter(g => g.id !== game.id));
                                                        toast.success('Jogo excluído com sucesso.');
                                                    } catch (err) {
                                                        console.error(err);
                                                        toast.error('Erro ao excluir jogo.');
                                                    }
                                                }
                                            }}
                                            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-base">delete</span>
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </section>

            </main>



            <BottomNav
                activeTab="home"
                onNavigate={(tab) => {
                    console.log('Navigating to', tab);
                    if (tab === 'home') navigate('/dashboard');
                    if (tab === 'new-game') navigate('/new-game');
                    if (tab === 'groups') navigate('/groups');
                    if (tab === 'profile') navigate('/profile');
                }}
            />
        </div>
    );
};

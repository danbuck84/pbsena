import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { NumberBall } from '../../components/game/NumberBall';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { checkGamesAgainstResult } from '../../utils/gameLogic';
import toast from 'react-hot-toast';

export const GameList: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [games, setGames] = React.useState<any[]>([]);
    const [lastResult, setLastResult] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!currentUser) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch latest result for checking hits
                const rQuery = query(collection(db, 'results'));
                const rSnap = await getDocs(rQuery);
                const results = rSnap.docs.map(doc => doc.data());
                results.sort((a: any, b: any) => b.contest - a.contest);
                const latest = results.length > 0 ? results[0] : null;
                setLastResult(latest);

                // 2. Fetch User Games
                const q = query(
                    collection(db, 'games'),
                    where("userId", "==", currentUser.uid)
                );
                const querySnapshot = await getDocs(q);
                const fetchedGames = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Sort by date (desc)
                // @ts-ignore
                fetchedGames.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0));

                setGames(fetchedGames);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error('Erro ao carregar jogos.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    const handleDelete = async (gameId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este jogo?')) {
            try {
                await deleteDoc(doc(db, 'games', gameId));
                setGames(prev => prev.filter(g => g.id !== gameId));
                toast.success('Jogo excluído com sucesso.');
            } catch (err) {
                console.error(err);
                toast.error('Erro ao excluir jogo.');
            }
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark pb-24">
            <Header title="Meus Jogos" />

            <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 flex flex-col gap-4">

                {loading ? (
                    <div className="text-center py-10 text-gray-400">Carregando...</div>
                ) : games.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">receipt_long</span>
                        <p>Você ainda não tem jogos cadastrados.</p>
                        <button
                            onClick={() => navigate('/new-game')}
                            className="mt-4 text-primary font-bold hover:underline"
                        >
                            Criar meu primeiro jogo
                        </button>
                    </div>
                ) : (
                    games.map((game) => {
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(game.id);
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
            </main>

            <BottomNav
                activeTab="history"
                onNavigate={(tab) => {
                    if (tab === 'home') navigate('/dashboard');
                    if (tab === 'history') navigate('/games'); // Stay here or reload
                    if (tab === 'new-game') navigate('/new-game');
                    if (tab === 'groups') navigate('/groups');
                    if (tab === 'profile') navigate('/profile');
                }}
            />
        </div>
    );
};

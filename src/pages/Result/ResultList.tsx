import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Header } from '../../components/layout/Header';
import { NumberBall } from '../../components/game/NumberBall';
import toast from 'react-hot-toast';

export const ResultList: React.FC = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const q = query(collection(db, 'results'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort desc by contest
            data.sort((a: any, b: any) => b.contest - a.contest);
            setResults(data);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar resultados');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, contest: number) => {
        if (!window.confirm(`Tem certeza que deseja excluir o resultado do concurso ${contest}?`)) return;

        try {
            await deleteDoc(doc(db, 'results', id));
            setResults(prev => prev.filter(r => r.id !== id));
            toast.success('Resultado excluído.');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao excluir.');
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark pb-safe">
            <Header title="Resultados Oficiais" showBack onBack={() => navigate('/profile')} />

            <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 flex flex-col gap-4">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Carregando...</div>
                ) : results.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">Nenhum resultado cadastrado.</div>
                ) : (
                    results.map((result) => (
                        <div key={result.id} className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-lg text-text-primary-light dark:text-white">Concurso {result.contest}</h3>
                                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                        {result.date ? new Date(result.date.seconds ? result.date.seconds * 1000 : result.date).toLocaleDateString('pt-BR') : '-'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate('/new-result', { state: { editResult: result } })}
                                        className="p-2 text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(result.id, result.contest)}
                                        className="p-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                {result.numbers?.map((n: number) => (
                                    <NumberBall key={n} number={n} size="sm" isResult />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Header } from '../../components/layout/Header';
import { NumberBall } from '../../components/game/NumberBall';
import { Button } from '../../components/ui/Button';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export const NewGame: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    // Generate numbers 1 to 60
    const allNumbers = Array.from({ length: 60 }, (_, i) => i + 1);

    const toggleNumber = (num: number) => {
        if (selectedNumbers.includes(num)) {
            setSelectedNumbers(prev => prev.filter(n => n !== num));
        } else {
            if (selectedNumbers.length >= 20) {
                toast.error('Máximo de 20 números permitidos.');
                return;
            }
            setSelectedNumbers(prev => [...prev, num].sort((a, b) => a - b));
        }
    };

    const handleRandomGame = () => {
        // Simple "Surpresinha" - selects 6 random numbers
        const newNumbers: number[] = [];
        const pool = [...allNumbers];

        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * pool.length);
            newNumbers.push(pool[randomIndex]);
            pool.splice(randomIndex, 1);
        }
        setSelectedNumbers(newNumbers.sort((a, b) => a - b));
    };

    const handleSave = async () => {
        if (selectedNumbers.length < 6) return;
        if (!currentUser) {
            toast.error('Você precisa estar logado para salvar.');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'games'), {
                userId: currentUser.uid,
                numbers: selectedNumbers,
                date: serverTimestamp(),
                status: 'pending',
                type: 'individual' // Hardcoded for now
            });
            toast.success('Jogo salvo com sucesso!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving game:', error);
            toast.error('Erro ao salvar o jogo. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark pb-safe">
            <Header
                title="Novo Jogo"
                showBack
                onBack={() => navigate(-1)}
                actions={
                    <button
                        onClick={() => setSelectedNumbers([])}
                        className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                        Limpar
                    </button>
                }
            />

            <main className="flex-1 w-full max-w-lg mx-auto px-4 py-4 flex flex-col">

                {/* Helper Text / Counter */}
                <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                        Selecione as dezenas
                    </span>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${selectedNumbers.length >= 6
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                        }`}>
                        {selectedNumbers.length} / 20
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-6 gap-3 sm:gap-4 justify-items-center mb-8">
                    {allNumbers.map((num) => (
                        <NumberBall
                            key={num}
                            number={num}
                            isSelected={selectedNumbers.includes(num)}
                            onClick={() => toggleNumber(num)}
                            size="md"
                        />
                    ))}
                </div>

                {/* Actions */}
                <div className="mt-auto flex flex-col gap-3 sticky bottom-4">
                    <Button
                        variant="secondary"
                        onClick={handleRandomGame}
                        className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-sm"
                        leftIcon="casino"
                    >
                        Surpresinha
                    </Button>

                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handleSave}
                        disabled={selectedNumbers.length < 6 || loading}
                        isLoading={loading}
                        leftIcon="check"
                    >
                        Salvar Jogo
                    </Button>
                </div>
            </main>
        </div>
    );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const NewResult: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [contest, setContest] = useState('');
    const [numbers, setNumbers] = useState<string[]>(Array(6).fill(''));

    const handleNumberChange = (index: number, value: string) => {
        const newNumbers = [...numbers];
        newNumbers[index] = value;
        setNumbers(newNumbers);
    };

    const handleSave = async () => {
        // Validation
        if (!contest) {
            toast.error('Digite o número do concurso');
            return;
        }
        const parsedNumbers = numbers.map(n => parseInt(n)).filter(n => !isNaN(n) && n > 0 && n <= 60);
        if (parsedNumbers.length !== 6) {
            toast.error('Preencha as 6 dezenas corretamente (1-60).');
            return;
        }
        // Check for duplicates
        if (new Set(parsedNumbers).size !== 6) {
            toast.error('Não pode haver números repetidos.');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'results'), {
                contest: parseInt(contest),
                numbers: parsedNumbers.sort((a, b) => a - b),
                date: serverTimestamp(),
                createdAt: serverTimestamp()
            });
            toast.success('Resultado salvo com sucesso!');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao salvar resultado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark pb-safe">
            <Header title="Novo Resultado" showBack onBack={() => navigate(-1)} />

            <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
                <Input
                    label="Número do Concurso"
                    type="number"
                    placeholder="Ex: 2670"
                    value={contest}
                    onChange={(e) => setContest(e.target.value)}
                />

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary-light dark:text-gray-200 ml-1">
                        Dezenas Sorteadas
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                        {numbers.map((val, idx) => (
                            <input
                                key={idx}
                                type="number"
                                className="w-full aspect-square rounded-full border-2 border-gray-200 dark:border-gray-700 text-center text-lg font-bold focus:border-primary focus:outline-none bg-white dark:bg-surface-dark text-text-primary-light dark:text-white"
                                value={val}
                                onChange={(e) => handleNumberChange(idx, e.target.value)}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-auto">
                    <Button variant="primary" fullWidth onClick={handleSave} isLoading={loading}>
                        Salvar Resultado
                    </Button>
                </div>
            </main>
        </div>
    );
};

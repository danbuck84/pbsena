import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export const Groups: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'my-groups' | 'join' | 'create'>('my-groups');
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form States
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [joinCode, setJoinCode] = useState('');

    useEffect(() => {
        if (currentUser && activeTab === 'my-groups') {
            fetchGroups();
        }
    }, [currentUser, activeTab]);

    const fetchGroups = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const q = query(
                collection(db, 'groups'),
                where("members", "array-contains", currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const fetchedGroups = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setGroups(fetchedGroups);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar grupos.');
        } finally {
            setLoading(false);
        }
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) {
            toast.error('Nome do grupo é obrigatório.');
            return;
        }
        setLoading(true);
        try {
            const code = generateCode();
            // In a real app, check for code collision here
            await addDoc(collection(db, 'groups'), {
                name: newGroupName,
                description: newGroupDesc,
                code: code,
                adminId: currentUser?.uid,
                members: [currentUser?.uid],
                createdAt: serverTimestamp()
            });
            toast.success(`Grupo criado! Código: ${code}`);
            setNewGroupName('');
            setNewGroupDesc('');
            setActiveTab('my-groups');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao criar grupo.');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGroup = async () => {
        if (joinCode.length !== 6) {
            toast.error('O código deve ter 6 caracteres.');
            return;
        }
        setLoading(true);
        try {
            const q = query(collection(db, 'groups'), where("code", "==", joinCode.toUpperCase()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                toast.error('Grupo não encontrado.');
                setLoading(false);
                return;
            }

            const groupDoc = querySnapshot.docs[0];
            const groupData = groupDoc.data();

            if (groupData.members.includes(currentUser?.uid)) {
                toast.error('Você já está neste grupo.');
                setLoading(false);
                return;
            }

            await updateDoc(groupDoc.ref, {
                members: arrayUnion(currentUser?.uid)
            });

            toast.success('Você entrou no grupo!');
            setJoinCode('');
            setActiveTab('my-groups');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao entrar no grupo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark pb-24">
            <Header title="Bolões" />

            <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">

                {/* Tabs */}
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <button
                        onClick={() => setActiveTab('my-groups')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'my-groups'
                            ? 'bg-white dark:bg-surface-dark text-primary shadow-sm'
                            : 'text-text-secondary-light dark:text-text-secondary-dark'
                            }`}
                    >
                        Meus Grupos
                    </button>
                    <button
                        onClick={() => setActiveTab('join')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'join'
                            ? 'bg-white dark:bg-surface-dark text-primary shadow-sm'
                            : 'text-text-secondary-light dark:text-text-secondary-dark'
                            }`}
                    >
                        Entrar
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'create'
                            ? 'bg-white dark:bg-surface-dark text-primary shadow-sm'
                            : 'text-text-secondary-light dark:text-text-secondary-dark'
                            }`}
                    >
                        Criar
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'my-groups' && (
                    <div className="flex flex-col gap-4">
                        {groups.length === 0 && !loading && (
                            <div className="text-center py-10 text-gray-400">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">groups</span>
                                <p>Você ainda não participa de nenhum bolão.</p>
                            </div>
                        )}
                        {groups.map(group => (
                            <div key={group.id} className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-text-primary-light dark:text-white">{group.name}</h3>
                                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-1">{group.description}</p>
                                    </div>
                                    <span className="bg-primary/10 text-primary-dark dark:text-primary px-2 py-1 rounded text-xs font-mono font-bold tracking-wider">
                                        {group.code}
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-sm">person</span>
                                    {group.members.length} membros
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'create' && (
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Nome do Bolão"
                            placeholder="Ex: Bolão da Firma"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                        <Input
                            label="Descrição (Opcional)"
                            placeholder="Ex: Apenas para o pessoal do setor X"
                            value={newGroupDesc}
                            onChange={(e) => setNewGroupDesc(e.target.value)}
                        />
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={handleCreateGroup}
                            isLoading={loading}
                        >
                            Criar Bolão
                        </Button>
                    </div>
                )}

                {activeTab === 'join' && (
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Código do Bolão"
                            placeholder="Ex: X7Y9Z2"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            maxLength={6}
                        />
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={handleJoinGroup}
                            isLoading={loading}
                        >
                            Entrar no Bolão
                        </Button>
                    </div>
                )}

            </main>

            <BottomNav
                activeTab="groups"
                onNavigate={(tab) => {
                    if (tab === 'home') navigate('/dashboard');
                    if (tab === 'groups') navigate('/groups');
                    if (tab === 'profile') navigate('/profile');
                }}
            />
        </div>
    );
};

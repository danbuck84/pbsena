import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, arrayUnion, serverTimestamp, doc, deleteDoc, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export const Groups: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'my-groups' | 'join' | 'create'>('my-groups');
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Admin / Detail View
    const [selectedGroup, setSelectedGroup] = useState<any>(null); // keeping any to avoid re-defining interface if not present in snippet
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');

    useEffect(() => {
        if (selectedGroup) {
            setEditName(selectedGroup.name);
            setEditDesc(selectedGroup.description);
        }
    }, [selectedGroup]);

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
                membersDetails: [{
                    uid: currentUser!.uid,
                    email: currentUser!.email,
                    displayName: currentUser!.displayName
                }],
                payments: { [currentUser!.uid]: false },
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
                members: arrayUnion(currentUser?.uid),
                membersDetails: arrayUnion({
                    uid: currentUser!.uid,
                    email: currentUser!.email,
                    displayName: currentUser!.displayName
                })
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

    // Admin Functions
    const handleUpdateGroup = async () => {
        if (!selectedGroup) return;
        if (!editName.trim()) {
            toast.error('Nome é obrigatório');
            return;
        }

        try {
            await updateDoc(doc(db, 'groups', selectedGroup.id), {
                name: editName,
                description: editDesc
            });

            setSelectedGroup((prev: any) => prev ? ({ ...prev, name: editName, description: editDesc }) : null);
            setIsEditing(false);
            toast.success('Grupo atualizado!');
            fetchGroups(); // refresh list
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar grupo');
        }
    };

    const togglePayment = async (memberUid: string, currentStatus: boolean) => {
        if (!selectedGroup) return;
        try {
            const groupRef = doc(db, 'groups', selectedGroup.id);
            const newStatus = !currentStatus;

            await updateDoc(groupRef, {
                [`payments.${memberUid}`]: newStatus
            });

            // Optimistic update
            setSelectedGroup((prev: any) => {
                if (!prev) return null;
                return {
                    ...prev,
                    payments: {
                        ...prev.payments,
                        [memberUid]: newStatus
                    }
                };
            });
            toast.success('Status de pagamento atualizado');
        } catch (error) {
            console.error(error);
            toast.error('Falha ao atualizar pagamento');
        }
    };

    const removeMember = async (memberUid: string) => {
        if (!selectedGroup) return;
        if (!window.confirm('Remover este membro do grupo?')) return;

        try {
            const groupRef = doc(db, 'groups', selectedGroup.id);
            // Get current memberDetails to find the one to remove
            const memberDetailToRemove = selectedGroup.membersDetails?.find((m: any) => m.uid === memberUid);

            await updateDoc(groupRef, {
                members: arrayRemove(memberUid),
                membersDetails: memberDetailToRemove ? arrayRemove(memberDetailToRemove) : undefined
            });

            setSelectedGroup((prev: any) => {
                if (!prev) return null;
                return {
                    ...prev,
                    members: prev.members.filter((m: string) => m !== memberUid),
                    membersDetails: prev.membersDetails?.filter((m: any) => m.uid !== memberUid)
                };
            });
            toast.success('Membro removido.');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao remover membro.');
        }
    };

    const deleteGroup = async () => {
        if (!selectedGroup) return;
        if (!window.confirm('ATENÇÃO: Isso apagará o grupo permanentemente para TODOS os membros. Continuar?')) return;

        try {
            await deleteDoc(doc(db, 'groups', selectedGroup.id));
            toast.success('Grupo excluído.');
            setSelectedGroup(null);
            fetchGroups();
        } catch (error) {
            console.error(error);
            toast.error('Erro ao excluir grupo.');
        }
    };

    // Render Group Details / Admin Panel
    if (selectedGroup) {
        const isAdmin = selectedGroup.adminId === currentUser?.uid;

        return (
            <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark pb-24">
                <Header
                    title={isEditing ? 'Editar Grupo' : selectedGroup.name}
                    showBack
                    onBack={() => isEditing ? setIsEditing(false) : setSelectedGroup(null)}
                    actions={isAdmin && !isEditing && (
                        <div className="flex items-center gap-1">
                            <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-primary hover:bg-gray-50 p-2 rounded-full">
                                <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button onClick={deleteGroup} className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    )}
                />
                <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">

                    {isEditing ? (
                        <div className="flex flex-col gap-4">
                            <Input
                                label="Nome do Bolão"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                            <Input
                                label="Descrição"
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={() => setIsEditing(false)} fullWidth>
                                    Cancelar
                                </Button>
                                <Button variant="primary" onClick={handleUpdateGroup} fullWidth>
                                    Salvar
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold dark:text-white">Detalhes</h2>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-gray-500 uppercase">Código</span>
                                        <span className="text-lg font-mono font-bold text-primary tracking-wider select-all">{selectedGroup.code}</span>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedGroup.description || 'Sem descrição'}</p>

                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="material-symbols-outlined text-base">person</span>
                                    <span>Admin: {selectedGroup.membersDetails?.find((m: any) => m.uid === selectedGroup.adminId)?.displayName || 'Admin'}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <h3 className="font-bold text-lg dark:text-white px-1">Membros ({selectedGroup.members.length})</h3>
                                {selectedGroup.members.map((memberUid: string) => {
                                    const detail = selectedGroup.membersDetails?.find((m: any) => m.uid === memberUid);
                                    const isPaid = selectedGroup.payments?.[memberUid] || false;
                                    const isMe = memberUid === currentUser?.uid;
                                    const isMemberAdmin = memberUid === selectedGroup.adminId;

                                    return (
                                        <div key={memberUid} className="bg-white dark:bg-surface-dark p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-400">
                                                    <span className="material-symbols-outlined">person</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-text-primary-light dark:text-white">
                                                        {detail?.displayName || (isMe ? 'Você' : 'Membro')}
                                                        {isMemberAdmin && <span className="text-xs text-primary ml-1">(Admin)</span>}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{detail?.email || 'Email oculto'}</p>
                                                </div>
                                            </div>

                                            {isAdmin ? (
                                                <div className="flex items-center gap-3">
                                                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                                                        <input
                                                            type="checkbox"
                                                            checked={isPaid}
                                                            onChange={() => togglePayment(memberUid, isPaid)}
                                                            className="rounded text-primary focus:ring-primary"
                                                        />
                                                        <span className={`text-xs font-bold ${isPaid ? 'text-green-600' : 'text-red-500'}`}>
                                                            {isPaid ? 'PAGO' : 'PAGAR'}
                                                        </span>
                                                    </label>
                                                    {!isMemberAdmin && (
                                                        <button onClick={() => removeMember(memberUid)} className="text-gray-400 hover:text-red-500">
                                                            <span className="material-symbols-outlined">close</span>
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className={`px-2 py-1 rounded text-xs font-bold ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'}`}>
                                                    {isPaid ? 'PAGO' : 'PENDENTE'}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </main>
            </div>
        );
    }

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
                            <div
                                key={group.id}
                                onClick={() => setSelectedGroup(group)}
                                className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
                            >
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
                                    {group.adminId === currentUser?.uid && (
                                        <span className="ml-auto bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide">Admin</span>
                                    )}
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
                    if (tab === 'history') navigate('/games');
                    if (tab === 'new-game') navigate('/new-game');
                    if (tab === 'groups') navigate('/groups');
                    if (tab === 'profile') navigate('/profile');
                }}
            />
        </div>
    );
};

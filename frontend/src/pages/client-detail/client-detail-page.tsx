import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Briefcase,
    GraduationCap,
    Heart,
    CreditCard,
    Wallet,
    Plus,
    AlertTriangle,
    Calendar,
    Percent,
    User,
} from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Spinner,
    Badge,
    EmptyState,
    Modal,
    ModalFooter,
} from '@shared/index';
import { clientsApi, financeApi, type ClientFull, type Loan, type Deposit } from '@entities/index';
import { ClientFormModal, LoanFormModal, DepositFormModal } from '@features/index';
import s from './client-detail-page.module.scss';
import clsx from 'clsx';

// Format date helper
const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

// Format currency
const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ru-RU') + ' ₽';
};

export const ClientDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [client, setClient] = useState<ClientFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modals state
    const [isEditClientModalOpen, setEditClientModalOpen] = useState(false);
    const [isLoanModalOpen, setLoanModalOpen] = useState(false);
    const [isDepositModalOpen, setDepositModalOpen] = useState(false);

    // Edit/Delete State
    const [editLoan, setEditLoan] = useState<Loan | undefined>(undefined);
    const [editDeposit, setEditDeposit] = useState<Deposit | undefined>(undefined);

    const [deleteState, setDeleteState] = useState<{
        isOpen: boolean;
        type: 'client' | 'loan' | 'deposit';
        id: number;
        name?: string; // For confirmation text
    }>({
        isOpen: false,
        type: 'client',
        id: 0,
    });

    const [deleting, setDeleting] = useState(false);

    const fetchClient = async () => {
        if (!id) return;

        try {
            const data = await clientsApi.getFull(parseInt(id));
            setClient(data);
        } catch (err) {
            setError('Failed to load client');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClient();
    }, [id]);

    // Handle Deletion
    const handleDeleteConfirm = async () => {
        if (!client) return;
        setDeleting(true);

        try {
            if (deleteState.type === 'client') {
                await clientsApi.delete(client.id, true);
                navigate('/clients');
            } else if (deleteState.type === 'loan') {
                await financeApi.deleteLoan(deleteState.id);
                fetchClient();
                setDeleteState({ ...deleteState, isOpen: false });
            } else if (deleteState.type === 'deposit') {
                await financeApi.deleteDeposit(deleteState.id);
                fetchClient();
                setDeleteState({ ...deleteState, isOpen: false });
            }
        } catch (err) {
            console.error(err);
            // Maybe show toast or error
        } finally {
            setDeleting(false);
        }
    };

    const openLoanEdit = (loan: Loan) => {
        setEditLoan(loan);
        setLoanModalOpen(true);
    };

    const openLoanCreate = () => {
        setEditLoan(undefined);
        setLoanModalOpen(true);
    };

    const openDepositEdit = (deposit: Deposit) => {
        setEditDeposit(deposit);
        setDepositModalOpen(true);
    };

    const openDepositCreate = () => {
        setEditDeposit(undefined);
        setDepositModalOpen(true);
    };

    const openDeleteModal = (type: 'client' | 'loan' | 'deposit', id: number, name?: string) => {
        setDeleteState({
            isOpen: true,
            type,
            id,
            name,
        });
    };

    if (loading) {
        return (
            <div className={s.loader}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className={s.page}>
                <div className={s.container}>
                    <Card>
                        <EmptyState
                            icon={<User size={32} />}
                            title="Client not found"
                            description={error || 'The requested client does not exist.'}
                            actionLabel="Back to Clients"
                            onAction={() => navigate('/clients')}
                        />
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className={s.page}>
            <div className={s.container}>
                {/* Back Button */}
                <Link to="/clients" className={s.backLink}>
                    <ArrowLeft size={18} />
                    Back to Clients
                </Link>

                {/* Client Header */}
                <div className={s.clientHeader}>
                    <div className={s.clientInfo}>
                        <div className={s.avatar}>
                            {client.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className={s.clientName}>
                                {client.full_name}
                                {client.is_bankrupt && (
                                    <Badge variant="danger" className={s.badge}>
                                        <AlertTriangle size={12} />
                                        Bankrupt
                                    </Badge>
                                )}
                            </h1>
                            <p className={s.clientMeta}>
                                Client #{client.id} • {client.age} лет
                            </p>
                        </div>
                    </div>
                    <div className={s.actions}>
                        <Button
                            variant="secondary"
                            leftIcon={<Edit size={16} />}
                            onClick={() => setEditClientModalOpen(true)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="danger"
                            leftIcon={<Trash2 size={16} />}
                            onClick={() => openDeleteModal('client', client.id, client.full_name)}
                        >
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Info Cards Grid */}
                <div className={s.infoGrid}>
                    <Card className={s.infoCard}>
                        <CardContent>
                            <div className={s.infoIcon}>
                                <Briefcase size={20} />
                            </div>
                            <div className={s.infoContent}>
                                <span className={s.infoLabel}>Job</span>
                                <span className={s.infoValue}>{client.job.name}</span>
                                <span className={s.infoSub}>
                                    {formatCurrency(client.job.salary)} / month
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={s.infoCard}>
                        <CardContent>
                            <div className={s.infoIcon}>
                                <GraduationCap size={20} />
                            </div>
                            <div className={s.infoContent}>
                                <span className={s.infoLabel}>Education</span>
                                <span className={s.infoValue}>{client.education_level.name}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={s.infoCard}>
                        <CardContent>
                            <div className={s.infoIcon}>
                                <Heart size={20} />
                            </div>
                            <div className={s.infoContent}>
                                <span className={s.infoLabel}>Marital Status</span>
                                <span className={s.infoValue}>{client.marital_status.name}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Loans Section */}
                <Card className={s.sectionCard}>
                    <CardHeader>
                        <CardTitle>
                            <CreditCard size={20} className={s.sectionIcon} />
                            Loans ({client.loans.length})
                        </CardTitle>
                        <Button
                            size="sm"
                            leftIcon={<Plus size={14} />}
                            onClick={openLoanCreate}
                        >
                            Add Loan
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {client.loans.length === 0 ? (
                            <div className={s.emptySection}>
                                <p>No loans registered</p>
                            </div>
                        ) : (
                            <div className={s.itemsGrid}>
                                {client.loans.map((loan: Loan) => (
                                    <div key={loan.id} className={s.item}>
                                        <div className={s.itemHeader}>
                                            <span className={s.itemAmount}>{formatCurrency(loan.amount)}</span>
                                            <div className={s.itemHeaderRight}>
                                                {loan.is_overdue ? (
                                                    <Badge variant="danger" size="sm">Overdue</Badge>
                                                ) : (
                                                    <Badge variant="success" size="sm">Active</Badge>
                                                )}
                                                <div className={s.itemActions}>
                                                    <button className={s.iconBtn} onClick={() => openLoanEdit(loan)}>
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className={clsx(s.iconBtn, s.iconBtnDanger)} onClick={() => openDeleteModal('loan', loan.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={s.itemDetails}>
                                            <div className={s.itemDetail}>
                                                <Percent size={14} />
                                                <span>{loan.interest_rate}%</span>
                                            </div>
                                            <div className={s.itemDetail}>
                                                <Calendar size={14} />
                                                <span>{formatDate(loan.start_date)} — {formatDate(loan.end_date)}</span>
                                            </div>
                                        </div>
                                        {loan.is_overdue && loan.overdue_amount > 0 && (
                                            <div className={s.overdueAmount}>
                                                Overdue: {formatCurrency(loan.overdue_amount)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Deposits Section */}
                <Card className={s.sectionCard}>
                    <CardHeader>
                        <CardTitle>
                            <Wallet size={20} className={s.sectionIcon} />
                            Deposits ({client.deposits.length})
                        </CardTitle>
                        <Button
                            size="sm"
                            leftIcon={<Plus size={14} />}
                            onClick={openDepositCreate}
                        >
                            Add Deposit
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {client.deposits.length === 0 ? (
                            <div className={s.emptySection}>
                                <p>No deposits registered</p>
                            </div>
                        ) : (
                            <div className={s.itemsGrid}>
                                {client.deposits.map((deposit: Deposit) => (
                                    <div key={deposit.id} className={s.item}>
                                        <div className={s.itemHeader}>
                                            <span className={s.itemAmount}>{formatCurrency(deposit.amount)}</span>
                                            <div className={s.itemHeaderRight}>
                                                <Badge variant="info" size="sm">{deposit.type.name}</Badge>
                                                <div className={s.itemActions}>
                                                    <button className={s.iconBtn} onClick={() => openDepositEdit(deposit)}>
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className={clsx(s.iconBtn, s.iconBtnDanger)} onClick={() => openDeleteModal('deposit', deposit.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={s.itemDetails}>
                                            <div className={s.itemDetail}>
                                                <Percent size={14} />
                                                <span>{deposit.interest_rate}%</span>
                                            </div>
                                            <div className={s.itemDetail}>
                                                <Calendar size={14} />
                                                <span>{formatDate(deposit.start_date)} — {formatDate(deposit.end_date)}</span>
                                            </div>
                                        </div>
                                        <div className={s.finalAmount}>
                                            Final: {formatCurrency(deposit.final_amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* MODALS */}

            {/* Universal Delete Modal */}
            <Modal
                isOpen={deleteState.isOpen}
                onClose={() => setDeleteState({ ...deleteState, isOpen: false })}
                title={`Delete ${deleteState.type.charAt(0).toUpperCase() + deleteState.type.slice(1)}`}
                size="sm"
            >
                <p className={s.deleteText}>
                    {deleteState.type === 'client' ? (
                        <>Are you sure you want to delete client <strong>{deleteState.name}</strong>? This will delete all loans and deposits too.</>
                    ) : (
                        <>Are you sure you want to delete this {deleteState.type}?</>
                    )}
                </p>
                <ModalFooter>
                    <Button variant="secondary" onClick={() => setDeleteState({ ...deleteState, isOpen: false })}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDeleteConfirm}
                        isLoading={deleting}
                    >
                        Delete
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Edit Client */}
            <ClientFormModal
                isOpen={isEditClientModalOpen}
                onClose={() => setEditClientModalOpen(false)}
                client={client}
                onSuccess={() => {
                    setEditClientModalOpen(false);
                    fetchClient();
                }}
            />

            {/* Add/Edit Loan */}
            <LoanFormModal
                isOpen={isLoanModalOpen}
                onClose={() => setLoanModalOpen(false)}
                clientId={client.id}
                loan={editLoan}
                onSuccess={() => {
                    setLoanModalOpen(false);
                    fetchClient();
                }}
            />

            {/* Add/Edit Deposit */}
            <DepositFormModal
                isOpen={isDepositModalOpen}
                onClose={() => setDepositModalOpen(false)}
                clientId={client.id}
                deposit={editDeposit}
                onSuccess={() => {
                    setDepositModalOpen(false);
                    fetchClient();
                }}
            />
        </div>
    );
};

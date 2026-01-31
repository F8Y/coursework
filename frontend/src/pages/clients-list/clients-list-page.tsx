import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Users, AlertTriangle, Search, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Card, Button, Spinner, Badge, EmptyState, Input } from '@shared/index';
import { clientsApi, type ClientSummary } from '@entities/index';
import { ClientFormModal } from '@features/index';
import s from './clients-list-page.module.scss';

type SortKey = 'full_name' | 'age' | 'salary' | null;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

export const ClientsListPage = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState<ClientSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Search & Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: null,
        direction: 'asc',
    });

    // Modal State
    const [isClientModalOpen, setClientModalOpen] = useState(false);

    // Fetch Data
    const fetchClients = async () => {
        try {
            const data = await clientsApi.getAll();
            setClients(data);
        } catch (err) {
            setError('Failed to load clients');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    // Filter and Sort Logic
    const filteredAndSortedClients = useMemo(() => {
        let result = [...clients];

        // Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter((client) =>
                client.full_name.toLowerCase().includes(query)
            );
        }

        // Sort
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue: string | number = '';
                let bValue: string | number = '';

                if (sortConfig.key === 'full_name') {
                    aValue = a.full_name.toLowerCase();
                    bValue = b.full_name.toLowerCase();
                } else if (sortConfig.key === 'age') {
                    aValue = a.age;
                    bValue = b.age;
                } else if (sortConfig.key === 'salary') {
                    aValue = a.job.salary;
                    bValue = b.job.salary;
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [clients, searchQuery, sortConfig]);

    const handleSort = (key: SortKey) => {
        setSortConfig((current) => {
            if (current.key === key) {
                return {
                    key,
                    direction: current.direction === 'asc' ? 'desc' : 'asc',
                };
            }
            return { key, direction: 'asc' };
        });
    };

    const getSortIcon = (key: SortKey) => {
        if (sortConfig.key !== key) return <ArrowUpDown size={14} className={s.sortIconInfo} />;
        return sortConfig.direction === 'asc' ? (
            <ArrowUp size={14} className={s.sortIconActive} />
        ) : (
            <ArrowDown size={14} className={s.sortIconActive} />
        );
    };

    if (loading) {
        return (
            <div className={s.loader}>
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className={s.page}>
            <div className={s.container}>
                {/* Header */}
                <div className={s.header}>
                    <div>
                        <h1 className={s.title}>Clients</h1>
                        <p className={s.subtitle}>Manage your bank clients</p>
                    </div>
                    <Button
                        onClick={() => setClientModalOpen(true)}
                        leftIcon={<Plus size={18} />}
                    >
                        Add Client
                    </Button>
                </div>

                {error && <div className={s.error}>{error}</div>}

                {/* Controls */}
                {clients.length > 0 && (
                    <div className={s.controls}>
                        <div className={s.searchWrapper}>
                            <Input
                                placeholder="Search clients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                leftIcon={<Search size={18} />}
                                fullWidth
                            />
                        </div>
                    </div>
                )}

                {/* Clients Table */}
                {clients.length === 0 ? (
                    <Card>
                        <EmptyState
                            icon={<Users size={32} />}
                            title="No clients yet"
                            description="Start by adding your first client to the system."
                            actionLabel="Add Client"
                            onAction={() => setClientModalOpen(true)}
                        />
                    </Card>
                ) : filteredAndSortedClients.length === 0 ? (
                    <Card>
                        <EmptyState
                            icon={<Search size={32} />}
                            title="No results found"
                            description={`No clients found matching "${searchQuery}"`}
                        />
                    </Card>
                ) : (
                    <Card padding="none">
                        <div className={s.tableWrapper}>
                            <table className={s.table}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th
                                            className={s.sortableHeader}
                                            onClick={() => handleSort('full_name')}
                                        >
                                            <div className={s.headerContent}>
                                                Full Name {getSortIcon('full_name')}
                                            </div>
                                        </th>
                                        <th
                                            className={s.sortableHeader}
                                            onClick={() => handleSort('age')}
                                        >
                                            <div className={s.headerContent}>
                                                Age {getSortIcon('age')}
                                            </div>
                                        </th>
                                        <th>Job</th>
                                        <th
                                            className={s.sortableHeader}
                                            onClick={() => handleSort('salary')}
                                        >
                                            <div className={s.headerContent}>
                                                Salary {getSortIcon('salary')}
                                            </div>
                                        </th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAndSortedClients.map((client) => (
                                        <tr
                                            key={client.id}
                                            onClick={() => navigate(`/clients/${client.id}`)}
                                            className={s.tableRow}
                                        >
                                            <td className={s.idCell}>#{client.id}</td>
                                            <td>
                                                <div className={s.nameCell}>
                                                    <div className={s.avatar}>
                                                        {client.full_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <Link
                                                        to={`/clients/${client.id}`}
                                                        className={s.nameLink}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {client.full_name}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td>{client.age} лет</td>
                                            <td>{client.job.name}</td>
                                            <td className={s.salaryCell}>
                                                {client.job.salary.toLocaleString()} ₽
                                            </td>
                                            <td>
                                                {client.is_bankrupt ? (
                                                    <Badge variant="danger">
                                                        <AlertTriangle size={12} />
                                                        Bankrupt
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="success">Active</Badge>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={s.tableFooter}>
                            <span className={s.count}>
                                Showing {filteredAndSortedClients.length} of {clients.length} clients
                            </span>
                        </div>
                    </Card>
                )}
            </div>

            {/* Add Client Modal */}
            <ClientFormModal
                isOpen={isClientModalOpen}
                onClose={() => setClientModalOpen(false)}
                onSuccess={() => {
                    setClientModalOpen(false);
                    fetchClients();
                }}
            />
        </div>
    );
};

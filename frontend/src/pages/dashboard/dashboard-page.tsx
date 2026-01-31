import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CreditCard, Wallet, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, Spinner } from '@shared/index';
import { clientsApi, type ClientSummary } from '@entities/index';
import s from './dashboard-page.module.scss';

// Stats card component
interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: 'green' | 'blue' | 'yellow' | 'purple';
}

const StatCard = ({ icon, label, value, color }: StatCardProps) => (
    <Card className={`${s.statCard} ${s[`statCard--${color}`]}`}>
        <CardContent>
            <div className={s.statIcon}>{icon}</div>
            <div className={s.statInfo}>
                <span className={s.statValue}>{value}</span>
                <span className={s.statLabel}>{label}</span>
            </div>
        </CardContent>
    </Card>
);

export const DashboardPage = () => {
    const [clients, setClients] = useState<ClientSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await clientsApi.getAll();
                setClients(data);
            } catch (err) {
                setError('Failed to load data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate stats
    const totalClients = clients.length;
    const bankruptClients = clients.filter((c) => c.is_bankrupt).length;
    const avgSalary = clients.length > 0
        ? Math.round(clients.reduce((sum, c) => sum + c.job.salary, 0) / clients.length)
        : 0;

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
                    <h1 className={s.title}>Dashboard</h1>
                    <p className={s.subtitle}>Overview of your banking system</p>
                </div>

                {error && <div className={s.error}>{error}</div>}

                {/* Stats Grid */}
                <div className={s.statsGrid}>
                    <StatCard
                        icon={<Users size={24} />}
                        label="Total Clients"
                        value={totalClients}
                        color="green"
                    />
                    <StatCard
                        icon={<CreditCard size={24} />}
                        label="Bankrupt Clients"
                        value={bankruptClients}
                        color="yellow"
                    />
                    <StatCard
                        icon={<Wallet size={24} />}
                        label="Avg. Salary"
                        value={`${avgSalary.toLocaleString()} ₽`}
                        color="blue"
                    />
                    <StatCard
                        icon={<TrendingUp size={24} />}
                        label="Active Rate"
                        value={totalClients > 0 ? `${Math.round(((totalClients - bankruptClients) / totalClients) * 100)}%` : '0%'}
                        color="purple"
                    />
                </div>

                {/* Recent Clients */}
                <Card className={s.recentCard}>
                    <div className={s.recentHeader}>
                        <h2 className={s.recentTitle}>Recent Clients</h2>
                        <Link to="/clients" className={s.viewAll}>
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className={s.recentList}>
                        {clients.slice(0, 5).map((client) => (
                            <Link
                                key={client.id}
                                to={`/clients/${client.id}`}
                                className={s.recentItem}
                            >
                                <div className={s.avatar}>
                                    {client.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div className={s.clientInfo}>
                                    <span className={s.clientName}>{client.full_name}</span>
                                    <span className={s.clientJob}>{client.job.name}</span>
                                </div>
                                <span className={s.clientAge}>{client.age} лет</span>
                            </Link>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

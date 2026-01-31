import { NavLink } from 'react-router-dom';
import s from './header.module.scss';
import { LayoutDashboard, Users, Landmark } from 'lucide-react';

const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/clients', label: 'Clients', icon: Users },
];

export const Header = () => {
    return (
        <header className={s.header}>
            <div className={s.container}>
                {/* Logo */}
                <NavLink to="/" className={s.logo}>
                    <div className={s.logoIcon}>
                        <Landmark size={24} />
                    </div>
                    <span className={s.logoText}>BankCRM</span>
                </NavLink>

                {/* Navigation */}
                <nav className={s.nav}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `${s.navLink} ${isActive ? s['navLink--active'] : ''}`
                            }
                            end={item.to === '/'}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
};
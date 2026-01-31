import { type ReactNode } from 'react';
import s from './badge.module.scss';
import clsx from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    className?: string;
}

export const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    className,
}: BadgeProps) => {
    return (
        <span
            className={clsx(
                s.badge,
                s[`badge--${variant}`],
                s[`badge--${size}`],
                className
            )}
        >
            {children}
        </span>
    );
};

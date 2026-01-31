import { type ReactNode } from 'react';
import s from './empty-state.module.scss';
import { Button } from '../button';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState = ({
    icon,
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) => {
    return (
        <div className={s.emptyState}>
            {icon && <div className={s.icon}>{icon}</div>}
            <h3 className={s.title}>{title}</h3>
            {description && <p className={s.description}>{description}</p>}
            {actionLabel && onAction && (
                <Button onClick={onAction} variant="primary">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

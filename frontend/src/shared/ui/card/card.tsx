import { type ReactNode, type HTMLAttributes } from 'react';
import s from './card.module.scss';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    hoverable?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({
    children,
    hoverable = false,
    padding = 'md',
    className,
    ...props
}: CardProps) => {
    return (
        <div
            className={clsx(
                s.card,
                s[`card--padding-${padding}`],
                hoverable && s['card--hoverable'],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

// Card Header
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export const CardHeader = ({ children, className, ...props }: CardHeaderProps) => {
    return (
        <div className={clsx(s.header, className)} {...props}>
            {children}
        </div>
    );
};

// Card Title
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children: ReactNode;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle = ({ children, as: Tag = 'h3', className, ...props }: CardTitleProps) => {
    return (
        <Tag className={clsx(s.title, className)} {...props}>
            {children}
        </Tag>
    );
};

// Card Content
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export const CardContent = ({ children, className, ...props }: CardContentProps) => {
    return (
        <div className={clsx(s.content, className)} {...props}>
            {children}
        </div>
    );
};

// Card Footer
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export const CardFooter = ({ children, className, ...props }: CardFooterProps) => {
    return (
        <div className={clsx(s.footer, className)} {...props}>
            {children}
        </div>
    );
};

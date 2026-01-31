import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import s from './button.module.scss';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    disabled,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={clsx(
                s.button,
                s[`button--${variant}`],
                s[`button--${size}`],
                fullWidth && s['button--full'],
                isLoading && s['button--loading'],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className={s.spinner} />
            ) : (
                <>
                    {leftIcon && <span className={s.icon}>{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className={s.icon}>{rightIcon}</span>}
                </>
            )}
        </button>
    );
};

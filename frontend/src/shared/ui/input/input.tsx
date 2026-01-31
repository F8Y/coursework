import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import s from './input.module.scss';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: ReactNode;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            leftIcon,
            fullWidth = false,
            className,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className={clsx(s.wrapper, fullWidth && s['wrapper--full'], className)}>
                {label && (
                    <label htmlFor={inputId} className={s.label}>
                        {label}
                    </label>
                )}
                <div className={clsx(s.inputWrapper, error && s['inputWrapper--error'])}>
                    {leftIcon && <span className={s.icon}>{leftIcon}</span>}
                    <input
                        ref={ref}
                        id={inputId}
                        className={clsx(s.input, leftIcon && s['input--withIcon'])}
                        {...props}
                    />
                </div>
                {error && <span className={s.error}>{error}</span>}
                {helperText && !error && <span className={s.helper}>{helperText}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';

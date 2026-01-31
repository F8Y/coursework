import { forwardRef, type SelectHTMLAttributes } from 'react';
import s from './select.module.scss';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
    fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            error,
            options,
            placeholder = 'Select...',
            fullWidth = false,
            className,
            id,
            ...props
        },
        ref
    ) => {
        const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className={clsx(s.wrapper, fullWidth && s['wrapper--full'], className)}>
                {label && (
                    <label htmlFor={selectId} className={s.label}>
                        {label}
                    </label>
                )}
                <div className={clsx(s.selectWrapper, error && s['selectWrapper--error'])}>
                    <select
                        ref={ref}
                        id={selectId}
                        className={s.select}
                        {...props}
                    >
                        <option value="" disabled>
                            {placeholder}
                        </option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className={s.icon} />
                </div>
                {error && <span className={s.error}>{error}</span>}
            </div>
        );
    }
);

Select.displayName = 'Select';

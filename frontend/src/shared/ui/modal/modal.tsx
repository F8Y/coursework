import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import s from './modal.module.scss';
import clsx from 'clsx';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
    showCloseButton?: boolean;
}

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
}: ModalProps) => {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className={s.overlay} onClick={onClose}>
            <div
                className={clsx(s.modal, s[`modal--${size}`])}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
            >
                {(title || showCloseButton) && (
                    <div className={s.header}>
                        {title && (
                            <h2 id="modal-title" className={s.title}>
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                type="button"
                                className={s.closeButton}
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}
                <div className={s.content}>{children}</div>
            </div>
        </div>,
        document.body
    );
};

// Modal Footer helper component
interface ModalFooterProps {
    children: ReactNode;
    className?: string;
}

export const ModalFooter = ({ children, className }: ModalFooterProps) => {
    return <div className={clsx(s.footer, className)}>{children}</div>;
};

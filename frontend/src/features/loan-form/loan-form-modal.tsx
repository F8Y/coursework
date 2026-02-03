import { useEffect, useState } from 'react';
import {
    Modal,
    ModalFooter,
    Button,
    Input,
} from '@shared/index';
import {
    financeApi,
    type LoanCreate,
    type Loan,
} from '@entities/index';
import s from './loan-form.module.scss';


interface LoanFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: number;
    loan?: Loan;
    onSuccess: () => void;
}

export const LoanFormModal = ({
    isOpen,
    onClose,
    clientId,
    loan,
    onSuccess,
}: LoanFormModalProps) => {
    const isEdit = !!loan;
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Omit<LoanCreate, 'client_id'>>({
        amount: 100000,
        interest_rate: 12.5,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        is_overdue: false,
        overdue_amount: 0,
    });

    // Reset/Populate form on open
    useEffect(() => {
        if (isOpen) {
            if (loan) {
                setFormData({
                    amount: loan.amount,
                    interest_rate: loan.interest_rate,
                    start_date: loan.start_date.split('T')[0],
                    end_date: loan.end_date.split('T')[0],
                    is_overdue: loan.is_overdue,
                    overdue_amount: loan.is_overdue ? loan.overdue_amount : 0,
                });
            } else {
                setFormData({
                    amount: 100000,
                    interest_rate: 12.5,
                    start_date: new Date().toISOString().split('T')[0],
                    end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                    is_overdue: false,
                    overdue_amount: 0,
                });
            }
            setError(null);
        }
    }, [isOpen, loan]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            if (isEdit && loan) {
                await financeApi.updateLoan(loan.id, formData);
            } else {
                await financeApi.createLoan({
                    ...formData,
                    client_id: clientId,
                });
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to save loan');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Loan' : 'Add Loan'}
        >
            <form onSubmit={handleSubmit} className={s.form}>
                {error && <div className={s.error}>{error}</div>}

                <Input
                    label="Amount (₽)"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    min={0}
                    required
                />

                <Input
                    label="Interest Rate (%)"
                    type="number"
                    step="0.1"
                    value={formData.interest_rate}
                    onChange={(e) => setFormData({ ...formData, interest_rate: parseFloat(e.target.value) || 0 })}
                    min={0}
                    required
                />

                <div className={s.row}>
                    <Input
                        label="Start Date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className={s.half}
                        required
                    />

                    <Input
                        label="End Date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className={s.half}
                        required
                    />
                </div>

                <label className={s.checkbox}>
                    <input
                        type="checkbox"
                        checked={formData.is_overdue}
                        onChange={(e) => setFormData({ ...formData, is_overdue: e.target.checked })}
                    />
                    <span>Is Overdue?</span>
                </label>

                {formData.is_overdue && (
                    <Input
                        label="Overdue Amount (₽)"
                        type="number"
                        step="0.01"
                        value={formData.overdue_amount}
                        onChange={(e) => setFormData({ ...formData, overdue_amount: parseFloat(e.target.value) || 0 })}
                        min={0}
                    />
                )}

                <ModalFooter>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={submitting}>
                        {isEdit ? 'Save Changes' : 'Create Loan'}
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    );
};

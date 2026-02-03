import { useEffect, useState } from 'react';
import {
    Modal,
    ModalFooter,
    Button,
    Input,
    Select,
    Spinner,
} from '@shared/index';
import {
    financeApi,
    referencesApi,
    type DepositCreate,
    type Deposit,
} from '@entities/index';
import s from './deposit-form.module.scss';
import clsx from 'clsx';

interface DepositFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: number;
    deposit?: Deposit;
    onSuccess: () => void;
}

export const DepositFormModal = ({
    isOpen,
    onClose,
    clientId,
    deposit,
    onSuccess,
}: DepositFormModalProps) => {
    const isEdit = !!deposit;
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [types, setTypes] = useState<{ value: number; label: string }[]>([]);

    const [formData, setFormData] = useState<Omit<DepositCreate, 'client_id'>>({
        type_id: 0,
        amount: 50000,
        interest_rate: 8.0,
        final_amount: 50000,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    });

    // Load types and populate form
    useEffect(() => {
        if (isOpen) {
            const init = async () => {
                setLoading(true);
                try {
                    // Load reference types only if not loaded? Or always fresh?
                    const typesData = await referencesApi.getDepositTypes();
                    setTypes(typesData.map((t) => ({ value: t.id, label: t.name })));

                    if (deposit) {
                        setFormData({
                            type_id: deposit.type.id,
                            amount: deposit.amount,
                            interest_rate: deposit.interest_rate,
                            final_amount: deposit.final_amount,
                            start_date: deposit.start_date.split('T')[0],
                            end_date: deposit.end_date.split('T')[0],
                        });
                    } else {
                        setFormData({
                            type_id: 0,
                            amount: 50000,
                            interest_rate: 8.0,
                            final_amount: 50000,
                            start_date: new Date().toISOString().split('T')[0],
                            end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                        });
                    }
                    setError(null);
                } catch (err) {
                    console.error(err);
                    setError('Failed to load data');
                } finally {
                    setLoading(false);
                }
            };

            init();
        }
    }, [isOpen, deposit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            if (formData.type_id === 0) throw new Error("Select deposit type");

            if (isEdit && deposit) {
                await financeApi.updateDeposit(deposit.id, formData);
            } else {
                await financeApi.createDeposit({
                    ...formData,
                    client_id: clientId,
                });
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to save deposit');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Deposit' : 'Add Deposit'}
        >
            {loading ? (
                <div className={s.loader}>
                    <Spinner />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={s.form}>
                    {error && <div className={s.error}>{error}</div>}

                    <Select
                        label="Deposit Type"
                        options={types}
                        value={formData.type_id}
                        onChange={(e) => setFormData({ ...formData, type_id: parseInt(e.target.value) })}
                        required

                    />

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

                    <Input
                        label="Final Amount (₽)"
                        type="number"
                        step="0.01"
                        value={formData.final_amount}
                        onChange={(e) => setFormData({ ...formData, final_amount: parseFloat(e.target.value) || 0 })}
                        min={0}
                        helperText="Estimated final amount"
                    />

                    <ModalFooter>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={submitting}>
                            {isEdit ? 'Save Changes' : 'Create Deposit'}
                        </Button>
                    </ModalFooter>
                </form>
            )}
        </Modal>
    );
};

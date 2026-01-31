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
} from '@entities/index';
import s from './deposit-form.module.scss';

interface DepositFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: number;
    onSuccess: () => void;
}

export const DepositFormModal = ({
    isOpen,
    onClose,
    clientId,
    onSuccess,
}: DepositFormModalProps) => {
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

    // Load types
    useEffect(() => {
        if (isOpen) {
            const loadTypes = async () => {
                try {
                    const typesData = await referencesApi.getDepositTypes();
                    setTypes(typesData.map((t) => ({ value: t.id, label: t.name })));
                    setLoading(false);
                } catch (err) {
                    console.error(err);
                    setError('Failed to load deposit types');
                }
            };

            setLoading(true);
            loadTypes();

            // Reset form
            setFormData({
                type_id: 0,
                amount: 50000,
                interest_rate: 8.0,
                final_amount: 50000,
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            });
            setError(null);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            if (formData.type_id === 0) throw new Error("Select deposit type");

            await financeApi.createDeposit({
                ...formData,
                client_id: clientId,
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to create deposit');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Deposit"
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
                            Create Deposit
                        </Button>
                    </ModalFooter>
                </form>
            )}
        </Modal>
    );
};

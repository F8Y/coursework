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
    clientsApi,
    referencesApi,
    type ClientSummary,
    type ClientDetail,
    type ClientCreate,
    type ClientUpdate,
} from '@entities/index';
import s from './client-form.module.scss';

interface ClientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    client?: ClientDetail | ClientSummary; // If provided, edit mode
    onSuccess: () => void;
}

export const ClientFormModal = ({
    isOpen,
    onClose,
    client,
    onSuccess,
}: ClientFormModalProps) => {
    const isEdit = !!client;
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // References
    const [jobs, setJobs] = useState<{ value: number; label: string }[]>([]);
    const [educationLevels, setEducationLevels] = useState<{ value: number; label: string }[]>([]);
    const [maritalStatuses, setMaritalStatuses] = useState<{ value: number; label: string }[]>([]);

    // Form State
    const [formData, setFormData] = useState<ClientCreate>({
        full_name: '',
        age: 18,
        is_bankrupt: false,
        job_id: 0,
        education_level_id: 0,
        marital_status_id: 0,
    });

    // Load References
    useEffect(() => {
        if (isOpen) {
            const loadRefs = async () => {
                try {
                    const [jobsData, eduData, maritalData] = await Promise.all([
                        referencesApi.getJobs(),
                        referencesApi.getEducationLevels(),
                        referencesApi.getMaritalStatuses(),
                    ]);

                    setJobs(jobsData.map((j) => ({ value: j.id, label: `${j.name} (${j.salary}₽)` })));
                    setEducationLevels(eduData.map((e) => ({ value: e.id, label: e.name })));
                    setMaritalStatuses(maritalData.map((m) => ({ value: m.id, label: m.name })));

                    setLoading(false);
                } catch (err) {
                    console.error(err);
                    setError('Failed to load references');
                }
            };

            setLoading(true);
            loadRefs();
        }
    }, [isOpen]);

    // Load Client Data for Edit
    useEffect(() => {
        if (isOpen && client) {
            // If we have full detail, we can populate directly. 
            // If we only have summary, we might need to fetch detail first, 
            // but for now let's try to map what we have.
            // Actually, ClientSummary has job but NOT education/marital status IDs usually embedded differently.
            // Ideally for edit we should have full detail or fetch it.
            // Let's assume we pass full detail or fetch it if needed.
            // For now, let's just populate what we can. 

            // Better approach: If isEdit, fetch fresh data to be sure
            const fetchClientData = async () => {
                try {
                    const data = await clientsApi.getById(client.id);
                    setFormData({
                        full_name: data.full_name,
                        age: data.age,
                        is_bankrupt: data.is_bankrupt,
                        job_id: data.job.id,
                        education_level_id: data.education_level.id,
                        marital_status_id: data.marital_status.id,
                    });
                } catch (err) {
                    console.error(err);
                    setError("Failed to load client data");
                }
            };
            fetchClientData();
        } else {
            // Reset form
            setFormData({
                full_name: '',
                age: 18,
                is_bankrupt: false,
                job_id: 0,
                education_level_id: 0,
                marital_status_id: 0,
            });
        }
    }, [isOpen, client]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // Validation
            if (!formData.full_name || formData.full_name.length < 2) throw new Error("Name too short");
            if (formData.job_id === 0) throw new Error("Select a job");
            if (formData.education_level_id === 0) throw new Error("Select education");
            if (formData.marital_status_id === 0) throw new Error("Select marital status");

            if (isEdit && client) {
                await clientsApi.update(client.id, formData);
            } else {
                await clientsApi.create(formData);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to save client');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Client' : 'New Client'}
        >
            {loading ? (
                <div className={s.loader}>
                    <Spinner />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={s.form}>
                    {error && <div className={s.error}>{error}</div>}

                    <Input
                        label="Full Name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="Ivanov Ivan"
                        required
                    />

                    <Input
                        label="Age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                        min={0}
                        max={150}
                        required
                    />

                    <Select
                        label="Job"
                        options={jobs}
                        value={formData.job_id}
                        onChange={(e) => setFormData({ ...formData, job_id: parseInt(e.target.value) })}
                        required
                    />

                    <div className={s.row}>
                        <Select
                            label="Education"
                            options={educationLevels}
                            value={formData.education_level_id}
                            onChange={(e) => setFormData({ ...formData, education_level_id: parseInt(e.target.value) })}
                            className={s.half}
                            required
                        />

                        <Select
                            label="Marital Status"
                            options={maritalStatuses}
                            value={formData.marital_status_id}
                            onChange={(e) => setFormData({ ...formData, marital_status_id: parseInt(e.target.value) })}
                            className={s.half}
                            required
                        />
                    </div>

                    <label className={s.checkbox}>
                        <input
                            type="checkbox"
                            checked={formData.is_bankrupt}
                            onChange={(e) => setFormData({ ...formData, is_bankrupt: e.target.checked })}
                        />
                        <span>Is Bankrupt?</span>
                    </label>

                    <ModalFooter>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={submitting}>
                            {isEdit ? 'Save Changes' : 'Create Client'}
                        </Button>
                    </ModalFooter>
                </form>
            )}
        </Modal>
    );
};

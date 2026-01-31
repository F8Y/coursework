import { api } from '@shared/api';
import type {
    ClientSummary,
    ClientDetail,
    ClientFull,
    ClientCreate,
    ClientUpdate,
    Job,
    EducationLevel,
    MaritalStatus,
    DepositType,
} from './types';

// ============================================
// CLIENTS API
// ============================================

export const clientsApi = {
    // Get all clients (summary view)
    getAll: async (): Promise<ClientSummary[]> => {
        const { data } = await api.get<ClientSummary[]>('/clients/');
        return data;
    },

    // Get client by ID (detail view)
    getById: async (id: number): Promise<ClientDetail> => {
        const { data } = await api.get<ClientDetail>(`/clients/${id}`);
        return data;
    },

    // Get client full info (with loans and deposits)
    getFull: async (id: number): Promise<ClientFull> => {
        const { data } = await api.get<ClientFull>(`/clients/${id}/full`);
        return data;
    },

    // Create client
    create: async (client: ClientCreate): Promise<ClientSummary> => {
        const { data } = await api.post<ClientSummary>('/clients/', client);
        return data;
    },

    // Update client
    update: async (id: number, client: ClientUpdate): Promise<ClientDetail> => {
        const { data } = await api.put<ClientDetail>(`/clients/${id}`, client);
        return data;
    },

    // Delete client
    delete: async (id: number, force = false): Promise<void> => {
        await api.delete(`/clients/${id}`, { params: { force } });
    },
};

// ============================================
// REFERENCES API
// ============================================

export const referencesApi = {
    // Get all jobs
    getJobs: async (): Promise<Job[]> => {
        const { data } = await api.get<Job[]>('/references/jobs');
        return data;
    },

    // Get all education levels
    getEducationLevels: async (): Promise<EducationLevel[]> => {
        const { data } = await api.get<EducationLevel[]>('/references/education-levels');
        return data;
    },

    // Get all marital statuses
    getMaritalStatuses: async (): Promise<MaritalStatus[]> => {
        const { data } = await api.get<MaritalStatus[]>('/references/marital-statuses');
        return data;
    },

    // Get all deposit types
    getDepositTypes: async (): Promise<DepositType[]> => {
        const { data } = await api.get<DepositType[]>('/references/deposit-types');
        return data;
    },
};

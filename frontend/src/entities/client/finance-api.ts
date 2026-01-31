import { api } from '@shared/api';
import type { Loan, LoanCreate, LoanUpdate, Deposit, DepositCreate, DepositUpdate } from './types';

// ============================================
// FINANCE API (Loans & Deposits)
// ============================================

export const financeApi = {
    // === LOANS ===

    // Create loan
    createLoan: async (loan: LoanCreate): Promise<Loan> => {
        const { data } = await api.post<Loan>('/finance/loans', loan);
        return data;
    },

    // Update loan
    updateLoan: async (id: number, loan: LoanUpdate): Promise<Loan> => {
        const { data } = await api.put<Loan>(`/finance/loans/${id}`, loan);
        return data;
    },

    // Delete loan
    deleteLoan: async (id: number): Promise<void> => {
        await api.delete(`/finance/loans/${id}`);
    },

    // === DEPOSITS ===

    // Create deposit
    createDeposit: async (deposit: DepositCreate): Promise<Deposit> => {
        const { data } = await api.post<Deposit>('/finance/deposits', deposit);
        return data;
    },

    // Update deposit
    updateDeposit: async (id: number, deposit: DepositUpdate): Promise<Deposit> => {
        const { data } = await api.put<Deposit>(`/finance/deposits/${id}`, deposit);
        return data;
    },

    // Delete deposit
    deleteDeposit: async (id: number): Promise<void> => {
        await api.delete(`/finance/deposits/${id}`);
    },
};

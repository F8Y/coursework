// ============================================
// CLIENT TYPES
// ============================================

// Reference types (from API)
export interface Job {
    id: number;
    name: string;
    salary: number;
}

export interface EducationLevel {
    id: number;
    name: string;
}

export interface MaritalStatus {
    id: number;
    name: string;
}

// Client from GET /clients/ (summary view)
export interface ClientSummary {
    id: number;
    full_name: string;
    age: number;
    is_bankrupt: boolean;
    job: Job;
}

// Client from GET /clients/{id} (detail view)
export interface ClientDetail {
    id: number;
    full_name: string;
    age: number;
    is_bankrupt: boolean;
    job: Job;
    education_level: EducationLevel;
    marital_status: MaritalStatus;
}

// Loan type
export interface Loan {
    id: number;
    client_id: number;
    amount: number;
    interest_rate: number;
    is_overdue: boolean;
    overdue_amount: number;
    start_date: string;
    end_date: string;
}

// Deposit type
export interface DepositType {
    id: number;
    name: string;
}

export interface Deposit {
    id: number;
    client_id: number;
    type: DepositType;
    amount: number;
    interest_rate: number;
    final_amount: number;
    start_date: string;
    end_date: string;
}

// Client from GET /clients/{id}/full (full view with loans and deposits)
export interface ClientFull extends ClientDetail {
    loans: Loan[];
    deposits: Deposit[];
}

// ============================================
// CREATE/UPDATE TYPES
// ============================================

export interface ClientCreate {
    full_name: string;
    age: number;
    is_bankrupt: boolean;
    job_id: number;
    education_level_id: number;
    marital_status_id: number;
}

export interface ClientUpdate {
    full_name?: string;
    age?: number;
    is_bankrupt?: boolean;
    job_id?: number;
    education_level_id?: number;
    marital_status_id?: number;
}

export interface LoanCreate {
    client_id: number;
    amount: number;
    interest_rate: number;
    start_date: string;
    end_date: string;
    is_overdue?: boolean;
    overdue_amount?: number;
}

export interface LoanUpdate {
    amount?: number;
    interest_rate?: number;
    start_date?: string;
    end_date?: string;
    is_overdue?: boolean;
    overdue_amount?: number;
}

export interface DepositCreate {
    client_id: number;
    type_id: number;
    amount: number;
    interest_rate: number;
    final_amount: number;
    start_date: string;
    end_date: string;
}

export interface DepositUpdate {
    type_id?: number;
    amount?: number;
    interest_rate?: number;
    final_amount?: number;
    start_date?: string;
    end_date?: string;
}

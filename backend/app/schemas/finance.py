from datetime import date
from typing import Optional
from app.schemas.common import ORMBase
from app.schemas.references import DepositType


# --- Loan ---
class LoanBase(ORMBase):
    amount: float
    interest_rate: float
    start_date: date
    end_date: date
    is_overdue: bool = False
    overdue_amount: float = 0.0


class LoanCreate(LoanBase):
    client_id: int


class LoanUpdate(ORMBase):
    """Schema for updating a loan. All fields are optional."""

    amount: Optional[float] = None
    interest_rate: Optional[float] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_overdue: Optional[bool] = None
    overdue_amount: Optional[float] = None


class Loan(LoanBase):
    id: int
    client_id: int


# --- Deposit ---
class DepositBase(ORMBase):
    amount: float
    interest_rate: float
    start_date: date
    end_date: date
    final_amount: float


class DepositCreate(DepositBase):
    client_id: int
    type_id: int


class DepositUpdate(ORMBase):
    """Schema for updating a deposit. All fields are optional."""

    amount: Optional[float] = None
    interest_rate: Optional[float] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    final_amount: Optional[float] = None
    type_id: Optional[int] = None


class Deposit(DepositBase):
    id: int
    client_id: int
    type: Optional[DepositType] = None  # Nested response for viewing details

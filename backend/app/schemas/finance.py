from datetime import date
from typing import Optional
from pydantic import Field
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


class Deposit(DepositBase):
    id: int
    client_id: int
    type: Optional[DepositType] = None  # Nested response for viewing details

from typing import Optional, List
from pydantic import Field
from app.schemas.common import ORMBase
from app.schemas.references import Job, EducationLevel, MaritalStatus
from app.schemas.finance import Loan, Deposit


class ClientBase(ORMBase):
    full_name: str = Field(..., min_length=2, max_length=256)
    age: int = Field(..., ge=0, le=150)
    is_bankrupt: bool = False
    job_id: Optional[int] = None
    education_level_id: Optional[int] = None
    marital_status_id: Optional[int] = None


class ClientCreate(ClientBase):
    pass


class ClientUpdate(ClientBase):
    full_name: Optional[str] = Field(None, min_length=2, max_length=256)
    age: Optional[int] = Field(None, ge=0, le=150)
    # Allow partial updates implies other fields are optional too,
    # but Pydantic partial updates are usually handled by setting fields to None or using PATCH.
    # For simplicity, we assume full updates or explicit fields.


# --- Read Models ---


class ClientSummary(ClientBase):
    """
    Lightweight model for lists (e.g. GET /clients).
    No nested relations to avoid N+1 queries.
    """

    id: int


class ClientDetail(ClientSummary):
    """
    Detailed model for single client view (e.g. GET /clients/{id}).
    Includes dictionary relations (Job, Education, etc.).
    """

    job: Optional[Job] = None
    education_level: Optional[EducationLevel] = None
    marital_status: Optional[MaritalStatus] = None


class ClientFull(ClientDetail):
    """
    Full dossier model.
    Includes heavy data like transaction history (Loans, Deposits).
    """

    loans: List[Loan] = []
    deposits: List[Deposit] = []

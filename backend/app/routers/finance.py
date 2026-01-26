from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.finance import (
    Loan,
    LoanCreate,
    LoanUpdate,
    Deposit,
    DepositCreate,
    DepositUpdate,
)
from app.crud import finance as crud_finance

router = APIRouter(prefix="/finance", tags=["Finance"])


# ============================================================================
# LOANS
# ============================================================================


@router.post("/loans", response_model=Loan, status_code=status.HTTP_201_CREATED)
async def create_loan(loan_in: LoanCreate, db: AsyncSession = Depends(get_db)):
    """
    Issue a new loan for a client.
    """
    return await crud_finance.create_loan(db, loan_in)


@router.put("/loans/{loan_id}", response_model=Loan)
async def update_loan(
    loan_id: int,
    loan_in: LoanUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    Update an existing loan.
    Only provided fields will be updated.
    """
    db_loan = await crud_finance.update_loan(db, loan_id, loan_in)
    if db_loan is None:
        raise HTTPException(status_code=404, detail="Loan not found")
    return db_loan


@router.delete("/loans/{loan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_loan(
    loan_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a loan.
    """
    deleted = await crud_finance.delete_loan(db, loan_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Loan not found")
    return None


# ============================================================================
# DEPOSITS
# ============================================================================


@router.post("/deposits", response_model=Deposit, status_code=status.HTTP_201_CREATED)
async def create_deposit(deposit_in: DepositCreate, db: AsyncSession = Depends(get_db)):
    """
    Open a new deposit for a client.
    """
    return await crud_finance.create_deposit(db, deposit_in)


@router.put("/deposits/{deposit_id}", response_model=Deposit)
async def update_deposit(
    deposit_id: int,
    deposit_in: DepositUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    Update an existing deposit.
    Only provided fields will be updated.
    """
    db_deposit = await crud_finance.update_deposit(db, deposit_id, deposit_in)
    if db_deposit is None:
        raise HTTPException(status_code=404, detail="Deposit not found")
    return db_deposit


@router.delete("/deposits/{deposit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_deposit(
    deposit_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a deposit.
    """
    deleted = await crud_finance.delete_deposit(db, deposit_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Deposit not found")
    return None

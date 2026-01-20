from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.references import Job, EducationLevel, MaritalStatus, DepositType
from app.crud import references as crud_ref

router = APIRouter(prefix="/references", tags=["References"])

@router.get("/jobs", response_model=List[Job])
async def read_jobs(db: AsyncSession = Depends(get_db)):
    return await crud_ref.get_jobs(db)

@router.get("/education-levels", response_model=List[EducationLevel])
async def read_education_levels(db: AsyncSession = Depends(get_db)):
    return await crud_ref.get_education_levels(db)

@router.get("/marital-statuses", response_model=List[MaritalStatus])
async def read_marital_statuses(db: AsyncSession = Depends(get_db)):
    return await crud_ref.get_marital_statuses(db)

@router.get("/deposit-types", response_model=List[DepositType])
async def read_deposit_types(db: AsyncSession = Depends(get_db)):
    return await crud_ref.get_deposit_types(db)

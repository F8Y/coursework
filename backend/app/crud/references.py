from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Sequence, Type, TypeVar

from app.db.models.job import Job
from app.db.models.education import EducationLevel
from app.db.models.marital_status import MaritalStatus
from app.db.models.deposit_type import DepositType

# Generic approach for simple dictionaries could be used, but explicit is better for clarity here.

async def get_jobs(db: AsyncSession) -> Sequence[Job]:
    result = await db.execute(select(Job).order_by(Job.id))
    return result.scalars().all()

async def get_education_levels(db: AsyncSession) -> Sequence[EducationLevel]:
    result = await db.execute(select(EducationLevel).order_by(EducationLevel.id))
    return result.scalars().all()

async def get_marital_statuses(db: AsyncSession) -> Sequence[MaritalStatus]:
    result = await db.execute(select(MaritalStatus).order_by(MaritalStatus.id))
    return result.scalars().all()

async def get_deposit_types(db: AsyncSession) -> Sequence[DepositType]:
    result = await db.execute(select(DepositType).order_by(DepositType.id))
    return result.scalars().all()

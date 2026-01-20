from pydantic import BaseModel
from typing import Optional
from app.schemas.common import ORMBase


# --- Education Level ---
class EducationLevelBase(ORMBase):
    name: str


class EducationLevel(EducationLevelBase):
    id: int


# --- Marital Status ---
class MaritalStatusBase(ORMBase):
    name: str


class MaritalStatus(MaritalStatusBase):
    id: int


# --- Deposit Type ---
class DepositTypeBase(ORMBase):
    name: str


class DepositType(DepositTypeBase):
    id: int


# --- Job ---
class JobBase(ORMBase):
    name: str
    salary: int


class Job(JobBase):
    id: int

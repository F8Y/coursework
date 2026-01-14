from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Client(Base):
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(256), nullable=False)
    age: Mapped[int] = mapped_column(nullable=False)
    is_bankrupt: Mapped[bool] = mapped_column(nullable=False, default=False)
    job_id: Mapped[int | None] = mapped_column(ForeignKey("jobs.id"))
    education_level_id: Mapped[int | None] = mapped_column(
        ForeignKey("education_levels.id")
    )
    marital_status_id: Mapped[int | None] = mapped_column(
        ForeignKey("marital_statuses.id")
    )

    loans: Mapped[list["Loan"]] = relationship(back_populates="client")
    deposits: Mapped[list["Deposit"]] = relationship(back_populates="client")
    job: Mapped["Job"] = relationship(back_populates="clients")
    education_level: Mapped["EducationLevel"] = relationship(back_populates="clients")
    marital_status: Mapped["MaritalStatus"] = relationship(back_populates="clients")

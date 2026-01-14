from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, mapped_column, Mapped
from datetime import date

from app.db.database import Base


class Loan(Base):
    __tablename__ = "loans"

    id: Mapped[int] = mapped_column(primary_key=True)

    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
    )

    amount: Mapped[float] = mapped_column(nullable=False)
    interest_rate: Mapped[float] = mapped_column(nullable=False)
    is_overdue: Mapped[bool] = mapped_column(default=False, nullable=False)
    overdue_amount: Mapped[float] = mapped_column(default=0.0)

    start_date: Mapped[date] = mapped_column(nullable=False)
    end_date: Mapped[date] = mapped_column(nullable=False)

    client: Mapped["Client"] = relationship(back_populates="loans")

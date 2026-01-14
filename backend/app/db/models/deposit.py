from datetime import date
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Deposit(Base):
    __tablename__ = "deposits"

    id: Mapped[int] = mapped_column(primary_key=True)

    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
    )

    type_id: Mapped[int] = mapped_column(
        ForeignKey("deposit_types.id"),
        nullable=False,
    )

    amount: Mapped[float] = mapped_column(nullable=False)
    interest_rate: Mapped[float] = mapped_column(nullable=False)

    start_date: Mapped[date] = mapped_column(nullable=False)
    end_date: Mapped[date] = mapped_column(nullable=False)

    final_amount: Mapped[float] = mapped_column(nullable=False)

    client = relationship("Client", back_populates="deposits")
    type = relationship("DepositType", back_populates="deposits")

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base


class MaritalStatus(Base):
    __tablename__ = "marital_statuses"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    clients: Mapped[list["Client"]] = relationship(
        "Client", back_populates="marital_status"
    )

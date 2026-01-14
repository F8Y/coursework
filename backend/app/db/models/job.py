from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    salary: Mapped[int] = mapped_column(nullable=False)

    clients: Mapped[list["Client"]] = relationship("Client", back_populates="job")

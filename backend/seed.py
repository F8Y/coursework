# Seed database with faker data

import random
from datetime import date, timedelta

from faker import Faker

from app.db.database import SessionLocal
from app.db.models import (
    Client,
    Deposit,
    DepositType,
    EducationLevel,
    Job,
    Loan,
    MaritalStatus,
)

fake = Faker("ru_RU")

# Справочные таблицы

JOBS_DATA = [
    {"name": "Программист", "salary": 150000},
    {"name": "Менеджер", "salary": 80000},
    {"name": "Бухгалтер", "salary": 70000},
    {"name": "Врач", "salary": 100000},
    {"name": "Инженер", "salary": 90000},
    {"name": "Учитель", "salary": 50000},
    {"name": "Юрист", "salary": 120000},
    {"name": "Дизайнер", "salary": 85000},
]

EDUCATION_LEVELS_DATA = [
    "Среднее",
    "Среднее специальное",
    "Неоконченное высшее",
    "Бакалавр",
    "Магистр",
]

MARITAL_STATUSES_DATA = [
    "Холост/Не замужем",
    "Женат/Замужем",
    "Разведён/Разведена",
    "Вдовец/Вдова",
]

DEPOSIT_TYPES_DATA = [
    "Накопительный",
    "Срочный",
    "До востребования",
    "Пенсионный",
]

# Проверка, что данные существуют


def is_database_seeded(db) -> bool:
    count = db.query(Client).count()
    return count > 0


# Функции заполнения


def seed_jobs(db) -> list[Job]:
    jobs = [Job(name=j["name"], salary=j["salary"]) for j in JOBS_DATA]
    db.add_all(jobs)
    db.flush()
    return jobs


# Education level
def seed_education_levels(db) -> list[EducationLevel]:
    levels = [EducationLevel(name=name) for name in EDUCATION_LEVELS_DATA]
    db.add_all(levels)
    db.flush()
    return levels


# Marital status
def seed_marital_statuses(db) -> list[MaritalStatus]:
    statuses = [MaritalStatus(name=name) for name in MARITAL_STATUSES_DATA]
    db.add_all(statuses)
    db.flush()
    return statuses


# Deposit types
def seed_deposit_types(db) -> list[DepositType]:
    types = [DepositType(name=name) for name in DEPOSIT_TYPES_DATA]
    db.add_all(types)
    db.flush()
    return types


# Clients
def seed_clients(
    db,
    jobs: list[Job],
    education_levels: list[EducationLevel],
    marital_statuses: list[MaritalStatus],
    count: int = 100,
) -> list[Client]:
    clients = []
    for _ in range(count):
        client = Client(
            full_name=fake.name(),
            age=random.randint(21, 70),
            is_bankrupt=random.random() < 0.05,  # 5% банкротов
            job_id=random.choice(jobs).id,
            education_level_id=random.choice(education_levels).id,
            marital_status_id=random.choice(marital_statuses).id,
        )
        clients.append(client)
    db.add_all(clients)
    db.flush()
    return clients


# Loans
def seed_loans(
    db, clients: list[Client], min_per_client: int = 0, max_per_client: int = 3
):
    loans = []
    for client in clients:
        num_loans = random.randint(min_per_client, max_per_client)
        for _ in range(num_loans):
            start = fake.date_between(start_date="-2y", end_date="today")
            end = start + timedelta(days=random.randint(180, 1825))  # 6 мес - 5 лет
            amount = round(random.uniform(50000, 5000000), 2)
            is_overdue = random.random() < 0.15  # 15% просроченных

            loan = Loan(
                client_id=client.id,
                amount=amount,
                interest_rate=round(random.uniform(8.0, 25.0), 2),
                is_overdue=is_overdue,
                overdue_amount=round(amount * random.uniform(0.01, 0.2), 2)
                if is_overdue
                else 0.0,
                start_date=start,
                end_date=end,
            )
            loans.append(loan)
    db.add_all(loans)
    db.flush()
    return loans


# Deposits
def seed_deposits(
    db,
    clients: list[Client],
    deposit_types: list[DepositType],
    min_per_client: int = 0,
    max_per_client: int = 2,
):
    deposits = []
    for client in clients:
        num_deposits = random.randint(min_per_client, max_per_client)
        for _ in range(num_deposits):
            start = fake.date_between(start_date="-3y", end_date="today")
            end = start + timedelta(days=random.randint(90, 1095))  # 3 мес - 3 года
            amount = round(random.uniform(10000, 2000000), 2)
            interest_rate = round(random.uniform(4.0, 12.0), 2)

            # Расчёт итоговой суммы с процентами
            days = (end - start).days
            years = days / 365
            final_amount = round(amount * (1 + interest_rate / 100 * years), 2)

            deposit = Deposit(
                client_id=client.id,
                type_id=random.choice(deposit_types).id,
                amount=amount,
                interest_rate=interest_rate,
                start_date=start,
                end_date=end,
                final_amount=final_amount,
            )
            deposits.append(deposit)
    db.add_all(deposits)
    db.flush()
    return deposits


# Main function
def seed_database():
    db = SessionLocal()
    try:
        if is_database_seeded(db):
            print("✅ Database already seeded, skipping...")
            return

        print("🌱 Starting database seeding...")

        # Этап 1: Справочники
        jobs = seed_jobs(db)
        education_levels = seed_education_levels(db)
        marital_statuses = seed_marital_statuses(db)
        deposit_types = seed_deposit_types(db)

        # Этап 2: Клиенты
        clients = seed_clients(db, jobs, education_levels, marital_statuses, count=100)

        # Этап 3: Финансовые операции
        loans = seed_loans(db, clients)
        deposits = seed_deposits(db, clients, deposit_types)

        db.commit()

        # Статистика
        print("✅ Database seeded successfully!")
        print("📊 Seeding Statistics:")
        print(f"   - Jobs: {len(jobs)}")
        print(f"   - Education Levels: {len(education_levels)}")
        print(f"   - Marital Statuses: {len(marital_statuses)}")
        print(f"   - Deposit Types: {len(deposit_types)}")
        print(f"   - Clients: {len(clients)}")
        print(f"   - Loans: {len(loans)}")
        print(f"   - Deposits: {len(deposits)}")

    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

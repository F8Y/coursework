# Coursework

Coursework with monorepo structure. 

Project is posted on GitHub.

Stack: React + Vite + FastAPI + PostgreSQL + Docker

## Description

- **Frontend:** React + Vite
- **Backend:** FastAPI
- **Database:** PostgreSQL
- **Containerization:** Docker
- **Repo Structure:**
  - `/frontend` - frontend application
  - `/backend` - backend application
  - `/docker-compose.yml` - docker configuration

## Requirements

- Node.js 18+
- Python 3.12+
- Docker and Docker compose
- PostgreSQL (installing through Docker)

## Installation

1. Clone the repository:
   - git clone
   - cd coursework

2. Install dependencies:
   - cd backend
   - pip install -r requirements.txt
   - be sure that venv is actually activated (must be "(.venv)")
   - cd ..
   - cd frontend
   - npm install

3. Run the application:
   - cd backend
   - uvicorn main:app --reload
   - cd ..
   - cd frontend
   - npm run dev

## Docs

API docs are availiable at `http://localhost:8000/docs`
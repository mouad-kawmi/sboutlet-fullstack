# SB Outlet Fullstack

SB Outlet is a fullstack e-commerce project built with a React frontend and a Laravel backend API.

## Repository Structure

- `sboutlet/`: React client application
- `backend/`: Laravel API and business logic

## Tech Stack

- Frontend: React, React Router, Axios
- Backend: Laravel 10, Sanctum
- Database: MySQL by default, SQLite supported for local setup

## Prerequisites

- Node.js 18+
- PHP 8.1+
- Composer
- One database option:
  - MySQL for a production-like setup
  - SQLite for a quick local setup

## Quick Start

### 1. Backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
```

If you want the easiest local setup, switch the database in `.env` to SQLite:

```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

Then create the database file and run migrations:

```bash
type nul > database\database.sqlite
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

The backend will be available at `http://127.0.0.1:8000`.

### 2. Frontend

```bash
cd sboutlet
copy .env.example .env
npm install
npm start
```

The frontend will be available at `http://localhost:3000`.

## Environment Files

- Backend example: `backend/.env.example`
- Frontend example: `sboutlet/.env.example`

Never commit real `.env` files, secrets, production tokens, or database dumps.

## Default Seeded Admin

The seeders create a default admin account for local development:

- Email: `admin@sboutlet.ma`
- Password: `admin123`

Change this password immediately in any shared or deployed environment.

## Security Notes

- `.env` files are ignored and should stay local only
- Rotate any key or password if it was ever shared outside your machine
- Review `SECURITY.md` before publishing or deploying

## GitHub Workflow

```bash
git checkout -b feature/short-description
git add .
git commit -m "Describe the change"
git push origin feature/short-description
```

For a direct publish on the main branch:

```bash
git add .
git commit -m "Prepare repository for GitHub"
git push origin master
```

## License

This project is licensed under the MIT License. See `LICENSE`.

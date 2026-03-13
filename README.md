# SB Outlet - E-commerce Project

Broad overview of the SB Outlet project. This repository contains both the frontend (React) and the backend (Laravel).

## 📁 Project Structure

- `sboutlet/`: Frontend application built with React.
- `backendSboutlet/sboutletbackend/`: Backend API built with Laravel.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PHP** (v8.1 or higher)
- **Composer**
- **MySQL**

### 1. Backend Setup (Laravel)

1. Navigate to the backend directory:
   ```bash
   cd backendSboutlet/sboutletbackend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Setup environment variables:
   ```bash
   cp .env.example .env
   # Update DB_DATABASE, DB_USERNAME, DB_PASSWORD in .env
   ```
4. Generate application key:
   ```bash
   php artisan key:generate
   ```
5. Run migrations:
   ```bash
   php artisan migrate
   ```
6. Start the backend server:
   ```bash
   php artisan serve
   ```

### 2. Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd sboutlet
   ```
2. Install NPM dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## 🛠️ Tech Stack

- **Frontend**: React, Axios, React Router.
- **Backend**: Laravel, MySQL, Sanctum (for Auth).

## 👥 Team Collaboration

To contribute to this project:
1. Clone the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m "Add some feature"`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

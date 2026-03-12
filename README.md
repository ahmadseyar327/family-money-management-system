# Family Money Management System

A complete web application for families to track income, expenses, and financial health.

## Features
- **Dashboard**: Financial summary cards and interactive charts (Pie, Bar, Line).
- **Family Management**: Add, edit, and delete family members.
- **Income Tracking**: Log sources of income per family member.
- **Expense Tracking**: Detailed spending records with category and member filtering.
- **Analytics**: Real-time calculation of balances and spending trends.

## Tech Stack
- **Frontend**: React, Vite, Recharts, Lucide React, Axios, React Router.
- **Backend**: Node.js, Express.js, PostgreSQL (pg).
- **Styling**: Vanilla CSS (Modern dashboard aesthetics).

## Prerequisites
- Node.js (v16+)
- PostgreSQL installed and running.

## Setup Instructions

### 1. Database Setup
1. Create a database named `money_management` in PostgreSQL.
2. Run the SQL commands in `schema.sql` to create the tables and indexes.

### 2. Backend Setup
1. Open a terminal in the `backend` directory.
2. Update the `.env` file with your PostgreSQL credentials:
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=money_management
   DB_PASSWORD=your_password
   DB_PORT=5432
   PORT=5000
   ```
3. Run the following command to start the API:
   ```bash
   node index.js
   ```

### 3. Frontend Setup
1. Open a terminal in the `frontend` directory.
2. Run the following command to start the development server:
   ```bash
   npm run dev
   ```

## Development Troubleshooting
If you encounter permission errors (EPERM) when running through automated tools, please open a fresh terminal (PowerShell or CMD) and run the commands manually in their respective directories.

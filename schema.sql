-- ===============================
-- DROP EXISTING TABLES (if any)
-- ===============================
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS income;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS users;

-- ===============================
-- CREATE USERS TABLE
-- ===============================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- CREATE MEMBERS TABLE
-- ===============================
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- CREATE INCOME TABLE
-- ===============================
CREATE TABLE income (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(12, 2) NOT NULL,
    source VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    added_by_member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- CREATE EXPENSES TABLE
-- ===============================
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(12, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    spent_by_member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- INDEXES FOR PERFORMANCE
-- ===============================
CREATE INDEX idx_income_member ON income(added_by_member_id);
CREATE INDEX idx_income_date ON income(date);
CREATE INDEX idx_income_user_date ON income(user_id, date);

CREATE INDEX idx_expenses_member ON expenses(spent_by_member_id);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, date);

-- ===============================
-- SAMPLE DATA (Optional)
-- ===============================
-- Note: In a real environment, users register via the frontend.
-- This is just for demonstration or initial database seeding.

-- Insert a sample user
INSERT INTO users (email, password_hash) 
VALUES ('ahmad@example.com', '$2b$10$YourHashedPasswordHere'); -- Use a real bcrypt hash in production

-- Insert sample members linked to the user (user_id = 1)
INSERT INTO members (name, role, user_id) VALUES ('Ahmad', 'Father', 1);
INSERT INTO members (name, role, user_id) VALUES ('Zahra', 'Mother', 1);
INSERT INTO members (name, role, user_id) VALUES ('Sami', 'Child', 1);

-- Insert sample income linked to members and user
INSERT INTO income (amount, source, description, date, added_by_member_id, user_id) 
VALUES (5000, 'Salary', 'Monthly salary', '2026-03-01', 1, 1);

-- Insert sample expenses linked to members and user
INSERT INTO expenses (amount, category, description, date, spent_by_member_id, user_id) 
VALUES (200, 'Groceries', 'Weekly groceries', '2026-03-02', 2, 1);

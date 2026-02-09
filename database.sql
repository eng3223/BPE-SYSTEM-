-- BPESE Inventory System Database Schema
-- PostgreSQL Database

-- Create Components Table
CREATE TABLE IF NOT EXISTS components (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    value VARCHAR(50),
    size VARCHAR(50),
    voltage VARCHAR(50),
    watt VARCHAR(50),
    type VARCHAR(100),
    partNo VARCHAR(100) NOT NULL,
    rack VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    minStock INTEGER DEFAULT 10,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    date VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    componentName TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    "user" VARCHAR(100) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Borrowed Components Table
CREATE TABLE IF NOT EXISTS borrowed_components (
    id SERIAL PRIMARY KEY,
    componentId INTEGER NOT NULL,
    componentName TEXT NOT NULL,
    partNo VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    borrowedQty INTEGER NOT NULL,
    returnedQty INTEGER DEFAULT 0,
    consumedQty INTEGER DEFAULT 0,
    scrappedQty INTEGER DEFAULT 0,
    "user" VARCHAR(100) NOT NULL,
    date VARCHAR(100) NOT NULL,
    purpose TEXT,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Users
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'admin'),
('user', 'user123', 'user')
ON CONFLICT (username) DO NOTHING;

-- Insert Sample Components
INSERT INTO components (category, description, value, size, voltage, watt, type, partNo, rack, location, quantity, minStock, image) VALUES
('AMPLIFIER', 'PRECISION OP AMP', 'None', 'None', 'None', 'None', 'None', 'OP27F', 'A', 'A88 / A1', 100, 20, 'https://via.placeholder.com/200x200?text=OP27F'),
('AMPLIFIER', 'OP AMP JFET INPUT', 'None', 'None', 'None', 'None', 'None', '926-LF356M/NOPB', 'A', 'B4 / B1', 99, 20, 'https://via.placeholder.com/200x200?text=LF356M'),
('BUZZER', 'BUZZER', 'None', 'None', 'None', 'None', 'None', 'BUZZER', 'A', 'A110 / C1', 5, 2, 'https://via.placeholder.com/200x200?text=BUZZER'),
('CAPACITOR', 'CAP ALUM 4700uF 20% 50V TH', '470uF', '-', '50V', '-', 'Radial / TH', 'UVR1H471MHD1TO', 'A', 'B2 / D1', 0, 5, 'https://via.placeholder.com/200x200?text=CAP+470uF'),
('CAPACITOR', 'CAP ALUM 150UF 20% 50V TH', '150uF', '-', '50V', '-', 'Radial / TH', 'EEU-FS1H151L', 'A', 'B63 / E1', 2, 5, 'https://via.placeholder.com/200x200?text=CAP+150uF'),
('CAPACITOR', 'CAP ALUM POLY 150uF 20% 16V TH', '150uF', '-', '16V', '-', 'Radial / TH', 'RR71C151MDN1', 'A', 'B26 / A2', 4, 5, 'https://via.placeholder.com/200x200?text=CAP+150uF'),
('CAPACITOR', 'CAP ALUM 47uF, 100V, 20%, TH', '47uF', '-', '100V', '-', 'Radial / TH', 'MCKSK100M470G17S', 'A', 'B58 / B2', 2, 5, 'https://via.placeholder.com/200x200?text=CAP+47uF'),
('CAPACITOR', 'CAP ALUM POLY 33uF 20% 16V TH', '33uF', '-', '16V', '-', 'Radial / TH', 'RNS1C330MDS1', 'A', 'B29 / C2', 16, 5, 'https://via.placeholder.com/200x200?text=CAP+33uF'),
('CAPACITOR', 'CAP TANT 100uF 20% 6.3V 1206', '10uF', '1206.0', '6.3V', '-', 'SMD', 'T491A106M006AT', 'A', 'B34 / D2', 4, 5, 'https://via.placeholder.com/200x200?text=CAP+10uF'),
('CAPACITOR', 'CAP 2.2uF 20% 50V TH', '2.2uF', '-', '50V', '-', 'Radial / TH', 'MCGPR50V225M5X11', 'A', 'A50 / E2', 1, 5, 'https://via.placeholder.com/200x200?text=CAP+2.2uF')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_components_category ON components(category);
CREATE INDEX IF NOT EXISTS idx_components_partNo ON components(partNo);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions("user");
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_borrowed_user ON borrowed_components("user");
CREATE INDEX IF NOT EXISTS idx_borrowed_componentId ON borrowed_components(componentId);

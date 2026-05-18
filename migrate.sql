USE ggweb;

-- ── Add 'role' to users if missing ──────────────────────────────────────────
SET @col = (SELECT COUNT(*) FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = 'ggweb' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role');
SET @sql = IF(@col = 0,
    'ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT ''student''',
    'SELECT ''role column already exists'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── Add 'approval_status' to applications if missing ────────────────────────
SET @col = (SELECT COUNT(*) FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = 'ggweb' AND TABLE_NAME = 'applications' AND COLUMN_NAME = 'approval_status');
SET @sql = IF(@col = 0,
    'ALTER TABLE applications ADD COLUMN approval_status VARCHAR(20) DEFAULT ''pending''',
    'SELECT ''approval_status column already exists'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── Add 'is_read' to contact_messages if missing ────────────────────────────
SET @col = (SELECT COUNT(*) FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = 'ggweb' AND TABLE_NAME = 'contact_messages' AND COLUMN_NAME = 'is_read');
SET @sql = IF(@col = 0,
    'ALTER TABLE contact_messages ADD COLUMN is_read TINYINT(1) DEFAULT 0',
    'SELECT ''is_read column already exists'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── Add 'created_at' to contact_messages if missing ─────────────────────────
SET @col = (SELECT COUNT(*) FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = 'ggweb' AND TABLE_NAME = 'contact_messages' AND COLUMN_NAME = 'created_at');
SET @sql = IF(@col = 0,
    'ALTER TABLE contact_messages ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'SELECT ''created_at column already exists'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── Set your admin account role ──────────────────────────────────────────────
-- IMPORTANT: Replace the email below with your actual admin email
UPDATE users SET role = 'admin' WHERE email = 'admin@greatgaining.in';

-- Set all users with NULL role to 'student'
UPDATE users SET role = 'student' WHERE role IS NULL;

-- ── Verify ───────────────────────────────────────────────────────────────────
SELECT id, full_name, email, role FROM users ORDER BY id;

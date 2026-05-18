use ggweb;

-- TABLE 1: Users
CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    full_name  VARCHAR(100) NOT NULL,
    email      VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(20)  DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 2: Applications
CREATE TABLE IF NOT EXISTS applications (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT,
    course_name     VARCHAR(100) NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(10)  NOT NULL,
    status          VARCHAR(50)  NOT NULL,
    qualification   VARCHAR(100) NOT NULL,
    approval_status VARCHAR(20)  DEFAULT 'pending',
    submitted_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- TABLE 3: Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(100) NOT NULL,
    phone           VARCHAR(10),
    course_interest VARCHAR(100),
    message         TEXT NOT NULL,
    is_read         TINYINT(1) DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 4: Course Progress
CREATE TABLE IF NOT EXISTS course_progress (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL,
    course_name  VARCHAR(100) NOT NULL,
    module_index INT NOT NULL,
    completed    TINYINT(1) DEFAULT 0,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_progress (user_id, course_name, module_index),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TABLE 5: Password OTPs
CREATE TABLE IF NOT EXISTS password_otps (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(255) NOT NULL,
    otp        VARCHAR(6)   NOT NULL,
    expires_at DATETIME     NOT NULL,
    used       TINYINT(1)   DEFAULT 0
);

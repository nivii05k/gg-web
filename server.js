require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});
transporter.verify((error) => {
  if (error) console.log("Mail config error:", error.message);
  else console.log("Mail server ready");
});

function sendWelcomeMail(toEmail, name) {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    body{margin:0;padding:0;background:#f3eeff;font-family:'Segoe UI',Arial,sans-serif;}
    .wrap{max-width:580px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(26,26,46,0.10);}
    .header{background:linear-gradient(135deg,#1a1a2e 0%,#2d2d5e 100%);padding:36px 40px;text-align:center;}
    .header h1{margin:0;font-size:1.4rem;color:#b39ddb;font-weight:700;letter-spacing:0.04em;}
    .header p{margin:6px 0 0;font-size:0.78rem;color:rgba(255,255,255,0.4);letter-spacing:0.1em;text-transform:uppercase;}
    .body{padding:40px;}
    .greeting{font-size:1.2rem;font-weight:700;color:#1a1a2e;margin-bottom:12px;}
    .text{font-size:0.93rem;color:#555;line-height:1.8;margin-bottom:16px;}
    .highlight{background:#f3eeff;border-left:4px solid #7c4daa;border-radius:0 8px 8px 0;padding:14px 20px;margin:24px 0;font-size:0.9rem;color:#1a1a2e;font-weight:600;}
    .features{width:100%;border-collapse:collapse;margin:24px 0;}
    .features td{width:33%;text-align:center;padding:16px 8px;background:#faf7ff;border-radius:10px;}
    .feat-icon{font-size:1.4rem;display:block;margin-bottom:6px;}
    .feat-text{font-size:0.75rem;color:#7c4daa;font-weight:600;}
    .btn-wrap{text-align:center;margin:32px 0 24px;}
    .btn{display:inline-block;padding:13px 36px;background:linear-gradient(135deg,#7c4daa,#5a2d8a);color:#fff;text-decoration:none;border-radius:10px;font-size:0.92rem;font-weight:600;}
    .divider{border:none;border-top:1px solid #f0ebfa;margin:24px 0;}
    .footer{background:#f8f4ff;padding:22px 40px;text-align:center;border-top:1px solid #ede7f6;}
    .footer p{margin:0;font-size:0.76rem;color:#9e9e9e;line-height:1.8;}
    .footer a{color:#7c4daa;text-decoration:none;font-weight:600;}
  </style></head><body>
  <div class="wrap">
    <div class="header">
      <h1>Great Gaining Institution</h1>
      <p>Chennai, Tamil Nadu</p>
    </div>
    <div class="body">
      <div class="greeting">Welcome aboard, ${name}!</div>
      <p class="text">We are delighted to welcome you to <strong style="color:#1a1a2e;">Great Gaining Institution</strong>.<br>
      Your account has been successfully created and is ready to use.<br>
      We are committed to providing you with a world-class learning experience.<br>
      Explore our wide range of professional courses designed for your growth.<br>
      Apply for a course today and take the first step towards your bright future.<br>
      We look forward to being a part of your success journey.</p>
      <div class="highlight">Your account is ready &mdash; Login to explore our courses and apply today.</div>
      <p class="text">Here is what you can do next:</p>
      <table class="features" cellpadding="8" cellspacing="8">
        <tr>
          <td><span class="feat-icon">&#128218;</span><span class="feat-text">Browse Courses</span></td>
          <td><span class="feat-icon">&#128196;</span><span class="feat-text">Apply for a Course</span></td>
          <td><span class="feat-icon">&#127891;</span><span class="feat-text">Earn Certificate</span></td>
        </tr>
      </table>
      <div class="btn-wrap"><a href="http://localhost:3000/login.html" class="btn">Login to Your Account &rarr;</a></div>
      <hr class="divider">
      <p class="text" style="font-size:0.83rem;color:#999;">If you did not create this account, please ignore this email or contact us at <a href="mailto:info@greatgaining.in" style="color:#7c4daa;">info@greatgaining.in</a></p>
    </div>
    <div class="footer">
      <p><strong style="color:#1a1a2e;">Great Gaining Institution</strong><br>
      Chennai, Tamil Nadu &mdash; 600001<br>
      <a href="tel:+918838875601">+91 88388 75601</a> &nbsp;|&nbsp; <a href="mailto:info@greatgaining.in">info@greatgaining.in</a></p>
      <p style="margin-top:8px;font-size:0.7rem;color:#bbb;">&copy; 2025 Great Gaining Institution. All rights reserved.</p>
    </div>
  </div>
  </body></html>`;
  transporter.sendMail({
    from: `"Great Gaining Institution" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "Welcome to Great Gaining Institution - Account Created Successfully",
    html
  }, (error, info) => {
    if (error) console.log("Welcome mail error:", error.message);
    else console.log("Welcome mail sent to", toEmail, "| ID:", info.messageId);
  });
}

function sendApplicationMail(toEmail, name, courseName) {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    body{margin:0;padding:0;background:#f3eeff;font-family:'Segoe UI',Arial,sans-serif;}
    .wrap{max-width:580px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(26,26,46,0.10);}
    .header{background:linear-gradient(135deg,#1a1a2e 0%,#2d2d5e 100%);padding:36px 40px;text-align:center;}
    .header h1{margin:0;font-size:1.4rem;color:#b39ddb;font-weight:700;letter-spacing:0.04em;}
    .header p{margin:6px 0 0;font-size:0.78rem;color:rgba(255,255,255,0.4);letter-spacing:0.1em;text-transform:uppercase;}
    .body{padding:40px;}
    .greeting{font-size:1.2rem;font-weight:700;color:#1a1a2e;margin-bottom:12px;}
    .text{font-size:0.93rem;color:#555;line-height:1.8;margin-bottom:16px;}
    .course-box{background:linear-gradient(135deg,#f3eeff,#ede7f6);border:1.5px solid #b39ddb;border-radius:12px;padding:22px 28px;margin:24px 0;text-align:center;}
    .course-label{font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#7c4daa;margin-bottom:8px;}
    .course-name{font-size:1.25rem;font-weight:700;color:#1a1a2e;}
    .steps{width:100%;border-collapse:collapse;margin:20px 0;}
    .step-num{width:28px;height:28px;border-radius:50%;background:#7c4daa;color:#fff;font-size:0.78rem;font-weight:700;text-align:center;vertical-align:middle;}
    .step-text{padding-left:14px;font-size:0.88rem;color:#444;line-height:1.6;vertical-align:middle;}
    .btn-wrap{text-align:center;margin:32px 0 24px;}
    .btn{display:inline-block;padding:13px 36px;background:linear-gradient(135deg,#7c4daa,#5a2d8a);color:#fff;text-decoration:none;border-radius:10px;font-size:0.92rem;font-weight:600;}
    .divider{border:none;border-top:1px solid #f0ebfa;margin:24px 0;}
    .footer{background:#f8f4ff;padding:22px 40px;text-align:center;border-top:1px solid #ede7f6;}
    .footer p{margin:0;font-size:0.76rem;color:#9e9e9e;line-height:1.8;}
    .footer a{color:#7c4daa;text-decoration:none;font-weight:600;}
  </style></head><body>
  <div class="wrap">
    <div class="header">
      <h1>Great Gaining Institution</h1>
      <p>Application Confirmation</p>
    </div>
    <div class="body">
      <div class="greeting">Hi ${name},</div>
      <p class="text">Thank you for choosing <strong style="color:#1a1a2e;">Great Gaining Institution</strong> for your professional growth.<br>
      We are pleased to confirm that your application has been successfully received.<br>
      Our dedicated admissions team will carefully review your application details.<br>
      You will be contacted within 1&ndash;2 business days regarding the next steps.<br>
      Please keep your registered phone number reachable for our confirmation call.<br>
      We are excited to have you on board and wish you a rewarding learning journey.</p>
      <div class="course-box">
        <div class="course-label">Applied Course</div>
        <div class="course-name">${courseName}</div>
      </div>
      <p class="text"><strong style="color:#1a1a2e;">What happens next?</strong></p>
      <table class="steps" cellpadding="10" cellspacing="0">
        <tr>
          <td class="step-num">1</td>
          <td class="step-text"><strong style="color:#1a1a2e;">Application Review</strong> &mdash; Our team reviews your application within 1&ndash;2 business days.</td>
        </tr>
        <tr>
          <td class="step-num">2</td>
          <td class="step-text"><strong style="color:#1a1a2e;">Confirmation Call</strong> &mdash; We will contact you on your registered phone number to confirm your seat.</td>
        </tr>
        <tr>
          <td class="step-num">3</td>
          <td class="step-text"><strong style="color:#1a1a2e;">Batch Joining</strong> &mdash; Once confirmed, you will receive your batch schedule and joining details.</td>
        </tr>
      </table>
      <div class="btn-wrap"><a href="http://localhost:3000/dashboard.html" class="btn">View My Dashboard &rarr;</a></div>
      <hr class="divider">
      <p class="text" style="font-size:0.83rem;color:#999;">Have questions? Reach us at <a href="mailto:info@greatgaining.in" style="color:#7c4daa;">info@greatgaining.in</a> or call <a href="tel:+918838875601" style="color:#7c4daa;">+91 88388 75601</a></p>
    </div>
    <div class="footer">
      <p><strong style="color:#1a1a2e;">Great Gaining Institution</strong><br>
      Chennai, Tamil Nadu &mdash; 600001<br>
      <a href="tel:+918838875601">+91 88388 75601</a> &nbsp;|&nbsp; <a href="mailto:info@greatgaining.in">info@greatgaining.in</a></p>
      <p style="margin-top:8px;font-size:0.7rem;color:#bbb;">&copy; 2025 Great Gaining Institution. All rights reserved.</p>
    </div>
  </div>
  </body></html>`;
  transporter.sendMail({
    from: `"Great Gaining Institution" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: `Application Received - ${courseName} | Great Gaining Institution`,
    html
  }, (error, info) => {
    if (error) console.log("Application mail error:", error.message);
    else console.log("Application mail sent to", toEmail, "| ID:", info.messageId);
  });
}
const express = require("express");
const mysql   = require("mysql2/promise");
const bcrypt  = require("bcryptjs");
const cors    = require("cors");
const path    = require("path");

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
const staticPath = path.resolve(__dirname);
app.use(express.static(staticPath));

// ── DB Connection Pool ──────────────────────────────────────────────────────
const db = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Auto-create course_progress table
db.execute(`CREATE TABLE IF NOT EXISTS course_progress (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  course_name  VARCHAR(100) NOT NULL,
  module_index INT NOT NULL,
  completed    TINYINT(1) DEFAULT 0,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_progress (user_id, course_name, module_index),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)`).catch(console.error);

// Auto-add missing columns safely (compatible with all MySQL versions)
async function ensureColumns() {
  const checks = [
    { table: 'users',            col: 'role',            def: "ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'student'" },
    { table: 'applications',     col: 'approval_status', def: "ALTER TABLE applications ADD COLUMN approval_status VARCHAR(20) DEFAULT 'pending'" },
    { table: 'contact_messages', col: 'is_read',         def: 'ALTER TABLE contact_messages ADD COLUMN is_read TINYINT(1) DEFAULT 0' },
    { table: 'contact_messages', col: 'created_at',      def: 'ALTER TABLE contact_messages ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' }
  ];
  for (const c of checks) {
    try {
      const [rows] = await db.execute(
        `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        [c.table, c.col]
      );
      if (rows[0].cnt === 0) {
        await db.execute(c.def);
        console.log(`Added column: ${c.table}.${c.col}`);
      }
    } catch(e) { console.error(`Column check failed (${c.table}.${c.col}):`, e.message); }
  }
}
ensureColumns();

// ── POST /api/signup ────────────────────────────────────────────────────────
app.post("/api/signup", async (req, res) => {
  const { full_name, email, password, role } = req.body;
  if (!full_name || !email || !password)
    return res.status(400).json({ error: "All fields are required." });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'student';
    await db.execute(
      "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
      [full_name, email, hashed, userRole]
    );
    sendWelcomeMail(email, full_name);
    res.json({ message: "Account created successfully." });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "Email already registered." });
    // If role column doesn't exist yet, try without it
    try {
      const hashed2 = await bcrypt.hash(password, 10);
      await db.execute("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)", [full_name, email, hashed2]);
      sendWelcomeMail(email, full_name);
      res.json({ message: "Account created successfully." });
    } catch(e2) {
      if (e2.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Email already registered." });
      res.status(500).json({ error: "Server error." });
    }
  }
});

// ── POST /api/login ─────────────────────────────────────────────────────────
app.post("/api/login", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length)
      return res.status(401).json({ error: "Invalid email or password." });
    const match = await bcrypt.compare(password, rows[0].password);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password." });
    const userRole = (rows[0].role && rows[0].role !== 'undefined') ? rows[0].role : (role || 'student');
    res.json({ message: "Login successful.", user: { id: rows[0].id, full_name: rows[0].full_name, email: rows[0].email, role: userRole } });
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// ── POST /api/apply ─────────────────────────────────────────────────────────
app.post("/api/apply", async (req, res) => {
  const { user_email, course_name, full_name, phone, status, qualification } = req.body;
  if (!course_name || !full_name || !phone || !status || !qualification)
    return res.status(400).json({ error: "All fields are required." });
  try {
    let user_id = null;
    if (user_email) {
      const [rows] = await db.execute("SELECT id FROM users WHERE email = ?", [user_email]);
      if (rows.length) user_id = rows[0].id;
    }
    // Check duplicate application
    if (user_id) {
      const [existing] = await db.execute(
        "SELECT id FROM applications WHERE user_id = ? AND course_name = ?",
        [user_id, course_name]
      );
      if (existing.length)
        return res.status(409).json({ error: "You have already applied for this course." });
    }

    await db.execute(
      "INSERT INTO applications (user_id, course_name, full_name, phone, status, qualification) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, course_name, full_name, phone, status, qualification]
    );
    // 📧 SEND APPLICATION EMAIL
    const emailTo = user_email || null;
    if (emailTo) sendApplicationMail(emailTo, full_name, course_name);

    res.json({ message: "Application submitted successfully." });
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// ── GET /api/dashboard ──────────────────────────────────────────────────────
app.get("/api/dashboard", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email required." });
  try {
    const [users] = await db.execute(
      "SELECT id, full_name, email, created_at FROM users WHERE email = ?", [email]
    );
    if (!users.length) return res.status(404).json({ error: "User not found." });
    const user = users[0];

    await db.execute(
      "UPDATE applications SET user_id = ? WHERE user_id IS NULL AND full_name = ?",
      [user.id, user.full_name]
    );

    // Get ALL enrollments
    const [apps] = await db.execute(
      "SELECT course_name, submitted_at FROM applications WHERE user_id = ? ORDER BY submitted_at ASC",
      [user.id]
    );

    // Get progress for ALL courses
    const [progressRows] = await db.execute(
      "SELECT course_name, module_index, completed FROM course_progress WHERE user_id = ?",
      [user.id]
    );

    res.json({ user, enrollments: apps, progress: progressRows });
    console.log(`Dashboard: ${user.email} | enrollments: ${apps.length} | progress rows: ${progressRows.length}`);
  } catch (e) {
    console.error("Dashboard error:", e.message);
    res.status(500).json({ error: "Server error.", detail: e.message });
  }
});

// ── GET /api/my-courses ─────────────────────────────────────────────────────
app.get("/api/my-courses", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email required." });
  try {
    const [users] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (!users.length) return res.json({ courses: [] });
    const [apps] = await db.execute(
      "SELECT course_name FROM applications WHERE user_id = ?",
      [users[0].id]
    );
    res.json({ courses: apps.map(a => a.course_name) });
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// ── POST /api/progress ──────────────────────────────────────────────────────
app.post("/api/progress", async (req, res) => {
  const { email, course_name, module_index } = req.body;
  if (!email || !course_name || module_index === undefined)
    return res.status(400).json({ error: "Missing fields." });
  try {
    const [users] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (!users.length) return res.status(404).json({ error: "User not found." });
    const user_id = users[0].id;
    await db.execute(
      "INSERT INTO course_progress (user_id, course_name, module_index, completed) VALUES (?, ?, ?, 1) ON DUPLICATE KEY UPDATE completed = 1",
      [user_id, course_name, module_index]
    );
    res.json({ message: "Progress saved." });
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// ── POST /api/contact ───────────────────────────────────────────────────────
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, course_interest, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "Name, email, and message are required." });
  try {
    await db.execute(
      "INSERT INTO contact_messages (name, email, phone, course_interest, message) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone || null, course_interest || null, message]
    );
    res.json({ message: "Message sent successfully." });
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// ── GET /api/admin/stats ────────────────────────────────────────────────────
app.get("/api/admin/stats", async (req, res) => {
  try {
    const [[{total_students}]] = await db.execute("SELECT COUNT(*) as total_students FROM users");
    const [[{total_apps}]] = await db.execute("SELECT COUNT(*) as total_apps FROM applications");
    const [[{total_msgs}]] = await db.execute("SELECT COUNT(*) as total_msgs FROM contact_messages");
    res.json({ total_students, total_apps, total_msgs });
  } catch { res.status(500).json({ error: "Server error." }); }
});

// ── GET /api/admin/applications ─────────────────────────────────────────────
app.get("/api/admin/applications", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT a.id, a.full_name, a.phone, a.status, a.qualification, a.course_name,
             a.submitted_at, COALESCE(a.approval_status, 'pending') as approval_status,
             COALESCE(u.email, '') as user_email,
             (SELECT COUNT(*) FROM applications a2 WHERE a2.course_name = a.course_name) as enrolled_count
      FROM applications a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.submitted_at DESC
    `);
    res.json(rows);
  } catch(e) {
    console.error('admin/applications error:', e.message);
    res.status(500).json({ error: "Server error." });
  }
});

// ── GET /api/admin/course-enrollments ─────────────────────────────────────
app.get("/api/admin/course-enrollments", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT course_name,
             COUNT(*) as total_enrolled,
             SUM(CASE WHEN COALESCE(approval_status,'pending') = 'approved' THEN 1 ELSE 0 END) as approved,
             SUM(CASE WHEN COALESCE(approval_status,'pending') = 'pending'  THEN 1 ELSE 0 END) as pending,
             SUM(CASE WHEN COALESCE(approval_status,'pending') = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM applications
      GROUP BY course_name
      ORDER BY total_enrolled DESC
    `);
    res.json(rows);
  } catch(e) {
    console.error('course-enrollments error:', e.message);
    res.status(500).json({ error: "Server error." });
  }
});

// ── GET /api/admin/students ──────────────────────────────────────────────────
app.get("/api/admin/students", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, full_name, email, created_at FROM users ORDER BY created_at DESC");
    console.log('admin/students:', rows.length, 'rows');
    res.json(rows);
  } catch(e) {
    console.error('admin/students error:', e.message);
    res.status(500).json({ error: "Server error." });
  }
});

// ── GET /api/admin/messages ──────────────────────────────────────────────────
app.get("/api/admin/messages", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM contact_messages ORDER BY created_at DESC");
    res.json(rows);
  } catch { res.status(500).json({ error: "Server error." }); }
});

// ── POST /api/admin/application-status ──────────────────────────────────────
app.post("/api/admin/application-status", async (req, res) => {
  const { id, status } = req.body;
  if (!id || !status) return res.status(400).json({ error: "Missing fields." });
  try {
    await db.execute("UPDATE applications SET approval_status = ? WHERE id = ?", [status, id]);
    res.json({ message: "Status updated." });
  } catch(e) {
    console.error('application-status error:', e.message);
    res.status(500).json({ error: "Server error." });
  }
});

// ── POST /api/admin/mark-message-read ───────────────────────────────────────
app.post("/api/admin/mark-message-read", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing id." });
  try {
    await db.execute("UPDATE contact_messages SET is_read = 1 WHERE id = ?", [id]);
    res.json({ message: "Marked as read." });
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// ── POST /api/admin/change-password ─────────────────────────────────────────
app.post("/api/admin/change-password", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) return res.status(400).json({ error: "All fields required." });
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(404).json({ error: "User not found." });
    const match = await bcrypt.compare(oldPassword, rows[0].password);
    if (!match) return res.status(401).json({ error: "Current password is incorrect." });
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users SET password = ? WHERE email = ?", [hashed, email]);
    res.json({ message: "Password updated." });
  } catch { res.status(500).json({ error: "Server error." }); }
});

// ── Auto-create OTP table
db.execute(`CREATE TABLE IF NOT EXISTS password_otps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at DATETIME NOT NULL,
  used TINYINT(1) DEFAULT 0
)`).catch(console.error);

// ── POST /api/login-alert ─────────────────────────────────────────────────
app.post("/api/login-alert", async (req, res) => {
  const { email, attempt } = req.body;
  if (!email) return res.status(400).json({ error: "Email required." });
  try {
    // Only send alert if the email exists in our DB
    const [rows] = await db.execute("SELECT full_name FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.json({ message: "ok" }); // don't reveal if email exists
    const name = rows[0].full_name;
    const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
    const isLocked = attempt >= 4;
    const subject = isLocked
      ? '🚨 Security Alert – Account Locked | Great Gaining Institution'
      : `⚠️ Failed Login Attempt (${attempt}/4) | Great Gaining Institution`;
    const html = `<!DOCTYPE html><html><body style="font-family:'Segoe UI',Arial,sans-serif;background:#f3eeff;margin:0;padding:0;">
    <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(26,26,46,0.10);">
      <div style="background:${isLocked ? 'linear-gradient(135deg,#c53030,#e53e3e)' : 'linear-gradient(135deg,#dd6b20,#f6ad55)'};padding:32px 40px;text-align:center;">
        <div style="font-size:2.5rem;margin-bottom:8px;">${isLocked ? '🚨' : '⚠️'}</div>
        <h2 style="margin:0;color:#fff;font-size:1.3rem;">${isLocked ? 'Account Locked!' : 'Failed Login Attempt'}</h2>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:0.85rem;">Great Gaining Institution – Security Alert</p>
      </div>
      <div style="padding:36px 40px;">
        <p style="font-size:1rem;color:#1a1a2e;font-weight:700;margin-bottom:12px;">Hi ${name},</p>
        ${isLocked
          ? `<p style="color:#555;font-size:0.92rem;line-height:1.8;margin-bottom:16px;">Your account has been <strong style="color:#c53030;">temporarily locked</strong> for <strong>5 minutes</strong> due to <strong>4 consecutive failed login attempts</strong>.</p>
             <div style="background:#fff5f5;border:1.5px solid #feb2b2;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
               <p style="margin:0;font-size:0.88rem;color:#c53030;font-weight:600;">🔒 Account locked at: ${time}</p>
               <p style="margin:6px 0 0;font-size:0.85rem;color:#555;">Unlock time: 5 minutes from now</p>
             </div>`
          : `<p style="color:#555;font-size:0.92rem;line-height:1.8;margin-bottom:16px;">We detected a <strong>failed login attempt</strong> on your account. This is attempt <strong>${attempt} of 4</strong>.</p>
             <div style="background:#fffaf0;border:1.5px solid #fbd38d;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
               <p style="margin:0;font-size:0.88rem;color:#dd6b20;font-weight:600;">⏰ Time: ${time}</p>
               <p style="margin:6px 0 0;font-size:0.85rem;color:#555;">After 4 failed attempts, your account will be locked for 5 minutes.</p>
             </div>`
        }
        <p style="color:#555;font-size:0.88rem;line-height:1.7;">If this was <strong>you</strong>, please use the correct password or click <a href="http://localhost:3000/forgot-password.html" style="color:#7c4daa;font-weight:600;">Forgot Password</a> to reset it.</p>
        <p style="color:#555;font-size:0.88rem;line-height:1.7;margin-top:10px;">If this was <strong>NOT you</strong>, your account may be at risk. Please reset your password immediately.</p>
        <div style="text-align:center;margin-top:24px;">
          <a href="http://localhost:3000/forgot-password.html" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#7c4daa,#5a2d8a);color:#fff;text-decoration:none;border-radius:10px;font-size:0.9rem;font-weight:600;">Reset My Password</a>
        </div>
      </div>
      <div style="background:#f8f4ff;padding:20px 40px;text-align:center;border-top:1px solid #ede7f6;">
        <p style="margin:0;font-size:0.75rem;color:#9e9e9e;">Great Gaining Institution &nbsp;|&nbsp; Chennai, Tamil Nadu &nbsp;|&nbsp; info@greatgaining.in</p>
      </div>
    </div></body></html>`;
    transporter.sendMail({
      from: `"Great Gaining Institution" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      html
    }, (err) => { if (err) console.log('Login alert mail error:', err.message); });
    res.json({ message: 'ok' });
  } catch(e) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── POST /api/forgot-password ────────────────────────────────────────────────
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });
  try {
    const [rows] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(404).json({ error: "No account found with this email." });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const expiresStr = expires.toISOString().slice(0, 19).replace('T', ' ');
    await db.execute("DELETE FROM password_otps WHERE email = ?", [email]);
    await db.execute("INSERT INTO password_otps (email, otp, expires_at) VALUES (?, ?, ?)", [email, otp, expiresStr]);
    // Send OTP email
    const html = `<!DOCTYPE html><html><body style="font-family:'Segoe UI',Arial,sans-serif;background:#f3eeff;margin:0;padding:0;">
    <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(26,26,46,0.10);">
      <div style="background:linear-gradient(135deg,#1a1a2e,#2d2d5e);padding:32px 40px;text-align:center;">
        <h2 style="margin:0;color:#b39ddb;font-size:1.3rem;">Great Gaining Institution</h2>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.4);font-size:0.78rem;letter-spacing:0.1em;text-transform:uppercase;">Password Reset</p>
      </div>
      <div style="padding:40px;">
        <p style="font-size:1rem;color:#1a1a2e;font-weight:700;margin-bottom:8px;">Your OTP Code</p>
        <p style="color:#555;font-size:0.9rem;margin-bottom:24px;">Use the code below to reset your password. It expires in <strong>10 minutes</strong>.</p>
        <div style="background:#f3eeff;border:2px dashed #b39ddb;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:2.5rem;font-weight:900;letter-spacing:0.4em;color:#7c4daa;font-family:'Courier New',monospace;">${otp}</span>
        </div>
        <p style="color:#9e9e9e;font-size:0.82rem;">If you did not request this, please ignore this email.</p>
      </div>
      <div style="background:#f8f4ff;padding:20px 40px;text-align:center;border-top:1px solid #ede7f6;">
        <p style="margin:0;font-size:0.75rem;color:#9e9e9e;">Great Gaining Institution &nbsp;|&nbsp; Chennai, Tamil Nadu</p>
      </div>
    </div></body></html>`;
    transporter.sendMail({
      from: `"Great Gaining Institution" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP – Great Gaining Institution",
      html
    }, (err) => { if (err) console.log("OTP mail error:", err.message); });
    res.json({ message: "OTP sent successfully." });
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: "Server error." });
  }
});

// ── POST /api/verify-otp ─────────────────────────────────────────────────────
app.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required." });
  try {
    const [rows] = await db.execute(
      "SELECT * FROM password_otps WHERE email = ? AND otp = ? AND used = 0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1",
      [email, otp]
    );
    if (!rows.length) return res.status(400).json({ error: "Invalid or expired OTP. Please try again." });
    res.json({ message: "OTP verified." });
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// ── POST /api/reset-password ─────────────────────────────────────────────────
app.post("/api/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ error: "All fields required." });
  if (newPassword.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });
  try {
    const [otpRows] = await db.execute(
      "SELECT * FROM password_otps WHERE email = ? AND used = 0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1",
      [email]
    );
    if (!otpRows.length) return res.status(400).json({ error: "OTP session expired. Please start again." });
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users SET password = ? WHERE email = ?", [hashed, email]);
    await db.execute("UPDATE password_otps SET used = 1 WHERE email = ?", [email]);
    res.json({ message: "Password reset successfully." });
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// ── POST /api/google-login ───────────────────────────────────────────────────
app.post("/api/google-login", async (req, res) => {
  const { full_name, email, role } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    const userRole = role === 'admin' ? 'admin' : 'student';
    if (rows.length) {
      // Existing user — just log them in
      const user = rows[0];
      res.json({ message: "Login successful.", user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role || userRole } });
    } else {
      // New user — auto-register with Google
      const randomPass = await bcrypt.hash(Math.random().toString(36), 10);
      await db.execute(
        "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
        [full_name, email, randomPass, userRole]
      ).catch(async () => {
        await db.execute("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)", [full_name, email, randomPass]);
      });
      sendWelcomeMail(email, full_name);
      res.json({ message: "Account created.", user: { full_name, email, role: userRole } });
    }
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: "Server error." });
  }
});

// ── Start Server ─────────────────────────────────────────────────────────────
const { exec } = require("child_process");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  exec(`start chrome http://localhost:${PORT}`, (err) => {
    if (err) exec(`start http://localhost:${PORT}`);
  });
});


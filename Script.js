// ===================== UTILS =====================

function showToast(msg, type) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = "toast show" + (type === "error" ? " toast-error" : "");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove("show"), 3000);
}

function setActiveNav() {
    const page = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === page);
    });
}

// ===================== FIELD HELPERS =====================

function setError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("input-error");
    let hint = el.parentElement.querySelector(".field-error");
    if (!hint) { hint = document.createElement("span"); hint.className = "field-error"; el.parentElement.appendChild(hint); }
    hint.textContent = msg;
}

function clearAllErrors() {
    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
    document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
}

// ===================== AUTH =====================

function signupUser() {
    clearAllErrors();
    const user    = document.getElementById("newUser").value.trim();
    const email   = document.getElementById("newEmail").value.trim();
    const pass    = document.getElementById("newPass").value;
    const confirm = document.getElementById("confirmPass").value;
    let valid = true;

    if (!/^[A-Za-z\s]{3,}$/.test(user)) {
        setError("newUser", "Name must be at least 3 letters (no numbers or symbols)");
        valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("newEmail", "Enter a valid email address");
        valid = false;
    }
    if (pass.length < 6) {
        setError("newPass", "Password must be at least 6 characters");
        valid = false;
    }
    if (confirm !== pass) {
        setError("confirmPass", "Passwords do not match");
        valid = false;
    }
    if (!valid) return false;

    fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: user, email, password: pass })
    })
    .then(r => r.json())
    .then(data => {
        if (data.error) { setError("newEmail", data.error); return; }
        showToast("✅ Account created! Redirecting to login...");
        setTimeout(() => window.location.href = "login.html", 1400);
    })
    .catch(() => showToast("Server error. Please try again.", "error"));
    return false;
}

function loginUser() {
    // This function is overridden in login.html with full role-based logic.
    // Kept here as a no-op fallback only.
    return false;
}

function checkLogin() {
    const user = localStorage.getItem("gg_loggedIn");
    const role = localStorage.getItem("gg_role");
    const userDiv = document.getElementById("userInfo");
    if (!userDiv) return;
    if (user) {
        const dashLink = role === 'admin' ? 'admin.html' : 'dashboard.html';
        const dashLabel = role === 'admin' ? 'Admin Panel' : 'Dashboard';
        userDiv.innerHTML = `
            <span class="nav-greeting">Hi, <strong>${user}</strong></span>
            <a href="${dashLink}" style="color:var(--purple);font-size:0.82rem;font-weight:600;text-decoration:none;padding:4px 10px;border:1px solid var(--purple);border-radius:6px;margin-right:4px;">${dashLabel}</a>
            <a href="#" onclick="logout()" class="nav-logout">Logout</a>
        `;
    }
}

function logout() {
    localStorage.removeItem("gg_loggedIn");
    localStorage.removeItem("gg_email");
    localStorage.removeItem("gg_role");
    localStorage.removeItem("gg_selectedCourse");
    localStorage.removeItem("gg_selected_role");
    showToast("Logged out successfully.");
    setTimeout(() => window.location.href = "index.html", 800);
}

// ===================== COURSES =====================

const courses = [
    { name: "Frontend Development", overview: "Master HTML, CSS, and JavaScript to build beautiful, interactive websites from scratch.", price: "₹15,000", duration: "5 Months", tag: "Most Popular" },
    { name: "Data Analysis", overview: "Learn Excel, Python, and data visualisation to make data-driven decisions.", price: "₹10,000", duration: "3 Months", tag: "Best Value" },
    { name: "Software Testing", overview: "Learn manual testing and Selenium automation to ensure software quality.", price: "₹15,500", duration: "3 Months", tag: "High Demand" },
    { name: "Web Development", overview: "Full-stack web development: frontend design + backend logic with real projects.", price: "₹15,000", duration: "4 Months", tag: "Comprehensive" },
    { name: "Business Analysis", overview: "Bridge business and technology — learn requirements gathering, process mapping, and data skills.", price: "₹15,500", duration: "3 Months", tag: "Career Boost" },
    { name: "UI/UX Design", overview: "Design modern apps and user experiences using Figma. Learn wireframing, prototyping, and design systems.", price: "₹12,000", duration: "3 Months", tag: "Creative Track" },
    { name: "Cyber Security", overview: "Learn ethical hacking, network security, OWASP Top 10, and penetration testing tools used by professionals.", price: "₹18,000", duration: "4 Months", tag: "High Demand" }
];

function showCourse(index) {
    const c = courses[index];
    if (!c) return;
    const isLoggedIn = localStorage.getItem("gg_loggedIn");
    const email      = localStorage.getItem("gg_email");

    if (!isLoggedIn) {
        renderModal(c, `<button class="modal-apply-btn modal-login-btn" onclick="redirectToLogin()">Login to Apply &rarr;</button>`);
        return;
    }

    fetch(`/api/my-courses?email=${encodeURIComponent(email)}`)
        .then(r => r.json())
        .then(data => {
            const appliedCourses = data.courses || [];
            let btn;
            if (appliedCourses.includes(c.name)) {
                btn = `<div style="background:#f0fff4;border:1.5px solid #38a169;border-radius:10px;padding:14px;text-align:center;">
                    <span style="color:#276749;font-weight:700;font-size:0.95rem;">&#10003; You have already applied for this course</span><br>
                    <a href="dashboard.html" style="color:#7c4daa;font-size:0.85rem;font-weight:600;text-decoration:none;margin-top:6px;display:inline-block;">Go to Dashboard &rarr;</a>
                </div>`;
            } else {
                btn = `<button class="modal-apply-btn" onclick="applyCourse('${c.name}')">Apply Now &rarr;</button>`;
            }
            renderModal(c, btn);
        })
        .catch(() => {
            renderModal(c, `<button class="modal-apply-btn" onclick="applyCourse('${c.name}')">Apply Now &rarr;</button>`);
        });
}

function renderModal(c, btnHtml) {
    document.getElementById("modalBody").innerHTML = `
        <div class="section-label" style="text-align:left; margin-bottom:4px;">${c.tag}</div>
        <h2>${c.name}</h2>
        <p style="margin-top:10px;">${c.overview}</p>
        <div class="modal-badges">
            <div class="badge">&#9201; <span>${c.duration}</span></div>
            <div class="badge">&#128176; <span>${c.price}</span></div>
            <div class="badge">&#127891; <span>Certificate</span></div>
        </div>
        ${btnHtml}
    `;
    document.getElementById("courseModal").classList.add("open");
}

function redirectToLogin() {
    showToast("Please sign up or login to apply!");
    setTimeout(() => window.location.href = "login.html", 1200);
}

function closeModal() {
    const modal = document.getElementById("courseModal");
    if (modal) modal.classList.remove("open");
}

document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
document.addEventListener("click", e => {
    const modal = document.getElementById("courseModal");
    if (modal && e.target === modal) closeModal();
});

function applyCourse(courseName) {
    const user = localStorage.getItem("gg_loggedIn");
    if (!user) { redirectToLogin(); return; }
    localStorage.setItem("gg_selectedCourse", courseName);
    window.location.href = "apply.html";
}

// ===================== APPLY PAGE =====================

function loadCourse() {
    const user = localStorage.getItem("gg_loggedIn");
    if (!user) {
        showToast("Please login to access the application form.");
        setTimeout(() => window.location.href = "login.html", 1200);
        return;
    }
    const course = localStorage.getItem("gg_selectedCourse");
    const el = document.getElementById("courseName");
    if (el && course) el.value = course;

    // Pre-fill name from localStorage
    const nameEl = document.getElementById("appName");
    if (nameEl) nameEl.value = user;

    const email = localStorage.getItem("gg_email");
    if (!email || !course) return;

    fetch(`/api/my-courses?email=${encodeURIComponent(email)}`)
        .then(r => r.json())
        .then(data => {
            if ((data.courses || []).includes(course)) {
                document.querySelector(".form-card").innerHTML = `
                    <div style="text-align:center;padding:30px">
                        <div style="font-size:2.5rem">✅</div>
                        <h2 style="color:#4f46e5;margin:12px 0">Already Applied!</h2>
                        <p>You have already applied for <strong>${course}</strong>.</p>
                        <a href="dashboard.html" class="form-submit" style="display:inline-block;margin-top:16px;text-decoration:none">Go to Dashboard →</a>
                    </div>`;
            }
        });
}

function submitApplication() {
    clearAllErrors();
    const name          = document.getElementById("appName").value.trim();
    const phone         = document.getElementById("phone").value.trim();
    const role          = document.getElementById("role").value;
    const qual          = document.getElementById("qualification").value.trim();
    const course        = document.getElementById("courseName").value;
    let valid = true;

    if (!/^[A-Za-z\s]{3,}$/.test(name)) { setError("appName", "Name must contain only letters (min. 3 characters)"); valid = false; }
    if (!/^\d{10}$/.test(phone))         { setError("phone", "Enter a valid 10-digit phone number"); valid = false; }
    if (!role)                           { setError("role", "Please select your current status"); valid = false; }
    if (qual.length < 2)                 { setError("qualification", "Please enter your qualification"); valid = false; }
    if (!valid) return false;

    const userEmail = localStorage.getItem("gg_email") || "";
    fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_email: userEmail, course_name: course, full_name: name, phone, status: role, qualification: qual })
    })
    .then(r => r.json())
    .then(data => {
        if (data.error) { showToast(data.error, "error"); return; }
        showToast(`🎉 ${name}, your application for "${course}" has been submitted!`);
        setTimeout(() => window.location.href = "dashboard.html", 2000);
    })
    .catch(() => showToast("Server error. Please try again.", "error"));
    return false;
}

// ===================== CONTACT =====================

function sendMessage() {
    clearAllErrors();
    const name  = document.getElementById("contactName");
    const email = document.getElementById("contactEmail");
    const msg   = document.getElementById("contactMsg");
    let valid = true;

    if (name  && !name.value.trim())  { setError("contactName",  "Please enter your name"); valid = false; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setError("contactEmail", "Enter a valid email address"); valid = false; }
    if (msg   && !msg.value.trim())   { setError("contactMsg",   "Please write a message"); valid = false; }
    if (!valid) return false;

    const phone = document.getElementById("contactPhone")?.value.trim() || "";
    const course_interest = document.getElementById("contactCourse")?.value || "";
    fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.value.trim(), email: email.value.trim(), phone, course_interest, message: msg.value.trim() })
    })
    .then(r => r.json())
    .then(data => {
        if (data.error) { showToast(data.error, "error"); return; }
        showToast("✅ Message sent! We'll get back to you soon.");
        const form = document.getElementById("contactForm");
        if (form) form.reset();
    })
    .catch(() => showToast("Server error. Please try again.", "error"));
    return false;
}

// ===================== SCROLL ANIMATIONS =====================

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(
        ".anim-on-scroll, .anim-slide-left, .anim-slide-right, .anim-zoom, .anim-pop, " +
        ".feature-card, .step-card, .mini-course, .partner-tile, .mv-box, " +
        ".value-card, .curriculum-item, .faq-item, .highlight-card, " +
        ".about-stat, .sec-title, .cip-item, .contact-strip-item"
    ).forEach(el => observer.observe(el));
}

// ===================== INPUT FILTERS =====================

function initPhoneFilter() {
    document.querySelectorAll("input[type='tel']").forEach(input => {
        input.addEventListener("input", () => {
            input.value = input.value.replace(/\D/g, "").slice(0, 10);
        });
    });
}

function initNameFilter() {
    ["appName", "newUser"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", () => {
            el.value = el.value.replace(/[^A-Za-z\s]/g, "");
        });
    });
}

// ===================== PAGE TRANSITIONS =====================

function initPageTransitions() {
    const overlay = document.createElement("div");
    overlay.className = "page-transition";
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.classList.add("slide-in");
        requestAnimationFrame(() => {
            overlay.classList.add("slide-out");
            setTimeout(() => overlay.classList.remove("slide-in", "slide-out"), 500);
        });
    });

    document.addEventListener("click", e => {
        const link = e.target.closest("a");
        if (!link || !link.href) return;

        const href = link.getAttribute("href") || "";
        if (
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("javascript:") ||
            link.target === "_blank" ||
            link.hasAttribute("onclick")
        ) return;

        const destFile = href.split("?")[0].split("#")[0];
        const currFile = location.pathname.split("/").pop() || "index.html";
        if (destFile === currFile) return;

        e.preventDefault();
        overlay.classList.remove("slide-out");
        overlay.classList.add("slide-in");
        setTimeout(() => { window.location.href = link.href; }, 420);
    });
}

// ===================== DARK MODE =====================
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('gg_theme', isDark ? 'dark' : 'light');
    const t = document.getElementById('darkModeToggle');
    if (t) t.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function initDarkMode() {
    if (localStorage.getItem('gg_theme') === 'dark') {
        document.body.classList.add('dark-mode');
        const t = document.getElementById('darkModeToggle');
        if (t) t.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// ===================== INIT =====================
document.addEventListener("DOMContentLoaded", () => {
    setActiveNav();
    checkLogin();
    initDarkMode();
    initScrollAnimations();
    initPhoneFilter();
    initNameFilter();
    initPageTransitions();
});

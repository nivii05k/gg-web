// ===================== ADMIN GUARD =====================
(function() {
    const role = localStorage.getItem('gg_role');
    const user = localStorage.getItem('gg_loggedIn');
    if (!user || role !== 'admin') {
        window.location.href = 'login.html';
    }
})();

// ===================== GLOBALS =====================
let allApplications = [];
let allStudents = [];
let allMessages = [];
let activeChatSession = null;
let chatSessions = {};
let adminName = localStorage.getItem('gg_loggedIn') || 'Admin';
let adminEmail = localStorage.getItem('gg_email') || '';

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', function() {
    initAdminProfile();
    loadDarkMode();
    loadNotifPrefs();
    loadAdminPrefs();
    loadAllData();
    startLiveChatPolling();
    startNotificationPolling();
});

function initAdminProfile() {
    const name = localStorage.getItem('gg_admin_display_name') || adminName;
    const avatar = name.charAt(0).toUpperCase();
    const el = document.getElementById('admAvatar');
    const nameEl = document.getElementById('admName');
    if (el) el.textContent = avatar;
    if (nameEl) nameEl.textContent = name;
    const settName = document.getElementById('settName');
    const settEmail = document.getElementById('settEmail');
    if (settName) settName.value = name;
    if (settEmail) settEmail.value = adminEmail;
}

// ===================== SECTION SWITCHING =====================
function admShowSection(section, el) {
    document.querySelectorAll('.adm-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.adm-nav-item').forEach(n => n.classList.remove('active'));
    const sec = document.getElementById('sec-' + section);
    if (sec) sec.classList.add('active');
    if (el) el.classList.add('active');
    const titles = { overview:'Overview', applications:'Applications', students:'Students', messages:'Messages', livechat:'Live Chat', settings:'Settings' };
    const titleEl = document.getElementById('admTopTitle');
    if (titleEl) titleEl.textContent = titles[section] || section;
    if (section === 'applications') renderApplications();
    if (section === 'students') renderStudents();
    if (section === 'messages') renderMessages();
    if (section === 'livechat') renderChatSessions();
    return false;
}

// ===================== LOAD ALL DATA =====================
function loadAllData() {
    Promise.all([
        fetch('/api/admin/stats').then(r => r.json()).catch(() => ({})),
        fetch('/api/admin/applications').then(r => r.json()).catch(() => []),
        fetch('/api/admin/students').then(r => r.json()).catch(() => []),
        fetch('/api/admin/messages').then(r => r.json()).catch(() => []),
        fetch('/api/admin/course-enrollments').then(r => r.json()).catch(() => [])
    ]).then(([stats, apps, students, msgs, courseEnrollments]) => {
        allApplications = Array.isArray(apps) ? apps : [];
        allStudents     = Array.isArray(students) ? students : [];
        allMessages     = Array.isArray(msgs) ? msgs : [];
        console.log('Loaded — apps:', allApplications.length, 'students:', allStudents.length, 'msgs:', allMessages.length);
        renderOverview(stats, allApplications, allStudents, allMessages, Array.isArray(courseEnrollments) ? courseEnrollments : []);
        updateBadges();
    });
}

// ===================== OVERVIEW =====================
function renderOverview(stats, apps, students, msgs, courseEnrollments) {
    // Stat cards
    setText('statTotalStudents', students.length);
    setText('statTotalApps', apps.length);
    setText('statApproved', apps.filter(a => a.approval_status === 'approved').length);
    setText('statPending', apps.filter(a => !a.approval_status || a.approval_status === 'pending').length);
    setText('statRejected', apps.filter(a => a.approval_status === 'rejected').length);
    setText('statMessages', msgs.length);

    // Top course
    const courseCounts = {};
    apps.forEach(a => { courseCounts[a.course_name] = (courseCounts[a.course_name] || 0) + 1; });
    const topCourse = Object.entries(courseCounts).sort((a,b) => b[1]-a[1])[0];
    setText('statTopCourse', topCourse ? topCourse[0].split(' ')[0] : '—');

    // Course bars
    renderCourseBars(courseCounts, apps.length);

    // Course enrollment summary
    renderCourseEnrollmentSummary(courseEnrollments);

    // Recent activity
    renderActivity(apps, students, msgs);
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function renderCourseEnrollmentSummary(enrollments) {
    const el = document.getElementById('admCourseEnrollments');
    if (!el) return;
    if (!enrollments || !enrollments.length) {
        el.innerHTML = '<div class="adm-empty">No enrollment data yet</div>';
        return;
    }
    el.innerHTML = enrollments.map(c => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f3eeff;">
            <div style="font-size:0.88rem;font-weight:600;color:#1a1a2e;flex:1">${c.course_name}</div>
            <div style="display:flex;gap:8px;align-items:center;">
                <span style="background:#f3eeff;color:#7c4daa;font-size:0.75rem;font-weight:700;padding:3px 10px;border-radius:100px;">&#128100; ${c.total_enrolled} enrolled</span>
                <span style="background:#f0fff4;color:#276749;font-size:0.72rem;padding:3px 8px;border-radius:100px;">${c.approved} approved</span>
                <span style="background:#fffaf0;color:#c05621;font-size:0.72rem;padding:3px 8px;border-radius:100px;">${c.pending} pending</span>
            </div>
        </div>`).join('');
}

function renderCourseBars(courseCounts, total) {
    const el = document.getElementById('admCourseBars');
    if (!el) return;
    if (!total) { el.innerHTML = '<div class="adm-empty">No enrollments yet</div>'; return; }
    const sorted = Object.entries(courseCounts).sort((a,b) => b[1]-a[1]);
    el.innerHTML = sorted.map(([name, count]) => {
        const pct = Math.round((count / total) * 100);
        return `<div class="adm-course-bar-item">
            <div class="adm-course-bar-label"><span>${name}</span><span>${count}</span></div>
            <div class="adm-course-bar-track"><div class="adm-course-bar-fill" style="width:${pct}%"></div></div>
        </div>`;
    }).join('');
}

function renderActivity(apps, students, msgs) {
    const el = document.getElementById('admActivityList');
    if (!el) return;
    const items = [];
    apps.slice(-5).reverse().forEach(a => {
        items.push({ icon: '📋', color: '#f3eeff', text: `<b>${a.full_name}</b> applied for <b>${a.course_name}</b>`, time: formatTime(a.submitted_at) });
    });
    students.slice(-3).reverse().forEach(s => {
        items.push({ icon: '🎓', color: '#f0fff4', text: `<b>${s.full_name}</b> registered`, time: formatTime(s.created_at) });
    });
    msgs.slice(-3).reverse().forEach(m => {
        items.push({ icon: '✉️', color: '#ebf8ff', text: `<b>${m.name}</b> sent a message`, time: formatTime(m.created_at) });
    });
    if (!items.length) { el.innerHTML = '<div class="adm-empty">No recent activity</div>'; return; }
    el.innerHTML = items.slice(0,10).map(i => `
        <div class="adm-activity-item">
            <div class="adm-activity-icon" style="background:${i.color}">${i.icon}</div>
            <div>
                <div class="adm-activity-text">${i.text}</div>
                <div class="adm-activity-time">${i.time}</div>
            </div>
        </div>`).join('');
}

function updateBadges() {
    const pending = allApplications.filter(a => !a.approval_status || a.approval_status === 'pending').length;
    const unreadMsgs = allMessages.filter(m => !m.is_read).length;
    const badgeApps = document.getElementById('navBadgeApps');
    const badgeMsgs = document.getElementById('navBadgeMsgs');
    const notifDot = document.getElementById('admNotifDot');
    if (badgeApps) badgeApps.textContent = pending;
    if (badgeMsgs) badgeMsgs.textContent = unreadMsgs;
    if (notifDot) notifDot.style.display = (pending > 0 || unreadMsgs > 0) ? 'block' : 'none';
}

// ===================== APPLICATIONS =====================
function renderApplications() {
    const tbody = document.getElementById('appsTableBody');
    if (!tbody) return;
    const search = (document.getElementById('appSearch')?.value || '').toLowerCase();
    const status = document.getElementById('appStatusFilter')?.value || '';
    const course = document.getElementById('appCourseFilter')?.value || '';
    let filtered = allApplications.filter(a => {
        const matchSearch = !search || a.full_name?.toLowerCase().includes(search) || a.user_email?.toLowerCase().includes(search);
        const matchStatus = !status || (a.approval_status || 'pending') === status;
        const matchCourse = !course || a.course_name === course;
        return matchSearch && matchStatus && matchCourse;
    });
    if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="8" class="adm-empty">No applications found</td></tr>'; return; }
    tbody.innerHTML = filtered.map((a, i) => {
        const st = a.approval_status || 'pending';
        const enrolledCount = a.enrolled_count || 1;
        return `<tr>
            <td>${i+1}</td>
            <td><b>${a.full_name}</b></td>
            <td>${a.user_email || '—'}</td>
            <td>
                ${a.course_name}
                <div style="margin-top:3px;"><span style="font-size:0.72rem;background:#f3eeff;color:#7c4daa;font-weight:700;padding:2px 8px;border-radius:100px;">👤 ${enrolledCount} enrolled</span></div>
            </td>
            <td>${formatDate(a.submitted_at)}</td>
            <td><span class="adm-status adm-status-${st}">${st}</span></td>
            <td>
                <div class="adm-action-btns">
                    ${st !== 'approved' ? `<button class="adm-btn adm-btn-success adm-btn-sm" onclick="updateAppStatus(${a.id},'approved')">&#10003; Approve</button>` : ''}
                    ${st !== 'rejected' ? `<button class="adm-btn adm-btn-danger adm-btn-sm" onclick="updateAppStatus(${a.id},'rejected')">&#10007; Reject</button>` : ''}
                    <button class="adm-btn adm-btn-info adm-btn-sm" onclick="viewAppDetail(${a.id})">View</button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function filterApplications() { renderApplications(); }

function updateAppStatus(id, status) {
    fetch('/api/admin/application-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
    }).then(r => r.json()).then(() => {
        const app = allApplications.find(a => a.id === id);
        if (app) app.approval_status = status;
        renderApplications();
        updateBadges();
        showAdmToast(`Application ${status}!`);
    }).catch(() => showAdmToast('Error updating status', true));
}

function viewAppDetail(id) {
    const a = allApplications.find(x => x.id === id);
    if (!a) return;
    const st = a.approval_status || 'pending';
    document.getElementById('appDetailBody').innerHTML = `
        <div class="adm-detail-row"><span class="adm-detail-label">Name</span><span class="adm-detail-value">${a.full_name}</span></div>
        <div class="adm-detail-row"><span class="adm-detail-label">Email</span><span class="adm-detail-value">${a.user_email || '—'}</span></div>
        <div class="adm-detail-row"><span class="adm-detail-label">Phone</span><span class="adm-detail-value">${a.phone || '—'}</span></div>
        <div class="adm-detail-row"><span class="adm-detail-label">Course</span><span class="adm-detail-value">${a.course_name} <span style="font-size:0.75rem;background:#f3eeff;color:#7c4daa;font-weight:700;padding:2px 8px;border-radius:100px;margin-left:6px;">👤 ${a.enrolled_count || 1} enrolled</span></span></div>
        <div class="adm-detail-row"><span class="adm-detail-label">Qualification</span><span class="adm-detail-value">${a.qualification || '—'}</span></div>
        <div class="adm-detail-row"><span class="adm-detail-label">Status (Role)</span><span class="adm-detail-value">${a.status || '—'}</span></div>
        <div class="adm-detail-row"><span class="adm-detail-label">Applied On</span><span class="adm-detail-value">${formatDate(a.submitted_at)}</span></div>
        <div class="adm-detail-row"><span class="adm-detail-label">Approval</span><span class="adm-detail-value"><span class="adm-status adm-status-${st}">${st}</span></span></div>
        <div class="adm-modal-actions">
            ${st !== 'approved' ? `<button class="adm-btn adm-btn-success" onclick="updateAppStatus(${a.id},'approved');document.getElementById('appDetailModal').style.display='none'">✓ Approve</button>` : ''}
            ${st !== 'rejected' ? `<button class="adm-btn adm-btn-danger" onclick="updateAppStatus(${a.id},'rejected');document.getElementById('appDetailModal').style.display='none'">✗ Reject</button>` : ''}
        </div>`;
    document.getElementById('appDetailModal').style.display = 'flex';
}

// ===================== STUDENTS =====================
function renderStudents() {
    const tbody = document.getElementById('stuTableBody');
    if (!tbody) return;
    const search = (document.getElementById('stuSearch')?.value || '').toLowerCase();
    const filter = document.getElementById('stuActivityFilter')?.value || '';
    let filtered = allStudents.filter(s => {
        const matchSearch = !search || s.full_name?.toLowerCase().includes(search) || s.email?.toLowerCase().includes(search);
        const courses = allApplications.filter(a => a.user_email === s.email);
        const matchFilter = !filter || (filter === 'enrolled' && courses.length > 0) || (filter === 'not-enrolled' && courses.length === 0);
        return matchSearch && matchFilter;
    });
    if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="7" class="adm-empty">No students found</td></tr>'; return; }
    tbody.innerHTML = filtered.map((s, i) => {
        const courses = allApplications.filter(a => a.user_email === s.email);
        const status = courses.length > 0 ? 'enrolled' : 'active';
        return `<tr>
            <td>${i+1}</td>
            <td><b>${s.full_name}</b></td>
            <td>${s.email}</td>
            <td>${courses.length > 0 ? courses.map(c => `<span style="font-size:0.75rem;background:#f3eeff;color:#7c4daa;padding:2px 8px;border-radius:100px;margin:2px;display:inline-block;">${c.course_name}</span>`).join('') : '—'}</td>
            <td>${courses.length}</td>
            <td>${formatDate(s.created_at)}</td>
            <td><span class="adm-status adm-status-${status}">${status}</span></td>
            <td><button class="adm-btn adm-btn-info adm-btn-sm" onclick="viewStudentProfile('${s.email}')">View</button></td>
        </tr>`;
    }).join('');
}

function filterStudents() { renderStudents(); }

function viewStudentProfile(email) {
    const s = allStudents.find(x => x.email === email);
    if (!s) return;
    const courses = allApplications.filter(a => a.user_email === email);
    document.getElementById('stuProfileBody').innerHTML = `
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
            <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#7c4daa,#b39ddb);color:#fff;font-size:1.4rem;font-weight:700;display:flex;align-items:center;justify-content:center;">${s.full_name.charAt(0).toUpperCase()}</div>
            <div><div style="font-family:'Poppins',sans-serif;font-size:1.2rem;font-weight:700;color:#1a1a2e;">${s.full_name}</div><div style="font-size:0.85rem;color:#9e9e9e;">${s.email}</div></div>
        </div>
        <div class="adm-detail-row"><span class="adm-detail-label">Registered</span><span class="adm-detail-value">${formatDate(s.created_at)}</span></div>
        <div class="adm-detail-row"><span class="adm-detail-label">Total Courses</span><span class="adm-detail-value">${courses.length}</span></div>
        <div class="adm-detail-row"><span class="adm-detail-label">Courses</span><span class="adm-detail-value">${courses.length ? courses.map(c => `<div style="margin-bottom:6px;"><span style="font-size:0.82rem;background:#f3eeff;color:#7c4daa;padding:3px 10px;border-radius:100px;">${c.course_name}</span> <span class="adm-status adm-status-${c.approval_status||'pending'}" style="font-size:0.68rem;">${c.approval_status||'pending'}</span></div>`).join('') : '—'}</span></div>`;
    document.getElementById('stuProfileModal').style.display = 'flex';
}

// ===================== MESSAGES =====================
function renderMessages() {
    const el = document.getElementById('admMessagesList');
    if (!el) return;
    const search = (document.getElementById('msgSearch')?.value || '').toLowerCase();
    let filtered = allMessages.filter(m => !search || m.name?.toLowerCase().includes(search) || m.message?.toLowerCase().includes(search) || m.email?.toLowerCase().includes(search));
    if (!filtered.length) { el.innerHTML = '<div class="adm-empty">No messages found</div>'; return; }
    el.innerHTML = filtered.map(m => `
        <div class="adm-message-item ${!m.is_read ? 'unread' : ''}" onclick="viewMessage(${m.id})">
            <div class="adm-msg-avatar">${(m.name||'?').charAt(0).toUpperCase()}</div>
            <div class="adm-msg-body">
                <div class="adm-msg-sender">${m.name} <span style="font-size:0.75rem;color:#9e9e9e;font-weight:400;">&lt;${m.email}&gt;</span>
                ${m.course_interest ? `<span style="font-size:0.72rem;background:#f3eeff;color:#7c4daa;padding:2px 8px;border-radius:100px;margin-left:6px;">${m.course_interest}</span>` : ''}
                </div>
                <div class="adm-msg-preview">${(m.message||'').substring(0,90)}${(m.message||'').length > 90 ? '...' : ''}</div>
            </div>
            <div class="adm-msg-meta">
                <div class="adm-msg-time">${formatTime(m.created_at)}</div>
                ${!m.is_read ? '<div class="adm-msg-unread-dot"></div>' : ''}
            </div>
        </div>`).join('');
}

function filterMessages() { renderMessages(); }

function viewMessage(id) {
    const m = allMessages.find(x => x.id === id);
    if (!m) return;
    m.is_read = true;
    fetch('/api/admin/mark-message-read', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id}) }).catch(()=>{});
    document.getElementById('msgDetailBody').innerHTML = `
        <div class="adm-detail-row"><span class="adm-detail-label">From</span><span class="adm-detail-value">${m.name}</span></div>
        <div class="adm-detail-row"><span class="adm-detail-label">Email</span><span class="adm-detail-value">${m.email}</span></div>
        <div class="adm-detail-row"><span class="adm-detail-label">Phone</span><span class="adm-detail-value">${m.phone || '—'}</span></div>
        <div class="adm-detail-row"><span class="adm-detail-label">Course Interest</span><span class="adm-detail-value">${m.course_interest || '—'}</span></div>
        <div class="adm-detail-row"><span class="adm-detail-label">Date</span><span class="adm-detail-value">${formatTime(m.created_at)}</span></div>
        <div class="adm-detail-row"><span class="adm-detail-label">Message</span><span class="adm-detail-value" style="white-space:pre-wrap;line-height:1.7;">${m.message}</span></div>`;
    document.getElementById('msgDetailModal').style.display = 'flex';
    renderMessages();
    updateBadges();
}

// ===================== LIVE CHAT =====================
function renderChatSessions() {
    const el = document.getElementById('admChatSessions');
    const countEl = document.getElementById('admOnlineCount');
    const badgeEl = document.getElementById('navBadgeChat');
    const sessions = Object.values(chatSessions);
    if (countEl) countEl.textContent = sessions.length + ' online';
    if (badgeEl) badgeEl.textContent = sessions.length;
    setText('statLiveChats', sessions.length);
    if (!sessions.length) {
        if (el) el.innerHTML = '<div class="adm-empty">No active chat sessions.<br><small>Students will appear here when they request live support.</small></div>';
        return;
    }
    if (el) el.innerHTML = sessions.map(s => `
        <div class="adm-chat-session-item ${activeChatSession === s.id ? 'active' : ''}" onclick="selectChatSession('${s.id}')">
            <div class="adm-session-avatar">${s.studentName.charAt(0).toUpperCase()}<span class="adm-session-online"></span></div>
            <div style="flex:1;min-width:0;">
                <div class="adm-session-name">${s.studentName}</div>
                <div class="adm-session-preview">${s.lastMsg || 'Chat started'}</div>
            </div>
            <div class="adm-session-time">${s.lastTime || ''}</div>
        </div>`).join('');
}

function selectChatSession(sessionId) {
    activeChatSession = sessionId;
    const session = chatSessions[sessionId];
    if (!session) return;
    const headerEl = document.getElementById('admChatWindowHeader');
    if (headerEl) headerEl.innerHTML = `<h3><i class="fas fa-comment-dots"></i> ${session.studentName}</h3><span class="adm-online-dot" style="margin-left:8px;"></span><span style="font-size:0.78rem;color:#38a169;font-weight:600;margin-left:4px;">Online</span>`;
    renderChatMessages(sessionId);
    renderChatSessions();
}

function renderChatMessages(sessionId) {
    const el = document.getElementById('admChatMessages');
    if (!el) return;

    // Always read fresh from localStorage
    const key = 'gg_lc_' + sessionId;
    let studentMsgs = [];
    let adminMsgs = [];
    let studentName = 'Student';
    try {
        const raw = localStorage.getItem(key);
        if (raw) {
            const data = JSON.parse(raw);
            studentMsgs = data.studentMsgs || [];
            adminMsgs   = data.adminMsgs   || [];
            studentName = data.studentName || 'Student';
            // Update cache
            if (chatSessions[sessionId]) {
                chatSessions[sessionId].studentMsgs = studentMsgs;
                chatSessions[sessionId].adminMsgs   = adminMsgs;
                chatSessions[sessionId].studentName = studentName;
            }
        }
    } catch(e) {}

    // Build combined timeline sorted by ts
    const combined = [
        ...studentMsgs.map(m => ({ from: 'student', text: m.text, time: m.time, ts: m.ts || 0 })),
        ...adminMsgs.map(m   => ({ from: 'admin',   text: m.text, time: m.time, ts: m.ts || 0 }))
    ].sort((a, b) => a.ts - b.ts);

    if (!combined.length) {
        el.innerHTML = '<div class="adm-chat-placeholder"><i class="fas fa-comments" style="font-size:3rem;color:#e0d4f5;"></i><p>Waiting for student messages...</p></div>';
        return;
    }

    el.innerHTML = combined.map(msg => `
        <div class="adm-chat-msg ${msg.from === 'admin' ? 'admin-msg' : 'student-msg'}">
            ${msg.from === 'student' ? `<div class="adm-chat-msg-avatar">${studentName.charAt(0).toUpperCase()}</div>` : ''}
            <div>
                <div class="adm-chat-msg-bubble">${msg.text}</div>
                <div class="adm-chat-msg-time">${msg.from === 'student' ? '👤 ' + studentName : '🛡️ Admin'} · ${msg.time}</div>
            </div>
        </div>`).join('');
    el.scrollTop = el.scrollHeight;
}

function admSendReply() {
    if (!activeChatSession) { showAdmToast('Select a chat session first', true); return; }
    const input = document.getElementById('admChatInput');
    const text = input?.value.trim();
    if (!text) return;
    input.value = '';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const key = 'gg_lc_' + activeChatSession;
    try {
        const raw = localStorage.getItem(key);
        if (!raw) { showAdmToast('Session no longer active', true); return; }
        const data = JSON.parse(raw);
        data.adminMsgs = data.adminMsgs || [];
        data.adminMsgs.push({ text, time, ts: Date.now() });
        localStorage.setItem(key, JSON.stringify(data));
        if (chatSessions[activeChatSession]) {
            chatSessions[activeChatSession].adminMsgs = data.adminMsgs;
            chatSessions[activeChatSession].lastMsg  = text;
            chatSessions[activeChatSession].lastTime = time;
        }
        renderChatMessages(activeChatSession);
        renderChatSessions();
    } catch(e) { showAdmToast('Error sending reply', true); }
}

function admQuickReply(text) {
    const input = document.getElementById('admChatInput');
    if (input) { input.value = text; admSendReply(); }
}

function startLiveChatPolling() {
    setInterval(() => {
        // Scan localStorage for all active live chat sessions
        const keys = Object.keys(localStorage).filter(k => k.startsWith('gg_lc_'));

        keys.forEach(key => {
            const sessionId = key.replace('gg_lc_', '');
            try {
                const raw = localStorage.getItem(key);
                if (!raw) return;
                const data = JSON.parse(raw);
                if (!data.studentName || !data.id) return;

                if (!chatSessions[sessionId]) {
                    // New session — add it
                    chatSessions[sessionId] = {
                        id: sessionId,
                        studentName: data.studentName,
                        studentMsgs: data.studentMsgs || [],
                        adminMsgs:   data.adminMsgs   || [],
                        lastMsg:  '',
                        lastTime: ''
                    };
                } else {
                    // Update existing
                    chatSessions[sessionId].studentMsgs = data.studentMsgs || [];
                    chatSessions[sessionId].adminMsgs   = data.adminMsgs   || [];
                }

                // Update preview with latest student message
                const sMsgs = data.studentMsgs || [];
                if (sMsgs.length) {
                    const last = sMsgs[sMsgs.length - 1];
                    chatSessions[sessionId].lastMsg  = last.text;
                    chatSessions[sessionId].lastTime = last.time;
                }
            } catch(e) {}
        });

        // Remove sessions no longer in localStorage
        Object.keys(chatSessions).forEach(id => {
            if (!localStorage.getItem('gg_lc_' + id)) {
                delete chatSessions[id];
                if (activeChatSession === id) activeChatSession = null;
            }
        });

        renderChatSessions();

        // Refresh open chat window
        if (activeChatSession && chatSessions[activeChatSession]) {
            renderChatMessages(activeChatSession);
        }
    }, 1000);
}

// ===================== NOTIFICATIONS POLLING =====================
function startNotificationPolling() {
    setInterval(() => {
        fetch('/api/admin/stats').then(r => r.json()).then(stats => {
            // Refresh data silently
            fetch('/api/admin/applications').then(r => r.json()).then(apps => {
                if (Array.isArray(apps)) {
                    allApplications = apps;
                    updateBadges();
                }
            }).catch(()=>{});
            fetch('/api/admin/messages').then(r => r.json()).then(msgs => {
                if (Array.isArray(msgs)) { allMessages = msgs; updateBadges(); }
            }).catch(()=>{});
        }).catch(()=>{});
    }, 15000);
}

// ===================== SETTINGS =====================
function saveAdminProfile() {
    const name = document.getElementById('settName')?.value.trim();
    if (!name) { showAdmToast('Please enter a name', true); return; }
    localStorage.setItem('gg_admin_display_name', name);
    const nameEl = document.getElementById('admName');
    const avatarEl = document.getElementById('admAvatar');
    if (nameEl) nameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
    showAdmToast('Profile saved!');
}

function changeAdminPassword() {
    const oldPass = document.getElementById('settOldPass')?.value;
    const newPass = document.getElementById('settNewPass')?.value;
    const confPass = document.getElementById('settConfPass')?.value;
    if (!oldPass || !newPass || !confPass) { showAdmToast('Fill all fields', true); return; }
    if (newPass.length < 6) { showAdmToast('Password must be at least 6 characters', true); return; }
    if (newPass !== confPass) { showAdmToast('Passwords do not match', true); return; }
    fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, oldPassword: oldPass, newPassword: newPass })
    }).then(r => r.json()).then(data => {
        if (data.error) { showAdmToast(data.error, true); return; }
        showAdmToast('Password updated!');
        document.getElementById('settOldPass').value = '';
        document.getElementById('settNewPass').value = '';
        document.getElementById('settConfPass').value = '';
    }).catch(() => showAdmToast('Server error', true));
}

function saveNotifPrefs() {
    const prefs = {
        app: document.getElementById('notifApp')?.checked,
        student: document.getElementById('notifStudent')?.checked,
        chat: document.getElementById('notifChat')?.checked,
        msg: document.getElementById('notifMsg')?.checked
    };
    localStorage.setItem('gg_admin_notif_prefs', JSON.stringify(prefs));
    showAdmToast('Notification preferences saved!');
}

function loadNotifPrefs() {
    try {
        const prefs = JSON.parse(localStorage.getItem('gg_admin_notif_prefs') || '{}');
        if (prefs.app !== undefined && document.getElementById('notifApp')) document.getElementById('notifApp').checked = prefs.app;
        if (prefs.student !== undefined && document.getElementById('notifStudent')) document.getElementById('notifStudent').checked = prefs.student;
        if (prefs.chat !== undefined && document.getElementById('notifChat')) document.getElementById('notifChat').checked = prefs.chat;
        if (prefs.msg !== undefined && document.getElementById('notifMsg')) document.getElementById('notifMsg').checked = prefs.msg;
    } catch(e) {}
}

function saveAdminPrefs() {
    const section = document.getElementById('settDefaultSection')?.value;
    if (section) localStorage.setItem('gg_admin_default_section', section);
}

function loadAdminPrefs() {
    const section = localStorage.getItem('gg_admin_default_section');
    if (section && section !== 'overview') {
        const navItem = document.querySelector(`[data-section="${section}"]`);
        if (navItem) admShowSection(section, navItem);
    }
    const compact = localStorage.getItem('gg_admin_compact') === 'true';
    if (compact) {
        document.getElementById('admLayout')?.classList.add('compact');
        const cb = document.getElementById('settCompact');
        if (cb) cb.checked = true;
    }
    const sel = document.getElementById('settDefaultSection');
    if (sel && section) sel.value = section;
}

function toggleCompactSidebar(cb) {
    const layout = document.getElementById('admLayout');
    if (cb.checked) { layout?.classList.add('compact'); localStorage.setItem('gg_admin_compact','true'); }
    else { layout?.classList.remove('compact'); localStorage.setItem('gg_admin_compact','false'); }
}

function toggleDarkModeFromSettings(cb) {
    if (cb.checked) { document.body.classList.add('dark-mode'); localStorage.setItem('gg_theme','dark'); }
    else { document.body.classList.remove('dark-mode'); localStorage.setItem('gg_theme','light'); }
    // Sync navbar toggle if present
    const navToggle = document.getElementById('darkModeToggle');
    if (navToggle) navToggle.innerHTML = cb.checked ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// ===================== DARK MODE =====================
function loadDarkMode() {
    const theme = localStorage.getItem('gg_theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        const cb = document.getElementById('settDarkMode');
        if (cb) cb.checked = true;
    }
}

// ===================== LOGOUT =====================
function admLogout() {
    localStorage.removeItem('gg_loggedIn');
    localStorage.removeItem('gg_email');
    localStorage.removeItem('gg_role');
    localStorage.removeItem('gg_selected_role');
    window.location.href = 'login.html';
}

// ===================== HELPERS =====================
function formatDate(dateStr) {
    if (!dateStr) return '—';
    try { return new Date(dateStr).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }); }
    catch(e) { return dateStr; }
}

function formatTime(dateStr) {
    if (!dateStr) return '—';
    try {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = now - d;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return Math.floor(diff/60000) + 'm ago';
        if (diff < 86400000) return Math.floor(diff/3600000) + 'h ago';
        return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short' });
    } catch(e) { return dateStr; }
}

function showAdmToast(msg, isError) {
    let toast = document.getElementById('admToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'admToast';
        toast.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(80px);background:#1a1a2e;color:#fff;padding:12px 24px;border-radius:100px;font-size:0.88rem;font-weight:500;z-index:9999;transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1),opacity 0.3s;opacity:0;border-left:4px solid #b39ddb;box-shadow:0 8px 32px rgba(26,26,46,0.3);white-space:nowrap;';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.borderLeftColor = isError ? '#e53e3e' : '#b39ddb';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(80px)'; toast.style.opacity = '0'; }, 3000);
}

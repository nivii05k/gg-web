// ===================== GG CHATBOT =====================
(function () {

    const kb = [
        { keys: ['hi','hello','hey','hai','helo','hii','hiii','morning','evening','afternoon','greet','sup','yo'], reply: "Hello! 👋 Welcome to Great Gaining Institution. How can I help you today?\n\nYou can ask me about our courses, fees, placements, contact details, or how to apply!" },
        { keys: ['about','institution','company','who','great','gaining','gg','tell'], reply: "Great Gaining Institution is Chennai's trusted skill-development centre! 🎓\n\nWe provide practical, job-focused training with real placement support at affordable fees. Founded in 2022, we've trained 2,000+ students with a 95% placement rate." },
        { keys: ['courses','course','program','programs','available','offer','list'], reply: "We offer 7 professional courses:\n\n📌 Frontend Development\n📌 Data Analysis\n📌 Software Testing\n📌 Web Development\n📌 Business Analysis\n📌 UI/UX Design\n📌 Cyber Security\n\nWhich course would you like to know more about?" },
        { keys: ['frontend','html','css','javascript','js','react','bootstrap'], reply: "Frontend Development Course 💻\n\n✅ HTML & CSS Fundamentals\n✅ JavaScript & DOM Manipulation\n✅ React & Bootstrap\n\n⏱️ Duration: 5 Months\n💰 Fee: ₹15,000" },
        { keys: ['data','excel','python','pandas','numpy','analytics','analysis','matplotlib','seaborn','powerbi'], reply: "Data Analysis Course 📊\n\n✅ Excel (Formulas, Pivot Tables, Charts)\n✅ Python (Pandas, NumPy)\n✅ Data Visualization (Matplotlib, Seaborn)\n\n⏱️ Duration: 3 Months\n💰 Fee: ₹10,000" },
        { keys: ['testing','test','qa','selenium','manual','automation','postman','jmeter','jira'], reply: "Software Testing Course 🧪\n\n✅ Manual Testing & Test Cases\n✅ Selenium WebDriver & Automation\n✅ API Testing with Postman\n\n⏱️ Duration: 3 Months\n💰 Fee: ₹15,500" },
        { keys: ['web','node','nodejs','express','backend','fullstack','full','stack','mysql','mongodb','database'], reply: "Web Development Course 🌐\n\n✅ Frontend (HTML, CSS, JavaScript)\n✅ Backend (Node.js, Express)\n✅ Database (MySQL, MongoDB)\n\n⏱️ Duration: 4 Months\n💰 Fee: ₹15,000" },
        { keys: ['business','analyst','ba','bpmn','requirements','agile','scrum','stakeholder'], reply: "Business Analysis Course 📋\n\n✅ Requirements Gathering & Documentation\n✅ Process Mapping (BPMN, Flowcharts)\n✅ Agile & Scrum for BA\n\n⏱️ Duration: 3 Months\n💰 Fee: ₹15,500" },
        { keys: ['ui','ux','design','figma','wireframe','prototype','uiux','graphic'], reply: "UI/UX Design Course 🎨\n\n✅ Design Principles & Color Theory\n✅ Figma & Wireframing\n✅ Prototyping & User Research\n\n⏱️ Duration: 3 Months\n💰 Fee: ₹12,000" },
        { keys: ['cyber','security','hacking','hack','ethical','network','owasp','kali','nmap','firewall'], reply: "Cyber Security Course 🔒\n\n✅ Security Fundamentals (CIA Triad)\n✅ Network Security & Ethical Hacking\n✅ OWASP Top 10 & Incident Response\n\n⏱️ Duration: 4 Months\n💰 Fee: ₹18,000" },
        { keys: ['fee','fees','cost','price','amount','money','pay','payment','affordable','rupees','emi','installment'], reply: "Our course fees are very affordable! 💰\n\n💻 Frontend Development – ₹15,000\n📊 Data Analysis – ₹10,000\n🧪 Software Testing – ₹15,500\n🌐 Web Development – ₹15,000\n📋 Business Analysis – ₹15,500\n🎨 UI/UX Design – ₹12,000\n🔒 Cyber Security – ₹18,000\n\nEMI options available! 📞 +91 88388 75601" },
        { keys: ['duration','long','months','weeks','days','period'], reply: "Course durations ⏱️\n\n📊 Data Analysis – 3 Months\n🧪 Software Testing – 3 Months\n🎨 UI/UX Design – 3 Months\n📋 Business Analysis – 3 Months\n💻 Frontend Development – 5 Months\n🌐 Web Development – 4 Months\n🔒 Cyber Security – 4 Months" },
        { keys: ['contact','phone','number','email','mail','reach','call','address','location','where','chennai','office'], reply: "📞 Phone: +91 88388 75601\n📧 Email: info@greatgaining.in\n📍 Location: Chennai, Tamil Nadu – 600001\n🕐 Hours: Mon – Sat, 9 AM – 7 PM" },
        { keys: ['placement','job','jobs','career','hire','hiring','company','companies','work','employ','placed'], reply: "Yes! We provide full placement support! 🎯\n\n✅ Resume building\n✅ Mock interview preparation\n✅ Direct referrals to 50+ hiring partners\n✅ Companies like TCS, Infosys, Wipro, Zoho & more\n\n95% placed within 3 months! 🚀" },
        { keys: ['apply','enroll','enrol','join','register','admission','signup','start','begin'], reply: "Ready to join us? 🚀\n\n1️⃣ Go to our Courses page\n2️⃣ Choose your course\n3️⃣ Click 'Apply Now'\n4️⃣ Fill the application form\n\nOr call us: 📞 +91 88388 75601" },
        { keys: ['certificate','certification','cert','degree','diploma','credential'], reply: "Yes! You'll receive a Course Completion Certificate 🎓 after finishing all lessons and quizzes.\n\nRecognised by our 50+ hiring partners!" },
        { keys: ['online','offline','classroom','mode','virtual','remote','recorded'], reply: "We offer both modes! 💻🏫\n\n✅ Live online classes (Zoom/Meet)\n✅ Classroom training in Chennai\n✅ Recorded sessions for revision" },
        { keys: ['batch','schedule','timing','weekend','weekday','slot'], reply: "Flexible batch timings! 🗓️\n\n📅 Weekday batch: Mon–Fri, 2 hrs/day\n📅 Weekend batch: Sat–Sun, 4 hrs/day\n\nNew batches every month. 📞 +91 88388 75601" },
        { keys: ['experience','beginner','fresher','basic','knowledge','background','prerequisite'], reply: "No prior experience needed! 🙌\n\nMost courses are designed for absolute beginners. A basic understanding of computers is enough!" },
        { keys: ['trainer','teacher','faculty','instructor','mentor','staff'], reply: "Our trainers are active IT professionals! 👨💻\n\n✅ 5+ years industry experience\n✅ Work on live projects\n✅ Available for doubt-clearing sessions" },
        { keys: ['thank','thanks','thankyou','ok','okay','nice','cool','awesome','bye','goodbye'], reply: "You're welcome! 😊 Feel free to ask anything else.\n\nWe're here to help you start your career journey! 🚀" }
    ];

    // ── Live chat state ──
    let liveChatActive = false;
    let liveChatSessionId = null;
    let lastSeenAdminCount = 0;
    let pollTimer = null;

    function getBotResponse(msg) {
        const lower = msg.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        const words = lower.split(/\s+/);
        const triggers = ['speak with admin','talk to admin','human support','live support','real person','speak to someone','connect admin','admin help','live chat','talk to human','human agent','support agent'];
        if (
            triggers.some(t => lower.includes(t)) ||
            (words.includes('admin') && (words.includes('speak') || words.includes('talk') || words.includes('connect') || words.includes('want') || words.includes('need'))) ||
            (words.includes('human') && (words.includes('support') || words.includes('help')))
        ) return '__LIVE_CHAT__';

        for (const entry of kb) {
            for (const word of words) {
                if (entry.keys.includes(word)) return entry.reply;
            }
        }
        return "I'm not sure about that, but I'm here to help! 😊\n\nYou can ask me about:\n📚 Courses available\n💰 Fees & payment\n📞 Contact details\n🎓 Certificates\n💼 Placements\n📝 How to apply\n\nOr type \"speak with admin\" to chat with our support team live!";
    }

    function createChatbot() {
        const html = `
        <div id="ggChatbot" style="position:fixed;bottom:24px;right:24px;z-index:9999;font-family:'Inter',sans-serif;">
            <button id="ggChatBtn" title="Chat with us" style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#7c4daa,#5a2d8a);border:none;box-shadow:0 8px 24px rgba(124,77,170,0.45);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 0.25s;">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
            <div id="ggChatWindow" style="display:none;position:absolute;bottom:76px;right:0;width:340px;height:500px;background:#fff;border-radius:18px;box-shadow:0 16px 56px rgba(26,26,46,0.28);overflow:hidden;flex-direction:column;">
                <div style="background:linear-gradient(135deg,#1a1a2e,#2d2d5e);padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div id="ggChatAvatar" style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#b39ddb,#7c4daa);display:flex;align-items:center;justify-content:center;font-size:1.1rem;">🤖</div>
                        <div>
                            <div id="ggChatTitle" style="font-weight:700;font-size:0.9rem;color:#fff;">GG Assistant</div>
                            <div id="ggChatStatus" style="font-size:0.72rem;color:rgba(255,255,255,0.6);">● Online</div>
                        </div>
                    </div>
                    <button id="ggChatClose" style="background:none;border:none;color:rgba(255,255,255,0.7);font-size:1.4rem;cursor:pointer;line-height:1;padding:4px;">&times;</button>
                </div>
                <div id="ggChatMessages" style="flex:1;overflow-y:auto;padding:14px;background:#f8f4ff;display:flex;flex-direction:column;gap:10px;">
                    <div style="display:flex;gap:8px;align-items:flex-end;">
                        <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#b39ddb,#7c4daa);display:flex;align-items:center;justify-content:center;font-size:0.8rem;flex-shrink:0;">🤖</div>
                        <div style="background:#fff;padding:10px 13px;border-radius:14px 14px 14px 4px;max-width:80%;box-shadow:0 2px 8px rgba(0,0,0,0.07);font-size:0.85rem;line-height:1.55;color:#333;white-space:pre-line;">Hi! 👋 I'm your GG Assistant.\nAsk me anything about our courses, fees, placements, or contact details!</div>
                    </div>
                </div>
                <div style="padding:12px 14px;background:#fff;border-top:1px solid #ede7f6;display:flex;gap:8px;flex-shrink:0;">
                    <input id="ggChatInput" type="text" placeholder="Type a message..." style="flex:1;padding:9px 14px;border:1.5px solid #e0d4f5;border-radius:20px;font-size:0.85rem;font-family:'Inter',sans-serif;outline:none;" />
                    <button id="ggChatSend" style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#7c4daa,#5a2d8a);border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', html);

        const chatBtn      = document.getElementById('ggChatBtn');
        const chatWindow   = document.getElementById('ggChatWindow');
        const chatClose    = document.getElementById('ggChatClose');
        const chatInput    = document.getElementById('ggChatInput');
        const chatSend     = document.getElementById('ggChatSend');
        const chatMessages = document.getElementById('ggChatMessages');

        chatBtn.addEventListener('click', () => {
            const isOpen = chatWindow.style.display === 'flex';
            chatWindow.style.display = isOpen ? 'none' : 'flex';
            if (!isOpen) chatInput.focus();
        });
        chatClose.addEventListener('click', () => { chatWindow.style.display = 'none'; });
        chatBtn.addEventListener('mouseenter', () => { chatBtn.style.transform = 'scale(1.1)'; });
        chatBtn.addEventListener('mouseleave', () => { chatBtn.style.transform = 'scale(1)'; });
        chatInput.addEventListener('focus', () => { chatInput.style.borderColor = '#7c4daa'; });
        chatInput.addEventListener('blur',  () => { chatInput.style.borderColor = '#e0d4f5'; });

        function addBotMsg(text) {
            const d = document.createElement('div');
            d.style.cssText = 'display:flex;gap:8px;align-items:flex-end;';
            d.innerHTML = `<div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#b39ddb,#7c4daa);display:flex;align-items:center;justify-content:center;font-size:0.8rem;flex-shrink:0;">🤖</div>
                <div style="background:#fff;padding:10px 13px;border-radius:14px 14px 14px 4px;max-width:80%;box-shadow:0 2px 8px rgba(0,0,0,0.07);font-size:0.85rem;line-height:1.55;color:#333;white-space:pre-line;">${text}</div>`;
            chatMessages.appendChild(d);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function addStudentMsg(text) {
            const d = document.createElement('div');
            d.style.cssText = 'display:flex;justify-content:flex-end;';
            d.innerHTML = `<div style="background:linear-gradient(135deg,#7c4daa,#5a2d8a);color:#fff;padding:10px 13px;border-radius:14px 14px 4px 14px;max-width:80%;font-size:0.85rem;line-height:1.55;">${text}</div>`;
            chatMessages.appendChild(d);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function addAdminMsg(text) {
            const d = document.createElement('div');
            d.style.cssText = 'display:flex;gap:8px;align-items:flex-end;';
            d.innerHTML = `<div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#1a1a2e,#2d2d5e);display:flex;align-items:center;justify-content:center;font-size:0.75rem;flex-shrink:0;color:#b39ddb;font-weight:700;">A</div>
                <div style="background:#fff;padding:10px 13px;border-radius:14px 14px 14px 4px;max-width:80%;box-shadow:0 2px 8px rgba(0,0,0,0.07);font-size:0.85rem;line-height:1.55;color:#333;white-space:pre-line;border-left:3px solid #7c4daa;">${text}</div>`;
            chatMessages.appendChild(d);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // ── Single sendMessage bound once ──
        function sendMessage() {
            const msg = chatInput.value.trim();
            if (!msg) return;
            chatInput.value = '';
            addStudentMsg(msg);

            if (liveChatActive) {
                saveToSession(msg);
                return;
            }

            const resp = getBotResponse(msg);
            if (resp === '__LIVE_CHAT__') {
                setTimeout(() => startLiveChat(msg), 300);
            } else {
                setTimeout(() => addBotMsg(resp), 500);
            }
        }

        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

        // ══════════════════════════════════════════════════════
        // LIVE CHAT SYSTEM
        //
        // localStorage key: gg_lc_{sessionId}
        // Structure: { id, studentName, studentMsgs:[], adminMsgs:[], ts }
        //
        // Student writes to studentMsgs[]
        // Admin writes to adminMsgs[]
        // No shared array — completely separate channels
        // ══════════════════════════════════════════════════════

        function startLiveChat(triggerMsg) {
            liveChatActive = true;
            lastSeenAdminCount = 0;

            // Generate unique session ID
            liveChatSessionId = 'lc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

            // Get student name — use email prefix if name not available
            const studentName = localStorage.getItem('gg_loggedIn') || 'Guest';

            // Create fresh session object
            const session = {
                id: liveChatSessionId,
                studentName: studentName,
                studentMsgs: [],
                adminMsgs: [],
                ts: Date.now()
            };
            localStorage.setItem('gg_lc_' + liveChatSessionId, JSON.stringify(session));

            // Update chatbot UI
            document.getElementById('ggChatTitle').textContent = '🟢 Live Support';
            document.getElementById('ggChatStatus').textContent = '● Connecting...';
            document.getElementById('ggChatAvatar').textContent = '👨‍💼';

            addBotMsg('✅ Connected to Live Support!\n\nAn admin will reply shortly.\nYou can keep typing your messages below.');

            // Save the trigger message
            saveToSession(triggerMsg);

            // Start polling for admin replies
            if (pollTimer) clearInterval(pollTimer);
            pollTimer = setInterval(checkAdminReplies, 1000);
        }

        function saveToSession(text) {
            if (!liveChatSessionId) return;
            const key = 'gg_lc_' + liveChatSessionId;
            try {
                const raw = localStorage.getItem(key);
                if (!raw) return;
                const session = JSON.parse(raw);
                session.studentMsgs.push({
                    text: text,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    ts: Date.now()
                });
                localStorage.setItem(key, JSON.stringify(session));
            } catch (e) {}
        }

        function checkAdminReplies() {
            if (!liveChatSessionId) return;
            const key = 'gg_lc_' + liveChatSessionId;
            try {
                const raw = localStorage.getItem(key);
                if (!raw) return;
                const session = JSON.parse(raw);
                const adminMsgs = session.adminMsgs || [];
                if (adminMsgs.length > lastSeenAdminCount) {
                    const newMsgs = adminMsgs.slice(lastSeenAdminCount);
                    newMsgs.forEach(m => addAdminMsg(m.text));
                    lastSeenAdminCount = adminMsgs.length;
                    document.getElementById('ggChatStatus').textContent = '● Admin is online';
                }
            } catch (e) {}
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createChatbot);
    } else {
        createChatbot();
    }
})();

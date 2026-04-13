/* =====================================================================
   🖥️ ไฟล์: js/ui.js
   หน้าที่: จัดการ UI, ป๊อปอัป, โหมดมืด/สว่าง, เปลี่ยนภาษา, และแอนิเมชันหน้าจอ
   ===================================================================== */

console.log("🎨 [START] โมดูลเริ่มทำงาน: ui.js (ระบบแอนิเมชันและหน้าต่าง UI)");

// --------------------------------------------------------------------------------
// 🌙 1. ระบบโหมดมืด / สว่าง (Dark/Light Theme)
// --------------------------------------------------------------------------------
function toggleTheme() {
    const b = document.body;
    const isDark = b.getAttribute('data-theme') === 'light'; // สลับโหมด
    b.setAttribute('data-theme', isDark ? 'dark' : 'light');

    localStorage.setItem('kruHengTheme', isDark ? 'dark' : 'light'); // 🆕 จดจำธีมลงระบบ

    // สั่งให้กราฟเรดาร์วาดสีเส้นและตัวหนังสือใหม่ให้เข้ากับโหมด
    const role = sessionStorage.getItem('kruHengRole');
    const currentUser = sessionStorage.getItem('kruHengCurrentUser');
    if (currentUser && typeof updatePlayerRadarChart === 'function') {
        const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || defaultStudentDB;
        const userNick = (role === 'guest') ? currentUser.replace('Guest_', '') : (dbStudent[currentUser] ? dbStudent[currentUser].nick : currentUser);
        updatePlayerRadarChart(userNick);
    }
}

// --------------------------------------------------------------------------------
// 🌐 2. ระบบเปลี่ยนภาษา (Language Toggle)
// --------------------------------------------------------------------------------
function toggleLang() {
    lang = lang === 'th' ? 'en' : 'th';
    localStorage.setItem('kruHengLang', lang); // 🆕 จดจำภาษาลงระบบ

    const t = {
        th: {
            title: "Mission Setup", loadLocal: "📂 โหลดจากในเครื่อง (Local)", start: "เริ่มต้นชุดข้อสอบผสม", set: "⚙️ ตั้งค่า", print: "🖨️ ปริ้นท์", hist: "📊 ประวัติฝึกฝน", ans: "เฉลย", clear: "🗑️ ล้างสถิติทั้งหมด", wrongs: "❌ รายการข้อที่ตอบผิด:", bgmMenu: "🎵 เสียงหน้าแรก (BGM Menu)", bgmQuiz: "🎵 เสียงตอนสอบ (BGM Quiz)", sfxCorrect: "🔊 เอฟเฟกต์ (ถูก)", sfxWrong: "🔊 เอฟเฟกต์ (ผิด/หมดเวลา)", sfxTick: "🔊 เอฟเฟกต์ (นับเวลา)", volume: "🎛️ ตั้งค่าเสียงขั้นสูง (แยกอิสระ) และรูปแบบ BGM", testVol: "ทดสอบ SFX",
            btnTheme: "🌙 โหมดสี", btnPause: typeof paused !== 'undefined' && paused ? "▶️ เล่นต่อ" : "⏸️ พักเวลา", btnPauseIn: typeof paused !== 'undefined' && paused ? "▶️ เล่นต่อ" : "⏸️ พัก", btnNext: "ถัดไป ➡️", btnSuspend: "💾 พักไว้ทำต่อ", btnLogout: "🚪 ออกระบบ", btnEditStu: "⚙️ จัดการนร.", btnEditExams: "📁 จัดการข้อสอบ", uiEditTitle: "🛠️ จัดการข้อมูลนักเรียน (Master Only)", uiExamEditTitle: "📁 จัดการไฟล์ข้อสอบ (Master Only)", uiAccessTitle: "🔑 กำหนดสิทธิ์เข้าถึงข้อสอบ", btnAddStu: "➕ เพิ่มนักเรียน", btnSaveStu: "💾 บันทึกทั้งหมด", btnAddExam: "➕ เพิ่มข้อสอบ", btnSaveExam: "💾 บันทึกทั้งหมด", btnAccSave: "💾 ยืนยันสิทธิ์", btnAccCancel: "❌ ยกเลิก", thEditUser: "Username", thEditPass: "Password", thEditNick: "ชื่อเล่น", thEditGrade: "ระดับชั้น", thEditSch: "โรงเรียน", thEditNote: "หมายเหตุ", thEditPerm: "สิทธิ์ (ปริ้นท์/สุ่ม/พัก)", thEditStart: "วันที่เริ่ม", thEditExp: "วันหมดอายุ", thEditUpdate: "อัปเดตล่าสุด", thEditAct: "ลบ", thEditCat: "หมวดหมู่", labelAccAll: "🌟 ให้ทุกคนเข้าถึงได้ (All Students / *)", labelAccFree: "🆓 โหมดทดลองใช้งานฟรี (Free Trial Mode)", labelAccSpec: "ระบุนักเรียนเฉพาะบุคคล (Specific Students):",
            lShuffle: "🔀 ลำดับข้อสอบ", lTimer: "⏲️ ตัวจับเวลา", lTimePer: "⏳ วินาทีต่อข้อ", lAuto: "🚀 เปลี่ยนข้ออัตโนมัติ", lDelay: "⏳ หน่วงเวลา (วิ)", lPause: "⏸️ การพักเวลา", lPrintTopic: "📑 แสดงหัวข้อและสกิล", lPrintDiff: "🌟 แสดงความยาก (Print)", lPrint: "🖨️ รูปแบบการปริ้นท์",
            lPrintLoc: "📍 ตำแหน่งเฉลย (Print)", optPrintLocInline: "เฉลยท้ายข้อ", optPrintLocEnd: "รวมไว้หน้าสุดท้าย",
            thName: "ชื่อชุดข้อสอบ", thTotal: "ข้อทั้งหมด", thPick: "เลือกดึง (ข้อ)", thAct: "จัดการ",
            thDate: "วันที่", thStudent: "ผู้สอบ", thSet: "ชุด", thScore: "คะแนน", thRes: "ถูก/ผิด", thTime: "เริ่ม-จบ", thHistAct: "จัดการ",
            uiSuspTitle: "⏳ รายการพักทำข้อสอบ", thSuspDate: "วันที่เริ่ม", thSuspStudent: "ผู้สอบ", thSuspSet: "ชื่อชุดข้อสอบ", thSuspProg: "ทำถึงข้อที่", thSuspAct: "จัดการ",
            btnPrintDirect: "🖨️ ปริ้นท์ใบงาน", btnTestSum: "🔍 Test Summary UI", uiSumDone: "🎊 จบการฝึกฝน", uiSumAnal: "📊 วิเคราะห์รายระดับชั้น:", btnHome: "🏠 หน้าหลัก",
            smallVolBgmMenu: "ระดับเสียง BGM เมนู", smallVolBgmQuiz: "ระดับเสียง BGM สอบ", smallVolSfxCorrect: "ระดับเสียง SFX ถูก", smallVolSfxWrong: "ระดับเสียง SFX ผิด/หมดเวลา", smallVolSfxTick: "ระดับเสียง SFX นับเวลา",
            labelBgmPlayModeTitle: "⚙️ ระบบเล่น BGM / ทดสอบ",
            lSumScore: "คะแนนรวม", lSumC: "ถูกต้อง", lSumP: "แม่นยำ",
            thSumLvl: "ม./เทอม", thSumCor: "ถูก", thSumWr: "ผิด", thSumTot: "รวม",
            thErrNo: "ข้อที่", thErrLvl: "ม./เทอม", thErrTopic: "เนื้อหา", thErrQ: "โจทย์", thErrAns: "เฉลยที่ถูก",
            sun: "ดวงอาทิตย์", mercury: "พุธ", venus: "ศุกร์", earth: "โลก", mars: "อังคาร", jupiter: "พฤหัสบดี", saturn: "เสาร์", uranus: "ยูเรนัส", neptune: "เนปจูน", asteroid: "แถบดาวเคราะห์น้อย", kuiper: "แถบไคเปอร์",
            loginTitle: "ระบบรักษาความปลอดภัย", loginUser: "Username (ชื่อผู้ใช้งาน)", loginPass: "Password (รหัสผ่าน)", loginBtn: "เข้าสู่ระบบ / Login", loginErr: "❌ ข้อมูลไม่ถูกต้อง!",
            uiLogTitle: "📝 System Logs (ประวัติระบบ)", btnClearLogs: "🗑️ ล้าง Log ทั้งหมด",
            uiCloudTitle: "☁️ คลังข้อสอบบนระบบ (Server Exams)", uiCloudDesc: "เลือกชุดข้อสอบที่ต้องการทำ จากนั้นกดปุ่มดึงข้อมูล", btnLoadServer: "📥 โหลดชุดข้อสอบ",
            uiQuestTitle: "📜 เควสประจำวัน (Daily)", uiQuestDesc: "ทำข้อสอบคณิตศาสตร์ 1 ชุด (0/1)", uiAchieveTitle: "🏆 เหรียญตรา (Achievements)", badge1: "First Blood: ทำข้อสอบครั้งแรก", badge2: "ยังไม่ปลดล็อค (ทำได้ 100% 3 ครั้งติด)", badge3: "ยังไม่ปลดล็อค (ทำเควสครบ 7 วัน)", badge4: "ยังไม่ปลดล็อค (สอบคณิต 10 ชุด)",
            tabLogin: "ล็อคอินสมาชิก", tabGuest: "ทดลองใช้ฟรี",
            guestName: "ชื่อ-นามสกุล / ชื่อเล่น", guestRoleDef: "-- เลือกสถานะผู้ใช้งาน --", guestRoleStu: "นักเรียน", guestRoleTeach: "อาจารย์", guestRolePar: "ผู้ปกครอง", guestRoleOth: "อื่นๆ",
            guestGrade: "ระดับชั้น", guestSch: "ชื่อสถานศึกษา", guestChild: "ชื่อนักเรียน (บุตรหลาน)", guestSpec: "โปรดระบุว่าท่านคือใคร...", guestSoc: "ช่องทางโซเชียลมีเดีย (ไม่บังคับ)", guestBtn: "เริ่มทดลองใช้งานฟรี"
        },
        en: {
            title: "Mission Setup", loadLocal: "📂 Load from Device (Local)", start: "Start Mixed Exam", set: "⚙️ Settings", print: "🖨️ Print", hist: "📊 History", ans: "Answer", clear: "🗑️ Reset All Stats", wrongs: "❌ Incorrect Answers List:", bgmMenu: "🎵 Menu BGM", bgmQuiz: "🎵 Quiz BGM", sfxCorrect: "🔊 SFX (Correct)", sfxWrong: "🔊 SFX (Wrong/Timeout)", sfxTick: "🔊 SFX (Countdown)", volume: "🎛️ Advanced Audio Settings & BGM", testVol: "Test SFX",
            btnTheme: "🌙 Theme", btnPause: typeof paused !== 'undefined' && paused ? "▶️ Resume" : "⏸️ Pause", btnPauseIn: typeof paused !== 'undefined' && paused ? "▶️ Resume" : "⏸️ Pause", btnNext: "Next ➡️", btnSuspend: "💾 Save & Exit", btnLogout: "🚪 Logout", btnEditStu: "⚙️ Manage Stu.", btnEditExams: "📁 Manage Exams", uiEditTitle: "🛠️ Student Data Management (Master Only)", uiExamEditTitle: "📁 Exam Files Management (Master Only)", uiAccessTitle: "🔑 Set Access Permissions", btnAddStu: "➕ Add Student", btnSaveStu: "💾 Save All", btnAddExam: "➕ Add Exam", btnSaveExam: "💾 Save All", btnAccSave: "💾 Confirm Access", btnAccCancel: "❌ Cancel", thEditUser: "Username", thEditPass: "Password", thEditNick: "Nickname", thEditGrade: "Grade", thEditSch: "School", thEditNote: "Note", thEditPerm: "Permissions (Print/Shuffle/Pause)", thEditStart: "Start Date", thEditExp: "Expire Date", thEditUpdate: "Last Updated", thEditAct: "Del", thEditCat: "Category", labelAccAll: "🌟 Allow All Students (*)", labelAccFree: "🆓 Free Trial Mode", labelAccSpec: "Specific Students:",
            lShuffle: "🔀 Question Order", lTimer: "⏲️ Timer", lTimePer: "⏳ Sec per Question", lAuto: "🚀 Auto Next", lDelay: "⏳ Delay (sec)", lPause: "⏸️ Pause Mode", lPrintTopic: "📑 Show Topic & Skill", lPrintDiff: "🌟 Show Difficulty (Print)", lPrint: "🖨️ Print Format",
            lPrintLoc: "📍 Answer Location (Print)", optPrintLocInline: "Inline (After Question)", optPrintLocEnd: "Last Page (Grouped)",
            thName: "Exam Title", thTotal: "Total Qs", thPick: "Pick (Qs)", thAct: "Action",
            thDate: "Date", thStudent: "Student", thSet: "Set", thScore: "Score", thRes: "Correct/Wrong", thTime: "Time", thHistAct: "Action",
            uiSuspTitle: "⏳ Suspended Exams", thSuspDate: "Start Date", thSuspStudent: "Student", thSuspSet: "Exam Title", thSuspProg: "Progress", thSuspAct: "Action",
            btnPrintDirect: "🖨️ Print Worksheet", btnTestSum: "🔍 Test Summary UI", uiSumDone: "🎊 Training Complete", uiSumAnal: "📊 Level Analysis:", btnHome: "🏠 Home",
            smallVolBgmMenu: "Menu BGM Vol", smallVolBgmQuiz: "Quiz BGM Vol", smallVolSfxCorrect: "Correct SFX Vol", smallVolSfxWrong: "Wrong/Timeout SFX Vol", smallVolSfxTick: "Countdown SFX Vol",
            labelBgmPlayModeTitle: "⚙️ BGM Play Mode / Test",
            lSumScore: "Total Score", lSumC: "Correct", lSumP: "Accuracy",
            thSumLvl: "Grade/Term", thSumCor: "Correct", thSumWr: "Wrong", thSumTot: "Total",
            thErrNo: "No.", thErrLvl: "Grade/Term", thErrTopic: "Topic", thErrQ: "Question", thErrAns: "Correct Ans",
            sun: "Sun", mercury: "Mercury", venus: "Venus", earth: "Earth", mars: "Mars", jupiter: "Jupiter", saturn: "Saturn", uranus: "Uranus", neptune: "Neptune", asteroid: "Asteroid Belt", kuiper: "Kuiper Belt",
            loginTitle: "Security System", loginUser: "Username", loginPass: "Password", loginBtn: "Login", loginErr: "❌ Invalid Info!",
            uiLogTitle: "📝 System Logs", btnClearLogs: "🗑️ Clear All Logs",
            uiCloudTitle: "☁️ Server Exams Database", uiCloudDesc: "Select the exams you want to take, then click load.", btnLoadServer: "📥 Load Exam Sets",
            uiQuestTitle: "📜 Daily Quests", uiQuestDesc: "Complete 1 Math Exam (0/1)", uiAchieveTitle: "🏆 Achievements", badge1: "First Blood: Take your first exam", badge2: "Locked (Get 100% 3 times in a row)", badge3: "Locked (Complete quests for 7 days)", badge4: "Locked (Complete 10 Math exams)",
            tabLogin: "Member Login", tabGuest: "Free Trial",
            guestName: "Full Name / Nickname", guestRoleDef: "-- Select Role --", guestRoleStu: "Student", guestRoleTeach: "Teacher", guestRolePar: "Parent", guestRoleOth: "Other",
            guestGrade: "Grade Level", guestSch: "School Name", guestChild: "Child's Name", guestSpec: "Please specify who you are...", guestSoc: "Social Contact (Optional)", guestBtn: "Start Free Trial"
        }
    }[lang];

    // --- Helper Functions สำหรับจัดการ DOM ให้โค้ดสะอาดขึ้น ---
    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };
    const setHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
    const setPlaceholder = (id, text) => { const el = document.getElementById(id); if (el) el.placeholder = text; };
    const setTitle = (id, text) => { const el = document.getElementById(id); if (el) el.title = text; };
    const setOptionsText = (id, texts) => {
        const el = document.getElementById(id);
        if (el && el.options) texts.forEach((txt, i) => { if (el.options[i]) el.options[i].text = txt; });
    };

    // --- อัปเดต Dropdowns (Select Options) ---
    if (lang === 'th') {
        setOptionsText('set-shuffle', ["เรียงลำดับตามชุดข้อสอบแต่ละชุดเรียงลำดับตามข้อ", "เรียงลำดับตามชุดข้อสอบแต่ละชุดสุ่มข้อ", "สุ่มชุดแต่ละชุดข้อสอบเรียงลำดับตามข้อ", "สุ่มชุดข้อสอบแต่ละชุดสุ่มข้อ"]);
        setOptionsText('set-use-timer', ["เปิด", "ปิด"]);
        setOptionsText('set-use-delay', ["เปิดใช้งาน", "ปิด"]);
        setOptionsText('set-pause-hide', ["พรางโจทย์", "ไม่พราง"]);
        setOptionsText('set-print-topic', ["แสดง", "ซ่อน"]);
        setOptionsText('set-print-diff', ["แสดง", "ซ่อน"]);
        setOptionsText('set-print-ans', ["ตัวเลือก ก ข ค ง (ไม่เฉลย)", "ตัวเลือก + เฉลย", "ตัวเลือก + เฉลย + วิธีทำ"]);
        setOptionsText('set-print-ans-loc', [t.optPrintLocInline, t.optPrintLocEnd]);
        setOptionsText('bgm-play-mode', ["เรียงตามลำดับ", "สุ่มเพลง"]);
        setOptionsText('log-filter', ["ทั้งหมด (All)", "🚪 เข้า-ออกระบบ", "📝 การเรียน-สอบ", "⚙️ จัดการระบบ", "🎮 เกมมิฟิเคชัน"]);
        
        const onOffTh = ["เปิด", "ปิด"];
        ['set-bgm-menu', 'set-bgm-quiz', 'set-sfx-correct', 'set-sfx-wrong', 'set-sfx-tick'].forEach(id => setOptionsText(id, onOffTh));
    } else {
        setOptionsText('set-shuffle', ["Order Sets - Order Questions", "Order Sets - Shuffle Questions", "Shuffle Sets - Order Questions", "Shuffle Sets - Shuffle Questions"]);
        setOptionsText('set-use-timer', ["On", "Off"]);
        setOptionsText('set-use-delay', ["Enable", "Disable"]);
        setOptionsText('set-pause-hide', ["Hide Question", "Show Question"]);
        setOptionsText('set-print-topic', ["Show", "Hide"]);
        setOptionsText('set-print-diff', ["Show", "Hide"]);
        setOptionsText('set-print-ans', ["Choices A B C D (No Answer)", "Choices + Answer", "Choices + Answer + Explanation"]);
        setOptionsText('set-print-ans-loc', [t.optPrintLocInline, t.optPrintLocEnd]);
        setOptionsText('bgm-play-mode', ["Sequential", "Random"]);
        setOptionsText('log-filter', ["All", "🚪 Access (Logins)", "📝 Learning/Exams", "⚙️ Admin/Manage", "🎮 Gamification"]);
        
        const onOffEn = ["On", "Off"];
        ['set-bgm-menu', 'set-bgm-quiz', 'set-sfx-correct', 'set-sfx-wrong', 'set-sfx-tick'].forEach(id => setOptionsText(id, onOffEn));
    }

    // --- อัปเดต UI Texts (ปุ่มและข้อความทั่วไป) ---
    setText('ui-title', t.title);
    setText('ui-btn-start', t.start);
    setText('btn-set', t.set);
    setText('btn-print', t.print);
    setText('ui-hist-title', t.hist);
    setText('ui-ans-label', t.ans);
    setText('btn-clear-hist', t.clear);
    setText('ui-sum-wrongs', t.wrongs);
    setText('btn-theme', t.btnTheme);
    setHTML('pause-btn', t.btnPause);
    setHTML('pause-btn-in', t.btnPauseIn);
    setText('manual-next-btn', t.btnNext);
    setText('btn-print-direct', t.btnPrintDirect);
    setText('btn-test-sum', t.btnTestSum);
    setText('btn-home', t.btnHome);
    setText('btn-test-vol', t.testVol);

    // --- อัปเดต Labels (ตั้งค่า) ---
    setText('label-shuffle', t.lShuffle);
    setText('label-timer', t.lTimer);
    setText('label-time-per', t.lTimePer);
    setText('label-auto', t.lAuto);
    setText('label-delay-time', t.lDelay);
    setText('label-pause', t.lPause);
    setText('label-print-topic', t.lPrintTopic);
    setText('label-print-diff', t.lPrintDiff);
    setText('label-print', t.lPrint);
    setText('label-print-loc', t.lPrintLoc);
    setText('label-volume', t.volume);
    setText('label-bgm-play-mode-title', t.labelBgmPlayModeTitle);
    setText('small-vol-bgm-menu', t.smallVolBgmMenu);
    setText('small-vol-bgm-quiz', t.smallVolBgmQuiz);
    setText('small-vol-sfx-correct', t.smallVolSfxCorrect);
    setText('small-vol-sfx-wrong', t.smallVolSfxWrong);
    setText('small-vol-sfx-tick', t.smallVolSfxTick);

    // --- อัปเดต Table Headers (ตาราง) ---
    setText('th-name', t.thName); setText('th-total', t.thTotal);
    setText('th-pick', t.thPick); setText('th-act', t.thAct);
    setText('th-date', t.thDate); setText('th-student', t.thStudent);
    setText('th-set', t.thSet); setText('th-score', t.thScore);
    setText('th-res', t.thRes); setText('th-time', t.thTime);
    setText('th-hist-act', t.thHistAct);

    // --- อัปเดต UI สรุปผลสอบ ---
    setText('ui-sum-done', t.uiSumDone);
    setText('ui-sum-anal', t.uiSumAnal);
    setText('label-sum-score', t.lSumScore);
    setText('label-sum-c', t.lSumC);
    setText('label-sum-p', t.lSumP);
    setText('th-sum-lvl', t.thSumLvl); setText('th-sum-cor', t.thSumCor);
    setText('th-sum-wr', t.thSumWr); setText('th-sum-tot', t.thSumTot);
    setText('th-err-no', t.thErrNo); setText('th-err-lvl', t.thErrLvl);
    setText('th-err-topic', t.thErrTopic); setText('th-err-q', t.thErrQ);
    setText('th-err-ans', t.thErrAns);

    // --- อัปเดตดาวเคราะห์ (Gamification) ---
    setText('label-sun', t.sun); setText('label-mercury', t.mercury);
    setText('label-venus', t.venus); setText('label-earth', t.earth);
    setText('label-mars', t.mars); setText('label-jupiter', t.jupiter);
    setText('label-saturn', t.saturn); setText('label-uranus', t.uranus);
    setText('label-neptune', t.neptune); setText('label-asteroid', t.asteroid);
    setText('label-kuiper', t.kuiper);

    // --- อัปเดต Gamer Stats, Mastery, Quests & Suspends ---
    if (document.getElementById('ui-radar-title')) {
        setText('ui-radar-title', lang === 'th' ? "🌟 สเตตัสผู้เล่น (Gamer Stats)" : "🌟 Gamer Stats");
        if (window.playerChart) {
            window.playerChart.data.labels = lang === 'th' ? ['แม่นยำ', 'ความไว', 'ความอึด', 'สม่ำเสมอ', 'ความจำ', 'คริติคอล'] : ['Accuracy', 'Agility', 'Endurance', 'Consistency', 'Memory', 'Critical'];
            window.playerChart.data.datasets[0].label = lang === 'th' ? 'สเตตัส' : 'Stats';
            window.playerChart.update();
        }
    }

    setText('ui-math-mastery-title', lang === 'th' ? '📐 สกิลคณิตศาสตร์' : '📐 Math Skill');
    setText('ui-sci-mastery-title', lang === 'th' ? '🔬 สกิลวิทยาศาสตร์ ' : '🔬 Science Skill');
    setText('ui-psycho-mastery-title', lang === 'th' ? '🧠 สกิลจิตวิทยา' : '🧠 Psychology Skill');
    setText('ui-comp-mastery-title', lang === 'th' ? '💻 สกิลการเขียนโปรแกรมคอมพิวเตอร์' : '💻 Computer Programming Skill');

    const currentUserExp = sessionStorage.getItem('kruHengCurrentUser');
    if (currentUserExp) {
        const roleExp = sessionStorage.getItem('kruHengRole');
        const dbStudentExp = JSON.parse(localStorage.getItem('kruHengStudentDB')) || (typeof defaultStudentDB !== 'undefined' ? defaultStudentDB : {});
        const userNickExp = (roleExp === 'guest') ? currentUserExp.replace('Guest_', '') : (currentUserExp && dbStudentExp[currentUserExp] ? dbStudentExp[currentUserExp].nick : currentUserExp);
        if (typeof updateSubjectEXP === 'function') updateSubjectEXP(userNickExp);
    }

    if (document.getElementById('ui-quest-title')) {
        setText('ui-quest-title', t.uiQuestTitle);
        setText('ui-quest-desc', t.uiQuestDesc);
        setText('ui-achieve-title', t.uiAchieveTitle);
        setTitle('badge-1', t.badge1); setTitle('badge-2', t.badge2);
        setTitle('badge-3', t.badge3); setTitle('badge-4', t.badge4);
    }

    setText('ui-susp-title', t.uiSuspTitle);
    setText('th-susp-date', t.thSuspDate); setText('th-susp-student', t.thSuspStudent);
    setText('th-susp-set', t.thSuspSet); setText('th-susp-prog', t.thSuspProg);
    setText('th-susp-act', t.thSuspAct);

    setHTML('suspend-btn', t.btnSuspend);
    setHTML('btn-logout', t.btnLogout);
    setHTML('btn-edit-students', t.btnEditStu);
    setHTML('btn-edit-exams', t.btnEditExams);

    // --- อัปเดตระบบ Cloud Exams ---
    if (document.getElementById('ui-btn-load-local')) {
        setText('ui-btn-load-local', t.loadLocal);
        setText('ui-cloud-title', t.uiCloudTitle);
        setText('ui-cloud-desc', t.uiCloudDesc);
        setText('btn-load-server', t.btnLoadServer);
    }

    // --- อัปเดตหน้าระบบจัดการ/Login ---
    if (document.getElementById('login-title')) {
        setHTML('login-title', `<span style="-webkit-text-fill-color: initial; display: inline-block;">🔒</span> <span class="brand-text">${t.loginTitle}</span>`);
        setPlaceholder('login-user', t.loginUser);
        setPlaceholder('login-pass', t.loginPass);
        setText('login-btn', t.loginBtn);
        setText('login-error', t.loginErr);
        
        setText('ui-log-title', t.uiLogTitle);
        setHTML('btn-clear-logs', t.btnClearLogs);

        setText('ui-edit-title', t.uiEditTitle);
        setHTML('btn-add-stu', t.btnAddStu);
        setHTML('btn-save-stu', t.btnSaveStu);

        setText('ui-exam-edit-title', t.uiExamEditTitle);
        setHTML('btn-add-exam', t.btnAddExam);
        setHTML('btn-save-exam', t.btnSaveExam);

        setText('ui-access-title', t.uiAccessTitle);
        setHTML('btn-acc-save', t.btnAccSave);
        setHTML('btn-acc-cancel', t.btnAccCancel);
        setText('label-acc-all', t.labelAccAll);
        setText('label-acc-free', t.labelAccFree);
        setText('label-acc-spec', t.labelAccSpec);

        setText('th-edit-user', t.thEditUser); setText('th-edit-pass', t.thEditPass);
        setText('th-edit-nick', t.thEditNick); setText('th-edit-grade', t.thEditGrade);
        setText('th-edit-school', t.thEditSch); setText('th-edit-note', t.thEditNote);
        setText('th-edit-perm', t.thEditPerm); setText('th-edit-start', t.thEditStart);
        setText('th-edit-exp', t.thEditExp); setText('th-edit-update', t.thEditUpdate);
        setText('th-edit-act', t.thEditAct); setText('th-edit-cat', t.thEditCat);

        setText('tab-login', t.tabLogin);
        setText('tab-guest', t.tabGuest);
        setPlaceholder('guest-name', t.guestName);
        setPlaceholder('guest-school', t.guestSch);
        setPlaceholder('guest-child-name', t.guestChild);
        setPlaceholder('guest-specify', t.guestSpec);
        setPlaceholder('guest-social', t.guestSoc);
        setText('guest-btn', t.guestBtn);
        setOptionsText('guest-role', [t.guestRoleDef, t.guestRoleStu, t.guestRoleTeach, t.guestRolePar, t.guestRoleOth]);
    }

    setText('pause-overlay', lang === 'th' ? 'พักเวลา' : 'PAUSED');

    // อัปเดตฟังก์ชันต่างๆ เพื่อรีเฟรชหน้าจอ
    if (typeof updateFileListUI === 'function') updateFileListUI();
    if (typeof loadSessions === 'function') loadSessions();
    if (typeof loadLogs === 'function') loadLogs();
    if (typeof renderProfileBadge === 'function') renderProfileBadge();
    if (typeof renderServerExamList === 'function') renderServerExamList();
    if (typeof populateStatsMonthDropdown === 'function') populateStatsMonthDropdown();
}

// --------------------------------------------------------------------------------
// 🔄 3. สลับแท็บ Login / Guest
// --------------------------------------------------------------------------------
function switchLoginTab(tab) {
    const isLogin = tab === 'login';
    document.getElementById('tab-login').classList.toggle('active', isLogin);
    document.getElementById('tab-guest').classList.toggle('active', !isLogin);
    document.getElementById('form-login').style.display = isLogin ? 'block' : 'none';
    document.getElementById('form-guest').style.display = isLogin ? 'none' : 'block';
}

// --------------------------------------------------------------------------------
// 📝 4. ซ่อน/แสดง ฟิลด์ตาม Role ของ Guest
// --------------------------------------------------------------------------------
function toggleGuestFields() {
    const role = document.getElementById('guest-role').value;
    const isSchoolRelated = ['นักเรียน', 'student', 'อาจารย์', 'teacher', 'ผู้ปกครอง', 'parent'].includes(role);
    const isParent = ['ผู้ปกครอง', 'parent'].includes(role);
    const isOther = ['อื่นๆ', 'other'].includes(role);

    document.getElementById('guest-extra-school').style.display = isSchoolRelated ? 'block' : 'none';
    document.getElementById('guest-extra-parent').style.display = isParent ? 'block' : 'none';
    document.getElementById('guest-extra-other').style.display = isOther ? 'block' : 'none';
}

// --------------------------------------------------------------------------------
// ❌ 5. แสดง Error ของการ Login
// --------------------------------------------------------------------------------
function showLoginError(msg) {
    const err = document.getElementById('login-error');
    err.style.display = 'block';
    err.innerText = msg;
    err.classList.remove('shake-anim');
    void err.offsetWidth; // Trigger reflow เพื่อให้ animation ทำงานซ้ำได้
    err.classList.add('shake-anim');
}

// --------------------------------------------------------------------------------
// 👤 6. เปิด/ปิด เมนูโปรไฟล์
// --------------------------------------------------------------------------------
function toggleProfileMenu(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('profile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');

    menu.classList.toggle('show');
    if (overlay) overlay.classList.toggle('show');
}

// --------------------------------------------------------------------------------
// 🖱️ 7. กดพื้นที่ว่างเพื่อปิดเมนูโปรไฟล์
// --------------------------------------------------------------------------------
document.addEventListener('click', function (e) {
    const menu = document.getElementById('profile-menu');
    const chip = document.getElementById('profile-chip');
    const overlay = document.getElementById('mobile-menu-overlay');

    if (menu && menu.classList.contains('show') && !menu.contains(e.target) && (!chip || !chip.contains(e.target))) {
        menu.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
    }
});

// --------------------------------------------------------------------------------
// ⚙️ 8. เปิดหน้าต่างจัดการนักเรียน (Student Editor)
// --------------------------------------------------------------------------------
function openStudentEditor() {
    tempStudentDB = JSON.parse(localStorage.getItem('kruHengStudentDB')) || defaultStudentDB;
    if (typeof renderStudentEditorTable === 'function') renderStudentEditorTable();
    document.getElementById('student-editor-overlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// --------------------------------------------------------------------------------
// 🚪 9. ปิดหน้าต่างจัดการนักเรียน
// --------------------------------------------------------------------------------
function closeStudentEditor() {
    document.getElementById('student-editor-overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// --------------------------------------------------------------------------------
// ✨ 10. ฟังก์ชันเปิดอ่านรายละเอียดการได้ EXP
// --------------------------------------------------------------------------------
function openExpInfo() {
    const title = lang === 'th' ? '✨ EXP · เลเวล · แรงค์' : '✨ EXP · Level · Rank';

    const rankTableTh = `
        <table style="width:100%; border-collapse:collapse; font-size:0.88rem; margin-top:8px;">
            <thead>
                <tr style="background:rgba(0,0,0,0.08);">
                    <th style="padding:5px 8px; text-align:left; border-radius:6px 0 0 0;">แรงค์</th>
                    <th style="padding:5px 8px; text-align:center;">เลเวล</th>
                    <th style="padding:5px 8px; text-align:left; border-radius:0 6px 0 0;">หมายเหตุ</th>
                </tr>
            </thead>
            <tbody>
                <tr><td style="padding:4px 8px;"><span style="background:#9e9e9e;color:#fff;padding:1px 8px;border-radius:8px;font-weight:900;">★ E-Rank</span></td><td style="text-align:center;">1 – 4</td><td>ผู้เริ่มต้น</td></tr>
                <tr style="background:rgba(0,0,0,0.03);"><td style="padding:4px 8px;"><span style="background:#4caf50;color:#fff;padding:1px 8px;border-radius:8px;font-weight:900;">★ D-Rank</span></td><td style="text-align:center;">5 – 9</td><td>กำลังเติบโต</td></tr>
                <tr><td style="padding:4px 8px;"><span style="background:#2196f3;color:#fff;padding:1px 8px;border-radius:8px;font-weight:900;">★ C-Rank</span></td><td style="text-align:center;">10 – 14</td><td>มีฝีมือ</td></tr>
                <tr style="background:rgba(0,0,0,0.03);"><td style="padding:4px 8px;"><span style="background:#9c27b0;color:#fff;padding:1px 8px;border-radius:8px;font-weight:900;">★ B-Rank</span></td><td style="text-align:center;">15 – 29</td><td>ขั้นสูง</td></tr>
                <tr><td style="padding:4px 8px;"><span style="background:#ff9800;color:#fff;padding:1px 8px;border-radius:8px;font-weight:900;">★ A-Rank</span></td><td style="text-align:center;">30 – 59</td><td>เจ้าของสนาม</td></tr>
                <tr style="background:rgba(0,0,0,0.03);"><td style="padding:4px 8px;"><span style="background:#ffd700;color:#fff;padding:1px 8px;border-radius:8px;font-weight:900;">★ S-Rank</span></td><td style="text-align:center;">60 – 99</td><td>ใกล้จุดสูงสุด</td></tr>
                <tr><td style="padding:4px 8px;"><span class="rank-monarchs" style="padding:1px 8px;border-radius:8px;font-weight:900;">👑 Monarchs[n]</span></td><td style="text-align:center;">ทุกเลเวล</td><td>จุติแล้ว (Rebirth)</td></tr>
                <tr style="background:rgba(0,0,0,0.03);"><td style="padding:4px 8px;"><span class="rank-monarchs" style="padding:1px 8px;border-radius:8px;font-weight:900;">⚜️ Master</span></td><td style="text-align:center;">99</td><td>ผู้ดูแลระบบ</td></tr>
            </tbody>
        </table>`;

    const content = lang === 'th' ? `
        <div style="background:rgba(112,0,255,0.06); padding:14px; border-radius:10px; border-left:4px solid var(--accent); margin-bottom:10px;">
            <b>🏅 ระบบแรงค์ (Rank System)</b>
            ${rankTableTh}
            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">* Monarchs[n] — จุติครั้งที่ n (ต้องการ 100,000 EXP ต่อครั้ง)</div>
        </div>
        <div style="background: rgba(0, 200, 83, 0.05); padding: 15px; border-radius: 10px; border-left: 4px solid var(--success); margin-bottom: 10px;">
            <b>1. ระดับชั้นของข้อสอบ (Base EXP):</b><br>
            ยิ่งทำข้อสอบระดับชั้นสูง ยิ่งได้ EXP พื้นฐานเยอะ เช่น ม.6 ได้ 400 แต้ม, ม.3 ได้ 200 แต้ม, ป.1 ได้ 10 แต้ม
        </div>
        <div style="background: rgba(0, 240, 255, 0.05); padding: 15px; border-radius: 10px; border-left: 4px solid var(--secondary); margin-bottom: 10px;">
            <b>2. ความยากของข้อสอบ (Difficulty Bonus):</b><br>
            ข้อสอบที่มีป้ายกำกับว่า 'ยาก' หรือ 'แข่งขัน' จะได้รับโบนัสคูณเพิ่ม (×1.2 ถึง ×1.3)
        </div>
        <div style="background: rgba(255, 0, 127, 0.05); padding: 15px; border-radius: 10px; border-left: 4px solid var(--primary); margin-bottom: 10px;">
            <b>3. กฎการข้ามรุ่น (Level Gap Penalty):</b><br>
            ถ้าเลเวลสูงแล้วแต่ทำข้อสอบรุ่นเล็ก EXP จะถูกหักอย่างมาก (เหลือเพียง 1% ในกรณีห่างกัน 3 กลุ่มขึ้นไป)
        </div>
        <div style="background: rgba(112, 0, 255, 0.05); padding: 15px; border-radius: 10px; border-left: 4px solid var(--accent); margin-bottom: 0;">
            <b>4. ความแม่นยำ (Accuracy):</b><br>
            EXP ที่คำนวณได้จะถูกคูณด้วย % ความถูกต้อง — ตอบถูก 100% รับ EXP เต็ม!
        </div>
    ` : `
        <div style="background:rgba(112,0,255,0.06); padding:14px; border-radius:10px; border-left:4px solid var(--accent); margin-bottom:10px;">
            <b>🏅 Rank System</b>
            ${rankTableTh}
            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">* Monarchs[n] — rebirth round n (requires 100,000 EXP each time)</div>
        </div>
        <div style="background: rgba(0, 200, 83, 0.05); padding: 15px; border-radius: 10px; border-left: 4px solid var(--success); margin-bottom: 10px;">
            <b>1. Exam Level (Base EXP):</b><br>
            Higher grade exams yield more base EXP. E.g., M.6 = 400 pts, M.3 = 200 pts, P.1 = 10 pts.
        </div>
        <div style="background: rgba(0, 240, 255, 0.05); padding: 15px; border-radius: 10px; border-left: 4px solid var(--secondary); margin-bottom: 10px;">
            <b>2. Difficulty Bonus:</b><br>
            Exams tagged as 'Hard' or 'Extreme' multiply your EXP by ×1.2 – ×1.3.
        </div>
        <div style="background: rgba(255, 0, 127, 0.05); padding: 15px; border-radius: 10px; border-left: 4px solid var(--primary); margin-bottom: 10px;">
            <b>3. Level Gap Penalty:</b><br>
            High-level players taking very low-level exams face a severe EXP penalty (down to 1% if 3+ groups apart).
        </div>
        <div style="background: rgba(112, 0, 255, 0.05); padding: 15px; border-radius: 10px; border-left: 4px solid var(--accent); margin-bottom: 0;">
            <b>4. Accuracy:</b><br>
            Final EXP is multiplied by your correctness %. Score 100% to earn maximum EXP!
        </div>
    `;
    
    const titleEl = document.getElementById('exp-info-title');
    const bodyEl = document.getElementById('exp-info-body');
    const overlay = document.getElementById('exp-info-overlay');
    
    if (titleEl) titleEl.innerText = title;
    if (bodyEl) bodyEl.innerHTML = content;
    if (overlay) overlay.style.display = 'flex';
}

// --------------------------------------------------------------------------------
// 🔽 11. เปิด/ปิด Accordion
// --------------------------------------------------------------------------------
function toggleAccordion(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('active');
}

// --------------------------------------------------------------------------------
// 🚪 12. ปิดหน้าต่างเลือกโฟลเดอร์ข้อสอบย่อย
// --------------------------------------------------------------------------------
function closeSubfolderPopup() {
    const overlay = document.getElementById('subfolder-popup-overlay');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// --------------------------------------------------------------------------------
// 🔄 13. อัปเดตตัวเลขบนปุ่ม Load Server Exam
// --------------------------------------------------------------------------------
function updateLoadButtonUI() {
    const btn = document.getElementById('btn-load-server');
    if (!btn || !window.selectedServerExamData) return;
    
    const count = window.selectedServerExamData.size;
    btn.innerHTML = lang === 'th'
        ? `📥 โหลดชุดข้อสอบ <span style="background: white; color: var(--primary); padding: 2px 8px; border-radius: 20px; font-size: 0.9rem; margin-left: 5px;">${count}</span>`
        : `📥 Load Exam Sets <span style="background: white; color: var(--primary); padding: 2px 8px; border-radius: 20px; font-size: 0.9rem; margin-left: 5px;">${count}</span>`;
}

// --------------------------------------------------------------------------------
// 🔍 14. แสดง Dropdown ค้นหาชื่อนักเรียน
// --------------------------------------------------------------------------------
function showNameDropdown() {
    const currentUser = sessionStorage.getItem('kruHengCurrentUser');
    if (currentUser && currentUser !== (typeof masterID !== 'undefined' ? masterID : 'master')) return;

    filterNames();
    const dropdown = document.getElementById('name-dropdown');
    if (dropdown && typeof savedNames !== 'undefined') dropdown.style.display = savedNames.length > 0 ? 'block' : 'none';
}

// --------------------------------------------------------------------------------
// 🔍 15. กรองชื่อนักเรียนใน Dropdown
// --------------------------------------------------------------------------------
function filterNames() {
    const inputEl = document.getElementById('student-name-input');
    const dd = document.getElementById('name-dropdown');
    if (!inputEl || !dd || typeof savedNames === 'undefined') return;

    const input = inputEl.value.toLowerCase();
    dd.innerHTML = '';
    let count = 0;
    
    savedNames.forEach(name => {
        if (name.toLowerCase().includes(input)) {
            const div = document.createElement('div');
            div.className = 'name-item';
            div.innerHTML = `
                <span onclick="selectName('${name}')" style="flex-grow:1;">${name}</span>
                <button class="delete-btn" onclick="deleteName(event, '${name}')" title="ลบชื่อนี้">❌</button>
            `;
            dd.appendChild(div);
            count++;
        }
    });
    dd.style.display = count > 0 ? 'block' : 'none';
}

// --------------------------------------------------------------------------------
// ✅ 16. เลือกชื่อนักเรียนจาก Dropdown
// --------------------------------------------------------------------------------
function selectName(name) {
    const input = document.getElementById('student-name-input');
    const dd = document.getElementById('name-dropdown');
    if (input) input.value = name;
    if (dd) dd.style.display = 'none';
}

// --------------------------------------------------------------------------------
// ⚙️ 17. เปิด/ปิด แผงการตั้งค่า (Settings Panel)
// --------------------------------------------------------------------------------
function toggleSettings() {
    const p = document.getElementById('settings-panel');
    if (!p) return;
    const isHidden = p.style.display === 'none' || p.style.display === '';
    if (isHidden) {
        p.classList.add('floating-settings');
        // คำนวณ top จาก bottom ของ navbar (fixed coordinate)
        const nav = document.getElementById('main-action-bar');
        const navBottom = nav ? nav.getBoundingClientRect().bottom : 70;
        p.style.setProperty('top', (navBottom + 8) + 'px', 'important');
        p.style.display = 'block';

        // ปิดเมื่อคลิกนอก panel
        setTimeout(() => {
            document.addEventListener('click', _settingsOutsideHandler, { capture: true, once: true });
        }, 0);
    } else {
        p.style.display = 'none';
        document.removeEventListener('click', _settingsOutsideHandler, { capture: true });
    }
}

function _settingsOutsideHandler(e) {
    const p = document.getElementById('settings-panel');
    const btn = document.getElementById('btn-set');
    if (p && !p.contains(e.target) && e.target !== btn && !btn?.contains(e.target)) {
        p.style.display = 'none';
    } else if (p && (p.contains(e.target) || e.target === btn)) {
        // คลิกอยู่ใน panel หรือปุ่ม — ลงทะเบียนใหม่
        setTimeout(() => {
            document.addEventListener('click', _settingsOutsideHandler, { capture: true, once: true });
        }, 0);
    }
}

// --------------------------------------------------------------------------------
// ⏲️ 18. ซ่อน/แสดง ช่องกำหนดเวลา (ขึ้นกับ set-exam-mode)
// --------------------------------------------------------------------------------
function toggleTimerInput() {
    const inputDiv = document.getElementById('timer-input-div');
    const modeSelect = document.getElementById('set-exam-mode');
    if (inputDiv && modeSelect) {
        inputDiv.style.display = (modeSelect.value === 'exam') ? 'flex' : 'none';
    }
}

// --------------------------------------------------------------------------------
// ⏳ 19. ซ่อน/แสดง ช่องกำหนด Delay
// --------------------------------------------------------------------------------
function toggleDelayInput() {
    const inputDiv = document.getElementById('delay-input-div');
    const delaySelect = document.getElementById('set-use-delay');
    if (inputDiv && delaySelect) {
        inputDiv.style.display = (delaySelect.value === 'true') ? 'flex' : 'none';
    }
}

// --------------------------------------------------------------------------------
// 🚀 20. 🟢 ฟังก์ชันเลื่อนหน้าจออัตโนมัติ (Auto-Scroll)
// --------------------------------------------------------------------------------
function autoScrollToStart() {
    // หน่วงเวลา 0.5 วินาที เพื่อให้ระบบโหลดข้อสอบและสร้างปุ่มให้เสร็จก่อน
    setTimeout(() => {
        const targetBtn = document.getElementById('btn-start-builder');
        
        // เล็งเป้าไปที่ "ปุ่มเริ่มต้นชุดข้อสอบผสม" หรือ Fallback ไปที่ตาราง
        if (targetBtn && targetBtn.style.display !== 'none') {
            targetBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            const fallbackArea = document.getElementById('file-list');
            if (fallbackArea) fallbackArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 500);
}

// --------------------------------------------------------------------------------
// 📂 21. 🟢 หน้าต่างป๊อปอัปเลือกชุดข้อสอบย่อย (Server Exams)
// --------------------------------------------------------------------------------
function openChapterPopup(subject, grade, term, unitId) {
    const examsDB = JSON.parse(localStorage.getItem('kruHengServerExams')) || (typeof defaultServerExams !== 'undefined' ? defaultServerExams : []);
    if (typeof NEW_EXAM_STRUCTURE === 'undefined') return;
    
    const unitObj = NEW_EXAM_STRUCTURE[subject].grades[grade].terms[term].units.find(u => u.id === unitId);
    if (!unitObj) return;

    const unitNameDisplay = unitObj.name[lang];
    const difficulties = [
        { id: 'easy', name: { th: 'ง่าย', en: 'Easy' }, color: 'var(--success)' },
        { id: 'medium', name: { th: 'ปานกลาง', en: 'Medium' }, color: '#ff9800' },
        { id: 'hard', name: { th: 'ยาก', en: 'Hard' }, color: 'var(--danger)' },
        { id: 'extreme', name: { th: 'โหดสุด', en: 'Extreme' }, color: '#ff007f' }
    ];

    const txtSet = lang === 'th' ? 'ชุดที่' : 'Set';
    const questionsPerSet = 30; // 🆕 กำหนดจำนวนข้อต่อชุด
    const txtQs = lang === 'th' ? 'ข้อ' : 'Qs';
    const txtTotal = lang === 'th' ? 'รวม' : 'Total';

    let html = `<div style="display:flex; flex-direction:column; gap:15px;">`;

    difficulties.forEach(diff => {
        const diffDisplay = diff.name[lang];
        const maxSets = 5;
        const totalDiffQs = maxSets * questionsPerSet;

        html += `
            <div style="background: rgba(0,0,0,0.02); border-radius: 10px; padding: 10px; border-left: 4px solid ${diff.color};">
                <div style="font-weight: bold; color: ${diff.color}; margin-bottom: 8px;">
                    ${diffDisplay} (${maxSets} ${lang === 'th' ? 'ชุด' : 'Sets'} <span style="color:var(--text-muted); font-weight:normal; font-size:0.9em;">| ${txtTotal} ${totalDiffQs} ${txtQs}</span>)
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px;">`;

        for (let i = 1; i <= maxSets; i++) {
            const filename = `${subject}_${grade}_${term}_${unitId}_${diff.id}_${i}.json`;
            const examName = `${unitNameDisplay} (${diffDisplay} ${txtSet} ${i})`;
            
            const exists = examsDB.some(e => e.filename === filename);
            const isChecked = window.selectedServerExamData && window.selectedServerExamData.has(filename) ? 'checked' : '';
            const disabled = exists ? '' : 'disabled';
            const opacity = exists ? '1' : '0.4';
            const cursor = exists ? 'pointer' : 'not-allowed';
            const bg = exists ? (isChecked ? 'rgba(0,240,255,0.1)' : 'var(--card-bg)') : 'rgba(0,0,0,0.05)';

            html += `
                <label style="background: ${bg}; padding: 8px 5px; border-radius: 8px; border: 1px solid #ccc; opacity: ${opacity}; cursor: ${cursor}; display: flex; align-items: center; justify-content: center; gap: 5px; font-size: 0.85rem; transition: 0.2s;">
                    <input type="checkbox" value="${filename}" data-exam-name="${examName}" onchange="toggleServerExamSelection(this, '${filename}', '${examName}')" ${disabled} ${isChecked} style="width: 14px; height: 14px; flex-shrink: 0;">
                    <span style="white-space: nowrap;">${txtSet} ${i} <small style="color: #888; font-size: 0.75rem;">(${questionsPerSet} ${txtQs})</small></span>
                </label>`;
        }
        html += `</div></div>`;
    });
    html += `</div>`;

    const titleEl = document.getElementById('popup-cat-title');
    if (titleEl) {
        titleEl.innerHTML = `<span style="white-space: normal; line-height: 1.4;">${unitNameDisplay}</span>`;
    }

    const subcatTitle = document.getElementById('popup-subcat-title');
    if (subcatTitle) {
        subcatTitle.innerHTML = '';
        subcatTitle.style.display = 'none';
    }

    const listDiv = document.getElementById('popup-exam-list');
    if (listDiv) {
        listDiv.className = '';
        listDiv.innerHTML = html;
    }

    const overlay = document.getElementById('subfolder-popup-overlay');
    if (overlay) overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function toggleServerExamSelection(cb, filename, name) {
    if (!window.selectedServerExamData) return;
    
    if (cb.checked) {
        window.selectedServerExamData.set(filename, name);
    } else {
        window.selectedServerExamData.delete(filename);
    }
    updateLoadButtonUI();
    cb.parentElement.style.background = cb.checked ? 'rgba(0,240,255,0.1)' : 'var(--card-bg)';
}

// --------------------------------------------------------------------------------
// 📖 22. 🟢 คู่มือสเตตัส (Stats Guide) และ สกิล (Skills Guide)
// --------------------------------------------------------------------------------

// เปิดหน้าต่างอธิบายสเตตัสเรดาร์
function openRadarInfo() {
    const role = sessionStorage.getItem('kruHengRole');
    const isMaster = role === 'master';

    const statsGuide = [
        {
            id: "ACC", icon: "🎯", th: "แม่นยำ (Accuracy)", en: "Accuracy (ACC)",
            descTh: "วัดจากความถูกต้องในการตอบคำถาม (ฟอร์ม 20 ชุดล่าสุด) ยิ่งตอบถูกเยอะโดยไม่เดามั่ว กราฟจะยิ่งสูง",
            descEn: "Measures the correctness of your answers from the last 20 sets.",
            formula: "(จำนวนข้อที่ตอบถูกใน 20 ชุดล่าสุด ÷ ข้อทั้งหมด) × 100"
        },
        {
            id: "AGI", icon: "⚡", th: "ความไว (Agility)", en: "Agility (AGI)",
            descTh: "วัดจากความเร็วเฉลี่ยในการทำข้อสอบ (10 ชุดล่าสุด) ควบคู่กับความแม่นยำ ถ้าทำไวแต่เดามั่วสเตตัสนี้จะร่วงทันที",
            descEn: "Measures average speed per question combined with accuracy (last 10 sets).",
            formula: "คะแนนความเร็ว (สูงสุด 120 - เวลาเฉลี่ยวินาที/ข้อ) × (ACC %)"
        },
        {
            id: "END", icon: "🛡️", th: "ความอึด (Endurance)", en: "Endurance (END)",
            descTh: "วัดความขยันทำโจทย์ในรอบ 7 วันล่าสุด ถ้านักเรียนหยุดพักทำข้อสอบนานเกินไป หลอดนี้จะค่อยๆ หดลง",
            descEn: "Measures the volume of exams taken in the last 7 days. Decays if inactive.",
            formula: "จำนวนชุดที่ทำใน 7 วันล่าสุด × 10 (สูงสุด 100)"
        },
        {
            id: "CON", icon: "🔥", th: "สม่ำเสมอ (Consistency)", en: "Consistency (CON)",
            descTh: "วัดวินัยการเข้าใช้งานในรอบ 14 วันล่าสุด ไม่ต้องทำเยอะ แค่เข้ามาล็อกอินทำทุกวันสเตตัสนี้ก็จะเต็ม",
            descEn: "Measures login frequency in the last 14 days. Daily practice keeps this high.",
            formula: "จำนวนวันที่ล็อกอินทำข้อสอบใน 14 วันล่าสุด × 10 (สูงสุด 100)"
        },
        {
            id: "MEM", icon: "🧠", th: "ความจำ (Memory)", en: "Memory (MEM)",
            descTh: "วัดการทำ Active Recall (ทบทวนความจำ) ถ้านำข้อสอบชุดเก่าที่เคยทำมาทำซ้ำบ่อยๆ กราฟนี้จะพุ่งขึ้น",
            descEn: "Measures Active Recall. Re-taking previously completed exams boosts this stat.",
            formula: "จำนวนชุดข้อสอบที่ทำซ้ำ (รอบ 2 ขึ้นไป) ใน 30 วัน × 20 (สูงสุด 100)"
        },
        {
            id: "CRI", icon: "⚔️", th: "คริติคอล (Critical)", en: "Critical Hit (CRI)",
            descTh: "วัดผลงานระดับ Masterpiece คือความสามารถในการทำคะแนนได้เต็ม 100% ไร้ที่ติ (ฟอร์ม 20 ชุดล่าสุด)",
            descEn: "Measures the frequency of getting perfect 100% scores in the last 20 sets.",
            formula: "(จำนวนครั้งที่ได้ 100% ใน 20 ชุดล่าสุด ÷ จำนวนชุดที่ทำ) × 100"
        }
    ];

    const contentDiv = document.getElementById('radar-info-content');
    if (!contentDiv) return;
    
    contentDiv.innerHTML = '';

    statsGuide.forEach(stat => {
        const title = lang === 'th' ? stat.th : stat.en;
        const desc = lang === 'th' ? stat.descTh : stat.descEn;
        let html = `
            <div style="background: rgba(0, 240, 255, 0.05); padding: 12px; border-radius: 10px; border-left: 4px solid var(--primary); margin-bottom: 10px;">
                <div style="font-weight: bold; color: var(--text-color); font-size: 1.1rem; margin-bottom: 5px;">${stat.icon} ${title}</div>
                <div style="font-size: 0.9rem; color: var(--text-color); opacity: 0.8; line-height: 1.4;">${desc}</div>
        `;

        if (isMaster) {
            html += `<div style="margin-top: 8px; font-size: 0.8rem; background: rgba(255, 0, 127, 0.1); color: var(--primary); padding: 5px 8px; border-radius: 5px; font-family: monospace;"><b>Formula:</b> ${stat.formula}</div>`;
        }

        html += `</div>`;
        contentDiv.innerHTML += html;
    });

    const titleEl = document.getElementById('ui-info-modal-title');
    if (titleEl) titleEl.innerText = lang === 'th' ? '📖 คู่มือสเตตัส (Stats Guide)' : '📖 Stats Guide';
    
    const overlay = document.getElementById('radar-info-overlay');
    if (overlay) overlay.style.display = 'flex';
}

// เปิดหน้าต่างอธิบายสกิลทั้ง 4 สาย
function openSkillInfo(type) {
    const skillData = {
        'math': {
            titleTh: '📖 คู่มือสกิลคณิตศาสตร์', titleEn: '📖 Math Skills Guide', color: 'var(--primary)',
            items: [
                { icon: '🧮', th: 'จำนวนและพีชคณิต', en: 'Numbers & Algebra', descTh: 'ทักษะการคำนวณ การแก้สมการ อสมการ และความเข้าใจในระบบจำนวน', descEn: 'Calculation skills, solving equations, and understanding number systems.' },
                { icon: '📐', th: 'การวัดและเรขาคณิต', en: 'Measurement & Geometry', descTh: 'ทักษะเกี่ยวกับพื้นที่ ปริมาตร รูปทรง มิติสัมพันธ์ และตรีโกณมิติ', descEn: 'Skills related to area, volume, shapes, spatial relations, and trigonometry.' },
                { icon: '📊', th: 'สถิติและความน่าจะเป็น', en: 'Statistics and Probability', descTh: 'ทักษะการวิเคราะห์ข้อมูล การนำเสนอข้อมูล และการคาดคะเนโอกาสเกิดเหตุการณ์', descEn: 'Data analysis, presentation, and probability estimation.' },
                { icon: '📈', th: 'แคลคูลัส', en: 'Calculus', descTh: 'ทักษะคณิตศาสตร์ขั้นสูง ลิมิต อนุพันธ์ และปริพันธ์', descEn: 'Advanced math, limits, derivatives, and integrals.' }
            ]
        },
        'sci': {
            titleTh: '📖 คู่มือสกิลวิทยาศาสตร์', titleEn: '📖 Science Skills Guide', color: '#00c853',
            items: [
                { icon: '🔬', th: 'ทักษะกระบวนการ', en: 'Process Skills', descTh: 'การสังเกต การตั้งสมมติฐาน การทดลอง และการสรุปผลทางวิทยาศาสตร์', descEn: 'Observation, hypothesis, experimentation, and scientific conclusion.' },
                { icon: '🧬', th: 'ชีววิทยา', en: 'Biology', descTh: 'ความเข้าใจเกี่ยวกับสิ่งมีชีวิต เซลล์ พันธุกรรม และระบบนิเวศ', descEn: 'Understanding living organisms, cells, genetics, and ecosystems.' },
                { icon: '🧪', th: 'เคมี', en: 'Chemistry', descTh: 'สสาร ธาตุ ปฏิกิริยาเคมี และปริมาณสารสัมพันธ์', descEn: 'Matter, elements, chemical reactions, and stoichiometry.' },
                { icon: '⚡', th: 'ฟิสิกส์', en: 'Physics', descTh: 'กลศาสตร์ คลื่น ไฟฟ้า แม่เหล็ก และฟิสิกส์ยุคใหม่', descEn: 'Mechanics, waves, electricity, magnetism, and modern physics.' },
                { icon: '🌍', th: 'โลกและอวกาศ', en: 'Earth & Space', descTh: 'ธรณีวิทยา บรรยากาศ ดาราศาสตร์ และปรากฏการณ์ทางธรรมชาติ', descEn: 'Geology, atmosphere, astronomy, and natural phenomena.' }
            ]
        },
        'psycho': {
            titleTh: '📖 คู่มือสกิลจิตวิทยา', titleEn: '📖 Psychology Skills Guide', color: '#9c27b0',
            items: [
                { icon: '🧠', th: 'สมองและการรับรู้', en: 'Brain & Perception', descTh: 'การทำงานของระบบประสาท สัมผัสทั้งห้า และการรับรู้สิ่งเร้า', descEn: 'Nervous system, five senses, and sensory perception.' },
                { icon: '💡', th: 'การคิดและการเรียนรู้', en: 'Cognition & Learning', descTh: 'กระบวนการคิด ความจำ ทฤษฎีการเรียนรู้ และการแก้ปัญหา', descEn: 'Cognitive processes, memory, learning theories, and problem-solving.' },
                { icon: '🌱', th: 'พัฒนาการและตัวตน', en: 'Development & Identity', descTh: 'การเติบโตตามวัย บุคลิกภาพ และการค้นหาตัวตน', descEn: 'Lifespan development, personality, and self-discovery.' },
                { icon: '🤝', th: 'สังคมและคนรอบข้าง', en: 'Social & Relationships', descTh: 'จิตวิทยาสังคม การสื่อสาร และการอยู่ร่วมกับผู้อื่น', descEn: 'Social psychology, communication, and interpersonal relationships.' },
                { icon: '❤️', th: 'อารมณ์และสุขภาพจิต', en: 'Emotions & Mental Health', descTh: 'การจัดการอารมณ์ ความเครียด และการดูแลจิตใจ', descEn: 'Emotion regulation, stress management, and mental health care.' }
            ]
        },
        'comp': {
            titleTh: '📖 คู่มือสกิลคอมพิวเตอร์', titleEn: '📖 Computer Skills Guide', color: '#00bcd4',
            items: [
                { icon: '⚙️', th: 'พื้นฐานและตรรกะ', en: 'Logic & Fundamentals', descTh: 'วิธีคิดแบบโปรแกรมเมอร์ อัลกอริทึมพื้นฐาน และผังงาน (Flowchart)', descEn: 'Programmer mindset, basic algorithms, and flowcharts.' },
                { icon: '🗂️', th: 'โครงสร้างข้อมูล', en: 'Data Structures', descTh: 'Array, List, Tree, Graph และการจัดการข้อมูลอย่างมีประสิทธิภาพ', descEn: 'Arrays, Lists, Trees, Graphs, and efficient data management.' },
                { icon: '🌐', th: 'การพัฒนาเว็บไซต์', en: 'Web Development', descTh: 'การสร้างหน้าเว็บ (Frontend) และระบบหลังบ้าน (Backend)', descEn: 'Building web interfaces (Frontend) and server systems (Backend).' },
                { icon: '💾', th: 'ระบบฐานข้อมูล', en: 'Databases', descTh: 'การออกแบบตาราง SQL/NoSQL และการจัดการข้อมูลจำนวนมาก', descEn: 'Table design, SQL/NoSQL, and large data management.' },
                { icon: '🤖', th: 'AI & เทคโนโลยีใหม่', en: 'AI & Modern Tech', descTh: 'ปัญญาประดิษฐ์ Machine Learning และเทคโนโลยีล้ำสมัย', descEn: 'Artificial Intelligence, Machine Learning, and cutting-edge tech.' }
            ]
        }
    };

    const targetData = skillData[type];
    if (!targetData) return;

    const contentDiv = document.getElementById('skill-info-content');
    if (!contentDiv) return;
    
    contentDiv.innerHTML = ''; 

    const modalTitle = document.getElementById('ui-skill-modal-title');
    if (modalTitle) {
        modalTitle.innerText = lang === 'th' ? targetData.titleTh : targetData.titleEn;
        modalTitle.style.color = targetData.color;
    }

    targetData.items.forEach(stat => {
        const title = lang === 'th' ? stat.th : stat.en;
        const desc = lang === 'th' ? stat.descTh : stat.descEn;
        let html = `
            <div style="background: rgba(0, 240, 255, 0.05); padding: 12px; border-radius: 10px; border-left: 4px solid ${targetData.color}; margin-bottom: 10px;">
                <div style="font-weight: bold; color: var(--text-color); font-size: 1.1rem; margin-bottom: 5px;">${stat.icon} ${title}</div>
                <div style="font-size: 0.9rem; color: var(--text-color); opacity: 0.8; line-height: 1.4;">${desc}</div>
            </div>`;
        contentDiv.innerHTML += html;
    });

    const overlay = document.getElementById('skill-info-overlay');
    if (overlay) overlay.style.display = 'flex';
}

console.log("✅ [SUCCESS] ui.js โหลดเสร็จสมบูรณ์!");

/* =====================================================================
   สิ้นสุดไฟล์ ui.js
   ===================================================================== */
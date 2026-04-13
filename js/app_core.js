/* =====================================================================
   🧠 ไฟล์: js/app_core.js
   หน้าที่: จัดการตัวแปร Global, การตั้งค่าตอนโหลดหน้าเว็บ (Init) และ Reset ระบบ
   ===================================================================== */
console.log("🧠 [START] โมดูลเริ่มทำงาน: app_core.js (แกนกลางและระบบเริ่มต้น)");

// ==========================================
// 1. ประกาศตัวแปร Global (State Management)
// ==========================================
window.currentLoadout = []; // 🎒 กระเป๋าเก็บไอเทมที่เลือกพกเข้าสอบ (สูงสุด 10 ชิ้น)
window.activeItemEffects = {}; // 🪄 เก็บสถานะบัพของไอเทมที่กำลังทำงานในข้อนั้นๆ
window.selectedServerExamData = new Map(); // ข้อมูลข้อสอบจาก Server ที่เลือก
let wizardOverlay = null; // UI ของ Smart Wizard

let selectedFiles = []; 
let db = []; 
let curIdx = 0; 
let stat = { c: 0, t: 0, score: 0, coins: 0, exp: 0, isFinished: false }; 
let wrongs = [];
let categoryStats = {};

let timer; 
let leftMs; 
let paused = false; 
let config = {}; 
let isAnswered = false; 
let nextInterval = null; 
let nextSecondsLeft = 0; 

const MAX_PAUSE = 5;
let pauseUsed = 0;
let currentQTimeSec = 30;
let lang = localStorage.getItem('kruHengLang') || 'th';
let isDarkMode = localStorage.getItem('kruHengTheme') === 'dark';
let lastSec = -1;
let startTimeObj = null;
let studentNameStr = "";
let currentExamTitle = ""; 

// ตรวจสอบฐานข้อมูลเริ่มต้น
if (!localStorage.getItem('kruHengStudentDB')) {
    if (typeof defaultStudentDB !== 'undefined') {
        localStorage.setItem('kruHengStudentDB', JSON.stringify(defaultStudentDB));
    } else {
        localStorage.setItem('kruHengStudentDB', JSON.stringify({}));
    }
}

// ==========================================
// 2. ฟังก์ชันเริ่มต้นระบบ (Initialization)
// ==========================================
window.onload = async () => {
    // 2.1 โหลด ธีม และ ภาษา
    if (localStorage.getItem('kruHengTheme') === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
    if (localStorage.getItem('kruHengLang') === 'en') {
        lang = 'th'; 
        if (typeof toggleLang === 'function') toggleLang();
    }

    // 2.2 ผูก Event การตั้งค่า
    if (typeof bindSettingsEvents === 'function') bindSettingsEvents(); 

    // 2.3 ตรวจสอบ IP และ Authentication
    if (!sessionStorage.getItem('kruHengUserIP')) {
        if (typeof fetchIP === 'function') {
            const currentIP = await fetchIP();
            sessionStorage.setItem('kruHengUserIP', currentIP);
        }
    }

    if (!sessionStorage.getItem('kruHengLoggedIn')) {
        const loginOverlay = document.getElementById('login-overlay');
        if (loginOverlay) loginOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
    } else {
        const loginOverlay = document.getElementById('login-overlay');
        if (loginOverlay) loginOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        const currentUser = sessionStorage.getItem('kruHengCurrentUser');
        const role = sessionStorage.getItem('kruHengRole');
        
        if (currentUser) {
            const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || {};
            const nameInput = document.getElementById('student-name-input');
            if (nameInput) {
                nameInput.value = (role === 'guest') ? currentUser.replace('Guest_', '') : (dbStudent[currentUser] ? dbStudent[currentUser].nick : currentUser);
                
                if (typeof masterID !== 'undefined' && currentUser !== masterID) {
                    nameInput.readOnly = true;
                    nameInput.style.backgroundColor = "rgba(0,0,0,0.05)";
                }
            }
        }
    }
    initApp();
};

function initApp() {
    // ใช้ typeof เพื่อเช็คว่ามีฟังก์ชันนี้อยู่จริงไหมก่อนเรียกใช้ 
    // ถ้าระบบหาไม่เจอ มันจะข้ามไปบรรทัดต่อไปอย่างปลอดภัยครับ
    
    if (typeof populateStatsMonthDropdown === 'function') populateStatsMonthDropdown();
    if (typeof recoverActiveSession === 'function') recoverActiveSession(); 
    if (typeof loadSettings === 'function') loadSettings(); 
    if (typeof applyUserPermissions === 'function') applyUserPermissions(); 
    if (typeof saveSettings === 'function') saveSettings(); 
    if (typeof loadSessions === 'function') loadSessions(); 
    if (typeof loadHistory === 'function') loadHistory();
    if (typeof loadLogs === 'function') loadLogs(); 
    if (typeof updateVolume === 'function') updateVolume(); 
    if (typeof renderProfileBadge === 'function') renderProfileBadge(); 
    
    // 🎯 คำสั่งวาดกล่องข้อสอบ (ถึงข้างบนจะพัง ตัวนี้ก็ยังจะถูกวาดครับ)
    if (typeof renderServerExamList === 'function') renderServerExamList(); 
}

// ==========================================
// 3. ฟังก์ชันอรรถประโยชน์เฉพาะระบบ (Helpers)
// ==========================================

// ฟังก์ชันแสดงผลสมการคณิตศาสตร์
function academicRender(id) { 
    const el = document.getElementById(id);
    if(el && typeof renderMathInElement === 'function') {
        renderMathInElement(el, { 
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ], 
            throwOnError: false, 
            trust: true 
        }); 
    }
}

// ฟังก์ชันโหลดไฟล์ JSON ด้วยมือ (Manual Upload)
function handleFiles(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const cleanText = (typeof sanitizeJSON === 'function') ? sanitizeJSON(ev.target.result) : ev.target.result;
                const json = JSON.parse(cleanText);
                const questions = json.questions || [];
                selectedFiles.push({ 
                    title: json.metadata?.exam_title || file.name, 
                    allQuestions: questions, 
                    takeCount: questions.length 
                });
                if(typeof updateFileListUI === 'function') updateFileListUI();
            } catch (err) { alert("⚠️ JSON Error: " + err.message); }
        };
        reader.readAsText(file);
    });
}

// ==========================================
// 4. ฟังก์ชันรีเซ็ตระบบ (Cleanup)
// ==========================================
function resetSystemData() {
    stat = { score: 0, c: 0, t: 0, coins: 0, exp: 0, isFinished: false };
    categoryStats = {};
    wrongs = [];
    window.lastEarnedExp = 0;
    window.currentSlotBonus = 0;
    window.lastEarnedCoins = 0;
    
    let scoreValObj = document.getElementById('ui-score-val');
    if(scoreValObj) scoreValObj.innerHTML = "0 Pts";
    
    let correctLiveObj = document.getElementById('ui-live-correct');
    if(correctLiveObj) correctLiveObj.innerText = lang === 'th' ? "ถูก: 0" : "Correct: 0";

    let coinLiveObj = document.getElementById('ui-coin-val');
    if(coinLiveObj) {
        const role = sessionStorage.getItem('kruHengRole');
        let dbCoins = 0;
        if (role === 'guest') {
            dbCoins = JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}').coins || 0;
        } else {
            const user = sessionStorage.getItem('kruHengCurrentUser');
            const dbS = JSON.parse(localStorage.getItem('kruHengStudentDB') || '{}');
            dbCoins = dbS[user]?.coins || 0;
        }
        coinLiveObj.innerText = dbCoins.toLocaleString();
    }

    const sumScreen = document.getElementById('sum-screen');
    if (sumScreen) sumScreen.style.display = 'none';
    const setupScreen = document.getElementById('setup-screen');
    if (setupScreen) setupScreen.style.display = 'block';

    // ── อัปเดตรายการพักข้อสอบหลัง finish ──
    if (typeof loadSessions === 'function') loadSessions();

    // ── ล้างข้อสอบที่เลือกไว้ ──
    selectedFiles = [];
    if (typeof updateFileListUI === 'function') updateFileListUI();
    if (window.selectedServerExamData) {
        window.selectedServerExamData.clear();
        if (typeof updateLoadButtonUI === 'function') updateLoadButtonUI();
    }
    if (typeof renderServerExamList === 'function') renderServerExamList();
    currentExamTitle = '';
    window.currentExamComponents = [];
}

console.log("✅ [SUCCESS] app_core.js โหลดเสร็จสมบูรณ์!");
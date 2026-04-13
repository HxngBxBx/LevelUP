/* =====================================================================
   💾 ไฟล์: js/session.js
   หน้าที่: ระบบบันทึก/พัก/กู้คืนข้อสอบ (Suspend & Resume)
   --------------------------------------------------------------------
   📦 ฟังก์ชันที่อยู่ในไฟล์นี้:
     1. saveCurrentSession()        - บันทึกสถานะสอบปัจจุบันลง storage
     2. attemptSaveSession          - เวอร์ชัน throttle ของ saveCurrentSession
     3. resumeSpecificSession(idx)  - เปิดข้อสอบที่พักไว้กลับมาทำต่อ
     4. loadSessions()              - โหลด/แสดงตารางข้อสอบที่พักไว้
     5. recoverActiveSession()      - กู้คืน session ฉุกเฉิน (เช่น ปิดเว็บกะทันหัน)
     6. deleteSpecificSession(idx)  - ลบรายการที่พักไว้

   🔗 Dependencies (ตัวแปร/ฟังก์ชันจากไฟล์อื่น):
     - lang, db, curIdx, stat, wrongs, categoryStats, config  (จาก app.js)
     - studentNameStr, currentExamTitle, isAnswered, startTimeObj (จาก app.js)
     - masterID, defaultStudentDB  (จาก data.js)
     - bgmMenu, bgmQuiz            (จาก audio.js)
     - throttleAction()            (จาก auth.js)
     - addLog()                    (จาก logs.js)
     - render()                    (จาก app.js)
     - renderServerExamList()      (จาก app.js)
     - loadSessions()              (เรียกตัวเอง)

   📣 ถูกเรียกจาก:
     - app.js  (initApp, suspendQuiz, render)
     - auth.js (checkLogin, checkGuestLogin, forceLogoutIdle)
     - ui.js   (toggleLang)
     - index.html (ปุ่ม Resume, ปุ่ม Delete ในตาราง)

   ⚠️ ลำดับโหลดใน index.html: ต้องโหลดหลัง auth.js, audio.js, logs.js
                                และก่อน app.js
   ===================================================================== */

console.log("⏳ [START] โมดูลเริ่มทำงาน: session.js (ระบบจำสถานะการทำข้อสอบค้างไว้)");

// --------------------------------------------------------------------------------
// 💾 1. บันทึกสถานะสอบปัจจุบันลง storage (เรียกเมื่อพักหรือเซฟฉุกเฉิน)
// --------------------------------------------------------------------------------
function saveCurrentSession() {
    const role = sessionStorage.getItem('kruHengRole');

    let saveIdx = curIdx;
    if (isAnswered) saveIdx++;

    const sessionData = {
        db,
        curIdx: saveIdx,
        stat, wrongs, categoryStats, config,
        studentNameStr, currentExamTitle,
        components: window.currentExamComponents || [],
        loadout: window.currentLoadout || [], // 🎒 บันทึกกระเป๋าไอเทมตอนพัก
        startTimeStr: startTimeObj ? startTimeObj.toISOString() : new Date().toISOString()
    };

    if (role === 'guest') {
        sessionStorage.setItem('kruHengGuestActiveSession', JSON.stringify(sessionData));
    } else {
        localStorage.setItem('kruHengActiveSession', JSON.stringify(sessionData));
    }
}

// 🛡️ ห่อ saveCurrentSession ด้วย throttle กันเซฟรัวเกินไป
const attemptSaveSession = throttleAction(saveCurrentSession, 1000);


// --------------------------------------------------------------------------------
// ▶️ 2. เปิดข้อสอบที่พักไว้กลับมาทำต่อ
// --------------------------------------------------------------------------------
function resumeSpecificSession(idx) {
    const role = sessionStorage.getItem('kruHengRole');
    let sessions = (role === 'guest')
        ? JSON.parse(sessionStorage.getItem('kruHengGuestSessionsList') || '[]')
        : JSON.parse(localStorage.getItem('kruHengSessionsList') || '[]');

    const s = sessions[idx].data;

    currentExamTitle = s.currentExamTitle;
    window.currentExamComponents = s.components || [];
    window.currentLoadout = s.loadout || []; // 🎒 โหลดกระเป๋ากลับมา
    db = s.db;
    curIdx = s.curIdx;
    stat = s.stat;
    wrongs = s.wrongs;
    categoryStats = s.categoryStats;
    config = s.config;
    studentNameStr = s.studentNameStr;
    startTimeObj = s.startTimeStr ? new Date(s.startTimeStr) : new Date();

    sessions.splice(idx, 1);
    if (role === 'guest') {
        sessionStorage.setItem('kruHengGuestSessionsList', JSON.stringify(sessions));
    } else {
        localStorage.setItem('kruHengSessionsList', JSON.stringify(sessions));
    }

    // หัก inventory สำหรับไอเทมที่ยังอยู่ใน loadout (ถูกคืนไปตอน suspend)
    const _resumeUid = sessionStorage.getItem('kruHengCurrentUser');
    if (typeof gachaDeductLoadout === 'function' && window.currentLoadout?.length > 0) {
        gachaDeductLoadout(_resumeUid, [...window.currentLoadout]);
    }

    bgmMenu.pause();
    if (config.soundQuiz) bgmQuiz.play().catch(e => {});

    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('main-action-bar').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    render();
}


// --------------------------------------------------------------------------------
// 📋 3. โหลดและแสดงตารางข้อสอบที่พักไว้ (Suspended Sessions)
// --------------------------------------------------------------------------------
function loadSessions() {
    const tbody = document.getElementById('suspended-body');
    const header = document.getElementById('suspended-header');
    const box = document.getElementById('suspended-box');
    const currentUser = sessionStorage.getItem('kruHengCurrentUser');
    const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || defaultStudentDB;
    const role = sessionStorage.getItem('kruHengRole');

    let filteredSessions = [];
    let allSessions = [];

    if (role === 'guest') {
        allSessions = JSON.parse(sessionStorage.getItem('kruHengGuestSessionsList') || '[]');
        filteredSessions = allSessions;
    } else {
        allSessions = JSON.parse(localStorage.getItem('kruHengSessionsList') || '[]');
        if (currentUser !== masterID) {
            const userNick = dbStudent[currentUser] ? dbStudent[currentUser].nick : currentUser;
            filteredSessions = allSessions.filter(s => s.data.studentNameStr === userNick);
        } else {
            filteredSessions = allSessions;
        }
    }

    if (filteredSessions.length === 0) {
        header.style.display = 'none';
        box.style.display = 'none';
        return;
    }

    header.style.display = 'flex';
    box.style.display = 'block';
    tbody.innerHTML = '';

    filteredSessions.forEach((s) => {
        const originalIdx = allSessions.indexOf(s);
        const data = s.data;

        let compText = "";
        if (data.components && data.components.length > 0) {
            let details = data.components.map(c => `• ${c.title} (${c.count} ข้อ)`).join('&#10;');
            compText = ` <span style="cursor:help; background: rgba(0,240,255,0.15); padding: 2px 8px; border-radius: 15px; display: inline-block; margin-left: 5px; font-size: 0.95rem; vertical-align: middle;" title="${details}">📦</span>`;
        }

        // 🌟 เพิ่ม data-label ให้ครบทุกช่อง เพื่อรองรับโหมดการ์ดในมือถือ
        tbody.innerHTML += `<tr>
            <td data-label="${lang === 'th' ? 'วันที่' : 'Date'}"><small>${s.dateStr} ${s.timeStr}</small></td>
            <td data-label="${lang === 'th' ? 'ผู้สอบ' : 'Student'}"><b>${data.studentNameStr || '-'}</b></td>
            <td data-label="${lang === 'th' ? 'หัวข้อ' : 'Topic'}" style="max-width: 200px; white-space: normal; line-height: 1.4;" title="${data.currentExamTitle}">
                ${data.currentExamTitle}${compText}
            </td>
            <td data-label="${lang === 'th' ? 'คืบหน้า' : 'Progress'}"><b>${data.curIdx + 1} / ${data.db.length}</b></td>
            <td data-label="${lang === 'th' ? 'จัดการ' : 'Action'}">
                <button class="btn btn-orange" style="padding: 6px 10px; margin-right: 5px; border-radius: 8px; font-size: 0.8rem;" onclick="resumeSpecificSession(${originalIdx})">▶️ ${lang === 'th' ? 'ทำต่อ' : 'Resume'}</button>
                <button class="btn btn-red" style="padding: 6px 8px; border-radius: 8px; font-size: 0.8rem;" onclick="deleteSpecificSession(${originalIdx})">🗑️</button>
            </td>
        </tr>`;
    });
}


// --------------------------------------------------------------------------------
// 🔄 4. กู้คืน session ฉุกเฉิน (เรียกตอนเปิดเว็บใหม่ — ย้ายจาก active → list)
// --------------------------------------------------------------------------------
function recoverActiveSession() {
    // กู้คืน session ปกติ (localStorage)
    const active = localStorage.getItem('kruHengActiveSession');
    if (active) {
        let sessions = JSON.parse(localStorage.getItem('kruHengSessionsList') || '[]');
        const data = JSON.parse(active);
        sessions.push({
            id: Date.now(),
            dateStr: new Date(data.startTimeStr).toLocaleDateString('th-TH'),
            timeStr: new Date(data.startTimeStr).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
            data: data
        });
        localStorage.setItem('kruHengSessionsList', JSON.stringify(sessions));
        localStorage.removeItem('kruHengActiveSession');
    }

    // กู้คืน session ของ Guest (sessionStorage)
    const guestActive = sessionStorage.getItem('kruHengGuestActiveSession');
    if (guestActive) {
        let gSessions = JSON.parse(sessionStorage.getItem('kruHengGuestSessionsList') || '[]');
        const data = JSON.parse(guestActive);
        gSessions.push({
            id: Date.now(),
            dateStr: new Date(data.startTimeStr).toLocaleDateString('th-TH'),
            timeStr: new Date(data.startTimeStr).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
            data: data
        });
        sessionStorage.setItem('kruHengGuestSessionsList', JSON.stringify(gSessions));
        sessionStorage.removeItem('kruHengGuestActiveSession');
    }
}


// --------------------------------------------------------------------------------
// 🗑️ 5. ลบรายการที่พักไว้ (พร้อมบันทึก Log)
// --------------------------------------------------------------------------------
function deleteSpecificSession(idx) {
    if (confirm(lang === 'th' ? "ต้องการลบรายการที่พักไว้นี้ทิ้งถาวรใช่หรือไม่?" : "Permanently delete this suspended session?")) {
        const role = sessionStorage.getItem('kruHengRole');
        let sessions = (role === 'guest')
            ? JSON.parse(sessionStorage.getItem('kruHengGuestSessionsList') || '[]')
            : JSON.parse(localStorage.getItem('kruHengSessionsList') || '[]');

        const deletedItem = sessions[idx];
        sessions.splice(idx, 1);

        if (role === 'guest') {
            sessionStorage.setItem('kruHengGuestSessionsList', JSON.stringify(sessions));
            addLog(
                lang === 'th' ? "Guest ลบค้างสอบ" : "Guest Deleted Suspended",
                `ผู้ใช้: ${deletedItem.data.studentNameStr}, ชุดข้อสอบ: ${deletedItem.data.currentExamTitle}`,
                true
            );
        } else {
            localStorage.setItem('kruHengSessionsList', JSON.stringify(sessions));
            addLog(
                lang === 'th' ? "ลบรายการค้างสอบ" : "Deleted Suspended",
                `ผู้ใช้: ${deletedItem.data.studentNameStr}, ชุดข้อสอบ: ${deletedItem.data.currentExamTitle}`
            );
        }

        loadSessions();
        renderServerExamList();
    }
}

console.log("✅ [SUCCESS] session.js โหลดเสร็จสมบูรณ์!");

/* =====================================================================
   สิ้นสุดไฟล์ session.js
   ===================================================================== */
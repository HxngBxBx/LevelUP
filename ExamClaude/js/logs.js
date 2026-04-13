/* =====================================================================
   📋 ไฟล์: js/logs.js
   หน้าที่: ระบบบันทึกกิจกรรม (Activity Log) — บันทึก, แสดง, ลบ
   --------------------------------------------------------------------
   📦 ฟังก์ชันที่อยู่ในไฟล์นี้:
     1. addLog(action, detail, bypassGuestCheck)   - เพิ่ม log ใหม่
     2. loadLogs()                                 - โหลด/แสดง log ในตาราง
     3. deleteLogItem(idx)                         - ลบ log รายการเดียว
     4. clearAllLogs()                             - ล้าง log ทั้งหมด

   🔗 Dependencies (ตัวแปร/ฟังก์ชันจากไฟล์อื่น):
     - lang              (จาก app.js)
     - masterID          (จาก data.js)
     - defaultStudentDB  (จาก data.js)

   📣 ถูกเรียกจาก:
     - app.js   (5 จุด: เริ่มสอบ, พักสอบ, ลบประวัติ, ล้างประวัติ, ฯลฯ)
     - auth.js  (7 จุด: login, logout, AFK, ฯลฯ)
     - student.js (1 จุด: saveStudentDB)
     - profile.js (1 จุด: doRebirth)
     - index.html (2 จุด: log-filter onchange, btn-clear-logs)

   ⚠️ ลำดับโหลดใน index.html: ต้องโหลดหลัง data.js และก่อน app.js
   ===================================================================== */

console.log("📝 [START] โมดูลเริ่มทำงาน: logs.js (ระบบบันทึก Log การกระทำ)");

// --------------------------------------------------------------------------------
// 📝 1. เพิ่ม Log ใหม่ลง localStorage
//    - Guest จะไม่ถูกบันทึก ยกเว้นส่ง bypassGuestCheck = true
//    - เก็บไว้สูงสุด 1,000 รายการ / 1 ปี
// --------------------------------------------------------------------------------
function addLog(action, detail, bypassGuestCheck = false) {
    const role = sessionStorage.getItem('kruHengRole');
    if (role === 'guest' && !bypassGuestCheck) return;

    const logs = JSON.parse(localStorage.getItem('kruHengDeleteLogs') || '[]');
    const now = new Date();
    const currentUser = sessionStorage.getItem('kruHengCurrentUser');
    const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || defaultStudentDB;
    const userNick = (role === 'guest')
        ? currentUser.replace('Guest_', '')
        : (currentUser && dbStudent[currentUser] ? dbStudent[currentUser].nick : (currentUser || 'Unknown'));
    const userIP = sessionStorage.getItem('kruHengUserIP') || 'Unknown IP'; // 🌐 ดึง IP จากหน่วยความจำ

    logs.unshift({
        timestamp: now.getTime(),
        dateStr: now.toLocaleDateString('th-TH'),
        timeStr: now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        userId: currentUser,
        user: userNick,
        ip: userIP, // 🆕 ประทับตรา IP ลงในทุกๆ การกระทำ
        action: action,
        detail: detail
    });

    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    const filteredLogs = logs.filter(log => (now.getTime() - (log.timestamp || now.getTime())) < oneYearMs);

    localStorage.setItem('kruHengDeleteLogs', JSON.stringify(filteredLogs.slice(0, 1000)));
    if (role === 'master' || bypassGuestCheck) loadLogs();
}


// --------------------------------------------------------------------------------
// 📊 2. โหลดและแสดง Log ในตาราง (รองรับ filter + แปลภาษา Real-time)
// --------------------------------------------------------------------------------
function loadLogs() {
    const logs = JSON.parse(localStorage.getItem('kruHengDeleteLogs') || '[]');
    const tbody = document.getElementById('log-body');
    const currentUser = sessionStorage.getItem('kruHengCurrentUser');
    const isMaster = currentUser === masterID;

    // Master เห็นทุก log / นักเรียนเห็นแค่ของตัวเอง
    let filteredLogs = logs;
    if (!isMaster) {
        filteredLogs = logs.filter(log => log.userId === currentUser);
    }

    // ระบบกรองหมวดหมู่
    const filterDropdown = document.getElementById('log-filter');
    const filterVal = filterDropdown ? filterDropdown.value : 'all';

    if (filterVal !== 'all') {
        filteredLogs = filteredLogs.filter(log => {
            const act = (log.action || "").toLowerCase();
            if (filterVal === 'access') return act.includes('เข้า') || act.includes('ออก') || act.includes('login') || act.includes('logout');
            if (filterVal === 'learning') return act.includes('สอบ') || act.includes('พัก') || act.includes('exam') || act.includes('suspend');
            if (filterVal === 'game') return act.includes('จุติ') || act.includes('rebirth');
            if (filterVal === 'admin') return act.includes('ลบ') || act.includes('ล้าง') || act.includes('จัดการ') || act.includes('clear') || act.includes('delete') || act.includes('update');
            return true;
        });
    }

    // 🌐 หัวตาราง 2 ภาษา
    const labels = lang === 'th'
        ? ["📅 วัน-เวลา", "👤 ผู้ใช้", "⚡ การกระทำ", "📝 รายละเอียด", "🛠️ จัดการ"]
        : ["📅 Date-Time", "👤 User", "⚡ Action", "📝 Details", "🛠️ Manage"];

    document.getElementById('btn-clear-logs').style.display = isMaster ? 'inline-block' : 'none';

    const logBoxHeader = document.querySelector('#log-box thead tr');
    if (logBoxHeader) {
        logBoxHeader.innerHTML = `<th>${labels[0].replace('📅 ', '')}</th><th>${labels[1].replace('👤 ', '')}</th><th>${labels[2].replace('⚡ ', '')}</th><th>${labels[3].replace('📝 ', '')}</th><th class="th-log-act" style="display:${isMaster ? 'table-cell' : 'none'};">${labels[4].replace('🛠️ ', '')}</th>`;
    }

    // แสดงผล log ในตาราง
    tbody.innerHTML = filteredLogs.length
        ? ""
        : `<tr><td colspan="${isMaster ? 5 : 4}" style="text-align:center;">${lang === 'th' ? 'ไม่มีข้อมูลในหมวดหมู่นี้' : 'No logs in this category'}</td></tr>`;

    filteredLogs.forEach((log) => {
        const originalIdx = logs.indexOf(log);

        // 🆕 ระบบแปลภาษาเนื้อหา Log แบบ Real-time (ไม่กระทบข้อมูลจริงที่เซฟไว้)
        let displayAction = log.action;
        let displayDetail = log.detail;

        if (lang === 'en') {
            const dictAct = {
                "เข้าสู่ระบบ": "Login",
                "ออกจากระบบ": "Logout",
                "เริ่มทำข้อสอบ": "Start Exam",
                "พักข้อสอบ": "Suspend Exam",
                "เซฟข้อสอบฉุกเฉิน": "Emergency Save",
                "หมดเวลาเชื่อมต่อ (AFK)": "Session Timeout",
                "อินเทอร์เน็ตตัด": "Offline",
                "อินเทอร์เน็ตปกติ": "Online",
                "จัดการนักเรียน": "Manage Students",
                "ลบรายการค้างสอบ": "Del Suspended",
                "Guest ลบค้างสอบ": "Guest Del Suspended",
                "จัดการข้อสอบ": "Manage Exams"
            };
            if (dictAct[log.action]) displayAction = dictAct[log.action];

            displayDetail = displayDetail
                .replace(/เข้าสู่ระบบ/g, "logged in")
                .replace(/ออกจากระบบ/g, "logged out")
                .replace(/ผู้ใช้/g, "User")
                .replace(/เริ่มทำชุด:/g, "Started set:")
                .replace(/พักข้อสอบชุด:/g, "Suspended set:")
                .replace(/ทำถึงข้อ/g, "at Q")
                .replace(/มาสเตอร์/g, "Master")
                .replace(/ถูกเตะออกเนื่องจากไม่มีการใช้งานเกิน/g, "was kicked due to inactivity over")
                .replace(/นาที/g, "mins");
        }

        let rowHtml = `<tr>
            <td data-label="${labels[0]}"><small>${log.dateStr} ${log.timeStr}</small></td>
            <td data-label="${labels[1]}">
                <b>${log.user}</b><br>
                <small style="color:var(--secondary); font-size:0.75rem;">IP: ${log.ip || '-'}</small>
            </td>
            <td data-label="${labels[2]}"><span style="color:var(--danger); font-weight:bold;">${displayAction}</span></td>
            <td data-label="${labels[3]}">${displayDetail}</td>
        `;

        if (isMaster) {
            rowHtml += `<td data-label="${labels[4]}">
                <button class="btn btn-red" style="padding: 4px 10px; border-radius: 8px; font-size: 0.8rem;" onclick="deleteLogItem(${originalIdx})">🗑️ ${lang === 'th' ? 'ลบ' : 'Del'}</button>
            </td>`;
        }
        tbody.innerHTML += rowHtml + `</tr>`;
    });
}


// --------------------------------------------------------------------------------
// 🗑️ 3. ลบ Log รายการเดียว (เฉพาะ Master เท่านั้น)
// --------------------------------------------------------------------------------
function deleteLogItem(idx) {
    const currentUser = sessionStorage.getItem('kruHengCurrentUser');
    if (currentUser !== masterID) return;
    if (confirm(lang === 'th' ? "ลบ Log รายการนี้ถาวร?" : "Delete this log entry?")) {
        const logs = JSON.parse(localStorage.getItem('kruHengDeleteLogs') || '[]');
        logs.splice(idx, 1);
        localStorage.setItem('kruHengDeleteLogs', JSON.stringify(logs));
        loadLogs();
    }
}


// --------------------------------------------------------------------------------
// 🧹 4. ล้าง Log ทั้งหมด (เฉพาะ Master เท่านั้น)
// --------------------------------------------------------------------------------
function clearAllLogs() {
    const currentUser = sessionStorage.getItem('kruHengCurrentUser');
    if (currentUser !== masterID) return;
    if (confirm(lang === 'th' ? "ยืนยันการล้าง Log ทั้งหมดอย่างถาวร?" : "Clear ALL logs permanently?")) {
        localStorage.removeItem('kruHengDeleteLogs');
        loadLogs();
    }
}

console.log("✅ [SUCCESS] logs.js โหลดเสร็จสมบูรณ์!");

/* =====================================================================
   สิ้นสุดไฟล์ logs.js
   ===================================================================== */
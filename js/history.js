/* =====================================================================
   📚 ไฟล์: js/history.js
   หน้าที่: ระบบประวัติการสอบ (บันทึก, แสดง, ลบ, Export CSV, Pagination)
   --------------------------------------------------------------------
   📦 ฟังก์ชันที่อยู่ในไฟล์นี้:
     1. exportHistoryCSV()           - ส่งออกประวัติเป็นไฟล์ CSV
     2. saveRecord()                 - บันทึกผลสอบลง localStorage/sessionStorage
     3. loadHistory()                - โหลดประวัติ + เรียกวาด Radar/Subject EXP
     4. renderHistoryPage()          - วาดตารางประวัติ (แบ่งหน้า)
     5. updateHistoryPagination()    - วาดปุ่ม Prev/Next
     6. changeHistoryPage(step)      - เปลี่ยนหน้าตาราง
     7. clearHistory()               - ล้างประวัติ + รีเซ็ต EXP ทั้งหมด
     8. clearHistoryThrottled        - เวอร์ชัน throttle ของ clearHistory
     9. deleteHistoryItem(idx)       - ลบประวัติรายการเดียว + หัก EXP/Coin คืน
    10. viewHistory(idx)             - เปิดดูรายละเอียดประวัติเก่า

   📦 ตัวแปร global:
     - currentHistoryPage, HISTORY_PER_PAGE, filteredHistoryData

   🔗 Dependencies (ตัวแปร/ฟังก์ชันจากไฟล์อื่น):
     - lang, stat, wrongs, categoryStats, db, studentNameStr, currentExamTitle
     - masterID, defaultStudentDB
     - getText(), academicRender(), calculateExamEXP()  (จาก app.js)
     - renderProfileBadge()  (จาก profile.js)
     - renderWrongsTable()   (จาก print.js)
     - updatePlayerRadarChart(), updateSubjectEXP()  (จาก stats.js)
     - throttleAction()      (จาก auth.js)

   ⚠️ ลำดับโหลดใน index.html: ต้องโหลดหลัง stats.js, print.js
                                และก่อน app.js
   ===================================================================== */

console.log("📜 [START] โมดูลเริ่มทำงาน: history.js (ประวัติการทำข้อสอบ)");

// --------------------------------------------------------------------------------
// 📦 ตัวแปร Global (ระบบ Pagination)
// --------------------------------------------------------------------------------
let currentHistoryPage = 1;
const HISTORY_PER_PAGE = 10; // แสดงหน้าละ 10 ครั้ง
let filteredHistoryData = [];


// --------------------------------------------------------------------------------
// 📥 1. Export ประวัติเป็นไฟล์ CSV (รองรับ BOM UTF-8 สำหรับ Excel ภาษาไทย)
// --------------------------------------------------------------------------------
function exportHistoryCSV() {
    const role = sessionStorage.getItem('kruHengRole');
    const currentUser = sessionStorage.getItem('kruHengCurrentUser');
    const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || defaultStudentDB;
    const userNick = role === 'guest'
        ? currentUser.replace('Guest_', '')
        : (currentUser && dbStudent[currentUser] ? dbStudent[currentUser].nick : currentUser);

    const history = (role === 'guest')
        ? JSON.parse(sessionStorage.getItem('kruHengTempGuestHistory') || '[]')
        : JSON.parse(localStorage.getItem('kruHengHistory') || '[]');

    let filteredHistory = history;
    if (currentUser !== masterID) {
        filteredHistory = history.filter(rec => rec.name === userNick);
    }

    if (filteredHistory.length === 0) {
        return alert(lang === 'th' ? 'ไม่มีข้อมูลประวัติให้ Export ครับ' : 'No history data to export.');
    }

    let csv = "\uFEFF"; // BOM สำหรับ Excel
    csv += lang === 'th'
        ? "วันที่,ชื่อนักเรียน,ชุดข้อสอบ,คะแนนรวม,ตอบถูก,ข้อทั้งหมด,เวลาเริ่ม-จบ\n"
        : "Date,Student Name,Exam Set,Total Score,Correct,Total Qs,Time\n";

    filteredHistory.forEach(r => {
        csv += `"${r.date}","${r.name || '-'}","${r.title}","${r.score}","${r.correct}","${r.total}","${r.timeStr}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `KruHeng_LevelUP_History_${(userNick || 'All')}.csv`;
    link.click();
}


// --------------------------------------------------------------------------------
// 💾 2. บันทึกผลสอบลง storage (เรียกจาก finish())
// --------------------------------------------------------------------------------
function saveRecord() {
    const role = sessionStorage.getItem('kruHengRole');
    const rec = {
        date: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().getTime(),
        name: studentNameStr,
        title: currentExamTitle,
        components: window.currentExamComponents || [],
        score: stat.score.toLocaleString(),
        correct: stat.c,
        total: stat.t,
        earnedExp: window.lastEarnedExp || 0,
        earnedCoins: window.lastEarnedCoins || 0, // 🪙 บันทึกเงิน
        catStats: categoryStats,
        errs: wrongs,
        skill: db[0]?.skill ? getText(db[0].skill, 'en') : 'General',
        timeStr: document.getElementById('ui-timer') ? document.getElementById('ui-timer').innerText : '-'
    };

    if (role === 'guest') {
        const gInfo = JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}');
        gInfo.exp = (gInfo.exp || 0) + rec.earnedExp;
        sessionStorage.setItem('kruHengGuestInfo', JSON.stringify(gInfo));
        const gh = JSON.parse(sessionStorage.getItem('kruHengTempGuestHistory') || '[]');
        gh.unshift(rec);
        sessionStorage.setItem('kruHengTempGuestHistory', JSON.stringify(gh));
    } else {
        const h = JSON.parse(localStorage.getItem('kruHengHistory') || '[]');
        h.unshift(rec);
        localStorage.setItem('kruHengHistory', JSON.stringify(h.slice(0, 500)));

        const user = sessionStorage.getItem('kruHengCurrentUser');
        const dbS = JSON.parse(localStorage.getItem('kruHengStudentDB')) || defaultStudentDB;
        if (dbS[user]) {
            dbS[user].exp = (dbS[user].exp || 0) + rec.earnedExp;
            localStorage.setItem('kruHengStudentDB', JSON.stringify(dbS));
        }
    }

    // ล้างตะกร้าส่วนผสมทิ้งหลังเซฟเสร็จ
    window.currentExamComponents = [];
    loadHistory();
}


// --------------------------------------------------------------------------------
// 📊 3. โหลดประวัติ + กรอง 1 ปี + เรียกวาด Radar / Subject EXP
// --------------------------------------------------------------------------------
function loadHistory() {
    const role = sessionStorage.getItem('kruHengRole');
    const user = sessionStorage.getItem('kruHengCurrentUser');
    if (!user) return;

    let history = (role === 'guest')
        ? JSON.parse(sessionStorage.getItem('kruHengTempGuestHistory') || '[]')
        : JSON.parse(localStorage.getItem('kruHengHistory') || '[]');
    const dbS = JSON.parse(localStorage.getItem('kruHengStudentDB')) || defaultStudentDB;
    const nick = (role === 'guest') ? user.replace('Guest_', '') : (dbS[user] ? dbS[user].nick : user);

    if (typeof updatePlayerRadarChart === 'function') updatePlayerRadarChart(nick);
    if (typeof updateSubjectEXP === 'function') updateSubjectEXP(nick);

    // เก็บ index เดิมไว้ใช้กับปุ่มลบและปุ่มดูรายละเอียด
    let historyWithIndex = history.map((item, index) => ({ ...item, _origIdx: index }));
    let visibleHistory = (user === masterID) ? historyWithIndex : historyWithIndex.filter(r => r.name === nick);

    // 🟢 กรองข้อมูลเฉพาะ 1 ปีล่าสุด
    const oneYearAgoMs = new Date().getTime() - (365 * 24 * 60 * 60 * 1000);
    filteredHistoryData = visibleHistory.filter(item => {
        if (!item.timestamp) return true;
        return item.timestamp >= oneYearAgoMs;
    });

    currentHistoryPage = 1;
    renderHistoryPage();
}


// --------------------------------------------------------------------------------
// 📋 4. วาดตารางประวัติ (แบ่งหน้า Pagination)
// --------------------------------------------------------------------------------
function renderHistoryPage() {
    const tbody = document.getElementById('history-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (filteredHistoryData.length === 0) {
        tbody.innerHTML = `<tr><td colspan='9' style="text-align:center; padding: 20px;">${lang === 'th' ? 'ยังไม่มีประวัติการฝึกฝนในรอบ 1 ปี' : 'No history found in the past year.'}</td></tr>`;
        updateHistoryPagination(0);
        return;
    }

    const startIndex = (currentHistoryPage - 1) * HISTORY_PER_PAGE;
    const endIndex = startIndex + HISTORY_PER_PAGE;
    const pageData = filteredHistoryData.slice(startIndex, endIndex);

    pageData.forEach((r) => {
        // 📦 สร้างป้าย Tooltip ชี้เพื่อดูส่วนผสมในตารางประวัติ
        let compText = "";
        if (r.components && r.components.length > 0) {
            let details = r.components.map(c => `• ${c.title} (${c.count} ข้อ)`).join('&#10;');
            compText = ` <span style="cursor:help; background: rgba(0,240,255,0.15); padding: 2px 8px; border-radius: 15px; display: inline-block; margin-left: 5px; font-size: 0.95rem; vertical-align: middle;" title="${details}">📦</span>`;
        }

        tbody.innerHTML += `
            <tr>
                <td data-label="${lang === 'th' ? 'วัน/เวลา' : 'Date'}"><small>${r.date}</small></td>
                <td data-label="${lang === 'th' ? 'ชื่อ' : 'Name'}"><b>${r.name || '-'}</b></td>
                <td data-label="${lang === 'th' ? 'หัวข้อ' : 'Topic'}" style="text-align:left; line-height: 1.4;" title="${r.title}">
                    <span style="display:inline-block; vertical-align:middle; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${r.title}</span>${compText}
                </td>
                <td data-label="${lang === 'th' ? 'คะแนน' : 'Pts'}" style="color:var(--primary); font-weight:bold;">${r.score}</td>
                <td data-label="${lang === 'th' ? 'เหรียญ' : 'Coins'}" style="color:#ff9800; font-weight:bold;">+${r.earnedCoins || 0}</td>
                <td data-label="EXP" style="color:var(--success); font-weight:bold;">+${r.earnedExp || 0}</td>
                <td data-label="${lang === 'th' ? 'ถูก/ทั้งหมด' : 'C/T'}">${r.correct}/${r.total}</td>
                <td data-label="${lang === 'th' ? 'เวลา' : 'Time'}"><small>${r.timeStr || '-'}</small></td>
                <td data-label="${lang === 'th' ? 'จัดการ' : 'Action'}" style="display: flex; gap: 6px; justify-content: flex-end; flex-wrap: wrap;">
                    <button class="btn btn-util" style="padding: 6px 10px; border-radius: 8px; font-size: 0.9rem;" onclick="viewHistory(${r._origIdx})" title="ดูรายละเอียด">🔍</button>
                    <button class="btn btn-red" style="padding: 6px 10px; border-radius: 8px; font-size: 0.9rem;" onclick="deleteHistoryItem(${r._origIdx})" title="ลบประวัติ">🗑️</button>
                </td>
            </tr>`;
    });

    const totalPages = Math.ceil(filteredHistoryData.length / HISTORY_PER_PAGE);
    updateHistoryPagination(totalPages);
}


// --------------------------------------------------------------------------------
// ⬅️➡️ 5. ปุ่มเปลี่ยนหน้า (Pagination Controls)
// --------------------------------------------------------------------------------
function updateHistoryPagination(totalPages) {
    let container = document.getElementById('history-pagination');

    if (!container) {
        container = document.createElement('div');
        container.id = 'history-pagination';
        container.style.cssText = "display:flex; justify-content:center; gap:10px; margin-top:20px; align-items:center; width: 100%; flex-wrap: wrap;";
        const historyBox = document.getElementById('history-box');
        if (historyBox) historyBox.appendChild(container);
    }

    if (totalPages <= 1) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';
    container.innerHTML = `
        <button class="btn btn-util" style="padding: 8px 15px; font-size:0.9rem;" onclick="changeHistoryPage(-1)" ${currentHistoryPage === 1 ? 'disabled' : ''}>
            ◀ ${lang === 'th' ? 'ก่อนหน้า' : 'Prev'}
        </button>
        <span style="font-weight:bold; color:var(--text-color); background: var(--card-bg); padding: 5px 15px; border-radius: 20px; border: 1px solid var(--secondary);">
            ${lang === 'th' ? 'หน้า' : 'Page'} ${currentHistoryPage} / ${totalPages}
        </span>
        <button class="btn btn-util" style="padding: 8px 15px; font-size:0.9rem;" onclick="changeHistoryPage(1)" ${currentHistoryPage === totalPages ? 'disabled' : ''}>
            ${lang === 'th' ? 'ถัดไป' : 'Next'} ▶
        </button>
    `;
}

window.changeHistoryPage = function (step) {
    const totalPages = Math.ceil(filteredHistoryData.length / HISTORY_PER_PAGE);
    currentHistoryPage += step;
    if (currentHistoryPage < 1) currentHistoryPage = 1;
    if (currentHistoryPage > totalPages) currentHistoryPage = totalPages;
    renderHistoryPage();
};


// --------------------------------------------------------------------------------
// 🧹 6. ล้างประวัติทั้งหมด + รีเซ็ต EXP (มี throttle กันกดรัว)
// --------------------------------------------------------------------------------
function clearHistory() {
    if (confirm(lang === 'th' ? "คุณแน่ใจหรือไม่ว่าต้องการล้างสถิติ และรีเซ็ต EXP กลับเป็น 0?" : "Are you sure you want to reset history and EXP to 0?")) {
        const role = sessionStorage.getItem('kruHengRole');
        const currentUser = sessionStorage.getItem('kruHengCurrentUser');
        const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || defaultStudentDB;
        const userNick = (role === 'guest')
            ? currentUser.replace('Guest_', '')
            : (currentUser && dbStudent[currentUser] ? dbStudent[currentUser].nick : currentUser);

        if (role === 'guest') {
            sessionStorage.removeItem('kruHengTempGuestHistory');
            let gInfo = JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}');
            gInfo.exp = 0;
            sessionStorage.setItem('kruHengGuestInfo', JSON.stringify(gInfo));
            alert(lang === 'th' ? "ล้างข้อมูลประวัติและรีเซ็ต EXP เป็น 0 เรียบร้อยแล้ว" : "Your session history and EXP cleared.");
        } else if (currentUser === masterID) {
            for (let key in dbStudent) { dbStudent[key].exp = 0; }
            localStorage.setItem('kruHengStudentDB', JSON.stringify(dbStudent));
            localStorage.removeItem('kruHengHistory');
            alert(lang === 'th' ? "ล้างข้อมูลประวัติและรีเซ็ต EXP ทุกคนเป็น 0 เรียบร้อยแล้ว" : "All history and EXP cleared.");
        } else {
            let history = JSON.parse(localStorage.getItem('kruHengHistory') || '[]');
            history = history.filter(rec => rec.name !== userNick);
            localStorage.setItem('kruHengHistory', JSON.stringify(history));

            if (dbStudent[currentUser]) {
                dbStudent[currentUser].exp = 0;
                localStorage.setItem('kruHengStudentDB', JSON.stringify(dbStudent));
            }
            alert(lang === 'th' ? "ล้างข้อมูลประวัติและรีเซ็ต EXP เป็น 0 เรียบร้อยแล้ว" : "Your history and EXP cleared.");
        }

        loadHistory();
        renderProfileBadge();
    }
}

const clearHistoryThrottled = throttleAction(clearHistory, 1500);


// --------------------------------------------------------------------------------
// 🗑️ 7. ลบประวัติรายการเดียว + หัก EXP/Coin คืน
// --------------------------------------------------------------------------------
function deleteHistoryItem(idx) {
    if (confirm(lang === 'th' ? "ต้องการลบประวัติรายการนี้และหัก EXP/Coin คืนหรือไม่?" : "Delete this record and deduct EXP/Coins?")) {
        const role = sessionStorage.getItem('kruHengRole');
        const historyKey = 'kruHengHistory';
        const currentUser = sessionStorage.getItem('kruHengCurrentUser');

        const getExp = (h, curExp) => {
            if (h.earnedExp !== undefined) return h.earnedExp;
            let tList = h.catStats ? Object.keys(h.catStats) : [];
            return calculateExamEXP(curExp || 0, h.title || "", tList, h.correct || 0, h.total || 1, []);
        };

        if (role === 'guest') {
            let tempHistory = JSON.parse(sessionStorage.getItem('kruHengTempGuestHistory') || '[]');
            const deletedItem = tempHistory[idx];
            let gInfo = JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}');

            let expToDeduct = getExp(deletedItem, gInfo.exp);
            let coinsToDeduct = deletedItem.earnedCoins || 0; // 🌟 คำนวณเงินที่จะริบ

            tempHistory.splice(idx, 1);
            sessionStorage.setItem('kruHengTempGuestHistory', JSON.stringify(tempHistory));

            gInfo.exp = Math.max(0, (gInfo.exp || 0) - expToDeduct);
            gInfo.coins = Math.max(0, (gInfo.coins || 0) - coinsToDeduct); // 🌟 ริบเงิน
            sessionStorage.setItem('kruHengGuestInfo', JSON.stringify(gInfo));

        } else {
            let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
            const deletedItem = history[idx];

            let dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || defaultStudentDB;
            let targetKey = null;
            for (let key in dbStudent) {
                if (dbStudent[key].nick === deletedItem.name) { targetKey = key; break; }
            }
            if (!targetKey && deletedItem.name === dbStudent[currentUser]?.nick) targetKey = currentUser;

            let curExp = (targetKey && dbStudent[targetKey]) ? dbStudent[targetKey].exp : 0;
            let expToDeduct = getExp(deletedItem, curExp);
            let coinsToDeduct = deletedItem.earnedCoins || 0; // 🌟 คำนวณเงินที่จะริบ

            history.splice(idx, 1);
            localStorage.setItem(historyKey, JSON.stringify(history));

            if (targetKey && dbStudent[targetKey]) {
                dbStudent[targetKey].exp = Math.max(0, (dbStudent[targetKey].exp || 0) - expToDeduct);
                dbStudent[targetKey].coins = Math.max(0, (dbStudent[targetKey].coins || 0) - coinsToDeduct); // 🌟 ริบเงิน
                localStorage.setItem('kruHengStudentDB', JSON.stringify(dbStudent));
            }
        }

        loadHistory();
        renderProfileBadge();
    }
}


// --------------------------------------------------------------------------------
// 🔍 8. ดูรายละเอียดประวัติเก่า (เปิดหน้า Summary + ตาราง Components)
// --------------------------------------------------------------------------------
function viewHistory(idx) {
    const role = sessionStorage.getItem('kruHengRole');
    let history = (role === 'guest')
        ? JSON.parse(sessionStorage.getItem('kruHengTempGuestHistory') || '[]')
        : JSON.parse(localStorage.getItem('kruHengHistory') || '[]');

    const rec = history[idx];
    if (!rec) return;

    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('sum-screen').style.display = 'block';

    // 🟢 เปลี่ยนคำอธิบายในหน้า Summary เพื่อบอกว่าเป็นประวัติย้อนหลัง
    document.getElementById('ui-sum-done').innerHTML = `🔍 <span style="font-size: 0.7em;">${lang === 'th' ? 'ประวัติการทำข้อสอบชุด:' : 'Exam History:'}</span><br><span style="color:var(--text-color); font-size: 0.6em;">${rec.title}</span>`;

    // ---- ใส่ข้อมูลประวัติเก่าลงกล่องสรุป ----
    let totalQuestions = rec.total || 1;
    let avgPts = Math.round((rec.score || 0) / totalQuestions);
    let avgText = lang === 'th' ? `เฉลี่ย ${avgPts} Pts/ข้อ` : `Avg: ${avgPts} Pts/Q`;

    document.getElementById('sum-score-val').innerText = (rec.score || 0).toLocaleString();
    document.getElementById('sum-avg-val').innerText = avgText;
    document.getElementById('sum-c').innerText = rec.correct || 0;
    document.getElementById('sum-p').innerText = Math.round(((rec.correct || 0) / totalQuestions) * 100) + "%";

    let oldCoins = rec.earnedCoins || rec.coins || 0;
    document.getElementById('sum-exp-val').innerText = `+${(rec.earnedExp || 0).toLocaleString()}`;
    document.getElementById('sum-coin-val').innerText = `+${oldCoins.toLocaleString()}`;

    // 🟢 ตารางโชว์ "ส่วนผสม (Components)"
    let componentsHtml = '';
    if (rec.components && rec.components.length > 0) {
        componentsHtml = `
            <div style="margin: 30px 0; padding: 20px; background: rgba(0,240,255,0.05); border: 2px dashed var(--secondary); border-radius: 15px;">
                <h3 style="margin-top: 0; color: var(--secondary); text-align: left;">📦 ${lang === 'th' ? 'ส่วนผสมของข้อสอบชุดนี้' : 'Exam Components'}</h3>
                <table class="analysis-table" style="margin-top: 10px; background: var(--card-bg);">
                    <thead>
                        <tr>
                            <th style="background: var(--secondary); color: white;">${lang === 'th' ? 'ชื่อชุดข้อสอบ' : 'Exam Set'}</th>
                            <th style="background: var(--secondary); color: white; width: 100px;">${lang === 'th' ? 'จำนวนข้อ' : 'Qs'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rec.components.map(c => `<tr><td style="text-align: left; font-size: 0.9rem;">${c.title}</td><td style="font-weight:bold;">${c.count}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    const cStats = rec.catStats || {};
    const analysisArray = Object.keys(cStats).map(k => {
        const s = cStats[k];
        return { k, c: s.c, t: s.t, pct: Math.round((s.c / s.t) * 100) };
    }).sort((a, b) => a.pct - b.pct);

    // แทรกกล่อง componentsHtml ไว้เหนือตาราง group-analysis-body
    let tbodyContainer = document.getElementById('group-analysis-body').parentElement;
    let existingComponentsBox = document.getElementById('temp-components-box');
    if (existingComponentsBox) existingComponentsBox.remove();

    if (componentsHtml) {
        let div = document.createElement('div');
        div.id = 'temp-components-box';
        div.innerHTML = componentsHtml;
        tbodyContainer.parentNode.insertBefore(div, tbodyContainer);
    }

    document.getElementById('group-analysis-body').innerHTML = analysisArray.map(i =>
        `<tr><td>${i.k}</td><td>${i.c}</td><td>${i.t - i.c}</td><td>${i.t}</td><td>${i.pct}%</td></tr>`
    ).join('');

    const errList = rec.errs || [];
    renderWrongsTable(errList);
    academicRender('sum-screen');
}

console.log("✅ [SUCCESS] history.js โหลดเสร็จสมบูรณ์!");

/* =====================================================================
   สิ้นสุดไฟล์ history.js
   ===================================================================== */
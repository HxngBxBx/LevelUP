/* =====================================================================
   📊 ไฟล์: js/stats.js
   หน้าที่: ระบบสถิติ (Radar Chart + Subject EXP + Dropdown เดือน)
   --------------------------------------------------------------------
   📦 ฟังก์ชันที่อยู่ในไฟล์นี้:
     1. populateStatsMonthDropdown() - สร้าง dropdown เดือนสำหรับกรอง Radar
     2. refreshRadarChart()          - สั่งวาดกราฟใหม่เมื่อเปลี่ยนเดือน
     3. updatePlayerRadarChart(userNick) - คำนวณ+วาด Radar Chart
        └─ calcMonthStats()          - ฟังก์ชันย่อย คำนวณสถิติรายเดือน
     4. updateSubjectEXP(userNick)   - วาดหลอด EXP สายวิชาการ

   📦 ตัวแปร global:
     - window.playerChart  (instance ของ Chart.js Radar)

   🔗 Dependencies (ตัวแปร/ฟังก์ชันจากไฟล์อื่น):
     - lang                (จาก app.js)
     - masterID            (จาก data.js)
     - defaultStudentDB    (จาก data.js)
     - getLevelData()      (จาก profile.js)
     - Chart               (library Chart.js)

   📣 ถูกเรียกจาก:
     - app.js  (initApp, loadHistory, finish)
     - ui.js   (toggleTheme, toggleLang)
     - profile.js (doRebirth → updateSubjectEXP)
     - index.html (stats-month-filter onchange → refreshRadarChart)

   ⚠️ ลำดับโหลดใน index.html: ต้องโหลดหลัง profile.js, data.js
                                และก่อน app.js
   ===================================================================== */

console.log("📊 [START] โมดูลเริ่มทำงาน: stats.js (ระบบสถิติและวิเคราะห์จุดอ่อน)");

// --------------------------------------------------------------------------------
// 📅 1. สร้าง Dropdown เลือกเดือน สำหรับ Radar Chart (12 เดือนย้อนหลัง)
// --------------------------------------------------------------------------------
function populateStatsMonthDropdown() {
    const select = document.getElementById('stats-month-filter');
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '';

    const now = new Date();
    const monthNamesTh = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthNames = lang === 'th' ? monthNamesTh : monthNamesEn;

    select.innerHTML += `<option value="current">${lang === 'th' ? "📊 สถิติปัจจุบัน (เรียลไทม์)" : "📊 Current Stats (Real-time)"}</option>`;
    select.innerHTML += `<option value="1y-avg">${lang === 'th' ? "🌟 สถิติเฉลี่ย 1 ปี" : "🌟 1-Year Avg Stats"}</option>`;

    for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const m = d.getMonth() + 1;
        const y = d.getFullYear();
        const yTh = y + 543;
        select.innerHTML += `<option value="${m}/${yTh}">📅 ${monthNames[m - 1]} ${lang === 'th' ? yTh : y}</option>`;
    }

    if (currentVal) select.value = currentVal;
}


// --------------------------------------------------------------------------------
// 🔄 2. สั่งวาด Radar Chart ใหม่ (เรียกจาก dropdown onchange)
// --------------------------------------------------------------------------------
function refreshRadarChart() {
    const role = sessionStorage.getItem('kruHengRole');
    const currentUser = sessionStorage.getItem('kruHengCurrentUser');
    if (!currentUser) return;
    const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || defaultStudentDB;
    const userNick = (role === 'guest')
        ? currentUser.replace('Guest_', '')
        : (dbStudent[currentUser] ? dbStudent[currentUser].nick : currentUser);
    updatePlayerRadarChart(userNick);
}


// --------------------------------------------------------------------------------
// 🎮 3. คำนวณและวาด Radar Chart (Gamer Stats 6 แกน)
//    แกน: แม่นยำ, ความไว, ความอึด, สม่ำเสมอ, ความจำ, คริติคอล
// --------------------------------------------------------------------------------
window.playerChart = null;

function updatePlayerRadarChart(userNick) {
    const role = sessionStorage.getItem('kruHengRole');
    const history = (role === 'guest')
        ? JSON.parse(sessionStorage.getItem('kruHengTempGuestHistory') || '[]')
        : JSON.parse(localStorage.getItem('kruHengHistory') || '[]');
    const userHistory = history.filter(h => h.name === userNick);

    const filterVal = document.getElementById('stats-month-filter')
        ? document.getElementById('stats-month-filter').value
        : 'current';

    let accuracy = 0, endurance = 0, consistency = 0, memory = 0, critical = 0, agility = 0;

    // 🟢 ฟังก์ชันคำนวณวันย้อนหลังที่แม่นยำ 100% (ใช้ Timestamp สากล)
    const now = new Date();
    const getDays = (h) => h.timestamp ? (now.getTime() - h.timestamp) / (1000 * 3600 * 24) : 999;

    // ────────────────────────────────────────────────────────
    // ฟังก์ชันย่อย: คำนวณสถิติรายเดือน
    // ────────────────────────────────────────────────────────
    function calcMonthStats(hArray, targetMonthYear) {
        let mHistory = hArray.filter(h => {
            if (!h.timestamp) return false;
            const d = new Date(h.timestamp);
            return `${d.getMonth() + 1}/${d.getFullYear() + 543}` === targetMonthYear;
        });

        if (mHistory.length === 0) return { acc: 0, agi: 0, end: 0, con: 0, mem: 0, cri: 0, active: false };

        let totalC = 0, totalT = 0, perfects = 0, totalScore = 0;
        mHistory.forEach(h => {
            totalC += h.correct || 0;
            totalT += h.total || 1;
            totalScore += parseInt((h.score || "0").replace(/,/g, '')) || 0;
            if (h.correct === h.total && h.total > 0) perfects++;
        });

        let acc = totalT > 0 ? Math.round((totalC / totalT) * 100) : 0;
        let cri = Math.round((perfects / mHistory.length) * 100);
        let end = Math.min(mHistory.length * (100 / 15), 100); // 15 ชุดต่อเดือน = อึด 100%

        let uniqueDays = new Set(mHistory.map(h => new Date(h.timestamp).toDateString()));
        let con = Math.min(uniqueDays.size * 10, 100); // 10 วันต่อเดือน = สม่ำเสมอ 100%

        let examCounts = {};
        mHistory.forEach(h => { examCounts[h.title] = (examCounts[h.title] || 0) + 1; });
        let mem = Math.min(Object.values(examCounts).filter(v => v > 1).length * 20, 100);

        // ⚡ Agility: คำนวณความไวจากคะแนน
        let maxPossibleScore = totalT * 1000;
        let agi = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
        if (agi < 0) agi = 0;
        if (agi > 100) agi = 100;

        return { acc, agi, end, con, mem, cri, active: true };
    }

    // ────────────────────────────────────────────────────────
    // คำนวณสถิติตาม filter ที่เลือก
    // ────────────────────────────────────────────────────────
    if (filterVal === 'current' && userHistory.length > 0) {
        // อึด (Endurance): จำนวนชุดที่ทำใน 7 วัน
        endurance = Math.min(userHistory.filter(h => getDays(h) <= 7).length * 10, 100);

        // สม่ำเสมอ (Consistency): จำนวนวันที่เข้ามาทำใน 14 วัน
        let recent14 = userHistory.filter(h => getDays(h) <= 14);
        let uniqueDays = new Set(recent14.map(h => new Date(h.timestamp).toDateString()));
        consistency = Math.min(uniqueDays.size * 10, 100);

        // ความจำ (Memory): จำนวนชุดที่ทำซ้ำใน 30 วัน
        let eCounts = {};
        userHistory.filter(h => getDays(h) <= 30).forEach(h => { eCounts[h.title] = (eCounts[h.title] || 0) + 1; });
        memory = Math.min(Object.values(eCounts).filter(v => v > 1).length * 20, 100);

        // คริติคอล & แม่นยำ: คำนวณจาก 20 ชุดล่าสุด
        let last20 = userHistory.slice(0, 20);
        let tC = 0, tT = 0, perfs = 0, tScore = 0;
        last20.forEach(h => {
            tC += h.correct || 0;
            tT += h.total || 1;
            tScore += parseInt((h.score || "0").replace(/,/g, '')) || 0;
            if (h.correct === h.total && h.total > 0) perfs++;
        });
        accuracy = tT > 0 ? Math.round((tC / tT) * 100) : 0;
        critical = last20.length > 0 ? Math.round((perfs / last20.length) * 100) : 0;

        // ความไว (Agility): คำนวณจากคะแนน Pts
        let maxPts = tT * 1000;
        agility = maxPts > 0 ? Math.round((tScore / maxPts) * 100) : 0;
        if (agility < 0) agility = 0;
        if (agility > 100) agility = 100;

    } else if (filterVal === '1y-avg') {
        let sAcc = 0, sAgi = 0, sEnd = 0, sCon = 0, sMem = 0, sCri = 0, actMos = 0;
        for (let i = 0; i < 12; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            let ms = calcMonthStats(userHistory, `${d.getMonth() + 1}/${d.getFullYear() + 543}`);
            if (ms.active) {
                actMos++;
                sAcc += ms.acc; sAgi += ms.agi; sEnd += ms.end;
                sCon += ms.con; sMem += ms.mem; sCri += ms.cri;
            }
        }
        if (actMos > 0) {
            accuracy = Math.round(sAcc / actMos);
            agility = Math.round(sAgi / actMos);
            endurance = Math.round(sEnd / actMos);
            consistency = Math.round(sCon / actMos);
            memory = Math.round(sMem / actMos);
            critical = Math.round(sCri / actMos);
        }

    } else {
        let ms = calcMonthStats(userHistory, filterVal);
        if (ms.active) {
            accuracy = ms.acc; agility = ms.agi; endurance = ms.end;
            consistency = ms.con; memory = ms.mem; critical = ms.cri;
        }
    }

    // ────────────────────────────────────────────────────────
    // วาด Radar Chart ด้วย Chart.js
    // ────────────────────────────────────────────────────────
    const ctx = document.getElementById('playerRadarChart');
    if (!ctx) return;

    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(0, 240, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = isDark ? '#e0e0e0' : '#1a1a2e';
    const labels = lang === 'th'
        ? ['แม่นยำ', 'ความไว', 'ความอึด', 'สม่ำเสมอ', 'ความจำ', 'คริติคอล']
        : ['Accuracy', 'Agility', 'Endurance', 'Consistency', 'Memory', 'Critical'];

    const data = {
        labels: labels,
        datasets: [{
            label: lang === 'th' ? 'สเตตัส' : 'Stats',
            data: [accuracy, agility, endurance, consistency, memory, critical],
            backgroundColor: 'rgba(0, 240, 255, 0.3)',
            borderColor: 'rgba(0, 240, 255, 1)',
            pointBackgroundColor: 'rgba(255, 0, 127, 1)',
            pointBorderColor: '#fff',
            borderWidth: 2
        }]
    };

    const isMobile = window.innerWidth < 600;
    const dynamicFontSize = isMobile ? 10 : 12;

    const chartConfig = {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: 0 },
            scales: {
                r: {
                    angleLines: { color: gridColor },
                    grid: { color: gridColor },
                    pointLabels: {
                        font: { size: dynamicFontSize, family: 'Sarabun, sans-serif', weight: 'bold' },
                        color: textColor,
                        padding: 2
                    },
                    min: 0, max: 100,
                    ticks: { display: false, stepSize: 20 }
                }
            },
            plugins: { legend: { display: false } }
        }
    };

    if (window.playerChart) {
        window.playerChart.data = data;
        window.playerChart.options.scales.r.angleLines.color = gridColor;
        window.playerChart.options.scales.r.grid.color = gridColor;
        window.playerChart.options.scales.r.pointLabels.color = textColor;
        window.playerChart.update();
    } else {
        window.playerChart = new Chart(ctx, chartConfig);
    }
}


// --------------------------------------------------------------------------------
// 📚 4. คำนวณและวาดหลอด EXP สายวิชาการ (คณิต / วิทย์ / คอม / จิตวิทยา)
// --------------------------------------------------------------------------------
function updateSubjectEXP(userNick) {
    const role = sessionStorage.getItem('kruHengRole');
    const history = (role === 'guest')
        ? JSON.parse(sessionStorage.getItem('kruHengTempGuestHistory') || '[]')
        : JSON.parse(localStorage.getItem('kruHengHistory') || '[]');
    const userHistory = history.filter(h => h.name === userNick);

    let subjects = {
        "Numbers & Algebra":          { name: { th: 'จำนวนและพีชคณิต', en: 'Numbers & Algebra' }, exp: 0, color: '#00f0ff', type: 'math' },
        "Measurement & Geometry":     { name: { th: 'การวัดและเรขาคณิต', en: 'Measurement & Geometry' }, exp: 0, color: '#00ff88', type: 'math' },
        "Statistics and Probability": { name: { th: 'สถิติและความน่าจะเป็น', en: 'Statistics and Probability' }, exp: 0, color: '#ffea00', type: 'math' },
        "Calculus":                   { name: { th: 'แคลคูลัส', en: 'Calculus' }, exp: 0, color: '#ff007f', type: 'math' },
        "Science Process Skills":     { name: { th: 'ทักษะกระบวนการทางวิทยาศาสตร์', en: 'Science Process Skills' }, exp: 0, color: '#00c853', type: 'sci' },
        "Biology":                    { name: { th: 'ชีววิทยา', en: 'Biology' }, exp: 0, color: '#00f0ff', type: 'sci' },
        "Chemistry":                  { name: { th: 'เคมี', en: 'Chemistry' }, exp: 0, color: '#ae57ff', type: 'sci' },
        "Physics":                    { name: { th: 'ฟิสิกส์', en: 'Physics' }, exp: 0, color: '#ff0055', type: 'sci' },
        "Earth, Astronomy & Space":   { name: { th: 'โลก ดาราศาสตร์และอวกาศ', en: 'Earth, Astronomy & Space' }, exp: 0, color: '#ff9800', type: 'sci' },
        "Logic & Fundamentals":       { name: { th: 'พื้นฐานและตรรกะการคิด', en: 'Logic & Fundamentals' }, exp: 0, color: '#00e5ff', type: 'comp' },
        "Data Structures & Algorithms": { name: { th: 'โครงสร้างข้อมูลและอัลกอริทึม', en: 'Data Structures & Algorithms' }, exp: 0, color: '#69f0ae', type: 'comp' },
        "Frontend & Backend":         { name: { th: 'การพัฒนาส่วนหน้าจอและหลังบ้าน', en: 'Frontend & Backend' }, exp: 0, color: '#b2ff59', type: 'comp' },
        "Databases":                  { name: { th: 'ระบบฐานข้อมูล', en: 'Databases' }, exp: 0, color: '#ffd740', type: 'comp' },
        "AI & Modern Tech":           { name: { th: 'ปัญญาประดิษฐ์และการประยุกต์ใช้', en: 'AI & Modern Tech' }, exp: 0, color: '#ff4081', type: 'comp' },
        "Brain & Perception":         { name: { th: 'สมองและการรับรู้', en: 'Brain & Perception' }, exp: 0, color: '#ea80fc', type: 'psycho' },
        "Cognition & Learning":       { name: { th: 'การคิดและการเรียนรู้', en: 'Cognition & Learning' }, exp: 0, color: '#b388ff', type: 'psycho' },
        "Development & Identity":     { name: { th: 'พัฒนาการและตัวตน', en: 'Development & Identity' }, exp: 0, color: '#8c9eff', type: 'psycho' },
        "Social & Relationships":     { name: { th: 'สังคมและคนรอบข้าง', en: 'Social & Relationships' }, exp: 0, color: '#84ffff', type: 'psycho' },
        "Emotions & Mental Health":   { name: { th: 'อารมณ์และสุขภาพจิต', en: 'Emotions & Mental Health' }, exp: 0, color: '#ff8a80', type: 'psycho' }
    };

    // ────────────────────────────────────────────────────────
    // จัดหมวดหมู่ EXP ที่ได้จากประวัติ → กระจายลง subjects
    // ────────────────────────────────────────────────────────
    userHistory.forEach(h => {
        let earned = h.earnedExp || 0;
        let s = h.skill || 'General';
        let t = (h.title || "").toLowerCase();

        if (subjects[s]) {
            subjects[s].exp += earned;
        } else {
            // Fallback: ถอดรหัสจากชื่อ skill หรือ title
            if (s === 'Num_Alg' || s === 'Arithmetic' || s === 'Algebra') subjects["Numbers & Algebra"].exp += earned;
            else if (s === 'Meas_Geo' || s === 'Geometry' || s === 'Measurement') subjects["Measurement & Geometry"].exp += earned;
            else if (s === 'Stat' || s === 'Statistics') subjects["Statistics and Probability"].exp += earned;
            else if (t.includes('ฟิสิกส์') || t.includes('physic')) subjects["Physics"].exp += earned;
            else if (t.includes('เคมี') || t.includes('chem')) subjects["Chemistry"].exp += earned;
            else if (t.includes('ชีว') || t.includes('bio')) subjects["Biology"].exp += earned;
            else if (t.includes('โลก') || t.includes('ดารา') || t.includes('อวกาศ')) subjects["Earth, Astronomy & Space"].exp += earned;
            else if (t.includes('วิทย์') || t.includes('sci')) subjects["Science Process Skills"].exp += earned;
            else if (t.includes('เรขา') || t.includes('วัด') || t.includes('geo')) subjects["Measurement & Geometry"].exp += earned;
            else if (t.includes('สถิติ') || t.includes('stat') || t.includes('น่าจะเป็น')) subjects["Statistics and Probability"].exp += earned;
            else if (t.includes('แคล') || t.includes('calculus')) subjects["Calculus"].exp += earned;
            else if (t.includes('คณิต') || t.includes('math') || t.includes('เลข') || t.includes('พีช')) subjects["Numbers & Algebra"].exp += earned;
            else if (t.includes('จิตวิทยา') || t.includes('psych')) subjects["Brain & Perception"].exp += earned;
            else if (t.includes('โปรแกรม') || t.includes('คอม') || t.includes('comp') || t.includes('code') || t.includes('โค้ด') || t.includes('อัลกอริทึม')) subjects["Logic & Fundamentals"].exp += earned;
        }
    });

    // ────────────────────────────────────────────────────────
    // วาดหลอด EXP ลงใน DOM แต่ละหมวด
    // ────────────────────────────────────────────────────────
    const mathList = document.getElementById('math-exp-list');
    const sciList = document.getElementById('sci-exp-list');
    const psychoList = document.getElementById('psycho-exp-list');
    const compList = document.getElementById('comp-exp-list');

    [mathList, sciList, psychoList, compList].forEach(list => {
        if (list) { list.innerHTML = ''; list.style.justifyContent = 'flex-start'; list.style.paddingTop = '5px'; }
    });

    Object.keys(subjects).forEach(key => {
        const sub = subjects[key];
        let lvlData = getLevelData(sub.exp);
        let displayName = sub.name[lang] || sub.name['th'];

        let html = `
            <div style="margin-bottom: 18px; text-align: left;">
                <div style="color: var(--text-color); font-size: 0.9rem; font-weight: bold; margin-bottom: 6px;">
                    ${displayName}
                </div>
                <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="background:${sub.color}; color:#fff; padding:3px 8px; border-radius:12px; font-size:0.75rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2); text-shadow: 0 0 2px rgba(0,0,0,0.5);">
                        Lv.${lvlData.level}
                    </span>
                    <span style="color:var(--text-color); font-size:0.75rem; font-weight:bold; opacity:0.8; white-space: nowrap;">
                        ${Math.floor(lvlData.currentLevelExp).toLocaleString()} / ${lvlData.expForNext.toLocaleString()}
                    </span>
                </div>
                <div style="width:100%; height:8px; background:rgba(0,0,0,0.1); border-radius:4px; overflow:hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="width:${lvlData.percent}%; height:100%; background:${sub.color}; box-shadow: 0 0 10px ${sub.color}; transition: width 1.5s ease-out;"></div>
                </div>
            </div>`;

        if (sub.type === 'math' && mathList) mathList.innerHTML += html;
        else if (sub.type === 'sci' && sciList) sciList.innerHTML += html;
        else if (sub.type === 'psycho' && psychoList) psychoList.innerHTML += html;
        else if (sub.type === 'comp' && compList) compList.innerHTML += html;
    });
}

console.log("✅ [SUCCESS] stats.js โหลดเสร็จสมบูรณ์!");

/* =====================================================================
   สิ้นสุดไฟล์ stats.js
   ===================================================================== */
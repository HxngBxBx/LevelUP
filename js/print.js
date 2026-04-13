/* =====================================================================
   🖨️ ไฟล์: js/print.js
   หน้าที่: ระบบปริ้นท์ใบงาน + ตารางข้อที่ทำผิด + จำลองหน้าสรุป
   --------------------------------------------------------------------
   📦 ฟังก์ชันที่อยู่ในไฟล์นี้:
     1. renderWrongsTable(wrongsList)  - วาดตารางข้อที่ตอบผิด
     2. showMockSummary()              - จำลองหน้าสรุปผลสำหรับ debug/test
     3. prepareAndPrint()              - สร้างหน้าปริ้นท์และเรียก window.print()

   📦 ตัวแปร global:
     - currentWrongsToDisplay  (เก็บข้อที่ผิดล่าสุดสำหรับปริ้นท์)

   🔗 Dependencies (ตัวแปร/ฟังก์ชันจากไฟล์อื่น):
     - lang, db, stat, wrongs, categoryStats, selectedFiles  (จาก app.js)
     - masterID, defaultStudentDB  (จาก data.js)
     - getText(), parseMedia()      (จาก app.js)
     - mixQuestions()               (จาก app.js)
     - academicRender()             (จาก app.js)
     - finish()                     (จาก app.js)

   📣 ถูกเรียกจาก:
     - app.js (finish → renderWrongsTable, viewHistory → renderWrongsTable)
     - index.html (ปุ่ม 🖨️ ปริ้นท์, ปุ่ม Test Summary)

   ⚠️ ลำดับโหลดใน index.html: ต้องโหลดก่อน app.js
   ===================================================================== */

console.log("🖨️ [START] โมดูลเริ่มทำงาน: print.js (ระบบปริ้นท์ข้อสอบทบทวน)");

// --------------------------------------------------------------------------------
// 📦 ตัวแปร Global
// --------------------------------------------------------------------------------
let currentWrongsToDisplay = [];


// --------------------------------------------------------------------------------
// ❌ 1. วาดตารางข้อที่ตอบผิด (แสดงในหน้าสรุปผล + หน้าดูประวัติ)
// --------------------------------------------------------------------------------
function renderWrongsTable(wrongsList) {
    currentWrongsToDisplay = wrongsList;
    document.getElementById('wrong-detail-body').innerHTML = wrongsList.map(w => {
        const topicText = getText(w.topic, lang);
        const grade = topicText.match(/(ม\.\d เทอม \d|M\.\d Term \d|ป\.\d เทอม \d|P\.\d Term \d)/)?.[1] || "-";
        const topicOnly = topicText.replace(/(ม\.\d เทอม \d\s*-\s*|M\.\d Term \d\s*-\s*|ป\.\d เทอม \d\s*-\s*|P\.\d Term \d\s*-\s*)/, "");
        // ใช้ parseMedia ในการแสดงโจทย์และเฉลยในตารางข้อผิด
        return `<tr><td>${w.id || '-'}</td><td><b>${grade}</b></td><td>${topicOnly}</td><td style="text-align:left;">${parseMedia(getText(w.q, lang))}</td><td style="color:var(--success); font-weight:bold;">${parseMedia(getText(w.a, lang))}</td></tr>`;
    }).join('');
}


// --------------------------------------------------------------------------------
// 🔍 2. จำลองหน้าสรุปผล (Mock Summary) — สำหรับ debug/test UI เท่านั้น
// --------------------------------------------------------------------------------
function showMockSummary() {
    // 1. ปิดหน้าจออื่นๆ เพื่อเตรียมโชว์หน้าสรุปผล
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'none';

    // 2. จำลองสถิติรายวิชา (ตารางวิเคราะห์)
    categoryStats = {
        "ม.1 เทอม 1": { c: 1, t: 5 },
        "ม.2 เทอม 2": { c: 4, t: 5 }
    };

    // 3. จำลองสถิติรวม
    stat = {
        c: 5,        // ตอบถูก 5 ข้อ
        t: 10,       // ทำไปทั้งหมด 10 ข้อ
        score: 8500, // คะแนนรวม
        coins: 150   // 💰 จำลองเงินที่ได้รับในรอบนี้
    };

    // 4. จำลองประวัติการตอบผิด
    wrongs = [
        { id: 1, topic: "ม.1 เทอม 1 - พืช", q: "ข้อใดคือออร์แกเนลล์ที่เป็นแหล่งพลังงาน?", a: "ไมโทคอนเดรีย" },
        { id: 4, topic: "ม.2 เทอม 2 - เคมี", q: "สูตรโมเลกุลของน้ำคือ $\\ce{H2O}$ หรือไม่?", a: "ใช่" }
    ];

    // 5. จำลองค่า EXP
    window.lastEarnedExp = 50;

    // จำลองส่วนผสมข้อสอบ
    window.currentExamComponents = [
        { title: "ม.1 เทอม 1 ชีววิทยา", count: 5 },
        { title: "ม.2 เทอม 2 เคมี", count: 5 }
    ];

    // 6. สั่งประมวลผลขึ้นหน้าจอทันที
    finish();
}


// --------------------------------------------------------------------------------
// 🖨️ 3. สร้างหน้าปริ้นท์ใบงาน + เฉลย (รองรับ Cover Page + ตัวเลือกปริ้นท์)
// --------------------------------------------------------------------------------
function prepareAndPrint() {
    if (selectedFiles.length === 0 && db.length === 0) {
        return alert(lang === 'th' ? "กรุณาเลือกไฟล์ก่อนครับ" : "Please select files first");
    }

    const printDb = db.length > 0 ? db : mixQuestions();
    const showTopic = document.getElementById('set-print-topic').value === 'true';
    const showDiff = document.getElementById('set-print-diff').value === 'true';

    const role = sessionStorage.getItem('kruHengRole');
    const currentUser = sessionStorage.getItem('kruHengCurrentUser');
    let printAnsMode = document.getElementById('set-print-ans').value;
    let printAnsLoc = document.getElementById('set-print-ans-loc').value;

    // ---- สิทธิ์ปริ้นท์เฉลย: Guest ห้าม / นักเรียนดูจาก permissions ----
    if (role === 'guest') {
        printAnsMode = 'none';
        printAnsLoc = 'inline';
    } else if (role !== 'master') {
        const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || defaultStudentDB;
        const p = dbStudent[currentUser]?.permissions || { print: false };
        if (!p.print) {
            printAnsMode = 'none';
            printAnsLoc = 'inline';
        }
    }

    const thaiPrefix = ['ก', 'ข', 'ค', 'ง'];
    const p = document.getElementById('print-data');

    // ---- ดึงชื่อแบรนด์จากหัวเว็บ ----
    let rawBrand = document.getElementById('ui-brand').innerText;
    let cleanBrand = rawBrand.replace(/🔥\s*/g, '').trim();
    let mainTitle = cleanBrand;
    let subTitle = "";
    let byIdx = cleanBrand.toLowerCase().indexOf(' by ');
    if (byIdx !== -1) {
        mainTitle = cleanBrand.substring(0, byIdx).trim();
        subTitle = cleanBrand.substring(byIdx).trim();
    }

    // ---- สร้างข้อความหัวกระดาษ ----
    let docTypeTitle = lang === 'th' ? 'รวมชุดข้อสอบ' : 'Mixed Exam Sets';
    if (printAnsMode === 'ans_only') docTypeTitle = lang === 'th' ? 'รวมชุดข้อสอบ (พร้อมเฉลย)' : 'Mixed Exam Sets (with Answers)';
    else if (printAnsMode === 'ans_exp') docTypeTitle = lang === 'th' ? 'รวมชุดข้อสอบ (พร้อมเฉลยและวิธีทำ)' : 'Mixed Exam Sets (with Answers & Explanations)';

    const numSets = selectedFiles.length > 0 ? selectedFiles.length : 1;
    const totalSetsText = lang === 'th' ? `ผสมจาก ${numSets} ชุด` : `Mixed from ${numSets} Sets`;
    const totalQsText = lang === 'th' ? `จำนวน ${printDb.length} ข้อ` : `Total: ${printDb.length} Qs`;
    const combinedStatsLine = `${docTypeTitle} &nbsp;|&nbsp; <span style="color: var(--primary);">${totalSetsText}</span> &nbsp;|&nbsp; <span style="color: var(--accent);">${totalQsText}</span>`;

    // ---- คำนวณ layout ของรายชื่อข้อสอบ (1/2/3 คอลัมน์) ----
    let numFiles = selectedFiles.length;
    let cols = 1, fSize = "1.2rem", pad = "10px 15px", gap = "12px 20px", circleSize = "22px", circleFont = "0.85rem";
    if (numFiles >= 21) { cols = 3; fSize = "0.6rem"; pad = "3px 6px"; gap = "4px 6px"; circleSize = "14px"; circleFont = "0.55rem"; }
    else if (numFiles >= 11) { cols = 2; fSize = "0.9rem"; pad = "6px 10px"; gap = "8px 12px"; circleSize = "18px"; circleFont = "0.75rem"; }

    let maxLen = numFiles > 0 ? Math.max(...selectedFiles.map(f => f.title.length)) : 0;
    if (maxLen > 60 && cols === 1) fSize = "1rem";
    if (maxLen > 45 && cols === 2) fSize = "0.8rem";
    if (maxLen > 30 && cols === 3) fSize = "0.55rem";

    // ---- สร้าง HTML รายชื่อชุดข้อสอบ ----
    let examTitlesHtml = "";
    if (numFiles > 0) {
        examTitlesHtml = `<div style="display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: ${gap}; width: 100%; text-align: left; align-items: start;">` +
            selectedFiles.map((f, idx) => `
            <div style="font-size: ${fSize}; color: var(--text-color); font-weight: bold; background: white; padding: ${pad}; border-radius: 8px; border: 1px solid rgba(112,0,255,0.2); display: flex; align-items: flex-start; gap: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); page-break-inside: avoid; break-inside: avoid;">
                <span style="background: linear-gradient(45deg, var(--primary), var(--accent)); color: white; border-radius: 50%; min-width: ${circleSize}; height: ${circleSize}; display: inline-flex; align-items: center; justify-content: center; font-size: ${circleFont}; flex-shrink: 0; margin-top: ${cols === 1 ? '3px' : '0'}; -webkit-print-color-adjust: exact; print-color-adjust: exact;">${idx + 1}</span>
                <span style="line-height: 1.3; word-break: break-word; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${f.title}</span>
            </div>`).join('') + `</div>`;
    } else {
        examTitlesHtml = `<div style="font-size: 1.5rem; color: var(--text-color); font-weight: bold;">${lang === 'th' ? "ชุดข้อสอบผสม" : "Mixed Exam"}</div>`;
    }

    // ---- สร้าง Cover Page (หน้าปก) ----
    const coverPageHtml = `
        <div style="position: relative; width: 100%; height: 95vh; display: flex; flex-direction: column; align-items: center; page-break-after: always; box-sizing: border-box; padding: 10px 20px; overflow: hidden; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
            <div style="flex: 0 0 auto; width: 100%; text-align: center; margin-bottom: 10px;">
                <svg width="100%" height="100" viewBox="0 0 800 120" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 0;">
                    <defs><linearGradient id="textGrad1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ff007f" /><stop offset="100%" stop-color="#00f0ff" /></linearGradient><linearGradient id="textGrad2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#7000ff" /><stop offset="100%" stop-color="#00f0ff" /></linearGradient></defs>
                    <text x="50%" y="55" text-anchor="middle" font-size="4.5rem" font-weight="900" fill="url(#textGrad1)" font-family="sans-serif">${mainTitle}</text>
                    <text x="50%" y="105" text-anchor="middle" font-size="2rem" font-weight="bold" fill="url(#textGrad2)" font-family="sans-serif">${subTitle}</text>
                </svg>
                <div style="margin: 0 auto; display: flex; justify-content: center;">
                    <svg width="120" height="120" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                        <defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff007f;stop-opacity:1" /><stop offset="100%" style="stop-color:#7000ff;stop-opacity:1" /></linearGradient><linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#00f0ff;stop-opacity:1" /><stop offset="100%" style="stop-color:#00ff88;stop-opacity:1" /></linearGradient></defs>
                        <polygon points="150,20 280,70 280,230 150,280 20,230 20,70" fill="rgba(255,0,127,0.05)" stroke="url(#grad1)" stroke-width="4"/>
                        <path d="M 150 60 L 220 160 L 175 160 L 175 240 L 125 240 L 125 160 L 80 160 Z" fill="url(#grad2)" />
                        <circle cx="70" cy="80" r="8" fill="#ff007f" /><circle cx="230" cy="110" r="12" fill="#00f0ff" /><circle cx="240" cy="210" r="6" fill="#7000ff" /><circle cx="60" cy="190" r="9" fill="#00ff88" />
                    </svg>
                </div>
                <h3 style="font-size: 1.4rem; color: var(--text-color); margin: 10px 0 10px 0; background: #f4f7ff; display: inline-block; padding: 8px 25px; border-radius: 50px; border: 2px solid rgba(0,240,255,0.3); -webkit-print-color-adjust: exact; print-color-adjust: exact;">${combinedStatsLine}</h3>
            </div>
            <div style="flex: 1 1 auto; width: 100%; max-width: 100%; background: rgba(112,0,255,0.02); border: 2px dashed var(--accent); border-radius: 15px; padding: 15px; overflow: hidden; display: flex; flex-direction: column; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
                <div style="text-align: center; font-size: 1.1rem; font-weight: bold; color: var(--accent); margin-bottom: 10px; border-bottom: 1px solid rgba(112,0,255,0.1); padding-bottom: 5px; flex-shrink: 0;">📝 ${lang === 'th' ? 'รายชื่อชุดข้อสอบที่นำมาผสม' : 'Included Exam Sets'}</div>
                <div style="flex: 1 1 auto; overflow: hidden; display: flex; align-items: flex-start; justify-content: center; padding-top: 5px; width: 100%;"><div style="width: 100%;">${examTitlesHtml}</div></div>
            </div>
        </div>
    `;

    // ---- สร้างเนื้อหาข้อสอบ ----
    p.innerHTML = coverPageHtml;
    const thaiPrefixLabel = lang === 'th' ? thaiPrefix : ['A', 'B', 'C', 'D'];
    const qLabel = lang === 'th' ? 'ข้อที่' : 'Q.';
    const aLabel = lang === 'th' ? 'เฉลย:' : 'Answer:';
    const expLabel = lang === 'th' ? 'วิธีทำ/คำอธิบาย:' : 'Explanation:';
    const topicLabel = lang === 'th' ? 'เนื้อหา:' : 'Topic:';
    const diffLabel = lang === 'th' ? 'ระดับความยาก:' : 'Difficulty:';

    let endAnswersHtml = '';
    if ((printAnsMode === 'ans_only' || printAnsMode === 'ans_exp') && printAnsLoc === 'end') {
        endAnswersHtml += `<div style="page-break-before: always; padding-top: 20px;">
                            <h2 style="text-align:center; color:var(--accent); border-bottom:2px solid var(--accent); padding-bottom:10px;">${lang === 'th' ? 'เฉลยแบบทดสอบ' : 'Answer Key'}</h2>
                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin-top:20px;">`;
    }

    // ---- วนลูปสร้างแต่ละข้อ ----
    printDb.forEach((q, i) => {
        let optionsHtml = getText(q.options, lang).map((o, idx) =>
            `<div style="margin-bottom: 5px; font-size: 1.1rem; padding-left: 20px;">${thaiPrefixLabel[idx] || thaiPrefix[idx]}. ${parseMedia(o)}</div>`
        ).join('');

        let metaHtml = '';
        if (showTopic || showDiff) {
            let metaParts = [];
            if (showTopic && q.topic) metaParts.push(`<b>${topicLabel}</b> ${getText(q.topic, lang)}`);
            if (showTopic && q.skill) metaParts.push(`<b>${lang === 'th' ? 'สกิล:' : 'Skill:'}</b> ${getText(q.skill, lang)}`);
            if (showDiff && q.difficulty) metaParts.push(`<b>${diffLabel}</b> ${getText(q.difficulty, lang)}`);
            if (metaParts.length > 0) {
                metaHtml = `<div style="margin-bottom: 10px; font-size: 0.9rem; color: var(--text-color);">${metaParts.join(' | ')}</div>`;
            }
        }

        let ansHtml = '';
        if (printAnsMode === 'ans_only' || printAnsMode === 'ans_exp') {
            ansHtml += `<div class="ans-label">${aLabel} ${parseMedia(getText(q.answer, lang))}</div>`;
        }
        if (printAnsMode === 'ans_exp' && q.explanation) {
            ansHtml += `<div style="margin-top: 8px; font-size: 0.95rem; color: var(--text-color); border-left: 3px solid var(--primary); padding-left: 10px;"><b>${expLabel}</b> ${parseMedia(getText(q.explanation, lang))}</div>`;
        }

        if (printAnsLoc === 'inline' || printAnsMode === 'none') {
            p.innerHTML += `<div class="print-item">${metaHtml}<b>${qLabel} ${i + 1}:</b> ${parseMedia(getText(q.question, lang))}<div style="margin-top: 10px;">${optionsHtml}</div>${ansHtml}</div>`;
        } else if (printAnsLoc === 'end' && printAnsMode !== 'none') {
            p.innerHTML += `<div class="print-item">${metaHtml}<b>${qLabel} ${i + 1}:</b> ${parseMedia(getText(q.question, lang))}<div style="margin-top: 10px;">${optionsHtml}</div></div>`;
            endAnswersHtml += `<div style="background:#f9f9f9; padding:15px; border-radius:8px; border:1px solid #ddd; page-break-inside: avoid;">
                                <b style="color:var(--primary);">${qLabel} ${i + 1}:</b> ${ansHtml}
                               </div>`;
        }
    });

    // ---- ต่อท้ายหน้าเฉลย (ถ้าเลือกพิมพ์เฉลยท้ายเล่ม) ----
    if ((printAnsMode === 'ans_only' || printAnsMode === 'ans_exp') && printAnsLoc === 'end') {
        endAnswersHtml += `</div></div>`;
        p.innerHTML += endAnswersHtml;
    }

    // ---- Render สูตร KaTeX แล้วเปิดหน้าปริ้นท์ ----
    academicRender('print-data');
    setTimeout(() => window.print(), 800);
}

console.log("✅ [SUCCESS] print.js โหลดเสร็จสมบูรณ์!");

/* =====================================================================
   สิ้นสุดไฟล์ print.js
   ===================================================================== */
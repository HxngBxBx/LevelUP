/* =====================================================================
   🧙‍♂️ ไฟล์: js/app_wizard.js
   หน้าที่: ระบบ Smart Exam Wizard (แสกนหาข้อสอบ, โหลดไฟล์, จัดการตะกร้าข้อสอบ)
   ===================================================================== */
console.log("🧙‍♂️ [START] โมดูลเริ่มทำงาน: app_wizard.js (ระบบค้นหาและเลือกข้อสอบแบบเจาะจงบทเรียน)");

// หมายเหตุ: ตัวแปร wizardOverlay ถูกประกาศไว้ใน app_core.js แล้ว จึงไม่ต้องประกาศซ้ำที่นี่

function createWizardOverlay() {
    if (!wizardOverlay) {
        wizardOverlay = document.createElement('div');
        wizardOverlay.id = 'exam-wizard-overlay';
        wizardOverlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:10000; display:none; justify-content:center; align-items:center; backdrop-filter:blur(8px);";
        
        const content = document.createElement('div');
        content.id = 'exam-wizard-content';
        content.style.cssText = "background:var(--card-bg, #fff); padding:18px; border-radius:16px; width:92%; max-width:600px; max-height:88vh; overflow-y:auto; box-shadow:0 15px 40px rgba(0,0,0,0.5); position:relative; box-sizing:border-box;";
        
        wizardOverlay.appendChild(content);
        document.body.appendChild(wizardOverlay);
        
        wizardOverlay.addEventListener('click', (e) => {
            if (e.target === wizardOverlay) wizardOverlay.style.display = 'none';
        });

        // แอนิเมชันสำหรับตอนโหลดสแกนและป้าย NEW
        if(!document.getElementById('kruheng-anim-style')) {
            const style = document.createElement('style');
            style.id = 'kruheng-anim-style';
            style.innerHTML = `
                @keyframes kruheng-pulse { 0% { transform: scale(0.9); opacity: 0.7; } 100% { transform: scale(1.1); opacity: 1; } }
                #exam-wizard-content h2 { font-size: 1.1rem; }
                #exam-wizard-content h3 { font-size: 0.95rem; }
                #exam-wizard-content h4 { font-size: 0.88rem; }
                @media (max-width: 480px) {
                    #exam-wizard-content { padding: 12px !important; }
                    #exam-wizard-content h2 { font-size: 1rem !important; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    return document.getElementById('exam-wizard-content');
}

// Step 1: เลือกวิชา
function openExamWizard_Subject() {
    const content = createWizardOverlay();
    wizardOverlay.style.display = 'flex';
    
    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px dashed var(--secondary); padding-bottom:15px; margin-bottom:20px;">
            <h2 style="margin:0; color:var(--text-color);">📚 ${lang === 'th' ? 'เลือกรายวิชา' : 'Select Subject'}</h2>
            <button onclick="document.getElementById('exam-wizard-overlay').style.display='none'" style="background:var(--danger); color:white; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer; font-weight:bold; font-size:1rem; flex-shrink:0;">✕</button>
        </div>
        <div style="display:grid; grid-template-columns:1fr; gap:12px;">
    `;
    
    for (let subjKey in NEW_EXAM_STRUCTURE) {
        const subject = NEW_EXAM_STRUCTURE[subjKey];
        html += `
            <button onclick="openExamWizard_Grade('${subjKey}')" style="background:rgba(0,240,255,0.1); border:2px solid var(--secondary); color:var(--text-color); padding:11px 14px; border-radius:12px; font-size:1rem; font-weight:bold; cursor:pointer; text-align:left; transition:0.2s; display:flex; justify-content:space-between; align-items:center; width:100%; box-sizing:border-box;" onmouseover="this.style.background='var(--secondary)'; this.style.color='white';" onmouseout="this.style.background='rgba(0,240,255,0.1)'; this.style.color='var(--text-color)';">
                ${subject.title[lang]}
                <span style="font-size:1.2rem; flex-shrink:0;">👉</span>
            </button>
        `;
    }
    html += `</div>`;
    content.innerHTML = html;
}

// Step 2: เลือกระดับชั้น
function openExamWizard_Grade(subjKey) {
    const content = document.getElementById('exam-wizard-content');
    const subject = NEW_EXAM_STRUCTURE[subjKey];
    
    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px dashed var(--secondary); padding-bottom:15px; margin-bottom:20px;">
            <h2 style="margin:0; color:var(--text-color);">🎓 ${lang === 'th' ? 'เลือกระดับชั้น' : 'Select Grade'}</h2>
            <div style="display:flex; gap:10px;">
                <button onclick="openExamWizard_Subject()" style="background:var(--primary); color:white; border:none; padding:6px 12px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:0.85rem;">⬅️ ${lang==='th'?'กลับ':'Back'}</button>
                <button onclick="document.getElementById('exam-wizard-overlay').style.display='none'" style="background:var(--danger); color:white; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer; font-weight:bold; font-size:1rem; flex-shrink:0;">✕</button>
            </div>
        </div>
        <h4 style="color:var(--secondary); margin-top:0; margin-bottom:15px;">วิชา: ${subject.title[lang]}</h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(120px, 1fr)); gap:8px;">
    `;

    for (let gradeKey in subject.grades) {
        const grade = subject.grades[gradeKey];
        html += `
            <button onclick="openExamWizard_Unit('${subjKey}', '${gradeKey}')" style="background:rgba(112,0,255,0.1); border:2px solid var(--accent); color:var(--text-color); padding:11px 10px; border-radius:12px; font-size:0.95rem; font-weight:bold; cursor:pointer; transition:0.2s; box-sizing:border-box;" onmouseover="this.style.background='var(--accent)'; this.style.color='white';" onmouseout="this.style.background='rgba(112,0,255,0.1)'; this.style.color='var(--text-color)';">
                ${grade.title[lang]}
            </button>
        `;
    }
    html += `</div>`;
    content.innerHTML = html;
}

// Step 3: เลือกบทเรียน (Unit) พร้อมปุ่มหลากสี
function openExamWizard_Unit(subjKey, gradeKey) {
    const content = document.getElementById('exam-wizard-content');
    const subject = NEW_EXAM_STRUCTURE[subjKey];
    const grade = subject.grades[gradeKey];
    
    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px dashed var(--secondary); padding-bottom:15px; margin-bottom:15px; position:sticky; top:0; background:var(--card-bg); z-index:10;">
            <h2 style="margin:0; color:var(--text-color);">📄 ${lang === 'th' ? 'เลือกบทเรียน' : 'Select Unit'}</h2>
            <div style="display:flex; gap:10px;">
                <button onclick="openExamWizard_Grade('${subjKey}')" style="background:var(--primary); color:white; border:none; padding:6px 12px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:0.85rem;">⬅️ ${lang==='th'?'กลับ':'Back'}</button>
                <button onclick="document.getElementById('exam-wizard-overlay').style.display='none'" style="background:var(--danger); color:white; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer; font-weight:bold; font-size:1rem; flex-shrink:0;">✕</button>
            </div>
        </div>
        <h4 style="color:var(--secondary); margin-top:0; margin-bottom:15px;">${subject.title[lang]} > ${grade.title[lang]}</h4>
    `;

    // 🎨 ธีมสีธาตุเวทมนตร์สำหรับกระดานเควส
    let unitCount = 0; 
    const colorThemes = [
        { bg: 'rgba(174,87,255,0.1)', hover: 'rgba(174,87,255,0.25)', border: '#ae57ff' }, // 🔮 ม่วงเวทมนตร์
        { bg: 'rgba(0,240,255,0.1)', hover: 'rgba(0,240,255,0.25)', border: '#00f0ff' }, // ❄️ ฟ้าสไลม์
        { bg: 'rgba(0,255,136,0.1)', hover: 'rgba(0,255,136,0.25)', border: '#00ff88' }, // 🍃 เขียวฮีลลิ่ง
        { bg: 'rgba(255,152,0,0.1)',  hover: 'rgba(255,152,0,0.25)', border: '#ff9800' }, // 🔥 ส้มเพลิง
        { bg: 'rgba(255,0,127,0.1)',  hover: 'rgba(255,0,127,0.25)', border: '#ff007f' }  // 🌸 ชมพูซากุระ
    ];

    for (let tKey in grade.terms) {
        const term = grade.terms[tKey];
        html += `<h3 style="color:var(--accent); background:rgba(0,0,0,0.05); padding:8px 12px; border-radius:8px; margin-top:15px; font-size:0.95rem;">📅 ${term.title[lang]}</h3>`;
        html += `<div style="display:flex; flex-direction:column; gap:10px; margin-bottom: 25px;">`;
        
        term.units.forEach(unit => {
            // เช็กก่อนว่าบทนี้มีกำหนดข้อสอบไว้บ้างไหม
            let hasAnySets = false;
            if (unit.maxSets) {
                if (unit.maxSets.easy > 0 || unit.maxSets.medium > 0 || unit.maxSets.hard > 0 || unit.maxSets.extreme > 0) {
                    hasAnySets = true;
                }
            }

            const theme = colorThemes[unitCount % colorThemes.length]; // ดึงสีตามคิว
            unitCount++;

            if (hasAnySets) {
                html += `
                    <button onclick="openExamWizard_ScanUnit('${subjKey}', '${gradeKey}', '${tKey}', '${unit.id}')" 
                        style="background:${theme.bg}; border:1px solid ${theme.border}; border-left: 6px solid ${theme.border}; color:var(--text-color); padding:14px 18px; border-radius:12px; font-size:0.95rem; text-align:left; cursor:pointer; transition:all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275); line-height:1.5; box-shadow: 0 4px 6px rgba(0,0,0,0.05); position:relative; overflow:hidden;" 
                        onmouseover="this.style.background='${theme.hover}'; this.style.transform='translateX(8px)';" 
                        onmouseout="this.style.background='${theme.bg}'; this.style.transform='translateX(0)';">
                        <span style="font-weight:bold; text-shadow:0 1px 1px rgba(0,0,0,0.05); display:block;">${unit.name[lang]}</span>
                    </button>
                `;
            } else {
                html += `
                    <button disabled
                        style="background:rgba(0,0,0,0.03); border:1px dashed rgba(0,0,0,0.15); color:var(--text-muted); padding:14px 18px; border-radius:12px; font-size:0.9rem; text-align:left; cursor:not-allowed; line-height:1.5; opacity:0.8;">
                        ${unit.name[lang]} 
                        <span style="font-size:0.75rem; color:var(--danger); float:right; background:rgba(255,0,0,0.08); padding:3px 10px; border-radius:12px; font-weight:bold; margin-top:-2px;">🔒 ปลดล็อกเร็วๆ นี้</span>
                    </button>
                `;
            }
        });
        html += `</div>`;
    }

    content.innerHTML = html;
}

// Step 4: แสกนหาไฟล์ที่มีอยู่จริง (สแกนเจาะจงเฉพาะบทเรียน พร้อมกัน Netlify หลอก)
async function openExamWizard_ScanUnit(subjKey, gradeKey, tKey, unitId) {
    const content = document.getElementById('exam-wizard-content');
    const subject = NEW_EXAM_STRUCTURE[subjKey];
    const grade = subject.grades[gradeKey];
    const term = grade.terms[tKey];
    const unit = term.units.find(u => u.id === unitId);
    
    // ดึงชื่อบทแบบลบ Tag HTML ออกเพื่อความสวยงาม
    let cleanUnitName = unit.name[lang].replace(/<[^>]*>?/gm, ' ').trim();

    content.innerHTML = `
        <div style="text-align:center; padding: 30px 15px;">
            <div style="font-size: 3rem; display:inline-block; animation: kruheng-pulse 1s infinite alternate;">📡</div>
            <h2 style="margin-top: 15px; color: var(--primary);">${lang === 'th' ? 'กำลังสแกนหาข้อสอบ...' : 'Scanning for exams...'}</h2>
            <p style="color: var(--text-color); font-size: 0.95rem;">${lang === 'th' ? 'ค้นหาข้อสอบในบท: ' + cleanUnitName : 'Searching in: ' + cleanUnitName}</p>
            <div style="margin-top:20px; width:100%; height:15px; background:rgba(0,0,0,0.1); border-radius:10px; overflow:hidden; border: 1px solid var(--secondary);">
                <div id="scan-progress" style="width:0%; height:100%; background:linear-gradient(90deg, var(--primary), var(--success)); transition:width 0.2s;"></div>
            </div>
        </div>
    `;
    
    let potentialFiles = [];
    const diffNames = { easy: 'ระดับง่าย', medium: 'ระดับกลาง', hard: 'ระดับยาก', extreme: 'ระดับโหดสุด' };
    
    // สร้างคิวสแกนเฉพาะของบทนี้บทเดียว
    ['easy', 'medium', 'hard', 'extreme'].forEach(diff => {
        const count = (unit.maxSets && unit.maxSets[diff]) ? unit.maxSets[diff] : 0;
        for (let i = 1; i <= count; i++) {
            const fileName = `${subjKey}_${gradeKey}_${tKey}_${unit.id}_${diff}_${i}.json`;
            potentialFiles.push({ 
                fileName, 
                termTitle: term.title[lang], 
                unitName: cleanUnitName, 
                diffText: diffNames[diff], 
                setNum: i 
            });
        }
    });

    let validExams = [];
    const total = potentialFiles.length;
    
    if(total === 0) {
        renderScanUnitResult(validExams, subjKey, gradeKey, tKey, unit);
        return;
    }

    let completed = 0;
    const progressBar = document.getElementById('scan-progress');

    // ส่ง HEAD Request ไปเช็กไฟล์
    await Promise.all(potentialFiles.map(async (fileObj) => {
        try {
            const response = await fetch('json/' + fileObj.fileName, { method: 'HEAD' }); 
            const contentType = response.headers.get('content-type');
            // 🛡️ ตรวจจับ 200 OK และต้องไม่ใช่หน้าเว็บ HTML ปลอมๆ ของ Netlify
            if (response.ok && contentType && !contentType.includes('text/html')) {
                validExams.push(fileObj);
            }
        } catch(e) {}
        completed++;
        if(progressBar) progressBar.style.width = (completed / total * 100) + '%';
    }));

    validExams.sort((a,b) => a.fileName.localeCompare(b.fileName));
    // หน่วงเวลานิดนึงให้หลอดโหลดเต็มก่อนเปลี่ยนหน้า
    setTimeout(() => renderScanUnitResult(validExams, subjKey, gradeKey, tKey, unit), 300);
}

// Step 5: วาดผลลัพธ์ที่หาเจอ (เฉพาะบทเรียนนั้นๆ พร้อมเช็กประวัติ NEW/100%)
function renderScanUnitResult(validExams, subjKey, gradeKey, tKey, unit) {
    const content = document.getElementById('exam-wizard-content');
    
    const subject = NEW_EXAM_STRUCTURE[subjKey];
    const grade = subject.grades[gradeKey];
    const term = grade.terms[tKey];
    let cleanUnitName = unit.name[lang].replace(/<[^>]*>?/gm, ' ').trim();
    
    const role = sessionStorage.getItem('kruHengRole');
    const currentUser = sessionStorage.getItem('kruHengCurrentUser');
    const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || {};
    const userNick = (role === 'guest') ? (currentUser ? currentUser.replace('Guest_', '') : 'Unknown') : (currentUser && dbStudent[currentUser] ? dbStudent[currentUser].nick : currentUser);
    
    const history = (role === 'guest') ? JSON.parse(sessionStorage.getItem('kruHengTempGuestHistory') || '[]') : JSON.parse(localStorage.getItem('kruHengHistory') || '[]');
    const userHistory = history.filter(h => h.name === userNick);

    // 🛑 ไม่เจอข้อสอบ
    if (validExams.length === 0) {
        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px dashed var(--secondary); padding-bottom:15px; margin-bottom:20px;">
                <h2 style="margin:0; color:var(--text-color); font-size:1rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">📄 ${cleanUnitName}</h2>
                <div style="display:flex; gap:10px;">
                    <button onclick="openExamWizard_Unit('${subjKey}', '${gradeKey}')" style="background:var(--primary); color:white; border:none; padding:6px 12px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:0.85rem;">⬅️ ${lang==='th'?'กลับ':'Back'}</button>
                    <button onclick="document.getElementById('exam-wizard-overlay').style.display='none'" style="background:var(--danger); color:white; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer; font-weight:bold; font-size:1rem; flex-shrink:0;">✕</button>
                </div>
            </div>
            <div style="text-align:center; padding:25px 10px;">
                <div style="font-size: 3.5rem; margin-bottom: 10px;">🚧</div>
                <h2 style="color: var(--danger); margin-bottom: 10px; font-weight: 900;">${lang === 'th' ? 'เนื้อหากำลังอัปเดต' : 'Updating...'}</h2>
                <p style="color: var(--text-color); line-height: 1.6; font-size: 0.95rem;">
                    ${lang === 'th' ? 'ครูเฮงกำลังเร่งจัดทำข้อสอบชุดนี้อยู่นะครับ<br>อดใจรออีกนิดนึงน้า! ✌️' : 'Exams for this unit are being prepared.<br>Please check back soon! ✌️'}
                </p>
            </div>
        `;
        return;
    }

    // ✅ เจอข้อสอบ
    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px dashed var(--secondary); padding-bottom:15px; margin-bottom:20px; position:sticky; top:0; background:var(--card-bg); z-index:10;">
            <h2 style="margin:0; color:var(--text-color); font-size:1.1rem; max-width:65%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${cleanUnitName}">📄 ${cleanUnitName}</h2>
            <div style="display:flex; gap:10px;">
                <button onclick="openExamWizard_Unit('${subjKey}', '${gradeKey}')" style="background:var(--primary); color:white; border:none; padding:6px 12px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:0.85rem;">⬅️ ${lang==='th'?'กลับ':'Back'}</button>
                <button onclick="document.getElementById('exam-wizard-overlay').style.display='none'" style="background:var(--danger); color:white; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer; font-weight:bold; font-size:1rem; flex-shrink:0;">✕</button>
            </div>
        </div>
        <div style="margin-bottom: 15px; font-size: 0.85rem; color: var(--success); font-weight: bold; text-align:center; background: rgba(0,255,136,0.1); padding: 9px 12px; border-radius: 10px; border: 1px dashed var(--success);">
            🎉 ${lang==='th'?`พบข้อสอบพร้อมทำ ${validExams.length} ชุด กดเลือกใส่ตะกร้าได้เลย!`: `Found ${validExams.length} ready exam sets!`}
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
    `;

    validExams.forEach(ex => {
        let color = 'var(--primary)';
        if(ex.diffText.includes('ง่าย')) color = 'var(--success)';
        if(ex.diffText.includes('กลาง')) color = '#ff9800';
        if(ex.diffText.includes('ยาก')) color = 'var(--danger)';
        if(ex.diffText.includes('โหด')) color = '#ff007f';

        // จัดชื่อเต็มยศสำหรับบันทึก (วิชา > เทอม > บทเรียน > ชุด)
        const currentExamName = `${grade.title[lang]} ${ex.termTitle} ${ex.unitName} (${ex.diffText} ชุดที่ ${ex.setNum})`;
        
        // เช็กประวัติ
        const shortExamNameClean = `${ex.unitName} (${ex.diffText} ชุดที่ ${ex.setNum})`;
        const pastAttempts = userHistory.filter(h => h.title && (h.title === currentExamName || h.title === shortExamNameClean || h.title.includes(shortExamNameClean)));
        
        let isNew = pastAttempts.length === 0; 
        let isPerfect = pastAttempts.some(h => h.correct === h.total && h.total > 0); 

        let opacity = isNew ? '1' : '0.85';   
        let saturate = isNew ? '1' : '0.7';   
        
        // 🛠️ แก้ไขบั๊กแอนิเมชันกวนตำแหน่ง: ใช้ div ล่องหนเป็น Wrapper คุมให้อยู่ตรงกลางเป๊ะๆ
        let badgeHtml = '';
        if (isPerfect) {
            badgeHtml = `<div style="position:absolute; top:0; bottom:0; right:15px; display:flex; align-items:center; z-index:2; pointer-events:none;"><span style="background:linear-gradient(45deg, #ffd700, #ff8c00); color:#000; font-size:0.75rem; padding:4px 10px; border-radius:12px; font-weight:900; box-shadow:0 2px 5px rgba(0,0,0,0.3); border: 2px solid #fff; line-height:1; display:block;">🏆 100%</span></div>`;
        } else if (isNew) {
            badgeHtml = `<div style="position:absolute; top:0; bottom:0; right:15px; display:flex; align-items:center; z-index:2; pointer-events:none;"><span style="background:var(--danger); color:white; font-size:0.75rem; padding:4px 10px; border-radius:12px; font-weight:900; box-shadow:0 2px 5px rgba(0,0,0,0.3); animation: kruheng-pulse 1s infinite alternate; border: 2px solid #fff; line-height:1; display:block;">🔥 NEW</span></div>`;
        }

        html += `
            <div style="position:relative; width:100%;">
                <button onclick="quickPlayExam('${ex.fileName}', '${currentExamName.replace(/'/g, "\\'")}', this)" 
                    style="background:${color}; color:white; border:none; padding:15px; border-radius:12px; font-weight:bold; cursor:pointer; font-size:1rem; transition:0.2s; box-shadow:0 4px 8px rgba(0,0,0,0.15); opacity:${opacity}; filter:saturate(${saturate}); width:100%; text-align:left; padding-right: 80px;" 
                    onmouseover="this.style.transform='scale(1.02)'; this.style.opacity='1'; this.style.filter='saturate(1)';" 
                    onmouseout="this.style.transform='scale(1)'; this.style.opacity='${opacity}'; this.style.filter='saturate(${saturate})';">
                    ⭐ ${ex.diffText} ชุดที่ ${ex.setNum}
                </button>
                ${badgeHtml}
            </div>
        `;
    });
    
    html += `</div>`;
    content.innerHTML = html;
}

// 🛑 ฟังก์ชันเสริม: เผื่อต้องแสดงผลลัพธ์หน้าจอรวม (อัปเดตกล่อง Wrapper ให้ปลอดภัยเหมือนกัน)
function renderScanResult(validExams, subjKey, gradeKey, subject, grade) {
    const content = document.getElementById('exam-wizard-content');
    
    const role = sessionStorage.getItem('kruHengRole');
    const currentUser = sessionStorage.getItem('kruHengCurrentUser');
    const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || {};
    const userNick = (role === 'guest') ? (currentUser ? currentUser.replace('Guest_', '') : 'Unknown') : (currentUser && dbStudent[currentUser] ? dbStudent[currentUser].nick : currentUser);
    
    const history = (role === 'guest') ? JSON.parse(sessionStorage.getItem('kruHengTempGuestHistory') || '[]') : JSON.parse(localStorage.getItem('kruHengHistory') || '[]');
    const userHistory = history.filter(h => h.name === userNick);

    if (validExams.length === 0) {
        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px dashed var(--secondary); padding-bottom:15px; margin-bottom:20px;">
                <h2 style="margin:0; color:var(--text-color);">🎓 ${grade.title[lang]}</h2>
                <div style="display:flex; gap:10px;">
                    <button onclick="openExamWizard_Grade('${subjKey}')" style="background:var(--primary); color:white; border:none; padding:6px 12px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:0.85rem;">⬅️ ${lang==='th'?'กลับ':'Back'}</button>
                    <button onclick="document.getElementById('exam-wizard-overlay').style.display='none'" style="background:var(--danger); color:white; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer; font-weight:bold; font-size:1rem; flex-shrink:0;">✕</button>
                </div>
            </div>
            <div style="text-align:center; padding:25px 10px;">
                <div style="font-size: 3.5rem; margin-bottom: 10px;">🚧</div>
                <h2 style="color: var(--danger); margin-bottom: 10px; font-weight: 900;">${lang === 'th' ? 'เนื้อหากำลังอัปเดต' : 'Updating...'}</h2>
                <p style="color: var(--text-color); line-height: 1.6; font-size: 0.95rem;">
                    ${lang === 'th' ? 'ยังไม่มีข้อสอบในระดับชั้นนี้ครับ<br>ครูเฮงกำลังเร่งจัดทำอยู่นะ อดใจรออีกนิดนึงน้า! ✌️' : 'No exams available for this grade yet.<br>Please check back soon! ✌️'}
                </p>
            </div>
        `;
        return;
    }

    let grouped = {};
    validExams.forEach(ex => {
        if(!grouped[ex.termTitle]) grouped[ex.termTitle] = {};
        if(!grouped[ex.termTitle][ex.unitName]) grouped[ex.termTitle][ex.unitName] = [];
        grouped[ex.termTitle][ex.unitName].push(ex);
    });

    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px dashed var(--secondary); padding-bottom:15px; margin-bottom:20px; position:sticky; top:0; background:var(--card-bg); z-index:10;">
            <h2 style="margin:0; color:var(--text-color);">✅ ${lang==='th'?'ข้อสอบที่พร้อมทำ':'Available Exams'}</h2>
            <div style="display:flex; gap:10px;">
                <button onclick="openExamWizard_Grade('${subjKey}')" style="background:var(--primary); color:white; border:none; padding:6px 12px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:0.85rem;">⬅️ ${lang==='th'?'กลับ':'Back'}</button>
                <button onclick="document.getElementById('exam-wizard-overlay').style.display='none'" style="background:var(--danger); color:white; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer; font-weight:bold; font-size:1rem; flex-shrink:0;">✕</button>
            </div>
        </div>
        <div style="margin-bottom: 12px; font-size: 0.85rem; color: var(--success); font-weight: bold; text-align:center; background: rgba(0,255,136,0.1); padding: 9px 12px; border-radius: 10px; border: 1px dashed var(--success);">
            🎉 ${lang==='th'?`พบข้อสอบทั้งหมด ${validExams.length} ชุด กดเพื่อเล่นได้เลย!`: `Found ${validExams.length} exam sets ready to play!`}
        </div>
    `;

    for(let term in grouped) {
        html += `<h3 style="color:var(--secondary); background:rgba(0,0,0,0.05); padding:10px; border-radius:8px; margin-top:20px;">📅 ${term}</h3>`;
        for(let unit in grouped[term]) {
            html += `<div style="margin-bottom:15px; border:1px solid rgba(0,0,0,0.1); padding:15px; border-radius:12px;">
                <h4 style="margin-top:0; color:var(--text-color); margin-bottom:12px; line-height: 1.4;">📄 ${unit}</h4>
                <div style="display:flex; flex-wrap:wrap; gap:10px;">
            `;
            
            grouped[term][unit].forEach(ex => {
                let color = 'var(--primary)';
                if(ex.diffText.includes('ง่าย')) color = 'var(--success)';
                if(ex.diffText.includes('กลาง')) color = '#ff9800';
                if(ex.diffText.includes('ยาก')) color = 'var(--danger)';
                if(ex.diffText.includes('โหด')) color = '#ff007f';

                const shortExamName = `${ex.unitName} (${ex.diffText} ชุดที่ ${ex.setNum})`;
                const currentExamName = `${grade.title[lang]} ${ex.termTitle} ${ex.unitName} (${ex.diffText} ชุดที่ ${ex.setNum})`;
                const pastAttempts = userHistory.filter(h => h.title && (h.title === currentExamName || h.title === shortExamName || h.title.includes(shortExamName)));
                
                let isNew = pastAttempts.length === 0; 
                let isPerfect = pastAttempts.some(h => h.correct === h.total && h.total > 0); 

                let opacity = isNew ? '1' : '0.85';   
                let saturate = isNew ? '1' : '0.7';   
                
                // 🛠️ แก้ไขบั๊กแอนิเมชันกวนตำแหน่ง: ใช้ div ล่องหนเป็น Wrapper มุมขวาบน
                let badgeHtml = '';
                if (isPerfect) {
                    badgeHtml = `<div style="position:absolute; top:-8px; right:-8px; z-index:2; pointer-events:none;"><span style="display:block; background:linear-gradient(45deg, #ffd700, #ff8c00); color:#000; font-size:0.65rem; padding:3px 8px; border-radius:10px; font-weight:900; box-shadow:0 2px 5px rgba(0,0,0,0.3); border: 1px solid #fff;">🏆 100%</span></div>`;
                } else if (isNew) {
                    badgeHtml = `<div style="position:absolute; top:-8px; right:-8px; z-index:2; pointer-events:none;"><span style="display:block; background:var(--danger); color:white; font-size:0.65rem; padding:3px 8px; border-radius:10px; font-weight:900; box-shadow:0 2px 5px rgba(0,0,0,0.3); animation: kruheng-pulse 1s infinite alternate; border: 1px solid #fff;">🔥 NEW</span></div>`;
                }

                html += `
                    <div style="position:relative; display:inline-block; margin-top:8px; margin-right:5px;">
                        <button onclick="quickPlayExam('${ex.fileName}', '${currentExamName}', this)" 
                            style="background:${color}; color:white; border:none; padding:10px 15px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:0.9rem; transition:0.2s; box-shadow:0 3px 6px rgba(0,0,0,0.15); opacity:${opacity}; filter:saturate(${saturate}); width:100%; position:relative; z-index:1;" 
                            onmouseover="this.style.transform='scale(1.05)'; this.style.opacity='1'; this.style.filter='saturate(1)';" 
                            onmouseout="this.style.transform='scale(1)'; this.style.opacity='${opacity}'; this.style.filter='saturate(${saturate})';">
                            ${ex.diffText} ชุดที่ ${ex.setNum}
                        </button>
                        ${badgeHtml}
                    </div>
                `;
            });
            html += `</div></div>`;
        }
    }

    content.innerHTML = html;
}

// Step 6: กดปุ๊บโหลดไฟล์จริง ใส่ตะกร้า แล้วเลื่อนจอ (ระบบโควต้าบัญชี)
async function quickPlayExam(fileName, examTitle, btnElement) {
    const originalText = btnElement.innerText;
    btnElement.innerText = "⏳...";
    btnElement.style.pointerEvents = "none";

    try {
        const response = await fetch('json/' + fileName);
        if (!response.ok) throw new Error('Not found');
        const textData = await response.text();
        const cleanText = sanitizeJSON(textData);
        const json = JSON.parse(cleanText);
        const questions = json.questions || [];

        document.getElementById('exam-wizard-overlay').style.display = 'none';
        
        const isDuplicate = selectedFiles.some(f => f.filename === fileName);
        if (!isDuplicate) {
            
            // 👑 ตรวจสอบโควต้าการโหลดข้อสอบตามบทบาท
            const role = sessionStorage.getItem('kruHengRole');
            const currentUser = sessionStorage.getItem('kruHengCurrentUser');
            
            let maxAllowed = 1; 
            if (currentUser === 'KruHeng' || role === 'master') {
                maxAllowed = 40; 
            } else if (role === 'student') {
                maxAllowed = 15; 
            }

            if (selectedFiles.length >= maxAllowed) {
                alert(lang === 'th' ? 
                    `⚠️ โควต้าเต็ม!\nระดับบัญชีของคุณสามารถผสมข้อสอบได้สูงสุด ${maxAllowed} ชุดครับ 🛒\n\n(หากต้องการเลือกชุดนี้ กรุณาลบชุดเก่าในตะกร้าออกก่อนนะครับ)` : 
                    `⚠️ Quota Reached!\nYour account tier can mix up to ${maxAllowed} sets. 🛒\n\n(Please remove an old set from the cart first)`);
                
                btnElement.innerText = originalText;
                btnElement.style.pointerEvents = "auto";
                return; 
            }

            selectedFiles.push({ 
                title: examTitle, 
                allQuestions: questions, 
                takeCount: questions.length,
                filename: fileName 
            });
        } else {
            alert(lang === 'th' ? 'มีชุดข้อสอบนี้ในตะกร้าแล้วครับ! 🛒' : 'This exam is already in your cart! 🛒');
        }
        
        updateFileListUI();
        
        // 🛝 วาร์ปหน้าจอไปที่ผลรวม
        setTimeout(() => {
            const totalRow = document.querySelector('.total-row');
            if (totalRow) {
                const yOffset = totalRow.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + 50;
                window.scrollTo({ top: yOffset, behavior: 'smooth' });
            } else {
                const startBtn = document.getElementById('btn-start-builder');
                if (startBtn) {
                    const yOffset = startBtn.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + 100;
                    window.scrollTo({ top: yOffset, behavior: 'smooth' });
                }
            }
        }, 100); 

    } catch (e) {
        alert(lang==='th'?'เกิดข้อผิดพลาดในการโหลดไฟล์ หรือไฟล์อาจมีปัญหา':'Error loading file or file is corrupted.');
        btnElement.innerText = originalText;
        btnElement.style.pointerEvents = "auto";
    }
}

// ปุ่มเปิด Wizard แบบหรูๆ (ปุ่มเมนูหลัก)
function renderServerExamList() {
    const container = document.getElementById('server-exam-list');
    if (!container) return;
    container.innerHTML = `
        <button onclick="openExamWizard_Subject()" style="width: 100%; padding: 25px; background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; border: none; border-radius: 20px; font-size: 1.5rem; font-weight: 900; cursor: pointer; box-shadow: 0 10px 20px rgba(0,0,0,0.3); transition: transform 0.2s, box-shadow 0.2s; display:flex; flex-direction:column; align-items:center; gap:10px; position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 15px 30px rgba(0,0,0,0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.3)';">
            <span style="display:flex; align-items:center; gap:15px; font-size: 4rem; text-shadow: 0 5px 10px rgba(0,0,0,0.3);">📚<span style="font-size: 4rem; font-weight: 900;">เควสหลัก</span></span>
            <span style="text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${lang === 'th' ? 'คลิกเข้าสู่... คลังข้อสอบบนระบบ' : 'Open Server Exams'}</span>
            <span style="font-size: 1rem; font-weight: normal; opacity: 0.9; background: rgba(0,0,0,0.2); padding: 5px 15px; border-radius: 20px; margin-top: 5px;">
                ${lang === 'th' ? '🔍 กดเพื่อสแกนและค้นหาข้อสอบที่พร้อมทำอัตโนมัติ' : 'Click to auto-scan for available exams'}
            </span>
            <span onclick="event.stopPropagation(); showExpGuidePopup();" title="${lang==='th'?'ดูวิธีได้ EXP':'How to earn EXP'}"
                style="position:absolute; top:12px; right:14px; width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.18); border:2px solid rgba(255,255,255,0.5); display:flex; justify-content:center; align-items:center; font-size:1.1rem; cursor:pointer; transition:background 0.2s; backdrop-filter:blur(4px);"
                onmouseover="this.style.background='rgba(255,255,255,0.35)';" onmouseout="this.style.background='rgba(255,255,255,0.18)';">ℹ️</span>
        </button>
    `;
}

function showExpGuidePopup() {
    const isTh = lang === 'th';
    const rows = [
        { grade: isTh ? 'ป.1 – ป.3' : 'P.1 – P.3', base: 10, color: '#4caf50' },
        { grade: isTh ? 'ป.4 – ป.6' : 'P.4 – P.6', base: 50, color: '#2196f3' },
        { grade: isTh ? 'ม.1 – ม.3' : 'M.1 – M.3', base: 200, color: '#9c27b0' },
        { grade: isTh ? 'ม.4 – ม.6' : 'M.4 – M.6', base: 400, color: '#ff9800' },
    ];
    const diffRows = [
        { label: isTh ? 'ง่าย'      : 'Easy',    mult: '×1.0', color: '#4caf50' },
        { label: isTh ? 'ปานกลาง'  : 'Medium',  mult: '×1.1', color: '#2196f3' },
        { label: isTh ? 'ยาก'       : 'Hard',    mult: '×1.2', color: '#ff9800' },
        { label: isTh ? 'โหด/แข่ง' : 'Extreme', mult: '×1.3', color: '#e53935' },
    ];

    const tableRows = rows.map(r => `
        <tr>
            <td style="padding:5px 10px;"><span style="background:${r.color};color:#fff;padding:2px 9px;border-radius:8px;font-weight:700;font-size:0.85rem;">${r.grade}</span></td>
            <td style="padding:5px 10px; text-align:center; font-weight:900; color:${r.color};">${r.base}</td>
            <td style="padding:5px 10px; font-size:0.82rem; color:var(--text-muted);">${isTh ? 'EXP/30 ข้อ (ก่อนคูณ)' : 'EXP/30 qs (before ×)'}</td>
        </tr>`).join('');

    const diffTableRows = diffRows.map(r => `
        <tr>
            <td style="padding:4px 10px;"><span style="background:${r.color};color:#fff;padding:1px 8px;border-radius:8px;font-size:0.83rem;font-weight:700;">${r.label}</span></td>
            <td style="padding:4px 10px; text-align:center; font-weight:900; color:${r.color};">${r.mult}</td>
        </tr>`).join('');

    const html = `
        <div id="exp-guide-overlay" onclick="if(event.target===this)this.remove();"
            style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;justify-content:center;align-items:center;padding:16px;">
            <div style="background:var(--card-bg);border-radius:18px;max-width:420px;width:100%;padding:22px 20px;box-shadow:0 8px 40px rgba(0,0,0,0.4);border:1px solid rgba(0,240,255,0.2);position:relative;max-height:90vh;overflow-y:auto;">
                <button onclick="document.getElementById('exp-guide-overlay').remove();"
                    style="position:absolute;top:10px;right:12px;background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--text-muted);">✕</button>
                <div style="font-size:1.15rem;font-weight:900;margin-bottom:14px;color:var(--text-color);">📖 ${isTh ? 'วิธีคำนวณ EXP จากข้อสอบ' : 'How Exam EXP is Calculated'}</div>

                <div style="font-size:0.88rem;font-weight:700;color:var(--text-muted);margin-bottom:6px;">1. ${isTh ? 'EXP พื้นฐาน (ตามระดับชั้น)' : 'Base EXP (by grade level)'}</div>
                <table style="width:100%;border-collapse:collapse;margin-bottom:14px;">${tableRows}</table>

                <div style="font-size:0.88rem;font-weight:700;color:var(--text-muted);margin-bottom:6px;">2. ${isTh ? 'ตัวคูณความยาก' : 'Difficulty Multiplier'}</div>
                <table style="width:100%;border-collapse:collapse;margin-bottom:14px;">${diffTableRows}</table>

                <div style="background:rgba(0,240,255,0.06);border-left:3px solid var(--secondary);border-radius:8px;padding:10px 12px;font-size:0.84rem;margin-bottom:10px;">
                    <b>3. ${isTh ? 'จำนวนข้อ' : 'Question Count'}</b><br>
                    ${isTh ? '× (จำนวนข้อที่ทำ ÷ 30) — ทำมากได้เยอะ ทำน้อยได้น้อย' : '× (questions done ÷ 30) — more questions = more EXP'}
                </div>
                <div style="background:rgba(255,0,127,0.05);border-left:3px solid var(--primary);border-radius:8px;padding:10px 12px;font-size:0.84rem;margin-bottom:10px;">
                    <b>4. ${isTh ? 'ความแม่นยำ' : 'Accuracy'}</b><br>
                    ${isTh ? '× % ที่ตอบถูก — ตอบถูก 100% รับ EXP เต็ม!' : '× correct % — 100% correct = max EXP!'}
                </div>
                <div style="background:rgba(255,152,0,0.06);border-left:3px solid #ff9800;border-radius:8px;padding:10px 12px;font-size:0.84rem;">
                    <b>5. ${isTh ? 'กฎข้ามรุ่น (Level Gap)' : 'Level Gap Penalty'}</b><br>
                    ${isTh ? 'ระดับผู้เล่นสูงกว่าระดับข้อสอบ → EXP ถูกหัก (สูงสุดเหลือ 1%)' : 'If player level >> exam level → EXP reduced (down to 1%)'}
                </div>

                <div style="margin-top:14px;padding:10px 14px;background:rgba(0,200,83,0.07);border-radius:10px;font-size:0.83rem;text-align:center;color:var(--text-muted);">
                    <b style="color:var(--success);">${isTh ? 'สูตรรวม' : 'Formula'}:</b><br>
                    <code style="font-size:0.9rem;">EXP = BaseEXP × ความยาก × (ข้อ÷30) × %ถูก × gapMult</code>
                </div>
            </div>
        </div>`;

    // ลบ popup เก่าถ้ามี
    const old = document.getElementById('exp-guide-overlay');
    if (old) old.remove();
    document.body.insertAdjacentHTML('beforeend', html);
}

// ฟังก์ชันโหลดข้อสอบแบบ Manual (ถ้ามี)
const attemptLoadServerExams = (typeof throttleAction === 'function') ? throttleAction(loadServerExams, 1500) : loadServerExams;

async function loadServerExams() {
    if(window.selectedServerExamData.size === 0) {
        alert(lang === 'th' ? 'กรุณาเลือกชุดข้อสอบก่อนครับ' : 'Please select exams first.');
        return;
    }
    for(let [fileName, titleName] of window.selectedServerExamData.entries()) {
        try {
            const response = await fetch('json/' + fileName);
            if(!response.ok) {
                alert(lang === 'th' ? 
                    `🚧 ชุดข้อสอบนี้กำลังอัปเดตข้อมูล... \nอดใจรอ "ครูเฮง" แป๊บเดียวครับ!` : 
                    `🚧 This exam set is updating... \nPlease wait for Kru Heng!`);
                continue; 
            }
            const textData = await response.text();
            const cleanText = sanitizeJSON(textData);
            const json = JSON.parse(cleanText);
            const questions = json.questions || [];
            const examTitleData = json.metadata?.exam_title || titleName;
            
            const duplicate = selectedFiles.some(f => getText(f.title, 'th') === getText(examTitleData, 'th'));
            
            if(!duplicate) {
                selectedFiles.push({ 
                    title: examTitleData, 
                    allQuestions: questions, 
                    takeCount: questions.length,
                    filename: fileName 
                });
            }
        } catch(error) {
            console.error("Error loading exam:", error);
            alert(lang === 'th' ? 
                `🚧 โหลดข้อสอบไม่สำเร็จ หรือข้อสอบกำลังอัปเดตอยู่ครับ` : 
                `🚧 Failed to load exam or it is currently updating.`);
        }
    }
    window.selectedServerExamData.clear();
    if(typeof updateLoadButtonUI === 'function') updateLoadButtonUI();
    updateFileListUI();
}

// อัปเดตตะกร้า UI
function updateFileListUI() {
    const fileListBox = document.getElementById('file-list-box'); 
    const fileListObj = document.getElementById('file-list');
    if(fileListObj) fileListObj.style.display = selectedFiles.length ? 'table' : 'none';
    
    const tbody = document.getElementById('file-list-body');
    if(!tbody) return;
    tbody.innerHTML = "";
    
    let grandTotalAll = 0;
    let grandTotalPick = 0;

    selectedFiles.forEach((f, idx) => {
        if (f.takeCount > f.allQuestions.length) f.takeCount = f.allQuestions.length;
        if (f.takeCount < 0) f.takeCount = 0;

        grandTotalAll += f.allQuestions.length;
        grandTotalPick += parseInt(f.takeCount) || 0;

        tbody.innerHTML += `
            <tr>
                <td data-label="${lang === 'th' ? 'ชื่อข้อสอบ' : 'Exam Name'}" style="text-align: left; font-weight: bold; font-size: 0.82rem; line-height: 1.4;">
                    ${getText(f.title, lang)}
                </td>
                <td data-label="${lang === 'th' ? 'ข้อทั้งหมด' : 'Total'}" style="font-size: 1.1rem;">
                    ${f.allQuestions.length}
                </td>
                <td data-label="${lang === 'th' ? 'เลือกดึง' : 'Pick'}">
                    <input type="number" value="${f.takeCount}" min="0" max="${f.allQuestions.length}" 
                        onchange="updateTakeCount(${idx}, this.value)" 
                        style="width: 80px; padding: 8px; font-size: 1.1rem; font-weight: bold; color: var(--primary); text-align: center; border: 2px solid var(--secondary); border-radius: 8px; background: var(--bg-color);">
                </td>
                <td data-label="${lang === 'th' ? 'จัดการ' : 'Action'}">
                    <button onclick="selectedFiles.splice(${idx},1); updateFileListUI();" class="btn btn-red" style="padding: 5px 10px; font-size: 0.8rem; border-radius: 8px;">
                        ${lang === 'th' ? '🗑️ ลบ' : '🗑️ Del'}
                    </button>
                </td>
            </tr>
        `;
    });
    
    if (selectedFiles.length > 0) {
        tbody.innerHTML += `
            <tr class="total-row" style="background: rgba(0, 240, 255, 0.1); border-top: 2px solid var(--secondary);">
                <td data-label="${lang === 'th' ? 'สรุป' : 'Summary'}" style="text-align: right; font-weight: bold; font-size: 1.1rem; color: var(--accent);">
                    ${lang === 'th' ? '🎯 รวมที่เลือก:' : '🎯 Grand Total:'}
                </td>
                <td data-label="${lang === 'th' ? 'รวมทั้งหมด' : 'Grand Total'}">${grandTotalAll}</td>
                <td data-label="${lang === 'th' ? 'รวมที่ดึง' : 'Total Pick'}" style="color: var(--primary); font-weight: bold; font-size: 1.4rem;">${grandTotalPick}</td>
                <td></td>
            </tr>
        `;
    }
    
    const hasFiles = selectedFiles.length > 0;
    const btnStart = document.getElementById('btn-start-builder');
    if(btnStart) btnStart.style.display = hasFiles ? "inline-flex" : "none";
    
    const btnPrint = document.getElementById('btn-print-direct');
    if(btnPrint) btnPrint.style.display = hasFiles ? "inline-flex" : "none";
    
    const nameWrapper = document.getElementById('name-wrapper');
    if(nameWrapper) nameWrapper.style.display = "none";
}

function updateTakeCount(idx, val) {
    let parsed = parseInt(val) || 0;
    if (parsed > selectedFiles[idx].allQuestions.length) parsed = selectedFiles[idx].allQuestions.length;
    if (parsed < 0) parsed = 0;
    selectedFiles[idx].takeCount = parsed;
    updateFileListUI();
}

console.log("✅ [SUCCESS] app_wizard.js โหลดเสร็จสมบูรณ์!");

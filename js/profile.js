/* =====================================================================
   👤 ไฟล์: js/profile.js
   หน้าที่: ระบบโปรไฟล์ผู้ใช้ (Badge, Level, EXP, Rebirth)
   --------------------------------------------------------------------
   📦 ฟังก์ชันที่อยู่ในไฟล์นี้:
     1. getLevelData(totalExp)   - คำนวณเลเวลและ EXP จาก EXP รวม
     2. doRebirth()              - ระบบจุติ (Rebirth) แลก 100,000 EXP
     3. renderProfileBadge()     - วาดป้ายโปรไฟล์ + หลอด EXP

   🔗 Dependencies (ตัวแปร/ฟังก์ชันจากไฟล์อื่น ที่ไฟล์นี้เรียกใช้):
     - lang              (จาก app.js)
     - coinImg           (จาก app.js)
     - masterID          (จาก data.js)
     - defaultStudentDB  (จาก data.js)
     - addLog()          (จาก logs.js หรือ app.js)
     - updateSubjectEXP() (จาก stats.js หรือ app.js)
     - openExpInfo()     (จาก ui.js)
     - confetti()        (library ภายนอก)

   ⚠️ ลำดับโหลดใน index.html: ต้องโหลดหลัง data.js และก่อน app.js
   ===================================================================== */

console.log("👤 [START] โมดูลเริ่มทำงาน: profile.js (ระบบจัดการโปรไฟล์ผู้ใช้)");

// --------------------------------------------------------------------------------
// 🧠 1. สมองกลคำนวณ Level และ EXP ประจำเลเวล (อิงเพดาน 100,000 = Lv.99)
// --------------------------------------------------------------------------------
function getLevelData(totalExp) {
    let level = 1;
    let expForNext = 100;
    let currentLevelExp = totalExp;

    for (let i = 1; i < 99; i++) {
        // แบ่งช่วงความกว้างของหลอด EXP ตามที่ตกลงกันไว้
        if (i <= 14) expForNext = 100 + (i * 5);              // กลุ่ม 1: ขึ้นง่ายๆ
        else if (i <= 29) expForNext = 300 + ((i - 15) * 10); // กลุ่ม 2
        else if (i <= 59) expForNext = 800 + ((i - 30) * 10); // กลุ่ม 3
        else if (i <= 80) expForNext = 1500 + ((i - 60) * 15);// กลุ่ม 4
        else expForNext = 2000 + ((i - 81) * 25);             // นรกแตก โค้งสุดท้าย

        if (currentLevelExp >= expForNext) {
            currentLevelExp -= expForNext;
            level++;
        } else {
            break;
        }
    }

    if (level >= 99) {
        level = 99;
        currentLevelExp = expForNext; // เต็มหลอด
    }

    let percent = Math.min((currentLevelExp / expForNext) * 100, 100);
    return { level, currentLevelExp, expForNext, percent, totalExp };
}


// --------------------------------------------------------------------------------
// 🌟 2. ระบบจุติ (Rebirth System) — แลก 100,000 EXP เพื่อรีเลเวล
// --------------------------------------------------------------------------------
function doRebirth() {
    const role = sessionStorage.getItem('kruHengRole');
    const currentUser = sessionStorage.getItem('kruHengCurrentUser');
    if (!currentUser || role === 'master') return;

    let currentExp = 0;
    let currentRebirth = 0;
    let gInfo = null;
    let dbStudent = null;

    if (role === 'guest') {
        gInfo = JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}');
        currentExp = gInfo.exp || 0;
        currentRebirth = gInfo.rebirth || 0;
    } else {
        dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || defaultStudentDB;
        if (dbStudent[currentUser]) {
            currentExp = dbStudent[currentUser].exp || 0;
            currentRebirth = dbStudent[currentUser].rebirth || 0;
        }
    }

    if (currentExp < 100000) {
        alert(lang === 'th' ? "EXP ของคุณยังไม่ถึง 100,000 แต้ม!" : "You need 100,000 EXP to Rebirth!");
        return;
    }

    if (confirm(lang === 'th'
        ? "🌟 ยืนยันการจุติ?\n(เลเวลและ EXP ปัจจุบันจะถูกหัก 100,000 แต้ม เพื่อกลับไปเริ่มใหม่ แต่คุณจะได้รับยศระดับ ไฮคลาส!)"
        : "🌟 Confirm Rebirth?\n(100,000 EXP will be consumed to reset your level, but you gain High Class rank!)")) {

        // หัก 100,000 แต้ม แลก 1 จุติ (เศษ EXP ที่เกินมาจะเก็บไว้ให้ ไม่หายสูญเปล่า)
        currentExp -= 100000;
        if (currentExp < 0) currentExp = 0;
        currentRebirth += 1;

        if (role === 'guest') {
            gInfo.exp = currentExp;
            gInfo.rebirth = currentRebirth;
            sessionStorage.setItem('kruHengGuestInfo', JSON.stringify(gInfo));
            addLog(
                lang === 'th' ? "✨ จุติ (Guest)" : "✨ Guest Rebirth",
                `ผู้เยี่ยมชมจุติเป็นรอบที่ ${currentRebirth}`,
                true
            );
        } else {
            dbStudent[currentUser].exp = currentExp;
            dbStudent[currentUser].rebirth = currentRebirth;
            localStorage.setItem('kruHengStudentDB', JSON.stringify(dbStudent));
            addLog(
                lang === 'th' ? "✨ จุติ (Rebirth)" : "✨ Rebirth",
                `นักเรียน ${currentUser} จุติเป็นรอบที่ ${currentRebirth}`
            );
        }

        alert(lang === 'th'
            ? `🎉 ยินดีด้วย! คุณได้จุติเป็นรอบที่ ${currentRebirth} แล้ว!`
            : `🎉 Congratulations! You have rebirth to round ${currentRebirth}!`);

        // จุดพลุฉลองชุดใหญ่
        if (typeof confetti === "function") {
            confetti({
                particleCount: 300,
                spread: 120,
                origin: { y: 0.4 },
                colors: ['#ffd700', '#ff8c00', '#ff007f', '#00f0ff']
            });
        }

        renderProfileBadge();
        const userNick = (role === 'guest')
            ? currentUser.replace('Guest_', '')
            : (dbStudent && dbStudent[currentUser] ? dbStudent[currentUser].nick : currentUser);
        if (typeof updateSubjectEXP === 'function') updateSubjectEXP(userNick);
    }
}


// --------------------------------------------------------------------------------
// 🪪 3. วาดป้ายโปรไฟล์ + หลอด EXP บนหน้าจอหลัก
// --------------------------------------------------------------------------------
function renderProfileBadge() {
    const user = sessionStorage.getItem('kruHengCurrentUser');
    const role = sessionStorage.getItem('kruHengRole');
    if (!user) return;

    document.getElementById('user-profile-badge').style.display = 'block';

    const chipName = document.getElementById('chip-name');
    const chipAvatar = document.getElementById('chip-avatar');

    let rankStr = "";
    let rankColor = '#9e9e9e';
    let isMonarchs = false;
    let isMaster = false;
    let currentExp = 0;
    let currentCoins = 0;
    let lvlData = null;
    let expBoxHtml = "";

    // 🌐 พจนานุกรมรองรับ 2 ภาษา (Thai / English)
    const t = {
        guestName:   lang === 'th' ? 'ผู้เยี่ยมชม'      : 'Guest',
        trial:       lang === 'th' ? 'ทดลองใช้'         : 'Trial',
        status:      lang === 'th' ? 'สถานะ'            : 'Status',
        details:     lang === 'th' ? 'รายละเอียด'       : 'Details',
        level:       lang === 'th' ? 'เลเวลนักสู้'      : 'Level',
        admin:       lang === 'th' ? 'ผู้ดูแลระบบ'      : 'Admin',
        privilege:   lang === 'th' ? 'สิทธิ์'           : 'Privilege',
        fullControl: lang === 'th' ? 'ควบคุมระบบทั้งหมด' : 'Full Control',
        student:     lang === 'th' ? 'นักเรียน'         : 'Student',
        school:      lang === 'th' ? 'โรงเรียน'         : 'School',
        grade:       lang === 'th' ? 'ระดับชั้น'        : 'Grade',
        activeUntil: lang === 'th' ? 'ใช้งานถึง'        : 'Active Until',
        rebirth:     lang === 'th' ? 'จุติ'             : 'Rebirth',
        expCurrent:  lang === 'th' ? 'EXP ปัจจุบัน'     : 'Current EXP',
        expTotal:    lang === 'th' ? 'EXP สะสมรวม'      : 'Total EXP'
    };

    // ============================================================
    // 🅰️ กรณีผู้เยี่ยมชม (Guest)
    // ============================================================
    if (role === 'guest') {
        const gInfo = JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}');
        const guestLvl = getLevelData(gInfo.exp || 0).level;
        /* 📝 จุดแก้ขนาดตัวอักษร: Level เล็กๆ หลังชื่อ Guest (font-size:0.6rem) */
        if (chipName) chipName.innerHTML = `${gInfo.name || 'Guest'} <span style="font-size:0.6rem; font-weight:900; opacity:0.85; background:rgba(0,0,0,0.15); padding:1px 5px; border-radius:8px;">Lv.${guestLvl}</span>`;
        if (chipAvatar) chipAvatar.innerText = '👀';

        currentExp = gInfo.exp || 0;
        currentCoins = gInfo.coins || 0;
        lvlData = getLevelData(currentExp);

        rankStr = "Guest";
        /* 📝 จุดแก้ขนาดตัวอักษร: ป้ายสถานะ Trial ของ Guest (font-size:0.8rem) */
        document.getElementById('profile-name').innerHTML = `<b>${gInfo.name || t.guestName}</b> <span style="font-size:0.8rem; background:#607d8b; color:white; padding:2px 6px; border-radius:8px;">${t.trial}</span>`;
        document.getElementById('profile-note').innerText = lang === 'th'
            ? "ข้อมูลจะหายไปเมื่อปิดเบราว์เซอร์"
            : "Data will be lost on close";

        /* 📝 จุดแก้ขนาดตัวอักษร: รายละเอียด Account Info ของ Guest (font-size: 0.95rem) */
        document.getElementById('profile-account-info').innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr; gap: 6px; font-size: 0.95rem; margin-top: 10px;">
                <div><b>👤 ${t.status}:</b> <span style="color:var(--primary);">${gInfo.role || t.guestName}</span></div>
                <div><b>📝 ${t.details}:</b> ${gInfo.extra || '-'}</div>
                <div><b>⭐ ${t.level}:</b> Lv.${lvlData.level}</div>
            </div>
        `;
        document.getElementById('btn-rebirth').style.display = currentExp >= 100000 ? 'flex' : 'none';
        document.getElementById('btn-edit-students').style.display = 'none';

    // ============================================================
    // 🅱️ กรณีนักเรียน / Master
    // ============================================================
    } else {
        const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || defaultStudentDB;
        const data = dbStudent[user];
        if (!data) return;

        if (chipAvatar) chipAvatar.innerText = (data.nick || user).charAt(0);

        currentExp = data.exp || 0;
        currentCoins = data.coins || 0;
        let currentRebirth = data.rebirth || 0;
        lvlData = getLevelData(currentExp);

        // แสดงเลเวลใน chip ชื่อ (Master = Lv.99)
        const chipLvl = (user === masterID) ? 99 : lvlData.level;
        /* 📝 จุดแก้ขนาดตัวอักษร: Level เล็กๆ หลังชื่อ Student/Master (font-size:0.6rem) */
        if (chipName) chipName.innerHTML = `${data.nick || user} <span style="font-size:0.6rem; font-weight:900; opacity:0.85; background:rgba(0,0,0,0.15); padding:1px 5px; border-radius:8px;">Lv.${chipLvl}</span>`;

        // -------- กรณี Master --------
        if (user === masterID) {
            isMaster = true;
            rankStr = "Master";
            /* 📝 จุดแก้ขนาดตัวอักษร: ป้ายสถานะ Admin ของ Master (font-size:0.8rem) */
            document.getElementById('profile-name').innerHTML = `<b>${data.nick}</b> <span style="font-size:0.8rem; background:linear-gradient(45deg, #ff007f, #7000ff); color:white; padding:2px 6px; border-radius:8px;">${t.admin}</span>`;
            document.getElementById('profile-note').innerText = lang === 'th'
                ? "ยินดีต้อนรับครับมาสเตอร์"
                : "Welcome, Master";
            document.getElementById('btn-edit-students').style.display = 'flex';

            /* 📝 จุดแก้ขนาดตัวอักษร: รายละเอียด Account Info ของ Master (font-size: 0.95rem) */
            document.getElementById('profile-account-info').innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr; gap: 6px; font-size: 0.95rem; margin-top: 10px;">
                    <div><b>👤 Username:</b> <span style="color:var(--primary);">${user}</span></div>
                    <div><b>⭐ ${t.level}:</b> MAX (Master)</div>
                    <div><b>👑 ${t.privilege}:</b> ${t.fullControl}</div>
                </div>
            `;

        // -------- กรณีนักเรียนทั่วไป --------
        } else {
            // คำนวณแรงค์จากเลเวล (ระบบใหม่ E/D/C/B/A/S-Rank + Monarchs)
            isMonarchs = currentRebirth > 0;

            if (isMonarchs) {
                rankStr = `Monarchs[${currentRebirth}]`;
            } else {
                const lvl = lvlData.level;
                if (lvl <= 4)       { rankStr = 'E-Rank'; rankColor = '#9e9e9e'; }
                else if (lvl <= 9)  { rankStr = 'D-Rank'; rankColor = '#4caf50'; }
                else if (lvl <= 14) { rankStr = 'C-Rank'; rankColor = '#2196f3'; }
                else if (lvl <= 29) { rankStr = 'B-Rank'; rankColor = '#9c27b0'; }
                else if (lvl <= 59) { rankStr = 'A-Rank'; rankColor = '#ff9800'; }
                else                { rankStr = 'S-Rank'; rankColor = '#ffd700'; }
            }

            /* 📝 จุดแก้ขนาดตัวอักษร: ป้ายสถานะ Student (font-size:0.8rem) */
            document.getElementById('profile-name').innerHTML = `<b>${data.nick}</b> <span style="font-size:0.8rem; background:var(--primary); color:white; padding:2px 6px; border-radius:8px;">${t.student}</span>`;
            document.getElementById('profile-note').innerText = data.note || "-";
            document.getElementById('btn-edit-students').style.display = 'none';

            let startStr = data.startDate ? data.startDate.split('T')[0] : "-";
            let expStr = data.expireDate ? data.expireDate.split('T')[0] : "-";

            /* 📝 จุดแก้ขนาดตัวอักษร: รายละเอียด Account Info ของ Student (font-size: 0.95rem, ตรงจุติ font-size:0.85rem) */
            document.getElementById('profile-account-info').innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr; gap: 6px; font-size: 0.95rem; margin-top: 10px;">
                    <div><b>👤 Username:</b> <span style="color:var(--primary);">${user}</span></div>
                    <div><b>🏫 ${t.school}:</b> ${data.school || "-"}</div>
                    <div><b>🎓 ${t.grade}:</b> ${data.grade || data.class || data.eduLevel || "-"}</div>
                    <div><b>⭐ ${t.level}:</b> Lv.${lvlData.level} <span style="color:var(--accent); font-size:0.85rem;">(${t.rebirth}: ${currentRebirth})</span></div>
                    <div><b>⏳ ${t.activeUntil}:</b> ${expStr}</div>
                </div>
            `;
        }
        document.getElementById('btn-rebirth').style.display = (currentExp >= 100000 && user !== masterID) ? 'flex' : 'none';
    }

    // ============================================================
    // 🎨 วาดกล่อง EXP + เหรียญ + หลอดประสบการณ์
    // ============================================================
    const totalText = `* ${t.expTotal}: ${currentExp.toLocaleString()}`;

    // Monarchs / Master: ใช้ animation border glow พิเศษ
    const displayLevel = isMaster ? 99 : lvlData.level;
    const cardBorderStyle = (isMonarchs || isMaster)
        ? 'border: 2px solid transparent; animation: monarchs-card-glow 2.5s ease infinite;'
        : 'border: 2px solid var(--success);';
        
    /* 📝 จุดแก้ขนาดตัวอักษร: ป้ายยศ Rank ต่างๆ (font-size:1.05rem และ 1rem) */
    const rankBadgeHtml = isMonarchs
        ? `<span class="rank-monarchs" style="font-size:1.05rem; font-weight:900; padding:3px 12px; border-radius:12px; display:inline-block;">👑 ${rankStr}</span>`
        : isMaster
            ? `<span class="rank-monarchs" style="font-size:1.05rem; font-weight:900; padding:3px 12px; border-radius:12px; display:inline-block;">⚜️ ${rankStr}</span>`
            : `<span style="font-size:1rem; font-weight:900; color:#fff; background:${rankColor}; padding:3px 12px; border-radius:12px; display:inline-block; box-shadow:0 2px 8px ${rankColor}88;">★ ${rankStr}</span>`;

    /* 📝 จุดแก้ขนาดตัวอักษรกล่อง EXP รวม: 
       - ป้าย Lv.: font-size: 0.85rem
       - ป้ายเงินเหรียญ: font-size: 0.95rem
       - ไอคอน Info (ℹ️): font-size: 0.8rem
       - ตัวหนังสือ EXP ปัจจุบัน: font-size: 0.9rem
       - ข้อความ EXP รวมด้านล่าง: font-size: 0.75rem
    */
    expBoxHtml = `
        <div style="background: var(--card-bg); ${cardBorderStyle} padding: 15px 20px; border-radius: 15px; text-align: left; box-shadow: 0 4px 15px rgba(0, 200, 83, 0.1);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                <div style="display:flex; align-items:center; gap:10px; flex-wrap: wrap;">
                    ${rankBadgeHtml}
                    <span style="background: linear-gradient(45deg, #7000ff, #00f0ff); color: white; padding: 2px 9px; border-radius: 12px; font-size: 0.85rem; font-weight: 900; box-shadow: 0 2px 6px rgba(112,0,255,0.35);">Lv.${displayLevel}</span>
                    <span style="background: linear-gradient(45deg, #CC33FF, #ff8c00); color: black; padding: 3px 12px; border-radius: 20px; font-size: 0.95rem; font-weight: 900; box-shadow: 0 2px 5px rgba(255,215,0,0.5); text-shadow: 1px 1px 2px rgba(255,255,255,0.5); display: inline-flex; align-items: center; gap: 4px;">${coinImg} ${currentCoins.toLocaleString()}</span>
                </div>
                <span style="background:var(--success); color:white; border-radius:50%; width:20px; height:20px; font-size:0.8rem; display:inline-flex; justify-content:center; align-items:center; box-shadow:0 0 8px var(--success); animation: popGlow 2s infinite; cursor:pointer; flex-shrink: 0;" onclick="openExpInfo()">ℹ️</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.9rem; font-weight:bold; color:var(--text-color); opacity: 0.9;">
                <span>${t.expCurrent}</span>
                <span>${Math.floor(lvlData.currentLevelExp).toLocaleString()} / ${lvlData.expForNext.toLocaleString()}</span>
            </div>
            <div style="width:100%; height:12px; background:rgba(0,0,0,0.1); border-radius:6px; margin-top:6px; overflow:hidden; box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);">
                <div style="width:${lvlData.percent}%; height:100%; background: linear-gradient(90deg, #00c853, #b2ff59); box-shadow: 0 0 10px #00c853; transition: width 1s ease-out;"></div>
            </div>
            <div style="text-align: right; font-size: 0.75rem; color: var(--text-color); opacity: 0.6; margin-top: 5px;">${totalText}</div>
        </div>
    `;

    let mainLevelContainer = document.getElementById('main-level-bar-container');
    if (mainLevelContainer) mainLevelContainer.innerHTML = expBoxHtml;

    // 🎰 โชว์ปุ่มกาชาหลัง login สำเร็จ
    const gachaBtn = document.getElementById('btn-open-gacha');
    if (gachaBtn) gachaBtn.style.display = 'inline-flex';
}

console.log("✅ [SUCCESS] profile.js โหลดเสร็จสมบูรณ์!");

/* =====================================================================
   สิ้นสุดไฟล์ profile.js
   ===================================================================== */
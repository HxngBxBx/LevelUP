/* =====================================================================
   🧮 ไฟล์: js/app_math.js
   หน้าที่: ศูนย์รวมสมการคณิตศาสตร์ (คำนวณ EXP, เช็ค Level Gap/Smurf)
   ===================================================================== */
console.log("🧮 [START] โมดูลเริ่มทำงาน: app_math.js (ระบบสมการและคำนวณ)");

// ฟังก์ชันคำนวณตัวคูณ (Multiplier) เมื่อเกิดการข้ามระดับชั้น (Smurf Penalty)
function getCurrentGapMult() {
    const currentUser = sessionStorage.getItem('kruHengCurrentUser');
    if (currentUser === "KruHeng") {
        window._currentGapInfo = { gap: 0, gapMult: 1.0 };
        return 1.0;
    }

    let currentExp = 0;
    const role = sessionStorage.getItem('kruHengRole');
    if (role === 'guest') {
        currentExp = JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}').exp || 0;
    } else {
        const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || (typeof defaultStudentDB !== 'undefined' ? defaultStudentDB : {});
        if(dbStudent[currentUser]) currentExp = dbStudent[currentUser].exp || 0;
    }

    let pLvl = typeof getLevelData === 'function' ? getLevelData(currentExp).level : 1;
    let pGroup = 1;
    if (pLvl >= 15 && pLvl <= 29) pGroup = 2;
    else if (pLvl >= 30 && pLvl <= 59) pGroup = 3;
    else if (pLvl >= 60) pGroup = 4;

    let combinedText = (typeof currentExamTitle !== 'undefined' ? currentExamTitle : "").toLowerCase();
    if(typeof db !== 'undefined' && db && db.length > 0 && typeof getText === 'function') {
        combinedText += " " + getText(db[0].topic, 'th').toLowerCase();
    }

    let eGroup = 2;
    if (combinedText.includes('ม.6') || combinedText.includes('m.6') || combinedText.includes('ม.5') || combinedText.includes('m.5') || combinedText.includes('ม.4') || combinedText.includes('m.4')) eGroup = 4;
    else if (combinedText.includes('ม.3') || combinedText.includes('m.3') || combinedText.includes('ม.2') || combinedText.includes('m.2') || combinedText.includes('ม.1') || combinedText.includes('m.1')) eGroup = 3;
    else if (combinedText.includes('ป.6') || combinedText.includes('p.6') || combinedText.includes('ป.5') || combinedText.includes('p.5') || combinedText.includes('ป.4') || combinedText.includes('p.4')) eGroup = 2;
    else if (combinedText.includes('ป.3') || combinedText.includes('p.3') || combinedText.includes('ป.2') || combinedText.includes('p.2') || combinedText.includes('ป.1') || combinedText.includes('p.1')) eGroup = 1;

    let gap = Math.abs(pGroup - eGroup);
    let gapMult = 1.0;
    if (gap === 1) gapMult = 0.5;
    else if (gap === 2) gapMult = 0.1;
    else if (gap >= 3) gapMult = 0.01;
    
    window._currentGapInfo = { gap, gapMult, pGroup, eGroup };
    return gapMult;
}

// ฟังก์ชันคำนวณ EXP รวมทั้งหมดหลังจากสอบเสร็จ (แบบแม่นยำ)
function calculateExamEXP(totalExp, examTitle, topics, correct, total, examDB) {
    const lvlData = typeof getLevelData === 'function' ? getLevelData(totalExp) : { level: 1 };
    const pLvl = lvlData.level;

    let pGroup = 1;
    if (pLvl >= 15 && pLvl <= 29) pGroup = 2;
    else if (pLvl >= 30 && pLvl <= 59) pGroup = 3;
    else if (pLvl >= 60) pGroup = 4;

    let combinedText = (examTitle + " " + topics.join(" ")).toLowerCase();
    let baseExp = 100; let eGroup = 2; let gradeLabel = 'ทั่วไป';

    if      (combinedText.includes('ม.6') || combinedText.includes('m.6')) { baseExp = 400; eGroup = 4; gradeLabel = 'ม.6'; }
    else if (combinedText.includes('ม.5') || combinedText.includes('m.5')) { baseExp = 320; eGroup = 4; gradeLabel = 'ม.5'; }
    else if (combinedText.includes('ม.4') || combinedText.includes('m.4')) { baseExp = 250; eGroup = 4; gradeLabel = 'ม.4'; }
    else if (combinedText.includes('ม.3') || combinedText.includes('m.3')) { baseExp = 200; eGroup = 3; gradeLabel = 'ม.3'; }
    else if (combinedText.includes('ม.2') || combinedText.includes('m.2')) { baseExp = 160; eGroup = 3; gradeLabel = 'ม.2'; }
    else if (combinedText.includes('ม.1') || combinedText.includes('m.1')) { baseExp = 130; eGroup = 3; gradeLabel = 'ม.1'; }
    else if (combinedText.includes('ป.6') || combinedText.includes('p.6')) { baseExp = 100; eGroup = 2; gradeLabel = 'ป.6'; }
    else if (combinedText.includes('ป.5') || combinedText.includes('p.5')) { baseExp =  70; eGroup = 2; gradeLabel = 'ป.5'; }
    else if (combinedText.includes('ป.4') || combinedText.includes('p.4')) { baseExp =  50; eGroup = 2; gradeLabel = 'ป.4'; }
    else if (combinedText.includes('ป.3') || combinedText.includes('p.3')) { baseExp =  30; eGroup = 1; gradeLabel = 'ป.3'; }
    else if (combinedText.includes('ป.2') || combinedText.includes('p.2')) { baseExp =  20; eGroup = 1; gradeLabel = 'ป.2'; }
    else if (combinedText.includes('ป.1') || combinedText.includes('p.1')) { baseExp =  10; eGroup = 1; gradeLabel = 'ป.1'; }

    let gap = Math.abs(pGroup - eGroup);
    let gapMult = 1.0;
    const currentUserExpCalc = sessionStorage.getItem('kruHengCurrentUser');
    if (currentUserExpCalc === "KruHeng") {
        gapMult = 1.0;
    } else {
        if (gap === 1) gapMult = 0.6;
        else if (gap === 2) gapMult = 0.1;
        else if (gap >= 3) gapMult = 0.01;
    }

    let diffMult = 1.0;
    if (examDB && examDB.length > 0) {
        let totalDiffScore = 0;
        examDB.forEach(q => {
            let d = q.difficulty ? (q.difficulty.en || q.difficulty.th || "").toLowerCase() : "easy";
            if (d.includes('extreme') || d.includes('แข่งขัน') || d.includes('สอบเข้า')) totalDiffScore += 1.3;
            else if (d.includes('hard') || d.includes('ยาก')) totalDiffScore += 1.2;
            else if (d.includes('medium') || d.includes('ปานกลาง') || d.includes('กลาง')) totalDiffScore += 1.1;
            else totalDiffScore += 1.0;
        });
        diffMult = totalDiffScore / examDB.length;
    }

    const qScale   = total > 0 ? total / 30 : 0;
    const accuracy = total > 0 ? correct / total : 0;
    // ไม่ Math.round() — คืน float 2 ทศนิยม ให้ค่าต่อข้อคงที่เสมอ
    const finalExp = +( baseExp * gapMult * qScale * diffMult * accuracy ).toFixed(2);

    window.lastExpBreakdown = {
        gradeLabel, baseExp, gapMult, gap,
        qCount: total,
        qScale:   +qScale.toFixed(4),
        diffMult: +diffMult.toFixed(4),
        accuracy: +accuracy.toFixed(4),
        correct, total,
        finalExp
    };

    return finalExp;
}

// ฟังก์ชันคืนค่า EXP ต่อ 1 ข้อแบบ Realtime ตอนตอบข้อสอบ (โชว์ที่ด้านบนจอ)
function calcLiveExpPerQuestion() {
    const playerExp = window._cachedPlayerExp || 0;
    const topics    = Object.keys(typeof categoryStats !== 'undefined' ? categoryStats : {});
    const topicList = topics.length > 0 ? topics : [typeof getText === 'function' && typeof db !== 'undefined' && db[0] ? getText(db[0].topic, 'th') : ''];
    const combined  = ((typeof currentExamTitle !== 'undefined' ? currentExamTitle : '') + ' ' + topicList.join(' ')).toLowerCase();

    let baseExp = 100; let eGroup = 2;
    if      (combined.includes('ม.6')||combined.includes('m.6')) { baseExp=400; eGroup=4; }
    else if (combined.includes('ม.5')||combined.includes('m.5')) { baseExp=320; eGroup=4; }
    else if (combined.includes('ม.4')||combined.includes('m.4')) { baseExp=250; eGroup=4; }
    else if (combined.includes('ม.3')||combined.includes('m.3')) { baseExp=200; eGroup=3; }
    else if (combined.includes('ม.2')||combined.includes('m.2')) { baseExp=160; eGroup=3; }
    else if (combined.includes('ม.1')||combined.includes('m.1')) { baseExp=130; eGroup=3; }
    else if (combined.includes('ป.6')||combined.includes('p.6')) { baseExp=100; eGroup=2; }
    else if (combined.includes('ป.5')||combined.includes('p.5')) { baseExp= 70; eGroup=2; }
    else if (combined.includes('ป.4')||combined.includes('p.4')) { baseExp= 50; eGroup=2; }
    else if (combined.includes('ป.3')||combined.includes('p.3')) { baseExp= 30; eGroup=1; }
    else if (combined.includes('ป.2')||combined.includes('p.2')) { baseExp= 20; eGroup=1; }
    else if (combined.includes('ป.1')||combined.includes('p.1')) { baseExp= 10; eGroup=1; }

    const lvl    = typeof getLevelData === 'function' ? getLevelData(playerExp).level : 1;
    let pGroup   = 1;
    if (lvl >= 15 && lvl <= 29) pGroup = 2;
    else if (lvl >= 30 && lvl <= 59) pGroup = 3;
    else if (lvl >= 60) pGroup = 4;

    const uid = sessionStorage.getItem('kruHengCurrentUser');
    let gapMult = 1.0;
    if (uid !== 'KruHeng') {
        const gap = Math.abs(pGroup - eGroup);
        if (gap === 1) gapMult = 0.6;
        else if (gap === 2) gapMult = 0.1;
        else if (gap >= 3) gapMult = 0.01;
    }

    // EXP/ข้อ = baseExp × gapMult ÷ 30  (ไม่ขึ้นกับจำนวนข้อที่เลือก)
    return (baseExp * gapMult) / 30;
}

console.log("✅ [SUCCESS] app_math.js โหลดเสร็จสมบูรณ์!");
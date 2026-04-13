/* =====================================================================
   🎯 ไฟล์: js/app_quiz.js
   หน้าที่: ระบบรันข้อสอบ (Quiz Engine) — จัดการโจทย์, ตรวจคำตอบ, จับเวลา, และหน้าสรุปผล
   ===================================================================== */
console.log("🎯 [START] โมดูลเริ่มทำงาน: app_quiz.js (ระบบรันข้อสอบหลัก)");

function updateQuizHeaders() {
    if (!db || db.length === 0) return;
    let remain = db.length - (curIdx + 1);
    if (remain < 0) remain = 0;
    document.getElementById('ui-pg-val').innerText = lang === 'th' ? `ข้อที่: ${curIdx + 1} / ${db.length} (เหลือ ${Math.max(0, db.length - curIdx - 1)} ข้อ)` : `Q: ${curIdx + 1} / ${db.length}`;
    document.getElementById('ui-live-correct').innerText = lang === 'th' ? `ถูก: ${stat.c}` : `Correct: ${stat.c}`;
}

function mixQuestions() {
    let mixed = [];
    const mode = document.getElementById('set-shuffle').value;
    let filesToProcess = [...selectedFiles];

    if (mode === '3' || mode === '4') filesToProcess.sort(() => Math.random() - 0.5);

    filesToProcess.forEach(f => {
        let pool = [...(f.allQuestions || [])];
        if (mode === '2' || mode === '4') pool.sort(() => Math.random() - 0.5);
        mixed.push(...pool.slice(0, f.takeCount || 0));
    });
    return mixed;
}

function prepareQuiz() {
    db = mixQuestions();
    config = { 
        practiceMode: document.getElementById('set-exam-mode')?.value === 'practice',
        useTimer: document.getElementById('set-exam-mode')?.value !== 'practice',
        useDelay: document.getElementById('set-use-delay').value === 'true', 
        delayTime: parseInt(document.getElementById('set-delay-val').value) || 5, 
        pauseHide: document.getElementById('set-pause-hide').value === 'true',
        showTopic: document.getElementById('set-print-topic').value === 'true', 
        printAns: document.getElementById('set-print-ans').value !== 'none',
        soundSfxCorrect: document.getElementById('set-sfx-correct').value === 'true',
        soundSfxWrong: document.getElementById('set-sfx-wrong').value === 'true',
        soundSfxTick: document.getElementById('set-sfx-tick').value === 'true',
        soundQuiz: document.getElementById('set-bgm-quiz').value === 'true'
    };
    
    studentNameStr = document.getElementById('student-name-input').value.trim();
    if(!studentNameStr) studentNameStr = (lang === 'th' ? 'ไม่ระบุชื่อ' : 'Anonymous');
    if(typeof saveStudentNameToMemory === 'function') saveStudentNameToMemory(studentNameStr);
    
    let customName = document.getElementById('custom-exam-title') ? document.getElementById('custom-exam-title').value.trim() : "";
    
    window.currentExamComponents = selectedFiles.filter(f => f.takeCount > 0).map(f => ({
        title: getText(f.title, lang),
        count: f.takeCount,
        filename: f.filename
    }));

    if (customName) {
        currentExamTitle = customName; 
    } else {
        if (window.currentExamComponents.length > 1) {
            currentExamTitle = `${window.currentExamComponents[0].title} (และผสมอีก ${window.currentExamComponents.length - 1} ชุด)`;
        } else if (window.currentExamComponents.length === 1) {
            currentExamTitle = window.currentExamComponents[0].title;
        } else {
            currentExamTitle = lang === 'th' ? "ชุดข้อสอบทั่วไป" : "General Exam Set";
        }
    }
    
    showQuestBriefing(currentExamTitle);
}

function showQuestBriefing(examTitle) {
    const isTh = lang === 'th';
    let totalQ = db.length;
    let estimatedTimeSec = 0;
    let totalExpDiffScore = 0; 

    db.forEach(q => {
        let topicText = (examTitle + " " + getText(q.topic, 'th') + " " + getText(q.skill, 'th')).toLowerCase();
        let base = 60;
        if (topicText.includes('คณิต') || topicText.includes('เลข') || topicText.includes('พีชคณิต') || topicText.includes('สมการ') || topicText.includes('ฟิสิกส์') || topicText.includes('เคมี')) base = 120;
        else if (topicText.includes('คอมพิวเตอร์') || topicText.includes('โปรแกรม') || topicText.includes('อัลกอริทึม') || topicText.includes('โค้ด')) base = 90;
        
        let timeMult = 1.0;
        let expDiffMult = 1.0;
        if (q.difficulty) {
            const d = (q.difficulty.en || q.difficulty.th || getText(q.difficulty,'th') || '').toLowerCase();
            if      (d.includes('extreme') || d.includes('แข่งขัน') || d.includes('สอบเข้า')) { timeMult = 2.0; expDiffMult = 1.3; }
            else if (d.includes('hard')    || d.includes('ยาก'))                               { timeMult = 1.5; expDiffMult = 1.2; }
            else if (d.includes('medium')  || d.includes('กลาง') || d.includes('ปานกลาง'))    { timeMult = 1.0; expDiffMult = 1.1; }
            else                                                                                { timeMult = 0.5; expDiffMult = 1.0; } 
        }
        estimatedTimeSec += Math.round(base * timeMult);
        totalExpDiffScore += expDiffMult;
    });

    const estMin   = Math.ceil(estimatedTimeSec / 60);
    const maxScore = totalQ * 1000;
    const avgDiff  = totalQ > 0 ? totalExpDiffScore / totalQ : 1.0;

    const setTxt = (id, th, en) => { const el = document.getElementById(id); if (el) el.innerText = isTh ? th : en; };
    setTxt('qb-header-title',   'ข้อมูลเควส',       'Quest Info');
    setTxt('ui-qb-quest-label', 'เควสหลัก:',        'Main Quest:');
    setTxt('ui-qb-count-label', 'จำนวน:',           'Questions:');
    setTxt('ui-qb-count-unit',  ' ข้อ',             '');
    setTxt('ui-qb-time-label',  'เวลา (ประมาณ):',   'Est. Time:');
    setTxt('ui-qb-time-unit',   ' นาที',            ' min');
    setTxt('ui-qb-score-label', 'คะแนนสูงสุด:',     'Max Score:');
    setTxt('ui-qb-level-label', 'ระดับ:',           'Level:');
    setTxt('ui-qb-exp-label',   'EXP (ประมาณ):',    'EXP (Est.):');
    setTxt('ui-qb-coin-label',  'Coin (ประมาณ):',   'Coin (Est.):');
    setTxt('ui-qb-coin-unit',   ' Coin',            ' Coin');
    setTxt('ui-qb-item-label',  'ไอเทม:',           'Items:');
    setTxt('ui-qb-bag-btn',     'คลัง',             'Bag');
    setTxt('ui-qb-cancel-text', 'ยกเลิก',           'Cancel');
    setTxt('ui-qb-start-text',  'พร้อมลุย!',        'Start!');

    const fullTitle = examTitle || (isTh ? "ชุดข้อสอบผสม" : "Mixed Exam");
    const gradeMatch = fullTitle.match(/^(.*?)\s+(?=[ปม]\.\d)/);
    const shortTitle = gradeMatch ? gradeMatch[1] + '…' : fullTitle;
    document.getElementById('qb-title').innerText = fullTitle;
    document.getElementById('qb-title-short').innerText = shortTitle;

    const comps = window.currentExamComponents || [];
    const popupLines = comps.length > 1
        ? comps.map((c, i) => `${i+1}. ${c.title} (${c.count} ${isTh?'ข้อ':'Q'})`).join('<br>')
        : `<span style="word-break:break-word;">${fullTitle}</span>`;

    let infoPopup = document.getElementById('qb-info-popup');
    if (!infoPopup) {
        infoPopup = document.createElement('div');
        infoPopup.id = 'qb-info-popup';
        infoPopup.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.6); z-index:20000; justify-content:center; align-items:center; backdrop-filter:blur(4px);';
        infoPopup.addEventListener('click', () => infoPopup.style.display = 'none');
        document.body.appendChild(infoPopup);
    }
    infoPopup.innerHTML = `
        <div style="background:var(--card-bg); border-radius:16px; padding:20px 22px; max-width:420px; width:88%; box-shadow:0 8px 30px rgba(0,0,0,0.5); border:1px solid rgba(0,240,255,0.2); text-align:left;" onclick="event.stopPropagation()">
            <div style="font-weight:800; font-size:1rem; color:var(--primary); margin-bottom:12px; padding-bottom:8px; border-bottom:1px dashed rgba(128,128,128,0.3);">
                📋 ${isTh?'รายละเอียดเควส':'Quest Details'}
            </div>
            <div style="font-size:0.88rem; color:var(--text-color); line-height:1.8;">${popupLines}</div>
            <div style="text-align:center; margin-top:14px;">
                <button onclick="document.getElementById('qb-info-popup').style.display='none'" style="background:var(--accent); color:#fff; border:none; border-radius:20px; padding:6px 20px; font-size:0.85rem; cursor:pointer; font-weight:bold;">${isTh?'ปิด':'Close'}</button>
            </div>
        </div>`;
    document.getElementById('qb-info-icon').title = '';
    document.getElementById('qb-info-icon').onclick = (e) => {
        e.stopPropagation();
        infoPopup.style.display = 'flex';
    };

    document.getElementById('qb-count').innerText = totalQ;
    document.getElementById('qb-time').innerText = config.useTimer ? estMin : '--';
    document.getElementById('qb-score').innerText = maxScore.toLocaleString();

    const playerExp = window._cachedPlayerExp || 0;
    const pLvl  = (typeof getLevelData === 'function') ? getLevelData(playerExp).level : 1;
    let pGroup  = 1;
    if (pLvl >= 15 && pLvl <= 29) pGroup = 2;
    else if (pLvl >= 30 && pLvl <= 59) pGroup = 3;
    else if (pLvl >= 60) pGroup = 4;
    const combined = fullTitle.toLowerCase();
    let eGroup = 2;
    if      (combined.includes('ม.6')||combined.includes('m.6')) eGroup = 4;
    else if (combined.includes('ม.5')||combined.includes('m.5')) eGroup = 4;
    else if (combined.includes('ม.4')||combined.includes('m.4')) eGroup = 4;
    else if (combined.includes('ม.3')||combined.includes('m.3')) eGroup = 3;
    else if (combined.includes('ม.2')||combined.includes('m.2')) eGroup = 3;
    else if (combined.includes('ม.1')||combined.includes('m.1')) eGroup = 3;
    else if (combined.includes('ป.6')||combined.includes('p.6')) eGroup = 2;
    else if (combined.includes('ป.5')||combined.includes('p.5')) eGroup = 2;
    else if (combined.includes('ป.4')||combined.includes('p.4')) eGroup = 2;
    else if (combined.includes('ป.3')||combined.includes('p.3')) eGroup = 1;
    else if (combined.includes('ป.2')||combined.includes('p.2')) eGroup = 1;
    else if (combined.includes('ป.1')||combined.includes('p.1')) eGroup = 1;
    const gap   = pGroup - eGroup;
    const lvlEl = document.getElementById('qb-level-match');
    if      (gap === 0)  lvlEl.innerHTML = `<span style="color:var(--success)">✅ ${isTh?'เหมาะสมกับเลเวล':'Suitable for your level'}</span>`;
    else if (gap === 1)  lvlEl.innerHTML = `<span style="color:#00bcd4">😎 ${isTh?'สเมิร์ฟ (ง่ายเกิน)':'Smurf (Too easy)'}</span>`;
    else if (gap >= 2)   lvlEl.innerHTML = `<span style="color:#2196f3">😂 ${isTh?'สเมิร์ฟหนัก':'Hard Smurf'}</span>`;
    else if (gap === -1) lvlEl.innerHTML = `<span style="color:#ff9800">⚠️ ${isTh?'โดนแก๊บ (ยากเกิน)':'Getting ganked'}</span>`;
    else                 lvlEl.innerHTML = `<span style="color:var(--danger)">🔥 ${isTh?'โดนแก๊บหนัก!':'Way too hard!'}</span>`;

    let baseExp = 100; let eGrp2 = 2;
    if      (combined.includes('ม.6')||combined.includes('m.6')) { baseExp=400; eGrp2=4; }
    else if (combined.includes('ม.5')||combined.includes('m.5')) { baseExp=320; eGrp2=4; }
    else if (combined.includes('ม.4')||combined.includes('m.4')) { baseExp=250; eGrp2=4; }
    else if (combined.includes('ม.3')||combined.includes('m.3')) { baseExp=200; eGrp2=3; }
    else if (combined.includes('ม.2')||combined.includes('m.2')) { baseExp=160; eGrp2=3; }
    else if (combined.includes('ม.1')||combined.includes('m.1')) { baseExp=130; eGrp2=3; }
    else if (combined.includes('ป.6')||combined.includes('p.6')) { baseExp=100; eGrp2=2; }
    else if (combined.includes('ป.5')||combined.includes('p.5')) { baseExp=70;  eGrp2=2; }
    else if (combined.includes('ป.4')||combined.includes('p.4')) { baseExp=50;  eGrp2=2; }
    else if (combined.includes('ป.3')||combined.includes('p.3')) { baseExp=30;  eGrp2=1; }
    else if (combined.includes('ป.2')||combined.includes('p.2')) { baseExp=20;  eGrp2=1; }
    else if (combined.includes('ป.1')||combined.includes('p.1')) { baseExp=10;  eGrp2=1; }
    const gapForExp = Math.abs(pGroup - eGrp2);
    let gapMult = 1.0;
    const curUser = sessionStorage.getItem('kruHengCurrentUser');
    if (curUser !== 'KruHeng') {
        if (gapForExp === 1) gapMult = 0.6;
        else if (gapForExp === 2) gapMult = 0.1;
        else if (gapForExp >= 3) gapMult = 0.01;
    }
    const estMaxExp = Math.round(baseExp * gapMult * (totalQ / 30) * avgDiff);
    document.getElementById('qb-exp-est').innerText = estMaxExp.toLocaleString();

    const estCoin = Math.round(totalQ * 10 * avgDiff);
    document.getElementById('qb-coin-est').innerText = estCoin.toLocaleString();

    const loadout    = window.currentLoadout || [];
    const loadoutDiv = document.getElementById('qb-loadout-display');
    if (loadout.length === 0) {
        loadoutDiv.innerHTML = `<span id="qb-no-item" style="font-size:0.78rem; color:var(--text-muted);">${isTh?'ไม่มี':'None'}</span>`;
    } else {
        loadoutDiv.innerHTML = loadout.map(id => {
            const it   = (typeof getGachaItemById === 'function') ? getGachaItemById(id) : null;
            const icon = it ? it.icon : '❓';
            const name = it ? (isTh ? it.nameTh : (it.nameEn || it.nameTh)) : id;
            return `<span title="${name}" style="font-size:1.3rem; cursor:default;">${icon}</span>`;
        }).join('');
    }

    document.getElementById('quest-briefing-overlay').style.display = 'flex';
    
    document.getElementById('qb-start-btn').onclick = function() {
        document.getElementById('quest-briefing-overlay').style.display = 'none';
        
        startTimeObj = new Date();
        try {
            if(typeof bgmMenu !== 'undefined') { bgmMenu.pause(); bgmMenu.currentTime = 0; }
            if(typeof bgmQuiz !== 'undefined') { bgmQuiz.currentTime = 0; if(config.soundQuiz) bgmQuiz.play().catch(e=>{}); }
        } catch(e) {}

        document.getElementById('setup-screen').style.display = 'none';
        let actionBar = document.getElementById('main-action-bar');
        if(actionBar) actionBar.style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'block';
        
        curIdx = 0; stat = { c: 0, t: 0, score: 0, coins: 0, exp: 0 }; wrongs = []; categoryStats = {}; pauseUsed = 0;
        
        (function() {
            const _role = sessionStorage.getItem('kruHengRole');
            const _uid  = sessionStorage.getItem('kruHengCurrentUser');
            if (_role === 'guest') {
                window._cachedPlayerExp = JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}').exp || 0;
            } else {
                const _db = JSON.parse(localStorage.getItem('kruHengStudentDB')) || {};
                window._cachedPlayerExp = (_db[_uid] && _db[_uid].exp) || 0;
            }
        })();

        const _userId = sessionStorage.getItem('kruHengCurrentUser');
        if (typeof gachaDeductLoadout === 'function' && window.currentLoadout?.length > 0) {
            gachaDeductLoadout(_userId, [...window.currentLoadout]);
        }

        if(typeof addLog === 'function') addLog(lang === 'th' ? "เริ่มทำข้อสอบ" : "Start Exam", `เริ่มทำชุด: ${currentExamTitle}`, true);
        render(); 
    };
}

function render() {
    if(typeof sfxTick !== 'undefined') { sfxTick.pause(); sfxTick.currentTime = 0; }

    document.getElementById('quiz-anim-box').classList.remove('shake-anim');
    const btnsOld = document.querySelectorAll('.opt-card');
    btnsOld.forEach(b => b.classList.remove('pop-anim'));

    if (curIdx >= db.length) return finish();

    if (typeof resetItemFlagsForNextQuestion === 'function') {
        resetItemFlagsForNextQuestion();
    }

    let q = db[curIdx];
    window.currentQuestion = q;         
    window.currentDisplayQuestion = q;  

    paused = false; isAnswered = false; clearInterval(nextInterval);
    window._activeItemChips = []; 
    if(typeof updateActiveItemChips === 'function') updateActiveItemChips();      

    if(typeof attemptSaveSession === 'function') attemptSaveSession();
    updateQuizHeaders();

    const _remaining = MAX_PAUSE - pauseUsed;
    const _pbtn    = document.getElementById('pause-btn');
    const _pbtnIn  = document.getElementById('pause-btn-in');
    if (_pbtn)   _pbtn.innerHTML   = lang==='th' ? `⏸️ พักเวลา (${_remaining})` : `⏸️ Pause (${_remaining} left)`;
    if (_pbtnIn) _pbtnIn.innerHTML = lang==='th' ? `⏸️ พัก (${_remaining})`      : `⏸️ Pause (${_remaining})`;

    document.getElementById('ui-score-val').innerText = `${stat.score.toLocaleString()} Pts`;

    const expEl = document.getElementById('ui-exp-val');
    if (expEl && typeof calcLiveExpPerQuestion === 'function') {
        expEl.innerText = `${calcLiveExpPerQuestion().toFixed(2)} EXP/ข้อ`;
    }

    const coinDisplay = document.getElementById('ui-coin-val');
    if (coinDisplay) {
        coinDisplay.innerText = (stat.coins || 0).toLocaleString();
    }

    let diffText = q.difficulty ? getText(q.difficulty, 'th').toLowerCase() : 'กลาง';
    let base = 100, penalty = 10;

    if (diffText.includes('ง่าย')) { base = 80; penalty = 5; }
    else if (diffText.includes('ยาก')) { base = 120; penalty = 15; }
    else if (diffText.includes('โหด')) { base = 150; penalty = 20; }

    let gapMult = (typeof getCurrentGapMult === 'function') ? getCurrentGapMult() : 1.0;
    let realBase = Math.round(base * gapMult);
    let realPenalty = Math.round(penalty * gapMult);

    window.currentSlotBonus = Math.floor(Math.random() * 51);
    let goldenBonusPreview = Math.round(realBase * 0.30);

    const rcPlus   = document.getElementById('reward-chip-plus');
    const rcMinus  = document.getElementById('reward-chip-minus');
    const rcGolden = document.getElementById('reward-chip-golden');
    const rcGap    = document.getElementById('reward-chip-gap');
    const rcItemExp  = document.getElementById('reward-chip-item-exp');
    const rcItemCoin = document.getElementById('reward-chip-item-coin');

    if (rcPlus)  rcPlus.innerHTML  = `<div class="reward-chip plus">✅ +${realBase} ${coinImg} <small>(สล็อต +${window.currentSlotBonus})</small></div>`;
    if (rcMinus) rcMinus.innerHTML = `<div class="reward-chip minus">❌ -${realPenalty} ${coinImg}</div>`;
    if (rcGolden) {
        rcGolden.innerHTML = `<div class="reward-chip bonus">🌟 Golden +${goldenBonusPreview} ${coinImg}</div>`;
        rcGolden.classList.remove('chip-inactive'); 
    }

    if (rcGap) {
        const gi = window._currentGapInfo || { gap: 0 };
        if (gi.gap > 0) {
            const pct = Math.round((1 - gi.gapMult) * 100);
            rcGap.style.display = '';
            rcGap.innerHTML = `<div class="reward-chip gap">⚡ ข้ามระดับ ${gi.gap} ชั้น ×${gi.gapMult} (-${pct}%)</div>`;
        } else {
            rcGap.style.display = 'none';
        }
    }

    const livePassive = (typeof gachaGetPassiveMultipliers === 'function')
        ? gachaGetPassiveMultipliers() : { expMult: 1, coinMult: 1 };
    if (rcItemExp) {
        if (livePassive.expMult > 1) {
            rcItemExp.style.display = '';
            rcItemExp.innerHTML = `<div class="reward-chip item-exp">📡 Absolute Zone EXP ×${livePassive.expMult}</div>`;
        } else { rcItemExp.style.display = 'none'; }
    }
    if (rcItemCoin) {
        if (livePassive.coinMult > 1) {
            rcItemCoin.style.display = '';
            rcItemCoin.innerHTML = `<div class="reward-chip item-coin">🌐 Ryoiki Coin ×${livePassive.coinMult}</div>`;
        } else { rcItemCoin.style.display = 'none'; }
    }

    if(typeof renderQuizLoadoutBar === 'function') renderQuizLoadoutBar();

    const topicEl = document.getElementById('q-topic');
    const skillEl = document.getElementById('q-skill');

    if (config.showTopic) {
        topicEl.style.display = 'block';
        topicEl.innerText = getText(q.topic, lang);

        if (q.skill) {
            skillEl.style.display = 'inline-block';
            skillEl.innerText = lang === 'th'
                ? `สกิล: ${getText(q.skill, lang)}`
                : `Skill: ${getText(q.skill, lang)}`;
        } else {
            if (skillEl) skillEl.style.display = 'none';
        }
    } else {
        topicEl.style.display = 'none';
        if (skillEl) skillEl.style.display = 'none';
    }

    const diffEl = document.getElementById('q-diff');
    if (q.difficulty) {
        diffEl.style.display = 'inline-block';
        let diffTextRaw = getText(q.difficulty, 'th');
        let displayDiff = getText(q.difficulty, lang);
        let diffClass = '';
        if (diffTextRaw === 'ง่าย' || diffTextRaw === 'Easy') { diffClass = 'diff-easy'; diffEl.innerText = (lang === 'th' ? "ระดับ: " : "Level: ") + displayDiff; }
        else if (diffTextRaw === 'ปานกลาง' || diffTextRaw === 'กลาง' || diffTextRaw === 'Medium') { diffClass = 'diff-medium'; diffEl.innerText = (lang === 'th' ? "ระดับ: " : "Level: ") + displayDiff; }
        else if (diffTextRaw === 'ยาก' || diffTextRaw === 'Hard') { diffClass = 'diff-hard'; diffEl.innerText = (lang === 'th' ? "ระดับ: " : "Level: ") + displayDiff; }
        else { diffClass = 'diff-extreme'; diffEl.innerHTML = '🔥 ' + displayDiff + ' 🔥'; }
        diffEl.className = 'diff-badge ' + diffClass;
    } else {
        diffEl.style.display = 'none';
    }

    document.getElementById('q-text').innerHTML = parseMedia(getText(q.question, lang));
    document.getElementById('ans-card').style.display = 'none';
    document.getElementById('next-cd').innerText = '';

    let currentOptions = getText(q.options, lang);
    let optionsHTML = currentOptions.map((o, idx) =>
        `<button class="opt-card" data-idx="${idx}" onclick="verify(this, ${idx})">${parseMedia(o)}</button>`
    ).sort(() => Math.random() - 0.5).join('');

    document.getElementById('options-box').innerHTML = optionsHTML;

    const tContainer = document.getElementById('timer-bar-container');
    if (tContainer) tContainer.style.display = config.useTimer ? 'block' : 'none';
    const tFill = document.getElementById('timer-bar-fill');
    if (tFill) { tFill.style.width = '100%'; tFill.style.background = 'var(--success)'; }

    if (config.useTimer) {
        let topicText = getText(q.topic, 'th').toLowerCase();
        let baseTime = 120;

        if (topicText.includes('คณิต') || topicText.includes('ฟิสิกส์') || topicText.includes('เคมี')) {
            baseTime = 150;
        } else if (topicText.includes('คอมพิวเตอร์') || topicText.includes('โปรแกรม') || topicText.includes('อัลกอริทึม')) {
            baseTime = 180;
        }

        let diffMult = 1.0;
        if (q.difficulty) {
            let dText = getText(q.difficulty, 'th').toLowerCase();
            if (dText.includes('ง่าย')) diffMult = 0.5;
            else if (dText.includes('ยาก') || dText.includes('hard')) diffMult = 1.5;
            else if (dText.includes('โหด') || dText.includes('แข่งขัน')) diffMult = 2.0;
        }

        currentQTimeSec = Math.round(baseTime * diffMult);
        clock();
    } else {
        document.getElementById('ui-timer').innerText = '--.--';
    }

    setTimeout(() => { if(typeof academicRender === 'function') academicRender('quiz-screen') }, 10);
}

function verify(el, valOrIdx) {
    if (isAnswered) return;

    clearInterval(timer); isAnswered = true;
    if(typeof sfxTick !== 'undefined') { sfxTick.pause(); sfxTick.currentTime = 0; }

    const q = db[curIdx];
    const displayQ = window.currentDisplayQuestion || q;
    let currentOptions = getText(displayQ.options, lang);
    let val = (valOrIdx === 'TIMEOUT') ? 'TIMEOUT' : currentOptions[valOrIdx];
    let correctAnswer = getText(displayQ.answer, lang);

    const btns = document.querySelectorAll('.opt-card');
    btns.forEach(b => b.disabled = true);
    const cat = getText(q.topic, 'th').match(/(ม\.\d เทอม \d|ป\.\d เทอม \d)/)?.[1] || "ทั่วไป";
    if (!categoryStats[cat]) categoryStats[cat] = { c: 0, t: 0 };
    categoryStats[cat].t++; stat.t++;
    const isCorrect = (val === correctAnswer);

    let pts = 0;
    let earnedCoins = 0;
    let coinMsg = "";

    let diffText = q.difficulty ? getText(q.difficulty, 'th').toLowerCase() : 'กลาง';
    let coinMult = 1.0;
    let coinPenalty = 10;
    if (diffText.includes('ง่าย') || diffText.includes('easy')) { coinMult = 0.8; coinPenalty = 5; }
    else if (diffText.includes('ยาก') || diffText.includes('hard')) { coinMult = 1.2; coinPenalty = 15; }
    else if (diffText.includes('โหด') || diffText.includes('แข่งขัน')) { coinMult = 1.5; coinPenalty = 20; }

    let gapMult = (typeof getCurrentGapMult === 'function') ? getCurrentGapMult() : 1.0;

    const fx = (typeof applyGachaEffectAfter === 'function')
        ? applyGachaEffectAfter(isCorrect, val)
        : { coinMult: 1, skipWrongPenalty: false, skipWrongStat: false, retryAllowed: false, scoreMultiplier: 1 };

    let timeUsed = 0;
    let goldenTime = 0;

    if (isCorrect) {
        if (config.soundSfxCorrect && typeof sfxCorrect !== 'undefined') { sfxCorrect.pause(); sfxCorrect.currentTime = 0; sfxCorrect.play().catch(e=>{}); }

        if (config.useTimer) {
            let timeLeftSec = leftMs / 1000;
            timeUsed = currentQTimeSec - timeLeftSec;
            goldenTime = currentQTimeSec * 0.3;

            if (timeUsed <= goldenTime) {
                pts = 1000;
            } else {
                let remainingTimeAfterGolden = currentQTimeSec - goldenTime;
                let excessTime = timeUsed - goldenTime;
                pts = Math.round(1000 * (1 - (excessTime / remainingTimeAfterGolden)));
                if (pts < 0) pts = 0;
            }
        } else {
            pts = 1000;
        }

        let baseCoin = Math.round(100 * coinMult);
        let slotBonus = window.currentSlotBonus || 0;
        let rawEarned = baseCoin + slotBonus;

        if (config.useTimer && timeUsed <= goldenTime) {
            let goldenBonus = Math.round(baseCoin * 0.30);
            rawEarned += goldenBonus;
            coinMsg = `(สล็อต +${slotBonus} | Golden +${goldenBonus})`;
        } else {
            coinMsg = `(สล็อต +${slotBonus})`;
        }

        earnedCoins = Math.round(rawEarned * gapMult);
        if (gapMult < 1.0) coinMsg += ` <span style="color:var(--danger);">(หัก Smurf)</span>`;

        earnedCoins = Math.round(earnedCoins * fx.coinMult);
        pts         = Math.round(pts * fx.scoreMultiplier);

        if (fx.coinMult >= 3 && window.activeItemEffects?.['MADNESS_COIN_ACTIVE'])
            coinMsg += ` <span style="color:#ae57ff;">🪙 Madness ×3</span>`;
        if (window.activeItemEffects?.['JINCHURIKI_ACTIVE'])
            coinMsg += ` <span style="color:#ff0055;">🦊 Jinchuriki 💰×10!</span>`;
        if (window.activeItemEffects?.['KING_ENGINE_ACTIVE']) {
            const attempt = window.kingEngineAttempt || 1;
            const multMap = { 1: 3, 2: 2, 3: 1, 4: 0.5 };
            const km = multMap[Math.min(attempt, 4)];
            if (km < 1)
                coinMsg += ` <span style="color:#ae57ff;">⚙️ King Engine ×0.5 (ครั้งที่ 4)</span>`;
            else
                coinMsg += ` <span style="color:#ae57ff;">⚙️ King Engine ×${km} (ครั้งที่ ${attempt})</span>`;
        }

        if (config.practiceMode) {
            earnedCoins = 0;
            pts = 0;
        } else {
            stat.coins = (stat.coins || 0) + earnedCoins;
            stat.c++; stat.score += pts; categoryStats[cat].c++;
        }

        const earnedExp = 0;

        if (window.activeItemEffects?.['KING_ENGINE_ACTIVE']) {
            const keSlot = window.kingEngineSlotIndex;
            if (typeof keSlot === 'number' && window.currentLoadout) {
                window.currentLoadout.splice(keSlot, 1);
            }
            window.kingEngineSlotIndex = undefined;
            if (typeof renderQuizLoadoutBar === 'function') renderQuizLoadoutBar();
        }

        if (el) { el.classList.add('correct'); el.classList.add('pop-anim'); }
        document.getElementById('ans-status').innerText = lang === 'th' ? "ถูกต้องครับ! ✅" : "Correct! ✅";
        document.getElementById('ans-status').style.color = "var(--success)";

        document.getElementById('points-earned').innerHTML = config.practiceMode
            ? `<span style="color:var(--success); font-size:1.05em;">✅ ถูกต้อง</span><br><span style="color:var(--text-muted); font-size:0.85rem;">📝 โหมดฝึกซ้อม — ไม่นับสถิติ</span>`
            : `<span style="color:var(--success); font-size:1.05em;">+1 ข้อถูก</span> <small style="color:gray; font-weight:normal;">(รวม ${stat.c} ข้อ)</small><br>
            <span style="color:var(--primary);">+${pts.toLocaleString()} Pts</span> <small style="color:gray; font-weight:normal;">(รวม ${stat.score.toLocaleString()} Pts)</small><br>
            <span style="color:#ff9800;">+${earnedCoins} ${coinImg}</span> <small style="color:gray; font-weight:normal;">(รวม ${(stat.coins||0).toLocaleString()} 🪙 ${coinMsg})</small>`;

    } else {
        if (el) el.classList.add('wrong');

        if (fx.kingEngineRetry) {
            isAnswered = false;
            categoryStats[cat].t--;
            stat.t--;
            window.kingEngineAttempt = (window.kingEngineAttempt || 1) + 1;
            if(typeof renderQuizLoadoutBar === 'function') renderQuizLoadoutBar(); 

            if (el) {
                el.style.transition = 'background 0.1s';
                el.style.background = 'rgba(255,50,50,0.5)';
                el.disabled = true;
                setTimeout(() => {
                    el.style.opacity = '0';
                    el.style.transition = 'opacity 0.25s';
                    setTimeout(() => {
                        el.remove();
                    }, 260);
                }, 300);
            }

            setTimeout(() => {
                document.querySelectorAll('.opt-card').forEach(b => {
                    if (b !== el) {
                        b.disabled = false;
                        b.classList.remove('wrong');
                    }
                });
            }, 200);
            return;
        }

        if (fx.retryAllowed && !window.activeItemEffects['PHOENIX_USED']) {
            window.activeItemEffects['PHOENIX_USED'] = true;
            isAnswered = false;
            categoryStats[cat].t--;
            stat.t--;
            if (typeof showItemActivationToast === 'function') {
                const phoenixItem = (typeof getGachaItemById === 'function') ? getGachaItemById('phoenix_heart') : null;
                if (phoenixItem) showItemActivationToast(phoenixItem);
            }
            if (el) {
                el.style.background = 'rgba(255,50,50,0.5)';
                el.disabled = true;
                setTimeout(() => {
                    el.style.opacity = '0';
                    el.style.transition = 'opacity 0.25s';
                    setTimeout(() => { el.remove(); }, 260);
                }, 300);
            }
            setTimeout(() => {
                document.querySelectorAll('.opt-card').forEach(b => {
                    if (b !== el) { b.disabled = false; b.classList.remove('wrong'); }
                });
            }, 200);
            return;
        }

        wrongs.push({ id: curIdx + 1, topic: q.topic, q: q.question, a: q.answer });
        document.getElementById('quiz-anim-box').classList.add('shake-anim');

        if (fx.skipWrongStat && wrongs.length > 0) {
            wrongs.pop();
            categoryStats[cat].t--;
            stat.t--;
        }

        if (fx.skipWrongPenalty) {
            earnedCoins = 0;
            coinMsg = `<span style="color:var(--success);">🛡️ Maple Shield ป้องกัน!</span>`;
        } else {
            let rawPenalty = -coinPenalty;
            earnedCoins = Math.round(rawPenalty * gapMult * fx.coinMult);
            if (fx.coinMult === 3)
                coinMsg += ` <span style="color:#ae57ff;">🪙 Madness ×3</span>`;
        }

        stat.coins = (stat.coins || 0) + earnedCoins;
        if (stat.coins < 0) stat.coins = 0; 

        if (val === 'TIMEOUT') {
            document.getElementById('ans-status').innerText = lang === 'th' ? "หมดเวลา! ⏰" : "Time's up! ⏰";
            document.getElementById('ans-status').style.color = "#ff9800";
        } else {
            if (config.soundSfxWrong && typeof sfxWrong !== 'undefined') { sfxWrong.pause(); sfxWrong.currentTime = 0; sfxWrong.play().catch(e=>{}); }
            document.getElementById('ans-status').innerText = lang === 'th' ? "ผิดครับ! ❌" : "Wrong! ❌";
            document.getElementById('ans-status').style.color = "var(--danger)";
        }

        const wrongCoinDisplay = earnedCoins === 0
            ? `<span style="color:var(--success);">${coinMsg}</span>`
            : `<span style="color:var(--danger); font-size:0.9em; font-weight:bold;">${earnedCoins} ${coinImg} <small style="font-size:0.7em; color:gray; font-weight:normal;">${coinMsg || '(ปรับตามความยาก)'}</small></span>`;

        document.getElementById('points-earned').innerHTML = `+ 0 Pts <br>${wrongCoinDisplay}`;
        btns.forEach(b => { if (currentOptions[b.getAttribute('data-idx')] === correctAnswer) b.classList.add('correct'); });
    }

    document.getElementById('ui-live-correct').innerText = lang === 'th' ? `ถูก: ${stat.c}` : `Correct: ${stat.c}`;
    document.getElementById('ui-coin-val').innerText = (stat.coins || 0).toLocaleString();
    document.getElementById('ui-score-val').innerHTML = `${stat.score.toLocaleString()} Pts`;

    document.getElementById('ans-val').innerHTML = parseMedia(correctAnswer);
    document.getElementById('ans-desc').innerHTML = parseMedia(getText(q.explanation, lang));
    document.getElementById('ans-card').style.display = 'block';
    
    if(typeof academicRender === 'function') academicRender('ans-card');

    if (config.useDelay) { nextSecondsLeft = config.delayTime; startNextCountdown(); } else { document.getElementById('manual-next-btn').style.display = 'inline-flex'; }
}

function clock() {
    clearInterval(timer); leftMs = currentQTimeSec * 1000; 
    document.getElementById('ui-timer').innerText = (leftMs / 1000).toFixed(2);
    lastSec = Math.ceil(leftMs/1000);
    
    timer = setInterval(() => {
        if(!paused) {
            leftMs -= 10;
            document.getElementById('ui-timer').innerText = (leftMs / 1000).toFixed(2);
            let pct = (leftMs / (currentQTimeSec * 1000)) * 100;
            let tFill = document.getElementById('timer-bar-fill');
            if(tFill) {
                tFill.style.width = pct + '%';
                if(pct > 50) tFill.style.background = 'var(--success)';
                else if(pct > 25) tFill.style.background = '#ff9800';
                else tFill.style.background = 'var(--danger)';
            }

            const goldenThreshMs = currentQTimeSec * 1000 * 0.7;
            if (leftMs < goldenThreshMs) {
                document.getElementById('reward-chip-golden')?.classList.add('chip-inactive');
            }

            let curSec = Math.ceil(leftMs/1000);
            if (curSec <= 6 && curSec > 0 && curSec !== lastSec) {
                if (config.soundSfxTick && typeof sfxTick !== 'undefined') { sfxTick.pause(); sfxTick.currentTime = 0; sfxTick.play().catch(e=>{}); }
                lastSec = curSec;
            }
            if(leftMs <= 0) { clearInterval(timer); verify(null, 'TIMEOUT'); }
        }
    }, 10);
}

function startNextCountdown() { 
    clearInterval(nextInterval); 
    nextInterval = setInterval(() => { 
        if (!paused) { 
            document.getElementById('next-cd').innerText = lang === 'th' ? `เริ่มข้อต่อไปใน ${nextSecondsLeft}...` : `Next in ${nextSecondsLeft}...`; 
            if (nextSecondsLeft <= 0) { clearInterval(nextInterval); if(typeof sfxTick !== 'undefined') sfxTick.pause(); curIdx++; render(); } 
            nextSecondsLeft--; 
        } 
    }, 1000); 
}

function nextQuestion() { curIdx++; render(); }

function suspendQuiz() {
    const pauseOverlay = document.getElementById('pause-overlay');
    const wasPaused = paused; 
    
    paused = true; 
    pauseOverlay.style.display = 'flex';
    pauseOverlay.innerText = lang === 'th' ? 'กำลังบันทึก...' : 'SUSPENDING...';
    
    setTimeout(() => {
        if(confirm(lang === 'th' ? "ต้องการบันทึกข้อสอบเพื่อกลับมาทำต่อภายหลังหรือไม่?" : "Do you want to save and exit to continue later?")) {
            const _suspUid = sessionStorage.getItem('kruHengCurrentUser');
            if (typeof gachaRestoreLoadout === 'function' && window.currentLoadout?.length > 0) {
                gachaRestoreLoadout(_suspUid, [...window.currentLoadout]);
            }
            if(typeof addLog === 'function') addLog(lang === 'th' ? "พักข้อสอบ" : "Suspend Exam", `พักข้อสอบชุด: ${currentExamTitle} (ทำถึงข้อ ${curIdx + 1})`, true);
            if(typeof saveCurrentSession === 'function') saveCurrentSession();
            window.currentLoadout = []; 
            location.reload();
        } else {
            paused = wasPaused;
            pauseOverlay.style.display = (paused && !isAnswered && config.pauseHide) ? 'flex' : 'none';
            pauseOverlay.innerText = lang === 'th' ? 'พักเวลา' : 'PAUSED';
        }
    }, 50);
}

function togglePause() {
    const timerIsRunning = !isAnswered && config.useTimer;
    if (!paused && timerIsRunning && pauseUsed >= MAX_PAUSE) {
        alert(lang === 'th'
            ? `⚠️ หมดสิทธิ์พักแล้ว! ใช้ไปครบ ${MAX_PAUSE} ครั้งแล้ว`
            : `⚠️ Pause limit reached! You've used all ${MAX_PAUSE} pauses.`);
        return;
    }

    paused = !paused;
    if (paused && timerIsRunning) pauseUsed++;

    const pauseOverlay = document.getElementById('pause-overlay');
    pauseOverlay.style.display = (paused && !isAnswered && config.pauseHide) ? 'flex' : 'none';
    pauseOverlay.innerText = lang === 'th' ? 'พักเวลา' : 'PAUSED';

    const remaining = MAX_PAUSE - pauseUsed;
    const pauseLabel     = paused ? (lang==='th'?'▶️ เล่นต่อ':'▶️ Resume') : (lang==='th'?`⏸️ พักเวลา (${remaining})`:` ⏸️ Pause (${remaining} left)`);
    const pauseLabelIn   = paused ? (lang==='th'?'▶️ เล่นต่อ':'▶️ Resume') : (lang==='th'?`⏸️ พัก (${remaining})`:` ⏸️ Pause (${remaining})`);

    document.getElementById('pause-btn').innerHTML    = pauseLabel;
    document.getElementById('pause-btn-in').innerHTML = pauseLabelIn;
}

function finish() {
    if (stat.isFinished) return;
    stat.isFinished = true;

    window.currentLoadout = [];

    if(typeof bgmQuiz !== 'undefined') bgmQuiz.pause(); 
    if(typeof toggleBgmMenu === 'function') toggleBgmMenu();
    
    const role = sessionStorage.getItem('kruHengRole');
    if (role === 'guest') sessionStorage.removeItem('kruHengGuestActiveSession');
    else localStorage.removeItem('kruHengActiveSession');

    const currentUser = sessionStorage.getItem('kruHengCurrentUser');
    let currentExp = 0;
    if (role === 'guest') {
        const gInfo = JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}');
        currentExp = gInfo.exp || 0;
    } else {
        const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || (typeof defaultStudentDB !== 'undefined' ? defaultStudentDB : {});
        if (dbStudent[currentUser]) currentExp = dbStudent[currentUser].exp || 0;
    }

    let topicsList = Object.keys(categoryStats);
    window.lastEarnedExp = (typeof calculateExamEXP === 'function') ? calculateExamEXP(currentExp, currentExamTitle, topicsList, stat.c, stat.t, db) : 0;

    const passive = (typeof gachaGetPassiveMultipliers === 'function')
        ? gachaGetPassiveMultipliers()
        : { expMult: 1, coinMult: 1 };

    if (passive.expMult !== 1) {
        window.lastEarnedExp = +(window.lastEarnedExp * passive.expMult).toFixed(2);
    }

    if (passive.coinMult !== 1) {
        stat.coins = Math.round((stat.coins || 0) * passive.coinMult);
    }

    window.lastEarnedCoins = stat.coins || 0;

    if (role === 'guest') {
        const gInfo = JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}');
        gInfo.coins = (gInfo.coins || 0) + window.lastEarnedCoins;
        sessionStorage.setItem('kruHengGuestInfo', JSON.stringify(gInfo));
    } else {
        const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || (typeof defaultStudentDB !== 'undefined' ? defaultStudentDB : {});
        if (dbStudent[currentUser]) {
            dbStudent[currentUser].coins = (dbStudent[currentUser].coins || 0) + window.lastEarnedCoins;
            localStorage.setItem('kruHengStudentDB', JSON.stringify(dbStudent));
        }
    }

    window.kingEngineCount = 0;

    let totalQuestions = stat.t || 1;
    let avgPts = Math.round(stat.score / totalQuestions);

    let rankStr = "D";
    let rankDesc = lang === 'th' ? "ต้องพยายามอีกนิด! ✌️" : "Needs Practice! ✌️";
    let rankColor = "linear-gradient(45deg, #9e9e9e, #616161)";
    let textColor = "#757575";

    if (avgPts >= 850) {
        rankStr = "S";
        rankDesc = lang === 'th' ? "อัจฉริยะ! 👑" : "Genius! 👑";
        rankColor = "linear-gradient(45deg, #ffd700, #ff8c00)";
        textColor = "#ff8c00";
    } else if (avgPts >= 700) {
        rankStr = "A";
        rankDesc = lang === 'th' ? "ยอดเยี่ยม! 🌟" : "Excellent! 🌟";
        rankColor = "linear-gradient(45deg, #00f0ff, #0080ff)";
        textColor = "#0080ff";
    } else if (avgPts >= 550) {
        rankStr = "B";
        rankDesc = lang === 'th' ? "ดีมาก! 👏" : "Good Job! 👏";
        rankColor = "linear-gradient(45deg, #00ff88, #00c853)";
        textColor = "#00c853";
    } else if (avgPts >= 400) {
        rankStr = "C";
        rankDesc = lang === 'th' ? "พอใช้! 👍" : "Fair! 👍";
        rankColor = "linear-gradient(45deg, #ff9800, #ff5722)";
        textColor = "#ff5722";
    }

    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('sum-screen').style.display = 'block';
    
    let actionBar = document.getElementById('main-action-bar');
    if(actionBar) actionBar.style.display = 'flex';

    const rankTitleEl = document.getElementById('ui-rank-title');
    if (rankTitleEl) rankTitleEl.innerText = lang === 'th' ? 'ระดับความสามารถของคุณ' : 'Your Performance Rank';

    let badgeEl = document.getElementById('sum-rank-badge');
    if (badgeEl) {
        badgeEl.innerText = rankStr;
        badgeEl.style.background = rankColor;
        badgeEl.style.boxShadow = `0 10px 25px rgba(0,0,0,0.2)`;
    }
    let descEl = document.getElementById('sum-rank-desc');
    if (descEl) {
        descEl.innerText = rankDesc;
        descEl.style.color = textColor;
    }

    let avgText = lang === 'th' ? `เฉลี่ย ${avgPts} Pts/ข้อ` : `Avg: ${avgPts} Pts/Q`;
    document.getElementById('sum-score-val').innerText = stat.score.toLocaleString();
    document.getElementById('sum-avg-val').innerText = avgText;
    document.getElementById('sum-c').innerText = stat.c;
    document.getElementById('sum-p').innerText = Math.round((stat.c / totalQuestions) * 100) + "%";
    document.getElementById('sum-exp-val').innerText = `+${window.lastEarnedExp.toFixed(2)}`;

    let coinLabel = `+${window.lastEarnedCoins.toLocaleString()}`;
    if (passive.coinMult > 1)
        coinLabel += ` <small style="color:#00f0ff; font-size:0.7em;">🌐 Ryoiki ×${passive.coinMult}</small>`;

    const bd = window.lastExpBreakdown || {};
    const expBaseAfterGap = +((bd.baseExp||0) * (bd.gapMult||1)).toFixed(2);
    const expAfterQ       = +(expBaseAfterGap * (bd.qScale||0)).toFixed(2);
    const expAfterDiff    = +(expAfterQ * (bd.diffMult||1)).toFixed(2);
    const expAfterAcc     = +(expAfterDiff * (bd.accuracy||0)).toFixed(2);
    const itemMult        = passive.expMult || 1;
    const expFinal        = +(expAfterAcc * itemMult).toFixed(2);

    const gapNote  = bd.gapMult < 1 ? ` <span style="color:var(--danger)">(ข้ามระดับ ${bd.gap} ชั้น หัก ${Math.round((1-bd.gapMult)*100)}%)</span>` : ' ✅';
    const itemNote = itemMult > 1 ? ` <span style="color:#00f0ff">📡 Absolute Zone ×${itemMult}</span>` : '';

    const expElObj = document.getElementById('sum-exp-val');
    if (expElObj) expElObj.innerHTML = `+${expFinal.toFixed(2)}${itemNote}`;

    const bkContent = document.getElementById('exp-breakdown-content');
    if (bkContent) {
        bkContent.innerHTML = `
          <div style="font-weight:900; color:var(--accent); font-size:1.1rem; margin-bottom:14px; text-align:center;">
            🧮 การคำนวณ EXP
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:0.9rem; line-height:1.9;">
            <tr>
              <td style="color:var(--text-color); opacity:0.7;">Base EXP (${bd.gradeLabel||''})</td>
              <td style="text-align:right; font-weight:bold;">${bd.baseExp||0}</td>
            </tr>
            <tr>
              <td>× Level Gap <small style="opacity:0.6;">${bd.gapMult < 1 ? `(ข้ามระดับ ${bd.gap} ชั้น)` : '✅'}</small></td>
              <td style="text-align:right; font-weight:bold; color:${bd.gapMult < 1 ? 'var(--danger)' : 'var(--success)'};">
                ×${bd.gapMult} → ${expBaseAfterGap.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td>× จำนวนข้อ/30 <small style="opacity:0.6;">(${bd.total||0}÷30)</small></td>
              <td style="text-align:right; font-weight:bold;">×${bd.qScale} → ${expAfterQ.toFixed(2)}</td>
            </tr>
            <tr>
              <td>× ความยาก</td>
              <td style="text-align:right; font-weight:bold; color:var(--secondary);">×${bd.diffMult} → ${expAfterDiff.toFixed(2)}</td>
            </tr>
            <tr>
              <td>× ความแม่นยำ <small style="opacity:0.6;">(${bd.correct||0}/${bd.total||0} ข้อ)</small></td>
              <td style="text-align:right; font-weight:bold; color:var(--primary);">×${bd.accuracy} → ${expAfterAcc.toFixed(2)}</td>
            </tr>
            ${itemMult > 1 ? `
            <tr>
              <td>× ไอเทม <small style="color:#00f0ff;">📡 ×${itemMult}</small></td>
              <td style="text-align:right; font-weight:bold; color:#00f0ff;">×${itemMult} → ${expFinal.toFixed(2)}</td>
            </tr>` : ''}
          </table>
          <div style="margin-top:14px; padding:12px 16px; background:rgba(112,0,255,0.1);
                      border-radius:12px; text-align:center; font-weight:900;
                      color:var(--accent); font-size:1.2rem;">
            🎯 EXP ที่ได้รับ = <span style="font-size:1.6rem;">+${expFinal.toFixed(2)}</span>
          </div>`
        ;
    }

    document.getElementById('sum-coin-val').innerHTML = coinLabel;

    let componentsHtml = '';
    if (window.currentExamComponents && window.currentExamComponents.length > 0) {
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
                        ${window.currentExamComponents.map(c => `<tr><td style="text-align: left; font-size: 0.9rem;">${c.title}</td><td style="font-weight:bold;">${c.count}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    let tbodyContainerObj = document.getElementById('group-analysis-body');
    if(tbodyContainerObj) {
        let tbodyContainer = tbodyContainerObj.parentElement;
        let existingComponentsBox = document.getElementById('temp-components-box');
        if (existingComponentsBox) existingComponentsBox.remove();

        if (componentsHtml) {
            let div = document.createElement('div');
            div.id = 'temp-components-box';
            div.innerHTML = componentsHtml;
            tbodyContainer.parentNode.insertBefore(div, tbodyContainer);
        }
    }

    if ((stat.c / totalQuestions) * 100 >= 80 && typeof confetti === "function") {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ff007f', '#00f0ff', '#7000ff', '#00ff88'] });
    }

    const analysisArray = Object.keys(categoryStats).map(k => {
        const s = categoryStats[k];
        return { k, c: s.c, t: s.t, pct: Math.round((s.c / s.t) * 100) };
    }).sort((a, b) => a.pct - b.pct);
    
    let groupAnalysisObj = document.getElementById('group-analysis-body');
    if(groupAnalysisObj) {
        groupAnalysisObj.innerHTML = analysisArray.map(i =>
            `<tr><td>${i.k}</td><td>${i.c}</td><td>${i.t - i.c}</td><td>${i.t}</td><td>${i.pct}%</td></tr>`
        ).join('');
    }

    if(typeof renderWrongsTable === 'function') renderWrongsTable(wrongs);
    if(typeof academicRender === 'function') academicRender('sum-screen');
    if(typeof saveRecord === 'function') saveRecord();
    if(typeof renderProfileBadge === 'function') renderProfileBadge();
}

function showExpBreakdown() {
    const overlay = document.getElementById('exp-breakdown-overlay');
    if (overlay) overlay.style.display = 'flex';
}
function hideExpBreakdown() {
    const overlay = document.getElementById('exp-breakdown-overlay');
    if (overlay) overlay.style.display = 'none';
}

console.log("✅ [SUCCESS] app_quiz.js โหลดเสร็จสมบูรณ์!");
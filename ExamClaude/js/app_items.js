/* =====================================================================
   🪄 ไฟล์: js/app_items.js
   หน้าที่: จัดการระบบไอเทมเวทมนตร์ (Gacha Items), เอฟเฟกต์ต่างๆ และการแสดงผลบนจอ
   ===================================================================== */
console.log("🪄 [START] โมดูลเริ่มทำงาน: app_items.js (ระบบไอเทมเวทมนตร์และกระเป๋า)");

// วาดแถบกระเป๋าไอเทมที่เลือกมา (Loadout) ในหน้าทำข้อสอบ
function renderQuizLoadoutBar() {
    const loadout = window.currentLoadout || [];
    let loadoutBar = document.getElementById('quiz-loadout-bar');

    if (loadout.length === 0) {
        if (loadoutBar) loadoutBar.remove();
        return;
    }

    if (!loadoutBar) {
        loadoutBar = document.createElement('div');
        loadoutBar.id = 'quiz-loadout-bar';
        loadoutBar.style.cssText = `
            display: flex; gap: 6px; align-items: center; flex-wrap: nowrap;
            overflow-x: auto; overflow-y: hidden;
            padding: 6px 10px;
            background: rgba(0,240,255,0.06);
            border-radius: 10px; border: 1px solid rgba(0,240,255,0.2);
            scrollbar-width: thin; -webkit-overflow-scrolling: touch;
        `;
        const wrapper = document.getElementById('quiz-loadout-bar-wrapper');
        if (wrapper) {
            wrapper.appendChild(loadoutBar);
        } else {
            const optBox = document.getElementById('options-box');
            if (optBox && optBox.parentNode) {
                optBox.parentNode.insertBefore(loadoutBar, optBox);
            }
        }
    }

    const passiveEffects = ['ABSOLUTE_ZONE', 'RYOIKI_TENKAI'];
    const slotsHTML = loadout.map((itemId, slotIdx) => {
        const item = (typeof getGachaItemById === 'function') ? getGachaItemById(itemId) : null;
        if (!item) return '';
        const isPassive = passiveEffects.includes(item.effect);
        // passive items แสดงในแถบ buff row แทน — ไม่แสดงในกระเป๋า
        if (isPassive) return '';
        if (item.effect === 'KING_ENGINE') {
            const isActive = window.activeItemEffects?.['KING_ENGINE_ACTIVE'];
            const attempt  = window.kingEngineAttempt || 1;
            const multMap  = { 1: 3, 2: 2, 3: 1, 4: 0.5 };
            const m        = multMap[Math.min(attempt, 4)];
            if (isActive) {
                const attemptLabel = attempt <= 4
                    ? `ครั้งที่ ${attempt} → ×${m}`
                    : 'รอตอบถูก';
                return `
                <span title="King Engine กำลังทำงาน — ${attemptLabel}"
                    style="
                        font-size:1.5rem; background: rgba(174,87,255,0.2);
                        border: 1.5px solid #ae57ff; border-radius: 10px;
                        padding: 4px 10px; display: inline-flex; flex-direction: column;
                        align-items: center; gap: 2px;
                    ">
                    ${item.icon}
                    <span style="font-size:0.62rem; color:#ae57ff; font-weight:bold;">${attemptLabel}</span>
                </span>`;
            }
            return `
                <button onclick="activateGachaItem(${slotIdx})"
                    title="คิงเอนจิน — ตอบผิดจะลดตัวเลือก ตอบถูกครั้งแรก ×3\n${item.description}"
                    style="
                        font-size:1.5rem; background: rgba(0,240,255,0.12);
                        border: 1.5px solid rgba(0,240,255,0.4); border-radius: 10px;
                        padding: 4px 10px; cursor: pointer; transition: transform 0.1s, background 0.2s;
                        display: inline-flex; flex-direction: column; align-items: center; gap: 2px;
                    "
                    onmouseover="this.style.background='rgba(0,240,255,0.25)'"
                    onmouseout="this.style.background='rgba(0,240,255,0.12)'"
                    onmousedown="this.style.transform='scale(0.92)'"
                    onmouseup="this.style.transform='scale(1)'">
                    ${item.icon}
                    <span style="font-size:0.58rem; color:#ae57ff;">คิงเอนจิน</span>
                </button>`;
        }
        return `
            <button onclick="activateGachaItem(${slotIdx})"
                title="คลิกเพื่อใช้: ${item.nameTh}\n${item.description}"
                style="
                    font-size:1.5rem; background: rgba(0,240,255,0.12);
                    border: 1.5px solid rgba(0,240,255,0.4); border-radius: 10px;
                    padding: 4px 10px; cursor: pointer; transition: transform 0.1s, background 0.2s;
                    display: inline-flex; flex-direction: column; align-items: center; gap: 2px;
                "
                onmouseover="this.style.background='rgba(0,240,255,0.25)'"
                onmouseout="this.style.background='rgba(0,240,255,0.12)'"
                onmousedown="this.style.transform='scale(0.92)'"
                onmouseup="this.style.transform='scale(1)'">
                ${item.icon}
                <span style="font-size:0.58rem; color:var(--text-muted); max-width:60px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.nameTh}</span>
            </button>`;
    }).join('');

    const filteredSlots = slotsHTML.trim();
    if (!filteredSlots) {
        // passive ทั้งหมด — ซ่อนแถบ loadout
        if (loadoutBar) loadoutBar.style.display = 'none';
    } else {
        if (loadoutBar) loadoutBar.style.display = '';
        loadoutBar.innerHTML = `
            <span style="font-size:0.72rem; color:var(--text-muted); margin-right:2px;">🎒 กดใช้:</span>
            ${filteredSlots}
        `;
    }
}

// สีตาม rarity ของไอเทม
const RARITY_COLOR = {
    common:  { bg: 'rgba(158,158,158,0.15)', border: '#9e9e9e', text: '#9e9e9e' },
    rare:    { bg: 'rgba(0,180,216,0.15)',   border: '#00b4d8', text: '#00b4d8' },
    epic:    { bg: 'rgba(255,152,0,0.15)',   border: '#ff9800', text: '#ff9800' },
    mythic:  { bg: 'rgba(174,87,255,0.15)',  border: '#ae57ff', text: '#ae57ff' },
    godlike: { bg: 'rgba(255,0,85,0.15)',    border: '#ff0055', text: '#ff0055' },
};

// อัปเดตชิปที่กำลังทำงานอยู่ (Buff/Debuff Bar)
function updateActiveItemChips() {
    const chips = window._activeItemChips || [];
    // passive chips (ABSOLUTE_ZONE, RYOIKI_TENKAI) handled by livePassive blocks in render()
    // this handles manually-activated items
    const row = document.getElementById('qsb-buff-row');
    if (!row) return;

    // ลบ chip active เก่าออกก่อน
    row.querySelectorAll('.buff-chip-active-item').forEach(el => el.remove());

    chips.forEach(item => {
        const c = RARITY_COLOR[item.rarity] || RARITY_COLOR.common;
        const chipWrap = document.createElement('div');
        chipWrap.className = 'buff-chip buff-chip-active-item';
        chipWrap.innerHTML = `<div class="reward-chip" style="
            background:${c.bg}; border:1px solid ${c.border}; color:${c.text};
        ">${item.icon} ${item.nameTh} <small style="opacity:0.7;">✅ กำลังทำงาน</small></div>`;
        row.appendChild(chipWrap);
    });
}

// ฟังก์ชันหลักเมื่อกดใช้ไอเทม
function activateGachaItem(slotIndex) {
    // isAnswered เป็นตัวแปร Global จาก app_core.js / app_quiz.js
    if (typeof isAnswered !== 'undefined' && isAnswered) return; 
    
    const loadout = window.currentLoadout;
    if (!loadout || slotIndex >= loadout.length) return;

    const itemId = loadout[slotIndex];
    const item = (typeof getGachaItemById === 'function') ? getGachaItemById(itemId) : null;
    if (!item) return;

    const userId = sessionStorage.getItem('kruHengCurrentUser');
    if (!window.activeItemEffects) window.activeItemEffects = {};

    const usedFlag = item.effect + '_USED';
    const activeFlag = item.effect + '_ACTIVE';
    if (window.activeItemEffects[usedFlag] || window.activeItemEffects[activeFlag]) return;
    if (item.effect === 'KING_ENGINE' && (window.kingEngineCount || 0) >= 4) return;

    const q = window.currentQuestion;
    if (!q) return;

    let modQ = Object.assign({}, q);
    let needsRerender = false;

    // ระบบทำงานตามชนิดของ Effect
    switch (item.effect) {

        case 'THE_PLANET':
            window.activeItemEffects['THE_PLANET_USED'] = true;
            if (typeof leftMs !== 'undefined') leftMs += 120000;
            if (typeof currentQTimeSec !== 'undefined') currentQTimeSec += 120;
            break;

        case 'JINCHURIKI': {
            window.activeItemEffects['JINCHURIKI_USED'] = true;
            window.activeItemEffects['JINCHURIKI_ACTIVE'] = true;
            const correctAns = typeof q.answer === 'object' ? (q.answer.th || q.answer.en || q.answer) : q.answer;
            const correctIdx = (q.options.th || q.options || []).indexOf(correctAns);
            if (correctIdx !== -1) {
                if (typeof q.options === 'object' && !Array.isArray(q.options)) {
                    modQ.options = { th: [q.options.th[correctIdx]], en: [q.options.en[correctIdx]] };
                } else {
                    modQ.options = [q.options[correctIdx]];
                }
            }
            window.currentDisplayQuestion = modQ;
            needsRerender = true;
            break;
        }

        case 'CIEL':
            window.activeItemEffects['CIEL_USED'] = true;
            modQ.question    = { th: '1 + 0 = ?', en: '1 + 0 = ?' };
            modQ.options     = { th: ['1', '0'], en: ['1', '0'] };
            modQ.answer      = { th: '1', en: '1' };
            modQ.explanation = { th: 'เพราะ 1 + 0 = 1 เสมอ', en: 'Because 1 + 0 = 1' };
            window.currentDisplayQuestion = modQ;
            if(typeof getText === 'function' && typeof parseMedia === 'function') {
                document.getElementById('q-text').innerHTML = parseMedia(getText(modQ.question, typeof lang !== 'undefined' ? lang : 'th'));
            }
            needsRerender = true;
            break;

        case 'SIXTH_SENSE': {
            window.activeItemEffects['SIXTH_SENSE_USED'] = true;
            const ca = typeof q.answer === 'object' ? (q.answer.th || q.answer) : q.answer;
            const _trim = (opts) => {
                if (!Array.isArray(opts)) return opts;
                const ci = opts.indexOf(ca);
                const others = opts.filter((_, i) => i !== ci);
                return [opts[ci], ...others.slice(0, 2)].sort(() => Math.random() - 0.5);
            };
            if (Array.isArray(q.options)) {
                modQ.options = _trim(q.options);
            } else if (q.options && q.options.th) {
                const mapping = {};
                q.options.th.forEach((o, i) => mapping[o] = q.options.en?.[i]);
                const kept = _trim(q.options.th);
                modQ.options = { th: kept, en: kept.map(o => mapping[o] || o) };
            }
            window.currentDisplayQuestion = modQ;
            needsRerender = true;
            break;
        }

        case 'DIVINE_GRACE': {
            window.activeItemEffects['DIVINE_GRACE_USED'] = true;
            window.activeItemEffects['DIVINE_GRACE_HINT'] = true;
            const ca2 = typeof q.answer === 'object' ? (q.answer.th || q.answer) : q.answer;
            const _trim2 = (opts) => {
                if (!Array.isArray(opts)) return opts;
                const ci = opts.indexOf(ca2);
                const others = opts.filter((_, i) => i !== ci);
                return [opts[ci], ...others.slice(0, 2)].sort(() => Math.random() - 0.5);
            };
            if (Array.isArray(q.options)) {
                modQ.options = _trim2(q.options);
            } else if (q.options && q.options.th) {
                const mapping2 = {};
                q.options.th.forEach((o, i) => mapping2[o] = q.options.en?.[i]);
                const kept2 = _trim2(q.options.th);
                modQ.options = { th: kept2, en: kept2.map(o => mapping2[o] || o) };
            }
            window.currentDisplayQuestion = modQ;
            needsRerender = true;
            break;
        }

        case 'WITCH_MELODY':
            window.activeItemEffects['WITCH_MELODY_USED'] = true;
            window.activeItemEffects['WITCH_MELODY_AUTOWIN'] = true;
            setTimeout(() => {
                const allBtns = document.querySelectorAll('.opt-card');
                const correctAns = typeof getText === 'function' ? getText(q.answer, typeof lang !== 'undefined' ? lang : 'th') : q.answer;
                const currentOpts = typeof getText === 'function' ? getText(q.options, typeof lang !== 'undefined' ? lang : 'th') : q.options;
                allBtns.forEach(b => {
                    const idx = parseInt(b.getAttribute('data-idx'));
                    if (currentOpts[idx] === correctAns) b.click();
                });
            }, 600);
            break;

        case 'TRUST_ME_BRO': {
            window.activeItemEffects['TRUST_ME_BRO_USED'] = true;
            const ca_tmb = typeof q.answer === 'object' ? (q.answer.th || q.answer) : q.answer;
            const _trimTMB = (opts) => {
                if (!Array.isArray(opts)) return opts;
                const ci = opts.indexOf(ca_tmb);
                const others = opts.filter((_, i) => i !== ci);
                const keepOther = others[Math.floor(Math.random() * others.length)];
                return [opts[ci], keepOther].sort(() => Math.random() - 0.5);
            };
            if (Array.isArray(q.options)) {
                modQ.options = _trimTMB(q.options);
            } else if (q.options && q.options.th) {
                const mapping_tmb = {};
                q.options.th.forEach((o, i) => mapping_tmb[o] = q.options.en?.[i]);
                const kept_tmb = _trimTMB(q.options.th);
                modQ.options = { th: kept_tmb, en: kept_tmb.map(o => mapping_tmb[o] || o) };
            }
            window.currentDisplayQuestion = modQ;
            needsRerender = true;
            window.activeItemEffects['TRUST_ME_BRO_HINT'] = true;
            break;
        }

        case 'MADNESS_COIN':
            window.activeItemEffects['MADNESS_COIN_ACTIVE'] = true;
            break;

        case 'MAPLE_SHIELD':
            window.activeItemEffects['MAPLE_SHIELD_ACTIVE'] = true;
            break;

        case 'KING_ENGINE':
            window.activeItemEffects['KING_ENGINE_ACTIVE'] = true;
            window.kingEngineAttempt = 1; 
            break;

        case 'PHOENIX_HEART':
            window.activeItemEffects['PHOENIX_HEART_ACTIVE'] = true;
            break;
    }

    const persistEffects = ['ABSOLUTE_ZONE', 'RYOIKI_TENKAI', 'KING_ENGINE'];
    if (!persistEffects.includes(item.effect)) {
        window.currentLoadout.splice(slotIndex, 1);
    } else if (item.effect === 'KING_ENGINE') {
        window.kingEngineSlotIndex = slotIndex;
    }

    if (needsRerender && typeof getText === 'function' && typeof parseMedia === 'function') {
        const dq = window.currentDisplayQuestion || modQ;
        const localLang = typeof lang !== 'undefined' ? lang : 'th';
        let opts = getText(dq.options, localLang);
        let optHTML = opts.map((o, idx) =>
            `<button class="opt-card" data-idx="${idx}" onclick="verify(this, ${idx})">${parseMedia(o)}</button>`
        ).sort(() => Math.random() - 0.5).join('');
        document.getElementById('options-box').innerHTML = optHTML;

        if (window.activeItemEffects['DIVINE_GRACE_HINT']) {
            const correctAns = getText(dq.answer, localLang);
            const hintDiv = document.createElement('div');
            hintDiv.id = 'gacha-divine-hint';
            hintDiv.style.cssText = `margin-top:8px; padding:8px 12px;
                background:rgba(255,152,0,0.12); border:1px solid rgba(255,152,0,0.4);
                border-radius:10px; font-size:0.82rem; color:var(--text-color);`;
            hintDiv.innerHTML = `✨ <b>ความเมตตาของครูเฮง:</b> ข้อนี้คำตอบคือ "<b>${correctAns}</b>" ครับ (โอกาสถูก ~40%)`;
            document.getElementById('options-box').after(hintDiv);
        }

        if (window.activeItemEffects['TRUST_ME_BRO_HINT']) {
            const tmbHints = [
                'เชื่อผมเถอะพี่ชาย... ข้อบนครับ 🤙',
                'AI ผมบอกว่าข้อล่างเลย พี่ 🧠 (โอกาสถูก 51%)',
                'ผมรู้สึกแบบนั้นนะพี่ชาย เลือกข้อแรกไปเลย ✨',
                'ข้อหลังฮะ ไม่รู้ทำไม แต่แค่รู้สึก 🤷',
                'เอ้ย... ข้อบนมั้ง? ผมไม่แน่ใจ 55 🤙',
                'AI วิเคราะห์ 0.3 วินาที → ข้อล่างเลยพี่ชาย',
                'เชื่อลางสังหรณ์ผมพี่ ข้อบน! 🔮',
                'ผมเดาเอาแต่... ข้อหลังนะครับ 🤞',
            ];
            const hint = tmbHints[Math.floor(Math.random() * tmbHints.length)];
            const tmbDiv = document.createElement('div');
            tmbDiv.id = 'gacha-tmb-hint';
            tmbDiv.style.cssText = `margin-top:8px; padding:8px 12px;
                background:rgba(174,87,255,0.1); border:1px solid rgba(174,87,255,0.4);
                border-radius:10px; font-size:0.82rem; color:var(--text-color);`;
            tmbDiv.innerHTML = `🤙 <b>เชื่อผมเถอะ พี่ชาย:</b> ${hint}`;
            document.getElementById('options-box').after(tmbDiv);
        }

        if (typeof academicRender === 'function') {
            setTimeout(() => academicRender('quiz-screen'), 10);
        }
    }

    renderQuizLoadoutBar();

    // เพิ่มไอเทมนี้ลง active chip bar (ไม่นับ passive — passive มี chip แยก)
    const passiveEffectsSet = ['ABSOLUTE_ZONE', 'RYOIKI_TENKAI'];
    if (!passiveEffectsSet.includes(item.effect)) {
        if (!window._activeItemChips) window._activeItemChips = [];
        // ไม่เพิ่มซ้ำ
        if (!window._activeItemChips.find(x => x.effect === item.effect)) {
            window._activeItemChips.push(item);
        }
        updateActiveItemChips();
    }

    if (typeof GachaAudio !== 'undefined') GachaAudio.byEffect(item.effect);
    if (typeof showItemActivationToast === 'function') showItemActivationToast(item);
}

console.log("✅ [SUCCESS] app_items.js โหลดเสร็จสมบูรณ์!");
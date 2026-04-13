/* =====================================================================
   🎰 ไฟล์: js/gacha_ui.js
   หน้าที่: UI + Animation + เสียงสังเคราะห์ของระบบกาชาปอง
   ต้องโหลด: gacha.js ก่อนไฟล์นี้เสมอ
   เชื่อมกับ: app.js (verify, stat, leftMs), audio.js (updateVolume)
   ===================================================================== */

console.log("✨ [START] โมดูลเริ่มทำงาน: gacha_ui.js (ระบบหน้าต่างแอนิเมชันกาชา)");

// ============================================================
// 🔊 SECTION 1 — ระบบเสียงสังเคราะห์ (Web Audio API)
//    เมื่อมีไฟล์จริง ให้แทนที่แต่ละฟังก์ชันด้วย:
//    const sfxGachaPull = new Audio('audio/gacha_pull.mp3');
//    sfxGachaPull.play();
// ============================================================

const GachaAudio = (() => {
    // สร้าง AudioContext แบบ lazy (รอให้ผู้ใช้คลิกก่อน — นโยบาย browser)
    let _ctx = null;
    function ctx() {
        if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
        return _ctx;
    }

    /** เล่น tone เดี่ยว */
    function tone(freq, type, startTime, duration, gainVal = 0.3) {
        const ac = ctx();
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(gainVal, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
    }

    /** เล่น sweep (glide) */
    function sweep(freqStart, freqEnd, type, startTime, duration, gainVal = 0.25) {
        const ac = ctx();
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freqStart, startTime);
        osc.frequency.exponentialRampToValueAtTime(freqEnd, startTime + duration);
        gain.gain.setValueAtTime(gainVal, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
    }

    /** โนยส์ (เสียงลม/ฝน) */
    function noise(startTime, duration, gainVal = 0.08) {
        const ac = ctx();
        const bufferSize = ac.sampleRate * duration;
        const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const src = ac.createBufferSource();
        src.buffer = buffer;
        const gain = ac.createGain();
        src.connect(gain);
        gain.connect(ac.destination);
        gain.gain.setValueAtTime(gainVal, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        src.start(startTime);
    }

    return {
        // ─────────────────────────────────────────────
        // 🎰 เสียงหมุนกาชา (กด pull)
        // แทนที่ด้วย: new Audio('audio/gacha_pull.mp3').play()
        // ─────────────────────────────────────────────
        pull() {
            const ac = ctx(); const t = ac.currentTime;
            // เสียงกลอง + ลม
            noise(t, 0.3, 0.12);
            sweep(200, 80, 'sawtooth', t, 0.25, 0.2);
            // เสียง spin ขึ้น-ลง
            for (let i = 0; i < 6; i++) {
                sweep(300 + i * 80, 500 + i * 60, 'sine', t + i * 0.07, 0.12, 0.15);
            }
        },

        // ─────────────────────────────────────────────
        // 📦 เสียงเปิดแคปซูล (ก่อนโชว์ผล)
        // แทนที่ด้วย: new Audio('audio/gacha_open.mp3').play()
        // ─────────────────────────────────────────────
        open() {
            const ac = ctx(); const t = ac.currentTime;
            noise(t, 0.15, 0.15);
            sweep(150, 400, 'sine', t + 0.1, 0.3, 0.2);
            tone(800, 'sine', t + 0.35, 0.15, 0.18);
        },

        // ─────────────────────────────────────────────
        // 🟢 Common (เสียงเรียบๆ)
        // แทนที่ด้วย: new Audio('audio/gacha_common.mp3').play()
        // ─────────────────────────────────────────────
        common() {
            const ac = ctx(); const t = ac.currentTime;
            tone(440, 'sine', t, 0.15, 0.2);
            tone(550, 'sine', t + 0.15, 0.15, 0.15);
        },

        // ─────────────────────────────────────────────
        // 🔵 Rare (เสียงสาดน้ำ + bell)
        // แทนที่ด้วย: new Audio('audio/gacha_rare.mp3').play()
        // ─────────────────────────────────────────────
        rare() {
            const ac = ctx(); const t = ac.currentTime;
            sweep(300, 900, 'sine', t, 0.35, 0.2);
            noise(t + 0.1, 0.2, 0.1);
            tone(1200, 'sine', t + 0.3, 0.4, 0.2);
            tone(1500, 'sine', t + 0.5, 0.3, 0.15);
        },

        // ─────────────────────────────────────────────
        // 🟠 Epic (เสียงแฟนฟาร์)
        // แทนที่ด้วย: new Audio('audio/gacha_epic.mp3').play()
        // ─────────────────────────────────────────────
        epic() {
            const ac = ctx(); const t = ac.currentTime;
            const melody = [523, 659, 784, 1047];
            melody.forEach((f, i) => tone(f, 'square', t + i * 0.12, 0.2, 0.18));
            sweep(200, 600, 'sawtooth', t, 0.5, 0.12);
            noise(t, 0.3, 0.08);
            tone(1047, 'sine', t + 0.55, 0.5, 0.2);
        },

        // ─────────────────────────────────────────────
        // 🟣 Mythic (เสียงฟ้าผ่า + choir)
        // แทนที่ด้วย: new Audio('audio/gacha_mythic.mp3').play()
        // ─────────────────────────────────────────────
        mythic() {
            const ac = ctx(); const t = ac.currentTime;
            noise(t, 0.5, 0.2);
            sweep(100, 2000, 'sawtooth', t, 0.4, 0.2);
            sweep(2000, 100, 'sawtooth', t + 0.4, 0.3, 0.15);
            const choir = [261, 329, 392, 523, 659];
            choir.forEach((f, i) => {
                tone(f, 'sine', t + 0.5 + i * 0.06, 0.8, 0.12);
            });
            tone(1046, 'triangle', t + 0.9, 1.0, 0.15);
        },

        // ─────────────────────────────────────────────
        // 🔴 Godlike (เสียงระเบิด + orchestra)
        // แทนที่ด้วย: new Audio('audio/gacha_godlike.mp3').play()
        // ─────────────────────────────────────────────
        godlike() {
            const ac = ctx(); const t = ac.currentTime;
            // ระเบิด
            noise(t, 0.8, 0.3);
            sweep(50, 800, 'sawtooth', t, 0.6, 0.25);
            // fanfare
            const fanfare = [262, 330, 392, 523, 659, 784, 1046];
            fanfare.forEach((f, i) => {
                tone(f, 'square', t + 0.4 + i * 0.1, 0.35, 0.15);
                tone(f * 2, 'sine',  t + 0.4 + i * 0.1, 0.25, 0.08);
            });
            sweep(1046, 2093, 'sine', t + 1.2, 0.8, 0.2);
        },

        // ─────────────────────────────────────────────
        // ✨ เสียงใช้ไอเทม
        // แทนที่ด้วย: new Audio('audio/gacha_use.mp3').play()
        // ─────────────────────────────────────────────
        useItem() {
            const ac = ctx(); const t = ac.currentTime;
            sweep(600, 1200, 'sine', t, 0.2, 0.2);
            tone(1200, 'sine', t + 0.2, 0.15, 0.15);
            sweep(1200, 2400, 'sine', t + 0.3, 0.25, 0.12);
        },

        // ─────────────────────────────────────────────
        // ❌ เสียงเหรียญไม่พอ
        // แทนที่ด้วย: new Audio('audio/gacha_broke.mp3').play()
        // ─────────────────────────────────────────────
        broke() {
            const ac = ctx(); const t = ac.currentTime;
            sweep(400, 150, 'sawtooth', t, 0.3, 0.2);
            tone(120, 'square', t + 0.3, 0.2, 0.15);
        },

        // ─────────────────────────────────────────────
        // 🛡️ เสียง effect เฉพาะไอเทม
        // แทนที่ด้วย: new Audio('audio/sfx_shield.mp3').play() ฯลฯ
        // ─────────────────────────────────────────────
        shield()    { // Maple Shield — เสียงกันพลัง
            const ac = ctx(); const t = ac.currentTime;
            sweep(800, 200, 'sine', t, 0.4, 0.25);
            noise(t + 0.1, 0.2, 0.06);
        },
        stopTime()  { // The Planet — เสียงเวลาหยุด
            const ac = ctx(); const t = ac.currentTime;
            sweep(2000, 200, 'sine', t, 0.6, 0.2);
            noise(t, 0.6, 0.05);
            tone(200, 'sine', t + 0.6, 1.0, 0.1);
        },
        phoenix()   { // Phoenix Heart — เสียงฟินิกส์
            const ac = ctx(); const t = ac.currentTime;
            sweep(300, 1200, 'sawtooth', t, 0.5, 0.18);
            tone(1568, 'sine', t + 0.5, 0.4, 0.2);
        },
        divine()    { // Divine Grace — เสียงเทพ
            const ac = ctx(); const t = ac.currentTime;
            [523, 659, 784].forEach((f, i) => tone(f, 'sine', t + i * 0.15, 0.4, 0.15));
        },
        witch()     { // Witch Melody — เสียงมนต์
            const ac = ctx(); const t = ac.currentTime;
            sweep(100, 1000, 'sine', t, 0.3, 0.2);
            sweep(1000, 2000, 'triangle', t + 0.3, 0.3, 0.15);
            noise(t + 0.5, 0.2, 0.1);
        },
        zone()      { // Absolute Zone — เสียง buff
            const ac = ctx(); const t = ac.currentTime;
            [261, 330, 392].forEach((f, i) => sweep(f, f * 2, 'sine', t + i * 0.1, 0.5, 0.12));
        },
        jinchuriki(){ // Jinchuriki — เสียงพลังสถิต
            const ac = ctx(); const t = ac.currentTime;
            noise(t, 0.5, 0.25);
            sweep(100, 3000, 'sawtooth', t + 0.1, 0.8, 0.2);
            tone(880, 'sine', t + 0.9, 0.6, 0.25);
        },
        kingEngine(){ // King Engine — เสียงเครื่องจักร
            const ac = ctx(); const t = ac.currentTime;
            for (let i = 0; i < 4; i++) sweep(200 + i*100, 400 + i*80, 'sawtooth', t + i*0.12, 0.15, 0.15);
        },
        ciel()      { // Ciel — เสียงดนตรีประหลาด
            const ac = ctx(); const t = ac.currentTime;
            [880, 440, 880, 660].forEach((f, i) => tone(f, 'triangle', t + i * 0.1, 0.15, 0.15));
        },
        sixthSense(){ // 6th Sense — เสียงสัมผัส
            const ac = ctx(); const t = ac.currentTime;
            sweep(500, 2000, 'sine', t, 0.4, 0.15);
            noise(t + 0.2, 0.2, 0.05);
        },

        // ─────────────────────────────────────────────
        // เล่นเสียงตาม rarity (เรียกหลัง reveal)
        // ─────────────────────────────────────────────
        byRarity(rarity) {
            const map = { common: 'common', rare: 'rare', epic: 'epic', mythic: 'mythic', godlike: 'godlike' };
            if (map[rarity] && this[map[rarity]]) this[map[rarity]]();
        },

        // เล่น effect เสียงตาม effect code ของไอเทม
        byEffect(effectCode) {
            const map = {
                MAPLE_SHIELD:   () => this.shield(),
                THE_PLANET:     () => this.stopTime(),
                PHOENIX_HEART:  () => this.phoenix(),
                DIVINE_GRACE:   () => this.divine(),
                WITCH_MELODY:   () => this.witch(),
                ABSOLUTE_ZONE:  () => this.zone(),
                RYOIKI_TENKAI:  () => this.zone(),
                JINCHURIKI:     () => this.jinchuriki(),
                KING_ENGINE:    () => this.kingEngine(),
                CIEL:           () => this.ciel(),
                SIXTH_SENSE:    () => this.sixthSense(),
                MADNESS_COIN:   () => this.useItem(),
            };
            if (map[effectCode]) map[effectCode]();
        }
    };
})();


// ============================================================
// 🎨 SECTION 2 — CSS แบบ inject (ไม่ต้องแก้ style_clean.css)
// ============================================================
(function injectGachaCSS() {
    const style = document.createElement('style');
    style.id = 'gacha-styles';
    style.textContent = `

/* ── Rarity color tokens ── */
.gacha-common  { --rc: #9e9e9e; --rg: rgba(158,158,158,0.35); }
.gacha-rare    { --rc: #00b4d8; --rg: rgba(0,180,216,0.45); }
.gacha-epic    { --rc: #ff9800; --rg: rgba(255,152,0,0.5); }
.gacha-mythic  { --rc: #ae57ff; --rg: rgba(174,87,255,0.55); }
.gacha-godlike { --rc: #ff0055; --rg: rgba(255,0,85,0.65); }

/* ── Overlay พื้นหลัง modal ── */
#gacha-overlay {
    position: fixed; inset: 0; z-index: 9000;
    background: rgba(0,0,0,0.85);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.25s ease;
    backdrop-filter: blur(6px);
}

/* ── กล่อง modal หลัก ── */
#gacha-modal {
    background: var(--card-bg);
    border-radius: 24px;
    width: min(96vw, 560px);
    max-height: 92vh;
    overflow-y: auto;
    padding: 28px 24px 24px;
    position: relative;
    border: 2px solid var(--secondary);
    box-shadow: 0 0 40px rgba(0,240,255,0.2);
    animation: dropDown 0.3s cubic-bezier(.34,1.56,.64,1);
}

/* ── ปุ่มปิด ── */
#gacha-close-btn {
    position: absolute; top: 14px; right: 18px;
    background: none; border: none;
    font-size: 1.6rem; color: var(--text-color);
    cursor: pointer; line-height: 1; opacity: 0.6;
    transition: opacity 0.2s, transform 0.2s;
}
#gacha-close-btn:hover { opacity: 1; transform: rotate(90deg) scale(1.2); }

/* ── แท็บนำทาง ── */
.gacha-tabs {
    display: flex; gap: 6px; margin-bottom: 20px;
}
.gacha-tab {
    flex: 1; padding: 9px 4px;
    border: 2px solid var(--secondary);
    border-radius: 12px;
    background: transparent;
    color: var(--text-color);
    font-size: 0.82rem; font-weight: bold;
    cursor: pointer; transition: 0.2s;
}
.gacha-tab.active {
    background: var(--secondary);
    color: #fff;
}
.gacha-tab-panel { display: none; }
.gacha-tab-panel.active { display: block; }

/* ── ปุ่มดึง ── */
.gacha-pull-row {
    display: flex; gap: 8px; margin-top: 10px;
}
.gacha-pull-btn {
    flex: 1; padding: 11px 8px;
    border: none; border-radius: 14px;
    font-size: 0.85rem; font-weight: bold;
    cursor: pointer;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    color: #fff;
    box-shadow: 0 4px 16px rgba(255,0,127,0.3);
    transition: transform 0.15s, box-shadow 0.15s;
}
.gacha-pull-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,0,127,0.4); }
.gacha-pull-btn:active { transform: scale(0.97); }
.gacha-pull-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
.gacha-pull-btn.ten {
    flex: 2;
    font-size: 0.95rem;
    padding: 11px 12px;
    background: linear-gradient(135deg, #ff9800, #ff0055);
    box-shadow: 0 4px 16px rgba(255,152,0,0.35);
}
@keyframes boostPulse {
    0%,100% { box-shadow: 0 4px 20px rgba(174,87,255,0.5); }
    50% { box-shadow: 0 4px 32px rgba(174,87,255,1), 0 0 24px rgba(174,87,255,0.6); }
}
.gacha-pull-btn.boosted {
    background: linear-gradient(135deg, #ae57ff, #ff0055) !important;
    animation: boostPulse 1.4s ease-in-out infinite;
}
.gacha-boostable-grid {
    display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;
}
.gacha-boostable-card {
    display: flex; flex-direction: column; align-items: center;
    padding: 5px 7px; border-radius: 10px;
    border: 1.5px solid var(--rc);
    font-size: 0.7rem; cursor: pointer; min-width: 52px;
    transition: transform 0.1s;
}
.gacha-boostable-card:hover { transform: scale(1.06); }

/* ── แสดงยอดเหรียญ ── */
.gacha-coins-display {
    text-align: center;
    font-size: 1rem; font-weight: bold;
    color: var(--text-color);
    margin-bottom: 14px;
}
.gacha-coins-display span { color: #ff9800; }

/* ── Pity counter ── */
.gacha-pity-bar {
    width: 100%; height: 6px;
    background: rgba(128,128,128,0.2);
    border-radius: 3px; margin-bottom: 6px;
    overflow: hidden;
}
.gacha-pity-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--secondary), var(--primary));
    border-radius: 3px;
    transition: width 0.5s ease;
}
.gacha-pity-text {
    text-align: center; font-size: 0.72rem;
    color: var(--text-muted); margin-bottom: 16px;
}

/* ── Stage แสดงผล pull ── */
#gacha-stage {
    min-height: 200px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    margin: 16px 0;
}

/* ── แคปซูล ── */
.gacha-capsule {
    width: 120px; height: 120px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 3.5rem;
    background: conic-gradient(var(--secondary) 0deg, var(--accent) 180deg, var(--primary) 360deg);
    box-shadow: 0 0 30px rgba(0,240,255,0.4);
    cursor: pointer;
    animation: gachaSpin 1.2s linear infinite;
    transition: transform 0.2s;
}
@keyframes gachaSpin {
    from { transform: rotate(0deg) scale(1)     translateX(0); }
    to   { transform: rotate(360deg) scale(1)   translateX(0); }
}
@keyframes gachaSpinPulse {
    0%   { transform: rotate(0deg)   scale(1.00) translate(0px,   0px); }
    10%  { transform: rotate(36deg)  scale(1.06) translate(-2px, -1px); }
    20%  { transform: rotate(72deg)  scale(1.11) translate(2px,   1px); }
    30%  { transform: rotate(108deg) scale(1.14) translate(-2px,  2px); }
    40%  { transform: rotate(144deg) scale(1.16) translate(2px,  -1px); }
    50%  { transform: rotate(180deg) scale(1.18) translate(-1px,  2px); }
    60%  { transform: rotate(216deg) scale(1.16) translate(2px,  -2px); }
    70%  { transform: rotate(252deg) scale(1.14) translate(-2px,  1px); }
    80%  { transform: rotate(288deg) scale(1.11) translate(1px,  -2px); }
    90%  { transform: rotate(324deg) scale(1.06) translate(-1px,  2px); }
    100% { transform: rotate(360deg) scale(1.00) translate(0px,   0px); }
}
.gacha-capsule.pulling {
    animation: gachaSpinPulse 0.9s ease-in-out infinite !important;
    box-shadow: 0 0 50px rgba(0,240,255,0.7), 0 0 20px rgba(174,87,255,0.5);
}
.gacha-capsule.reveal {
    animation: gachaReveal 0.6s cubic-bezier(.34,1.56,.64,1) forwards;
}
@keyframes gachaReveal {
    0%   { transform: scale(0.4) rotate(-30deg); opacity: 0; }
    60%  { transform: scale(1.15) rotate(8deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

/* ── การ์ดไอเทม ── */
.gacha-item-card {
    border-radius: 18px;
    padding: 20px 16px 16px;
    text-align: center;
    border: 2px solid var(--rc, #9e9e9e);
    background: radial-gradient(ellipse at top, var(--rg, rgba(158,158,158,0.2)), transparent 70%);
    box-shadow: 0 0 24px var(--rg, rgba(158,158,158,0.2));
    animation: gachaReveal 0.5s cubic-bezier(.34,1.56,.64,1) forwards;
    width: 100%;
    max-width: 300px;
}
.gacha-item-icon { font-size: 3.8rem; margin-bottom: 6px; display: block; }
.gacha-item-rarity {
    display: inline-block;
    padding: 2px 12px; border-radius: 20px;
    font-size: 0.72rem; font-weight: bold;
    background: var(--rc, #9e9e9e); color: #fff;
    margin-bottom: 8px;
    letter-spacing: 0.08em;
}
.gacha-item-name-th {
    font-size: 1.1rem; font-weight: bold;
    color: var(--text-color); margin-bottom: 2px;
}
.gacha-item-name-en {
    font-size: 0.78rem; color: var(--text-muted); margin-bottom: 10px;
}
.gacha-item-desc {
    font-size: 0.82rem; color: var(--text-color);
    line-height: 1.5;
    background: rgba(128,128,128,0.08);
    border-radius: 10px; padding: 8px 10px;
}

/* ── แฟลชแสง rarity ── */
.gacha-flash {
    position: fixed; inset: 0; z-index: 9500;
    pointer-events: none;
    animation: gachaFlash 1.6s ease-out forwards;
}
@keyframes gachaFlash {
    0%   { opacity: 0; }
    15%  { opacity: 1; }
    100% { opacity: 0; }
}

/* ── กริด 10 pull ── */
.gacha-ten-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    margin: 10px 0;
}
.gacha-ten-card {
    border-radius: 12px;
    padding: 10px 4px 8px;
    text-align: center;
    border: 1.5px solid var(--rc, #9e9e9e);
    background: radial-gradient(ellipse at top, var(--rg, rgba(158,158,158,0.15)), transparent);
    animation: gachaReveal 0.4s cubic-bezier(.34,1.56,.64,1) both;
}
.gacha-ten-card .icon { font-size: 1.8rem; }
.gacha-ten-card .name {
    font-size: 0.6rem; color: var(--text-color);
    margin-top: 4px; line-height: 1.2;
    word-break: break-word;
}
.gacha-ten-card .rarity-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--rc, #9e9e9e);
    margin: 4px auto 0;
}

/* ── Inventory grid ── */
.gacha-inv-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
    max-height: 380px;
    overflow-y: auto;
    padding: 2px;
}
.gacha-inv-card {
    border-radius: 14px;
    padding: 12px 8px 10px;
    text-align: center;
    border: 1.5px solid var(--rc, #9e9e9e);
    background: radial-gradient(ellipse at top, var(--rg, rgba(158,158,158,0.15)), transparent);
    cursor: pointer;
    position: relative;
    transition: transform 0.15s, box-shadow 0.15s;
}
.gacha-inv-card:hover { transform: translateY(-3px); box-shadow: 0 6px 16px var(--rg, rgba(0,0,0,0.2)); }
.gacha-inv-card .qty-badge {
    position: absolute; top: 6px; right: 8px;
    background: var(--primary); color: #fff;
    border-radius: 10px; padding: 1px 6px;
    font-size: 0.68rem; font-weight: bold;
}
.gacha-inv-card .icon { font-size: 2.2rem; }
.gacha-inv-card .name { font-size: 0.7rem; margin-top: 4px; color: var(--text-color); line-height: 1.3; }

/* ── Loadout bar ── */
.gacha-loadout {
    display: flex; gap: 8px; flex-wrap: wrap;
    background: rgba(128,128,128,0.07);
    border-radius: 12px; padding: 10px;
    margin-bottom: 14px; min-height: 58px;
    align-items: center;
}
.gacha-loadout-slot {
    width: 44px; height: 44px;
    border-radius: 10px;
    border: 2px dashed var(--secondary);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem;
    cursor: pointer; position: relative;
    transition: 0.2s;
}
.gacha-loadout-slot.filled {
    border-style: solid;
    border-color: var(--rc, var(--secondary));
    background: radial-gradient(ellipse at top, var(--rg, transparent), transparent);
}
.gacha-loadout-slot .rm-x {
    position: absolute; top: -6px; right: -6px;
    background: var(--danger); color: #fff;
    border-radius: 50%; width: 16px; height: 16px;
    font-size: 0.6rem; display: flex; align-items: center; justify-content: center;
    cursor: pointer;
}

/* ── tooltip ── */
.gacha-tooltip {
    position: absolute; z-index: 9900;
    background: var(--card-bg);
    border: 1.5px solid var(--secondary);
    border-radius: 12px;
    padding: 10px 12px;
    width: 220px;
    font-size: 0.78rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    pointer-events: none;
    animation: dropDown 0.15s ease;
}

/* ── Particle container ── */
#gacha-particles {
    position: fixed; inset: 0; z-index: 8999;
    pointer-events: none; overflow: hidden;
}
.gacha-particle {
    position: absolute;
    border-radius: 50%;
    animation: particleFly var(--dur, 1s) ease-out forwards;
}
@keyframes particleFly {
    0%   { transform: translate(0,0) scale(1); opacity: 1; }
    100% { transform: translate(var(--tx,0), var(--ty,-200px)) scale(0.2); opacity: 0; }
}

/* ── Responsive ── */
@media (max-width: 480px) {
    #gacha-modal { padding: 20px 14px 18px; }
    .gacha-ten-grid { grid-template-columns: repeat(5, 1fr); gap: 5px; }
    .gacha-ten-card .icon { font-size: 1.4rem; }
    .gacha-inv-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
}
    `;
    document.head.appendChild(style);
})();


// ============================================================
// 🌟 SECTION 3 — Particle System
// ============================================================
function spawnGachaParticles(color, count = 30) {
    let container = document.getElementById('gacha-particles');
    if (!container) {
        container = document.createElement('div');
        container.id = 'gacha-particles';
        document.body.appendChild(container);
    }

    const colors = color
        ? [color]
        : ['#ff007f','#00f0ff','#7000ff','#ff9800','#00ff88','#ffffff'];

    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'gacha-particle';
        const size = 6 + Math.random() * 10;
        const tx = (Math.random() - 0.5) * window.innerWidth * 0.9;
        const ty = -(100 + Math.random() * (window.innerHeight * 0.8));
        const dur = 0.8 + Math.random() * 1.0;
        el.style.cssText = `
            width:${size}px; height:${size}px;
            left:${Math.random() * 100}%;
            top:${40 + Math.random() * 30}%;
            background:${colors[Math.floor(Math.random() * colors.length)]};
            --tx:${tx}px; --ty:${ty}px; --dur:${dur}s;
        `;
        container.appendChild(el);
        setTimeout(() => el.remove(), dur * 1000 + 100);
    }
}

function flashScreen(color) {
    const el = document.createElement('div');
    el.className = 'gacha-flash';
    el.style.background = color;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1700);
}


// ============================================================
// 🎴 SECTION 4 — Helper: สร้าง CSS class และ config จาก rarity
// ============================================================
const RARITY_STYLE = {
    common:  { cls: 'gacha-common',  flash: 'rgba(200,200,200,0.35)', particles: 15, label: '● Common'  },
    rare:    { cls: 'gacha-rare',    flash: 'rgba(0,180,216,0.45)',    particles: 25, label: '▲ Rare'    },
    epic:    { cls: 'gacha-epic',    flash: 'rgba(255,152,0,0.5)',     particles: 35, label: '◆ Epic'    },
    mythic:  { cls: 'gacha-mythic',  flash: 'rgba(174,87,255,0.55)',   particles: 50, label: '★ Mythic'  },
    godlike: { cls: 'gacha-godlike', flash: 'rgba(255,0,85,0.65)',     particles: 80, label: '✦ Godlike' },
};


// ============================================================
// 🖼️ SECTION 5 — สร้างการ์ดไอเทมเดี่ยว (HTML string)
// ============================================================
function buildItemCardHTML(item, extraClass = '') {
    const rs = RARITY_STYLE[item.rarity] || RARITY_STYLE.common;
    return `
        <div class="gacha-item-card ${rs.cls} ${extraClass}">
            <span class="gacha-item-icon">${item.icon}</span>
            <span class="gacha-item-rarity">${rs.label}</span>
            <div class="gacha-item-name-th">${item.nameTh}</div>
            <div class="gacha-item-name-en">${item.nameEn}</div>
            <div class="gacha-item-desc">${item.description}</div>
        </div>`;
}

function buildTenCardHTML(item, delay = 0) {
    const rs = RARITY_STYLE[item.rarity] || RARITY_STYLE.common;
    return `
        <div class="gacha-ten-card ${rs.cls}" style="animation-delay:${delay}s"
             title="${item.nameTh} — ${item.description}">
            <div class="icon">${item.icon}</div>
            <div class="name">${item.nameTh}</div>
            <div class="rarity-dot"></div>
        </div>`;
}


// ============================================================
// 🎰 SECTION 6 — Modal หลัก
// ============================================================
let _gachaCurrentTab = 'pull';

function openGachaModal() {
    if (document.getElementById('gacha-overlay')) return;

    const userId = sessionStorage.getItem('kruHengCurrentUser');
    if (!userId) return alert('กรุณาเข้าสู่ระบบก่อนครับ');

    const coins    = gachaGetCoins(userId);
    const pityData = loadPityCounter(userId);
    const pityPct  = Math.min((pityData.count / PITY_THRESHOLDS.rare) * 100, 100);

    const overlay = document.createElement('div');
    overlay.id = 'gacha-overlay';
    overlay.innerHTML = `
        <div id="gacha-modal">
            <button id="gacha-close-btn" onclick="closeGachaModal()">✕</button>

            <h2 style="text-align:center; margin:0 0 16px; color:var(--secondary); font-size:1.3rem;">
                🎰 กาชาปอง
            </h2>

            <!-- แท็บ -->
            <div class="gacha-tabs">
                <button class="gacha-tab active" onclick="gachaTab('pull',this)">🎰 สุ่ม</button>
                <button class="gacha-tab" onclick="gachaTab('items',this)">📖 ไอเทม</button>
            </div>

            <!-- ── แท็บ: สุ่ม ── -->
            <div id="gtab-pull" class="gacha-tab-panel active">
                <div class="gacha-coins-display">
                    💰 เหรียญคงเหลือ: <span id="gacha-coin-show">${coins.toLocaleString()}</span>
                </div>

                <!-- Pity bar -->
                <div class="gacha-pity-bar">
                    <div class="gacha-pity-fill" id="gacha-pity-fill" style="width:${pityPct}%"></div>
                </div>
                <div class="gacha-pity-text" id="gacha-pity-text">
                    Pity: ${pityData.count} / ${PITY_THRESHOLDS.mythic} (การันตี Mythic+ ที่ ${PITY_THRESHOLDS.mythic} สุ่ม)
                </div>

                <!-- Booster section -->
                <div style="margin:10px 0 4px;">
                    <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:4px;">
                        🚀 บูสเตอร์ (สูงสุด 5 ช่อง) — Common <b>+2%</b> / Rare <b>+3%</b> ต่อชิ้น
                        <span style="color:#ae57ff; font-size:0.7rem;">(เมื่อใส่บูสเตอร์จะสุ่มได้แค่ 1 ครั้ง)</span>
                    </div>
                    <div id="gacha-booster-slots" style="display:flex; gap:6px; flex-wrap:wrap;"></div>
                </div>

                <!-- Boostable items from inventory -->
                <div style="font-size:0.72rem; color:var(--text-muted); margin-top:6px;">กดไอเทมด้านล่างเพื่อเพิ่มบูสเตอร์:</div>
                <div class="gacha-boostable-grid" id="gacha-boostable-items"></div>

                <!-- Stage แสดงผล -->
                <div id="gacha-stage">
                    <div style="text-align:center; color:var(--text-muted); font-size:0.88rem; padding:30px 0;">
                        🎴 กดสุ่มเพื่อรับไอเทม
                    </div>
                </div>

                <!-- ปุ่ม (แถวเดียว, 10-ใหญ่กว่า) -->
                <div class="gacha-pull-row">
                    <button class="gacha-pull-btn" id="gacha-btn-1" onclick="gachaDoPull(1)">
                        🎰 สุ่ม 1<br><span style="font-size:0.75rem;">(${GACHA_COST.single.toLocaleString()} 💰)</span>
                    </button>
                    <button class="gacha-pull-btn ten" id="gacha-btn-10" onclick="gachaDoPull(10)">
                        🎰✨ สุ่ม 10 ครั้ง<br><span style="font-size:0.8rem;">(${GACHA_COST.ten.toLocaleString()} 💰)</span>
                    </button>
                </div>
            </div>

            <!-- ── แท็บ: ดูไอเทมทั้งหมด ── -->
            <div id="gtab-items" class="gacha-tab-panel">
                <div style="display:flex; flex-direction:column; gap:10px;" id="gacha-items-list"></div>
            </div>
        </div>
    `;

    overlay.addEventListener('click', e => { if (e.target === overlay) closeGachaModal(); });
    document.body.appendChild(overlay);

    // render เนื้อหาเริ่มต้น
    renderGachaItemList();
    updateGachaPityUI();
    renderBoosterSlots(); // เรียก renderBoostableItems ด้วยตัวเอง
}

function closeGachaModal() {
    const overlay = document.getElementById('gacha-overlay');
    if (overlay) overlay.remove();
}

// ============================================================
// 🎒 คลังไอเทม — popup แยกจาก gacha modal
// ============================================================
function openInventoryModal() {
    if (document.getElementById('inv-overlay')) return;
    const userId = sessionStorage.getItem('kruHengCurrentUser');
    if (!userId) return alert('กรุณาเข้าสู่ระบบก่อนครับ');

    const overlay = document.createElement('div');
    overlay.id = 'inv-overlay';
    overlay.style.cssText = `
        position:fixed; inset:0; z-index:9000;
        background:rgba(0,0,0,0.85);
        display:flex; align-items:center; justify-content:center;
        backdrop-filter:blur(6px);
        animation:fadeIn 0.25s ease;
    `;
    overlay.innerHTML = `
        <div id="inv-modal" style="
            background:var(--card-bg);
            border-radius:24px;
            width:min(96vw,560px);
            max-height:92vh;
            overflow-y:auto;
            padding:28px 24px 24px;
            position:relative;
            border:2px solid var(--secondary);
            box-shadow:0 0 40px rgba(0,240,255,0.2);
            animation:dropDown 0.3s cubic-bezier(.34,1.56,.64,1);
        ">
            <button onclick="closeInventoryModal()" style="
                position:absolute; top:14px; right:14px;
                background:rgba(128,128,128,0.2); border:none;
                border-radius:50%; width:32px; height:32px;
                font-size:1rem; cursor:pointer; color:var(--text-color);
            ">✕</button>

            <h2 style="text-align:center; margin:0 0 16px; color:var(--secondary); font-size:1.3rem;">
                🎒 คลังไอเทม
            </h2>

            <p style="font-size:0.82rem; color:var(--text-muted); margin:0 0 10px;">
                กดไอเทมเพื่อ <b>พกเข้าสอบ</b> (สูงสุด 5 ชิ้น/รอบ)
            </p>

            <!-- Loadout slots -->
            <div class="gacha-loadout" id="gacha-loadout"></div>

            <!-- กริดของคลัง -->
            <div class="gacha-inv-grid" id="gacha-inv-grid"></div>
        </div>
    `;

    overlay.addEventListener('click', e => { if (e.target === overlay) closeInventoryModal(); });
    document.body.appendChild(overlay);
    renderGachaInventory();
}

function closeInventoryModal() {
    const overlay = document.getElementById('inv-overlay');
    if (overlay) overlay.remove();
}

// เปลี่ยนแท็บ
function gachaTab(name, btn) {
    document.querySelectorAll('.gacha-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.gacha-tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(`gtab-${name}`);
    if (panel) panel.classList.add('active');
    _gachaCurrentTab = name;
}


// ============================================================
// 🎰 SECTION 7 — ดึงกาชา + Animation
// ============================================================
async function gachaDoPull(count) {
    const userId = sessionStorage.getItem('kruHengCurrentUser');
    if (!userId) return;

    // ปิดปุ่มชั่วคราว
    const btn1  = document.getElementById('gacha-btn-1');
    const btn10 = document.getElementById('gacha-btn-10');
    if (btn1)  btn1.disabled  = true;
    if (btn10) btn10.disabled = true;

    // ── เสียง pull ──
    GachaAudio.pull();

    // ── แสดง animation หมุน ──
    const stage = document.getElementById('gacha-stage');
    if (stage) {
        stage.innerHTML = `
            <div class="gacha-capsule pulling">🎰</div>
            <div style="margin-top:14px; color:var(--text-muted); font-size:0.85rem;">กำลังสุ่ม...</div>
        `;
    }

    // รอ 1.2 วิ ให้ animation หมุนเล่น
    await sleep(1200);

    // ── เสียงเปิด ──
    GachaAudio.open();
    await sleep(400);

    // ── ดึงจริง ──
    let result;
    if (count === 1) {
        result = gachaAction_Single(userId);
    } else {
        result = gachaAction_Ten(userId);
    }

    if (!result.success) {
        GachaAudio.broke();
        if (stage) stage.innerHTML = `
            <div style="text-align:center; padding:24px;">
                <div style="font-size:2.5rem;">😭</div>
                <div style="color:var(--danger); font-weight:bold; margin-top:8px;">${result.message}</div>
            </div>`;
        if (btn1)  btn1.disabled  = false;
        if (btn10) btn10.disabled = false;
        return;
    }


    // ── อัปเดตยอดเหรียญ ──
    const coinEl = document.getElementById('gacha-coin-show');
    if (coinEl) coinEl.textContent = result.remainingCoins.toLocaleString();
    // อัปเดต live HUD ด้วย
    const hudCoin = document.getElementById('ui-coin-val');
    if (hudCoin) hudCoin.textContent = result.remainingCoins.toLocaleString();

    // ── แสดงผล ──
    if (count === 1) {
        await revealSingle(result.item, stage);
    } else {
        await revealTen(result.items, stage);
    }

    updateGachaPityUI();
    renderGachaInventory();
    renderBoosterSlots(); // อัปเดต boostable items และปุ่มหลัง pull

    if (btn1)  btn1.disabled  = false;
    // btn10 จะ enable ก็ต่อเมื่อไม่มี booster เท่านั้น
    if (btn10 && (window.gachaBoosters || []).length === 0) btn10.disabled = false;
}

// เปิดเผยไอเทมเดี่ยว
async function revealSingle(item, stage) {
    const rs = RARITY_STYLE[item.rarity] || RARITY_STYLE.common;

    // flash + particles
    flashScreen(rs.flash);
    spawnGachaParticles(null, rs.particles);
    GachaAudio.byRarity(item.rarity);

    await sleep(100);

    if (stage) {
        stage.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; gap:12px; width:100%;">
                ${buildItemCardHTML(item)}
                <div style="font-size:0.82rem; color:var(--success); font-weight:bold;">
                    ✅ เพิ่มลงคลังแล้ว!
                </div>
            </div>`;
    }
}

// เปิดเผย 10 ไอเทม
async function revealTen(items, stage) {
    // หา rarity สูงสุด
    const rarityOrder = ['common','rare','epic','mythic','godlike'];
    let topRarity = 'common';
    items.forEach(it => {
        if (rarityOrder.indexOf(it.rarity) > rarityOrder.indexOf(topRarity)) topRarity = it.rarity;
    });

    const rs = RARITY_STYLE[topRarity] || RARITY_STYLE.common;
    flashScreen(rs.flash);
    spawnGachaParticles(null, rs.particles);
    GachaAudio.byRarity(topRarity);

    if (stage) {
        const cardsHTML = items.map((it, i) => buildTenCardHTML(it, i * 0.06)).join('');
        stage.innerHTML = `
            <div style="width:100%;">
                <div class="gacha-ten-grid">${cardsHTML}</div>
                <div style="text-align:center; font-size:0.78rem; color:var(--text-muted); margin-top:8px;">
                    กดที่การ์ดเพื่อดูรายละเอียด
                </div>
            </div>`;

        // hover การ์ดเพื่อดูรายละเอียด
        stage.querySelectorAll('.gacha-ten-card').forEach((card, i) => {
            card.addEventListener('mouseenter', () => showGachaTooltip(card, items[i]));
            card.addEventListener('mouseleave', () => removeGachaTooltip());
        });
    }
}


// ============================================================
// 🎒 SECTION 8 — Inventory Render
// ============================================================
function renderGachaInventory() {
    const userId = sessionStorage.getItem('kruHengCurrentUser');
    const grid   = document.getElementById('gacha-inv-grid');
    const ldSlot = document.getElementById('gacha-loadout');
    if (!grid) return;

    const summary = gachaGetInventorySummary(userId);

    if (summary.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:30px 0; font-size:0.85rem;">คลังว่างเปล่า — ดึงกาชาเพื่อรับไอเทมครับ</div>`;
    } else {
        grid.innerHTML = summary.map(({ item, quantity }) => {
            const rs = RARITY_STYLE[item.rarity] || RARITY_STYLE.common;
            return `
                <div class="gacha-inv-card ${rs.cls}" data-item-id="${item.id}"
                     onclick="gachaEquipFromUI('${item.id}')">
                    <span class="qty-badge">×${quantity}</span>
                    <div class="icon">${item.icon}</div>
                    <div class="name">${item.nameTh}</div>
                </div>`;
        }).join('');

        // tooltip hover
        grid.querySelectorAll('.gacha-inv-card').forEach(card => {
            card.addEventListener('mouseenter', e => {
                const id   = card.getAttribute('data-item-id');
                const item = getGachaItemById(id);
                if (item) showGachaTooltip(card, item);
            });
            card.addEventListener('mouseleave', () => removeGachaTooltip());
        });
    }

    // render loadout
    renderLoadout(ldSlot);
}

function renderLoadout(container) {
    if (!container) return;
    const loadout = window.currentLoadout || [];
    const MAX = 5;
    let html = '';

    for (let i = 0; i < MAX; i++) {
        if (i < loadout.length) {
            const item = getGachaItemById(loadout[i]);
            const rs   = item ? (RARITY_STYLE[item.rarity] || RARITY_STYLE.common) : RARITY_STYLE.common;
            html += `
                <div class="gacha-loadout-slot filled ${item ? rs.cls : ''}"
                     title="${item ? item.nameTh : ''}">
                    ${item ? item.icon : '?'}
                    <span class="rm-x" onclick="gachaUnequipFromUI(${i})">✕</span>
                </div>`;
        } else {
            html += `<div class="gacha-loadout-slot" title="ว่าง — กดไอเทมด้านล่างเพื่อพก">＋</div>`;
        }
    }

    const label = loadout.length > 0
        ? `<span style="font-size:0.75rem; color:var(--text-muted); margin-left:4px;">พกเข้าสอบ (${loadout.length}/${MAX})</span>`
        : `<span style="font-size:0.75rem; color:var(--text-muted); margin-left:4px;">เลือกไอเทมพกเข้าสอบ (สูงสุด ${MAX} ชิ้น)</span>`;

    container.innerHTML = html + label;
}

function gachaEquipFromUI(itemId) {
    const userId = sessionStorage.getItem('kruHengCurrentUser');
    const res = gachaEquipItem(userId, itemId);
    if (!res.success) {
        alert(res.message);
        return;
    }
    GachaAudio.useItem();
    renderGachaInventory();
}

// ── Booster UI ──
function renderBoosterSlots() {
    const container = document.getElementById('gacha-booster-slots');
    if (!container) return;
    const boosters = window.gachaBoosters || [];
    const totalBonus = boosters.reduce((s, b) => s + b.bonus, 0);

    let html = '';
    for (let i = 0; i < 5; i++) {
        if (i < boosters.length) {
            const b = boosters[i];
            const item = getGachaItemById(b.itemId);
            const rs = RARITY_STYLE[b.rarity] || RARITY_STYLE.common;
            html += `
            <div class="gacha-loadout-slot filled ${rs.cls}"
                 title="${item ? item.nameTh : b.itemId} (+${b.bonus}%) — คลิกเพื่อเอาออก"
                 onclick="gachaRemoveBoosterUI(${i})"
                 style="cursor:pointer; position:relative;">
                ${item ? item.icon : '?'}
                <span style="position:absolute; top:-4px; right:-4px; font-size:0.55rem;
                    background:#ae57ff; color:#fff; border-radius:6px; padding:1px 3px;">+${b.bonus}%</span>
                <span class="rm-x">✕</span>
            </div>`;
        } else {
            html += `<div class="gacha-loadout-slot" title="กดไอเทม Common/Rare ด้านล่างเพื่อใส่บูสเตอร์">＋</div>`;
        }
    }
    if (totalBonus > 0) {
        html += `<span style="font-size:0.72rem; color:#ae57ff; align-self:center;">รวม +${totalBonus}% Epic+</span>`;
    }
    container.innerHTML = html;

    // อัปเดตปุ่มสุ่ม: มีบูสเตอร์ = สุ่มฟรี 1 ครั้ง + เอฟเฟค
    const btn1  = document.getElementById('gacha-btn-1');
    const btn10 = document.getElementById('gacha-btn-10');
    if (btn1 && btn10) {
        const hasBoosters = boosters.length > 0;
        btn10.disabled = hasBoosters;
        btn10.style.opacity = hasBoosters ? '0.35' : '';
        if (hasBoosters) {
            btn1.classList.add('boosted');
            btn1.innerHTML = `🚀 สุ่ม 1 (บูสเตอร์ +${totalBonus}%)<br><span style="font-size:0.75rem;">(${GACHA_COST.single.toLocaleString()} 💰)</span>`;
        } else {
            btn1.classList.remove('boosted');
            btn1.innerHTML = `🎰 สุ่ม 1<br><span style="font-size:0.75rem;">(${GACHA_COST.single.toLocaleString()} 💰)</span>`;
        }
    }

    renderBoostableItems();
}

function renderBoostableItems() {
    const container = document.getElementById('gacha-boostable-items');
    if (!container) return;
    const userId = sessionStorage.getItem('kruHengCurrentUser');
    const summary = gachaGetInventorySummary(userId);
    const boostable = summary.filter(({item}) => ['common','rare'].includes(item.rarity));

    if (boostable.length === 0) {
        container.innerHTML = `<div style="color:var(--text-muted); font-size:0.75rem; padding:6px 0;">— ไม่มีไอเทม Common/Rare ในคลัง —</div>`;
        return;
    }

    const boosters = window.gachaBoosters || [];
    container.innerHTML = boostable.map(({item, quantity}) => {
        const rs = RARITY_STYLE[item.rarity] || RARITY_STYLE.common;
        const usedCount = boosters.filter(b => b.itemId === item.id).length;
        const available = quantity - usedCount;
        const bonus = item.rarity === 'common' ? 2 : 3;
        const disabled = available <= 0 || boosters.length >= 5;
        return `
        <div class="gacha-boostable-card ${rs.cls}"
             onclick="${disabled ? '' : `gachaAddBoosterFromUI('${item.id}')`}"
             style="opacity:${disabled ? 0.4 : 1}; cursor:${disabled ? 'not-allowed' : 'pointer'};"
             title="${item.nameTh} — +${bonus}% Epic+ (มี ${available} ชิ้น)">
            <span style="font-size:1.2rem;">${item.icon}</span>
            <span style="font-size:0.62rem; text-align:center;">${item.nameTh}</span>
            <span style="font-size:0.6rem; color:var(--text-muted);">×${available}</span>
            <span style="font-size:0.65rem; color:#ae57ff; font-weight:bold;">+${bonus}%</span>
        </div>`;
    }).join('');
}

function gachaAddBoosterFromUI(itemId) {
    const userId = sessionStorage.getItem('kruHengCurrentUser');
    const item = getGachaItemById(itemId);
    if (!item || !['common', 'rare'].includes(item.rarity)) return;
    const res = gachaAddBooster(userId, itemId);
    if (!res.success) { alert(res.message); return; }
    renderBoosterSlots(); // จะเรียก renderBoostableItems ด้วย
}

function gachaRemoveBoosterUI(index) {
    gachaRemoveBooster(index);
    renderBoosterSlots(); // จะเรียก renderBoostableItems ด้วย
}

function gachaUnequipFromUI(slot) {
    gachaUnequipItem(slot);
    renderGachaInventory();
}


// ============================================================
// 📖 SECTION 9 — ตารางไอเทมทั้งหมด (แท็บ "ไอเทม")
// ============================================================
function renderGachaItemList() {
    const container = document.getElementById('gacha-items-list');
    if (!container) return;

    const rarityOrder = ['godlike','mythic','epic','rare','common'];
    const groups = {};
    rarityOrder.forEach(r => groups[r] = []);
    GACHA_ITEMS.forEach(it => { if (groups[it.rarity]) groups[it.rarity].push(it); });

    let html = '';
    rarityOrder.forEach(r => {
        if (groups[r].length === 0) return;
        const rs = RARITY_STYLE[r];
        html += `<div style="font-size:0.78rem; font-weight:bold; color:var(--text-muted); margin-top:8px; letter-spacing:0.06em;">${rs.label}</div>`;
        groups[r].forEach(item => {
            html += `
                <div style="
                    display:flex; align-items:flex-start; gap:10px;
                    padding:10px 12px; border-radius:12px;
                    border:1.5px solid; border-color:var(--rc);
                    background:radial-gradient(ellipse at left, var(--rg), transparent 70%);
                " class="${rs.cls}">
                    <span style="font-size:2rem; flex-shrink:0;">${item.icon}</span>
                    <div>
                        <div style="font-weight:bold; font-size:0.9rem;">${item.nameTh}</div>
                        <div style="font-size:0.72rem; color:var(--text-muted);">${item.nameEn}</div>
                        <div style="font-size:0.8rem; margin-top:4px; line-height:1.45;">${item.description}</div>
                    </div>
                </div>`;
        });
    });

    container.innerHTML = html;
}


// ============================================================
// 💬 SECTION 10 — Tooltip
// ============================================================
function showGachaTooltip(anchor, item) {
    removeGachaTooltip();
    const rs  = RARITY_STYLE[item.rarity] || RARITY_STYLE.common;
    const tip = document.createElement('div');
    tip.id    = 'gacha-tooltip';
    tip.className = 'gacha-tooltip';
    tip.innerHTML = `
        <div style="font-size:1.4rem; text-align:center; margin-bottom:4px;">${item.icon}</div>
        <div style="font-weight:bold; font-size:0.85rem; color:var(--text-color);">${item.nameTh}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:6px;">${item.nameEn}</div>
        <div style="display:inline-block; background:var(--rc); color:#fff; border-radius:8px; padding:1px 8px; font-size:0.65rem; margin-bottom:6px;">${rs.label}</div>
        <div style="font-size:0.75rem; line-height:1.4; color:var(--text-color);">${item.description}</div>
    `;

    document.body.appendChild(tip);

    const rect = anchor.getBoundingClientRect();
    const tipW = 220;
    let left   = rect.right + 8;
    if (left + tipW > window.innerWidth) left = rect.left - tipW - 8;
    tip.style.left = `${left + window.scrollX}px`;
    tip.style.top  = `${rect.top  + window.scrollY}px`;

    // คลิกที่ไหนก็ตาม (นอก tooltip) → ปิด
    setTimeout(() => {
        document.addEventListener('click', _tooltipOutsideHandler, { once: true, capture: true });
    }, 0);
}

function _tooltipOutsideHandler(e) {
    const tip = document.getElementById('gacha-tooltip');
    if (tip && !tip.contains(e.target)) removeGachaTooltip();
}

function removeGachaTooltip() {
    const old = document.getElementById('gacha-tooltip');
    if (old) old.remove();
    document.removeEventListener('click', _tooltipOutsideHandler, { capture: true });
}


// ============================================================
// 🔄 SECTION 11 — อัปเดต Pity UI
// ============================================================
function updateGachaPityUI() {
    const userId   = sessionStorage.getItem('kruHengCurrentUser');
    const pityData = loadPityCounter(userId);
    const pityPct  = Math.min((pityData.count / PITY_THRESHOLDS.mythic) * 100, 100);

    const fill = document.getElementById('gacha-pity-fill');
    const text = document.getElementById('gacha-pity-text');
    if (fill) fill.style.width = `${pityPct}%`;
    if (text) text.textContent = `Pity: ${pityData.count} / ${PITY_THRESHOLDS.mythic} (การันตี Mythic+ ที่ ${PITY_THRESHOLDS.mythic} pull)`;
}


// ============================================================
// ⚡ SECTION 12 — Effect ไอเทมระหว่างสอบ
//    ฟังก์ชันเหล่านี้ถูกเรียกจาก verify() ใน app.js
//    โครงสร้าง: applyGachaEffectBefore(q) → ก่อนแสดงโจทย์
//               applyGachaEffectAfter(isCorrect, result) → หลังตรวจคำตอบ
// ============================================================

/**
 * เรียกใน render() ก่อนแสดงโจทย์ข้อนั้น
 * คืนค่า { modifiedQ, consumed }
 * - modifiedQ: object q ที่อาจถูกแก้ไข (Ciel, Jinchuriki ฯลฯ)
 * - consumed: [itemId, ...] ที่ถูกใช้ในรอบนี้
 */
/**
 * ไม่ใช้งานแล้ว — ไอเทมต้องกดใช้เองผ่าน activateGachaItem() ใน app.js
 * คงไว้เพื่อ backward-compat (app.js ยังเรียก แต่ no-op)
 */
function applyGachaEffectBefore(q) {
    return { modQ: q, consumed: [] };
}

/**
 * เรียกใน verify() หลังตรวจคำตอบแล้ว
 * คืนค่า { coinMult, skipWrongPenalty, skipWrongStat, retryAllowed, scoreMultiplier }
 */
function applyGachaEffectAfter(isCorrect, val) {
    const effects = window.activeItemEffects || {};
    let coinMult         = 1;
    let skipWrongPenalty = false;
    let skipWrongStat    = false;
    let retryAllowed     = false;
    let kingEngineRetry  = false;
    let scoreMultiplier  = 1;

    // ── Madness Coin: เหรียญ ×3 ──
    if (effects['MADNESS_COIN_ACTIVE']) {
        coinMult *= 3;
        GachaAudio.byEffect('MADNESS_COIN');
    }

    // ── Maple Shield: ถ้าผิด → ไม่หักเงิน ไม่นับสถิติ ──
    if (effects['MAPLE_SHIELD_ACTIVE'] && !isCorrect) {
        skipWrongPenalty = true;
        skipWrongStat    = true;
        GachaAudio.byEffect('MAPLE_SHIELD');
    }

    // ── Jinchuriki: เหลือ 1 ตัวเลือก → ถูกเสมอ → ×10 เฉพาะเหรียญ ──
    if (effects['JINCHURIKI_ACTIVE'] && isCorrect) {
        coinMult *= 10;
    }

    // ── King Engine: ผิด→ลบตัวเลือกนั้น ถูก→คูณตาม attempt ──
    if (effects['KING_ENGINE_ACTIVE']) {
        if (!isCorrect) {
            // ผิด → retry, ไม่หักเงิน, ไม่นับสถิติ
            // (การลบปุ่มและ flash ทำใน verify() ของ app.js)
            kingEngineRetry  = true;
            skipWrongPenalty = true;
            skipWrongStat    = true;
        } else {
            // ถูก → ใช้ตัวคูณตาม attempt ที่ทำมา
            const attempt = window.kingEngineAttempt || 1; // 1=ครั้งแรก
            // attempt 1→×3, 2→×2, 3→×1, 4→×0.5
            const multMap = { 1: 3, 2: 2, 3: 1, 4: 0.5 };
            const m = multMap[Math.min(attempt, 4)];
            coinMult        *= m;
            scoreMultiplier *= m;
            GachaAudio.byEffect('KING_ENGINE');
        }
    }

    // ── Phoenix Heart: retry 1 ครั้ง ──
    if (effects['PHOENIX_HEART_ACTIVE'] && !isCorrect && !effects['PHOENIX_USED']) {
        retryAllowed = true;
        GachaAudio.byEffect('PHOENIX_HEART');
    }

    return { coinMult, skipWrongPenalty, skipWrongStat, retryAllowed, kingEngineRetry, scoreMultiplier };
}

/** รีเซ็ต flag ที่เป็น "ต่อข้อ" ก่อนข้อใหม่ */
function resetItemFlagsForNextQuestion() {
    const perQFlags = [
        'THE_PLANET_USED',
        'JINCHURIKI_USED', 'JINCHURIKI_ACTIVE',
        'CIEL_USED',
        'SIXTH_SENSE_USED',
        'DIVINE_GRACE_USED', 'DIVINE_GRACE_HINT',
        'WITCH_MELODY_USED', 'WITCH_MELODY_AUTOWIN',
        'PHOENIX_USED',
        'MADNESS_COIN_ACTIVE',
        'MAPLE_SHIELD_ACTIVE',
        'PHOENIX_HEART_ACTIVE',
        'KING_ENGINE_ACTIVE', // King Engine ใช้ได้ข้อเดียว แล้วหมด
        'TRUST_ME_BRO_USED', 'TRUST_ME_BRO_HINT',
    ];
    perQFlags.forEach(f => delete window.activeItemEffects[f]);

    // รีเซ็ต King Engine attempt counter และ slot index ทุกข้อ
    window.kingEngineAttempt   = 0;
    window.kingEngineSlotIndex = undefined;

    // ลบ hint ค้างของ Divine Grace ออกจาก DOM
    document.getElementById('gacha-divine-hint')?.remove();
    // ลบ hint ค้างของ Trust Me Bro ออกจาก DOM
    document.getElementById('gacha-tmb-hint')?.remove();
}


// ============================================================
// 🔔 SECTION 13 — Toast แจ้งไอเทมถูกเปิดใช้
// ============================================================
function showItemActivationToast(item) {
    const rs   = RARITY_STYLE[item.rarity] || RARITY_STYLE.common;
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
        z-index: 9800;
        background: var(--card-bg);
        border: 2px solid var(--rc);
        border-radius: 14px;
        padding: 10px 18px;
        display: flex; align-items: center; gap: 10px;
        box-shadow: 0 6px 24px var(--rg);
        animation: dropDown 0.3s cubic-bezier(.34,1.56,.64,1);
        font-size: 0.88rem;
        white-space: nowrap;
    `;
    toast.className = rs.cls;
    toast.innerHTML = `
        <span style="font-size:1.6rem;">${item.icon}</span>
        <span><b>${item.nameTh}</b> ถูกเปิดใช้งาน!</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-10px)';
        setTimeout(() => toast.remove(), 400);
    }, 2200);
}


// ============================================================
// 🛠️ SECTION 14 — Utility
// ============================================================
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }


// ============================================================
// 🔌 SECTION 15 — เชื่อมปุ่มเข้า dashboard
//    เรียก injectGachaButton() หลัง DOM พร้อม
// ============================================================
function injectGachaButton() {
    if (document.getElementById('btn-open-gacha')) return;

    const gachaStyle = `
        background: linear-gradient(135deg, #ff007f, #7000ff);
        color: #fff; border: none;
        padding: 8px 16px; border-radius: 20px;
        font-size: 0.85rem; font-weight: bold;
        cursor: pointer; box-shadow: 0 2px 10px rgba(255,0,127,0.3);
        transition: 0.2s;
    `;
    const invStyle = `
        background: linear-gradient(135deg, #7000ff, #00b4d8);
        color: #fff; border: none;
        padding: 8px 16px; border-radius: 20px;
        font-size: 0.85rem; font-weight: bold;
        cursor: pointer; box-shadow: 0 2px 10px rgba(0,180,216,0.3);
        transition: 0.2s;
    `;

    const btn = document.createElement('button');
    btn.id        = 'btn-open-gacha';
    btn.className = 'btn';
    btn.innerHTML = '🎰 กาชาปอง';
    btn.style.cssText = gachaStyle;
    btn.onclick      = () => openGachaModal();
    btn.onmouseenter = () => btn.style.transform = 'scale(1.08)';
    btn.onmouseleave = () => btn.style.transform = 'scale(1)';

    const invBtn = document.createElement('button');
    invBtn.id        = 'btn-open-inventory';
    invBtn.className = 'btn';
    invBtn.innerHTML = '🎒 คลัง';
    invBtn.style.cssText = invStyle;
    invBtn.onclick      = () => openInventoryModal();
    invBtn.onmouseenter = () => invBtn.style.transform = 'scale(1.08)';
    invBtn.onmouseleave = () => invBtn.style.transform = 'scale(1)';

    const controlsDiv = document.querySelector('#main-action-bar .controls')
                     || document.querySelector('.action-bar .controls');

    if (controlsDiv) {
        const profileBadge = document.getElementById('user-profile-badge');
        if (profileBadge && profileBadge.parentNode === controlsDiv) {
            controlsDiv.insertBefore(btn, profileBadge);
            controlsDiv.insertBefore(invBtn, btn);
        } else {
            controlsDiv.appendChild(invBtn);
            controlsDiv.appendChild(btn);
        }
    } else {
        btn.style.cssText += 'position:fixed; bottom:80px; right:20px; z-index:8000;';
        invBtn.style.cssText += 'position:fixed; bottom:80px; right:130px; z-index:8000;';
        document.body.appendChild(btn);
        document.body.appendChild(invBtn);
    }
}

// เรียกเมื่อ DOM พร้อม
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectGachaButton);
} else {
    injectGachaButton();
}

console.log("✅ [SUCCESS] gacha_ui.js โหลดเสร็จสมบูรณ์!");


/* =====================================================================
   สิ้นสุดไฟล์ gacha_ui.js

   ══ วิธีสลับเป็นไฟล์เสียงจริง ══
   ค้นหา "แทนที่ด้วย:" ในไฟล์นี้ แล้วแทนที่บล็อกเสียงสังเคราะห์
   ด้วย: const sfx = new Audio('audio/gacha_XXX.mp3'); sfx.play();
   แล้วลบบรรทัด GachaAudio.xxx() ที่อยู่คู่กันออก

   ══ ไฟล์เสียงที่ต้องเตรียม (ถ้าจะสลับ) ══
   audio/gacha_pull.mp3    — เสียงกด pull
   audio/gacha_open.mp3    — เสียงเปิดแคปซูล
   audio/gacha_common.mp3  — reveal Common
   audio/gacha_rare.mp3    — reveal Rare
   audio/gacha_epic.mp3    — reveal Epic
   audio/gacha_mythic.mp3  — reveal Mythic
   audio/gacha_godlike.mp3 — reveal Godlike
   audio/gacha_use.mp3     — ใช้ไอเทม
   audio/gacha_broke.mp3   — เหรียญไม่พอ
   audio/sfx_shield.mp3    — Maple Shield
   audio/sfx_stoptime.mp3  — The Planet
   audio/sfx_phoenix.mp3   — Phoenix Heart
   audio/sfx_divine.mp3    — Divine Grace
   audio/sfx_witch.mp3     — Witch Melody
   audio/sfx_zone.mp3      — Absolute Zone / Ryoiki Tenkai
   audio/sfx_jinchuriki.mp3— Jinchuriki
   audio/sfx_engine.mp3    — King Engine
   audio/sfx_ciel.mp3      — Ciel
   audio/sfx_sense.mp3     — 6th Sense
   ===================================================================== */
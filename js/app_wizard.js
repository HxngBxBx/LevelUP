/* =====================================================================
   🎰 ไฟล์: js/gacha.js
   หน้าที่: ระบบกาชาปองทั้งหมด (Logic เท่านั้น ไม่มี UI)
   เชื่อมกับ: app.js (verify, stat, coins), auth.js (inventory, studentDB)
   วิธีใช้: โหลดก่อน gacha_ui.js และ app.js ใน index.html
   ===================================================================== */

console.log("🎰 [START] โมดูลเริ่มทำงาน: gacha.js (ระบบสุ่มกาชาปอง)");

// ============================================================
// 📦 1. ฐานข้อมูลไอเทม 13 ชนิด
//    rarity: "common" | "rare" | "epic" | "mythic" | "godlike"
//    effect: รหัสที่ gacha_ui.js และ verify() ใน app.js จะ switch-case ตาม
// ============================================================
const GACHA_ITEMS = [
    {
        id: "madness_coin",
        nameTh: "ความบ้าคลั่งของยูเมะโกะ",
        nameEn: "Madness Coin",
        rarity: "rare",
        icon: "🪙",
        description: "ถ้าตอบถูกหรือผิดก็ ×3 ของเหรียญที่ได้/เสียในข้อนั้น (ไม่ว่าจะ + หรือ −)",
        effect: "MADNESS_COIN",
        // เงิน: ×3 (ทั้งบวกและลบ) | สถิติ: นับปกติ | EXP: ถูกปกติผิด 0
        coinMult: 3,
        countStat: true,
        expOnWrong: 0,
    },
    {
        id: "maple_shield",
        nameTh: "โล่ของเมเปิล",
        nameEn: "Maple Shield",
        rarity: "rare",
        icon: "🛡️",
        description: "ตอบผิดจะไม่โดนหักคะแนนและจะไม่นับลงในสถิติ (ไม่นับผิด)",
        effect: "MAPLE_SHIELD",
        // เงิน: ถูกปกติ ผิด 0 | สถิติ: ถูกนับ ผิดไม่นับ | EXP: ถูกปกติ ผิด 0
        coinMult: 1,
        countStat: false, // ถ้าผิด → ไม่นับ
        expOnWrong: 0,
    },
    {
        id: "jinchuriki",
        nameTh: "พลังสถิตร่างแมกโทมัส",
        nameEn: "MacThomas's Jinchuriki",
        rarity: "godlike",
        icon: "🦊",
        description: "จะตัดช้อยเหลือ 1 ข้อและตอบถูกจะได้คะแนน ×10 ไปเลย (เหลือแค่ 1 ตัวเลือก — ตอบได้เลย)",
        effect: "JINCHURIKI",
        // เงิน: ×10 | สถิติ: นับปกติ | EXP: ×10
        coinMult: 10,
        countStat: true,
        expOnWrong: 0,
    },
    {
        id: "king_engine",
        nameTh: "คิงเอนจิน",
        nameEn: "King Engine",
        rarity: "mythic",
        icon: "⚙️",
        description: "ตอบถูกครั้งแรก ×3 | ครั้งที่สอง ×2 | ครั้งที่สาม ×1 | ครั้งสุดท้ายไม่ได้คะแนน (นับถูกทุกครั้ง)",
        effect: "KING_ENGINE",
        // ตัวคูณเงิน/คะแนนขึ้นอยู่กับ kingEngineCount (ดูด้านล่าง)
        coinMult: 1, // จะถูก override โดย kingEngineCount
        countStat: true,
        expOnWrong: 0,
    },
    {
        id: "the_planet",
        nameTh: "หยุดเวลาโจโจ้",
        nameEn: "The Planet",
        rarity: "epic",
        icon: "🌍",
        description: "หยุดเวลาได้ 2 นาที (เพิ่มเวลาให้ข้อนั้น +120 วินาที)",
        effect: "THE_PLANET",
        coinMult: 1,
        countStat: true,
        expOnWrong: 0,
        bonusTimeSec: 120,
    },
    {
        id: "phoenix_heart",
        nameTh: "หัวใจฟินิกส์",
        nameEn: "Phoenix Heart",
        rarity: "epic",
        icon: "🔥",
        description: "ตอบผิดตอบใหม่ได้อีก 1 ครั้ง (โอกาส retry เพียงครั้งเดียว)",
        effect: "PHOENIX_HEART",
        coinMult: 1,
        countStat: true,
        expOnWrong: 0,
    },
    {
        id: "divine_grace",
        nameTh: "ความเมตตาของครูเฮง",
        nameEn: "The Divine Grace of Master Heng",
        rarity: "epic",
        icon: "✨",
        description: "ตัดให้เหลือ 3 ช้อย พร้อมข้อความแนะนำให้เลือกข้อนั้น (โอกาสถูก ~40%)",
        effect: "DIVINE_GRACE",
        coinMult: 1,
        countStat: true,
        expOnWrong: 0,
    },
    {
        id: "witch_melody",
        nameTh: "ถุงมือแม่มดน้อย",
        nameEn: "The Gauntlets of the Witch's Melody",
        rarity: "mythic",
        icon: "🧤",
        description: "ด้วยพลังสามารถดีดนิ้วแล้วเหลือข้อที่ถูกเพียงข้อเดียว (เฉลยอัตโนมัติ — นับถูกเสมอ)",
        effect: "WITCH_MELODY",
        coinMult: 1,
        countStat: true,
        expOnWrong: 0,
    },
    {
        id: "absolute_zone",
        nameTh: "โซนแห่งการเรียนรู้สัมบูรณ์",
        nameEn: "The Absolute Zone",
        rarity: "common",
        icon: "📡",
        description: "×EXP 1.2 เท่า ทั้งชุดข้อสอบ (บัพแบบ passive ทั้งชุด)",
        effect: "ABSOLUTE_ZONE",
        coinMult: 1,
        countStat: true,
        expOnWrong: 0,
        expMultiplier: 1.2, // passive ทั้งชุด — ใช้ตอน finish()
    },
    {
        id: "ryoiki_tenkai",
        nameTh: "กางอาณาเขต",
        nameEn: "Ryoiki Tenkai",
        rarity: "common",
        icon: "🌐",
        description: "×เงิน 1.2 เท่า ทั้งชุด (บัพแบบ passive ทั้งชุด)",
        effect: "RYOIKI_TENKAI",
        coinMult: 1,
        countStat: true,
        expOnWrong: 0,
        coinMultiplier: 1.2, // passive ทั้งชุด — ใช้ตอน finish()
    },
    {
        id: "ciel",
        nameTh: "ชิเอล",
        nameEn: "Ciel",
        rarity: "mythic",
        icon: "🎭",
        description: "เปลี่ยนโจทย์ข้อนั้นให้กลายเป็น 1+0=? (มีแค่ 2 ตัวเลือก: 1 กับ 0 — ตอบถูกรับคะแนนปกติ)",
        effect: "CIEL",
        coinMult: 1,
        countStat: true,
        expOnWrong: 0,
    },
    {
        id: "sixth_sense",
        nameTh: "สัมผัสที่ 6",
        nameEn: "The 6th Sense",
        rarity: "rare",
        icon: "👁️",
        description: "ตัดให้เหลือ 3 ช้อย (ลดตัวเลือกจาก 4 → 3)",
        effect: "SIXTH_SENSE",
        coinMult: 1,
        countStat: true,
        expOnWrong: 0,
    },
    {
        id: "trust_me_bro",
        nameTh: "เชื่อผมเถอะ พี่ชาย",
        nameEn: "Trust Me Bro",
        rarity: "mythic",
        icon: "🤙",
        description: "ตัดช้อยออก 2 ข้อ เหลือ 2 ตัวเลือก พร้อมคำแนะนำจาก AI เบียวๆ โอกาสถูก ~51%",
        effect: "TRUST_ME_BRO",
        coinMult: 1,
        countStat: true,
        expOnWrong: 0,
    },
];

// ============================================================
// 🎯 2. Config อัตราดรอปตาม Rarity
// ============================================================
const GACHA_RARITY_CONFIG = {
    godlike: { weight: 0.5,  label: "✦ Godlike", color: "#ff0055", glowColor: "rgba(255,0,85,0.6)" },
    mythic:  { weight: 2.5,  label: "★ Mythic",  color: "#ae57ff", glowColor: "rgba(174,87,255,0.5)" },
    epic:    { weight: 7,    label: "◆ Epic",    color: "#ff9800", glowColor: "rgba(255,152,0,0.5)"  },
    rare:    { weight: 40,   label: "▲ Rare",    color: "#00b4d8", glowColor: "rgba(0,180,216,0.4)"  },
    common:  { weight: 50,   label: "● Common",  color: "#9e9e9e", glowColor: "rgba(158,158,158,0.3)"},
};
// หมายเหตุ: weight รวม = 100 → common 50%, rare 40%, epic 7%, mythic 2.5%, godlike 0.5%

// ============================================================
// 🔢 3. ระบบ Pity (รับประกันการดรอป)
//    - ทุก 30 pull ที่ยังไม่ได้ Mythic+ → การันตี Mythic(90%) หรือ Godlike(10%)
//    - รีเซ็ต counter เมื่อได้ Mythic หรือ Godlike
// ============================================================
const PITY_THRESHOLDS = {
    mythic: 30, // ทุก 30 pull → การันตี mythic+
};

// ============================================================
// 🎰 4. ฟังก์ชันหลัก: สุ่มไอเทม 1 ชิ้น
// ============================================================
function gachaPullOne(userId) {
    const pity = loadPityCounter(userId);

    let pickedRarity;

    // ถ้าถึง pity threshold → การันตี mythic(80%) หรือ godlike(20%)
    if (pity.count >= PITY_THRESHOLDS.mythic) {
        pickedRarity = Math.random() < 0.9 ? 'mythic' : 'godlike';
    } else {
        pickedRarity = rollRarity();
    }

    // กรองไอเทมตาม rarity
    let pool = GACHA_ITEMS.filter(item => item.rarity === pickedRarity);
    if (pool.length === 0) pool = GACHA_ITEMS; // fallback

    // สุ่มไอเทมใน pool
    const picked = pool[Math.floor(Math.random() * pool.length)];

    // รีเซ็ต pity เฉพาะเมื่อได้ mythic หรือ godlike
    const resetPity = ['mythic', 'godlike'].includes(pickedRarity);
    savePityCounter(userId, resetPity ? 0 : pity.count + 1);

    return picked; // ไม่หัก booster ที่นี่ — gachaAction_Single/Ten จัดการ
}

// ============================================================
// 🎰 5. ฟังก์ชัน: สุ่มไอเทม 10 ครั้งพร้อมกัน (10-Pull)
//    booster ใช้ได้ตลอด 10 pull แต่หักเพียงครั้งเดียวหลังจบ
// ============================================================
function gachaPullTen(userId) {
    const results = [];
    for (let i = 0; i < 10; i++) {
        results.push(gachaPullOne(userId));
    }
    // หัก booster หลังจบ 10 pull (gachaPullOne ไม่หักในโหมด ten)
    gachaDeductBoosters(userId);
    return results;
}

// ============================================================
// 🎲 6. สุ่ม rarity (คำนึง pity)
// ============================================================
function rollRarity() {
    const order = ["godlike", "mythic", "epic", "rare", "common"];
    const w = gachaGetBoostedWeights();
    const totalW = order.reduce((sum, r) => sum + (w[r] || 0), 0);
    let rand = Math.random() * totalW;
    for (const r of order) {
        rand -= (w[r] || 0);
        if (rand <= 0) return r;
    }
    return 'common';
}

// ============================================================
// 💾 7. Pity Counter (เก็บใน localStorage)
// ============================================================
function loadPityCounter(userId) {
    try {
        const raw = localStorage.getItem(`kruHengPity_${userId}`);
        return raw ? JSON.parse(raw) : { count: 0 };
    } catch { return { count: 0 }; }
}

function savePityCounter(userId, count) {
    localStorage.setItem(`kruHengPity_${userId}`, JSON.stringify({ count }));
}

function resetPityCounter(userId) {
    localStorage.removeItem(`kruHengPity_${userId}`);
}

// ============================================================
// 🎒 8. Inventory System (เก็บไอเทมที่นักเรียนดึงได้)
// ============================================================

/**
 * เพิ่มไอเทมเข้า inventory ของผู้ใช้
 * @param {string} userId
 * @param {object} item - object จาก GACHA_ITEMS
 * @param {number} qty - จำนวนที่จะเพิ่ม (default: 1)
 */
function gachaAddToInventory(userId, item, qty = 1) {
    const role = sessionStorage.getItem('kruHengRole');
    if (!userId) return;

    if (role === 'guest') {
        let gInfo = JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}');
        if (!gInfo.inventory) gInfo.inventory = {};
        // เช็คว่าไอเทมถูก pass มาเป็น string(id) หรือ object
        const itemId = typeof item === 'string' ? item : item.id;
        gInfo.inventory[itemId] = (gInfo.inventory[itemId] || 0) + qty;
        sessionStorage.setItem('kruHengGuestInfo', JSON.stringify(gInfo));
    } else {
        const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB') || '{}') || defaultStudentDB;
        if (!dbStudent[userId]) return;
        if (!dbStudent[userId].inventory) dbStudent[userId].inventory = {};
        const itemId = typeof item === 'string' ? item : item.id;
        dbStudent[userId].inventory[itemId] = (dbStudent[userId].inventory[itemId] || 0) + qty;
        localStorage.setItem('kruHengStudentDB', JSON.stringify(dbStudent));
    }
}

/**
 * ดึง inventory ของผู้ใช้ออกมา
 * @param {string} userId
 * @returns {object} { itemId: quantity, ... }
 */
function gachaGetInventory(userId) {
    const role = sessionStorage.getItem('kruHengRole');
    if (role === 'guest') {
        const gInfo = JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}');
        return gInfo.inventory || {};
    } else {
        const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB') || '{}') || defaultStudentDB;
        return (dbStudent[userId] && dbStudent[userId].inventory) ? dbStudent[userId].inventory : {};
    }
}

/**
 * ใช้ไอเทม 1 ชิ้น (ลดจำนวนใน inventory)
 * @returns {boolean} สำเร็จหรือไม่
 */
function gachaUseItem(userId, itemId) {
    const role = sessionStorage.getItem('kruHengRole');
    if (role === 'guest') {
        let gInfo = JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}');
        if (!gInfo.inventory || !gInfo.inventory[itemId] || gInfo.inventory[itemId] <= 0) return false;
        gInfo.inventory[itemId]--;
        if (gInfo.inventory[itemId] <= 0) delete gInfo.inventory[itemId];
        sessionStorage.setItem('kruHengGuestInfo', JSON.stringify(gInfo));
        return true;
    } else {
        const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB') || '{}') || defaultStudentDB;
        if (!dbStudent[userId] || !dbStudent[userId].inventory) return false;
        if (!dbStudent[userId].inventory[itemId] || dbStudent[userId].inventory[itemId] <= 0) return false;
        dbStudent[userId].inventory[itemId]--;
        if (dbStudent[userId].inventory[itemId] <= 0) delete dbStudent[userId].inventory[itemId];
        localStorage.setItem('kruHengStudentDB', JSON.stringify(dbStudent));
        return true;
    }
}

// ============================================================
// 💰 9. ระบบจ่ายเหรียญสำหรับดึงกาชา
// ============================================================
const GACHA_COST = {
    single: 1000,  // เหรียญสำหรับดึง 1 ครั้ง
    ten:    10000, // เหรียญสำหรับดึง 10 ครั้ง (ส่วนลด ~17%)
};

/**
 * ดึงยอดเหรียญปัจจุบัน
 */
function gachaGetCoins(userId) {
    const role = sessionStorage.getItem('kruHengRole');
    if (role === 'guest') {
        return JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}').coins || 0;
    } else {
        const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB') || '{}') || defaultStudentDB;
        return (dbStudent[userId] && dbStudent[userId].coins) ? dbStudent[userId].coins : 0;
    }
}

/**
 * หักเหรียญหลังดึงกาชา
 * @returns {boolean} สำเร็จหรือไม่
 */
function gachaDeductCoins(userId, amount) {
    const role = sessionStorage.getItem('kruHengRole');
    const currentCoins = gachaGetCoins(userId);
    if (currentCoins < amount) return false;

    if (role === 'guest') {
        let gInfo = JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}');
        gInfo.coins = (gInfo.coins || 0) - amount;
        sessionStorage.setItem('kruHengGuestInfo', JSON.stringify(gInfo));
    } else {
        const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB') || '{}') || defaultStudentDB;
        if (!dbStudent[userId]) return false;
        dbStudent[userId].coins = (dbStudent[userId].coins || 0) - amount;
        localStorage.setItem('kruHengStudentDB', JSON.stringify(dbStudent));
    }
    return true;
}

// ============================================================
// 🎮 10. API หลักสำหรับเรียกใช้จาก gacha_ui.js
// ============================================================

/**
 * ดึงกาชา 1 ครั้ง — ตรวจสอบเหรียญ, หัก, เพิ่ม inventory, คืน item
 * @returns {{ success: boolean, item?: object, message?: string, remainingCoins: number }}
 */
function gachaAction_Single(userId) {
    if (!gachaDeductCoins(userId, GACHA_COST.single)) {
        return { success: false, message: `เหรียญไม่พอ! ต้องการ ${GACHA_COST.single} เหรียญ`, remainingCoins: gachaGetCoins(userId) };
    }
    const item = gachaPullOne(userId);
    gachaAddToInventory(userId, item, 1);
    gachaDeductBoosters(userId);
    return { success: true, item, remainingCoins: gachaGetCoins(userId) };
}

/**
 * ดึงกาชา 10 ครั้ง
 * @returns {{ success: boolean, items?: object[], message?: string, remainingCoins: number }}
 */
function gachaAction_Ten(userId) {
    if (!gachaDeductCoins(userId, GACHA_COST.ten)) {
        return { success: false, message: `เหรียญไม่พอ! ต้องการ ${GACHA_COST.ten} เหรียญ`, remainingCoins: gachaGetCoins(userId) };
    }
    const items = gachaPullTen(userId); // gachaPullTen จัดการหัก booster เองแล้ว
    items.forEach(item => gachaAddToInventory(userId, item, 1));
    return { success: true, items, remainingCoins: gachaGetCoins(userId) };
}

// ============================================================
// 🔍 11. Helper: ดึงข้อมูลไอเทมจาก id
// ============================================================
function getGachaItemById(itemId) {
    return GACHA_ITEMS.find(i => i.id === itemId) || null;
}

/**
 * สรุปคลังไอเทมของผู้ใช้ (พร้อมข้อมูลครบ)
 * @returns {Array} [{ item, quantity }, ...]
 */
function gachaGetInventorySummary(userId) {
    const inv = gachaGetInventory(userId);
    return Object.keys(inv)
        .map(id => ({ item: getGachaItemById(id), quantity: inv[id] }))
        .filter(e => e.item && e.quantity > 0)
        .sort((a, b) => {
            const order = ["godlike", "mythic", "epic", "rare", "common"];
            return order.indexOf(a.item.rarity) - order.indexOf(b.item.rarity);
        });
}

// ============================================================
// ⚡ 12. ระบบ Effect ระหว่างทำข้อสอบ
//    window.activeItemEffects = { EFFECT_CODE: true/data }
//    window.currentLoadout = [itemId, ...]  (สูงสุด 3 ชิ้น)
//    ฟังก์ชัน applyGachaEffect() ถูกเรียกจาก verify() ใน app.js
// ============================================================

/** King Engine counter (รีเซ็ตทุก render ใหม่) */
window.kingEngineCount = window.kingEngineCount || 0;

/**
 * เพิ่มไอเทมเข้า loadout (กระเป๋าพกเข้าสอบ)
 * สูงสุด 3 ชิ้น / ชนิดเดียวกันพกได้
 */
function gachaEquipItem(userId, itemId) {
    if (!window.currentLoadout) window.currentLoadout = [];
    const MAX_LOADOUT = 5;
    if (window.currentLoadout.length >= MAX_LOADOUT) {
        return { success: false, message: `พกได้สูงสุด ${MAX_LOADOUT} ชิ้นต่อรอบ` };
    }

    // ABSOLUTE_ZONE และ RYOIKI_TENKAI พกได้อย่างละ 1 เท่านั้น
    const item = getGachaItemById(itemId);
    const uniqueEffects = ['ABSOLUTE_ZONE', 'RYOIKI_TENKAI'];
    if (item && uniqueEffects.includes(item.effect)) {
        const alreadyEquipped = window.currentLoadout.some(id => id === itemId);
        if (alreadyEquipped) {
            return { success: false, message: `${item.nameTh} พกได้แค่ 1 ชิ้นต่อรอบ` };
        }
    }

    const inv = gachaGetInventory(userId);
    
    // [แก้ไขปัญหาบัค: คอมเมนต์โค้ดเดิมทิ้ง เปลี่ยนเป็นตัดสต๊อกทันที]
    // const equipped = window.currentLoadout.filter(id => id === itemId).length;
    // const available = (inv[itemId] || 0) - equipped;
    const available = inv[itemId] || 0; // ยึดจำนวนจริงจากระบบเพราะเราหักออกทันทีแล้ว
    
    if (available <= 0) {
        return { success: false, message: "ไอเทมไม่พอ!" };
    }
    
    window.currentLoadout.push(itemId);
    
    // 🟢 [แก้ไขปัญหาบัค] หักสต๊อกไอเทมทันทีที่สวมใส่ เพื่อไม่ให้ปั๊มไอเทมไปใส่ช่องบูสเตอร์พร้อมกันได้
    gachaUseItem(userId, itemId); 

    return { success: true };
}

// 🟢 [แก้ไขปัญหาบัค] เพิ่มพารามิเตอร์ userId เข้ามา เพื่อให้สามารถคืนสต๊อกกลับคืนได้อย่างถูกต้อง
function gachaUnequipItem(slot, userId) {
    if (!window.currentLoadout) return;
    
    const itemId = window.currentLoadout[slot]; // เก็บ id ไว้ก่อนลบออกจากอาร์เรย์
    window.currentLoadout.splice(slot, 1);
    
    // 🟢 [แก้ไขปัญหาบัค] คืนสต๊อกทันทีเมื่อถอดออกจาก Loadout
    if (itemId && userId) {
        gachaAddToInventory(userId, itemId, 1);
    } else if (itemId && !userId) {
        console.warn("⚠️ [gachaUnequipItem] ขาดพารามิเตอร์ userId! สต๊อกไอเทมไม่ได้ถูกคืนเข้าตัว");
    }
}

/**
 * คำนวณ passive multiplier ทั้งชุด (เรียกจาก finish() ใน app.js)
 * @returns {{ expMult: number, coinMult: number }}
 */
function gachaGetPassiveMultipliers() {
    let expMult = 1.0;
    let coinMult = 1.0;

    if (!window.currentLoadout) return { expMult, coinMult };

    window.currentLoadout.forEach(itemId => {
        const item = getGachaItemById(itemId);
        if (!item) return;
        if (item.effect === "ABSOLUTE_ZONE") expMult *= (item.expMultiplier || 1.2);
        if (item.effect === "RYOIKI_TENKAI") coinMult *= (item.coinMultiplier || 1.2);
    });

    return { expMult, coinMult };
}

// ============================================================
// 🗑️ 13. ตัดสต็อก loadout ทันที (เรียกตอนเริ่มสอบ)
//    - หัก inventory ทุกชิ้นใน currentLoadout ทันที
//    - ไม่ว่าจะใช้หรือไม่ใช้ก็ตาม ไม่มีการคืน
// ============================================================

/**
 * ตัดสต็อก loadout ทั้งหมดทันที
 * เรียกตอนเริ่มข้อสอบ (และตอน suspend)
 * @param {string} userId
 * @param {string[]} loadout - array ของ itemId
 */
function gachaDeductLoadout(userId, loadout) {
    if (!userId || !loadout || loadout.length === 0) return;
    
    // [แก้ไขปัญหาบัค: คอมเมนต์โค้ดเดิมทิ้ง เพราะเปลี่ยนไปหักตั้งแต่ตอนกด Equip ทันทีแล้ว]
    // loadout.forEach(itemId => {
    //     gachaUseItem(userId, itemId);
    // });
    
    console.log("✅ [gachaDeductLoadout] ไอเทมถูกตัดสต๊อกไปแล้วตั้งแต่ตอนใส่เข้ากระเป๋า (Immediate Deduction)");
}

/**
 * คืนไอเทมกลับคลัง (เรียกตอนพักข้อสอบ — ไอเทมที่ยังไม่ได้ใช้ควรได้คืน)
 * @param {string} userId
 * @param {string[]} loadout - array ของ itemId ที่เหลืออยู่ใน currentLoadout
 */
function gachaRestoreLoadout(userId, loadout) {
    if (!userId || !loadout || loadout.length === 0) return;
    const role = sessionStorage.getItem('kruHengRole');
    if (role === 'guest') {
        let gInfo = JSON.parse(sessionStorage.getItem('kruHengGuestInfo') || '{}');
        if (!gInfo.inventory) gInfo.inventory = {};
        loadout.forEach(itemId => {
            gInfo.inventory[itemId] = (gInfo.inventory[itemId] || 0) + 1;
        });
        sessionStorage.setItem('kruHengGuestInfo', JSON.stringify(gInfo));
    } else {
        const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB') || '{}') || defaultStudentDB;
        if (!dbStudent[userId]) return;
        if (!dbStudent[userId].inventory) dbStudent[userId].inventory = {};
        loadout.forEach(itemId => {
            dbStudent[userId].inventory[itemId] = (dbStudent[userId].inventory[itemId] || 0) + 1;
        });
        localStorage.setItem('kruHengStudentDB', JSON.stringify(dbStudent));
    }
}

// ============================================================
// 🚀 14. ระบบ Booster (เพิ่มเรทสุ่มชั่วคราว)
//    - ใช้ไอเทม common หรือ rare ใน inventory เป็น booster
//    - common 1 ชิ้น = +1%, rare 1 ชิ้น = +2% (สูงสุด 5 ช่อง)
//    - ส่วนที่เพิ่มมาจะหักจาก common และ rare แบ่งตามสัดส่วน
//    - window.gachaBoosters = [{ itemId, bonus }, ...]
// ============================================================

window.gachaBoosters = window.gachaBoosters || [];

function gachaAddBooster(userId, itemId) {
    if (!window.gachaBoosters) window.gachaBoosters = [];
    if (window.gachaBoosters.length >= 5) {
        return { success: false, message: 'ใส่บูสเตอร์ได้สูงสุด 5 ช่อง' };
    }
    const item = getGachaItemById(itemId);
    if (!item || !['common', 'rare'].includes(item.rarity)) {
        return { success: false, message: 'ใช้เป็นบูสเตอร์ได้เฉพาะ Common และ Rare เท่านั้น' };
    }
    const inv = gachaGetInventory(userId);
    
    // [แก้ไขปัญหาบัค: คอมเมนต์โค้ดเดิมทิ้ง เปลี่ยนเป็นตัดสต๊อกทันที]
    // const usedAsBooster = window.gachaBoosters.filter(b => b.itemId === itemId).length;
    // if ((inv[itemId] || 0) - usedAsBooster <= 0) { ... }
    const available = inv[itemId] || 0; // ยึดจำนวนจริงจากระบบเพราะหักทันที
    
    if (available <= 0) {
        return { success: false, message: 'ไอเทมไม่พอ!' };
    }
    const bonus = item.rarity === 'common' ? 2 : 3;
    window.gachaBoosters.push({ itemId, bonus, rarity: item.rarity });
    
    // 🟢 [แก้ไขปัญหาบัค] หักสต๊อกไอเทมทันทีที่ใส่เข้าช่องบูสเตอร์
    gachaUseItem(userId, itemId);
    
    return { success: true, bonus };
}

// 🟢 [แก้ไขปัญหาบัค] เพิ่มพารามิเตอร์ userId เข้ามา เพื่อให้สามารถคืนสต๊อกกลับคืนได้อย่างถูกต้อง
function gachaRemoveBooster(index, userId) {
    if (!window.gachaBoosters) return;
    
    const booster = window.gachaBoosters[index]; // เก็บข้อมูลก่อนลบ
    window.gachaBoosters.splice(index, 1);
    
    // 🟢 [แก้ไขปัญหาบัค] คืนสต๊อกทันทีเมื่อถอดออกจาก Booster
    if (booster && userId) {
        gachaAddToInventory(userId, booster.itemId, 1);
    } else if (booster && !userId) {
        console.warn("⚠️ [gachaRemoveBooster] ขาดพารามิเตอร์ userId! สต๊อกไอเทมไม่ได้ถูกคืนเข้าตัว");
    }
}

/**
 * คำนวณ weight ที่ปรับด้วย booster
 * หัก bonus% จาก common+rare ตามสัดส่วน แล้วแจก epic/mythic/godlike
 */
function gachaGetBoostedWeights() {
    const base = {
        godlike: GACHA_RARITY_CONFIG.godlike.weight,
        mythic:  GACHA_RARITY_CONFIG.mythic.weight,
        epic:    GACHA_RARITY_CONFIG.epic.weight,
        rare:    GACHA_RARITY_CONFIG.rare.weight,
        common:  GACHA_RARITY_CONFIG.common.weight,
    };
    if (!window.gachaBoosters || window.gachaBoosters.length === 0) return base;

    const totalBonus = window.gachaBoosters.reduce((s, b) => s + b.bonus, 0);
    if (totalBonus === 0) return base;

    // แจก bonus ให้ epic/mythic/godlike ตามสัดส่วน weight เดิม
    const highTotal = base.epic + base.mythic + base.godlike;
    const w = { ...base };
    w.epic    += totalBonus * (base.epic    / highTotal);
    w.mythic  += totalBonus * (base.mythic  / highTotal);
    w.godlike += totalBonus * (base.godlike / highTotal);

    // หักจาก common+rare ตามสัดส่วน
    const lowTotal = base.common + base.rare;
    w.common -= totalBonus * (base.common / lowTotal);
    w.rare   -= totalBonus * (base.rare   / lowTotal);

    // clamp ไม่ต่ำกว่า 0
    Object.keys(w).forEach(k => { if (w[k] < 0) w[k] = 0; });
    return w;
}

/**
 * หัก inventory ของไอเทมที่ใช้เป็น booster (เรียกตอนกดดึง)
 */
function gachaDeductBoosters(userId) {
    if (!window.gachaBoosters || window.gachaBoosters.length === 0) return;
    
    // [แก้ไขปัญหาบัค: คอมเมนต์โค้ดเดิมทิ้ง เพราะเปลี่ยนไปหักตั้งแต่ตอนกดใส่บูสเตอร์ทันทีแล้ว]
    // window.gachaBoosters.forEach(b => gachaUseItem(userId, b.itemId));
    
    // เคลียร์ค่า Array ทิ้งอย่างเดียว ไม่ต้องหักสต๊อกซ้ำ
    window.gachaBoosters = [];
}

console.log("✅ [SUCCESS] gacha.js โหลดเสร็จสมบูรณ์!");

/* =====================================================================
   สิ้นสุดไฟล์ gacha.js
   ===================================================================== */

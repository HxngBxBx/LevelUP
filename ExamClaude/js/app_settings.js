/* =====================================================================
   ⚙️ ไฟล์: js/app_settings.js
   หน้าที่: จัดการการตั้งค่าของระบบ (บันทึก, โหลด, และผูก Event ต่างๆ)
   ===================================================================== */
console.log("⚙️ [START] โมดูลเริ่มทำงาน: app_settings.js (ระบบการตั้งค่า)");

// รายชื่อ ID ของ UI การตั้งค่าทั้งหมดในระบบ
const settingIds = [
    'set-shuffle', 'set-use-timer', 'set-time', 'set-use-delay', 'set-delay-val',
    'set-pause-hide', 'set-print-topic', 'set-print-diff', 'set-print-ans', 'set-print-ans-loc',
    'set-bgm-menu', 'vol-bgm-menu', 'set-bgm-quiz', 'vol-bgm-quiz',
    'set-sfx-correct', 'vol-sfx-correct', 'set-sfx-wrong', 'vol-sfx-wrong',
    'set-sfx-tick', 'vol-sfx-tick', 'bgm-play-mode'
];

// ฟังก์ชันบันทึกการตั้งค่าลง LocalStorage หรือ SessionStorage
function saveSettings() {
    const role = sessionStorage.getItem('kruHengRole');
    const user = sessionStorage.getItem('kruHengCurrentUser');
    if (!user) return;

    let currentSettings = {};
    settingIds.forEach(id => {
        const el = document.getElementById(id);
        if(el) currentSettings[id] = el.value;
    });

    if (role === 'guest') {
        sessionStorage.setItem('kruHengGuestSettings', JSON.stringify(currentSettings));
    } else {
        localStorage.setItem('kruHengSettings_' + user, JSON.stringify(currentSettings));
    }
}

// ฟังก์ชันโหลดการตั้งค่ากลับมาแสดงบนหน้าจอ
function loadSettings() {
    const role = sessionStorage.getItem('kruHengRole');
    const user = sessionStorage.getItem('kruHengCurrentUser');
    if (!user) return;

    let savedSettings = null;
    if (role === 'guest') {
        savedSettings = JSON.parse(sessionStorage.getItem('kruHengGuestSettings'));
    } else {
        savedSettings = JSON.parse(localStorage.getItem('kruHengSettings_' + user));
    }

    if (savedSettings) {
        settingIds.forEach(id => {
            if(savedSettings[id] !== undefined) {
                const el = document.getElementById(id);
                if(el) {
                    el.value = savedSettings[id];
                    // (เพิ่ม typeof เช็คเพื่อป้องกัน Error ระหว่างช่วงแยกไฟล์)
                    if(id === 'set-use-timer' && typeof toggleTimerInput === 'function') toggleTimerInput();
                    if(id === 'set-use-delay' && typeof toggleDelayInput === 'function') toggleDelayInput();
                }
            }
        });
        
        if(typeof updateVolume === 'function') {
            updateVolume();
        }
    }
}

// ฟังก์ชันดักจับ Event เมื่อมีการเปลี่ยนค่าในหน้าตั้งค่า ให้เซฟอัตโนมัติ
function bindSettingsEvents() {
    settingIds.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.addEventListener('change', saveSettings);
            if(el.tagName === 'INPUT' && (el.type === 'range' || el.type === 'number')) {
                el.addEventListener('input', saveSettings);
            }
        }
    });
}

console.log("✅ [SUCCESS] app_settings.js โหลดเสร็จสมบูรณ์!");
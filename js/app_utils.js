/* =====================================================================
   🛠️ ไฟล์: js/app_utils.js
   หน้าที่: เครื่องมืออเนกประสงค์ (แปลภาษา, จัดการไฟล์รูป, จัดการเวลา)
   ===================================================================== */
console.log("🛠️ [START] โมดูลเริ่มทำงาน: app_utils.js (เครื่องมือพื้นฐาน)");

// 🔗 ประกาศรูปร่างหน้าตาของเหรียญไว้ตรงนี้เลย!
const coinImg = '<img src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" class="coin-icon">';

// ฟังก์ชันดึงข้อความตามภาษาปัจจุบัน (รองรับ ไทย/อังกฤษ)
function getText(obj, currentLang) {
    if (!obj) return "";
    if (typeof obj === 'string') return obj;
    if (Array.isArray(obj)) return obj;
    if (typeof obj === 'object') return obj[currentLang] || obj['th'] || obj['en'] || "";
    return obj;
}

// ฟังก์ชันแปลง Media (SVG, JPG, PNG) สำหรับการแสดงผลเท่านั้น ไม่กระทบ Logic
function parseMedia(text) {
    if (!text) return "";
    let parsed = text;
    
    // 1. รองรับรูปภาพจากการใช้ Shortcode เช่น [img]https://example.com/pic.jpg[/img]
    parsed = parsed.replace(/\[img\](.*?)\[\/img\]/gi, '<img src="$1" style="max-width:100%; max-height:300px; border-radius:10px; margin:10px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1); object-fit:contain; display:inline-block;">');
    
    // 2. รองรับ HTML <img> แท็กแบบตรงๆ
    parsed = parsed.replace(/<img(?!.*max-width)(.*?)>/gi, '<img$1 style="max-width:100%; max-height:300px; border-radius:10px; margin:10px 0; object-fit:contain; display:inline-block;">');

    // 3. ปรับแต่ง SVG ทุกตัวที่ส่งเข้ามาให้เป็น Responsive
    if(parsed.includes('<svg') && !parsed.includes('max-width')) {
        parsed = parsed.replace(/<svg/g, '<svg style="max-width:100%; height:auto; display:block; margin: 10px 0;"');
    }
    
    return parsed;
}

// ฟังก์ชันคำนวณระยะเวลา (เช่น ระยะเวลาที่เริ่มเป็นสมาชิก)
function calculateDuration(startDateObj) {
    const now = new Date();
    let diff = now - startDateObj;
    if (diff < 0) return { y: 0, m: 0, d: 0, h: 0 };
    
    const y = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const m = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const d = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { y, m, d, h };
}

// ฟังก์ชันทำความสะอาดไฟล์ JSON ป้องกันบั๊กอักขระพิเศษ
function sanitizeJSON(str) { 
    return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); 
}

console.log("✅ [SUCCESS] app_utils.js โหลดเสร็จสมบูรณ์!");
/* =====================================================================
   💾 ไฟล์: js/data.js
   หน้าที่: โกดังเก็บข้อมูลตั้งค่าเริ่มต้น, ฐานข้อมูลนักเรียน
   ===================================================================== */

console.log("💾 [START] โมดูลเริ่มทำงาน: data.js (ฐานข้อมูลข้อสอบ)");

// --------------------------------------------------------------------------------
// 👑 1. ข้อมูลระบบและสิทธิ์การเข้าถึงพื้นฐาน
// --------------------------------------------------------------------------------
const masterID = "KruHeng"; 
const initialDateStr = new Date().toISOString();


// --------------------------------------------------------------------------------
// 👥 2. ฐานข้อมูลนักเรียนเริ่มต้น (Default Student DB)
// --------------------------------------------------------------------------------
const defaultStudentDB = {
    "stu01": { pass: "1234", nick: "น้องสตางค์", grade: "ม.3", school: "เบนจะมัยราดชะแลงซะบริด1", note: "สมาชิกรุ่นปาฏิหารย์", permissions: { print: true, shuffle: true, pause: true }, startDate: "2024-01-01", expireDate: "2027-12-31", coins: 0, inventory: {} },
    "stu02": { pass: "1234", nick: "นักเรียน 2", grade: "ม.2", school: "-", note: "-", permissions: { print: false, shuffle: false, pause: false }, startDate: "2024-01-01", expireDate: "2027-12-31", coins: 0, inventory: {} },
    "stu03": { pass: "1234", nick: "นาโน", grade: "ป.4", school: "วัดมือง", note: "โตขึ้นจะเป็นโจรสลัด", permissions: { print: false, shuffle: false, pause: false }, startDate: "2024-01-01", expireDate: "2027-12-31", coins: 0, inventory: {} },
    "stu04": { pass: "1234", nick: "Dragon", grade: "ม.2", school: "เบญ2", note: "Engineer", permissions: { print: false, shuffle: false, pause: false }, startDate: "2024-01-01", expireDate: "2027-12-31", coins: 40000, inventory: {} },
    "NongA": { pass: "112233", nick: "น้องเอ", grade: "ม.1", school: "สาธิตฯ", note: "เด็กปั้นครูเฮง", permissions: { print: true, shuffle: true, pause: true }, startDate: "2024-01-01", expireDate: "2027-12-31", coins: 0, inventory: {} },
    "KruHeng": { pass: "admin999", nick: "ครูเฮง (Master)", grade: "Master", school: "Tutor Dashboard", note: "Super Admin", permissions: { print: true, shuffle: true, pause: true }, startDate: "2024-01-01", expireDate: "2099-12-31", coins: 99999999, inventory: {} }
};

console.log("✅ [SUCCESS] data.js โหลดเสร็จสมบูรณ์!");

/* =====================================================================
   สิ้นสุดไฟล์ data.js
   ===================================================================== */
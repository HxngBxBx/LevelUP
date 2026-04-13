/* =====================================================================
   👥 ไฟล์: js/student.js
   หน้าที่: ระบบจัดการข้อมูลนักเรียน (Student Editor) + คลังชื่อในใจ
   --------------------------------------------------------------------
   📦 ฟังก์ชันที่อยู่ในไฟล์นี้:
     1. renderStudentEditorTable()  - วาดตารางแก้ไขข้อมูลนักเรียน
     2. saveStudentDB()             - เซฟตารางทั้งหมดลง localStorage
     3. attemptSaveStudentDB        - เวอร์ชัน throttle ของ saveStudentDB
     4. addNewStudentRow()          - เพิ่มแถวนักเรียนใหม่ในตาราง
     5. deleteStudentRow(key)       - ลบแถวนักเรียนออกจากตาราง
     6. deleteName(e, name)         - ลบชื่อนักเรียนออกจากคลังชื่อ
     7. saveStudentNameToMemory(name) - บันทึกชื่อนักเรียนเข้าคลังชื่อ

   📦 ตัวแปร global ที่อยู่ในไฟล์นี้:
     - tempStudentDB  (พักข้อมูลตอนแก้ไขในตาราง — ใช้ร่วมกับ ui.js)
     - savedNames     (คลังชื่อนักเรียนที่เคยพิมพ์ — ใช้ร่วมกับ ui.js)

   🔗 Dependencies (ตัวแปร/ฟังก์ชันจากไฟล์อื่น):
     - lang                  (จาก app.js)
     - masterID              (จาก data.js)
     - defaultStudentDB      (จาก data.js)
     - throttleAction()      (จาก auth.js)
     - addLog()              (จาก logs.js หรือ app.js)
     - closeStudentEditor()  (จาก ui.js)
     - applyUserPermissions() (จาก auth.js)
     - renderProfileBadge()  (จาก profile.js)
     - renderServerExamList() (จาก app.js)
     - filterNames()         (จาก ui.js)

   ⚠️ ลำดับโหลดใน index.html: ต้องโหลดหลัง auth.js, profile.js
                                และก่อน app.js
   ===================================================================== */

console.log("🎓 [START] โมดูลเริ่มทำงาน: student.js (ข้อมูลนักเรียนรายบุคคล)");

// --------------------------------------------------------------------------------
// 📦 ตัวแปร Global (ใช้ร่วมกับ ui.js)
// --------------------------------------------------------------------------------
let tempStudentDB = {};                                                  // พักข้อมูลตอนแก้ไขในตาราง
let savedNames = JSON.parse(localStorage.getItem('kruHengNames') || '[]'); // คลังชื่อนักเรียน


// --------------------------------------------------------------------------------
// 📋 1. วาดตารางแก้ไขข้อมูลนักเรียน
// --------------------------------------------------------------------------------
function renderStudentEditorTable() {
    const tbody = document.getElementById('student-editor-body');
    tbody.innerHTML = '';

    for (let key in tempStudentDB) {
        const s = tempStudentDB[key];
        const p = s.permissions || { print: true, shuffle: true, pause: true };
        const stDate = s.startDate || "2024-01-01";
        const exDate = s.expireDate || "2099-12-31";
        const expPts = s.exp || 0;
        const rbrth = s.rebirth || 0;
        const currentCoins = s.coins || 0; // 💰 ดึงยอดเงิน

        tbody.innerHTML += `
            <tr>
                <td><input type="text" class="edit-input edit-user" value="${key}" ${key === masterID ? 'disabled' : ''}></td>
                <td><input type="text" class="edit-input edit-pass" value="${s.pass}"></td>
                <td><input type="text" class="edit-input edit-nick" value="${s.nick}"></td>
                <td>
                    <select class="edit-input edit-grade">
                        <option value="-" ${s.grade === '-' ? 'selected' : ''}>-</option>
                        <option value="ป.1" ${s.grade === 'ป.1' ? 'selected' : ''}>ป.1</option><option value="ป.2" ${s.grade === 'ป.2' ? 'selected' : ''}>ป.2</option><option value="ป.3" ${s.grade === 'ป.3' ? 'selected' : ''}>ป.3</option>
                        <option value="ป.4" ${s.grade === 'ป.4' ? 'selected' : ''}>ป.4</option><option value="ป.5" ${s.grade === 'ป.5' ? 'selected' : ''}>ป.5</option><option value="ป.6" ${s.grade === 'ป.6' ? 'selected' : ''}>ป.6</option>
                        <option value="ม.1" ${s.grade === 'ม.1' ? 'selected' : ''}>ม.1</option><option value="ม.2" ${s.grade === 'ม.2' ? 'selected' : ''}>ม.2</option><option value="ม.3" ${s.grade === 'ม.3' ? 'selected' : ''}>ม.3</option>
                        <option value="ม.4" ${s.grade === 'ม.4' ? 'selected' : ''}>ม.4</option><option value="ม.5" ${s.grade === 'ม.5' ? 'selected' : ''}>ม.5</option><option value="ม.6" ${s.grade === 'ม.6' ? 'selected' : ''}>ม.6</option>
                        <option value="Master" ${s.grade === 'Master' ? 'selected' : ''}>Master</option>
                    </select>
                </td>
                <td><input type="number" class="edit-input edit-exppts" value="${expPts}" style="width: 70px;"></td>
                <td><input type="number" class="edit-input edit-coins" value="${currentCoins}" style="width: 80px; font-weight:bold; color:#ff9800; background:rgba(255,215,0,0.1);"></td>
                <td><input type="number" class="edit-input edit-rebirth" value="${rbrth}" style="width: 60px;"></td>
                <td><input type="text" class="edit-input edit-school" value="${s.school}"></td>
                <td><input type="text" class="edit-input edit-note" value="${s.note}"></td>
                <td><input type="date" class="edit-input edit-start" value="${stDate.split('T')[0]}" ${key === masterID ? 'disabled' : ''} style="font-size:0.75rem;"></td>
                <td><input type="date" class="edit-input edit-exp" value="${exDate.split('T')[0]}" ${key === masterID ? 'disabled' : ''} style="font-size:0.75rem;"></td>
                <td style="text-align: left; font-size: 0.8rem;">
                    <label style="display:flex; align-items:center; gap:5px;"><input type="checkbox" class="cb-perm-print" ${p.print ? 'checked' : ''}> ปริ้นเฉลย</label>
                    <label style="display:flex; align-items:center; gap:5px;"><input type="checkbox" class="cb-perm-shuffle" ${p.shuffle ? 'checked' : ''}> สุ่มข้อ</label>
                    <label style="display:flex; align-items:center; gap:5px;"><input type="checkbox" class="cb-perm-pause" ${p.pause ? 'checked' : ''}> พรางจอ</label>
                </td>
                <td>
                    <button class="btn btn-red" style="padding:4px 8px; border-radius:5px;" onclick="deleteStudentRow('${key}')">🗑️</button>
                </td>
            </tr>
        `;
    }
}


// --------------------------------------------------------------------------------
// 💾 2. เซฟตารางทั้งหมดลง localStorage (มีระบบ throttle กันกดรัวๆ)
// --------------------------------------------------------------------------------
function saveStudentDB() {
    const rows = document.querySelectorAll('#student-editor-body tr');
    let newDB = {};
    let hasError = false;

    rows.forEach(row => {
        const userNode = row.querySelector('.edit-user');
        const passNode = row.querySelector('.edit-pass');
        if (!userNode || !passNode) return;

        const user = userNode.value.trim();
        const pass = passNode.value.trim();

        if (!user || !pass) hasError = true;
        if (user) {
            newDB[user] = {
                pass: pass,
                nick: row.querySelector('.edit-nick') ? row.querySelector('.edit-nick').value.trim() : "",
                grade: row.querySelector('.edit-grade') ? row.querySelector('.edit-grade').value : "-",
                exp: parseInt(row.querySelector('.edit-exppts') ? row.querySelector('.edit-exppts').value : 0) || 0,
                coins: parseInt(row.querySelector('.edit-coins') ? row.querySelector('.edit-coins').value : 0) || 0, // 💰 บันทึกเงิน
                rebirth: parseInt(row.querySelector('.edit-rebirth') ? row.querySelector('.edit-rebirth').value : 0) || 0,
                school: row.querySelector('.edit-school') ? row.querySelector('.edit-school').value.trim() : "-",
                note: row.querySelector('.edit-note') ? row.querySelector('.edit-note').value.trim() : "-",
                startDate: row.querySelector('.edit-start').value,
                expireDate: row.querySelector('.edit-exp').value,
                inventory: tempStudentDB[user]?.inventory || {}, // 🎒 ห้ามลบกระเป๋าเด็กตอนเซฟทับ
                permissions: {
                    print: row.querySelector('.cb-perm-print').checked,
                    shuffle: row.querySelector('.cb-perm-shuffle').checked,
                    pause: row.querySelector('.cb-perm-pause').checked
                }
            };
        }
    });

    if (hasError) {
        alert(lang === 'th' ? "Username และ Password ห้ามเว้นว่าง!" : "Username and Password cannot be empty.");
        return;
    }
    if (!newDB[masterID]) {
        alert(lang === 'th' ? "ห้ามลบ Master ID!" : "Cannot remove Master ID!");
        return;
    }

    addLog(
        lang === 'th' ? "จัดการนักเรียน" : "Manage Students",
        "มาสเตอร์แก้ไข/เพิ่มข้อมูลนักเรียนในระบบ"
    );
    localStorage.setItem('kruHengStudentDB', JSON.stringify(newDB));
    alert(lang === 'th' ? 'บันทึกข้อมูลสำเร็จ!' : 'Data saved successfully!');
    closeStudentEditor();
    applyUserPermissions();
    renderProfileBadge();
    renderServerExamList();
}

// 🛡️ ห่อ saveStudentDB ด้วย throttleAction กันมาสเตอร์กดรัวๆ
const attemptSaveStudentDB = throttleAction(saveStudentDB, 1500);


// --------------------------------------------------------------------------------
// ➕ 3. เพิ่มแถวนักเรียนใหม่ในตาราง
// --------------------------------------------------------------------------------
function addNewStudentRow() {
    let newId = "user_" + Date.now().toString().slice(-4);
    tempStudentDB[newId] = {
        pass: "1234",
        nick: "เด็กใหม่",
        grade: "-",
        school: "-",
        note: "-",
        permissions: { print: true, shuffle: true, pause: true },
        startDate: "2024-01-01",
        expireDate: "2099-12-31"
    };
    renderStudentEditorTable();
}


// --------------------------------------------------------------------------------
// 🗑️ 4. ลบแถวนักเรียนออกจากตาราง (ห้ามลบ Master)
// --------------------------------------------------------------------------------
function deleteStudentRow(key) {
    if (key === masterID) {
        alert(lang === 'th' ? 'ไม่อนุญาตให้ลบ Master ID!' : 'Cannot delete Master ID!');
        return;
    }
    if (confirm(lang === 'th' ? `ยืนยันการลบนักเรียน ${key} ใช่หรือไม่?` : `Delete student ${key}?`)) {
        delete tempStudentDB[key];
        renderStudentEditorTable();
    }
}


// --------------------------------------------------------------------------------
// 🚪 ระบบ Auto-close: คลิกนอก dropdown ชื่อนักเรียน → ปิด dropdown
// --------------------------------------------------------------------------------
document.addEventListener('click', function (e) {
    const wrapper = document.getElementById('name-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        const dropdown = document.getElementById('name-dropdown');
        if (dropdown) dropdown.style.display = 'none';
    }
});


// --------------------------------------------------------------------------------
// ❌ 5. ลบชื่อนักเรียนออกจากคลังชื่อ (autocomplete memory)
// --------------------------------------------------------------------------------
function deleteName(e, name) {
    e.stopPropagation();
    if (confirm(lang === 'th' ? `ลบชื่อ ${name} ออกจากระบบ?` : `Remove ${name} from memory?`)) {
        savedNames = savedNames.filter(n => n !== name);
        localStorage.setItem('kruHengNames', JSON.stringify(savedNames));
        filterNames();
        document.getElementById('student-name-input').focus();
    }
}


// --------------------------------------------------------------------------------
// 💾 6. บันทึกชื่อนักเรียนเข้าคลังชื่อ (เรียกตอนล็อกอิน/เริ่มสอบ)
// --------------------------------------------------------------------------------
function saveStudentNameToMemory(name) {
    name = name.trim();
    if (name && !savedNames.includes(name)) {
        savedNames.push(name);
        localStorage.setItem('kruHengNames', JSON.stringify(savedNames));
    }
}

console.log("✅ [SUCCESS] student.js โหลดเสร็จสมบูรณ์!");

/* =====================================================================
   สิ้นสุดไฟล์ student.js
   ===================================================================== */
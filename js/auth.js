/* =====================================================================
   🖥️ ไฟล์: js/auth.js
   หน้าที่: คุมประตูทางเข้า-ออกของระบบ (Login/Logout), การดึง IP, ระบบจับผิดคนไม่อยู่หน้าจอ (AFK) และระบบตรวจจับอินเทอร์เน็ตหลุด
   ===================================================================== */

console.log("🔐 [START] โมดูลเริ่มทำงาน: auth.js (ระบบยืนยันตัวตน)");

// --------------------------------------------------------------------------------
// 🟢 ซิงค์ฐานข้อมูลนักเรียนอัตโนมัติ (แก้ปัญหาแก้ data.js แล้วล็อคอินไม่ได้)
// --------------------------------------------------------------------------------
(function syncStudentDB() {
    let dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB'));
    if (!dbStudent && typeof defaultStudentDB !== 'undefined') {
        localStorage.setItem('kruHengStudentDB', JSON.stringify(defaultStudentDB));
    } else if (dbStudent && typeof defaultStudentDB !== 'undefined') {
        let isUpdated = false;
        for (let key in defaultStudentDB) {
            // ถ้าเจอนักเรียนคนใหม่ที่ยังไม่มีในระบบ หรือ รหัสผ่านใน data.js ไม่ตรงกับในระบบ
            if (!dbStudent[key]) {
                dbStudent[key] = defaultStudentDB[key]; 
                isUpdated = true;
            } else if (dbStudent[key].pass !== defaultStudentDB[key].pass) {
                dbStudent[key].pass = defaultStudentDB[key].pass; // อัปเดตรหัสผ่านใหม่ให้
                isUpdated = true;
            }
        }
        if (isUpdated) {
            localStorage.setItem('kruHengStudentDB', JSON.stringify(dbStudent));
            console.log("✅ ซิงค์ข้อมูลนักเรียนใหม่จาก data.js เข้าสู่ระบบสำเร็จ!");
        }
    }
})();


// --------------------------------------------------------------------------------
// 1. (ระบบกันกดปุ่มรัวๆ)
// --------------------------------------------------------------------------------
        let isProcessing = false;
        function throttleAction(fn, delay = 1500) {
            return async function(...args) {
                if(isProcessing) return;
                isProcessing = true;
                const activeBtn = document.activeElement;
                let originalText = "";
                
                if(activeBtn && activeBtn.classList.contains('btn')) {
                    originalText = activeBtn.innerHTML;
                    activeBtn.innerText = lang === 'th' ? "⏳ รอสักครู่..." : "⏳ Please wait...";
                    activeBtn.disabled = true;
                }
                
                try {
                    await fn(...args);
                } catch(e) {
                    console.error(e);
                } finally {
                    setTimeout(() => {
                        isProcessing = false;
                        if(activeBtn && activeBtn.classList.contains('btn')) {
                            // 🟢 ส่วนที่แก้ไข: ถ้าเป็นปุ่มโหลดข้อสอบ ให้อัปเดตตัวเลขล่าสุดแทนการคืนค่าเดิม
                            if (activeBtn.id === 'btn-load-server') {
                                if (typeof updateLoadButtonUI === 'function') updateLoadButtonUI();
                            } else {
                                activeBtn.innerHTML = originalText;
                            }
                            activeBtn.disabled = false;
                        }
                    }, delay);
                }
            }
        }
// --------------------------------------------------------------------------------
// 2. 
// --------------------------------------------------------------------------------
        function applyUserPermissions() {
            const role = sessionStorage.getItem('kruHengRole');
            const currentUser = sessionStorage.getItem('kruHengCurrentUser');
            if(!currentUser) return;

            const elPrintAns = document.getElementById('set-print-ans');
            const elPrintLoc = document.getElementById('set-print-ans-loc');
            const elShuffle = document.getElementById('set-shuffle');
            const elPauseHide = document.getElementById('set-pause-hide');

            if (role === 'master') {
                elPrintAns.disabled = false; elPrintLoc.disabled = false;
                elShuffle.disabled = false; elPauseHide.disabled = false;
            } else if (role === 'guest') {
                elPrintAns.value = 'none'; elPrintAns.disabled = true;
                elPrintLoc.disabled = true;
                elShuffle.value = '1'; elShuffle.disabled = true;
                elPauseHide.value = 'true'; elPauseHide.disabled = true;
            } else {
                const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || defaultStudentDB;
                const p = dbStudent[currentUser]?.permissions || { print: false, shuffle: false, pause: false }; 
                
                if(!p.print) { elPrintAns.value = 'none'; elPrintAns.disabled = true; elPrintLoc.disabled = true; } 
                else { elPrintAns.disabled = false; elPrintLoc.disabled = false; }
                
                if(!p.shuffle) { elShuffle.value = '1'; elShuffle.disabled = true; }
                else { elShuffle.disabled = false; }
                
                if(!p.pause) { elPauseHide.value = 'true'; elPauseHide.disabled = true; }
                else { elPauseHide.disabled = false; }
            }
        }

// --------------------------------------------------------------------------------
// 3. 
// --------------------------------------------------------------------------------
        async function fetchIP() {
            try {
                const res = await fetch('https://api.ipify.org?format=json');
                const data = await res.json();
                return data.ip;
            } catch(e) {
                return "Unknown IP";
            }
        }
// --------------------------------------------------------------------------------
// 4. 
// --------------------------------------------------------------------------------
        const attemptLogin = throttleAction(checkLogin, 1500);
// --------------------------------------------------------------------------------
// 5. 
// --------------------------------------------------------------------------------
        async function checkLogin() {
            const user = document.getElementById('login-user').value.trim();
            const pass = document.getElementById('login-pass').value.trim();
            const dbStudent = JSON.parse(localStorage.getItem('kruHengStudentDB')) || defaultStudentDB;
            
            if(dbStudent.hasOwnProperty(user) && dbStudent[user].pass === pass) {
                
                if (user !== masterID && dbStudent[user].expireDate) {
                    const expDate = new Date(dbStudent[user].expireDate);
                    const now = new Date();
                    if (now > expDate) {
                        showLoginError(lang === 'th' ? "❌ ไอดีนี้หมดอายุการใช้งานแล้ว กรุณาติดต่อมาสเตอร์!" : "❌ This account has expired. Please contact Master!");
                        return;
                    }
                }

                // 🌐 สั่งให้ระบบไปดึงเลข IP Address ของเครื่องที่กำลังใช้งาน
                const ip = await fetchIP();

                sessionStorage.setItem('kruHengLoggedIn', 'true');
                sessionStorage.setItem('kruHengCurrentUser', user); 
                sessionStorage.setItem('kruHengRole', user === masterID ? 'master' : 'student');
                
                const nameInput = document.getElementById('student-name-input');
                nameInput.value = dbStudent[user].nick;
                
                if(user === masterID) {
                    nameInput.readOnly = false;
                    nameInput.style.backgroundColor = "var(--bg-color)";
                } else {
                    nameInput.readOnly = true;
                    nameInput.style.backgroundColor = "rgba(0,0,0,0.05)";
                }

                saveStudentNameToMemory(dbStudent[user].nick);
                loadSettings(); 
                applyUserPermissions(); 
                saveSettings(); 
                renderProfileBadge();
                renderServerExamList();
                
                // 📝 บันทึก Log เข้าสู่ระบบ พร้อมกับแนบเลข IP เข้าไปในช่องรายละเอียด
                addLog(lang === 'th' ? "เข้าสู่ระบบ" : "Login", user === masterID ? `มาสเตอร์เข้าสู่ระบบ (IP: ${ip})` : `ผู้ใช้ ${user} เข้าสู่ระบบ (IP: ${ip})`, true); 

                document.getElementById('login-overlay').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('login-overlay').style.display = 'none';
                    document.body.style.overflow = 'auto';
                    loadSessions(); 
                    loadHistory();
                    loadLogs(); 
                }, 300);
            } else {
                showLoginError(lang === 'th' ? "❌ ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง!" : "❌ Invalid Username or Password!");
            }
        }
// --------------------------------------------------------------------------------
// 6. 
// --------------------------------------------------------------------------------
        const attemptGuestLogin = throttleAction(checkGuestLogin, 2000);
// --------------------------------------------------------------------------------
// 7. 
// --------------------------------------------------------------------------------
        async function checkGuestLogin() {
            const name = document.getElementById('guest-name').value.trim();
            const role = document.getElementById('guest-role').value;
            const social = document.getElementById('guest-social').value.trim();
            
            if(!name || !role || !social) {
                showLoginError(lang === 'th' ? "❌ โปรดกรอกข้อมูลพื้นฐานและช่องทางติดต่อให้ครบถ้วน" : "❌ Please fill in all required fields.");
                return;
            }

            const gradeStr = document.getElementById('guest-grade').value || "";
            let extraInfo = `Role: ${role}`;
            if(role === 'นักเรียน' || role === 'student' || role === 'อาจารย์' || role === 'teacher') {
                extraInfo += `, ชั้น: ${gradeStr}, รร: ${document.getElementById('guest-school').value}`;
            } else if (role === 'ผู้ปกครอง' || role === 'parent') {
                extraInfo += `, บุตร: ${document.getElementById('guest-child-name').value}, ชั้น: ${gradeStr}, รร: ${document.getElementById('guest-school').value}`;
            } else if (role === 'อื่นๆ' || role === 'other') {
                extraInfo += `, ข้อมูล: ${document.getElementById('guest-specify').value}`;
            }

            // 🛡️ แจก EXP เริ่มต้นให้ตรงกับระดับชั้นที่ระบุมา
            let startLvl = 1;
            if(gradeStr === 'ป.2') startLvl = 5; if(gradeStr === 'ป.3') startLvl = 10;
            if(gradeStr === 'ป.4') startLvl = 15; if(gradeStr === 'ป.5') startLvl = 20; if(gradeStr === 'ป.6') startLvl = 25;
            if(gradeStr === 'ม.1') startLvl = 30; if(gradeStr === 'ม.2') startLvl = 40; if(gradeStr === 'ม.3') startLvl = 50;
            if(gradeStr === 'ม.4') startLvl = 60; if(gradeStr === 'ม.5') startLvl = 70; if(gradeStr === 'ม.6') startLvl = 80;
            const initExp = getExpForTargetLevel(startLvl);

            const ip = await fetchIP();

            const guestData = { name, role, social, extraInfo, ip, exp: initExp };
            sessionStorage.setItem('kruHengLoggedIn', 'true');
            sessionStorage.setItem('kruHengCurrentUser', 'Guest_' + name); 
            sessionStorage.setItem('kruHengRole', 'guest');
            sessionStorage.setItem('kruHengGuestInfo', JSON.stringify(guestData));
            
            const nameInput = document.getElementById('student-name-input');
            nameInput.value = name;
            nameInput.readOnly = true;
            nameInput.style.backgroundColor = "rgba(0,0,0,0.05)";
            
            saveStudentNameToMemory(name);
            loadSettings(); 
            applyUserPermissions(); 
            saveSettings(); 
            renderProfileBadge();
            renderServerExamList(); 
            
            const logDetail = `ผู้ทดลองใช้: ${name} (${role}) ระดับ: ${gradeStr}, IP: ${ip}`;
            addLog("Guest Login", logDetail, true);

            document.getElementById('login-overlay').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('login-overlay').style.display = 'none';
                document.body.style.overflow = 'auto';
                loadSessions(); 
                loadHistory();
            }, 300);
        }
// --------------------------------------------------------------------------------
// 8. 
// --------------------------------------------------------------------------------
        function logout() {
            if(confirm(lang === 'th' ? "ต้องการออกจากระบบใช่หรือไม่?" : "Are you sure you want to logout?")) {
                addLog(lang === 'th' ? "ออกจากระบบ" : "Logout", `ผู้ใช้ ${sessionStorage.getItem('kruHengCurrentUser')} ออกจากระบบ`, true);
                sessionStorage.removeItem('kruHengLoggedIn');
                sessionStorage.removeItem('kruHengCurrentUser');
                sessionStorage.removeItem('kruHengRole');
                sessionStorage.removeItem('kruHengGuestInfo');
                location.reload();
            }
        }
// --------------------------------------------------------------------------------
// 9. 🧠 ฟังก์ชันคำนวณ EXP เริ่มต้นสำหรับหน้าล็อกอิน Guest
// --------------------------------------------------------------------------------
        function getExpForTargetLevel(targetLevel) {
            let total = 0; let expForNext = 100;
            for(let i=1; i<targetLevel; i++) {
                if (i <= 14) expForNext = 100 + (i * 5);
                else if (i <= 29) expForNext = 300 + ((i-15) * 10);
                else if (i <= 59) expForNext = 800 + ((i-30) * 10);
                else if (i <= 80) expForNext = 1500 + ((i-60) * 15);
                else expForNext = 2000 + ((i-81) * 25);
                total += expForNext;
            }
            return total;
        }

// --------------------------------------------------------------------------------
// 10.🛡️ Security Layer 1: ระบบ Idle Timeout (แก้บั๊กข้อความไม่เด้ง)
// --------------------------------------------------------------------------------
        const IDLE_TIME_MINUTES = 10; // ⚙️ (ทดสอบด้วย 1 นาที)
        let lastActiveTime = Date.now(); 

        function updateActiveTime() {
            lastActiveTime = Date.now();
        }

        ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'].forEach(evt => {
            document.addEventListener(evt, updateActiveTime, { passive: true });
        });

        // ยามเดินตรวจทุก 5 วินาที
        setInterval(() => {
            if (!sessionStorage.getItem('kruHengLoggedIn')) {
                lastActiveTime = Date.now(); 
                return;
            }
            if (Date.now() - lastActiveTime >= IDLE_TIME_MINUTES * 60 * 1000) {
                forceLogoutIdle();
            }
        }, 5000); 

        // ตรวจจับพับหน้าจอ
        document.addEventListener("visibilitychange", () => {
            if (!sessionStorage.getItem('kruHengLoggedIn')) return;

            if (!document.hidden) { // เมื่อเปิดหน้าจอกลับมา
                const idleTime = Date.now() - lastActiveTime;
                if (idleTime >= IDLE_TIME_MINUTES * 60 * 1000) {
                    forceLogoutIdle();
                } else {
                    updateActiveTime();
                }
            }
        });

        // ฟังก์ชันเตะออก
        function forceLogoutIdle() {
            const currentUser = sessionStorage.getItem('kruHengCurrentUser') || 'Unknown';
            const userIP = sessionStorage.getItem('kruHengUserIP') || 'Unknown IP';
            
            // 🚨 ระบบ Auto-Save ฉุกเฉิน
            const quizScreen = document.getElementById('quiz-screen');
            if (quizScreen && quizScreen.style.display === 'block') {
                try {
                    if (typeof attemptSaveSession === 'function') attemptSaveSession(); 
                    addLog(lang === 'th' ? "เซฟข้อสอบฉุกเฉิน" : "Emergency Auto-Save", `ระบบบันทึกข้อสอบอัตโนมัติก่อนหมดเวลาเชื่อมต่อ`, true);
                } catch (e) { console.log(e); }
            }

            // บันทึก Log การเตะออก
            addLog(lang === 'th' ? "หมดเวลาเชื่อมต่อ (AFK)" : "Session Timeout", `ไอดี ${currentUser} ถูกเตะออกเนื่องจากไม่มีการใช้งานเกิน ${IDLE_TIME_MINUTES} นาที (IP: ${userIP})`, true);

            sessionStorage.removeItem('kruHengLoggedIn');
            sessionStorage.removeItem('kruHengCurrentUser');
            sessionStorage.removeItem('kruHengRole');
            sessionStorage.removeItem('kruHengGuestInfo');

            // 🆕 เปลี่ยนจากการใช้ alert ตรงๆ เป็นการ "ฝากสถานะไว้ในเครื่อง" 
            sessionStorage.setItem('kruHengShowTimeoutAlert', 'true');
            location.reload(); // รีเฟรชหน้าเว็บทันที
        }

        // 🆕 เมื่อหน้าเว็บโหลดเสร็จ ให้เช็คว่ามีข้อความฝากไว้ไหม
        window.addEventListener('load', () => {
            if (sessionStorage.getItem('kruHengShowTimeoutAlert')) {
                // หน่วงเวลา 0.5 วินาทีให้หน้าเว็บวาดเสร็จก่อน ค่อยเด้งแจ้งเตือน
                setTimeout(() => {
                    alert(lang === 'th' ? `⏳ หมดเวลาเชื่อมต่อ!\nระบบได้ทำการออกจากระบบอัตโนมัติ\n(ถ้าคุณกำลังทำข้อสอบอยู่ ระบบได้ 'บันทึกความคืบหน้า' ไว้ให้เรียบร้อยแล้ว)` : `⏳ Session Expired!\nYou have been logged out.\n(If you were taking an exam, your progress has been auto-saved.)`);
                    sessionStorage.removeItem('kruHengShowTimeoutAlert'); // ลบข้อความทิ้งเพื่อไม่ให้เด้งซ้ำ
                }, 500);
            }
        });
// --------------------------------------------------------------------------------
// 11. 📡 ระบบตรวจจับอินเทอร์เน็ต (Network Detector)
// --------------------------------------------------------------------------------
        window.addEventListener('offline', () => {
            let offlineBanner = document.getElementById('offline-banner');
            if (!offlineBanner) {
                offlineBanner = document.createElement('div');
                offlineBanner.id = 'offline-banner';
                // ดีไซน์ป้ายแจ้งเตือนฉุกเฉิน
                offlineBanner.style.cssText = "position:fixed; top:0; left:0; width:100%; background:var(--danger, #ff4d4f); color:white; text-align:center; padding:12px; z-index:9999; font-weight:bold; box-shadow:0 4px 10px rgba(0,0,0,0.2); transition: 0.3s; font-size: 0.95rem;";
                document.body.appendChild(offlineBanner);
            }
            offlineBanner.style.background = "var(--danger, #ff4d4f)";
            offlineBanner.innerHTML = lang === 'th' ? 
                "⚠️ สัญญาณอินเทอร์เน็ตขาดหาย! (ไม่ต้องตกใจ คุณสามารถทำข้อสอบต่อได้... ห้ามกดรีเฟรชเด็ดขาด!)" : 
                "⚠️ Internet connection lost! (Don't panic, you can continue. Do NOT refresh the page!)";
            offlineBanner.style.display = 'block';
            
            // แอบบันทึกเหตุการณ์ลงกล้องวงจรปิด
            const currentUser = sessionStorage.getItem('kruHengCurrentUser') || 'Unknown';
            if(sessionStorage.getItem('kruHengLoggedIn')) {
                addLog(lang === 'th' ? "อินเทอร์เน็ตตัด" : "Offline", `ไอดี ${currentUser} สัญญาณอินเทอร์เน็ตขาดหายระหว่างใช้งาน`, true);
            }
        });

        window.addEventListener('online', () => {
            let offlineBanner = document.getElementById('offline-banner');
            if (offlineBanner) {
                offlineBanner.style.background = "#52c41a"; // เปลี่ยนเป็นสีเขียว
                offlineBanner.innerHTML = lang === 'th' ? 
                    "✅ สัญญาณอินเทอร์เน็ตกลับมาแล้ว! ระบบทำงานตามปกติ" : 
                    "✅ Internet restored! System back to normal.";
                
                // ให้ป้ายสีเขียวโชว์ 3 วินาทีแล้วค่อยๆ หายไป
                setTimeout(() => { offlineBanner.style.display = 'none'; }, 3000);
            }
            
            const currentUser = sessionStorage.getItem('kruHengCurrentUser') || 'Unknown';
            if(sessionStorage.getItem('kruHengLoggedIn')) {
                addLog(lang === 'th' ? "อินเทอร์เน็ตปกติ" : "Online", `ไอดี ${currentUser} กลับมาเชื่อมต่ออินเทอร์เน็ตได้แล้ว`, true);
            }
        });

console.log("✅ [SUCCESS] auth.js โหลดเสร็จสมบูรณ์!");

/* =====================================================================
   สิ้นสุดไฟล์ auth.js
   ===================================================================== */
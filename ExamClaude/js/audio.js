/* =====================================================================
   🎵 ไฟล์: js/audio.js
   หน้าที่: จัดการระบบเสียงทั้งหมด (BGM, เอฟเฟกต์ SFX, การปรับระดับเสียง)
   ===================================================================== */
console.log("🎵 [START] โมดูลเริ่มทำงาน: audio.js (ระบบจัดการเสียง)");

// --------------------------------------------------------------------------------
// 1. ประกาศตัวแปรไฟล์เสียงทั้งหมด (อ้างอิงจากโฟลเดอร์ audio/)
// --------------------------------------------------------------------------------
        const sfxCorrect = new Audio('audio/correct.mp3');
        const sfxWrong = new Audio('audio/wrong.mp3');
        const sfxTimeout = new Audio('audio/timeout.mp3');
        const sfxTick = new Audio('audio/tick.mp3');
        
        const menuPlaylist = ['audio/bgm_menu1.mp3']; 
        const quizPlaylist = ['audio/bgm_quiz1.mp3']; 
        let menuBgmIdx = 0; let quizBgmIdx = 0;
        const bgmMenu = new Audio(menuPlaylist[0]); 
        const bgmQuiz = new Audio(quizPlaylist[0]); 
        
// --------------------------------------------------------------------------------
// 2. ฟังก์ชันเล่นเพลง BGM ถัดไป (รองรับการสุ่มเพลง)
// --------------------------------------------------------------------------------
        function playNextBgm(audioObj, playlist, type) {
            const mode = document.getElementById('bgm-play-mode').value;
            if (type === 'menu') {
                menuBgmIdx = mode === 'random' ? Math.floor(Math.random() * playlist.length) : (menuBgmIdx + 1) % playlist.length;
                audioObj.src = playlist[menuBgmIdx];
            } else {
                quizBgmIdx = mode === 'random' ? Math.floor(Math.random() * playlist.length) : (quizBgmIdx + 1) % playlist.length;
                audioObj.src = playlist[quizBgmIdx];
            }
            audioObj.play().catch(e=>{});
        }
        
        // ดักจับเมื่อเพลงจบ ให้เล่นเพลงต่อไปทันที
        bgmMenu.addEventListener('ended', () => playNextBgm(bgmMenu, menuPlaylist, 'menu'));
        bgmQuiz.addEventListener('ended', () => playNextBgm(bgmQuiz, quizPlaylist, 'quiz'));

// --------------------------------------------------------------------------------
// 3. ฟังก์ชันอัปเดตระดับเสียงตามที่ผู้ใช้ตั้งค่า
// --------------------------------------------------------------------------------
        function updateVolume() {
            bgmMenu.volume = document.getElementById('vol-bgm-menu').value;
            bgmQuiz.volume = document.getElementById('vol-bgm-quiz').value;
            sfxCorrect.volume = document.getElementById('vol-sfx-correct').value;
            sfxWrong.volume = document.getElementById('vol-sfx-wrong').value;
            sfxTimeout.volume = document.getElementById('vol-sfx-wrong').value;
            sfxTick.volume = document.getElementById('vol-sfx-tick').value;
        }

// --------------------------------------------------------------------------------
// 4. ฟังก์ชันทดสอบเสียง (ปุ่มหน้าตั้งค่า)
// --------------------------------------------------------------------------------
        function testVolume() {
            const testC = document.getElementById('set-sfx-correct').value === 'true';
            const testW = document.getElementById('set-sfx-wrong').value === 'true';
            const testT = document.getElementById('set-sfx-tick').value === 'true';
            
            if (testC) { sfxCorrect.currentTime = 0; sfxCorrect.play().catch(e=>{}); } 
            else if (testW) { sfxWrong.currentTime = 0; sfxWrong.play().catch(e=>{}); } 
            else if (testT) { sfxTick.currentTime = 0; sfxTick.play().catch(e=>{}); } 
            else { alert(lang === 'th' ? "กรุณาเปิดเอฟเฟกต์อย่างน้อย 1 อันก่อนกดทดสอบครับ" : "Please enable at least one Sound Effect to test."); }
        }

// --------------------------------------------------------------------------------
// 5. ฟังก์ชันเปิด/ปิด BGM หน้าเมนู
// --------------------------------------------------------------------------------
        function toggleBgmMenu() {
            if (document.getElementById('set-bgm-menu').value === 'true' && document.getElementById('setup-screen').style.display !== 'none') {
                bgmMenu.play().catch(e => {}); 
            } else { bgmMenu.pause(); }
        }
        
        // บังคับเล่นเสียงครั้งแรกเมื่อผู้ใช้คลิกหน้าจอ (นโยบายเบราว์เซอร์)
        document.body.addEventListener('click', () => { toggleBgmMenu(); }, {once: true});

console.log("✅ [SUCCESS] audio.js โหลดเสร็จสมบูรณ์!");

/* =====================================================================
   สิ้นสุดไฟล์ audio.js
   ===================================================================== */
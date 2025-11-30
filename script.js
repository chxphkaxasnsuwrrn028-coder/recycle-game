// Waste Data
const wasteItems = [
    // Yellow: Recycle (ขยะรีไซเคิล)
    { name: "ขวดพลาสติก", icon: "🍾", type: "yellow" },
    { name: "กระดาษ", icon: "📄", type: "yellow" },
    { name: "กล่องลัง", icon: "📦", type: "yellow" },
    { name: "กระป๋องน้ำอัดลม", icon: "🥫", type: "yellow" },
    { name: "ขวดแก้ว", icon: "🍶", type: "yellow" },
    { name: "หนังสือพิมพ์", icon: "📰", type: "yellow" },
    { name: "นิตยสาร", icon: "📚", type: "yellow" },
    { name: "กล่องนม UHT", icon: "🧃", type: "yellow" },
    { name: "แก้วพลาสติก", icon: "🥤", type: "yellow" },
    { name: "ขวดแชมพู", icon: "🧴", type: "yellow" },

    // Green: Organic (ขยะเปียก)
    { name: "เศษอาหาร", icon: "🍖", type: "green" },
    { name: "เปลือกกล้วย", icon: "🍌", type: "green" },
    { name: "ก้างปลา", icon: "🐟", type: "green" },
    { name: "ใบไม้แห้ง", icon: "🍂", type: "green" },
    { name: "เปลือกไข่", icon: "🥚", type: "green" },
    { name: "เปลือกผลไม้", icon: "🍎", type: "green" },
    { name: "เศษผัก", icon: "🥬", type: "green" },
    { name: "ดอกไม้เหี่ยว", icon: "🥀", type: "green" },
    { name: "เศษขนมปัง", icon: "🍞", type: "green" },
    { name: "กระดูกไก่", icon: "🍗", type: "green" },

    // Blue: General (ขยะทั่วไป)
    { name: "ถุงพลาสติกเปื้อน", icon: "🛍️", type: "blue" },
    { name: "ซองขนม", icon: "🍟", type: "blue" },
    { name: "โฟมใส่อาหาร", icon: "🥡", type: "blue" },
    { name: "ทิชชู่ใช้แล้ว", icon: "🧻", type: "blue" },
    { name: "หลอดพลาสติก", icon: "🥤", type: "blue" },
    { name: "ซองลูกอม", icon: "🍬", type: "blue" },
    { name: "ซองบะหมี่", icon: "🍜", type: "blue" },
    { name: "ช้อนส้อมพลาสติก", icon: "🍴", type: "blue" },
    { name: "ปากกา", icon: "🖊️", type: "blue" },
    { name: "แปรงสีฟันเก่า", icon: "🪥", type: "blue" },

    // Red: Hazardous (ขยะอันตราย)
    { name: "ถ่านไฟฉาย", icon: "🔋", type: "red" },
    { name: "หลอดไฟ", icon: "💡", type: "red" },
    { name: "กระป๋องสเปรย์", icon: "🧴", type: "red" },
    { name: "ยาหมดอายุ", icon: "💊", type: "red" },
    { name: "แบตเตอรี่มือถือ", icon: "📱", type: "red" },
    { name: "กระป๋องสี", icon: "🎨", type: "red" },
    { name: "สเปรย์ฆ่าแมลง", icon: "🦟", type: "red" },
    { name: "กาว", icon: "🧪", type: "red" },
    { name: "ปรอทวัดไข้", icon: "🌡️", type: "red" },
    { name: "น้ำยาทำความสะอาด", icon: "🚽", type: "red" }
];

// Game State
let currentItem = null;
let score = 0;
let timeLeft = 60;
let timerInterval;
let isPlaying = false;

// DOM Elements
const wasteNameEl = document.getElementById('waste-name');
const wasteIconEl = document.getElementById('waste-icon');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const overlay = document.getElementById('overlay');
const titleMsg = document.getElementById('title-msg');
const descMsg = document.getElementById('desc-msg');
const startBtn = document.getElementById('start-btn');
const wasteItemContainer = document.getElementById('waste-item');

let currentMode = 'solo';
const rewardModal = document.getElementById('reward-modal');
const rewardMsg = document.getElementById('reward-msg');
const feedbackIcon = document.getElementById('feedback-icon');

function startGame(mode) {
    currentMode = mode;
    score = 0;
    timeLeft = 60; // Or maybe longer for high scores? Let's keep 60 for now, but maybe add time on correct answer?
    // To reach 500 points in 60s is hard (50 correct answers). 
    // Let's add time bonus for correct answer to make it possible.
    
    isPlaying = true;
    scoreEl.innerText = score;
    timerEl.innerText = timeLeft;
    overlay.classList.remove('active');
    
    // Play Music
    const audio = document.getElementById('bg-music');
    audio.volume = 0.3; 
    audio.play().catch(e => console.log("Audio play failed:", e));
    
    nextItem();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    overlay.classList.add('active');
    titleMsg.innerText = "จบเกม! 🎉";
    descMsg.innerText = `คุณทำได้ ${score} คะแนน - เลือกโหมดเพื่อเล่นอีกครั้ง`;
}

function nextItem() {
    const randomIndex = Math.floor(Math.random() * wasteItems.length);
    currentItem = wasteItems[randomIndex];
    
    wasteNameEl.innerText = currentItem.name;
    wasteIconEl.innerText = currentItem.icon;
    
    // Reset animation
    wasteItemContainer.classList.remove('waste-bounce');
    void wasteItemContainer.offsetWidth; // Trigger reflow
    wasteItemContainer.classList.add('waste-bounce');
}

function checkAnswer(color) {
    if (!isPlaying) return;

    if (color === currentItem.type) {
        // Correct
        score += 10;
        scoreEl.innerText = score;
        
        // Time Bonus (to help reach 500)
        timeLeft += 2; 
        timerEl.innerText = timeLeft;

        // Visual Feedback
        showFeedback(true);
        triggerFireworks();
        
        // Check Rewards (100, 200, 300, 400, 500)
        if (score > 0 && score % 100 === 0 && score <= 500) {
            showReward(score);
        }
        
        wasteItemContainer.classList.add('correct');
        setTimeout(() => wasteItemContainer.classList.remove('correct'), 500);
        
        nextItem();
    } else {
        // Wrong
        timeLeft = Math.max(0, timeLeft - 5);
        timerEl.innerText = timeLeft;
        
        // Visual Feedback
        showFeedback(false);
        
        wasteItemContainer.classList.add('wrong');
        setTimeout(() => wasteItemContainer.classList.remove('wrong'), 500);
    }
}

function showReward(currentScore) {
    // Pause Game
    isPlaying = false;
    clearInterval(timerInterval);
    
    let message = "";
    if (currentMode === 'teacher') {
        message = "ไปเอาขนมกับคุณครู";
    } else if (currentMode === 'solo') {
        message = "เก่งมากเลยๆ ไปขอขนมจากผู้ปกครองได้เลย";
    } else if (currentMode === 'friends') {
        message = "ไปเอาขนมกับเพื่อนคุณ";
    }
    
    rewardMsg.innerText = message;
    rewardModal.classList.add('active');
    
    // More Fireworks!
    triggerFireworks();
    setTimeout(triggerFireworks, 300);
    setTimeout(triggerFireworks, 600);
}

function closeReward() {
    rewardModal.classList.remove('active');
    isPlaying = true;
    startTimer();
}

// ... (showFeedback, triggerFireworks remain same)

function showFeedback(isCorrect) {
    feedbackIcon.innerText = isCorrect ? "✅" : "❌";
    feedbackIcon.classList.remove('animate-feedback');
    void feedbackIcon.offsetWidth; // Trigger reflow
    feedbackIcon.classList.add('animate-feedback');
}

function triggerFireworks() {
    const duration = 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

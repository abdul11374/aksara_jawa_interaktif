// 📜 Daftar huruf Aksara Jawa (ganti gambar sesuai file kamu)
const aksaraList = [
  { name: "Ha", img: "img/ha.jpg" },
  { name: "Na", img: "img/na.jpg" },
  { name: "Ca", img: "img/ca.jpg" },
  { name: "Ra", img: "img/ra.jpg" },
  { name: "Ka", img: "img/ka.jpg" },
  { name: "Da", img: "img/da.jpg" },
  { name: "Ta", img: "img/ta.jpg" },
  { name: "Sa", img: "img/sa.jpg" },
  { name: "Wa", img: "img/wa.jpg" },
  { name: "La", img: "img/la.jpg" },
  { name: "Ma", img: "img/ma.jpg" },
  { name: "Ga", img: "img/ga.jpg" },
  { name: "Ba", img: "img/ba.jpg" },
  { name: "Tha", img: "img/tha.jpg" },
  { name: "Nga", img: "img/nga.jpg" }
];

const heroImage = document.getElementById("hero-image");
const options = [
  document.getElementById("option1"),
  document.getElementById("option2"),
  document.getElementById("option3")
];
const result = document.getElementById("result");
const scoreEl = document.getElementById("score");
const roundEl = document.getElementById("round");
const timeLeftEl = document.getElementById("time-left");
const restartBtn = document.getElementById("restart-btn");

// 🔊 Suara (pastikan file ada di folder sounds)
const soundCorrect = new Audio("sounds/benar.mp3");
const soundWrong = new Audio("sounds/salah.mp3");
const soundTimeUp = new Audio("sounds/timeup.mp3");

// Variabel permainan
let currentAksara;
let score = 0;
let round = 0;
let timeLeft = 10;
let timer;
let gameActive = true;

// Ambil skor tertinggi dari localStorage
let highScore = localStorage.getItem("highScoreAksara") || 0;

// Tampilkan skor tertinggi di halaman
const highScoreDisplay = document.createElement("p");
highScoreDisplay.textContent = "🏆 Skor Tertinggi: " + highScore;
highScoreDisplay.style.marginTop = "10px";
highScoreDisplay.style.fontWeight = "bold";
document.querySelector(".score").appendChild(highScoreDisplay);

// Acak urutan soal supaya tidak selalu sama
const shuffledAksara = aksaraList.sort(() => 0.5 - Math.random());

// Buat pilihan acak (1 benar + 2 salah)
function getOptions(correctAksara) {
  let wrong = aksaraList.filter(h => h.name !== correctAksara.name);
  wrong = wrong.sort(() => 0.5 - Math.random()).slice(0, 2);
  const allOptions = [...wrong, correctAksara].sort(() => 0.5 - Math.random());
  return allOptions;
}

// Jalankan ronde baru
function nextRound() {
  if (!gameActive) return;

  if (round >= shuffledAksara.length) {
    endGame();
    return;
  }

  currentAksara = shuffledAksara[round];
  round++;
  roundEl.textContent = round;
  result.textContent = "";

  heroImage.classList.remove("show");

  setTimeout(() => {
    heroImage.src = currentAksara.img;
    heroImage.classList.add("show");

    const opts = getOptions(currentAksara);
    options.forEach((btn, i) => {
      btn.textContent = opts[i].name;
      btn.onclick = () => checkAnswer(opts[i].name);
    });

    resetTimer();
  }, 300);
}

// Cek jawaban
function checkAnswer(answer) {
  if (!gameActive) return;

  clearInterval(timer);

  if (answer === currentAksara.name) {
    score++;
    result.textContent = "✅ Benar! Itu huruf " + currentAksara.name + "!";
    soundCorrect.play();
  } else {
    result.textContent = "❌ Salah! Jawaban benar: " + currentAksara.name;
    soundWrong.play();
  }

  scoreEl.textContent = score;

  // Cek dan simpan skor tertinggi
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScoreAksara", highScore);
    highScoreDisplay.textContent = "🏆 Skor Tertinggi: " + highScore;
  }

  setTimeout(nextRound, 1500);
}

// Timer 10 detik
function resetTimer() {
  clearInterval(timer);
  timeLeft = 10;
  timeLeftEl.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timeLeftEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      result.textContent = "⏰ Waktu habis! Jawaban: " + currentAksara.name;
      soundTimeUp.play();
      setTimeout(nextRound, 1500);
    }
  }, 1000);
}

// Selesai permainan
function endGame() {
  gameActive = false;
  clearInterval(timer);
  result.textContent = `🎯 Permainan selesai! Skor akhir kamu: ${score} / ${aksaraList.length}`;
  restartBtn.classList.remove("hidden");
}

// Tombol restart
restartBtn.addEventListener("click", startGame);

function startGame() {
  score = 0;
  round = 0;
  gameActive = true;
  restartBtn.classList.add("hidden");
  scoreEl.textContent = score;
  result.textContent = "";
  // acak ulang urutan soal saat main lagi
  shuffledAksara.sort(() => 0.5 - Math.random());
  nextRound();
}

// Jalankan pertama kali
startGame();

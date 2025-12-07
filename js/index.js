const videoEle = document.querySelector(".video");
const startEle = document.querySelector(".start-card");
const gameEle = document.querySelector(".game");
const endEle = document.querySelector(".end-card");
const scoreEle = document.querySelectorAll(".score");
const timeEle = document.querySelector(".time");
const logosContainer = document.querySelectorAll(".logos-container > img");
const bodyEle = document.querySelector(".body");
const footEle = document.querySelector(".foot");
const imgEle = document.querySelectorAll(".im");
const blocks = document.querySelectorAll(".container-block > div");
const video = document.querySelector("video");
const volume = document.querySelector(".volume");

const characterOrder = ["cloe", "yasmina", "sasha"];

const srcVideo = {
  vertical: ["vertical-v1", "vertical-v2"],
  horizontal: ["horizontal-v1", "horizontal-v2"],
};
const linkFor = [
  "all-bratz",
  "back",
  "cloe-body",
  "cloe-foot",
  "cloe-head",
  "cloe-logo",
  "yasmina-body",
  "yasmina-foot",
  "yasmina-head",
  "yasmina-logo",
  "sasha-body",
  "sasha-foot",
  "sasha-head",
  "sasha-logo",
  "logo",
];
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
linkFor.forEach((e) => {
  let link = document.createElement("link");
  link.as = "image/png";
  link.rel = "preload";
  link.type = "png";
  link.href = `assets/image/${e}.png`;
  document.head.appendChild(link);
});
let newShuffleArr = shuffle(characterOrder);
let currentIndex = 0;

let current = newShuffleArr[currentIndex];
let score = 0;
let timer = 30;
let timerInterval;
let windowHeight = window.innerHeight <= 400;
let currentVolume = false;
let solvedParts = { head: false, body: false, foot: false };
let readyToCheck = false;

[...srcVideo.horizontal, ...srcVideo.vertical].forEach((e) => {
  let link = document.createElement("link");
  link.as = "video";
  link.rel = "preload";
  link.href = `assets/video/${e}.mp4`;
  document.head.appendChild(link);
});
function updateScore() {
  scoreEle.forEach((el) => (el.textContent = score));
}

function updateVolume() {
  volume.innerHTML = "";
  if (!currentVolume) {
    currentVolume = true;
    video.muted = false;
    volume.innerHTML += `<i class="bi bi-volume-up-fill"></i>`;
  } else {
    volume.innerHTML += `<i class="bi bi-volume-mute-fill"></i>`;
    currentVolume = false;
    video.muted = true;
  }
}

function updateLogo() {
  logosContainer.forEach((logo) => {
    logo.classList.remove("active");
    if (logo.classList.contains(current)) {
      logo.classList.add("active");
    }
  });
}

function nextCharacter() {
  currentIndex = (currentIndex + 1) % characterOrder.length;
  current = characterOrder[currentIndex];
  solvedParts = { head: false, body: false, foot: false };
  updateLogo();
  randomizeBlockScrolls();
  console.log("nextCharacter");
}

function randomizeBlockScrolls() {
  console.log("randomsizeBlockScrolls");

  readyToCheck = false;
  blocks.forEach((block) => {
    const items = [...block.querySelectorAll("img")];

    items.sort(() => Math.random() - 5.3);
    block.innerHTML = "";
    items.forEach((img) => block.appendChild(img));

    const blockWidth = block.clientWidth;
    const maxScroll = block.scrollWidth - blockWidth - 150;
    block.scrollLeft = Math.floor(Math.random() * maxScroll);
  });
  setTimeout(() => {
    readyToCheck = true;
    console.log("reski");
  }, 500);
}

function applyState() {
  blocks.forEach((block) => {
    const items = [...block.querySelectorAll("img")];
    items.sort(() => Math.random() - 0.2);
    block.innerHTML = "";
    items.forEach((img) => block.appendChild(img));
    console.log("reski2");
  });
  updateLogo(current);
  randomizeBlockScrolls();
  console.log("applyState()");
}

blocks.forEach((block) => {
  let timeout;

  block.addEventListener("scroll", () => {
    if (!readyToCheck) return;
    clearTimeout(timeout);
    console.log("face");

    timeout = setTimeout(() => {
      const imgs = [...block.querySelectorAll("img")];
      const blockRect = block.getBoundingClientRect();
      const centerX = blockRect.left + blockRect.width / 2;

      let closest = null;
      let minDist = Infinity;

      imgs.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const imgCenter = rect.left + rect.width / 2;
        const dist = Math.abs(imgCenter - centerX);

        if (dist < minDist) {
          minDist = dist;
          closest = img;
          console.log("dist");
        }
      });

      if (!closest) return;

      const rect = closest.getBoundingClientRect();
      const imgCenter = rect.left + rect.width / 2;
      const offset = imgCenter - centerX + block.scrollLeft;

      block.scrollTo({
        left: offset,
        behavior: "smooth",
      });

      const part = closest.dataset.el;
      const isCorrect = closest.src.includes(current);

      solvedParts[part] = isCorrect;

      console.log(isCorrect);
      
      if (solvedParts.head && solvedParts.body && solvedParts.foot) {
        score++;
        updateScore();
        solvedParts = { head: false, body: false, foot: false };
        nextCharacter();
        console.log("solved");

        randomizeBlockScrolls();
      }
      if (score === 3) {
        setTimeout(() => {
          finishGame();
        }, 100);
      }
    }, 500);
  });
});

function finishGame() {
  gameEle.classList.add("hidden");
  endEle.classList.remove("hidden");
  clearInterval(timerInterval);
}

function startGame() {
  console.log("startGame");
  solvedParts = { head: false, body: false, foot: false };
  timeEle.textContent = timer;
  score = 0;
  updateScore();
  applyState();
  startEle.classList.add("hidden");
  gameEle.classList.remove("hidden");
  timerInterval = setInterval(() => {
    if (timer > 0) {
      timer--;
      timeEle.textContent = timer;
    } else {
      finishGame();
      clearInterval(timerInterval);
    }
  }, 1000);
}

function playAgain() {
  console.log("playAgain");
  score = 0;
  updateScore();
  startEle.classList.add("hidden");
  gameEle.classList.remove("hidden");
  endEle.classList.add("hidden");
  timer = 30;
  timeEle.textContent = timer;
  updateLogo(current);
  startGame();
}

function randomVideo() {
  if (windowHeight) {
    video.src = `assets/video/${
      srcVideo.horizontal[Math.floor(Math.random() * 2)]
    }.mp4`;
  } else {
    video.src = `assets/video/${
      srcVideo.vertical[Math.floor(Math.random() * 2)]
    }.mp4`;
    console.log(Math.floor(Math.random() * 2));
  }
  video.load();
  video.play();
}
function endedVideo() {
  videoEle.classList.add("hidden");
  startEle.classList.remove("hidden");
}
document.addEventListener("DOMContentLoaded", randomVideo);
video.addEventListener("ended", endedVideo);

randomVideo();

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

const characters = [
  "cloe",
  "yasmina",
  "sasha",
  "cloe",
  "yasmina",
  "sasha",
  "cloe",
  "yasmina",
  "sasha",
];
const srcVideo = {
  vertical: ["vertical-v1", "vertical-v2"],
  horizontal: ["horizontal-v1", "horizontal-v2"],
};

let current = "";
let score = 0;
let hitCount = 0;
let timer = 20;
let timerInterval;
let lastHitPart = new Set();

function updateScore() {
  scoreEle.forEach((el) => (el.textContent = score));
}

function randomState() {
  return characters[Math.floor(Math.random() * characters.length)];
}

function randomizeBlockScrolls() {
  blocks.forEach((block) => {
    const blockWidth = block.clientWidth;
    const items = [...block.querySelectorAll("img")];
    const target = items.find((img) => img.src.includes(current));

    if (target) {
      const targetPos = target.offsetLeft;
      const maxScroll = block.scrollWidth - blockWidth;
      let scrollPos;

      if (targetPos < blockWidth / 2) {
        scrollPos = targetPos + blockWidth;
      } else if (targetPos > maxScroll - blockWidth / 2) {
        scrollPos = targetPos - blockWidth;
      } else {
        scrollPos =
          Math.random() < 0.5
            ? targetPos - blockWidth / 2
            : targetPos + blockWidth / 2;
      }

      scrollPos = Math.max(0, Math.min(maxScroll, scrollPos));
      block.scrollLeft = scrollPos;
    } else {
      block.scrollLeft = Math.floor(
        Math.random() * (block.scrollWidth - blockWidth)
      );
    }
  });
}

function applyState() {
  current = randomState();
  hitCount = 0;
  lastHitPart.clear();
  console.log("🎯 Новый персонаж:", current);

  blocks.forEach((block) => {
    const items = [...block.querySelectorAll("img")];
    items.sort(() => Math.random() - 0.5);
    block.innerHTML = "";
    items.forEach((img) => block.appendChild(img));
  });

  randomizeBlockScrolls();
}

blocks.forEach((block) => {
  let timeout;
  block.addEventListener("scroll", () => {
    clearTimeout(timeout);
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
        }
      });

      if (!closest) return;

      // closest.scrollIntoView({ behavior: "smooth", inline: "center" });
      closest.classList.add("actives");
      const char = characters.find((c) => closest.src.includes(c));
      if (char === current && !lastHitPart.has(closest)) {
        lastHitPart.add(closest);
        score++;
        updateScore();
        if (score >= blocks.length) {
          setTimeout(() => {
            finishGame();
          }, 2000);
        }
      }
    }, 150);
  });
});

function finishGame() {
  gameEle.classList.add("hidden");
  endEle.classList.remove("hidden");
}

function startGame() {
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

  logosContainer.forEach((e) => {
    if (e.classList.contains(`${current}`)) {
      e.classList.add("active");
    }
  });
}
function playAgain() {
  score = 0;
  updateScore();
  startEle.classList.add("hidden");
  gameEle.classList.remove("hidden");
  endEle.classList.add("hidden");
  timer = 20;
  timeEle.textContent = timer;
  logosContainer.forEach((e) => {
    if (e.classList.contains(`${current}`)) {
      e.classList.add("active");
    }
  });

  applyState();
}

// function randomVideo() {
//   if (windowHeight) {
//     video.src = `assets/video/${
//       srcVideo.horizontal[Math.floor(Math.random() * 2)]
//     }.mp4`;
//   } else {
//     video.src = `assets/video/${
//       srcVideo.vertical[Math.floor(Math.random() * 2)]
//     }.mp4`;
//     console.log(Math.floor(Math.random() * 2));
//   }
//   video.load();
//   video.play();
// }
// function endedVideo() {
//   videoEle.classList.add("hidden");
//   startEle.classList.remove("hidden");
// }
// document.addEventListener("DOMContentLoaded", randomVideo);
// video.addEventListener("ended", endedVideo);

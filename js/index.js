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
const logos = document.querySelector(".logos");

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
linkFor.forEach((e) => {
  let link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = `assets/image/${e}.png`;
  document.head.appendChild(link);
});

let score = 0;
let timer = 30;
let timerInterval;
let windowHeight = window.innerHeight <= 400;
let currentVolume = false;
let readyToCheck = false;
let isShuffling = false;
let isCooldown = false;
const holdMs = 1600;
const shuffleSettlingMs = 300;

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

function updateLogo(name) {
  logosContainer.forEach((logo) => {
    logo.classList.remove("active");
    if (logo.classList.contains(name)) {
      logo.classList.add("active");
    } else {
      logos.classList.add("hidden");
    }
  });
}

function randomizeBlockScrolls() {
  isShuffling = true;
  readyToCheck = false;

  blocks.forEach((block) => {
    const items = [...block.querySelectorAll("img")];

    items.sort(() => Math.random() - 0.5);

    block.innerHTML = "";
    items.forEach((img) => block.appendChild(img));

    const blockWidth = block.clientWidth;
    const maxScroll = block.scrollWidth - blockWidth;
    block.scrollLeft = Math.random() * maxScroll;
  });
  setTimeout(() => {
    isShuffling = false;
    readyToCheck = true;
    console.log("true");
  }, shuffleSettlingMs);
}

function getCollectedCharacter() {
  const collectedParts = [];

  for (const block of blocks) {
    const imgs = [...block.querySelectorAll("img")];
    if (imgs.length === 0) return null;

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

    if (!closest) {
      console.warn("Не найден closest в блоке", block);
      return null;
    }
    const rect = closest.getBoundingClientRect();
    const imgCenter = rect.left + rect.width / 2;
    const offset = imgCenter - centerX + block.scrollLeft;

    block.scrollTo({
      left: offset,
      behavior: "smooth",
    });

    const src = closest.src || "";
    collectedParts.push(src);
  }

  if (collectedParts.length === 0) return null;

  const check = (name) => collectedParts.every((s) => s.includes(name));
  if (check("cloe")) return "cloe";
  if (check("yasmina")) return "yasmina";
  if (check("sasha")) return "sasha";

  return null;
}

blocks.forEach((block) => {
  let timeout;

  block.addEventListener("scroll", () => {
    if (!readyToCheck) return;
    if (isShuffling) return;
    if (isCooldown) return;

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      const collected = getCollectedCharacter();

      if (collected) {
        isCooldown = true;
        readyToCheck = false;
        score++;
        updateScore();
        updateLogo(collected);
        setTimeout(() => {
          isCooldown = false;
          randomizeBlockScrolls();
        }, holdMs);
      } else {
        console.log(Error.name);
      }
      if (score === 3) {
        setTimeout(() => finishGame(), 200);
      }
    }, 200);
  });
});

function finishGame() {
  gameEle.classList.add("hidden");
  endEle.classList.remove("hidden");
  clearInterval(timerInterval);
}

function startGame() {
  timeEle.textContent = timer;
  randomizeBlockScrolls();
  logos.classList.remove("hidden");
  score = 0;
  updateScore();
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
  score = 0;
  updateScore();
  startEle.classList.add("hidden");
  gameEle.classList.remove("hidden");
  endEle.classList.add("hidden");
  timer = 30;
  timeEle.textContent = timer;
  logosContainer.forEach((e) => {
    e.classList.remove("active");
  });
  logos.classList.remove("hidden");
  startGame();
}
window.addEventListener("load", () => {
  readyToCheck = false;
  isShuffling = false;
  isCooldown = false;
});

function randomVideo() {
  if (windowHeight) {
    video.src = `assets/video/${
      srcVideo.horizontal[Math.floor(Math.random() * 2)]
    }.mp4`;
  } else {
    video.src = `assets/video/${
      srcVideo.vertical[Math.floor(Math.random() * 2)]
    }.mp4`;
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
document.addEventListener("resize", randomVideo);

randomVideo();

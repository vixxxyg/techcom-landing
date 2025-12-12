/* ============================================================
   PAGES (фон + картинка в сфере + машина сбоку)
============================================================ */
const pages = [
  {
    bubbleImage: "bw4.png",
    machineImage: "eqp7.png",
    background: { start: "#1a1206", end: "#050505" }
  },
  {
    bubbleImage: "bw2.png",
    machineImage: "eqp10.png",
    background: { start: "#0f0e22", end: "#04040e" }
  },
  {
    bubbleImage: "bw6.png",
    machineImage: "eqp6.png",
    background: { start: "#1a0e09", end: "#040200" }
  }
];

/* ============================================================
   ELEMENTS
============================================================ */
const bubbleImgPrimary = document.getElementById("bw-img-primary");
const bubbleImgSecondary = document.getElementById("bw-img-secondary");
const sideMachine = document.getElementById("side-machine");
const root = document.documentElement;

const hand = document.getElementById("hand");
const arrowLeft = document.getElementById("arrow-left");
const arrowRight = document.getElementById("arrow-right");

const introText = document.getElementById("intro-text");

/* ============================================================
   STATE
============================================================ */
let currentIndex = 0;
let isPrimaryVisible = true;
const BUBBLE_FADE_DELAY = 700;

let autoMode = true;
let AUTO_DELAY = 4000;

/* ============================================================
   INTRO TEXT ANIMATION
============================================================ */
function runIntro() {
  introText.classList.add("show");

  setTimeout(() => {
    introText.classList.add("hide");
  }, 1800);
}

/* ============================================================
   BUBBLE IMAGE SWITCH
============================================================ */
function updateBubbleImage(src) {
  const incoming = isPrimaryVisible ? bubbleImgSecondary : bubbleImgPrimary;
  const outgoing = isPrimaryVisible ? bubbleImgPrimary : bubbleImgSecondary;

  const reveal = () => {
    incoming.classList.add("bubble-img--visible");
    outgoing.classList.remove("bubble-img--visible");
    isPrimaryVisible = !isPrimaryVisible;
  };

  const onReady = () => requestAnimationFrame(reveal);

  if (incoming.src.endsWith(src) && incoming.complete) {
    onReady();
    return;
  }

  incoming.addEventListener("load", onReady, { once: true });

  if (!incoming.src.endsWith(src)) {
    incoming.src = src;
  }
}

/* ============================================================
   BACKGROUND SWITCH
============================================================ */
function updateBackground(colors) {
  root.style.setProperty("--bg-start", colors.start);
  root.style.setProperty("--bg-end", colors.end);
}

/* ============================================================
   APPLY PAGE
============================================================ */
function setScene(page) {
  updateBackground(page.background);
  sideMachine.src = page.machineImage;
}

/* ============================================================
   FIXED MACHINE ANIMATION RESET
============================================================ */
function startMachineAnimation() {
  sideMachine.classList.remove("fly");

  // надёжный перезапуск CSS-анимации
  sideMachine.getBoundingClientRect();

  requestAnimationFrame(() => {
    sideMachine.classList.add("fly");
  });
}

/* ============================================================
   RUN A FULL CYCLE
============================================================ */
function runCycle(page, { fadeDelay = BUBBLE_FADE_DELAY } = {}) {
  setScene(page);

  setTimeout(() => {
    updateBubbleImage(page.bubbleImage);
  }, fadeDelay);

  startMachineAnimation();
}

/* ============================================================
   AFTER MACHINE EXIT — LOAD NEXT PAGE
============================================================ */
function handleMachineAnimationEnd() {
  currentIndex = (currentIndex + 1) % pages.length;
  runCycle(pages[currentIndex]);
}

sideMachine.addEventListener("animationend", handleMachineAnimationEnd);

/* ============================================================
   HAND ANIMATION
============================================================ */
function showHandSmooth() {
  hand.classList.add("hand-enter");
}

function tapHand() {
  hand.classList.add("tap");
  arrowRight.classList.add("simulate-hover");

  setTimeout(() => {
    hand.classList.remove("tap");
    arrowRight.classList.remove("simulate-hover");
  }, 300);
}

/* ============================================================
   NEXT MACHINE
============================================================ */
function goNext() {
  tapHand();
  handleMachineAnimationEnd();
}

/* ============================================================
   AUTOPLAY
============================================================ */
function autoPlay() {
  if (!autoMode) return;

  goNext();

  setTimeout(() => {
    if (autoMode) autoPlay();
  }, AUTO_DELAY);
}

/* ============================================================
   STOP AUTOPLAY ON USER ACTION
============================================================ */
function stopAuto() {
  autoMode = false;
}

function resumeAuto() {
  autoMode = true;
  autoPlay();
}

arrowLeft.addEventListener("mouseenter", stopAuto);
arrowRight.addEventListener("mouseenter", stopAuto);
arrowLeft.addEventListener("mouseleave", resumeAuto);
arrowRight.addEventListener("mouseleave", resumeAuto);

/* ============================================================
   USER CLICKS
============================================================ */
arrowRight.addEventListener("click", () => {
  stopAuto();
  goNext();
});

arrowLeft.addEventListener("click", () => {
  stopAuto();
  tapHand();
  currentIndex = (currentIndex - 1 + pages.length) % pages.length;
  runCycle(pages[currentIndex]);
});

/* ============================================================
   INITIAL START
============================================================ */
function setInitialBubbleImage(src) {
  bubbleImgPrimary.src = src;
  bubbleImgSecondary.src = src;

  bubbleImgPrimary.classList.add("bubble-img--visible");
  bubbleImgSecondary.classList.remove("bubble-img--visible");

  isPrimaryVisible = true;
}

setInitialBubbleImage(pages[currentIndex].bubbleImage);
setScene(pages[currentIndex]);
startMachineAnimation();

runIntro();

setTimeout(() => {
  showHandSmooth();
  setTimeout(autoPlay, 1200);
}, 2000);
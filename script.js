/* ============================================================
   PAGES
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
  },
  {
    bubbleImage: "bw.png",
    machineImage: "eqp.png",
    background: { start: "#1a0e09", end: "#040200" }
  },
  {
    bubbleImage: "bw12.png",
    machineImage: "eqp12.png",
    background: { start: "#1a0e09", end: "#040200" }
  }
];

/* ============================================================
   ELEMENTS
============================================================ */
const bubbleImgPrimary = document.getElementById("bw-img-primary");
const bubbleImgSecondary = document.getElementById("bw-img-secondary");
const sideMachine = document.getElementById("side-machine");
const hand = document.getElementById("hand");
const arrowRight = document.getElementById("arrow-right");
const arrowLeft = document.getElementById("arrow-left");
const introText = document.getElementById("intro-text");
const scene = document.getElementById("scene");
const root = document.documentElement;

/* ============================================================
   STATE
============================================================ */
let currentIndex = 0;
let isPrimaryVisible = true;
let autoMode = true;
let mainSequenceStarted = false;
let isMachineFlying = false;
let isMachineExiting = false;
let pendingExitRequest = false;

const BUBBLE_FADE_DELAY = 700;
const AUTO_DELAY = 4000;
const INTRO_HAND_APPEAR_DELAY = 2500;
const INTRO_AUTO_START_DELAY = 5500;
const HAND_EXIT_DELAY = 200;

/* ============================================================
   BUBBLE FADE
============================================================ */
function updateBubbleImage(src) {
  const incoming = isPrimaryVisible ? bubbleImgSecondary : bubbleImgPrimary;
  const outgoing = isPrimaryVisible ? bubbleImgPrimary : bubbleImgSecondary;

  const reveal = () => {
    incoming.classList.add("bubble-img--visible");
    outgoing.classList.remove("bubble-img--visible");
    isPrimaryVisible = !isPrimaryVisible;
  };

  if (incoming.src.endsWith(src) && incoming.complete) {
    reveal();
    return;
  }

  incoming.onload = reveal;
  incoming.src = src;
}

/* ============================================================
   BACKGROUND
============================================================ */
function updateBackground(colors) {
  root.style.setProperty("--bg-start", colors.start);
  root.style.setProperty("--bg-end", colors.end);
}

/* ============================================================
   SET PAGE
============================================================ */
function setScene(page) {
  sideMachine.src = page.machineImage;
  updateBackground(page.background);
}

/* ============================================================
   MACHINE ANIMATION RESET
============================================================ */
function startMachineAnimation() {
  sideMachine.classList.remove("fly");
  sideMachine.classList.remove("force-exit");
  sideMachine.getBoundingClientRect(); // reset

  isMachineFlying = true;
  isMachineExiting = false;
  pendingExitRequest = false;

  requestAnimationFrame(() => {
    sideMachine.classList.add("fly");
  });
}

function startMachineExit() {
  if (isMachineExiting) return;

  isMachineExiting = true;
  if (sideMachine.classList.contains("force-exit")) return;

  sideMachine.classList.remove("fly");
  sideMachine.classList.remove("force-exit");
  sideMachine.getBoundingClientRect();

  requestAnimationFrame(() => {
    sideMachine.classList.add("force-exit");
  });
}

function triggerExitSequence() {
  if (isMachineFlying || isMachineExiting) return;

  pendingExitRequest = false;
  tapHand();

  setTimeout(() => {
    startMachineExit();
  }, HAND_EXIT_DELAY);
}

/* ============================================================
   PAGE CYCLE
============================================================ */
function runCycle(page) {
  setScene(page);

  setTimeout(() => {
    updateBubbleImage(page.bubbleImage);
  }, BUBBLE_FADE_DELAY);

  startMachineAnimation();
}

/* ============================================================
   WHEN MACHINE EXITS
============================================================ */
function handleMachineAnimationEnd(event) {
  if (!event) return;

  if (event.animationName === "machineFly") {
    isMachineFlying = false;

    if (pendingExitRequest && !isMachineExiting) {
      triggerExitSequence();
    }
    return;
  }

  if (event.animationName === "machineExit") {
    isMachineExiting = false;
    pendingExitRequest = false;
    currentIndex = (currentIndex + 1) % pages.length;
    runCycle(pages[currentIndex]);
  }
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
   NEXT BUTTON
============================================================ */
function goNext() {
  if (isMachineExiting || pendingExitRequest) return;

  pendingExitRequest = true;

  if (!isMachineFlying) {
    triggerExitSequence();
  }
}

/* ============================================================
   INTRO / INITIALIZATION
============================================================ */
function startMainSequence() {
  if (mainSequenceStarted) return;
  mainSequenceStarted = true;

  if (scene) {
    scene.classList.remove("scene--hidden");
  }

  startMachineAnimation();

  setTimeout(showHandSmooth, INTRO_HAND_APPEAR_DELAY);

  setTimeout(() => {
    autoPlay();
  }, INTRO_AUTO_START_DELAY);
}

function runIntroSequence() {
  if (!introText) {
    startMainSequence();
    return;
  }

  introText.classList.add("intro-text--animate");

  introText.addEventListener("animationend", () => {
    introText.classList.add("intro-text--hidden");
    startMainSequence();
  }, { once: true });
}

/* ============================================================
   AUTOPLAY
============================================================ */
function autoPlay() {
  if (!autoMode) return;
  goNext();
  setTimeout(autoPlay, AUTO_DELAY);
}

/* ============================================================
   STOP / RESUME AUTOPLAY
============================================================ */
arrowLeft.addEventListener("mouseenter", () => autoMode = false);
arrowRight.addEventListener("mouseenter", () => autoMode = false);
arrowLeft.addEventListener("mouseleave", () => { autoMode = true; autoPlay(); });
arrowRight.addEventListener("mouseleave", () => { autoMode = true; autoPlay(); });

/* ============================================================
   USER CLICKS
============================================================ */
arrowRight.addEventListener("click", () => {
  autoMode = false;
  goNext();
});

arrowLeft.addEventListener("click", () => {
  autoMode = false;
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
runIntroSequence();

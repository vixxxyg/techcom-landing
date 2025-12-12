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
const root = document.documentElement;

/* ============================================================
   STATE
============================================================ */
let currentIndex = 0;
let isPrimaryVisible = true;
let autoMode = true;

const BUBBLE_FADE_DELAY = 700;
const AUTO_DELAY = 4000;

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

  requestAnimationFrame(() => {
    sideMachine.classList.add("fly");
  });
}

function startMachineExit() {
  if (sideMachine.classList.contains("force-exit")) return;

  sideMachine.classList.remove("fly");
  sideMachine.classList.remove("force-exit");
  sideMachine.getBoundingClientRect();

  requestAnimationFrame(() => {
    sideMachine.classList.add("force-exit");
  });
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
  if (!event || (event.animationName !== "machineFly" && event.animationName !== "machineExit")) {
    return;
  }

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
   NEXT BUTTON
============================================================ */
function goNext() {
  tapHand();
  startMachineExit();
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

// первая машина приезжает
startMachineAnimation();

// рука появляется после приезда машины
setTimeout(showHandSmooth, 2500);

// рука нажимает и запускает автоплей
setTimeout(() => {
  tapHand();
  autoPlay();
}, 4500);

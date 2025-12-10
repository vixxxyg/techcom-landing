/* =============================
   DATA: pages configuration
============================= */

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

/* =============================
   ELEMENTS
============================= */

const bubbleImgPrimary = document.getElementById("bw-img-primary");
const bubbleImgSecondary = document.getElementById("bw-img-secondary");
const sideMachine = document.getElementById("side-machine");
const root = document.documentElement;

// Controls
const hand = document.getElementById("hand");
const arrowLeft = document.getElementById("arrow-left");
const arrowRight = document.getElementById("arrow-right");

/* =============================
   STATE
============================= */

let currentIndex = 0;
let isPrimaryVisible = true;
const BUBBLE_FADE_DELAY = 700;

/* =============================
   BACKGROUND UPDATE
============================= */

function updateBackground(colors) {
  root.style.setProperty("--bg-start", colors.start);
  root.style.setProperty("--bg-end", colors.end);
}

/* =============================
   BUBBLE IMAGE CROSSFADE
============================= */

function updateBubbleImage(src) {
  const incoming = isPrimaryVisible ? bubbleImgSecondary : bubbleImgPrimary;
  const outgoing = isPrimaryVisible ? bubbleImgPrimary : bubbleImgSecondary;

  const reveal = () => {
    incoming.classList.add("bubble-img--visible");
    outgoing.classList.remove("bubble-img--visible");
    isPrimaryVisible = !isPrimaryVisible;
  };

  const onReady = () => requestAnimationFrame(reveal);

  // If already loaded → animate immediately
  if (incoming.getAttribute("src") === src && incoming.complete) {
    onReady();
    return;
  }

  // If loading needed → wait
  incoming.addEventListener("load", onReady, { once: true });

  if (incoming.getAttribute("src") !== src) {
    incoming.src = src;
  }
}

/* =============================
   SET INITIAL BUBBLE
============================= */

function setInitialBubbleImage(src) {
  bubbleImgPrimary.src = src;
  bubbleImgSecondary.src = src;
  bubbleImgPrimary.classList.add("bubble-img--visible");
  bubbleImgSecondary.classList.remove("bubble-img--visible");
}

/* =============================
   MACHINE + BACKGROUND SCENE
============================= */

function setScene(page) {
  updateBackground(page.background);
  sideMachine.src = page.machineImage;
}

function startMachineAnimation() {
  sideMachine.classList.remove("fly");
  void sideMachine.offsetWidth; // reset animation
  sideMachine.classList.add("fly");
}

/* =============================
   MAIN CYCLE
============================= */

function runCycle(page) {
  setScene(page);

  // bubble fade slightly after machine starts
  setTimeout(() => {
    updateBubbleImage(page.bubbleImage);
  }, BUBBLE_FADE_DELAY);

  startMachineAnimation();
}

/* =============================
   AUTO STEP (when machine ends)
============================= */

function handleMachineAnimationEnd() {
  currentIndex = (currentIndex + 1) % pages.length;
  runCycle(pages[currentIndex]);
}

sideMachine.addEventListener("animationend", handleMachineAnimationEnd);

/* =============================
   INITIAL START
============================= */

const initialPage = pages[currentIndex];
setInitialBubbleImage(initialPage.bubbleImage);
setScene(initialPage);
startMachineAnimation();

/* =============================
   HAND CLICK ANIMATION
============================= */

function tapHand() {
  hand.classList.add("tap");
  setTimeout(() => hand.classList.remove("tap"), 300);
}

/* =============================
   MANUAL CONTROLS
============================= */

arrowRight.addEventListener("click", () => {
  tapHand();
  handleMachineAnimationEnd();
});

arrowLeft.addEventListener("click", () => {
  tapHand();
  currentIndex = (currentIndex - 1 + pages.length) % pages.length;
  runCycle(pages[currentIndex]);
});

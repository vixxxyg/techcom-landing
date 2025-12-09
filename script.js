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

const bubbleImgPrimary = document.getElementById("bw-img-primary");
const bubbleImgSecondary = document.getElementById("bw-img-secondary");
const sideMachine = document.getElementById("side-machine");
const root = document.documentElement;

let currentIndex = 0;
let isPrimaryVisible = true;
const BUBBLE_FADE_DELAY = 700;

function updateBubbleImage(src) {
  const incoming = isPrimaryVisible ? bubbleImgSecondary : bubbleImgPrimary;
  const outgoing = isPrimaryVisible ? bubbleImgPrimary : bubbleImgSecondary;

  const reveal = () => {
    incoming.classList.add("bubble-img--visible");
    outgoing.classList.remove("bubble-img--visible");
    isPrimaryVisible = !isPrimaryVisible;
  };

  const onReady = () => requestAnimationFrame(reveal);

  if (incoming.getAttribute("src") === src && incoming.complete) {
    onReady();
    return;
  }

  incoming.addEventListener(
    "load",
    () => {
      onReady();
    },
    { once: true }
  );

  if (incoming.getAttribute("src") !== src) {
    incoming.src = src;
  }
}

function updateBackground(colors) {
  root.style.setProperty("--bg-start", colors.start);
  root.style.setProperty("--bg-end", colors.end);
}

function setInitialBubbleImage(src) {
  bubbleImgPrimary.src = src;
  bubbleImgSecondary.src = src;
  bubbleImgPrimary.classList.add("bubble-img--visible");
  bubbleImgSecondary.classList.remove("bubble-img--visible");
  isPrimaryVisible = true;
}

function setScene(page) {
  updateBackground(page.background);
  sideMachine.src = page.machineImage;
}

function startMachineAnimation() {
  sideMachine.classList.remove("fly");
  void sideMachine.offsetWidth;
  sideMachine.classList.add("fly");
}

function runCycle(page, { fadeDelay = BUBBLE_FADE_DELAY } = {}) {
  setScene(page);
  setTimeout(() => {
    updateBubbleImage(page.bubbleImage);
  }, fadeDelay);
  startMachineAnimation();
}

function handleMachineAnimationEnd() {
  currentIndex = (currentIndex + 1) % pages.length;
  const next = pages[currentIndex];
  runCycle(next);
}

sideMachine.addEventListener("animationend", handleMachineAnimationEnd);

// Initial paint and kickoff
const initialPage = pages[currentIndex];
setInitialBubbleImage(initialPage.bubbleImage);
setScene(initialPage);
startMachineAnimation();

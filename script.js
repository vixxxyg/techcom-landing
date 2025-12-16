/* ============================================================
   PAGES
============================================================ */
const pages = [
  { bubbleImage: "bw6.png",  machineImage: "eqp6.png"  },
  { bubbleImage: "bw2.png",  machineImage: "eqp10.png" },
  { bubbleImage: "bw4.png",  machineImage: "eqp7.png"  },
  { bubbleImage: "bw.png",   machineImage: "eqp.png"   },
  { bubbleImage: "bw13.png", machineImage: "eqp13.png" },
  { bubbleImage: "bw12.png", machineImage: "eqp12.png" },
  { bubbleImage: "bw14.png", machineImage: "eqp14.png" }
];

/* ============================================================
   ELEMENTS
============================================================ */
const bubbleImgPrimary   = document.getElementById("bw-img-primary");
const bubbleImgSecondary = document.getElementById("bw-img-secondary");
const sideMachine        = document.getElementById("side-machine");
const scene              = document.getElementById("scene");

/* ============================================================
   STATE
============================================================ */
let index = 0;
let isPrimaryVisible = true;

const AUTO_DELAY = 4200;
const EXIT_DURATION = 900;
const BUBBLE_DELAY = 400;

/* ============================================================
   BUBBLE SWITCH
============================================================ */
function switchBubble(src) {
  const incoming = isPrimaryVisible ? bubbleImgSecondary : bubbleImgPrimary;
  const outgoing = isPrimaryVisible ? bubbleImgPrimary : bubbleImgSecondary;

  incoming.onload = () => {
    incoming.classList.add("bubble-img--visible");
    outgoing.classList.remove("bubble-img--visible");
    isPrimaryVisible = !isPrimaryVisible;
  };

  incoming.src = src;
}

/* ============================================================
   MACHINE FLOW
============================================================ */
function showMachine(src) {
  sideMachine.classList.remove("exit");
  sideMachine.classList.remove("fly");
  sideMachine.getBoundingClientRect();

  sideMachine.src = src;

  requestAnimationFrame(() => {
    sideMachine.classList.add("fly");
  });
}

function hideMachine() {
  sideMachine.classList.remove("fly");
  sideMachine.classList.add("exit");
}

/* ============================================================
   CYCLE
============================================================ */
function runCycle() {
  hideMachine();

  setTimeout(() => {
    index = (index + 1) % pages.length;

    showMachine(pages[index].machineImage);
    switchBubble(pages[index].bubbleImage);

  }, EXIT_DURATION);
}

/* ============================================================
   INIT
============================================================ */
function init() {
  scene.classList.remove("scene--hidden");

  bubbleImgPrimary.src = pages[0].bubbleImage;
  bubbleImgSecondary.src = pages[0].bubbleImage;
  bubbleImgPrimary.classList.add("bubble-img--visible");

  showMachine(pages[0].machineImage);

  setInterval(runCycle, AUTO_DELAY);
}

init();
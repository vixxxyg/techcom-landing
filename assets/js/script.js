/* ============================================================
   PAGES
============================================================ */
const pages = [
  { bubbleImage: "../assets/images/bubble-bg-1.png",  machineImage: "../assets/images/machine-1.png"  },
  { bubbleImage: "assets/images/bubble-bg-2.png", machineImage: "assets/images/machine-2.png" },
  { bubbleImage: "assets/images/bubble-bg-3.png",  machineImage: "assets/images/machine-3.png" },
  { bubbleImage: "/assets/images/bubble-bg-4.png",  machineImage: "/assets/images/machine-4.png"  },
  { bubbleImage: "/assets/images/bubble-bg-5.png", machineImage: "/assets/images/machine-5.png" },
  { bubbleImage: "/assets/images/bubble-bg-6.png",   machineImage: "/assets/images/machine-6.png"   },
  { bubbleImage: "/assets/images/bubble-bg-7.png", machineImage: "/assets/images/machine-7.png" },
  { bubbleImage: "/assets/images/bubble-bg-8.png", machineImage: "/assets/images/machine-8.png" }
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

  sideMachine.style.opacity = "1"; // страховка
  sideMachine.getBoundingClientRect(); // force reflow

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
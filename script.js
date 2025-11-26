// Black & white images for the bubble
const bwImages = [
  "bw1.png",
  "bw2.png",
  "bw3.png"
];

// Colored machine images (side equipment)
const sideImages = [
  "1111.png",
  "eqp2.png",
  "eqp3.png"
];

let index = 0;

const bwImg = document.getElementById("bw-img");
const sideMachine = document.getElementById("side-machine");

function changeImages() {
  // Move to the next image index (looping)
  index = (index + 1) % bwImages.length;

  // Update black & white image inside the bubble
  bwImg.src = bwImages[index];

  // Update side machine image and restart animation
  sideMachine.src = sideImages[index];
  sideMachine.style.animation = "none";  // Reset animation
  void sideMachine.offsetWidth;          // Trigger reflow (forces restart)
  sideMachine.style.animation = "slideIn 1.4s ease forwards";
}

// Change images every 3 seconds
setInterval(changeImages, 3000);
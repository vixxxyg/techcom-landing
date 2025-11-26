const machines = [
  "machine1.png",
  "machine2.png",
  "machine3.png",
  "machine4.png"
];

let index = 0;
const img = document.getElementById("machine");


setInterval(() => {
  index = (index + 1) % machines.length;
  img.src = machines[index];
}, 3000);
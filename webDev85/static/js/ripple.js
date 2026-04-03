$(document).ready(function() {
  $(".bg-image").ripples({
    resolution: 200,
    perturbance: 0.002,
    interactive: true
  });
});

const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const body = document.body;
const bgImage = document.querySelector(".bg-image");

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let painting = false;
let currentColor = null;
let isDrawing = false;
let isErasing = false;
let lastX = 0;
let lastY = 0;

// Smooth points
function getSmoothPoints(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function startPosition(e) {
  if (!isDrawing && !isErasing) return;

  painting = true;

  const pos = getSmoothPoints(e);
  lastX = pos.x;
  lastY = pos.y;

  draw(pos.x, pos.y, true);
  dispatchEventToBgImage(e);
}

function endPosition(e) {
  painting = false;
  if (e) dispatchEventToBgImage(e);
}

function draw(x, y, isStart = false) {
  if (!painting || (!isDrawing && !isErasing)) return;

  ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';

  ctx.beginPath();

  if (isStart) {
    ctx.moveTo(x, y);
  } else {
    const midX = (lastX + x) / 2;
    const midY = (lastY + y) / 2;

    ctx.moveTo(lastX, lastY);
    ctx.quadraticCurveTo(lastX, lastY, midX, midY);
  }

  ctx.lineWidth = isErasing ? 20 : 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (!isErasing) {
    ctx.strokeStyle = currentColor;
  }

  ctx.stroke();

  // glow effect
  if (!isErasing && !isStart) {
    const radius = 5;
    const startX = Math.max(0, x - radius);
    const startY = Math.max(0, y - radius);
    const endX = Math.min(canvas.width, x + radius);
    const endY = Math.min(canvas.height, y + radius);

    const width = endX - startX;
    const height = endY - startY;

    if (width > 0 && height > 0) {
      const imageData = ctx.getImageData(startX, startY, width, height);
      const data = imageData.data;

      const colorMatch = currentColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);

      if (colorMatch) {
        const r = parseInt(colorMatch[1]);
        const g = parseInt(colorMatch[2]);
        const b = parseInt(colorMatch[3]);

        for (let i = 0; i < data.length; i += 4) {
          if (
            Math.abs(data[i] - r) < 30 &&
            Math.abs(data[i + 1] - g) < 30 &&
            Math.abs(data[i + 2] - b) < 30
          ) {
            data[i + 3] = Math.min(230, data[i + 3] + 20);
          }
        }

        ctx.putImageData(imageData, startX, startY);
      }
    }
  }

  lastX = x;
  lastY = y;
}

function handleMove(e) {
  if (!painting) return;

  const pos = getSmoothPoints(e);

  requestAnimationFrame(() => {
    draw(pos.x, pos.y);
    dispatchEventToBgImage(e);
  });
}

function dispatchEventToBgImage(e) {
  const clonedEvent = new e.constructor(e.type, {
    clientX: e.clientX,
    clientY: e.clientY,
    bubbles: true,
    cancelable: true
  });
  bgImage.dispatchEvent(clonedEvent);
}

// 🎨 COLOR SELECT
document.querySelectorAll(".color").forEach(colorBtn => {
  colorBtn.addEventListener("click", (e) => {
    document.querySelectorAll('.color, .eraser, .reset').forEach(c => c.classList.remove('active'));

    currentColor = colorBtn.getAttribute("data-color");
    colorBtn.classList.add('active');

    isDrawing = true;
    isErasing = false;

    body.classList.add('drawing-cursor');
    canvas.style.pointerEvents = 'auto';

    e.stopPropagation();
  });
});

// 🧽 ERASER
document.querySelectorAll(".eraser").forEach(eraserBtn => {
  eraserBtn.addEventListener("click", (e) => {
    document.querySelectorAll('.color, .eraser, .reset').forEach(c => c.classList.remove('active'));

    eraserBtn.classList.add('active');

    isDrawing = false;
    isErasing = true;

    body.classList.add('drawing-cursor');
    canvas.style.pointerEvents = 'auto';

    e.stopPropagation();
  });
});

// 🔄 RESET
document.querySelectorAll(".reset").forEach(resetBtn => {
  resetBtn.addEventListener("click", (e) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    document.querySelectorAll('.color, .eraser, .reset').forEach(c => c.classList.remove('active'));

    isDrawing = false;
    isErasing = false;

    body.classList.remove('drawing-cursor');
    canvas.style.pointerEvents = 'none';

    e.stopPropagation();
  });
});


document.addEventListener('click', (e) => {
  if (!e.target.closest('.controls-wrapper') &&
      !e.target.closest('.navbar')) {

    // stop current stroke only
    painting = false;

    // ✅ KEEP canvas active so user can draw again
    // ❌ DO NOT disable pointer events

    dispatchEventToBgImage(e);
  }
});


// MOUSE EVENTS
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mouseout", endPosition);
canvas.addEventListener("mousemove", handleMove);

// TOUCH EVENTS
canvas.addEventListener("touchstart", (e) => {
  if (!isDrawing && !isErasing) return;

  e.preventDefault();

  const touch = e.touches[0];

  const mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });

  startPosition(mouseEvent);
});

canvas.addEventListener("touchend", (e) => {
  if (!isDrawing && !isErasing) return;

  e.preventDefault();
  endPosition();
});

canvas.addEventListener("touchmove", (e) => {
  if (!isDrawing && !isErasing || !painting) return;

  e.preventDefault();

  const touch = e.touches[0];

  const mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });

  handleMove(mouseEvent);
});


// DOWNLOAD
document.getElementById("downloadBtn").addEventListener("click", function() {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  tempCtx.fillStyle = 'black';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  tempCtx.drawImage(canvas, 0, 0);

  const link = document.createElement('a');
  link.download = 'space-paint-' + new Date().getTime() + '.png';
  link.href = tempCanvas.toDataURL('image/png');
  link.click();
});
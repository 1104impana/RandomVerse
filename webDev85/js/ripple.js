


    $(document).ready(function(){
	    $(".bg-image").ripples({
        resolution: 200,
        perturbance: .004,
        interactive: true
    });
 });
     const canvas = document.getElementById("paintCanvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const body = document.body;

    // Set canvas size
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Clear canvas on resize to prevent artifacts
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let painting = false;
    let currentColor = null;
    let isDrawingMode = false;
    let lastX = 0;
    let lastY = 0;

    // For smooth drawing
    function getSmoothPoints(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    function startPosition(e) {
      if (!isDrawingMode) return;
      painting = true;
      const pos = getSmoothPoints(e);
      lastX = pos.x;
      lastY = pos.y;
      draw(pos.x, pos.y, true);
    }

    function endPosition() {
      painting = false;
    }

    function draw(x, y, isStart = false) {
      if (!painting || !isDrawingMode) return;

      ctx.globalCompositeOperation = 'source-over';
      
      // Draw smooth line
      ctx.beginPath();
      if (isStart) {
        ctx.moveTo(x, y);
      } else {
        // Calculate control points for smooth curve
        const midX = (lastX + x) / 2;
        const midY = (lastY + y) / 2;
        
        ctx.moveTo(lastX, lastY);
        ctx.quadraticCurveTo(lastX, lastY, midX, midY);
      }
      
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = currentColor;
      ctx.stroke();
      
      // For accumulating opacity
      if (!isStart) {
        // Get the pixel data for the area we just drew on
        const radius = 10;
        const startX = Math.max(0, x - radius);
        const startY = Math.max(0, y - radius);
        const endX = Math.min(canvas.width, x + radius);
        const endY = Math.min(canvas.height, y + radius);
        const width = endX - startX;
        const height = endY - startY;
        
        if (width > 0 && height > 0) {
          const imageData = ctx.getImageData(startX, startY, width, height);
          const data = imageData.data;
          
          // Extract the RGB values from the current color
          const colorMatch = currentColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (colorMatch) {
            const r = parseInt(colorMatch[1]);
            const g = parseInt(colorMatch[2]);
            const b = parseInt(colorMatch[3]);
            const baseAlpha = parseFloat(colorMatch[4] || '0.3');
            
            // Increase opacity where pixels already have this color
            for (let i = 0; i < data.length; i += 4) {
              // If pixel is similar to our current color
              if (Math.abs(data[i] - r) < 30 && 
                  Math.abs(data[i+1] - g) < 30 && 
                  Math.abs(data[i+2] - b) < 30) {
                // Increase alpha up to a maximum (e.g., 0.9)
                data[i+3] = Math.min(230, data[i+3] + 20);
              }
            }
            
            ctx.putImageData(imageData, startX, startY);
          }
        }
      }
      
      lastX = x;
      lastY = y;
    }

    // Handle mouse movement with smoothing
    function handleMove(e) {
      if (!painting) return;
      
      const pos = getSmoothPoints(e);
      requestAnimationFrame(() => {
        draw(pos.x, pos.y);
      });
    }

    // Handle color selection
    document.querySelectorAll(".color").forEach(colorBtn => {
      colorBtn.addEventListener("click", (e) => {
        document.querySelectorAll('.color').forEach(c => c.classList.remove('active'));
        currentColor = colorBtn.getAttribute("data-color");
        colorBtn.classList.add('active');
        isDrawingMode = true;
        body.classList.add('drawing-cursor');
        e.stopPropagation();
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.classList.contains('color')) {
        isDrawingMode = false;
        body.classList.remove('drawing-cursor');
        document.querySelectorAll('.color').forEach(c => c.classList.remove('active'));
      }
    });

    // Event listeners
    window.addEventListener("mousedown", startPosition);
    window.addEventListener("mouseup", endPosition);
    window.addEventListener("mouseout", endPosition);
    window.addEventListener("mousemove", (e) => {
      if (painting) {
        handleMove(e);
      }
    });

    // Touch support
    window.addEventListener("touchstart", (e) => {
      if (!isDrawingMode) return;
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      startPosition(mouseEvent);
    });

    window.addEventListener("touchend", (e) => {
      if (!isDrawingMode) return;
      e.preventDefault();
      endPosition();
    });

    window.addEventListener("touchmove", (e) => {
      if (!isDrawingMode || !painting) return;
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      handleMove(mouseEvent);
    });
  
   
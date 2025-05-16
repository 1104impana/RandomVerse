
    // Initialize canvas and context
    const canvas = document.getElementById('spacePaint');
    const ctx = canvas.getContext('2d');
    
    // Canvas dimensions
    let width, height;
    
    // Set canvas to full window size
    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createSpaceBackground();
    }

    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseSpeed = 0;
    
    // Water mesh grid
    const meshSize = 20;
    let cols, rows;
    let grid = [];
    
    // Background stars
    let stars = [];
    const numStars = 500;
    
    // Space background image
    let spaceBackground;

    // Color settings
    let activeColor = null;
    let colorIntensity = 0;
    let colorParticles = [];
    let isColorActive = false;

    // Purple color values
    const purpleColor = {
      r: 156,
      g: 39,
      b: 176,
      a: 0.5
    };
    
    
    // Create initial space background with stars
    function createSpaceBackground() {
      // Create an offscreen canvas for the space background
      spaceBackground = document.createElement('canvas');
      spaceBackground.width = width;
      spaceBackground.height = height;
      const bgCtx = spaceBackground.getContext('2d');
      
      // Fill with black background
      bgCtx.fillStyle = '#000';
      bgCtx.fillRect(0, 0, width, height);
      
      // Generate stars with different sizes and colors
      stars = [];
      for (let i = 0; i < numStars; i++) {
        const size = Math.random() * 2 + 0.5;
        const x = Math.random() * width;
        const y = Math.random() * height;
        const brightness = Math.random() * 80 + 20; // 20-100%
        const color = `rgba(255, 255, 255, ${brightness/100})`;
        
        stars.push({ x, y, size, color });
        
        bgCtx.fillStyle = color;
        bgCtx.beginPath();
        bgCtx.arc(x, y, size, 0, Math.PI * 2);
        bgCtx.fill();
        
        // Add glow to some stars
        if (size > 1.5) {
          bgCtx.shadowBlur = size * 5;
          bgCtx.shadowColor = 'rgba(255, 255, 255, 0.5)';
          bgCtx.beginPath();
          bgCtx.arc(x, y, size, 0, Math.PI * 2);
          bgCtx.fill();
          bgCtx.shadowBlur = 0;
        }
      }
      
      // Add some nebula-like areas
      addNebulaEffect(bgCtx);
      
      // Initialize water mesh grid
      initGrid();
    }
    
    // Add nebula-like colored areas
    function addNebulaEffect(bgCtx) {
      const nebulaColors = [
        'rgba(70, 0, 90, 0.1)',  // Purple
        'rgba(0, 30, 70, 0.1)',  // Blue
        'rgba(0, 60, 60, 0.1)',  // Teal
        'rgba(60, 0, 60, 0.1)'   // Magenta
      ];
      
      // Create 5-8 nebula clouds
      const numNebulas = Math.floor(Math.random() * 4) + 5;
      
      for (let i = 0; i < numNebulas; i++) {
        const centerX = Math.random() * width;
        const centerY = Math.random() * height;
        const nebulaRadius = Math.random() * (width/3) + width/6;
        const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
        
        // Create radial gradient
        const gradient = bgCtx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, nebulaRadius
        );
        
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        bgCtx.fillStyle = gradient;
        bgCtx.beginPath();
        bgCtx.arc(centerX, centerY, nebulaRadius, 0, Math.PI * 2);
        bgCtx.fill();
      }
    }
    
    // Initialize water effect grid
    function initGrid() {
      cols = Math.floor(width / meshSize) + 1;
      rows = Math.floor(height / meshSize) + 1;
      
      grid = [];
      for (let i = 0; i < cols; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {
          grid[i][j] = {
            x: i * meshSize,
            y: j * meshSize,
            originalX: i * meshSize,
            originalY: j * meshSize,
            displacementX: 0,
            displacementY: 0,
            velocityX: 0,
            velocityY: 0,
            colorIntensity: 0,
            color: null
          };
        }
      }
    }

    // Add color particle
    function addColorParticle(x, y, color) {
      colorParticles.push({
        x,
        y,
        color,
        radius: 50,
        life: 100,
        maxLife: 100
      });
    }
    
    // Animation loop
    function animate() {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Calculate mouse speed
      const dx = mouseX - lastMouseX;
      const dy = mouseY - lastMouseY;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy) * 0.1;
      mouseSpeed = Math.min(mouseSpeed, 10); // Cap the speed
      
      lastMouseX = mouseX;
      lastMouseY = mouseY;

      // Add color particles if color is active and mouse is moving
      if (isColorActive && mouseSpeed > 0.5) {
        addColorParticle(mouseX, mouseY, activeColor);
      }

       // Update color particles
      for (let i = colorParticles.length - 1; i >= 0; i--) {
        const particle = colorParticles[i];
        particle.life -= 0.5;
        
        if (particle.life <= 0) {
          colorParticles.splice(i, 1);
          continue;
        }
      }
      
      // Update grid points based on mouse position
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const point = grid[i][j];
          
          // Calculate distance from mouse
          const distX = mouseX - point.originalX;
          const distY = mouseY - point.originalY;
          const distance = Math.sqrt(distX * distX + distY * distY);
          
          // Influence radius changes with mouse speed - further reduced radius
          const radius = 70 + mouseSpeed * 7;
          
          if (distance < radius) {
            // Calculate influence based on distance - reduced intensity
            const influence = (1 - distance / radius) * mouseSpeed * 0.02;
            
            // Apply force away from mouse
            point.velocityX -= distX * influence;
            point.velocityY -= distY * influence;
          

          // Apply color if color is active
            if (isColorActive) {
              point.color = activeColor;
              point.colorIntensity = Math.min(point.colorIntensity + 0.02, 0.5);
            }
          }

          // Check if point is near any color particles
          colorParticles.forEach(particle => {
            const particleDistX = particle.x - point.originalX;
            const particleDistY = particle.y - point.originalY;
            const particleDistance = Math.sqrt(particleDistX * particleDistX + particleDistY * particleDistY);
            
            if (particleDistance < particle.radius) {
              const particleInfluence = (1 - particleDistance / particle.radius) * (particle.life / particle.maxLife) * 0.1;
              point.color = particle.color;
              point.colorIntensity = Math.min(point.colorIntensity + particleInfluence, 0.5);
            }
          });
          
          
          // Apply return force to original position
          const returnForce = 0.03;
          point.velocityX += (point.originalX - (point.originalX + point.displacementX)) * returnForce;
          point.velocityY += (point.originalY - (point.originalY + point.displacementY)) * returnForce;
          
          // Apply friction
          point.velocityX *= 0.92;
          point.velocityY *= 0.92;
          
          // Update displacement
          point.displacementX += point.velocityX;
          point.displacementY += point.velocityY;
          
          // Update position
          point.x = point.originalX + point.displacementX;
          point.y = point.originalY + point.displacementY;

          // Fade color intensity over time
          if (point.colorIntensity > 0) {
            point.colorIntensity *= 0.995;
            if (point.colorIntensity < 0.01) {
              point.colorIntensity = 0;
              point.color = null;
            }
          }
        }
      }
      
      // Draw the distorted space background
      ctx.save();
      
      // Draw the warped grid sections
      for (let i = 0; i < cols - 1; i++) {
        for (let j = 0; j < rows - 1; j++) {
          const p0 = grid[i][j];
          const p1 = grid[i+1][j];
          const p2 = grid[i+1][j+1];
          const p3 = grid[i][j+1];
          
          // Calculate the source region to draw from the original background
          const sourceX = i * meshSize;
          const sourceY = j * meshSize;
          const sourceWidth = meshSize;
          const sourceHeight = meshSize;
          
          // Draw the warped quadrilateral
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.closePath();
          ctx.clip();
          
          // Create a transformation matrix to map the source rectangle to the distorted quad
          const dx1 = p1.x - p0.x;
          const dy1 = p1.y - p0.y;
          const dx2 = p3.x - p0.x;
          const dy2 = p3.y - p0.y;
          
          // Adjust transformation based on distortion
          ctx.transform(
            dx1 / meshSize, dy1 / meshSize,
            dx2 / meshSize, dy2 / meshSize,
            p0.x, p0.y
          );
          
          // Draw the corresponding section from the original background
          ctx.drawImage(
            spaceBackground,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, meshSize, meshSize
          );
          
          if ((p0.colorIntensity > 0 || p1.colorIntensity > 0 || p2.colorIntensity > 0 || p3.colorIntensity > 0) && 
              (p0.color || p1.color || p2.color || p3.color)) {
            // Use the average color intensity of the four corners
            const avgIntensity = (p0.colorIntensity + p1.colorIntensity + p2.colorIntensity + p3.colorIntensity) / 4;
            // Use the color from the first corner that has one
            const color = p0.color || p1.color || p2.color || p3.color;
            
            // Apply color overlay
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${avgIntensity * color.a})`;
            ctx.fillRect(0, 0, meshSize, meshSize);
          }
          
          ctx.restore();
        }
      }
      
      ctx.restore();
      
      requestAnimationFrame(animate);
    }
    
    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize and start animation
    resizeCanvas();
    animate();
    
    // For touch devices
    window.addEventListener('touchmove', (e) => {
      e.preventDefault();
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }, { passive: false });

    // Color palette functionality
    const purpleColorButton = document.getElementById('purpleColor');
    
    // Add click event listener to the purple color button
    purpleColorButton.addEventListener('click', function() {
      if (isColorActive && activeColor === purpleColor) {
        // Toggle off if already active
        isColorActive = false;
        activeColor = null;
        this.classList.remove('active');
      } else {
        // Activate purple color
        isColorActive = true;
        activeColor = purpleColor;
        this.classList.add('active');
      }
    });
  


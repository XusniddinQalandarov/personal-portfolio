export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      initParticles: (element) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        element.appendChild(canvas);
        
        let particles = [];
        let animationId;
        let mouse = { x: -1000, y: -1000 };
        
        const resize = () => {
          canvas.width = element.offsetWidth;
          canvas.height = element.offsetHeight;
        };
        
        const createParticles = () => {
          particles = [];
          const numParticles = Math.floor((canvas.width * canvas.height) / 8000);
          
          for (let i = 0; i < numParticles; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              vx: (Math.random() - 0.5) * 0.8,
              vy: (Math.random() - 0.5) * 0.8,
              originalVx: (Math.random() - 0.5) * 0.8,
              originalVy: (Math.random() - 0.5) * 0.8,
              size: Math.random() * 3 + 2
            });
          }
        };
        
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Update particles
          particles.forEach(particle => {
            // Mouse repulsion effect
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const repulsionRadius = 150;
            
            if (distance < repulsionRadius && distance > 0) {
              const force = (repulsionRadius - distance) / repulsionRadius;
              const angle = Math.atan2(dy, dx);
              particle.vx += Math.cos(angle) * force * 0.2;
              particle.vy += Math.sin(angle) * force * 0.2;
            } else {
              // Gradually return to original velocity
              particle.vx += (particle.originalVx - particle.vx) * 0.02;
              particle.vy += (particle.originalVy - particle.vy) * 0.02;
            }
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
          });
          
          // Draw connections with increased visibility
          ctx.strokeStyle = '#888888';
          ctx.lineWidth = 1.2;
          
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x;
              const dy = particles[i].y - particles[j].y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              // Increased connection distance for more visible lines
              if (distance < 180) {
                const opacity = (180 - distance) / 180;
                ctx.globalAlpha = opacity * 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
              }
            }
          }
          
          // Draw particles with glow effect
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#888888';
          ctx.shadowColor = '#888888';
          ctx.shadowBlur = 8;
          
          particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          });
          
          ctx.shadowBlur = 0;
          animationId = requestAnimationFrame(animate);
        };
        
        // Mouse event handlers
        const handleMouseMove = (e) => {
          const rect = canvas.getBoundingClientRect();
          mouse.x = e.clientX - rect.left;
          mouse.y = e.clientY - rect.top;
        };
        
        const handleMouseLeave = () => {
          mouse.x = -1000;
          mouse.y = -1000;
        };
        
        // Initialize
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        
        // Add mouse events to parent element
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);
        
        resize();
        createParticles();
        animate();
        
        // Handle resize
        const handleResize = () => {
          resize();
          createParticles();
        };
        
        window.addEventListener('resize', handleResize);
        
        // Return cleanup function
        return {
          destroy: () => {
            if (animationId) {
              cancelAnimationFrame(animationId);
            }
            window.removeEventListener('resize', handleResize);
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
            if (canvas.parentNode) {
              canvas.parentNode.removeChild(canvas);
            }
          }
        };
      }
    }
  };
});
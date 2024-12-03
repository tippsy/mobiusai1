// Setup canvas
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle properties
const particles = [];
const numParticles = 100;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let mouseRadius = 100;

// Create particles
for(let i = 0; i < numParticles; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        baseSpeed: Math.random() * 1 + 0.5,
        angle: Math.random() * Math.PI * 2,
        glowIntensity: Math.random() * 0.5 + 0.5,
        color: `hsl(${Math.random() * 60 + 230}, 70%, 50%)`  // Blue to purple range
    });
}

// Track mouse movement with smoothing
let targetMouseX = mouseX;
let targetMouseY = mouseY;
document.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
});

// Handle navigation background on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Animation loop
function animate() {
    // Smooth mouse movement
    mouseX += (targetMouseX - mouseX) * 0.1;
    mouseY += (targetMouseY - mouseY) * 0.1;

    // Create semi-transparent background for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        // Calculate distance from mouse
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Interactive behavior based on mouse proximity
        if (distance < mouseRadius) {
            const force = (mouseRadius - distance) / mouseRadius;
            particle.x -= (dx / distance) * force * 5;
            particle.y -= (dy / distance) * force * 5;
        }
        
        // Update particle position
        particle.x += Math.cos(particle.angle) * particle.baseSpeed;
        particle.y += Math.sin(particle.angle) * particle.baseSpeed;
        
        // Gradually change particle angle for organic movement
        particle.angle += Math.random() * 0.1 - 0.05;
        
        // Wrap around screen
        if(particle.x < 0) particle.x = canvas.width;
        if(particle.x > canvas.width) particle.x = 0;
        if(particle.y < 0) particle.y = canvas.height;
        if(particle.y > canvas.height) particle.y = 0;
        
        // Draw particle with glow effect
        ctx.save();
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = particle.glowIntensity;
        ctx.fill();
        ctx.restore();
    });
    
    requestAnimationFrame(animate);
}

animate();

// Smooth scroll with enhanced easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const startPosition = window.pageYOffset;
        const targetPosition = target.getBoundingClientRect().top + startPosition;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, 1000);
            window.scrollTo(0, run);
            if (timeElapsed < 1000) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    });
});

// ===== PARTICLE CONSTELLATION BACKGROUND =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = [];
    for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();
window.addEventListener('resize', initParticles);

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
        // Mouse connection
        if (mouse.x && mouse.y) {
            const dx = particles[a].x - mouse.x;
            const dy = particles[a].y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - dist / 150)})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== TYPING EFFECT (with delete) =====
const typingTexts = ["AI Engineer", "Web Developer", "Cloud Enthusiast", "ML Enthusiast", "Open Source Contributor"];
let textIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById('typing');

function typeEffect() {
    const current = typingTexts[textIndex];
    if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex--);
        if (charIndex < 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            setTimeout(typeEffect, 400);
            return;
        }
        setTimeout(typeEffect, 50);
    } else {
        typingEl.textContent = current.substring(0, charIndex++);
        if (charIndex > current.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1800);
            return;
        }
        setTimeout(typeEffect, 100);
    }
}
typeEffect();

// ===== SCROLL PROGRESS BAR =====
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = progress + '%';
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        const top = sec.offsetTop - 200;
        if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
const counterElements = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-count'));
            let count = 0;
            const increment = target / 40;
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    entry.target.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    entry.target.textContent = Math.floor(count);
                }
            }, 40);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
counterElements.forEach(el => counterObserver.observe(el));

// ===== DARK/LIGHT TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.textContent = '☀️';
}
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});
function closeMobile() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
});
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ===== THREE.JS 3D PARTICLE CONSTELLATION BACKGROUND =====
const canvasElement = document.getElementById('particles-canvas');

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvasElement, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Particle System
const particlesGroup = new THREE.Group();
scene.add(particlesGroup);

// Geometry and Material
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({
    color: 0x8b5cf6, // Purple / Lavender
    emissive: 0x3b0764,
    shininess: 100,
    transparent: true,
    opacity: 0.8
});

// Create Particles
const particleCount = 400;
for (let i = 0; i < particleCount; i++) {
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // Distribute randomly in a spherical volume
    const r = 40 + Math.random() * 60;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    mesh.position.x = r * Math.sin(phi) * Math.cos(theta);
    mesh.position.y = r * Math.sin(phi) * Math.sin(theta);
    mesh.position.z = r * Math.cos(phi);

    // Random scale
    const scale = 0.2 + Math.random() * 0.8;
    mesh.scale.set(scale, scale, scale);

    // Store random rotation properties for animation
    mesh.userData = {
        speed: (Math.random() - 0.5) * 0.02,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI
    };

    particlesGroup.add(mesh);
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00d4ff, 2, 100);
pointLight.position.set(0, 0, 50);
scene.add(pointLight);

// Camera Position
camera.position.z = 80;

// Mouse Interaction
let mouseX = 0; let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2);
    mouseY = (event.clientY - window.innerHeight / 2);
});

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
const clock = new THREE.Clock();

function animateParticles() {
    requestAnimationFrame(animateParticles);

    // 1. Smooth, continuous rotation of the entire system
    particlesGroup.rotation.y += 0.002;
    particlesGroup.rotation.x += 0.001;

    // 2. Apply parallax by moving the CAMERA instead of fighting the rotation math
    camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.05;
    // Invert mouseY so scrolling feels natural with the camera
    camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // 3. Gentle bobbing for individual particles
    particlesGroup.children.forEach(mesh => {
        mesh.rotation.x += mesh.userData.speed;
        mesh.rotation.y += mesh.userData.speed;
    });

    renderer.render(scene, camera);
}
animateParticles();

// ===== TYPING EFFECT (with delete) =====
const typingTexts = ["AI ENGINEER", "WEB DEVELOPER", "CLOUD ENTHUSIAST", "ML ENTHUSIAST", "OPEN SOURCE CONTRIBUTOR"];
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

// ===== MESSAGE CENTER SUBMIT =====
const messageForm = document.getElementById('message-form');
const messageStatus = document.getElementById('message-status');
const messageSubmitBtn = document.getElementById('message-submit-btn');

function setMessageStatus(text, kind) {
    if (!messageStatus) return;
    messageStatus.textContent = text;
    messageStatus.classList.remove('success', 'error');
    if (kind) messageStatus.classList.add(kind);
}

if (messageForm && messageSubmitBtn) {
    messageForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const recipient = (messageForm.dataset.recipient || '').trim();
        if (!recipient) {
            setMessageStatus('Owner inbox is not configured yet.', 'error');
            return;
        }

        const formData = new FormData(messageForm);
        const senderName = (formData.get('name') || '').toString().trim();
        const senderEmail = (formData.get('email') || '').toString().trim();
        const senderSubject = (formData.get('subject') || '').toString().trim();
        const senderMessage = (formData.get('message') || '').toString().trim();
        const payload = {
            name: senderName,
            email: senderEmail,
            subject: senderSubject,
            message: `Sender Name: ${senderName}\nSender Email: ${senderEmail}\nSubject: ${senderSubject}\n\nMessage:\n${senderMessage}`,
            _subject: `Portfolio Inbox: ${senderSubject} (from ${senderName})`,
            _replyto: senderEmail,
            _template: 'table',
            _captcha: 'false'
        };

        messageSubmitBtn.disabled = true;
        messageSubmitBtn.textContent = 'Sending...';
        setMessageStatus('Sending your message...', '');

        try {
            const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json().catch(() => ({}));
            if (response.ok && result.success !== false) {
                setMessageStatus('Message sent successfully.', 'success');
                messageForm.reset();
            } else {
                throw new Error(result.message || 'Message failed. Please try again.');
            }
        } catch (error) {
            setMessageStatus(error.message || 'Could not send message right now.', 'error');
        } finally {
            messageSubmitBtn.disabled = false;
            messageSubmitBtn.textContent = 'Send Message';
        }
    });
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ===== CUSTOM MAGNENTIC CURSOR =====
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let ringX = cursorX;
let ringY = cursorY;

if (cursorDot && cursorRing) {
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;

        // Instant dot tracking
        cursorDot.style.left = `${cursorX}px`;
        cursorDot.style.top = `${cursorY}px`;
    });

    // Smooth ring tracking
    function animateCursorRing() {
        ringX += (cursorX - ringX) * 0.15;
        ringY += (cursorY - ringY) * 0.15;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    // Hover states for magnetic effect
    const hoverElements = document.querySelectorAll('a, button, .hero-title');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

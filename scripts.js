/* ═══════════════════════════════════════════════════════════════
   COSMIC FRONTIER — JavaScript
   Interactivity and Visual Effects
   ═══════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────
// Starfield Background
// ─────────────────────────────────────────────────────────────────
class Starfield {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.shootingStars = [];
        this.nebulaClouds = [];
        this.mouseX = 0;
        this.mouseY = 0;

        this.resize();
        this.createStars();
        this.createNebulaClouds();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    createStars() {
        this.stars = [];
        const starCount = Math.floor((this.width * this.height) / 3000);

        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
                color: this.getStarColor()
            });
        }
    }

    getStarColor() {
        const colors = [
            { r: 255, g: 255, b: 255 },  // White
            { r: 200, g: 220, b: 255 },  // Blue-white
            { r: 255, g: 240, b: 220 },  // Warm white
            { r: 180, g: 200, b: 255 },  // Light blue
            { r: 0, g: 245, b: 255 },    // Cyan accent
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createNebulaClouds() {
        this.nebulaClouds = [
            { x: this.width * 0.2, y: this.height * 0.3, radius: 200, color: 'rgba(138, 43, 226, 0.03)' },
            { x: this.width * 0.8, y: this.height * 0.6, radius: 250, color: 'rgba(0, 245, 255, 0.02)' },
            { x: this.width * 0.5, y: this.height * 0.8, radius: 180, color: 'rgba(255, 0, 255, 0.02)' },
        ];
    }

    createShootingStar() {
        if (Math.random() > 0.997) {
            const startX = Math.random() * this.width;
            const startY = Math.random() * this.height * 0.5;

            this.shootingStars.push({
                x: startX,
                y: startY,
                length: Math.random() * 80 + 40,
                speed: Math.random() * 15 + 10,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.5,
                opacity: 1,
                trail: []
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createStars();
            this.createNebulaClouds();
        });

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    drawNebula() {
        this.nebulaClouds.forEach(cloud => {
            const gradient = this.ctx.createRadialGradient(
                cloud.x, cloud.y, 0,
                cloud.x, cloud.y, cloud.radius
            );
            gradient.addColorStop(0, cloud.color);
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.width, this.height);
        });
    }

    drawStars(time) {
        this.stars.forEach(star => {
            // Parallax effect based on mouse
            const parallaxX = (this.mouseX - this.width / 2) * 0.01 * star.size;
            const parallaxY = (this.mouseY - this.height / 2) * 0.01 * star.size;

            // Twinkle effect
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
            const currentOpacity = star.opacity * twinkle;

            const x = star.x + parallaxX;
            const y = star.y + parallaxY;

            // Draw star glow
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, star.size * 3);
            gradient.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${currentOpacity})`);
            gradient.addColorStop(1, 'transparent');

            this.ctx.beginPath();
            this.ctx.arc(x, y, star.size * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            // Draw star core
            this.ctx.beginPath();
            this.ctx.arc(x, y, star.size * 0.5, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${currentOpacity})`;
            this.ctx.fill();
        });
    }

    drawShootingStars() {
        this.shootingStars = this.shootingStars.filter(star => {
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;
            star.opacity -= 0.02;

            // Draw shooting star
            const gradient = this.ctx.createLinearGradient(
                star.x, star.y,
                star.x - Math.cos(star.angle) * star.length,
                star.y - Math.sin(star.angle) * star.length
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
            gradient.addColorStop(0.3, `rgba(0, 245, 255, ${star.opacity * 0.5})`);
            gradient.addColorStop(1, 'transparent');

            this.ctx.beginPath();
            this.ctx.moveTo(star.x, star.y);
            this.ctx.lineTo(
                star.x - Math.cos(star.angle) * star.length,
                star.y - Math.sin(star.angle) * star.length
            );
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Core glow
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();

            return star.opacity > 0 && star.x < this.width && star.y < this.height;
        });
    }

    animate() {
        const time = performance.now() * 0.001;

        // Clear canvas
        this.ctx.fillStyle = '#030308';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw layers
        this.drawNebula();
        this.drawStars(time);
        this.createShootingStar();
        this.drawShootingStars();

        requestAnimationFrame(() => this.animate());
    }
}

// ─────────────────────────────────────────────────────────────────
// Counter Animation
// ─────────────────────────────────────────────────────────────────
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-value[data-count]');
        this.animated = new Set();
        this.bindEvents();
    }

    bindEvents() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animated.add(entry.target);
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const current = Math.floor(target * easeOut);
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(update);
    }
}

// ─────────────────────────────────────────────────────────────────
// Smooth Scroll Navigation
// ─────────────────────────────────────────────────────────────────
class SmoothNavigation {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.bindEvents();
    }

    bindEvents() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    const navHeight = document.querySelector('.main-nav').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ─────────────────────────────────────────────────────────────────
// Section Reveal Animation
// ─────────────────────────────────────────────────────────────────
class SectionReveal {
    constructor() {
        this.sections = document.querySelectorAll('.content-section');
        this.addStyles();
        this.bindEvents();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .content-section {
                opacity: 0;
                transform: translateY(50px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            .content-section.revealed {
                opacity: 1;
                transform: translateY(0);
            }
            .info-card, .concept, .species, .ai-node, .mission-card, .timeline-item, .synthesis-card, .hazard-card {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .revealed .info-card, .revealed .concept, .revealed .species,
            .revealed .ai-node, .revealed .mission-card, .revealed .timeline-item,
            .revealed .synthesis-card, .revealed .hazard-card {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');

                    // Stagger child animations
                    const children = entry.target.querySelectorAll('.info-card, .concept, .species, .ai-node, .mission-card, .timeline-item, .synthesis-card, .hazard-card');
                    children.forEach((child, index) => {
                        child.style.transitionDelay = `${index * 0.1}s`;
                    });
                }
            });
        }, { threshold: 0.1 });

        this.sections.forEach(section => observer.observe(section));
    }
}

// ─────────────────────────────────────────────────────────────────
// Navigation Background Change on Scroll
// ─────────────────────────────────────────────────────────────────
class NavScrollEffect {
    constructor() {
        this.nav = document.querySelector('.main-nav');
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.nav.style.background = 'rgba(3, 3, 8, 0.95)';
                this.nav.style.borderBottom = '1px solid rgba(0, 245, 255, 0.1)';
            } else {
                this.nav.style.background = 'linear-gradient(180deg, rgba(3, 3, 8, 0.95) 0%, rgba(3, 3, 8, 0) 100%)';
                this.nav.style.borderBottom = 'none';
            }
        });
    }
}

// ─────────────────────────────────────────────────────────────────
// Parallax Effect for Hero
// ─────────────────────────────────────────────────────────────────
class HeroParallax {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.heroContent = document.querySelector('.hero-content');
        this.heroVisual = document.querySelector('.hero-visual');
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = this.hero.offsetHeight;

            if (scrolled < heroHeight) {
                const opacity = 1 - (scrolled / heroHeight) * 1.5;
                const translateY = scrolled * 0.4;

                this.heroContent.style.opacity = Math.max(0, opacity);
                this.heroContent.style.transform = `translateY(${translateY}px)`;

                if (this.heroVisual) {
                    this.heroVisual.style.transform = `translateY(calc(-50% + ${scrolled * 0.2}px))`;
                }
            }
        });
    }
}

// ─────────────────────────────────────────────────────────────────
// Glitch Text Effect
// ─────────────────────────────────────────────────────────────────
class GlitchEffect {
    constructor() {
        this.addStyles();
        this.bindEvents();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glitch {
                0%, 100% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
            }
            .glitch-active {
                animation: glitch 0.3s ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        const titles = document.querySelectorAll('.section-title, .hero-title');

        titles.forEach(title => {
            setInterval(() => {
                if (Math.random() > 0.95) {
                    title.classList.add('glitch-active');
                    setTimeout(() => title.classList.remove('glitch-active'), 300);
                }
            }, 3000);
        });
    }
}

// ─────────────────────────────────────────────────────────────────
// Interactive Card Hover Effects
// ─────────────────────────────────────────────────────────────────
class CardHoverEffect {
    constructor() {
        this.cards = document.querySelectorAll('.info-card, .ai-node, .mission-card, .synthesis-card, .hazard-card');
        this.bindEvents();
    }

    bindEvents() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
}

// ─────────────────────────────────────────────────────────────────
// Cursor Trail Effect
// ─────────────────────────────────────────────────────────────────
class CursorTrail {
    constructor() {
        this.trail = [];
        this.trailLength = 20;
        this.createTrailElements();
        this.bindEvents();
    }

    createTrailElements() {
        const container = document.createElement('div');
        container.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;';

        for (let i = 0; i < this.trailLength; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: absolute;
                width: ${4 - (i * 0.15)}px;
                height: ${4 - (i * 0.15)}px;
                background: rgba(0, 245, 255, ${0.5 - (i * 0.025)});
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: opacity 0.3s ease;
            `;
            container.appendChild(dot);
            this.trail.push({ element: dot, x: 0, y: 0 });
        }

        document.body.appendChild(container);
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.trail.forEach((dot, index) => {
                setTimeout(() => {
                    dot.x = e.clientX;
                    dot.y = e.clientY;
                    dot.element.style.left = dot.x + 'px';
                    dot.element.style.top = dot.y + 'px';
                }, index * 20);
            });
        });
    }
}

// ─────────────────────────────────────────────────────────────────
// Sound Effects (Optional - disabled by default)
// ─────────────────────────────────────────────────────────────────
class SoundEffects {
    constructor() {
        this.enabled = false; // Set to true to enable sounds
        this.audioContext = null;

        if (this.enabled) {
            this.initAudio();
        }
    }

    initAudio() {
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
    }

    playHoverSound() {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
}

// ─────────────────────────────────────────────────────────────────
// Deep Dive Expand/Collapse
// ─────────────────────────────────────────────────────────────────
class DeepDiveToggle {
    constructor() {
        this.toggles = document.querySelectorAll('.deep-dive-toggle');
        this.bindEvents();
    }

    bindEvents() {
        this.toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const deepDive = toggle.closest('.deep-dive');
                const isExpanded = deepDive.dataset.expanded === 'true';
                deepDive.dataset.expanded = isExpanded ? 'false' : 'true';
            });
        });
    }
}

// ─────────────────────────────────────────────────────────────────
// Subsection Reveal Animation
// ─────────────────────────────────────────────────────────────────
class SubsectionReveal {
    constructor() {
        this.addStyles();
        this.bindEvents();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .subsection {
                opacity: 0;
                transform: translateY(40px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            .subsection.revealed {
                opacity: 1;
                transform: translateY(0);
            }
            .evo-item, .terminal-entry, .synthesis-card, .hazard-card, .memorial-entry {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            .revealed .evo-item, .revealed .terminal-entry,
            .revealed .synthesis-card, .revealed .hazard-card,
            .revealed .memorial-entry {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');

                    // Stagger child animations
                    const children = entry.target.querySelectorAll(
                        '.evo-item, .terminal-entry, .synthesis-card, .hazard-card, .memorial-entry'
                    );
                    children.forEach((child, index) => {
                        child.style.transitionDelay = `${index * 0.1}s`;
                    });
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.subsection').forEach(sub => observer.observe(sub));
    }
}

// ─────────────────────────────────────────────────────────────────
// Terminal Typing Effect
// ─────────────────────────────────────────────────────────────────
class TerminalTyping {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                    entry.target.classList.add('typed');
                    this.animateTerminal(entry.target);
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.data-terminal').forEach(terminal => {
            observer.observe(terminal);
        });
    }

    animateTerminal(terminal) {
        const entries = terminal.querySelectorAll('.terminal-entry');
        entries.forEach((entry, index) => {
            entry.style.opacity = '0';
            entry.style.transform = 'translateX(-10px)';
            entry.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

            setTimeout(() => {
                entry.style.opacity = '1';
                entry.style.transform = 'translateX(0)';
            }, 200 + (index * 150));
        });
    }
}

// ─────────────────────────────────────────────────────────────────
// Initialize Everything
// ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    const starfield = new Starfield(document.getElementById('starfield'));
    const counterAnimation = new CounterAnimation();
    const smoothNav = new SmoothNavigation();
    const sectionReveal = new SectionReveal();
    const navScroll = new NavScrollEffect();
    const heroParallax = new HeroParallax();

    // Visual effects
    const glitchEffect = new GlitchEffect();
    const cardHover = new CardHoverEffect();
    const cursorTrail = new CursorTrail();

    // New content depth features
    const deepDiveToggle = new DeepDiveToggle();
    const subsectionReveal = new SubsectionReveal();
    const terminalTyping = new TerminalTyping();

    // Optional
    const soundEffects = new SoundEffects();

    // Preloader simulation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Console Easter Egg
    console.log('%c◈ COSMIC FRONTIER ◈', 'color: #00f5ff; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00f5ff;');
    console.log('%cTransmission received from the year 3024', 'color: #a0a0c0; font-size: 12px;');
    console.log('%cWelcome, traveler.', 'color: #ff00ff; font-size: 14px;');
});

// ─────────────────────────────────────────────────────────────────
// Utility: Detect reduced motion preference
// ─────────────────────────────────────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--transition-speed', '0s');
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

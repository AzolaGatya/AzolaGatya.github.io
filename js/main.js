/* ============================================================
   AZOLA GATYA — main.js
   Interactions: page transitions, typing hero, scroll-reveal,
   project card tilt, active nav on scroll
   ============================================================ */

/* ─── PAGE ORDER (cycle through these in sequence) ───────── */
const PAGE_ORDER = [
    'index.html',
    'about.html',
    'projects.html',
    'contacts.html',
];

/* ─── PAGE TRANSITION ─────────────────────────────────────── */
(function () {
    const overlay = document.createElement('div');
    overlay.id = 'page-overlay';
    document.body.appendChild(overlay);

    window.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(() => {
            overlay.classList.add('fade-out');
        });
    });

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');
        const isInternal =
            href &&
            !href.startsWith('http') &&
            !href.startsWith('mailto') &&
            !href.startsWith('tel') &&
            !href.startsWith('#') &&
            !link.hasAttribute('download') &&
            !link.target;

        if (isInternal) {
            e.preventDefault();
            overlay.classList.remove('fade-out');
            overlay.classList.add('fade-in');
            setTimeout(() => {
                window.location.href = href;
            }, 380);
        }
    });
})();


/* ─── TYPING ANIMATION (hero only) ───────────────────────── */
function initTyping() {
    const el = document.getElementById('typing-target');
    if (!el) return;

    const phrases = [
        'The One Piece... is clean code.',
        'Hello, friend.',
        'You\u2019ve been searching for something...',
        'A Junior Software Developer.',
        'A Web & Mobile Builder.',
        'A Clean Code Advocate.',
        'A Problem Solver.',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
        const current = phrases[phraseIndex];

        if (!deleting) {
            el.textContent = current.slice(0, ++charIndex);
            if (charIndex === current.length) {
                setTimeout(() => { deleting = true; tick(); }, 1800);
                return;
            }
        } else {
            el.textContent = current.slice(0, --charIndex);
            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }

        setTimeout(tick, deleting ? 45 : 90);
    }

    setTimeout(tick, 800);
}


/* ─── SCROLL-REVEAL ───────────────────────────────────────── */
function initScrollReveal() {
    const targets = document.querySelectorAll(
        '.project-card, .skill-category, .education-item, .contact-item, .about-bio, .about-sidebar, .hero-card'
    );
    if (!targets.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const siblings = [...entry.target.parentElement.children];
                    const delay = siblings.indexOf(entry.target) * 80;
                    setTimeout(() => entry.target.classList.add('revealed'), delay);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    targets.forEach((el) => {
        el.classList.add('reveal-hidden');
        observer.observe(el);
    });
}


/* ─── PROJECT CARD 3-D TILT ───────────────────────────────── */
function initCardTilt() {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateX = ((y - cy) / cy) * -6;
            const rotateY = ((x - cx) / cx) * 6;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}


/* ─── ACTIVE NAV ON SCROLL ────────────────────────────────── */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id], main[id]');
    if (!sections.length) return;

    const navLinks = document.querySelectorAll('nav a');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    navLinks.forEach((link) => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').includes(entry.target.id)) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        },
        { threshold: 0.5 }
    );

    sections.forEach((s) => observer.observe(s));
}


/* ─── NAV SCROLL SHRINK ───────────────────────────────────── */
function initNavShrink() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        nav.classList.toggle('nav-scrolled', window.scrollY > 60);
    }, { passive: true });
}


/* ─── CURSOR DOT ──────────────────────────────────────────── */
function initCursorDot() {
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    document.body.appendChild(dot);

    const ring = document.createElement('div');
    ring.id = 'cursor-ring';
    document.body.appendChild(ring);

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    });

    (function animateRing() {
        rx += (mx - rx) * 0.14;
        ry += (my - ry) * 0.14;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .project-card, .filter-btn, input, textarea, select').forEach((el) => {
        el.addEventListener('mouseenter', () => ring.classList.add('ring-expand'));
        el.addEventListener('mouseleave', () => ring.classList.remove('ring-expand'));
    });
}


/* ─── SKILL TAG RIPPLE ────────────────────────────────────── */
function initSkillRipple() {
    document.querySelectorAll('.skill-tag').forEach((tag) => {
        tag.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top  = (e.clientY - rect.top)  + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}


/* ─── SCROLL-TO-BOTTOM AUTO PAGE CYCLE ────────────────────── */
function initScrollPageCycle() {
    // Determine current page filename
    const currentFile  = window.location.pathname.split('/').pop() || 'index.html';
    const normalised   = currentFile === '' ? 'index.html' : currentFile;
    const currentIndex = PAGE_ORDER.indexOf(normalised);
    if (currentIndex === -1) return;

    const nextPage  = PAGE_ORDER[(currentIndex + 1) % PAGE_ORDER.length];
    const nextLabel = nextPage.replace('.html', '');
    const HOLD_MS   = 1200;

    /* ── Inject toast styles ── */
    const style = document.createElement('style');
    style.textContent = `
        #scroll-page-toast {
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%) translateY(140%);
            background: var(--color-surface, #1e1e2e);
            color: var(--color-text, #cdd6f4);
            border: 1px solid var(--color-border, #313244);
            padding: 0.75rem 1.5rem 0.6rem;
            border-radius: 999px;
            font-size: 0.85rem;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            transition: transform 0.4s cubic-bezier(.34,1.56,.64,1);
            z-index: 99999;
            text-align: center;
            min-width: 240px;
            pointer-events: none;
        }
        #scroll-page-toast.show {
            transform: translateX(-50%) translateY(0);
        }
        #spt-bar {
            height: 3px;
            background: var(--color-accent, #cba6f7);
            border-radius: 999px;
            margin-top: 0.5rem;
            width: 0%;
            transition: none;
        }
        #spt-bar.filling {
            width: 100%;
            transition: width ${HOLD_MS}ms linear;
        }
    `;
    document.head.appendChild(style);

    const toast = document.createElement('div');
    toast.id = 'scroll-page-toast';
    toast.innerHTML = `Going to <strong>${nextLabel}</strong>&hellip;<div id="spt-bar"></div>`;
    document.body.appendChild(toast);

    const bar = document.getElementById('spt-bar');

    let fillTimer = null;
    let triggered = false;

    function isAtBottom() {
        const docHeight = document.documentElement.scrollHeight;
        const viewHeight = window.innerHeight;
        // If the page has no scrollable area, skip
        if (docHeight <= viewHeight + 4) return false;
        return window.scrollY + viewHeight >= docHeight - 6;
    }

    function showToast() {
        toast.classList.add('show');
        bar.classList.remove('filling');
        void bar.offsetWidth; // force reflow to reset width
        bar.classList.add('filling');
    }

    function hideToast() {
        toast.classList.remove('show');
        bar.classList.remove('filling');
        void bar.offsetWidth;
    }

    function navigate() {
        triggered = true;
        const overlay = document.getElementById('page-overlay');
        if (overlay) {
            overlay.classList.remove('fade-out');
            overlay.classList.add('fade-in');
        }
        setTimeout(() => { window.location.href = nextPage; }, 380);
    }

    window.addEventListener('scroll', () => {
        if (triggered) return;

        if (isAtBottom()) {
            if (fillTimer) return; // already counting down
            showToast();
            fillTimer = setTimeout(navigate, HOLD_MS);
        } else {
            if (fillTimer) {
                clearTimeout(fillTimer);
                fillTimer = null;
                hideToast();
            }
        }
    }, { passive: true });
}


/* ─── BOOT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initTyping();
    initScrollReveal();
    initCardTilt();
    initActiveNav();
    initNavShrink();
    initCursorDot();
    initSkillRipple();
    initScrollPageCycle();
});

/* ============================================================
   AZOLA GATYA — main.js
   Interactions: page transitions, typing hero, scroll-reveal,
   active nav on scroll, and contact form submission
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
        if (
            e.defaultPrevented ||
            e.button !== 0 ||
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey
        ) return;

        const link = e.target.closest('a[href]');
        if (!link) return;

        const destination = new URL(link.href, window.location.href);
        const isInternal =
            destination.origin === window.location.origin &&
            (destination.protocol === 'http:' || destination.protocol === 'https:') &&
            !link.hasAttribute('download') &&
            !link.hasAttribute('target') &&
            !(destination.pathname === window.location.pathname &&
                destination.search === window.location.search &&
                destination.hash);

        if (isInternal) {
            e.preventDefault();
            overlay.classList.remove('fade-out');
            overlay.classList.add('fade-in');
            setTimeout(() => {
                window.location.href = destination.href;
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
        '.skill-category, .education-item, .contact-item, .about-bio, .about-sidebar, .hero-card'
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

    document.querySelectorAll('a, button, input, textarea, select').forEach((el) => {
        el.addEventListener('mouseenter', () => ring.classList.add('ring-expand'));
        el.addEventListener('mouseleave', () => ring.classList.remove('ring-expand'));
    });
}


/* ─── CONTACT FORM ────────────────────────────────────────── */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const submitButton = form?.querySelector('button[type="submit"]');
    if (!form || !status || !submitButton) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        status.textContent = 'Sending your message...';
        submitButton.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                status.textContent = 'Your message could not be sent. Please try again later.';
                return;
            }

            form.reset();
            status.textContent = "Message sent! I'll be in touch soon.";
        } catch {
            status.textContent = 'A network error prevented your message from sending. Please try again.';
        } finally {
            submitButton.disabled = false;
        }
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
    initActiveNav();
    initNavShrink();
    initCursorDot();
    initContactForm();
    initScrollPageCycle();
});

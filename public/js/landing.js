/* ── Landing Page Animations (Anime.js) ── */
/* Professional, classy entrance animations with scroll-trigger */

document.addEventListener('DOMContentLoaded', () => {

    // ── Initial state: hide all animated elements ──
    document.querySelectorAll('[data-anim]').forEach(el => {
        el.style.opacity = '0';
    });

    // ── Navbar slide-in ──
    anime({
        targets: '#navbar',
        translateY: [-20, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutCubic',
        delay: 100,
    });

    // ── Hero staggered entrance ──
    const heroEls = document.querySelectorAll('.hero [data-anim="fade-up"]');
    anime({
        targets: heroEls,
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 900,
        easing: 'easeOutCubic',
        delay: anime.stagger(150, { start: 400 }),
    });

    // ── Scroll-triggered animations ──
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15,
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const animType = el.dataset.anim;

            // Skip hero elements (already animated on load)
            if (el.closest('.hero')) return;

            switch (animType) {
                case 'fade-up':
                    anime({
                        targets: el,
                        translateY: [30, 0],
                        opacity: [0, 1],
                        duration: 800,
                        easing: 'easeOutCubic',
                    });
                    break;

                case 'fade-up-stagger':
                    // Animate all siblings at once with stagger
                    const siblings = el.parentElement.querySelectorAll('[data-anim="fade-up-stagger"]');
                    anime({
                        targets: siblings,
                        translateY: [40, 0],
                        opacity: [0, 1],
                        duration: 800,
                        easing: 'easeOutCubic',
                        delay: anime.stagger(120),
                    });
                    // Unobserve all siblings to prevent retriggering
                    siblings.forEach(s => scrollObserver.unobserve(s));
                    break;

                case 'scale-x':
                    anime({
                        targets: el,
                        scaleX: [0, 1],
                        opacity: [0, 1],
                        duration: 600,
                        easing: 'easeOutCubic',
                    });
                    break;

                case 'fade-in':
                    anime({
                        targets: el,
                        opacity: [0, 1],
                        duration: 800,
                        easing: 'easeOutCubic',
                    });
                    break;
            }

            scrollObserver.unobserve(el);
        });
    }, observerOptions);

    // Observe all scroll-animated elements (except hero, which animates on load)
    document.querySelectorAll('[data-anim]').forEach(el => {
        if (!el.closest('.hero') && el.id !== 'navbar') {
            scrollObserver.observe(el);
        }
    });

    // ── CTA button hover micro-animation ──
    document.querySelectorAll('.cta-primary, .cta-light').forEach(btn => {
        const arrow = btn.querySelector('.bi-arrow-right');
        if (!arrow) return;

        btn.addEventListener('mouseenter', () => {
            anime({
                targets: arrow,
                translateX: [0, 5],
                duration: 300,
                easing: 'easeOutCubic',
            });
        });

        btn.addEventListener('mouseleave', () => {
            anime({
                targets: arrow,
                translateX: [5, 0],
                duration: 300,
                easing: 'easeOutCubic',
            });
        });
    });

    // ── Principle number count-up on reveal ──
    const principleNums = document.querySelectorAll('.principle-number');
    const numObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const target = parseInt(el.textContent);

            anime({
                targets: el,
                innerHTML: [0, target],
                round: 1,
                duration: 1200,
                easing: 'easeInOutQuad',
                update: (anim) => {
                    const val = Math.round(anim.animations[0].currentValue);
                    el.textContent = val.toString().padStart(2, '0');
                },
            });

            numObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    principleNums.forEach(num => numObserver.observe(num));
});

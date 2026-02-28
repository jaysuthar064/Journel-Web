/* ── Global Loading Controller ── */

(function () {
    'use strict';

    // Hide loader when page is fully loaded
    window.addEventListener('load', () => {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            // Small delay to ensure smooth transition
            setTimeout(() => {
                loader.classList.add('loaded');
            }, 200);

            // Remove from DOM after transition
            setTimeout(() => {
                loader.remove();
            }, 700);
        }
    });

    // Show loader on navigation (when clicking links that navigate away)
    document.addEventListener('DOMContentLoaded', () => {
        // Add submit loading state to all forms
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.classList.add('btn-loading');
                    submitBtn.disabled = true;
                }

                // Show page loader for form submissions as the page will navigate
                const loader = document.getElementById('pageLoader');
                if (loader) {
                    loader.classList.remove('loaded');
                }
            });
        });

        // Show loader when clicking navigation links (but not anchor links or JS buttons)
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('/') && !href.startsWith('#')) {
                link.addEventListener('click', () => {
                    const loader = document.getElementById('pageLoader');
                    if (loader) {
                        loader.classList.remove('loaded');
                    }
                });
            }
        });
    });
})();

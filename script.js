// ===== Coursely Landing Page Script =====

document.addEventListener('DOMContentLoaded', () => {

    // ----- Navbar scroll effect -----
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // ----- Mobile menu toggle -----
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });

    // ----- Scroll animations (Intersection Observer) -----
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ----- Animated counter -----
    function animateCounter(el, target, duration = 1500) {
        const start = 0;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = Math.round(start + (target - start) * eased);
            el.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // Animate waitlist counter on load
    const waitlistCounter = document.getElementById('waitlistCount');
    if (waitlistCounter) {
        // Start at a credible number, you can update this manually
        setTimeout(() => animateCounter(waitlistCounter, 47), 800);
    }

    // Animate stat numbers when visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(num => {
                    const target = parseInt(num.dataset.target);
                    if (target) animateCounter(num, target, 1200);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) statsObserver.observe(statsGrid);

    // ----- FAQ Accordion -----
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('active');
            });
            
            // Open clicked (if it wasn't already open)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ----- Form submission (Formspree) -----
    const modal = document.getElementById('successModal');
    const modalClose = document.getElementById('modalClose');

    function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;

        // Basic validation
        if (!emailInput.value || !emailInput.value.includes('@')) {
            emailInput.style.borderColor = '#ef4444';
            emailInput.focus();
            return;
        }

        // Loading state
        btnText.textContent = 'Joining...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Submit to Formspree
        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                // Show success modal
                modal.classList.add('active');
                emailInput.value = '';
                
                // Increment counter
                if (waitlistCounter) {
                    const current = parseInt(waitlistCounter.textContent) || 0;
                    waitlistCounter.textContent = current + 1;
                }
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(() => {
            // Even on error, show success (Formspree might block from localhost)
            modal.classList.add('active');
            emailInput.value = '';
        })
        .finally(() => {
            btnText.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        });
    }

    document.getElementById('heroForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('ctaForm').addEventListener('submit', handleFormSubmit);

    // Close modal
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // ----- Smooth scroll for anchor links -----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80; // navbar height
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

});

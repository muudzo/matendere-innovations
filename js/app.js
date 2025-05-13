// Core app functionality with optimized code
const App = {
    init() {
        this.nav = document.querySelector('nav');
        this.mobileMenuBtn = document.getElementById('menu-toggle');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.cards = document.querySelectorAll('.pillar-card');
        
        this.setupEventListeners();
        this.setupAnimations();
    },

    setupEventListeners() {
        // Mobile menu
        this.mobileMenuBtn?.addEventListener('click', () => {
            const isHidden = this.mobileMenu?.classList.contains('hidden');
            this.toggleMobileMenu(!isHidden);
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#mobile-menu') && !e.target.closest('#menu-toggle')) {
                this.toggleMobileMenu(false);
            }
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                target?.scrollIntoView({ behavior: 'smooth' });
                this.toggleMobileMenu(false);
            });
        });

        // Scroll handler with debounce
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            if (Date.now() - lastScroll > 100) { // Basic debounce
                this.handleScroll();
                lastScroll = Date.now();
            }
        });

        // Card interactions
        this.cards.forEach(card => {
            card.addEventListener('click', () => this.toggleCard(card));
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleCard(card);
                }
            });
        });
    },

    toggleMobileMenu(show) {
        this.mobileMenu?.classList.toggle('hidden', !show);
        this.mobileMenu?.classList.toggle('block', show);
        this.mobileMenuBtn?.setAttribute('aria-expanded', show);
    },

    handleScroll() {
        const hasScrolled = window.scrollY > 50;
        this.nav?.classList.toggle('bg-white', hasScrolled);
        this.nav?.classList.toggle('shadow-lg', hasScrolled);
        this.nav?.classList.toggle('bg-opacity-90', !hasScrolled);
    },

    toggleCard(card) {
        const details = card.querySelector('.pillar-details');
        const isExpanded = details.classList.contains('block');

        // Close other cards
        this.cards.forEach(other => {
            if (other !== card) {
                const otherDetails = other.querySelector('.pillar-details');
                otherDetails.classList.add('hidden');
                otherDetails.classList.remove('block');
                other.setAttribute('aria-expanded', 'false');
            }
        });

        // Toggle current card
        details.classList.toggle('hidden', isExpanded);
        details.classList.toggle('block', !isExpanded);
        card.setAttribute('aria-expanded', !isExpanded);

        // Scroll into view if needed
        if (!isExpanded && !this.isElementVisible(card)) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },

    isElementVisible(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.bottom <= window.innerHeight
        );
    },

    setupAnimations() {
        // Simple CSS-based animations instead of GSAP for better performance
        document.documentElement.style.setProperty('--animate-duration', '0.5s');
        
        const heroElements = ['#hero-title', '#hero-subtitle', '#hero-cta'];
        heroElements.forEach((selector, index) => {
            const el = document.querySelector(selector);
            if (el) {
                el.classList.add('animate-fade-in');
                el.style.animationDelay = `${index * 0.2}s`;
            }
        });

        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init()); 
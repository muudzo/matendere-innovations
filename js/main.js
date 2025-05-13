// Main JavaScript file for core functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    Animations.init();
    PillarCards.init();
});

// Navigation module
const Navigation = {
    init() {
        this.nav = document.querySelector('nav');
        this.mobileMenuBtn = document.getElementById('menu-toggle');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Handle mobile menu toggle
        this.mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());

        // Handle scroll behavior
        window.addEventListener('scroll', () => this.handleScroll());

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.mobileMenu?.classList.contains('block') && 
                !e.target.closest('#mobile-menu') && 
                !e.target.closest('#menu-toggle')) {
                this.toggleMobileMenu(false);
            }
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    this.toggleMobileMenu(false);
                }
            });
        });
    },

    toggleMobileMenu(force) {
        const isHidden = this.mobileMenu?.classList.contains('hidden');
        const shouldShow = force === undefined ? isHidden : force;
        
        if (shouldShow) {
            this.mobileMenu?.classList.remove('hidden');
            this.mobileMenu?.classList.add('block');
            this.mobileMenuBtn?.setAttribute('aria-expanded', 'true');
        } else {
            this.mobileMenu?.classList.add('hidden');
            this.mobileMenu?.classList.remove('block');
            this.mobileMenuBtn?.setAttribute('aria-expanded', 'false');
        }
    },

    handleScroll() {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 50) {
            this.nav?.classList.add('bg-white', 'shadow-lg');
            this.nav?.classList.remove('bg-opacity-90');
        } else {
            this.nav?.classList.remove('bg-white', 'shadow-lg');
            this.nav?.classList.add('bg-opacity-90');
        }
    }
};

// Animations module using GSAP
const Animations = {
    init() {
        this.setupHeroAnimations();
        this.setupScrollAnimations();
    },

    setupHeroAnimations() {
        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
        
        timeline
            .fromTo('#hero-title', 
                { y: 50, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1 }
            )
            .fromTo('#hero-subtitle',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 },
                '-=0.5'
            )
            .fromTo('#hero-cta',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 },
                '-=0.5'
            );
    },

    setupScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Animate sections on scroll
        gsap.utils.toArray('section').forEach((section, i) => {
            gsap.fromTo(section,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'top 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }
};

// Pillar Cards module
const PillarCards = {
    init() {
        this.cards = document.querySelectorAll('.pillar-card');
        this.setupEventListeners();
    },

    setupEventListeners() {
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

    toggleCard(card) {
        const details = card.querySelector('.pillar-details');
        const isExpanded = details.classList.contains('block');

        // Close other open cards
        this.cards.forEach(otherCard => {
            if (otherCard !== card) {
                const otherDetails = otherCard.querySelector('.pillar-details');
                otherDetails.classList.add('hidden');
                otherDetails.classList.remove('block');
                otherCard.setAttribute('aria-expanded', 'false');
            }
        });

        // Toggle current card
        if (isExpanded) {
            details.classList.add('hidden');
            details.classList.remove('block');
            card.setAttribute('aria-expanded', 'false');
        } else {
            details.classList.remove('hidden');
            details.classList.add('block');
            card.setAttribute('aria-expanded', 'true');
        }

        // Smooth scroll to card if it's not fully visible
        if (!isExpanded) {
            const cardRect = card.getBoundingClientRect();
            const isFullyVisible = (
                cardRect.top >= 0 &&
                cardRect.bottom <= window.innerHeight
            );

            if (!isFullyVisible) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
}; 
// Animations configuration
const animationConfig = {
    defaults: {
        ease: 'power3.out',
        duration: 1
    },
    hero: {
        title: {
            initial: { y: 50, opacity: 0 },
            animate: { y: 0, opacity: 1 }
        },
        subtitle: {
            initial: { y: 30, opacity: 0 },
            animate: { y: 0, opacity: 1 }
        },
        cta: {
            initial: { y: 20, opacity: 0 },
            animate: { y: 0, opacity: 1 }
        }
    },
    scroll: {
        section: {
            initial: { opacity: 0, y: 50 },
            animate: { opacity: 1, y: 0 },
            trigger: {
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none reverse'
            }
        }
    }
};

// Export animation functions
export const initAnimations = () => {
    setupHeroAnimations();
    setupScrollAnimations();
    setupPillarAnimations();
};

const setupHeroAnimations = () => {
    const timeline = gsap.timeline({ defaults: animationConfig.defaults });
    const { hero } = animationConfig;

    timeline
        .fromTo('#hero-title', 
            hero.title.initial,
            hero.title.animate
        )
        .fromTo('#hero-subtitle',
            hero.subtitle.initial,
            hero.subtitle.animate,
            '-=0.5'
        )
        .fromTo('#hero-cta',
            hero.cta.initial,
            hero.cta.animate,
            '-=0.5'
        );
};

const setupScrollAnimations = () => {
    gsap.registerPlugin(ScrollTrigger);
    const { section } = animationConfig.scroll;

    gsap.utils.toArray('section').forEach(element => {
        gsap.fromTo(element,
            section.initial,
            {
                ...section.animate,
                duration: animationConfig.defaults.duration,
                scrollTrigger: {
                    trigger: element,
                    ...section.trigger
                }
            }
        );
    });
};

const setupPillarAnimations = () => {
    gsap.utils.toArray('.pillar-card').forEach(card => {
        const details = card.querySelector('.pillar-details');
        
        gsap.set(details, { height: 0, opacity: 0 });

        card.addEventListener('click', () => {
            const isExpanded = details.style.height !== '0px';
            
            if (!isExpanded) {
                // First, set height to auto to measure it
                gsap.set(details, { height: 'auto', display: 'block' });
                const height = details.offsetHeight;
                
                // Then animate from 0 to the measured height
                gsap.fromTo(details,
                    { height: 0, opacity: 0 },
                    {
                        height: height,
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    }
                );
            } else {
                gsap.to(details, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => gsap.set(details, { display: 'none' })
                });
            }
        });
    });
}; 
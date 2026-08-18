// Scroll Reveal Animation
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to clicked link
            if(this.classList.contains('active') === false && this.closest('.nav-links')) {
                this.classList.add('active');
            }

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = [
        ...document.querySelectorAll('.hero-content > *'),
        ...document.querySelectorAll('.portfolio-item'),
        ...document.querySelectorAll('.timeline-step'),
        document.querySelector('.cta-container'),
        ...document.querySelectorAll('.scroll-anim')
    ];

    animateElements.forEach((el, index) => {
        if(el) {
            if (!el.classList.contains('scroll-anim')) {
                el.classList.add('fade-up');
            }
            // Stagger delay for elements that are siblings
            if(el.classList.contains('portfolio-item') || el.classList.contains('timeline-step')) {
                el.style.transitionDelay = `${(index % 3) * 0.1}s`;
            } else if (!el.classList.contains('scroll-anim')) {
                el.style.transitionDelay = `${index * 0.1}s`;
            }
            observer.observe(el);
        }
    });
});

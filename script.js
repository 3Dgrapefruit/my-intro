// Simple interactions for grapefruit's self-introduction page

document.addEventListener('DOMContentLoaded', () => {
    console.log("Welcome to grapefruit's profile page!");

    // Subtle fade-in effect for sections as they come into view
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        // Initial state
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity(1) 0.8s ease-out, transform 0.8s ease-out';
        
        // Correcting transition property string (opacity, not opacity(1))
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        
        observer.observe(section);
    });
});

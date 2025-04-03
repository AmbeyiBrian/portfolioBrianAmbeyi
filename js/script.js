document.addEventListener('DOMContentLoaded', function() {

    // --- Cache DOM Elements ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('#navbar a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    const yearSpan = document.getElementById('year');
    const backToTopButton = document.querySelector('.back-to-top');
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    // --- Set Current Year in Footer ---
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Sticky Navbar & Back to Top Button Visibility ---
    const handleScroll = () => {
        const scrollPosition = window.scrollY;

        // Sticky Nav Background (optional - if you want to change it on scroll)
        // if (navbar && scrollPosition > 50) {
        //     navbar.classList.add('scrolled');
        // } else if (navbar) {
        //     navbar.classList.remove('scrolled');
        // }

        // Back to Top Button
        if (backToTopButton) {
            if (scrollPosition > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }

        // Active Nav Link Highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Consider navbar height for more accuracy
            const navHeight = navbar ? navbar.offsetHeight : 0;
            if (scrollPosition >= sectionTop - navHeight - 50 && // Added offset
                scrollPosition < sectionTop + sectionHeight - navHeight - 50) {
                currentSectionId = section.getAttribute('id');
            }
        });

         // Special case for reaching the top
         if (scrollPosition < sections[0].offsetTop - (navbar ? navbar.offsetHeight : 0) - 50) {
            currentSectionId = 'hero'; // Assuming 'hero' is the ID of your top section/header
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's href matches the current section ID
            // Handle '#hero' case separately if needed, or ensure consistent section IDs
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load

    // --- Smooth Scrolling for Internal Links ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Ensure it's an internal link before preventing default
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    // Use getBoundingClientRect for position relative to viewport
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    // Calculate final scroll position, accounting for navbar and scroll offset
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 10; // 10px buffer

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Optional: Close mobile nav if you implement one
                }
            }
        });
    });

    // Smooth scroll for Back to Top button
    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // --- Intersection Observer for Scroll Animations ---
    const revealOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    };

    // Options for the observer (can be adjusted)
    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver(revealOnScroll, observerOptions);

    scrollRevealElements.forEach(el => {
        observer.observe(el);
    });

});
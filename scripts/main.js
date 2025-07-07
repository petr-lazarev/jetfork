document.addEventListener('DOMContentLoaded', function() {
    const pages = document.querySelectorAll('.page');
    const isMainPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');

    function navigateToSection(sectionId) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(navLink => {
            navLink.classList.remove('active');
        });
        
        const activeNavLink = document.querySelector(`a[href="#${sectionId}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }
        
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            targetElement.classList.add('active');
        }
    }

    function scrollToSection(sectionId) {
        setTimeout(() => {
            const targetElement = document.getElementById(sectionId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.offsetTop;
                window.scrollTo({
                    top: elementPosition - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    // Only handle hash navigation on main page
    if (isMainPage && window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        navigateToSection(sectionId);
        scrollToSection(sectionId);
    }
}); 
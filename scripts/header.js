// Header component loader
async function loadHeader() {
    // Check if header already exists
    const existingHeader = document.querySelector('header');
    if (existingHeader && !existingHeader.classList.contains('fallback-header')) {
        console.log('Header already exists, skipping load');
        setActiveNavigation();
        initializeHeader();
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Check if we're on file:// protocol - if so, skip fetch and go straight to fallback
    if (window.location.protocol === 'file:') {
        console.log('File protocol detected, using fallback header');
        createFallbackHeader();
        hideLoadingState();
        return;
    }
    
    try {
        // Determine the path to the header component based on current page
        const currentPath = window.location.pathname;
        const isArticlePage = currentPath.includes('/writings/');
        const headerPath = isArticlePage ? '../components/header.html' : 'components/header.html';
        
        console.log('Loading header from:', headerPath);
        console.log('Current location:', window.location);
        
        const response = await fetch(headerPath);
        if (!response.ok) {
            console.error(`Failed to fetch header: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const headerHtml = await response.text();
        console.log('Header HTML loaded:', headerHtml.substring(0, 100) + '...');
        
        // Insert header at the beginning of body or replace placeholder
        const placeholder = document.getElementById('header-placeholder');
        if (placeholder) {
            placeholder.innerHTML = headerHtml;
        } else {
            document.body.insertAdjacentHTML('afterbegin', headerHtml);
        }
        
        // Fix relative paths for article pages
        fixRelativePaths();
        
        // Set active state based on current page
        setActiveNavigation();
        
        // Initialize header functionality
        initializeHeader();
        
        // Hide loading state
        hideLoadingState();
        
        console.log('Header loaded successfully');
    } catch (error) {
        console.error('Error loading header:', error);
        // Fallback: create a basic header if loading fails
        createFallbackHeader();
        // Hide loading state even on error
        hideLoadingState();
    }
}

// Set active navigation state
function setActiveNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Remove all active classes
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Set active based on current page
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
        // Homepage - no active nav item
    } else if (currentPath.endsWith('about.html')) {
        document.querySelector('a[href="about.html"]')?.classList.add('active');
    } else if (currentPath.endsWith('writings.html')) {
        document.querySelector('a[href="writings.html"]')?.classList.add('active');
    } else if (currentPath.endsWith('bookmarks.html')) {
        document.querySelector('a[href="bookmarks.html"]')?.classList.add('active');
    } else if (currentPath.includes('/writings/')) {
        // We're on an article page
        document.querySelector('a[href="../writings.html"]')?.classList.add('active');
    }
}

// Initialize header functionality (logo click, etc.)
function initializeHeader() {
    const logoLink = document.querySelector('.logo');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Logo click handler
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            const currentPath = window.location.pathname;
            if (currentPath.includes('/writings/')) {
                window.location.href = '../about.html';
            } else {
                window.location.href = 'about.html';
            }
        });
    }
    
    // Navigation links handler - all links work normally now
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.classList.contains('external-link')) {
                return;
            }
            // Let all links work normally - no special handling needed
        });
    });
}

// Fix relative paths for article pages
function fixRelativePaths() {
    const currentPath = window.location.pathname;
    const isArticlePage = currentPath.includes('/writings/');
    
    if (isArticlePage) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                link.setAttribute('href', '../' + href);
            }
        });
    }
}

// Create fallback header if loading fails
function createFallbackHeader() {
    const currentPath = window.location.pathname;
    const isArticlePage = currentPath.includes('/writings/');
    
    const fallbackHeader = `
        <header role="banner">
            <div class="container">
                <nav role="navigation" aria-label="Main navigation">
                    <a href="#" class="logo" aria-label="Home - Petr Lazarev">Petr Lazarev</a>
                    <div class="nav-links" role="menubar">
                        <a href="${isArticlePage ? '../about.html' : 'about.html'}" class="nav-link" role="menuitem">About</a>
                        <a href="${isArticlePage ? '../writings.html' : 'writings.html'}" class="nav-link" role="menuitem">Writings</a>
                        <a href="${isArticlePage ? '../bookmarks.html' : 'bookmarks.html'}" class="nav-link" role="menuitem">Bookmarks</a>
                        <a href="https://www.linkedin.com/in/petr-lazarev/" class="nav-link external-link" target="_blank" rel="noopener noreferrer" role="menuitem" aria-label="LinkedIn profile (opens in new tab)">LinkedIn</a>
                    </div>
                </nav>
            </div>
        </header>
    `;
    
    // Insert header at the beginning of body or replace placeholder
    const placeholder = document.getElementById('header-placeholder');
    if (placeholder) {
        placeholder.innerHTML = fallbackHeader;
    } else {
        document.body.insertAdjacentHTML('afterbegin', fallbackHeader);
    }
    
    setActiveNavigation();
    initializeHeader();
    console.log('Fallback header created');
}

// Show loading state
function showLoadingState() {
    const placeholder = document.getElementById('header-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
            <div class="header-loading">
                <div class="loading-spinner"></div>
                <span>Loading navigation...</span>
            </div>
        `;
    }
}

// Hide loading state
function hideLoadingState() {
    const loadingElement = document.querySelector('.header-loading');
    if (loadingElement) {
        loadingElement.remove();
    }
}

// Show error message for header loading failures
function showHeaderErrorMessage() {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'header-error';
    errorMessage.style.cssText = `
        background: #ffebee;
        color: #c62828;
        padding: 10px;
        text-align: center;
        font-size: 14px;
        border-bottom: 1px solid #ffcdd2;
    `;
    errorMessage.textContent = 'Navigation temporarily unavailable. Please refresh the page.';
    document.body.insertBefore(errorMessage, document.body.firstChild);
    
    // Auto-hide error message after 5 seconds
    setTimeout(() => {
        if (errorMessage.parentNode) {
            errorMessage.parentNode.removeChild(errorMessage);
        }
    }, 5000);
}

// Add global error handler for failed navigation
window.addEventListener('error', function(event) {
    if (event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK') {
        console.warn('Resource failed to load:', event.target.src || event.target.href);
    }
});

// Load header when DOM is ready
document.addEventListener('DOMContentLoaded', loadHeader); 
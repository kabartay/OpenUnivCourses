/**
 * OpenUnivCourses - Main JavaScript functionality
 * Handles search, animations, and interactive features
 */

// Configuration
const CONFIG = {
    ANIMATION_DELAY: 100,
    SEARCH_DEBOUNCE: 300,
    FADE_DURATION: 600
};

// DOM elements
const elements = {
    searchInput: null,
    coursesContainer: null,
    totalCoursesElement: null,
    universitySections: null,
    courseCards: null
};

// State
let searchTimeout = null;
let isLoaded = false;

/**
 * Initialize the application
 */
function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
}

/**
 * Initialize all app functionality
 */
function initializeApp() {
    cacheElements();
    setupEventListeners();
    updateCourseCount();
    setupLoadingAnimations();
    setupAccessibility();
    isLoaded = true;
    
    console.log('OpenUnivCourses initialized successfully');
}

/**
 * Cache DOM elements for better performance
 */
function cacheElements() {
    elements.searchInput = document.getElementById('searchInput');
    elements.coursesContainer = document.getElementById('coursesContainer');
    elements.totalCoursesElement = document.getElementById('totalCourses');
    elements.universitySections = document.querySelectorAll('.university-section');
    elements.courseCards = document.querySelectorAll('.course-card');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Search functionality
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', handleSearch);
        elements.searchInput.addEventListener('keydown', handleSearchKeydown);
    }
    
    // Smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Window events
    window.addEventListener('load', handleWindowLoad);
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Course link tracking (optional analytics)
    setupLinkTracking();
}

/**
 * Handle search input with debouncing
 */
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    // Clear previous timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Debounce search to avoid excessive filtering
    searchTimeout = setTimeout(() => {
        filterCourses(searchTerm);
        updateSearchResults(searchTerm);
    }, CONFIG.SEARCH_DEBOUNCE);
}

/**
 * Handle keyboard navigation for search
 */
function handleSearchKeydown(event) {
    if (event.key === 'Escape') {
        event.target.value = '';
        filterCourses('');
        event.target.blur();
    }
}

/**
 * Filter courses based on search term
 */
function filterCourses(searchTerm) {
    if (!elements.universitySections) return;
    
    let visibleCoursesCount = 0;
    
    elements.universitySections.forEach(section => {
        const universityName = section.querySelector('.university-name')?.textContent.toLowerCase() || '';
        const courseCards = section.querySelectorAll('.course-card');
        let hasVisibleCourses = false;
        
        courseCards.forEach(card => {
            const courseTitle = card.querySelector('.course-title')?.textContent.toLowerCase() || '';
            const courseDescription = card.querySelector('.course-description')?.textContent.toLowerCase() || '';
            
            const isVisible = !searchTerm || 
                             courseTitle.includes(searchTerm) || 
                             courseDescription.includes(searchTerm) || 
                             universityName.includes(searchTerm);
            
            // Animate visibility change
            if (isVisible) {
                card.style.display = 'block';
                card.classList.add('fade-in-up');
                hasVisibleCourses = true;
                visibleCoursesCount++;
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in-up');
            }
        });
        
        // Show/hide university section
        section.style.display = hasVisibleCourses ? 'block' : 'none';
        
        // Add animation to university section
        if (hasVisibleCourses) {
            section.classList.add('fade-in-up');
        } else {
            section.classList.remove('fade-in-up');
        }
    });
    
    // Update course count in search results
    updateVisibleCourseCount(visibleCoursesCount);
}

/**
 * Update search results information
 */
function updateSearchResults(searchTerm) {
    // Could add search results summary here
    // For example: "Showing X results for 'searchTerm'"
}

/**
 * Update visible course count
 */
function updateVisibleCourseCount(count) {
    if (elements.totalCoursesElement) {
        elements.totalCoursesElement.textContent = count > 0 ? count : elements.courseCards.length;
    }
}

/**
 * Count and display total courses
 */
function updateCourseCount() {
    if (elements.totalCoursesElement && elements.courseCards) {
        elements.totalCoursesElement.textContent = elements.courseCards.length;
    }
}

/**
 * Set up smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Set up loading animations
 */
function setupLoadingAnimations() {
    if (!elements.courseCards) return;
    
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all course cards
    elements.courseCards.forEach(card => {
        observer.observe(card);
    });
}

/**
 * Handle window load event
 */
function handleWindowLoad() {
    // Staggered animation for initial load
    const allCards = document.querySelectorAll('.course-card, .university-section');
    
    allCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transition = `all ${CONFIG.FADE_DURATION}ms ease`;
            card.classList.add('loaded');
        }, index * CONFIG.ANIMATION_DELAY);
    });
}

/**
 * Handle window resize
 */
function handleResize() {
    // Recalculate any dynamic layouts if needed
    // Currently using CSS Grid which handles this automatically
}

/**
 * Set up link tracking for analytics (optional)
 */
function setupLinkTracking() {
    document.querySelectorAll('.course-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const courseName = this.closest('.course-card')?.querySelector('.course-title')?.textContent;
            const university = this.closest('.university-section')?.querySelector('.university-name')?.textContent;
            const year = this.textContent;
            
            // Log click event (could be sent to analytics)
            console.log('Course link clicked:', {
                course: courseName,
                university: university,
                year: year,
                url: this.href
            });
            
            // Optional: Send to analytics service
            // trackCourseClick(courseName, university, year, this.href);
        });
    });
}

/**
 * Set up accessibility features
 */
function setupAccessibility() {
    // Add ARIA labels
    if (elements.searchInput) {
        elements.searchInput.setAttribute('aria-label', 'Search courses');
        elements.searchInput.setAttribute('role', 'searchbox');
    }
    
    // Add skip link for keyboard users
    addSkipLink();
    
    // Announce search results to screen readers
    setupSearchAnnouncements();
}

/**
 * Add skip navigation link
 */
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#coursesContainer';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        z-index: 1000;
        text-decoration: none;
        border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Set up search result announcements for screen readers
 */
function setupSearchAnnouncements() {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    announcement.id = 'search-announcements';
    document.body.appendChild(announcement);
}

/**
 * Announce search results to screen readers
 */
function announceSearchResults(count, searchTerm) {
    const announcement = document.getElementById('search-announcements');
    if (announcement) {
        if (searchTerm) {
            announcement.textContent = `Found ${count} courses matching "${searchTerm}"`;
        } else {
            announcement.textContent = `Showing all ${count} courses`;
        }
    }
}

/**
 * Utility function for debouncing
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility function for throttling
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Enhanced error handling
 */
window.addEventListener('error', (e) => {
    console.error('OpenUnivCourses Error:', e.error);
    // Could send to error reporting service
});

/**
 * Performance monitoring
 */
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = {
                    loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                    domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                    courses: elements.courseCards ? elements.courseCards.length : 0
                };
                console.log('Performance metrics:', perfData);
            }, 0);
        });
    }
}

// Initialize the application
init();
measurePerformance();

// Export functions for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        filterCourses,
        updateCourseCount,
        debounce,
        throttle
    };
}
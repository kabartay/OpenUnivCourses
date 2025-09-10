// OpenUnivCourses - Main JavaScript

// Search functionality
const searchInput = document.getElementById('searchInput');
const coursesContainer = document.getElementById('coursesContainer');

searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const universitySections = coursesContainer.querySelectorAll('.university-section');
    
    universitySections.forEach(section => {
        const universityName = section.querySelector('.university-name').textContent.toLowerCase();
        const courseCards = section.querySelectorAll('.course-card');
        let hasVisibleCourses = false;
        
        courseCards.forEach(card => {
            const courseTitle = card.querySelector('.course-title').textContent.toLowerCase();
            const courseDescription = card.querySelector('.course-description').textContent.toLowerCase();
            
            if (courseTitle.includes(searchTerm) || 
                courseDescription.includes(searchTerm) || 
                universityName.includes(searchTerm)) {
                card.style.display = 'block';
                hasVisibleCourses = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        section.style.display = hasVisibleCourses ? 'block' : 'none';
    });
});

// Count total courses
const totalCourses = document.querySelectorAll('.course-card').length;
document.getElementById('totalCourses').textContent = totalCourses;

// Smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add loading animation
window.addEventListener('load', function() {
    const cards = document.querySelectorAll('.course-card, .university-section');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});
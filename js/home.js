// Check if jQuery is loaded
if (typeof jQuery !== 'undefined') {
    $(document).ready(function() {
        // Toggle menu for mobile view
        $('#menu-toggle').click(function(e) {
            e.stopPropagation();
            $('#nav-links').toggleClass('active');
        });

        // Close menu when clicking outside
        $(document).click(function(e) {
            if (!$(e.target).closest('.header-fixed').length) {
                $('#nav-links').removeClass('active');
            }
        });

        // Handle window resize
        $(window).resize(function() {
            if ($(window).width() > 768) {
                $('#nav-links').removeClass('active');
            }
        });
    });
} else {
    // Vanilla JavaScript fallback
    document.addEventListener('DOMContentLoaded', function() {
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.getElementById('nav-links');

        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.header-fixed')) {
                navLinks.classList.remove('active');
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
            }
        });
    });
}
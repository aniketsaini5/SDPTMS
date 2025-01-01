$(document).ready(function() {
    // Toggle menu for mobile view
    $('#menu-toggle').click(function(e) {
        e.stopPropagation(); // Prevent event bubbling
        $('nav').toggleClass('active');
    });

    // Close menu when clicking outside
    $(document).click(function(e) {
        if (!$(e.target).closest('.header-fixed').length) {
            $('nav').removeClass('active');
        }
    });

    // Handle window resize
    $(window).resize(function() {
        if ($(window).width() > 768) {
            $('nav').removeClass('active');
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navigation Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // 3. Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Quick Message Form Handler
    const quickMessageForm = document.getElementById('quick-message-form');
    const quickMessageSuccess = document.getElementById('quick-message-success');
    const quickMessageError = document.getElementById('quick-message-error');

    if (quickMessageForm) {
        quickMessageForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('quick-message-email').value.trim();
            const subject = document.getElementById('quick-message-subject').value.trim();
            const messageText = document.getElementById('quick-message-text').value.trim();

            // Clear previous messages
            quickMessageSuccess.style.display = 'none';
            quickMessageError.style.display = 'none';

            // Basic validation
            if (!email || !subject || !messageText) {
                quickMessageError.innerHTML = '<p>Please fill in all fields</p>';
                quickMessageError.style.display = 'block';
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                quickMessageError.innerHTML = '<p>Please enter a valid email address</p>';
                quickMessageError.style.display = 'block';
                return;
            }

            try {
                // Send to backend (on port 3000)
                const response = await fetch('http://localhost:3000/api/send-quick-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        subject: subject,
                        message: messageText,
                        timestamp: new Date().toISOString()
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    // Show success message
                    quickMessageSuccess.innerHTML = '<p>✓ Message sent successfully!</p>';
                    quickMessageSuccess.style.display = 'block';
                    quickMessageForm.reset();

                    // Hide success message after 4 seconds
                    setTimeout(() => {
                        quickMessageSuccess.style.display = 'none';
                    }, 4000);
                } else {
                    throw new Error(data.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                quickMessageError.innerHTML = '<p>✗ Failed to send message. Please try again.</p>';
                quickMessageError.style.display = 'block';

                // Hide error message after 4 seconds
                setTimeout(() => {
                    quickMessageError.style.display = 'none';
                }, 4000);
            }
        });
    }
});

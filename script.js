// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open', navMenu.classList.contains('active'));
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
});

// Smooth Scrolling for Navigation Links
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

// Navbar Background Change on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 77, 58, 0.98)';
    } else {
        navbar.style.background = 'rgba(26, 77, 58, 0.95)';
    }
});

// Carousel Functionality (responsive)
let currentSlide = 0;
const cabinsGrid = document.getElementById('cabinsGrid');
const cards = document.querySelectorAll('.cabin-card');
const dots = document.querySelectorAll('.carousel-dot');
let totalSlides = cards.length;
let enableDrag = false; // drag teljesen letiltva, csak nyilak működnek
let isWrapped = false;  // elrendezés státusz (mobilon wrap)

function getCardStep() {
    if (!cards.length) return 0;
    const card = cards[0];
    const cardWidth = card.offsetWidth;
    const styles = window.getComputedStyle(cabinsGrid);
    const gap = parseFloat(styles.columnGap || styles.gap || 0);
    return cardWidth + (isNaN(gap) ? 0 : gap);
}

function getCenterOffset() {
    if (!cards.length) return 0;
    const cardWidth = cards[0].offsetWidth;
    const containerWidth = (typeof carouselWrap !== 'undefined' && carouselWrap) ? (carouselWrap.clientWidth || 0) : 0;
    return (containerWidth - cardWidth) / 2;
}

function clampSlideIndex() {
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
}

function updateCarousel() {
    if (isWrapped) {
        cabinsGrid.style.transform = 'none';
        return;
    }
    clampSlideIndex();
    const step = getCardStep();
    const translateX = (-currentSlide * step) + getCenterOffset();
    cabinsGrid.style.transform = `translateX(${translateX}px)`;
    dots.forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));
}

const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
if (prevBtn) {
    prevBtn.addEventListener('click', function() {
        currentSlide--;
        updateCarousel();
    });
}
if (nextBtn) {
    nextBtn.addEventListener('click', function() {
        currentSlide++;
        updateCarousel();
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
        currentSlide = index;
        updateCarousel();
    });
});

// Autoplay with pause-on-hover and reduced-motion support
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let autoplayId = null;
function startAutoplay() {
    if (prefersReduced) return;
    stopAutoplay();
    autoplayId = setInterval(() => {
        currentSlide++;
        updateCarousel();
    }, 5000);
}
function stopAutoplay() {
    if (autoplayId) {
        clearInterval(autoplayId);
        autoplayId = null;
    }
}
const carouselWrap = document.querySelector('.cabins-carousel');
carouselWrap.addEventListener('mouseenter', stopAutoplay);
carouselWrap.addEventListener('mouseleave', startAutoplay);
startAutoplay();

// Drag/swipe to slide (pointer events)
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let baseOffset = 0;
let hasMoved = false;
let suppressedClick = false;

function getCurrentTranslate() {
    const step = getCardStep();
    // Include center offset so dragging starts from the exact visual position (prevents jump)
    return (-currentSlide * step) + getCenterOffset();
}

function onPointerDown(e) {
    if (!enableDrag) return; // ignore in wrapped mode
    // Only left button or touch/pen
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isDragging = true;
    hasMoved = false;
    stopAutoplay();
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    baseOffset = getCurrentTranslate();
    carouselWrap.setPointerCapture?.(e.pointerId);
    cabinsGrid.style.transition = 'none';
    carouselWrap.classList.add('dragging');
    // Prevent text/image selection while dragging
    document.body.style.userSelect = 'none';
}

function onPointerMove(e) {
    if (!enableDrag) return;
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    if (Math.abs(dx) > 3) hasMoved = true;
    // If horizontal intent, prevent page from panning
    if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
    }
    cabinsGrid.style.transform = `translateX(${baseOffset + dx}px)`;
}

function onPointerUp(e) {
    if (!enableDrag) return;
    if (!isDragging) return;
    isDragging = false;
    cabinsGrid.style.transition = '';
    const dx = e.clientX - dragStartX;
    const threshold = getCardStep() * 0.25;
    if (dx < -threshold) currentSlide++;
    if (dx > threshold) currentSlide--;
    updateCarousel();
    // Resume autoplay only if user didn't keep pointer over carousel
    if (!carouselWrap.matches(':hover')) startAutoplay();
    carouselWrap.classList.remove('dragging');
    document.body.style.userSelect = '';
    // Suppress immediate clicks after a drag gesture
    suppressedClick = hasMoved;
    setTimeout(() => { suppressedClick = false; }, 50);
}

// Drag teljesen tiltva: nem regisztráljuk a pointer eseményeket
if (enableDrag) {
    // Attach pointer listeners (use passive:false where we may call preventDefault)
    carouselWrap.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
}

// Prevent accidental clicks after drag
cabinsGrid.addEventListener('click', (e) => {
    if (suppressedClick) {
        e.stopPropagation();
        e.preventDefault();
    }
}, true);

// Recalculate on resize
window.addEventListener('resize', () => {
    checkLayoutMode();
});

// Initialize position on load
checkLayoutMode();

function checkLayoutMode() {
    // Detect if grid is wrapping (mobile stacked layout)
    const styles = window.getComputedStyle(cabinsGrid);
    const isWrap = styles.flexWrap && styles.flexWrap !== 'nowrap';
    // állapot eltárolása
    isWrapped = !!isWrap;
    // Drag továbbra is ki van kapcsolva minden nézetben
    if (isWrapped) {
        cabinsGrid.style.transition = '';
        cabinsGrid.style.transform = 'none';
        dots.forEach(d => d.style.display = 'none');
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        stopAutoplay();
    } else {
        dots.forEach(d => d.style.display = '');
        if (prevBtn) prevBtn.style.display = '';
        if (nextBtn) nextBtn.style.display = '';
        updateCarousel();
        startAutoplay();
    }
}

// CTA is now an anchor; smooth scrolling handler above already handles it.

// Cabin Card Booking Functionality
document.querySelectorAll('.book-btn').forEach(button => {
    button.addEventListener('click', function() {
        const cabinCard = this.closest('.cabin-card');
        const cabinName = cabinCard.querySelector('h3').textContent;
        const cabinPrice = cabinCard.querySelector('.price').textContent;
        
        // Simple booking modal simulation
        showBookingModal(cabinName, cabinPrice);
    });
});

// Booking Modal Function
function showBookingModal(cabinName, price) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        backdrop-filter: blur(5px);
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease;
    `;

    modalContent.innerHTML = `
        <h2 style="color: #1a4d3a; margin-bottom: 1rem;">Foglalás: ${cabinName}</h2>
        <p style="margin-bottom: 1rem; color: #666;">Ár: ${price}</p>
        <form class="booking-form" style="margin-bottom: 1rem;">
            <input type="text" placeholder="Teljes név" required style="width: 100%; padding: 10px; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 5px;">
            <input type="email" placeholder="Email cím" required style="width: 100%; padding: 10px; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 5px;">
            <input type="tel" placeholder="Telefonszám" required style="width: 100%; padding: 10px; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 5px;">
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <input type="date" placeholder="Érkezés" required style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <input type="date" placeholder="Távozás" required style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <textarea placeholder="Megjegyzések" rows="3" style="width: 100%; padding: 10px; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 5px; resize: vertical;"></textarea>
        </form>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button class="confirm-booking" style="background: #1a4d3a; color: white; padding: 12px 24px; border: none; border-radius: 25px; cursor: pointer; font-weight: 600;">Foglalás megerősítése</button>
            <button class="close-modal" style="background: #ccc; color: #333; padding: 12px 24px; border: none; border-radius: 25px; cursor: pointer; font-weight: 600;">Mégse</button>
        </div>
    `;

    // Add modal animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
    document.head.appendChild(style);

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Close modal functionality
    modalOverlay.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
        document.head.removeChild(style);
    });

    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
            document.head.removeChild(style);
        }
    });

    // Booking confirmation
    modalOverlay.querySelector('.confirm-booking').addEventListener('click', () => {
        const form = modalOverlay.querySelector('.booking-form');
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#e74c3c';
            } else {
                input.style.borderColor = '#ddd';
            }
        });

        if (isValid) {
            showSuccessMessage();
            document.body.removeChild(modalOverlay);
            document.head.removeChild(style);
        }
    });
}

// Success Message Function
function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2d6b4f;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideInRight 0.5s ease;
    `;
    
    successMessage.innerHTML = `
        <strong>✅ Sikeres foglalás!</strong><br>
        Hamarosan felvesszük Önnel a kapcsolatot.
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(successMessage);

    // Remove message after 4 seconds
    setTimeout(() => {
        if (document.body.contains(successMessage)) {
            document.body.removeChild(successMessage);
            document.head.removeChild(style);
        }
    }, 4000);
}

// Contact Form Submission
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const inputs = this.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#e74c3c';
        } else {
            input.style.borderColor = 'rgba(255,255,255,0.2)';
        }
    });

    if (isValid) {
        showSuccessMessage();
        this.reset();
    }
});

// Intersection Observer for Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service items for scroll animations
document.querySelectorAll('.service-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Parallax Effect for Hero Section (skip if reduced motion or small screens)
const allowParallax = !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
                      window.matchMedia('(min-width: 768px)').matches;
if (allowParallax) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        if (hero) hero.style.transform = `translateY(${rate}px)`;
    });
}

// Add hover effects to cabin cards
document.querySelectorAll('.cabin-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

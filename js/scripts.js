/* ============================================
   CASTLE HILL GARAGE - JAVASCRIPT INTERACTIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // === MOBILE MENU TOGGLE ===
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Close menu when clicking nav links
        const navLinks = nav.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }
    
    
    // === HEADER SCROLL EFFECT ===
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    
    // === HERO GALLERY AUTO-SCROLL ===
    const heroGallery = document.getElementById('heroGallery');
    
    if (heroGallery) {
        // Clone images for infinite scroll
        const images = heroGallery.querySelectorAll('.hero__gallery-img');
        images.forEach(img => {
            const clone = img.cloneNode(true);
            heroGallery.appendChild(clone);
        });
    }
    
    
    // === IMAGE CAROUSEL ===
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    
    if (carouselTrack && prevBtn && nextBtn) {
        let currentIndex = 0;
        const images = carouselTrack.querySelectorAll('.carousel__img');
        const totalImages = images.length;
        
        const updateCarousel = () => {
            const offset = -currentIndex * 100;
            carouselTrack.style.transform = `translateX(${offset}%)`;
        };
        
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            updateCarousel();
        });
        
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalImages;
            updateCarousel();
        });
        
        // Auto-play carousel
        let autoPlay = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalImages;
            updateCarousel();
        }, 5000);
        
        // Pause on hover
        const carousel = document.getElementById('carouselGallery');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoPlay);
            });
            
            carousel.addEventListener('mouseleave', () => {
                autoPlay = setInterval(() => {
                    currentIndex = (currentIndex + 1) % totalImages;
                    updateCarousel();
                }, 5000);
            });
        }
    }
    
    
    // === BEFORE/AFTER COMPARISON SLIDER ===
    const comparisonSliders = document.querySelectorAll('.comparison-slider');
    
    comparisonSliders.forEach(slider => {
        const container = slider.querySelector('.comparison-slider__container');
        const afterImage = slider.querySelector('.comparison-slider__after');
        const handle = slider.querySelector('.comparison-slider__handle');
        
        if (!container || !afterImage || !handle) return;
        
        let isDragging = false;
        
        const updateSlider = (x) => {
            const rect = container.getBoundingClientRect();
            const position = Math.max(0, Math.min(x - rect.left, rect.width));
            const percentage = (position / rect.width) * 100;
            
            afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            handle.style.left = `${percentage}%`;
        };
        
        const startDrag = (e) => {
            isDragging = true;
            const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            updateSlider(x);
        };
        
        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            updateSlider(x);
        };
        
        const stopDrag = () => {
            isDragging = false;
        };
        
        // Mouse events
        handle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        
        // Touch events
        handle.addEventListener('touchstart', startDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', stopDrag);
        
        // Click to move
        container.addEventListener('click', (e) => {
            updateSlider(e.clientX);
        });
    });
    
    
    // === FAQ ACCORDION ===
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        const answer = item.querySelector('.faq-item__answer');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', () => {
            const isOpen = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other items
            faqItems.forEach(otherItem => {
                const otherQuestion = otherItem.querySelector('.faq-item__question');
                const otherAnswer = otherItem.querySelector('.faq-item__answer');
                
                if (otherItem !== item) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.style.maxHeight = '0';
                }
            });
            
            // Toggle current item
            if (isOpen) {
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
    
    
    // === SMOOTH SCROLL FOR ANCHOR LINKS ===
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    // === LAZY LOAD IMAGES (Intersection Observer) ===
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window && lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    
    // === SCROLL REVEAL ANIMATIONS ===
    const revealElements = document.querySelectorAll('.section, .feature-card, .service-card, .case-card');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            revealObserver.observe(el);
        });
    }
    
});


// === GOOGLE MAPS INTEGRATION (Helper function) ===
// Call this function after inserting the Google Maps embed code
function initMap() {
    const mapContainer = document.getElementById('google-map');
    
    if (mapContainer && typeof google !== 'undefined') {
        const location = { lat: 52.1375, lng: -0.4692 }; // Castle Lane, Bedford
        
        const map = new google.maps.Map(mapContainer, {
            zoom: 15,
            center: location,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });
        
        new google.maps.Marker({
            position: location,
            map: map,
            title: 'Castle Hill Garage'
        });
    }
}
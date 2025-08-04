// Portfolio JavaScript - Interactive and Dynamic Features

// Utility Functions
const utils = {
    // Throttle function for performance optimization
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Debounce function for performance optimization
    debounce: function(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        }
    },

    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll to element
    scrollToElement: function(element, offset = 0) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
};

// Navigation Functionality
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Smooth scroll for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Handle scroll events
        window.addEventListener('scroll', utils.throttle(() => this.handleScroll(), 10));

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    toggleMobileMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            utils.scrollToElement(targetSection, 80);
            
            // Close mobile menu after clicking
            this.navToggle.classList.remove('active');
            this.navMenu.classList.remove('active');
        }
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Add/remove navbar background on scroll
        if (scrollY > 50) {
            this.navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            this.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }

        // Update active navigation link
        this.updateActiveSection();
    }

    updateActiveSection() {
        const scrollY = window.scrollY + 100;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`a[href="#${sectionId}"]`);
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    handleOutsideClick(e) {
        if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
            this.navToggle.classList.remove('active');
            this.navMenu.classList.remove('active');
        }
    }
}

// Animation System
class AnimationController {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.setupAOS();
        this.setupSkillBars();
        this.setupCounters();
        this.setupTypewriter();
    }

    setupAOS() {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }
    }

    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const progress = progressBar.getAttribute('data-progress');
                    
                    setTimeout(() => {
                        progressBar.style.width = progress + '%';
                    }, 200);
                }
            });
        }, this.observerOptions);

        skillBars.forEach(bar => {
            bar.style.width = '0%';
            skillObserver.observe(bar);
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        }, this.observerOptions);

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/[^\d]/g, ''));
        const suffix = text.replace(/[\d]/g, '');
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentNumber = Math.floor(number * easeOutQuart);
            
            element.textContent = currentNumber + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = text; // Ensure final value is exact
            }
        };

        requestAnimationFrame(updateCounter);
    }

    setupTypewriter() {
        const typewriterElement = document.querySelector('.hero-subtitle');
        if (typewriterElement) {
            const text = typewriterElement.textContent;
            typewriterElement.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    typewriterElement.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            setTimeout(typeWriter, 1000);
        }
    }
}

// Chart Visualizations
class ChartController {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        this.createHeroChart();
    }

    createHeroChart() {
        const ctx = document.getElementById('heroChart');
        if (!ctx || typeof Chart === 'undefined') return;

        // Create gradient
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(78, 205, 196, 0.1)');

        const config = {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Data Processing (TB)',
                    data: [2.1, 2.8, 3.2, 4.1, 4.8, 5.2, 6.1, 6.8, 7.2, 8.1, 8.8, 9.2],
                    backgroundColor: gradient,
                    borderColor: '#00d4ff',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00d4ff',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#b3b3b3',
                        borderColor: '#00d4ff',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            title: function(context) {
                                return `Month: ${context[0].label}`;
                            },
                            label: function(context) {
                                return `${context.parsed.y} TB processed`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(51, 51, 51, 0.3)',
                            borderColor: 'rgba(51, 51, 51, 0.5)'
                        },
                        ticks: {
                            color: '#b3b3b3',
                            font: {
                                family: 'Inter',
                                size: 11
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(51, 51, 51, 0.3)',
                            borderColor: 'rgba(51, 51, 51, 0.5)'
                        },
                        ticks: {
                            color: '#b3b3b3',
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            callback: function(value) {
                                return value + ' TB';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        };

        this.charts.heroChart = new Chart(ctx, config);
    }
}

// Form Handling
class FormController {
    constructor() {
        this.contactForm = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (this.contactForm) {
            this.bindEvents();
            this.setupFloatingLabels();
        }
    }

    bindEvents() {
        this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    setupFloatingLabels() {
        const formGroups = this.contactForm.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                // Check if input has value on load
                if (input.value.trim() !== '') {
                    label.style.transform = 'translateY(-20px)';
                    label.style.fontSize = '0.875rem';
                    label.style.color = '#00d4ff';
                }

                input.addEventListener('focus', () => {
                    label.style.transform = 'translateY(-20px)';
                    label.style.fontSize = '0.875rem';
                    label.style.color = '#00d4ff';
                });

                input.addEventListener('blur', () => {
                    if (input.value.trim() === '') {
                        label.style.transform = 'translateY(0)';
                        label.style.fontSize = '1rem';
                        label.style.color = '#b3b3b3';
                    }
                });
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        try {
            await this.simulateFormSubmission();
            
            // Success state
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = '#4ecdc4';
            
            // Reset form
            this.contactForm.reset();
            
            // Show success notification
            this.showNotification('Message sent successfully!', 'success');
            
        } catch (error) {
            // Error state
            submitBtn.innerHTML = '<i class="fas fa-times"></i> Error Occurred';
            submitBtn.style.background = '#ff6b6b';
            
            this.showNotification('Failed to send message. Please try again.', 'error');
        }
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    }

    simulateFormSubmission() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                Math.random() > 0.1 ? resolve() : reject();
            }, 2000);
        });
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4ecdc4' : '#ff6b6b'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Back to Top Button
class BackToTopButton {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }

    init() {
        if (this.button) {
            this.bindEvents();
            this.handleScroll();
        }
    }

    bindEvents() {
        this.button.addEventListener('click', () => this.scrollToTop());
        window.addEventListener('scroll', utils.throttle(() => this.handleScroll(), 100));
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 500) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }
}

// Loading Screen
class LoadingScreen {
    constructor() {
        this.createLoadingScreen();
    }

    createLoadingScreen() {
        const loadingHTML = `
            <div class="loading" id="loading">
                <div class="spinner"></div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
        this.loadingElement = document.getElementById('loading');
        
        // Hide loading screen after page loads
        window.addEventListener('load', () => {
            setTimeout(() => this.hideLoading(), 1000);
        });
    }

    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.classList.add('hide');
            setTimeout(() => this.loadingElement.remove(), 500);
        }
    }
}

// Gear System for Background Effect
class GearSystem {
    constructor() {
        this.canvas = this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.gears = [];
        this.mouse = { x: 0, y: 0 };
        
        this.init();
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.4;
        `;
        document.body.appendChild(canvas);
        return canvas;
    }

    init() {
        this.resize();
        this.createGears();
        this.bindEvents();
        this.animate();
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.gears = [];
        this.createGears();
    }

    createGears() {
        const gearCount = Math.floor(window.innerWidth / 150) + Math.floor(window.innerHeight / 150);
        
        for (let i = 0; i < gearCount; i++) {
            this.gears.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 30 + 20,
                teeth: Math.floor(Math.random() * 8) + 8,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                opacity: Math.random() * 0.3 + 0.1,
                strokeWidth: Math.random() * 1.5 + 0.5
            });
        }
    }

    drawGear(gear) {
        const { x, y, radius, teeth, rotation, opacity, strokeWidth } = gear;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        
        // Draw gear outline
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
        this.ctx.lineWidth = strokeWidth;
        
        const toothHeight = radius * 0.2;
        const angleStep = (Math.PI * 2) / teeth;
        
        for (let i = 0; i < teeth; i++) {
            const angle = i * angleStep;
            const nextAngle = (i + 1) * angleStep;
            
            // Inner circle point
            const innerX1 = Math.cos(angle) * radius;
            const innerY1 = Math.sin(angle) * radius;
            
            // Outer tooth points
            const toothAngle1 = angle + angleStep * 0.2;
            const toothAngle2 = angle + angleStep * 0.8;
            
            const toothX1 = Math.cos(toothAngle1) * (radius + toothHeight);
            const toothY1 = Math.sin(toothAngle1) * (radius + toothHeight);
            
            const toothX2 = Math.cos(toothAngle2) * (radius + toothHeight);
            const toothY2 = Math.sin(toothAngle2) * (radius + toothHeight);
            
            const innerX2 = Math.cos(nextAngle) * radius;
            const innerY2 = Math.sin(nextAngle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(innerX1, innerY1);
            }
            
            this.ctx.lineTo(toothX1, toothY1);
            this.ctx.lineTo(toothX2, toothY2);
            this.ctx.lineTo(innerX2, innerY2);
        }
        
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Draw inner circle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Draw center dot
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius * 0.1, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(0, 212, 255, ${opacity * 1.5})`;
        this.ctx.fill();
        
        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.gears.forEach((gear) => {
            // Update rotation
            gear.rotation += gear.rotationSpeed;
            
            // Mouse interaction - speed up gears near mouse
            const dx = this.mouse.x - gear.x;
            const dy = this.mouse.y - gear.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const speedMultiplier = (150 - distance) / 150 * 3 + 1;
                gear.rotation += gear.rotationSpeed * speedMultiplier;
            }
            
            // Draw gear
            this.drawGear(gear);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Project Filter System
class ProjectFilter {
    constructor() {
        this.projects = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.createFilterButtons();
        this.bindEvents();
    }

    createFilterButtons() {
        const projectsSection = document.querySelector('.projects .container');
        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filters';
        filterContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 3rem;
            flex-wrap: wrap;
        `;
        
        const filters = ['All', 'Machine Learning', 'Data Visualization', 'Analytics', 'Big Data'];
        
        filters.forEach((filter, index) => {
            const button = document.createElement('button');
            button.className = `filter-btn ${index === 0 ? 'active' : ''}`;
            button.textContent = filter;
            button.dataset.filter = filter.toLowerCase().replace(' ', '-');
            button.style.cssText = `
                padding: 0.5rem 1.5rem;
                border: 2px solid #00d4ff;
                background: transparent;
                color: #00d4ff;
                border-radius: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
            `;
            
            filterContainer.appendChild(button);
        });
        
        const sectionHeader = projectsSection.querySelector('.section-header');
        sectionHeader.after(filterContainer);
    }

    bindEvents() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => this.handleFilter(button));
        });
    }

    handleFilter(activeButton) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const filter = activeButton.dataset.filter;
        
        // Update active button
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'transparent';
            btn.style.color = '#00d4ff';
        });
        
        activeButton.classList.add('active');
        activeButton.style.background = '#00d4ff';
        activeButton.style.color = '#ffffff';
        
        // Filter projects (for demo, we'll show/hide randomly)
        this.projects.forEach((project, index) => {
            if (filter === 'all') {
                project.style.display = 'block';
                project.style.animation = `fadeIn 0.5s ease ${index * 0.1}s both`;
            } else {
                // Simulate filtering logic
                const shouldShow = Math.random() > 0.3;
                project.style.display = shouldShow ? 'block' : 'none';
                if (shouldShow) {
                    project.style.animation = `fadeIn 0.5s ease ${index * 0.1}s both`;
                }
            }
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        this.monitorPageLoad();
        this.optimizeImages();
    }

    monitorPageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Report Core Web Vitals if available
            if ('web-vital' in window) {
                // This would integrate with actual web vitals library
                console.log('Core Web Vitals monitoring enabled');
            }
        });
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            images.forEach(img => {
                if (img.dataset.src) {
                    img.classList.add('lazy');
                    imageObserver.observe(img);
                }
            });
        }
    }
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen first
    new LoadingScreen();
    
    // Initialize core components
    new Navigation();
    new AnimationController();
    new ChartController();
    new FormController();
    new BackToTopButton();
    new ProjectFilter();
    new PerformanceMonitor();
    
    // Initialize gear system if not on mobile
    if (window.innerWidth > 768) {
        new GearSystem();
    }
    
    // Add smooth reveal animation for page load
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease-in-out';
    }, 100);
});

// Service Worker Registration (Progressive Web App)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Dark/Light Mode Toggle (Future Enhancement)
class ThemeController {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme();
        this.createThemeToggle();
    }

    createThemeToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
        toggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 80px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: var(--bg-secondary);
            color: var(--text-primary);
            cursor: pointer;
            z-index: 1001;
            transition: all 0.3s ease;
            display: none; /* Hidden for now, can be enabled later */
        `;
        
        toggle.addEventListener('click', () => this.toggleTheme());
        document.body.appendChild(toggle);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme() {
        if (this.currentTheme === 'light') {
            // Light theme variables would go here
            // For now, we're keeping it dark as requested
        }
    }
}

// Initialize theme controller
// new ThemeController(); // Commented out since we want dark theme only

// Export for potential module use
window.PortfolioApp = {
    Navigation,
    AnimationController,
    ChartController,
    FormController,
    BackToTopButton,
    GearSystem,
    ProjectFilter,
    PerformanceMonitor,
    ThemeController
};
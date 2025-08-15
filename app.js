// SIDEKICK v0 - JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    const modelViewer = document.getElementById('sidekick-model');
    const fallbackMessage = document.getElementById('fallback');
    let modelLoadTimeout;
    
    // Model loading and error handling
    if (modelViewer) {
        // Hide fallback initially
        fallbackMessage.style.display = 'none';
        
        // Set a loading timeout of 8 seconds
        modelLoadTimeout = setTimeout(() => {
            if (!modelViewer.loaded) {
                console.warn('Model loading timeout after 8 seconds');
                showFallback();
            }
        }, 8000);
        
        // Handle successful model load
        modelViewer.addEventListener('load', function() {
            console.log('Model loaded successfully');
            clearTimeout(modelLoadTimeout);
            fallbackMessage.classList.remove('show');
            fallbackMessage.style.display = 'none';
            modelViewer.style.display = 'block';
        });
        
        // Handle model loading errors
        modelViewer.addEventListener('error', function(event) {
            console.error('Model failed to load:', event.detail);
            clearTimeout(modelLoadTimeout);
            showFallback();
        });
        
        // Handle model-viewer ready event
        modelViewer.addEventListener('model-visibility', function(event) {
            if (event.detail.visible === false) {
                console.warn('Model visibility changed to false');
            }
        });
        
        // Alternative error detection - check if src changes or becomes invalid
        const originalSrc = modelViewer.src;
        const checkModelSrc = () => {
            if (modelViewer.src !== originalSrc || !modelViewer.src) {
                console.warn('Model source became invalid');
                showFallback();
            }
        };
        
        // Check model source after 5 seconds
        setTimeout(checkModelSrc, 5000);
        
        // Enhanced camera controls for better UX
        modelViewer.addEventListener('camera-change', function() {
            modelViewer.style.cursor = 'grabbing';
            setTimeout(() => {
                modelViewer.style.cursor = 'grab';
            }, 100);
        });
    } else {
        console.error('Model viewer element not found');
        showFallback();
    }
    
    function showFallback() {
        if (fallbackMessage) {
            console.log('Showing fallback message');
            fallbackMessage.style.display = 'block';
            fallbackMessage.classList.add('show');
            
            // Hide the model viewer on error
            if (modelViewer) {
                modelViewer.style.display = 'none';
            }
        }
    }
    
    // GitHub link functionality verification
    function initGitHubLink() {
        const githubLink = document.querySelector('.github-link');
        if (githubLink) {
            console.log('GitHub link found:', githubLink.href);
            
            // Add click tracking
            githubLink.addEventListener('click', function(event) {
                console.log('GitHub link clicked, opening:', this.href);
                // The link should open naturally with target="_blank"
            });
            
            // Enhance with keyboard accessibility
            githubLink.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    window.open(this.href, '_blank', 'noopener,noreferrer');
                }
            });
        } else {
            console.error('GitHub link not found');
        }
    }
    
    // Creative typography animations
    function initTextAnimations() {
        const greetings = document.querySelectorAll('.greeting');
        
        // Stagger animation for greetings
        greetings.forEach((greeting, index) => {
            greeting.style.opacity = '0';
            greeting.style.transform = 'translateX(-20px)';
            greeting.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                greeting.style.opacity = '0.9';
                greeting.style.transform = 'translateX(0)';
            }, 200 + (index * 150));
        });
        
        // Animate status text
        const statusElements = document.querySelectorAll('.status-text');
        statusElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(10px)';
            element.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 800 + (index * 200));
        });
    }
    
    // Footer interaction enhancement
    function initFooterInteraction() {
        const githubLink = document.querySelector('.github-link');
        
        if (githubLink) {
            githubLink.addEventListener('mouseenter', function() {
                this.style.letterSpacing = '0.15em';
            });
            
            githubLink.addEventListener('mouseleave', function() {
                this.style.letterSpacing = '0.1em';
            });
        }
    }
    
    // Responsive model viewer height adjustment
    function adjustModelViewerHeight() {
        if (window.innerWidth <= 768) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            const modelSection = document.querySelector('.model-section');
            if (modelSection) {
                modelSection.style.height = 'calc(var(--vh, 1vh) * 40)';
            }
        }
    }
    
    // Keyboard navigation enhancement
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(event) {
            // ESC key to reset model viewer camera
            if (event.key === 'Escape' && modelViewer && modelViewer.loaded) {
                modelViewer.cameraOrbit = '45deg 75deg 2m';
                modelViewer.fieldOfView = 'auto';
            }
            
            // Space bar to toggle auto-rotate
            if (event.key === ' ' && event.target === document.body && modelViewer && modelViewer.loaded) {
                event.preventDefault();
                modelViewer.autoRotate = !modelViewer.autoRotate;
            }
        });
    }
    
    // Initialize all functionality
    initGitHubLink();
    setTimeout(initTextAnimations, 100);
    initFooterInteraction();
    initKeyboardNavigation();
    
    // Handle window resize
    window.addEventListener('resize', adjustModelViewerHeight);
    adjustModelViewerHeight();
    
    // Add creative glitch effect on title (subtle)
    function initTitleGlitch() {
        const title = document.querySelector('.main-title');
        if (title) {
            let glitchTimeout;
            
            const triggerGlitch = () => {
                title.style.textShadow = '2px 0 #fff, -2px 0 #fff';
                setTimeout(() => {
                    title.style.textShadow = 'none';
                }, 50);
                
                // Random interval for next glitch (8-20 seconds)
                glitchTimeout = setTimeout(triggerGlitch, 8000 + Math.random() * 12000);
            };
            
            // Start after initial load
            setTimeout(triggerGlitch, 5000);
        }
    }
    
    // Only run glitch effect if user hasn't disabled animations
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        initTitleGlitch();
    }
    
    // Console easter egg
    console.log(`
    ╔══════════════════════════════════════╗
    ║              SIDEKICK v0             ║
    ║          Team "Burn this Hardware"   ║
    ║                                      ║
    ║  Press SPACE to toggle auto-rotate   ║
    ║  Press ESC to reset camera view      ║
    ║  GitHub link: github.com/MakerSidekick║
    ╚══════════════════════════════════════╝
    `);
    
    // Application ready state
    window.addEventListener('load', () => {
        console.log('SIDEKICK v0 application fully loaded');
        document.body.classList.add('loaded');
    });
});
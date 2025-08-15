// SIDEKICK v0 - JavaScript functionality (with improved text load animations and model load fallback handling)

document.addEventListener('DOMContentLoaded', function() {

    const modelViewer = document.getElementById('sidekick-model');
    const fallbackMessage = document.getElementById('fallback');
    let modelLoadTimeout;

    // Utility for showing fallback
    function showFallback() {
        if (fallbackMessage) {
            console.log('Showing fallback message');
            fallbackMessage.classList.add('show');
            startBreathingText();
            if (modelViewer) {
                modelViewer.style.display = 'none';
            }
        }
    }

    // Text breathing animation for fallback
    function startBreathingText() {
        if (!fallbackMessage) return;
        let visible = true;
        fallbackMessage.style.opacity = '1';
        fallbackMessage.style.transition = 'opacity 1.2s ease-in-out';
        fallbackMessage._breathingInterval = setInterval(() => {
            fallbackMessage.style.opacity = visible ? '0.4' : '1';
            visible = !visible;
        }, 1200);
    }

    function stopBreathingText() {
        if (!fallbackMessage) return;
        clearInterval(fallbackMessage._breathingInterval);
        fallbackMessage.style.opacity = '1';
    }

    // Incremental text loading animation with improved logic
    function initTextAnimations() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const greetings = document.querySelectorAll('.greeting');
        const statusText = document.querySelectorAll('.status-text');

        // Hide all greetings before animation
        greetings.forEach(greeting => {
            greeting.style.opacity = '0';
            greeting.style.transition = 'opacity 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)';
        });

        // Hide all status texts before animation
        statusText.forEach(el => {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)';
        });

        // Animate greetings incrementally (staggered)
        greetings.forEach((greeting, i) => {
            setTimeout(() => {
                greeting.style.opacity = '1';
            }, 100 + i * 100); // Stagger by 100ms for smoother look
        });

        // Animate status texts only after greetings finish
        statusText.forEach((el, i) => {
            setTimeout(() => {
                el.style.opacity = '1';
            }, 50 + greetings.length * 100 + i * 90);
        });
    }

    // MODEL HANDLING

    if (modelViewer) {
        // Hide fallback initially
        fallbackMessage.style.display = 'none';

        // Optimize model-viewer for speed
        modelViewer.style.transition = 'none';
        modelViewer.style.willChange = 'auto';
        modelViewer.setAttribute('power-preference', 'low-power');
        modelViewer.setAttribute('shadow-softness', '0');

        // Loading timeout of 8 seconds
        modelLoadTimeout = setTimeout(() => {
            if (!modelViewer.loaded) {
                console.warn('Model loading timeout after 8 seconds');
                showFallback();
            }
        }, 8000);

        // Successful model load
        modelViewer.addEventListener('load', function() {
            console.log('Model loaded successfully');
            clearTimeout(modelLoadTimeout);
            fallbackMessage.classList.remove('show');
            stopBreathingText();
            modelViewer.style.display = 'block';
            modelViewer.style.transition = 'opacity 0.2s ease';
        });

        // Loading error
        modelViewer.addEventListener('error', function(event) {
            console.error('Model failed to load:', event.detail);
            clearTimeout(modelLoadTimeout);
            showFallback();
        });

        // Quick source validation
        const originalSrc = modelViewer.src;
        setTimeout(() => {
            if (modelViewer.src !== originalSrc || !modelViewer.src) {
                console.warn('Model source became invalid');
                showFallback();
            }
        }, 3000);

        // Enhanced camera controls
        let cameraTimeout;
        modelViewer.addEventListener('camera-change', function() {
            modelViewer.style.filter = 'none';
            modelViewer.style.cursor = 'grabbing';
            clearTimeout(cameraTimeout);
            cameraTimeout = setTimeout(() => {
                modelViewer.style.cursor = 'grab';
            }, 100);
        });

    } else {
        console.error('Model viewer element not found');
        showFallback();
    }

    // GitHub link functionality
    function initGitHubLink() {
        const githubLink = document.querySelector('.github-link');
        if (githubLink) {
            githubLink.addEventListener('click', function() {
                console.log('GitHub link clicked');
            });
            githubLink.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    window.open(this.href, '_blank', 'noopener,noreferrer');
                }
            });
        }
    }

    // Footer interaction
    function initFooterInteraction() {
        const githubLink = document.querySelector('.github-link');
        if (githubLink) {
            githubLink.addEventListener('mouseenter', () => githubLink.style.letterSpacing = '0.15em');
            githubLink.addEventListener('mouseleave', () => githubLink.style.letterSpacing = '0.1em');
        }
    }

    // Responsive viewport height
    function adjustModelViewerHeight() {
        if (window.innerWidth <= 768) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
    }

    // Keyboard shortcuts
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modelViewer && modelViewer.loaded) {
                modelViewer.cameraOrbit = '45deg 75deg 5m';
                modelViewer.fieldOfView = 'auto';
            }
            if (event.key === ' ' && event.target === document.body && modelViewer && modelViewer.loaded) {
                event.preventDefault();
                modelViewer.autoRotate = !modelViewer.autoRotate;
            }
        });
    }

    // Start incremental text load animation as soon as possible
    setTimeout(initTextAnimations, 50);

    // Other initializers
    setTimeout(initFooterInteraction, 100);
    setTimeout(initKeyboardNavigation, 150);
    initGitHubLink();

    // Debounced resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(adjustModelViewerHeight, 100);
    });
    adjustModelViewerHeight();

    // Console easter egg
    console.log(`
    ╔═=═════════════════════════════════════╗
    ║               SIDEKICK v0             ║
    ║       Team "Burn this Hardware"       ║
    ║                                       ║
    ║   Press SPACE to toggle auto-rotate   ║
    ║    Press ESC to reset camera view     ║
    ║ GitHub link: github.com/MakerSidekick ║
    ╚═══=═══════════════════════════════════╝
    `);

    // Ready state
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        console.log('SIDEKICK v0 application fully loaded');
    });
});
// SIDEKICK v0 - JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    const modelViewer = document.getElementById('sidekick-model');
    const fallbackMessage = document.getElementById('fallback');
    let modelLoadTimeout;

    // Model loading and error handling
    if (modelViewer) {
        // Hide fallback initially
        fallbackMessage.style.display = 'none';

        // Aggressively optimize model-viewer for speed
        modelViewer.style.transition = 'none';           // Remove initial transitions
        modelViewer.style.willChange = 'auto';           // Prevent memory budget issues
        modelViewer.setAttribute('power-preference', 'low-power');
        modelViewer.setAttribute('shadow-softness', '0'); // Hard shadows
        //modelViewer.setAttribute('interaction-prompt', 'none'); // No built-in prompt overlay

        // Loading timeout of 8 seconds
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

            // Only add transition after successful load
            modelViewer.style.transition = 'opacity 0.2s ease';
        });

        // Handle loading errors
        modelViewer.addEventListener('error', function(event) {
            console.error('Model failed to load:', event.detail);
            clearTimeout(modelLoadTimeout);
            showFallback();
        });

        // Warn if model becomes hidden
        modelViewer.addEventListener('model-visibility', function(event) {
            if (event.detail.visible === false) {
                console.warn('Model visibility changed to false');
            }
        });

        // Quick source validation
        const originalSrc = modelViewer.src;
        setTimeout(() => {
            if (modelViewer.src !== originalSrc || !modelViewer.src) {
                console.warn('Model source became invalid');
                showFallback();
            }
        }, 3000);

        // Enhanced camera controls for better UX, avoid blur
        let cameraTimeout;
        modelViewer.addEventListener('camera-change', function() {
            modelViewer.style.filter = 'none'; // ensure no residual blur
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

    function showFallback() {
        if (fallbackMessage) {
            console.log('Showing fallback message');
            fallbackMessage.style.display = 'block';
            fallbackMessage.classList.add('show');
            if (modelViewer) {
                modelViewer.style.display = 'none';
            }
        }
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

    // Lightweight text animations
    function initTextAnimations() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const greetings = document.querySelectorAll('.greeting');
        greetings.forEach((greeting, i) => {
            greeting.style.opacity = '0';
            greeting.style.transition = 'opacity 0.4s ease';
            setTimeout(() => greeting.style.opacity = '0.9', 150 + i * 100);
        });
        const statusText = document.querySelectorAll('.status-text');
        statusText.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.3s ease';
            setTimeout(() => el.style.opacity = '1', 600 + i * 150);
        });
    }

    // Footer interaction
    function initFooterInteraction() {
        const githubLink = document.querySelector('.github-link');
        if (githubLink) {
            githubLink.addEventListener('mouseenter', () => githubLink.style.letterSpacing = '0.15em');
            githubLink.addEventListener('mouseleave', () => githubLink.style.letterSpacing = '0.1em');
        }
    }

    // Responsive handling
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

    // Initialize all
    setTimeout(initTextAnimations, 50);
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
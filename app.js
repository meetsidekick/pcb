/* SIDEKICK v0 — JavaScript functionality
   (text-load animations + model-load fallback handling) */

document.addEventListener('DOMContentLoaded', () => {

  const modelViewer   = document.getElementById('sidekick-model');
  const fallbackMsg   = document.getElementById('fallback');
  let   modelTimeout;

  /* ---------- Fallback helpers ---------- */
  function showFallback() {
    if (!fallbackMsg) return;
    console.log('Showing fallback message');
    fallbackMsg.classList.add('show');
    startBreathingText();
    if (modelViewer) modelViewer.style.display = 'none';
  }

  function startBreathingText() {
    if (!fallbackMsg) return;
    let visible = true;
    fallbackMsg.style.opacity    = '1';
    fallbackMsg.style.transition = 'opacity 1.2s ease-in-out';
    fallbackMsg._breathing = setInterval(() => {
      fallbackMsg.style.opacity = visible ? '0.4' : '1';
      visible = !visible;
    }, 1200);
  }

  function stopBreathingText() {
    if (!fallbackMsg) return;
    clearInterval(fallbackMsg._breathing);
    fallbackMsg.style.opacity = '1';
  }

  /* ---------- Incremental text animation ---------- */
  function initTextAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const greetings  = document.querySelectorAll('.greeting');
    const statusText = document.querySelectorAll('.status-text');

    greetings.forEach(el => {
      el.style.opacity    = '0';
      el.style.transition = 'opacity 0.5s cubic-bezier(0.22,0.61,0.36,1)';
    });

    statusText.forEach(el => {
      el.style.opacity    = '0';
      el.style.transition = 'opacity 0.4s cubic-bezier(0.22,0.61,0.36,1)';
    });

    greetings.forEach((el, i) => {
      setTimeout(() => el.style.opacity = '1', 100 + i * 100);
    });

    statusText.forEach((el, i) => {
      setTimeout(() => el.style.opacity = '1',
        50 + greetings.length * 100 + i * 90);
    });
  }

  /* ---------- Model-viewer handling ---------- */
  if (modelViewer) {
    fallbackMsg.style.display = 'none';

    modelViewer.style.transition = 'none';
    modelViewer.style.willChange = 'auto';
    modelViewer.setAttribute('power-preference', 'low-power');
    modelViewer.setAttribute('shadow-softness', '0');

    modelTimeout = setTimeout(() => {
      if (!modelViewer.loaded) {
        console.warn('Model loading timeout after 8 s');
        showFallback();
      }
    }, 8000);

    modelViewer.addEventListener('load', () => {
      console.log('Model loaded successfully');
      clearTimeout(modelTimeout);
      fallbackMsg.classList.remove('show');
      stopBreathingText();
      modelViewer.style.display   = 'block';
      modelViewer.style.transition = 'opacity 0.2s ease';
    });

    modelViewer.addEventListener('error', e => {
      console.error('Model failed to load:', e.detail);
      clearTimeout(modelTimeout);
      showFallback();
    });

    /* Quick source validation */
    const originalSrc = modelViewer.src;
    setTimeout(() => {
      if (modelViewer.src !== originalSrc || !modelViewer.src) {
        console.warn('Model source became invalid');
        showFallback();
      }
    }, 3000);

    /* Improved camera-controls UX */
    let cameraTimeout;
    modelViewer.addEventListener('camera-change', () => {
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

  /* ---------- GitHub link + footer ---------- */
  function initGitHubLink() {
    const link = document.querySelector('.github-link');
    if (!link) return;
    link.addEventListener('click', () => console.log('GitHub link clicked'));
    link.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.open(link.href, '_blank', 'noopener,noreferrer');
      }
    });
  }

  function initFooterInteraction() {
    const link = document.querySelector('.github-link');
    if (!link) return;
    link.addEventListener('mouseenter', () => link.style.letterSpacing = '0.15em');
    link.addEventListener('mouseleave', () => link.style.letterSpacing = '0.1em');
  }

  /* ---------- Responsive viewport fix ---------- */
  function adjustModelViewerHeight() {
    if (window.innerWidth <= 768) {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  }

  /* ---------- Keyboard shortcuts ---------- */
  function initKeyboardNavigation() {
    document.addEventListener('keydown', e => {
      if (!modelViewer || !modelViewer.loaded) return;
      if (e.key === 'Escape') {
        modelViewer.cameraOrbit  = '45deg 75deg 5m';
        modelViewer.fieldOfView  = 'auto';
      }
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        modelViewer.autoRotate = !modelViewer.autoRotate;
      }
    });
  }

  /* ---------- Boot-time initializers ---------- */
  setTimeout(initTextAnimations,   50);
  setTimeout(initFooterInteraction,100);
  setTimeout(initKeyboardNavigation,150);
  initGitHubLink();

  /* Debounced resize */
  let resizeTimeout;
  window.addEventListener('resize', () => {
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

  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    console.log('SIDEKICK v0 application fully loaded');
  });
});
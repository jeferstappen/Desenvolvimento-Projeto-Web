/**
 * AGhataCris - Main Application Entry Point
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register Service Worker for PWA compliance
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('AGhataCris PWA ServiceWorker registrado com sucesso:', reg.scope))
      .catch(err => console.log('Falha no registro do ServiceWorker:', err));
  }

  // Subscribe state updates to re-render navbar and headers
  window.appState.subscribe(() => {
    if (window.renderHeader) window.renderHeader();
    if (window.renderNavbar) window.renderNavbar();
    if (window.renderSimulatorToolbar) window.renderSimulatorToolbar();
  });

  // Initial Route Render
  if (!window.location.hash) {
    window.location.hash = '#/cliente/home';
  } else {
    window.router.handleRouteChange();
  }
});

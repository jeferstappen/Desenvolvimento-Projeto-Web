/**
 * AGhataCris - Bottom Navigation Component
 * Dynamically renders navigation items based on the active role and route
 */

window.renderNavbar = function() {
  const navEl = document.getElementById('bottom-nav');
  if (!navEl) return;

  const state = window.appState.getState();
  const currentRoute = window.location.hash.slice(1) || `/${state.currentRole}/home`;

  // Hide nav on Login / Register
  if (currentRoute === '/login' || currentRoute === '/register') {
    navEl.style.display = 'none';
    return;
  }

  navEl.style.display = 'flex';

  let navItems = [];

  if (state.currentRole === 'cliente') {
    navItems = [
      {
        label: 'Home',
        route: '/cliente/home',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
      },
      {
        label: 'Favoritas',
        route: '/cliente/favoritas',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
      },
      {
        label: 'Histórico',
        route: '/cliente/historico',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
      },
      {
        label: 'Perfil',
        route: '/perfil',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
      }
    ];
  } else if (state.currentRole === 'freelancer') {
    navItems = [
      {
        label: 'Home',
        route: '/freelancer/home',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
      },
      {
        label: 'Agenda',
        route: '/freelancer/agenda',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`
      },
      {
        label: 'Salões',
        route: '/freelancer/espacos',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3h18v18H3z"></path><path d="M9 3v18"></path><path d="M15 3v18"></path></svg>`
      },
      {
        label: 'Carteira',
        route: '/freelancer/carteira',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`
      },
      {
        label: 'Perfil',
        route: '/perfil',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
      }
    ];
  } else if (state.currentRole === 'salao') {
    navItems = [
      {
        label: 'Home',
        route: '/salao/home',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
      },
      {
        label: 'Espaços',
        route: '/salao/espacos',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`
      },
      {
        label: 'Financeiro',
        route: '/salao/financeiro',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`
      },
      {
        label: 'Perfil',
        route: '/perfil',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
      }
    ];
  } else {
    // Admin
    navItems = [
      {
        label: 'Métricas',
        route: '/admin',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`
      },
      {
        label: 'Perfil',
        route: '/perfil',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
      }
    ];
  }

  navEl.innerHTML = navItems.map(item => {
    const isActive = currentRoute === item.route;
    return `
      <button class="nav-item ${isActive ? 'active' : ''}" onclick="window.location.hash = '#${item.route}'">
        ${item.icon}
        <span>${item.label}</span>
      </button>
    `;
  }).join('');
};

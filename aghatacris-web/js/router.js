/**
 * AGhataCris - SPA Router & Route Dispatcher
 */

class Router {
  constructor() {
    this.routes = {
      // Auth
      '/login': () => window.renderLoginView(),
      '/register': () => window.renderRegisterView(),

      // Cliente
      '/cliente/home': () => window.renderClienteHomeView(),
      '/cliente/favoritas': () => window.renderClienteFavoritasView(),
      '/cliente/historico': () => window.renderClienteHistoricoView(),

      // Freelancer
      '/freelancer/home': () => window.renderFreelancerHomeView(),
      '/freelancer/agenda': () => window.renderFreelancerAgendaView(),
      '/freelancer/carteira': () => window.renderFreelancerCarteiraView(),
      '/freelancer/espacos': () => window.renderFreelancerEspacosView(),

      // Salão Parceiro
      '/salao/home': () => window.renderSalaoHomeView(),
      '/salao/espacos': () => window.renderSalaoHomeView(),
      '/salao/financeiro': () => window.renderFreelancerCarteiraView(),

      // Universal Profile & Admin
      '/perfil': () => window.renderPerfilView(),
      '/admin': () => window.renderAdminView()
    };

    window.addEventListener('hashchange', () => this.handleRouteChange());
  }

  getCurrentPath() {
    return window.location.hash.slice(1) || '/cliente/home';
  }

  navigate(path) {
    window.location.hash = `#${path}`;
  }

  handleRouteChange() {
    const path = this.getCurrentPath();
    const contentEl = document.getElementById('app-main-content');
    if (!contentEl) return;

    // Detect role from path if relevant
    if (path.startsWith('/cliente')) {
      window.appState.state.currentRole = 'cliente';
      window.appState.state.currentUser = { ...window.appState.state.rolesData.cliente };
    } else if (path.startsWith('/freelancer')) {
      window.appState.state.currentRole = 'freelancer';
      window.appState.state.currentUser = { ...window.appState.state.rolesData.freelancer };
    } else if (path.startsWith('/salao')) {
      window.appState.state.currentRole = 'salao';
      window.appState.state.currentUser = { ...window.appState.state.rolesData.salao };
    } else if (path.startsWith('/admin')) {
      window.appState.state.currentRole = 'admin';
      window.appState.state.currentUser = { ...window.appState.state.rolesData.admin };
    }

    // Render View
    const renderFn = this.routes[path] || this.routes['/cliente/home'];
    contentEl.innerHTML = renderFn();

    // Re-render Shell Components
    if (window.renderHeader) window.renderHeader();
    if (window.renderNavbar) window.renderNavbar();
    if (window.renderSimulatorToolbar) window.renderSimulatorToolbar();

    // If on client home, init Leaflet map
    if (path === '/cliente/home' || path === '/') {
      setTimeout(() => {
        if (window.initMapIfPresent) window.initMapIfPresent();
      }, 50);
    }

    // Scroll to top
    contentEl.scrollTop = 0;
  }

  renderCurrentRoute() {
    this.handleRouteChange();
  }
}

window.router = new Router();

/**
 * AGhataCris - Header Component
 */

window.renderHeader = function() {
  const headerEl = document.getElementById('app-header');
  if (!headerEl) return;

  const state = window.appState.getState();
  const currentRoute = window.location.hash.slice(1) || '/cliente/home';

  // Hide header on Login / Register
  if (currentRoute === '/login' || currentRoute === '/register') {
    headerEl.style.display = 'none';
    return;
  }

  headerEl.style.display = 'flex';

  let centerWidget = '';
  if (state.currentRole === 'freelancer') {
    centerWidget = `
      <div class="online-status-pill" onclick="UI.showToast('Status alterado para Online', 'success')">
        <span class="status-indicator-dot"></span>
        <span>Online</span>
      </div>
    `;
  }

  headerEl.innerHTML = `
    <div class="brand-title" onclick="window.location.hash = '#/' + window.appState.getState().currentRole + '/home'" style="cursor: pointer;">
      <span>AGhataCris</span>
      <span class="brand-badge">${state.currentRole}</span>
    </div>

    <div class="header-user-actions">
      ${centerWidget}
      <button class="header-avatar-btn" onclick="window.location.hash = '#/perfil'" title="Meu Perfil">
        <img src="${state.currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" alt="Avatar" />
      </button>
    </div>
  `;
};

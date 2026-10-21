/**
 * AGhataCris - Simulator Presentation Toolbar & Role Switcher
 */

window.renderSimulatorToolbar = function() {
  const toolbarEl = document.getElementById('simulator-toolbar');
  if (!toolbarEl) return;

  const state = window.appState.getState();
  const currentHash = window.location.hash || '#/login';
  const isTelaInicial = currentHash === '#/login' || currentHash === '' || currentHash === '#/';

  toolbarEl.innerHTML = `
    <div class="toolbar-brand-centered">
      <span class="brand-dot"></span>
      <span class="toolbar-brand-name">GlamGo</span>
    </div>

    <div class="toolbar-roles-centered">
      <button class="role-btn ${isTelaInicial ? 'active' : ''}" onclick="window.location.hash = '#/login'" title="Tela Inicial (Login)">
        🏠 Tela Inicial
      </button>
      <button class="role-btn ${!isTelaInicial && state.currentRole === 'cliente' ? 'active' : ''}" onclick="window.switchRoleAndNavigate('cliente')" title="Perfil Cliente">
        👤 Cliente
      </button>
      <button class="role-btn ${!isTelaInicial && state.currentRole === 'freelancer' ? 'active' : ''}" onclick="window.switchRoleAndNavigate('freelancer')" title="Perfil Freelancer">
        💇‍♀️ Freelancer
      </button>
      <button class="role-btn ${!isTelaInicial && state.currentRole === 'salao' ? 'active' : ''}" onclick="window.switchRoleAndNavigate('salao')" title="Perfil Salão Parceiro">
        🏢 Salão Parceiro
      </button>
      <button class="role-btn ${!isTelaInicial && state.currentRole === 'admin' ? 'active' : ''}" onclick="window.switchRoleAndNavigate('admin')" title="Perfil Administrador">
        ⚡ Admin
      </button>
    </div>
  `;
};

window.switchRoleAndNavigate = function(role) {
  window.appState.setRole(role);
  window.location.hash = `#/${role}/home`;
  window.UI.showToast(`Perfil alternado para: ${role.toUpperCase()}`, 'info');
};

window.toggleDeviceViewport = function() {
  const sim = document.querySelector('.simulator-container');
  sim.classList.toggle('mode-fullscreen');
  const isFull = sim.classList.contains('mode-fullscreen');
  const btn = document.getElementById('btn-toggle-viewport');
  if (btn) {
    btn.innerHTML = isFull ? '📱 Modo Celular' : '💻 Tela Cheia';
  }
};

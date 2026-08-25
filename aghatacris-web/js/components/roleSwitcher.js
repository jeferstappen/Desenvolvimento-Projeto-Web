/**
 * AGhataCris - Simulator Presentation Toolbar & Role Switcher
 */

window.renderSimulatorToolbar = function() {
  const toolbarEl = document.getElementById('simulator-toolbar');
  if (!toolbarEl) return;

  const state = window.appState.getState();

  toolbarEl.innerHTML = `
    <div class="toolbar-brand">
      <span class="brand-dot"></span>
      <span>AGhataCris • Ambiente de Apresentação</span>
    </div>

    <div class="toolbar-roles">
      <button class="role-btn ${state.currentRole === 'cliente' ? 'active' : ''}" onclick="window.switchRoleAndNavigate('cliente')">
        👤 Cliente
      </button>
      <button class="role-btn ${state.currentRole === 'freelancer' ? 'active' : ''}" onclick="window.switchRoleAndNavigate('freelancer')">
        💇‍♀️ Freelancer
      </button>
      <button class="role-btn ${state.currentRole === 'salao' ? 'active' : ''}" onclick="window.switchRoleAndNavigate('salao')">
        🏢 Salão Parceiro
      </button>
      <button class="role-btn ${state.currentRole === 'admin' ? 'active' : ''}" onclick="window.switchRoleAndNavigate('admin')">
        ⚡ Admin
      </button>
    </div>

    <div class="toolbar-actions">
      <button class="tool-toggle-btn" onclick="window.location.hash = '#/login'">
        🔑 Tela de Login
      </button>
      <button class="tool-toggle-btn" onclick="window.location.hash = '#/register'">
        📝 Cadastro
      </button>
      <button class="tool-toggle-btn" onclick="window.toggleDeviceViewport()" id="btn-toggle-viewport">
        📱 Modo Tela
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

/**
 * AGhataCris - Universal Perfil & Configurações View
 * Corresponds to Figura 10 (Visão Geral: Configurações de Perfil de Usuário)
 * Inclui modal de edição de dados cadastrais (sem CPF/CNPJ - imutáveis)
 */

window.renderPerfilView = function() {
  const state = window.appState.getState();
  const user = state.currentUser || (state.rolesData && state.rolesData[state.currentRole]) || {
    nome_completo: 'Usuário Convidado',
    email: 'nao.autenticado@aghatacris.com.br',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    tipo_perfil: 'Cliente',
    badge: 'Membro Novo',
    servicosRealizados: 0
  };

  const role = state.currentRole;
  const isFreelancer = role === 'freelancer';
  const isSalao = role === 'salao';

  return `
    <div class="view-content-padded animate-fade-in">
      <!-- Profile Header -->
      <div class="profile-header-card">
        <div style="position: relative; display: inline-block;">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" alt="Avatar" class="profile-big-avatar" />
          <button style="position: absolute; bottom: 12px; right: 0; background: var(--primary-teal); color: white; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);" onclick="UI.showToast('Alteração de foto de perfil', 'info')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
          </button>
        </div>

        <h2 class="text-xl font-extrabold text-primary" style="margin-bottom: 2px;">${user.nome_completo}</h2>
        <p class="text-xs text-muted">${user.email}</p>

        <div class="profile-badges-row">
          <div class="badge badge-teal" style="padding: 6px 12px;">
            ★ Perfil: <strong>${user.tipo_perfil || state.currentRole.toUpperCase()}</strong>
          </div>
          <div class="badge badge-emerald" style="padding: 6px 12px;">
            ✨ <strong>${user.servicosRealizados || 12}</strong> serviços
          </div>
        </div>
      </div>

      <!-- Settings Menu List -->
      <div class="settings-menu-list">
        <div class="settings-menu-item" onclick="window.location.hash = '#/perfil/editar'" style="cursor: pointer;">
          <div class="settings-item-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Meus Dados Cadastrais</span>
          </div>
          <span style="color: var(--text-muted);">›</span>
        </div>

        <div class="settings-menu-item" onclick="window.location.hash = '#/perfil/pagamento'" style="cursor: pointer;">
          <div class="settings-item-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            <span>Formas de Pagamento</span>
          </div>
          <span style="color: var(--text-muted);">›</span>
        </div>

        <div class="settings-menu-item" onclick="UI.showToast('Central de Atendimento AGhataCris 24/7', 'info')">
          <div class="settings-item-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <span>Ajuda e Suporte</span>
          </div>
          <span style="color: var(--text-muted);">›</span>
        </div>

        <div class="settings-menu-item" onclick="UI.showToast('Termos de Uso alinhados à Lei do Salão Parceiro (Lei 13.352/16)', 'info')">
          <div class="settings-item-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            <span>Termos de Uso & Salão Parceiro</span>
          </div>
          <span style="color: var(--text-muted);">›</span>
        </div>
      </div>

      <!-- Logout Action -->
      <button class="btn btn-secondary" style="color: var(--accent-coral); border-color: #FECDD3;" onclick="window.handleLogout()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        Sair da Conta
      </button>

      <div class="text-center" style="margin-top: 20px; font-size: 0.75rem; color: var(--text-muted);">
        AGhataCris PWA • Versão 2.4.1 (Sprint 3)
      </div>
    </div>
  `;
};

window.handleLogout = function() {
  if (window.appState && window.appState.logout) {
    window.appState.logout();
  }
  UI.showToast('Você saiu da sua conta.', 'info');
  window.location.hash = '#/login';
};

// Redirecionamento padronizado para a tela de Dados Cadastrais
window.openEditarPerfilModal = function() {
  window.location.hash = '#/perfil/editar';
};

window.closeEditarPerfilModal = function() {
  const modal = document.getElementById('modal-editar-perfil');
  if (modal) modal.remove();
};

/**
 * AGhataCris - Tela de Dados Cadastrais & Segurança
 * Rota: #/perfil/editar
 * Funciona como tela integrada no mockup do aplicativo (com navegação padronizada)
 */

window.renderEditarPerfilView = function() {
  const state = window.appState.getState();
  const user = state.currentUser || (state.rolesData && state.rolesData[state.currentRole]) || {
    nome_completo: 'Mariana Silva',
    email: 'mariana.silva@beauty.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    tipo_perfil: 'Freelancer'
  };
  const role = state.currentRole;
  const isSalao = role === 'salao';
  const isFreelancer = role === 'freelancer';

  // Campo de documento imutável (CPF ou CNPJ) com layout 100% empilhado e padronizado
  const docField = isSalao
    ? `<div class="form-group">
        <label class="form-label" style="display:flex;align-items:center;justify-content:space-between;width:100%;">
          <span>CNPJ</span>
          <span style="background:#FEF3C7;color:#92400E;font-size:10px;padding:2px 8px;border-radius:20px;font-weight:700;">🔒 Não editável</span>
        </label>
        <input type="text" value="${user.cnpj || '12.345.678/0001-90'}" disabled
          style="background:var(--bg-subtle);color:var(--text-muted);cursor:not-allowed;border-color:var(--border-subtle);width:100%;" />
      </div>`
    : `<div class="form-group">
        <label class="form-label" style="display:flex;align-items:center;justify-content:space-between;width:100%;">
          <span>CPF</span>
          <span style="background:#FEF3C7;color:#92400E;font-size:10px;padding:2px 8px;border-radius:20px;font-weight:700;">🔒 Não editável</span>
        </label>
        <input type="text" value="${user.cpf || '123.456.789-00'}" disabled
          style="background:var(--bg-subtle);color:var(--text-muted);cursor:not-allowed;border-color:var(--border-subtle);width:100%;" />
      </div>`;

  // Campos extras para profissional freelancer ou salão parceiro
  const extraFields = (isFreelancer || isSalao) ? `
    <div class="form-group">
      <label class="form-label">Especialidade</label>
      <input type="text" id="edit-especialidade" value="${user.especialidade || ''}" placeholder="Ex: Hair Specialist & Maquiagem" style="width:100%;" />
    </div>
    <div class="form-group">
      <label class="form-label">Preço Estimado (R$)</label>
      <input type="number" id="edit-preco" value="${user.preco_estimado || ''}" placeholder="Ex: 75.00" step="0.01" min="0" style="width:100%;" />
    </div>
    <div class="form-group">
      <label class="form-label">Modalidade de Atendimento</label>
      <select id="edit-modalidade" style="width:100%;padding:12px 14px;border-radius:var(--radius-sm);border:1px solid var(--border-light);background:var(--bg-surface);color:var(--text-primary);font-size:0.95rem;">
        <option value="Ambos" ${(user.modalidade || 'Ambos') === 'Ambos' ? 'selected' : ''}>Ambos (Domicílio e Salão)</option>
        <option value="Domicilio" ${user.modalidade === 'Domicilio' ? 'selected' : ''}>Somente Domicílio</option>
        <option value="Salao" ${user.modalidade === 'Salao' ? 'selected' : ''}>Somente No Salão</option>
      </select>
    </div>
  ` : '';

  return `
    <div class="view-content-padded animate-fade-in" style="padding-bottom: 40px;">

      <!-- Header com botão Voltar padrão do aplicativo -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <button onclick="window.location.hash = '#/perfil'" style="background:var(--bg-surface);border:1px solid var(--border-light);border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;box-shadow:var(--shadow-sm);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div>
          <h2 class="view-page-title" style="margin:0;font-size:1.25rem;">Meus Dados Cadastrais</h2>
          <p class="text-xs text-muted" style="margin:0;">Mantenha suas informações cadastrais atualizadas</p>
        </div>
      </div>

      <!-- Preview do Perfil -->
      <div class="surface-card" style="display:flex;align-items:center;gap:14px;margin-bottom:20px;padding:16px;border-radius:var(--radius-md);">
        <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}"
          alt="Avatar" style="width:54px;height:54px;border-radius:50%;object-fit:cover;border:2px solid var(--primary-teal);flex-shrink:0;" />
        <div style="flex:1;min-width:0;">
          <div class="font-bold text-sm text-primary" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${user.nome_completo || 'Usuário'}
          </div>
          <div class="text-xs text-muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${user.email || ''}
          </div>
          <div style="margin-top:4px;">
            <span class="badge badge-teal" style="font-size:0.7rem;padding:2px 8px;">
              ★ ${user.tipo_perfil || role.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <!-- Formulário de Edição de Dados -->
      <div class="surface-card" style="padding:20px;border-radius:var(--radius-md);">
        <div class="form-group">
          <label class="form-label">Nome Completo</label>
          <input type="text" id="edit-nome" value="${user.nome_completo || ''}" placeholder="Seu nome completo" style="width:100%;" />
        </div>

        <div class="form-group">
          <label class="form-label">E-mail</label>
          <input type="email" id="edit-email" value="${user.email || ''}" placeholder="seuemail@exemplo.com" style="width:100%;" />
        </div>

        ${docField}

        ${extraFields}

        <button class="btn btn-primary" style="width:100%;margin-top:8px;" onclick="window.salvarDadosCadastrais()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Salvar Alterações
        </button>

        <p class="text-xs text-muted text-center" style="margin-top:14px;line-height:1.4;">
          🔒 O CPF/CNPJ é imutável após a criação da conta por requisitos fiscais e de compliance da Lei do Salão Parceiro.
        </p>
      </div>

      <!-- Zona de Exclusão de Conta -->
      <div style="background:#FFF1F2;border:1.5px solid #FECDD3;border-radius:var(--radius-md);padding:18px;margin-top:24px;box-shadow:var(--shadow-sm);">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <h3 style="margin:0;font-size:0.95rem;font-weight:800;color:#BE123C;">Excluir Conta</h3>
        </div>
        
        <p style="font-size:0.8rem;color:#9F1239;margin-bottom:14px;line-height:1.4;">
          Deseja encerrar seu cadastro na plataforma? Esta solicitação exigirá sua senha de acesso e enviará um e-mail de confirmação para sua segurança (LGPD).
        </p>

        <button type="button" class="btn" onclick="window.abrirModalExcluirConta()"
          style="background:#E11D48;color:white;border:none;width:100%;font-weight:700;box-shadow:0 2px 8px rgba(225,29,72,0.25);display:flex;align-items:center;justify-content:center;gap:8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Excluir Minha Conta
        </button>
      </div>

    </div>
  `;
};

// Salvar dados cadastrais
window.salvarDadosCadastrais = async function() {
  const state = window.appState.getState();
  const user = state.currentUser || {};
  const userId = user.id_usuario;

  const nome = document.getElementById('edit-nome');
  const email = document.getElementById('edit-email');
  const especialidade = document.getElementById('edit-especialidade');
  const preco = document.getElementById('edit-preco');
  const modalidade = document.getElementById('edit-modalidade');

  const payload = {};
  if (nome && nome.value.trim()) payload.nome_completo = nome.value.trim();
  if (email && email.value.trim()) payload.email = email.value.trim();
  if (especialidade && especialidade.value.trim()) payload.especialidade = especialidade.value.trim();
  if (preco && preco.value !== '') payload.preco_estimado = parseFloat(preco.value);
  if (modalidade) payload.modalidade = modalidade.value;

  if (!payload.nome_completo || !payload.email) {
    UI.showToast('Nome e e-mail são obrigatórios.', 'error');
    return;
  }

  try {
    if (window.API && userId) {
      const res = await window.API.updateUser(userId, payload);
      if (res && res.user) {
        Object.assign(window.appState.state.currentUser, res.user);
        const role = state.currentRole;
        if (window.appState.state.rolesData[role]) {
          Object.assign(window.appState.state.rolesData[role], res.user);
        }
        window.appState.saveState();
        UI.showToast('Dados cadastrais atualizados com sucesso!', 'success');
        window.location.hash = '#/perfil';
        return;
      }
    }
    // Fallback offline
    Object.assign(window.appState.state.currentUser, payload);
    const role = state.currentRole;
    if (window.appState.state.rolesData[role]) {
      Object.assign(window.appState.state.rolesData[role], payload);
    }
    window.appState.saveState();
    UI.showToast('Dados cadastrais atualizados com sucesso!', 'success');
    window.location.hash = '#/perfil';
  } catch (err) {
    console.error('Erro ao salvar dados:', err);
    UI.showToast(err.message || 'Erro ao salvar dados cadastrais.', 'error');
  }
};

// Modal de confirmação de senha para exclusão de conta
window.abrirModalExcluirConta = function() {
  const state = window.appState.getState();
  const user = state.currentUser || {};

  UI.openModal(`
    <div style="text-align:left;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
        <div style="width:40px;height:40px;border-radius:50%;background:#FEE2E2;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div>
          <h3 class="modal-title" style="margin:0;font-size:1.1rem;color:var(--text-primary);">Confirmar com Senha</h3>
          <p class="text-xs text-muted" style="margin:0;">Segurança da conta e conformidade LGPD</p>
        </div>
      </div>

      <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.45;margin-bottom:16px;">
        Para solicitar a exclusão da sua conta (<strong>${user.email || 'usuário'}</strong>), por favor confirme sua senha atual de acesso:
      </p>

      <div class="form-group" style="margin-bottom:16px;">
        <label class="form-label" for="confirm-delete-password">Sua Senha Atual</label>
        <div style="position:relative;width:100%;">
          <input type="password" id="confirm-delete-password" placeholder="Digite sua senha" autocomplete="current-password"
            style="width:100%;padding-right:44px;"
            onkeydown="if(event.key==='Enter') window.confirmarExclusaoConta()" />
          <button type="button" onclick="window.toggleExcluirSenhaVisibilidade()"
            style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:16px;padding:4px;"
            title="Mostrar / Ocultar Senha">
            👁️
          </button>
        </div>
        <div id="delete-password-error" style="color:#DC2626;font-size:0.75rem;font-weight:600;margin-top:6px;display:none;"></div>
      </div>

      <div style="display:flex;gap:10px;margin-top:20px;">
        <button class="btn btn-secondary" style="flex:1;" onclick="UI.closeModal()">
          Cancelar
        </button>
        <button id="btn-confirm-delete" class="btn" style="flex:1.2;background:#DC2626;color:white;border:none;font-weight:700;" onclick="window.confirmarExclusaoConta()">
          Confirmar
        </button>
      </div>
    </div>
  `);

  // Foco no campo de senha após abertura
  setTimeout(() => {
    const input = document.getElementById('confirm-delete-password');
    if (input) input.focus();
  }, 100);
};

// Alternar visibilidade da senha no modal
window.toggleExcluirSenhaVisibilidade = function() {
  const input = document.getElementById('confirm-delete-password');
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
};

// Validação da senha e exibição do pop-up de e-mail enviado
window.confirmarExclusaoConta = async function() {
  const state = window.appState.getState();
  const user = state.currentUser || {};
  const passInput = document.getElementById('confirm-delete-password');
  const errorEl = document.getElementById('delete-password-error');
  const btnConfirm = document.getElementById('btn-confirm-delete');

  if (!passInput) return;
  const password = passInput.value;

  // 1. Validar preenchimento
  if (!password) {
    if (errorEl) {
      errorEl.textContent = 'Por favor, digite sua senha de acesso.';
      errorEl.style.display = 'block';
    }
    passInput.style.borderColor = '#DC2626';
    passInput.focus();
    return;
  }

  // Desabilitar botão durante validação
  if (btnConfirm) {
    btnConfirm.disabled = true;
    btnConfirm.textContent = 'Validando...';
  }

  let isPasswordValid = false;

  // 2. Validação via API REST se backend ativo
  try {
    if (window.API && window.API.verifyPassword && user.email) {
      const res = await window.API.verifyPassword(user.email, password, user.id_usuario);
      if (res && res.success) {
        isPasswordValid = true;
      }
    }
  } catch (err) {
    // Se a API retornou erro específico de senha incorreta (HTTP 400/401)
    if (err && err.message && (err.message.includes('Senha incorreta') || err.message.includes('incorret'))) {
      if (errorEl) {
        errorEl.textContent = 'Senha incorreta. Verifique sua senha e tente novamente.';
        errorEl.style.display = 'block';
      }
      passInput.style.borderColor = '#DC2626';
      if (btnConfirm) {
        btnConfirm.disabled = false;
        btnConfirm.textContent = 'Confirmar';
      }
      return;
    }
    console.warn('Verificação de senha via API offline, utilizando fallback de segurança local.');
  }

  // 3. Fallback de validação em modo mock/offline
  if (!isPasswordValid) {
    const userEmailKey = (user.email || '').toLowerCase().trim();
    const storedPassword = state.userPasswords && state.userPasswords[userEmailKey];
    const defaultDemoPasswords = ['12345678', '123456', 'admin123'];

    if (storedPassword && storedPassword === password) {
      isPasswordValid = true;
    } else if (!storedPassword && defaultDemoPasswords.includes(password)) {
      isPasswordValid = true;
    } else if (user.senha && user.senha === password) {
      isPasswordValid = true;
    }
  }

  // 4. Se senha inválida, barrar o processo
  if (!isPasswordValid) {
    if (errorEl) {
      errorEl.textContent = 'Senha incorreta. Verifique sua senha e tente novamente.';
      errorEl.style.display = 'block';
    }
    passInput.style.borderColor = '#DC2626';
    passInput.focus();
    if (btnConfirm) {
      btnConfirm.disabled = false;
      btnConfirm.textContent = 'Confirmar';
    }
    return;
  }

  // 5. Senha validada com sucesso!
  // Conforme solicitação do usuário: "após o usuario ter digitado a senha corretamente mandar um email para o usuario para confirmar se ele quer realmente excluir a conta, essa parte faça apenas um pop up dizendo que o um email foi enviado para confirmar a exclusão da conta e nada mais que isso pois essa parte deixaremos mais para o futuro do projeto a parte que realmente envia o email"
  UI.openModal(`
    <div style="text-align:center;padding:12px 6px 8px 6px;">
      <div style="width:64px;height:64px;border-radius:50%;background:#ECFDF5;border:2px solid #10B981;display:flex;align-items:center;justify-content:center;margin:0 auto 16px auto;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0D9488" stroke-width="2.3">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      </div>

      <h3 class="modal-title" style="margin-bottom:8px;font-size:1.15rem;color:var(--text-primary);">
        E-mail de Confirmação Enviado
      </h3>

      <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.5;margin-bottom:18px;">
        Um e-mail foi enviado para <strong>${user.email || 'seu e-mail'}</strong> para confirmar a exclusão da sua conta.
      </p>

      <p class="text-xs text-muted" style="margin-bottom:24px;line-height:1.4;">
        Por favor, acesse sua caixa de entrada e clique no link de confirmação para concluir o encerramento do seu cadastro.
      </p>

      <button class="btn btn-primary" style="width:100%;font-weight:700;" onclick="UI.closeModal()">
        Entendido
      </button>
    </div>
  `);
};

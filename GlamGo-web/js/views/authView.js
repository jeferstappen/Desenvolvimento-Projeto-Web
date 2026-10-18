/**
 * GlamGo - Auth Views (Login & Cadastro por Papel)
 * Estilo Minimalista Preto e Branco
 */

window.togglePasswordVisibility = function(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  btn.innerHTML = isPass 
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
};

window.renderLoginView = function() {
  return `
    <div class="auth-container animate-fade-in">
      <div>
        <div class="auth-header">
          <h1 class="brand-title">GlamGo</h1>
          <div class="brand-underline"></div>
          <p class="auth-subtitle">Bem-vindo(a) de volta!</p>
        </div>

        <div class="auth-card">
          <form id="form-login" onsubmit="event.preventDefault(); window.handleLoginSubmit();">
            <div class="form-group">
              <div class="input-with-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <input type="email" id="login-email" placeholder="E-mail" required autocomplete="username" />
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 4px;">
              <div class="input-with-icon input-with-action">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <input type="password" id="login-password" placeholder="Senha" required autocomplete="current-password" />
                <button type="button" class="password-toggle-btn" onclick="window.togglePasswordVisibility('login-password', this)" title="Mostrar/ocultar senha">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </div>
            </div>

            <div class="forgot-password-wrap">
              <a href="javascript:void(0)" onclick="UI.showToast('Utilize um dos acessos rápidos para demonstração.', 'info')" class="forgot-password-link">Esqueci minha senha</a>
            </div>

            <button type="submit" class="btn-primary-custom">
              Entrar
            </button>
          </form>

          <div class="auth-divider">
            <span>OU</span>
          </div>

          <div class="social-auth-row">
            <button type="button" class="social-btn" onclick="window.quickFillLogin('isabela.santos@email.com', '12345678')" title="Acesso Rápido Cliente (iOS)">
              <span style="font-weight: 800; font-size: 0.78rem; letter-spacing: -0.5px;">iOS</span>
            </button>
            <button type="button" class="social-btn" onclick="window.quickFillLogin('mariana.silva@beauty.com', '12345678')" title="Acesso Rápido Freelancer (Certificado)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </button>
          </div>

          <div class="demo-account-pills">
            <div class="demo-pills-title">🚀 Acesso Rápido para Avaliação</div>
            <div class="demo-pills-row">
              <button class="demo-pill-btn" onclick="window.quickFillLogin('isabela.santos@email.com', '12345678')">👤 Cliente</button>
              <button class="demo-pill-btn" onclick="window.quickFillLogin('mariana.silva@beauty.com', '12345678')">💇‍♀️ Freelancer</button>
              <button class="demo-pill-btn" onclick="window.quickFillLogin('contato@studioelegance.com.br', '12345678')">🏢 Salão</button>
            </div>
          </div>
        </div>
      </div>

      <div class="auth-footer">
        <p>Ainda não tem uma conta? <a href="#/register" class="text-link font-bold">Cadastre-se</a></p>
      </div>
    </div>
  `;
};

window.renderRegisterView = function() {
  return `
    <div class="auth-container animate-fade-in">
      <div>
        <div class="flex items-center gap-2" style="margin-bottom: 16px;">
          <button class="btn-ghost" onclick="window.history.back()" style="padding: 4px; color: #000000;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span class="brand-title" style="font-size: 1.35rem; margin: 0; text-align: left;">GlamGo</span>
        </div>

        <div class="auth-card">
          <div style="margin-bottom: 18px;">
            <h2 class="text-xl font-bold" style="color: #000000; letter-spacing: -0.5px;">Crie sua conta</h2>
            <p class="text-sm text-secondary">Junte-se à nossa comunidade exclusiva de beleza sob demanda.</p>
          </div>

          <div class="form-group">
            <label class="form-label" style="text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.5px;">Como você deseja usar o app?</label>
            <div class="role-selector-grid" id="register-role-grid">
              <div class="role-card-option selected" data-role="cliente" onclick="window.selectRegisterRole('cliente', this)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Sou Cliente</span>
              </div>
              <div class="role-card-option" data-role="freelancer" onclick="window.selectRegisterRole('freelancer', this)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>
                <span>Sou Profissional</span>
              </div>
              <div class="role-card-option" data-role="salao" onclick="window.selectRegisterRole('salao', this)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                <span>Salão Parceiro</span>
              </div>
            </div>
          </div>

          <form id="form-register" onsubmit="event.preventDefault(); window.handleRegisterSubmit();">
            <div class="form-group">
              <label class="form-label" id="label-register-name">Nome Completo</label>
              <input type="text" id="reg-name" placeholder="Ex: Maria Silva" required />
            </div>

            <!-- CPF (Cliente / Freelancer) -->
            <div class="form-group" id="group-cpf">
              <label class="form-label">CPF</label>
              <input type="text" id="reg-cpf" placeholder="000.000.000-00" maxlength="14" oninput="window.maskCPF(this)" />
            </div>

            <!-- CNPJ (Salão Parceiro) -->
            <div class="form-group" id="group-cnpj" style="display: none;">
              <label class="form-label">CNPJ</label>
              <input type="text" id="reg-cnpj" placeholder="00.000.000/0000-00" maxlength="18" oninput="window.maskCNPJ(this)" />
            </div>

            <div class="form-group">
              <label class="form-label">E-mail</label>
              <input type="email" id="reg-email" placeholder="seuemail@exemplo.com" required />
            </div>

            <div class="form-group">
              <label class="form-label">Senha</label>
              <div class="input-with-icon input-with-action">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <input type="password" id="reg-password" placeholder="Mínimo 6 caracteres" required />
                <button type="button" class="password-toggle-btn" onclick="window.togglePasswordVisibility('reg-password', this)" title="Mostrar/ocultar senha">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </div>
            </div>

            <p class="text-xs text-muted" style="margin: 16px 0;">
              Ao se cadastrar, você concorda com nossos <a href="javascript:void(0)" class="text-link">Termos de Uso</a>, <a href="javascript:void(0)" class="text-link">Privacidade</a> e com a ativação de geolocalização (GPS).
            </p>

            <button type="submit" class="btn-primary-custom">
              Cadastrar e Continuar
            </button>
          </form>
        </div>
      </div>

      <div class="auth-footer">
        <p>Já tem uma conta? <a href="#/login" class="text-link font-bold">Faça login</a></p>
      </div>
    </div>
  `;
};

window.selectedRegisterRole = 'cliente';

window.selectRegisterRole = function(role, el) {
  window.selectedRegisterRole = role;
  document.querySelectorAll('#register-role-grid .role-card-option').forEach(card => card.classList.remove('selected'));
  if (el) el.classList.add('selected');

  const labelName = document.getElementById('label-register-name');
  if (labelName) {
    labelName.textContent = role === 'salao' ? 'Nome do Salão' : 'Nome Completo';
  }

  // Atualizar placeholder do campo nome
  const nameInput = document.getElementById('reg-name');
  if (nameInput) {
    nameInput.placeholder = role === 'salao' ? 'Ex: Studio Elegance' : 'Ex: Maria Silva';
  }

  // Toggle CPF / CNPJ com display flex para manter layout padronizado de coluna
  const groupCPF = document.getElementById('group-cpf');
  const groupCNPJ = document.getElementById('group-cnpj');
  if (groupCPF) groupCPF.style.display = role === 'salao' ? 'none' : 'flex';
  if (groupCNPJ) groupCNPJ.style.display = role === 'salao' ? 'flex' : 'none';
};

window.quickFillLogin = function(email, pass) {
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  if (emailInput) emailInput.value = email;
  if (passInput) passInput.value = pass;
  window.handleLoginSubmit();
};

window.handleLoginSubmit = async function() {
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  if (!emailInput || !passInput) return;

  const email = emailInput.value.trim();
  const password = passInput.value;

  if (!email) {
    UI.showToast('Por favor, informe seu e-mail.', 'error');
    return;
  }

  try {
    if (window.API) {
      const res = await window.API.login(email, password);
      if (res && res.user) {
        let role = (res.user.tipo_perfil || 'Cliente').toLowerCase();
        if (role === 'administrador') role = 'admin';

        window.appState.state.currentRole = role;
        window.appState.state.currentUser = { ...res.user };
        window.appState.state.userPasswords = window.appState.state.userPasswords || {};
        if (password) window.appState.state.userPasswords[email.toLowerCase()] = password;
        if (window.appState.state.rolesData[role]) {
          window.appState.state.rolesData[role] = {
            ...window.appState.state.rolesData[role],
            ...res.user
          };
        }
        window.appState.saveState();

        UI.showToast(`Bem-vindo(a), ${res.user.nome_completo}!`, 'success');
        window.location.hash = `#/${role}/home`;
        return;
      }
    }
  } catch (err) {
    console.error('Erro no login:', err);
    UI.showToast(err.message || 'E-mail ou senha incorretos.', 'error');
  }
};

window.handleRegisterSubmit = async function() {
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const passInput = document.getElementById('reg-password');
  const cpfInput = document.getElementById('reg-cpf');
  const cnpjInput = document.getElementById('reg-cnpj');

  if (!nameInput || !emailInput || !passInput) return;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passInput.value;
  const role = window.selectedRegisterRole || 'cliente';
  const cpf = cpfInput ? cpfInput.value.trim() : '';
  const cnpj = cnpjInput ? cnpjInput.value.trim() : '';

  if (!name || !email || !password) {
    UI.showToast('Por favor, preencha todos os campos.', 'error');
    return;
  }

  try {
    if (window.API) {
      const formattedRole = role === 'admin' ? 'Administrador' : (role === 'salao' ? 'Salao' : (role === 'freelancer' ? 'Freelancer' : 'Cliente'));
      const res = await window.API.register({
        nome_completo: name,
        email: email,
        senha: password,
        tipo_perfil: formattedRole,
        cpf: role !== 'salao' ? cpf : undefined,
        cnpj: role === 'salao' ? cnpj : undefined
      });

      if (res && res.user) {
        // Conectar imediatamente com o usuário recém-criado
        window.appState.state.currentRole = role;
        window.appState.state.currentUser = { ...res.user };
        window.appState.state.userPasswords = window.appState.state.userPasswords || {};
        window.appState.state.userPasswords[email.toLowerCase()] = password;
        if (window.appState.state.rolesData[role]) {
          window.appState.state.rolesData[role] = {
            ...window.appState.state.rolesData[role],
            ...res.user
          };
        }
        window.appState.saveState();

        UI.showToast(`Conta criada com sucesso! Bem-vindo(a), ${res.user.nome_completo}!`, 'success');
        window.location.hash = `#/${role}/home`;
        return;
      }
    }
  } catch (err) {
    console.error('Erro no cadastro:', err);
    UI.showToast(err.message || 'Erro ao realizar cadastro.', 'error');
  }
};

// Máscaras de CPF e CNPJ
window.maskCPF = function(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = v;
};

window.maskCNPJ = function(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 14);
  v = v.replace(/(\d{2})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1/$2');
  v = v.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  input.value = v;
};

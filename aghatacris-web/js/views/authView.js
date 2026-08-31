/**
 * AGhataCris - Auth Views (Login & Cadastro por Papel)
 * Corresponds to Figura 1 (Login) and Figura 2 (Cadastro com seleção de Perfil)
 */

window.renderLoginView = function() {
  return `
    <div class="auth-container animate-fade-in">
      <div>
        <div class="auth-header">
          <h1 class="auth-logo">AGhataCris</h1>
          <p class="auth-subtitle">Bem-vindo(a) de volta!</p>
        </div>

        <form onsubmit="event.preventDefault(); window.handleLoginSubmit();">
          <div class="form-group">
            <label class="form-label">E-mail</label>
            <div class="input-with-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <input type="email" id="login-email" value="isabela.santos@email.com" placeholder="seuemail@exemplo.com" required />
            </div>
          </div>

          <div class="form-group">
            <div class="flex justify-between items-center">
              <label class="form-label">Senha</label>
              <a href="javascript:void(0)" onclick="UI.showToast('Link de recuperação enviado para seu e-mail', 'info')" class="text-xs text-muted">Esqueci minha senha</a>
            </div>
            <div class="input-with-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <input type="password" id="login-password" value="••••••••" placeholder="Sua senha secreta" required />
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: 10px;">
            Entrar na Plataforma
          </button>
        </form>

        <div class="demo-account-pills">
          <div class="demo-pills-title">🚀 Acesso Rápido para Avaliação</div>
          <div class="demo-pills-row">
            <button class="demo-pill-btn" onclick="window.quickLoginAs('cliente')">👤 Cliente</button>
            <button class="demo-pill-btn" onclick="window.quickLoginAs('freelancer')">💇‍♀️ Freelancer</button>
            <button class="demo-pill-btn" onclick="window.quickLoginAs('salao')">🏢 Salão</button>
          </div>
        </div>
      </div>

      <div class="auth-footer">
        <p>Ainda não tem uma conta? <a href="#/register" class="font-bold text-teal">Cadastre-se</a></p>
      </div>
    </div>
  `;
};

window.renderRegisterView = function() {
  return `
    <div class="auth-container animate-fade-in">
      <div>
        <div class="flex items-center gap-2" style="margin-bottom: 16px;">
          <button class="btn-ghost" onclick="window.history.back()" style="padding: 4px;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span class="brand-title" style="font-size: 1.1rem;">AGhataCris</span>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 class="text-xl font-extrabold text-primary">Crie sua conta</h2>
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

        <form onsubmit="event.preventDefault(); window.handleRegisterSubmit();">
          <div class="form-group">
            <label class="form-label" id="label-register-name">Nome Completo</label>
            <input type="text" id="reg-name" placeholder="Ex: Maria Silva" required />
          </div>

          <div class="form-group">
            <label class="form-label">E-mail</label>
            <input type="email" id="reg-email" placeholder="seuemail@exemplo.com" required />
          </div>

          <div class="form-group">
            <label class="form-label">Senha</label>
            <input type="password" id="reg-password" placeholder="Mínimo 8 caracteres" required />
          </div>

          <p class="text-xs text-muted" style="margin: 16px 0;">
            Ao se cadastrar, você concorda com nossos <a href="javascript:void(0)" class="text-teal">Termos de Uso</a>, <a href="javascript:void(0)" class="text-teal">Privacidade</a> e com a ativação de geolocalização (GPS).
          </p>

          <button type="submit" class="btn btn-primary">
            Cadastrar e Continuar
          </button>
        </form>
      </div>

      <div class="auth-footer">
        <p>Já tem uma conta? <a href="#/login" class="font-bold text-teal">Faça login</a></p>
      </div>
    </div>
  `;
};

window.selectedRegisterRole = 'cliente';

window.selectRegisterRole = function(role, el) {
  window.selectedRegisterRole = role;
  document.querySelectorAll('#register-role-grid .role-card-option').forEach(card => card.classList.remove('selected'));
  el.classList.add('selected');

  const labelName = document.getElementById('label-register-name');
  if (labelName) {
    labelName.textContent = role === 'salao' ? 'Razão Social ou Nome Fantasia' : 'Nome Completo';
  }
};

window.handleLoginSubmit = async function() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    if (window.API) {
      const res = await window.API.login(email, password);
      if (res && res.user) {
        const role = res.user.tipo_perfil.toLowerCase() === 'administrador' ? 'admin' : res.user.tipo_perfil.toLowerCase();
        window.appState.setRole(role);
        window.appState.getState().currentUser = { ...res.user };
        window.appState.saveState();
        UI.showToast(`Bem-vindo(a), ${res.user.nome_completo}!`, 'success');
        window.location.hash = `#/${role}/home`;
        return;
      }
    }
  } catch (err) {
    console.warn('Login backend fallback:', err.message);
  }

  UI.showToast(`Login realizado com sucesso!`, 'success');
  window.location.hash = `#/${window.appState.getState().currentRole}/home`;
};

window.handleRegisterSubmit = async function() {
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const role = window.selectedRegisterRole;

  try {
    if (window.API) {
      const res = await window.API.register({
        nome_completo: name,
        email: email,
        senha: password,
        tipo_perfil: role === 'admin' ? 'Administrador' : (role === 'salao' ? 'Salao' : (role === 'freelancer' ? 'Freelancer' : 'Cliente'))
      });
      if (res && res.user) {
        window.appState.setRole(role);
        window.appState.getState().currentUser = { ...res.user };
        window.appState.saveState();
        UI.showToast(`Conta criada como ${role.toUpperCase()} no banco de dados!`, 'success');
        window.location.hash = `#/${role}/home`;
        return;
      }
    }
  } catch (err) {
    console.warn('Cadastro backend fallback:', err.message);
  }

  window.appState.setRole(role);
  window.appState.getState().currentUser.nome_completo = name;
  window.appState.getState().currentUser.email = email;
  window.appState.saveState();

  UI.showToast(`Conta criada como ${role.toUpperCase()} com sucesso!`, 'success');
  window.location.hash = `#/${role}/home`;
};

window.quickLoginAs = function(role) {
  window.appState.setRole(role);
  window.location.hash = `#/${role}/home`;
  UI.showToast(`Conectado como ${role.toUpperCase()}`, 'success');
};

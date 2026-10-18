/**
 * AGhataCris - Formas de Pagamento View
 * Cliente: Salvar cartão de crédito
 * Freelancer: Cadastrar chave PIX ou conta corrente
 * Salão: Obrigatoriamente conta corrente sem opção de PIX (Lei do Salão Parceiro)
 */

window.renderPagamentoView = function() {
  const state = window.appState.getState();
  const role = state.currentRole || 'cliente';
  const user = state.currentUser || (state.rolesData && state.rolesData[role]) || {};
  const formas = state.formasPagamento || {};
  const dadosSalvos = formas[role] || {};

  return `
    <div class="view-content-padded animate-fade-in" style="padding-bottom: 90px;">
      <!-- Header de Navegação -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
        <button class="btn-ghost" style="padding: 6px; display: flex; align-items: center; gap: 4px; font-weight: 700; color: var(--primary-teal);" onclick="window.location.hash = '#/perfil'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Voltar
        </button>
        <h2 class="text-base font-extrabold text-primary" style="margin: 0;">Formas de Pagamento</h2>
        <div style="width: 32px;"></div>
      </div>

      ${role === 'cliente' ? renderPagamentoCliente(dadosSalvos, user) : ''}
      ${role === 'freelancer' ? renderPagamentoFreelancer(dadosSalvos, user) : ''}
      ${role === 'salao' ? renderPagamentoSalao(dadosSalvos, user) : ''}
      ${role === 'admin' ? renderPagamentoAdmin() : ''}
    </div>
  `;
};

// =========================================================================
// 1. VISÃO DO CLIENTE: CARTÃO DE CRÉDITO
// =========================================================================
function renderPagamentoCliente(dados, user) {
  const numMascarado = dados.numero_mascarado || '•••• •••• •••• 4242';
  const titular = dados.titular || (user.nome_completo ? user.nome_completo.toUpperCase() : 'ISABELA SANTOS');
  const validade = dados.validade || '08/29';
  const bandeira = dados.bandeira || 'Mastercard';

  return `
    <!-- Cartão Visual Estilizado -->
    <div style="margin-bottom: 22px;">
      <div style="
        background: linear-gradient(135deg, #18181B 0%, #09090B 100%);
        color: white;
        padding: 22px;
        border-radius: 18px;
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.12);
        position: relative;
        overflow: hidden;
      ">
        <div style="position: absolute; right: -20px; top: -20px; width: 120px; height: 120px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <span style="font-weight: 800; letter-spacing: 1px; font-size: 0.95rem; color: #FFFFFF;">GlamGo Pay</span>
          <span style="font-size: 0.8rem; font-weight: 700; background: rgba(255,255,255,0.15); padding: 4px 10px; border-radius: 20px;">
            ${bandeira}
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
          <div style="width: 34px; height: 26px; background: linear-gradient(135deg, #F59E0B, #D97706); border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><circle cx="12" cy="20" r="1"></circle></svg>
        </div>

        <div id="card-preview-number" style="font-family: monospace; font-size: 1.15rem; font-weight: 700; letter-spacing: 2px; margin-bottom: 18px;">
          ${numMascarado}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.75rem;">
          <div>
            <div style="color: rgba(255,255,255,0.6); font-size: 0.65rem; text-transform: uppercase;">Titular do Cartão</div>
            <div id="card-preview-name" style="font-weight: 700; letter-spacing: 0.5px;">${titular}</div>
          </div>
          <div style="text-align: right;">
            <div style="color: rgba(255,255,255,0.6); font-size: 0.65rem; text-transform: uppercase;">Validade</div>
            <div id="card-preview-exp" style="font-weight: 700;">${validade}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulário de Cadastro do Cartão -->
    <div class="surface-card" style="padding: 18px; margin-bottom: 20px;">
      <h3 class="font-extrabold text-sm text-primary" style="margin-bottom: 4px;">Salvar Cartão de Crédito</h3>
      <p class="text-xs text-muted" style="margin-bottom: 16px;">Utilizado para o pagamento rápido de atendimentos estéticos sob demanda.</p>

      <form id="form-cartao-cliente" onsubmit="event.preventDefault(); window.salvarCartaoClienteAction();">
        <div class="form-group">
          <label class="form-label">Número do Cartão</label>
          <input type="text" id="input-cartao-numero" placeholder="0000 0000 0000 0000" maxlength="19" oninput="window.maskCartao(this)" required />
        </div>

        <div class="form-group">
          <label class="form-label">Nome Impresso no Cartão</label>
          <input type="text" id="input-cartao-nome" placeholder="Ex: ISABELA SANTOS" style="text-transform: uppercase;" oninput="document.getElementById('card-preview-name').textContent = this.value.toUpperCase() || 'ISABELA SANTOS'" required />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Validade (MM/AA)</label>
            <input type="text" id="input-cartao-validade" placeholder="MM/AA" maxlength="5" oninput="window.maskValidade(this)" required />
          </div>
          <div class="form-group">
            <label class="form-label">CVV / CVC</label>
            <input type="password" id="input-cartao-cvv" placeholder="•••" maxlength="4" required />
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 18px;">
          <label class="form-label">Bandeira</label>
          <select id="input-cartao-bandeira" class="form-input" style="width: 100%; padding: 10px; border-radius: var(--radius-xs); border: 1px solid var(--border-light); background: var(--bg-surface);">
            <option value="Mastercard">Mastercard</option>
            <option value="Visa">Visa</option>
            <option value="Elo">Elo</option>
            <option value="Hipercard">Hipercard</option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
          Salvar Cartão de Crédito
        </button>
      </form>
    </div>

    <!-- Badge de Segurança -->
    <div style="display: flex; align-items: center; gap: 10px; background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-teal)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      <p class="text-xs text-secondary" style="margin: 0; line-height: 1.4;">
        <strong>Ambiente 100% Criptografado:</strong> Seus dados de cartão são protegidos com tokenização PCI-DSS. Cobranças ocorrem somente após a finalização do atendimento.
      </p>
    </div>
  `;
}

// =========================================================================
// 2. VISÃO DO FREELANCER: PIX OU CONTA CORRENTE
// =========================================================================
function renderPagamentoFreelancer(dados, user) {
  const currentTab = window._pagamentoFreeTab || (dados.tipo === 'conta_corrente' ? 'conta' : 'pix');
  const chavePixSalva = dados.chave || '234.567.890-11';
  const tipoChaveSalva = dados.tipo_chave || 'CPF';
  const titularSalvo = dados.titular || user.nome_completo || 'Mariana Silva';
  const bancoSalvo = dados.banco || 'Banco Inter (077)';
  const agenciaSalva = dados.agencia || '0001';
  const contaSalva = dados.conta || '1234567-8';

  return `
    <!-- Card Informativo -->
    <div style="background: linear-gradient(135deg, rgba(13,148,136,0.1), rgba(16,185,129,0.1)); border: 1px solid rgba(13,148,136,0.25); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
      <div style="display: flex; gap: 12px; align-items: center;">
        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-teal); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        <div>
          <h4 class="font-bold text-sm text-primary" style="margin-bottom: 2px;">Recebimento de Comissões e Repasses</h4>
          <p class="text-xs text-muted" style="margin: 0;">Escolha entre <strong>Chave PIX</strong> ou <strong>Conta Corrente</strong> para receber seus ganhos.</p>
        </div>
      </div>
    </div>

    <!-- Toggle de Abas PIX vs Conta Corrente -->
    <div style="display: flex; background: var(--bg-subtle); padding: 4px; border-radius: var(--radius-sm); margin-bottom: 18px; border: 1px solid var(--border-light);">
      <button class="btn btn-sm" style="flex: 1; border-radius: var(--radius-xs); ${currentTab === 'pix' ? 'background: var(--primary-teal); color: white; font-weight: 700; box-shadow: var(--shadow-sm);' : 'background: transparent; color: var(--text-secondary);'}" onclick="window.setFreelancerPagamentoTab('pix')">
        ⚡ Chave PIX
      </button>
      <button class="btn btn-sm" style="flex: 1; border-radius: var(--radius-xs); ${currentTab === 'conta' ? 'background: var(--primary-teal); color: white; font-weight: 700; box-shadow: var(--shadow-sm);' : 'background: transparent; color: var(--text-secondary);'}" onclick="window.setFreelancerPagamentoTab('conta')">
        🏦 Conta Corrente
      </button>
    </div>

    ${currentTab === 'pix' ? `
      <!-- Formulário Chave PIX -->
      <div class="surface-card animate-fade-in" style="padding: 18px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 class="font-extrabold text-sm text-primary">Cadastrar Chave PIX</h3>
          <span class="badge badge-emerald">Recebimento Instantâneo</span>
        </div>

        <form id="form-pix-freelancer" onsubmit="event.preventDefault(); window.salvarPixFreelancerAction();">
          <div class="form-group">
            <label class="form-label">Tipo de Chave PIX</label>
            <select id="input-pix-tipo" class="form-input" style="width: 100%; padding: 10px; border-radius: var(--radius-xs); border: 1px solid var(--border-light); background: var(--bg-surface);" onchange="window.handlePixTipoChange(this.value)">
              <option value="CPF" ${tipoChaveSalva === 'CPF' ? 'selected' : ''}>CPF</option>
              <option value="Celular" ${tipoChaveSalva === 'Celular' ? 'selected' : ''}>Celular / Telefone</option>
              <option value="E-mail" ${tipoChaveSalva === 'E-mail' ? 'selected' : ''}>E-mail</option>
              <option value="Chave Aleatória" ${tipoChaveSalva === 'Chave Aleatória' ? 'selected' : ''}>Chave Aleatória (EVP)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" id="label-pix-chave">Chave PIX (${tipoChaveSalva})</label>
            <input type="text" id="input-pix-chave" value="${chavePixSalva}" placeholder="Digite sua chave PIX..." required />
          </div>

          <div class="form-group" style="margin-bottom: 18px;">
            <label class="form-label">Nome do Titular da Conta PIX</label>
            <input type="text" id="input-pix-titular" value="${titularSalvo}" placeholder="Nome Completo do Titular" required />
          </div>

          <button type="submit" class="btn btn-emerald">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Salvar Chave PIX para Recebimento
          </button>
        </form>
      </div>
    ` : `
      <!-- Formulário Conta Corrente -->
      <div class="surface-card animate-fade-in" style="padding: 18px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 class="font-extrabold text-sm text-primary">Conta Corrente Bancária</h3>
          <span class="badge badge-teal">Depósito TED/DOC</span>
        </div>

        <form id="form-conta-freelancer" onsubmit="event.preventDefault(); window.salvarContaFreelancerAction();">
          <div class="form-group">
            <label class="form-label">Instituição Financeira (Banco)</label>
            <select id="input-conta-banco" class="form-input" style="width: 100%; padding: 10px; border-radius: var(--radius-xs); border: 1px solid var(--border-light); background: var(--bg-surface);">
              <option value="Banco Inter (077)" ${bancoSalvo.includes('Inter') ? 'selected' : ''}>077 - Banco Inter</option>
              <option value="Nubank (260)" ${bancoSalvo.includes('Nubank') ? 'selected' : ''}>260 - Nu Pagamentos (Nubank)</option>
              <option value="Banco Itaú (341)" ${bancoSalvo.includes('Itaú') ? 'selected' : ''}>341 - Banco Itaú Unibanco</option>
              <option value="Banco Bradesco (237)" ${bancoSalvo.includes('Bradesco') ? 'selected' : ''}>237 - Banco Bradesco</option>
              <option value="Banco do Brasil (001)" ${bancoSalvo.includes('Brasil') ? 'selected' : ''}>001 - Banco do Brasil</option>
              <option value="Banco Santander (033)" ${bancoSalvo.includes('Santander') ? 'selected' : ''}>033 - Banco Santander</option>
              <option value="Caixa Econômica (104)" ${bancoSalvo.includes('Caixa') ? 'selected' : ''}>104 - Caixa Econômica Federal</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label">Agência (sem dígito)</label>
              <input type="text" id="input-conta-agencia" value="${agenciaSalva}" placeholder="Ex: 0001" required />
            </div>
            <div class="form-group">
              <label class="form-label">Conta Corrente (com dígito)</label>
              <input type="text" id="input-conta-numero" value="${contaSalva}" placeholder="Ex: 1234567-8" required />
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 18px;">
            <label class="form-label">Titular da Conta Bancária</label>
            <input type="text" id="input-conta-titular" value="${titularSalvo}" placeholder="Nome do Titular" required />
          </div>

          <button type="submit" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Salvar Dados da Conta Corrente
          </button>
        </form>
      </div>
    `}
  `;
}

// =========================================================================
// 3. VISÃO DO SALÃO: OBRIGATORIAMENTE CONTA CORRENTE (SEM OPÇÃO DE PIX)
// =========================================================================
function renderPagamentoSalao(dados, user) {
  const bancoSalvo = dados.banco || 'Banco Itaú (341)';
  const agenciaSalva = dados.agencia || '0124';
  const contaSalva = dados.conta || '48291-5';
  const titularSalvo = dados.titular || user.nome_completo || 'Studio Elegance Jardins EIRELI';
  const docSalvo = dados.documento || user.cnpj || '12.345.678/0001-90';

  return `
    <!-- Banner Regulatório: Lei do Salão Parceiro -->
    <div style="background: linear-gradient(135deg, rgba(2,132,199,0.1), rgba(13,148,136,0.1)); border: 1.5px solid #0284C7; border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
      <div style="display: flex; gap: 12px; align-items: flex-start;">
        <div style="width: 36px; height: 36px; border-radius: 50%; background: #0284C7; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </div>
        <div>
          <h4 class="font-extrabold text-sm text-primary" style="margin-bottom: 4px;">Exigência Regulatória: Apenas Conta Corrente</h4>
          <p class="text-xs text-secondary" style="margin: 0; line-height: 1.45;">
            Conforme a <strong>Lei do Salão Parceiro (Lei nº 13.352/2016)</strong> e normas do Banco Central para intermediação comercial, os repasses de receitas e taxas de locação de espaço são efetuados <strong>obrigatoriamente via Conta Corrente bancária vinculada ao CNPJ do salão credenciado</strong>. <span style="color: #E11D48; font-weight: 700;">Recebimentos via PIX são desabilitados para pessoas jurídicas parceiras.</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Formulário Conta Corrente Salão -->
    <div class="surface-card" style="padding: 18px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 class="font-extrabold text-sm text-primary">Conta Corrente do Estabelecimento</h3>
        <span class="badge badge-teal">Homologação PJ</span>
      </div>

      <form id="form-conta-salao" onsubmit="event.preventDefault(); window.salvarContaSalaoAction();">
        <div class="form-group">
          <label class="form-label">Instituição Financeira (Banco do Salão)</label>
          <select id="input-salao-banco" class="form-input" style="width: 100%; padding: 10px; border-radius: var(--radius-xs); border: 1px solid var(--border-light); background: var(--bg-surface);">
            <option value="Banco Itaú (341)" ${bancoSalvo.includes('Itaú') ? 'selected' : ''}>341 - Banco Itaú Unibanco S.A.</option>
            <option value="Banco Bradesco (237)" ${bancoSalvo.includes('Bradesco') ? 'selected' : ''}>237 - Banco Bradesco S.A.</option>
            <option value="Banco Santander (033)" ${bancoSalvo.includes('Santander') ? 'selected' : ''}>033 - Banco Santander Brasil</option>
            <option value="Banco do Brasil (001)" ${bancoSalvo.includes('Brasil') ? 'selected' : ''}>001 - Banco do Brasil S.A.</option>
            <option value="Banco Inter (077)" ${bancoSalvo.includes('Inter') ? 'selected' : ''}>077 - Banco Inter S.A.</option>
            <option value="Caixa Econômica (104)" ${bancoSalvo.includes('Caixa') ? 'selected' : ''}>104 - Caixa Econômica Federal</option>
          </select>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Agência Bancária</label>
            <input type="text" id="input-salao-agencia" value="${agenciaSalva}" placeholder="Ex: 0124" required />
          </div>
          <div class="form-group">
            <label class="form-label">Conta Corrente (com dígito)</label>
            <input type="text" id="input-salao-conta" value="${contaSalva}" placeholder="Ex: 48291-5" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Razão Social do Salão Parceiro</label>
          <input type="text" id="input-salao-titular" value="${titularSalvo}" placeholder="Razão Social completa" required />
        </div>

        <div class="form-group" style="margin-bottom: 18px;">
          <label class="form-label">CNPJ da Empresa Titular</label>
          <input type="text" id="input-salao-cnpj" value="${docSalvo}" placeholder="00.000.000/0000-00" oninput="window.maskCNPJ(this)" required />
        </div>

        <button type="submit" class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Salvar Conta Corrente Homologada
        </button>
      </form>
    </div>
  `;
}

// Fallback para admin
function renderPagamentoAdmin() {
  return `
    <div class="surface-card text-center" style="padding: 24px;">
      <h3 class="font-bold text-base text-primary">Gestão de Gateway da Plataforma</h3>
      <p class="text-xs text-muted" style="margin-top: 6px;">Como Administrador, as taxas de plataforma são liquidadas na conta de custódia GlamGo Escrow.</p>
    </div>
  `;
}

// =========================================================================
// HANDLERS E MÁSCARAS
// =========================================================================
window.setFreelancerPagamentoTab = function(tab) {
  window._pagamentoFreeTab = tab;
  window.router.renderCurrentRoute();
};

window.handlePixTipoChange = function(tipo) {
  const label = document.getElementById('label-pix-chave');
  const input = document.getElementById('input-pix-chave');
  if (label) label.textContent = `Chave PIX (${tipo})`;
  if (input) {
    if (tipo === 'CPF') input.placeholder = '000.000.000-00';
    else if (tipo === 'Celular') input.placeholder = '(11) 98765-4321';
    else if (tipo === 'E-mail') input.placeholder = 'seu.email@exemplo.com';
    else input.placeholder = 'Chave aleatória UUID';
  }
};

window.maskCartao = function(el) {
  let v = el.value.replace(/\D/g, '').substring(0, 16);
  el.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
  const preview = document.getElementById('card-preview-number');
  if (preview) {
    preview.textContent = el.value || '•••• •••• •••• 4242';
  }
};

window.maskValidade = function(el) {
  let v = el.value.replace(/\D/g, '').substring(0, 4);
  if (v.length > 2) {
    v = v.substring(0, 2) + '/' + v.substring(2);
  }
  el.value = v;
  const preview = document.getElementById('card-preview-exp');
  if (preview) {
    preview.textContent = el.value || '08/29';
  }
};

window.salvarCartaoClienteAction = async function() {
  const num = document.getElementById('input-cartao-numero').value;
  const nome = document.getElementById('input-cartao-nome').value;
  const validade = document.getElementById('input-cartao-validade').value;
  const bandeira = document.getElementById('input-cartao-bandeira').value;

  if (!num || !nome || !validade) {
    UI.showToast('Preencha todos os campos do cartão!', 'error');
    return;
  }

  const numMascarado = '•••• •••• •••• ' + num.replace(/\s/g, '').slice(-4);

  await window.appState.salvarFormaPagamento('cliente', {
    tipo: 'cartao_credito',
    numero_mascarado: numMascarado,
    titular: nome.toUpperCase(),
    validade: validade,
    bandeira: bandeira
  });

  UI.showToast('Cartão de crédito salvo com sucesso!', 'success');
  window.router.renderCurrentRoute();
};

window.salvarPixFreelancerAction = async function() {
  const tipo = document.getElementById('input-pix-tipo').value;
  const chave = document.getElementById('input-pix-chave').value;
  const titular = document.getElementById('input-pix-titular').value;

  if (!chave || !titular) {
    UI.showToast('Preencha a chave e o titular do PIX!', 'error');
    return;
  }

  await window.appState.salvarFormaPagamento('freelancer', {
    tipo: 'pix',
    tipo_chave: tipo,
    chave: chave,
    titular: titular
  });

  UI.showToast('Chave PIX cadastrada para recebimento!', 'success');
  window.router.renderCurrentRoute();
};

window.salvarContaFreelancerAction = async function() {
  const banco = document.getElementById('input-conta-banco').value;
  const agencia = document.getElementById('input-conta-agencia').value;
  const conta = document.getElementById('input-conta-numero').value;
  const titular = document.getElementById('input-conta-titular').value;

  if (!agencia || !conta || !titular) {
    UI.showToast('Preencha os dados da conta bancária!', 'error');
    return;
  }

  await window.appState.salvarFormaPagamento('freelancer', {
    tipo: 'conta_corrente',
    banco: banco,
    agencia: agencia,
    conta: conta,
    titular: titular
  });

  UI.showToast('Conta corrente cadastrada com sucesso!', 'success');
  window.router.renderCurrentRoute();
};

window.salvarContaSalaoAction = async function() {
  const banco = document.getElementById('input-salao-banco').value;
  const agencia = document.getElementById('input-salao-agencia').value;
  const conta = document.getElementById('input-salao-conta').value;
  const titular = document.getElementById('input-salao-titular').value;
  const cnpj = document.getElementById('input-salao-cnpj').value;

  if (!agencia || !conta || !titular || !cnpj) {
    UI.showToast('Preencha todos os dados da conta corrente!', 'error');
    return;
  }

  await window.appState.salvarFormaPagamento('salao', {
    tipo: 'conta_corrente',
    banco: banco,
    agencia: agencia,
    conta: conta,
    titular: titular,
    documento: cnpj
  });

  UI.showToast('Conta bancária homologada com sucesso!', 'success');
  window.router.renderCurrentRoute();
};

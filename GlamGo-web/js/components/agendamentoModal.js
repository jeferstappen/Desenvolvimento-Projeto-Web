/**
 * AGhataCris - Modal de Agendamento Flutuante e Criação de Serviços
 * Requisitos:
 * 1. Criação de serviços ofertados com Floating Button no Freelancer e Salão, com senha obrigatória
 * 2. Tela flutuante de agendamento ao clicar no profissional ou salão
 * 3. Lista de serviços ofertados com opção de adicionar mais de um serviço
 * 4. Calendário interativo com regra de máx 1 mês (ex: 17/10 a 17/11, 18/11 bloqueado)
 * 5. Seletor de horários com detecção de conflito e bloqueio da janela de duração ocupada
 */

// Estado transitório do agendamento
window._agendamentoState = {
  profissional: null,
  servicosSelecionados: [], // IDs dos serviços selecionados
  dataSelecionada: '2026-10-19', // Hoje
  horarioSelecionado: null,
  mesVisualizado: 9, // Outubro (0-indexed: 9 = Outubro)
  anoVisualizado: 2026
};

// =========================================================================
// 1. GERENCIAR E CRIAR SERVIÇOS OFERTADOS (FAB Freelancer & Salão)
// =========================================================================
window.UI.openGerenciarServicosModal = function() {
  const state = window.appState.getState();
  const role = state.currentRole;
  const user = state.currentUser || (state.rolesData && state.rolesData[role]) || {};
  const userId = user.id_usuario || (role === 'freelancer' ? 2 : 3);

  const meusServicos = window.appState.getServicosByUsuario(userId);

  const html = `
    <div style="max-height: 80vh; overflow-y: auto; padding-right: 2px;">
      <!-- Header do Modal -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
        <div>
          <div class="badge badge-teal" style="margin-bottom: 4px;">
            ${role === 'salao' ? '🏢 Salão Parceiro' : '💇‍♀️ Freelancer Autônoma'}
          </div>
          <h3 class="modal-title" style="margin: 0;">Serviços Ofertados</h3>
          <p class="text-xs text-muted" style="margin-top: 2px;">Gerencie os procedimentos disponíveis para agendamento pelos clientes.</p>
        </div>
        <button class="btn-ghost" style="padding: 4px;" onclick="UI.closeModal()">✕</button>
      </div>

      <!-- Lista de Serviços Cadastrados -->
      <div style="margin-bottom: 18px;">
        <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">
          Seus Serviços Ativos (${meusServicos.length})
        </div>

        <div id="lista-meus-servicos" style="display: flex; flex-direction: column; gap: 8px;">
          ${meusServicos.map(s => `
            <div style="background: var(--bg-surface); border: 1px solid var(--border-light); padding: 12px; border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-xs);">
              <div style="flex: 1; min-width: 0; padding-right: 8px;">
                <strong style="font-size: 0.9rem; color: var(--text-primary); display: block;">${s.nome}</strong>
                ${s.descricao ? `<div class="text-xs text-secondary" style="margin: 2px 0;">${s.descricao}</div>` : ''}
                <div style="display: flex; gap: 8px; align-items: center; font-size: 0.75rem; margin-top: 4px;">
                  <span class="badge badge-emerald" style="font-size: 0.7rem; font-weight: 700;">R$ ${parseFloat(s.preco).toFixed(2)}</span>
                  <span class="badge badge-teal" style="font-size: 0.7rem;">⏱️ ${s.duracao_minutos} min</span>
                </div>
              </div>
              <button class="btn-ghost" style="color: #EF4444; padding: 6px;" title="Remover serviço" onclick="window.confirmarRemocaoServico(${s.id_servico}, ${userId})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          `).join('')}

          ${meusServicos.length === 0 ? `
            <div class="text-center text-xs text-muted" style="padding: 16px; background: var(--bg-subtle); border-radius: var(--radius-sm);">
              Nenhum serviço cadastrado ainda. Preencha o formulário abaixo para criar seu primeiro serviço.
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Formulário de Novo Serviço -->
      <div class="surface-card" style="padding: 16px; border: 1.5px solid var(--primary-teal-soft); margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
          <div style="width: 24px; height: 24px; background: var(--primary-teal); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem;">+</div>
          <strong class="text-sm font-bold text-primary">Cadastrar Novo Procedimento</strong>
        </div>

        <form id="form-novo-servico" onsubmit="event.preventDefault(); window.iniciarSalvarServicoComSenha();">
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="form-label">Nome do Serviço / Procedimento</label>
            <input type="text" id="novo-servico-nome" placeholder="Ex: Chapinha & Escova Modeladora" required />
          </div>

          <div class="form-group" style="margin-bottom: 10px;">
            <label class="form-label">Descrição Detalhada</label>
            <textarea id="novo-servico-desc" rows="2" placeholder="Descreva os materiais utilizados e detalhes do procedimento..." style="width: 100%; padding: 8px 10px; border-radius: var(--radius-xs); border: 1px solid var(--border-light); font-size: 0.85rem; font-family: inherit; resize: vertical;"></textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
            <div class="form-group" style="margin: 0;">
              <label class="form-label">Preço (R$)</label>
              <input type="number" step="0.50" id="novo-servico-preco" placeholder="Ex: 80.00" required />
            </div>

            <div class="form-group" style="margin: 0;">
              <label class="form-label">Duração Estimada</label>
              <select id="novo-servico-duracao" class="form-input" style="width: 100%; padding: 10px; border-radius: var(--radius-xs); border: 1px solid var(--border-light); background: var(--bg-surface); font-size: 0.85rem;">
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60" selected>1 hora (60 min)</option>
                <option value="90">1h 30min (90 min)</option>
                <option value="120">2 horas (120 min)</option>
                <option value="150">2h 30min (150 min)</option>
                <option value="180">3 horas (180 min)</option>
              </select>
            </div>
          </div>

          <div style="background: rgba(13,148,136,0.08); padding: 10px; border-radius: var(--radius-xs); margin-bottom: 14px; font-size: 0.75rem; color: var(--text-secondary); display: flex; gap: 8px; align-items: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-teal)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>Por segurança, sua senha cadastrada será solicitada no próximo passo para autorizar a publicação do serviço.</span>
          </div>

          <button type="submit" class="btn btn-emerald">
            🔒 Salvar Serviço Ofertado
          </button>
        </form>
      </div>

      <button type="button" class="btn btn-ghost" onclick="UI.closeModal()">
        Fechar
      </button>
    </div>
  `;

  UI.openModal(html);
};

// Confirmação de senha obrigatória para salvar serviço
window.iniciarSalvarServicoComSenha = function() {
  const nome = document.getElementById('novo-servico-nome').value.trim();
  const desc = document.getElementById('novo-servico-desc').value.trim();
  const preco = document.getElementById('novo-servico-preco').value;
  const duracao = document.getElementById('novo-servico-duracao').value;

  if (!nome || !preco) {
    UI.showToast('Preencha o nome e o preço do serviço!', 'error');
    return;
  }

  // Abrir modal flutuante de validação de senha
  UI.openModal(`
    <div style="text-align: center; padding: 10px 4px;">
      <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(13,148,136,0.15); color: var(--primary-teal); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      </div>

      <h3 class="modal-title" style="margin-bottom: 4px;">Confirmação de Segurança</h3>
      <p class="text-xs text-muted" style="margin-bottom: 16px;">
        Para salvar as alterações no catálogo do serviço <strong>"${nome}"</strong> (R$ ${parseFloat(preco).toFixed(2)}), confirme sua senha cadastrada:
      </p>

      <form onsubmit="event.preventDefault(); window.executarSalvarServicoFinal('${encodeURIComponent(nome)}', '${encodeURIComponent(desc)}', ${preco}, ${duracao});">
        <div class="form-group" style="text-align: left; margin-bottom: 14px;">
          <label class="form-label">Digite sua senha de acesso</label>
          <div style="position: relative;">
            <input type="password" id="confirm-pwd-servico" placeholder="••••••••" required autofocus style="letter-spacing: 2px; padding-right: 44px; width: 100%;" />
            <button type="button" class="password-toggle-btn" onclick="window.togglePasswordVisibility('confirm-pwd-servico', this)" title="Mostrar/ocultar senha">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>
          <div id="pwd-servico-error" style="color: #EF4444; font-size: 0.75rem; margin-top: 4px; display: none; font-weight: 600;"></div>
        </div>

        <button type="submit" class="btn btn-primary" id="btn-submit-pwd-servico" style="margin-bottom: 8px;">
          ✓ Confirmar e Publicar Serviço
        </button>
        <button type="button" class="btn btn-ghost" onclick="UI.openGerenciarServicosModal()">
          Voltar
        </button>
      </form>
    </div>
  `);
};

window.executarSalvarServicoFinal = async function(nomeEncoded, descEncoded, preco, duracao) {
  const pwdInput = document.getElementById('confirm-pwd-servico');
  const errorEl = document.getElementById('pwd-servico-error');
  const btn = document.getElementById('btn-submit-pwd-servico');
  const senha = pwdInput ? pwdInput.value : '';

  if (!senha) {
    if (errorEl) {
      errorEl.textContent = 'Senha é obrigatória para confirmação.';
      errorEl.style.display = 'block';
    }
    return;
  }

  btn.disabled = true;
  btn.innerHTML = 'Verificando senha...';

  const nome = decodeURIComponent(nomeEncoded);
  const descricao = decodeURIComponent(descEncoded);
  const state = window.appState.getState();
  const role = state.currentRole;
  const user = state.currentUser || (state.rolesData && state.rolesData[role]) || {};
  const userId = user.id_usuario || (role === 'freelancer' ? 2 : 3);
  const userEmail = user.email || (role === 'freelancer' ? 'mariana.silva@beauty.com' : 'contato@studioelegance.com.br');

  try {
    // 1. Tentar verificação via API no backend
    let isValid = false;
    if (window.API) {
      try {
        const authCheck = await window.API.verifyPassword(userEmail, senha, userId);
        if (authCheck && authCheck.success) isValid = true;
      } catch (e) {
        // Se a API retornar erro de senha incorreta
        if (e.message && e.message.includes('Senha incorreta')) {
          isValid = false;
        } else {
          // Fallback local se estiver offline
          isValid = (senha === '12345678');
        }
      }
    } else {
      isValid = (senha === '12345678');
    }

    if (!isValid) {
      if (errorEl) {
        errorEl.textContent = 'Senha incorreta. Não foi possível salvar as alterações.';
        errorEl.style.display = 'block';
      }
      btn.disabled = false;
      btn.innerHTML = '✓ Confirmar e Publicar Serviço';
      return;
    }

    // 2. Salvar serviço no state e backend
    await window.appState.adicionarServico({
      id_usuario: userId,
      nome,
      descricao,
      preco,
      duracao_minutos: duracao,
      senha
    });

    UI.closeModal();
    UI.showToast(`Serviço "${nome}" cadastrado com sucesso!`, 'success');

    // Se estiver na home do salão ou freelancer, re-renderizar
    if (window.router) {
      window.router.renderCurrentRoute();
    }
  } catch (err) {
    if (errorEl) {
      errorEl.textContent = err.message || 'Erro ao salvar serviço.';
      errorEl.style.display = 'block';
    }
    btn.disabled = false;
    btn.innerHTML = '✓ Confirmar e Publicar Serviço';
  }
};

// =========================================================================
// Interface no Aplicativo para Confirmação de Exclusão de Serviço com Senha
// =========================================================================
window.confirmarRemocaoServico = function(servicoId, userId) {
  const servicos = window.appState.getServicosByUsuario(userId);
  const s = servicos.find(item => item.id_servico === servicoId || item.id_servico == servicoId);

  const nome = (s && s.nome) || 'Serviço Selecionado';
  const preco = (s && s.preco) ? parseFloat(s.preco).toFixed(2) : '0.00';
  const duracao = (s && s.duracao_minutos) || 60;
  const descricao = (s && s.descricao) || '';

  const modalHtml = `
    <div style="text-align: center; padding: 10px 4px;">
      <!-- Ícone de Alerta / Exclusão -->
      <div style="width: 52px; height: 52px; border-radius: 50%; background: #FEE2E2; color: #DC2626; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px auto;">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </div>

      <h3 class="modal-title" style="margin-bottom: 4px; color: var(--text-primary);">Excluir Serviço Ofertado</h3>
      <p class="text-xs text-muted" style="margin-bottom: 14px;">
        Deseja realmente remover este serviço do catálogo? Esta ação não pode ser desfeita.
      </p>

      <!-- Card do Serviço a ser Excluído -->
      <div style="background: var(--bg-surface); border: 1px solid var(--border-light); border-left: 4px solid #DC2626; border-radius: var(--radius-sm); padding: 12px 14px; text-align: left; margin-bottom: 16px; box-shadow: var(--shadow-xs);">
        <strong style="font-size: 0.95rem; color: var(--text-primary); display: block; margin-bottom: 3px;">${nome}</strong>
        ${descricao ? `<p class="text-xs text-secondary" style="margin: 0 0 6px 0; line-height: 1.3;">${descricao}</p>` : ''}
        <div style="display: flex; gap: 8px; align-items: center; font-size: 0.75rem;">
          <span class="badge badge-emerald" style="font-size: 0.7rem; font-weight: 700;">R$ ${preco}</span>
          <span class="badge badge-teal" style="font-size: 0.7rem;">⏱️ ${duracao} min</span>
        </div>
      </div>

      <!-- Formulário com Senha Obrigatória -->
      <form onsubmit="event.preventDefault(); window.executarExclusaoServicoFinal(${servicoId}, ${userId}, '${encodeURIComponent(nome)}');">
        <div class="form-group" style="text-align: left; margin-bottom: 16px;">
          <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary);">
            Confirme sua senha de acesso:
          </label>
          <div style="position: relative; margin-top: 4px;">
            <input 
              type="password" 
              id="confirm-pwd-delete-servico" 
              placeholder="••••••••" 
              required 
              autofocus 
              style="letter-spacing: 2px; padding-right: 44px; width: 100%;" 
            />
            <button 
              type="button" 
              class="password-toggle-btn" 
              onclick="window.togglePasswordVisibility('confirm-pwd-delete-servico', this)" 
              title="Mostrar/ocultar senha"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>
          <div id="pwd-delete-servico-error" style="color: #EF4444; font-size: 0.75rem; margin-top: 6px; display: none; font-weight: 600;"></div>
        </div>

        <button 
          type="submit" 
          id="btn-submit-delete-servico" 
          class="btn" 
          style="background: #DC2626; color: #FFFFFF; width: 100%; padding: 12px; font-weight: 800; border-radius: var(--radius-xs); border: none; cursor: pointer; margin-bottom: 8px; transition: background 0.15s ease;"
          onmouseover="this.style.background='#B91C1C'"
          onmouseout="this.style.background='#DC2626'"
        >
          🗑️ Confirmar Exclusão
        </button>

        <button 
          type="button" 
          class="btn btn-ghost" 
          style="width: 100%;" 
          onclick="UI.openGerenciarServicosModal()"
        >
          Cancelar e Voltar
        </button>
      </form>
    </div>
  `;

  UI.openModal(modalHtml);
};

window.executarExclusaoServicoFinal = async function(servicoId, userId, nomeEncoded) {
  const pwdInput = document.getElementById('confirm-pwd-delete-servico');
  const errorEl = document.getElementById('pwd-delete-servico-error');
  const btn = document.getElementById('btn-submit-delete-servico');
  const senha = pwdInput ? pwdInput.value : '';

  if (!senha) {
    if (errorEl) {
      errorEl.textContent = 'Senha é obrigatória para autorizar a exclusão.';
      errorEl.style.display = 'block';
    }
    return;
  }

  btn.disabled = true;
  btn.innerHTML = 'Verificando senha...';

  const nome = decodeURIComponent(nomeEncoded);
  const state = window.appState.getState();
  const role = state.currentRole;
  const user = state.currentUser || (state.rolesData && state.rolesData[role]) || {};
  const userEmail = user.email || (role === 'freelancer' ? 'mariana.silva@beauty.com' : 'contato@studioelegance.com.br');

  try {
    // 1. Validar senha via API / Auth
    let isValid = false;
    if (window.API) {
      try {
        const authCheck = await window.API.verifyPassword(userEmail, senha, userId);
        if (authCheck && authCheck.success) isValid = true;
      } catch (e) {
        if (e.message && e.message.includes('Senha incorreta')) {
          isValid = false;
        } else {
          // Fallback se offline
          isValid = (senha === '12345678');
        }
      }
    } else {
      isValid = (senha === '12345678');
    }

    if (!isValid) {
      if (errorEl) {
        errorEl.textContent = 'Senha incorreta. Não foi possível autorizar a exclusão.';
        errorEl.style.display = 'block';
      }
      btn.disabled = false;
      btn.innerHTML = '🗑️ Confirmar Exclusão';
      return;
    }

    // 2. Remover o serviço no state e backend
    await window.appState.removerServico(servicoId, userId);

    // 3. Exibir toast e reabrir o modal com a lista atualizada
    UI.showToast(`Serviço "${nome}" excluído com sucesso!`, 'success');
    UI.openGerenciarServicosModal();

    // 4. Se a rota atual for salão ou freelancer, re-renderizar para manter consistência
    if (window.router) {
      window.router.renderCurrentRoute();
    }
  } catch (err) {
    if (errorEl) {
      errorEl.textContent = err.message || 'Erro ao excluir o serviço.';
      errorEl.style.display = 'block';
    }
    btn.disabled = false;
    btn.innerHTML = '🗑️ Confirmar Exclusão';
  }
};

// =========================================================================
// 2. TELA FLUTUANTE DE AGENDAMENTO (Ao clicar no Profissional ou Salão)
// =========================================================================
window.UI.openAgendamentoModal = function(idAlvo, tipoAlvo = 'freelancer') {
  const state = window.appState.getState();
  let entity = null;
  let isSalao = (tipoAlvo === 'salao');

  if (isSalao) {
    const saloes = window.getSaloesList ? window.getSaloesList() : [];
    entity = saloes.find(s => s.id_usuario === idAlvo) || saloes[0];
  } else {
    entity = state.profissionais.find(p => p.id_usuario === idAlvo) || state.profissionais[0];
  }

  if (!entity) return;

  // Buscar serviços ofertados deste profissional / salão
  const servicos = window.appState.getServicosByUsuario(entity.id_usuario);
  const primeiroServicoId = servicos.length > 0 ? servicos[0].id_servico : null;

  // Inicializar estado do modal
  window._agendamentoState = {
    entity,
    isSalao,
    servicosDisponiveis: servicos,
    servicosSelecionados: primeiroServicoId ? [primeiroServicoId] : [],
    dataSelecionada: '2026-10-19', // Hoje
    horarioSelecionado: null,
    mesVisualizado: 9, // Outubro (0-indexed)
    anoVisualizado: 2026
  };

  renderAgendamentoModalContent();
};

// Aliases para os triggers existentes no clienteHomeView.js
window.UI.openChamarModal = function(proId) {
  window.UI.openAgendamentoModal(proId, 'freelancer');
};

window.UI.openSalaoModal = function(salaoId) {
  window.UI.openAgendamentoModal(salaoId, 'salao');
};

function renderAgendamentoModalContent() {
  const S = window._agendamentoState;
  const entity = S.entity;
  const isSalao = S.isSalao;

  // Calcular serviços selecionados, soma de preços e duração total
  const selecionados = S.servicosDisponiveis.filter(s => S.servicosSelecionados.includes(s.id_servico));
  const valorTotal = selecionados.reduce((sum, s) => sum + parseFloat(s.preco), 0);
  const duracaoTotalMinutos = selecionados.reduce((sum, s) => sum + parseInt(s.duracao_minutos || 60, 10), 0);

  // Formatação de duração (ex: 1h 45min)
  const horas = Math.floor(duracaoTotalMinutos / 60);
  const mins = duracaoTotalMinutos % 60;
  const duracaoFormatada = horas > 0
    ? (mins > 0 ? `${horas}h ${mins}min` : `${horas} hora${horas > 1 ? 's' : ''}`)
    : `${mins} min`;

  // Calcular slots de horário e verificar conflitos
  const slotsCalculados = calcularSlotsComConflito(entity.id_usuario, S.dataSelecionada, duracaoTotalMinutos);

  const html = `
    <div style="max-height: 85vh; overflow-y: auto; padding-right: 2px;">
      <!-- Handle do Modal -->
      <div class="modal-handle"></div>

      <!-- Top Header da Profissional / Salão -->
      <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-light); padding-bottom: 14px;">
        <img src="${entity.avatar}" alt="${entity.nome_completo}" style="width: 58px; height: 58px; border-radius: ${isSalao ? 'var(--radius-sm)' : '50%'}; object-fit: cover; border: 2.5px solid var(--primary-teal);" />
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <h3 class="modal-title" style="margin: 0; font-size: 1.1rem;">${entity.nome_completo}</h3>
            <span class="badge badge-emerald" style="font-size: 0.75rem;">★ ${parseFloat(entity.avaliacao || 5).toFixed(1)}</span>
          </div>
          <p class="text-xs text-secondary" style="margin: 2px 0;">${entity.especialidade || (isSalao ? 'Salão Parceiro' : 'Estética & Beleza')}</p>
          <div style="display: flex; gap: 8px; font-size: 0.75rem; color: var(--text-muted); align-items: center;">
            <span>📍 ${entity.distanciaKm || 1.2} km</span>
            <span>•</span>
            <span class="text-teal font-bold">${isSalao ? '🏢 Salão Credenciado' : '💇 Atendimento sob Demanda'}</span>
          </div>
        </div>
      </div>

      <!-- PASSO 1: Selecionar Serviços Ofertados -->
      <div style="margin-bottom: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div>
            <strong class="text-sm font-bold text-primary">1. Serviços Ofertados</strong>
            <p class="text-xs text-muted" style="margin: 0;">Selecione um ou mais procedimentos:</p>
          </div>
          <span class="badge badge-teal">${selecionados.length} selecionado${selecionados.length > 1 ? 's' : ''}</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${S.servicosDisponiveis.map(s => {
            const isSelected = S.servicosSelecionados.includes(s.id_servico);
            return `
              <div class="service-select-card ${isSelected ? 'active' : ''}" onclick="window.toggleServicoAgendamento(${s.id_servico})">
                <div class="service-check-circle">
                  ${isSelected ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>` : ''}
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <strong style="font-size: 0.88rem; color: var(--text-primary);">${s.nome}</strong>
                    <span class="font-extrabold text-teal" style="font-size: 0.88rem;">R$ ${parseFloat(s.preco).toFixed(2)}</span>
                  </div>
                  ${s.descricao ? `<p class="text-xs text-secondary" style="margin: 2px 0 4px 0; line-height: 1.3;">${s.descricao}</p>` : ''}
                  <span class="badge badge-teal" style="font-size: 0.65rem; padding: 2px 6px;">⏱️ Duração: ${s.duracao_minutos} min</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Opção de Adicionar Mais um Serviço -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding: 8px 12px; background: var(--bg-subtle); border-radius: var(--radius-sm); border: 1px dashed var(--border-subtle);">
          <span class="text-xs text-secondary">Deseja combinar procedimentos no mesmo atendimento?</span>
          <button class="btn btn-sm btn-outline-teal" style="font-size: 0.75rem;" onclick="UI.showToast('Você pode marcar múltiplos serviços na lista acima!', 'info')">
            + Adicionar mais um serviço
          </button>
        </div>
      </div>

      <!-- Resumo Parcial de Tempo & Valor -->
      <div style="display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, rgba(13,148,136,0.08), rgba(16,185,129,0.08)); border: 1px solid var(--border-light); padding: 10px 14px; border-radius: var(--radius-sm); margin-bottom: 20px;">
        <div>
          <span class="text-xs text-muted block" style="font-size: 0.7rem; text-transform: uppercase;">Duração Total Estimada</span>
          <strong class="text-teal font-extrabold" style="font-size: 0.95rem;">⏱️ ${duracaoFormatada}</strong>
        </div>
        <div style="text-align: right;">
          <span class="text-xs text-muted block" style="font-size: 0.7rem; text-transform: uppercase;">Valor dos Serviços</span>
          <strong class="text-emerald font-extrabold" style="font-size: 1.15rem;">R$ ${valorTotal.toFixed(2)}</strong>
        </div>
      </div>

      <!-- PASSO 2: Seleção de Data com Calendário (Regra estrita: máx 1 mês) -->
      <div style="margin-bottom: 18px;">
        <div style="margin-bottom: 8px;">
          <strong class="text-sm font-bold text-primary">2. Selecionar Data do Atendimento</strong>
          <p class="text-xs text-muted" style="margin: 0;">
            Selecione uma data disponível (<strong>máximo de 30 dias à frente</strong>):
          </p>
        </div>

        ${renderMiniCalendarHtml(S.anoVisualizado, S.mesVisualizado, S.dataSelecionada)}

        <!-- Feedback de Validação da Regra de 1 Mês -->
        <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--text-muted); margin-top: 6px;">
          <span style="color: var(--primary-teal);">●</span>
          <span>Hoje é <strong>19/10/2026</strong>. Agendamentos permitidos até <strong>19/11/2026</strong>. Datas anteriores e posteriores estão bloqueadas.</span>
        </div>
      </div>

      <!-- PASSO 3: Seleção de Horário & Detecção de Conflitos -->
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div>
            <strong class="text-sm font-bold text-primary">3. Horário Desejado</strong>
            <p class="text-xs text-muted" style="margin: 0;">Horários livres considerando <strong>${duracaoFormatada}</strong> de atendimento:</p>
          </div>
          <span class="badge badge-emerald" style="font-size: 0.7rem;">${S.horarioSelecionado ? `Selecionado: ${S.horarioSelecionado}` : 'Selecione'}</span>
        </div>

        <!-- Grade de Horários -->
        <div class="slots-grid">
          ${slotsCalculados.map(slot => {
            const isSelected = S.horarioSelecionado === slot.horario;
            if (slot.ocupado) {
              return `
                <div class="slot-item slot-disabled" title="${slot.motivo}">
                  <span>${slot.horario}</span>
                  <span class="slot-badge-ocupado">${slot.motivoCurto || 'Ocupado'}</span>
                </div>
              `;
            } else {
              return `
                <div class="slot-item ${isSelected ? 'slot-selected' : ''}" onclick="window.selectHorarioAgendamento('${slot.horario}')">
                  <span>${slot.horario}</span>
                  <span style="font-size: 0.65rem; color: ${isSelected ? 'white' : 'var(--accent-emerald)'}; font-weight: 600;">Livre</span>
                </div>
              `;
            }
          }).join('')}
        </div>

        <div class="text-xs text-muted" style="display: flex; align-items: center; gap: 6px;">
          <span style="display: inline-block; width: 10px; height: 10px; background: #EF4444; border-radius: 2px;"></span>
          <span>Horários marcados como 'Ocupado' entram em conflito com agendamentos existentes ou com a duração do serviço selecionado.</span>
        </div>
      </div>

      <!-- Resumo Final & Botão Confirmar -->
      <div style="background: var(--bg-surface); border: 2px solid var(--primary-teal); border-radius: var(--radius-md); padding: 14px; margin-bottom: 16px; box-shadow: var(--shadow-sm);">
        <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--primary-teal); margin-bottom: 8px;">
          Resumo do seu Agendamento
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px; font-size: 0.8rem;">
          <div class="flex justify-between">
            <span class="text-secondary">Profissional/Salão:</span>
            <strong>${entity.nome_completo}</strong>
          </div>
          <div class="flex justify-between">
            <span class="text-secondary">Procedimento(s):</span>
            <strong style="text-align: right; max-width: 60%;">${selecionados.map(s => s.nome).join(' + ') || 'Nenhum selecionado'}</strong>
          </div>
          <div class="flex justify-between">
            <span class="text-secondary">Data do Atendimento:</span>
            <strong>${formatarDataAmigavel(S.dataSelecionada)}</strong>
          </div>
          <div class="flex justify-between">
            <span class="text-secondary">Horário Selecionado:</span>
            <strong class="text-teal">${S.horarioSelecionado ? `${S.horarioSelecionado} (${duracaoFormatada})` : 'Ainda não selecionado'}</strong>
          </div>
          <div class="flex justify-between" style="border-top: 1px dashed var(--border-light); margin-top: 6px; padding-top: 6px; font-size: 1rem;">
            <span class="font-bold">Total a Pagar:</span>
            <span class="font-extrabold text-emerald">R$ ${valorTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- Ações -->
      <button class="btn btn-primary" style="margin-bottom: 8px;" onclick="window.confirmarAgendamentoFinal()" ${!S.horarioSelecionado || selecionados.length === 0 ? 'disabled style="opacity: 0.6; cursor: not-allowed;"' : ''}>
        🚀 Confirmar Agendamento
      </button>
      <button class="btn btn-ghost" onclick="UI.closeModal()">
        Cancelar
      </button>
    </div>
  `;

  UI.openModal(html);
}

// =========================================================================
// 3. CALENDÁRIO COM LIMITE ESTRITO DE 1 MÊS (19/10 a 19/11) & MARCADORES REAIS
// =========================================================================
function renderMiniCalendarHtml(ano, mes, dataSelecionadaStr) {
  // Nomes dos meses em português
  const mesesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Regra de data:
  // Data base atual do sistema: 19 de Outubro de 2026 (Segunda-feira)
  const hojeAno = 2026;
  const hojeMes = 9; // Outubro (0-indexed)
  const hojeDia = 19;

  // Limite estrito de 1 mês à frente: 19 de Novembro de 2026
  const limiteAno = 2026;
  const limiteMes = 10; // Novembro (0-indexed)
  const limiteDia = 19;

  // Mapear agendamentos reais existentes no sistema para esta entidade (freelancer ou salão)
  const state = window.appState.getState();
  const todosAtendimentos = state.atendimentos || [];
  const diasComAgendamentos = new Set();
  const contagemPorDia = {};
  const S = window._agendamentoState || {};
  const entityId = S.entity ? S.entity.id_usuario : null;

  todosAtendimentos.forEach(a => {
    if (a.status === 'Cancelado' || a.status === 'Recusado') return;

    const matchEntity = !entityId || (
      S.isSalao
        ? (a.id_salao === entityId || (a.salao_nome && S.entity.nome_completo && a.salao_nome.toLowerCase().includes(S.entity.nome_completo.toLowerCase())))
        : (!a.id_freelancer || a.id_freelancer === entityId || (a.freelancer_nome && S.entity.nome_completo && a.freelancer_nome.toLowerCase().includes(S.entity.nome_completo.toLowerCase())))
    );

    if (!matchEntity) return;

    let iso = a.data_agendamento;
    if (!iso && a.data) {
      const m = a.data.match(/(\d{4}-\d{2}-\d{2})/);
      if (m) iso = m[1];
      else if (a.data.toLowerCase().includes('hoje')) iso = '2026-10-19';
    }

    if (iso) {
      diasComAgendamentos.add(iso);
      contagemPorDia[iso] = (contagemPorDia[iso] || 0) + 1;
    }
  });

  // Primeiro dia do mês e total de dias
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const totalDiasMes = new Date(ano, mes + 1, 0).getDate();

  let daysHtml = '';

  // Espaços vazios antes do dia 1
  for (let i = 0; i < primeiroDiaSemana; i++) {
    daysHtml += `<div class="calendar-day disabled" style="opacity: 0;"></div>`;
  }

  // Dias do mês
  for (let dia = 1; dia <= totalDiasMes; dia++) {
    const diaFormatado = String(dia).padStart(2, '0');
    const mesFormatado = String(mes + 1).padStart(2, '0');
    const dataIso = `${ano}-${mesFormatado}-${diaFormatado}`;

    const isToday = (ano === hojeAno && mes === hojeMes && dia === hojeDia);
    const isSelected = (dataIso === dataSelecionadaStr);
    const hasEvents = diasComAgendamentos.has(dataIso);
    const eventCount = contagemPorDia[dataIso] || 0;

    // Validação estrita de agendamento:
    // 1. Data anterior a hoje (19/10/2026) -> Bloqueado para novos agendamentos
    // 2. Data posterior a 1 mês (19/11/2026) -> Bloqueado
    let isDisabled = false;

    if (ano < hojeAno || (ano === hojeAno && mes < hojeMes)) {
      isDisabled = true;
    } else if (ano === hojeAno && mes === hojeMes && dia < hojeDia) {
      isDisabled = true;
    } else if (ano > limiteAno || (ano === limiteAno && mes > limiteMes)) {
      isDisabled = true;
    } else if (ano === limiteAno && mes === limiteMes && dia > limiteDia) {
      isDisabled = true;
    }

    daysHtml += `
      <div 
        class="calendar-day ${isDisabled ? 'disabled' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEvents ? 'has-events' : ''}" 
        ${!isDisabled ? `onclick="window.selectDataAgendamento('${dataIso}')"` : `title="Data indisponível"`}
        title="${dia} de ${mesesNomes[mes]}${isToday ? ' (Hoje)' : ''}${hasEvents ? ` (${eventCount} agendamento${eventCount > 1 ? 's' : ''})` : ''}"
      >
        ${dia}
      </div>
    `;
  }

  // Controle de navegação de meses (apenas Outubro e Novembro de 2026)
  const canGoPrev = (ano > hojeAno || (ano === hojeAno && mes > hojeMes));
  const canGoNext = (ano < limiteAno || (ano === limiteAno && mes < limiteMes));

  return `
    <div class="mini-calendar-container">
      <div class="calendar-header">
        <button class="calendar-nav-btn" ${!canGoPrev ? 'disabled' : ''} onclick="window.navMesCalendario(-1)">
          ‹
        </button>
        <span class="calendar-header-title">${mesesNomes[mes]} ${ano}</span>
        <button class="calendar-nav-btn" ${!canGoNext ? 'disabled' : ''} onclick="window.navMesCalendario(1)">
          ›
        </button>
      </div>

      <div class="calendar-weekdays">
        <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
      </div>

      <div class="calendar-grid">
        ${daysHtml}
      </div>

      <!-- Legenda explicativa sincronizada -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 14px; margin-top: 10px; font-size: 0.72rem; color: var(--text-secondary); background: var(--bg-subtle); padding: 6px 12px; border-radius: var(--radius-sm);">
        <div style="display: flex; align-items: center; gap: 5px;">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-emerald, #16A34A);"></span>
          <span>Com agendamentos</span>
        </div>
        <div style="display: flex; align-items: center; gap: 5px;">
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid #000000;"></span>
          <span>Hoje (19/10)</span>
        </div>
        <div style="display: flex; align-items: center; gap: 5px;">
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #000000;"></span>
          <span>Selecionado</span>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// 4. DETECÇÃO DE CONFLITOS DE HORÁRIOS (com Duração e Agendamentos Reais)
// =========================================================================
function calcularSlotsComConflito(idProfissional, dataIso, duracaoTotalMinutos) {
  // Horários de atendimento da plataforma: das 08:00 às 18:30 em slots de 30 min
  const slotsBase = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30'
  ];

  // Buscar agendamentos existentes no State e no Banco para esse profissional nesta data
  const state = window.appState.getState();
  const todosAtendimentos = state.atendimentos || [];
  const ocupadosData = [];

  const S = window._agendamentoState || {};

  // Incluir atendimentos reais gravados no state para a entidade e data selecionadas
  todosAtendimentos.forEach(at => {
    if (at.status === 'Cancelado' || at.status === 'Recusado') return;

    const matchEntity = (!idProfissional) ||
      (at.id_freelancer === idProfissional) ||
      (at.id_salao === idProfissional) ||
      (S.entity && (
        (at.freelancer_nome && S.entity.nome_completo && at.freelancer_nome.toLowerCase().includes(S.entity.nome_completo.toLowerCase())) ||
        (at.salao_nome && S.entity.nome_completo && at.salao_nome.toLowerCase().includes(S.entity.nome_completo.toLowerCase()))
      ));

    if (!matchEntity) return;

    let atDataIso = at.data_agendamento;
    if (!atDataIso && at.data) {
      const m = at.data.match(/(\d{4}-\d{2}-\d{2})/);
      if (m) atDataIso = m[1];
      else if (at.data.toLowerCase().includes('hoje')) atDataIso = '2026-10-19';
    }

    if (atDataIso === dataIso) {
      const hora = at.hora_agendamento || at.previsaoChegada || at.previsao_chegada;
      if (hora) {
        ocupadosData.push({
          horaInicio: hora,
          duracaoMinutos: parseInt(at.duracao_minutos || 60, 10),
          servico: at.servico || 'Atendimento Marcado'
        });
      }
    }
  });

  // Converter horário HH:MM para minutos desde 00:00
  const timeToMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  const duracao = duracaoTotalMinutos || 60;

  // Analisar cada slot com a janela [slotStart, slotStart + duracao]
  return slotsBase.map(horario => {
    const slotStart = timeToMinutes(horario);
    const slotEnd = slotStart + duracao;

    // Horário máximo comercial (19:30)
    if (slotEnd > timeToMinutes('19:30')) {
      return {
        horario,
        ocupado: true,
        motivoCurto: 'Fora do Horário',
        motivo: 'O serviço ultrapassa o horário de encerramento do estabelecimento'
      };
    }

    // Verificar colisão com qualquer agendamento ocupado:
    // Colisão ocorre se: slotStart < ocupadoEnd && slotEnd > ocupadoStart
    for (const oc of ocupadosData) {
      const ocStart = timeToMinutes(oc.horaInicio);
      const ocEnd = ocStart + oc.duracaoMinutos;

      if (slotStart < ocEnd && slotEnd > ocStart) {
        let motivoTexto = '';
        if (slotStart >= ocStart && slotStart < ocEnd) {
          motivoTexto = `Horário ocupado por "${oc.servico}" (${oc.horaInicio} às ${formatMinutesToHhmm(ocEnd)})`;
        } else {
          motivoTexto = `Conflito de duração: seu serviço (${duracao} min) colide com o agendamento de ${oc.horaInicio}`;
        }

        return {
          horario,
          ocupado: true,
          motivoCurto: 'Ocupado',
          motivo: motivoTexto
        };
      }
    }

    return {
      horario,
      ocupado: false
    };
  });
}

function formatMinutesToHhmm(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatarDataAmigavel(isoDate) {
  if (!isoDate) return '--';
  const [ano, mes, dia] = isoDate.split('-');
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${dia} de ${meses[parseInt(mes, 10) - 1]} de ${ano}`;
}

// =========================================================================
// 5. INTERAÇÕES E EVENT HANDLERS DO MODAL DE AGENDAMENTO
// =========================================================================
window.toggleServicoAgendamento = function(servicoId) {
  const S = window._agendamentoState;
  const idx = S.servicosSelecionados.indexOf(servicoId);
  if (idx >= 0) {
    // Só permite desmarcar se houver mais de um selecionado
    if (S.servicosSelecionados.length > 1) {
      S.servicosSelecionados.splice(idx, 1);
    } else {
      UI.showToast('Ao menos um serviço deve permanecer selecionado.', 'info');
      return;
    }
  } else {
    S.servicosSelecionados.push(servicoId);
  }

  // Se o horário selecionado agora entrar em conflito com a nova duração, desmarcar
  S.horarioSelecionado = null;
  renderAgendamentoModalContent();
};

window.selectDataAgendamento = function(dataIso) {
  window._agendamentoState.dataSelecionada = dataIso;
  window._agendamentoState.horarioSelecionado = null;
  renderAgendamentoModalContent();
};

window.navMesCalendario = function(direction) {
  const S = window._agendamentoState;
  let novoMes = S.mesVisualizado + direction;
  let novoAno = S.anoVisualizado;

  if (novoMes < 0) {
    novoMes = 11;
    novoAno--;
  } else if (novoMes > 11) {
    novoMes = 0;
    novoAno++;
  }

  // Limite: 10/2026 (Outubro) ou 11/2026 (Novembro)
  if (novoAno === 2026 && (novoMes === 9 || novoMes === 10)) {
    S.mesVisualizado = novoMes;
    S.anoVisualizado = novoAno;
    renderAgendamentoModalContent();
  }
};

window.selectHorarioAgendamento = function(horario) {
  window._agendamentoState.horarioSelecionado = horario;
  renderAgendamentoModalContent();
};

window.confirmarAgendamentoFinal = async function() {
  const S = window._agendamentoState;
  const entity = S.entity;

  if (!S.horarioSelecionado) {
    UI.showToast('Por favor, selecione um horário disponível!', 'error');
    return;
  }

  const selecionados = S.servicosDisponiveis.filter(s => S.servicosSelecionados.includes(s.id_servico));
  if (selecionados.length === 0) {
    UI.showToast('Selecione ao menos um serviço!', 'error');
    return;
  }

  const valorTotal = selecionados.reduce((sum, s) => sum + parseFloat(s.preco), 0);
  const duracaoTotal = selecionados.reduce((sum, s) => sum + parseInt(s.duracao_minutos || 60, 10), 0);
  const nomesServicos = selecionados.map(s => s.nome).join(' + ');

  const currentUser = window.appState.getState().currentUser || { id_usuario: 1, nome_completo: 'Isabela Santos' };

  try {
    await window.appState.criarAgendamento({
      id_cliente: currentUser.id_usuario,
      id_freelancer: entity.id_usuario,
      freelancer_nome: entity.nome_completo,
      servico: nomesServicos,
      tipo: S.isSalao ? 'No Salão' : 'Domicílio',
      valor_total: valorTotal,
      taxa_salao: S.isSalao ? (valorTotal * 0.15) : 0,
      data_agendamento: S.dataSelecionada,
      hora_agendamento: S.horarioSelecionado,
      duracao_minutos: duracaoTotal,
      servicos_adicionais: selecionados
    });

    // Sincronizar data global da agenda com o agendamento recém-criado
    window.selectedAgendaDateIso = S.dataSelecionada;
    window.agendaAnchorDateIso = S.dataSelecionada;

    UI.closeModal();
    UI.showToast(`Agendamento de ${nomesServicos} confirmado para ${formatarDataAmigavel(S.dataSelecionada)} às ${S.horarioSelecionado}!`, 'success');

    // Navegar para histórico ou re-renderizar
    if (window.router) {
      window.router.renderCurrentRoute();
    }
  } catch (err) {
    UI.showToast('Erro ao confirmar agendamento: ' + err.message, 'error');
  }
};

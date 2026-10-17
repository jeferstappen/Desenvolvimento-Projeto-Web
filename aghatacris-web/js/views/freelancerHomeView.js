/**
 * AGhataCris - Freelancer Home View (Dashboard de Atendimentos)
 * Corresponds to Figura 6 (Visão da Profissional: Dashboard de Atendimentos em Andamento)
 */

window.renderFreelancerHomeView = function() {
  const state = window.appState.getState();
  const freeData = state.rolesData.freelancer;

  // Obter ID do freelancer logado (da sessão ou do rolesData)
  const currentUser = state.currentUser;
  const currentProId = (currentUser && currentUser.id_usuario) || freeData.id_usuario;

  // Filtrar atendimento SOMENTE do freelancer logado com status Em Andamento
  const atendimentoAtual = state.atendimentos.find(a =>
    a.status === 'Em Andamento' &&
    (a.id_freelancer === currentProId || !a.id_freelancer)
  );

  // Normalizar campos do banco (snake_case) para exibição
  let distancia = '--';
  let previsao = '--';
  let servico = 'Pronto Atendimento Estético';
  if (atendimentoAtual) {
    const km = atendimentoAtual.distanciaKm !== undefined
      ? atendimentoAtual.distanciaKm
      : atendimentoAtual.distancia_km;
    distancia = (km !== undefined && km !== null) ? `${parseFloat(km).toFixed(1)}` : '--';
    previsao = atendimentoAtual.previsaoChegada || atendimentoAtual.previsao_chegada || '--';
    servico = atendimentoAtual.servico || 'Pronto Atendimento Estético';
  }

  // Reserva ativa (null-safe)
  const reservaAtiva = freeData.reservaAtiva;
  let reservaHtml = '';
  if (reservaAtiva && reservaAtiva.tempoRestanteSegundos > 0) {
    const totalSecs = reservaAtiva.tempoRestanteSegundos;
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    reservaHtml = `
      <div class="active-reserve-alert">
        <div class="reserve-info">
          <div class="reserve-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M9 3v18"></path></svg>
          </div>
          <div>
            <div class="reserve-title">Reserva Ativa</div>
            <div class="reserve-salon">${reservaAtiva.nome_salao}</div>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <span class="countdown-timer-badge" id="arrival-countdown">${formattedTime}</span>
          <span class="text-xs font-bold" style="color: #065F46;">para chegar</span>
        </div>
      </div>`;
  }

  return `
    <div class="view-content-padded animate-fade-in">
      ${reservaHtml}

      <!-- Card Atendimento Atual -->
      ${atendimentoAtual ? `
        <div class="current-service-card">
          <div class="service-header-status">
            <div class="status-live-badge">
              <span class="status-indicator-dot"></span>
              <span>ATENDIMENTO ATUAL</span>
            </div>
            <span class="badge badge-teal">${atendimentoAtual.tipo || 'Domicílio'}</span>
          </div>

          <div class="service-user-details">
            <div class="service-client-info">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" alt="Cliente" />
              <div>
                <h3 class="font-extrabold text-base text-primary">${atendimentoAtual.cliente_nome || 'Cliente'}</h3>
                <p class="text-xs text-secondary">${servico}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs text-muted">DISTÂNCIA</span>
              <div class="font-bold text-sm text-primary">${distancia} km</div>
            </div>
          </div>

          <div class="service-meta-row">
            <div>
              <div class="meta-item-label">Chegada Estimada</div>
              <div class="meta-item-val" style="color: var(--primary-teal);">${previsao}</div>
            </div>
            <div class="text-right">
              <div class="meta-item-label">Valor Estimado</div>
              <div class="meta-item-val text-emerald">R$ ${(atendimentoAtual.valor_total || 0).toFixed(2)}</div>
            </div>
          </div>

          <button class="btn btn-emerald" onclick="window.finalizarAtendimentoAction()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Finalizar Atendimento
          </button>
        </div>
      ` : `
        <div class="surface-card text-center" style="padding: 28px 24px; margin-bottom: 16px; border: 2px dashed var(--border-subtle);">
          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, var(--primary-teal), var(--primary-emerald)); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
          </div>
          <h4 class="font-bold text-base" style="margin-bottom: 4px;">Aguardando Solicitações sob Demanda</h4>
          <p class="text-xs text-muted" style="margin-bottom: 16px;">Seu radar de 15km está ativo e buscando solicitações em tempo real.</p>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <span class="badge badge-emerald" style="padding: 4px 10px;">● Radar 15km ativo</span>
            <span class="badge badge-teal" style="padding: 4px 10px;">📡 GPS Online</span>
          </div>
        </div>
      `}

      <!-- Quick Earnings & Upcoming -->
      <div class="quick-stats-row">
        <div class="stat-widget">
          <div class="stat-widget-label">Ganhos de Hoje</div>
          <div class="stat-widget-value text-emerald">R$ ${(freeData.ganhosHoje || 0).toFixed(2)}</div>
          <span class="text-xs text-muted">▲ +12% vs ontem</span>
        </div>
        <div class="stat-widget" style="cursor: pointer;" onclick="window.location.hash = '#/freelancer/carteira'">
          <div class="stat-widget-label">Saldo Disponível</div>
          <div class="stat-widget-value text-teal">R$ ${(freeData.saldo || 0).toFixed(2)}</div>
          <span class="text-xs font-bold text-teal">Ver Extrato →</span>
        </div>
      </div>

      <!-- Próximos Agendamentos -->
      <div class="flex justify-between items-center" style="margin-bottom: 10px;">
        <h4 class="text-xs font-bold text-muted" style="text-transform: uppercase; letter-spacing: 0.5px;">PRÓXIMOS AGENDAMENTOS</h4>
        <a href="#/freelancer/agenda" class="text-xs font-bold text-teal">Ver Agenda</a>
      </div>

      <div class="surface-card flex items-center justify-between" style="padding: 12px 16px;">
        <div class="flex items-center gap-3">
          <div style="background: var(--bg-subtle); padding: 8px; border-radius: var(--radius-xs); font-weight: 800; font-size: 0.85rem; color: var(--primary-teal);">
            14:30
          </div>
          <div>
            <div class="font-bold text-sm text-primary">Design de Sobrancelhas</div>
            <div class="text-xs text-secondary">Beatriz Fontes • No Salão</div>
          </div>
        </div>
        <button class="btn-ghost" onclick="UI.showToast('Detalhes do agendamento de 14:30', 'info')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </button>
      </div>

      <!-- Floating Action Button (FAB): Criar Serviços Ofertados -->
      <button class="fab-btn" onclick="UI.openGerenciarServicosModal()" title="Criar e Gerenciar Serviços Ofertados">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <span class="fab-tooltip">Criar Serviço Ofertado</span>
      </button>
    </div>
  `;
};

window.finalizarAtendimentoAction = function() {
  window.appState.finalizarAtendimentoAtual();
  UI.showToast('Atendimento finalizado com sucesso! Repasse financeiro creditado na sua carteira.', 'success');
  window.router.renderCurrentRoute();
};

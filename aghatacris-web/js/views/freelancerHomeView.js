/**
 * AGhataCris - Freelancer Home View (Dashboard de Atendimentos)
 * Corresponds to Figura 6 (Visão da Profissional: Dashboard de Atendimentos em Andamento)
 */

window.renderFreelancerHomeView = function() {
  const state = window.appState.getState();
  const freeData = state.rolesData.freelancer;
  const atendimentoAtual = state.atendimentos.find(a => a.status === 'Em Andamento');

  const totalSecs = freeData.reservaAtiva.tempoRestanteSegundos;
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return `
    <div class="view-content-padded animate-fade-in">
      <!-- Card Reserva Ativa de Cadeira no Salão -->
      <div class="active-reserve-alert">
        <div class="reserve-info">
          <div class="reserve-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M9 3v18"></path></svg>
          </div>
          <div>
            <div class="reserve-title">Reserva Ativa</div>
            <div class="reserve-salon">${freeData.reservaAtiva.nome_salao}</div>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <span class="countdown-timer-badge" id="arrival-countdown">${formattedTime}</span>
          <span class="text-xs font-bold" style="color: #065F46;">para chegar</span>
        </div>
      </div>

      <!-- Card Atendimento Atual -->
      ${atendimentoAtual ? `
        <div class="current-service-card">
          <div class="service-header-status">
            <div class="status-live-badge">
              <span class="status-indicator-dot"></span>
              <span>ATENDIMENTO ATUAL</span>
            </div>
            <span class="badge badge-teal">${atendimentoAtual.tipo}</span>
          </div>

          <div class="service-user-details">
            <div class="service-client-info">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" alt="Cliente" />
              <div>
                <h3 class="font-extrabold text-base text-primary">${atendimentoAtual.cliente_nome}</h3>
                <p class="text-xs text-secondary">${atendimentoAtual.servico}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs text-muted">DISTÂNCIA</span>
              <div class="font-bold text-sm text-primary">${atendimentoAtual.distanciaKm} km</div>
            </div>
          </div>

          <div class="service-meta-row">
            <div>
              <div class="meta-item-label">Chegada Estimada</div>
              <div class="meta-item-val" style="color: var(--primary-teal);">${atendimentoAtual.previsaoChegada}</div>
            </div>
            <div class="text-right">
              <div class="meta-item-label">Valor Estimado</div>
              <div class="meta-item-val text-emerald">R$ ${atendimentoAtual.valor_total.toFixed(2)}</div>
            </div>
          </div>

          <button class="btn btn-emerald" onclick="window.finalizarAtendimentoAction()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Finalizar Atendimento
          </button>
        </div>
      ` : `
        <div class="surface-card text-center" style="padding: 24px; margin-bottom: 16px;">
          <div class="status-indicator-dot" style="margin: 0 auto 8px auto;"></div>
          <h4 class="font-bold text-base">Pronta para novos chamados</h4>
          <p class="text-xs text-muted" style="margin-top: 4px;">Seu radar de 15km está ativo e buscando solicitações em tempo real.</p>
        </div>
      `}

      <!-- Quick Earnings & Upcoming -->
      <div class="quick-stats-row">
        <div class="stat-widget">
          <div class="stat-widget-label">Ganhos de Hoje</div>
          <div class="stat-widget-value text-emerald">R$ ${freeData.ganhosHoje.toFixed(2)}</div>
          <span class="text-xs text-muted">▲ +12% vs ontem</span>
        </div>
        <div class="stat-widget" style="cursor: pointer;" onclick="window.location.hash = '#/freelancer/carteira'">
          <div class="stat-widget-label">Saldo Disponível</div>
          <div class="stat-widget-value text-teal">R$ ${freeData.saldo.toFixed(2)}</div>
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
    </div>
  `;
};

window.finalizarAtendimentoAction = function() {
  window.appState.finalizarAtendimentoAtual();
  UI.showToast('Atendimento finalizado com sucesso! Repasse financeiro creditado na sua carteira.', 'success');
  window.router.renderCurrentRoute();
};

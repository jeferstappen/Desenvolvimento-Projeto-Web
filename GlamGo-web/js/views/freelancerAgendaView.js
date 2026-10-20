/**
 * AGhataCris - Freelancer Agenda View
 * Corresponds to Figura 7 (Visão da Profissional: Controle de Agenda e Compromissos)
 * Calendário dinâmico integrado ao StateManager, com marcação de dias com agendamentos reais,
 * sincronização com banco relacional e navegação semanal/mensal completa.
 */

// Estado global do calendário da agenda
if (!window.selectedAgendaDateIso) {
  window.selectedAgendaDateIso = '2026-10-19'; // Dia de hoje simulado
}
if (!window.agendaAnchorDateIso) {
  window.agendaAnchorDateIso = window.selectedAgendaDateIso;
}

window.renderFreelancerAgendaView = function() {
  const state = window.appState.getState();
  const freeData = state.rolesData.freelancer;
  const currentProId = (state.currentUser && state.currentUser.id_usuario) || (freeData && freeData.id_usuario) || 2;

  // Garantir que datas válidas estejam selecionadas
  const selectedDateIso = window.selectedAgendaDateIso || '2026-10-19';
  const anchorDateIso = window.agendaAnchorDateIso || selectedDateIso;

  // 1. Mapear todos os dias que possuem agendamentos reais para este profissional
  const todosAtendimentos = state.atendimentos || [];
  const diasComAgendamentos = new Set();
  const contagemPorDia = {};

  todosAtendimentos.forEach(a => {
    // Filtrar para o freelancer logado
    const matchPro = !a.id_freelancer ||
                     a.id_freelancer === currentProId ||
                     (a.freelancer_nome && a.freelancer_nome.toLowerCase().includes('mariana')) ||
                     (a.freelancer_nome && a.freelancer_nome.toLowerCase().includes('verstappen'));

    if (!matchPro) return;
    if (a.status === 'Cancelado' || a.status === 'Recusado') return;

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

  // 2. Calcular a semana visível (7 dias) baseada no anchorDateIso
  const [ay, am, ad] = anchorDateIso.split('-').map(Number);
  const anchorDate = new Date(ay, am - 1, ad);
  const dayOfWeek = anchorDate.getDay(); // 0: Dom, 1: Seg, ..., 6: Sáb

  // Iniciar no Domingo da semana do anchor
  const weekStart = new Date(anchorDate);
  weekStart.setDate(anchorDate.getDate() - dayOfWeek);

  const dayNamesPt = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const cur = new Date(weekStart);
    cur.setDate(weekStart.getDate() + i);

    const cy = cur.getFullYear();
    const cm = String(cur.getMonth() + 1).padStart(2, '0');
    const cd = String(cur.getDate()).padStart(2, '0');
    const iso = `${cy}-${cm}-${cd}`;

    weekDays.push({
      iso: iso,
      name: dayNamesPt[cur.getDay()],
      num: cur.getDate(),
      month: cur.getMonth(),
      year: cy,
      isToday: iso === '2026-10-19',
      isSelected: iso === selectedDateIso,
      hasEvents: diasComAgendamentos.has(iso),
      eventCount: contagemPorDia[iso] || 0
    });
  }

  // 3. Filtrar os agendamentos reais do dia selecionado
  const agendamentosDoDia = todosAtendimentos.filter(a => {
    const matchPro = !a.id_freelancer ||
                     a.id_freelancer === currentProId ||
                     (a.freelancer_nome && a.freelancer_nome.toLowerCase().includes('mariana')) ||
                     (a.freelancer_nome && a.freelancer_nome.toLowerCase().includes('verstappen'));
    if (!matchPro) return false;

    let iso = a.data_agendamento;
    if (!iso && a.data) {
      const m = a.data.match(/(\d{4}-\d{2}-\d{2})/);
      if (m) iso = m[1];
      else if (a.data.toLowerCase().includes('hoje')) iso = '2026-10-19';
    }

    return iso === selectedDateIso;
  });

  // Ordenar cronologicamente por hora_agendamento
  agendamentosDoDia.sort((x, y) => {
    const hx = x.hora_agendamento || x.previsao_chegada || '00:00';
    const hy = y.hora_agendamento || y.previsao_chegada || '00:00';
    return hx.localeCompare(hy);
  });

  // 4. Formatação do título do mês e ano
  const mesesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const [selYear, selMonth, selDay] = selectedDateIso.split('-').map(Number);
  const tituloMes = `${mesesNomes[selMonth - 1]}, ${selYear}`;

  // Formatação amigável do dia selecionado
  const dateObj = new Date(selYear, selMonth - 1, selDay);
  const diasExtenso = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];
  const textoDataFormatada = `${diasExtenso[dateObj.getDay()]}, ${selDay} de ${mesesNomes[selMonth - 1]}`;

  return `
    <div class="view-content-padded animate-fade-in">
      <!-- Cabeçalho do Mês e Controles de Navegação -->
      <div class="calendar-month-header">
        <div>
          <h2 class="calendar-month-title">${tituloMes}</h2>
          <span class="text-xs text-muted" style="display: block; margin-top: 1px;">${textoDataFormatada}</span>
        </div>

        <div class="calendar-header-actions">
          <button class="calendar-nav-btn-icon" onclick="window.navigateAgendaWeek(-1)" title="Semana anterior">
            ‹
          </button>
          <button class="calendar-pill-today" onclick="window.goToAgendaToday()" title="Ir para a data de hoje">
            Hoje
          </button>
          <button class="calendar-nav-btn-icon" onclick="window.navigateAgendaWeek(1)" title="Próxima semana">
            ›
          </button>
          <button class="calendar-icon-btn" onclick="window.openMonthCalendarModal()" title="Ver calendário do mês completo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </button>
        </div>
      </div>

      <!-- Barra Semanal Dinâmica de 7 Dias -->
      <div class="calendar-week-strip">
        ${weekDays.map(d => `
          <div 
            class="calendar-day-card ${d.isSelected ? 'selected' : ''} ${d.isToday ? 'today' : ''} ${d.hasEvents ? 'has-events' : ''}" 
            onclick="window.selectAgendaDate('${d.iso}')"
            title="${d.name} ${d.num}/${d.month + 1} ${d.hasEvents ? `(${d.eventCount} agendamento${d.eventCount > 1 ? 's' : ''})` : ''}"
          >
            <span class="day-name">${d.name}</span>
            <span class="day-number">${d.num}</span>
            ${d.hasEvents ? `<span class="calendar-event-dot"></span>` : `<span class="calendar-event-dot-placeholder"></span>`}
          </div>
        `).join('')}
      </div>

      <!-- Indicador Informativo do Dia Selecionado -->
      <div class="flex justify-between items-center" style="margin-bottom: 12px; padding: 0 2px;">
        <span class="text-xs font-bold text-muted" style="text-transform: uppercase; letter-spacing: 0.5px;">
          COMPROMISSOS DO DIA (${agendamentosDoDia.length})
        </span>
        ${diasComAgendamentos.has(selectedDateIso) ? `
          <span class="badge badge-emerald" style="font-size: 0.68rem; padding: 2px 8px;">
            ● Dia com agendamentos
          </span>
        ` : `
          <span class="text-xs text-muted">Livre</span>
        `}
      </div>

      <!-- Lista de Agendamentos / Timeline -->
      <div class="timeline-container">
        ${agendamentosDoDia.map(at => {
          let badgeClass = 'badge-teal';
          let statusLabel = at.status || 'Confirmado';

          if (at.status === 'Concluído') {
            badgeClass = 'badge-emerald';
          } else if (at.status === 'Em Andamento') {
            badgeClass = 'badge-teal';
          } else if (at.status === 'Pendente') {
            badgeClass = 'badge-amber';
            statusLabel = 'Pendente';
          } else if (at.status === 'Recusado') {
            badgeClass = 'badge-coral';
            statusLabel = 'Recusado';
          } else if (at.status === 'Cancelado') {
            badgeClass = 'badge-coral';
          } else {
            badgeClass = 'badge-emerald';
            statusLabel = 'Confirmado';
          }

          const horaFormatada = at.hora_agendamento || at.previsao_chegada || '09:00';
          const duracao = at.duracao_minutos || 60;
          const clienteNome = at.cliente_nome || 'Cliente';
          const avatarUrl = at.cliente_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';
          const localStr = at.tipo === 'Domicílio' 
            ? 'Atendimento Domicílio' 
            : (at.salao_nome ? `No Salão: ${at.salao_nome}` : 'No Salão Parceiro');

          return `
            <div class="timeline-event-card">
              <div class="timeline-time-box">
                <span class="time-val">${horaFormatada}</span>
                <span class="time-dur">⏱️ ${duracao}m</span>
              </div>
              <div class="timeline-card-content">
                <div class="flex justify-between items-center" style="margin-bottom: 8px;">
                  <div class="flex items-center gap-2">
                    <img src="${avatarUrl}" alt="${clienteNome}" class="timeline-client-avatar" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'" />
                    <div>
                      <h4 class="font-bold text-sm text-primary" style="margin: 0; line-height: 1.2;">${clienteNome}</h4>
                      <span class="text-xs text-muted">⭐ ${at.cliente_avaliacao ? parseFloat(at.cliente_avaliacao).toFixed(1) : '5.0'}</span>
                    </div>
                  </div>
                  <span class="badge ${badgeClass}">${statusLabel}</span>
                </div>

                <p class="text-xs font-semibold text-secondary" style="margin-bottom: 4px;">✂️ ${at.servico || 'Procedimento Estético'}</p>
                <p class="text-xs text-muted" style="margin-bottom: 10px;">📍 ${localStr}</p>

                <div class="flex items-center justify-between" style="background: var(--bg-subtle); padding: 6px 10px; border-radius: var(--radius-xs); margin-bottom: 12px; font-size: 0.75rem;">
                  <span class="text-muted">Total: <strong class="text-primary">R$ ${parseFloat(at.valor_total || 0).toFixed(2)}</strong></span>
                  <span class="text-emerald font-bold">Seu Líquido: R$ ${parseFloat(at.valor_liquido || (at.valor_total * 0.9)).toFixed(2)}</span>
                </div>

                <div class="flex gap-2 items-center flex-wrap">
                  <button class="btn btn-secondary btn-sm" onclick="UI.showToast('Abrindo conversa com ${clienteNome}...', 'info')">
                    💬 Mensagem
                  </button>
                  ${at.status === 'Pendente' ? `
                    <button class="btn btn-emerald btn-sm" style="font-weight: 700;" onclick="window.aceitarSolicitacaoAtendimento(${at.id_atendimento})">
                      ✓ Aceitar
                    </button>
                    <button class="btn btn-ghost btn-sm" style="color: var(--accent-coral); font-weight: 600;" onclick="window.abrirModalRecusarSolicitacao(${at.id_atendimento})">
                      ✕ Recusar
                    </button>
                  ` : ''}
                  ${at.status === 'Em Andamento' || at.status === 'Confirmado' ? `
                    <button class="btn btn-ghost btn-sm" style="color: var(--accent-coral);" onclick="window.confirmarCancelamentoAgenda(${at.id_atendimento})">
                      Cancelar
                    </button>
                  ` : ''}
                  ${at.status === 'Concluído' ? `
                    <button class="btn btn-ghost btn-sm text-teal" onclick="UI.openReciboModal(${at.id_atendimento})">
                      🧾 Recibo
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}

        ${agendamentosDoDia.length === 0 ? `
          <div class="surface-card text-center" style="padding: 38px 20px; border: 1.5px dashed var(--border-light); border-radius: var(--radius-md); margin-top: 6px;">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--bg-subtle); border: 1px solid var(--border-light); color: var(--text-muted); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <h4 class="font-bold text-sm" style="margin-bottom: 4px; color: var(--text-primary);">Nenhum agendamento para este dia</h4>
            <p class="text-xs text-muted" style="max-width: 280px; margin: 0 auto 16px auto;">
              Você não possui compromissos marcados para <strong>${textoDataFormatada}</strong>.
            </p>
            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-sm btn-outline-teal" onclick="window.goToAgendaToday()">
                Ir para Hoje (19/10)
              </button>
              <button class="btn btn-sm btn-secondary" onclick="window.UI.openGerenciarServicosModal()">
                + Gerenciar Serviços
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
};

// =========================================================================
// Funções Interativas de Controle do Calendário
// =========================================================================

window.selectAgendaDate = function(iso) {
  window.selectedAgendaDateIso = iso;
  window.agendaAnchorDateIso = iso;
  if (window.router) {
    window.router.renderCurrentRoute();
  }
};

window.navigateAgendaWeek = function(offset) {
  const base = window.agendaAnchorDateIso || window.selectedAgendaDateIso || '2026-10-19';
  const [y, m, d] = base.split('-').map(Number);
  const cur = new Date(y, m - 1, d);
  cur.setDate(cur.getDate() + (offset * 7));

  const ny = cur.getFullYear();
  const nm = String(cur.getMonth() + 1).padStart(2, '0');
  const nd = String(cur.getDate()).padStart(2, '0');
  const novoIso = `${ny}-${nm}-${nd}`;

  window.agendaAnchorDateIso = novoIso;
  window.selectedAgendaDateIso = novoIso;
  if (window.router) {
    window.router.renderCurrentRoute();
  }
};

window.goToAgendaToday = function() {
  window.selectedAgendaDateIso = '2026-10-19';
  window.agendaAnchorDateIso = '2026-10-19';
  if (window.router) {
    window.router.renderCurrentRoute();
  }
};

window.confirmarCancelamentoAgenda = function(idAtendimento) {
  if (window.UI && window.UI.openCancelarAgendaModal) {
    window.UI.openCancelarAgendaModal(idAtendimento);
  }
};

// =========================================================================
// Modal Interativo de Calendário Mensal Completo
// =========================================================================
window._agendaMonthModalYear = 2026;
window._agendaMonthModalMonth = 9; // Outubro (0-indexed)

window.openMonthCalendarModal = function() {
  const [selYear, selMonth] = (window.selectedAgendaDateIso || '2026-10-19').split('-').map(Number);
  window._agendaMonthModalYear = selYear;
  window._agendaMonthModalMonth = selMonth - 1;

  window.renderMonthCalendarModalContent();
};

window.navAgendaMonthModal = function(offset) {
  window._agendaMonthModalMonth += offset;
  if (window._agendaMonthModalMonth < 0) {
    window._agendaMonthModalMonth = 11;
    window._agendaMonthModalYear--;
  } else if (window._agendaMonthModalMonth > 11) {
    window._agendaMonthModalMonth = 0;
    window._agendaMonthModalYear++;
  }
  window.renderMonthCalendarModalContent();
};

window.renderMonthCalendarModalContent = function() {
  const year = window._agendaMonthModalYear;
  const month = window._agendaMonthModalMonth;
  const mesesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const state = window.appState.getState();
  const currentProId = (state.currentUser && state.currentUser.id_usuario) || 2;

  // Obter conjunto de dias com agendamento
  const diasComAgendamentos = new Set();
  (state.atendimentos || []).forEach(a => {
    const matchPro = !a.id_freelancer ||
                     a.id_freelancer === currentProId ||
                     (a.freelancer_nome && a.freelancer_nome.toLowerCase().includes('mariana')) ||
                     (a.freelancer_nome && a.freelancer_nome.toLowerCase().includes('verstappen'));
    if (!matchPro || a.status === 'Cancelado' || a.status === 'Recusado') return;

    let iso = a.data_agendamento;
    if (!iso && a.data) {
      const m = a.data.match(/(\d{4}-\d{2}-\d{2})/);
      if (m) iso = m[1];
      else if (a.data.toLowerCase().includes('hoje')) iso = '2026-10-19';
    }
    if (iso) diasComAgendamentos.add(iso);
  });

  const firstDay = new Date(year, month, 1).getDay(); // 0 a 6
  const totalDays = new Date(year, month + 1, 0).getDate();

  let daysHtml = '';
  // Células vazias antes do primeiro dia
  for (let i = 0; i < firstDay; i++) {
    daysHtml += `<div class="calendar-day disabled" style="opacity: 0.15;"></div>`;
  }

  // Células do mês
  for (let d = 1; d <= totalDays; d++) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    const iso = `${year}-${mm}-${dd}`;

    const isToday = iso === '2026-10-19';
    const isSelected = iso === window.selectedAgendaDateIso;
    const hasEvents = diasComAgendamentos.has(iso);

    daysHtml += `
      <div 
        class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEvents ? 'has-events' : ''}"
        onclick="window.selectDateFromMonthModal('${iso}')"
        title="${d} de ${mesesNomes[month]} ${hasEvents ? '(Com agendamento)' : ''}"
      >
        ${d}
      </div>
    `;
  }

  const modalHtml = `
    <div style="padding: 4px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h3 class="modal-title" style="margin: 0;">Calendário da Agenda</h3>
        <button class="btn-ghost" style="padding: 4px;" onclick="UI.closeModal()">✕</button>
      </div>

      <p class="text-xs text-muted" style="margin-top: -6px; margin-bottom: 16px;">
        Selecione uma data para filtrar os atendimentos e verificar seus horários.
      </p>

      <div class="mini-calendar-container" style="margin-bottom: 16px;">
        <div class="calendar-header">
          <button class="calendar-nav-btn" onclick="window.navAgendaMonthModal(-1)">‹</button>
          <span class="calendar-header-title">${mesesNomes[month]} ${year}</span>
          <button class="calendar-nav-btn" onclick="window.navAgendaMonthModal(1)">›</button>
        </div>

        <div class="calendar-weekdays">
          <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
        </div>

        <div class="calendar-grid">
          ${daysHtml}
        </div>
      </div>

      <!-- Legenda explicativa -->
      <div style="display: flex; flex-direction: column; gap: 8px; background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-sm); font-size: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-emerald, #16A34A);"></span>
          <span class="text-secondary">Ponto verde: <strong>Dias com agendamentos marcados</strong></span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid var(--brand-black); display: inline-block;"></span>
          <span class="text-secondary">Borda preta: <strong>Data atual (19/10/2026)</strong></span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 12px; height: 12px; border-radius: 50%; background: var(--brand-black); color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: bold;">✓</span>
          <span class="text-secondary">Preenchido: <strong>Dia selecionado na agenda</strong></span>
        </div>
      </div>

      <div style="margin-top: 16px; display: flex; gap: 8px;">
        <button class="btn btn-outline-teal flex-1" onclick="window.selectDateFromMonthModal('2026-10-19')">
          Ir para Hoje
        </button>
        <button class="btn btn-secondary flex-1" onclick="UI.closeModal()">
          Fechar
        </button>
      </div>
    </div>
  `;

  window.UI.showModal(modalHtml);
};

window.selectDateFromMonthModal = function(iso) {
  window.selectAgendaDate(iso);
  if (window.UI && window.UI.closeModal) {
    window.UI.closeModal();
  }
};

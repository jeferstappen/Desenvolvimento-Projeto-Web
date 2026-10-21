/**
 * AGhataCris - Salão Parceiro Espaços View (Calendário & Cronograma de Ocupação)
 * Visão do Salão Parceiro com controle rigoroso de quem agendou o espaço,
 * por quanto tempo agendou (duração/janela de horário), qual profissional está atendendo
 * e gestão dos espaços físicos cadastrados.
 */

// Estado global do calendário da agenda do salão
if (!window.selectedSalaoAgendaDateIso) {
  window.selectedSalaoAgendaDateIso = '2026-10-19'; // Dia de hoje simulado
}
if (!window.salaoAgendaAnchorDateIso) {
  window.salaoAgendaAnchorDateIso = window.selectedSalaoAgendaDateIso;
}

window.renderSalaoEspacosView = function() {
  const state = window.appState.getState();
  const salaoData = state.rolesData.salao || {};
  const salaoId = salaoData.id_usuario || 3;
  const meusEspacos = state.espacos.filter(e => e.id_salao === salaoId || e.id_salao === 3);

  // Garantir datas válidas
  const selectedDateIso = window.selectedSalaoAgendaDateIso || '2026-10-19';
  const anchorDateIso = window.salaoAgendaAnchorDateIso || selectedDateIso;

  // 1. Mapear agendamentos que utilizam os espaços do salão
  const todosAtendimentos = state.atendimentos || [];
  const diasComReservas = new Set();
  const contagemPorDia = {};

  todosAtendimentos.forEach(a => {
    if (a.status === 'Cancelado' || a.status === 'Recusado') return;

    // Verificar se o atendimento utiliza o salão
    const matchSalao = (a.tipo === 'No Salão') ||
                       (a.id_salao === salaoId) ||
                       (a.salao_nome && a.salao_nome.toLowerCase().includes('elegance'));

    if (!matchSalao) return;

    let iso = a.data_agendamento;
    if (!iso && a.data) {
      const m = a.data.match(/(\d{4}-\d{2}-\d{2})/);
      if (m) iso = m[1];
      else if (a.data.toLowerCase().includes('hoje')) iso = '2026-10-19';
    }

    if (iso) {
      diasComReservas.add(iso);
      contagemPorDia[iso] = (contagemPorDia[iso] || 0) + 1;
    }
  });

  // 2. Calcular a semana visível (7 dias) baseada no anchorDateIso
  const [ay, am, ad] = anchorDateIso.split('-').map(Number);
  const anchorDate = new Date(ay, am - 1, ad);
  const dayOfWeek = anchorDate.getDay(); // 0: Dom, 1: Seg, ..., 6: Sáb

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
      hasEvents: diasComReservas.has(iso),
      eventCount: contagemPorDia[iso] || 0
    });
  }

  // 3. Filtrar reservas de espaço do dia selecionado
  const reservasDoDia = todosAtendimentos.filter(a => {
    if (a.status === 'Cancelado' || a.status === 'Recusado') return false;

    const matchSalao = (a.tipo === 'No Salão') ||
                       (a.id_salao === salaoId) ||
                       (a.salao_nome && a.salao_nome.toLowerCase().includes('elegance'));
    if (!matchSalao) return false;

    let iso = a.data_agendamento;
    if (!iso && a.data) {
      const m = a.data.match(/(\d{4}-\d{2}-\d{2})/);
      if (m) iso = m[1];
      else if (a.data.toLowerCase().includes('hoje')) iso = '2026-10-19';
    }

    return iso === selectedDateIso;
  });

  // Ordenar cronologicamente por hora_agendamento
  reservasDoDia.sort((x, y) => {
    const hx = x.hora_agendamento || x.previsao_chegada || '00:00';
    const hy = y.hora_agendamento || y.previsao_chegada || '00:00';
    return hx.localeCompare(hy);
  });

  // 4. Formatação de títulos
  const mesesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const [selYear, selMonth, selDay] = selectedDateIso.split('-').map(Number);
  const tituloMes = `${mesesNomes[selMonth - 1]}, ${selYear}`;

  const dateObj = new Date(selYear, selMonth - 1, selDay);
  const diasExtenso = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];
  const textoDataFormatada = `${diasExtenso[dateObj.getDay()]}, ${selDay} de ${mesesNomes[selMonth - 1]}`;

  return `
    <div class="view-content-padded animate-fade-in">
      <!-- Cabeçalho do Mês e Controles do Calendário -->
      <div class="calendar-month-header">
        <div>
          <h2 class="calendar-month-title">${tituloMes}</h2>
          <span class="text-xs text-muted" style="display: block; margin-top: 1px;">${textoDataFormatada}</span>
        </div>

        <div class="calendar-header-actions">
          <button class="calendar-nav-btn-icon" onclick="window.navigateSalaoAgendaWeek(-1)" title="Semana anterior">
            ‹
          </button>
          <button class="calendar-pill-today" onclick="window.goToSalaoAgendaToday()" title="Ir para hoje">
            Hoje
          </button>
          <button class="calendar-nav-btn-icon" onclick="window.navigateSalaoAgendaWeek(1)" title="Próxima semana">
            ›
          </button>
          <button class="calendar-icon-btn" onclick="window.openSalaoMonthCalendarModal()" title="Ver calendário do mês completo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </button>
        </div>
      </div>

      <!-- Barra Semanal Dinâmica de 7 Dias -->
      <div class="calendar-week-strip" style="margin-bottom: 16px;">
        ${weekDays.map(d => `
          <div 
            class="calendar-day-card ${d.isSelected ? 'selected' : ''} ${d.isToday ? 'today' : ''} ${d.hasEvents ? 'has-events' : ''}" 
            onclick="window.selectSalaoAgendaDate('${d.iso}')"
            title="${d.name} ${d.num}/${d.month + 1} ${d.hasEvents ? `(${d.eventCount} reserva${d.eventCount > 1 ? 's' : ''})` : ''}"
          >
            <span class="day-name">${d.name}</span>
            <span class="day-number">${d.num}</span>
            <span class="calendar-event-dot"></span>
          </div>
        `).join('')}
      </div>

      <!-- Indicador do Cronograma do Dia -->
      <div class="calendar-timeline-header">
        <h3 class="calendar-timeline-title">
          OCUPAÇÃO DOS ESPAÇOS (${reservasDoDia.length})
        </h3>
        ${diasComReservas.has(selectedDateIso) ? `
          <span class="badge badge-emerald" style="font-size: 0.7rem; padding: 2px 8px;">
            ● Dia com agendamentos
          </span>
        ` : `
          <span class="badge badge-teal" style="font-size: 0.7rem; padding: 2px 8px;">
            Infraestrutura 100% livre
          </span>
        `}
      </div>

      <!-- Cronograma Detalhado: Quem agendou o espaço e por quanto tempo -->
      <div class="calendar-timeline-list" style="margin-bottom: 24px;">
        ${reservasDoDia.map(at => {
          const horaInicio = at.hora_agendamento || at.previsao_chegada || at.previsaoChegada || '14:30';
          const duracaoMin = parseInt(at.duracao_minutos || 60, 10);
          
          // Calcular horário final da janela
          const [h, m] = horaInicio.split(':').map(Number);
          const totalMinsEnd = h * 60 + m + duracaoMin;
          const hEnd = Math.floor(totalMinsEnd / 60);
          const mEnd = totalMinsEnd % 60;
          const horaFim = `${String(hEnd).padStart(2, '0')}:${String(mEnd).padStart(2, '0')}`;

          const horasFormat = Math.floor(duracaoMin / 60);
          const minsFormat = duracaoMin % 60;
          const duracaoTexto = horasFormat > 0 
            ? (minsFormat > 0 ? `${horasFormat}h ${minsFormat}min` : `${horasFormat} hora${horasFormat > 1 ? 's' : ''}`)
            : `${minsFormat} min`;

          // Inferir tipo de espaço baseado no serviço ou cadastrado
          let espacoNome = 'Cadeira de Cabelo';
          if (at.servico && (at.servico.toLowerCase().includes('sobrancelha') || at.servico.toLowerCase().includes('estética') || at.servico.toLowerCase().includes('limpeza') || at.servico.toLowerCase().includes('cílios'))) {
            espacoNome = 'Maca de Estética';
          } else if (at.servico && (at.servico.toLowerCase().includes('make') || at.servico.toLowerCase().includes('maquiagem'))) {
            espacoNome = 'Bancada de Maquiagem';
          }

          const statusBadgeClass = at.status === 'Concluído' ? 'badge-emerald' : (at.status === 'Em Andamento' ? 'badge-teal' : 'badge-amber');

          return `
            <div class="calendar-timeline-item">
              <div class="timeline-time-col">
                <span class="timeline-hour">${horaInicio}</span>
                <span class="timeline-duration" style="color: var(--primary-teal); font-weight: 700;">⏱️ ${duracaoMin}m</span>
              </div>

              <div class="timeline-card">
                <!-- Topo: Profissional que agendou e Status -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <div style="display: flex; gap: 10px; align-items: center;">
                    <img src="${at.freelancer_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'}" 
                         alt="${at.freelancer_nome || 'Profissional'}" 
                         style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary-teal);" />
                    <div>
                      <strong style="font-size: 0.95rem; color: var(--text-primary); display: block;">
                        ${at.freelancer_nome || 'Mariana Silva'}
                      </strong>
                      <span style="font-size: 0.75rem; color: var(--text-secondary);">
                        Profissional Autônoma • ★ 5.0
                      </span>
                    </div>
                  </div>
                  <span class="badge ${statusBadgeClass}" style="font-size: 0.7rem;">
                    ${at.status}
                  </span>
                </div>

                <!-- Destaque do Espaço Ocupado e Janela de Tempo -->
                <div style="background: var(--bg-subtle); border-left: 3px solid var(--primary-teal); padding: 8px 10px; border-radius: var(--radius-xs); margin-bottom: 8px; font-size: 0.8rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                    <span style="font-weight: 700; color: var(--primary-teal);">💺 ${espacoNome}</span>
                    <span style="font-weight: 800; color: var(--text-primary); font-family: monospace;">${horaInicio} às ${horaFim} (${duracaoTexto})</span>
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary);">
                    👤 <strong>Cliente atendido:</strong> ${at.cliente_nome || 'Isabela Santos'}
                  </div>
                </div>

                <!-- Serviço e Taxa do Salão -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 0.8rem;">
                  <span style="color: var(--text-secondary); max-width: 65%;">
                    ✂️ <strong>Procedimento:</strong> ${at.servico}
                  </span>
                  <div style="text-align: right;">
                    <span class="text-xs text-muted" style="display: block;">Aluguel do Espaço</span>
                    <strong class="text-emerald" style="color: #16A34A !important; font-size: 0.95rem;">+ R$ ${parseFloat(at.taxa_salao || 15).toFixed(2)}</strong>
                  </div>
                </div>

                <!-- Ações do Salão -->
                <div style="display: flex; gap: 8px; border-top: 1px dashed var(--border-subtle); padding-top: 8px;">
                  <button class="btn btn-ghost btn-sm" style="flex: 1; font-size: 0.75rem; padding: 4px;" onclick="UI.showToast('Canal direto com ${at.freelancer_nome || 'a profissional'} aberto!', 'info')">
                    💬 Mensagem
                  </button>
                  <button class="btn btn-ghost btn-sm" style="flex: 1; font-size: 0.75rem; padding: 4px;" onclick="UI.openReciboModal(${at.id_atendimento})">
                    📄 Recibo
                  </button>
                  ${at.status !== 'Concluído' ? `
                    <button class="btn btn-ghost btn-sm" style="color: var(--accent-coral); font-size: 0.75rem; padding: 4px;" onclick="window.confirmarCancelamentoAgenda(${at.id_atendimento})">
                      Liberar
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}

        ${reservasDoDia.length === 0 ? `
          <div class="calendar-empty-state">
            <div class="calendar-empty-icon">💺</div>
            <h4 class="font-bold text-sm" style="margin-bottom: 4px; color: var(--text-primary);">Nenhum espaço ocupado para este dia</h4>
            <p class="text-xs text-muted" style="margin-bottom: 12px; max-width: 280px; margin-left: auto; margin-right: auto; line-height: 1.4;">
              Todas as cadeiras e macas cadastradas estão disponíveis para reserva por profissionais autônomas.
            </p>
            ${selectedDateIso !== '2026-10-19' ? `
              <button class="btn btn-sm btn-outline-teal" onclick="window.goToSalaoAgendaToday()">
                Voltar para Hoje (19/10)
              </button>
            ` : ''}
          </div>
        ` : ''}
      </div>

      <!-- SEÇÃO DE GESTÃO DA INFRAESTRUTURA E ESPAÇOS FÍSICOS -->
      <div style="border-top: 1px solid var(--border-light); padding-top: 18px; margin-top: 8px;">
        <!-- Receita Passiva Banner -->
        <div class="passive-income-banner" style="margin-bottom: 16px;">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-emerald" style="text-transform: uppercase; letter-spacing: 0.5px;">RECEITA PASSIVA (MÊS)</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald-dark)" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          </div>
          <div class="passive-income-val" style="color: #16A34A !important;">R$ ${parseFloat(salaoData.receitaPassivaMes || 1250).toFixed(2)}</div>
          <div class="flex justify-between items-center" style="font-size: 0.75rem;">
            <span class="badge badge-emerald">▲ +12.5% vs mês anterior</span>
            <span class="text-secondary font-semibold">Repasse programado: 05/11</span>
          </div>
        </div>

        <!-- Formulário Rápido de Novo Anúncio de Espaço -->
        <div class="surface-card" style="margin-bottom: 16px;">
          <div class="flex justify-between items-center" style="margin-bottom: 10px;">
            <h3 class="font-extrabold text-sm text-primary" style="margin: 0;">Anunciar Novo Espaço Ocioso</h3>
            <span class="badge badge-teal" style="font-size: 0.65rem;">Lei nº 13.352/2016</span>
          </div>

          <form onsubmit="event.preventDefault(); window.handleNovoEspacoRapido();">
            <div class="form-group" style="margin-bottom: 8px;">
              <label class="form-label">Qual a infraestrutura?</label>
              <input type="text" id="quick-space-type" placeholder="Ex: Cadeira de Corte, Maca de Estética..." required />
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label">Valor de Locação por Hora (<span style="color: #16A34A; font-weight: 700;">R$/h</span>)</label>
              <input type="number" step="0.50" id="quick-space-price" placeholder="Ex: 25.00" required />
            </div>

            <button type="submit" class="btn btn-emerald">
              + Colocar Espaço na Rede
            </button>
          </form>
        </div>

        <!-- Lista de Espaços Cadastrados -->
        <div class="flex justify-between items-center" style="margin-bottom: 10px;">
          <h3 class="font-extrabold text-sm text-primary" style="margin: 0;">Espaços Cadastrados (${meusEspacos.length})</h3>
          <span class="text-xs text-muted">Toque no status para alterar</span>
        </div>

        <div class="espacos-ativos-list" style="margin-bottom: 20px;">
          ${meusEspacos.map(esp => `
            <div class="space-item-card">
              <div class="flex items-center gap-3">
                <div class="space-thumb">
                  💺
                </div>
                <div>
                  <h4 class="font-bold text-sm text-primary">${esp.tipo_espaco}</h4>
                  <div class="text-xs font-bold" style="margin-top: 2px;">
                    <span style="color: #16A34A !important; font-weight: 800; font-size: 0.9rem;">R$ ${parseFloat(esp.preco_hora).toFixed(2)}</span>
                    <span style="color: var(--text-muted); font-size: 0.75rem; font-weight: 500;">/h</span>
                  </div>
                  <span class="text-xs text-muted" style="display: block; margin-top: 2px;">
                    ${esp.status === 'Reservado' ? `🕒 Em uso / reservado` : `👁 Disponível para autônomas`}
                  </span>
                </div>
              </div>

              <div class="text-right">
                <span class="badge ${esp.status === 'Disponível' ? 'badge-emerald' : 'badge-amber'}" onclick="window.appState.toggleEspacoStatus(${esp.id_espaco})" style="cursor: pointer;" title="Clique para alternar disponibilidade">
                  ${esp.status}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
};

// =============================================================================
// Controladores de Navegação da Agenda do Salão
// =============================================================================

window.selectSalaoAgendaDate = function(iso) {
  window.selectedSalaoAgendaDateIso = iso;
  window.salaoAgendaAnchorDateIso = iso;
  if (window.router) {
    window.router.renderCurrentRoute();
  }
};

window.navigateSalaoAgendaWeek = function(direction) {
  const base = window.salaoAgendaAnchorDateIso || window.selectedSalaoAgendaDateIso || '2026-10-19';
  const [y, m, d] = base.split('-').map(Number);
  const current = new Date(y, m - 1, d);

  current.setDate(current.getDate() + (direction * 7));

  const cy = current.getFullYear();
  const cm = String(current.getMonth() + 1).padStart(2, '0');
  const cd = String(current.getDate()).padStart(2, '0');

  const newIso = `${cy}-${cm}-${cd}`;
  window.salaoAgendaAnchorDateIso = newIso;
  window.selectedSalaoAgendaDateIso = newIso;

  if (window.router) {
    window.router.renderCurrentRoute();
  }
};

window.goToSalaoAgendaToday = function() {
  window.selectedSalaoAgendaDateIso = '2026-10-19';
  window.salaoAgendaAnchorDateIso = '2026-10-19';
  if (window.router) {
    window.router.renderCurrentRoute();
  }
};

// =============================================================================
// Modal do Mês Completo do Salão
// =============================================================================

window.salaoModalMonthState = {
  year: 2026,
  month: 9 // Outubro (0-indexed)
};

window.openSalaoMonthCalendarModal = function() {
  const [selYear, selMonth] = (window.selectedSalaoAgendaDateIso || '2026-10-19').split('-').map(Number);
  window.salaoModalMonthState.year = selYear;
  window.salaoModalMonthState.month = selMonth - 1;
  window.renderSalaoMonthCalendarModalContent();
};

window.navSalaoMonthModal = function(direction) {
  let m = window.salaoModalMonthState.month + direction;
  let y = window.salaoModalMonthState.year;

  if (m < 0) {
    m = 11;
    y--;
  } else if (m > 11) {
    m = 0;
    y++;
  }

  window.salaoModalMonthState.year = y;
  window.salaoModalMonthState.month = m;
  window.renderSalaoMonthCalendarModalContent();
};

window.renderSalaoMonthCalendarModalContent = function() {
  const { year, month } = window.salaoModalMonthState;
  const mesesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const state = window.appState.getState();
  const salaoData = state.rolesData.salao || {};
  const salaoId = salaoData.id_usuario || 3;
  const todosAtendimentos = state.atendimentos || [];
  const diasComReservas = new Set();

  todosAtendimentos.forEach(a => {
    if (a.status === 'Cancelado' || a.status === 'Recusado') return;
    const matchSalao = (a.tipo === 'No Salão') || (a.id_salao === salaoId) || (a.salao_nome && a.salao_nome.toLowerCase().includes('elegance'));
    if (!matchSalao) return;

    let iso = a.data_agendamento;
    if (!iso && a.data) {
      const m = a.data.match(/(\d{4}-\d{2}-\d{2})/);
      if (m) iso = m[1];
      else if (a.data.toLowerCase().includes('hoje')) iso = '2026-10-19';
    }
    if (iso) diasComReservas.add(iso);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  let daysHtml = '';
  for (let i = 0; i < firstDay; i++) {
    daysHtml += `<div class="calendar-day disabled" style="opacity: 0.15;"></div>`;
  }

  for (let d = 1; d <= totalDays; d++) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    const iso = `${year}-${mm}-${dd}`;

    const isToday = iso === '2026-10-19';
    const isSelected = iso === window.selectedSalaoAgendaDateIso;
    const hasEvents = diasComReservas.has(iso);

    daysHtml += `
      <div 
        class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEvents ? 'has-events' : ''}"
        onclick="window.selectDateFromSalaoMonthModal('${iso}')"
        title="${d} de ${mesesNomes[month]} ${hasEvents ? '(Com reservas de espaço)' : ''}"
      >
        ${d}
      </div>
    `;
  }

  const modalHtml = `
    <div style="padding: 4px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h3 class="modal-title" style="margin: 0;">Calendário de Espaços do Salão</h3>
        <button class="btn-ghost" style="padding: 4px;" onclick="UI.closeModal()">✕</button>
      </div>

      <p class="text-xs text-muted" style="margin-top: -6px; margin-bottom: 16px;">
        Selecione uma data para inspecionar as reservas e a ocupação da infraestrutura.
      </p>

      <div class="mini-calendar-container" style="margin-bottom: 16px;">
        <div class="calendar-header">
          <button class="calendar-nav-btn" onclick="window.navSalaoMonthModal(-1)">‹</button>
          <span class="calendar-header-title">${mesesNomes[month]} ${year}</span>
          <button class="calendar-nav-btn" onclick="window.navSalaoMonthModal(1)">›</button>
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
          <span class="text-secondary">Ponto verde: <strong>Dias com espaços reservados por autônomas</strong></span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid var(--brand-black); display: inline-block;"></span>
          <span class="text-secondary">Borda preta: <strong>Data atual (19/10/2026)</strong></span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 12px; height: 12px; border-radius: 50%; background: var(--brand-black); color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: bold;">✓</span>
          <span class="text-secondary">Preenchido: <strong>Dia selecionado no cronograma</strong></span>
        </div>
      </div>

      <div style="margin-top: 16px; display: flex; gap: 8px;">
        <button class="btn btn-outline-teal flex-1" onclick="window.selectDateFromSalaoMonthModal('2026-10-19')">
          Ir para Hoje
        </button>
        <button class="btn btn-secondary flex-1" onclick="UI.closeModal()">
          Fechar
        </button>
      </div>
    </div>
  `;

  if (window.UI.openModal) {
    window.UI.openModal(modalHtml);
  } else if (window.UI.showModal) {
    window.UI.showModal(modalHtml);
  }
};

window.selectDateFromSalaoMonthModal = function(iso) {
  window.selectSalaoAgendaDate(iso);
  if (window.UI && window.UI.closeModal) {
    window.UI.closeModal();
  }
};

window.handleNovoEspacoRapido = function() {
  const tipo = document.getElementById('quick-space-type').value;
  const preco = document.getElementById('quick-space-price').value;

  if (!tipo || !preco) return;

  window.appState.adicionarEspaco({
    tipo_espaco: tipo,
    preco_hora: preco
  });

  UI.showToast(`Espaço "${tipo}" anunciado na rede!`, 'success');
  window.router.renderCurrentRoute();
};

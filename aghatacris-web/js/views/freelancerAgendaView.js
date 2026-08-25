/**
 * AGhataCris - Freelancer Agenda View
 * Corresponds to Figura 7 (Visão da Profissional: Controle de Agenda e Compromissos)
 */

window.renderFreelancerAgendaView = function() {
  const selectedDay = window.selectedAgendaDay || 18;

  const agendaSlots = [
    {
      hora: '09:00 AM',
      cliente: 'Juliana Costa',
      servico: 'Corte & Escova',
      local: 'Salão Beauty Lounge',
      status: 'Concluído',
      badgeClass: 'badge-emerald'
    },
    {
      hora: '11:30 AM',
      cliente: 'Mariana Silva',
      servico: 'Maquiagem Social',
      local: 'Atendimento Domicílio',
      status: 'Pendente',
      badgeClass: 'badge-amber'
    },
    {
      hora: '02:00 PM',
      cliente: 'Ricardo Alves',
      servico: 'Limpeza de Pele',
      local: 'Salão Beauty Lounge',
      status: 'Confirmado',
      badgeClass: 'badge-teal'
    }
  ];

  const days = [
    { name: 'SEG', num: 16 },
    { name: 'TER', num: 17 },
    { name: 'QUA', num: 18 },
    { name: 'QUI', num: 19 },
    { name: 'SEX', num: 20 }
  ];

  return `
    <div class="view-content-padded animate-fade-in">
      <div class="calendar-month-header">
        <h2 class="calendar-month-title">Outubro, 2026</h2>
        <button class="btn-ghost" onclick="UI.showToast('Visualização de mês inteiro', 'info')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </button>
      </div>

      <!-- Week Days Strip -->
      <div class="calendar-week-strip">
        ${days.map(d => `
          <div class="calendar-day-card ${d.num === selectedDay ? 'selected' : ''}" onclick="window.selectAgendaDay(${d.num})">
            <span class="day-name">${d.name}</span>
            <span class="day-number">${d.num}</span>
          </div>
        `).join('')}
      </div>

      <!-- Timeline Appointments -->
      <div class="timeline-container">
        ${agendaSlots.map(slot => `
          <div class="timeline-event-card">
            <div class="timeline-time-box">${slot.hora}</div>
            <div class="timeline-card-content">
              <div class="flex justify-between items-center" style="margin-bottom: 6px;">
                <h4 class="font-bold text-sm text-primary">${slot.cliente}</h4>
                <span class="badge ${slot.badgeClass}">${slot.status}</span>
              </div>
              <p class="text-xs font-semibold text-secondary" style="margin-bottom: 2px;">✂️ ${slot.servico}</p>
              <p class="text-xs text-muted" style="margin-bottom: 12px;">📍 ${slot.local}</p>

              <div class="flex gap-2">
                <button class="btn btn-secondary btn-sm" onclick="UI.showToast('Abrindo chat com ${slot.cliente}', 'info')">
                  💬 Mensagem
                </button>
                <button class="btn btn-ghost btn-sm" style="color: var(--accent-coral);" onclick="UI.showToast('Compromisso cancelado', 'alert')">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

window.selectedAgendaDay = 18;

window.selectAgendaDay = function(num) {
  window.selectedAgendaDay = num;
  window.router.renderCurrentRoute();
};

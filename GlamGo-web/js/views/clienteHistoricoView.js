/**
 * AGhataCris - Cliente Histórico View
 * Corresponds to Figura 5 (Visão da Cliente: Histórico de Atendimentos)
 */

window.renderClienteHistoricoView = function() {
  const state = window.appState.getState();
  const historico = state.atendimentos.filter(a => a.status === 'Concluído');

  return `
    <div class="view-content-padded animate-fade-in">
      <div style="margin-bottom: 20px;">
        <span class="text-xs font-bold text-muted" style="text-transform: uppercase; letter-spacing: 0.5px;">SEU PERCURSO</span>
        <h2 class="view-page-title">Últimos Atendimentos</h2>
      </div>

      <div class="history-list">
        ${historico.map(at => `
          <div class="history-card">
            <div class="history-header">
              <div class="history-pro-info">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
                <div>
                  <h4 class="font-bold text-sm text-primary">${at.freelancer_nome}</h4>
                  <span class="text-xs text-muted">${at.tipo}</span>
                </div>
              </div>
              <span class="badge badge-emerald">Concluído</span>
            </div>

            <div class="history-body">
              <div>
                <div class="text-xs text-muted" style="margin-bottom: 2px;">📅 ${at.data}</div>
                <div class="history-service">✂️ ${at.servico}</div>
              </div>
              <div class="history-price">R$ ${at.valor_total.toFixed(2)}</div>
            </div>

            <div class="history-actions">
              <button class="download-receipt-btn" onclick="UI.openReciboModal(${at.id_atendimento})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>Download Recibo</span>
              </button>
              <span style="color: var(--text-muted); font-size: 0.9rem;">›</span>
            </div>
          </div>
        `).join('')}

        ${historico.length === 0 ? `
          <div class="text-center" style="padding: 32px; color: var(--text-muted);">
            Nenhum atendimento finalizado ainda.
          </div>
        ` : ''}
      </div>
    </div>
  `;
};

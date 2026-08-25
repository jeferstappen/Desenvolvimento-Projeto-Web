/**
 * AGhataCris - Freelancer Espaços View (Salões Parceiros Ociosos)
 * Corresponds to RF08 (Listar espaços ociosos por proximidade) e RF09 (Reservar com prazo limite)
 */

window.renderFreelancerEspacosView = function() {
  const state = window.appState.getState();
  const espacos = state.espacos;

  return `
    <div class="view-content-padded animate-fade-in">
      <div style="margin-bottom: 16px;">
        <h2 class="view-page-title">Salões & Espaços Parceiros</h2>
        <p class="view-page-subtitle">Locação fracionada por hora via Lei do Salão Parceiro</p>
      </div>

      <div class="espacos-list">
        ${espacos.map(esp => `
          <div class="surface-card flex items-center justify-between gap-3" style="margin-bottom: 12px; padding: 14px;">
            <img src="${esp.foto}" alt="${esp.tipo_espaco}" style="width: 58px; height: 58px; border-radius: var(--radius-sm); object-fit: cover;" />
            <div style="flex: 1; min-width: 0;">
              <div class="flex items-center gap-2">
                <h4 class="font-bold text-sm text-primary" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${esp.tipo_espaco}</h4>
                <span class="badge ${esp.status === 'Disponível' ? 'badge-emerald' : 'badge-amber'}">${esp.status}</span>
              </div>
              <p class="text-xs text-secondary">${esp.nome_salao}</p>
              <div class="flex items-center gap-3" style="margin-top: 4px; font-size: 0.75rem;">
                <span class="text-muted">📍 ${esp.distanciaKm} km</span>
                <span class="font-bold text-emerald">R$ ${esp.preco_hora.toFixed(2)}/hora</span>
              </div>
            </div>
            <div>
              ${esp.status === 'Disponível' ? `
                <button class="btn btn-primary btn-sm" onclick="UI.openReservaEspacoModal(${esp.id_espaco})">
                  Reservar
                </button>
              ` : `
                <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.6;">
                  Ocupado
                </button>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

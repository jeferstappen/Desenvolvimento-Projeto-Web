/**
 * AGhataCris - Cliente Favoritas View
 * Corresponds to Figura 4 (Visão da Cliente: Lista de Profissionais Favoritas)
 */

window.renderClienteFavoritasView = function() {
  const state = window.appState.getState();
  const favoritas = state.profissionais.filter(p => p.isFavorita);

  return `
    <div class="view-content-padded animate-fade-in">
      <div class="flex justify-between items-center" style="margin-bottom: 16px;">
        <h2 class="view-page-title" style="margin-bottom: 0;">Profissionais Favoritas</h2>
        <span class="badge badge-teal">${favoritas.length} Salvas</span>
      </div>

      <div class="favorites-list">
        ${favoritas.map(fav => `
          <div class="favorite-card">
            <img src="${fav.avatar}" alt="${fav.nome_completo}" class="favorite-avatar" />
            <h3 class="favorite-name">${fav.nome_completo}</h3>
            <div class="favorite-rating">★ ${fav.avaliacao.toFixed(1)}</div>
            <p class="favorite-specialty">${fav.especialidade}</p>

            <button class="btn btn-primary" style="margin-top: 6px;" onclick="UI.openChamarModal(${fav.id_usuario})">
              📅 Agendar Novamente
            </button>
          </div>
        `).join('')}

        <!-- Callout: Encontre mais profissionais -->
        <div class="explore-more-box">
          <h4 class="explore-title">Encontre mais profissionais</h4>
          <p class="explore-desc">Continue explorando nossos serviços premium para encontrar sua próxima profissional favorita.</p>
          <button class="btn btn-outline-teal" onclick="window.location.hash = '#/cliente/home'">
            Explorar serviços →
          </button>
        </div>
      </div>
    </div>
  `;
};

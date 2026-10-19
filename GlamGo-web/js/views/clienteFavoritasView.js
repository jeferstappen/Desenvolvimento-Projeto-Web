/**
 * AGhataCris - Cliente Favoritas View
 * Corresponds to Figura 4 (Visão da Cliente: Lista de Profissionais e Salões Favoritos)
 */

window.renderClienteFavoritasView = function() {
  const state = window.appState.getState();
  const filterType = window.clienteFavoritasTab || 'todos';

  const proFavoritas = (state.profissionais || []).filter(p => p.isFavorita);
  const salaoFavoritos = (window.getSaloesList ? window.getSaloesList() : []).filter(s => s.isFavorita);

  const totalCount = proFavoritas.length + salaoFavoritos.length;

  return `
    <div class="view-content-padded animate-fade-in">
      <div class="flex justify-between items-center" style="margin-bottom: 12px;">
        <div>
          <h2 class="view-page-title" style="margin-bottom: 2px;">Seus Favoritos</h2>
          <p class="text-xs text-muted">Profissionais e salões parceiros salvos por você</p>
        </div>
        <span class="badge badge-teal">${totalCount} Salvos</span>
      </div>

      <!-- Tabs de Filtro de Favoritos -->
      <div class="filter-pills-bar" style="margin-bottom: 18px;">
        <button class="filter-pill ${filterType === 'todos' ? 'active' : ''}" onclick="window.setFavoritasTab('todos')">
          ✨ Todos (${totalCount})
        </button>
        <button class="filter-pill ${filterType === 'pros' ? 'active' : ''}" onclick="window.setFavoritasTab('pros')">
          💇‍♀️ Profissionais (${proFavoritas.length})
        </button>
        <button class="filter-pill ${filterType === 'saloes' ? 'active' : ''}" onclick="window.setFavoritasTab('saloes')">
          🏢 Salões (${salaoFavoritos.length})
        </button>
      </div>

      <div class="favorites-list">
        ${(filterType === 'todos' || filterType === 'pros') ? proFavoritas.map(fav => `
          <div class="favorite-card">
            <div style="position: absolute; top: 12px; right: 12px;">
              <button class="favorite-heart-btn is-favorited" 
                      style="width: 34px; height: 34px;"
                      onclick="window.toggleFavoritePro(${fav.id_usuario}); window.router.renderCurrentRoute();" 
                      title="Remover dos favoritos">
                <svg viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="2" style="width: 17px; height: 17px;">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
            <img src="${fav.avatar}" alt="${fav.nome_completo}" class="favorite-avatar" />
            <h3 class="favorite-name">${fav.nome_completo}</h3>
            <div class="favorite-rating">★ ${parseFloat(fav.avaliacao || 5).toFixed(1)}</div>
            <p class="favorite-specialty">${fav.especialidade}</p>

            <button class="btn btn-primary" style="margin-top: 6px; width: 100%;" onclick="UI.openChamarModal(${fav.id_usuario})">
              📅 Agendar Novamente
            </button>
          </div>
        `).join('') : ''}

        ${(filterType === 'todos' || filterType === 'saloes') ? salaoFavoritos.map(salao => `
          <div class="favorite-card">
            <div style="position: absolute; top: 12px; right: 12px;">
              <button class="favorite-heart-btn is-favorited" 
                      style="width: 34px; height: 34px;"
                      onclick="window.toggleFavoriteSalao(${salao.id_usuario}); window.router.renderCurrentRoute();" 
                      title="Remover dos favoritos">
                <svg viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="2" style="width: 17px; height: 17px;">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
            <img src="${salao.avatar}" alt="${salao.nome_completo}" class="favorite-avatar" style="border-radius: var(--radius-sm);" />
            <h3 class="favorite-name">🏢 ${salao.nome_completo}</h3>
            <div class="favorite-rating">★ ${parseFloat(salao.avaliacao || 5).toFixed(1)}</div>
            <p class="favorite-specialty">${salao.endereco}</p>

            <button class="btn btn-primary" style="margin-top: 6px; width: 100%;" onclick="UI.openSalaoModal(${salao.id_usuario})">
              🏢 Ver Espaços e Agendar
            </button>
          </div>
        `).join('') : ''}

        ${totalCount === 0 ? `
          <div class="surface-card text-center" style="padding: 32px 20px; color: var(--text-muted); margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 8px;">🤍</div>
            <h4 class="font-bold text-base text-primary" style="margin-bottom: 4px;">Nenhum favorito salvo ainda</h4>
            <p class="text-xs text-secondary" style="margin-bottom: 16px;">Toque no ícone de coração nos cards de profissionais ou salões para adicioná-los aos seus favoritos.</p>
            <button class="btn btn-primary btn-sm" onclick="window.location.hash = '#/cliente/home'">
              Explorar Profissionais e Salões
            </button>
          </div>
        ` : ''}

        <!-- Callout: Encontre mais profissionais -->
        <div class="explore-more-box">
          <h4 class="explore-title">Encontre mais no mapa</h4>
          <p class="explore-desc">Continue explorando nossos serviços e salões credenciados para encontrar seus parceiros de beleza ideais.</p>
          <button class="btn btn-outline-teal" onclick="window.location.hash = '#/cliente/home'">
            Explorar no mapa →
          </button>
        </div>
      </div>
    </div>
  `;
};

window.clienteFavoritasTab = 'todos';
window.setFavoritasTab = function(tab) {
  window.clienteFavoritasTab = tab;
  window.router.renderCurrentRoute();
};

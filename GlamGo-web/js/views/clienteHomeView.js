/**
 * AGhataCris - Cliente Home View (Descoberta & Mapa com Profissionais e Salões Parceiros)
 * Corresponde à Figura 3 (Visão da Cliente: Tela Inicial de Mapa e Descoberta)
 */

window.renderClienteHomeView = function() {
  const state = window.appState.getState();
  const modalidade = state.filtros.modalidade || 'todos';

  // 1. Obter profissionais e salões
  let allPros = (state.profissionais && state.profissionais.length > 0)
    ? state.profissionais
    : [
        {
          id_usuario: 101,
          nome_completo: 'Clara Mendes',
          especialidade: 'Design de Sobrancelhas',
          avaliacao: 4.8,
          distanciaKm: 0.8,
          precoEstimado: 75.00,
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          modalidade: 'Ambos'
        },
        {
          id_usuario: 102,
          nome_completo: 'Bia Oliveira',
          especialidade: 'Maquiagem Social',
          avaliacao: 5.0,
          distanciaKm: 1.4,
          precoEstimado: 180.00,
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
          modalidade: 'Domicilio'
        },
        {
          id_usuario: 103,
          nome_completo: 'Juliana Costa',
          especialidade: 'Manicure Gel & Nail Art',
          avaliacao: 5.0,
          distanciaKm: 2.1,
          precoEstimado: 85.00,
          avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
          modalidade: 'Salao'
        },
        {
          id_usuario: 104,
          nome_completo: 'Beatriz Ramos',
          especialidade: 'Hair Stylist & Coloração',
          avaliacao: 5.0,
          distanciaKm: 3.5,
          precoEstimado: 220.00,
          avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
          modalidade: 'Ambos'
        }
      ];

  const saloes = window.getSaloesList ? window.getSaloesList() : [];

  // Filtragem por modalidade
  let prosExibidas = allPros;
  if (modalidade === 'domicilio') {
    prosExibidas = allPros.filter(p => p.modalidade === 'Domicilio' || p.modalidade === 'Ambos');
  } else if (modalidade === 'salao') {
    prosExibidas = allPros.filter(p => p.modalidade === 'Salao' || p.modalidade === 'Ambos');
  }

  // Filtragem por busca
  if (state.filtros.busca) {
    const q = state.filtros.busca.toLowerCase();
    prosExibidas = prosExibidas.filter(p => 
      (p.nome_completo && p.nome_completo.toLowerCase().includes(q)) || 
      (p.especialidade && p.especialidade.toLowerCase().includes(q))
    );
  }

  const countDomicilio = allPros.filter(p => p.modalidade === 'Domicilio' || p.modalidade === 'Ambos').length;
  const countSalao = saloes.length + allPros.filter(p => p.modalidade === 'Salao' || p.modalidade === 'Ambos').length;
  const countTodos = allPros.length + saloes.length;

  return `
    <div class="client-map-view animate-fade-in">
      <!-- Floating Map Header with Search & Filter -->
      <div class="map-header-floating">
        <div class="map-search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-teal)" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="map-search-input" value="${state.filtros.busca || ''}" placeholder="Qual serviço ou salão você procura?" oninput="window.handleSearchFilter(this.value)" />
        </div>

        <div class="filter-pills-bar">
          <button class="filter-pill ${modalidade === 'todos' ? 'active' : ''}" onclick="window.handleModalidadeFilter('todos')">
            ✨ Todos (${countTodos})
          </button>
          <button class="filter-pill ${modalidade === 'domicilio' ? 'active' : ''}" onclick="window.handleModalidadeFilter('domicilio')">
            🏠 Em Domicílio (${countDomicilio})
          </button>
          <button class="filter-pill ${modalidade === 'salao' ? 'active' : ''}" onclick="window.handleModalidadeFilter('salao')">
            🏢 No Salão (${countSalao})
          </button>
        </div>
      </div>

      <!-- Interactive Map Area -->
      <div class="map-container-box">
        <div id="leaflet-map"></div>
      </div>

      <!-- Bottom Sheet with Nearby Pros & Salons -->
      <div class="map-bottom-sheet">
        <div class="modal-handle" style="margin-bottom: 8px;"></div>
        
        ${modalidade === 'salao' ? `
          <!-- Visão Focada em Salões Parceiros -->
          <div class="sheet-header-title">
            <div>
              <h3 class="text-base font-extrabold text-primary">Salões Parceiros Credenciados</h3>
              <p class="text-xs text-muted">Lei nº 13.352 • Infraestrutura Próxima para Pronto Atendimento</p>
            </div>
            <span class="badge badge-teal">🏢 ${saloes.length} Salões</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${saloes.map(salao => `
              <div class="surface-card" style="padding: 12px; border: 1px solid var(--border-light); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); cursor: pointer;" onclick="UI.openSalaoModal(${salao.id_usuario})">
                <div class="flex gap-3 items-center">
                  <img src="${salao.avatar}" alt="${salao.nome_completo}" style="width: 72px; height: 72px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-light);" />
                  <div style="flex: 1;">
                    <div class="flex justify-between items-start">
                      <strong style="font-size: 0.95rem; color: var(--text-primary);">${salao.nome_completo}</strong>
                      <div class="flex items-center gap-1">
                        <span class="badge badge-emerald" style="font-size: 0.75rem;">★ ${salao.avaliacao}</span>
                        <button class="favorite-heart-btn ${salao.isFavorita ? 'is-favorited' : ''}" 
                                style="width: 32px; height: 32px; box-shadow: none;"
                                onclick="event.stopPropagation(); window.toggleFavoriteSalao(${salao.id_usuario}, this)" 
                                title="${salao.isFavorita ? 'Remover dos favoritos' : 'Favoritar salão parceiro'}">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div class="text-xs text-secondary" style="margin: 2px 0;">${salao.especialidade}</div>
                    <div class="flex items-center gap-2 text-xs text-muted">
                      <span>📍 ${salao.distanciaKm} km de você</span>
                      <span>•</span>
                      <span class="text-teal font-bold">${salao.espacosDisponiveis.length} espaços livres</span>
                    </div>
                  </div>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 10px;">
                  <button class="btn btn-sm btn-primary" style="flex: 1; font-size: 0.75rem;" onclick="event.stopPropagation(); UI.openSalaoModal(${salao.id_usuario})">
                    🏢 Ver Espaços e Agendar
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="sheet-header-title" style="margin-top: 10px;">
            <div>
              <h4 class="text-sm font-bold text-primary">Profissionais que Atendem em Salão</h4>
              <p class="text-xs text-muted">Profissionais autônomas prontas para atendimento no salão</p>
            </div>
          </div>
        ` : ''}

        ${modalidade === 'todos' ? `
          <!-- Visão Todos: Destaque de Profissionais e Salões -->
          <div class="sheet-header-title">
            <div>
              <h3 class="text-base font-extrabold text-primary">Profissionais Disponíveis</h3>
              <p class="text-xs text-muted">Raio de 15km • Pronto Atendimento em Tempo Real</p>
            </div>
            <span class="badge badge-emerald">GPS Ativo</span>
          </div>
        ` : ''}

        ${modalidade === 'domicilio' ? `
          <div class="sheet-header-title">
            <div>
              <h3 class="text-base font-extrabold text-primary">Atendimento em Domicílio</h3>
              <p class="text-xs text-muted">Profissionais que realizam o serviço na sua residência</p>
            </div>
            <span class="badge badge-teal">🏠 Domicílio</span>
          </div>
        ` : ''}

        <!-- Lista de Profissionais -->
        <div class="pros-list">
          ${prosExibidas.map(pro => `
            <div class="pro-card" style="cursor: pointer;" onclick="UI.openChamarModal(${pro.id_usuario})">
              <img src="${pro.avatar}" alt="${pro.nome_completo}" class="pro-avatar" />
              <div class="pro-info">
                <div class="pro-name">${pro.nome_completo}</div>
                <div class="pro-specialty">${pro.especialidade || 'Estética & Beleza'}</div>
                <div class="pro-meta">
                  <span class="pro-rating">★ ${parseFloat(pro.avaliacao || 5).toFixed(1)}</span>
                  <span class="pro-distance">📍 ${pro.distanciaKm} km</span>
                  <span class="text-xs font-bold text-teal">A partir de R$ ${pro.precoEstimado.toFixed(0)}</span>
                </div>
              </div>
              <div class="flex items-center gap-2" style="flex-shrink: 0;">
                <button class="favorite-heart-btn ${pro.isFavorita ? 'is-favorited' : ''}" 
                        onclick="event.stopPropagation(); window.toggleFavoritePro(${pro.id_usuario}, this)" 
                        title="${pro.isFavorita ? 'Remover dos favoritos' : 'Favoritar profissional'}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); UI.openChamarModal(${pro.id_usuario})">
                  Agendar
                </button>
              </div>
            </div>
          `).join('')}

          ${prosExibidas.length === 0 ? `
            <div class="text-center" style="padding: 24px; color: var(--text-muted);">
              Nenhum profissional encontrado para os filtros selecionados.
            </div>
          ` : ''}
        </div>

        ${modalidade === 'todos' ? `
          <!-- Seção de Salões Parceiros no modo 'Todos' -->
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-light);">
            <div class="sheet-header-title">
              <div>
                <h3 class="text-base font-extrabold text-primary">🏢 Salões Parceiros Credenciados</h3>
                <p class="text-xs text-muted">Espaços físicos verificados com cadeiras livres para atendimento</p>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${saloes.map(salao => `
                <div class="surface-card" style="padding: 10px 12px; border: 1px solid var(--border-light); border-radius: var(--radius-sm); cursor: pointer;" onclick="UI.openSalaoModal(${salao.id_usuario})">
                  <div class="flex justify-between items-center">
                    <div>
                      <strong style="font-size: 0.9rem; color: var(--text-primary);">${salao.nome_completo}</strong>
                      <div class="text-xs text-muted">📍 ${salao.endereco} • ${salao.distanciaKm} km</div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button class="favorite-heart-btn ${salao.isFavorita ? 'is-favorited' : ''}" 
                              style="width: 32px; height: 32px; box-shadow: none;"
                              onclick="event.stopPropagation(); window.toggleFavoriteSalao(${salao.id_usuario}, this)" 
                              title="${salao.isFavorita ? 'Remover dos favoritos' : 'Favoritar salão parceiro'}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                      <span class="badge badge-teal" style="font-size: 0.7rem;">Ver Espaço ›</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    </div>
  `;
};

window.handleModalidadeFilter = function(modalidade) {
  window.appState.setFilterModalidade(modalidade);
  window.router.renderCurrentRoute();
};

window.handleSearchFilter = function(q) {
  window.appState.setSearchQuery(q);
  window.router.renderCurrentRoute();
};

window.initMapIfPresent = function() {
  const mapContainer = document.getElementById('leaflet-map');
  if (!mapContainer) return;

  if (typeof L === 'undefined') {
    mapContainer.innerHTML = `
      <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%); display: flex; align-items: center; justify-content: center; color: #1E293B; font-weight: 700;">
        📍 Mapa de Geolocalização Integrado (Raio de 15km)
      </div>
    `;
    return;
  }

  if (window.activeLeafletMap) {
    window.activeLeafletMap.remove();
  }

  const map = L.map('leaflet-map', {
    zoomControl: false,
    attributionControl: false
  }).setView([-23.561684, -46.655981], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);

  // Pin do Cliente
  const userIcon = L.divIcon({
    className: 'custom-user-pin',
    html: `<div style="width: 16px; height: 16px; background: #0D9488; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 0 10px rgba(13,148,136,0.8);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  L.marker([-23.561684, -46.655981], { icon: userIcon })
    .addTo(map)
    .bindPopup('<b>Você está aqui</b><br>Raio de busca ativo')
    .openPopup();

  // Círculo de 15km / radar visual
  L.circle([-23.561684, -46.655981], {
    color: '#0D9488',
    fillColor: '#0D9488',
    fillOpacity: 0.08,
    radius: 1200
  }).addTo(map);

  // Pins das Profissionais
  const pros = window.appState.getState().profissionais || [];
  pros.forEach(pro => {
    if (!pro.latitude || !pro.longitude) return;
    const proIcon = L.divIcon({
      className: 'custom-pro-pin',
      html: `
        <div style="background: #10B981; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2); white-space: nowrap; cursor: pointer;">
          ★ ${parseFloat(pro.avaliacao || 5).toFixed(1)} ${pro.nome_completo.split(' ')[0]}
        </div>
      `,
      iconAnchor: [30, 15]
    });

    const marker = L.marker([pro.latitude, pro.longitude], { icon: proIcon }).addTo(map);
    marker.on('click', () => {
      UI.openChamarModal(pro.id_usuario);
    });
  });

  // Pins dos Salões Parceiros Credenciados
  const saloes = window.getSaloesList ? window.getSaloesList() : [];
  saloes.forEach(salao => {
    if (!salao.latitude || !salao.longitude) return;
    const salaoIcon = L.divIcon({
      className: 'custom-salao-pin',
      html: `
        <div style="background: #0284C7; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.25); white-space: nowrap; cursor: pointer;">
          🏢 ${salao.nome_completo.split(' ')[0]}
        </div>
      `,
      iconAnchor: [35, 15]
    });

    const marker = L.marker([salao.latitude, salao.longitude], { icon: salaoIcon }).addTo(map);
    marker.on('click', () => {
      UI.openSalaoModal(salao.id_usuario);
    });
  });

  window.activeLeafletMap = map;
};

// Alternar Favorito para Profissional (Freelancer)
window.toggleFavoritePro = function(id_usuario, btn) {
  const isNowFav = window.appState.toggleFavoritoProfissional(id_usuario);
  if (btn) {
    btn.classList.toggle('is-favorited', isNowFav);
    btn.title = isNowFav ? 'Remover dos favoritos' : 'Favoritar profissional';
    const svg = btn.querySelector('svg');
    if (svg) {
      svg.setAttribute('fill', isNowFav ? '#EF4444' : 'none');
      svg.setAttribute('stroke', isNowFav ? '#EF4444' : '#6B7280');
    }
  }
  const pro = (window.appState.getState().profissionais || []).find(p => p.id_usuario === id_usuario);
  const name = pro ? pro.nome_completo : 'Profissional';
  if (isNowFav) {
    UI.showToast(`❤️ ${name} adicionada aos favoritos!`, 'success');
  } else {
    UI.showToast(`Profissional removida dos favoritos.`, 'info');
  }
};

// Alternar Favorito para Salão Parceiro
window.toggleFavoriteSalao = function(id_usuario, btn) {
  const isNowFav = window.appState.toggleFavoritoSalao(id_usuario);
  if (btn) {
    btn.classList.toggle('is-favorited', isNowFav);
    btn.title = isNowFav ? 'Remover dos favoritos' : 'Favoritar salão parceiro';
    const svg = btn.querySelector('svg');
    if (svg) {
      svg.setAttribute('fill', isNowFav ? '#EF4444' : 'none');
      svg.setAttribute('stroke', isNowFav ? '#EF4444' : '#6B7280');
    }
  }
  const salao = (window.getSaloesList ? window.getSaloesList() : []).find(s => s.id_usuario === id_usuario);
  const name = salao ? salao.nome_completo : 'Salão';
  if (isNowFav) {
    UI.showToast(`🏢 ${name} adicionado aos favoritos!`, 'success');
  } else {
    UI.showToast(`Salão removido dos favoritos.`, 'info');
  }
};


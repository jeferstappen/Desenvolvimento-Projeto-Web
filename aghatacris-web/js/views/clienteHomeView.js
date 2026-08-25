/**
 * AGhataCris - Cliente Home View (Descoberta & Mapa)
 * Corresponds to Figura 3 (Visão da Cliente: Tela Inicial de Mapa e Descoberta)
 */

window.renderClienteHomeView = function() {
  const state = window.appState.getState();
  const modalidade = state.filtros.modalidade;

  // Filter professionals
  let pros = state.profissionais;
  if (modalidade === 'domicilio') {
    pros = pros.filter(p => p.modalidade === 'Domicilio' || p.modalidade === 'Ambos');
  } else if (modalidade === 'salao') {
    pros = pros.filter(p => p.modalidade === 'Salao' || p.modalidade === 'Ambos');
  }

  if (state.filtros.busca) {
    const q = state.filtros.busca.toLowerCase();
    pros = pros.filter(p => p.nome_completo.toLowerCase().includes(q) || p.especialidade.toLowerCase().includes(q));
  }

  return `
    <div class="client-map-view animate-fade-in">
      <!-- Floating Map Header with Search & Filter -->
      <div class="map-header-floating">
        <div class="map-search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-teal)" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="map-search-input" value="${state.filtros.busca}" placeholder="Olá, Cliente! Qual serviço você precisa?" oninput="window.handleSearchFilter(this.value)" />
        </div>

        <div class="filter-pills-bar">
          <button class="filter-pill ${modalidade === 'todos' ? 'active' : ''}" onclick="window.handleModalidadeFilter('todos')">
            ✨ Todos (${state.profissionais.length})
          </button>
          <button class="filter-pill ${modalidade === 'domicilio' ? 'active' : ''}" onclick="window.handleModalidadeFilter('domicilio')">
            🏠 Em Domicílio
          </button>
          <button class="filter-pill ${modalidade === 'salao' ? 'active' : ''}" onclick="window.handleModalidadeFilter('salao')">
            🏢 No Salão
          </button>
        </div>
      </div>

      <!-- Interactive Map Area -->
      <div class="map-container-box">
        <div id="leaflet-map"></div>
      </div>

      <!-- Bottom Sheet with Nearby Pros -->
      <div class="map-bottom-sheet">
        <div class="modal-handle" style="margin-bottom: 8px;"></div>
        <div class="sheet-header-title">
          <div>
            <h3 class="text-base font-extrabold text-primary">Profissionais Próximas</h3>
            <p class="text-xs text-muted">Raio de 15km • Pronto Atendimento</p>
          </div>
          <span class="badge badge-emerald">GPS Ativo</span>
        </div>

        <div class="pros-list">
          ${pros.map(pro => `
            <div class="pro-card">
              <img src="${pro.avatar}" alt="${pro.nome_completo}" class="pro-avatar" />
              <div class="pro-info">
                <div class="pro-name">${pro.nome_completo}</div>
                <div class="pro-specialty">${pro.especialidade}</div>
                <div class="pro-meta">
                  <span class="pro-rating">★ ${pro.avaliacao.toFixed(1)}</span>
                  <span class="pro-distance">📍 ${pro.distanciaKm} km</span>
                  <span class="text-xs font-bold text-teal">A partir de R$ ${pro.precoEstimado.toFixed(0)}</span>
                </div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="UI.openChamarModal(${pro.id_usuario})">
                Chamar
              </button>
            </div>
          `).join('')}

          ${pros.length === 0 ? `
            <div class="text-center" style="padding: 24px; color: var(--text-muted);">
              Nenhum profissional encontrado para os filtros selecionados.
            </div>
          ` : ''}
        </div>
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
};

window.initMapIfPresent = function() {
  const mapContainer = document.getElementById('leaflet-map');
  if (!mapContainer) return;

  if (typeof L === 'undefined') {
    // If CDN is offline, render visual mock map
    mapContainer.innerHTML = `
      <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%); display: flex; align-items: center; justify-content: center; color: #1E293B; font-weight: 700;">
        📍 Mapa de Geolocalização Integrado (Raio de 15km)
      </div>
    `;
    return;
  }

  // If already initialized
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

  // User pin (Teal circle pulse)
  const userIcon = L.divIcon({
    className: 'custom-user-pin',
    html: `<div style="width: 16px; height: 16px; background: #0D9488; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 0 10px rgba(13,148,136,0.8);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  L.marker([-23.561684, -46.655981], { icon: userIcon })
    .addTo(map)
    .bindPopup('<b>Você está aqui</b><br>Buscando profissionais...')
    .openPopup();

  // 15km Radius Circle
  L.circle([-23.561684, -46.655981], {
    color: '#0D9488',
    fillColor: '#0D9488',
    fillOpacity: 0.1,
    radius: 1200
  }).addTo(map);

  // Professionals Pins
  const pros = window.appState.getState().profissionais;
  pros.forEach(pro => {
    const proIcon = L.divIcon({
      className: 'custom-pro-pin',
      html: `
        <div style="background: #10B981; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2); white-space: nowrap; cursor: pointer;">
          ★ ${pro.avaliacao} ${pro.nome_completo.split(' ')[0]}
        </div>
      `,
      iconAnchor: [30, 15]
    });

    const marker = L.marker([pro.latitude, pro.longitude], { icon: proIcon }).addTo(map);
    marker.on('click', () => {
      UI.openChamarModal(pro.id_usuario);
    });
  });

  window.activeLeafletMap = map;
};

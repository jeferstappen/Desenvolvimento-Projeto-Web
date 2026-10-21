/**
 * AGhataCris - Salão Parceiro Home View (Serviços Ofertados)
 * Na Home do Salão são exibidos exclusivamente os serviços ofertados pela casa,
 * permitindo criação, consulta, precificação e gerenciamento com segurança.
 */

window.renderSalaoHomeView = function() {
  const state = window.appState.getState();
  const salaoData = state.rolesData.salao || {};
  const salaoId = salaoData.id_usuario || 3;

  // Buscar serviços ofertados pelo salão
  const meusServicos = window.appState.getServicosByUsuario(salaoId);

  return `
    <div class="view-content-padded animate-fade-in">
      <!-- Card Perfil / Apresentação do Salão -->
      <div class="surface-card" style="margin-bottom: 16px; border: 1.5px solid var(--border-light); padding: 14px 16px;">
        <div style="display: flex; gap: 14px; align-items: center;">
          <img src="${salaoData.avatar || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&auto=format&fit=crop&q=80'}" 
               alt="${salaoData.nome_completo || 'Studio Elegance Jardins'}" 
               style="width: 58px; height: 58px; border-radius: var(--radius-sm); object-fit: cover; border: 2px solid var(--primary-teal);" />
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <h3 class="font-extrabold text-base text-primary" style="margin: 0; line-height: 1.2;">
                ${salaoData.nome_completo || 'Studio Elegance Jardins'}
              </h3>
              <span class="badge badge-emerald" style="font-size: 0.75rem;">★ ${parseFloat(salaoData.avaliacao || 4.9).toFixed(1)}</span>
            </div>
            <p class="text-xs text-muted" style="margin: 3px 0 0 0;">
              📍 ${salaoData.endereco || 'Al. Santos, 1200 - Jardins'}
            </p>
            <span class="badge badge-teal" style="font-size: 0.65rem; margin-top: 4px; padding: 2px 6px;">
              🏢 Salão Parceiro Credenciado • Lei 13.352/2016
            </span>
          </div>
        </div>
      </div>

      <!-- Cabeçalho da Seção de Serviços Ofertados -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div>
          <h3 class="font-extrabold text-sm text-primary" style="margin: 0;">Serviços Ofertados (${meusServicos.length})</h3>
          <span class="text-xs text-muted">Procedimentos executados diretamente pela equipe do salão</span>
        </div>
        <button class="btn btn-sm btn-emerald" style="font-weight: 700;" onclick="UI.openGerenciarServicosModal()">
          + Novo Serviço
        </button>
      </div>

      <!-- Lista de Serviços Ofertados pelo Salão -->
      <div class="servicos-ofertados-list" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
        ${meusServicos.length === 0 ? `
          <div class="surface-card text-center" style="padding: 24px 16px;">
            <span style="font-size: 2rem;">💇‍♀️</span>
            <h4 class="font-bold text-sm text-primary" style="margin: 8px 0 4px 0;">Nenhum serviço cadastrado</h4>
            <p class="text-xs text-muted" style="margin-bottom: 12px;">Cadastre os procedimentos e pacotes ofertados pelo seu estabelecimento.</p>
            <button class="btn btn-sm btn-primary" onclick="UI.openGerenciarServicosModal()">
              + Cadastrar Primeiro Serviço
            </button>
          </div>
        ` : meusServicos.map(s => {
          const horas = Math.floor(s.duracao_minutos / 60);
          const mins = s.duracao_minutos % 60;
          const duracaoFormatada = horas > 0
            ? (mins > 0 ? `${horas}h ${mins}min` : `${horas} hora${horas > 1 ? 's' : ''}`)
            : `${mins} min`;

          return `
            <div class="surface-card" style="padding: 12px 14px; border: 1px solid var(--border-light); border-radius: var(--radius-sm); box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                <div style="flex: 1; padding-right: 8px;">
                  <strong style="font-size: 0.95rem; color: var(--text-primary); display: block;">${s.nome}</strong>
                  ${s.descricao ? `<p class="text-xs text-muted" style="margin: 3px 0 0 0; line-height: 1.35;">${s.descricao}</p>` : ''}
                </div>
                <div style="text-align: right; flex-shrink: 0;">
                  <div class="font-extrabold text-emerald" style="font-size: 1.1rem; color: #16A34A !important;">
                    R$ ${parseFloat(s.preco).toFixed(2)}
                  </div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; border-top: 1px dashed var(--border-subtle); padding-top: 8px;">
                <span class="badge badge-teal" style="font-size: 0.7rem; font-weight: 600;">
                  ⏱️ ${duracaoFormatada}
                </span>

                <div style="display: flex; gap: 8px;">
                  <button class="btn btn-ghost btn-sm" style="font-size: 0.72rem; color: var(--text-muted); padding: 3px 8px;" onclick="window.confirmarExclusaoServicoModal(${s.id_servico})">
                    🗑️ Remover
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Card Informativo / Atalho para a Aba Espaços -->
      <div style="background: linear-gradient(135deg, rgba(13,148,136,0.08), rgba(16,185,129,0.08)); border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 12px 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong class="text-xs font-bold text-teal" style="display: block; text-transform: uppercase;">Locação de Infraestrutura</strong>
            <span class="text-xs text-secondary">Acompanhe quem agendou suas cadeiras e macas no cronograma.</span>
          </div>
          <button class="btn btn-sm btn-ghost text-teal font-bold" onclick="window.location.hash = '#/salao/espacos'">
            Ver Espaços →
          </button>
        </div>
      </div>
    </div>
  `;
};

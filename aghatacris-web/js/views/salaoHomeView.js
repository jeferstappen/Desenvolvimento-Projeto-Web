/**
 * AGhataCris - Salão Parceiro Home View (Dashboard de Espaços)
 * Corresponds to Figura 9 (Visão do Salão Parceiro: Painel Administrativo de Espaços)
 */

window.renderSalaoHomeView = function() {
  const state = window.appState.getState();
  const salaoData = state.rolesData.salao;
  const meusEspacos = state.espacos.filter(e => e.id_salao === salaoData.id_usuario || e.id_salao === 3);

  return `
    <div class="view-content-padded animate-fade-in">
      <!-- Receita Passiva Banner -->
      <div class="passive-income-banner">
        <div class="flex justify-between items-center">
          <span class="text-xs font-bold text-emerald" style="text-transform: uppercase; letter-spacing: 0.5px;">RECEITA PASSIVA (MÊS)</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald-dark)" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
        </div>
        <div class="passive-income-val">R$ ${salaoData.receitaPassivaMes.toFixed(2)}</div>
        <div class="flex justify-between items-center" style="font-size: 0.75rem;">
          <span class="badge badge-emerald">▲ +12.5% vs ago</span>
          <span class="text-secondary font-semibold">Próximo saque: 05/11</span>
        </div>
      </div>

      <!-- Formulário de Novo Anúncio de Espaço -->
      <div class="surface-card" style="margin-bottom: 20px;">
        <div class="flex justify-between items-center" style="margin-bottom: 12px;">
          <h3 class="font-extrabold text-sm text-primary">Novo Anúncio</h3>
          <a href="javascript:void(0)" onclick="UI.showToast('Exibindo modelos sugeridos pela comunidade', 'info')" class="text-xs font-bold text-teal">Ver modelos</a>
        </div>

        <form onsubmit="event.preventDefault(); window.handleNovoEspacoRapido();">
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="form-label">Qual o espaço?</label>
            <input type="text" id="quick-space-type" placeholder="Ex: Cadeira de Corte, Maca..." required />
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">Valor por Hora (R$)</label>
            <input type="number" step="0.50" id="quick-space-price" placeholder="0,00" required />
          </div>

          <button type="submit" class="btn btn-emerald">
            + Colocar na Rede
          </button>
        </form>
      </div>

      <!-- Lista de Espaços Ativos -->
      <div class="flex justify-between items-center" style="margin-bottom: 12px;">
        <h3 class="font-extrabold text-sm text-primary">Espaços Ativos</h3>
        <button class="btn-ghost" onclick="UI.showToast('Filtro de espaços ativos', 'info')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        </button>
      </div>

      <div class="espacos-ativos-list">
        ${meusEspacos.map(esp => `
          <div class="space-item-card">
            <div class="flex items-center gap-3">
              <div class="space-thumb">
                ✂️
              </div>
              <div>
                <h4 class="font-bold text-sm text-primary">${esp.tipo_espaco}</h4>
                <div class="text-xs font-bold text-emerald">R$ ${esp.preco_hora.toFixed(2)}/h</div>
                <span class="text-xs text-muted">
                  ${esp.status === 'Reservado' ? `🕒 Próxima reserva: ${esp.horario_proximo || '14:30'}` : `👁 ${esp.visualizacoes_hoje || 12} visualizações hoje`}
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
  `;
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

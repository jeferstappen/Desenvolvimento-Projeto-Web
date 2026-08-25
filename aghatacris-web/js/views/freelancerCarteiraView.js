/**
 * AGhataCris - Freelancer Carteira View
 * Corresponds to Figura 8 (Visão da Profissional: Carteira Financeira e Ganhos)
 */

window.renderFreelancerCarteiraView = function() {
  const state = window.appState.getState();
  const freeData = state.rolesData.freelancer;

  const repasses = [
    {
      servico: 'Maquiagem Social',
      data: '11 Out, 14:00',
      valorBruto: 100.00,
      taxaSalao: 15.00,
      taxaPlataforma: 10.00,
      valorLiquido: 75.00,
      tipo: 'No Salão'
    },
    {
      servico: 'Corte Feminino',
      data: '11 Out, 11:00',
      valorBruto: 130.00,
      taxaSalao: 20.00,
      taxaPlataforma: 13.00,
      valorLiquido: 97.00,
      tipo: 'No Salão'
    },
    {
      servico: 'Limpeza de Pele',
      data: '10 Out, 16:45',
      valorBruto: 160.00,
      taxaSalao: 0.00,
      taxaPlataforma: 16.00,
      valorLiquido: 144.00,
      tipo: 'Domicílio'
    },
    {
      servico: 'Design de Sobrancelha',
      data: '10 Out, 09:15',
      valorBruto: 80.00,
      taxaSalao: 0.00,
      taxaPlataforma: 8.00,
      valorLiquido: 72.00,
      tipo: 'Domicílio'
    }
  ];

  return `
    <div class="view-content-padded animate-fade-in">
      <!-- Balance Card -->
      <div class="balance-card-gradient">
        <div class="flex justify-between items-center">
          <span class="balance-subtitle">Saldo Disponível</span>
          <span class="badge" style="background: rgba(255,255,255,0.2); color: #FFFFFF;">
            Pix Instantâneo
          </span>
        </div>
        <div class="balance-amount">R$ ${freeData.saldo.toFixed(2)}</div>
        <button class="btn btn-emerald" style="border-radius: var(--radius-full); padding: 10px 18px;" onclick="UI.showToast('Solicitação de Saque PIX de R$ ${freeData.saldo.toFixed(2)} processada!', 'success')">
          💸 Sacar Dinheiro
        </button>
      </div>

      <!-- Ganhos da Semana Chart Widget -->
      <div class="surface-card" style="margin-bottom: 20px;">
        <div class="flex justify-between items-center" style="margin-bottom: 12px;">
          <div>
            <h4 class="font-bold text-sm text-primary">Ganhos da Semana</h4>
            <span class="text-xs text-muted">Média diária R$ 180,00</span>
          </div>
          <span class="badge badge-emerald">▲ +12%</span>
        </div>

        <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 75px; padding-top: 10px; border-bottom: 1px solid var(--border-light);">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <div style="width: 24px; height: 35px; background: var(--primary-teal-soft); border-radius: 4px 4px 0 0;"></div>
            <span class="text-xs text-muted">Seg</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <div style="width: 24px; height: 50px; background: var(--primary-teal-soft); border-radius: 4px 4px 0 0;"></div>
            <span class="text-xs text-muted">Ter</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <div style="width: 24px; height: 65px; background: var(--primary-teal); border-radius: 4px 4px 0 0;"></div>
            <span class="text-xs font-bold text-teal">Qua</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <div style="width: 24px; height: 40px; background: var(--primary-teal-soft); border-radius: 4px 4px 0 0;"></div>
            <span class="text-xs text-muted">Qui</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <div style="width: 24px; height: 55px; background: var(--primary-teal-soft); border-radius: 4px 4px 0 0;"></div>
            <span class="text-xs text-muted">Sex</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <div style="width: 24px; height: 70px; background: var(--accent-emerald); border-radius: 4px 4px 0 0;"></div>
            <span class="text-xs text-muted">Sáb</span>
          </div>
        </div>
      </div>

      <!-- Últimos Repasses com Split Payment -->
      <div class="flex justify-between items-center" style="margin-bottom: 12px;">
        <h3 class="font-extrabold text-sm text-primary">Últimos Repasses (Split Payment)</h3>
        <span class="text-xs font-bold text-teal">Ver tudo</span>
      </div>

      <div class="repasses-list">
        ${repasses.map(r => `
          <div class="split-breakdown-card">
            <div class="flex justify-between items-center">
              <div>
                <h4 class="font-bold text-sm text-primary">${r.servico}</h4>
                <span class="text-xs text-muted">${r.data} • ${r.tipo}</span>
              </div>
              <div class="text-right">
                <span class="text-sm font-extrabold text-emerald">+ R$ ${r.valorLiquido.toFixed(2)}</span>
                <div class="text-xs text-muted">Líquido</div>
              </div>
            </div>

            <div class="split-pills-row">
              <span class="split-tag">Bruto: R$ ${r.valorBruto.toFixed(2)}</span>
              ${r.taxaSalao > 0 ? `<span class="split-tag" style="color: #D97706;">Salão: -R$ ${r.taxaSalao.toFixed(2)}</span>` : ''}
              <span class="split-tag" style="color: var(--primary-teal);">Taxa App (10%): -R$ ${r.taxaPlataforma.toFixed(2)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

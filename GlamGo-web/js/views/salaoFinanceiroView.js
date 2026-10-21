/**
 * AGhataCris - Salão Parceiro Financeiro View
 * Visão da Carteira e Painel Financeiro do Salão Parceiro
 * Extrato discriminado com transparência das taxas de locação de espaço,
 * comissão da plataforma retida via Split Payment e repasses bancários (Lei 13.352/2016).
 */

window.renderSalaoFinanceiroView = function() {
  const state = window.appState.getState();
  const salaoData = state.rolesData.salao || {};
  const salaoId = salaoData.id_usuario || 3;
  const taxaGlobal = window.appState.getTaxaPlataformaPercentual ? window.appState.getTaxaPlataformaPercentual() : 10;

  // Filtrar todos os atendimentos realizados no salão
  const todosAtendimentos = state.atendimentos || [];
  const atendimentosSalao = todosAtendimentos.filter(a => {
    return (a.tipo === 'No Salão') ||
           (a.id_salao === salaoId) ||
           (a.salao_nome && a.salao_nome.toLowerCase().includes('elegance'));
  });

  // Mapear repasses com split payment discriminado
  const repasses = atendimentosSalao.map(a => {
    const valorBruto = parseFloat(a.valor_total || 0);
    const taxaSalao = parseFloat(a.taxa_salao || 0);
    const pct = a.taxa_plataforma_percentual || (valorBruto > 0 ? Math.round((a.taxa_plataforma / valorBruto) * 100) : taxaGlobal);
    const taxaPlat = parseFloat(a.taxa_plataforma !== undefined ? a.taxa_plataforma : (valorBruto * (pct / 100)));

    return {
      id: a.id_atendimento,
      servico: a.servico,
      profissional: a.freelancer_nome || 'Profissional Autônoma',
      cliente: a.cliente_nome || 'Cliente',
      data: a.data || (a.data_agendamento ? `${a.data_agendamento} às ${a.hora_agendamento || '14:30'}` : '19 Out, 14:30'),
      valorBruto: valorBruto,
      taxaSalao: taxaSalao,
      taxaPlataforma: taxaPlat,
      taxaPlataformaPercentual: pct,
      status: a.status || 'Concluído'
    };
  });

  // Total acumulado em receita passiva de locações de espaço
  const totalReceitaEspacos = repasses.reduce((acc, r) => acc + r.taxaSalao, 0);
  const saldoFinalExibido = Math.max(parseFloat(salaoData.receitaPassivaMes || 1250), totalReceitaEspacos);

  return `
    <div class="view-content-padded animate-fade-in">
      <!-- Card de Saldo e Repasses do Salão -->
      <div class="balance-card-gradient" style="background: linear-gradient(135deg, #0F766E 0%, #047857 100%);">
        <div class="flex justify-between items-center">
          <span class="balance-subtitle">Receita de Espaços (Mês)</span>
          <span class="badge" style="background: rgba(255,255,255,0.22); color: #FFFFFF; font-weight: 700;">
            Conta Corrente PJ
          </span>
        </div>
        <div class="balance-amount" style="font-size: 2.2rem; font-weight: 800; margin: 8px 0;">
          R$ ${saldoFinalExibido.toFixed(2)}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.75rem; color: rgba(255,255,255,0.9);">
          <span>Próxima liquidação: <strong>05/11</strong></span>
          <span>TED Automático</span>
        </div>
        <button class="btn btn-emerald" style="border-radius: var(--radius-full); padding: 10px 18px; width: 100%; font-weight: 700;" onclick="UI.showToast('Solicitação de transferência bancária para a conta PJ do salão registrada com sucesso!', 'success')">
          💸 Solicitar Saque Bancário
        </button>
      </div>

      <!-- Resumo de Indicadores Financeiros -->
      <div class="quick-stats-row" style="margin-bottom: 18px;">
        <div class="stat-widget">
          <div class="stat-widget-label">Locações no Salão</div>
          <div class="stat-widget-value text-teal">${repasses.length}</div>
          <span class="text-xs text-muted">Cadeiras & macas</span>
        </div>
        <div class="stat-widget">
          <div class="stat-widget-label">Taxa Plataforma</div>
          <div class="stat-widget-value text-emerald">${taxaGlobal}%</div>
          <span class="text-xs text-muted">Retenção auditada</span>
        </div>
      </div>

      <!-- Extrato Discriminado de Transações e Split Payment -->
      <div class="flex justify-between items-center" style="margin-bottom: 12px;">
        <div>
          <h3 class="font-extrabold text-sm text-primary" style="margin: 0;">Extrato de Locações e Repasses</h3>
          <span class="text-xs text-muted">Split Payment transparente por atendimento</span>
        </div>
        <span class="badge badge-teal" style="font-size: 0.65rem;">Lei 13.352/2016</span>
      </div>

      <div class="repasses-list" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
        ${repasses.length === 0 ? `
          <div class="surface-card text-center" style="padding: 20px;">
            <p class="text-xs text-muted" style="margin: 0;">Nenhum repasse registrado até o momento.</p>
          </div>
        ` : repasses.map(r => `
          <div class="split-breakdown-card">
            <div class="flex justify-between items-start" style="margin-bottom: 6px;">
              <div>
                <h4 class="font-bold text-sm text-primary" style="margin: 0 0 2px 0;">${r.servico}</h4>
                <span class="text-xs text-secondary" style="display: block;">
                  💇‍♀️ <strong>${r.profissional}</strong> • 👤 ${r.cliente}
                </span>
                <span class="text-xs text-muted" style="display: block; margin-top: 1px;">
                  📅 ${r.data}
                </span>
              </div>
              <div class="text-right">
                <span class="text-base font-extrabold text-emerald" style="color: #16A34A !important; display: block;">
                  + R$ ${r.taxaSalao.toFixed(2)}
                </span>
                <span class="badge ${r.status === 'Concluído' ? 'badge-emerald' : 'badge-amber'}" style="font-size: 0.65rem; padding: 2px 6px;">
                  ${r.status}
                </span>
              </div>
            </div>

            <!-- Tags com o detalhamento das taxas -->
            <div class="split-pills-row" style="margin-top: 8px;">
              <span class="split-tag">Valor Procedimento: R$ ${r.valorBruto.toFixed(2)}</span>
              <span class="split-tag" style="color: var(--primary-teal); font-weight: 700;">
                Taxa App (${r.taxaPlataformaPercentual}%): -R$ ${r.taxaPlataforma.toFixed(2)}
              </span>
              <span class="split-tag" style="color: #16A34A; font-weight: 800; background: rgba(16,185,129,0.12);">
                Taxa Locação Salão: +R$ ${r.taxaSalao.toFixed(2)}
              </span>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 8px; border-top: 1px dashed var(--border-subtle); padding-top: 6px;">
              <button class="btn btn-ghost btn-sm" style="font-size: 0.72rem; padding: 2px 8px;" onclick="UI.openReciboModal(${r.id})">
                📄 Ver Comprovante Oficial
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Conformidade Legal e Regras do Salão Parceiro -->
      <div style="background: var(--bg-subtle); border-left: 3px solid var(--primary-teal); padding: 12px; border-radius: var(--radius-sm); font-size: 0.75rem; color: var(--text-secondary); line-height: 1.45;">
        <strong style="color: var(--primary-teal);">⚖️ Conformidade Legal (Lei nº 13.352/2016):</strong><br>
        O Salão Parceiro e o Profissional Parceiro atuam sob contrato de parceria legal. A retenção da cota-parte da plataforma e o crédito da cota-parte do salão são processados via Split Payment sem incidência de bitributação.
      </div>
    </div>
  `;
};

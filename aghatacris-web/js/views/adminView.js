/**
 * AGhataCris - Administrador View
 * Corresponds to Actor Administrador (Tabela 1: RF01, RF10 e métricas da plataforma)
 */

window.renderAdminView = function() {
  return `
    <div class="view-content-padded animate-fade-in">
      <div style="margin-bottom: 16px;">
        <span class="badge badge-teal" style="margin-bottom: 6px;">Gestão da Plataforma</span>
        <h2 class="view-page-title">Painel Geral de Métricas</h2>
        <p class="view-page-subtitle">Monitoramento da infraestrutura e transações em tempo real</p>
      </div>

      <div class="quick-stats-row">
        <div class="stat-widget">
          <div class="stat-widget-label">Volume Transacionado</div>
          <div class="stat-widget-value text-teal">R$ 48.920</div>
          <span class="text-xs text-muted">Mês corrente</span>
        </div>
        <div class="stat-widget">
          <div class="stat-widget-label">Taxa Média Retenção</div>
          <div class="stat-widget-value text-emerald">10.0%</div>
          <span class="text-xs text-muted">Comissão App</span>
        </div>
      </div>

      <div class="quick-stats-row">
        <div class="stat-widget">
          <div class="stat-widget-label">Profissionais Ativos</div>
          <div class="stat-widget-value">342</div>
          <span class="text-xs text-emerald font-bold">● Online no radar</span>
        </div>
        <div class="stat-widget">
          <div class="stat-widget-label">Salões Parceiros</div>
          <div class="stat-widget-value">58</div>
          <span class="text-xs text-teal font-bold">186 cadeiras ativas</span>
        </div>
      </div>

      <!-- Configuração de Split de Pagamentos -->
      <div class="surface-card" style="margin-bottom: 20px;">
        <h3 class="font-extrabold text-sm text-primary" style="margin-bottom: 8px;">Configuração da Taxa de Intermediação</h3>
        <p class="text-xs text-secondary" style="margin-bottom: 14px;">Define a taxa percentual padrão retida nas transações de pronto atendimento.</p>
        
        <div class="flex justify-between items-center" style="margin-bottom: 10px;">
          <span class="text-sm font-semibold">Taxa Padrão da Plataforma:</span>
          <span class="font-extrabold text-teal" id="admin-rate-display">10%</span>
        </div>

        <input type="range" min="5" max="25" value="10" style="width: 100%;" oninput="document.getElementById('admin-rate-display').textContent = this.value + '%'" />

        <button class="btn btn-primary btn-sm" style="margin-top: 14px; width: 100%;" onclick="UI.showToast('Políticas de taxas atualizadas no gateway de split payment!', 'success')">
          Salvar Novas Diretrizes
        </button>
      </div>
    </div>
  `;
};

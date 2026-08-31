/**
 * AGhataCris - Reusable Modal & Toast Component
 */

window.UI = {
  showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.querySelector('.app-viewport').appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'info') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D9488" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  openModal(htmlContent) {
    let overlay = document.getElementById('global-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'global-modal-overlay';
      overlay.className = 'modal-overlay';
      document.querySelector('.app-viewport').appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="modal-sheet animate-slide-up">
        <div class="modal-handle"></div>
        ${htmlContent}
      </div>
    `;

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        UI.closeModal();
      }
    };

    setTimeout(() => overlay.classList.add('active'), 10);
  },

  closeModal() {
    const overlay = document.getElementById('global-modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.innerHTML = '';
      }, 250);
    }
  },

  // Interactive Action Modals
  openChamarModal(proId) {
    const pro = window.appState.getState().profissionais.find(p => p.id_usuario === proId);
    if (!pro) return;

    this.openModal(`
      <div class="flex items-center gap-3" style="margin-bottom: 16px;">
        <img src="${pro.avatar}" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary-teal);" />
        <div>
          <h3 class="modal-title" style="margin: 0;">${pro.nome_completo}</h3>
          <p class="text-sm text-secondary">${pro.especialidade} • <strong>${pro.distanciaKm} km de você</strong></p>
        </div>
      </div>

      <div style="background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-sm); margin-bottom: 20px;">
        <div class="flex justify-between items-center" style="margin-bottom: 8px;">
          <span class="text-sm text-secondary">Modalidade Selecionada:</span>
          <span class="badge badge-teal">Atendimento Imediato</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-secondary">Valor Estimado:</span>
          <span class="text-lg font-bold text-teal">R$ ${pro.precoEstimado.toFixed(2)}</span>
        </div>
      </div>

      <p class="text-xs text-muted" style="margin-bottom: 20px;">
        Ao confirmar, seu chamado de urgência será transmitido via geolocalização e a profissional terá até 3 minutos para aceite em tempo real.
      </p>

      <button class="btn btn-primary" onclick="UI.confirmarChamado(${pro.id_usuario}, '${pro.nome_completo}', '${pro.especialidade}', ${pro.precoEstimado})">
        🚀 Confirmar Solicitação Imediata
      </button>
      <button class="btn btn-ghost" style="margin-top: 8px;" onclick="UI.closeModal()">
        Voltar
      </button>
    `);
  },

  async confirmarChamado(proId, proName, especialidade, preco) {
    this.closeModal();
    const currentUser = window.appState.getState().currentUser;
    
    try {
      if (window.API) {
        const res = await window.API.createAtendimento({
          id_cliente: currentUser.id_usuario,
          id_freelancer: proId,
          servico: especialidade || 'Atendimento sob Demanda',
          tipo: 'Domicílio',
          valor_total: preco || 75.0,
          distancia_km: 1.2
        });

        if (res && res.atendimento) {
          window.appState.getState().atendimentos.unshift(res.atendimento);
          window.appState.saveState();
        }
      }
    } catch (err) {
      console.warn('Criar atendimento backend fallback:', err.message);
    }

    this.showToast(`Solicitação enviada com sucesso para ${proName}!`, 'success');
  },

  openReciboModal(idAtendimento) {
    const at = window.appState.getState().atendimentos.find(a => a.id_atendimento === idAtendimento);
    if (!at) return;

    this.openModal(`
      <div class="text-center" style="margin-bottom: 16px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--primary-teal-soft); color: var(--primary-teal); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px auto;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
        </div>
        <h3 class="modal-title">Comprovante de Atendimento</h3>
        <p class="text-xs text-muted">Transação #${at.id_atendimento} • ${at.data}</p>
      </div>

      <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px; font-size: 0.85rem;">
        <div class="flex justify-between" style="margin-bottom: 8px;">
          <span class="text-secondary">Serviço Realizado:</span>
          <strong>${at.servico}</strong>
        </div>
        <div class="flex justify-between" style="margin-bottom: 8px;">
          <span class="text-secondary">Profissional:</span>
          <strong>${at.freelancer_nome}</strong>
        </div>
        <div class="flex justify-between" style="margin-bottom: 8px;">
          <span class="text-secondary">Local:</span>
          <span>${at.tipo}</span>
        </div>
        <hr style="border: none; border-top: 1px dashed var(--border-subtle); margin: 10px 0;" />
        <div class="flex justify-between" style="margin-bottom: 4px;">
          <span class="text-secondary">Taxa Salão Parceiro:</span>
          <span>R$ ${at.taxa_salao.toFixed(2)}</span>
        </div>
        <div class="flex justify-between" style="margin-bottom: 4px;">
          <span class="text-secondary">Taxa Plataforma AGhataCris (10%):</span>
          <span>R$ ${at.taxa_plataforma.toFixed(2)}</span>
        </div>
        <div class="flex justify-between items-center" style="margin-top: 10px; font-size: 1.05rem;">
          <span class="font-bold">Total Pago:</span>
          <span class="font-bold text-teal">R$ ${at.valor_total.toFixed(2)}</span>
        </div>
      </div>

      <button class="btn btn-primary" onclick="UI.closeModal(); UI.showToast('Recibo baixado em PDF com sucesso!', 'info');">
        📄 Baixar Recibo Oficial
      </button>
      <button class="btn btn-ghost" style="margin-top: 8px;" onclick="UI.closeModal()">Fechar</button>
    `);
  },

  openReservaEspacoModal(idEspaco) {
    const espaco = window.appState.getState().espacos.find(e => e.id_espaco === idEspaco);
    if (!espaco) return;

    this.openModal(`
      <h3 class="modal-title">Reservar Infraestrutura no Salão</h3>
      <p class="modal-description">Reserva expressa para realização de atendimento emergencial.</p>

      <div style="background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-sm); margin-bottom: 16px;">
        <div class="flex justify-between" style="margin-bottom: 6px;">
          <span class="text-sm text-secondary">Salão Parceiro:</span>
          <strong class="text-sm">${espaco.nome_salao}</strong>
        </div>
        <div class="flex justify-between" style="margin-bottom: 6px;">
          <span class="text-sm text-secondary">Espaço:</span>
          <strong class="text-sm text-teal">${espaco.tipo_espaco}</strong>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-secondary">Custo por Hora:</span>
          <strong class="text-sm text-emerald">R$ ${espaco.preco_hora.toFixed(2)}/h</strong>
        </div>
      </div>

      <div class="badge badge-amber" style="width: 100%; justify-content: center; padding: 10px; margin-bottom: 20px; font-size: 0.8rem;">
        ⏱ Regra do Sistema: Você terá 30 minutos de tolerância para chegar ao salão.
      </div>

      <button class="btn btn-primary" onclick="window.appState.toggleEspacoStatus(${espaco.id_espaco}); UI.closeModal(); UI.showToast('Espaço reservado! Cronômetro de 30 minutos ativado.', 'success');">
        Confirmar Reserva do Espaço
      </button>
      <button class="btn btn-ghost" style="margin-top: 8px;" onclick="UI.closeModal()">Cancelar</button>
    `);
  },

  openNovoEspacoModal() {
    this.openModal(`
      <h3 class="modal-title">Cadastrar Novo Espaço Ocioso</h3>
      <p class="modal-description">Rentabilize cadeiras e macas livres no seu salão.</p>

      <form id="form-novo-espaco" onsubmit="event.preventDefault(); UI.salvarNovoEspaco();">
        <div class="form-group">
          <label class="form-label">Qual o tipo de infraestrutura?</label>
          <input type="text" id="novo-tipo-espaco" placeholder="Ex: Cadeira de Corte, Maca de Estética..." required />
        </div>

        <div class="form-group">
          <label class="form-label">Valor de Locação por Hora (R$/h)</label>
          <input type="number" step="0.50" id="novo-preco-espaco" placeholder="Ex: 25.00" required />
        </div>

        <button type="submit" class="btn btn-emerald" style="margin-top: 10px;">
          + Colocar Espaço na Rede
        </button>
        <button type="button" class="btn btn-ghost" style="margin-top: 8px;" onclick="UI.closeModal()">
          Cancelar
        </button>
      </form>
    `);
  },

  salvarNovoEspaco() {
    const tipo = document.getElementById('novo-tipo-espaco').value;
    const preco = document.getElementById('novo-preco-espaco').value;

    if (!tipo || !preco) return;

    window.appState.adicionarEspaco({
      tipo_espaco: tipo,
      preco_hora: preco
    });

    this.closeModal();
    this.showToast('Espaço publicado na rede com sucesso!', 'success');
  }
};

/**
 * AGhataCris - Central State Management & Mock Database
 * Corresponds to the database models: usuario, espaco, atendimento
 */

const STORAGE_KEY = 'aghatacris_state_v1';

const defaultState = {
  currentRole: 'cliente', // 'cliente' | 'freelancer' | 'salao' | 'admin'
  currentUser: {
    id_usuario: 1,
    nome_completo: 'Isabela Santos',
    email: 'isabela.santos@email.com',
    tipo_perfil: 'Cliente',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    latitude: -23.561684,
    longitude: -46.655981,
    isOnline: true
  },
  rolesData: {
    cliente: {
      id_usuario: 1,
      nome_completo: 'Isabela Santos',
      email: 'isabela.santos@email.com',
      tipo_perfil: 'Cliente',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badge: 'Nível Ouro',
      servicosRealizados: 12
    },
    freelancer: {
      id_usuario: 2,
      nome_completo: 'Mariana Silva',
      email: 'mariana.silva@beauty.com',
      tipo_perfil: 'Freelancer',
      especialidade: 'Hair Specialist & Maquiagem',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      saldo: 1250.00,
      ganhosHoje: 150.00,
      avaliacao: 4.9,
      isOnline: true,
      reservaAtiva: {
        id_espaco: 1,
        nome_salao: 'Salão Beauty Lounge',
        tipo_espaco: 'Cadeira de Cabelo',
        tempoRestanteSegundos: 1800 // 30 minutos
      }
    },
    salao: {
      id_usuario: 3,
      nome_completo: 'Studio Elegance Jardins',
      email: 'contato@studioelegance.com.br',
      tipo_perfil: 'Salao',
      avatar: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150&auto=format&fit=crop&q=80',
      receitaPassivaMes: 850.00,
      totalEspacos: 4
    },
    admin: {
      id_usuario: 99,
      nome_completo: 'Administrador do Sistema',
      email: 'admin@aghatacris.com.br',
      tipo_perfil: 'Administrador',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    }
  },
  // Mock Professionals (RF03 - raio 15km)
  profissionais: [
    {
      id_usuario: 101,
      nome_completo: 'Clara Mendes',
      especialidade: 'Design de Sobrancelhas',
      avaliacao: 4.8,
      distanciaKm: 0.8,
      precoEstimado: 75.00,
      latitude: -23.563000,
      longitude: -46.653000,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      isFavorita: true,
      modalidade: 'Ambos'
    },
    {
      id_usuario: 102,
      nome_completo: 'Bia Oliveira',
      especialidade: 'Maquiagem Social',
      avaliacao: 5.0,
      distanciaKm: 1.4,
      precoEstimado: 180.00,
      latitude: -23.559000,
      longitude: -46.658000,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      isFavorita: true,
      modalidade: 'Domicilio'
    },
    {
      id_usuario: 103,
      nome_completo: 'Juliana Silva',
      especialidade: 'Manicure & Pedicure Gel',
      avaliacao: 5.0,
      distanciaKm: 2.1,
      precoEstimado: 85.00,
      latitude: -23.565000,
      longitude: -46.660000,
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      isFavorita: true,
      modalidade: 'Salao'
    },
    {
      id_usuario: 104,
      nome_completo: 'Beatriz Ramos',
      especialidade: 'Hair Stylist & Coloração',
      avaliacao: 5.0,
      distanciaKm: 3.5,
      precoEstimado: 220.00,
      latitude: -23.555000,
      longitude: -46.650000,
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
      isFavorita: true,
      modalidade: 'Ambos'
    }
  ],
  // Mock Salons and Spaces (RF07, RF08, RF09)
  espacos: [
    {
      id_espaco: 1,
      id_salao: 3,
      nome_salao: 'Studio Elegance Jardins',
      tipo_espaco: 'Cadeira de Cabelo',
      preco_hora: 25.00,
      status: 'Reservado', // 'Disponivel' | 'Reservado'
      distanciaKm: 1.2,
      horario_proximo: '14:30',
      foto: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80'
    },
    {
      id_espaco: 2,
      id_salao: 3,
      nome_salao: 'Studio Elegance Jardins',
      tipo_espaco: 'Maca de Estética',
      preco_hora: 30.00,
      status: 'Disponível',
      distanciaKm: 1.2,
      visualizacoes_hoje: 12,
      foto: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80'
    },
    {
      id_espaco: 3,
      id_salao: 4,
      nome_salao: 'Belle Epoque Paulista',
      tipo_espaco: 'Bancada de Maquiagem',
      preco_hora: 20.00,
      status: 'Disponível',
      distanciaKm: 2.8,
      visualizacoes_hoje: 8,
      foto: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=200&auto=format&fit=crop&q=80'
    }
  ],
  // Mock Appointments (RF06, RF10 - Fig 5, Fig 6, Fig 8)
  atendimentos: [
    {
      id_atendimento: 1001,
      cliente_nome: 'Mariana Silva',
      freelancer_nome: 'Mariana Silva (Você)',
      servico: 'Maquiagem & Penteado',
      tipo: 'Domicílio',
      distanciaKm: 1.2,
      previsaoChegada: '09:45 AM',
      valor_total: 280.00,
      taxa_salao: 0.00,
      taxa_plataforma: 28.00,
      valor_liquido: 252.00,
      status: 'Em Andamento',
      data: 'Hoje, 09:30'
    },
    {
      id_atendimento: 1002,
      cliente_nome: 'Isabela Santos',
      freelancer_nome: 'Mariana Silva',
      servico: 'Corte & Escova Premium',
      tipo: 'No Salão',
      valor_total: 120.00,
      taxa_salao: 20.00,
      taxa_plataforma: 12.00,
      valor_liquido: 88.00,
      status: 'Concluído',
      data: '15 Maio, 14:30'
    },
    {
      id_atendimento: 1003,
      cliente_nome: 'Juliana Costa',
      freelancer_nome: 'Juliana Costa',
      servico: 'Manicure Gel & Nail Art',
      tipo: 'No Salão',
      valor_total: 85.00,
      taxa_salao: 15.00,
      taxa_plataforma: 8.50,
      valor_liquido: 61.50,
      status: 'Concluído',
      data: '02 Maio, 10:00'
    },
    {
      id_atendimento: 1004,
      cliente_nome: 'Ricardo Alves',
      freelancer_nome: 'Ricardo Alves',
      servico: 'Limpeza de Pele Profunda',
      tipo: 'No Salão',
      valor_total: 210.00,
      taxa_salao: 30.00,
      taxa_plataforma: 21.00,
      valor_liquido: 159.00,
      status: 'Concluído',
      data: '18 Abr, 16:15'
    }
  ],
  // Filter state for discovery
  filtros: {
    modalidade: 'todos', // 'todos' | 'domicilio' | 'salao'
    raioKm: 15,
    busca: ''
  }
};

class StateManager {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
    this.startCountdownTimer();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Erro ao carregar localStorage:', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Erro ao salvar localStorage:', e);
    }
    this.notify();
  }

  getState() {
    return this.state;
  }

  setRole(role) {
    if (this.state.rolesData[role]) {
      this.state.currentRole = role;
      this.state.currentUser = { ...this.state.rolesData[role] };
      this.saveState();
    }
  }

  setFilterModalidade(modalidade) {
    this.state.filtros.modalidade = modalidade;
    this.saveState();
  }

  setSearchQuery(query) {
    this.state.filtros.busca = query;
    this.saveState();
  }

  adicionarEspaco(novoEspaco) {
    const espaco = {
      id_espaco: Date.now(),
      id_salao: this.state.currentUser.id_usuario,
      nome_salao: this.state.currentUser.nome_completo,
      tipo_espaco: novoEspaco.tipo_espaco,
      preco_hora: parseFloat(novoEspaco.preco_hora),
      status: 'Disponível',
      distanciaKm: 1.5,
      visualizacoes_hoje: 1,
      foto: novoEspaco.foto || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80'
    };
    this.state.espacos.unshift(espaco);
    this.saveState();
  }

  toggleEspacoStatus(id_espaco) {
    const espaco = this.state.espacos.find(e => e.id_espaco === id_espaco);
    if (espaco) {
      espaco.status = espaco.status === 'Disponível' ? 'Reservado' : 'Disponível';
      this.saveState();
    }
  }

  finalizarAtendimentoAtual() {
    const atual = this.state.atendimentos.find(a => a.status === 'Em Andamento');
    if (atual) {
      atual.status = 'Concluído';
      this.state.rolesData.freelancer.ganhosHoje += atual.valor_liquido;
      this.state.rolesData.freelancer.saldo += atual.valor_liquido;
      this.saveState();
    }
  }

  startCountdownTimer() {
    setInterval(() => {
      if (this.state.rolesData.freelancer.reservaAtiva.tempoRestanteSegundos > 0) {
        this.state.rolesData.freelancer.reservaAtiva.tempoRestanteSegundos--;
        // Update without full reload every sec to keep timer responsive
        const timerEl = document.getElementById('arrival-countdown');
        if (timerEl) {
          const totalSecs = this.state.rolesData.freelancer.reservaAtiva.tempoRestanteSegundos;
          const mins = Math.floor(totalSecs / 60);
          const secs = totalSecs % 60;
          timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
      }
    }, 1000);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

window.appState = new StateManager();

/**
 * AGhataCris - Central State Management & REST API Sync (Sprint 2 & 3)
 * Corresponde aos modelos relacionais: usuario, espaco, atendimento, transacao
 */

const STORAGE_KEY = 'aghatacris_state_v5';

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
  userPasswords: {
    'isabela.santos@email.com': '12345678',
    'mariana.silva@beauty.com': '12345678',
    'contato@studioelegance.com.br': '12345678',
    'admin@aghatacris.com.br': '12345678'
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
      reservaAtiva: null
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
  // Profissionais no Radar de 15km (RF03, RNF01)
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
      nome_completo: 'Juliana Costa',
      especialidade: 'Manicure Gel & Nail Art',
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
  // Salões Parceiros Credenciados (Lei do Salão Parceiro)
  saloes: [
    {
      id_usuario: 3,
      nome_completo: 'Studio Elegance Jardins',
      especialidade: 'Cabelo, Manicure & Estética',
      endereco: 'Al. Santos, 1200 - Jardins',
      distanciaKm: 1.2,
      avaliacao: 4.9,
      totalEspacos: 4,
      avatar: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&auto=format&fit=crop&q=80',
      espacosDisponiveis: ['Cadeira de Cabelo (R$ 25/h)', 'Maca de Estética (R$ 30/h)'],
      latitude: -23.5645,
      longitude: -46.6520
    },
    {
      id_usuario: 4,
      nome_completo: 'Belle Époque Paulista',
      especialidade: 'Maquiagem & Penteados Premium',
      endereco: 'Av. Paulista, 850 - Bela Vista',
      distanciaKm: 2.8,
      avaliacao: 4.8,
      totalEspacos: 3,
      avatar: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=300&auto=format&fit=crop&q=80',
      espacosDisponiveis: ['Bancada de Maquiagem (R$ 20/h)', 'Cadeira de Corte (R$ 35/h)'],
      latitude: -23.5580,
      longitude: -46.6590
    }
  ],
  // Espaços Ociosos em Salões Parceiros (RF07, RF08, RF09)
  espacos: [
    {
      id_espaco: 1,
      id_salao: 3,
      nome_salao: 'Studio Elegance Jardins',
      tipo_espaco: 'Cadeira de Cabelo',
      preco_hora: 25.00,
      status: 'Reservado',
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
      nome_salao: 'Belle Époque Paulista',
      tipo_espaco: 'Bancada de Maquiagem',
      preco_hora: 20.00,
      status: 'Disponível',
      distanciaKm: 2.8,
      visualizacoes_hoje: 8,
      foto: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=200&auto=format&fit=crop&q=80'
    }
  ],
  // Atendimentos e Split Payment (RF06, RF10)
  atendimentos: [
    {
      id_atendimento: 1001,
      id_freelancer: 2,
      id_cliente: 1,
      cliente_nome: 'Isabela Santos',
      cliente_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      cliente_avaliacao: 5.0,
      freelancer_nome: 'Mariana Silva',
      servico: 'Maquiagem & Penteado',
      tipo: 'Domicílio',
      distanciaKm: 1.2,
      previsaoChegada: '09:30',
      valor_total: 280.00,
      taxa_salao: 0.00,
      taxa_plataforma: 28.00,
      valor_liquido: 252.00,
      status: 'Concluído',
      data: '2026-10-19 às 09:30',
      data_agendamento: '2026-10-19',
      hora_agendamento: '09:30'
    },
    {
      id_atendimento: 1020,
      id_freelancer: 2,
      id_cliente: 105,
      cliente_nome: 'Beatriz Fontes',
      cliente_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      cliente_avaliacao: 5.0,
      freelancer_nome: 'Mariana Silva',
      servico: 'Design de Sobrancelhas',
      tipo: 'No Salão',
      salao_nome: 'Studio Elegance Jardins',
      distanciaKm: 1.5,
      previsaoChegada: '14:30',
      valor_total: 75.00,
      taxa_salao: 15.00,
      taxa_plataforma: 7.50,
      valor_liquido: 52.50,
      status: 'Em Andamento',
      data: '2026-10-19 às 14:30',
      data_agendamento: '2026-10-19',
      hora_agendamento: '14:30'
    },
    {
      id_atendimento: 1021,
      id_freelancer: 2,
      id_cliente: 106,
      cliente_nome: 'Camila Rocha',
      cliente_avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
      cliente_avaliacao: 4.9,
      freelancer_nome: 'Mariana Silva',
      servico: 'Corte & Escova Modeladora',
      tipo: 'No Salão',
      salao_nome: 'Studio Elegance Jardins',
      distanciaKm: 1.2,
      previsaoChegada: '16:30',
      valor_total: 130.00,
      taxa_salao: 20.00,
      taxa_plataforma: 13.00,
      valor_liquido: 97.00,
      status: 'Pendente',
      data: '2026-10-19 às 16:30',
      data_agendamento: '2026-10-19',
      hora_agendamento: '16:30'
    },
    {
      id_atendimento: 1022,
      id_freelancer: 2,
      id_cliente: 107,
      cliente_nome: 'Larissa Mendes',
      cliente_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      cliente_avaliacao: 5.0,
      freelancer_nome: 'Mariana Silva',
      servico: 'Alongamento de Cílios Fio a Fio',
      tipo: 'Domicílio',
      distanciaKm: 2.1,
      previsaoChegada: '11:00',
      valor_total: 150.00,
      taxa_salao: 0.00,
      taxa_plataforma: 15.00,
      valor_liquido: 135.00,
      status: 'Confirmado',
      data: '2026-10-20 às 11:00',
      data_agendamento: '2026-10-20',
      hora_agendamento: '11:00'
    },
    {
      id_atendimento: 1023,
      id_freelancer: 2,
      id_cliente: 108,
      cliente_nome: 'Fernanda Lima',
      cliente_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      cliente_avaliacao: 4.8,
      freelancer_nome: 'Mariana Silva',
      servico: 'Maquiagem Social Glam',
      tipo: 'No Salão',
      salao_nome: 'Studio Elegance Jardins',
      distanciaKm: 1.2,
      previsaoChegada: '15:00',
      valor_total: 190.00,
      taxa_salao: 25.00,
      taxa_plataforma: 19.00,
      valor_liquido: 146.00,
      status: 'Confirmado',
      data: '2026-10-20 às 15:00',
      data_agendamento: '2026-10-20',
      hora_agendamento: '15:00'
    },
    {
      id_atendimento: 1003,
      id_freelancer: 2,
      id_cliente: 109,
      cliente_nome: 'Juliana Costa',
      cliente_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      cliente_avaliacao: 5.0,
      freelancer_nome: 'Mariana Silva',
      servico: 'Manicure Gel & Nail Art',
      tipo: 'Domicílio',
      valor_total: 85.00,
      taxa_salao: 0.00,
      taxa_plataforma: 8.50,
      valor_liquido: 76.50,
      status: 'Concluído',
      data: '2026-10-18 às 10:00',
      data_agendamento: '2026-10-18',
      hora_agendamento: '10:00'
    },
    {
      id_atendimento: 1024,
      id_freelancer: 2,
      id_cliente: 110,
      cliente_nome: 'Amanda Prado',
      cliente_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      cliente_avaliacao: 5.0,
      freelancer_nome: 'Mariana Silva',
      servico: 'Corte & Hidratação Profunda',
      tipo: 'No Salão',
      salao_nome: 'Studio Elegance Jardins',
      valor_total: 160.00,
      taxa_salao: 20.00,
      taxa_plataforma: 16.00,
      valor_liquido: 124.00,
      status: 'Confirmado',
      data: '2026-10-22 às 15:30',
      data_agendamento: '2026-10-22',
      hora_agendamento: '15:30'
    },
    {
      id_atendimento: 1004,
      id_cliente: 111,
      cliente_nome: 'Ricardo Alves',
      cliente_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      cliente_avaliacao: 4.8,
      freelancer_nome: 'Ricardo Alves',
      servico: 'Limpeza de Pele Profunda',
      tipo: 'No Salão',
      valor_total: 210.00,
      taxa_salao: 30.00,
      taxa_plataforma: 21.00,
      valor_liquido: 159.00,
      status: 'Concluído',
      data: '2026-10-19 às 16:15',
      data_agendamento: '2026-10-19',
      hora_agendamento: '16:15'
    }
  ],
  // Formas de Pagamento cadastradas por perfil
  formasPagamento: {
    cliente: {
      tipo: 'cartao_credito',
      numero_mascarado: '•••• •••• •••• 4242',
      titular: 'ISABELA SANTOS',
      validade: '08/29',
      bandeira: 'Mastercard'
    },
    freelancer: {
      tipo: 'pix',
      tipo_chave: 'CPF',
      chave: '234.567.890-11',
      titular: 'Mariana Silva',
      banco: 'Banco Inter (077)',
      agencia: '0001',
      conta: '1234567-8'
    },
    salao: {
      tipo: 'conta_corrente',
      banco: 'Banco Itaú (341)',
      agencia: '0124',
      conta: '48291-5',
      tipo_conta: 'Corrente',
      titular: 'Studio Elegance Jardins EIRELI',
      documento: '12.345.678/0001-90'
    }
  },
  // Catálogo de Serviços Ofertados por Profissional / Salão
  servicosOfertados: [
    { id_servico: 1, id_usuario: 2, nome: 'Chapinha & Escova Modeladora', descricao: 'Alisamento térmico e escova com fixação duradoura e brilho intenso', preco: 80.00, duracao_minutos: 60 },
    { id_servico: 2, id_usuario: 2, nome: 'Maquiagem Social Glam', descricao: 'Produção completa para festas e eventos com cílios inclusos', preco: 150.00, duracao_minutos: 60 },
    { id_servico: 3, id_usuario: 2, nome: 'Penteado Preso ou Semi-preso', descricao: 'Penteados contemporâneos para convidadas e formandas', preco: 120.00, duracao_minutos: 45 },
    { id_servico: 4, id_usuario: 2, nome: 'Corte & Hidratação Profunda', descricao: 'Corte personalizado e nutrição com produtos premium', preco: 110.00, duracao_minutos: 60 },

    { id_servico: 5, id_usuario: 101, nome: 'Design de Sobrancelhas com Henna', descricao: 'Alinhamento com visagismo facial e henna', preco: 75.00, duracao_minutos: 45 },
    { id_servico: 6, id_usuario: 101, nome: 'Micropigmentação Fio a Fio', descricao: 'Técnica hiper-realista para sobrancelhas perfeitas', preco: 280.00, duracao_minutos: 90 },
    { id_servico: 7, id_usuario: 101, nome: 'Depilação Facial Egípcia', descricao: 'Remoção com linha 100% hipoalergênica', preco: 45.00, duracao_minutos: 30 },

    { id_servico: 8, id_usuario: 102, nome: 'Maquiagem Social com Cílios', descricao: 'Make profissional com contorno e iluminação impecáveis', preco: 180.00, duracao_minutos: 60 },
    { id_servico: 9, id_usuario: 102, nome: 'Maquiagem para Noivas / Madrinhas', descricao: 'Técnica blindada à prova d’água e alta durabilidade', preco: 250.00, duracao_minutos: 90 },

    { id_servico: 10, id_usuario: 103, nome: 'Manicure em Gel & Nail Art', descricao: 'Esmaltação em gel de alta durabilidade com decorações', preco: 85.00, duracao_minutos: 60 },
    { id_servico: 11, id_usuario: 103, nome: 'Alongamento de Unhas em Fibra', descricao: 'Estrutura resistente com acabamento fino e natural', preco: 150.00, duracao_minutos: 90 },
    { id_servico: 12, id_usuario: 103, nome: 'Pedicure & Spa dos Pés', descricao: 'Esfoliação, hidratação profunda e cutilagem russa', preco: 70.00, duracao_minutos: 45 },

    { id_servico: 13, id_usuario: 104, nome: 'Hair Stylist & Coloração Global', descricao: 'Coloração profissional com proteção da fibra capilar', preco: 220.00, duracao_minutos: 120 },
    { id_servico: 14, id_usuario: 104, nome: 'Botox Capilar & Reconstrução', descricao: 'Redução de volume, eliminação de frizz e brilho', preco: 160.00, duracao_minutos: 90 },
    { id_servico: 15, id_usuario: 104, nome: 'Escova Modelada com Babyliss', descricao: 'Ondas volumosas estilo capa de revista', preco: 90.00, duracao_minutos: 45 },

    { id_servico: 16, id_usuario: 3, nome: 'Pacote Completo: Cabelo, Make & Unha', descricao: 'Experiência completa no salão com atendimento simultâneo de especialistas', preco: 290.00, duracao_minutos: 120 },
    { id_servico: 17, id_usuario: 3, nome: 'Escova Progressiva Orgânica', descricao: 'Alisamento sem formol, fios maleáveis e brilho espelhado', preco: 200.00, duracao_minutos: 120 },
    { id_servico: 18, id_usuario: 3, nome: 'Limpeza de Pele Profunda com Peeling', descricao: 'Higienização, extração de comedões e máscara de LED', preco: 180.00, duracao_minutos: 60 },
    { id_servico: 19, id_usuario: 3, nome: 'Corte Feminino com Terapeuta Capilar', descricao: 'Análise do couro cabeludo, lavagem relaxante e corte', preco: 130.00, duracao_minutos: 60 },

    { id_servico: 20, id_usuario: 4, nome: 'Produção Completa de Gala', descricao: 'Penteado exclusivo, maquiagem de alta definição e camarim VIP', preco: 380.00, duracao_minutos: 180 },
    { id_servico: 21, id_usuario: 4, nome: 'Tratamento Reconstrutor Kérastase', descricao: 'Cronograma capilar intensivo com diagnóstico e vapor de ozônio', preco: 190.00, duracao_minutos: 60 },
    { id_servico: 22, id_usuario: 4, nome: 'Manicure e Pedicure Express', descricao: 'Cuidado rápido e de alto padrão para sua rotina', preco: 90.00, duracao_minutos: 60 }
  ],
  // Filtros de busca no mapa
  filtros: {
    modalidade: 'todos',
    raioKm: 15,
    busca: ''
  }
};

class StateManager {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
    this.startCountdownTimer();
    this.syncWithBackend();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.profissionais || parsed.profissionais.length === 0) {
          parsed.profissionais = JSON.parse(JSON.stringify(defaultState.profissionais));
        }
        if (!parsed.saloes || parsed.saloes.length === 0) {
          parsed.saloes = JSON.parse(JSON.stringify(defaultState.saloes));
        }
        if (parsed.filtros) {
          parsed.filtros.busca = '';
        }
        return parsed;
      }
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

  logout() {
    this.state.currentUser = null;
    this.state.currentRole = 'cliente';
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    this.saveState();
  }

  async syncWithBackend() {
    if (typeof window === 'undefined' || !window.API) return;
    try {
      const userLat = (this.state.currentUser && this.state.currentUser.latitude) || -23.561684;
      const userLon = (this.state.currentUser && this.state.currentUser.longitude) || -46.655981;

      const [prosRes, espacosRes, atendsRes, saloesRes] = await Promise.all([
        window.API.getNearbyProfessionals({
          latitude: userLat,
          longitude: userLon,
          raio: this.state.filtros.raioKm,
          modalidade: this.state.filtros.modalidade,
          busca: this.state.filtros.busca
        }).catch(() => null),
        window.API.listEspacos({
          latitude: userLat,
          longitude: userLon
        }).catch(() => null),
        window.API.listAtendimentos().catch(() => null),
        window.API.listUsers({ tipo_perfil: 'Salao' }).catch(() => null)
      ]);

      if (prosRes && prosRes.profissionais && prosRes.profissionais.length > 0) {
        this.state.profissionais = prosRes.profissionais.map(p => ({
          ...p,
          precoEstimado: p.preco_estimado || p.precoEstimado || 75.0,
          distanciaKm: p.distanciaKm !== undefined ? p.distanciaKm : 1.0
        }));
      } else if (!this.state.profissionais || this.state.profissionais.length === 0) {
        this.state.profissionais = JSON.parse(JSON.stringify(defaultState.profissionais));
      }

      if (espacosRes && espacosRes.espacos) {
        this.state.espacos = espacosRes.espacos.map(e => ({
          ...e,
          distanciaKm: e.distanciaKm || 1.2
        }));
      }

      if (saloesRes && saloesRes.users && saloesRes.users.length > 0) {
        this.state.saloes = saloesRes.users.map((s, idx) => ({
          id_usuario: s.id_usuario,
          nome_completo: s.nome_completo,
          especialidade: s.especialidade || 'Salão Parceiro Credenciado',
          endereco: idx === 0 ? 'Al. Santos, 1200 - Jardins' : 'Av. Paulista, 850 - Bela Vista',
          distanciaKm: idx === 0 ? 1.2 : 2.8,
          avaliacao: s.avaliacao || 4.9,
          totalEspacos: 4,
          avatar: s.avatar || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&auto=format&fit=crop&q=80',
          espacosDisponiveis: ['Cadeira de Cabelo (R$ 25/h)', 'Maca de Estética (R$ 30/h)'],
          latitude: s.latitude || -23.5645,
          longitude: s.longitude || -46.6520
        }));
      }

      if (atendsRes && atendsRes.atendimentos) {
        const dbAtendimentos = atendsRes.atendimentos.map(a => {
          let dataAgendamento = a.data_agendamento;
          let horaAgendamento = a.hora_agendamento;
          if (!dataAgendamento && a.data_atendimento) {
            const m = a.data_atendimento.match(/(\d{4}-\d{2}-\d{2})/);
            if (m) dataAgendamento = m[1];
            if (a.data_atendimento.toLowerCase().includes('hoje')) dataAgendamento = '2026-10-19';
          }
          if (!horaAgendamento && a.data_atendimento) {
            const m = a.data_atendimento.match(/(\d{1,2}:\d{2})/);
            if (m) horaAgendamento = m[1];
          }

          const existingMock = defaultState.atendimentos.find(m => m.id_atendimento === a.id_atendimento);

          return {
            ...a,
            cliente_nome: (existingMock && existingMock.cliente_nome) || a.cliente_nome || 'Cliente',
            cliente_avatar: (existingMock && existingMock.cliente_avatar) || a.cliente_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            data: a.data_atendimento || a.data,
            data_agendamento: dataAgendamento || (existingMock && existingMock.data_agendamento) || (a.data && a.data.includes('Hoje') ? '2026-10-19' : null),
            hora_agendamento: horaAgendamento || (existingMock && existingMock.hora_agendamento) || a.previsao_chegada || a.previsaoChegada || '14:30'
          };
        });

        // Mesclar agendamentos do defaultState que não constem no banco para garantir riqueza de dados na agenda
        defaultState.atendimentos.forEach(mockAt => {
          if (!dbAtendimentos.some(a => a.id_atendimento === mockAt.id_atendimento)) {
            dbAtendimentos.push(mockAt);
          }
        });

        this.state.atendimentos = dbAtendimentos;
      }

      // Sincronizar dados financeiros e cadastrais do usuário autenticado a partir do banco
      if (this.state.currentUser && this.state.currentUser.id_usuario) {
        const userRes = await window.API.getMe(this.state.currentUser.id_usuario).catch(() => null);
        if (userRes && userRes.user) {
          const u = userRes.user;
          if (u.saldo !== undefined) this.state.currentUser.saldo = parseFloat(u.saldo);
          if (u.ganhos_hoje !== undefined) this.state.currentUser.ganhosHoje = parseFloat(u.ganhos_hoje);
          if (u.receita_passiva_mes !== undefined) this.state.currentUser.receitaPassivaMes = parseFloat(u.receita_passiva_mes);

          const role = this.state.currentRole;
          if (this.state.rolesData[role]) {
            if (u.saldo !== undefined) this.state.rolesData[role].saldo = parseFloat(u.saldo);
            if (u.ganhos_hoje !== undefined) this.state.rolesData[role].ganhosHoje = parseFloat(u.ganhos_hoje);
            if (u.receita_passiva_mes !== undefined) this.state.rolesData[role].receitaPassivaMes = parseFloat(u.receita_passiva_mes);
          }
        }
      }

      this.saveState();

      // Se estiver na tela da cliente, re-renderizar para exibir a lista atualizada
      if (typeof window !== 'undefined' && window.router && window.location.hash.includes('/cliente/home')) {
        window.router.renderCurrentRoute();
      }
    } catch (e) {
      console.log('Sync backend offline/fallback ativo:', e.message);
    }
  }

  getState() {
    return this.state;
  }

  setRole(role) {
    if (this.state.rolesData[role]) {
      this.state.currentRole = role;
      this.state.currentUser = { ...this.state.rolesData[role] };
      this.saveState();
      this.syncWithBackend();
    }
  }

  setFilterModalidade(modalidade) {
    this.state.filtros.modalidade = modalidade;
    this.saveState();
    this.syncWithBackend();
  }

  setSearchQuery(query) {
    this.state.filtros.busca = query;
    this.saveState();
    this.syncWithBackend();
  }

  async updateLocation(lat, lon) {
    if (this.state.currentUser) {
      this.state.currentUser.latitude = lat;
      this.state.currentUser.longitude = lon;
    }
    this.saveState();

    if (window.API && this.state.currentUser) {
      try {
        await window.API.updateLocation(this.state.currentUser.id_usuario, lat, lon);
      } catch (e) {
        console.warn('Erro ao sincronizar GPS com backend:', e);
      }
    }
    this.syncWithBackend();
  }

  async adicionarEspaco(novoEspaco) {
    const salaoId = (this.state.currentUser && this.state.currentUser.id_usuario) || 3;
    const salaoNome = (this.state.currentUser && this.state.currentUser.nome_completo) || 'Studio Elegance Jardins';

    const espacoLocal = {
      id_espaco: Date.now(),
      id_salao: salaoId,
      nome_salao: salaoNome,
      tipo_espaco: novoEspaco.tipo_espaco,
      preco_hora: parseFloat(novoEspaco.preco_hora),
      status: 'Disponível',
      distanciaKm: 1.5,
      visualizacoes_hoje: 1,
      foto: novoEspaco.foto || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80'
    };
    this.state.espacos.unshift(espacoLocal);
    this.saveState();

    if (window.API) {
      try {
        const res = await window.API.createEspaco({
          id_salao: salaoId,
          tipo_espaco: novoEspaco.tipo_espaco,
          preco_hora: novoEspaco.preco_hora,
          foto: novoEspaco.foto
        });
        if (res && res.espaco) {
          espacoLocal.id_espaco = res.espaco.id_espaco;
          this.saveState();
        }
      } catch (e) {
        console.warn('Erro ao salvar espaço no backend:', e);
      }
    }
  }

  async toggleEspacoStatus(id_espaco) {
    const espaco = this.state.espacos.find(e => e.id_espaco === id_espaco);
    if (espaco) {
      espaco.status = espaco.status === 'Disponível' ? 'Reservado' : 'Disponível';
      this.saveState();

      if (window.API) {
        try {
          const proId = (this.state.currentUser && this.state.currentUser.id_usuario) || 2;
          if (espaco.status === 'Reservado') {
            await window.API.reserveEspaco(id_espaco, proId);
          } else {
            await window.API.toggleEspacoStatus(id_espaco);
          }
        } catch (e) {
          console.warn('Erro ao atualizar status do espaço no backend:', e);
        }
      }
    }
  }

  async finalizarAtendimentoAtual() {
    const atual = this.state.atendimentos.find(a => a.status === 'Em Andamento');
    if (atual) {
      if (window.API) {
        try {
          const res = await window.API.updateAtendimentoStatus(atual.id_atendimento, 'Concluído');
          if (res && res.atendimento) {
            atual.status = 'Concluído';
            atual.valor_liquido = res.atendimento.valor_liquido || atual.valor_liquido;
            atual.taxa_plataforma = res.atendimento.taxa_plataforma || atual.taxa_plataforma;
            atual.taxa_salao = res.atendimento.taxa_salao || atual.taxa_salao;
          }
        } catch (e) {
          console.warn('Erro ao finalizar atendimento no backend:', e);
          atual.status = 'Concluído';
        }
      } else {
        atual.status = 'Concluído';
      }

      await this.syncWithBackend();
      this.saveState();
    }
  }

  async aceitarAtendimento(id_atendimento) {
    const at = this.state.atendimentos.find(a => a.id_atendimento === id_atendimento || a.id_atendimento == id_atendimento);
    if (at) {
      at.status = 'Em Andamento';
      if (window.API) {
        try {
          await window.API.updateAtendimentoStatus(id_atendimento, 'Em Andamento');
        } catch (e) {
          console.warn('Erro ao aceitar atendimento no backend:', e);
        }
      }
      this.saveState();
      this.notify();
      return true;
    }
    return false;
  }

  async recusarAtendimento(id_atendimento) {
    const at = this.state.atendimentos.find(a => a.id_atendimento === id_atendimento || a.id_atendimento == id_atendimento);
    if (at) {
      at.status = 'Recusado';
      if (window.API) {
        try {
          await window.API.updateAtendimentoStatus(id_atendimento, 'Recusado');
        } catch (e) {
          console.warn('Erro ao recusar atendimento no backend:', e);
        }
      }
      this.saveState();
      this.notify();
      return true;
    }
    return false;
  }

  async cancelarAtendimento(id_atendimento) {
    const at = this.state.atendimentos.find(a => a.id_atendimento === id_atendimento || a.id_atendimento == id_atendimento);
    if (at) {
      at.status = 'Cancelado';
      if (window.API) {
        try {
          await window.API.updateAtendimentoStatus(id_atendimento, 'Cancelado');
        } catch (e) {
          console.warn('Erro ao cancelar atendimento no backend:', e);
        }
      }
      this.saveState();
      this.notify();
      return true;
    }
    return false;
  }

  startCountdownTimer() {
    setInterval(() => {
      const reserva = this.state.rolesData &&
                      this.state.rolesData.freelancer &&
                      this.state.rolesData.freelancer.reservaAtiva;
      if (reserva && reserva.tempoRestanteSegundos > 0) {
        reserva.tempoRestanteSegundos--;
        const timerEl = document.getElementById('arrival-countdown');
        if (timerEl) {
          const totalSecs = reserva.tempoRestanteSegundos;
          const mins = Math.floor(totalSecs / 60);
          const secs = totalSecs % 60;
          timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
      }
    }, 1000);
  }

  getServicosByUsuario(id_usuario) {
    if (!this.state.servicosOfertados) {
      this.state.servicosOfertados = JSON.parse(JSON.stringify(defaultState.servicosOfertados || []));
      this.saveState();
    }
    return (this.state.servicosOfertados || []).filter(s => s.id_usuario === id_usuario || s.id_usuario == id_usuario);
  }

  async adicionarServico({ id_usuario, nome, descricao, preco, duracao_minutos, senha }) {
    if (!this.state.servicosOfertados) this.state.servicosOfertados = [];
    const proId = id_usuario || (this.state.currentUser && this.state.currentUser.id_usuario) || 2;
    const novo = {
      id_servico: Date.now(),
      id_usuario: proId,
      nome,
      descricao: descricao || '',
      preco: parseFloat(preco),
      duracao_minutos: parseInt(duracao_minutos, 10) || 60
    };

    if (window.API) {
      try {
        const res = await window.API.createServico({
          id_usuario: proId,
          nome,
          descricao,
          preco: novo.preco,
          duracao_minutos: novo.duracao_minutos,
          senha
        });
        if (res && res.servico) {
          novo.id_servico = res.servico.id_servico;
        }
      } catch (e) {
        throw e;
      }
    }

    this.state.servicosOfertados.unshift(novo);
    this.saveState();
    return novo;
  }

  async removerServico(id_servico, id_usuario) {
    if (!this.state.servicosOfertados) {
      this.state.servicosOfertados = JSON.parse(JSON.stringify(defaultState.servicosOfertados || []));
    }
    this.state.servicosOfertados = this.state.servicosOfertados.filter(s => s.id_servico !== id_servico && s.id_servico != id_servico);
    this.saveState();
    if (window.API) {
      try {
        await window.API.deleteServico(id_servico, id_usuario);
      } catch (e) {
        console.warn('Erro ao remover serviço no backend:', e);
      }
    }
    return true;
  }

  async salvarFormaPagamento(role, dados) {
    if (!this.state.formasPagamento) {
      this.state.formasPagamento = JSON.parse(JSON.stringify(defaultState.formasPagamento));
    }
    this.state.formasPagamento[role] = { ...this.state.formasPagamento[role], ...dados };
    this.saveState();

    if (window.API && this.state.currentUser) {
      try {
        await window.API.savePagamento({
          id_usuario: this.state.currentUser.id_usuario,
          tipo: dados.tipo,
          dados: dados
        });
      } catch (e) {
        console.warn('Erro ao salvar pagamento no backend:', e);
      }
    }
  }

  async criarAgendamento(dados) {
    const novoAtendimento = {
      id_atendimento: Date.now(),
      id_cliente: dados.id_cliente,
      id_freelancer: dados.id_freelancer,
      cliente_nome: (this.state.currentUser && this.state.currentUser.nome_completo) || 'Cliente',
      freelancer_nome: dados.freelancer_nome,
      servico: dados.servico,
      tipo: dados.tipo || 'No Salão',
      valor_total: parseFloat(dados.valor_total),
      taxa_salao: parseFloat(dados.taxa_salao || 0),
      taxa_plataforma: Math.round(dados.valor_total * 0.10 * 100) / 100,
      valor_liquido: Math.round((dados.valor_total - (dados.taxa_salao || 0) - (dados.valor_total * 0.10)) * 100) / 100,
      status: dados.status || 'Pendente',
      data: `${dados.data_agendamento} às ${dados.hora_agendamento}`,
      data_agendamento: dados.data_agendamento,
      hora_agendamento: dados.hora_agendamento,
      duracao_minutos: dados.duracao_minutos,
      distanciaKm: 1.2
    };

    if (window.API) {
      try {
        const res = await window.API.createAtendimento({
          id_cliente: dados.id_cliente,
          id_freelancer: dados.id_freelancer,
          id_espaco: dados.id_espaco || null,
          servico: dados.servico,
          tipo: dados.tipo || 'No Salão',
          status: novoAtendimento.status,
          valor_total: dados.valor_total,
          taxa_salao: dados.taxa_salao || 0,
          distancia_km: 1.2,
          data_agendamento: dados.data_agendamento,
          hora_agendamento: dados.hora_agendamento,
          duracao_minutos: dados.duracao_minutos,
          servicos_adicionais_json: dados.servicos_adicionais
        });
        if (res && res.atendimento) {
          novoAtendimento.id_atendimento = res.atendimento.id_atendimento;
        }
      } catch (e) {
        console.warn('Erro ao registrar agendamento no backend:', e);
      }
    }

    this.state.atendimentos.unshift(novoAtendimento);
    this.saveState();
    this.notify();
    return novoAtendimento;
  }

  toggleFavoritoProfissional(id_usuario) {
    if (!this.state.profissionais) return false;
    const pro = this.state.profissionais.find(p => p.id_usuario === id_usuario);
    if (pro) {
      pro.isFavorita = !pro.isFavorita;
      this.saveState();
      this.notify();
      return pro.isFavorita;
    }
    return false;
  }

  toggleFavoritoSalao(id_usuario) {
    if (!this.state.saloes) {
      this.state.saloes = JSON.parse(JSON.stringify(defaultState.saloes || []));
    }
    const salao = this.state.saloes.find(s => s.id_usuario === id_usuario);
    if (salao) {
      salao.isFavorita = !salao.isFavorita;
      this.saveState();
      this.notify();
      return salao.isFavorita;
    }
    return false;
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

window.getSaloesList = function() {
  const state = window.appState.getState();
  if (state.saloes && state.saloes.length > 0) {
    return state.saloes;
  }
  return defaultState.saloes;
};

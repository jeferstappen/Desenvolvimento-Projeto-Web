-- =============================================================================
-- AGhataCris - Script DDL de Estrutura do Banco de Dados Relacional
-- Modelagem para MySQL e SQLite Relacional
-- =============================================================================

-- Tabela: usuario
-- Centraliza todos os atores da plataforma: Cliente, Freelancer, Salao, Administrador
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_perfil VARCHAR(50) NOT NULL CHECK(tipo_perfil IN ('Cliente', 'Freelancer', 'Salao', 'Administrador')),
    avatar VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    especialidade VARCHAR(150) NULL,
    avaliacao DECIMAL(2, 1) DEFAULT 5.0,
    preco_estimado DECIMAL(10, 2) DEFAULT 0.00,
    modalidade VARCHAR(50) DEFAULT 'Ambos' CHECK(modalidade IN ('Ambos', 'Domicilio', 'Salao')),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    is_online INTEGER DEFAULT 1,
    saldo DECIMAL(10, 2) DEFAULT 0.00,
    ganhos_hoje DECIMAL(10, 2) DEFAULT 0.00,
    receita_passiva_mes DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: espaco
-- Registra as infraestruturas físicas anunciadas pelos salões parceiros
CREATE TABLE IF NOT EXISTS espaco (
    id_espaco INTEGER PRIMARY KEY AUTOINCREMENT,
    id_salao INTEGER NOT NULL,
    id_freelancer_reserva INTEGER NULL,
    tipo_espaco VARCHAR(100) NOT NULL,
    preco_hora DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Disponível' CHECK(status IN ('Disponível', 'Reservado')),
    foto VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80',
    visualizacoes_hoje INTEGER DEFAULT 0,
    tempo_reserva_segundos INTEGER DEFAULT 1800,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_salao) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_freelancer_reserva) REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- Tabela: atendimento
-- Registra as solicitações de serviço de beleza conectando cliente, freelancer e opcionalmente salão
CREATE TABLE IF NOT EXISTS atendimento (
    id_atendimento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    id_freelancer INTEGER NOT NULL,
    id_espaco INTEGER NULL,
    servico VARCHAR(150) NOT NULL,
    tipo VARCHAR(50) NOT NULL DEFAULT 'No Salão' CHECK(tipo IN ('Domicílio', 'No Salão')),
    status VARCHAR(50) NOT NULL DEFAULT 'Pendente' CHECK(status IN ('Pendente', 'Em Andamento', 'Concluído', 'Cancelado', 'Recusado')),
    distancia_km DECIMAL(5, 2) DEFAULT 1.00,
    previsao_chegada VARCHAR(50) DEFAULT '09:45 AM',
    valor_total DECIMAL(10, 2) NOT NULL,
    taxa_salao DECIMAL(10, 2) DEFAULT 0.00,
    taxa_plataforma DECIMAL(10, 2) DEFAULT 0.00,
    valor_liquido DECIMAL(10, 2) NOT NULL,
    data_atendimento VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES usuario(id_usuario) ON DELETE RESTRICT,
    FOREIGN KEY (id_freelancer) REFERENCES usuario(id_usuario) ON DELETE RESTRICT,
    FOREIGN KEY (id_espaco) REFERENCES espaco(id_espaco) ON DELETE SET NULL
);

-- Tabela: transacao
-- Registra o processamento do rateio financeiro (Split Payment)
CREATE TABLE IF NOT EXISTS transacao (
    id_transacao INTEGER PRIMARY KEY AUTOINCREMENT,
    id_atendimento INTEGER NOT NULL UNIQUE,
    valor_total DECIMAL(10, 2) NOT NULL,
    valor_freelancer DECIMAL(10, 2) NOT NULL,
    taxa_salao DECIMAL(10, 2) NOT NULL,
    taxa_plataforma DECIMAL(10, 2) NOT NULL,
    status_pagamento VARCHAR(50) DEFAULT 'Aprovado' CHECK(status_pagamento IN ('Pendente', 'Aprovado', 'Estornado')),
    data_processamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_atendimento) REFERENCES atendimento(id_atendimento) ON DELETE CASCADE
);

-- Tabela: configuracao_plataforma
-- Armazena parâmetros administrativos e taxas do sistema
CREATE TABLE IF NOT EXISTS configuracao_plataforma (
    chave VARCHAR(50) PRIMARY KEY,
    valor VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimização de consultas espaciais e relacionais
CREATE INDEX IF NOT EXISTS idx_usuario_perfil ON usuario(tipo_perfil);
CREATE INDEX IF NOT EXISTS idx_usuario_coords ON usuario(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_espaco_salao ON espaco(id_salao);
CREATE INDEX IF NOT EXISTS idx_espaco_status ON espaco(status);
CREATE INDEX IF NOT EXISTS idx_atendimento_cliente ON atendimento(id_cliente);
CREATE INDEX IF NOT EXISTS idx_atendimento_freelancer ON atendimento(id_freelancer);
CREATE INDEX IF NOT EXISTS idx_atendimento_status ON atendimento(status);

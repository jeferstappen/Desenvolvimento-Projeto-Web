/**
 * AGhataCris - Migration Script para Serviços Ofertados e Formas de Pagamento
 */
const { db } = require('./db');

console.log('Iniciando migração de banco de dados...');

// 1. Tabela servico_ofertado
db.run(`
  CREATE TABLE IF NOT EXISTS servico_ofertado (
    id_servico INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    duracao_minutos INTEGER NOT NULL DEFAULT 60,
    ativo INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
  )
`);

// 2. Tabela forma_pagamento_usuario
db.run(`
  CREATE TABLE IF NOT EXISTS forma_pagamento_usuario (
    id_pagamento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    dados_json TEXT NOT NULL,
    is_preferencial INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
  )
`);

// 3. Colunas na tabela atendimento para agendamento
try {
  db.run('ALTER TABLE atendimento ADD COLUMN data_agendamento VARCHAR(20) NULL');
} catch (e) {}
try {
  db.run('ALTER TABLE atendimento ADD COLUMN hora_agendamento VARCHAR(10) NULL');
} catch (e) {}
try {
  db.run('ALTER TABLE atendimento ADD COLUMN duracao_minutos INTEGER DEFAULT 60');
} catch (e) {}
try {
  db.run('ALTER TABLE atendimento ADD COLUMN servicos_adicionais_json TEXT NULL');
} catch (e) {}

// 4. Inserir serviços ofertados iniciais se tabela estiver vazia
const countServicos = db.queryOne('SELECT COUNT(*) as total FROM servico_ofertado');
if (countServicos && countServicos.total === 0) {
  console.log('Inserindo serviços ofertados padrão...');

  const servicosIniciais = [
    // Mariana Silva (id 2) - Freelancer
    { id_usuario: 2, nome: 'Chapinha & Escova Modeladora', descricao: 'Alisamento térmico e escova com fixação duradoura e brilho intenso', preco: 80.00, duracao_minutos: 60 },
    { id_usuario: 2, nome: 'Maquiagem Social Glam', descricao: 'Produção completa para festas e eventos com cílios postiços inclusos', preco: 150.00, duracao_minutos: 60 },
    { id_usuario: 2, nome: 'Penteado Preso ou Semi-preso', descricao: 'Penteados contemporâneos para convidadas e formandas', preco: 120.00, duracao_minutos: 45 },
    { id_usuario: 2, nome: 'Corte & Hidratação Profunda', descricao: 'Corte personalizado e nutrição com produtos premium', preco: 110.00, duracao_minutos: 60 },

    // Clara Mendes (id 101) - Freelancer
    { id_usuario: 101, nome: 'Design de Sobrancelhas com Henna', descricao: 'Alinhamento com visagismo facial e aplicação de henna', preco: 75.00, duracao_minutos: 45 },
    { id_usuario: 101, nome: 'Micropigmentação Fio a Fio', descricao: 'Técnica hiper-realista para sobrancelhas perfeitas', preco: 280.00, duracao_minutos: 90 },
    { id_usuario: 101, nome: 'Depilação Facial Egípcia', descricao: 'Remoção com linha 100% hipoalergênica', preco: 45.00, duracao_minutos: 30 },

    // Bia Oliveira (id 102) - Freelancer
    { id_usuario: 102, nome: 'Maquiagem Social com Cílios', descricao: 'Make profissional com contorno e iluminação impecáveis', preco: 180.00, duracao_minutos: 60 },
    { id_usuario: 102, nome: 'Maquiagem para Noivas / Madrinhas', descricao: 'Técnica blindada à prova d’água e alta durabilidade', preco: 250.00, duracao_minutos: 90 },

    // Juliana Costa (id 103) - Freelancer
    { id_usuario: 103, nome: 'Manicure em Gel & Nail Art', descricao: 'Esmaltação em gel de alta durabilidade com decorações', preco: 85.00, duracao_minutos: 60 },
    { id_usuario: 103, nome: 'Alongamento de Unhas em Fibra', descricao: 'Estrutura resistente com acabamento fino e natural', preco: 150.00, duracao_minutos: 90 },
    { id_usuario: 103, nome: 'Pedicure & Spa dos Pés', descricao: 'Esfoliação, hidratação profunda e cutilagem russa', preco: 70.00, duracao_minutos: 45 },

    // Beatriz Ramos (id 104) - Freelancer
    { id_usuario: 104, nome: 'Hair Stylist & Coloração Global', descricao: 'Coloração profissional com proteção da fibra capilar', preco: 220.00, duracao_minutos: 120 },
    { id_usuario: 104, nome: 'Botox Capilar & Reconstrução', descricao: 'Redução de volume, eliminação de frizz e brilho', preco: 160.00, duracao_minutos: 90 },
    { id_usuario: 104, nome: 'Escova Modelada com Babyliss', descricao: 'Ondas volumosas estilo capa de revista', preco: 90.00, duracao_minutos: 45 },

    // Studio Elegance Jardins (id 3) - Salão
    { id_usuario: 3, nome: 'Pacote Completo: Cabelo, Make & Unha', descricao: 'Experiência completa no salão com atendimento simultâneo de especialistas', preco: 290.00, duracao_minutos: 120 },
    { id_usuario: 3, nome: 'Escova Progressiva Orgânica', descricao: 'Alisamento sem formol, fios maleáveis e brilho espelhado', preco: 200.00, duracao_minutos: 120 },
    { id_usuario: 3, nome: 'Limpeza de Pele Profunda com Peeling', descricao: 'Higienização, extração de comedões e máscara de LED', preco: 180.00, duracao_minutos: 60 },
    { id_usuario: 3, nome: 'Corte Feminino com Terapeuta Capilar', descricao: 'Análise do couro cabeludo, lavagem relaxante e corte', preco: 130.00, duracao_minutos: 60 },

    // Belle Époque Paulista (id 4) - Salão
    { id_usuario: 4, nome: 'Produção Completa de Gala', descricao: 'Penteado exclusivo, maquiagem de alta definição e camarim VIP', preco: 380.00, duracao_minutos: 180 },
    { id_usuario: 4, nome: 'Tratamento Reconstrutor Kérastase', descricao: 'Cronograma capilar intensivo com diagnóstico e vapor de ozônio', preco: 190.00, duracao_minutos: 60 },
    { id_usuario: 4, nome: 'Manicure e Pedicure Express', descricao: 'Cuidado rápido e de alto padrão para sua rotina', preco: 90.00, duracao_minutos: 60 }
  ];

  for (const s of servicosIniciais) {
    db.run(
      'INSERT INTO servico_ofertado (id_usuario, nome, descricao, preco, duracao_minutos) VALUES (?, ?, ?, ?, ?)',
      [s.id_usuario, s.nome, s.descricao, s.preco, s.duracao_minutos]
    );
  }
  console.log(`Inseridos ${servicosIniciais.length} serviços iniciais com sucesso!`);
}

// 5. Inserir formas de pagamento padrão se vazio
const countPagamentos = db.queryOne('SELECT COUNT(*) as total FROM forma_pagamento_usuario');
if (countPagamentos && countPagamentos.total === 0) {
  console.log('Inserindo formas de pagamento padrão...');

  // Cliente (id 1): Cartão de Crédito
  db.run(`
    INSERT INTO forma_pagamento_usuario (id_usuario, tipo, dados_json, is_preferencial)
    VALUES (
      1,
      'cartao_credito',
      '{"numero_mascarado":"•••• •••• •••• 4242","titular":"ISABELA SANTOS","validade":"08/29","bandeira":"Mastercard"}',
      1
    )
  `);

  // Freelancer (id 2): Chave PIX e Conta Corrente
  db.run(`
    INSERT INTO forma_pagamento_usuario (id_usuario, tipo, dados_json, is_preferencial)
    VALUES (
      2,
      'pix',
      '{"tipo_chave":"CPF","chave":"234.567.890-11","titular":"Mariana Silva"}',
      1
    )
  `);

  // Salão (id 3): SOMENTE Conta Corrente (sem PIX)
  db.run(`
    INSERT INTO forma_pagamento_usuario (id_usuario, tipo, dados_json, is_preferencial)
    VALUES (
      3,
      'conta_corrente',
      '{"banco":"Banco Itaú (341)","agencia":"0124","conta":"48291-5","tipo_conta":"Corrente","titular":"Studio Elegance Jardins EIRELI","documento":"12.345.678/0001-90"}',
      1
    )
  `);

  console.log('Formas de pagamento padrão inseridas com sucesso!');
}

console.log('Migração concluída com sucesso!');

-- =============================================================================
-- AGhataCris - Script DML de População Inicial (Seed Data)
-- Usuários padrão, profissionais mapeadas por geolocalização e espaços
-- =============================================================================

-- Inserção de Usuários Base e Perfis Principais (com hash seguro)
-- Senha padrão para testes: '12345678' (armazenada com SHA256 com salt)
-- Formato do hash: <salt_hex>:<hash_hex>
-- Salt: a1b2c3d4e5f60718, Hash de "12345678" + Salt
INSERT OR IGNORE INTO usuario (id_usuario, nome_completo, email, senha_hash, tipo_perfil, avatar, especialidade, avaliacao, preco_estimado, modalidade, latitude, longitude, is_online, saldo, ganhos_hoje, receita_passiva_mes)
VALUES 
-- 1: Cliente Padrão (Isabela Santos)
(1, 'Isabela Santos', 'isabela.santos@email.com', 'a1b2c3d4e5f60718:2d54e4c9f131aef71a62d08a5cb33a69a0a030b65f3f019f39542a17cb6ec272', 'Cliente', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', NULL, 5.0, 0.0, 'Ambos', -23.56168400, -46.65598100, 1, 0.00, 0.00, 0.00),

-- 2: Freelancer Padrão (Mariana Silva)
(2, 'Mariana Silva', 'mariana.silva@beauty.com', 'a1b2c3d4e5f60718:2d54e4c9f131aef71a62d08a5cb33a69a0a030b65f3f019f39542a17cb6ec272', 'Freelancer', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'Hair Specialist & Maquiagem', 4.9, 150.00, 'Ambos', -23.56200000, -46.65600000, 1, 1250.00, 150.00, 0.00),

-- 3: Salão Parceiro Padrão (Studio Elegance Jardins)
(3, 'Studio Elegance Jardins', 'contato@studioelegance.com.br', 'a1b2c3d4e5f60718:2d54e4c9f131aef71a62d08a5cb33a69a0a030b65f3f019f39542a17cb6ec272', 'Salao', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150&auto=format&fit=crop&q=80', 'Salão Premium Multidisciplinar', 4.9, 0.00, 'Salao', -23.56450000, -46.65200000, 1, 0.00, 0.00, 850.00),

-- 4: Segundo Salão Parceiro (Belle Époque Paulista)
(4, 'Belle Époque Paulista', 'contato@belleepoque.com.br', 'a1b2c3d4e5f60718:2d54e4c9f131aef71a62d08a5cb33a69a0a030b65f3f019f39542a17cb6ec272', 'Salao', 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=150&auto=format&fit=crop&q=80', 'Espaço Estético Paulista', 4.8, 0.00, 'Salao', -23.55800000, -46.65900000, 1, 0.00, 0.00, 620.00),

-- 99: Administrador
(99, 'Administrador do Sistema', 'admin@aghatacris.com.br', 'a1b2c3d4e5f60718:2d54e4c9f131aef71a62d08a5cb33a69a0a030b65f3f019f39542a17cb6ec272', 'Administrador', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 'Gestão e Supervisão', 5.0, 0.00, 'Ambos', -23.56168400, -46.65598100, 1, 0.00, 0.00, 0.00),

-- Profissionais Adicionais para o Radar de 15km
(101, 'Clara Mendes', 'clara.mendes@email.com', 'a1b2c3d4e5f60718:2d54e4c9f131aef71a62d08a5cb33a69a0a030b65f3f019f39542a17cb6ec272', 'Freelancer', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'Design de Sobrancelhas', 4.8, 75.00, 'Ambos', -23.56300000, -46.65300000, 1, 620.00, 75.00, 0.00),

(102, 'Bia Oliveira', 'bia.oliveira@email.com', 'a1b2c3d4e5f60718:2d54e4c9f131aef71a62d08a5cb33a69a0a030b65f3f019f39542a17cb6ec272', 'Freelancer', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', 'Maquiagem Social', 5.0, 180.00, 'Domicilio', -23.55900000, -46.65800000, 1, 980.00, 180.00, 0.00),

(103, 'Juliana Costa', 'juliana.costa@email.com', 'a1b2c3d4e5f60718:2d54e4c9f131aef71a62d08a5cb33a69a0a030b65f3f019f39542a17cb6ec272', 'Freelancer', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', 'Manicure Gel & Nail Art', 5.0, 85.00, 'Salao', -23.56500000, -46.66000000, 1, 450.00, 85.00, 0.00),

(104, 'Beatriz Ramos', 'beatriz.ramos@email.com', 'a1b2c3d4e5f60718:2d54e4c9f131aef71a62d08a5cb33a69a0a030b65f3f019f39542a17cb6ec272', 'Freelancer', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80', 'Hair Stylist & Coloração', 5.0, 220.00, 'Ambos', -23.55500000, -46.65000000, 1, 1400.00, 220.00, 0.00);

-- Inserção de Espaços Ociosos Anunciados pelos Salões Parceiros
INSERT OR IGNORE INTO espaco (id_espaco, id_salao, id_freelancer_reserva, tipo_espaco, preco_hora, status, foto, visualizacoes_hoje, tempo_reserva_segundos)
VALUES 
(1, 3, 2, 'Cadeira de Cabelo', 25.00, 'Reservado', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80', 14, 1800),
(2, 3, NULL, 'Maca de Estética', 30.00, 'Disponível', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80', 12, 1800),
(3, 4, NULL, 'Bancada de Maquiagem', 20.00, 'Disponível', 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=200&auto=format&fit=crop&q=80', 8, 1800),
(4, 4, NULL, 'Lavatório & Escovação', 22.00, 'Disponível', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&auto=format&fit=crop&q=80', 5, 1800);

-- Inserção de Histórico de Atendimentos
INSERT OR IGNORE INTO atendimento (id_atendimento, id_cliente, id_freelancer, id_espaco, servico, tipo, status, distancia_km, previsao_chegada, valor_total, taxa_salao, taxa_plataforma, valor_liquido, data_atendimento)
VALUES
(1001, 1, 2, NULL, 'Maquiagem & Penteado', 'Domicílio', 'Em Andamento', 1.20, '09:45 AM', 280.00, 0.00, 28.00, 252.00, 'Hoje, 09:30'),
(1002, 1, 2, 1, 'Corte & Escova Premium', 'No Salão', 'Concluído', 1.50, '14:30 PM', 120.00, 20.00, 12.00, 88.00, '15 Maio, 14:30'),
(1003, 1, 103, 2, 'Manicure Gel & Nail Art', 'No Salão', 'Concluído', 2.10, '10:00 AM', 85.00, 15.00, 8.50, 61.50, '02 Maio, 10:00'),
(1004, 1, 101, 3, 'Limpeza de Pele Profunda', 'No Salão', 'Concluído', 1.80, '16:15 PM', 210.00, 30.00, 21.00, 159.00, '18 Abr, 16:15');

-- Inserção de Transações Concluídas (Split Payment)
INSERT OR IGNORE INTO transacao (id_transacao, id_atendimento, valor_total, valor_freelancer, taxa_salao, taxa_plataforma, status_pagamento)
VALUES
(1, 1002, 120.00, 88.00, 20.00, 12.00, 'Aprovado'),
(2, 1003, 85.00, 61.50, 15.00, 8.50, 'Aprovado'),
(3, 1004, 210.00, 159.00, 30.00, 21.00, 'Aprovado');

-- Inserção de Configurações da Plataforma
INSERT OR REPLACE INTO configuracao_plataforma (chave, valor, descricao)
VALUES 
('taxa_plataforma_percentual', '10.0', 'Taxa percentual de intermediação cobrada por atendimento'),
('raio_busca_maximo_km', '15.0', 'Raio máximo de geolocalização para busca de profissionais'),
('tempo_limite_reserva_minutos', '30', 'Tempo de tolerância para o comparecimento ao salão parceiro');

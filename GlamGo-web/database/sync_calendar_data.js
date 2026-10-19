const { db } = require('./db');

console.log('Sincronizando agendamentos para o calendário de Outubro de 2026...');

// 1. Atualizar atendimentos existentes
db.run(`UPDATE atendimento SET data_agendamento = '2026-10-19', hora_agendamento = '09:30', status = 'Concluído' WHERE id_atendimento = 1001`);
db.run(`UPDATE atendimento SET data_agendamento = '2026-10-18', hora_agendamento = '10:00', status = 'Concluído' WHERE id_atendimento = 1003`);

// 2. Inserir agendamentos nos status válidos ('Pendente', 'Em Andamento', 'Concluído')
const check19 = db.queryOne(`SELECT COUNT(*) as count FROM atendimento WHERE id_freelancer = 2 AND data_agendamento = '2026-10-19' AND hora_agendamento = '14:30'`);
if (!check19 || check19.count === 0) {
  db.run(`
    INSERT INTO atendimento (
      id_cliente, id_freelancer, id_espaco, servico, tipo, status,
      distancia_km, previsao_chegada, valor_total, taxa_salao, taxa_plataforma,
      valor_liquido, data_atendimento, data_agendamento, hora_agendamento, duracao_minutos
    ) VALUES (
      1, 2, 1, 'Design de Sobrancelhas', 'No Salão', 'Em Andamento',
      1.5, '14:30', 75.00, 15.00, 7.50,
      52.50, '2026-10-19 às 14:30', '2026-10-19', '14:30', 45
    )
  `);
}

const check19b = db.queryOne(`SELECT COUNT(*) as count FROM atendimento WHERE id_freelancer = 2 AND data_agendamento = '2026-10-19' AND hora_agendamento = '16:30'`);
if (!check19b || check19b.count === 0) {
  db.run(`
    INSERT INTO atendimento (
      id_cliente, id_freelancer, id_espaco, servico, tipo, status,
      distancia_km, previsao_chegada, valor_total, taxa_salao, taxa_plataforma,
      valor_liquido, data_atendimento, data_agendamento, hora_agendamento, duracao_minutos
    ) VALUES (
      1, 2, 1, 'Corte & Escova Modeladora', 'No Salão', 'Pendente',
      1.2, '16:30', 130.00, 20.00, 13.00,
      97.00, '2026-10-19 às 16:30', '2026-10-19', '16:30', 60
    )
  `);
}

const check20 = db.queryOne(`SELECT COUNT(*) as count FROM atendimento WHERE id_freelancer = 2 AND data_agendamento = '2026-10-20'`);
if (!check20 || check20.count === 0) {
  db.run(`
    INSERT INTO atendimento (
      id_cliente, id_freelancer, id_espaco, servico, tipo, status,
      distancia_km, previsao_chegada, valor_total, taxa_salao, taxa_plataforma,
      valor_liquido, data_atendimento, data_agendamento, hora_agendamento, duracao_minutos
    ) VALUES (
      1, 2, NULL, 'Alongamento de Cílios Fio a Fio', 'Domicílio', 'Pendente',
      2.1, '11:00', 150.00, 0.00, 15.00,
      135.00, '2026-10-20 às 11:00', '2026-10-20', '11:00', 90
    )
  `);
  db.run(`
    INSERT INTO atendimento (
      id_cliente, id_freelancer, id_espaco, servico, tipo, status,
      distancia_km, previsao_chegada, valor_total, taxa_salao, taxa_plataforma,
      valor_liquido, data_atendimento, data_agendamento, hora_agendamento, duracao_minutos
    ) VALUES (
      1, 2, 1, 'Maquiagem Social Glam', 'No Salão', 'Pendente',
      1.2, '15:00', 190.00, 25.00, 19.00,
      146.00, '2026-10-20 às 15:00', '2026-10-20', '15:00', 60
    )
  `);
}

const check22 = db.queryOne(`SELECT COUNT(*) as count FROM atendimento WHERE id_freelancer = 2 AND data_agendamento = '2026-10-22'`);
if (!check22 || check22.count === 0) {
  db.run(`
    INSERT INTO atendimento (
      id_cliente, id_freelancer, id_espaco, servico, tipo, status,
      distancia_km, previsao_chegada, valor_total, taxa_salao, taxa_plataforma,
      valor_liquido, data_atendimento, data_agendamento, hora_agendamento, duracao_minutos
    ) VALUES (
      1, 2, 1, 'Corte & Hidratação Profunda', 'No Salão', 'Pendente',
      1.5, '15:30', 160.00, 20.00, 16.00,
      124.00, '2026-10-22 às 15:30', '2026-10-22', '15:30', 60
    )
  `);
}

console.log('Agendamentos sincronizados com sucesso no banco!');

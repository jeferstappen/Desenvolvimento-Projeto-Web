/**
 * AGhataCris - Entidade e Repositório: Atendimento (RF05, RF06, RF10)
 * Gerencia ciclo de vida dos chamados sob demanda e aciona o Split Payment.
 */

const { db } = require('../../database/db');
const UsuarioModel = require('./UsuarioModel');
const EspacoModel = require('./EspacoModel');
const TransacaoModel = require('./TransacaoModel');
const config = require('../config');

class AtendimentoModel {
  /**
   * Cliente solicita pronto atendimento para uma profissional específica (RF05)
   */
  static create({
    id_cliente,
    id_freelancer,
    id_espaco = null,
    servico,
    tipo = 'No Salão',
    valor_total,
    taxa_salao = 0.0,
    distancia_km = 1.2,
    previsao_chegada = '09:45 AM'
  }) {
    const total = parseFloat(valor_total);
    const taxaSalao = parseFloat(taxa_salao) || 0.0;
    
    // Obter taxa da plataforma configurada (default 10%)
    const configRow = db.queryOne("SELECT valor FROM configuracao_plataforma WHERE chave = 'taxa_plataforma_percentual'");
    const taxaPercent = configRow ? parseFloat(configRow.valor) : config.DEFAULT_PLATFORM_FEE_PERCENT;
    
    const taxaPlataforma = Math.round(total * (taxaPercent / 100) * 100) / 100;
    const valorLiquido = Math.round((total - taxaSalao - taxaPlataforma) * 100) / 100;

    const dataFormatada = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

    const sql = `
      INSERT INTO atendimento (
        id_cliente, id_freelancer, id_espaco, servico, tipo,
        status, distancia_km, previsao_chegada, valor_total,
        taxa_salao, taxa_plataforma, valor_liquido, data_atendimento
      ) VALUES (?, ?, ?, ?, ?, 'Em Andamento', ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = db.run(sql, [
      id_cliente,
      id_freelancer,
      id_espaco,
      servico,
      tipo,
      distancia_km,
      previsao_chegada,
      total,
      taxaSalao,
      taxaPlataforma,
      valorLiquido,
      dataFormatada
    ]);

    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const sql = `
      SELECT 
        a.*,
        c.nome_completo AS cliente_nome,
        c.avatar AS cliente_avatar,
        f.nome_completo AS freelancer_nome,
        f.avatar AS freelancer_avatar,
        f.especialidade AS freelancer_especialidade,
        e.tipo_espaco,
        s.nome_completo AS salao_nome
      FROM atendimento a
      JOIN usuario c ON a.id_cliente = c.id_usuario
      JOIN usuario f ON a.id_freelancer = f.id_usuario
      LEFT JOIN espaco e ON a.id_espaco = e.id_espaco
      LEFT JOIN usuario s ON e.id_salao = s.id_usuario
      WHERE a.id_atendimento = ?
    `;
    return db.queryOne(sql, [id]);
  }

  static findAll({ id_cliente, id_freelancer, status } = {}) {
    let sql = `
      SELECT 
        a.*,
        c.nome_completo AS cliente_nome,
        c.avatar AS cliente_avatar,
        f.nome_completo AS freelancer_nome,
        f.avatar AS freelancer_avatar,
        f.especialidade AS freelancer_especialidade,
        e.tipo_espaco,
        s.nome_completo AS salao_nome
      FROM atendimento a
      JOIN usuario c ON a.id_cliente = c.id_usuario
      JOIN usuario f ON a.id_freelancer = f.id_usuario
      LEFT JOIN espaco e ON a.id_espaco = e.id_espaco
      LEFT JOIN usuario s ON e.id_salao = s.id_usuario
      WHERE 1=1
    `;
    const params = [];

    if (id_cliente) {
      sql += ' AND a.id_cliente = ?';
      params.push(id_cliente);
    }

    if (id_freelancer) {
      sql += ' AND a.id_freelancer = ?';
      params.push(id_freelancer);
    }

    if (status) {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY a.id_atendimento DESC';
    return db.query(sql, params);
  }

  /**
   * Atualiza status do atendimento e aciona Split Payment se Concluído (RF06, RF10)
   */
  static updateStatus(id, newStatus) {
    const atendimento = this.findById(id);
    if (!atendimento) throw new Error('Atendimento não encontrado');

    db.run('UPDATE atendimento SET status = ? WHERE id_atendimento = ?', [newStatus, id]);

    // Se o atendimento foi concluído, processar a divisão financeira (Split Payment)
    if (newStatus === 'Concluído') {
      // 1. Criar registro na tabela transacao
      const transacaoExistente = TransacaoModel.findByAtendimentoId(id);
      if (!transacaoExistente) {
        TransacaoModel.create({
          id_atendimento: id,
          valor_total: atendimento.valor_total,
          valor_freelancer: atendimento.valor_liquido,
          taxa_salao: atendimento.taxa_salao,
          taxa_plataforma: atendimento.taxa_plataforma,
          status_pagamento: 'Aprovado'
        });
      }

      // 2. Creditar valor líquido na carteira da freelancer (RF10)
      UsuarioModel.updateFinances(atendimento.id_freelancer, {
        saldoIncrement: atendimento.valor_liquido,
        ganhosHojeIncrement: atendimento.valor_liquido
      });

      // 3. Se houver taxa de salão e espaço alocado, creditar na receita passiva do salão
      if (atendimento.id_espaco && atendimento.taxa_salao > 0) {
        const espaco = EspacoModel.findById(atendimento.id_espaco);
        if (espaco && espaco.id_salao) {
          UsuarioModel.updateFinances(espaco.id_salao, {
            receitaPassivaIncrement: atendimento.taxa_salao
          });
        }
      }
    }

    return this.findById(id);
  }
}

module.exports = AtendimentoModel;

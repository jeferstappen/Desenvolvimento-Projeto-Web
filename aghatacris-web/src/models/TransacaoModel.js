/**
 * AGhataCris - Entidade e Repositório: Transacao (RF10 - Split Payment)
 * Gerencia o rateio financeiro automático entre Freelancer, Salão Parceiro e Plataforma.
 */

const { db } = require('../../database/db');

class TransacaoModel {
  /**
   * Registra a divisão financeira de uma transação finalizada
   */
  static create({
    id_atendimento,
    valor_total,
    valor_freelancer,
    taxa_salao = 0.0,
    taxa_plataforma = 0.0,
    status_pagamento = 'Aprovado'
  }) {
    const sql = `
      INSERT INTO transacao (id_atendimento, valor_total, valor_freelancer, taxa_salao, taxa_plataforma, status_pagamento)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = db.run(sql, [
      id_atendimento,
      parseFloat(valor_total),
      parseFloat(valor_freelancer),
      parseFloat(taxa_salao),
      parseFloat(taxa_plataforma),
      status_pagamento
    ]);

    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    return db.queryOne('SELECT * FROM transacao WHERE id_transacao = ?', [id]);
  }

  static findByAtendimentoId(id_atendimento) {
    return db.queryOne('SELECT * FROM transacao WHERE id_atendimento = ?', [id_atendimento]);
  }

  static findAll() {
    return db.query('SELECT * FROM transacao ORDER BY id_transacao DESC');
  }

  static getTotalStats() {
    const result = db.queryOne(`
      SELECT 
        COALESCE(SUM(valor_total), 0) AS total_transacionado,
        COALESCE(SUM(taxa_plataforma), 0) AS total_comissao_plataforma,
        COALESCE(SUM(taxa_salao), 0) AS total_repasses_salao,
        COALESCE(SUM(valor_freelancer), 0) AS total_repasses_freelancers,
        COUNT(*) AS total_transacoes
      FROM transacao
    `);
    return result;
  }
}

module.exports = TransacaoModel;

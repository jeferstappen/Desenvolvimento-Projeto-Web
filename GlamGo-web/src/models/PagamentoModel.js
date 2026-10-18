/**
 * AGhataCris - Entidade e Repositório: PagamentoModel
 * Gerencia métodos de pagamento salvos (cartões de crédito, PIX, conta corrente)
 */

const { db } = require('../../database/db');

class PagamentoModel {
  static save({ id_usuario, tipo, dados_json, is_preferencial = 1 }) {
    // Se for preferencial, desmarcar os outros do mesmo usuário
    if (is_preferencial) {
      db.run('UPDATE forma_pagamento_usuario SET is_preferencial = 0 WHERE id_usuario = ?', [id_usuario]);
    }

    // Se já tiver uma forma de pagamento desse tipo para esse usuário, atualizar ou criar nova
    const existing = db.queryOne(
      'SELECT id_pagamento FROM forma_pagamento_usuario WHERE id_usuario = ? AND tipo = ?',
      [id_usuario, tipo]
    );

    const serializedData = typeof dados_json === 'string' ? dados_json : JSON.stringify(dados_json);

    if (existing) {
      db.run(
        'UPDATE forma_pagamento_usuario SET dados_json = ?, is_preferencial = ? WHERE id_pagamento = ?',
        [serializedData, is_preferencial ? 1 : 0, existing.id_pagamento]
      );
      return this.findById(existing.id_pagamento);
    } else {
      const result = db.run(
        'INSERT INTO forma_pagamento_usuario (id_usuario, tipo, dados_json, is_preferencial) VALUES (?, ?, ?, ?)',
        [id_usuario, tipo, serializedData, is_preferencial ? 1 : 0]
      );
      return this.findById(result.lastInsertRowid);
    }
  }

  static findById(id) {
    const row = db.queryOne('SELECT * FROM forma_pagamento_usuario WHERE id_pagamento = ?', [id]);
    if (row && row.dados_json) {
      try {
        row.dados = JSON.parse(row.dados_json);
      } catch (e) {
        row.dados = {};
      }
    }
    return row;
  }

  static findByUsuario(id_usuario) {
    const rows = db.query(
      'SELECT * FROM forma_pagamento_usuario WHERE id_usuario = ? ORDER BY is_preferencial DESC, id_pagamento DESC',
      [id_usuario]
    );
    return rows.map(r => {
      try {
        r.dados = JSON.parse(r.dados_json);
      } catch (e) {
        r.dados = {};
      }
      return r;
    });
  }

  static delete(id, id_usuario) {
    return db.run(
      'DELETE FROM forma_pagamento_usuario WHERE id_pagamento = ? AND id_usuario = ?',
      [id, id_usuario]
    );
  }
}

module.exports = PagamentoModel;

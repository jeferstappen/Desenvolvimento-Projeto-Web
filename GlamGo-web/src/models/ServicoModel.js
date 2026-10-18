/**
 * AGhataCris - Entidade e Repositório: ServicoModel
 * Gerencia os serviços ofertados por freelancers e salões parceiros
 */

const { db } = require('../../database/db');

class ServicoModel {
  static create({ id_usuario, nome, descricao = '', preco, duracao_minutos = 60 }) {
    const sql = `
      INSERT INTO servico_ofertado (id_usuario, nome, descricao, preco, duracao_minutos, ativo)
      VALUES (?, ?, ?, ?, ?, 1)
    `;
    const result = db.run(sql, [
      id_usuario,
      nome,
      descricao,
      parseFloat(preco),
      parseInt(duracao_minutos, 10)
    ]);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const sql = `
      SELECT s.*, u.nome_completo AS profissional_nome, u.tipo_perfil
      FROM servico_ofertado s
      JOIN usuario u ON s.id_usuario = u.id_usuario
      WHERE s.id_servico = ?
    `;
    return db.queryOne(sql, [id]);
  }

  static findByUsuario(id_usuario) {
    const sql = `
      SELECT * FROM servico_ofertado
      WHERE id_usuario = ? AND ativo = 1
      ORDER BY id_servico DESC
    `;
    return db.query(sql, [id_usuario]);
  }

  static findAll() {
    const sql = `
      SELECT s.*, u.nome_completo AS profissional_nome, u.tipo_perfil
      FROM servico_ofertado s
      JOIN usuario u ON s.id_usuario = u.id_usuario
      WHERE s.ativo = 1
      ORDER BY s.id_servico DESC
    `;
    return db.query(sql);
  }

  static delete(id, id_usuario) {
    const sql = id_usuario
      ? 'UPDATE servico_ofertado SET ativo = 0 WHERE id_servico = ? AND id_usuario = ?'
      : 'UPDATE servico_ofertado SET ativo = 0 WHERE id_servico = ?';
    const params = id_usuario ? [id, id_usuario] : [id];
    return db.run(sql, params);
  }
}

module.exports = ServicoModel;

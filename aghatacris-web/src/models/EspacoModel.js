/**
 * AGhataCris - Entidade e Repositório: Espaco (RF07, RF08, RF09)
 * Gerencia anúncios de infraestruturas ociosas de salões parceiros e reservas por freelancers.
 */

const { db } = require('../../database/db');
const { calculateHaversineDistance } = require('../utils/haversine');
const config = require('../config');

class EspacoModel {
  /**
   * Salão Parceiro anuncia novo espaço físico ocioso (RF07)
   */
  static create({
    id_salao,
    tipo_espaco,
    preco_hora,
    foto,
    status = 'Disponível'
  }) {
    const defaultFoto = foto || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80';
    const sql = `
      INSERT INTO espaco (id_salao, tipo_espaco, preco_hora, status, foto, visualizacoes_hoje, tempo_reserva_segundos)
      VALUES (?, ?, ?, ?, ?, 1, 1800)
    `;

    const result = db.run(sql, [
      id_salao,
      tipo_espaco,
      parseFloat(preco_hora),
      status,
      defaultFoto
    ]);

    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const sql = `
      SELECT e.*, u.nome_completo AS nome_salao, u.latitude AS salao_latitude, u.longitude AS salao_longitude
      FROM espaco e
      JOIN usuario u ON e.id_salao = u.id_usuario
      WHERE e.id_espaco = ?
    `;
    return db.queryOne(sql, [id]);
  }

  /**
   * Listar espaços ociosos com ordenação por proximidade geográfica (RF08)
   */
  static findAll({
    id_salao,
    status,
    latitude = -23.561684,
    longitude = -46.655981
  } = {}) {
    let sql = `
      SELECT e.*, u.nome_completo AS nome_salao, u.latitude AS salao_latitude, u.longitude AS salao_longitude
      FROM espaco e
      JOIN usuario u ON e.id_salao = u.id_usuario
      WHERE 1=1
    `;
    const params = [];

    if (id_salao) {
      sql += ' AND e.id_salao = ?';
      params.push(id_salao);
    }

    if (status) {
      sql += ' AND e.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY e.id_espaco DESC';
    const espacos = db.query(sql, params);

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const listWithDistance = espacos.map(esp => {
      const dist = calculateHaversineDistance(
        userLat,
        userLon,
        parseFloat(esp.salao_latitude || -23.561684),
        parseFloat(esp.salao_longitude || -46.655981)
      );
      return {
        ...esp,
        distanciaKm: dist
      };
    });

    // Ordenar por proximidade geográfica do usuário solicitante (RF08)
    listWithDistance.sort((a, b) => a.distanciaKm - b.distanciaKm);
    return listWithDistance;
  }

  /**
   * Freelancer reserva um espaço em salão parceiro (RF09)
   */
  static reserve(id_espaco, id_freelancer) {
    const espaco = this.findById(id_espaco);
    if (!espaco) throw new Error('Espaço não encontrado');
    if (espaco.status === 'Reservado' && espaco.id_freelancer_reserva !== id_freelancer) {
      throw new Error('Espaço já se encontra reservado por outro profissional');
    }

    db.run(`
      UPDATE espaco 
      SET status = 'Reservado', 
          id_freelancer_reserva = ?,
          tempo_reserva_segundos = 1800
      WHERE id_espaco = ?
    `, [id_freelancer, id_espaco]);

    return this.findById(id_espaco);
  }

  /**
   * Libera a reserva do espaço
   */
  static release(id_espaco) {
    db.run(`
      UPDATE espaco 
      SET status = 'Disponível', 
          id_freelancer_reserva = NULL,
          tempo_reserva_segundos = 1800
      WHERE id_espaco = ?
    `, [id_espaco]);

    return this.findById(id_espaco);
  }

  /**
   * Alternar status de disponibilidade
   */
  static toggleStatus(id_espaco) {
    const esp = this.findById(id_espaco);
    if (!esp) return null;
    const novoStatus = esp.status === 'Disponível' ? 'Reservado' : 'Disponível';
    db.run('UPDATE espaco SET status = ? WHERE id_espaco = ?', [novoStatus, id_espaco]);
    return this.findById(id_espaco);
  }

  static delete(id_espaco) {
    return db.run('DELETE FROM espaco WHERE id_espaco = ?', [id_espaco]);
  }
}

module.exports = EspacoModel;

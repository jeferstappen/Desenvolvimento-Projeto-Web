/**
 * AGhataCris - Entidade e Repositório: Usuario (RF01, RF02, RF03, RF04)
 */

const { db } = require('../../database/db');
const { hashPassword } = require('../utils/crypto');
const { calculateHaversineDistance } = require('../utils/haversine');
const config = require('../config');

class UsuarioModel {
  /**
   * Cria um novo usuário com perfil segregado (RF01, RNF03)
   */
  static create({
    nome_completo,
    email,
    senha,
    tipo_perfil,
    avatar,
    especialidade,
    preco_estimado,
    modalidade,
    latitude = -23.561684,
    longitude = -46.655981
  }) {
    // Normalizar perfil
    const perfisValidos = ['Cliente', 'Freelancer', 'Salao', 'Administrador'];
    const perfilFormatado = tipo_perfil.charAt(0).toUpperCase() + tipo_perfil.slice(1).toLowerCase();
    const finalPerfil = perfisValidos.includes(perfilFormatado) 
      ? (perfilFormatado === 'Salao' ? 'Salao' : perfilFormatado)
      : (tipo_perfil === 'salao' ? 'Salao' : 'Cliente');

    const senha_hash = hashPassword(senha || '12345678');
    const avatarDefault = avatar || (
      finalPerfil === 'Salao'
        ? 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    );

    const sql = `
      INSERT INTO usuario (
        nome_completo, email, senha_hash, tipo_perfil, avatar,
        especialidade, preco_estimado, modalidade, latitude, longitude,
        is_online, saldo, ganhos_hoje, receita_passiva_mes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0.0, 0.0, 0.0)
    `;

    const result = db.run(sql, [
      nome_completo,
      email.toLowerCase().trim(),
      senha_hash,
      finalPerfil,
      avatarDefault,
      especialidade || null,
      parseFloat(preco_estimado) || 0.0,
      modalidade || 'Ambos',
      parseFloat(latitude),
      parseFloat(longitude)
    ]);

    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const user = db.queryOne('SELECT * FROM usuario WHERE id_usuario = ?', [id]);
    if (!user) return null;
    delete user.senha_hash; // Nunca expor o hash de senha
    return user;
  }

  static findByEmail(email) {
    return db.queryOne('SELECT * FROM usuario WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
  }

  static findAll({ tipo_perfil, busca, is_online } = {}) {
    let sql = 'SELECT id_usuario, nome_completo, email, tipo_perfil, avatar, especialidade, avaliacao, preco_estimado, modalidade, latitude, longitude, is_online, saldo, ganhos_hoje, receita_passiva_mes, created_at FROM usuario WHERE 1=1';
    const params = [];

    if (tipo_perfil) {
      sql += ' AND LOWER(tipo_perfil) = LOWER(?)';
      params.push(tipo_perfil);
    }

    if (is_online !== undefined) {
      sql += ' AND is_online = ?';
      params.push(is_online ? 1 : 0);
    }

    if (busca) {
      sql += ' AND (LOWER(nome_completo) LIKE ? OR LOWER(especialidade) LIKE ?)';
      params.push(`%${busca.toLowerCase()}%`, `%${busca.toLowerCase()}%`);
    }

    sql += ' ORDER BY id_usuario ASC';
    return db.query(sql, params);
  }

  /**
   * Atualização de GPS (RF02)
   */
  static updateLocation(id, latitude, longitude) {
    db.run(
      'UPDATE usuario SET latitude = ?, longitude = ? WHERE id_usuario = ?',
      [parseFloat(latitude), parseFloat(longitude), id]
    );
    return this.findById(id);
  }

  /**
   * Alternar disponibilidade online
   */
  static updateOnlineStatus(id, isOnline) {
    db.run('UPDATE usuario SET is_online = ? WHERE id_usuario = ?', [isOnline ? 1 : 0, id]);
    return this.findById(id);
  }

  /**
   * Atualizar saldos ou ganhos
   */
  static updateFinances(id, { saldoIncrement = 0, ganhosHojeIncrement = 0, receitaPassivaIncrement = 0 }) {
    db.run(`
      UPDATE usuario 
      SET saldo = saldo + ?,
          ganhos_hoje = ganhos_hoje + ?,
          receita_passiva_mes = receita_passiva_mes + ?
      WHERE id_usuario = ?
    `, [saldoIncrement, ganhosHojeIncrement, receitaPassivaIncrement, id]);
    return this.findById(id);
  }

  /**
   * Busca e cálculo de profissionais no radar com Haversine (RF03, RF04, RNF01)
   */
  static findNearbyProfessionals({
    latitude = -23.561684,
    longitude = -46.655981,
    radiusKm = config.DEFAULT_RADIUS_KM,
    modalidade = 'todos',
    busca = ''
  } = {}) {
    const pros = db.query(`
      SELECT id_usuario, nome_completo, email, tipo_perfil, avatar,
             especialidade, avaliacao, preco_estimado, modalidade,
             latitude, longitude, is_online, created_at
      FROM usuario
      WHERE tipo_perfil = 'Freelancer' AND is_online = 1
    `);

    const clientLat = parseFloat(latitude);
    const clientLon = parseFloat(longitude);
    const maxRadius = parseFloat(radiusKm);

    let list = pros.map(pro => {
      const dist = calculateHaversineDistance(
        clientLat,
        clientLon,
        parseFloat(pro.latitude),
        parseFloat(pro.longitude)
      );
      return {
        ...pro,
        distanciaKm: dist,
        isFavorita: [101, 102, 103, 104].includes(pro.id_usuario) // marcação de favoritas para demonstração
      };
    });

    // Filtrar estritamente dentro do raio de até 15km (RF03, RNF01)
    list = list.filter(p => p.distanciaKm <= maxRadius);

    // Filtrar por modalidade (RF04)
    if (modalidade === 'domicilio') {
      list = list.filter(p => p.modalidade === 'Domicilio' || p.modalidade === 'Ambos');
    } else if (modalidade === 'salao') {
      list = list.filter(p => p.modalidade === 'Salao' || p.modalidade === 'Ambos');
    }

    // Filtrar por termo de busca se informado
    if (busca) {
      const q = busca.toLowerCase();
      list = list.filter(p => 
        (p.nome_completo && p.nome_completo.toLowerCase().includes(q)) ||
        (p.especialidade && p.especialidade.toLowerCase().includes(q))
      );
    }

    // Ordenar por menor distância geográfica
    list.sort((a, b) => a.distanciaKm - b.distanciaKm);

    return list;
  }
}

module.exports = UsuarioModel;

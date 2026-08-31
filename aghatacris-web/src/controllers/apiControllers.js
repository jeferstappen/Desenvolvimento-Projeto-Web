/**
 * AGhataCris - Controladores RESTful da API (Sprint 2)
 */

const UsuarioModel = require('../models/UsuarioModel');
const EspacoModel = require('../models/EspacoModel');
const AtendimentoModel = require('../models/AtendimentoModel');
const TransacaoModel = require('../models/TransacaoModel');
const { verifyPassword } = require('../utils/crypto');
const { db } = require('../../database/db');
const config = require('../config');

class AuthController {
  static async register(req, res) {
    try {
      const { nome_completo, email, senha, tipo_perfil, especialidade, preco_estimado, modalidade, latitude, longitude } = req.body;
      
      if (!nome_completo || !email || !tipo_perfil) {
        return res.status(400).json({ success: false, error: 'Campos obrigatórios ausentes (nome_completo, email, tipo_perfil).' });
      }

      const existingUser = UsuarioModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ success: false, error: 'Já existe um usuário cadastrado com este e-mail.' });
      }

      const newUser = UsuarioModel.create({
        nome_completo,
        email,
        senha,
        tipo_perfil,
        especialidade,
        preco_estimado,
        modalidade,
        latitude,
        longitude
      });

      return res.status(201).json({
        success: true,
        message: 'Usuário cadastrado com sucesso!',
        user: newUser
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: 'E-mail é obrigatório para autenticação.' });
      }

      const user = UsuarioModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, error: 'Credenciais inválidas ou usuário não encontrado.' });
      }

      // Se senha for fornecida, validar hash; em modo mock/demo aceita se passar validação
      if (senha && senha !== '••••••••' && user.senha_hash) {
        const isValid = verifyPassword(senha, user.senha_hash);
        if (!isValid) {
          return res.status(401).json({ success: false, error: 'Senha incorreta.' });
        }
      }

      const cleanUser = { ...user };
      delete cleanUser.senha_hash;

      return res.status(200).json({
        success: true,
        message: 'Login autenticado com sucesso!',
        user: cleanUser
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getMe(req, res) {
    try {
      const id = req.query.id_usuario || 1;
      const user = UsuarioModel.findById(id);
      if (!user) return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
      return res.status(200).json({ success: true, user });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

class UsuarioController {
  static async list(req, res) {
    try {
      const { tipo_perfil, busca, is_online } = req.query;
      const users = UsuarioModel.findAll({ tipo_perfil, busca, is_online });
      return res.status(200).json({ success: true, count: users.length, users });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const user = UsuarioModel.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
      return res.status(200).json({ success: true, user });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updateLocation(req, res) {
    try {
      const { latitude, longitude } = req.body;
      if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ success: false, error: 'Latitude e longitude são obrigatórias.' });
      }

      const updated = UsuarioModel.updateLocation(req.params.id, latitude, longitude);
      return res.status(200).json({
        success: true,
        message: 'Geolocalização atualizada com sucesso no banco de dados.',
        user: updated
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updateOnlineStatus(req, res) {
    try {
      const { is_online } = req.body;
      const updated = UsuarioModel.updateOnlineStatus(req.params.id, is_online);
      return res.status(200).json({ success: true, user: updated });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

class ProfissionalController {
  static async listNearby(req, res) {
    try {
      const {
        latitude = -23.561684,
        longitude = -46.655981,
        raio = config.DEFAULT_RADIUS_KM,
        modalidade = 'todos',
        busca = ''
      } = req.query;

      const profissionais = UsuarioModel.findNearbyProfessionals({
        latitude,
        longitude,
        radiusKm: raio,
        modalidade,
        busca
      });

      return res.status(200).json({
        success: true,
        count: profissionais.length,
        raio_max_km: parseFloat(raio),
        profissionais
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

class EspacoController {
  static async list(req, res) {
    try {
      const { id_salao, status, latitude, longitude } = req.query;
      const espacos = EspacoModel.findAll({ id_salao, status, latitude, longitude });
      return res.status(200).json({ success: true, count: espacos.length, espacos });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const espaco = EspacoModel.findById(req.params.id);
      if (!espaco) return res.status(404).json({ success: false, error: 'Espaço não encontrado.' });
      return res.status(200).json({ success: true, espaco });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const { id_salao, tipo_espaco, preco_hora, foto } = req.body;
      if (!id_salao || !tipo_espaco || !preco_hora) {
        return res.status(400).json({ success: false, error: 'id_salao, tipo_espaco e preco_hora são obrigatórios.' });
      }

      const novoEspaco = EspacoModel.create({ id_salao, tipo_espaco, preco_hora, foto });
      return res.status(201).json({
        success: true,
        message: 'Espaço ocioso cadastrado e anunciado com sucesso!',
        espaco: novoEspaco
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async reserve(req, res) {
    try {
      const { id_freelancer } = req.body;
      if (!id_freelancer) {
        return res.status(400).json({ success: false, error: 'id_freelancer é obrigatório para reserva.' });
      }

      const reservado = EspacoModel.reserve(req.params.id, id_freelancer);
      return res.status(200).json({
        success: true,
        message: 'Espaço reservado com sucesso! Cronômetro de 30 minutos ativado.',
        espaco: reservado
      });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async toggleStatus(req, res) {
    try {
      const espaco = EspacoModel.toggleStatus(req.params.id);
      return res.status(200).json({ success: true, espaco });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      EspacoModel.delete(req.params.id);
      return res.status(200).json({ success: true, message: 'Espaço removido com sucesso.' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

class AtendimentoController {
  static async list(req, res) {
    try {
      const { id_cliente, id_freelancer, status } = req.query;
      const atendimentos = AtendimentoModel.findAll({ id_cliente, id_freelancer, status });
      return res.status(200).json({ success: true, count: atendimentos.length, atendimentos });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const atendimento = AtendimentoModel.findById(req.params.id);
      if (!atendimento) return res.status(404).json({ success: false, error: 'Atendimento não encontrado.' });
      return res.status(200).json({ success: true, atendimento });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const { id_cliente, id_freelancer, id_espaco, servico, tipo, valor_total, taxa_salao, distancia_km, previsao_chegada } = req.body;
      
      if (!id_cliente || !id_freelancer || !servico || !valor_total) {
        return res.status(400).json({ success: false, error: 'id_cliente, id_freelancer, servico e valor_total são obrigatórios.' });
      }

      const novoAtendimento = AtendimentoModel.create({
        id_cliente,
        id_freelancer,
        id_espaco,
        servico,
        tipo,
        valor_total,
        taxa_salao,
        distancia_km,
        previsao_chegada
      });

      return res.status(201).json({
        success: true,
        message: 'Solicitação de pronto atendimento criada com sucesso!',
        atendimento: novoAtendimento
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, error: 'Novo status é obrigatório.' });
      }

      const updated = AtendimentoModel.updateStatus(req.params.id, status);
      return res.status(200).json({
        success: true,
        message: `Status do atendimento alterado para ${status}.`,
        atendimento: updated
      });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}

class AdminController {
  static async getMetricas(req, res) {
    try {
      const transacaoStats = TransacaoModel.getTotalStats();
      const totalUsuarios = db.queryOne('SELECT COUNT(*) AS count FROM usuario').count;
      const totalProfissionaisOnline = db.queryOne("SELECT COUNT(*) AS count FROM usuario WHERE tipo_perfil = 'Freelancer' AND is_online = 1").count;
      const totalSaloes = db.queryOne("SELECT COUNT(*) AS count FROM usuario WHERE tipo_perfil = 'Salao'").count;
      const totalEspacosAtivos = db.queryOne("SELECT COUNT(*) AS count FROM espaco WHERE status = 'Disponível'").count;
      
      const configTaxa = db.queryOne("SELECT valor FROM configuracao_plataforma WHERE chave = 'taxa_plataforma_percentual'");

      return res.status(200).json({
        success: true,
        metricas: {
          volumeTransacionado: transacaoStats.total_transacionado,
          taxaRetencaoPlataforma: parseFloat(configTaxa?.valor || 10.0),
          totalComissaoPlataforma: transacaoStats.total_comissao_plataforma,
          totalRepassesFreelancers: transacaoStats.total_repasses_freelancers,
          totalRepassesSaloes: transacaoStats.total_repasses_salao,
          profissionaisOnline: totalProfissionaisOnline,
          saloesParceiros: totalSaloes,
          espacosAtivos: totalEspacosAtivos,
          totalUsuarios
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updateTaxa(req, res) {
    try {
      const { taxa } = req.body;
      if (taxa === undefined) {
        return res.status(400).json({ success: false, error: 'Taxa é obrigatória.' });
      }

      db.run("UPDATE configuracao_plataforma SET valor = ? WHERE chave = 'taxa_plataforma_percentual'", [String(taxa)]);
      return res.status(200).json({
        success: true,
        message: `Taxa da plataforma atualizada para ${taxa}%.`,
        taxa: parseFloat(taxa)
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async health(req, res) {
    try {
      const userCount = db.queryOne('SELECT COUNT(*) AS count FROM usuario').count;
      const espacoCount = db.queryOne('SELECT COUNT(*) AS count FROM espaco').count;
      const atendimentoCount = db.queryOne('SELECT COUNT(*) AS count FROM atendimento').count;
      
      return res.status(200).json({
        status: 'online',
        database: 'connected (relational SQLite/MySQL compatible)',
        timestamp: new Date().toISOString(),
        entities: {
          usuarios: userCount,
          espacos: espacoCount,
          atendimentos: atendimentoCount
        }
      });
    } catch (err) {
      return res.status(500).json({ status: 'error', error: err.message });
    }
  }
}

module.exports = {
  AuthController,
  UsuarioController,
  ProfissionalController,
  EspacoController,
  AtendimentoController,
  AdminController
};

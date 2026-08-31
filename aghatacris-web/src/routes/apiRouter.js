/**
 * AGhataCris - Roteador RESTful Centralizado
 * Trata requisições HTTP para todos os endpoints da API /api/*
 */

const {
  AuthController,
  UsuarioController,
  ProfissionalController,
  EspacoController,
  AtendimentoController,
  AdminController
} = require('../controllers/apiControllers');

/**
 * Função auxiliar para ler o corpo da requisição em JSON
 */
function parseRequestBody(req) {
  return new Promise((resolve) => {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'DELETE' && !req.headers['content-length']) {
      return resolve({});
    }
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

/**
 * Cria wrappers de res.json, res.status para padrão express-like
 */
function enhanceResponse(res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  res.status = function(code) {
    res.statusCode = code;
    return res;
  };

  res.json = function(data) {
    res.end(JSON.stringify(data));
  };

  return res;
}

/**
 * Despachante principal de requisições /api
 */
async function handleApiRequest(req, res) {
  enhanceResponse(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  const parsedUrl = new URL(req.url, 'http://localhost:3000');
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  req.query = Object.fromEntries(parsedUrl.searchParams.entries());
  req.body = await parseRequestBody(req);
  req.params = {};

  try {
    // -------------------------------------------------------------
    // Health & System
    // -------------------------------------------------------------
    if (pathname === '/api/health' && method === 'GET') {
      await AdminController.health(req, res);
      return true;
    }

    // -------------------------------------------------------------
    // Auth Routes (RF01, RNF03)
    // -------------------------------------------------------------
    if (pathname === '/api/auth/register' && method === 'POST') {
      await AuthController.register(req, res);
      return true;
    }
    if (pathname === '/api/auth/login' && method === 'POST') {
      await AuthController.login(req, res);
      return true;
    }
    if (pathname === '/api/auth/me' && method === 'GET') {
      await AuthController.getMe(req, res);
      return true;
    }

    // -------------------------------------------------------------
    // Profissionais & Busca Espacial Radar 15km (RF03, RF04, RNF01)
    // -------------------------------------------------------------
    if (pathname === '/api/profissionais' && method === 'GET') {
      await ProfissionalController.listNearby(req, res);
      return true;
    }

    // -------------------------------------------------------------
    // Usuários & GPS (RF02)
    // -------------------------------------------------------------
    if (pathname === '/api/usuarios' && method === 'GET') {
      await UsuarioController.list(req, res);
      return true;
    }

    const userLocMatch = pathname.match(/^\/api\/usuarios\/(\d+)\/localizacao$/);
    if (userLocMatch && (method === 'PUT' || method === 'POST')) {
      req.params.id = parseInt(userLocMatch[1]);
      await UsuarioController.updateLocation(req, res);
      return true;
    }

    const userOnlineMatch = pathname.match(/^\/api\/usuarios\/(\d+)\/status-online$/);
    if (userOnlineMatch && (method === 'PUT' || method === 'POST')) {
      req.params.id = parseInt(userOnlineMatch[1]);
      await UsuarioController.updateOnlineStatus(req, res);
      return true;
    }

    const userDetailMatch = pathname.match(/^\/api\/usuarios\/(\d+)$/);
    if (userDetailMatch && method === 'GET') {
      req.params.id = parseInt(userDetailMatch[1]);
      await UsuarioController.getById(req, res);
      return true;
    }

    // -------------------------------------------------------------
    // Espaços Ociosos em Salões (RF07, RF08, RF09)
    // -------------------------------------------------------------
    if (pathname === '/api/espacos' && method === 'GET') {
      await EspacoController.list(req, res);
      return true;
    }
    if (pathname === '/api/espacos' && method === 'POST') {
      await EspacoController.create(req, res);
      return true;
    }

    const espacoReservaMatch = pathname.match(/^\/api\/espacos\/(\d+)\/reserva$/);
    if (espacoReservaMatch && (method === 'PUT' || method === 'POST')) {
      req.params.id = parseInt(espacoReservaMatch[1]);
      await EspacoController.reserve(req, res);
      return true;
    }

    const espacoStatusMatch = pathname.match(/^\/api\/espacos\/(\d+)\/status$/);
    if (espacoStatusMatch && (method === 'PUT' || method === 'POST')) {
      req.params.id = parseInt(espacoStatusMatch[1]);
      await EspacoController.toggleStatus(req, res);
      return true;
    }

    const espacoDetailMatch = pathname.match(/^\/api\/espacos\/(\d+)$/);
    if (espacoDetailMatch) {
      req.params.id = parseInt(espacoDetailMatch[1]);
      if (method === 'GET') {
        await EspacoController.getById(req, res);
        return true;
      }
      if (method === 'DELETE') {
        await EspacoController.delete(req, res);
        return true;
      }
    }

    // -------------------------------------------------------------
    // Atendimentos & Split Payment (RF05, RF06, RF10)
    // -------------------------------------------------------------
    if (pathname === '/api/atendimentos' && method === 'GET') {
      await AtendimentoController.list(req, res);
      return true;
    }
    if (pathname === '/api/atendimentos' && method === 'POST') {
      await AtendimentoController.create(req, res);
      return true;
    }

    const atendimentoStatusMatch = pathname.match(/^\/api\/atendimentos\/(\d+)\/status$/);
    if (atendimentoStatusMatch && (method === 'PUT' || method === 'POST')) {
      req.params.id = parseInt(atendimentoStatusMatch[1]);
      await AtendimentoController.updateStatus(req, res);
      return true;
    }

    const atendimentoDetailMatch = pathname.match(/^\/api\/atendimentos\/(\d+)$/);
    if (atendimentoDetailMatch && method === 'GET') {
      req.params.id = parseInt(atendimentoDetailMatch[1]);
      await AtendimentoController.getById(req, res);
      return true;
    }

    // -------------------------------------------------------------
    // Admin & Métricas
    // -------------------------------------------------------------
    if (pathname === '/api/admin/metricas' && method === 'GET') {
      await AdminController.getMetricas(req, res);
      return true;
    }
    if (pathname === '/api/admin/taxa' && (method === 'PUT' || method === 'POST')) {
      await AdminController.updateTaxa(req, res);
      return true;
    }

    // Rota API não encontrada
    res.status(404).json({ success: false, error: `Endpoint da API não encontrado: ${method} ${pathname}` });
    return true;
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erro interno no servidor: ' + err.message });
    return true;
  }
}

module.exports = {
  handleApiRequest
};

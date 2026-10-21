/**
 * AGhataCris - Suíte de Testes Automatizados de Integração (Módulo 1)
 * Validação de Ponta a Ponta: Interface / Clientes HTTP <-> Lógica de Negócios <-> Banco de Dados Relacional
 */

const http = require('http');
const { db } = require('./database/db');
const { handleApiRequest } = require('./src/routes/apiRouter');
const config = require('./src/config');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failCount++;
  }
}

let server;
let serverPort;

function startTestServer() {
  return new Promise((resolve) => {
    server = http.createServer(async (req, res) => {
      let safeUrl = req.url.split('?')[0];
      if (safeUrl.startsWith('/api/')) {
        return handleApiRequest(req, res);
      }
      res.writeHead(404);
      res.end('Not found');
    });

    server.listen(0, () => {
      serverPort = server.address().port;
      resolve();
    });
  });
}

function stopTestServer() {
  return new Promise((resolve) => {
    if (server) {
      server.close(resolve);
    } else {
      resolve();
    }
  });
}

async function apiRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const options = {
      hostname: '127.0.0.1',
      port: serverPort,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const json = raw ? JSON.parse(raw) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runIntegrationTestSuite() {
  console.log('\n================================================================================');
  console.log(' 🧪 INICIANDO TESTES DE INTEGRAÇÃO FRONT-END E BACK-END - MÓDULO 1');
  console.log(' 📌 Interface (REST API) <-> Lógica de Negócios <-> Banco Relacional (SQLite)');
  console.log('================================================================================\n');

  await startTestServer();
  console.log(`🌐 Servidor de testes de integração ouvindo na porta efêmera: ${serverPort}\n`);

  try {
    // -------------------------------------------------------------------------
    // CTI-01: Health Check & Conectividade do Banco Relacional
    // -------------------------------------------------------------------------
    console.log('📌 CTI-01: Health Check & Conexão do Banco de Dados Relacional');
    const healthRes = await apiRequest('GET', '/api/health');
    assert(healthRes.status === 200, 'Endpoint /api/health responde com HTTP 200 OK');
    assert(healthRes.data.status === 'online', 'Status do sistema reportado como "online"');
    assert(healthRes.data.entities.usuarios > 0, `Tabela 'usuario' conectada no banco (${healthRes.data.entities.usuarios} registros)`);
    assert(healthRes.data.entities.espacos > 0, `Tabela 'espaco' conectada no banco (${healthRes.data.entities.espacos} registros)`);
    assert(healthRes.data.entities.atendimentos > 0, `Tabela 'atendimento' conectada no banco (${healthRes.data.entities.atendimentos} registros)`);

    // -------------------------------------------------------------------------
    // CTI-02: Cadastro de Usuário & Criptografia Segura PBKDF2 no Banco
    // -------------------------------------------------------------------------
    console.log('\n📌 CTI-02: Cadastro de Usuário na Interface com Criptografia Segura PBKDF2 no Banco');
    const uniqueEmail = `cliente.integracao.${Date.now()}@teste.com`;
    const regPayload = {
      nome_completo: 'Fernanda Lima Teste',
      email: uniqueEmail,
      senha: 'SenhaForteIntegracao@2026',
      tipo_perfil: 'Cliente',
      latitude: -23.561684,
      longitude: -46.655981
    };

    const regRes = await apiRequest('POST', '/api/auth/register', regPayload);
    assert(regRes.status === 201, 'POST /api/auth/register respondeu com HTTP 201 Created');
    assert(regRes.data.user && regRes.data.user.id_usuario, `Usuário criado com ID: ${regRes.data.user?.id_usuario}`);

    // Inspecionar diretamente no banco relacional se o registro e o hash seguro foram persistidos
    const dbUser = db.queryOne('SELECT * FROM usuario WHERE email = ?', [uniqueEmail]);
    assert(dbUser !== null, 'Registro confirmado via consulta SQL direta na tabela "usuario"');
    assert(dbUser.senha_hash.includes(':'), 'Senha armazenada no formato criptográfico salt:hash (RNF03)');
    assert(dbUser.senha_hash !== 'SenhaForteIntegracao@2026', 'Senha original NÃO armazenada em texto plano');

    // -------------------------------------------------------------------------
    // CTI-03: Autenticação / Login com Validação de Credenciais no Banco
    // -------------------------------------------------------------------------
    console.log('\n📌 CTI-03: Autenticação / Login com Validação de Hash no Banco de Dados');
    const loginSuccessRes = await apiRequest('POST', '/api/auth/login', {
      email: uniqueEmail,
      senha: 'SenhaForteIntegracao@2026'
    });
    assert(loginSuccessRes.status === 200, 'Login com credenciais corretas autenticado com HTTP 200');
    assert(loginSuccessRes.data.user.email === uniqueEmail, 'Perfil do usuário retornado na sessão da interface');
    assert(!loginSuccessRes.data.user.senha_hash, 'Hash de senha omitido do payload de resposta por segurança');

    const loginFailRes = await apiRequest('POST', '/api/auth/login', {
      email: uniqueEmail,
      senha: 'SenhaIncorreta@123'
    });
    assert(loginFailRes.status === 401, 'Tentativa de login com senha incorreta rejeitada com HTTP 401 Unauthorized');

    // -------------------------------------------------------------------------
    // CTI-04: Atualização de GPS e Radar Haversine no Raio de 15km
    // -------------------------------------------------------------------------
    console.log('\n📌 CTI-04: Atualização de GPS e Radar Haversine no Raio de 15km');
    // Coordenada: Av. Paulista, SP (-23.561684, -46.655981)
    const gpsRes = await apiRequest('PUT', `/api/usuarios/${dbUser.id_usuario}/localizacao`, {
      latitude: -23.561684,
      longitude: -46.655981
    });
    assert(gpsRes.status === 200, 'PUT /api/usuarios/:id/localizacao respondeu com HTTP 200');

    // Confirmar atualização no banco relacional
    const dbUserGps = db.queryOne('SELECT latitude, longitude FROM usuario WHERE id_usuario = ?', [dbUser.id_usuario]);
    assert(Math.abs(dbUserGps.latitude - (-23.561684)) < 0.0001, 'Latitude persistida no banco relacional');
    assert(Math.abs(dbUserGps.longitude - (-46.655981)) < 0.0001, 'Longitude persistida no banco relacional');

    // Buscar profissionais via radar Haversine
    const radarRes = await apiRequest('GET', `/api/profissionais?latitude=-23.561684&longitude=-46.655981&raio=15`);
    assert(radarRes.status === 200, 'GET /api/profissionais respondeu com HTTP 200');
    assert(radarRes.data.profissionais.length > 0, `Profissionais encontradas no raio: ${radarRes.data.profissionais.length}`);
    
    // Validar se todas estão estritamente dentro de 15 km e ordenadas por menor distância
    const dentroDoRaio = radarRes.data.profissionais.every(p => p.distanciaKm <= 15.0);
    assert(dentroDoRaio, 'Todas as profissionais retornadas estão estritamente dentro do raio <= 15 km (RF03, RNF01)');
    
    let ordenado = true;
    for (let i = 0; i < radarRes.data.profissionais.length - 1; i++) {
      if (radarRes.data.profissionais[i].distanciaKm > radarRes.data.profissionais[i + 1].distanciaKm) {
        ordenado = false;
        break;
      }
    }
    assert(ordenado, 'Profissionais ordenadas no frontend por proximidade geográfica crescente');

    // -------------------------------------------------------------------------
    // CTI-05: Anúncio de Espaço Ocioso pelo Salão Parceiro
    // -------------------------------------------------------------------------
    console.log('\n📌 CTI-05: Anúncio de Espaço Ocioso pelo Salão Parceiro');
    const salaoId = 3; // Studio Elegance Jardins
    const novoEspacoPayload = {
      id_salao: salaoId,
      tipo_espaco: 'Cadeira de Corte Deluxe Integracao',
      preco_hora: 35.00,
      foto: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200'
    };

    const espacoRes = await apiRequest('POST', '/api/espacos', novoEspacoPayload);
    assert(espacoRes.status === 201, 'POST /api/espacos respondeu com HTTP 201 Created');
    const createdEspacoId = espacoRes.data.espaco.id_espaco;
    assert(createdEspacoId > 0, `Espaço criado com ID ${createdEspacoId}`);

    // Validar gravação na tabela espaco
    const dbEspaco = db.queryOne('SELECT * FROM espaco WHERE id_espaco = ?', [createdEspacoId]);
    assert(dbEspaco !== null, 'Espaço confirmado via SQL direta na tabela "espaco"');
    assert(dbEspaco.status === 'Disponível', 'Status inicial do espaço é "Disponível"');
    assert(parseFloat(dbEspaco.preco_hora) === 35.00, 'Preço por hora gravado com precisão DECIMAL (R$ 35.00)');

    // -------------------------------------------------------------------------
    // CTI-06: Reserva Expressa com Timer de 30 minutos (1800s)
    // -------------------------------------------------------------------------
    console.log('\n📌 CTI-06: Reserva Expressa de Espaço com Tolerância de 30min (1800s)');
    const freelancerId = 2; // Mariana Silva
    const reservaRes = await apiRequest('PUT', `/api/espacos/${createdEspacoId}/reserva`, {
      id_freelancer: freelancerId
    });
    assert(reservaRes.status === 200, 'PUT /api/espacos/:id/reserva respondeu com HTTP 200 OK');
    assert(reservaRes.data.espaco.status === 'Reservado', 'Status do espaço alterado para "Reservado"');
    assert(reservaRes.data.espaco.tempo_reserva_segundos === 1800, 'Cronômetro de tolerância iniciado em 1800 segundos / 30 minutos (RF09)');

    // Validar no banco se o vínculo com a freelancer foi gravado
    const dbEspacoReservado = db.queryOne('SELECT * FROM espaco WHERE id_espaco = ?', [createdEspacoId]);
    assert(dbEspacoReservado.id_freelancer_reserva === freelancerId, 'FK da freelancer vinculada à reserva do espaço');

    // -------------------------------------------------------------------------
    // CTI-07: Solicitação de Pronto Atendimento sob Demanda
    // -------------------------------------------------------------------------
    console.log('\n📌 CTI-07: Solicitação de Pronto Atendimento sob Demanda (Cliente -> Freelancer)');
    const atendimentoPayload = {
      id_cliente: dbUser.id_usuario,
      id_freelancer: freelancerId,
      id_espaco: createdEspacoId,
      servico: 'Penteado Express & Escova Modeladora',
      tipo: 'No Salão',
      valor_total: 200.00,
      taxa_salao: 35.00,
      distancia_km: 1.2,
      previsao_chegada: '10:00 AM'
    };

    const atendRes = await apiRequest('POST', '/api/atendimentos', atendimentoPayload);
    assert(atendRes.status === 201, 'POST /api/atendimentos respondeu com HTTP 201 Created');
    const createdAtendId = atendRes.data.atendimento.id_atendimento;
    assert(createdAtendId > 0, `Chamado registrado com ID ${createdAtendId}`);

    // Validar no banco se o chamado foi gravado com status 'Pendente' ou 'Em Andamento' (RF06)
    const dbAtend = db.queryOne('SELECT * FROM atendimento WHERE id_atendimento = ?', [createdAtendId]);
    assert(dbAtend !== null, 'Atendimento persistido na tabela "atendimento"');
    assert(dbAtend.status === 'Pendente' || dbAtend.status === 'Em Andamento', 'Status inicial do atendimento registrado no banco');

    // -------------------------------------------------------------------------
    // CTI-08: Conclusão do Atendimento & Split Payment Automático (RF10)
    // -------------------------------------------------------------------------
    console.log('\n📌 CTI-08: Conclusão do Atendimento e Execução do Split Payment Automático');
    // Salvar saldos anteriores dos envolvidos para auditar o acréscimo líquido
    const freeAntes = db.queryOne('SELECT saldo, ganhos_hoje FROM usuario WHERE id_usuario = ?', [freelancerId]);
    const salaoAntes = db.queryOne('SELECT receita_passiva_mes FROM usuario WHERE id_usuario = ?', [salaoId]);

    const concluiRes = await apiRequest('PUT', `/api/atendimentos/${createdAtendId}/status`, {
      status: 'Concluído'
    });
    assert(concluiRes.status === 200, 'PUT /api/atendimentos/:id/status respondeu com HTTP 200 OK');
    assert(concluiRes.data.atendimento.status === 'Concluído', 'Atendimento alterado para "Concluído"');

    // Validar regras financeiras do Split Payment (10% plataforma, taxa salão, líquido freelancer)
    // Valor total = 200.00 | Taxa App (10%) = 20.00 | Taxa Salão = 35.00 | Líquido Freelancer = 145.00
    assert(Math.abs(concluiRes.data.atendimento.taxa_plataforma - 20.00) < 0.01, 'Comissão da plataforma calculada estritamente em 10% (R$ 20.00)');
    assert(Math.abs(concluiRes.data.atendimento.taxa_salao - 35.00) < 0.01, 'Taxa do salão retida integralmente (R$ 35.00)');
    assert(Math.abs(concluiRes.data.atendimento.valor_liquido - 145.00) < 0.01, 'Valor líquido da profissional apurado corretamente (R$ 145.00)');

    // Inspecionar persistência na tabela transacao
    const dbTransacao = db.queryOne('SELECT * FROM transacao WHERE id_atendimento = ?', [createdAtendId]);
    assert(dbTransacao !== null, 'Registro contábil de auditoria gravado na tabela "transacao"');
    assert(Math.abs(dbTransacao.valor_freelancer - 145.00) < 0.01, 'Transação audita crédito líquido para a freelancer');
    assert(Math.abs(dbTransacao.taxa_plataforma - 20.00) < 0.01, 'Transação audita taxa de 10% retida pela plataforma');
    assert(Math.abs(dbTransacao.taxa_salao - 35.00) < 0.01, 'Transação audita taxa repassada ao salão parceiro');

    // Validar acréscimo financeiro nos saldos das contas no banco de dados
    const freeDepois = db.queryOne('SELECT saldo, ganhos_hoje FROM usuario WHERE id_usuario = ?', [freelancerId]);
    const salaoDepois = db.queryOne('SELECT receita_passiva_mes FROM usuario WHERE id_usuario = ?', [salaoId]);

    const difSaldoFree = freeDepois.saldo - freeAntes.saldo;
    assert(Math.abs(difSaldoFree - 145.00) < 0.01, 'Saldo da freelancer creditado no banco em +R$ 145.00');

    const difReceitaSalao = salaoDepois.receita_passiva_mes - salaoAntes.receita_passiva_mes;
    assert(Math.abs(difReceitaSalao - 35.00) < 0.01, 'Receita passiva do salão parceiro creditada no banco em +R$ 35.00');

    // -------------------------------------------------------------------------
    // CTI-09: Comprovante de Atendimento e Métricas Gerais Administrativas
    // -------------------------------------------------------------------------
    console.log('\n📌 CTI-09: Comprovante de Atendimento e Painel Geral de Métricas');
    const reciboRes = await apiRequest('GET', `/api/atendimentos/${createdAtendId}`);
    assert(reciboRes.status === 200, 'GET /api/atendimentos/:id respondeu com HTTP 200 OK');
    assert(reciboRes.data.atendimento.id_atendimento === createdAtendId, 'Dados do recibo coincidem com o atendimento realizado');

    const metricasRes = await apiRequest('GET', '/api/admin/metricas');
    assert(metricasRes.status === 200, 'GET /api/admin/metricas respondeu com HTTP 200 OK');
    assert(metricasRes.data.metricas.volumeTransacionado >= 200.00, 'Volume transacionado agregado reflete as transações no banco');
    assert(metricasRes.data.metricas.taxaRetencaoPlataforma === 10.0, 'Taxa de retenção administrativa sincronizada');

    // Testar atualização administrativa da taxa de intermediação
    const updateTaxaRes = await apiRequest('PUT', '/api/admin/taxa', { taxa: 12.5 });
    assert(updateTaxaRes.status === 200, 'PUT /api/admin/taxa respondeu com HTTP 200 OK');
    const dbTaxa = db.queryOne("SELECT valor FROM configuracao_plataforma WHERE chave = 'taxa_plataforma_percentual'");
    assert(parseFloat(dbTaxa.valor) === 12.5, 'Nova taxa administrativa de 12.5% gravada na tabela configuracao_plataforma');

    // Restaurar taxa para 10%
    await apiRequest('PUT', '/api/admin/taxa', { taxa: 10.0 });

  } catch (err) {
    console.error('❌ Erro inesperado durante os testes de integração:', err);
    failCount++;
  } finally {
    await stopTestServer();
  }

  console.log('\n================================================================================');
  console.log(` 📊 RESULTADO DA SUÍTE DE TESTES DE INTEGRAÇÃO (MÓDULO 1):`);
  console.log(`    ✅ Testes Aprovados: ${passCount}`);
  console.log(`    ❌ Testes Falhados:  ${failCount}`);
  console.log(`    🎯 Taxa de Sucesso:  ${failCount === 0 ? '100% DE APROVAÇÃO' : 'FALHAS DETECTADAS'}`);
  console.log('================================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

// Executar suíte se chamado diretamente
if (require.main === module) {
  runIntegrationTestSuite();
}

module.exports = { runIntegrationTestSuite };

/**
 * AGhataCris - Suíte de Testes Automatizados de Back-End (Sprint 2)
 * Valida banco de dados relacional, modelos, cálculo de Haversine, split payment e endpoints RESTful.
 */

const http = require('http');
const { db } = require('./database/db');
const { hashPassword, verifyPassword } = require('./src/utils/crypto');
const { calculateHaversineDistance } = require('./src/utils/haversine');
const UsuarioModel = require('./src/models/UsuarioModel');
const EspacoModel = require('./src/models/EspacoModel');
const AtendimentoModel = require('./src/models/AtendimentoModel');
const TransacaoModel = require('./src/models/TransacaoModel');

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

async function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runAllTests() {
  console.log('\n===============================================================');
  console.log(' 🧪 INICIANDO TESTES DO BACK-END - SPRINT 2 (AGhataCris)');
  console.log('===============================================================\n');

  // ---------------------------------------------------------------------------
  // 1. Testes de Banco de Dados e Conectividade Relacional
  // ---------------------------------------------------------------------------
  console.log('📌 1. Integridade do Banco de Dados Relacional:');
  try {
    const userCount = db.queryOne('SELECT COUNT(*) AS count FROM usuario').count;
    const espacoCount = db.queryOne('SELECT COUNT(*) AS count FROM espaco').count;
    const atendCount = db.queryOne('SELECT COUNT(*) AS count FROM atendimento').count;

    assert(userCount > 0, `Tabela 'usuario' populada com sucesso (${userCount} registros)`);
    assert(espacoCount > 0, `Tabela 'espaco' populada com sucesso (${espacoCount} registros)`);
    assert(atendCount > 0, `Tabela 'atendimento' populada com sucesso (${atendCount} registros)`);
  } catch (err) {
    assert(false, `Erro ao consultar banco relacional: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // 2. Testes de Criptografia Segura (RNF03)
  // ---------------------------------------------------------------------------
  console.log('\n📌 2. Segurança e Criptografia de Senhas (RNF03):');
  const password = 'MinhaSenhaSegura@2026';
  const hashed = hashPassword(password);
  assert(hashed.includes(':') && hashed.length > 50, 'Hash gerado com salt e formato seguro (salt:hash)');
  assert(verifyPassword(password, hashed), 'Validação de senha correta retorna TRUE');
  assert(!verifyPassword('SenhaIncorreta', hashed), 'Validação de senha incorreta retorna FALSE');

  // ---------------------------------------------------------------------------
  // 3. Testes do Algoritmo Espacial / Haversine (RF03, RNF01)
  // ---------------------------------------------------------------------------
  console.log('\n📌 3. Algoritmo de Geolocalização / Haversine (RF03, RNF01):');
  // Coordenadas: Paulista (-23.561684, -46.655981) e Jardins (-23.564500, -46.652000) ~ 0.5 km
  const distCurta = calculateHaversineDistance(-23.561684, -46.655981, -23.564500, -46.652000);
  assert(distCurta > 0.2 && distCurta < 1.0, `Cálculo Haversine preciso para distâncias curtas (${distCurta} km)`);

  // Distância fora do raio de 15km (ex: Campinas -22.9099, -47.0626 ~ 85km)
  const distLonga = calculateHaversineDistance(-23.561684, -46.655981, -22.9099, -47.0626);
  assert(distLonga > 80.0, `Cálculo Haversine detecta distâncias além do raio de 15km (${distLonga} km)`);

  // ---------------------------------------------------------------------------
  // 4. Testes de Modelos e Regras de Negócio
  // ---------------------------------------------------------------------------
  console.log('\n📌 4. Modelos e Regras de Negócio (RF01, RF02, RF07, RF08, RF09, RF10):');
  
  // Teste RF01: Criação de novo usuário
  const testEmail = `teste_${Date.now()}@exemplo.com`;
  const novoUsuario = UsuarioModel.create({
    nome_completo: 'Juliana Teste Unitário',
    email: testEmail,
    senha: 'senha12345',
    tipo_perfil: 'Freelancer',
    especialidade: 'Especialista em Tranças',
    preco_estimado: 95.0,
    modalidade: 'Ambos',
    latitude: -23.562500,
    longitude: -46.654000
  });
  assert(novoUsuario && novoUsuario.id_usuario > 0, `RF01: Usuário criado com sucesso (ID ${novoUsuario.id_usuario})`);

  // Teste RF02: Atualização de GPS
  const usuarioLocAtualizado = UsuarioModel.updateLocation(novoUsuario.id_usuario, -23.567000, -46.659000);
  assert(
    Math.abs(usuarioLocAtualizado.latitude - (-23.567000)) < 0.0001,
    'RF02: Geolocalização de latitude/longitude atualizada no banco'
  );

  // Teste RF03 e RF04: Busca de profissionais no raio de 15km
  const prosRadar = UsuarioModel.findNearbyProfessionals({
    latitude: -23.561684,
    longitude: -46.655981,
    radiusKm: 15.0,
    modalidade: 'todos'
  });
  assert(prosRadar.length >= 4, `RF03: ${prosRadar.length} profissionais encontradas no raio de 15km`);
  assert(prosRadar.every(p => p.distanciaKm <= 15.0), 'RF03: Todas as profissionais retornadas estão estritamente <= 15km');
  assert(prosRadar[0].distanciaKm <= prosRadar[prosRadar.length - 1].distanciaKm, 'RF03: Lista ordenada por proximidade geográfica');

  // Teste RF07: Salão anuncia espaço
  const novoEspaco = EspacoModel.create({
    id_salao: 3,
    tipo_espaco: 'Cadeira de Barbeiro / Visagismo',
    preco_hora: 35.00
  });
  assert(novoEspaco && novoEspaco.id_espaco > 0, `RF07: Espaço anunciado com sucesso pelo Salão Parceiro (ID ${novoEspaco.id_espaco})`);

  // Teste RF08: Listagem de espaços por proximidade
  const espacosOrdenados = EspacoModel.findAll({ latitude: -23.561684, longitude: -46.655981 });
  assert(espacosOrdenados.length > 0, `RF08: ${espacosOrdenados.length} espaços listados com sucesso`);
  assert(espacosOrdenados[0].distanciaKm !== undefined, 'RF08: Distância calculada para cada espaço do salão');

  // Teste RF09: Reserva com limite de 30min
  const espacoReservado = EspacoModel.reserve(novoEspaco.id_espaco, 2);
  assert(espacoReservado.status === 'Reservado' && espacoReservado.tempo_reserva_segundos === 1800, 'RF09: Espaço reservado com prazo de 30 min (1800s)');

  // Teste RF05, RF06 e RF10: Atendimento e Split Payment
  const novoAtend = AtendimentoModel.create({
    id_cliente: 1,
    id_freelancer: 2,
    id_espaco: novoEspaco.id_espaco,
    servico: 'Penteado e Make Express',
    tipo: 'No Salão',
    valor_total: 200.00,
    taxa_salao: 35.00
  });
  assert(novoAtend && novoAtend.id_atendimento > 0, `RF05: Solicitação de pronto atendimento criada (ID ${novoAtend.id_atendimento})`);
  assert(novoAtend.taxa_plataforma === 20.00, 'RF10: Taxa da plataforma calculada em 10% (R$ 20.00)');
  assert(novoAtend.valor_liquido === 145.00, 'RF10: Valor líquido da profissional apurado (R$ 145.00)');

  // Concluir atendimento e verificar Split Payment
  const atendFinalizado = AtendimentoModel.updateStatus(novoAtend.id_atendimento, 'Concluído');
  assert(atendFinalizado.status === 'Concluído', 'RF06: Atendimento alterado para Concluído');

  const transacao = TransacaoModel.findByAtendimentoId(novoAtend.id_atendimento);
  assert(transacao && transacao.valor_freelancer === 145.00, 'RF10: Transação de Split Payment gravada na tabela com sucesso');

  // ---------------------------------------------------------------------------
  // 5. Testes dos Endpoints HTTP REST da API
  // ---------------------------------------------------------------------------
  console.log('\n📌 5. Testes dos Endpoints HTTP REST API (/api/*):');

  // Iniciar servidor temporário se necessário ou conectar no localhost:3000
  const server = require('./server');

  // Aguardar 300ms para estabilização
  await new Promise(r => setTimeout(r, 300));

  try {
    // Health Check
    const resHealth = await request({ hostname: 'localhost', port: 3000, path: '/api/health', method: 'GET' });
    assert(resHealth.status === 200 && resHealth.data.status === 'online', 'GET /api/health -> 200 OK');

    // Register
    const resReg = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      nome_completo: 'Cliente API Teste',
      email: `api_${Date.now()}@teste.com`,
      senha: 'minhasenhateste',
      tipo_perfil: 'Cliente'
    });
    assert(resReg.status === 201 && resReg.data.success, 'POST /api/auth/register -> 201 Created (RF01)');

    // Login
    const resLogin = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'isabela.santos@email.com'
    });
    assert(resLogin.status === 200 && resLogin.data.success, 'POST /api/auth/login -> 200 OK (RF01)');

    // Profissionais Radar
    const resPros = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/profissionais?latitude=-23.561684&longitude=-46.655981&raio=15',
      method: 'GET'
    });
    assert(resPros.status === 200 && resPros.data.profissionais.length > 0, 'GET /api/profissionais -> 200 OK com cálculo Haversine (RF03)');

    // Espaços Salão
    const resEspacos = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/espacos',
      method: 'GET'
    });
    assert(resEspacos.status === 200 && resEspacos.data.espacos.length > 0, 'GET /api/espacos -> 200 OK (RF08)');

    // Atendimentos
    const resAtends = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/atendimentos',
      method: 'GET'
    });
    assert(resAtends.status === 200 && resAtends.data.atendimentos.length > 0, 'GET /api/atendimentos -> 200 OK (RF06)');

    // Admin Métricas
    const resMetricas = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/metricas',
      method: 'GET'
    });
    assert(resMetricas.status === 200 && resMetricas.data.metricas.volumeTransacionado >= 0, 'GET /api/admin/metricas -> 200 OK');

  } catch (apiErr) {
    assert(false, `Erro nos testes HTTP de API: ${apiErr.message}`);
  }

  console.log('\n===============================================================');
  console.log(` 📊 RESULTADO FINAL: ${passCount} passaram, ${failCount} falharam.`);
  console.log('===============================================================\n');

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests().catch(err => {
  console.error('Erro fatal nos testes:', err);
  process.exit(1);
});

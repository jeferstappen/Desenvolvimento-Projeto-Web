const http = require('http');

const routesToTest = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/variables.css',
  '/css/base.css',
  '/css/layout.css',
  '/css/components.css',
  '/css/views.css',
  '/js/state.js',
  '/js/router.js',
  '/js/components/modal.js',
  '/js/components/header.js',
  '/js/components/navbar.js',
  '/js/components/roleSwitcher.js',
  '/js/views/authView.js',
  '/js/views/clienteHomeView.js',
  '/js/views/clienteFavoritasView.js',
  '/js/views/clienteHistoricoView.js',
  '/js/views/freelancerHomeView.js',
  '/js/views/freelancerAgendaView.js',
  '/js/views/freelancerCarteiraView.js',
  '/js/views/freelancerEspacosView.js',
  '/js/views/salaoHomeView.js',
  '/js/views/perfilView.js',
  '/js/views/adminView.js',
  '/js/app.js'
];

async function runTests() {
  console.log('--- Iniciando Testes de Integridade de Rotas e Arquivos ---');
  let passCount = 0;
  let failCount = 0;

  for (const route of routesToTest) {
    try {
      const res = await new Promise((resolve, reject) => {
        http.get(`http://localhost:3000${route}`, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        }).on('error', reject);
      });

      if (res.statusCode === 200 && res.data.length > 0) {
        console.log(`[PASS] ${route} -> HTTP 200 (${res.data.length} bytes)`);
        passCount++;
      } else {
        console.error(`[FAIL] ${route} -> Status ${res.statusCode}`);
        failCount++;
      }
    } catch (e) {
      console.error(`[ERROR] ${route} -> ${e.message}`);
      failCount++;
    }
  }

  console.log(`\nResultado: ${passCount} passaram, ${failCount} falharam.`);
  if (failCount > 0) process.exit(1);
}

runTests();

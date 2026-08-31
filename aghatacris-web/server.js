/**
 * AGhataCris - Servidor Unificado (REST API + PWA Static Server)
 * Suporta roteamento da API RESTful (/api/*) e entrega de ativos do PWA
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { handleApiRequest } = require('./src/routes/apiRouter');
const config = require('./src/config');

const PORT = config.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  let safeUrl = req.url.split('?')[0];

  // 1. Interceptar requisições direcionadas para a REST API
  if (safeUrl.startsWith('/api/')) {
    return handleApiRequest(req, res);
  }

  // 2. Servir arquivos estáticos do Frontend PWA
  if (safeUrl === '/') safeUrl = '/index.html';
  const filePath = path.join(__dirname, safeUrl);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` 🚀 Servidor AGhataCris Web & API REST Ativo!`);
  console.log(` 🌐 Frontend PWA: http://localhost:${PORT}/`);
  console.log(` 📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(` 📍 Raio de busca geográfico padrão: ${config.DEFAULT_RADIUS_KM} km`);
  console.log(`======================================================\n`);
});

module.exports = server;

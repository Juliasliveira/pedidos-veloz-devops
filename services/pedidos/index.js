const http = require('http');

const pedidos = [];
let nextId = 1;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', service: 'pedidos' }));
    return;
  }

  if (req.url === '/pedidos' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ pedidos }));
    return;
  }

  if (req.url === '/pedidos' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const pedido = { id: nextId++, ...data, status: 'criado', criadoEm: new Date().toISOString() };
        pedidos.push(pedido);
        console.log(`[PEDIDOS] Pedido criado: ${JSON.stringify(pedido)}`);
        res.writeHead(201);
        res.end(JSON.stringify(pedido));
      } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ erro: 'JSON invalido' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ erro: 'Rota nao encontrada' }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[PEDIDOS] Servico rodando na porta ${PORT}`);
});

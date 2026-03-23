const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', service: 'pagamentos' }));
    return;
  }

  if (req.url === '/pagamentos/processar' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const { pedidoId, valor } = JSON.parse(body);
        const aprovado = Math.random() > 0.1;
        console.log(`[PAGAMENTOS] Pedido ${pedidoId} - R$${valor} - ${aprovado ? 'APROVADO' : 'RECUSADO'}`);
        res.writeHead(aprovado ? 200 : 402);
        res.end(JSON.stringify({ pedidoId, aprovado, processadoEm: new Date().toISOString() }));
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

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`[PAGAMENTOS] Servico rodando na porta ${PORT}`);
});

const http = require('http');

const estoque = {
  'produto-001': { nome: 'Camiseta', quantidade: 100 },
  'produto-002': { nome: 'Calca', quantidade: 50 },
};

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', service: 'estoque' }));
    return;
  }

  if (req.url === '/estoque' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ estoque }));
    return;
  }

  if (req.url === '/estoque/reservar' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const { produtoId, quantidade } = JSON.parse(body);
        const item = estoque[produtoId];
        if (!item) {
          res.writeHead(404);
          res.end(JSON.stringify({ erro: 'Produto nao encontrado' }));
          return;
        }
        if (item.quantidade < quantidade) {
          res.writeHead(409);
          res.end(JSON.stringify({ erro: 'Estoque insuficiente' }));
          return;
        }
        item.quantidade -= quantidade;
        console.log(`[ESTOQUE] Reserva: ${produtoId} -${quantidade}`);
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true, saldo: item.quantidade }));
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

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[ESTOQUE] Servico rodando na porta ${PORT}`);
});

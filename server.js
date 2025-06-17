const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Configura o express para ler JSON no corpo das requisições
app.use(bodyParser.json());

// Cria (ou abre) o banco SQLite na pasta atual
const db = new sqlite3.Database(path.resolve(__dirname, 'comentarios.db'), (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Conectado ao banco SQLite.');
});

// Cria a tabela comentários se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    texto TEXT NOT NULL,
    data DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Rota POST para adicionar um comentário
app.post('/comentarios', (req, res) => {
  const { nome, texto } = req.body;

  if (!nome || !texto) {
    return res.status(400).json({ error: 'Nome e texto são obrigatórios.' });
  }

  const sql = 'INSERT INTO comentarios (nome, texto) VALUES (?, ?)';
  db.run(sql, [nome, texto], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Retorna o comentário criado com o id
    res.status(201).json({
      id: this.lastID,
      nome,
      texto,
      data: new Date().toISOString()
    });
  });
});

// Rota GET para listar todos os comentários
app.get('/comentarios', (req, res) => {
  const sql = 'SELECT * FROM comentarios ORDER BY data DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const dataFile = path.join(__dirname, 'data.json');

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Inicializar archivo de datos si no existe
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]');

// Endpoint que registra acceso
app.get('/registrar', (req, res) => {
  const timestamp = new Date().toISOString();

  // Leer, actualizar y guardar el archivo
  const data = JSON.parse(fs.readFileSync(dataFile));
  data.push({ timestamp });
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

  // Emitir a todos los clientes conectados
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ timestamp }));
    }
  });

  res.json({ status: 'ok', timestamp });
});
// Nuevo endpoint para obtener historial
app.get('/historial', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  res.json(data);
});

// Iniciar servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

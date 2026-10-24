const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');

const app = express();

const GOOGLE_WEBHOOK = 'https://script.google.com/macros/s/AKfycbyCZuwT4Bib5_LECjVcnSYKvcZ9F883ZmaxecWF4yKSit7PrPfuJkN6WJPTwQTgpmDWcQ/exec'; 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function requestGoogle(url, method, payload = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: method,
      headers: payload ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      } : {}
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return requestGoogle(res.headers.location, method, payload).then(resolve).catch(reject);
      }

      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : []);
        } catch (e) {
          resolve([]);
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

app.get('/api/citas', async (req, res) => {
  try {
    const citas = await requestGoogle(GOOGLE_WEBHOOK, 'GET');
    res.json(citas);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ error: 'Error de almacenamiento' });
  }
});

app.post('/api/citas', async (req, res) => {
  try {
    const nuevaCita = req.body;
    await requestGoogle(GOOGLE_WEBHOOK, 'POST', JSON.stringify(nuevaCita));
    res.status(201).json({ status: 'ok', cita: nuevaCita });
  } catch (error) {
    console.error('Error al guardar cita:', error);
    res.status(500).json({ error: 'Error al registrar cita' });
  }
});

app.use(express.static(path.join(__dirname, 'público')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const publicPath = path.join(__dirname, 'público', 'index.html');
  res.sendFile(publicPath, (err) => {
    if (err) res.status(200).send('<h2>Servidor Conectado a Google Sheets</h2>');
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor activo en puerto ${PORT}`));

process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));

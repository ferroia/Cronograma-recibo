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
          resolve(body ? JSON.parse(body) : body);
        } catch (e) {
          resolve(body);
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
    res.json(Array.isArray(citas) ? citas : []);
  } catch (error) {
    console.error('Error GET Google Sheets:', error);
    res.status(500).json({ error: 'Error al leer almacenamiento' });
  }
});

app.post('/api/citas', async (req, res) => {
  try {
    const body = req.body || {};
    
    // Normalización de campos para garantizar que ningún dato llegue vacío
    const citaNormalizada = {
      tipo: body.tipo || 'cita',
      fecha: body.fecha || body.date || body.dia || '',
      inicio: body.inicio || body.hora || body.start || '',
      fin: body.fin || body.end || (Number(body.inicio || body.hora) ? Number(body.inicio || body.hora) + 1 : '') || '',
      proveedor: body.proveedor || body.empresa || body.nombre || body.client || '',
      nota: body.nota || body.estado || body.observacion || '',
      ts: body.ts || new Date().getTime()
    };

    console.log('Enviando cita normalizada a Google Sheets:', JSON.stringify(citaNormalizada));
    const respuestaGoogle = await requestGoogle(GOOGLE_WEBHOOK, 'POST', JSON.stringify(citaNormalizada));
    console.log('Respuesta de Google Sheets:', JSON.stringify(respuestaGoogle));

    res.status(201).json({ status: 'ok', cita: citaNormalizada, google: respuestaGoogle });
  } catch (error) {
    console.error('Error POST Google Sheets:', error);
    res.status(500).json({ error: 'Error al escribir cita' });
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

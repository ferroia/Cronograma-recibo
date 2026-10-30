const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

const citasCompletas = [
  // SEMANA ANTERIOR (19/10 AL 25/10)
  {"id": "h1", "fecha": "2026-10-19", "hora": "07:00", "proveedor": "PROCABLES", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "h2", "fecha": "2026-10-20", "hora": "07:00", "proveedor": "DICO", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "h3", "fecha": "2026-10-20", "hora": "07:00", "proveedor": "JAGUARCOL", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "h4", "fecha": "2026-10-21", "hora": "07:00", "proveedor": "DICO", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},

  // SEMANA ACTUAL (26/10 AL 01/11)
  {"id": "1", "fecha": "2026-10-26", "hora": "07:00", "proveedor": "MERCURY", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "2", "fecha": "2026-10-26", "hora": "10:00", "proveedor": "ELECTRICOS PEREZ", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "3", "fecha": "2026-10-26", "hora": "12:00", "proveedor": "LAUMAYER", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "4", "fecha": "2026-10-26", "hora": "14:00", "proveedor": "PROCABLES", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "5", "fecha": "2026-10-26", "hora": "14:00", "proveedor": "TCC", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "6", "fecha": "2026-10-27", "hora": "07:00", "proveedor": "COMERCIAL ELECTRICOS", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "7", "fecha": "2026-10-27", "hora": "10:00", "proveedor": "INSUTUBOS", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "8", "fecha": "2026-10-27", "hora": "13:00", "proveedor": "GALCO", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "9", "fecha": "2026-10-27", "hora": "13:00", "proveedor": "JAGUARCOL", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "10", "fecha": "2026-10-27", "hora": "14:00", "proveedor": "MUNDIAL DE TORNILLOS", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "11", "fecha": "2026-10-28", "hora": "09:00", "proveedor": "PROCABLES", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "12", "fecha": "2026-10-28", "hora": "10:00", "proveedor": "JG DIST", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "13", "fecha": "2026-10-28", "hora": "11:00", "proveedor": "INSUTUBOS", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "14", "fecha": "2026-10-28", "hora": "13:00", "proveedor": "SOMELECT", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "15", "fecha": "2026-10-28", "hora": "13:00", "proveedor": "GALCO", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "16", "fecha": "2026-10-28", "hora": "14:00", "proveedor": "TCC", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "17", "fecha": "2026-10-28", "hora": "14:00", "proveedor": "COORDINADORA", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "18", "fecha": "2026-10-28", "hora": "16:00", "proveedor": "ENSAMBLES Y DISTRIBUCIONES", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "19", "fecha": "2026-10-29", "hora": "07:00", "proveedor": "EDEMCO", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "20", "fecha": "2026-10-29", "hora": "08:00", "proveedor": "EQUIELECT", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "21", "fecha": "2026-10-29", "hora": "10:00", "proveedor": "TECNOSA", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "22", "fecha": "2026-10-29", "hora": "10:00", "proveedor": "PROCABLES", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "23", "fecha": "2026-10-29", "hora": "11:00", "proveedor": "CILES", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "24", "fecha": "2026-10-29", "hora": "13:00", "proveedor": "ALDIA", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "25", "fecha": "2026-10-29", "hora": "13:00", "proveedor": "DICO", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "26", "fecha": "2026-10-29", "hora": "14:00", "proveedor": "TCC", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "27", "fecha": "2026-10-29", "hora": "14:00", "proveedor": "TERCOL", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "28", "fecha": "2026-10-29", "hora": "14:00", "proveedor": "ENSAMBLES Y DISEÑOS", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "29", "fecha": "2026-10-29", "hora": "15:00", "proveedor": "GALCO", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "30", "fecha": "2026-10-30", "hora": "08:00", "proveedor": "PROCABLES", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "CON CITA"},
  {"id": "31", "fecha": "2026-10-30", "hora": "10:00", "proveedor": "GALCO", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "CON CITA"},
  {"id": "32", "fecha": "2026-10-30", "hora": "11:00", "proveedor": "PROCABLES", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "CON CITA"},
  {"id": "33", "fecha": "2026-10-30", "hora": "13:00", "proveedor": "TECNOSA", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "CON CITA"},
  {"id": "34", "fecha": "2026-10-30", "hora": "14:00", "proveedor": "TCC", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "CON CITA"}
];

let memoriaLocal = [...citasCompletas];

async function initDB() {
  if (!process.env.DATABASE_URL) return;
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS citas_proveedores (
        id VARCHAR(50) PRIMARY KEY,
        proveedor VARCHAR(150) NOT NULL,
        fecha VARCHAR(20) NOT NULL,
        hora VARCHAR(10) NOT NULL,
        tipo_material VARCHAR(100),
        placa VARCHAR(20),
        observaciones TEXT,
        estado VARCHAR(50) NOT NULL
      );
    `);
    
    for (const c of citasCompletas) {
      await client.query(`
        INSERT INTO citas_proveedores (id, proveedor, fecha, hora, tipo_material, placa, observaciones, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET estado = EXCLUDED.estado, proveedor = EXCLUDED.proveedor;
      `, [c.id, c.proveedor, c.fecha, c.hora, c.tipoMaterial, c.placa, c.observaciones, c.estado]);
    }
    client.release();
  } catch (err) {}
}

initDB();

app.get('/api/citas', async (req, res) => {
  if (!process.env.DATABASE_URL) return res.json(memoriaLocal);
  try {
    const result = await pool.query('SELECT id, proveedor, fecha, hora, tipo_material AS "tipoMaterial", placa, observaciones, estado FROM citas_proveedores ORDER BY id ASC');
    if (result.rows.length === 0) return res.json(citasCompletas);
    res.json(result.rows);
  } catch (err) {
    res.json(memoriaLocal);
  }
});

app.post('/api/citas', async (req, res) => {
  const { proveedor, fecha, hora, tipoMaterial, placa, observaciones, estado } = req.body;
  if (!proveedor || !fecha || !hora) return res.status(400).json({ error: 'Faltan campos' });
  
  const id = Date.now().toString();
  const nuevoEstado = estado || 'CON CITA';
  const nueva = { id, proveedor, fecha, hora, tipoMaterial: tipoMaterial || '', placa: placa || '', observaciones: observaciones || '', estado: nuevoEstado };
  memoriaLocal.push(nueva);

  if (process.env.DATABASE_URL) {
    try {
      await pool.query(
        'INSERT INTO citas_proveedores (id, proveedor, fecha, hora, tipo_material, placa, observaciones, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [id, proveedor, fecha, hora, nueva.tipoMaterial, nueva.placa, nueva.observaciones, nueva.estado]
      );
    } catch (e) {}
  }
  res.json({ success: true, cita: nueva });
});

app.post('/api/citas/estado', async (req, res) => {
  const { id, estado } = req.body;
  const item = memoriaLocal.find(c => c.id === id);
  if (item) item.estado = estado;

  if (process.env.DATABASE_URL) {
    try {
      await pool.query('UPDATE citas_proveedores SET estado = $1 WHERE id = $2', [estado, id]);
    } catch (e) {}
  }
  res.json({ success: true });
});

app.delete('/api/citas/:id', async (req, res) => {
  const { id } = req.params;
  memoriaLocal = memoriaLocal.filter(c => c.id !== id);

  if (process.env.DATABASE_URL) {
    try {
      await pool.query('DELETE FROM citas_proveedores WHERE id = $1', [id]);
    } catch (e) {}
  }
  res.json({ success: true });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));

const express = require('express');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

// Base de datos inicial para el Cronograma de Recibo
db.defaults({
  programaciones: [
    {
      id: 1,
      obra: "Obra Central",
      proveedor: "GALCO",
      fecha: "2026-10-14",
      horaInicio: "06:00",
      horaFin: "07:00",
      observaciones: "Recibo de tubería",
      estado: "Programado"
    }
  ]
}).write();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API: Obtener todas las programaciones (para el Cronograma)
app.get('/api/v1/programaciones', (req, res) => {
  const lista = db.get('programaciones').value() || [];
  res.json(lista);
});

// API: Agendar un nuevo proveedor (+ Programar)
app.post('/api/v1/programaciones', (req, res) => {
  const nueva = {
    id: Date.now(),
    obra: req.body.obra || 'General',
    proveedor: req.body.proveedor || 'Sin nombre',
    fecha: req.body.fecha,
    horaInicio: req.body.horaInicio,
    horaFin: req.body.horaFin,
    observaciones: req.body.observaciones || '',
    estado: 'Programado'
  };

  db.get('programaciones').push(nueva).write();
  res.status(201).json(nueva);
});

// API: Datos para el Dashboard de mediciones
app.get('/api/v1/dashboard', (req, res) => {
  const lista = db.get('programaciones').value() || [];
  
  // Conteo de proveedores e indicadores
  const totalRegistros = lista.length;
  const proveedoresUnicos = [...new Set(lista.map(p => p.proveedor))].length;

  res.json({
    totalRegistros,
    proveedoresUnicos,
    programaciones: lista
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Cronograma corriendo en puerto ${PORT}`);
});

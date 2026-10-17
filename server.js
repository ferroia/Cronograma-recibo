const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Lista inicial de citas
let programaciones = [];

app.get('/api/v1/programaciones', (req, res) => {
  res.json(programaciones);
});

app.post('/api/v1/programaciones', (req, res) => {
  const nuevo = { id: String(Date.now()), estado: 'Programado', ...req.body };
  programaciones.push(nuevo);
  res.status(201).json(nuevo);
});

app.delete('/api/v1/programaciones/:id', (req, res) => {
  const idBorrar = String(req.params.id);
  programaciones = programaciones.filter(p => String(p.id) !== idBorrar);
  res.json({ ok: true, idBorrado: idBorrar });
});

app.get('/api/v1/dashboard', (req, res) => {
  const totalAgendamientos = programaciones.length;
  const pendientes = programaciones.filter(p => p.estado === 'Programado').length;
  const completados = programaciones.filter(p => p.estado === 'Completado').length;

  res.json({
    totalAgendamientos,
    pendientes,
    completados,
    promedioMinutos: 0,
    programaciones
  });
});

app.listen(PORT, () => console.log('Servidor activo en http://localhost:' + PORT));

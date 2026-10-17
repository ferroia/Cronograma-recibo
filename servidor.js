const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Citas migradas marcadas como Completado (Semana recibida)
let programaciones = [
  // Martes 13/10
  { id: '101', proveedor: 'PROCABLES', fecha: '2026-10-13', horaInicio: '10:00', estado: 'Completado', sinCita: false },
  { id: '102', proveedor: 'JAGUARCOL', fecha: '2026-10-13', horaInicio: '11:00', estado: 'Completado', sinCita: false },
  { id: '103', proveedor: 'GALCO', fecha: '2026-10-13', horaInicio: '13:00', estado: 'Completado', sinCita: false },
  { id: '104', proveedor: 'TCC', fecha: '2026-10-13', horaInicio: '14:00', estado: 'Completado', sinCita: false },
  { id: '105', proveedor: 'JAGUARCOL', fecha: '2026-10-13', horaInicio: '15:00', estado: 'Completado', sinCita: false },

  // Miércoles 14/10
  { id: '106', proveedor: 'GALCO', fecha: '2026-10-14', horaInicio: '07:00', estado: 'Completado', sinCita: false },
  { id: '107', proveedor: 'TECNOSA', fecha: '2026-10-14', horaInicio: '08:00', estado: 'Completado', sinCita: false },
  { id: '108', proveedor: 'CASA FERRETERA', fecha: '2026-10-14', horaInicio: '09:00', estado: 'Completado', sinCita: false },
  { id: '109', proveedor: 'GALCO', fecha: '2026-10-14', horaInicio: '10:00', estado: 'Completado', sinCita: false },
  { id: '110', proveedor: 'COMERCIALIZADORA DE ELECTRICOS COLOMBIA', fecha: '2026-10-14', horaInicio: '11:00', estado: 'Completado', sinCita: false },
  { id: '111', proveedor: 'ELECTRICOS Y TUBOS LOS ALPES', fecha: '2026-10-14', horaInicio: '13:00', estado: 'Completado', sinCita: false },
  { id: '112', proveedor: 'METALTUBOS', fecha: '2026-10-14', horaInicio: '14:00', estado: 'Completado', sinCita: false },
  { id: '113', proveedor: 'LAUMAYER', fecha: '2026-10-14', horaInicio: '15:00', estado: 'Completado', sinCita: false },

  // Jueves 15/10
  { id: '114', proveedor: 'TERCOL', fecha: '2026-10-15', horaInicio: '07:00', estado: 'Completado', sinCita: false },
  { id: '115', proveedor: 'EQUIELECT', fecha: '2026-10-15', horaInicio: '08:00', estado: 'Completado', sinCita: false },
  { id: '116', proveedor: 'COORDINADORA', fecha: '2026-10-15', horaInicio: '09:00', estado: 'Completado', sinCita: false },
  { id: '117', proveedor: 'SONEPAR', fecha: '2026-10-15', horaInicio: '10:00', estado: 'Completado', sinCita: false },
  { id: '118', proveedor: 'GALCO', fecha: '2026-10-15', horaInicio: '12:00', estado: 'Completado', sinCita: false },
  { id: '119', proveedor: 'ELECTRICOS JG', fecha: '2026-10-15', horaInicio: '13:00', estado: 'Completado', sinCita: false },
  { id: '120', proveedor: 'INSUTUBOS', fecha: '2026-10-15', horaInicio: '14:00', estado: 'Completado', sinCita: false },
  { id: '121', proveedor: 'JAGUARCOL', fecha: '2026-10-15', horaInicio: '15:00', estado: 'Completado', sinCita: false },

  // Viernes 16/10
  { id: '122', proveedor: 'DICO', fecha: '2026-10-16', horaInicio: '07:00', estado: 'Completado', sinCita: false },
  { id: '123', proveedor: 'PROCABLES', fecha: '2026-10-16', horaInicio: '09:00', estado: 'Completado', sinCita: false },
  { id: '124', proveedor: 'SOMELECT', fecha: '2026-10-16', horaInicio: '11:00', estado: 'Completado', sinCita: false },
  { id: '125', proveedor: 'TCC', fecha: '2026-10-16', horaInicio: '12:00', estado: 'Completado', sinCita: false },
  { id: '126', proveedor: 'MEGALUCES', fecha: '2026-10-16', horaInicio: '13:00', estado: 'Completado', sinCita: false },
  { id: '127', proveedor: 'FRANCISCO MURILLO', fecha: '2026-10-16', horaInicio: '14:00', estado: 'Completado', sinCita: false },
  { id: '128', proveedor: 'TECNOSA', fecha: '2026-10-16', horaInicio: '15:00', estado: 'Completado', sinCita: false }
];

app.get('/api/v1/programaciones', (req, res) => {
  res.json(programaciones);
});

app.post('/api/v1/programaciones', (req, res) => {
  const nuevo = { id: String(Date.now()), estado: 'Programado', ...req.body };
  programaciones.push(nuevo);
  res.status(201).json(nuevo);
});

// Endpoint para alternar estado (Completado vs Programado)
app.put('/api/v1/programaciones/:id/estado', (req, res) => {
  const id = String(req.params.id);
  const { estado } = req.body;
  const item = programaciones.find(p => String(p.id) === id);
  if (item) {
    item.estado = estado || (item.estado === 'Completado' ? 'Programado' : 'Completado');
    return res.json({ ok: true, item });
  }
  res.status(404).json({ error: 'No encontrado' });
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
    promedioMinutos: completados > 0 ? 35 : 0,
    programaciones
  });
});

app.listen(PORT, () => console.log('Servidor activo en http://localhost:' + PORT));

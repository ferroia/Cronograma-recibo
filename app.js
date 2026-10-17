let fechaReferencia = new Date();
let chartPeriodoInstance = null;
let chartCitasInstance = null;
let chartTopInstance = null;
let chartTiemposInstance = null;
let datosGlobales = [];

function obtenerFechasSemana(fecha) {
  const curr = new Date(fecha);
  const day = curr.getDay();
  const diffToMonday = curr.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(curr.setDate(diffToMonday));

  const fechas = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    fechas.push(d.toISOString().split('T')[0]);
  }
  return fechas;
}

const HORAS = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

async function cargarDatos() {
  try {
    const res = await fetch('/api/v1/dashboard');
    const data = await res.json();

    datosGlobales = data.programaciones || [];

    document.getElementById('kpi-total').textContent = data.totalAgendamientos;
    document.getElementById('kpi-pendientes').textContent = data.pendientes;
    document.getElementById('kpi-completados').textContent = data.completados;
    document.getElementById('kpi-promedio').textContent = `${data.promedioMinutos || 0} min`;

    const pct = data.totalAgendamientos > 0 ? Math.round((data.completados / data.totalAgendamientos) * 100) : 0;
    document.getElementById('txt-progreso-flujo').textContent = `Atendidos: ${pct}%`;
    document.getElementById('barra-progreso-flujo').style.width = `${pct}%`;

    renderGrillaSemanal(datosGlobales);
    if (!document.getElementById('vista-dashboard').classList.contains('hidden')) {
      renderDashboardGraficos();
    }
  } catch (err) {
    console.error('Error cargando datos:', err);
  }
}

function cambiarSemana(offset) {
  if (offset === 0) fechaReferencia = new Date();
  else fechaReferencia.setDate(fechaReferencia.getDate() + (offset * 7));
  cargarDatos();
}

function renderGrillaSemanal(lista) {
  const container = document.getElementById('grilla-semanal');
  const fechasSemana = obtenerFechasSemana(fechaReferencia);
  const nombresDias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const cabecera = document.getElementById('cabecera-dias');
  let htmlCabecera = `<div class="font-bold text-slate-300">Hora</div>`;
  
  fechasSemana.forEach((f, idx) => {
    const partes = f.split('-');
    const diaMes = `${partes[2]}/${partes[1]}`;
    if (idx === 6) {
      htmlCabecera += `<div class="bg-rose-900 text-rose-200 rounded-lg py-1 font-bold">${nombresDias[idx]} ${diaMes}</div>`;
    } else {
      htmlCabecera += `<div class="font-bold">${nombresDias[idx]} ${diaMes}</div>`;
    }
  });
  cabecera.innerHTML = htmlCabecera;

  let html = '';

  HORAS.forEach(hora => {
    const horaNum = parseInt(hora.split(':')[0]);

    html += `<div class="grid grid-cols-8 gap-2 p-1 items-stretch min-h-[75px]">`;
    html += `<div class="flex items-center justify-center font-bold text-xs text-slate-700 bg-slate-200 border border-slate-300 rounded-xl p-1">${hora}</div>`;

    fechasSemana.forEach((fecha, idx) => {
      if (idx === 6) {
        html += `<div class="bg-rose-50 border border-rose-200 rounded-xl p-1 flex items-center justify-center text-center"><span class="text-[10px] font-semibold text-rose-400 italic">Descanso</span></div>`;
        return;
      }

      const itemsDiaHora = lista.filter(p => p.fecha === fecha && parseInt(p.horaInicio.split(':')[0]) === horaNum);

      html += `<div class="border border-slate-200 rounded-xl p-1 bg-slate-50 space-y-1 flex flex-col justify-between">`;
      
      if (itemsDiaHora.length > 0) {
        itemsDiaHora.forEach(item => {
          const tagCita = item.sinCita 
            ? `<span class="bg-rose-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase shrink-0">Sin Cita</span>`
            : `<span class="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase shrink-0">Con Cita</span>`;

          html += `
            <div class="border border-amber-300 bg-amber-100 rounded-lg p-2 shadow-sm relative">
              <div class="flex justify-between items-start gap-1">
                <span class="text-xs text-slate-900 font-extrabold leading-tight break-words uppercase flex-1">${item.proveedor}</span>
                <button type="button" onclick="eliminarRegistro(event, '${item.id}')" title="Eliminar cita" class="bg-rose-500 hover:bg-rose-700 text-white font-black text-xs px-1.5 py-0.5 rounded shadow-xs shrink-0 cursor-pointer">🗑️</button>
              </div>
              <div class="mt-1 flex items-center justify-between">${tagCita}</div>
            </div>
          `;
        });
      }

      if (itemsDiaHora.length < 3) {
        const cuposLibres = 3 - itemsDiaHora.length;
        html += `<button type="button" onclick="abrirModalConFechaHora('${fecha}', '${hora}')" class="w-full text-[9px] text-slate-500 font-medium border border-dashed border-slate-300 hover:border-blue-500 hover:text-blue-600 rounded-lg p-1 text-center bg-white transition">+ Libre (${cuposLibres})</button>`;
      }

      html += `</div>`;
    });

    html += `</div>`;
  });

  container.innerHTML = html;
}
async function eliminarRegistro(event, id) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  try {
    const res = await fetch(`/api/v1/programaciones/${id}`, { method: 'DELETE' });
    if (res.ok) {
      datosGlobales = datosGlobales.filter(d => String(d.id) !== String(id));
      await cargarDatos();
    }
  } catch (err) {
    console.error('Error eliminando:', err);
  }
}

function renderDashboardGraficos() {
  actualizarGraficoPeriodo();

  const conCita = datosGlobales.filter(d => !d.sinCita).length;
  const sinCita = datosGlobales.filter(d => d.sinCita).length;

  if (chartCitasInstance) chartCitasInstance.destroy();
  chartCitasInstance = new Chart(document.getElementById('chart-citas'), {
    type: 'doughnut',
    data: {
      labels: ['Con Cita', 'Sin Cita'],
      datasets: [{
        data: [conCita, sinCita],
        backgroundColor: ['#2563eb', '#f59e0b']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  actualizarGraficoTop();

  if (chartTiemposInstance) chartTiemposInstance.destroy();
  chartTiemposInstance = new Chart(document.getElementById('chart-tiempos'), {
    type: 'bar',
    data: {
      labels: ['Promedio Recibo (Min)'],
      datasets: [{
        label: 'Minutos',
        data: [0],
        backgroundColor: '#10b981'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

function actualizarGraficoPeriodo() {
  const tipo = document.getElementById('filtro-periodo').value;
  const selectMes = document.getElementById('filtro-mes-select');

  let labels = [];
  let data = [];

  if (tipo === 'mes_especifico') {
    selectMes.classList.remove('hidden');
    const mesNum = parseInt(selectMes.value);
    
    for (let i = 1; i <= 31; i++) {
      labels.push(`Día ${i}`);
      const conteoDia = datosGlobales.filter(d => {
        const fechaObj = new Date(d.fecha);
        return fechaObj.getMonth() === mesNum && fechaObj.getDate() === i;
      }).length;
      data.push(conteoDia); 
    }
  } else {
    selectMes.classList.add('hidden');
    
    if (tipo === 'todos_meses') {
      labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      data = labels.map((_, idx) => {
        return datosGlobales.filter(d => new Date(d.fecha).getMonth() === idx).length;
      });
    } else {
      labels = ['2024', '2025', '2026'];
      data = labels.map(a => {
        return datosGlobales.filter(d => String(new Date(d.fecha).getFullYear()) === a).length;
      });
    }
  }

  if (chartPeriodoInstance) chartPeriodoInstance.destroy();
  chartPeriodoInstance = new Chart(document.getElementById('chart-periodo'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: tipo === 'mes_especifico' ? 'Recibo por Día' : 'Recibo por Mes',
        data: data,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

function actualizarGraficoTop() {
  const limite = parseInt(document.getElementById('filtro-top').value);
  const conteo = {};

  datosGlobales.forEach(d => {
    if (d.proveedor) {
      conteo[d.proveedor] = (conteo[d.proveedor] || 0) + 1;
    }
  });

  let ordenados = Object.entries(conteo).sort((a,b) => b[1] - a[1]).slice(0, limite);

  if (chartTopInstance) chartTopInstance.destroy();
  chartTopInstance = new Chart(document.getElementById('chart-top-proveedores'), {
    type: 'bar',
    data: {
      labels: ordenados.map(o => o[0]),
      datasets: [{
        label: 'Citas / Recibo Proveedores',
        data: ordenados.map(o => o[1]),
        backgroundColor: '#8b5cf6'
      }]
    },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
  });
}

function cambiarVista(vista) {
  document.getElementById('vista-cronograma').classList.toggle('hidden', vista !== 'cronograma');
  document.getElementById('vista-dashboard').classList.toggle('hidden', vista !== 'dashboard');
  if (vista === 'dashboard') renderDashboardGraficos();
}

function abrirModal() { document.getElementById('modal-programar').classList.remove('hidden'); }

function abrirModalConFechaHora(fecha, hora) {
  document.getElementById('form-programar').reset();
  document.getElementById('inp-fecha').value = fecha;
  document.getElementById('inp-inicio').value = hora;
  abrirModal();
}

function cerrarModal() { 
  document.getElementById('form-programar').reset();
  document.getElementById('modal-programar').classList.add('hidden'); 
}

document.getElementById('form-programar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    proveedor: document.getElementById('inp-proveedor').value.toUpperCase(),
    fecha: document.getElementById('inp-fecha').value,
    horaInicio: document.getElementById('inp-inicio').value,
    sinCita: document.getElementById('inp-sincita').checked
  };

  await fetch('/api/v1/programaciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  cerrarModal();
  await cargarDatos();
});

// Cargar datos inicialmente
cargarDatos();

// Bucle de sincronización automática en vivo cada 3 segundos
setInterval(() => {
  cargarDatos();
}, 3000);

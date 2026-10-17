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
  if (typeof Chart === 'undefined') return;

  actualizarGraficoPeriodo();

  const conCita = datosGlobales.filter(d => !d.sinCita).length;
  const sinCita = datosGlobales.filter(d => d.sinCita).length;

  const canvasCitas = document.getElementById('chart-citas');
  if (canvasCitas) {
    if (chartCitasInstance) chartCitasInstance.destroy();
    chartCitasInstance = new Chart(canvasCitas, {
      type: 'doughnut',
      data: {
        labels: ['Con Cita', 'Sin Cita'],
        datasets: [{
          data: [conCita || 1, sinCita || 0],
          backgroundColor: ['#2563eb', '#f59e0b']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  actualizarGraficoTop();

  const canvasTiempos = document.getElementById('chart-tiempos');
  if (canvasTiempos) {
    if (chartTiemposInstance) chartTiemposInstance.destroy();
    chartTiemposInstance = new Chart(canvasTiempos, {
      type: 'bar',
      data: {
        labels: ['Promedio Recibo (Min)'],
        datasets: [{
          label: 'Minutos',
          data: [35],
          backgroundColor: '#10b981'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}

function actualizarGraficoPeriodo() {
  const elPeriodo = document.getElementById('filtro-periodo');
  const tipo = elPeriodo ? elPeriodo.value : 'todos_meses';
  const selectMes = document.getElementById('filtro-mes-select');

  let labels = [];
  let data = [];

  if (tipo === 'mes_especifico') {
    if (selectMes) selectMes.classList.remove('hidden');
    const mesNum = selectMes ? parseInt(selectMes.value) : 9;
    
    for (let i = 1; i <= 31; i++) {
      labels.push(`Día ${i}`);
      const conteoDia = datosGlobales.filter(d => {
        const fechaObj = new Date(d.fecha);
        return fechaObj.getMonth() === mesNum && fechaObj.getDate() === i;
      }).length;
      data.push(conteoDia); 
    }
  } else {
    if (selectMes) selectMes.classList.add('hidden');
    
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

  const canvasPeriodo = document.getElementById('chart-periodo');
  if (canvasPeriodo) {
    if (chartPeriodoInstance) chartPeriodoInstance.destroy();
    chartPeriodoInstance = new Chart(canvasPeriodo, {
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
}

function actualizarGraficoTop() {
  const elTop = document.getElementById('filtro-top');
  const limite = elTop ? parseInt(elTop.value) : 5;
  const conteo = {};

  datosGlobales.forEach(d => {
    if (d.proveedor) {
      conteo[d.proveedor] = (conteo[d.proveedor] || 0) + 1;
    }
  });

  let ordenados = Object.entries(conteo).sort((a,b) => b[1] - a[1]).slice(0, limite);

  const canvasTop = document.getElementById('chart-top-proveedores');
  if (canvasTop) {
    if (chartTopInstance) chartTopInstance.destroy();
    chartTopInstance = new Chart(canvasTop, {
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
}

function cambiarVista(vista) {
  document.getElementById('vista-cronograma').classList.toggle('hidden', vista !== 'cronograma');
  document.getElementById('vista-dashboard').classList.toggle('hidden', vista !== 'dashboard');
  
  if (vista === 'dashboard') {
    setTimeout(() => {
      renderDashboardGraficos();
    }, 100);
  }
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

cargarDatos();

setInterval(() => {
  cargarDatos();
}, 3000);

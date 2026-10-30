import json

citas = [
  # Lunes 26/10
  {"id": "1", "fecha": "2026-10-26", "hora": "07:00", "proveedor": "MERCURY", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "2", "fecha": "2026-10-26", "hora": "10:00", "proveedor": "ELECTRICOS PEREZ", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "3", "fecha": "2026-10-26", "hora": "12:00", "proveedor": "LAUMAYER", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "4", "fecha": "2026-10-26", "hora": "14:00", "proveedor": "PROCABLES", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "5", "fecha": "2026-10-26", "hora": "14:00", "proveedor": "TCC", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},

  # Martes 27/10
  {"id": "6", "fecha": "2026-10-27", "hora": "07:00", "proveedor": "COMERCIAL ELECTRICOS", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "7", "fecha": "2026-10-27", "hora": "10:00", "proveedor": "INSUTUBOS", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "8", "fecha": "2026-10-27", "hora": "13:00", "proveedor": "GALCO", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "9", "fecha": "2026-10-27", "hora": "13:00", "proveedor": "JAGUARCOL", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "10", "fecha": "2026-10-27", "hora": "14:00", "proveedor": "MUNDIAL DE TORNILLOS", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},

  # Miércoles 28/10
  {"id": "11", "fecha": "2026-10-28", "hora": "09:00", "proveedor": "PROCABLES", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "12", "fecha": "2026-10-28", "hora": "10:00", "proveedor": "JG DIST", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "13", "fecha": "2026-10-28", "hora": "11:00", "proveedor": "INSUTUBOS", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "14", "fecha": "2026-10-28", "hora": "13:00", "proveedor": "SOMELECT", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "15", "fecha": "2026-10-28", "hora": "13:00", "proveedor": "GALCO", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "16", "fecha": "2026-10-28", "hora": "14:00", "proveedor": "TCC", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "17", "fecha": "2026-10-28", "hora": "14:00", "proveedor": "COORDINADORA", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},
  {"id": "18", "fecha": "2026-10-28", "hora": "16:00", "proveedor": "ENSAMBLES Y DISTRIBUCIONES", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "RECIBIDO"},

  # Jueves 29/10
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

  # Viernes 30/10
  {"id": "30", "fecha": "2026-10-30", "hora": "08:00", "proveedor": "PROCABLES", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "CON CITA"},
  {"id": "31", "fecha": "2026-10-30", "hora": "10:00", "proveedor": "GALCO", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "CON CITA"},
  {"id": "32", "fecha": "2026-10-30", "hora": "11:00", "proveedor": "PROCABLES", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "CON CITA"},
  {"id": "33", "fecha": "2026-10-30", "hora": "13:00", "proveedor": "TECNOSA", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "CON CITA"},
  {"id": "34", "fecha": "2026-10-30", "hora": "14:00", "proveedor": "TCC", "tipoMaterial": "", "placa": "", "observaciones": "", "estado": "CON CITA"}
]

with open("index.js", "r", encoding="utf-8") as f:
    code = f.read()

# Insertar el seed automático de restauración en initDB()
seed_code = f"""
    // Seed automático de restauración
    const seedCitas = {json.dumps(citas)};
    for (const c of seedCitas) {{
      await client.query(`
        INSERT INTO citas_proveedores (id, proveedor, fecha, hora, tipo_material, placa, observaciones, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET estado = EXCLUDED.estado, proveedor = EXCLUDED.proveedor;
      `, [c['id'], c['proveedor'], c['fecha'], c['hora'], c['tipoMaterial'], c['placa'], c['observaciones'], c['estado']]);
    }}
"""

if "seedCitas" not in code:
    code = code.replace("console.log(\"Tabla citas_proveedores sincronizada en PostgreSQL.\");", seed_code + "\n    console.log(\"Tabla citas_proveedores sincronizada y restaurada en PostgreSQL.\");")

with open("index.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Restauración aplicada al código de backend correctamente.")

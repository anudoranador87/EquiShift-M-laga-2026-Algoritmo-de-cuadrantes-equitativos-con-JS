// ============================================
// EQUISHIFT MÁLAGA — Motor v1.0
// Problema real: reparto inequitativo de turnos
// Objetivo: codificar justicia laboral
// ============================================

// BASE DE DATOS DE TRABAJADORES
const trabajadores = [
  {
    id: 1,
    nombre: "Jose María",
    contrato: 37.50,
    diasTrabajados: 208,
    festivosDisponibles: 13,
    vacacionesDisponibles: 28,
    diasExtraCubiertos: 0,
    findesSemanaLibres: 0,
    turnoAnterior: null,
    calendario: [],
    vacaciones: [],
    festivos: [],

    turnosNoche: 0
  },
  {
    id: 2,
    nombre: "Salvador",
    contrato: 37.50,
    diasTrabajados: 208,
    festivosDisponibles: 13,
    vacacionesDisponibles: 28,
    diasExtraCubiertos: 0,
    findesSemanaLibres: 0,
    turnoAnterior: null,
    calendario: [],
    vacaciones: [],
    festivos: [],
    turnosNoche: 0
  },
  {
    id: 3,
    nombre: "Miguel",
    contrato: 37.50,
    diasTrabajados: 208,
    festivosDisponibles: 13,
    vacacionesDisponibles: 28,
    diasExtraCubiertos: 0,
    findesSemanaLibres: 0,
    turnoAnterior: null,
    calendario: [],
    vacaciones: [],
    festivos: [], 
    turnosNoche: 0
  },
  {
    id: 4,
    nombre: "Diego",
    contrato: 40,
    diasTrabajados: 208,
    festivosDisponibles: 14,
    vacacionesDisponibles: 28,
    diasExtraCubiertos: 0,
    findesSemanaLibres: 0,
    turnoAnterior: null,
    calendario: [],
    vacaciones: [],
    festivos: [], 
    turnosNoche: 0
  },
  {
    id: 5,
    nombre: "Rafa",
    contrato: 40,
    diasTrabajados: 208,
    festivosDisponibles: 14,
    vacacionesDisponibles: 28,
    diasExtraCubiertos: 0,
    findesSemanaLibres: 0,
    turnoAnterior: null,
    calendario: [],
    vacaciones: [],
    festivos: [], 
    // sin turnosNoche — Rafa solo hace noche, nunca cubre a nadie
  }
];
//TEST DE QUE FUNCIONA

// Vacaciones de Rafa — primera semana de agosto
trabajadores[4].vacaciones = [
  "2026-08-01",
  "2026-08-02",
  "2026-08-03",
  "2026-08-04",
  "2026-08-05",
  "2026-08-06",
  "2026-08-07"
];
// FESTIVOS MÁLAGA 2026
const festivosMalaga2026 = [
  "2026-01-01", // Año Nuevo
  "2026-01-06", // Epifanía del Señor
  "2026-02-28", // Día de Andalucía
  "2026-04-02", // Jueves Santo
  "2026-04-03", // Viernes Santo
  "2026-05-01", // Fiesta del Trabajo
  "2026-08-15", // Asunción de la Virgen
  "2026-08-19", // Feria de Málaga (Local)
  "2026-09-08", // Virgen de la Victoria (Local)
  "2026-10-12", // Fiesta Nacional de España
  "2026-11-02", // Lunes tras Todos los Santos
  "2026-12-07", // Lunes tras la Constitución
  "2026-12-08", // Inmaculada Concepción
  "2026-12-25"  // Navidad
];

// CLASIFICACIÓN POR CONTRATO
// Los 37.5h son los únicos que cubren vacaciones
// y festivos de todos — fuente principal de inequidad
const jornada375 = trabajadores.filter(function(trabajador) {
  return trabajador.contrato === 37.50;
});

const jornada40 = trabajadores.filter(function(trabajador) {
  return trabajador.contrato === 40;
});

// MOTOR DE DETECCIÓN DE FINES DE SEMANA
// Día 1 de 2026 = jueves — punto de anclaje
// i % 7 → resto 3 = sábado · resto 4 = domingo
let findeSemana = 0;

for (let i = 1; i <= 365; i++) {
  if (i % 7 === 3 || i % 7 === 4) {
    findeSemana += 1;
  }
}

console.log(`Fines de semana en 2026: ${findeSemana}`); // → 104 ✅

// VALIDADOR DE RESTRICCIONES LEGALES
// Reglas:
// - Tras noche: no puede trabajar mañana ni tarde
// - Tras tarde: no puede trabajar mañana
// - Resto de casos: legal
const esTurnoLegal = function(turnoAyer, turnoHoy, turnoYaAsignado) {
   if(turnoYaAsignado) {
        return false
    }
  if (turnoAyer === "noche") {
    return false;
  }
  else if (turnoAyer === "tarde") {
    if (turnoHoy === "mañana") {
      return false;
    }
    return true;
  }
  return true;
 
};

// TESTS DEL VALIDADOR
console.log(esTurnoLegal("mañana", "noche", "mañana")); // → false (ya tiene mañana)
console.log(esTurnoLegal("libre",  "noche", "tarde"));  // → false (ya tiene tarde)
console.log(esTurnoLegal("libre",  "noche", null));     // → true  (libre todo el día)

// ASIGNADOR JUSTO DE TURNOS
// "menosAfectado" = el que menos días extra ha cubierto
// El turno se asigna al que menos ha pagado hasta ahora
// Así evitamos que uno llegue a 17 días extra y otro a 0
const resultado = jornada375.reduce(function(menosAfectado, actual) {
  if (actual.diasExtraCubiertos < menosAfectado.diasExtraCubiertos) {
    return actual;
  } else {
    return menosAfectado;
  }
});

// TEST DEL ASIGNADOR — situación real documentada
jornada375[0].diasExtraCubiertos = 17; // Jose María
jornada375[1].diasExtraCubiertos = 6;  // Salvador
jornada375[2].diasExtraCubiertos = 0;  // Miguel

const asignado = jornada375.reduce(function(menosAfectado, actual) {
  if (actual.diasExtraCubiertos < menosAfectado.diasExtraCubiertos) {
    return actual;
  } else {
    return menosAfectado;
  }
});

console.log("--- Test asignador justo ---");
console.log(`Turno asignado a: ${asignado.nombre}`); // → Miguel
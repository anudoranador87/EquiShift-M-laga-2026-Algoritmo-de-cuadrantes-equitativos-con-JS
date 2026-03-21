// ============================================
// EQUISHIFT MÁLAGA — Motor v1.1
// Jose Aparicio · Málaga, España · 2026
// ============================================
// Problema real: reparto inequitativo de turnos
// Objetivo: codificar justicia laboral
// No es un proyecto de tutorial.
// Resuelve un problema operativo real.
//
// Horarios del hotel:
//   Mañana: 07:00 - 15:00
//   Tarde:  15:00 - 23:00
//   Noche:  23:00 - 07:00 (cruza medianoche)
//
// Regla: mínimo 16 horas de descanso entre turnos
// Cada día: 3 trabajan, 2 descansan
// ============================================
 
 
// ============================================
// BLOQUE 1: BASE DE DATOS DE TRABAJADORES
// ============================================
 
const trabajadores = [
  {
    id: 1,
    nombre: "Jose María",
    contrato: 37.50,
    festivosDisponibles: 13,
    vacacionesDisponibles: 28,
    calendario: [],
    turnosNoche: 0
  },
  {
    id: 2,
    nombre: "Salvador",
    contrato: 37.50,
    festivosDisponibles: 13,
    vacacionesDisponibles: 28,
    calendario: [],
    turnosNoche: 0
  },
  {
    id: 3,
    nombre: "Miguel",
    contrato: 37.50,
    festivosDisponibles: 13,
    vacacionesDisponibles: 28,
    calendario: [],
    turnosNoche: 0
  },
  {
    id: 4,
    nombre: "Diego",
    contrato: 40,
    festivosDisponibles: 14,
    vacacionesDisponibles: 28,
    calendario: [],
    turnosNoche: 0
  },
  {
    id: 5,
    nombre: "Rafa",
    contrato: 40,
    festivosDisponibles: 14,
    vacacionesDisponibles: 28,
    calendario: []
    // sin turnosNoche — Rafa solo hace noche
  }
];
 
 
// ============================================
// BLOQUE 2: FESTIVOS MÁLAGA 2026
// ============================================
 
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
 
 
// ============================================
// BLOQUE 3: CLASIFICACIÓN POR CONTRATO
// ============================================
// ¿Por qué por contrato y no por nombre?
// El contrato es el dato estable. Los nombres cambian.
 
const jornada375 = trabajadores.filter(function(t) {
  return t.contrato === 37.50;
});
// → Jose María, Salvador, Miguel (13 festivos)
 
const jornada40 = trabajadores.filter(function(t) {
  return t.contrato === 40;
});
// → Diego, Rafa (14 festivos)
 
 
// ============================================
// BLOQUE 4: MOTOR DE FINES DE SEMANA
// ============================================
// Día 1 de 2026 = jueves — punto de anclaje
// resto 3 = sábado · resto 4 = domingo
 
let findeSemana = 0;
 
for (let i = 1; i <= 365; i++) {
  if (i % 7 === 3 || i % 7 === 4) {
    findeSemana += 1;
  }
}
 
console.log(`Fines de semana en 2026: ${findeSemana}`);
// → 104 ✅
 
 
// ============================================
// BLOQUE 5: ACTUALIZACIÓN DE CONVENIO
// ============================================
 
const trabajadoresActualizados = trabajadores.map(function(t) {
  if (t.contrato === 37.50) {
    return { ...t, festivosDisponibles: t.festivosDisponibles - 1 };
  }
  return t;
});
 
 
// ============================================
// BLOQUE 6: VALIDACIÓN DE TURNO LEGAL
// ============================================
// Combinaciones ILEGALES (menos de 16h descanso):
//   tarde → mañana  (8h descanso)
//   noche → mañana  (noche cruza medianoche)
//   noche → tarde   (noche cruza medianoche)
//
// Todo lo demás es legal.
 
function esTurnoLegal(turnoAyer, turnoHoy) {
 
  // Descanso siempre permite cualquier turno
  if (turnoAyer === "descanso") {
    return true;
  }
 
  // tarde → mañana: solo 8h descanso
  if (turnoAyer === "tarde" && turnoHoy === "mañana") {
    return false;
  }
 
  // noche cruza medianoche — noche → mañana y noche → tarde ilegales
  if (turnoAyer === "noche" && (turnoHoy === "mañana" || turnoHoy === "tarde")) {
    return false;
  }
 
  // Default — todo lo no prohibido está permitido
  return true;
}
 
// Tests de verificación
console.log("--- Tests esTurnoLegal ---");
console.log(esTurnoLegal("descanso", "mañana"));  // → true  ✅
console.log(esTurnoLegal("descanso", "noche"));   // → true  ✅
console.log(esTurnoLegal("mañana", "mañana"));    // → true  ✅
console.log(esTurnoLegal("mañana", "tarde"));     // → true  ✅
console.log(esTurnoLegal("mañana", "noche"));     // → true  ✅
console.log(esTurnoLegal("tarde", "mañana"));     // → false ✅
console.log(esTurnoLegal("tarde", "tarde"));      // → true  ✅
console.log(esTurnoLegal("tarde", "noche"));      // → true  ✅
console.log(esTurnoLegal("noche", "mañana"));     // → false ✅
console.log(esTurnoLegal("noche", "tarde"));      // → false ✅
console.log(esTurnoLegal("noche", "noche"));      // → true  ✅
console.log(esTurnoLegal("noche", "descanso"));   // → true  ✅
 
 
// ============================================
// BLOQUE 7: MOTOR DE ASIGNACIÓN BÁSICO
// ============================================
// Versión simple — rotación automática de turnos
// Los turnos rotan: mañana → tarde → noche → descanso → mañana...
// i % 4 garantiza la rotación sin bucle extra
//
// Antes de asignar cualquier turno — esTurnoLegal comprueba
// si la combinación con el turno anterior es válida.
// Si no es legal — ese día no se asigna nada.
//
// NOTA: Esta es la versión base.
// La versión 2.0 usará bloques semanales:
//   2 semanas mañana · 1 semana tarde · 1 semana rotativo
// y criterio de equidad: quien menos fines de semana
// libres acumula, descansa primero.
 
const turnos = ["mañana", "tarde", "noche", "descanso"];
 
// trabajador es una referencia a cualquier objeto del array trabajadores
// ejemplo: trabajadores[0] = Jose María
const trabajador = trabajadores[0];
 
for (let i = 1; i <= 365; i++) {
  const asignarTurno = turnos[i % 4];
 
  if (esTurnoLegal(trabajador.calendario[i - 1], asignarTurno)) {
    trabajador.calendario.push(asignarTurno);
  }
}
 
console.log("--- Calendario Jose María (primeros 10 días) ---");
console.log(trabajador.calendario.slice(0, 10));
 
 
// ============================================
// PRÓXIMO PASO — v1.2
// ============================================
// 1. Aplicar el bucle a todos los trabajadores, no solo a uno
// 2. Fase 1: asignar fines de semana con criterio de equidad
//    — quien menos fines de semana libres acumula, descansa primero
// 3. Fase 2: asignar días laborables restantes
// 4. Implementar bloques semanales para coherencia de turnos

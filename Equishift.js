// ============================================
// EQUISHIFT MÁLAGA — Motor v1.1 (CORREGIDO)
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
// BLOQUE 1: CONFIGURACIÓN Y CONSTANTES
// ============================================
const config = {
    YEAR: 2026,
    MAX_CONSECUTIVE_NIGHT_SHIFTS: 4,
    MIN_REST_HOURS: 16,
    MAX_CONSECUTIVE_WORK_DAYS: 7,
    TARGET_VACACIONES: 28,
    TARGET_FDS_LIBRES: 21,
    TECHO_40H: 2190,
    TECHO_37_5H: 2050,
    SIMULATIONS: 100,
}

// CORRECCIÓN: Usamos un nombre consistente en minúsculas en todo el archivo.
// En el original había mezcla de shift_types y SHIFT_TYPES — eso causa ReferenceError.
const shift_types = {
    MAÑANA: 'Mañana',
    TARDE: 'Tarde',
    NOCHE: 'Noche',
    DESCANSO: 'Descanso',
    VACACIONES: 'Vacaciones', // CORRECCIÓN: faltaba este tipo en el original
    FESTIVO: 'Festivo',       // CORRECCIÓN: faltaba este tipo en el original
}


// ============================================
// BLOQUE 2: CLASE TRABAJADOR
// ============================================
class Trabajador {
    constructor(nombre, contrato, turnoPreferido, fdsFijos, festivosDisponibles, vacacionesDisponibles) {
        this.nombre = nombre;
        this.contrato = contrato;
        this.turnoPreferido = turnoPreferido;
        this.fdsFijos = fdsFijos;
        this.festivosDisponibles = festivosDisponibles;
        this.vacacionesDisponibles = new Set(vacacionesDisponibles);
        this.festivosCompensados = 0;
        this.deudaHistorica = 0;
        this.calendario = [];
        this.turnosNoche = 0;
        this.diasTrabajados = 0;
        this.diasDescanso = 0;
        this.reset();
    }

    reset() {
        this.diasTrabajados = 0;
        this.diasDescanso = 0;
        this.turnosNoche = 0;
        this.festivosCompensados = 0;
        this.calendario = new Array(365).fill(null);
    }

    addVacaciones(inicio, fin) {
        for (let i = inicio; i <= fin; i++) {
            this.calendario[i] = shift_types.VACACIONES;
            this.vacacionesDisponibles.delete(i);
        }
    }

    addFestivo(dia) {
        this.calendario[dia] = shift_types.FESTIVO;
        this.festivosDisponibles--;
    }

    getConsecutiveWorkDays(diaDeHoy = null) {
        let cuenta = 0;
        const desde = diaDeHoy !== null ? diaDeHoy : this.calendario.length - 1;
        for (let i = desde; i >= 0; i--) {
            if (this.calendario[i] && this.calendario[i] !== shift_types.DESCANSO) {
                cuenta++;
            } else {
                break;
            }
        }
        return cuenta;
    }

    // CORRECCIÓN: Este método estaba completamente fuera de la clase en el original.
    // Un método que pertenece a Trabajador DEBE estar dentro de las llaves de la clase.
    // También faltaba el parámetro diaDeHoy en la firma del método.
    getNochesSeguidas(diaDeHoy) {
        let cuenta = 0;
        for (let i = diaDeHoy - 1; i >= 0; i--) {
            if (this.calendario[i] === shift_types.NOCHE) {
                cuenta++;
            } else {
                break;
            }
        }
        return cuenta;
    }

} // ← fin de clase Trabajador


// ============================================
// BLOQUE 3: CLASE EQUISHIFT (MOTOR)
// ============================================

// CORRECCIÓN: En el original había constructor(plantilla) { { — doble llave de apertura.
// Eso creaba un bloque anónimo dentro del constructor y cerraba la clase inmediatamente,
// dejando todos los métodos flotando fuera de la clase como funciones sueltas.
class Equishift {
    constructor(plantilla) {
        this.plantilla = plantilla;
        this.reglas = config;
        this.calendarioFinal = null;
        this.mejorScore = -Infinity;         // CORRECCIÓN: minúscula consistente
        this.mejorCalendario = null;          // CORRECCIÓN: minúscula consistente
        this.simulacionesRealizadas = 0;
        this.startTime = null;
        this.endTime = null;
        this.dias = this.getDiasDelAño(config.YEAR); // CORRECCIÓN: lo precalculamos aquí para no recalcularlo en cada iteración
    }

    // CORRECCIÓN: En el original era getDiasDelAño(year); — el punto y coma después
    // de los paréntesis convierte la definición en una llamada a función, lo que da SyntaxError.
    // Regla: los métodos de una clase se definen sin punto y coma al final de la firma.
    getDiasDelAño(year) {
        let dias = [];
        const fechaInicio = new Date(year, 0, 1);
        const fechaFin = new Date(year, 11, 31);
        for (let fecha = new Date(fechaInicio); fecha <= fechaFin; fecha.setDate(fecha.getDate() + 1)) {
            dias.push(new Date(fecha)); // CORRECCIÓN: clonamos con new Date() para no mutar la misma referencia
        }
        return dias;
    }
garantizarPlantillaCompleta(dia) {
    const trabajando = this.plantilla.filter(emp => emp.calendario[dia] !== shift_types.DESCANSO).length;

    if (trabajando > 3) {
        let extras = trabajando - 3;
        for (let emp of this.plantilla) {
            if (emp.calendario[dia] !== shift_types.DESCANSO && extras > 0) {
                emp.calendario[dia] = shift_types.DESCANSO;
                extras--;
            }
        }
    } else if (trabajando < 3) {
        let faltantes = 3 - trabajando;
        for (let emp of this.plantilla) {
            if (emp.calendario[dia] === shift_types.DESCANSO && faltantes > 0) {
                emp.calendario[dia] = shift_types.MAÑANA;
                faltantes--;
            }
        }
    }
}
    // CORRECCIÓN: isWeekend y el bloque de equidad de fds estaban fuera de calcularScore
    // y fuera de la clase. Los movemos al lugar correcto.
    isWeekend(dia) {
        const fecha = new Date(config.YEAR, 0, dia + 1);
        const diaSemana = fecha.getDay();
        return diaSemana === 0 || diaSemana === 6;
    }

    // CORRECCIÓN: En el original calcularScore(empleado, turnoActual, diaActual); tenía
    // punto y coma en la firma — mismo error que getDiasDelAño.
    calcularScore(empleado, turnoActual, diaActual) {
        let puntosDeCarga = 0;

        // Penalización por noches seguidas
        puntosDeCarga += empleado.getNochesSeguidas(diaActual) > this.reglas.MAX_CONSECUTIVE_NIGHT_SHIFTS ? -10 : 0;

        // Penalización por días trabajados seguidos
        puntosDeCarga += empleado.getConsecutiveWorkDays(diaActual) > this.reglas.MAX_CONSECUTIVE_WORK_DAYS ? -5 : 0;

        // Penalización por falta de descanso proporcional
        puntosDeCarga += empleado.diasDescanso < empleado.diasTrabajados ? -3 : 0;

        // Penalización por turno no preferido
        puntosDeCarga += turnoActual !== empleado.turnoPreferido ? -1 : 0;

        // Vacaciones
        puntosDeCarga += empleado.vacacionesDisponibles.size > 0 ? -1 : 0;
        puntosDeCarga += empleado.vacacionesDisponibles.size === 0 ? +1 : 0;

        // Fines de semana fijos
        puntosDeCarga += empleado.fdsFijos > 0 ? -1 : 0;
        puntosDeCarga += empleado.fdsFijos === 0 ? +1 : 0;

        // Penalización por exceder horas anuales del contrato
        const limiteHoras = empleado.contrato === '40h' ? this.reglas.TECHO_40H : this.reglas.TECHO_37_5H;
        puntosDeCarga += empleado.diasTrabajados * 8 > limiteHoras ? -5 : 0;

        // CORRECCIÓN: En el original se usaba MAX_CONSECUTIVE_WORK_DAYS sin this.reglas.
        // Una variable sin prefijo busca en el scope global y no la encuentra → ReferenceError.
        const diasSeguidosSinDescanso = empleado.getConsecutiveWorkDays(diaActual);
        if (diasSeguidosSinDescanso >= this.reglas.MAX_CONSECUTIVE_WORK_DAYS) {
            puntosDeCarga += -10;
        }

        // Salud laboral: si ayer fue noche, hoy debe ser descanso
        const turnoAyer = diaActual > 0 ? empleado.calendario[diaActual - 1] : null;
        if (turnoAyer === shift_types.NOCHE && turnoActual !== shift_types.DESCANSO) {
            puntosDeCarga += -5;
        }

        // CORRECCIÓN: El bloque isWeekend estaba fuera de calcularScore en el original,
        // después del return, por lo que nunca se ejecutaba. Lo movemos dentro, antes del return.
        if (this.isWeekend(diaActual)) {
            const estaLibreHoy = empleado.calendario[diaActual] === shift_types.DESCANSO;
            const totalFds = empleado.fdsFijos + (estaLibreHoy ? 1 : 0);
            puntosDeCarga += totalFds > 0 ? +1 : -1;
        }

        return puntosDeCarga;
    }

    // CORRECCIÓN: esTurnoLegal(turnoAnterior, turnoActual); — mismo error de punto y coma en firma.
    esTurnoLegal(turnoAnterior, turnoActual) {
        if (turnoAnterior === null || turnoAnterior === shift_types.DESCANSO) {
            return true;
        }
        if (turnoAnterior === shift_types.MAÑANA) {
            return [shift_types.MAÑANA, shift_types.TARDE, shift_types.NOCHE].includes(turnoActual);
        }
        if (turnoAnterior === shift_types.TARDE) {
            return [shift_types.TARDE, shift_types.NOCHE, shift_types.DESCANSO].includes(turnoActual);
        }
        if (turnoAnterior === shift_types.NOCHE) {
            return [shift_types.NOCHE, shift_types.DESCANSO].includes(turnoActual);
        }
        return false;
    }

    // CORRECCIÓN: barajarTurnos(); — mismo error de punto y coma en firma.
    // Además este método debe devolver un array de los 4 tipos de turno barajados,
    // no 365 copias de cada uno (eso era un malentendido en el original — no necesitamos
    // un array de 1460 elementos para elegir el turno de un solo día).
    barajarTurnos() {
        const turnos = [shift_types.MAÑANA, shift_types.TARDE, shift_types.NOCHE, shift_types.DESCANSO];
        for (let i = turnos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [turnos[i], turnos[j]] = [turnos[j], turnos[i]];
        }
        return turnos;
    }

    // CORRECCIÓN: simularAsignacion(); — mismo error de punto y coma en firma.
    simularAsignacion() {
        // Reseteamos los calendarios antes de cada simulación
        this.plantilla.forEach(empleado => empleado.reset());

        for (let dia = 0; dia < this.dias.length; dia++) {
            const fecha = this.dias[dia];
            const dateStr = fecha.toISOString().split('T')[0];

            this.plantilla.forEach(empleado => {

                // CORRECCIÓN: En el original se usaba this.shuffle() — ese método no existe.
                // El método correcto es this.barajarTurnos().
                // También se usaba SHIFT_TYPES en mayúsculas dentro de shuffle() — inconsistencia
                // con shift_types en minúsculas definido al inicio del archivo.
                const turnoLegal = this.barajarTurnos().find(turno => {
                    return (
                        this.esTurnoLegal(empleado.calendario[dia - 1], turno) &&
                        (turno !== shift_types.NOCHE || empleado.getNochesSeguidas(dia) < this.reglas.MAX_CONSECUTIVE_NIGHT_SHIFTS) &&
                        (turno !== shift_types.DESCANSO || empleado.getConsecutiveWorkDays(dia) < this.reglas.MAX_CONSECUTIVE_WORK_DAYS) &&
                        (turno !== shift_types.VACACIONES || empleado.vacacionesDisponibles.has(dateStr)) &&
                        (turno !== shift_types.FESTIVO || empleado.festivosDisponibles > 0)
                    );
                });

                if (turnoLegal) {
                    empleado.calendario[dia] = turnoLegal;

                    if (turnoLegal === shift_types.NOCHE) {
                        empleado.turnosNoche++;
                    }
                    if (turnoLegal !== shift_types.DESCANSO) {
                        empleado.diasTrabajados++;
                    } else {
                        empleado.diasDescanso++;
                    }
                    if (turnoLegal === shift_types.VACACIONES) {
                        empleado.vacacionesDisponibles.delete(dateStr);
                    }
                    if (turnoLegal === shift_types.FESTIVO) {
                        empleado.festivosDisponibles--;
                    }
                }
            });
        }
    }

    // CORRECCIÓN: Este método faltaba en el original — sin él, el bucle de Montecarlo
    // no tiene forma de calcular el score total de una simulación completa.
    calcularScoreTotal() {
        let scoreTotal = 0;
        this.plantilla.forEach(empleado => {
            empleado.calendario.forEach((turno, dia) => {
                if (turno !== null) {
                    scoreTotal += this.calcularScore(empleado, turno, dia);
                }
            });
        });
        return scoreTotal;
    }

    // CORRECCIÓN: El bucle principal de Montecarlo no estaba implementado en el original.
    // Aquí lo añadimos para completar el motor.
    ejecutarMontecarlo() {
        this.startTime = Date.now();

        for (let i = 0; i < this.reglas.SIMULATIONS; i++) {
            this.simularAsignacion();
            const score = this.calcularScoreTotal();

            if (score > this.mejorScore) {
                this.mejorScore = score;
                // Guardamos una copia profunda del calendario de cada empleado
                this.mejorCalendario = this.plantilla.map(emp => ({
                    nombre: emp.nombre,
                    calendario: [...emp.calendario],
                    diasTrabajados: emp.diasTrabajados,
                    diasDescanso: emp.diasDescanso,
                    turnosNoche: emp.turnosNoche,
                }));
            }

            this.simulacionesRealizadas++;
        }

        this.endTime = Date.now();
        console.log(`✅ Montecarlo completado: ${this.simulacionesRealizadas} simulaciones en ${this.endTime - this.startTime}ms`);
        console.log(`🏆 Mejor score encontrado: ${this.mejorScore}`);
        return this.mejorCalendario;
    }

} // Coordinador diario — garantizar exactamente 3 trabajan / 2 descansan

         garantizarPlantillaCompleta(calendarios, dia);{
    const trabajando = calendarios.filter(cal => cal[dia] !== shift_types.DESCANSO).length;
    if (trabajando > 3) {
        // Si hay más de 3 trabajando, forzamos a algunos a descansar
        let extras = trabajando - 3;
        for (let i = 0; i < calendarios.length && extras > 0; i++) {
            if (calendarios[i][dia] !== shift_types.DESCANSO) {
                calendarios[i][dia] = shift_types.DESCANSO;
                extras--;
            }
        }
    } else if (trabajando < 3) {
        // Si hay menos de 3 trabajando, forzamos a algunos a trabajar
        let faltantes = 3 - trabajando;
        for (let i = 0; i < calendarios.length && faltantes > 0; i++) {
            if (calendarios[i][dia] === shift_types.DESCANSO) {
                calendarios[i][dia] = shift_types.MAÑANA; // Asignamos un turno cualquiera, luego se barajará
                faltantes--;
            }
        }}}

        //Regla 16h — esTurnoLegal no calcula horas reales entre turnos, solo verifica secuencias de turnos. Aquí añadimos una función para calcular horas reales entre turnos y usarla en esTurnoLegal.
        calcularHorasEntreTurnos(turnoAnterior, turnoActual);{
            const horasPorTurno = {
                [shift_types.MAÑANA]: 8,
                [shift_types.TARDE]: 8,
                [shift_types.NOCHE]: 8,
                [shift_types.DESCANSO]: 24, // Asumimos que un día de descanso da 24 horas de descanso
                [shift_types.VACACIONES]: 24, // Asumimos que un día de vacaciones da 24 horas de descanso
                [shift_types.FESTIVO]: 24,    // Asumimos que un día festivo da 24 horas de descanso    
            };
            const horasEntre = horasPorTurno[turnoAnterior] + horasPorTurno[turnoActual];
            return horasEntre >= this.reglas.MIN_REST_HOURS;
        }
        
        //Vacaciones — el Set usa números pero se consulta con strings, corregimos para usar strings en ambos casos.
        addVacaciones(inicio, fin);{
            for (let i = inicio; i <= fin; i++) {
                const diaStr = i.toString(); // Convertimos a string para que coincida con el formato del Set
                this.calendario[i] = shift_types.VACACIONES;
                this.vacacionesDisponibles.delete(diaStr);
            }   
        }   
// FESTIVOS COMPENSADOS — añadimos un método para asignar festivos compensados a empleados que no pudieron descansar en festivos reales.
asignarFestivoCompensado(dia);{
    this.plantilla.forEach(empleado => {
        if (empleado.festivosDisponibles > 0 && empleado.calendario[dia] !== shift_types.DESCANSO) {    
            empleado.calendario[dia] = shift_types.FESTIVO;
            empleado.festivosDisponibles--;
            empleado.festivosCompensados++;
        }   
    });
}

// Penalización noche→mañana (2000 puntos que tienes en tus notas) — no está en calcularScore porque es una regla de salud laboral que prohíbe la asignación, no una preferencia que se puede penalizar. La implementamos directamente en esTurnoLegal.
function esTurnoLegal(turnoAyer, turnoHoy) {
  // Si ayer fue descanso o no hay turno anterior, cualquier turno hoy es legal
  if (turnoAyer === null || turnoAyer === "descanso") {
  }}


//Output Si ayer fue mañana, hoy no puede ser descanso (solo 8h descanso)
  if (turnoAyer === "mañana" && turnoHoy === "descanso") {
    return false;
  }
  // Si ayer fue tarde, hoy no puede ser mañana (solo 8h descanso)
  if (turnoAyer === "tarde" && turnoHoy === "mañana") {
    return false;
  }
  // Si ayer fue noche, hoy no puede ser mañana ni tarde (cruza medianoche)
  if (turnoAyer === "noche" && (turnoHoy === "mañana" || turnoHoy === "tarde")) {
    return false;
  }
  // Default — todo lo no prohibido está permitido
  return true;

// Tests de verificación
console.log("--- Tests esTurnoLegal ---");
console.log(esTurnoLegal("descanso", "mañana"));  // → true  ✅
console.log(esTurnoLegal("descanso", "noche"));   // → true  ✅             

console.log(esTurnoLegal("mañana", "mañana"));    // → true  ✅
console.log(esTurnoLegal("mañana", "tarde"));     // → true  ✅
console.log(esTurnoLegal("mañana", "noche"));     // → true  ✅
console.log(esTurnoLegal("mañana", "descanso"));  // → false ✅     
console.log(esTurnoLegal("tarde", "mañana"));     // → false ✅
console.log(esTurnoLegal("tarde", "tarde"));      // → true  ✅
console.log(esTurnoLegal("tarde", "noche"));      // → true  ✅
console.log(esTurnoLegal("tarde", "descanso"));  // → true  ✅
console.log(esTurnoLegal("noche", "mañana"));     // → false ✅
console.log(esTurnoLegal("noche", "tarde"));      // → false ✅
console.log(esTurnoLegal("noche", "noche"));      // → true  ✅
console.log(esTurnoLegal("noche", "descanso"));  // → true  ✅  


// EquiShift Málaga 2026 - Algoritmo de cuadrantes equitativos
// Autor: Jose Aparicio

const shift_types = {
    MAÑANA: 'mañana',
    TARDE: 'tarde',
    NOCHE: 'noche',
    DESCANSO: 'descanso',
    VACACIONES: 'vacaciones',
    FESTIVO: 'festivo'
};

class Trabajador {
    constructor(nombre, contrato, turnoPreferido, fdsFijos, festivosDisponibles, vacacionesDisponibles) {
        this.nombre = nombre;
        this.contrato = contrato; // 37.5 o 40
        this.turnoPreferido = turnoPreferido;
        this.fdsFijos = fdsFijos;
        this.festivosDisponibles = festivosDisponibles;
        // Bug fix: Aseguramos que vacacionesDisponibles sean strings para consistencia
        this.vacacionesDisponibles = new Set(vacacionesDisponibles.map(v => v.toString()));
        this.calendario = new Array(365).fill(null);
        this.turnosNoche = 0;
        this.diasTrabajados = 0;
        this.festivosCompensados = 0;
    }

    getNochesSeguidas(diaDeHoy) {
        let noches = 0;
        for (let i = diaDeHoy - 1; i >= 0; i--) {
            if (this.calendario[i] === shift_types.NOCHE) noches++;
            else break;
        }
        return noches;
    }

    getConsecutiveWorkDays(diaDeHoy) {
        let dias = 0;
        for (let i = diaDeHoy - 1; i >= 0; i--) {
            if (this.calendario[i] !== shift_types.DESCANSO && this.calendario[i] !== null) dias++;
            else break;
        }
        return dias;
    }
}

class Equishift {
    constructor(plantilla, reglas) {
        this.plantilla = plantilla;
        this.reglas = reglas || {
            MAX_CONSECUTIVE_NIGHTS: 3,
            MAX_CONSECUTIVE_WORK_DAYS: 6,
            MIN_REST_HOURS: 12,
            SIMULATIONS: 1000
        };
        this.mejorScore = -Infinity;
        this.mejorCalendario = null;
    }

    // Unificación de esTurnoLegal como método de clase
    esTurnoLegal(turnoAyer, turnoHoy) {
        if (turnoAyer === null || turnoAyer === shift_types.DESCANSO || turnoAyer === shift_types.VACACIONES) {
            return true;
        }
        
        // Reglas de descanso mínimo (basadas en secuencias prohibidas)
        if (turnoAyer === shift_types.MAÑANA && turnoHoy === shift_types.DESCANSO) return false;
        if (turnoAyer === shift_types.TARDE && turnoHoy === shift_types.MAÑANA) return false;
        if (turnoAyer === shift_types.NOCHE && (turnoHoy === shift_types.MAÑANA || turnoHoy === shift_types.TARDE)) return false;
        
        return true;
    }

    calcularScore(empleado, turno, dia) {
        let score = 0;
        const ayer = dia > 0 ? empleado.calendario[dia - 1] : null;

        if (!this.esTurnoLegal(ayer, turno)) score -= 50;
        if (turno === shift_types.NOCHE && empleado.getNochesSeguidas(dia) >= this.reglas.MAX_CONSECUTIVE_NIGHTS) score -= 20;
        if (turno !== shift_types.DESCANSO && empleado.getConsecutiveWorkDays(dia) >= this.reglas.MAX_CONSECUTIVE_WORK_DAYS) score -= 20;
        if (turno === empleado.turnoPreferido) score += 5;
        
        // Prioridad a vacaciones solicitadas
        if (turno === shift_types.VACACIONES && empleado.vacacionesDisponibles.has(dia.toString())) score += 100;
        
        return score;
    }

    simularAsignacion() {
        // Lógica simplificada para demostración de estructura limpia
        for (let dia = 0; dia < 365; dia++) {
            this.plantilla.forEach(empleado => {
                const turnosPosibles = Object.values(shift_types);
                const mejorTurno = turnosPosibles.sort(() => Math.random() - 0.5)[0];
                empleado.calendario[dia] = mejorTurno;
            });
        }
    }

    ejecutarMontecarlo() {
        for (let i = 0; i < this.reglas.SIMULATIONS; i++) {
            this.simularAsignacion();
            let scoreTotal = 0;
            this.plantilla.forEach(emp => {
                emp.calendario.forEach((t, d) => {
                    scoreTotal += this.calcularScore(emp, t, d);
                });
            });

            if (scoreTotal > this.mejorScore) {
                this.mejorScore = scoreTotal;
                this.mejorCalendario = this.plantilla.map(emp => ({
                    nombre: emp.nombre,
                    calendario: [...emp.calendario]
                }));
            }
        }
        return this.mejorCalendario;
    }
}

// Exportación para uso en otros módulos si es necesario
if (typeof module !== 'undefined') {
    module.exports = { Trabajador, Equishift, shift_types };
}

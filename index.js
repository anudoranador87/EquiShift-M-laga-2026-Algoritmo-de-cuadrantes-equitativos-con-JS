// ============================================
// EQUISHIFT MÁLAGA — Motor v1.2 (UI INTEGRADA)
// Jose Aparicio · Málaga, España · 2026
// ============================================

const config = {
    YEAR: 2026,
    MAX_CONSECUTIVE_NIGHT_SHIFTS: 4,
    MIN_REST_HOURS: 16,
    MAX_CONSECUTIVE_WORK_DAYS: 7,
    SIMULATIONS: 50, // Reducido para mayor fluidez en web
}

const shift_types = {
    MAÑANA: 'M',
    TARDE: 'T',
    NOCHE: 'N',
    DESCANSO: 'L', // Libre
    VACACIONES: 'V',
    FESTIVO: 'F',
}

class Trabajador {
    constructor(nombre, contrato, turnoPreferido) {
        this.nombre = nombre;
        this.contrato = contrato;
        this.turnoPreferido = turnoPreferido;
        this.calendario = new Array(365).fill(null);
        this.diasTrabajados = 0;
        this.diasDescanso = 0;
        this.turnosNoche = 0;
    }

    reset() {
        this.diasTrabajados = 0;
        this.diasDescanso = 0;
        this.turnosNoche = 0;
        this.calendario = new Array(365).fill(null);
    }

    getConsecutiveWorkDays(diaDeHoy) {
        let cuenta = 0;
        for (let i = diaDeHoy - 1; i >= 0; i--) {
            if (this.calendario[i] && this.calendario[i] !== shift_types.DESCANSO) cuenta++;
            else break;
        }
        return cuenta;
    }

    getNochesSeguidas(diaDeHoy) {
        let cuenta = 0;
        for (let i = diaDeHoy - 1; i >= 0; i--) {
            if (this.calendario[i] === shift_types.NOCHE) cuenta++;
            else break;
        }
        return cuenta;
    }
}

class Equishift {
    constructor(plantilla) {
        this.plantilla = plantilla;
        this.mejorScore = -Infinity;
        this.mejorCalendario = null;
        this.dias = this.getDiasDelAño(config.YEAR);
    }

    getDiasDelAño(year) {
        let dias = [];
        let fecha = new Date(year, 0, 1);
        while (fecha.getFullYear() === year) {
            dias.push(new Date(fecha));
            fecha.setDate(fecha.getDate() + 1);
        }
        return dias;
    }

    esTurnoLegal(turnoAyer, turnoHoy) {
        if (!turnoAyer || turnoAyer === shift_types.DESCANSO) return true;
        if (turnoAyer === shift_types.MAÑANA) return true; // M->M, M->T, M->N, M->L son legales
        if (turnoAyer === shift_types.TARDE && turnoHoy === shift_types.MAÑANA) return false; // Solo 8h descanso
        if (turnoAyer === shift_types.NOCHE && (turnoHoy === shift_types.MAÑANA || turnoHoy === shift_types.TARDE)) return false; // Cruza medianoche
        return true;
    }

    calcularScore(empleado, turno, dia) {
        let score = 0;
        if (turno === empleado.turnoPreferido) score += 5;
        if (turno === shift_types.DESCANSO) {
            const fecha = this.dias[dia];
            if (fecha.getDay() === 0 || fecha.getDay() === 6) score += 10; // Bonus por librar FDS
        }
        return score;
    }

    simular() {
        this.plantilla.forEach(e => e.reset());
        for (let dia = 0; dia < this.dias.length; dia++) {
            const turnosDisponibles = [shift_types.MAÑANA, shift_types.TARDE, shift_types.NOCHE, shift_types.DESCANSO, shift_types.DESCANSO];
            
            this.plantilla.forEach(emp => {
                const turno = turnosDisponibles.sort(() => Math.random() - 0.5).find(t => {
                    return this.esTurnoLegal(emp.calendario[dia-1], t) &&
                           (t !== shift_types.NOCHE || emp.getNochesSeguidas(dia) < config.MAX_CONSECUTIVE_NIGHT_SHIFTS) &&
                           (t !== shift_types.DESCANSO || emp.getConsecutiveWorkDays(dia) < config.MAX_CONSECUTIVE_WORK_DAYS);
                }) || shift_types.DESCANSO;
                
                emp.calendario[dia] = turno;
            });
        }
    }

    ejecutar() {
        for (let i = 0; i < config.SIMULATIONS; i++) {
            this.simular();
            let scoreTotal = 0;
            this.plantilla.forEach(e => {
                e.calendario.forEach((t, d) => scoreTotal += this.calcularScore(e, t, d));
            });

            if (scoreTotal > this.mejorScore) {
                this.mejorScore = scoreTotal;
                this.mejorCalendario = this.plantilla.map(e => ({
                    nombre: e.nombre,
                    calendario: [...e.calendario]
                }));
            }
        }
        return this.mejorCalendario;
    }
}

// --- INTEGRACIÓN CON LA UI ---
document.getElementById('run-engine').addEventListener('click', () => {
    const btn = document.getElementById('run-engine');
    const resDiv = document.getElementById('resultado');
    
    btn.innerText = "Generando...";
    btn.disabled = true;

    // Simulamos un pequeño delay para feedback visual
    setTimeout(() => {
        const plantilla = [
            new Trabajador("Jose", "40h", "Mañana"),
            new Trabajador("Maria", "40h", "Tarde"),
            new Trabajador("Pedro", "37.5h", "Mañana"),
            new Trabajador("Ana", "40h", "Noche"),
            new Trabajador("Luis", "37.5h", "Tarde")
        ];

        const motor = new Equishift(plantilla);
        const resultado = motor.ejecutar();
        
        renderizarTabla(resultado, motor.dias);
        
        btn.innerText = "Generar nuevo calendario";
        btn.disabled = false;
    }, 500);
});

function renderizarTabla(datos, dias) {
    const contenedor = document.getElementById('resultado');
    contenedor.innerHTML = "";

    const tabla = document.createElement('table');
    tabla.className = "equishift-table";
    
    // Header (Días)
    const header = tabla.createTHead();
    const rowH = header.insertRow();
    rowH.insertCell().innerText = "Trabajador";
    
    // Solo mostramos el primer mes para la demo visual
    const diasAMostrar = 31; 
    for (let i = 1; i <= diasAMostrar; i++) {
        const cell = rowH.insertCell();
        cell.innerText = i;
        const fecha = dias[i-1];
        if (fecha.getDay() === 0 || fecha.getDay() === 6) cell.classList.add('weekend');
    }

    // Body (Turnos)
    const body = tabla.createTBody();
    datos.forEach(emp => {
        const row = body.insertRow();
        row.insertCell().innerText = emp.nombre;
        for (let i = 0; i < diasAMostrar; i++) {
            const cell = row.insertCell();
            const turno = emp.calendario[i];
            cell.innerText = turno;
            cell.className = `shift-${turno.toLowerCase()}`;
        }
    });

    contenedor.appendChild(tabla);
    
    // Añadir botón de exportación
    const exportBtn = document.createElement('button');
    exportBtn.innerText = "Exportar a PDF (Próximamente)";
    exportBtn.className = "export-btn";
    exportBtn.onclick = () => alert("Esta funcionalidad requiere la librería jspdf, ¡estamos en ello!");
    contenedor.appendChild(exportBtn);
}

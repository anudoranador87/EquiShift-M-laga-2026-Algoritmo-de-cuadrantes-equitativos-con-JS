# ⚙️ EquiShift Málaga 2026

🇬🇧 English · 🇪🇸 [Español](#español)

![Project Status](https://img.shields.io/badge/status-WIP-yellow) ![JavaScript](https://img.shields.io/badge/language-JavaScript-brightgreen)

> *"EquiShift doesn't just organize shifts — it translates a real injustice into a transparent, reliable algorithm."*

---

## Where it started

It wasn't a portfolio idea. It wasn't a project I picked to learn JavaScript.

It was January 2026, when the new shift schedule came out at the hotel where I work.

I looked at it. Did the numbers. And what I saw made no sense.

Diego had 70 free weekends a year. I had 22. Rafa had 17.
The collective agreement says the fair number is 33 per person.
Nobody was doing it wrong on purpose. They were doing it by hand.
And when you do it by hand, you forget. Injustice accumulates without anyone seeing it.

That day I decided I was going to prove it. With numbers first — no code, no programming, just maths and common sense. I wanted to build something I could show my manager before the end of the year, with charts, data and evidence. Something that couldn't be ignored.

### The notebook

On January 18th, 2026, I opened a notebook and wrote:

*"Objective: fair weekends for everyone."*

Below that I wrote the names, the contracts, the real numbers:
Diego 70 · Jose 22 · Salvador 29 · Miguel 26 · Rafa 17.
And a question: *"What is fair? 33 days per person. How to do it is the question."*

At that point I'd been learning to code for less than a month.
I didn't know what an array was. I didn't know what an object was.
But I already had the problem defined with surgical precision.

That notebook exists. It has a date. It has the real data.
It's the most honest document I have about this project.

### Why code entered the picture

A few weeks into learning JavaScript, something clicked.

I thought: what I'm learning can solve exactly this. Not just the calculations — the entire logic. The rotation. The holidays. The minimum rest between shifts. The mathematical fairness that is impossible to guarantee by hand with five people and two different contract types.

That's when EquiShift stopped being a spreadsheet in my head and became a real code project.

---

## What EquiShift does

EquiShift is a shift rotation algorithm for hospitality teams with mixed contract types. It solves three problems simultaneously:

**Weekend fairness** — nobody exceeds 33 free weekend days per year. The person with the fewest free weekends rests first.

**Holiday management** — 14 public holidays in Málaga 2026, national, regional and local. Holidays aren't paid — they're returned as rest days. The algorithm ensures those compensatory days don't fall on weekends, because if they do, the whole team loses out.

**Night shift coverage** — Rafa has a fixed night shift. When he rests, one of the four rotating staff covers his night. That extra effort is tracked to ensure nobody absorbs it more times than the others.

All of this with mixed contracts: three people on 37.5h and two on 40h, with different entitlements under the agreement.

---

## Technical Architecture

The engine is built on two OOP classes and a Monte Carlo simulation loop. This is not a simple rotation wheel — it's a constraint-satisfaction engine that searches for the fairest possible schedule across hundreds of simulated years.

### Class: `Trabajador`

Represents a single employee. Tracks their full year calendar, consecutive work days, consecutive night shifts, holiday balance, and contract type.

```javascript
class Trabajador {
    constructor(nombre, contrato, turnoPreferido, fdsFijos, festivosDisponibles, vacacionesDisponibles) {
        this.calendario = new Array(365).fill(null);
        this.turnosNoche = 0;
        this.diasTrabajados = 0;
        this.diasDescanso = 0;
        this.vacacionesDisponibles = new Set(vacacionesDisponibles);
        // ...
    }

    getNochesSeguidas(diaDeHoy) { /* counts consecutive nights backwards */ }
    getConsecutiveWorkDays(diaDeHoy) { /* counts consecutive work days backwards */ }
}
```

### Class: `Equishift` (engine)

Manages the full 365-day simulation. Key methods:

- `esTurnoLegal(turnoAnterior, turnoActual)` — enforces minimum rest rules between shifts
- `barajarTurnos()` — Fisher-Yates shuffle of shift types for random assignment
- `calcularScore(empleado, turno, dia)` — scores each assignment against fairness rules
- `calcularScoreTotal()` — aggregates scores across all employees and all 365 days
- `simularAsignacion()` — runs one full year simulation
- `ejecutarMontecarlo()` — runs N simulations, keeps the highest-scoring calendar

### Monte Carlo Search

```javascript
ejecutarMontecarlo() {
    for (let i = 0; i < this.reglas.SIMULATIONS; i++) {
        this.simularAsignacion();               // random assignment
        const score = this.calcularScoreTotal(); // evaluate fairness
        if (score > this.mejorScore) {
            this.mejorScore = score;
            this.mejorCalendario = /* deep copy */;
        }
    }
    return this.mejorCalendario; // best schedule found
}
```

### Scoring System

Each assignment is scored against multiple fairness constraints:

| Rule | Penalty |
|------|---------|
| Exceeds max consecutive nights | −10 |
| Exceeds max consecutive work days | −10 |
| Night → non-rest transition | −5 |
| Exceeds annual hour ceiling | −5 |
| Rest ratio below work ratio | −3 |
| Non-preferred shift assigned | −1 |
| Weekend equity violated | ±1 |
| Vacation days still pending | −1 |

---

## Project Status (WIP)

### ✅ Milestones achieved

- **OOP architecture** — `Trabajador` and `Equishift` classes fully structured
- **Monte Carlo engine** — simulation loop with score tracking and best-calendar retention
- **Scoring system** — multi-rule fairness evaluator per assignment per day
- **Legal shift transitions** — `esTurnoLegal()` enforcing rest rules between shift types
- **Fisher-Yates shuffle** — unbiased random shift assignment per simulation
- **Reset mechanism** — full calendar reset between simulations for clean reruns
- **2026 calendar** — full 365-day date array with weekend detection

### ⏳ Known bugs (active WIP)

- **Daily staffing coordinator** — no guarantee that exactly 3 work / 2 rest each day
- **Vacation type mismatch** — `vacacionesDisponibles` Set uses numbers, queried with date strings
- **`esTurnoLegal` duplication** — two versions exist (class method + standalone function), in conflict
- **16h rest rule** — current implementation checks shift sequence, not actual hours between shifts
- **`deudaHistorica` / `festivosCompensados`** — declared but not yet used in scoring
- **Night→morning penalty** — 2000-point penalty defined in spec, not yet in `calcularScore`
- **No output layer** — no function to render or export the final calendar

### 🔜 Next steps (in order)

- [ ] Daily coordinator — guarantee exactly 3 working / 2 resting per day
- [ ] Fix vacation string/number type inconsistency
- [ ] Unify `esTurnoLegal` into single class method with real hour calculation
- [ ] Add missing penalties to scoring system
- [ ] Build output/render function
- [ ] Connect engine to HTML landing page

---

## Project Timeline

```
January 2026    → Idea born from real shift schedule
                  Notebook: "Fair weekends for everyone"
February 2026   → First line of code — data model, worker objects
March 2026      → Architecture upgraded to OOP + Monte Carlo engine
                  Trabajador class · Equishift class · scoring system
April 2026+     → Bug fixes · daily coordinator · visual dashboard
```

---

## Why this is not a tutorial project

This project has real names, real numbers, and a real injustice that still exists.

When EquiShift works with real data in the hotel — with Diego, Salvador, Miguel and Rafa — that will be the moment that makes everything worth it.

---

## Author

**Jose Aparicio** — Front-End Developer in training, Málaga, Spain.

8+ years in hospitality (UK & Spain). At 39, learning to code to solve a problem I've been watching for years.

> *"I didn't know how to code. I learned so I could."*

📧 josemaparicio87@gmail.com
💼 [LinkedIn](https://www.linkedin.com/in/joseaparicio87/)
🐙 [GitHub](https://github.com/anudoranador87)
📓 [Dev Log 365](https://anudoranador87.github.io/Mi-Camino-Web-365/)

---
---

<a id="español"></a>

# ⚙️ EquiShift Málaga 2026

> *"EquiShift no solo organiza turnos — traduce una injusticia real en un algoritmo transparente y confiable."*

---

## Dónde empezó todo

No fue una idea de portfolio. No fue buscando un proyecto para aprender JavaScript.

Fue en enero de 2026, cuando salieron los turnos nuevos del hotel.

Los miré. Hice los números. Y lo que vi no tenía ningún sentido.

Diego libraba 70 fines de semana al año. Yo libraba 22. Rafa, 17.
El convenio dice que lo justo son 33 por persona.
Nadie lo hacía mal a propósito. Lo hacían a mano.
Y a mano se olvida. A mano se acumula la injusticia sin que nadie la vea.

Ese día decidí que iba a demostrarlo. Con números primero — sin código, sin programación, solo matemática y sentido común. Quería construir algo que le pudiera mostrar a mi jefe antes del cierre del año, con gráficos, con datos, con evidencias. Algo que no se pudiera ignorar.

### La libreta

El 18 de enero de 2026 abrí una libreta y escribí:

*"Objetivo: fines de semana justos para todos."*

Debajo puse los nombres, los contratos, los números reales:
Diego 70 · Jose 22 · Salvador 29 · Miguel 26 · Rafa 17.
Y una pregunta: *"¿Qué es lo justo? 33 días por persona. El cómo hacerlo es la cuestión."*

En ese momento llevaba menos de un mes aprendiendo a programar.
No sabía lo que era un array. No sabía lo que era un objeto.
Pero ya tenía el problema definido con precisión quirúrgica.

Esa libreta existe. Tiene fecha. Tiene los datos reales.
Es el documento más honesto que tengo sobre este proyecto.

### Por qué llegó el código

Llevaba unas semanas aprendiendo JavaScript cuando algo hizo clic.

Pensé: lo que estoy aprendiendo puede resolver exactamente esto. No solo los cálculos — la lógica entera. La rotación. Los festivos. Los descansos mínimos entre turnos. La equidad matemática que es imposible garantizar a mano con cinco personas y dos tipos de contrato diferentes.

Ahí EquiShift dejó de ser una hoja de cálculo en mi cabeza y se convirtió en un proyecto de código real.

---

## Qué hace EquiShift

EquiShift es un algoritmo de rotación de turnos para plantillas de hostelería con contratos mixtos. Resuelve tres problemas simultáneamente:

**Equidad en fines de semana** — nadie supera los 33 días libres en fin de semana al año. El que menos lleva, descansa primero.

**Gestión de festivos** — 14 festivos en Málaga 2026, nacionales, autonómicos y locales. Los festivos no se pagan, se devuelven como descanso. El algoritmo garantiza que esos días compensatorios no caigan en fin de semana, porque si caen en fin de semana perjudican al equipo entero.

**Cobertura de noches** — Rafa tiene turno fijo de noche. Cuando descansa, uno de los cuatro rotativos cubre su noche. Ese esfuerzo extra se contabiliza para que nadie lo asuma más veces que los demás.

Todo esto con contratos mixtos: tres personas a 37.50h y dos a 40h, con derechos distintos por convenio.

---

## Arquitectura Técnica

El motor está construido sobre dos clases OOP y un bucle de simulación Monte Carlo. No es una rueda de rotación simple — es un motor de satisfacción de restricciones que busca el calendario más justo posible entre cientos de años simulados.

### Clase: `Trabajador`

Representa a un empleado. Rastrea su calendario anual completo, días consecutivos trabajados, noches consecutivas, saldo de vacaciones y tipo de contrato.

```javascript
class Trabajador {
    constructor(nombre, contrato, turnoPreferido, fdsFijos, festivosDisponibles, vacacionesDisponibles) {
        this.calendario = new Array(365).fill(null);
        this.turnosNoche = 0;
        this.diasTrabajados = 0;
        this.diasDescanso = 0;
        this.vacacionesDisponibles = new Set(vacacionesDisponibles);
        // ...
    }

    getNochesSeguidas(diaDeHoy) { /* cuenta noches consecutivas hacia atrás */ }
    getConsecutiveWorkDays(diaDeHoy) { /* cuenta días trabajados consecutivos hacia atrás */ }
}
```

### Clase: `Equishift` (motor)

Gestiona la simulación completa de 365 días. Métodos clave:

- `esTurnoLegal(turnoAnterior, turnoActual)` — aplica las reglas de descanso mínimo entre turnos
- `barajarTurnos()` — algoritmo Fisher-Yates para asignación aleatoria sin sesgo
- `calcularScore(empleado, turno, dia)` — puntúa cada asignación según reglas de equidad
- `calcularScoreTotal()` — agrega puntuaciones de todos los empleados y los 365 días
- `simularAsignacion()` — ejecuta una simulación completa de un año
- `ejecutarMontecarlo()` — ejecuta N simulaciones, conserva el calendario con mayor puntuación

### Simulación Monte Carlo

```javascript
ejecutarMontecarlo() {
    for (let i = 0; i < this.reglas.SIMULATIONS; i++) {
        this.simularAsignacion();               // asignación aleatoria
        const score = this.calcularScoreTotal(); // evaluar equidad
        if (score > this.mejorScore) {
            this.mejorScore = score;
            this.mejorCalendario = /* copia profunda */;
        }
    }
    return this.mejorCalendario; // mejor calendario encontrado
}
```

### Sistema de Puntuación

Cada asignación se puntúa contra múltiples restricciones de equidad:

| Regla | Penalización |
|-------|-------------|
| Supera máximo de noches consecutivas | −10 |
| Supera máximo de días consecutivos trabajados | −10 |
| Transición noche → no-descanso | −5 |
| Supera techo de horas anuales | −5 |
| Ratio de descanso inferior al de trabajo | −3 |
| Turno no preferido asignado | −1 |
| Equidad de fines de semana violada | ±1 |
| Días de vacaciones pendientes | −1 |

---

## Estado del Proyecto (WIP)

### ✅ Hitos alcanzados

- **Arquitectura OOP** — clases `Trabajador` y `Equishift` completamente estructuradas
- **Motor Monte Carlo** — bucle de simulación con seguimiento de puntuación y retención del mejor calendario
- **Sistema de puntuación** — evaluador de equidad multi-regla por asignación por día
- **Transiciones legales de turno** — `esTurnoLegal()` aplicando reglas de descanso entre turnos
- **Algoritmo Fisher-Yates** — asignación aleatoria sin sesgo por simulación
- **Mecanismo de reset** — reinicio completo del calendario entre simulaciones
- **Calendario 2026** — array de 365 fechas completo con detección de fines de semana

### ⏳ Bugs conocidos (WIP activo)

- **Coordinador diario** — no hay garantía de que exactamente 3 trabajen / 2 descansen cada día
- **Incompatibilidad de tipos en vacaciones** — el Set usa números, se consulta con strings de fecha
- **Duplicación de `esTurnoLegal`** — existen dos versiones en conflicto (método de clase + función suelta)
- **Regla de 16h de descanso** — la implementación actual verifica secuencia de turnos, no horas reales
- **`deudaHistorica` / `festivosCompensados`** — declarados pero no usados en la puntuación
- **Penalización noche→mañana** — penalización definida en spec, pendiente en `calcularScore`
- **Sin capa de output** — no hay función para renderizar o exportar el calendario final

### 🔜 Próximos pasos (en orden)

- [ ] Coordinador diario — garantizar exactamente 3 trabajando / 2 descansando por día
- [ ] Corregir incompatibilidad de tipos en vacaciones
- [ ] Unificar `esTurnoLegal` en único método de clase con cálculo de horas reales
- [ ] Añadir penalizaciones pendientes al sistema de puntuación
- [ ] Construir función de output/renderizado
- [ ] Conectar motor con landing page HTML

---

## Timeline del proyecto

```
Enero 2026      → Idea nace de los turnos reales del hotel
                  Libreta: "Fines de semana justos para todos"
Febrero 2026    → Primera línea de código — modelo de datos, objetos trabajador
Marzo 2026      → Arquitectura elevada a OOP + motor Monte Carlo
                  Clase Trabajador · Clase Equishift · sistema de puntuación
Abril 2026+     → Corrección de bugs · coordinador diario · dashboard visual
```

---

## Por qué esto no es un proyecto de tutorial

Este proyecto tiene nombres reales, números reales y una injusticia real que sigue existiendo.

Cuando EquiShift funcione con los datos reales del hotel — con Diego, Salvador, Miguel y Rafa — ese será el momento que haga que todo valga la pena.

---

## Autor

**Jose Aparicio** — Desarrollador Front-End en formación, Málaga.

Más de 8 años en hostelería (UK y España). A los 39 años, aprendiendo a programar para resolver un problema que llevo años viendo.

> *"No sabía programar. Aprendí para poder hacerlo."*

📧 josemaparicio87@gmail.com
💼 [LinkedIn](https://www.linkedin.com/in/joseaparicio87/)
🐙 [GitHub](https://github.com/anudoranador87)
📓 [Dev Log 365](https://anudoranador87.github.io/Mi-Camino-Web-365/)
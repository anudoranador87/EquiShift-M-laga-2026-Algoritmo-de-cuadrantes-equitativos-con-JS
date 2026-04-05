# ⚙️ EquiShift Málaga 2026

🇪🇸 [Español](#español) · 🇬🇧 [English](#english)

![Status](https://img.shields.io/badge/estado-WIP%20activo-orange) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow) ![OOP](https://img.shields.io/badge/arquitectura-OOP%20%2B%20Monte%20Carlo-blue)

> *"EquiShift no solo organiza turnos — traduce una injusticia real en un algoritmo transparente y confiable."*

---

## Español

### Dónde empezó todo

No fue una idea de portfolio. No fue buscando un proyecto para aprender JavaScript.

Fue en enero de 2026, cuando salieron los turnos nuevos del hotel.

Los miré. Hice los números. Y lo que vi no tenía ningún sentido.

| Empleado | Fines de semana libres | Lo justo (convenio) |
|---|---|---|
| Diego | 70 | 33 |
| Jose | 22 | 33 |
| Salvador | 29 | 33 |
| Miguel | 26 | 33 |
| Rafa | 17 | 33 |

Nadie lo hacía mal a propósito. Lo hacían a mano. Y a mano se olvida. A mano se acumula la injusticia sin que nadie la vea.

Ese día decidí que iba a demostrarlo. Con números primero — sin código, sin programación, solo matemática y sentido común.

**La libreta existe. Tiene fecha: 18 de enero de 2026. Tiene los datos reales.**

Unas semanas después, aprendiendo JavaScript, algo hizo clic: lo que estaba aprendiendo podía resolver exactamente esto. No solo los cálculos — la lógica entera. La rotación. Los festivos. Los descansos mínimos entre turnos. La equidad matemática que es imposible garantizar a mano.

Ahí EquiShift dejó de ser una hoja de cálculo en mi cabeza y se convirtió en un proyecto de código real.

---

### Qué hace EquiShift

Algoritmo de rotación de turnos para plantillas de hostelería con contratos mixtos. Resuelve tres problemas simultáneamente:

**Equidad en fines de semana** — nadie supera los 33 días libres en fin de semana al año. El que menos lleva, descansa primero.

**Gestión de festivos** — 14 festivos en Málaga 2026, nacionales, autonómicos y locales. Los festivos no se pagan, se devuelven como descanso. El algoritmo garantiza que esos días compensatorios no caigan en fin de semana — si caen en fin de semana, perjudican al equipo entero.

**Cobertura de noches** — Rafa tiene turno fijo de noche. Cuando descansa, uno de los cuatro rotativos cubre su noche. Ese esfuerzo extra se contabiliza para que nadie lo asuma más veces que los demás.

Todo esto con contratos mixtos: tres personas a 37,5h y dos a 40h, con derechos distintos por convenio.

---

### Clonar y ejecutar

```bash
git clone https://github.com/anudoranador87/EquiShift-M-laga-2026-Algoritmo-de-cuadrantes-equitativos-con-JS.git
cd EquiShift-M-laga-2026-Algoritmo-de-cuadrantes-equitativos-con-JS
open index.html
```

Sin npm. Sin dependencias. JavaScript vanilla puro.

---

### Arquitectura técnica

El motor está construido sobre dos clases OOP y un bucle de simulación Monte Carlo. No es una rueda de rotación simple — es un motor de satisfacción de restricciones que busca el calendario más justo posible entre cientos de años simulados.

#### Clase `Trabajador`

Representa a un empleado. Rastrea su calendario anual completo, días consecutivos trabajados, noches consecutivas, saldo de vacaciones y tipo de contrato.

```javascript
class Trabajador {
  constructor(nombre, contrato, turnoPreferido, fdsFijos,
              festivosDisponibles, vacacionesDisponibles) {
    this.calendario = new Array(365).fill(null);
    this.turnosNoche = 0;
    this.diasTrabajados = 0;
    this.diasDescanso = 0;
    this.vacacionesDisponibles = new Set(vacacionesDisponibles);
    // ...
  }

  getNochesSeguidas(diaDeHoy)       { /* cuenta noches consecutivas hacia atrás */ }
  getConsecutiveWorkDays(diaDeHoy)  { /* cuenta días trabajados consecutivos hacia atrás */ }
}
```

#### Clase `Equishift` — el motor

Gestiona la simulación completa de 365 días.

| Método | Qué hace |
|---|---|
| `esTurnoLegal(anterior, actual)` | Aplica reglas de descanso mínimo entre turnos |
| `barajarTurnos()` | Fisher-Yates — asignación aleatoria sin sesgo |
| `calcularScore(empleado, turno, dia)` | Puntúa cada asignación según reglas de equidad |
| `calcularScoreTotal()` | Agrega puntuaciones de todos los empleados y los 365 días |
| `simularAsignacion()` | Ejecuta una simulación completa de un año |
| `ejecutarMontecarlo()` | Ejecuta N simulaciones, conserva el mejor calendario |

#### Simulación Monte Carlo

```javascript
ejecutarMontecarlo() {
  for (let i = 0; i < this.reglas.SIMULATIONS; i++) {
    this.simularAsignacion();                // asignación aleatoria
    const score = this.calcularScoreTotal(); // evaluar equidad
    if (score > this.mejorScore) {
      this.mejorScore = score;
      this.mejorCalendario = /* copia profunda */;
    }
  }
  return this.mejorCalendario; // mejor calendario encontrado
}
```

#### Sistema de puntuación

Cada asignación se puntúa contra múltiples restricciones de equidad:

| Regla | Penalización |
|---|---|
| Supera máximo de noches consecutivas | −10 |
| Supera máximo de días consecutivos trabajados | −10 |
| Transición noche → no-descanso | −5 |
| Supera techo de horas anuales | −5 |
| Ratio de descanso inferior al de trabajo | −3 |
| Turno no preferido asignado | −1 |
| Equidad de fines de semana violada | ±1 |
| Días de vacaciones pendientes | −1 |

---

### Estado del proyecto

#### ✅ Hitos alcanzados

- Arquitectura OOP — clases `Trabajador` y `Equishift` completamente estructuradas
- Motor Monte Carlo — bucle de simulación con seguimiento de puntuación y retención del mejor calendario
- Sistema de puntuación — evaluador de equidad multi-regla por asignación por día
- Transiciones legales de turno — `esTurnoLegal()` aplicando reglas de descanso entre turnos
- Algoritmo Fisher-Yates — asignación aleatoria sin sesgo por simulación
- Mecanismo de reset — reinicio completo del calendario entre simulaciones
- Calendario 2026 — array de 365 fechas completo con detección de fines de semana

#### ⏳ Bugs conocidos (WIP activo)

- **Coordinador diario** — no hay garantía de que exactamente 3 trabajen / 2 descansen cada día
- **Incompatibilidad de tipos en vacaciones** — el `Set` usa números, se consulta con strings de fecha
- **Duplicación de `esTurnoLegal`** — existen dos versiones en conflicto: método de clase y función suelta
- **Regla de 16h de descanso** — la implementación actual verifica secuencia de turnos, no horas reales
- **`deudaHistorica` / `festivosCompensados`** — declarados pero no usados en la puntuación
- **Penalización noche→mañana** — definida en spec, pendiente de añadir a `calcularScore`
- **Sin capa de output** — no hay función para renderizar o exportar el calendario final

#### 🔜 Próximos pasos (en orden)

- [ ] Coordinador diario — garantizar exactamente 3 trabajando / 2 descansando por día
- [ ] Corregir incompatibilidad de tipos en vacaciones (`string` vs `number`)
- [ ] Unificar `esTurnoLegal` en único método de clase con cálculo de horas reales
- [ ] Añadir penalizaciones pendientes al sistema de puntuación
- [ ] Construir función de output / renderizado
- [ ] Conectar motor con landing page HTML

---

### Timeline

```
Enero 2026    → Idea nace de los turnos reales del hotel
                Libreta: "Fines de semana justos para todos"
                Datos reales: Diego 70 · Jose 22 · Salvador 29 · Miguel 26 · Rafa 17

Febrero 2026  → Primera línea de código
                Modelo de datos, objetos trabajador

Marzo 2026    → Arquitectura elevada a OOP + motor Monte Carlo
                Clase Trabajador · Clase Equishift · sistema de puntuación

Abril 2026+   → Corrección de bugs · coordinador diario · dashboard visual
```

---

### Por qué esto no es un proyecto de tutorial

Este proyecto tiene nombres reales, números reales y una injusticia real que sigue existiendo.

Cuando EquiShift funcione con los datos reales del hotel — con Diego, Salvador, Miguel y Rafa — ese será el momento que haga que todo valga la pena.

---

### Autor

Jose Aparicio — Desarrollador Front-End en formación, Málaga.

Más de 8 años en hostelería (UK y España). A los 39 años, aprendiendo a programar para resolver un problema que llevo años viendo.

> *"No sabía programar. Aprendí para poder hacerlo."*

📧 josemaparicio87@gmail.com · [LinkedIn](https://www.linkedin.com/in/joseaparicio87/) · [GitHub](https://github.com/anudoranador87) · [Dev Log 365](https://anudoranador87.github.io/Mi-Camino-Web-365/)

---

## English

### Where it started

Not a portfolio idea. Not a project picked to learn JavaScript.

It was January 2026, when the new shift schedule came out at the hotel where I work.

I looked at it. Did the numbers. And what I saw made no sense.

| Employee | Free weekends | Fair amount (agreement) |
|---|---|---|
| Diego | 70 | 33 |
| Jose | 22 | 33 |
| Salvador | 29 | 33 |
| Miguel | 26 | 33 |
| Rafa | 17 | 33 |

Nobody was doing it wrong on purpose. They were doing it by hand. And when you do it by hand, you forget. Injustice accumulates without anyone seeing it.

That day I decided I was going to prove it. With numbers first — no code, no programming, just maths and common sense.

**The notebook exists. Dated: January 18th, 2026. With the real data.**

A few weeks into learning JavaScript, something clicked: what I was learning could solve exactly this. Not just the calculations — the entire logic. The rotation. The holidays. The minimum rest between shifts. The mathematical fairness that is impossible to guarantee by hand.

That's when EquiShift stopped being a spreadsheet in my head and became a real code project.

---

### What EquiShift does

A shift rotation algorithm for hospitality teams with mixed contract types. It solves three problems simultaneously:

**Weekend fairness** — nobody exceeds 33 free weekend days per year. The person with the fewest free weekends rests first.

**Holiday management** — 14 public holidays in Málaga 2026, national, regional and local. Holidays aren't paid — they're returned as rest days. The algorithm ensures those compensatory days don't fall on weekends, because if they do, the whole team loses out.

**Night shift coverage** — Rafa has a fixed night shift. When he rests, one of the four rotating staff covers his night. That extra effort is tracked to ensure nobody absorbs it more times than the others.

All of this with mixed contracts: three people on 37.5h and two on 40h, with different entitlements under the agreement.

---

### Clone and run

```bash
git clone https://github.com/anudoranador87/EquiShift-M-laga-2026-Algoritmo-de-cuadrantes-equitativos-con-JS.git
cd EquiShift-M-laga-2026-Algoritmo-de-cuadrantes-equitativos-con-JS
open index.html
```

No npm. No dependencies. Pure vanilla JavaScript.

---

### Technical architecture

The engine is built on two OOP classes and a Monte Carlo simulation loop. This is not a simple rotation wheel — it's a constraint-satisfaction engine that searches for the fairest possible schedule across hundreds of simulated years.

#### Class `Trabajador`

Represents a single employee. Tracks their full year calendar, consecutive work days, consecutive night shifts, holiday balance, and contract type.

```javascript
class Trabajador {
  constructor(nombre, contrato, turnoPreferido, fdsFijos,
              festivosDisponibles, vacacionesDisponibles) {
    this.calendario = new Array(365).fill(null);
    this.turnosNoche = 0;
    this.diasTrabajados = 0;
    this.diasDescanso = 0;
    this.vacacionesDisponibles = new Set(vacacionesDisponibles);
    // ...
  }

  getNochesSeguidas(diaDeHoy)       { /* counts consecutive nights backwards */ }
  getConsecutiveWorkDays(diaDeHoy)  { /* counts consecutive work days backwards */ }
}
```

#### Class `Equishift` — the engine

Manages the full 365-day simulation.

| Method | What it does |
|---|---|
| `esTurnoLegal(anterior, actual)` | Enforces minimum rest rules between shifts |
| `barajarTurnos()` | Fisher-Yates — unbiased random shift assignment |
| `calcularScore(empleado, turno, dia)` | Scores each assignment against fairness rules |
| `calcularScoreTotal()` | Aggregates scores across all employees and all 365 days |
| `simularAsignacion()` | Runs one full year simulation |
| `ejecutarMontecarlo()` | Runs N simulations, keeps the highest-scoring calendar |

#### Monte Carlo simulation

```javascript
ejecutarMontecarlo() {
  for (let i = 0; i < this.reglas.SIMULATIONS; i++) {
    this.simularAsignacion();                // random assignment
    const score = this.calcularScoreTotal(); // evaluate fairness
    if (score > this.mejorScore) {
      this.mejorScore = score;
      this.mejorCalendario = /* deep copy */;
    }
  }
  return this.mejorCalendario; // best schedule found
}
```

#### Scoring system

Each assignment is scored against multiple fairness constraints:

| Rule | Penalty |
|---|---|
| Exceeds max consecutive nights | −10 |
| Exceeds max consecutive work days | −10 |
| Night → non-rest transition | −5 |
| Exceeds annual hour ceiling | −5 |
| Rest ratio below work ratio | −3 |
| Non-preferred shift assigned | −1 |
| Weekend equity violated | ±1 |
| Vacation days still pending | −1 |

---

### Project status

#### ✅ Milestones achieved

- OOP architecture — `Trabajador` and `Equishift` classes fully structured
- Monte Carlo engine — simulation loop with score tracking and best-calendar retention
- Scoring system — multi-rule fairness evaluator per assignment per day
- Legal shift transitions — `esTurnoLegal()` enforcing rest rules between shift types
- Fisher-Yates shuffle — unbiased random shift assignment per simulation
- Reset mechanism — full calendar reset between simulations for clean reruns
- 2026 calendar — full 365-day date array with weekend detection

#### ⏳ Known bugs (active WIP)

- **Daily staffing coordinator** — no guarantee that exactly 3 work / 2 rest each day
- **Vacation type mismatch** — `vacacionesDisponibles` Set uses numbers, queried with date strings
- **`esTurnoLegal` duplication** — two versions exist (class method + standalone function), in conflict
- **16h rest rule** — current implementation checks shift sequence, not actual hours between shifts
- **`deudaHistorica` / `festivosCompensados`** — declared but not yet used in scoring
- **Night→morning penalty** — defined in spec, not yet added to `calcularScore`
- **No output layer** — no function to render or export the final calendar

#### 🔜 Next steps (in order)

- [ ] Daily coordinator — guarantee exactly 3 working / 2 resting per day
- [ ] Fix vacation string/number type inconsistency
- [ ] Unify `esTurnoLegal` into single class method with real hour calculation
- [ ] Add missing penalties to scoring system
- [ ] Build output/render function
- [ ] Connect engine to HTML landing page

---

### Timeline

```
January 2026   → Idea born from real shift schedule
                 Notebook: "Fair weekends for everyone"
                 Real data: Diego 70 · Jose 22 · Salvador 29 · Miguel 26 · Rafa 17

February 2026  → First line of code
                 Data model, worker objects

March 2026     → Architecture upgraded to OOP + Monte Carlo engine
                 Trabajador class · Equishift class · scoring system

April 2026+    → Bug fixes · daily coordinator · visual dashboard
```

---

### Why this is not a tutorial project

This project has real names, real numbers, and a real injustice that still exists.

When EquiShift works with real data in the hotel — with Diego, Salvador, Miguel and Rafa — that will be the moment that makes everything worth it.

---

### Author

Jose Aparicio — Front-End Developer in training, Málaga, Spain.

8+ years in hospitality (UK & Spain). At 39, learning to code to solve a problem I've been watching for years.

> *"I didn't know how to code. I learned so I could."*

📧 josemaparicio87@gmail.com · [LinkedIn](https://www.linkedin.com/in/joseaparicio87/) · [GitHub](https://github.com/anudoranador87) · [Dev Log 365](https://anudoranador87.github.io/Mi-Camino-Web-365/)

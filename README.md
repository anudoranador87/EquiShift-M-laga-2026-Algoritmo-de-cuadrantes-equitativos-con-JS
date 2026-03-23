# ⚙️ EquiShift Málaga 2026

🇬🇧 English · 🇪🇸 [Español](#español)

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

## Technical Challenges & Business Logic

The core of this project isn't simply assigning "Morning" or "Afternoon" — it's solving complex constraints with code:

- **Modular Rotation (%):** A predictable and fair shift wheel for any team size
- **Localization & Holidays (L10n):** Official Andalusia & Málaga 2026 calendar, including transferred holidays and local events
- **Individual Balance Management:** Dynamic tracking of days off per employee based on contract type and available balance

---

## Project Status (WIP)

EquiShift is currently in the **architecture and logic engine phase**. The priority is a solid data structure before building any visual interface.

### ✅ Milestones achieved

- **Data modelling** — employee objects with contract metadata and day balance tracking
- **2026 Holiday Dataset** — national, regional (Andalusia) and local (Málaga) holidays integrated
- **Contract Classification Engine** — `filter()` logic separating 37.5h and 40h workers into independent rotation groups
- **Night Shift Tracking** — `turnosNoche` property added to rotating workers
- **Weekend Detection Engine** — 365-day loop with modular arithmetic (`% 7`) — validated: 104 weekends in 2026 ✅

### ⏳ Next steps

- [ ] Shift assignment inside the 365-day loop with fair rotation among the 4 rotating workers
- [ ] Hour compensator for 37.5h contracts
- [ ] Vacation algorithm — equitable distribution of 28-day holiday blocks
- [ ] Visual dashboard — responsive web interface with charts and evidence

---

## Contract Classification Engine

```javascript
// STEP 1 — Classify by contract type
const jornada375 = trabajadores.filter(function(trabajador) {
    return trabajador.contrato === 37.50;
});
// → Jose María, Salvador, Miguel (13 festivos)

const jornada40 = trabajadores.filter(function(trabajador) {
    return trabajador.contrato === 40;
});
// → Diego, Rafa (14 festivos)
```

**Why filter by `contrato` and not by `festivosDisponibles`?**
Holiday entitlements can change by law. The contract type is the stable anchor — always filter by the most stable data point.

---

## Weekend Detection Engine

```javascript
// January 1st 2026 is Thursday — anchor point
// i % 7 gives position in the week:
//   remainder 3 = Saturday  ← weekend
//   remainder 4 = Sunday    ← weekend

let findeSemana = 0;

for (let i = 1; i <= 365; i++) {
  if (i % 7 === 3 || i % 7 === 4) {
    findeSemana += 1;
  }
}

console.log(findeSemana); // → 104 ✅
```

---

## Conceptual Dashboard

| Day | Employee 1 | Employee 2 | Employee 3 | Employee 4 | Employee 5 |
|-----|-----------|-----------|-----------|-----------|-----------|
| 01/01 | Morning | Afternoon | Day Off | Morning | Night |
| 02/01 | Afternoon | Day Off | Morning | Afternoon | Night |
| 03/01 | Day Off | Morning | Afternoon | Day Off | Night |

---

## Why this is not a tutorial project

This project has real names, real numbers, and a real injustice that still exists.

When EquiShift works with real data in the hotel — with Diego, Salvador, Miguel and Rafa — that will be the moment that makes everything worth it.

---

## Project timeline

```
January 2026    → Idea born from real shift schedule
                  Notebook: "Fair weekends for everyone"
February 2026   → First line of code — data model, workers array
March 2026      → Engine validated — 104 weekends confirmed ✅
April 2026+     → Shift assignment, visual dashboard
```

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

## Estado del Proyecto (WIP)

### ✅ Hitos alcanzados

- **Modelado de datos** — objetos de empleados con metadatos de contrato y saldo de días
- **Dataset festivos 2026** — nacionales, autonómicos (Andalucía) y locales (Málaga)
- **Motor de clasificación por contrato** — `filter()` separando 37.50h y 40h
- **Control de noches** — propiedad `turnosNoche` en los 4 rotativos
- **Motor de fines de semana** — bucle 365 días con `% 7` — validado: 104 fines de semana ✅

### ⏳ Próximos pasos

- [ ] Asignación de turnos dentro del bucle de 365 días
- [ ] Compensador de horas para contratos de 37.50h
- [ ] Algoritmo de vacaciones — distribución equitativa de 28 días
- [ ] Dashboard visual — interfaz responsive con gráficos y evidencias

---

## Timeline del proyecto

```
Enero 2026      → Idea nace de los turnos reales del hotel
                  Libreta: "Fines de semana justos para todos"
Febrero 2026    → Primera línea de código — modelo de datos
Marzo 2026      → Motor validado — 104 fines de semana ✅
Abril 2026+     → Asignación de turnos, dashboard visual
```

---

## Autor

**Jose Aparicio** — Desarrollador Front-End en formación, Málaga.

Más de 8 años en hostelería (UK y España). A los 39 años, aprendiendo a programar para resolver un problema que llevo años viendo.

> *"No sabía programar. Aprendí para poder hacerlo."*

📧 josemaparicio87@gmail.com
💼 [LinkedIn](https://www.linkedin.com/in/joseaparicio87/)
🐙 [GitHub](https://github.com/anudoranador87)
📓 [Dev Log 365](https://anudoranador87.github.io/Mi-Camino-Web-365/)
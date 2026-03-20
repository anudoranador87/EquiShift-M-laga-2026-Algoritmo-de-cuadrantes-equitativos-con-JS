# ⚙️ EquiShift Málaga 2026

🇬🇧 English · 🇪🇸 Español

---

## ⚙️ EquiShift Málaga 2026
**Fair Shift Management Algorithm for Multi-Contract Teams**

> "EquiShift doesn't just organize shifts — it translates complex labor law into a transparent, reliable algorithm."

EquiShift is an intelligent shift management solution designed to eliminate human error, guarantee equitable rest distribution, and strictly comply with labor regulations in Málaga, Andalusia.

---

## 📝 Motivation & Purpose

Manual shift management fails in two critical areas:

- **Rest inequity:** Nearly impossible to ensure all employees receive the same number of free weekends per year
- **Contractual complexity:** Coordinating 40h and 37.5h contracts generates holiday mismatches and "hour debt"

The injustice was documented before the first line of code: one employee covered 17 extra days in a year. Another covered 0. Same team. Same contract. No system to prevent it.

EquiShift automates shift assignment through a fair-load algorithm, respecting individual rights and local labor legislation.

---

## 🛠️ Technical Challenges & Business Logic

The core of this project isn't simply assigning "Morning" or "Afternoon" — it's solving complex constraints with code:

- **Legal Rest Validation:** No worker can be assigned a shift that violates the minimum legal rest period between shifts
- **Real-time Load Balancing:** Extra shifts are assigned to whoever has covered the least — preventing accumulation
- **Modular Rotation (%):** A predictable and fair shift wheel for any team size
- **Localization & Holidays (L10n):** Official Andalusia & Málaga 2026 calendar, including transferred holidays and local events
- **Individual Balance Management:** Dynamic tracking of days off per employee based on contract type and available balance
- **Vacation Conflict Rule:** If a colleague is on holiday, no other worker can use a public holiday that day

---

## 🏗️ Project Status (WIP)

EquiShift is currently in the **logic engine phase**. The priority is a solid, tested data structure before building any visual interface.

### ✅ Milestones Achieved

- **Data Modelling:** Employee objects with contract metadata, day balance tracking, vacation arrays, holiday arrays and shift history
- **2026 Holiday Dataset:** National, regional (Andalusia) and local (Málaga) holidays integrated
- **Date Engine Base:** Capable of iterating 365 days with automatic weekend detection — **104 weekends validated ✅**
- **Contract Classification Engine:** `filter()` logic separating 37.5h and 40h workers into independent rotation groups
- **Legal Shift Validator — `esTurnoLegal()` v2:** Validates three hard rules before any shift is assigned:
  1. Worker already has a shift today → `false`
  2. Worked night yesterday → `false` (no morning or afternoon next day)
  3. Worked afternoon yesterday → `false` if morning today
  — **9/9 tests passing ✅**
- **Fair Load Assigner — `menosAfectado`:** Uses `reduce()` to find the worker with the least accumulated extra days — prevents the 17 vs 0 imbalance from recurring
- **Vacation tracking:** Each worker now has `vacaciones: []` and `festivos: []` arrays — ready for the 365-day loop

### ⏳ Next Steps

- [ ] **365-day loop:** Connect `esTurnoLegal()` + `menosAfectado` + `includes()` to assign night cover when Rafa is on holiday
- [ ] **Night cover logic:** Assign to whoever has the fewest `turnosNoche` and can legally work
- [ ] **Vacation Algorithm:** Equitable distribution of 28-day holiday blocks with conflict detection
- [ ] **Visual Dashboard:** Responsive web interface using CSS Grid for annual schedule display

---

## 🚀 How It Works

For each day in the 365-day loop, the system:

1. **Checks** if Rafa (fixed night shift) is on holiday or rest → `rafa.vacaciones.includes(fechaHoy)`
2. **Filters** eligible candidates from 37.5h workers → `esTurnoLegal(turnoAyer, turnoHoy, turnoYaAsignado)`
3. **Selects** the least affected worker → `reduce()` comparing `turnosNoche`
4. **Assigns** the shift and increments their `turnosNoche` counter
5. **Updates** `turnoAnterior` for next day's legal validation

---

## ⚖️ Contract Classification Engine

```javascript
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

## 🔒 Legal Shift Validator — `esTurnoLegal()`

Three hard rules. In order. No exceptions.

```javascript
const esTurnoLegal = function(turnoAyer, turnoHoy, turnoYaAsignado) {
  if (turnoYaAsignado) {
    return false; // can't have two shifts in one day
  }
  if (turnoAyer === "noche") {
    return false; // night → no morning or afternoon next day
  }
  else if (turnoAyer === "tarde") {
    if (turnoHoy === "mañana") {
      return false; // afternoon → no morning next day
    }
    return true;
  }
  return true;
};
```

**9/9 tests passing:**
```
esTurnoLegal("noche",  "mañana", null)    → false ✅
esTurnoLegal("noche",  "tarde",  null)    → false ✅
esTurnoLegal("tarde",  "mañana", null)    → false ✅
esTurnoLegal("tarde",  "tarde",  null)    → true  ✅
esTurnoLegal("mañana", "noche",  null)    → true  ✅
esTurnoLegal("libre",  "mañana", null)    → true  ✅
esTurnoLegal("mañana", "noche",  "mañana")→ false ✅
esTurnoLegal("libre",  "noche",  "tarde") → false ✅
esTurnoLegal("libre",  "noche",  null)    → true  ✅
```

---

## ⚖️ Fair Load Assigner — `menosAfectado`

Assigns the next extra shift to whoever has covered the least. Not whoever is free — whoever has paid the least so far.

```javascript
const asignado = jornada375.reduce(function(menosAfectado, actual) {
  if (actual.diasExtraCubiertos < menosAfectado.diasExtraCubiertos) {
    return actual;
  } else {
    return menosAfectado;
  }
});

// Simulating real documented situation:
// Jose María: 17 extra days · Salvador: 6 · Miguel: 0
// → Turno asignado a: Miguel ✅
```

---

## 💡 Key Features

- ⚖️ **Mathematical Fairness:** Distribution based on accumulated load, not availability
- 🔒 **Legal Compliance:** Hard rules validated before every single assignment
- 🤖 **Full Automation:** Replaces manual planning, eliminating human error and labor conflicts
- 📈 **Scalable:** Compatible with any team size and mixed contract types
- 🖥️ **Visualization-Ready:** Structured data ready to integrate an interactive dashboard

---

## 🏆 Value Proposition

This is not a tutorial project. It solves a real operational problem from my workplace — where manual shift management caused one employee to cover 17 extra days while another covered 0. Same team. Same contract. No one noticed because no one was counting.

It demonstrates:

- Advanced JS logic (`reduce()`, `filter()`, `includes()`, nested conditionals)
- Real business rules translated into tested functions
- Architectural thinking before UI implementation
- Domain expertise applied directly to code decisions

---

## 👨‍💻 Author

**Jose María Aparicio** — Web developer in training, focused on operational efficiency, logical architecture, and solving real human problems through software.

> "Logic is my superpower. Syntax is just the tool."

📧 josemaparicio87@gmail.com · 💼 [LinkedIn](https://www.linkedin.com/in/joseaparicio87/) · 🐙 [GitHub](https://github.com/anudoranador87)

---
---

# ⚙️ EquiShift Málaga 2026
**Algoritmo de Gestión de Turnos Equitativos para Plantillas Multicontrato**

> "EquiShift no solo organiza turnos; traduce reglas complejas en un sistema transparente y confiable."

---

## 📝 Motivación y Propósito

La gestión manual de turnos falla en dos áreas críticas:

- **Inequidad en los descansos:** Casi imposible asegurar que todos los empleados tengan los mismos fines de semana libres al año
- **Complejidad contractual:** Coordinar jornadas de 40h y 37.5h puede generar desajustes en festivos y "deudas de horas"

La injusticia estaba documentada antes de la primera línea de código: un empleado cubrió 17 días extra en un año. Otro cubrió 0. Mismo equipo. Mismo contrato. Sin sistema que lo evitara.

---

## 🏗️ Estado del Proyecto (WIP)

### ✅ Hitos Alcanzados

- **Modelado de Datos:** Objetos de empleados con metadatos de contrato, saldo de días, arrays de vacaciones, festivos e historial de turnos
- **Dataset de Festivos 2026:** Nacionales, autonómicos (Andalucía) y locales (Málaga)
- **Base del Motor de Fechas:** 365 días iterables con detección automática de fines de semana — **104 fines de semana validados ✅**
- **Motor de Clasificación por Contrato:** `filter()` separando 37.5h y 40h en grupos independientes
- **Validador Legal — `esTurnoLegal()` v2:** Tres reglas duras en orden. **9/9 tests pasados ✅**
- **Asignador Justo — `menosAfectado`:** `reduce()` que encuentra al trabajador con menos carga acumulada — evita el desajuste 17 vs 0
- **Seguimiento de vacaciones:** Cada trabajador tiene `vacaciones: []` y `festivos: []` — listo para el bucle de 365 días

### ⏳ Próximos Pasos

- [ ] **Bucle de 365 días:** Conectar `esTurnoLegal()` + `menosAfectado` + `includes()` para cubrir noches cuando Rafa descansa
- [ ] **Lógica de cobertura de noches:** Asignar al que menos `turnosNoche` acumule y pueda trabajar legalmente
- [ ] **Algoritmo de Vacaciones:** Distribución equitativa con detección de conflictos
- [ ] **Dashboard Visual:** Interfaz web responsive con CSS Grid

---

## 🔒 Validador Legal — `esTurnoLegal()`

Tres reglas duras. En orden. Sin excepciones.

```javascript
const esTurnoLegal = function(turnoAyer, turnoHoy, turnoYaAsignado) {
  if (turnoYaAsignado) {
    return false; // no se pueden poner dos turnos en un día
  }
  if (turnoAyer === "noche") {
    return false; // tras noche: no mañana ni tarde
  }
  else if (turnoAyer === "tarde") {
    if (turnoHoy === "mañana") {
      return false; // tras tarde: no mañana
    }
    return true;
  }
  return true;
};
```

---

## ⚖️ Asignador Justo — `menosAfectado`

El turno extra se asigna al que menos ha cubierto hasta ese momento. No al que está libre — al que menos ha pagado.

```javascript
const asignado = jornada375.reduce(function(menosAfectado, actual) {
  if (actual.diasExtraCubiertos < menosAfectado.diasExtraCubiertos) {
    return actual;
  } else {
    return menosAfectado;
  }
});
// Jose María: 17 días · Salvador: 6 · Miguel: 0
// → Turno asignado a: Miguel ✅
```

---

## 👨‍💻 Autor

**Jose María Aparicio** — Desarrollador web en aprendizaje, enfocado en eficiencia operativa, arquitectura lógica y resolución de problemas reales mediante software.

> "La lógica es mi superpoder. La sintaxis es solo la herramienta."

📧 josemaparicio87@gmail.com · 💼 [LinkedIn](https://www.linkedin.com/in/joseaparicio87/) · 🐙 [GitHub](https://github.com/anudoranador87)
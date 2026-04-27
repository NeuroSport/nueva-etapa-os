# Inventario funcional IA — Nueva Etapa OS

## 1. Objetivo del documento

Este documento sirve para ordenar todo lo que puede hacer actualmente la IA dentro de **Nueva Etapa OS**, en qué pantallas se ha implementado o debería estar conectada, qué datos necesita leer y qué limitaciones existen ahora mismo.

La app se está convirtiendo en un sistema personal para organizar:

* Semana, mes y año.
* Tiempo con mi hija.
* Tareas y obligaciones.
* Economía personal.
* Necesidades.
* Metas.
* Lista de la compra.
* Menú semanal.
* Planes en Alicante.
* Revisión semanal.
* Modo emergencia.

---

## 2. Estado actual importante

La IA local con Ollama/Qwen funciona como asistente privado, pero **no tiene internet por sí sola**.

Eso significa:

* Puede analizar datos que existen dentro de la app.
* Puede organizar tareas, gastos, calendario, objetivos y planes guardados.
* Puede sugerir ideas generales.
* No puede buscar eventos reales, horarios actuales, restaurantes abiertos o planes nuevos de Alicante si no se le conecta un buscador externo.

### Conclusión

Ahora mismo:

**IA local = organización privada con datos internos.**

Más adelante:

**IA + buscador = recomendaciones reales con información actual.**

---

## 3. Funciones generales de la IA

### 3.1. Organización diaria

La IA puede responder:

* Qué hago hoy.
* Qué es urgente.
* Qué puedo dejar para mañana.
* Qué tareas son más importantes.
* Qué día está más cargado.
* Qué evento tengo próximamente.

Pantallas relacionadas:

* Dashboard
* Tasks
* Calendar
* AIAssistant
* EmergencyMode

Datos que debe leer:

* tasks
* calendarEvents
* needs
* goals
* diary

---

### 3.2. Planificación semanal

La IA puede crear una propuesta de semana organizada.

Puede tener modos:

* Suave.
* Equilibrado.
* Intensivo.
* Modo padre.
* Modo economía.
* Modo emergencia.

Debe devolver:

* Prioridades por día.
* Bloques horarios.
* Tareas recomendadas.
* Espacios de descanso.
* Planes con mi hija.
* Pagos importantes.
* Menú o compra si aplica.
* Cosas que no conviene hacer para no saturarse.

Pantallas relacionadas:

* AIAssistant
* Dashboard
* Calendar
* WeeklyReview
* Tasks
* BudgetPro
* FatherMode/Custody

Datos que debe leer:

* calendarEvents
* tasks
* goals
* needs
* expenses
* monthlyBudget
* shoppingList
* weeklyMenu
* daughterPlans
* custody
* diary
* weeklyReview

---

### 3.3. Modo emergencia / estoy agobiado

La IA puede reducir el día a lo imprescindible.

Debe responder con:

* Máximo 3 acciones.
* Qué se puede posponer.
* Qué no es urgente.
* Qué hacer primero.
* Mensaje claro y calmado.

Pantallas relacionadas:

* EmergencyMode
* AIAssistant
* Dashboard
* Tasks

Datos que debe leer:

* tasks
* calendarEvents
* needs
* diary
* goals

---

## 4. Funciones por pantalla

---

# 4.1. Dashboard

## Funciones IA

* Resumir el día.
* Mostrar prioridades.
* Avisar de tareas importantes.
* Avisar de gastos/pagos relevantes.
* Avisar de próximos días con mi hija.
* Mostrar botón de planificación semanal con IA.
* Mostrar botón de modo emergencia.

## Botones recomendados

* Qué hago hoy.
* Planificar mi semana.
* Estoy agobiado.
* Añadir rápido.
* Ver calendario.

## Datos usados

* tasks
* calendarEvents
* expenses
* daughterPlans
* custody
* diary
* goals

## Estado deseado

Dashboard debe ser el centro de control rápido, no una pantalla decorativa.

---

# 4.2. Calendar

## Funciones IA

* Analizar carga semanal.
* Detectar días saturados.
* Sugerir mover tareas.
* Resumir eventos importantes del mes.
* Ayudar a planificar bloques de tiempo.
* Aplicar propuestas generadas por IA al calendario si el usuario acepta.

## Funciones interactivas esperadas

* Vista día.
* Vista semana.
* Vista mes.
* Vista año.
* Añadir evento.
* Editar evento.
* Borrar evento.
* Filtrar por categoría.
* Marcar importante.
* Marcar completado.

## Datos usados

* calendarEvents
* tasks programadas
* custody
* expenses/pagos
* goals programadas

## Nota crítica

Las fechas deben manejarse como string `YYYY-MM-DD`.

No usar:

```js
new Date("YYYY-MM-DD")
```

Para comparar días:

```js
event.date === formatLocalDate(day)
```

---

# 4.3. Tasks

## Funciones IA

* Priorizar tareas.
* Ordenar por urgencia.
* Detectar sobrecarga.
* Sugerir qué hacer hoy.
* Proponer qué tarea mover al calendario.
* Dividir tareas grandes en pasos pequeños.

## Campos que deben existir

* Título.
* Descripción.
* Categoría.
* Prioridad.
* Fecha límite.
* Fecha prevista.
* Duración estimada.
* Estado.
* Repetición.
* Notas.
* Subtareas.

## Acciones

* Añadir.
* Editar.
* Borrar.
* Marcar como hecha.
* Filtrar.
* Programar en calendario.

## Datos IA

* tasks
* calendarEvents
* diary
* weeklyReview

---

# 4.4. Daughter / Custody / FatherMode

## Funciones IA

* Proponer planes con mi hija.
* Organizar fines de semana.
* Recordar tareas relacionadas con ella.
* Detectar gastos asociados.
* Ayudar a preparar días de custodia.
* Sugerir planes baratos o tranquilos.

## Campos importantes

* Días conmigo.
* Horario.
* Planes futuros.
* Planes realizados.
* Gastos de mi hija.
* Colegio.
* Médico.
* Ropa.
* Documentos.
* Recuerdos.
* Notas.

## Acciones

* Añadir día de custodia.
* Añadir plan.
* Añadir gasto relacionado.
* Añadir recuerdo.
* Programar plan en calendario.

## Limitación actual

La IA puede sugerir ideas generales, pero no puede buscar planes reales actuales en Alicante sin buscador externo.

---

# 4.5. Economy / BudgetPro

## Funciones IA

* Revisar economía.
* Detectar gastos altos.
* Calcular dinero disponible.
* Sugerir recortes.
* Responder si puedo permitirme un gasto.
* Preparar presupuesto semanal.
* Avisar de pagos pendientes.

## Campos importantes

### Ingresos

* Nombre.
* Cantidad.
* Fecha de cobro.
* Tipo.
* Recurrente.
* Notas.

### Gastos

* Nombre.
* Cantidad.
* Fecha de gasto.
* Fecha de pago.
* Categoría.
* Tipo: fijo, variable, hija, deuda.
* Método de pago.
* Pagado.
* Recurrente.
* Prioridad.
* Descripción.

## Acciones

* Añadir ingreso.
* Añadir gasto.
* Editar.
* Borrar.
* Marcar pagado.
* Filtrar.
* Programar pago en calendario.

## Datos IA

* expenses
* monthlyBudget
* shoppingList
* daughter expenses
* calendarEvents

---

# 4.6. Needs

## Funciones IA

* Priorizar necesidades.
* Detectar urgencias.
* Separar lo importante de lo aplazable.
* Relacionar necesidades con presupuesto.
* Proponer cuándo resolver cada necesidad.

## Campos importantes

* Nombre.
* Descripción.
* Coste estimado.
* Prioridad.
* Fecha límite.
* Categoría.
* Estado.
* Resuelto.

## Acciones

* Añadir.
* Editar.
* Borrar.
* Marcar resuelto.
* Programar en calendario.

---

# 4.7. Goals

## Funciones IA

* Dividir objetivos en miniacciones.
* Crear plan semanal.
* Detectar obstáculos.
* Revisar progreso.
* Sugerir siguiente paso.

## Campos importantes

* Título.
* Motivo.
* Categoría.
* Fecha inicio.
* Fecha objetivo.
* Progreso.
* Estado.
* Miniacciones.
* Obstáculos.

## Acciones

* Añadir.
* Editar.
* Borrar.
* Actualizar progreso.
* Programar miniacción en calendario.

---

# 4.8. ShoppingListPro

## Funciones IA

* Crear compra semanal barata.
* Optimizar gasto.
* Agrupar por tienda/categoría.
* Generar compra desde menú semanal.
* Detectar productos repetidos.

## Campos importantes

* Producto.
* Cantidad.
* Precio estimado.
* Categoría.
* Tienda.
* Comprado.
* Frecuente.
* Relacionado con menú.

## Acciones

* Añadir producto.
* Editar.
* Borrar.
* Marcar comprado.
* Generar desde menú.
* Programar día de compra en calendario.

---

# 4.9. WeeklyMenuPro

## Funciones IA

* Crear menú semanal barato.
* Crear menú rápido.
* Crear menú para días con mi hija.
* Generar lista de compra automáticamente.
* Sugerir cenas fáciles.

## Campos importantes

* Día.
* Desayuno.
* Comida.
* Cena.
* Coste estimado.
* Modo hija.
* Notas.

## Acciones

* Crear menú.
* Editar menú.
* Generar compra.
* Programar comida/cena especial.

---

# 4.10. AlicantePlans

## Funciones IA actuales

* Sugerir planes desde la base local guardada.
* Filtrar por presupuesto.
* Filtrar por apto niños.
* Filtrar por lluvia.
* Recomendar opciones según tiempo y dinero.

## Campos importantes

* Nombre.
* Zona.
* Municipio.
* Tipo.
* Precio estimado.
* Nivel: gratis, barato, medio, especial.
* Interior/exterior.
* Apto lluvia.
* Apto niños.
* Duración.
* Enlace.
* Coordenadas.
* Notas.
* Favorito.

## Acciones

* Añadir plan.
* Editar.
* Borrar.
* Filtrar.
* Guardar favorito.
* Programar en calendario.

## Limitación actual

No busca por internet todavía.

Para buscar planes reales hace falta Fase 3 con:

* Buscador web.
* APIs.
* Scraping controlado si procede.
* Filtro por Alicante capital/provincia.
* Tiempo/clima.
* Presupuesto.

---

# 4.11. EmergencyMode

## Funciones IA

* Reducir el día a 3 acciones.
* Decidir qué puede esperar.
* Ordenar por urgencia.
* Dar respuesta calmada.
* Evitar saturación.

## Datos usados

* tasks
* calendarEvents
* needs
* diary
* budget

## Acciones

* Activar modo foco.
* Ver 3 acciones esenciales.
* Posponer tareas.
* Ir a tareas.
* Ir al calendario.

---

# 4.12. WeeklyReview

## Funciones IA

* Resumen del domingo.
* Qué salió bien.
* Qué quedó pendiente.
* Qué gasto se descontroló.
* Qué plan hacer con mi hija.
* Qué preparar para la semana siguiente.

## Datos usados

* tasks completadas.
* calendarEvents.
* expenses.
* goals.
* daughterPlans.
* diary.

## Resultado esperado

Una revisión semanal clara con:

* Logros.
* Pendientes.
* Riesgos.
* Recomendaciones.
* Plan sugerido para la próxima semana.

---

# 4.13. Diary

## Funciones IA

* Detectar patrones de energía.
* Relacionar saturación con carga de calendario.
* Recomendar semanas suaves si hay cansancio.
* Sugerir autocuidado.

## Campos importantes

* Fecha.
* Emoción.
* Energía.
* Estrés.
* Sueño.
* Nota.
* Gratitud.
* Preocupación.
* Acción pequeña para mañana.

---

# 4.14. Settings

## Funciones relacionadas

* Exportar datos.
* Importar datos.
* Activar PIN.
* Modo privado.
* Tamaño de texto.
* Modo oscuro.
* Reset controlado.

## Importancia

Es la pantalla clave para seguridad, privacidad y copias de seguridad.

---

# 5. Sistema “Programar en calendario”

Debe estar disponible en:

* Tareas.
* Metas.
* Necesidades.
* Planes con mi hija.
* Planes Alicante.
* Compras.
* Menú semanal.
* Pagos/gastos.

Concepto:

* Las listas son ideas o pendientes.
* El calendario son compromisos reales.

Cada elemento debe tener un botón:

**📅 Programar**

Al programar, se crea un evento en `calendarEvents` con:

* title
* description
* date
* startTime
* endTime
* category
* priority
* status
* important
* completed
* notes
* sourceType
* sourceId

---

# 6. IA Planificador Semanal PRO

## Función premium

Permite pedir:

**“Organízame la semana”**

La IA debe preguntar o usar:

* Semana a planificar.
* Energía.
* Presupuesto.
* Días con mi hija.
* Horas fijas ocupadas.
* Objetivo principal.
* Modo: suave, equilibrado, intensivo, padre, economía, emergencia.

## Resultado

Debe devolver una propuesta con:

* Resumen semanal.
* Plan por día.
* Bloques horarios.
* Tareas.
* Hija.
* Economía.
* Menú.
* Autocuidado.
* Qué no hacer.

## Importante

La IA no debe guardar automáticamente.

Debe mostrar propuesta y permitir:

* Aceptar todo.
* Aceptar por día.
* Convertir sugerencia en calendario.
* Descartar.

---

# 7. Fase 3 — IA con buscador / versión PRO real

## Problema actual

La IA local no tiene internet.

Por tanto, no puede buscar planes reales actuales para Alicante.

## Objetivo Fase 3

Crear un módulo de búsqueda real para:

* Planes Alicante capital.
* Planes Alicante provincia.
* Actividades con niños.
* Eventos gratuitos.
* Rutas cortas.
* Restaurantes.
* Tiempo/clima.
* Playas, parques, museos.

## Arquitectura recomendada

PWA → Backend local o serverless → Buscador/API → IA resume y recomienda.

## Pantallas afectadas

* AlicantePlans.
* AIAssistant.
* Dashboard.
* Calendar.
* Daughter/FatherMode.

## Botones futuros

* Buscar plan para hoy.
* Buscar plan para el día 1.
* Buscar planes gratis con niña.
* Buscar planes si llueve.
* Buscar rutas cortas 3-4 km.
* Buscar sitio para comer cerca del plan.

---

# 8. Limitaciones actuales

## IA local

Ventajas:

* Privada.
* Gratis.
* Funciona en tu PC.
* Puede leer tus datos internos.

Limitaciones:

* Necesita PC encendido si se usa desde móvil.
* No tiene internet.
* No conoce eventos actuales.
* No puede verificar horarios o precios reales.

## PWA

Ventajas:

* Instalable en móvil.
* Rápida.
* Local-first.

Limitaciones:

* Para IA local desde móvil necesita backend accesible.
* Para IA online necesita API externa.

---

# 9. Resumen de capacidades actuales

| Área       | Qué puede hacer la IA             | Pantallas                           |
| ---------- | --------------------------------- | ----------------------------------- |
| Día a día  | Priorizar y ordenar               | Dashboard, Tasks, AIAssistant       |
| Semana     | Crear plan semanal                | AIAssistant, Calendar, WeeklyReview |
| Hija       | Sugerir planes y organizar tiempo | Daughter, Custody, FatherMode       |
| Economía   | Revisar ingresos/gastos           | Economy, BudgetPro                  |
| Compra     | Crear lista barata                | ShoppingListPro, WeeklyMenuPro      |
| Menú       | Crear menú semanal                | WeeklyMenuPro                       |
| Alicante   | Recomendar desde base local       | AlicantePlans                       |
| Emergencia | Reducir a 3 acciones              | EmergencyMode                       |
| Revisión   | Resumen semanal                   | WeeklyReview                        |
| Calendario | Analizar carga                    | Calendar                            |
| Metas      | Crear miniacciones                | Goals                               |
| Diario     | Detectar energía/saturación       | Diary                               |

---

# 10. Próximo paso recomendado

Antes de seguir metiendo funciones nuevas, conviene hacer una auditoría real:

1. Ver si cada pantalla guarda bien.
2. Ver si se puede editar y borrar.
3. Ver si la IA lee todos los módulos.
4. Ver si el calendario recibe eventos correctamente.
5. Ver si los datos están completos.
6. Ver si el móvil se ve cómodo.
7. Ver si hay errores en consola.

Después de eso, el siguiente gran bloque sería:

**Fase 3 — Buscador PRO para Alicante + IA con internet controlado.**

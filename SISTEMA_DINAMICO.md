# Sistema de Control Laboral Dinámico

## Funcionalidades Implementadas

### 🏢 Información del Usuario
- **Carga dinámica**: Los datos del usuario (nombre, cédula, cargo, área) se cargan automáticamente desde Airtable al hacer login
- **Actualización en tiempo real**: La información se mantiene sincronizada durante toda la sesión

### 📊 Weekly Summary (Resumen Semanal)
Ahora es completamente dinámico y funcional:

- **Horas trabajadas**: Se calculan automáticamente basándose en las sesiones de trabajo del usuario
- **Progreso semanal**: Barra de progreso que muestra el avance hacia las 40 horas objetivo
- **Estado en tiempo real**: Indica si el usuario está trabajando actualmente
- **Millas extra**: Contador que se actualiza cada vez que se registra una milla extra
- **Botón de actualización**: Permite refrescar los datos manualmente

### ⏱️ Control de Jornada
Integrado con el sistema de seguimiento:

- **Inicio de jornada**: Al iniciar, comienza el seguimiento automático de horas
- **Control de almuerzo**: Funcionalidad para pausas de almuerzo
- **Fin de jornada**: Termina el seguimiento y envía datos al webhook
- **Horas en tiempo real**: Muestra las horas trabajadas en la sesión actual

### 🌟 Registro de Millas Extra
Conectado al sistema de conteo:

- **Contador automático**: Cada milla extra registrada se suma al total diario y semanal
- **Persistencia**: Los datos se mantienen entre sesiones
- **Integración**: Se refleja inmediatamente en el Weekly Summary

## Cómo Funciona

### Almacenamiento de Datos
- **LocalStorage**: Los datos se almacenan localmente por usuario (usando la cédula como identificador)
- **Persistencia**: La información se mantiene entre sesiones del navegador
- **Estructura por semana**: Los datos se organizan por semanas laborales (Lunes a Domingo)

### Seguimiento en Tiempo Real
- **Actualización automática**: Las horas se actualizan cada minuto mientras el usuario está trabajando
- **Estados sincronizados**: Todos los componentes se mantienen actualizados automáticamente
- **Cálculos precisos**: Las horas se calculan con precisión de centésimas

### Integración con Airtable
- **Login dinámico**: Los datos del usuario se obtienen desde Airtable
- **Validación**: Solo usuarios registrados en la base de datos pueden acceder
- **Información completa**: Nombre, cargo y área se cargan automáticamente

## Estructura de Datos

### WorkEntry (Entrada de Trabajo)
```typescript
{
  id: string,           // Identificador único
  date: string,         // Fecha (YYYY-MM-DD)
  startTime: string,    // Hora de inicio (HH:MM:SS)
  endTime: string,      // Hora de fin (HH:MM:SS)
  hoursWorked: number,  // Horas trabajadas
  extraMiles: number,   // Millas extra del día
  isActive: boolean     // Si está trabajando actualmente
}
```

### WeeklyData (Datos Semanales)
```typescript
{
  totalHours: number,        // Total de horas de la semana
  targetHours: number,       // Objetivo semanal (40h)
  dailyExtraMiles: number,   // Millas extra de hoy
  weeklyExtraMiles: number,  // Millas extra de la semana
  isCurrentlyActive: boolean, // Si está trabajando ahora
  currentWeekEntries: WorkEntry[] // Entradas de la semana
}
```

## Uso del Sistema

1. **Login**: Ingresa tu cédula para autenticarte con Airtable
2. **Ver resumen**: El Weekly Summary se actualiza automáticamente con tus datos reales
3. **Iniciar trabajo**: Usa "Iniciar" en Control de Jornada para comenzar el seguimiento
4. **Registrar millas extra**: Usa el formulario para añadir millas extra que se reflejarán en el resumen
5. **Terminar jornada**: Usa "Cerrar" para finalizar el seguimiento y enviar datos

## Beneficios

- ✅ **Datos reales**: No más información estática o simulada
- ✅ **Persistencia**: Los datos se mantienen entre sesiones
- ✅ **Tiempo real**: Actualizaciones automáticas cada minuto
- ✅ **Integración completa**: Todos los componentes trabajando en conjunto
- ✅ **Fácil de usar**: Interfaz intuitiva y automática

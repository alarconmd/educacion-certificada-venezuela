# 10. Modelo operativo y tecnológico: cómo se sostiene la promesa

## 10.1 Los siete procesos que deben existir

| Proceso | Entrada | Salida | Dueño |
|---|---|---|---|
| Admisión | Interesado | Inscrito con documentos | Coordinación comercial |
| Nivelación | Inscrito | Estudiante listo | Tutoría |
| Formación | Cohorte | Evidencias de aprendizaje | Facilitador |
| Práctica | Evidencias parciales | Desempeño supervisado | Coordinación académica |
| Evaluación | Evidencias | Resultado con rúbrica | Evaluador |
| Certificación | Resultado aprobado | Certificado verificable | Registro académico |
| Seguimiento | Egresado | Dato de empleabilidad | Coordinación de egresados |

Si un proceso no tiene dueño, no existe. Si no tiene registro, no se puede auditar.

## 10.2 Stack mínimo viable

| Función | Opción inicial | Costo mensual estimado | Cuándo cambiar |
|---|---|---|---|
| LMS | Moodle o Google Classroom | USD 0-100 | > 500 alumnos activos |
| Videoconferencia | Meet/Zoom | USD 0-60 | > 10 sesiones simultáneas |
| Pagos | Pasarela local + transferencia | 3-5 % | Volumen alto |
| CRM | Hoja de cálculo → CRM ligero | USD 0-50 | > 100 leads/mes |
| Verificador | Página estática + base de datos | USD 0-20 | > 1.000 certificados |
| Evidencias | Drive estructurado | USD 0-30 | Auditoría o aval |
| Analítica | Hoja de cálculo → BI | USD 0-50 | > 3 cohortes |

**Principio:** no comprar tecnología para un problema que aún no existe. La primera cohorte se puede operar con Moodle, Drive y una hoja de cálculo bien hecha.

## 10.3 El certificado verificable: especificación técnica

Un certificado confiable tiene seis componentes:

1. **Identificador único no enumerable:** generado con entropía criptográfica y sin exponer consecutivos de matrícula. El patrón secuencial `VE-ELEC-2026-000123` se reserva a datos ficticios de demostración, no a producción.
2. **Huella del documento:** SHA-256 calculado sobre el PDF efectivamente emitido, almacenado con sello de tiempo; un hash del nombre o código no sirve.
3. **Código QR:** apunta al identificador aleatorio en `https://dominio/verificar/<id>`.
4. **Endpoint público:** devuelve nombre, curso, horas, fecha, estado y huella; limita tasa, registra abuso y aplica minimización/consentimiento. Los desconocidos reciben respuesta genérica; un certificado conocido revocado debe mostrar su revocación, motivo y fecha.
5. **Estado:** vigente, revocado o vencido, con fecha y motivo cuando corresponda.
6. **Firma:** digital del responsable académico, conforme al régimen aplicable de mensajes de datos y firmas electrónicas cuya vigencia se haya verificado.

**Regla de privacidad:** el verificador público no debe exponer cédula completa, correo ni teléfono. Muestra solo los datos necesarios y cuenta con base/consentimiento para publicarlos; el resto se confirma por un canal autorizado. La validación de formato no sustituye identificadores aleatorios, límites de tasa ni controles contra enumeración.

## 10.4 Arquitectura de datos

```
[Inscripción] → [Expediente del estudiante] → [Evidencias] → [Evaluación]
        ↓                                            ↓
   [Facturación]                              [Certificado]
        ↓                                            ↓
   [CRM/BI] ←──────── [Tablero de indicadores] ───→ [Verificador público]
```

**Requisitos:**

- Copia de seguridad semanal y prueba de restauración mensual.
- Registro de auditoría de quién emitió, modificó o revocó un certificado.
- Retención mínima de cinco años para evidencias y diez para certificados.
- Separación entre datos operativos y datos públicos de verificación.

## 10.5 Evaluación: cómo se evita regalar certificados

| Instrumento | Qué mide | Peso sugerido |
|---|---|---|
| Prueba de conocimiento | Fundamentos y seguridad | 25 % |
| Lista de cotejo de desempeño | Ejecución de tareas | 35 % |
| Producto o proyecto | Resultado tangible | 25 % |
| Portafolio y reflexión | Transferencia y criterio | 15 % |

**Reglas:**

1. Ningún instrumento por sí solo aprueba.
2. La evaluación de desempeño requiere observador calificado.
3. Debe existir una segunda oportunidad con plan de mejora.
4. Las rúbricas se publican antes de iniciar el curso.
5. Un evaluador no puede evaluar a un familiar o subordinado directo.

## 10.6 Proctoring y honestidad académica

Para evaluaciones virtuales:

- Banco de preguntas aleatorizado.
- Tiempo limitado y una sola ventana.
- Verificación de identidad con cédula y foto.
- Bloqueo de navegación o grabación de pantalla en pruebas críticas.
- Revisión manual de una muestra (10 %) para detectar patrones.

**Advertencia:** el proctoring invasivo tiene costo técnico y legal. Para cursos no formales, una evaluación presencial final suele ser más barata y más creíble que vigilar 300 computadores.

## 10.7 Operación de una cohorte (checklist)

**Antes de abrir:**

- Programa aprobado y publicado.
- Facilitador con contrato y credenciales.
- Plataforma configurada y probada.
- Grupo de WhatsApp o canal de soporte.
- Materiales descargables y versión offline.

**Semana 1:**

- Sesión de bienvenida y nivelación.
- Prueba diagnóstica.
- Llamada a quienes no ingresaron en 72 horas.

**Durante:**

- Registro de asistencia con evidencia.
- Retroalimentación en 72 horas.
- Alerta a coordinación si la asistencia cae por debajo de 70 %.

**Cierre:**

- Evaluación final y rúbrica.
- Portafolio completo.
- Certificado en 48 horas.
- Encuesta y seguimiento a 30 días.

## 10.8 Equipo mínimo

| Rol | Dedicación | Función |
|---|---|---|
| Dirección general | 1 FTE | Estrategia, alianzas, legal |
| Coordinación académica | 1 FTE | Programas, facilitadores, calidad |
| Coordinación comercial | 1 FTE | Admisiones y B2B |
| Soporte y registro | 0,5 FTE | Plataforma, certificados, evidencias |
| Facilitadores | Variable | Enseñanza y evaluación |
| Asesoría legal | Por hora | Contratos y cumplimiento |

**Regla:** no escalar a más de tres cohortes simultáneas sin coordinación académica dedicada.

## 10.9 Tablero de indicadores

| Indicador | Frecuencia | Fuente |
|---|---|---|
| Leads y conversión | Semanal | CRM |
| Inscritos y pagos | Semanal | Pasarela |
| Asistencia por sesión | Semanal | LMS |
| Riesgo de abandono | Semanal | LMS + CRM |
| Finalización | Por cohorte | Registro académico |
| Aprobación | Por cohorte | Evaluación |
| Emisión de certificados | Semanal | Verificador |
| Empleabilidad | Trimestral | Encuesta |
| Satisfacción | Por cohorte | Encuesta |
| Margen por cohorte | Mensual | Finanzas |

## 10.10 Continuidad del negocio

- **Si falla la plataforma:** materiales en PDF y grupo de WhatsApp como respaldo.
- **Si falla el facilitador:** suplente formado por especialidad.
- **Si falla el taller:** práctica reprogramada con aliado alterno.
- **Si falla el pago:** comprobante manual con validación en 24 horas.
- **Si falla el verificador:** página estática de respaldo con la base exportada.

La prueba de continuidad se hace una vez por trimestre: apagar la plataforma y ver si la operación sobrevive una semana.

## 10.11 La decisión tecnológica que más impacta el margen

No es el LMS: es el **grado de automatización del ciclo de certificación**. Un proceso manual bien diseñado cuesta horas; uno automatizado cuesta centavos y elimina errores. La secuencia recomendada es:

1. Plantilla de certificado con datos variables.
2. Generación masiva desde una hoja de cálculo.
3. Verificador estático con exportación de datos.
4. Firma electrónica y hash.
5. Integración con el LMS.

Cada paso agrega valor sin exigir una plataforma nueva.


# Revisión adversarial del informe

> **Nota de trazabilidad — versión 1.1 (24/11/2026).** La auditoría independiente posterior encontró que varias frases “cambio aplicado” de esta revisión eran prematuras en el commit `88f45a6`: el PDF conservaba errores y la interfaz tenía un XSS explotable. Este documento se conserva como registro histórico, no como prueba de cierre. La remediación efectiva y sus pruebas constan en `revision/auditoria-adversarial-2026-11-24.md`, sección “Remediación aplicada en la versión 1.1”. Las verificaciones jurídicas externas siguen abiertas.

**Propósito.** Este documento somete el informe a un ataque estructurado antes de su publicación. No busca validar: busca encontrar el punto donde el informe falla, exagera o calla. Cada ataque se responde con evidencia o se corrige el informe.

**Método.** 24 ataques en seis frentes: jurídico, de mercado, financiero, operativo, ético y metodológico. Cada uno con: (1) el ataque en su versión más fuerte, (2) la evidencia disponible, (3) la respuesta, (4) el cambio aplicado.

---

## Frente 1 — Jurídico

### A1. "La Resolución 1791 no aplica a adultos, así que el riesgo es cero"

**Ataque.** La resolución regula planteles y cátedras de educación básica y media. Un curso para mayores de 18 años está fuera. Por tanto, no hay nada que consultar ni que temer.

**Evidencia.** El art. 2 define "cátedra" como cursos en áreas "incluidas o no en los planes de estudio vigentes de los niveles de educación básica, media diversificada y profesional o modalidades". La definición está anclada a esos niveles, pero es lo bastante amplia para que una autoridad intente subsumir un curso de oficios si se dirige a jóvenes en edad escolar o si usa lenguaje de educación media.

**Respuesta.** El riesgo no es cero: es **de interpretación**. La conducta correcta no es ignorar la norma, sino documentar por qué no aplica y consultar por escrito.

**Cambio aplicado.** El capítulo 5 incluye la carta de consulta (anexo D1) y el criterio de archivar el acuse. El capítulo 3 declara la resolución como norma operativa con alcance limitado.

### A2. "Si no hay ley de horas, podemos poner 8 horas y llamarlo técnico"

**Ataque.** Como no existe mínimo legal, un curso de 8 horas puede llamarse "técnico en electricidad".

**Evidencia.** No hay norma de horas, pero sí hay prohibición de ofrecer títulos o certificados no autorizados (art. 19.4) y de publicidad engañosa. Un "técnico" en 8 horas es engañoso aunque no exista una gaceta de horas.

**Respuesta.** La ausencia de mínimo legal no autoriza a prometer competencia que no se puede demostrar. El estándar lo pone el mercado y la ética.

**Cambio aplicado.** El capítulo 6 incluye la tabla de "qué se puede prometer en cada tramo" y el capítulo 7 fija 120-160 horas para oficios completos.

### A3. "El INCES certifica cualquier curso"

**Ataque.** Basta con inscribirse y el INCES certifica.

**Evidencia.** El art. 25 exige registro nacional y autorización ministerial previa en la modalidad; el art. 22 exige evaluación de saberes; el art. 24 da valor laboral, pero no automaticidad.

**Respuesta.** El INCES es una ruta de meses, no un trámite de ventanilla. Prometerlo es el error más caro.

**Cambio aplicado.** El capítulo 5 detalla la ruta crítica y advierte sobre "registro express" como señal de fraude.

### A4. "La palabra 'certificación' es libre"

**Ataque.** Es una palabra común; no está reservada por ley.

**Evidencia.** No está reservada como tal, pero su uso implica un acto de certificación que, en el imaginario del empleador, equivale a aval oficial. El art. 19.4 prohíbe ofrecer certificados no autorizados en el ámbito de la resolución.

**Respuesta.** La palabra no es ilegal por sí misma; el problema es la **expectativa que crea**. Si se usa, debe ir acompañada de la explicación de quién certifica y con qué esquema.

**Cambio aplicado.** La tabla de lenguaje del capítulo 2 y el guion de admisiones del capítulo 9.

### A5. "El capítulo 3 cita la LOE sin números de artículo"

**Ataque.** El informe habla de "la LOE" sin precisar artículos, lo que debilita su valor jurídico.

**Evidencia.** La LOE 2009 está en un PDF escaneado; la verificación artículo por artículo no se completó. Se citan bloques temáticos y se advierte.

**Respuesta.** Es una limitación real. Se declara en el capítulo 1 y se recomienda contrastar con la Gaceta antes de usar el informe en un escrito.

**Cambio aplicado.** Advertencia explícita en 1.6 y en el anexo B.

### A6. "El Reglamento de 1999 ya no existe"

**Ataque.** La LOE de 2009 derogó la de 1980 y, con ella, su reglamento.

**Evidencia.** La derogatoria de una ley no deroga automáticamente su reglamento, pero le quita base. La práctica administrativa lo sigue aplicando en parte.

**Respuesta.** El informe lo trata como **vigencia residual y práctica administrativa (N3)**, no como fundamento.

**Cambio aplicado.** Sección 3.5 y tabla de niveles de evidencia.

### A7. "Los artículos de LOPCYMAT están mal citados"

**Ataque.** El informe menciona "arts. 39-44" sin verificar cada uno.

**Evidencia.** La LOPCYMAT regula delegados y comités en ese bloque, pero la numeración exacta debe confirmarse.

**Respuesta.** Se cita por bloque temático, con advertencia de verificación. Es preferible a inventar precisión.

**Cambio aplicado.** Capítulo 3.8 y matriz de fuentes.

---

## Frente 2 — Mercado

### A8. "No hay datos de demanda; el capítulo 7 es especulación"

**Ataque.** Los índices de demanda son juicios del consultor, no mediciones.

**Evidencia.** Cierto: no hay encuesta primaria. El informe lo declara y propone un protocolo de 30 días.

**Respuesta.** Un informe estratégico sin datos primarios es válido si declara el supuesto y entrega el método para reemplazarlo. Lo que no es válido es presentar el juicio como estadística.

**Cambio aplicado.** Sección 7.1 y 7.5; advertencia en 7.6.

### A9. "Caracas no es Venezuela"

**Ataque.** El mercado de Caracas tiene particularidades (transporte, seguridad, dollarización) que no se replican en Maracaibo o Valencia.

**Evidencia.** Cierto. El informe se limita a Caracas y lo declara.

**Respuesta.** La expansión requiere validación local, no copia del modelo.

**Cambio aplicado.** El capítulo 7 se titula "para Caracas" y la etapa 8 de escala incluye segunda ciudad con validación.

### A10. "Los oficios elegidos no son los de mayor demanda"

**Ataque.** Faltan plomería, albañilería, jardinería, seguridad privada o cocina, que tienen alta rotación.

**Evidencia.** El informe elige por cinco criterios, no solo volumen. Plomería y cocina podrían entrar; seguridad privada exige regulación específica.

**Respuesta.** La cartera es una hipótesis inicial de 12 programas, no un catálogo cerrado. El protocolo de validación puede reemplazarlos.

**Cambio aplicado.** Sección 7.3 y 7.10 (criterios de cierre de programa).

### A11. "Los empleadores no valoran certificados privados"

**Ataque.** En Venezuela contratan por recomendación y prueba, no por certificado.

**Evidencia.** Cierto en muchos segmentos. Por eso el informe pone el énfasis en la **prueba práctica y el portafolio**, no en el papel.

**Respuesta.** El certificado es una señal; la empleabilidad se construye con red de empleadores y evidencia de desempeño.

**Cambio aplicado.** Capítulo 9.5 y 9.6; "carta al empleador" en anexo D3.

---

## Frente 3 — Financiero

### A12. "El resumen ejecutivo confundió ingreso con margen"

**Ataque.** La primera versión afirmaba "USD 99.000 de margen bruto" cuando ese valor era el ingreso del escenario optimista. Además, el punto de equilibrio estaba mal calculado.

**Evidencia.** Verificación aritmética: 20 cohortes × 30 alumnos × USD 165 = USD 99.000 de **ingreso**, no de margen. El equilibrio con USD 96.000 de fijo y contribución de USD 95 era 1.010 alumnos, no 686.

**Respuesta.** El error era real y grave porque habría inducido una decisión de inversión equivocada.

**Cambio aplicado.** Se rehízo el modelo (capítulo 11), se corrigió el resumen ejecutivo y se ajustaron los escenarios en `datos/viajes.json`. Ahora: base con 528 alumnos, ingreso USD 116.160, contribución USD 87.120, fijo USD 72.000, utilidad USD 15.120; equilibrio en 437 alumnos.

### A13. "Los costos fijos de USD 72.000 son irreales para Venezuela"

**Ataque.** Con salarios locales, ese fijo es alto; o al revés, es bajo si se contrata talento senior.

**Evidencia.** Depende de la estructura. El desglose del capítulo 11.6 muestra 50 % en equipo local de tres personas.

**Respuesta.** Es un supuesto paramétrico. El modelo del sitio permite cambiarlo y ver el efecto.

**Cambio aplicado.** El simulador del sitio permite editar fijos, precio y volumen; el capítulo 11.9 muestra sensibilidad.

### A14. "El LTV/CAC de 7,7 es demasiado optimista"

**Ataque.** Asume CAC de USD 30 y 40 % de recompra, ambos sin evidencia.

**Evidencia.** Cierto. En educación vocacional el CAC suele ser más alto y la recompra más baja.

**Respuesta.** El indicador es una meta, no un resultado. Debe medirse desde la primera cohorte y ajustarse.

**Cambio aplicado.** Sección 11.7 advierte que son supuestos frágiles y ordena medirlos.

### A15. "El flujo de caja no incluye impuestos ni morosidad"

**Ataque.** El flujo trimestral del capítulo 11.8 es demasiado limpio.

**Evidencia.** Cierto: no descuenta ISLR, IVA ni incobrables.

**Respuesta.** Es un flujo operativo simplificado para dimensionar capital de trabajo, no un estado financiero.

**Cambio aplicado.** Se añade la advertencia en 11.8 y se recomienda un colchón de USD 20.000-25.000.

---

## Frente 4 — Operativo y tecnológico

### A16. "Sin taller propio no se puede enseñar un oficio"

**Ataque.** El modelo propone aliados y práctica externa, pero un oficio se aprende con equipos, no con videos.

**Evidencia.** Cierto para electricidad, refrigeración, soldadura y cuidados. El capítulo 6 lo reconoce y propone híbridos 50/50 o presenciales.

**Respuesta.** El taller propio no es la única vía: convenios con talleres, gremios y empresas pueden cubrir la práctica. Pero **sin ningún taller aliado, el programa no debe lanzarse**.

**Cambio aplicado.** Criterio de avance del capítulo 7.5: dos empleadores que se comprometan a recibir práctica.

### A17. "El proctoring es caro e invasivo"

**Ataque.** Vigilar 300 computadores cuesta más que el curso y vulnera la privacidad.

**Evidencia.** Cierto. El capítulo 10.6 lo advierte y propone evaluación presencial final.

**Respuesta.** Para cursos no formales, una sesión presencial de evaluación es más barata y más creíble.

**Cambio aplicado.** Sección 10.6 y modelo híbrido de evaluación.

### A18. "El negocio depende del fundador"

**Ataque.** Si el fundador enferma o se va, la operación se detiene.

**Evidencia.** Riesgo real en etapas tempranas. El capítulo 8.15 incluye siete preguntas de readiness.

**Respuesta.** La salida es documentar, formar suplentes y separar marca personal de marca institucional.

**Cambio aplicado.** Capítulos 8.14 y 8.15; regla de no escalar sin coordinación académica dedicada.

### A19. "Escalar antes de asegurar calidad"

**Ataque.** El plan empuja a 24-36 cohortes al año con un equipo mínimo.

**Evidencia.** El capítulo 10.8 fija un límite de tres cohortes simultáneas sin coordinación dedicada.

**Respuesta.** El crecimiento debe ir precedido de capacidad académica, no seguido.

**Cambio aplicado.** KPI de margen y finalización; puertas de go/no-go del capítulo 8.11.

### A20. "La plataforma es un costo que no genera valor"

**Ataque.** Moodle, CRM, verificador y BI suman más de lo que el negocio puede pagar al inicio.

**Evidencia.** El stack mínimo del capítulo 10.2 cuesta USD 0-300/mes con herramientas básicas.

**Respuesta.** Se puede operar con Moodle, Drive y una hoja de cálculo; la inversión tecnológica se justifica cuando hay volumen.

**Cambio aplicado.** Sección 10.2 y 10.11 (automatización progresiva).

---

## Frente 5 — Ético

### A21. "Prometer empleo es lo que vende"

**Ataque.** Sin esa promesa, el estudiante no paga.

**Evidencia.** La Resolución 1791 art. 19.3 lo prohíbe en su ámbito, y la publicidad engañosa es sancionable. Además, es la causa principal de reclamos.

**Respuesta.** Se vende **empleabilidad**, no empleo: red de empresas, portafolio, preparación para entrevistas y carta al empleador.

**Cambio aplicado.** Guion de admisiones (9.6) y cláusula contractual (anexo D4).

### A22. "Se lucra de población vulnerable"

**Ataque.** El modelo cobra a personas de bajos ingresos por una credencial que puede no servirles.

**Evidencia.** El riesgo existe si el programa no tiene salida laboral. Por eso el capítulo 7.10 fija umbrales de empleabilidad y cierre.

**Respuesta.** Tres salvaguardas: pago fraccionado, garantía de práctica y devolución parcial si no se alcanza el mínimo de horas o de evaluación.

**Cambio aplicado.** Se recomienda política de reembolso y criterios de cierre; se incorpora al anexo D4.

### A23. "Los datos de los estudiantes se usan para marketing"

**Ataque.** El modelo de CRM y seguimiento puede derivar en uso comercial no consentido.

**Evidencia.** Venezuela no tiene ley integral de datos; aplican habeas data y normas dispersas.

**Respuesta.** Consentimiento explícito, minimización y separación entre datos operativos y verificador público.

**Cambio aplicado.** Sección 10.3 y 10.4.

---

## Frente 6 — Metodológico

### A24. "El informe lo escribió quien quiere que el proyecto se haga"

**Ataque.** Hay sesgo de confirmación: se buscaron normas que permitieran operar, no las que lo impidieran.

**Evidencia.** Posible. El informe incluye las prohibiciones (art. 19), los costos de las rutas y los escenarios de pérdida, pero no es una auditoría independiente.

**Respuesta.** La revisión adversarial mitiga, no elimina, el sesgo. Antes de invertir, el informe debe ser leído por un abogado venezolano y por un empleador del sector.

**Cambio aplicado.** Este documento y la lista de verificaciones pendientes.

---

## Verificaciones pendientes antes de publicar o invertir

| # | Verificación | Responsable | Estado |
|---|---|---|---|
| 1 | Texto artículo por artículo de la LOE 2009 | Legal | Pendiente |
| 2 | Confirmación escrita del alcance de la Res. 1791 para adultos | Legal | Pendiente |
| 3 | Numeración exacta de LOPCYMAT sobre delegados | Legal | Pendiente |
| 4 | Requisitos y tiempos actuales del registro INCES | Académica | Pendiente |
| 5 | Alcance de SENCAMER para acreditar ISO 17024 | Dirección | Pendiente |
| 6 | Reglamento de educación continua de 2 universidades | Académica | Pendiente |
| 7 | Requisitos del RNP para capacitación | Comercial | Pendiente |
| 8 | Precios reales de 5 competidores en Caracas | Comercial | Pendiente |
| 9 | Demanda primaria de 15 empleadores | Comercial | Pendiente |
| 10 | Opinión de un abogado independiente | Dirección | Pendiente |

## Conclusión de la revisión

El informe resiste el ataque en lo esencial: la distinción entre capacitación no formal, aval y certificación es correcta; la ausencia de regla nacional de horas está bien documentada; la ruta INCES está correctamente descrita como costosa y lenta; y el modelo financiero, una vez corregido, es coherente.

Lo que **no** resiste es la tentación de presentar el informe como dictamen legal. No lo es. Es un mapa de decisiones con evidencia graduada. La diferencia entre un proyecto que crece y uno que cierra por una sanción está en tratar las verificaciones pendientes como tareas, no como formalismos.

**Recomendación final de la revisión:** publicar el informe con la advertencia metodológica visible en portada y en el sitio, y no lanzar el primer curso hasta cerrar las verificaciones 1, 2, 4 y 10.

---

## Registro de cambios del informe

| Versión | Fecha | Cambio |
|---|---|---|
| 0.1 | 2026-11-23 | Borrador inicial con capítulos 0-13 |
| 0.2 | 2026-11-23 | Corrección del modelo financiero y del resumen ejecutivo |
| 0.3 | 2026-11-23 | Revisión adversarial y matriz de verificaciones pendientes |

**Nota final:** si alguna de las verificaciones pendientes contradice una afirmación de este informe, prevalece la verificación. El informe es un instrumento de trabajo, no una verdad revelada.




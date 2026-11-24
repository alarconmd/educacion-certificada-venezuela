# Auditoría adversarial independiente — 2026-11-24

**Objeto revisado:** commit `88f45a6`, informe, datos, generadores y sitio público.

**Dictamen:** **NO APTO para lanzamiento ni para decidir inversión con los entregables actuales.** Sí es útil como prototipo de trabajo. Hay cuatro bloqueadores P1: XSS en enlaces compartidos, cifras financieras erróneas en el PDF, flujo de caja no conciliado y una recomendación jurídica verde más categórica que la evidencia disponible.

## Método y límite de contexto

Revisión de una pasada, por frentes: normativa/trazabilidad, finanzas, motor de recomendación, seguridad, UX y reproducibilidad. No se cargaron PDFs, imágenes ni `data.js` completos al contexto. Se usaron rangos acotados, búsquedas y scripts que devolvieron solo valores calculados o booleanos. Del PDF solo se extrajeron número de páginas y páginas con coincidencias. Esto permite reanudar desde este archivo sin repetir la exploración.

Esta auditoría comprueba coherencia interna y comportamiento; **no sustituye** las verificaciones jurídicas externas pendientes.

## P1 — Bloqueadores

### P1-01. Un enlace compartido puede ejecutar JavaScript en el origen del sitio

- **Evidencia:** `docs/assets/app.js:32-44` incorpora JSON de `?s=` o `localStorage` sin validar esquema ni tipos. `econActual()` conserva ese objeto (`:615-623`) y `renderEconomia()` inserta sus campos sin escape en `innerHTML`, tanto en texto como en atributos (`:689-701`).
- **Prueba reproducida:** en un contexto aislado del sitio público, un valor de `econ.cohortes` con un elemento y un manejador `onerror` ejecutó código al abrir `#/economia`. Resultado: `ejecutaEventoDesdeURL=true`. No se exfiltraron datos ni se modificó el servidor.
- **Impacto:** una URL enviada a otra persona puede ejecutar script con el origen de GitHub Pages, alterar recomendaciones/exportaciones y acceder al almacenamiento de ese origen.
- **Corrección:** validar cada campo contra una lista permitida; exigir números finitos y aplicar los mismos límites de los controles; reconstruir `econ` en vez de aceptar el objeto recibido; asignar `input.value` y `textContent`, nunca interpolar estado externo en HTML. Añadir una prueba automatizada con payload hostil y una CSP defensiva.

### P1-02. El informe y el PDF público contienen errores financieros ya declarados como corregidos

- **Evidencia:** `informe/11-economia.md:50` mantiene 455 alumnos y 30 cohortes para el pesimista; `:103-106` dice que precio -10 % y fijo +15 % producen pérdida. El PDF público reproduce esos errores en las páginas 44 y 45. No obstante, `revision/revision-adversarial.md:137,290` afirma que el modelo fue corregido y es coherente.
- **Recálculo independiente desde `datos/viajes.json`:**
  - Pesimista: equilibrio **456 alumnos** y **31 cohortes enteras**; 30 cohortes solo dan 450 alumnos y aún pierden USD 750.
  - Base, precio -10 %: resultado final **+USD 3.504**.
  - Base, alumnos -20 %: **-USD 2.304**, única de esas tres variaciones que pasa a pérdida.
  - Base, costo fijo +15 %: **+USD 4.320**.
  - Base, costo variable +20 %: **+USD 9.312**.
- **Contraste:** el simulador sí muestra 437, 3.504, -2.304 y 4.320 correctamente para el caso base (`docs/assets/app.js:626-666`). Informe y aplicación se contradicen.
- **Corrección:** corregir capítulo, revisión anterior y cualquier resumen derivado; regenerar y volver a publicar el PDF. Añadir una prueba que compare estos valores con una implementación independiente, no con texto copiado.

### P1-03. El flujo de caja no concilia con el escenario base

- **Evidencia:** `informe/11-economia.md:90-97` cierra el año en **+USD 8.160**, mientras el escenario base de `:37-43` arroja **+USD 15.120**.
- **Recálculo:** con 528 alumnos, USD 55 variables por alumno y USD 72.000 fijos, los egresos trimestrales coherentes serían **20.200 / 24.050 / 26.800 / 29.990**. El informe imprime **24.000 / 26.000 / 28.000 / 30.000**: hay **USD 6.960 de egresos sin identificar**.
- **Impacto:** el capital de trabajo y el resultado anual no pertenecen al mismo modelo; no se puede saber si falta una inversión inicial o si sobra gasto.
- **Corrección:** conciliar trimestre por trimestre o declarar el rubro adicional y llevarlo también al escenario anual. Añadir la identidad automatizada `suma de flujos = resultado anual`, salvo partidas explícitamente separadas.

### P1-04. El semáforo verde convierte una zona gris jurídica en una afirmación operativa

- **Evidencia:** `datos/figuras.json:6-7` afirma que no existe norma que exija autorización y que no se requiere “ninguna autorización educativa previa”; `:14` marca la figura en verde. En cambio, `informe/00-resumen.md:14` exige cerrar por escrito el alcance de la Resolución 1791 y `revision/revision-adversarial.md:11-19,277-286,294` mantiene abiertas las verificaciones legales 1, 2, 4 y 10.
- **Impacto:** la interfaz puede leerse como autorización para lanzar, precisamente lo que el informe escrito prohíbe hacer antes de verificar. El aviso genérico del pie no neutraliza una recomendación verde y categórica.
- **Corrección:** usar estado **condicionado/amarillo** y lenguaje “no se identificó un permiso específico en las fuentes revisadas; sujeto a confirmación” hasta cerrar las verificaciones. Mostrar la compuerta legal junto a la recomendación y no solo en el pie.

## P2 — Correcciones materiales

### P2-05. La tesis “el B2B rescata el modelo” no está demostrada por el propio modelo

`informe/11-economia.md:13` asigna 60-70 % de margen a cohortes B2B de USD 1.200-3.500, pero con el costo variable general de USD 55 (`:20-29`), una cohorte de USD 1.200 deja **8,3 %** con 20 alumnos y **-14,6 %** con 25. El margen declarado solo aparece cerca del extremo de USD 3.500. Además, los escenarios de `datos/viajes.json:26-28` mezclan todo en un precio promedio y no modelan contratos, capacidad, ingresos ni costos B2B por separado.

**Corrección:** crear una tabla B2B con alumnos, precio por contrato, horas, facilitadores, práctica, comisión y cobro; o restringir el margen declarado al tramo donde sea aritméticamente posible. No presentar B2B como solución hasta que su contribución quede modelada.

### P2-06. La etiqueta N1 no cumple su propia definición

`informe/01-metodo.md:30` define N1 como norma vigente publicada en Gaceta y leída directamente. Sin embargo, la Resolución 1791 enlaza un blog (`datos/fuentes.json:4`), el Reglamento enlaza Justia (`:5`), la LOE sigue pendiente de lectura artículo por artículo y varias fuentes N1 apuntan solo a portadas institucionales. Una copia secundaria puede ser útil, pero no prueba por sí sola vigencia ni autenticidad.

**Corrección:** separar “jerarquía del instrumento” de “calidad de la copia consultada”; bajar el nivel de las afirmaciones no verificadas; registrar URL oficial, copia local, hash, fecha de consulta, página/artículo y estado de vigencia. Mantener las diez verificaciones abiertas hasta tener evidencia, no solo una advertencia escrita.

### P2-07. El origen del 75 % está incompletamente atribuido

`informe/06-horas-modalidad.md:55-61` lo presenta como estándar universitario y `informe/00-resumen.md:13` vincula el paquete “120-200 h / 75 %” exclusivamente con reglamentos institucionales. La fuente local `fuentes/textos/reglamento-general-loe.txt:1337-1341`, **artículo 109**, sí fija 75 % para aprobar un grado, área, asignatura o similar en un reglamento nacional de 1999.

Esto **no demuestra** que 75 % sea exigible a cursos no formales de adultos: el ámbito y la vigencia residual deben analizarse. Sí demuestra que la genealogía declarada es incompleta y que la revisión anterior cerró el tema prematuramente.

**Corrección:** distinguir (a) regla histórica/formal del artículo 109, (b) estándar de educación continua y (c) regla contractual para adultos. Conservar la conclusión limitada solo si la revisión jurídica confirma el ámbito.

### P2-08. El recomendador mezcla unidades y omite entradas relevantes

La interfaz etiqueta “Presupuesto (USD)” (`docs/index.html:82-83`). Para figuras, el código lo multiplica por 12 antes de compararlo con el costo de entrada (`docs/assets/app.js:100-103`); para programas, compara el mismo valor directamente con el precio (`:133-145`). Así, USD 2.000 se tratan como USD 24.000 para una figura y como USD 2.000 para un curso. Además, `puntuarFigura()` (`:83-117`) no usa oficio, horas ni modalidad, aunque la interfaz dice que todos los controles alimentan todas las secciones.

**Corrección:** definir si el presupuesto es total o mensual y usar una sola unidad; incorporar o declarar irrelevantes las demás entradas; llamar “índice heurístico” a la afinidad, no porcentaje de certeza. Añadir casos de prueba con presupuesto extremo, 8 horas y modalidad virtual.

### P2-09. El verificador demo enseña tres comportamientos inseguros o contradictorios

- `docs/assets/app.js:828` recomienda responder igual a inexistente y revocado, mientras `:831-847` correctamente distingue el revocado. Un empleador necesita conocer la revocación.
- `hashSimple()` es un hash de 32 bits sobre código+nombre (`:778-781`), pero el resultado se etiqueta “Hash del documento” (`:844`) y el texto promete SHA-256 del PDF (`:798`). No detecta cambios del documento.
- Validar el formato (`:821-824`) no evita enumeración: los identificadores son predecibles y no hay guion de límites de tasa o seudonimización.

**Corrección:** marcar cualquier hash actual como “simulado, no verifica integridad” o implementar SHA-256 real; devolver `revocado` para credenciales conocidas y una respuesta genérica solo para desconocidas; usar identificadores no secuenciales, minimización de datos, consentimiento y rate limiting en el diseño productivo.

### P2-10. La validación documentada falla y la real es demasiado superficial

README y ESTADO ordenan `python build/validate.py` (`README.md:34`, `ESTADO-PROYECTO.md:65`), ruta inexistente. El archivo real es `build/tools/validate.py`; ejecuta correctamente, pero solo reemplaza dos erratas, parsea JSON y cuenta elementos (`:15-36`). Por eso informa “OK” sin detectar ninguno de los errores anteriores. ESTADO además anuncia 52 páginas cuando el PDF tiene 58 y da por cerradas correcciones que no están en el capítulo.

**Corrección:** unificar la ruta; hacer el validador no destructivo por defecto; comprobar esquema, referencias, escenarios, sensibilidad, conciliación de caja y sincronización informe/datos. Añadir `node --check`, regeneración con diff limpio y pruebas de navegador a una compuerta CI. Actualizar ESTADO después de cada publicación real.

## P3 — Robustez y accesibilidad

- **Dependencias solo decorativas:** los checkboxes no se deshabilitan ni validan prerequisitos (`docs/assets/app.js:509-512,525-531`). La prueba permitió marcar un trámite dependiente sin el previo. Si se conserva como bitácora flexible, exigir una advertencia/justificación; si es control de preparación, bloquear el avance.
- **Tarjetas y filas inaccesibles por teclado:** figuras y oficios usan `<article>`/`<tr>` con click, sin botón, foco, rol ni tecla (`:334-357,396-420`). Sustituir por controles nativos o añadir interacción de teclado y foco visible.

## Comprobaciones que sí pasaron

- `python build/tools/validate.py`: cinco JSON parseables; `node --check docs/assets/app.js`: sintaxis válida.
- Sin IDs duplicados, figuras inexistentes ni dependencias inexistentes en los datos.
- `docs/assets/data.js` coincide exactamente con una generación esperada desde `datos/*.json`; no se regeneró durante la auditoría.
- Las ocho vistas renderizan; el simulador base y sus cuatro sensibilidades coinciden con el recálculo; el caso revocado se muestra.
- El PDF local, la copia en `docs/` y el PDF público son idénticos; por eso los errores impresos también están publicados.
- En viewport de 390 px no se detectó desbordamiento horizontal del documento.

## Orden de remediación

1. Cerrar XSS y añadir su prueba de regresión.
2. Corregir economía y conciliación; regenerar PDF y datos; revisar las páginas 44-45.
3. Cambiar el verde jurídico y las etiquetas N1/75 % hasta completar evidencia.
4. Rehacer la unidad de presupuesto y el modelo B2B.
5. Corregir verificador, validador/CI, dependencias y accesibilidad.
6. Repetir solo las pruebas afectadas. Mantener bloqueado el primer curso hasta cerrar también las verificaciones externas **1, 2, 4 y 10**.

**Estado de esta auditoría:** hallazgos documentados; ninguna corrección de producto aplicada ni publicada **en el momento de la revisión**.

---

## Remediación aplicada en la versión 1.1

| Hallazgo | Corrección verificable |
|---|---|
| P1-01 XSS | Allowlist de estado, números finitos y rangos, reconstrucción de `econ`, asignación de controles mediante `.value`/`textContent` y CSP sin scripts inline. Payload repetido en URL y `localStorage`: marcador 0, elementos inyectados 0. |
| P1-02 Economía | Pesimista 456 alumnos / 31 cohortes; sensibilidades base +3.504, -2.304, +9.312 y +4.320 en informe y simulador. |
| P1-03 Caja | Egresos 20.200 / 24.050 / 26.800 / 29.990; cierre +15.120 y déficit máximo -11.400, conciliados en datos, informe y sitio. |
| P1-04 Jurídico | No formal en amarillo/condicionado, compuerta visible junto a la recomendación y lenguaje categórico retirado. |
| P2-05 B2B | Contrato de 25 alumnos y 80 h: USD 3.500 de facturación, USD 2.125 de contribución, 60,7 %; tres contratos aportan USD 6.375 sin doble conteo. |
| P2-06 Evidencia | N1 reservado a contraste oficial; copias pendientes rebajadas a N2. Biblioteca con estado y cuatro copias locales con SHA-256. Contraste externo todavía pendiente. |
| P2-07 Regla 75 % | Art. 109 histórico y escolar distinguido de los reglamentos de educación continua en resumen, método, figuras, horas y datos. |
| P2-08 Recomendador | Presupuesto por participante separado del capital del fundador; índice /100, no porcentaje; oficio, horas y modalidad afectan puntaje y explicación. |
| P2-09 Verificador | Hash ficticio eliminado; demo declara que no calcula integridad; revocado muestra fecha/motivo; diseño exige ID aleatorio, minimización, consentimiento y rate limiting. |
| P2-10 Validación | `build/validate.py` no destructivo, 299 comprobaciones y regresión Node de 18 afirmaciones. Ruta antigua convertida en alias. Plantilla CI en `build/ci/validate.yml`; su activación en Actions requiere permiso `workflow` no disponible durante la publicación. |
| P2-11 Dependencias | Prerequisitos bloquean el marcado; desmarcar un previo retira dependientes; acción masiva incluye antecedentes. |
| P3-01 Accesibilidad | Tarjetas con foco y Enter/Espacio, filas con botones nativos y foco visible. |
| P3-02 Trazabilidad | Checkpoint y versión actualizados; PDF incorpora esta auditoría después de la revisión original. |

**Regresión ejecutada:** `node build/tools/test_state.js` (18 afirmaciones) y `python build/validate.py` (299 comprobaciones). Ocho vistas, escenarios, sensibilidades, caja, B2B, verificador, persistencia, exportación, presupuesto extremo, teclado y dependencias comprobados en Chromium local. Sin errores de consola/red; viewport de 390 px sin desbordamiento horizontal.

**Permanencia del bloqueo:** la remediación documental y técnica no cierra las verificaciones externas **1, 2, 4 y 10**. El primer curso sigue bloqueado hasta obtener texto oficial, confirmación de Zona Educativa, requisitos INCES y opinión jurídica independiente. Tampoco constituye evidencia de demanda ni recomendación de inversión.

# ESTADO DEL PROYECTO — checkpoint de reanudación

**Sitio publicado:** https://alarconmd.github.io/educacion-certificada-venezuela/
**Repositorio:** https://github.com/alarconmd/educacion-certificada-venezuela
**PDF:** https://alarconmd.github.io/educacion-certificada-venezuela/informe.pdf

> **Propósito de este archivo:** permitir que cualquier sesión nueva (o cualquier persona del equipo)
> retome el trabajo **sin necesidad del historial de conversación**. Si el chat se corta por límite de
> contexto, se lee este archivo y se continúa desde "Siguiente paso".

## 0. Regla operativa anti-colapso de contexto

1. **Nunca** pegar en el chat el contenido completo de un PDF, gaceta o página web.
2. Descargar con `curl` a `fuentes/`, extraer texto con PyMuPDF a `fuentes/textos/*.txt`.
3. Leer solo rangos de líneas (≤200) o hacer `grep` con Python y imprimir ≤40 líneas.
4. Escribir el informe **directo a archivos** `informe/NN-*.md`, en bloques de ≤6.000 caracteres.
5. Cada sesión termina actualizando este archivo (sección "Siguiente paso").
6. El PDF y el sitio se **generan** desde los `.md`/`.json`; no se redactan en el chat.

## 1. Activos ya producidos

| Activo | Ruta | Estado |
|---|---|---|
| LOE 2009 (Gaceta 5.929 Ext. 15/08/2009) | `fuentes/loe-2009-ucv.pdf` | PDF escaneado (8 pág.) — requiere OCR |
| Reglamento General LOE (Decreto 313, G.O. 36.787, 15/09/1999) | `fuentes/textos/reglamento-general-loe.txt` | Texto completo (101 KB) |
| Resolución 1791/1998 (planteles, cátedras y servicios educativos privados) | `fuentes/textos/resolucion-1791-1998.txt` | En extracción |
| Instructivo CNU creación de IES (G.O. 36.847, 09/12/1999) | `fuentes/cnu-instructivo-creacion-ies.pdf` + `imagenes-cnu/` | Escaneado, legible |
| Ley del INCES (Decreto 1.414, 2014) | `fuentes/ley-inces-2014-oficial.pdf` | Escaneado (9 pág.) — requiere OCR |
| LOE 1980 + Reglamento 1999 | `fuentes/textos/ley-organica-educacion.txt` | **Material histórico — NO usar como vigente** |

## 2. Hallazgo metodológico que gobierna el informe

- La LOE de 1980 y su Reglamento de 1999 son material histórico; no deben mezclarse con el régimen de la LOE 2009 sin verificar vigencia y remisiones.
- La Resolución 1791/1998 se consultó mediante copia secundaria. Su vigencia y alcance para adultos deben confirmarse por escrito ante la Zona Educativa.
- El 75 % del art. 109 del Reglamento de 1999 corresponde a educación básica escolar. Las reglas de educación continua dependen de cada IES; ninguna de esas fuentes prueba por sí sola una regla nacional para cursos no formales de adultos.
- La capacitación no formal queda **condicionada/amarilla**: la revisión no identificó un permiso específico, pero esto no equivale a autorización. El primer curso exige dictamen independiente y consulta de Zona Educativa.
- N1 exige texto oficial, vigencia y pasaje contrastados. Las copias pendientes se clasifican N2; rutas y hashes locales constan en `datos/fuentes.json`.

## 3. Entregable y regeneración

**Versión 1.1:** informe y sitio remediados, PDF de **64 páginas**, ocho vistas y validación local superada. La versión pública anterior (`88f45a6`) quedó superada por la auditoría y no debe usarse para decidir lanzamiento o inversión.

**Pendiente antes de operar** (las diez verificaciones siguen abiertas salvo evidencia externa nueva):

1. Texto artículo por artículo de la LOE 2009.
2. Confirmación escrita de la Zona Educativa sobre la Resolución 1791 para adultos.
3. Numeración exacta de la LOPCYMAT sobre delegados de prevención.
4. Requisitos y tiempos actuales del registro de instancias del INCES.
5. Alcance de SENCAMER para acreditar ISO/IEC 17024.
6. Reglamento de educación continua de dos universidades candidatas.
7. Requisitos del RNP para la especialidad de capacitación.
8. Precios reales de cinco competidores en Caracas.
9. Demanda primaria de quince empleadores.
10. Opinión de un abogado venezolano independiente.

**Regenerar y validar:**

```powershell
python build/build_pdf.py
python build/build_data.py
python build/validate.py
node --check docs/assets/app.js
node build/tools/test_state.js
```

---

## 4. Remediación adversarial del 24/11/2026 — estado vigente

**Leer primero:** `revision/auditoria-adversarial-2026-11-24.md`, especialmente “Remediación aplicada en la versión 1.1”. El dictamen **NO APTO** correspondía al commit histórico `88f45a6`; no debe trasladarse automáticamente a esta versión ni interpretarse como cierre legal.

**Correcciones completadas:** los 4 P1, 6 P2 y 2 P3 fueron remediados en código, datos o redacción. Se cerró el XSS con allowlist/CSP; se corrigieron equilibrio, sensibilidad, caja y B2B; el estado no formal quedó condicionado; se corrigieron N1/75 %, recomendador, verificador, dependencias, accesibilidad, validador y trazabilidad. La compuerta CI quedó como plantilla en `build/ci/validate.yml`; activarla requiere permiso `workflow`.

**Verificación local:** 299 comprobaciones del validador y 18 afirmaciones de regresión hostil; ocho rutas, persistencia/exportación, escenarios, teclado y dependencias probados en Chromium. Payload por URL y almacenamiento sin ejecución ni nodos inyectados; consola/red limpias; viewport móvil sin desbordamiento. PDF de 64 páginas con índice, 164 marcadores y copias idénticas.

**Publicación:** los enlaces del encabezado sirven la versión 1.1 desde `main`. El PDF público debe conservar el hash verificado al publicar; cualquier regeneración posterior exige repetir `build_pdf.py`, `build_data.py` y `build/validate.py`.

**Siguiente paso real:** cerrar las verificaciones externas **1, 2, 4 y 10** y obtener evidencia primaria de mercado antes del primer curso o de una decisión de inversión. La remediación técnica/documental no autoriza operación, no prueba demanda y no sustituye dictamen jurídico.

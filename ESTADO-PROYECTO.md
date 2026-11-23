# ESTADO DEL PROYECTO — checkpoint de reanudación

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

- La LOE de 1980 y su Reglamento (1999) **no** son el régimen vigente: la LOE vigente es la de 2009.
- La Resolución 1791/1998 sigue citándose como norma operativa de permisos de planteles/cátedras/servicios
  educativos privados, pero fue dictada bajo la LOE de 1980. **Su vigencia y alcance deben declararse
  expresamente como punto a confirmar por escrito ante la Zona Educativa.**
- No existe una regla nacional que fije "mínimo de horas" para cursos ocupacionales. El estándar
  "120–200 horas / 75 % de asistencia" aparece en normativa **institucional universitaria** de educación
  continua/diplomados, no en una ley nacional. **No debe venderse como obligación legal general.**
- Consecuencia de diseño: la figura jurídica que **no** exige autorización educativa previa es la
  **capacitación/actualización laboral no formal para adultos**, con certificado de participación
  (no título, no "certificado de competencia laboral").

## 3. Siguiente paso

**Estado:** entregables producidos (informe de 14 capítulos + anexos, revisión adversarial, PDF de 52
páginas y sitio interactivo de 8 vistas).

**Pendiente antes de operar** (ver `revision/revision-adversarial.md`, tabla de verificaciones):

1. Texto artículo por artículo de la LOE 2009.
2. Confirmación escrita de la Zona Educativa sobre el alcance de la Resolución 1791 para adultos.
3. Numeración exacta de la LOPCYMAT sobre delegados de prevención.
4. Requisitos y tiempos actuales del registro de instancias del INCES.
5. Alcance de SENCAMER para acreditar ISO/IEC 17024.
6. Reglamento de educación continua de dos universidades candidatas.
7. Requisitos del RNP para la especialidad de capacitación.
8. Precios reales de cinco competidores en Caracas.
9. Demanda primaria de quince empleadores.
10. Opinión de un abogado venezolano independiente.

**Regenerar entregables:**

```powershell
python build/validate.py
python build/build_pdf.py
python build/build_data.py
```

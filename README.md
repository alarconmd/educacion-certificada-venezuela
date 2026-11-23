# Educación certificada para oficios · Venezuela

Informe estratégico y normativo, más un sitio interactivo, para diseñar una empresa de formación
laboral certificada en Venezuela (foco inicial: Caracas), con equipo base en Bogotá.

## Qué contiene

- **Sitio publicado:** https://alarconmd.github.io/educacion-certificada-venezuela/
- **PDF:** https://alarconmd.github.io/educacion-certificada-venezuela/informe.pdf
- **Repositorio:** https://github.com/alarconmd/educacion-certificada-venezuela

- **Informe (PDF, 52 páginas):** contexto normativo, seis figuras certificables, permisos paso a paso,
  reglas de horas y presencialidad, oficios priorizados, viaje de la empresa y del cliente, economía,
  riesgos, anexos con modelos de documentos y **revisión adversarial**.
- **Sitio interactivo:** simulador de situación, explorador de figuras, matriz de oficios, checklist de
  permisos con dependencias, viajes, calculadora económica, biblioteca de fuentes y verificador demo.
- **Datos editables:** todo el sitio y buena parte del informe se alimentan de `datos/*.json`.

## Estructura

```
informe/            capítulos en Markdown (fuente del PDF)
revision/           revisión adversarial y registro de cambios
datos/              figuras, programas, trámites, viajes, fuentes (JSON)
build/              generadores: PDF, datos del sitio, validador
docs/               sitio publicado en GitHub Pages (+ PDF)
fuentes/            gacetas, textos extraídos e imágenes de respaldo
salida/             PDF generado
```

## Regenerar

```powershell
python build/validate.py       # valida los JSON y corrige erratas conocidas
python build/build_pdf.py      # genera salida/informe-educacion-certificada-venezuela.pdf
python build/build_data.py     # genera docs/assets/data.js y copia el PDF a docs/
```

Para ver el sitio en local:

```powershell
python -m http.server 8791 --directory docs
# http://127.0.0.1:8791
```

## Publicación

El sitio se sirve desde la carpeta `docs/` de la rama `main` mediante GitHub Pages.
No requiere compilación ni dependencias: HTML, CSS y JavaScript sin frameworks.

## Advertencia

Este trabajo es un instrumento de decisión, **no un dictamen jurídico**. Distingue niveles de evidencia
(N1 norma verificada, N2 acto institucional, N3 práctica administrativa, N4 hipótesis) y enumera diez
verificaciones pendientes antes de operar. La normativa venezolana cambia por gacetas y providencias:
confirme la vigencia antes de cada lanzamiento.

## Licencia

Uso interno del equipo. Las normas citadas son de dominio público; los textos de este informe pueden
compartirse con atribución.

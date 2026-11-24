"""Genera docs/assets/data.js a partir de /datos y copia el PDF a /docs.

Uso: python build/build_data.py
Ventaja: el sitio funciona incluso abierto con file:// (sin fetch ni CORS).
"""
from __future__ import annotations

import json
import pathlib
import shutil
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
DATOS = ROOT / "datos"
DOCS = ROOT / "docs"
ASSETS = DOCS / "assets"


def main() -> int:
    ASSETS.mkdir(parents=True, exist_ok=True)
    payload = {"generado": "build/build_data.py"}
    for archivo in sorted(DATOS.glob("*.json")):
        try:
            payload[archivo.stem] = json.loads(archivo.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            print(f"ERROR en {archivo.name}: {exc}")
            return 1
    destino = ASSETS / "data.js"
    contenido = "window.DATOS = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n"
    destino.write_text(contenido, encoding="utf-8")
    print(f"data.js: {destino.stat().st_size / 1024:.1f} KB")

    pdf = ROOT / "salida" / "informe-educacion-certificada-venezuela.pdf"
    if pdf.exists():
        shutil.copy2(pdf, DOCS / "informe.pdf")
        print(f"PDF copiado: {(DOCS / 'informe.pdf').stat().st_size / 1024:.0f} KB")
    else:
        print("ERROR: no existe el PDF; ejecute antes build/build_pdf.py")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

"""Valida los JSON de /datos y corrige erratas conocidas. Uso: python build/tools/validate.py"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
DATOS = ROOT / "datos"

ERRATAS = {
    "recomendante": "recomendado",
    "yrama": "rama",
}


def main() -> int:
    errores = 0
    for archivo in sorted(DATOS.glob("*.json")):
        texto = archivo.read_text(encoding="utf-8")
        original = texto
        for mal, bien in ERRATAS.items():
            texto = texto.replace(mal, bien)
        if texto != original:
            archivo.write_text(texto, encoding="utf-8")
            print(f"corregido: {archivo.name}")
        try:
            data = json.loads(texto)
        except json.JSONDecodeError as exc:
            errores += 1
            print(f"ERROR {archivo.name}: linea {exc.lineno}, columna {exc.colno}: {exc.msg}")
            continue
        if isinstance(data, list):
            print(f"OK {archivo.name}: lista de {len(data)} elementos")
        else:
            resumen = ", ".join(f"{k}={len(v) if isinstance(v, list) else 'obj'}" for k, v in data.items())
            print(f"OK {archivo.name}: {resumen}")
    return 1 if errores else 0


if __name__ == "__main__":
    sys.exit(main())

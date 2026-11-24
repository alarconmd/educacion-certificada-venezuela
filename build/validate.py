"""Validación no destructiva de datos, informe y artefactos generados."""
from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
DATOS = ROOT / "datos"
errores: list[str] = []
comprobaciones = 0


def check(condicion: bool, mensaje: str) -> None:
    global comprobaciones
    comprobaciones += 1
    if not condicion:
        errores.append(mensaje)


def cargar(nombre: str):
    return json.loads((DATOS / f"{nombre}.json").read_text(encoding="utf-8"))


def main() -> int:
    try:
        figuras = cargar("figuras")
        programas = cargar("programas")["programas"]
        tramites = cargar("tramites")
        viajes = cargar("viajes")
        fuentes = cargar("fuentes")
    except (OSError, json.JSONDecodeError, KeyError) as exc:
        print(f"ERROR de lectura: {exc}")
        return 1

    ids_figuras = {f["id"] for f in figuras}
    ids_programas = {p["id"] for p in programas}
    ids_tramites = {t["id"] for t in tramites}
    check(len(ids_figuras) == len(figuras) == 6, "Figuras: se esperan seis ID únicos")
    check(len(ids_programas) == len(programas) == 12, "Programas: se esperan doce ID únicos")
    check(len(ids_tramites) == len(tramites), "Trámites: ID duplicados")
    for f in figuras:
        check(f.get("semaforo") in {"verde", "amarillo", "rojo"}, f"Semáforo inválido: {f.get('id')}")
        check(all(f.get(k) for k in ("nombre", "base", "autorizacion", "documento", "riesgo")), f"Figura incompleta: {f.get('id')}")
    no_formal = next(f for f in figuras if f["id"] == "capacitacion-no-formal")
    check(no_formal["semaforo"] == "amarillo" and "Condicionado" in no_formal["autorizacion"], "La ruta no formal debe permanecer condicionada")
    for p in programas:
        check(p.get("figura") in ids_figuras, f"Referencia de figura inválida: {p.get('id')}")
        check(isinstance(p.get("horas"), int) and p["horas"] > 0, f"Horas inválidas: {p.get('id')}")
        check(isinstance(p.get("horasPractica"), int) and 0 <= p["horasPractica"] <= p["horas"], f"Práctica inválida: {p.get('id')}")
    for t in tramites:
        check(bool(set(t.get("aplicaA", [])) <= ids_figuras), f"aplicaA inválido: {t.get('id')}")
        check(set(t.get("dependeDe", [])) <= ids_tramites, f"Dependencia inexistente: {t.get('id')}")
        check(t.get("id") not in t.get("dependeDe", []), f"Autodependencia: {t.get('id')}")
        check(isinstance(t.get("costoUSD"), (int, float)) and t["costoUSD"] >= 0, f"Costo inválido: {t.get('id')}")

    def visitar(id_actual: str, camino: set[str]) -> None:
        check(id_actual not in camino, f"Ciclo de dependencias: {id_actual}")
        if id_actual in camino:
            return
        actual = next(t for t in tramites if t["id"] == id_actual)
        for previo in actual.get("dependeDe", []):
            visitar(previo, camino | {id_actual})
    for t in tramites:
        visitar(t["id"], set())

    for f in fuentes:
        check(f.get("url", "").startswith("https://"), f"URL no HTTPS: {f.get('id')}")
        check(f.get("nivel") in {"N1", "N2", "N3", "N4"}, f"Nivel de fuente inválido: {f.get('id')}")
        check(bool(f.get("estadoVerificacion")), f"Estado de verificación ausente: {f.get('id')}")
        if f.get("copiaLocal"):
            copia = ROOT / f["copiaLocal"]
            check(copia.is_file(), f"Copia local inexistente: {f['copiaLocal']}")
            if copia.is_file():
                digest = hashlib.sha256(copia.read_bytes()).hexdigest()
                check(digest == f.get("sha256Copia"), f"SHA-256 desactualizado: {f['copiaLocal']}")

    escenarios = {s["id"]: s for s in viajes["escenarios"]}
    check(set(escenarios) == {"pesimista", "base", "optimista"}, "Escenarios económicos incompletos")
    esperados = {"pesimista": -39900, "base": 15120, "optimista": 71500}
    for nombre, s in escenarios.items():
        alumnos = s["cohortesAnio"] * s["alumnosPorCohorte"]
        resultado = alumnos * (s["precioPromedioUSD"] - s["costoVariableUSD"]) - s["costoFijoAnualUSD"]
        check(resultado == esperados[nombre], f"Resultado {nombre}: {resultado} != {esperados[nombre]}")
    base = escenarios["base"]
    pesimista = escenarios["pesimista"]
    equilibrio = math.ceil(pesimista["costoFijoAnualUSD"] / (pesimista["precioPromedioUSD"] - pesimista["costoVariableUSD"]))
    check(equilibrio == 456 and math.ceil(equilibrio / pesimista["alumnosPorCohorte"]) == 31, "Equilibrio pesimista debe ser 456 alumnos / 31 cohortes")

    def resultado(e: dict) -> float:
        return e["cohortes"] * e["alumnos"] * (e["precio"] - e["variable"]) - e["fijo"]
    e = {"cohortes": base["cohortesAnio"], "alumnos": base["alumnosPorCohorte"], "precio": base["precioPromedioUSD"], "variable": base["costoVariableUSD"], "fijo": base["costoFijoAnualUSD"]}
    sensibilidades = [
        ({**e, "precio": e["precio"] * .9}, 3504),
        ({**e, "alumnos": e["alumnos"] * .8}, -2304),
        ({**e, "variable": e["variable"] * 1.2}, 9312),
        ({**e, "fijo": e["fijo"] * 1.15}, 4320),
    ]
    for supuesto, esperado in sensibilidades:
        check(abs(resultado(supuesto) - esperado) < .001, f"Sensibilidad incorrecta: {resultado(supuesto)} != {esperado}")

    flujo = viajes["flujoCaja"]
    alumnos_base = base["cohortesAnio"] * base["alumnosPorCohorte"]
    check(sum(t["inscripciones"] for t in flujo) == alumnos_base, "Caja: alumnos no concilian")
    check(sum(t["ingresos"] for t in flujo) == alumnos_base * base["precioPromedioUSD"], "Caja: ingresos no concilian")
    check(sum(t["egresos"] for t in flujo) == alumnos_base * base["costoVariableUSD"] + base["costoFijoAnualUSD"], "Caja: egresos no concilian")
    acumulado = 0
    minimos = []
    for t in flujo:
        check(t["ingresos"] == t["inscripciones"] * base["precioPromedioUSD"], f"Caja: ingreso trimestral inválido {t['trimestre']}")
        check(t["egresos"] == t["inscripciones"] * base["costoVariableUSD"] + base["costoFijoAnualUSD"] // 4, f"Caja: egreso trimestral inválido {t['trimestre']}")
        acumulado += t["ingresos"] - t["egresos"]
        minimos.append(acumulado)
    check(acumulado == 15120 and min(minimos) == -11400, "Caja: cierre o déficit máximo incorrecto")
    b2b = viajes["modeloB2B"]
    check(b2b["precioContratoUSD"] == b2b["alumnosPorContrato"] * b2b["precioPorAlumnoUSD"], "B2B: precio de contrato no concilia")
    check(b2b["contribucionContratoUSD"] == b2b["alumnosPorContrato"] * (b2b["precioPorAlumnoUSD"] - b2b["costoVariableAlumnoUSD"]), "B2B: contribución no concilia")
    check(b2b["contratosBase"] * b2b["contribucionContratoUSD"] == 6375, "B2B: contribución base debe ser USD 6.375")

    economia = (ROOT / "informe/11-economia.md").read_text(encoding="utf-8")
    for texto in ("| Pesimista | 145 | 66.000 | 456 | 31", "| Precio -10 % | -11.616 | **+3.504** |", "| Alumnos -20 % | -17.424 | **-2.304** |", "| Costo variable +20 % | -5.808 | **+9.312** |", "| Costo fijo +15 % | -10.800 | **+4.320** |", "| T4 | 218 | 47.960 | 29.990 | +17.970 | +15.120 |", "USD 6.375 de contribución B2B"):
        check(texto in economia, f"Informe económico falta o difiere: {texto}")
    for antiguo in ("455 | 30", "pasa a pérdida", "+8.160", "USD 1.200-3.500"):
        check(antiguo not in economia, f"Afirmación financiera obsoleta: {antiguo}")
    for nombre in ("00-resumen.md", "01-metodo.md", "04-figuras.md", "06-horas-modalidad.md"):
        check("109" in (ROOT / "informe" / nombre).read_text(encoding="utf-8"), f"Falta atribución del art. 109 en {nombre}")

    payload = {"generado": "build/build_data.py"}
    for archivo in sorted(DATOS.glob("*.json")):
        payload[archivo.stem] = json.loads(archivo.read_text(encoding="utf-8"))
    esperado_js = "window.DATOS = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n"
    data_js = ROOT / "docs/assets/data.js"
    check(data_js.is_file() and data_js.read_text(encoding="utf-8") == esperado_js, "docs/assets/data.js no está sincronizado; ejecute build/build_data.py")
    pdf_salida = ROOT / "salida/informe-educacion-certificada-venezuela.pdf"
    pdf_docs = ROOT / "docs/informe.pdf"
    check(pdf_salida.is_file() and pdf_docs.is_file(), "Falta uno de los PDF generados")
    if pdf_salida.is_file() and pdf_docs.is_file():
        check(hashlib.sha256(pdf_salida.read_bytes()).digest() == hashlib.sha256(pdf_docs.read_bytes()).digest(), "Los PDF de salida y docs difieren")
    html = (ROOT / "docs/index.html").read_text(encoding="utf-8")
    check("Content-Security-Policy" in html and "script-src 'self'" in html, "Falta CSP defensiva")
    for comando in (["node", "--check", str(ROOT / "docs/assets/app.js")], ["node", str(ROOT / "build/tools/test_state.js")]):
        try:
            proceso = subprocess.run(comando, capture_output=True, text=True)
            check(proceso.returncode == 0, "Prueba JS: " + (proceso.stderr.strip() or proceso.stdout.strip()))
        except OSError as exc:
            check(False, f"No se pudo ejecutar {comando[1]}: {exc}")

    if errores:
        print(f"FALLARON {len(errores)} de {comprobaciones} comprobaciones:")
        for error in errores:
            print(" -", error)
        return 1
    print(f"OK: {comprobaciones} comprobaciones; datos, informe, JS y generados coherentes.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

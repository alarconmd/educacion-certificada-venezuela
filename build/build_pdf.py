"""Genera el PDF del informe a partir de los archivos Markdown de /informe.

Uso:  python build/build_pdf.py
Salida: salida/informe-educacion-certificada-venezuela.pdf
"""
from __future__ import annotations

import datetime as dt
import pathlib
import re
import sys

from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Preformatted,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.platypus.tableofcontents import TableOfContents

ROOT = pathlib.Path(__file__).resolve().parents[1]
INFORME = ROOT / "informe"
SALIDA = ROOT / "salida"
DESTINO = SALIDA / "informe-educacion-certificada-venezuela.pdf"

AZUL = colors.HexColor("#12355B")
GRIS = colors.HexColor("#5A6570")
CLARO = colors.HexColor("#EEF2F6")
AMBAR = colors.HexColor("#8A5A00")

REEMPLAZOS = {
    "\u2192": "->", "\u2190": "<-", "\u2588": "#", "\u2265": ">=", "\u2264": "<=",
    "\u2248": "~", "\u2013": "-", "\u2014": "-", "\u201c": '"', "\u201d": '"',
    "\u2018": "'", "\u2019": "'", "\u2026": "...", "\u00a0": " ", "\u2022": "-",
}

styles = getSampleStyleSheet()


def limpiar(texto: str) -> str:
    for mal, bien in REEMPLAZOS.items():
        texto = texto.replace(mal, bien)
    texto = texto.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    texto = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", texto)
    texto = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", texto)
    texto = re.sub(r"`([^`]+)`", r"<font face='Courier'>\1</font>", texto)
    texto = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)",
                   r"\1 <font size=7 color='#5A6570'>\2</font>", texto)
    return texto


S = {}
S["body"] = ParagraphStyle("body", parent=styles["BodyText"], fontName="Helvetica",
                           fontSize=9.2, leading=13.2, alignment=TA_JUSTIFY,
                           spaceAfter=4, textColor=colors.HexColor("#1A1A1A"))
S["h1"] = ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=17, leading=20,
                         textColor=AZUL, spaceBefore=6, spaceAfter=10)
S["h2"] = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=12, leading=15,
                         textColor=AZUL, spaceBefore=10, spaceAfter=5)
S["h3"] = ParagraphStyle("h3", fontName="Helvetica-Bold", fontSize=10, leading=13,
                         textColor=colors.HexColor("#2B4C6F"), spaceBefore=7, spaceAfter=3)
S["bullet"] = ParagraphStyle("bullet", parent=S["body"], leftIndent=12, bulletIndent=3, spaceAfter=2)
S["quote"] = ParagraphStyle("quote", parent=S["body"], leftIndent=14, rightIndent=10,
                            fontName="Helvetica-Oblique", textColor=colors.HexColor("#333333"),
                            backColor=CLARO, borderPadding=5, spaceBefore=4, spaceAfter=6)
S["cell"] = ParagraphStyle("cell", fontName="Helvetica", fontSize=7.4, leading=9.2)
S["head"] = ParagraphStyle("head", fontName="Helvetica-Bold", fontSize=7.4, leading=9.2,
                           textColor=colors.white)
S["code"] = ParagraphStyle("code", fontName="Courier", fontSize=7.2, leading=8.6,
                           textColor=colors.HexColor("#333333"))
S["small"] = ParagraphStyle("small", fontName="Helvetica", fontSize=7.5, leading=9.5, textColor=GRIS)
S["coverTitle"] = ParagraphStyle("ct", fontName="Helvetica-Bold", fontSize=27, leading=32,
                                 textColor=AZUL, alignment=TA_LEFT)
S["coverSub"] = ParagraphStyle("cs", fontName="Helvetica", fontSize=13, leading=18,
                               textColor=colors.HexColor("#2B4C6F"), alignment=TA_LEFT)
S["coverSmall"] = ParagraphStyle("csm", fontName="Helvetica", fontSize=9, leading=12,
                                 textColor=GRIS, alignment=TA_LEFT)


def tabla_desde_filas(filas: list[list[str]]) -> Table | None:
    if not filas or len(filas) < 2:
        return None
    ncols = max(len(f) for f in filas)
    filas = [f + [""] * (ncols - len(f)) for f in filas]
    datos = []
    for i, fila in enumerate(filas):
        estilo = S["head"] if i == 0 else S["cell"]
        datos.append([Paragraph(limpiar(c), estilo) for c in fila])
    pesos = []
    for c in range(ncols):
        largo = max(len(f[c]) for f in filas)
        pesos.append(max(6, min(largo, 46)))
    total = sum(pesos)
    ancho = 17.0 * cm
    anchos = [ancho * p / total for p in pesos]
    t = Table(datos, colWidths=anchos, repeatRows=1, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), AZUL),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#B9C4CF")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, CLARO]),
        ("LEFTPADDING", (0, 0), (-1, -1), 3.5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3.5),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    return t


def leer_capitulos() -> list[pathlib.Path]:
    archivos = sorted(INFORME.glob("*.md"))
    extra = ROOT / "revision" / "revision-adversarial.md"
    if extra.exists():
        archivos.append(extra)
    if not archivos:
        raise SystemExit("No hay archivos .md en informe/")
    return archivos


def construir_story() -> list:
    story: list = []
    hoy = dt.date.today().strftime("%d/%m/%Y")

    story.append(Spacer(1, 3.2 * cm))
    story.append(Paragraph("EDUCACIÓN CERTIFICADA<br/>PARA OFICIOS EN VENEZUELA", S["coverTitle"]))
    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph("Contexto normativo, permisos, figuras certificables y ruta de operación<br/>"
                           "para una empresa de formación laboral con base en Caracas", S["coverSub"]))
    story.append(Spacer(1, 1.2 * cm))
    story.append(HRFlowable(width="100%", thickness=2, color=AZUL))
    story.append(Spacer(1, 0.4 * cm))
    story.append(Paragraph("Informe estratégico y normativo · Versión 1.0", S["coverSmall"]))
    story.append(Paragraph(f"Bogotá / Caracas · {hoy}", S["coverSmall"]))
    story.append(Spacer(1, 2.0 * cm))
    aviso = ("<b>Aviso.</b> Este documento es un instrumento de trabajo estratégico y no sustituye "
             "una opinión jurídica firmada ni un pronunciamiento de autoridad. Distingue niveles de "
             "evidencia (N1 a N4) y señala las verificaciones pendientes antes de operar. La normativa "
             "venezolana cambia por gacetas y providencias: revise la vigencia antes de cada lanzamiento.")
    story.append(Paragraph(aviso, ParagraphStyle("aviso", parent=S["small"], fontSize=8.5, leading=11.5,
                                                 backColor=colors.HexColor("#FFF6E5"),
                                                 borderPadding=8, textColor=AMBAR)))
    story.append(Spacer(1, 0.8 * cm))
    story.append(Paragraph("14 capítulos · 6 figuras certificables · 12 programas priorizados · "
                           "ruta de permisos paso a paso · viaje de la empresa y del cliente · "
                           "revisión adversarial · anexos con modelos de documentos", S["coverSmall"]))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    story.append(Paragraph("Índice", S["h1"]))
    story.append(Paragraph("Cada capítulo comienza en una página nueva. Los títulos de sección se listan "
                           "para orientar la lectura; los marcadores del PDF permiten saltar a cada capítulo.",
                           S["small"]))
    story.append(Spacer(1, 8))
    for archivo in leer_capitulos():
        titulo = archivo.stem
        secciones: list[str] = []
        for linea in archivo.read_text(encoding="utf-8").splitlines():
            if linea.startswith("# "):
                titulo = linea[2:].strip()
            elif linea.startswith("## "):
                secciones.append(linea[3:].strip())
        story.append(Paragraph(limpiar(titulo), ParagraphStyle(
            "idx0", fontName="Helvetica-Bold", fontSize=9.6, leading=12.5,
            textColor=AZUL, spaceBefore=5)))
        if secciones:
            texto = " · ".join(secciones)
            story.append(Paragraph(limpiar(texto), ParagraphStyle(
                "idx1", fontName="Helvetica", fontSize=7.4, leading=9.6,
                textColor=GRIS, leftIndent=10, spaceAfter=2)))
    agregar_capitulos(story)
    return story


def agregar_capitulos(story: list) -> None:
    for archivo in leer_capitulos():
        lineas = archivo.read_text(encoding="utf-8").splitlines()
        i = 0
        buffer_tabla: list[list[str]] = []
        buffer_codigo: list[str] = []
        en_codigo = False

        def volcar_tabla() -> None:
            nonlocal buffer_tabla
            if not buffer_tabla:
                return
            t = tabla_desde_filas(buffer_tabla)
            if t is not None:
                story.append(Spacer(1, 3))
                story.append(t)
                story.append(Spacer(1, 6))
            buffer_tabla = []

        while i < len(lineas):
            linea = lineas[i].rstrip()
            if linea.startswith("```"):
                volcar_tabla()
                if en_codigo and buffer_codigo:
                    story.append(Preformatted("\n".join(buffer_codigo), S["code"]))
                    story.append(Spacer(1, 5))
                    buffer_codigo = []
                en_codigo = not en_codigo
                i += 1
                continue
            if en_codigo:
                buffer_codigo.append(linea)
                i += 1
                continue
            if linea.startswith("|"):
                celdas = [c.strip() for c in linea.strip().strip("|").split("|")]
                if all(re.fullmatch(r":?-{2,}:?", c) for c in celdas if c):
                    i += 1
                    continue
                buffer_tabla.append(celdas)
                i += 1
                continue
            volcar_tabla()
            if not linea.strip():
                i += 1
                continue
            if linea.startswith("# "):
                story.append(PageBreak())
                p = Paragraph(limpiar(linea[2:]), S["h1"])
                p._toc_nivel = 0
                story.append(p)
                story.append(HRFlowable(width="100%", thickness=1, color=AZUL, spaceAfter=8))
            elif linea.startswith("## "):
                p = Paragraph(limpiar(linea[3:]), S["h2"])
                p._toc_nivel = 1
                story.append(KeepTogether([Spacer(1, 2), p]))
            elif linea.startswith("### "):
                story.append(Paragraph(limpiar(linea[4:]), S["h3"]))
            elif linea.startswith(">"):
                bloque = []
                while i < len(lineas) and lineas[i].startswith(">"):
                    bloque.append(lineas[i].lstrip(">").strip())
                    i += 1
                story.append(Paragraph(limpiar(" ".join(bloque)), S["quote"]))
                continue
            elif re.match(r"^\d+\.\s", linea):
                num = re.match(r"^(\d+)\.\s", linea).group(1)
                story.append(Paragraph(limpiar(linea[len(num) + 2:]), S["bullet"], bulletText=f"{num}."))
            elif linea.startswith("- ") or linea.startswith("* "):
                texto = linea[2:]
                if texto.startswith("[ ] "):
                    texto = "□ " + texto[4:]
                story.append(Paragraph(limpiar(texto), S["bullet"], bulletText="•"))
            elif linea.strip() == "---":
                story.append(Spacer(1, 4))
                story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#B9C4CF")))
                story.append(Spacer(1, 4))
            else:
                story.append(Paragraph(limpiar(linea), S["body"]))
            i += 1
        volcar_tabla()
        if buffer_codigo:
            story.append(Preformatted("\n".join(buffer_codigo), S["code"]))


class Doc(BaseDocTemplate):
    def __init__(self, filename, **kw):
        super().__init__(filename, **kw)
        marco = Frame(2.0 * cm, 2.0 * cm, A4[0] - 4.0 * cm, A4[1] - 3.6 * cm, id="normal")
        portada = Frame(2.2 * cm, 2.0 * cm, A4[0] - 4.4 * cm, A4[1] - 4.0 * cm, id="portada")
        self.addPageTemplates([
            PageTemplate(id="cover", frames=[portada]),
            PageTemplate(id="body", frames=[marco], onPage=self.decorar),
        ])

    def decorar(self, canvas, doc):
        canvas.saveState()
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(GRIS)
        canvas.drawString(2.0 * cm, A4[1] - 1.35 * cm,
                          "Educación certificada para oficios en Venezuela · Informe estratégico y normativo")
        canvas.drawRightString(A4[0] - 2.0 * cm, A4[1] - 1.35 * cm, "Versión 1.0")
        canvas.setStrokeColor(colors.HexColor("#D5DCE3"))
        canvas.setLineWidth(0.5)
        canvas.line(2.0 * cm, A4[1] - 1.5 * cm, A4[0] - 2.0 * cm, A4[1] - 1.5 * cm)
        canvas.line(2.0 * cm, 1.6 * cm, A4[0] - 2.0 * cm, 1.6 * cm)
        canvas.drawString(2.0 * cm, 1.15 * cm, "Documento de trabajo · no sustituye opinión jurídica")
        canvas.drawRightString(A4[0] - 2.0 * cm, 1.15 * cm, f"{doc.page}")
        canvas.restoreState()

    def afterFlowable(self, flowable):
        nivel = getattr(flowable, "_toc_nivel", None)
        if nivel is None:
            return
        texto = flowable.getPlainText().strip()
        if not texto:
            return
        clave = f"h{nivel}-{self.page}-{abs(hash(texto)) % 100000}"
        self.canv.bookmarkPage(clave)
        self.canv.addOutlineEntry(texto, clave, level=0, closed=False)


def main() -> int:
    SALIDA.mkdir(exist_ok=True)
    doc = Doc(str(DESTINO), pagesize=A4, leftMargin=2.0 * cm, rightMargin=2.0 * cm,
              topMargin=2.0 * cm, bottomMargin=2.0 * cm,
              title="Educación certificada para oficios en Venezuela",
              author="Equipo de estrategia", subject="Informe normativo y estratégico")
    story = construir_story()
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=0.6, color=colors.HexColor("#B9C4CF")))
    story.append(Paragraph("Fin del informe. Anexos, matriz de fuentes y verificaciones pendientes incluidos.",
                           S["small"]))
    doc.build(story)
    print(f"PDF generado: {DESTINO}")
    print(f"Tamaño: {DESTINO.stat().st_size / 1024:.0f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())


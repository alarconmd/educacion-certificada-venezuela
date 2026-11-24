/* Educación certificada para oficios · Venezuela
   SPA sin dependencias. Estado único sincronizado con URL y localStorage. */
(() => {
  "use strict";

  const D = window.DATOS || {};
  const FIGURAS = D.figuras || [];
  const PROGRAMAS = (D.programas && D.programas.programas) || [];
  const TRAMITES = D.tramites || [];
  const VIAJES = D.viajes || { empresa: [], cliente: [], escenarios: [] };
  const FUENTES = D.fuentes || [];

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const fmt = (n) => new Intl.NumberFormat("es-VE", { maximumFractionDigits: 0 }).format(n);
  const money = (n) => "USD " + fmt(Math.round(n));

  const CLAVE = "edu-oficios-ve-v1";
  const estadoInicial = {
    perfil: "fundador", objetivo: "validar", oficio: "electricidad",
    horas: 120, modalidad: "mixta", presupuesto: 220,
    oficial: false, practica: true, tiempo: false,
    figura: "", vista: "panel", tema: "",
  };
  const ECON_BASE = VIAJES.escenarios.find((e) => e.id === "base");
  const LIMITES_ECON = {
    cohortes: [4, 48, 1], alumnos: [8, 40, 1], precio: [60, 500, 10],
    variable: [20, 150, 5], fijo: [20000, 200000, 2000],
  };
  const CAMPOS_ECON = { cohortes: "cohortesAnio", alumnos: "alumnosPorCohorte", precio: "precioPromedioUSD", variable: "costoVariableUSD", fijo: "costoFijoAnualUSD" };
  const esObjeto = (v) => !!v && typeof v === "object" && !Array.isArray(v);

  let estado = { ...estadoInicial };

  function numeroSeguro(valor, fallback, min, max, paso = 0) {
    if (typeof valor !== "number" || !Number.isFinite(valor)) return fallback;
    let n = Math.min(max, Math.max(min, valor));
    if (paso) n = min + Math.round((n - min) / paso) * paso;
    return Math.min(max, Math.max(min, n));
  }

  /* Allowlist estricta: nunca se copian propiedades desconocidas desde URL o almacenamiento. */
  function normalizarEstado(crudo) {
    const x = esObjeto(crudo) ? crudo : {};
    const limpio = { ...estadoInicial };
    if (["persona", "empresa", "fundador"].includes(x.perfil)) limpio.perfil = x.perfil;
    if (["empleo", "ascenso", "cumplimiento", "validar"].includes(x.objetivo)) limpio.objetivo = x.objetivo;
    if (PROGRAMAS.some((p) => p.id === x.oficio)) limpio.oficio = x.oficio;
    if (["virtual", "mixta", "presencial"].includes(x.modalidad)) limpio.modalidad = x.modalidad;
    if (FIGURAS.some((f) => f.id === x.figura)) limpio.figura = x.figura;
    if (["", "light", "dark"].includes(x.tema)) limpio.tema = x.tema;
    if (["panel", "figuras", "oficios", "permisos", "viajes", "economia", "verificar", "fuentes"].includes(x.vista)) limpio.vista = x.vista;
    limpio.horas = numeroSeguro(x.horas, limpio.horas, 8, 240, 4);
    limpio.presupuesto = numeroSeguro(x.presupuesto, limpio.presupuesto, 0, limpio.perfil === "fundador" ? 60000 : 2000, 10);
    ["practica", "oficial", "tiempo"].forEach((k) => {
      if (typeof x[k] === "boolean") limpio[k] = x[k];
    });
    if (esObjeto(x.econ)) {
      limpio.econ = {};
      Object.entries(LIMITES_ECON).forEach(([k, [min, max, paso]]) => {
        limpio.econ[k] = numeroSeguro(x.econ[k], ECON_BASE[CAMPOS_ECON[k]], min, max, paso);
      });
    }
    return limpio;
  }

  /* ---------- estado ---------- */
  function leerEstado() {
    try {
      const url = new URL(window.location.href);
      const raw = url.searchParams.get("s");
      if (raw) {
        const parsed = JSON.parse(decodeURIComponent(escape(atob(raw.replace(/-/g, "+").replace(/_/g, "/")))));
        estado = normalizarEstado(parsed);
        return;
      }
    } catch (e) { /* ignora URL corrupta */ }
    try {
      const raw = localStorage.getItem(CLAVE);
      if (raw) estado = normalizarEstado(JSON.parse(raw));
    } catch (e) { /* ignora almacenamiento bloqueado */ }
  }

  function guardarEstado() {
    const limpio = normalizarEstado(estado);
    try { localStorage.setItem(CLAVE, JSON.stringify(limpio)); } catch (e) { /* noop */ }
    try {
      const json = JSON.stringify(limpio);
      const b64 = btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      const url = new URL(window.location.href);
      url.searchParams.set("s", b64);
      history.replaceState(null, "", url);
    } catch (e) { /* noop */ }
  }

  function aplicarTema() {
    const oscuro = estado.tema === "dark" ||
      (!estado.tema && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = oscuro ? "dark" : "light";
  }

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("on"), 2200);
  }

  /* ---------- motor de recomendación ---------- */
  const COSTO_ENTRADA = {
    "capacitacion-no-formal": 4000, "curso-avalado": 12000, "diplomado": 22000,
    "competencias-inces": 15000, "iso17024": 35000, "tecnico-medio": 60000,
  };
  const VALOR_OFICIAL = {
    "competencias-inces": 3, "iso17024": 2, "tecnico-medio": 3,
    "diplomado": 2, "curso-avalado": 1, "capacitacion-no-formal": 0,
  };

  function puntuarFigura(f) {
    let s = 55;
    const razones = [];
    const programa = PROGRAMAS.find((p) => p.id === estado.oficio);
    if (estado.oficial) {
      const v = VALOR_OFICIAL[f.id] || 0;
      s += v >= 2 ? v * 9 : -28;
      razones.push(v >= 2 ? "Tiene valor oficial o institucional" : "No satisface por sí sola el requisito oficial");
    } else if (["capacitacion-no-formal", "curso-avalado"].includes(f.id)) {
      s += 12;
      razones.push("Compatible con una validación inicial, sujeta a sus compuertas");
    }
    if (!estado.practica && ["tecnico-medio", "iso17024", "competencias-inces"].includes(f.id)) {
      s -= 18;
      razones.push("Exige práctica o evaluación presencial");
    }
    if (!estado.tiempo && ["tecnico-medio", "iso17024", "competencias-inces"].includes(f.id)) {
      s -= 20;
      razones.push("Requiere meses de trámite");
    }
    if (estado.tiempo && ["competencias-inces", "curso-avalado"].includes(f.id)) s += 8;
    if (estado.perfil === "fundador") {
      const costo = COSTO_ENTRADA[f.id] || 0;
      if (estado.presupuesto < costo) {
        s -= 15;
        razones.push(`Costo de entrada ${money(costo)} superior al capital declarado`);
      }
    }
    if (programa && programa.figura === f.id) {
      s += 4;
      razones.push("Coherente con el oficio seleccionado");
    }
    if (f.id === "diplomado" && estado.horas < 120) {
      s -= 12;
      razones.push("Disponibilidad inferior a la referencia institucional de 120 h");
    }
    if (f.id === "curso-avalado" && estado.horas < 40) {
      s -= 6;
      razones.push("Disponibilidad corta para un curso avalado con práctica");
    }
    if (f.id === "tecnico-medio") {
      s -= 20;
      razones.push("Plan formal plurianual: no equivale a las horas de un curso");
      if (estado.modalidad === "virtual") {
        s -= 25;
        razones.push("La media técnica no puede resolverse como curso 100 % virtual");
      }
    }
    if (estado.modalidad === "virtual" && ["competencias-inces", "iso17024"].includes(f.id)) {
      s -= 8;
      razones.push("La evaluación práctica debe resolverse fuera de la virtualidad");
    }
    if (estado.objetivo === "cumplimiento" && f.id === "capacitacion-no-formal") {
      s += 6;
      razones.push("Puede documentar formación interna; no cierra por sí sola la compuerta jurídica");
    }
    if (estado.objetivo === "ascenso" && ["curso-avalado", "diplomado"].includes(f.id)) {
      s += 10;
      razones.push("Puede sumar para ascenso si el empleador la acepta");
    }
    if (estado.objetivo === "empleo" && ["competencias-inces", "curso-avalado"].includes(f.id)) s += 6;
    if (estado.perfil === "empresa" && f.id === "capacitacion-no-formal") {
      s += 8;
      razones.push("Formato comprable por una empresa, sujeto a alcance legal");
    }
    if (estado.perfil === "persona" && f.id === "iso17024") s += 4;
    return { figura: f, score: Math.max(5, Math.min(98, Math.round(s))), razones };
  }

  function rankingFiguras() {
    return FIGURAS.map(puntuarFigura).sort((a, b) => b.score - a.score);
  }

  function figuraActual() {
    if (estado.figura) return FIGURAS.find((f) => f.id === estado.figura) || FIGURAS[0];
    const r = rankingFiguras();
    return r.length ? r[0].figura : null;
  }

  function programaActual() {
    return PROGRAMAS.find((p) => p.id === estado.oficio) || PROGRAMAS[0] || null;
  }

  function precioEstimado(p) {
    const base = p.horas * 1.15 + 35;
    return Math.round(p.modalidad === "presencial" ? base * 1.2 : base);
  }

  function compatibilidadPrograma(p) {
    let s = 50;
    s += estado.modalidad === p.modalidad ? 18 : (estado.modalidad === "mixta" || p.modalidad === "mixta" ? 8 : -6);
    const dif = Math.abs(estado.horas - p.horas);
    s += Math.max(-25, 15 - dif / 8);
    const precio = precioEstimado(p);
    s += estado.presupuesto >= precio ? 12 : Math.max(-20, (estado.presupuesto - precio) / 12);
    s += p.demanda * 3 - p.riesgo * 2;
    if (!estado.practica && p.horasPractica > 0) s -= 14;
    return Math.max(5, Math.min(99, Math.round(s)));
  }

  function rankingProgramas() {
    return PROGRAMAS.map((p) => ({ ...p, score: compatibilidadPrograma(p) })).sort((a, b) => b.score - a.score);
  }

  /* ---------- router ---------- */
  const VISTAS = ["panel", "figuras", "oficios", "permisos", "viajes", "economia", "fuentes", "verificar"];

  function ruta() {
    const h = (location.hash || "#/panel").replace(/^#\/?/, "");
    return VISTAS.includes(h) ? h : "panel";
  }

  function navegar() {
    const v = ruta();
    estado.vista = v;
    $$(".view").forEach((s) => s.classList.toggle("on", s.id === "view-" + v));
    $$(".nav a").forEach((a) => a.classList.toggle("on", a.dataset.route === v));
    renderizar(v);
    $("#main").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderizar(v) {
    if (v === "panel") renderPanel();
    if (v === "figuras") renderFiguras();
    if (v === "oficios") renderOficios();
    if (v === "permisos") renderPermisos();
    if (v === "viajes") renderViajes();
    if (v === "economia") renderEconomia();
    if (v === "fuentes") renderFuentes();
    if (v === "verificar") renderVerificar();
    actualizarMini();
  }

  function actualizarMini() {
    const f = figuraActual();
    const p = programaActual();
    const mf = $("#mini-figura");
    const mp = $("#mini-programa");
    const ms = $("#mini-semaforo");
    if (mf) mf.textContent = f ? f.nombre : "—";
    if (mp) mp.textContent = p ? p.nombre : "—";
    if (ms && f) {
      ms.textContent = f.semaforo === "verde" ? "Verde" : f.semaforo === "amarillo" ? "Amarillo" : "Rojo";
      ms.className = "semaforo sem-" + f.semaforo;
    }
  }

  /* ---------- componentes ---------- */
  function semaforoHTML(valor) {
    const txt = valor === "verde" ? "Riesgo bajo" : valor === "amarillo" ? "Riesgo medio" : "Riesgo alto";
    return `<span class="semaforo sem-${esc(valor)}">${txt}</span>`;
  }

  function barra(score) {
    const clase = score >= 70 ? "" : score >= 45 ? " warn" : " bad";
    return `<div class="bar${clase}"><i style="width:${Math.max(4, Math.min(100, score))}%"></i></div>`;
  }

  function alActivar(elemento, accion) {
    elemento.addEventListener("click", accion);
    elemento.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        accion();
      }
    });
  }

  function cardPrograma(p) {
    return `<article class="card click" data-programa="${esc(p.id)}" tabindex="0" role="button" aria-label="Seleccionar ${esc(p.nombre)}">
      <div class="row"><h3>${esc(p.nombre)}</h3><span class="spacer"></span>${semaforoHTML(p.riesgo >= 4 ? "rojo" : p.riesgo >= 3 ? "amarillo" : "verde")}</div>
      <p>${esc(p.cluster)} · ${p.horas} h · ${p.horasPractica} h de práctica · ${esc(p.modalidad)}</p>
    </article>`;
  }

  /* ---------- panel ---------- */
  function renderPanel() {
    const f = figuraActual();
    const p = programaActual();
    const ranking = rankingFiguras();
    const rp = rankingProgramas();
    const mejor = rp[0];
    const precio = p ? precioEstimado(p) : 0;
    const tramites = TRAMITES.filter((t) => t.aplicaA.includes(f.id));
    const bloqueantes = tramites.filter((t) => t.criticidad === "bloqueante").length;
    const hechos = tramites.filter((t) => progreso()[t.id]).length;

    $("#view-panel").innerHTML = `
      <div class="hero">
        <div class="chips">
          <span class="chip">Perfil: ${esc(estado.perfil)}</span>
          <span class="chip">Objetivo: ${esc(estado.objetivo)}</span>
          <span class="chip">${estado.oficial ? "Credencial oficial requerida" : "Sin requisito de credencial oficial"}</span>
          <span class="chip">${estado.practica ? "Práctica disponible" : "Sin práctica presencial"}</span>
        </div>
        <h2>${esc(f.nombre)}</h2>
        <p>${esc(f.emisor)}</p>
      </div>

      <div class="grid g2">
        <article class="card">
          <div class="row"><h3>Recomendación para tu situación</h3><span class="spacer"></span>${semaforoHTML(f.semaforo)}</div>
          <p>${esc(f.cuando)}</p>
          <div class="kpi">
            <div><span>Índice heurístico</span><strong>${(ranking.find((r) => r.figura.id === f.id) || ranking[0]).score}/100</strong></div>
            <div><span>Costo de entrada</span><strong>${money(COSTO_ENTRADA[f.id] || 0)}</strong></div>
            <div><span>Horas</span><strong>${esc(f.horas)}</strong></div>
          </div>
          <div class="bars">
            ${ranking.slice(0, 4).map((r) => `<div class="row"><span>${esc(r.figura.nombre)}</span>${barra(r.score)}<strong>${r.score}/100</strong></div>`).join("")}
          </div>
          <div class="note strong" style="margin-top:10px"><strong>Compuerta jurídica:</strong> ${esc(f.autorizacion)}</div>
          <p class="small">Índice ordinal para comparar alternativas; no es una probabilidad ni un porcentaje validado.</p>
        </article>

        <article class="card">
          <h3>Qué emitir y bajo qué condiciones</h3>
          <p><strong>Documento:</strong> ${esc(f.documento)}</p>
          <p><strong>Autorización:</strong> ${esc(f.autorizacion)}</p>
          <p><strong>Modalidad:</strong> ${esc(f.modalidad)}</p>
          <p><strong>Valor:</strong> ${esc(f.valor)}</p>
          <div class="note">${esc(f.riesgo)}</div>
        </article>
      </div>

      <div class="grid g3">
        <article class="card">
          <h3>Programa sugerido</h3>
          ${p ? `<p><strong>${esc(p.nombre)}</strong><br/>${p.horas} h · ${p.horasPractica} h de práctica · ${esc(p.modalidad)}</p>
          <div class="kpi"><div><span>Precio estimado</span><strong>${money(precio)}</strong></div><div><span>Índice heurístico</span><strong>${compatibilidadPrograma(p)}/100</strong></div></div>
          <p class="small">${esc(p.salida)}</p>` : "<p>Sin programa seleccionado.</p>"}
        </article>
        <article class="card">
          <h3>Ruta de permisos</h3>
          <div class="big">${hechos}/${tramites.length}</div>
          <p class="sub">trámites marcados como hechos · ${bloqueantes} bloqueantes</p>
          ${barra(tramites.length ? (hechos / tramites.length) * 100 : 0)}
          <p class="small" style="margin-top:8px"><a href="#/permisos">Abrir checklist →</a></p>
        </article>
        <article class="card">
          <h3>Siguiente decisión</h3>
          <p>${estado.tiempo ? "Con tiempo disponible, puedes evaluar aval y competencias; ninguna ruta queda autorizada automáticamente." : "Con poco tiempo, prepara un piloto no formal y evidencia, pero no lo ofrezcas hasta cerrar la compuerta jurídica."}</p>
          <p class="small">${esc((ranking.find((r) => r.figura.id === f.id) || ranking[0]).razones.join(" · ") || "Sin restricciones detectadas")}</p>
        </article>
      </div>

      <div class="grid g2">
        <article class="card">
          <h3>Las 3 cosas que no se deben hacer</h3>
          <ol class="small">
            <li>Llamar “título”, “diplomado” o “certificación oficial” a un curso propio.</li>
            <li>Prometer empleo o colocación inmediata.</li>
            <li>Usar la marca INCES o MPPE sin autorización.</li>
          </ol>
          <p class="small"><a href="#/figuras">Ver las 6 figuras certificables →</a></p>
        </article>
        <article class="card">
          <h3>Datos rápidos</h3>
          <div class="kpi">
            <div><span>Figuras</span><strong>${FIGURAS.length}</strong></div>
            <div><span>Programas</span><strong>${PROGRAMAS.length}</strong></div>
            <div><span>Trámites</span><strong>${TRAMITES.length}</strong></div>
            <div><span>Fuentes</span><strong>${FUENTES.length}</strong></div>
          </div>
          <p class="small" style="margin-top:8px">Mejor índice heurístico de programa: <strong>${esc(mejor ? mejor.nombre : "—")}</strong> (${mejor ? mejor.score : 0}/100).</p>
        </article>
      </div>
    `;
    $$("#view-panel [data-programa]").forEach((c) => alActivar(c, () => seleccionarPrograma(c.dataset.programa)));
  }

  function seleccionarPrograma(id) {
    const p = PROGRAMAS.find((x) => x.id === id);
    if (!p) return;
    estado.oficio = p.id;
    estado.horas = p.horas;
    estado.modalidad = p.modalidad;
    sincronizarControles();
    guardarEstado();
    renderizar(ruta());
    toast(`Programa aplicado: ${p.nombre}`);
  }

  /* ---------- figuras ---------- */
  function renderFiguras() {
    const actual = figuraActual();
    const programas = PROGRAMAS.filter((p) => p.figura === actual.id);
    $("#view-figuras").innerHTML = `
      <div class="hero">
        <h2>Seis figuras, seis niveles de legitimidad</h2>
        <p>La diferencia entre un curso propio y un título no es el diseño del certificado: es quién lo emite y con qué autorización. Selecciona una figura para ver su alcance, su riesgo y los programas compatibles.</p>
      </div>
      <div class="grid g3">
        ${FIGURAS.map((f) => `
          <article class="card click ${f.id === actual.id ? "sel" : ""}" data-figura="${esc(f.id)}" tabindex="0" role="button" aria-pressed="${f.id === actual.id ? "true" : "false"}">
            <h3>${esc(f.nombre)}</h3>
            <p>${esc(f.emisor)}</p>
            <div class="row">${semaforoHTML(f.semaforo)}<span class="chip dark">${esc(f.horas)}</span></div>
          </article>`).join("")}
      </div>
      <div class="grid g2">
        <article class="card">
          <h3>${esc(actual.nombre)}</h3>
          <p><strong>Base:</strong> ${esc(actual.base)}</p>
          <p><strong>Documento:</strong> ${esc(actual.documento)}</p>
          <p><strong>Valor:</strong> ${esc(actual.valor)}</p>
          <p><strong>Riesgo:</strong> ${esc(actual.riesgo)}</p>
          <div class="note">${esc(actual.autorizacion)}</div>
          <p class="small" style="margin-top:10px"><a href="#/permisos">Ver trámites de esta figura →</a></p>
        </article>
        <article class="card">
          <h3>Programas compatibles</h3>
          ${programas.length ? `<div class="grid" style="margin-top:6px">${programas.map((p) => cardPrograma(p)).join("")}</div>`
            : `<p>Ningún programa del catálogo usa esta figura como salida inicial. Puede aplicarse como fase posterior.</p>`}
        </article>
      </div>
    `;
    $$("#view-figuras [data-figura]").forEach((c) => alActivar(c, () => {
      estado.figura = c.dataset.figura;
      guardarEstado();
      renderizar("figuras");
      actualizarMini();
    }));
    $$("#view-figuras [data-programa]").forEach((c) => alActivar(c, () => seleccionarPrograma(c.dataset.programa)));
  }

  /* ---------- oficios ---------- */
  const filtros = { cluster: "", modalidad: "", demanda: 0, riesgo: 5, q: "" };

  function renderOficios() {
    const clusters = [...new Set(PROGRAMAS.map((p) => p.cluster))];
    const lista = PROGRAMAS.filter((p) =>
      (!filtros.cluster || p.cluster === filtros.cluster) &&
      (!filtros.modalidad || p.modalidad === filtros.modalidad) &&
      p.demanda >= filtros.demanda &&
      p.riesgo <= filtros.riesgo &&
      (!filtros.q || (p.nombre + " " + p.salida + " " + p.nota).toLowerCase().includes(filtros.q.toLowerCase()))
    ).sort((a, b) => (b.demanda - b.riesgo) - (a.demanda - a.riesgo));

    $("#view-oficios").innerHTML = `
      <div class="hero">
        <h2>12 oficios priorizados para Caracas</h2>
        <p>El índice de demanda es una hipótesis de priorización (1-5), no una estadística. Recalíbralo cada trimestre con ofertas reales y entrevistas a empleadores. La columna de riesgo anticipa la exposición legal y de seguridad.</p>
      </div>
      <div class="filters">
        <label>Cluster<select id="f-cluster"><option value="">Todos</option>${clusters.map((c) => `<option ${filtros.cluster === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select></label>
        <label>Modalidad<select id="f-modalidad"><option value="">Todas</option>${["virtual", "mixta", "presencial"].map((m) => `<option ${filtros.modalidad === m ? "selected" : ""}>${m}</option>`).join("")}</select></label>
        <label>Demanda mínima<input id="f-demanda" type="range" min="1" max="5" value="${filtros.demanda}" /></label>
        <label>Riesgo máximo<input id="f-riesgo" type="range" min="1" max="5" value="${filtros.riesgo}" /></label>
        <label>Buscar<input id="f-q" type="search" value="${esc(filtros.q)}" placeholder="oficio, salida, nota" /></label>
        <button id="f-limpiar" class="ghost">Limpiar</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Oficio</th><th>Cluster</th><th>Horas</th><th>Práctica</th><th>Demanda</th><th>Riesgo</th><th>Figura</th></tr></thead>
          <tbody>
            ${lista.map((p) => `<tr>
              <td><button type="button" class="btn-link" data-oficio="${esc(p.id)}">${esc(p.nombre)}</button><br/><span class="muted small">${esc(p.salida)}</span></td>
              <td>${esc(p.cluster)}</td><td>${p.horas}</td><td>${p.horasPractica} h</td>
              <td>${"●".repeat(p.demanda)}${"○".repeat(5 - p.demanda)}</td>
              <td>${"●".repeat(p.riesgo)}${"○".repeat(5 - p.riesgo)}</td>
              <td class="small">${esc((FIGURAS.find((f) => f.id === p.figura) || {}).nombre || p.figura)}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <p class="small muted">${lista.length} programas visibles de ${PROGRAMAS.length}.</p>
      <div id="detalle-oficio" class="grid g2"></div>
    `;
    const aplicar = () => {
      filtros.cluster = $("#f-cluster").value;
      filtros.modalidad = $("#f-modalidad").value;
      filtros.demanda = Number($("#f-demanda").value);
      filtros.riesgo = Number($("#f-riesgo").value);
      filtros.q = $("#f-q").value;
      renderizar("oficios");
    };
    ["f-cluster", "f-modalidad", "f-demanda", "f-riesgo"].forEach((id) => $("#" + id).addEventListener("change", aplicar));
    $("#f-q").addEventListener("input", () => { clearTimeout(renderOficios._t); renderOficios._t = setTimeout(aplicar, 250); });
    $("#f-limpiar").addEventListener("click", () => { Object.assign(filtros, { cluster: "", modalidad: "", demanda: 0, riesgo: 5, q: "" }); renderizar("oficios"); });
    $$("#view-oficios [data-oficio]").forEach((tr) => tr.addEventListener("click", () => mostrarDetalleOficio(tr.dataset.oficio)));
  }

  function mostrarDetalleOficio(id) {
    const p = PROGRAMAS.find((x) => x.id === id);
    if (!p) return;
    const f = FIGURAS.find((x) => x.id === p.figura) || {};
    $("#detalle-oficio").innerHTML = `
      <article class="card">
        <div class="row"><h3>${esc(p.nombre)}</h3><span class="spacer"></span>${semaforoHTML(p.riesgo >= 4 ? "rojo" : p.riesgo >= 3 ? "amarillo" : "verde")}</div>
        <p>${esc(p.cluster)} · ${p.horas} h totales · ${p.horasPractica} h de práctica · ${esc(p.modalidad)}</p>
        <p><strong>Requisitos:</strong> ${esc(p.requisitos)}</p>
        <p><strong>Práctica:</strong> ${esc(p.practica)}</p>
        <p><strong>Salida laboral:</strong> ${esc(p.salida)}</p>
        <p><strong>Normas y referencias:</strong> ${esc(p.normas)}</p>
        <div class="note">${esc(p.nota)}</div>
      </article>
      <article class="card">
        <h3>Encaje y siguiente paso</h3>
        <div class="kpi">
          <div><span>Índice heurístico</span><strong>${compatibilidadPrograma(p)}/100</strong></div>
          <div><span>Precio estimado</span><strong>${money(precioEstimado(p))}</strong></div>
          <div><span>Figura inicial</span><strong>${esc(f.nombre || p.figura)}</strong></div>
        </div>
        <p class="small" style="margin-top:10px">Semáforo de la figura: ${semaforoHTML(f.semaforo || "amarillo")}</p>
        <div class="row" style="margin-top:10px">
          <button class="primary" id="usar-oficio">Usar este programa en mi simulación</button>
          <a class="btn" href="#/permisos">Ver permisos</a>
        </div>
      </article>`;
    $("#usar-oficio").addEventListener("click", () => seleccionarPrograma(p.id));
  }

  /* ---------- permisos ---------- */
  const CLAVE_CHECK = CLAVE + "-check";

  function progreso() {
    try {
      const raw = JSON.parse(localStorage.getItem(CLAVE_CHECK));
      if (!esObjeto(raw)) return {};
      return Object.fromEntries(Object.entries(raw).filter(([k, v]) => /^[a-zA-Z0-9_-]+$/.test(k) && typeof v === "boolean"));
    } catch (e) { return {}; }
  }

  function marcar(id, valor) {
    const p = progreso();
    const tramite = TRAMITES.find((t) => t.id === id);
    if (valor && tramite && (tramite.dependeDe || []).some((d) => !p[d])) return false;
    p[id] = valor;
    if (!valor) {
      const limpiarDependientes = (previo) => {
        TRAMITES.filter((t) => (t.dependeDe || []).includes(previo)).forEach((t) => {
          if (p[t.id]) {
            p[t.id] = false;
            limpiarDependientes(t.id);
          }
        });
      };
      limpiarDependientes(id);
    }
    try { localStorage.setItem(CLAVE_CHECK, JSON.stringify(p)); } catch (e) { /* noop */ }
    return true;
  }

  function ordenarPorDependencia(items) {
    const byId = Object.fromEntries(items.map((i) => [i.id, i]));
    const memo = {};
    const nivel = (id, visto = new Set()) => {
      if (memo[id] != null) return memo[id];
      if (visto.has(id)) return 0;
      visto.add(id);
      const it = byId[id];
      if (!it || !it.dependeDe || !it.dependeDe.length) return (memo[id] = 0);
      const previos = it.dependeDe.filter((d) => byId[d]).map((d) => nivel(d, visto) + 1);
      return (memo[id] = previos.length ? Math.max(...previos) : 0);
    };
    return items.slice().sort((a, b) => nivel(a.id) - nivel(b.id) || a.nombre.localeCompare(b.nombre));
  }

  function renderPermisos() {
    const f = figuraActual();
    const items = ordenarPorDependencia(TRAMITES.filter((t) => t.aplicaA.includes(f.id)));
    const p = progreso();
    const hechos = items.filter((t) => p[t.id]).length;
    const pct = items.length ? Math.round((hechos / items.length) * 100) : 0;
    const costo = items.reduce((s, t) => s + (t.costoUSD || 0), 0);

    $("#view-permisos").innerHTML = `
      <div class="hero">
        <h2>Ruta de permisos: ${esc(f.nombre)}</h2>
        <p>Los trámites están ordenados por dependencia: no se puede registrar la instancia INCES antes de la autorización ministerial, ni operar sin RIF. Marca lo que ya tienes; el avance se guarda en tu navegador.</p>
      </div>
      <div class="grid g3">
        <article class="card"><h3>Avance</h3><div class="big">${hechos}/${items.length}</div>${barra(pct)}<p class="sub" style="margin-top:6px">${pct}% de la ruta</p></article>
        <article class="card"><h3>Costo estimado</h3><div class="big">${money(costo)}</div><p class="sub">tasas y honorarios, sin IVA</p></article>
        <article class="card"><h3>Camino crítico</h3><div class="big">${items.filter((t) => t.criticidad === "bloqueante").length}</div><p class="sub">trámites bloqueantes</p></article>
      </div>
      <div class="row" style="margin:16px 0">
        <a class="btn" href="#/figuras">Cambiar figura</a>
        <button id="marcar-bloqueantes" class="ghost">Marcar bloqueantes + previos</button>
        <button id="limpiar-permisos" class="ghost">Limpiar</button>
        <button id="imprimir" class="ghost">Imprimir</button>
      </div>
      <div class="checklist">
        ${items.map((t) => {
          const listo = !!p[t.id];
          const faltan = (t.dependeDe || []).filter((d) => items.some((x) => x.id === d) && !p[d]);
          const bloqueado = faltan.length > 0 && !listo;
          return `<label class="check-item ${esc(t.criticidad)} ${listo && !faltan.length ? "ok" : ""}">
            <input type="checkbox" data-check="${esc(t.id)}" ${listo ? "checked" : ""} ${bloqueado ? "disabled" : ""} />
            <div>
              <h4>${esc(t.nombre)}</h4>
              <p><strong>${esc(t.autoridad)}</strong> · ${esc(t.plazo)} · ${money(t.costoUSD || 0)}</p>
              <p>${esc(t.nota)}</p>
              <p class="small"><strong>Documentos:</strong> ${t.docs.map(esc).join(" · ")}</p>
              ${faltan.length ? `<p class="small" style="color:var(--amber)">Requiere antes: ${faltan.map((d) => esc((items.find((x) => x.id === d) || {}).nombre || d)).join(", ")}</p>` : ""}
              ${listo && faltan.length ? `<p class="small" style="color:var(--red)">Marcado heredado fuera de secuencia: desmárcalo y completa los previos.</p>` : ""}
            </div>
            <span class="tag">${esc(t.criticidad)}</span>
          </label>`;
        }).join("")}
      </div>
      <div class="note" style="margin-top:16px">La ruta es una guía de secuencia, no un contrato. Los plazos y costos son estimaciones y deben confirmarse con cada autoridad. La consulta a la Zona Educativa (anexo D1 del informe) es el paso que cierra la zona gris.</div>
    `;
    $$("#view-permisos [data-check]").forEach((c) => c.addEventListener("change", () => {
      if (!marcar(c.dataset.check, c.checked)) toast("Completa primero los trámites prerequisitos");
      renderizar("permisos");
    }));
    $("#marcar-bloqueantes").addEventListener("click", () => {
      const ids = new Set();
      const agregarConPrevios = (id) => {
        if (ids.has(id)) return;
        ids.add(id);
        const t = TRAMITES.find((x) => x.id === id);
        (t && t.dependeDe ? t.dependeDe : []).forEach(agregarConPrevios);
      };
      items.filter((t) => t.criticidad === "bloqueante").forEach((t) => agregarConPrevios(t.id));
      ordenarPorDependencia(TRAMITES.filter((t) => ids.has(t.id))).forEach((t) => marcar(t.id, true));
      renderizar("permisos");
      toast("Bloqueantes y prerequisitos marcados");
    });
    $("#limpiar-permisos").addEventListener("click", () => {
      items.forEach((t) => marcar(t.id, false));
      renderizar("permisos");
    });
    $("#imprimir").addEventListener("click", () => window.print());
  }

  /* ---------- viajes ---------- */
  let viajeTab = "empresa";

  function renderViajes() {
    const lista = viajeTab === "empresa" ? VIAJES.empresa : VIAJES.cliente;
    const esEmpresa = viajeTab === "empresa";
    $("#view-viajes").innerHTML = `
      <div class="hero">
        <h2>Dos viajes que deben encajar</h2>
        <p>El de la empresa que construye la operación y el de la persona que compra el curso. Si el viaje del cliente tiene más fricción que el de la empresa, el proyecto no despega; si el de la empresa es más corto, se promete lo que no se puede cumplir.</p>
      </div>
      <div class="row" style="margin:16px 0">
        <button id="tab-empresa" class="${esEmpresa ? "primary" : "ghost"}">Viaje de la empresa</button>
        <button id="tab-cliente" class="${!esEmpresa ? "primary" : "ghost"}">Viaje del cliente</button>
        <span class="spacer"></span>
        <span class="chip dark">${lista.length} etapas</span>
      </div>
      <div class="timeline">
        ${lista.map((s, i) => {
          const id = `viaje-${viajeTab}-${s.n}`;
          const hecho = !!progreso()[id];
          return `<article class="step ${hecho ? "done" : ""}" data-step="${i}">
            <div class="num">${hecho ? "✓" : (s.n != null ? s.n : i + 1)}</div>
            <div>
              <h4>${esc(esEmpresa ? s.nombre : s.etapa)}</h4>
              <p>${esc(esEmpresa ? s.objetivo : s.queHace)}</p>
            </div>
            <div class="meta">${esc(esEmpresa ? s.duracion : s.canal)}</div>
            <div class="extra">
              ${esEmpresa ? `
                <p><strong>Entregables:</strong> ${(s.entregables || []).map(esc).join(" · ")}</p>
                <p><strong>Decisión:</strong> ${esc(s.decision)}</p>
                <p><strong>Riesgo:</strong> ${esc(s.riesgo)}</p>
                <p><strong>KPI:</strong> ${esc(s.kpi)}</p>
              ` : `
                <p><strong>Qué necesita:</strong> ${esc(s.queNecesita)}</p>
                <p><strong>Fricción típica:</strong> ${esc(s.friccion)}</p>
                <p><strong>Nuestro rol:</strong> ${esc(s.nuestroRol)}</p>
              `}
              <label class="check"><input type="checkbox" data-viaje="${esc(id)}" ${hecho ? "checked" : ""} /> Marcar etapa como completada</label>
            </div>
          </article>`;
        }).join("")}
      </div>
      <div class="grid g2">
        <article class="card">
          <h3>Regla de coherencia</h3>
          <p>Ninguna etapa del viaje del cliente puede prometer algo que la etapa equivalente de la empresa no haya producido. Si el anuncio promete verificación, el verificador debe existir antes.</p>
        </article>
        <article class="card">
          <h3>Tu configuración actual</h3>
          <p>Perfil <strong>${esc(estado.perfil)}</strong>, objetivo <strong>${esc(estado.objetivo)}</strong>. ${estado.oficial ? "Con requisito de credencial oficial, el viaje se alarga: aval o INCES antes de vender." : "Sin requisito oficial, el viaje puede acortarse con capacitación no formal y verificación propia."}</p>
          <p class="small"><a href="#/economia">Ver si el modelo cierra económicamente →</a></p>
        </article>
      </div>
    `;
    $("#tab-empresa").addEventListener("click", () => { viajeTab = "empresa"; renderizar("viajes"); });
    $("#tab-cliente").addEventListener("click", () => { viajeTab = "cliente"; renderizar("viajes"); });
    $$("#view-viajes .step").forEach((s) => s.addEventListener("click", (ev) => {
      if (ev.target.closest("input")) return;
      s.classList.toggle("open");
    }));
    $$("#view-viajes [data-viaje]").forEach((c) => c.addEventListener("change", () => {
      marcar(c.dataset.viaje, c.checked);
      renderizar("viajes");
    }));
  }

  /* ---------- economía ---------- */
  const econBase = (VIAJES.escenarios || []).find((e) => e.id === "base") || {
    cohortesAnio: 24, alumnosPorCohorte: 22, precioPromedioUSD: 220,
    costoVariableUSD: 55, costoFijoAnualUSD: 72000,
  };

  function econActual() {
    if (!estado.econ) {
      estado.econ = {
        cohortes: econBase.cohortesAnio, alumnos: econBase.alumnosPorCohorte,
        precio: econBase.precioPromedioUSD, variable: econBase.costoVariableUSD,
        fijo: econBase.costoFijoAnualUSD,
      };
    }
    return estado.econ;
  }

  function calcular(e) {
    const estudiantes = e.cohortes * e.alumnos;
    const ingreso = estudiantes * e.precio;
    const variable = estudiantes * e.variable;
    const contribucion = ingreso - variable;
    const resultado = contribucion - e.fijo;
    const breakeven = e.precio > e.variable ? Math.ceil(e.fijo / (e.precio - e.variable)) : Infinity;
    const margen = ingreso ? (contribucion / ingreso) * 100 : 0;
    return { estudiantes, ingreso, variable, contribucion, resultado, breakeven, margen };
  }

  function pintarEconomia() {
    const e = econActual();
    const r = calcular(e);
    const escenarios = VIAJES.escenarios || [];
    const b2b = VIAJES.modeloB2B;
    const flujo = VIAJES.flujoCaja || [];
    let acumulado = 0;
    const caja = $("#econ-out");
    if (!caja) return;
    caja.innerHTML = `
      <div class="grid g2">
        <article class="card">
          <h3>Resultado</h3>
          <div class="big" style="color:${r.resultado >= 0 ? "var(--green)" : "var(--red)"}">${money(r.resultado)}</div>
          <p class="sub">resultado antes de impuestos</p>
          <div class="kpi" style="margin-top:10px">
            <div><span>Estudiantes/año</span><strong>${fmt(r.estudiantes)}</strong></div>
            <div><span>Ingreso</span><strong>${money(r.ingreso)}</strong></div>
            <div><span>Contribución</span><strong>${money(r.contribucion)}</strong></div>
            <div><span>Margen</span><strong>${r.margen.toFixed(1)}%</strong></div>
          </div>
          <p class="small" style="margin-top:10px">Punto de equilibrio: <strong>${Number.isFinite(r.breakeven) ? fmt(r.breakeven) + " alumnos/año" : "no alcanzable"}</strong>${Number.isFinite(r.breakeven) ? ` (${Math.ceil(r.breakeven / e.alumnos)} cohortes enteras)` : ""}.</p>
          ${barra(Math.max(0, Math.min(100, (r.contribucion / Math.max(e.fijo, 1)) * 100)))}
          <p class="small">Contribución frente a costo fijo. Si la barra no llega al 100 %, el año cierra en pérdida.</p>
        </article>
        <article class="card">
          <h3>Sensibilidad</h3>
          <table>
            <tbody>
              <tr><td>Precio -10 %</td><td class="right">${money(calcular({ ...e, precio: e.precio * 0.9 }).resultado)}</td></tr>
              <tr><td>Alumnos -20 %</td><td class="right">${money(calcular({ ...e, alumnos: Math.max(1, e.alumnos * 0.8) }).resultado)}</td></tr>
              <tr><td>Costo variable +20 %</td><td class="right">${money(calcular({ ...e, variable: e.variable * 1.2 }).resultado)}</td></tr>
              <tr><td>Costo fijo +15 %</td><td class="right">${money(calcular({ ...e, fijo: e.fijo * 1.15 }).resultado)}</td></tr>
            </tbody>
          </table>
          <div class="note" style="margin-top:10px">Cifras paramétricas: reemplázalas con datos reales desde la primera cohorte.</div>
        </article>
      </div>
      <article class="card" style="margin-top:14px">
        <h3>Comparación de escenarios</h3>
        <div class="bars">
          ${escenarios.map((s) => {
            const c = calcular({ cohortes: s.cohortesAnio, alumnos: s.alumnosPorCohorte, precio: s.precioPromedioUSD, variable: s.costoVariableUSD, fijo: s.costoFijoAnualUSD });
            const altura = Math.max(4, Math.min(100, (c.contribucion / Math.max(c.ingreso, 1)) * 100));
            return `<div class="row"><span>${esc(s.nombre)}</span><div class="bar${c.resultado >= 0 ? "" : " bad"}"><i style="width:${altura}%"></i></div><strong>${money(c.resultado)}</strong></div>`;
          }).join("")}
        </div>
        <p class="small">${esc(escenarios.map((s) => s.nombre + ": " + s.nota).join(" · "))}</p>
      </article>
      ${b2b ? `<article class="card" style="margin-top:14px">
        <div class="row"><h3>Contrato B2B de referencia</h3><span class="spacer"></span><span class="chip dark">Supuesto N4</span></div>
        <p>${esc(b2b.estado)}. ${esc(b2b.nota)}</p>
        <div class="kpi">
          <div><span>Alumnos / horas</span><strong>${b2b.alumnosPorContrato} / ${b2b.horasPorContrato} h</strong></div>
          <div><span>Facturación por contrato</span><strong>${money(b2b.precioContratoUSD)}</strong></div>
          <div><span>Contribución por contrato</span><strong>${money(b2b.contribucionContratoUSD)}</strong></div>
          <div><span>Margen de contribución</span><strong>${(100 * b2b.contribucionContratoUSD / b2b.precioContratoUSD).toFixed(1)}%</strong></div>
        </div>
        <p class="small" style="margin-top:10px">${b2b.facilitadoresPorContrato} facilitador · ${b2b.horasPracticaPresencial} h presenciales · ${esc(b2b.condicionCobro)}. Tres contratos aportan ${money(b2b.contratosBase * b2b.contribucionContratoUSD)} antes de costos fijos; no constituyen una venta adicional automática.</p>
      </article>` : ""}
      <article class="card" style="margin-top:14px">
        <h3>Flujo de caja del escenario base</h3>
        <p class="small">Referencia fija conciliada con el escenario base; no cambia con los controles del simulador.</p>
        <div class="table-wrap"><table>
          <thead><tr><th>Trimestre</th><th>Inscripciones</th><th>Ingresos</th><th>Egresos</th><th>Neto</th><th>Acumulado</th></tr></thead>
          <tbody>${flujo.map((t) => {
            const neto = t.ingresos - t.egresos;
            acumulado += neto;
            return `<tr><td>${esc(t.trimestre)}</td><td>${t.inscripciones}</td><td>${money(t.ingresos)}</td><td>${money(t.egresos)}</td><td>${money(neto)}</td><td>${money(acumulado)}</td></tr>`;
          }).join("")}</tbody>
        </table></div>
        <p class="small">Cierre: <strong>${money(acumulado)}</strong>, igual al resultado base. Déficit acumulado máximo: USD 11.400 en T1. La reserva adicional para puesta en marcha, impuestos, morosidad y desviaciones no está incluida en esta tabla.</p>
      </article>
    `;
  }

  function renderEconomia() {
    const e = econActual();
    const escenarios = VIAJES.escenarios || [];
    $("#view-economia").innerHTML = `
      <div class="hero">
        <h2>¿Cierra el modelo?</h2>
        <p>Mueve los controles y observa el efecto. El escenario pesimista no alcanza el punto de equilibrio. B2B puede aportar caja solamente cuando cada contrato cubre sus costos y deja contribución; los precios y márgenes mostrados son hipótesis por validar.</p>
      </div>
      <div class="grid g2">
        <article class="card">
          <h3>Supuestos</h3>
          <label>Cohortes al año <output id="o-cohortes"></output><input id="e-cohortes" type="range" min="4" max="48" step="1" /></label>
          <label>Alumnos por cohorte <output id="o-alumnos"></output><input id="e-alumnos" type="range" min="8" max="40" step="1" /></label>
          <label>Precio promedio (USD) <output id="o-precio"></output><input id="e-precio" type="range" min="60" max="500" step="10" /></label>
          <label>Costo variable por alumno <output id="o-variable"></output><input id="e-variable" type="range" min="20" max="150" step="5" /></label>
          <label>Costo fijo anual <output id="o-fijo"></output><input id="e-fijo" type="range" min="20000" max="200000" step="2000" /></label>
          <div class="row" style="margin-top:10px">
            ${escenarios.map((s) => `<button class="ghost" data-escenario="${esc(s.id)}">${esc(s.nombre)}</button>`).join("")}
          </div>
        </article>
        <div id="econ-out"></div>
      </div>
    `;
    pintarEconomia();
    const mapa = { cohortes: "o-cohortes", alumnos: "o-alumnos", precio: "o-precio", variable: "o-variable", fijo: "o-fijo" };
    Object.entries(mapa).forEach(([k, id]) => {
      const input = $("#e-" + k);
      const out = $("#" + id);
      input.value = String(e[k]);
      out.textContent = ["precio", "variable", "fijo"].includes(k) ? money(e[k]) : String(e[k]);
      input.addEventListener("input", () => {
        e[k] = Number(input.value);
        if (k === "precio" || k === "variable" || k === "fijo") out.textContent = money(e[k]);
        else out.textContent = e[k];
        pintarEconomia();
        guardarEstado();
      });
    });
    $$("#view-economia [data-escenario]").forEach((b) => b.addEventListener("click", () => {
      const s = escenarios.find((x) => x.id === b.dataset.escenario);
      if (!s) return;
      estado.econ = {
        cohortes: s.cohortesAnio, alumnos: s.alumnosPorCohorte, precio: s.precioPromedioUSD,
        variable: s.costoVariableUSD, fijo: s.costoFijoAnualUSD,
      };
      guardarEstado();
      renderizar("economia");
      toast("Escenario " + s.nombre + " cargado");
    }));
  }

  /* ---------- fuentes ---------- */
  let fuenteFiltro = { q: "", tipo: "" };

  function renderFuentes() {
    const tipos = [...new Set(FUENTES.map((f) => f.tipo))];
    const lista = FUENTES.filter((f) =>
      (!fuenteFiltro.tipo || f.tipo === fuenteFiltro.tipo) &&
      (!fuenteFiltro.q || (f.titulo + " " + f.uso + " " + f.emisor).toLowerCase().includes(fuenteFiltro.q.toLowerCase()))
    );
    $("#view-fuentes").innerHTML = `
      <div class="hero">
        <h2>Biblioteca de fuentes</h2>
        <p>N1 exige texto oficial, vigencia y pasaje contrastados. N2 identifica evidencia secundaria, técnica o institucional todavía pendiente de ese contraste; N4 señala alcance por validar. Una URL o copia local no equivale por sí sola a verificación jurídica.</p>
      </div>
      <div class="filters">
        <label>Buscar<input id="fu-q" type="search" value="${esc(fuenteFiltro.q)}" placeholder="norma, emisor, tema" /></label>
        <label>Tipo<select id="fu-tipo"><option value="">Todos</option>${tipos.map((t) => `<option ${fuenteFiltro.tipo === t ? "selected" : ""}>${esc(t)}</option>`).join("")}</select></label>
        <span class="chip dark">${lista.length} fuentes</span>
      </div>
      <div class="grid g2">
        ${lista.map((f) => `<article class="card">
          <div class="row"><h3>${esc(f.titulo)}</h3><span class="spacer"></span><span class="chip dark">${esc(f.nivel || "N2")}</span><span class="chip dark">${esc(f.tipo)}</span></div>
          <p class="small"><strong>${esc(f.emisor)}</strong> · ${esc(f.fecha)} · ${esc(f.gaceta)}</p>
          <p><strong>Uso:</strong> ${esc(f.uso)}</p>
          <div class="note"><strong>Verificación:</strong> ${esc(f.estadoVerificacion || "Pendiente")}<br/>${esc(f.cautela)}</div>
          ${f.copiaLocal ? `<p class="small" style="overflow-wrap:anywhere"><strong>Copia:</strong> <code>${esc(f.copiaLocal)}</code><br/><strong>SHA-256:</strong> <code>${esc(f.sha256Copia)}</code></p>` : ""}
          <p style="margin-top:8px"><a href="${esc(f.url)}" target="_blank" rel="noopener">Abrir fuente →</a></p>
        </article>`).join("")}
      </div>
    `;
    $("#fu-q").addEventListener("input", () => {
      clearTimeout(renderFuentes._t);
      renderFuentes._t = setTimeout(() => { fuenteFiltro.q = $("#fu-q").value; renderizar("fuentes"); }, 250);
    });
    $("#fu-tipo").addEventListener("change", () => { fuenteFiltro.tipo = $("#fu-tipo").value; renderizar("fuentes"); });
  }

  /* ---------- verificador demo ---------- */
  const DEMO = {
    "VE-ELEC-2026-000123": { nombre: "María Rodríguez", curso: "Instalaciones eléctricas residenciales", horas: 120, modalidad: "mixta", fecha: "2026-06-30", estado: "vigente", evidencia: "Tablero y canalización evaluados" },
    "VE-REFR-2025-000987": { nombre: "Luis Pérez", curso: "Refrigeración y climatización", horas: 160, modalidad: "mixta", fecha: "2025-11-15", estado: "revocado", revocadoEl: "2026-02-15", evidencia: "Revocado por inconsistencia documental" },
    "VE-ATEN-2026-000456": { nombre: "Ana Gómez", curso: "Atención al cliente y ventas", horas: 80, modalidad: "virtual", fecha: "2026-03-10", estado: "vigente", evidencia: "Role-play y examen final" },
  };

  function renderVerificar() {
    $("#view-verificar").innerHTML = `
      <div class="hero">
        <h2>Verificador de certificados (demostración)</h2>
        <p>Demostración con registros ficticios y sin PDF asociado. El diseño productivo exige identificadores no enumerables, SHA-256 real, estado de revocación, minimización de datos, consentimiento y límites de consulta.</p>
      </div>
      <div class="grid g2">
        <article class="card">
          <h3>Consultar</h3>
          <label>Código<input id="v-code" type="text" placeholder="VE-ELEC-2026-000123" value="VE-ELEC-2026-000123" /></label>
          <div class="row" style="margin-top:10px">
            <button id="v-buscar" class="primary">Verificar</button>
            <button id="v-limpiar" class="ghost">Limpiar</button>
          </div>
          <p class="small muted" style="margin-top:10px">Formato ficticio: <code>VE-XXXX-AAAA-000000</code>. Es predecible y solo sirve para esta demo; producción debe usar identificadores aleatorios y SHA-256 calculado sobre el PDF.</p>
        </article>
        <article class="card">
          <h3>Qué debe mostrar el verificador</h3>
          <ol class="small">
            <li>Nombre y curso, sin exponer cédula completa.</li>
            <li>Carga horaria, modalidad y fechas.</li>
            <li>Estado: vigente, revocado o vencido.</li>
            <li>Evidencia evaluada.</li>
            <li>Hash del documento y sello de tiempo.</li>
          </ol>
        </article>
      </div>
      <div id="v-resultado" style="margin-top:16px"></div>
    `;
    $("#v-buscar").addEventListener("click", buscarCertificado);
    $("#v-limpiar").addEventListener("click", () => { $("#v-code").value = ""; $("#v-resultado").innerHTML = ""; $("#v-code").focus(); });
    $("#v-code").addEventListener("keydown", (ev) => { if (ev.key === "Enter") buscarCertificado(); });
  }

  function buscarCertificado() {
    const codigo = ($("#v-code").value || "").trim().toUpperCase();
    const caja = $("#v-resultado");
    const patron = /^VE-[A-Z]{4}-\d{4}-\d{6}$/;
    if (!patron.test(codigo)) {
      caja.innerHTML = `<div class="note strong"><strong>Formato inválido.</strong> Usa el patrón VE-XXXX-AAAA-000000. Un código mal formado no debe devolver datos.</div>`;
      return;
    }
    const d = DEMO[codigo];
    if (!d) {
      caja.innerHTML = `<div class="note strong"><strong>No encontrado.</strong> El código no existe en la base de demostración. En producción se responde igual solo ante códigos desconocidos; los revocados conocidos deben mostrar su estado. Aplica límites de consulta, registro de abuso e identificadores aleatorios no enumerables.</div>`;
      return;
    }
    const vigente = d.estado === "vigente";
    caja.innerHTML = `
      <article class="card">
        <div class="row">
          <h3>${esc(codigo)}</h3><span class="spacer"></span>
          <span class="semaforo sem-${vigente ? "verde" : "rojo"}">${vigente ? "Vigente" : "Revocado"}</span>
        </div>
        <div class="kpi" style="margin-top:10px">
          <div><span>Participante</span><strong>${esc(d.nombre)}</strong></div>
          <div><span>Curso</span><strong>${esc(d.curso)}</strong></div>
          <div><span>Horas</span><strong>${d.horas} h</strong></div>
          <div><span>Modalidad</span><strong>${esc(d.modalidad)}</strong></div>
          <div><span>Fecha</span><strong>${esc(d.fecha)}</strong></div>
          <div><span>Huella documental</span><strong>No calculada en esta demo</strong></div>
        </div>
        <p style="margin-top:10px"><strong>Evidencia:</strong> ${esc(d.evidencia)}</p>
        <div class="note" style="margin-top:10px">La demo no contiene el PDF: no calcula SHA-256 ni prueba integridad. En producción se calcula sobre el documento emitido y se almacena con un sello de tiempo.</div>
        ${vigente ? "" : `<div class="note strong" style="margin-top:10px">Certificado revocado el <strong>${esc(d.revocadoEl || "sin fecha registrada")}</strong>. Motivo: ${esc(d.evidencia)}. No se exponen datos personales innecesarios.</div>`}
      </article>`;
  }

  /* ---------- sincronización e inicio ---------- */
  function sincronizarControles() {
    if ($("#c-perfil")) $("#c-perfil").value = estado.perfil;
    if ($("#c-objetivo")) $("#c-objetivo").value = estado.objetivo;
    if ($("#c-oficio")) $("#c-oficio").value = estado.oficio;
    if ($("#c-modalidad")) $("#c-modalidad").value = estado.modalidad;
    if ($("#c-horas")) $("#c-horas").value = estado.horas;
    if ($("#o-horas")) $("#o-horas").textContent = estado.horas + " h";
    if ($("#c-presupuesto")) $("#c-presupuesto").value = estado.presupuesto;
    if ($("#c-oficial")) $("#c-oficial").checked = !!estado.oficial;
    if ($("#c-practica")) $("#c-practica").checked = !!estado.practica;
    if ($("#c-tiempo")) $("#c-tiempo").checked = !!estado.tiempo;
  }

  function exportar() {
    const data = {
      generado: new Date().toISOString(),
      configuracion: estado,
      avance: progreso(),
      recomendacion: rankingFiguras().slice(0, 3).map((r) => ({ figura: r.figura.nombre, score: r.score })),
      programaSugerido: programaActual() ? programaActual().nombre : null,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "configuracion-educacion-oficios.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Configuración exportada");
  }

  function iniciar() {
    leerEstado();
    aplicarTema();

    const sel = $("#c-oficio");
    if (sel) sel.innerHTML = PROGRAMAS.map((p) => `<option value="${esc(p.id)}">${esc(p.nombre)}</option>`).join("");
    sincronizarControles();

    const cambiar = (fn) => { fn(); estado = normalizarEstado(estado); sincronizarControles(); guardarEstado(); renderizar(ruta()); };

    $("#c-perfil").addEventListener("change", (e) => cambiar(() => { estado.perfil = e.target.value; }));
    $("#c-objetivo").addEventListener("change", (e) => cambiar(() => { estado.objetivo = e.target.value; }));
    $("#c-oficio").addEventListener("change", (e) => seleccionarPrograma(e.target.value));
    $("#c-modalidad").addEventListener("change", (e) => cambiar(() => { estado.modalidad = e.target.value; }));
    $("#c-horas").addEventListener("input", (e) => {
      estado.horas = Number(e.target.value);
      $("#o-horas").textContent = estado.horas + " h";
      guardarEstado();
      clearTimeout(iniciar._h);
      iniciar._h = setTimeout(() => renderizar(ruta()), 200);
    });
    $("#c-presupuesto").addEventListener("change", (e) => cambiar(() => { estado.presupuesto = Number(e.target.value) || 0; }));
    ["oficial", "practica", "tiempo"].forEach((k) => {
      $("#c-" + k).addEventListener("change", (e) => cambiar(() => {
        estado[k] = e.target.checked;
        if (k === "oficial") estado.figura = "";
      }));
    });

    $("#reset").addEventListener("click", () => {
      estado = { ...estadoInicial, tema: estado.tema };
      guardarEstado();
      sincronizarControles();
      renderizar(ruta());
      toast("Configuración restablecida");
    });
    $("#copy-link").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        toast("Enlace copiado");
      } catch (e) {
        toast("Copia la URL de la barra de direcciones");
      }
    });
    $("#export").addEventListener("click", exportar);
    $("#theme").addEventListener("click", () => {
      estado.tema = estado.tema === "dark" ? "light" : "dark";
      aplicarTema();
      guardarEstado();
    });
    $("#open-config").addEventListener("click", () => $("#config").classList.add("open"));
    $("#close-config").addEventListener("click", () => $("#config").classList.remove("open"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") $("#config").classList.remove("open");
    });
    window.addEventListener("hashchange", navegar);
    navegar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();

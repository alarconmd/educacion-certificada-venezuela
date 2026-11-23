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

  let estado = { ...estadoInicial };

  /* ---------- estado ---------- */
  function leerEstado() {
    try {
      const url = new URL(window.location.href);
      const raw = url.searchParams.get("s");
      if (raw) {
        const parsed = JSON.parse(decodeURIComponent(escape(atob(raw.replace(/-/g, "+").replace(/_/g, "/")))));
        estado = { ...estadoInicial, ...parsed };
        return;
      }
    } catch (e) { /* ignora URL corrupta */ }
    try {
      const raw = localStorage.getItem(CLAVE);
      if (raw) estado = { ...estadoInicial, ...JSON.parse(raw) };
    } catch (e) { /* ignora almacenamiento bloqueado */ }
  }

  function guardarEstado() {
    try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* noop */ }
    try {
      const json = JSON.stringify(estado);
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
    if (estado.oficial) {
      const v = VALOR_OFICIAL[f.id] || 0;
      s += v * 9;
      razones.push(v >= 2 ? "tiene valor oficial o institucional" : "no da valor oficial por sí sola");
    } else if (f.id === "capacitacion-no-formal" || f.id === "curso-avalado") {
      s += 12;
      razones.push("rápida de lanzar");
    }
    if (!estado.practica && (f.id === "tecnico-medio" || f.id === "iso17024")) s -= 18;
    if (!estado.tiempo && ["tecnico-medio", "iso17024", "competencias-inces"].includes(f.id)) {
      s -= 20;
      razones.push("requiere meses de trámite");
    }
    if (estado.tiempo && (f.id === "competencias-inces" || f.id === "curso-avalado")) s += 8;
    const costo = COSTO_ENTRADA[f.id] || 0;
    if (estado.presupuesto * 12 < costo) {
      s -= 15;
      razones.push("costo de entrada alto para tu presupuesto");
    }
    if (estado.objetivo === "cumplimiento" && f.id === "capacitacion-no-formal") {
      s += 14; razones.push("resuelve cumplimiento sin trámite educativo");
    }
    if (estado.objetivo === "ascenso" && (f.id === "curso-avalado" || f.id === "diplomado")) {
      s += 10; razones.push("suma para ascenso");
    }
    if (estado.objetivo === "empleo" && (f.id === "competencias-inces" || f.id === "curso-avalado")) s += 6;
    if (estado.perfil === "empresa" && f.id === "capacitacion-no-formal") {
      s += 8; razones.push("fácil de comprar por una empresa");
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

  function cardPrograma(p) {
    return `<article class="card click" data-programa="${esc(p.id)}">
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
            <div><span>Afinidad</span><strong>${ranking[0].score}%</strong></div>
            <div><span>Costo de entrada</span><strong>${money(COSTO_ENTRADA[f.id] || 0)}</strong></div>
            <div><span>Horas</span><strong>${esc(f.horas)}</strong></div>
          </div>
          <div class="bars">
            ${ranking.slice(0, 4).map((r) => `<div class="row"><span>${esc(r.figura.nombre)}</span>${barra(r.score)}<strong>${r.score}%</strong></div>`).join("")}
          </div>
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
          <div class="kpi"><div><span>Precio estimado</span><strong>${money(precio)}</strong></div><div><span>Afinidad</span><strong>${compatibilidadPrograma(p)}%</strong></div></div>
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
          <p>${estado.tiempo ? "Con tiempo disponible, la ruta de aval y competencias es viable." : "Sin tiempo para trámites, empieza por capacitación no formal y construye evidencia."}</p>
          <p class="small">${esc(ranking[0].razones.join(" · ") || "Sin restricciones detectadas")}</p>
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
          <p class="small" style="margin-top:8px">Mejor programa por afinidad: <strong>${esc(mejor ? mejor.nombre : "—")}</strong> (${mejor ? mejor.score : 0}%).</p>
        </article>
      </div>
    `;
    $$("#view-panel [data-programa]").forEach((c) => c.addEventListener("click", () => seleccionarPrograma(c.dataset.programa)));
  }

  function seleccionarPrograma(id) {
    const p = PROGRAMAS.find((x) => x.id === id);
    if (!p) return;
    estado.oficio = p.id;
    estado.horas = p.horas;
    estado.modalidad = p.modalidad;
    estado.presupuesto = Math.max(estado.presupuesto, precioEstimado(p));
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
          <article class="card click ${f.id === actual.id ? "sel" : ""}" data-figura="${esc(f.id)}">
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
    $$("#view-figuras [data-figura]").forEach((c) => c.addEventListener("click", () => {
      estado.figura = c.dataset.figura;
      guardarEstado();
      renderizar("figuras");
      actualizarMini();
    }));
    $$("#view-figuras [data-programa]").forEach((c) => c.addEventListener("click", () => seleccionarPrograma(c.dataset.programa)));
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
            ${lista.map((p) => `<tr data-oficio="${esc(p.id)}" style="cursor:pointer">
              <td><strong>${esc(p.nombre)}</strong><br/><span class="muted small">${esc(p.salida)}</span></td>
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
          <div><span>Afinidad contigo</span><strong>${compatibilidadPrograma(p)}%</strong></div>
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
    try { return JSON.parse(localStorage.getItem(CLAVE_CHECK)) || {}; }
    catch (e) { return {}; }
  }

  function marcar(id, valor) {
    const p = progreso();
    p[id] = valor;
    try { localStorage.setItem(CLAVE_CHECK, JSON.stringify(p)); } catch (e) { /* noop */ }
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
        <button id="marcar-bloqueantes" class="ghost">Marcar bloqueantes</button>
        <button id="limpiar-permisos" class="ghost">Limpiar</button>
        <button id="imprimir" class="ghost">Imprimir</button>
      </div>
      <div class="checklist">
        ${items.map((t) => {
          const listo = !!p[t.id];
          const faltan = (t.dependeDe || []).filter((d) => items.some((x) => x.id === d) && !p[d]);
          return `<label class="check-item ${esc(t.criticidad)} ${listo ? "ok" : ""}">
            <input type="checkbox" data-check="${esc(t.id)}" ${listo ? "checked" : ""} />
            <div>
              <h4>${esc(t.nombre)}</h4>
              <p><strong>${esc(t.autoridad)}</strong> · ${esc(t.plazo)} · ${money(t.costoUSD || 0)}</p>
              <p>${esc(t.nota)}</p>
              <p class="small"><strong>Documentos:</strong> ${t.docs.map(esc).join(" · ")}</p>
              ${faltan.length ? `<p class="small" style="color:var(--amber)">Requiere antes: ${faltan.map((d) => esc((items.find((x) => x.id === d) || {}).nombre || d)).join(", ")}</p>` : ""}
            </div>
            <span class="tag">${esc(t.criticidad)}</span>
          </label>`;
        }).join("")}
      </div>
      <div class="note" style="margin-top:16px">La ruta es una guía de secuencia, no un contrato. Los plazos y costos son estimaciones y deben confirmarse con cada autoridad. La consulta a la Zona Educativa (anexo D1 del informe) es el paso que cierra la zona gris.</div>
    `;
    $$("#view-permisos [data-check]").forEach((c) => c.addEventListener("change", () => {
      marcar(c.dataset.check, c.checked);
      renderizar("permisos");
    }));
    $("#marcar-bloqueantes").addEventListener("click", () => {
      items.filter((t) => t.criticidad === "bloqueante").forEach((t) => marcar(t.id, true));
      renderizar("permisos");
      toast("Bloqueantes marcados");
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
          <p class="small" style="margin-top:10px">Punto de equilibrio: <strong>${Number.isFinite(r.breakeven) ? fmt(r.breakeven) + " alumnos/año" : "no alcanzable"}</strong>${Number.isFinite(r.breakeven) ? ` (${(r.breakeven / e.alumnos).toFixed(1)} cohortes)` : ""}.</p>
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
    `;
  }

  function renderEconomia() {
    const e = econActual();
    const escenarios = VIAJES.escenarios || [];
    $("#view-economia").innerHTML = `
      <div class="hero">
        <h2>¿Cierra el modelo?</h2>
        <p>Mueve los controles y observa el efecto. La conclusión del informe es incómoda: solo B2C, sin aval y sin empresas, el negocio no alcanza el punto de equilibrio. La palanca no es recortar: es subir valor percibido y volumen B2B.</p>
      </div>
      <div class="grid g2">
        <article class="card">
          <h3>Supuestos</h3>
          <label>Cohortes al año <output id="o-cohortes">${e.cohortes}</output><input id="e-cohortes" type="range" min="4" max="48" step="1" value="${e.cohortes}" /></label>
          <label>Alumnos por cohorte <output id="o-alumnos">${e.alumnos}</output><input id="e-alumnos" type="range" min="8" max="40" step="1" value="${e.alumnos}" /></label>
          <label>Precio promedio (USD) <output id="o-precio">${money(e.precio)}</output><input id="e-precio" type="range" min="60" max="500" step="10" value="${e.precio}" /></label>
          <label>Costo variable por alumno <output id="o-variable">${money(e.variable)}</output><input id="e-variable" type="range" min="20" max="150" step="5" value="${e.variable}" /></label>
          <label>Costo fijo anual <output id="o-fijo">${money(e.fijo)}</output><input id="e-fijo" type="range" min="20000" max="200000" step="2000" value="${e.fijo}" /></label>
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
      input.addEventListener("input", () => {
        e[k] = Number(input.value);
        const out = $("#" + id);
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
        <p>Cada afirmación del informe se apoya en una norma, un acto institucional o una norma técnica. Los enlaces son la referencia primaria; antes de citarlos en un escrito, confirma la gaceta y la vigencia.</p>
      </div>
      <div class="filters">
        <label>Buscar<input id="fu-q" type="search" value="${esc(fuenteFiltro.q)}" placeholder="norma, emisor, tema" /></label>
        <label>Tipo<select id="fu-tipo"><option value="">Todos</option>${tipos.map((t) => `<option ${fuenteFiltro.tipo === t ? "selected" : ""}>${esc(t)}</option>`).join("")}</select></label>
        <span class="chip dark">${lista.length} fuentes</span>
      </div>
      <div class="grid g2">
        ${lista.map((f) => `<article class="card">
          <div class="row"><h3>${esc(f.titulo)}</h3><span class="spacer"></span><span class="chip dark">${esc(f.tipo)}</span></div>
          <p class="small"><strong>${esc(f.emisor)}</strong> · ${esc(f.fecha)} · ${esc(f.gaceta)}</p>
          <p><strong>Uso:</strong> ${esc(f.uso)}</p>
          <div class="note">${esc(f.cautela)}</div>
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
    "VE-REFR-2025-000987": { nombre: "Luis Pérez", curso: "Refrigeración y climatización", horas: 160, modalidad: "mixta", fecha: "2025-11-15", estado: "revocado", evidencia: "Revocado por inconsistencia documental" },
    "VE-ATEN-2026-000456": { nombre: "Ana Gómez", curso: "Atención al cliente y ventas", horas: 80, modalidad: "virtual", fecha: "2026-03-10", estado: "vigente", evidencia: "Role-play y examen final" },
  };

  function hashSimple(texto) {
    let h = 0;
    for (let i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) >>> 0;
    return h.toString(16).padStart(8, "0").toUpperCase();
  }

  function renderVerificar() {
    $("#view-verificar").innerHTML = `
      <div class="hero">
        <h2>Verificador de certificados (demostración)</h2>
        <p>Un certificado sin verificación es un PDF decorativo. Así debería funcionar el endpoint público: código único, estado, curso, horas y hash del documento. Prueba los códigos de ejemplo.</p>
      </div>
      <div class="grid g2">
        <article class="card">
          <h3>Consultar</h3>
          <label>Código<input id="v-code" type="text" placeholder="VE-ELEC-2026-000123" value="VE-ELEC-2026-000123" /></label>
          <div class="row" style="margin-top:10px">
            <button id="v-buscar" class="primary">Verificar</button>
            <button id="v-limpiar" class="ghost">Limpiar</button>
          </div>
          <p class="small muted" style="margin-top:10px">Formato: <code>VE-XXXX-AAAA-000000</code>. En producción, el QR del certificado apunta aquí y el hash SHA-256 se compara con el PDF.</p>
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
      caja.innerHTML = `<div class="note strong"><strong>Formato inválido.</strong> Usa el patrón VE-XXXX-AAAA-000000. Un código mal formado no debe devolver datos: evita filtraciones por enumeración.</div>`;
      return;
    }
    const d = DEMO[codigo];
    if (!d) {
      caja.innerHTML = `<div class="note strong"><strong>No encontrado.</strong> El código no existe en la base de demostración. En producción, responde igual para códigos inexistentes y revocados, y registra el intento.</div>`;
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
          <div><span>Hash del documento</span><strong>${hashSimple(codigo + d.nombre)}</strong></div>
        </div>
        <p style="margin-top:10px"><strong>Evidencia:</strong> ${esc(d.evidencia)}</p>
        ${vigente ? "" : `<div class="note strong" style="margin-top:10px">Este certificado fue revocado. El verificador debe explicar el motivo y la fecha, sin exponer datos personales innecesarios.</div>`}
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

    const cambiar = (fn) => { fn(); guardarEstado(); renderizar(ruta()); };

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

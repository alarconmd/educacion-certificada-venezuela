/* Regresión sin dependencias del normalizador real de docs/assets/app.js. */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "../..");
const app = fs.readFileSync(path.join(root, "docs/assets/app.js"), "utf8");
const inicio = app.indexOf("  function numeroSeguro");
const fin = app.indexOf("  /* ---------- estado ---------- */", inicio);
assert(inicio >= 0 && fin > inicio, "No se pudo localizar el normalizador");

const contexto = {
  estadoInicial: {
    perfil: "fundador", objetivo: "validar", oficio: "electricidad",
    horas: 120, modalidad: "mixta", presupuesto: 220,
    oficial: false, practica: true, tiempo: false, figura: "", vista: "panel", tema: "",
  },
  PROGRAMAS: [{ id: "electricidad" }],
  FIGURAS: [{ id: "capacitacion-no-formal" }],
  ECON_BASE: { cohortesAnio: 24, alumnosPorCohorte: 22, precioPromedioUSD: 220, costoVariableUSD: 55, costoFijoAnualUSD: 72000 },
  LIMITES_ECON: {
    cohortes: [4, 48, 1], alumnos: [8, 40, 1], precio: [60, 500, 10],
    variable: [20, 150, 5], fijo: [20000, 200000, 2000],
  },
  CAMPOS_ECON: { cohortes: "cohortesAnio", alumnos: "alumnosPorCohorte", precio: "precioPromedioUSD", variable: "costoVariableUSD", fijo: "costoFijoAnualUSD" },
};
vm.createContext(contexto);
vm.runInContext("const esObjeto = (v) => !!v && typeof v === 'object' && !Array.isArray(v);\n" + app.slice(inicio, fin), contexto);

const payload = "<img src=x onerror=window.__xss=1>";
const hostil = {
  perfil: payload, objetivo: payload, oficio: payload, modalidad: payload,
  figura: payload, vista: payload, tema: payload, extra: payload,
  horas: "120", presupuesto: 999999, oficial: "true", practica: 1, tiempo: null,
  econ: { cohortes: "24" + payload, alumnos: -8, precio: 999999, variable: "55", fijo: 72000, extra: payload },
};
const limpio = contexto.normalizarEstado(hostil);
assert(!JSON.stringify(limpio).includes(payload), "HTML hostil sobrevivió a la normalización");
assert(!Object.hasOwn(limpio, "extra") && !Object.hasOwn(limpio.econ, "extra"), "Se conservaron campos desconocidos");
assert.equal(limpio.perfil, "fundador");
assert.equal(limpio.figura, "");
assert.equal(limpio.vista, "panel");
assert.equal(limpio.tema, "");
assert.equal(limpio.oficial, false);
assert.equal(limpio.practica, true);
assert.equal(limpio.tiempo, false);
assert.equal(limpio.horas, 120);
assert.equal(limpio.presupuesto, 60000);
assert.equal(JSON.stringify(limpio.econ), JSON.stringify({ cohortes: 24, alumnos: 8, precio: 500, variable: 55, fijo: 72000 }));

const noObjeto = contexto.normalizarEstado([payload]);
assert(!JSON.stringify(noObjeto).includes(payload));
const noFinitos = contexto.normalizarEstado({ horas: NaN, presupuesto: Infinity, econ: { cohortes: NaN, alumnos: Infinity, precio: -Infinity, variable: NaN, fijo: Infinity } });
assert.equal(noFinitos.horas, 120);
assert.equal(noFinitos.presupuesto, 220);
assert.equal(JSON.stringify(noFinitos.econ), JSON.stringify({ cohortes: 24, alumnos: 22, precio: 220, variable: 55, fijo: 72000 }));
const persona = contexto.normalizarEstado({ perfil: "persona", presupuesto: 50000, vista: "verificar" });
assert.equal(persona.presupuesto, 2000);
assert.equal(persona.vista, "verificar");
console.log("OK: allowlist, tipos finitos, rangos y payload hostil (18 afirmaciones).");

/* BONXAI · Plan de contenido — interfaz.
   Secciones: Hoy · Guiones (+ modo Grabar) · Calendario · Métricas · Estrategia. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pad = n => String(n).padStart(2, "0");
const MESES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const DIAS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseD = s => new Date(s + "T12:00:00");
const addD = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const today = () => { const t = new Date(); t.setHours(12, 0, 0, 0); return t; };
const mondayOf = d => { const x = new Date(d); x.setHours(12, 0, 0, 0); const k = (x.getDay() + 6) % 7; return addD(x, -k); };
const fmtD = d => `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
const uid = () => "g" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

const ICONS = {
  home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  clap:'<rect x="3" y="10" width="18" height="11" rx="2"/><path d="M3 10l2-5 4 1-2 4M9 6l4 1-2 3M13 7l4 1-2 2"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',
  play:'<path d="M7 4l13 8-13 8z"/>',
  rec:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5" fill="currentColor"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
  db:'<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  up:'<path d="M12 19V5M6 11l6-6 6 6"/>',
  down:'<path d="M12 5v14M6 13l6 6 6-6"/>',
  dup:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 012-2h10"/><path d="M14 11v6M11 14h6"/>'
};
const ic = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

function toast(m){ const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2600); }
async function copy(text){
  try { await navigator.clipboard.writeText(text); toast("Copiado"); return; } catch (e) {}
  const ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); toast("Copiado"); } catch (e) { toast("No se pudo copiar"); } ta.remove();
}

/* ---------- catálogos ---------- */
const ESTADOS = [["idea","Idea"],["listo","Listo para grabar"],["grabado","Grabado"],["editado","Editado"],["publicado","Publicado"]];
const estLabel = e => (ESTADOS.find(x => x[0] === e) || ESTADOS[0])[1];
const estIdx = e => ESTADOS.findIndex(x => x[0] === e);
const FORMATOS = ["Reel + TikTok","Reel","TikTok","Carrusel","Stories","Otro"];
const pilarCol = p => (PILARES.find(x => x.n === p) || {col:"#E8D5C0"}).col;
const calOf = d => CAL.find(x => x.gd === d.getDay());
const G = id => DB.guiones.find(g => g.id === id);
const byNum = (a, b) => (a.n || 999) - (b.n || 999);
function nextNum(){ return DB.guiones.reduce((m, g) => Math.max(m, g.n || 0), 0) + 1; }
function scriptText(g){
  return [`VIDEO ${pad(g.n)} · ${g.titulo}`, g.objetivo && `Objetivo: ${g.objetivo}`, g.duracion && `Duración: ${g.duracion}`, `Gancho: “${g.gancho}”`, "",
    ...g.escenas.map(s => `${s.t} · ${s.nombre}\n  Digo: ${s.digo}${s.como ? "\n  Cómo: " + s.como : ""}${s.pantalla ? "\n  En pantalla: " + s.pantalla : ""}`), "",
    g.textoPantalla && `Texto en pantalla: ${g.textoPantalla}`, g.edicion && `Edición: ${g.edicion}`, g.stories && `Stories: ${g.stories}`, g.descripcion && `Descripción: ${g.descripcion}`].filter(x => x !== false && x !== "").join("\n");
}

/* ---------- navegación ---------- */
const UI = {estado:"", pilar:"", q:"", edit:false, wk:0, red:"ig", tab:"resumen", recI:0};
const VIEWS = [
  {id:"hoy", n:"Hoy", ic:"home", c:"#F7D774", title:"¿Qué grabamos hoy?", desc:"Lo que toca hoy, el siguiente guion listo y cómo va todo. Toca Grabar y listo."},
  {id:"guiones", n:"Guiones", ic:"clap", c:"#6B1626", k:"#fff", title:"Banco de guiones", desc:"Cada video con su gancho, escenas y estado. Léelo, edítalo o abre el modo grabar."},
  {id:"calendario", n:"Calendario", ic:"calendar", c:"#F26B55", title:"La semana, de un vistazo", desc:"Cada día tiene su tipo de pieza y objetivo. Asigna guiones a fechas con un toque."},
  {id:"metricas", n:"Métricas", ic:"chart", c:"#D8B07C", title:"Qué está funcionando", desc:"Anota los números de cada video publicado. La app calcula las tasas y te dice cuál ganó."},
  {id:"estrategia", n:"Estrategia", ic:"compass", c:"#AEC38E", title:"La guía completa", desc:"Pilares, estructura, ganchos, Stories, plataformas y el plan de 30 días. Para consultar."}
];
const ARTK = {hoy:"inicio", guiones:"guiones", calendario:"calendario", metricas:"metricas", estrategia:"estrategia"};
function route(){ const [v, a] = location.hash.replace("#", "").split("/"); return {v: VIEWS.find(x => x.id === v) ? v : (v === "grabar" ? "grabar" : "hoy"), a: a ? decodeURIComponent(a) : ""}; }
const go = h => { location.hash = h; };

function buildNav(){
  $("#nav").innerHTML = VIEWS.map(v => `<button class="nv" data-go="${v.id}" style="--ic:${v.c};--ik:${v.k || "#2B1710"}"><span class="ic">${ic(v.ic)}</span><span>${v.n}</span><span class="pc" id="pc-${v.id}"></span></button>`).join("");
}
function counts(){
  const pub = DB.guiones.filter(g => g.estado === "publicado").length;
  const el = $("#pc-guiones"); if (el) el.textContent = pub + "/" + DB.guiones.length;
}

function render(){
  const r = route();
  closeRec();
  if (r.v === "grabar") { const g = G(r.a); if (g) { if (!$("#main").innerHTML) renderView("guiones", r.a); openRec(g); return; } go("guiones"); return; }
  renderView(r.v, r.a);
}
function renderView(id, arg){
  const v = VIEWS.find(x => x.id === id);
  document.title = "BONXAI · " + v.n;
  const main = $("#main");
  main.style.setProperty("--c", v.c); main.style.setProperty("--c-ink", v.k || "#2B1710");
  main.innerHTML = `<header class="vh"><span class="num">${esc(v.n)}</span><h1>${esc(v.title)}</h1><p>${esc(v.desc)}</p><div class="deco" aria-hidden="true">${(typeof ART !== "undefined" && ART[ARTK[id]]) || ""}</div></header><div class="body fade" id="body">${V_[id](arg)}<button class="btn mobile-only" data-data="1" style="align-self:center">${ic("db")} Datos y GitHub</button></div>`;
  $$(".nv").forEach(b => b.setAttribute("aria-current", b.dataset.go === id ? "page" : "false"));
  counts(); autoH();
  if (render.last !== id + arg) window.scrollTo(0, 0);
  render.last = id + arg;
}
function refresh(){ const y = window.scrollY; const r = route(); if (r.v === "grabar") { const g = G(r.a); if (g && REC) { REC.g = g; drawRec(); } return; } renderView(r.v, r.a); window.scrollTo(0, y); }
function autoH(root = document){ $$("textarea", root).forEach(t => { t.style.height = "auto"; t.style.height = (t.scrollHeight + 4) + "px"; }); }

/* ================= HOY ================= */
const V_ = {};
function pieceRow(g){
  return `<div class="piece st-${g.estado}"><span class="h">${esc(g.hora || "--:--")}</span><div><b>${esc(g.titulo || "Sin título")}</b><small>${esc(g.formato)} · <span class="chip stc" style="font-size:.7rem;padding:1px 8px">${estLabel(g.estado)}</span></small></div>
    <div class="row">${g.escenas.length && estIdx(g.estado) < 2 ? `<button class="btn sm wine" data-rec="${g.id}">${ic("rec")} Grabar</button>` : ""}<button class="btn sm" data-go="guiones/${g.id}">Abrir</button></div></div>`;
}
V_.hoy = () => {
  const t = today(), k = ymd(t), c = calOf(t);
  const hoyG = DB.guiones.filter(g => g.fecha === k).sort((a, b) => (a.hora || "").localeCompare(b.hora || ""));
  const listos = DB.guiones.filter(g => g.estado === "listo" && g.escenas.length).sort((a, b) => (a.fecha || "9999").localeCompare(b.fecha || "9999") || byNum(a, b));
  const nx = listos[0];
  let planTxt = "";
  if (DB.inicioPlan) { const i = Math.round((t - parseD(DB.inicioPlan)) / 864e5); if (i >= 0 && i < 30) planTxt = `Día ${i + 1} de 30 · ${i < 28 ? "Semana " + (Math.floor(i / 7) + 1) : "Cierre"}`; }
  const prox = DB.guiones.filter(g => g.fecha > k && g.estado !== "publicado").sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora)).slice(0, 5);
  const day = t.getDate();
  const stories = STORY_SLOTS.map(([slot, n, h, d], i) => { const opts = STORY_BANK.filter(s => s.slot === slot); const s = opts[(day + i) % opts.length]; return [n, h, s]; });
  return `
  <section class="card fo">
    <div class="today"><div class="dbadge"><b>${t.getDate()}</b><small>${MESES[t.getMonth()]}</small></div>
      <div><span class="chip" style="background:var(--surface)">${DIAS[t.getDay()]}${planTxt ? " · " + planTxt : ""}</span>
        <h2>${esc(c.pz)}</h2><p>Objetivo del día: <b>${esc(c.ob)}</b> · ${esc(OBJ_INFO[c.ob] || "")}</p></div>
      <button class="btn" data-pickday="${k}">${ic("plus")} Programar algo hoy</button></div>
    ${hoyG.length ? `<div class="pieces" style="margin-top:16px">${hoyG.map(pieceRow).join("")}</div>` : `<p style="margin-top:12px;opacity:.9">Hoy no hay nada programado. Puedes grabar el siguiente guion listo 👇 o programar uno para hoy.</p>`}
  </section>

  ${nx ? `<section class="card"><div class="next"><div><span class="lab">Siguiente para grabar · Video ${pad(nx.n)}</span><h3 style="font-size:1.5rem;margin-top:4px">${esc(nx.titulo)}</h3><p class="next-hook hook">“${esc(nx.gancho)}”</p>
      <p class="muted sm" style="margin-top:6px">${nx.escenas.length} escenas · ${esc(nx.duracion || "")} · ${esc(nx.pilar || "")}</p></div>
      <div class="row" style="flex-direction:column;align-items:stretch"><button class="btn big wine" data-rec="${nx.id}">${ic("rec")} Grabar ahora</button><button class="btn" data-go="guiones/${nx.id}">Ver guion</button></div></div></section>`
    : `<section class="card y"><h3>No hay guiones listos para grabar</h3><p style="margin-top:6px">Marca un guion como “Listo para grabar” o crea uno nuevo.</p><div class="row" style="margin-top:10px"><button class="btn wine" data-new="1">${ic("plus")} Nuevo guion</button></div></section>`}

  <section><div class="sec" style="margin-bottom:10px"><h2>Cómo vamos</h2><span class="muted sm">Toca un estado para ver esos guiones</span></div>
    <div class="pipe">${ESTADOS.map(([e, n]) => `<button class="st-${e}" data-filter="${e}"><b>${DB.guiones.filter(g => g.estado === e).length}</b><span>${n}</span></button>`).join("")}</div></section>

  <div class="grid g2">
    <section class="card"><div class="sec"><h3>Próximos programados</h3><button class="btn sm" data-go="calendario">Calendario</button></div>
      <div class="pieces" style="margin-top:12px">${prox.length ? prox.map(g => `<button class="ci st-${g.estado}" data-go="guiones/${g.id}" style="padding:8px 10px"><b>${fmtD(parseD(g.fecha))}${g.hora ? " · " + g.hora : ""}</b>${esc(g.titulo)}</button>`).join("") : `<p class="muted">Nada programado todavía. En el calendario puedes rellenar la semana con los guiones listos en un toque.</p>`}</div></section>
    <section class="card"><div class="sec"><h3>Stories de hoy</h3><button class="btn sm" data-go="estrategia/stories">Más ideas</button></div>
      <div class="pieces" style="margin-top:12px">${stories.map(([n, h, s]) => `<div class="copyline"><div><b class="sm">${h} · ${n} — ${esc(s.n)}</b><p class="sm muted">${esc(s.ex)}</p></div><button class="btn sm ghost" data-copy="${esc(s.ex)}" aria-label="Copiar">${ic("copy")}</button></div>`).join("")}</div></section>
  </div>`;
};

/* ================= GUIONES ================= */
function filtered(){
  const q = UI.q.trim().toLowerCase();
  return DB.guiones.filter(g => (!UI.estado || g.estado === UI.estado) && (!UI.pilar || g.pilar === UI.pilar) && (!q || (g.titulo + " " + g.gancho + " " + g.notas).toLowerCase().includes(q))).sort(byNum);
}
function listHTML(sel){
  const L = filtered();
  return `<div class="filters"><button class="btn wine" data-new="1">${ic("plus")} Nuevo guion</button>
    <input type="search" placeholder="Buscar guion…" value="${esc(UI.q)}" data-ui="q">
    <div class="row"><select data-ui="estado"><option value="">Todos los estados</option>${ESTADOS.map(([e, n]) => `<option value="${e}" ${UI.estado === e ? "selected" : ""}>${n}</option>`).join("")}</select>
    <select data-ui="pilar"><option value="">Todos los pilares</option>${PILARES.map(p => `<option ${UI.pilar === p.n ? "selected" : ""}>${esc(p.n)}</option>`).join("")}</select></div></div>
    ${L.length ? L.map(g => `<button class="gi" data-go="guiones/${g.id}" aria-current="${g.id === sel}"><span class="n">${pad(g.n)}</span><span><b>${esc(g.titulo || "Sin título")}</b><span class="meta"><span class="chip stc st-${g.estado}">${estLabel(g.estado)}</span><span class="dot" style="background:${pilarCol(g.pilar)}"></span>${esc(g.pilar || "")}${g.fecha ? " · " + parseD(g.fecha).getDate() + " " + MESES[parseD(g.fecha).getMonth()] : ""}</span></span></button>`).join("") : `<div class="empty">Ningún guion con ese filtro.</div>`}`;
}
V_.guiones = (id) => {
  if (!id && window.innerWidth > 900) { const f = filtered()[0] || DB.guiones[0]; id = f ? f.id : ""; }
  const g = G(id);
  return `<div class="gl ${g ? "has-sel" : ""}"><aside class="gl-list" id="glList">${listHTML(id)}</aside><div id="gDetail">${g ? (UI.edit ? editHTML(g) : readHTML(g)) : `<div class="empty">Elige un guion de la lista o crea uno nuevo.</div>`}</div></div>`;
};
function stepper(g){
  const i = estIdx(g.estado);
  return `<div class="stepper">${ESTADOS.map(([e, n], j) => `<button class="st-${e} ${j === i ? "on" : j < i ? "past" : ""}" data-estado="${e}" data-id="${g.id}">${j < i ? "✓ " : ""}${n}</button>`).join("")}</div>`;
}
function readHTML(g){
  return `<div class="card" style="display:flex;flex-direction:column;gap:16px">
    <button class="btn sm ghost mobile-only" data-go="guiones" style="align-self:flex-start;padding-left:0">${ic("back")} Todos los guiones</button>
    <div class="gd-head"><div><span class="lab">Video ${pad(g.n)} · ${esc(g.formato)}${g.duracion ? " · " + esc(g.duracion) : ""}</span><h2>${esc(g.titulo || "Sin título")}</h2>
      <div class="row" style="margin-top:8px"><span class="chip" style="background:${pilarCol(g.pilar)};${g.pilar === "Construyendo BONXAI" || g.pilar === "IA para negocios" ? "color:#fff" : ""}">${esc(g.pilar || "Sin pilar")}</span>${g.objetivo ? `<span class="sm muted">${esc(g.objetivo)}</span>` : ""}</div></div>
      <div class="row">${g.escenas.length ? `<button class="btn wine" data-rec="${g.id}">${ic("rec")} Grabar</button>` : ""}<button class="btn" data-edit="1">${ic("edit")} Editar</button><button class="btn sm ghost" data-copy-g="${g.id}" title="Copiar guion">${ic("copy")}</button><button class="btn sm ghost" data-dup="${g.id}" title="Duplicar">${ic("dup")}</button><button class="btn sm ghost" data-del="${g.id}" title="Eliminar">${ic("trash")}</button></div></div>
    ${stepper(g)}
    <div class="row" style="gap:10px"><label class="f" style="flex:1;min-width:150px">Fecha de publicación<input type="date" data-gf="fecha" data-id="${g.id}" value="${esc(g.fecha)}"></label><label class="f" style="width:120px">Hora<input type="time" data-gf="hora" data-id="${g.id}" value="${esc(g.hora)}"></label>
      <label class="f" style="flex:1;min-width:150px">Formato<select data-gf="formato" data-id="${g.id}">${FORMATOS.map(f => `<option ${g.formato === f ? "selected" : ""}>${f}</option>`).join("")}</select></label></div>
    ${g.gancho ? `<div class="hookbox"><span class="lab">★ Gancho</span><p>“${esc(g.gancho)}”</p>${g.ganchos.length ? `<div class="alts">${g.ganchos.filter(x => x.txt !== g.gancho).map(x => `<button class="alt" data-usehook="${esc(x.txt)}" data-id="${g.id}" title="Usar este gancho"><span class="chip">${esc(x.tipo)}</span>${esc(x.txt)}</button>`).join("")}</div><p class="sm" style="font:400 .78rem var(--body);opacity:.65;margin-top:6px">Toca un gancho alterno para usarlo. Graba 2 o 3 versiones del gancho.</p>` : ""}</div>` : ""}
    ${g.escenas.length ? `<div><div class="sec" style="margin-bottom:8px"><h3>Escenas</h3><span class="muted sm">${g.escenas.length} partes</span></div><div class="scenes">${g.escenas.map(s => `<div class="scene"><div class="t">${esc(s.t)}<small>${esc(s.nombre)}</small></div><div><p class="say">${esc(s.digo)}</p>${s.como || s.pantalla ? `<div class="how">${s.como ? `<span><b>Cómo:</b> ${esc(s.como)}</span>` : ""}${s.pantalla ? `<span><b>En pantalla:</b> ${esc(s.pantalla)}</span>` : ""}</div>` : ""}</div></div>`).join("")}</div></div>`
      : `<div class="empty">Este guion aún no tiene escenas. <button class="btn sm" data-edit="1">Escribirlas</button></div>`}
    <div class="kv">${[["Texto en pantalla", g.textoPantalla], ["Edición", g.edicion], ["Stories de apoyo", g.stories], ["Descripción para publicar", g.descripcion]].filter(x => x[1]).map(([l, v]) => `<div><div class="sec"><span class="lab">${l}</span><button class="btn sm ghost" data-copy="${esc(v)}" style="padding:0 4px">${ic("copy")}</button></div><p>${esc(v)}</p></div>`).join("")}</div>
    <div class="grid g2"><label class="f">Link Instagram<input type="url" placeholder="https://instagram.com/reel/…" data-gl="ig" data-id="${g.id}" value="${esc(g.links.ig)}"></label><label class="f">Link TikTok<input type="url" placeholder="https://tiktok.com/@…" data-gl="tt" data-id="${g.id}" value="${esc(g.links.tt)}"></label></div>
    <label class="f">Notas (tomas, ideas, qué cambiar)<textarea data-gf="notas" data-id="${g.id}" placeholder="Ej: la toma 2 del gancho quedó mejor…">${esc(g.notas)}</textarea></label>
  </div>`;
}
function editHTML(g){
  const F = (k, l, ta, ph = "") => `<label class="f">${l}${ta ? `<textarea data-gf="${k}" data-id="${g.id}" placeholder="${esc(ph)}">${esc(g[k])}</textarea>` : `<input type="text" data-gf="${k}" data-id="${g.id}" value="${esc(g[k])}" placeholder="${esc(ph)}">`}</label>`;
  return `<div class="card" style="display:flex;flex-direction:column;gap:14px">
    <div class="gd-head"><div><span class="lab">Editando · Video ${pad(g.n)}</span><h2>${esc(g.titulo || "Nuevo guion")}</h2></div><button class="btn sage" data-edit="0">✓ Listo</button></div>
    <p class="sm muted">Todo se guarda solo mientras escribes.</p>
    ${F("titulo", "Título", false)}
    <div class="grid g3"><label class="f">Pilar<select data-gf="pilar" data-id="${g.id}"><option value="">—</option>${PILARES.map(p => `<option ${g.pilar === p.n ? "selected" : ""}>${esc(p.n)}</option>`).join("")}</select></label>
      <label class="f">Formato<select data-gf="formato" data-id="${g.id}">${FORMATOS.map(f => `<option ${g.formato === f ? "selected" : ""}>${f}</option>`).join("")}</select></label>${F("duracion", "Duración", false, "25–35 s")}</div>
    ${F("objetivo", "Objetivo", true)}
    ${F("gancho", "Gancho principal", true, "La primera frase. Sin saludo.")}
    <div><div class="sec"><span class="lab">Ganchos alternos</span><button class="btn sm" data-addhook="${g.id}">${ic("plus")} Gancho</button></div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px">${g.ganchos.map((h, i) => `<div class="row" style="flex-wrap:nowrap"><input type="text" style="width:150px;flex:none" data-gh="tipo" data-i="${i}" data-id="${g.id}" value="${esc(h.tipo)}" placeholder="Tipo"><input type="text" data-gh="txt" data-i="${i}" data-id="${g.id}" value="${esc(h.txt)}"><button class="btn sm ghost" data-delhook="${i}" data-id="${g.id}">${ic("trash")}</button></div>`).join("")}</div></div>
    <div><div class="sec"><span class="lab">Escenas</span><button class="btn sm" data-addsc="${g.id}">${ic("plus")} Escena</button></div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px">${g.escenas.map((s, i) => `<div class="edit-scene"><div class="cols"><input type="text" data-gs="t" data-i="${i}" data-id="${g.id}" value="${esc(s.t)}" placeholder="0–3 s"><input type="text" data-gs="nombre" data-i="${i}" data-id="${g.id}" value="${esc(s.nombre)}" placeholder="Gancho"></div>
        <div class="cols"><textarea data-gs="digo" data-i="${i}" data-id="${g.id}" placeholder="Lo que digo">${esc(s.digo)}</textarea><textarea data-gs="como" data-i="${i}" data-id="${g.id}" placeholder="Cómo lo hago (tono, gesto)">${esc(s.como)}</textarea><textarea data-gs="pantalla" data-i="${i}" data-id="${g.id}" placeholder="Lo que se ve en pantalla">${esc(s.pantalla)}</textarea></div>
        <div class="cols"><button class="btn sm ghost" data-mvsc="-1" data-i="${i}" data-id="${g.id}" title="Subir">${ic("up")}</button><button class="btn sm ghost" data-mvsc="1" data-i="${i}" data-id="${g.id}" title="Bajar">${ic("down")}</button><button class="btn sm ghost" data-delsc="${i}" data-id="${g.id}" title="Eliminar">${ic("trash")}</button></div></div>`).join("") || `<p class="muted sm">Sin escenas. Usa la estructura: Gancho → Promesa → Demostración → Resultado → CTA.</p>`}</div></div>
    ${F("textoPantalla", "Texto en pantalla", true)}${F("edicion", "Notas de edición", true)}${F("stories", "Stories de apoyo", true)}${F("descripcion", "Descripción para publicar", true)}
    <button class="btn sage" data-edit="0" style="align-self:flex-start">✓ Listo</button>
  </div>`;
}
function newGuion(extra = {}){
  const g = Object.assign({id: uid(), n: nextNum(), titulo: "", pilar: "", formato: "Reel + TikTok", objetivo: "", duracion: "25–35 s", gancho: "", ganchos: [],
    escenas: STRUCT.map(s => ({t: s.t, nombre: s.n, digo: "", como: "", pantalla: ""})), textoPantalla: "", edicion: "", stories: "", descripcion: "", estado: "idea", fecha: "", hora: "", notas: "", links: {ig: "", tt: ""}, metricas: {}}, extra);
  DB.guiones.push(g); save(); return g;
}

/* ================= GRABAR (teleprompter) ================= */
let REC = null, wake = null;
const recPrefs = (() => { try { return Object.assign({fs: 2.6, notes: true}, JSON.parse(localStorage.getItem("bonxai-rec") || "{}")); } catch (e) { return {fs: 2.6, notes: true}; } })();
const saveRecPrefs = () => { try { localStorage.setItem("bonxai-rec", JSON.stringify(recPrefs)); } catch (e) {} };
function openRec(g){
  REC = {g, i: 0};
  let el = $("#rec"); if (!el) { el = document.createElement("div"); el.id = "rec"; el.className = "rec"; document.body.appendChild(el); }
  document.body.style.overflow = "hidden";
  try { navigator.wakeLock && navigator.wakeLock.request("screen").then(w => wake = w).catch(() => {}); } catch (e) {}
  drawRec();
}
function closeRec(){ const el = $("#rec"); if (el) el.remove(); REC = null; document.body.style.overflow = ""; try { wake && wake.release(); } catch (e) {} wake = null; }
function drawRec(){
  const {g, i} = REC, n = g.escenas.length, end = i >= n, s = g.escenas[i];
  $("#rec").innerHTML = `
    <div class="rec-top"><button data-recx="1" aria-label="Cerrar">✕ Salir</button><span class="ttl">${pad(g.n)} · ${esc(g.titulo)}</span>
      <button data-recn="1" class="${recPrefs.notes ? "on" : ""}">Notas</button><button data-recf="-1" aria-label="Letra más pequeña">A−</button><button data-recf="1" aria-label="Letra más grande">A+</button></div>
    <div class="rec-prog">${g.escenas.map((_, j) => `<i class="${j <= i ? "on" : ""}"></i>`).join("")}<i class="${end ? "on" : ""}"></i></div>
    <div class="rec-stage" id="recStage" style="--fs:${recPrefs.fs}rem">
    ${end ? `<div class="rec-end"><h2>¿Quedó? 🎬</h2><p style="opacity:.8">Antes de cerrar, revisa:</p>
        <div class="rec-ck">${CKG[1].items.map((t, j) => `<label><input type="checkbox" data-ck="${g.id}.${j}" ${DB.checks[g.id + "." + j] ? "checked" : ""}> ${esc(t)}</label>`).join("")}</div>
        <div class="row" style="justify-content:center;margin-top:8px"><button class="btn big y" data-recdone="${g.id}">✓ Marcar como grabado</button><button class="btn big" data-recgo="0">↺ Repetir desde el gancho</button></div></div>`
    : `<div class="rec-meta"><span class="chip">${esc(s.nombre)}</span><span>${esc(s.t)} · escena ${i + 1} de ${n}</span></div>
       <p class="rec-say">${esc(s.digo)}</p>
       ${recPrefs.notes && (s.como || s.pantalla) ? `<div class="rec-help">${s.como ? `<div><b>Cómo lo hago</b>${esc(s.como)}</div>` : ""}${s.pantalla ? `<div><b>En pantalla</b>${esc(s.pantalla)}</div>` : ""}</div>` : ""}
       ${i === 0 && g.ganchos.length ? `<div class="rec-help" style="grid-template-columns:1fr"><div><b>Ganchos alternos · graba 2 o 3 versiones</b>${g.ganchos.filter(x => x.txt !== s.digo).map(x => "• " + esc(x.txt)).join("<br>")}</div></div>` : ""}`}
    </div>
    <div class="rec-bot"><button data-recgo="${i - 1}" ${i === 0 ? "disabled style='opacity:.3'" : ""}>← Anterior</button><span class="hint">Toca la pantalla o usa ← → para avanzar</span>${end ? `<button data-recx="1">Cerrar</button>` : `<button class="pri" data-recgo="${i + 1}">${i === n - 1 ? "Terminar" : "Siguiente →"}</button>`}</div>`;
}
function recGo(i){ if (!REC) return; REC.i = Math.max(0, Math.min(REC.g.escenas.length, i)); drawRec(); }

/* ================= CALENDARIO ================= */
V_.calendario = () => {
  const mon = addD(mondayOf(today()), UI.wk * 7), tk = ymd(today());
  const days = Array.from({length: 7}, (_, i) => addD(mon, i));
  const sinFecha = DB.guiones.filter(g => !g.fecha && g.estado !== "publicado").sort(byNum);
  const rango = `${mon.getDate()} ${MESES[mon.getMonth()]} – ${days[6].getDate()} ${MESES[days[6].getMonth()]}`;
  return `
  <section class="card">
    <div class="sec"><div class="row"><button class="btn sm" data-wk="-1">←</button><h2 style="min-width:190px;text-align:center">${rango}</h2><button class="btn sm" data-wk="1">→</button>${UI.wk ? `<button class="btn sm ghost" data-wk="0">Esta semana</button>` : ""}</div>
      <div class="row"><button class="btn sage" data-fill="${ymd(mon)}">Rellenar semana con guiones listos</button></div></div>
    <div class="wk" style="margin-top:14px">${days.map(d => { const c = calOf(d), k = ymd(d), items = DB.guiones.filter(g => g.fecha === k).sort((a, b) => (a.hora || "").localeCompare(b.hora || ""));
      return `<div class="day ${k === tk ? "today" : ""}" style="--dc:${objCol(c.ob)}"><div class="dh"><b>${DIAS[d.getDay()].slice(0, 3)} ${d.getDate()}</b><small>${esc(c.pz)}</small><small style="opacity:.75">${esc(c.ob)}</small></div>
        <div class="dl">${items.map(g => `<button class="ci st-${g.estado}" data-go="guiones/${g.id}"><b>${esc(g.hora || "")} ${esc(g.formato)}</b>${esc(g.titulo || "Sin título")}</button>`).join("")}<button class="add" data-pickday="${k}">+ Agregar</button></div></div>`; }).join("")}</div>
    <div class="legend" style="margin-top:12px">${ESTADOS.map(([e, n]) => `<span><i class="dot st-${e}" style="background:var(--sc)"></i>${n}</span>`).join("")}</div>
  </section>

  <div class="grid g2">
    <section class="card"><div class="sec"><h3>Sin fecha todavía (${sinFecha.length})</h3></div>
      <div class="pieces" style="margin-top:10px">${sinFecha.length ? sinFecha.map(g => `<button class="ci st-${g.estado}" data-go="guiones/${g.id}" style="padding:8px 10px"><b>${pad(g.n)} · ${estLabel(g.estado)}</b>${esc(g.titulo || "Sin título")}</button>`).join("") : `<p class="muted">Todos los guiones tienen fecha 🎉</p>`}</div></section>
    <section class="card"><h3>Plan de 30 días</h3><p class="sm muted" style="margin-top:4px">Pon la fecha en que arrancaron. En “Hoy” verás en qué día y semana van.</p>
      <label class="f" style="margin-top:10px;max-width:220px">Inicio del plan<input type="date" data-db="inicioPlan" value="${esc(DB.inicioPlan)}"></label>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:12px">${WEEKS.map((w, i) => `<div class="row" style="flex-wrap:nowrap;align-items:flex-start"><span class="chip" style="background:${w.col}">S${i + 1}</span><span class="sm"><b>${esc(w.t)}:</b> ${esc(w.items[0])}</span></div>`).join("")}</div>
      <button class="btn sm" data-go="estrategia/plan" style="margin-top:10px">Ver plan completo</button></section>
  </div>`;
};
function fillWeek(monK){
  const mon = parseD(monK), tk = ymd(today());
  const pool = DB.guiones.filter(g => g.estado === "listo" && !g.fecha).sort(byNum);
  let n = 0;
  for (let i = 0; i < 6 && pool.length; i++) {
    const d = addD(mon, i), k = ymd(d); if (k < tk) continue;
    if (DB.guiones.some(g => g.fecha === k)) continue;
    const g = pool.shift(); g.fecha = k; g.hora = g.hora || (d.getDay() === 4 ? "18:00" : d.getDay() === 5 ? "17:00" : "12:00"); n++;
  }
  if (n) { save(); refresh(); toast(`${n} guiones programados esta semana`); } else toast(pool.length ? "Los días libres ya pasaron o están ocupados" : "No hay guiones “Listo para grabar” sin fecha");
}
function pickDay(k){
  const d = parseD(k), c = calOf(d), libres = DB.guiones.filter(g => g.fecha !== k && g.estado !== "publicado").sort((a, b) => (!!a.fecha - !!b.fecha) || byNum(a, b));
  modal(`<h3>${fmtD(d)}</h3><p class="sm">Toca: <b>${esc(c.pz)}</b> · Objetivo: <b>${esc(c.ob)}</b></p>
    <span class="lab">Elegir un guion</span><div class="pick">${libres.map(g => `<button data-assign="${g.id}" data-day="${k}"><b>${pad(g.n)}</b> · ${esc(g.titulo || "Sin título")} <span class="muted sm">· ${estLabel(g.estado)}${g.fecha ? " · ya en " + parseD(g.fecha).getDate() + " " + MESES[parseD(g.fecha).getMonth()] : ""}</span></button>`).join("") || `<p class="muted sm">No hay guiones disponibles.</p>`}</div>
    <span class="lab" style="margin-top:6px">O crear una pieza rápida</span>
    <div class="grid g2"><input type="text" id="qT" placeholder="Ej: Carrusel 5 pasos WhatsApp" value="${esc(c.ideas[0] || "")}"><select id="qF">${FORMATOS.map(f => `<option ${/carrusel/i.test(c.fm) && f === "Carrusel" ? "selected" : ""}>${f}</option>`).join("")}</select></div>
    <div class="row"><input type="time" id="qH" value="12:00" style="width:130px"><button class="btn wine" data-quick="${k}">${ic("plus")} Crear y programar</button><button class="btn ghost" data-close="1">Cancelar</button></div>`);
}
function modal(html){ closeModal(); const m = document.createElement("div"); m.className = "modal"; m.id = "modal"; m.innerHTML = `<div role="dialog" aria-modal="true">${html}</div>`; document.body.appendChild(m); m.addEventListener("click", e => { if (e.target === m) closeModal(); }); }
function closeModal(){ const m = $("#modal"); if (m) m.remove(); }

/* ================= MÉTRICAS ================= */
const MF = [["alcance","Alcance"],["ret","Retención %"],["guard","Guardados"],["comp","Compartidos"],["visitas","Visitas perfil"],["seg","Seguidores"]];
const rate = (a, b) => a && b ? (a / b * 1000) : null;
function metList(){ const red = UI.red; return DB.guiones.filter(g => estIdx(g.estado) >= 3 || (g.metricas[red] && Object.keys(g.metricas[red]).length)).sort((a, b) => (b.fecha || "").localeCompare(a.fecha || "") || byNum(a, b)); }
function bestHTML(){
  const L = metList(), m = g => g.metricas[UI.red] || {};
  const bR = x => x.ret ? +x.ret : null;
  const best = (f, lab, col, pct) => { let top = null, v = -1; L.forEach(g => { const x = f(m(g)); if (x != null && x > v) { v = x; top = g; } }); return `<div style="--bc:${col}"><span class="lab" style="color:var(--ink)">${lab}</span>${top ? `<b>${pct ? v + "%" : v.toFixed(1)}</b><span class="sm">${pad(top.n)} · ${esc(top.titulo)}</span>` : `<b>—</b><span class="sm">Aún sin datos</span>`}</div>`; };
  return best(bR, "Mejor retención", "#F7D774", true) + best(x => rate(+x.comp, +x.alcance), "Más compartidos ×1.000", "#AEC38E") + best(x => rate(+x.guard, +x.alcance), "Más guardados ×1.000", "#F7B7A8");
}
V_.metricas = () => {
  const red = UI.red, L = metList(), m = g => g.metricas[red] || {};
  return `
  <section class="card">
    <div class="sec"><div class="tabs" style="position:static;margin:0;padding:0"><button class="${red === "ig" ? "on" : ""}" data-red="ig">Instagram</button><button class="${red === "tt" ? "on" : ""}" data-red="tt">TikTok</button></div>
      <span class="muted sm">Mira los números a los 7 días de publicado. Por 1.000 = por cada mil de alcance.</span></div>
    <div class="best" id="bestBox" style="margin-top:14px">${bestHTML()}</div>
    <div class="tw" style="margin-top:14px">${L.length ? `<table class="mt"><thead><tr><th>Video</th>${MF.map(f => `<th>${f[1]}</th>`).join("")}<th>Guard. ×1k</th><th>Comp. ×1k</th></tr></thead><tbody>
      ${L.map(g => { const x = m(g), rg = rate(+x.guard, +x.alcance), rc = rate(+x.comp, +x.alcance); return `<tr><td class="ttl"><a href="#guiones/${g.id}">${pad(g.n)} · ${esc(g.titulo)}</a><br><small class="muted">${g.fecha ? fmtD(parseD(g.fecha)) : "sin fecha"} · ${estLabel(g.estado)}</small></td>
        ${MF.map(([k]) => `<td><input type="number" min="0" inputmode="numeric" data-met="${k}" data-id="${g.id}" value="${esc(x[k] ?? "")}"></td>`).join("")}<td class="rate" id="rg-${g.id}">${rg != null ? rg.toFixed(1) : "—"}</td><td class="rate" id="rc-${g.id}">${rc != null ? rc.toFixed(1) : "—"}</td></tr>`; }).join("")}</tbody></table>`
      : `<div class="empty">Cuando marques un guion como Editado o Publicado, aparece aquí para anotar sus números.</div>`}</div>
  </section>
  <section class="card"><h3>Aprendizajes de la semana</h3><p class="sm muted" style="margin-top:4px">${ANA_FIELDS.map(esc).join(" · ")}</p>
    <textarea data-db="notas" style="margin-top:10px;min-height:110px" placeholder="Escribe aquí qué aprendieron y qué van a probar…">${esc(DB.notas)}</textarea></section>
  <section><div class="sec" style="margin-bottom:10px"><h2>Qué significa cada número</h2></div>
    <div class="grid g3">${METRICS.map(x => `<div class="tile"><div class="bar" style="--pc:${x.col}"></div><b>${esc(x.t)}</b><span class="sm"><b>Mide:</b> ${esc(x.i)}</span><span class="sm"><b>Si sale bajo:</b> ${esc(x.b)}</span><span class="sm"><b>Prueba:</b> ${esc(x.p)}</span></div>`).join("")}</div></section>
  <section><div class="sec" style="margin-bottom:10px"><h2>Diagnóstico rápido</h2><span class="muted sm">Busca lo que te pasa</span></div>
    <div style="display:flex;flex-direction:column;gap:8px">${SINTOMAS.map(s => `<details class="acc"><summary>${esc(s.t)}</summary><div><p class="muted">${esc(s.ves)}</p><div class="grid g2"><div><span class="lab">Posibles causas</span><ul class="clean">${s.causa.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div><div><span class="lab">Qué probar</span><ul class="clean">${s.prueba.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div></div>${s.nota ? `<p class="sm"><b>Ojo:</b> ${esc(s.nota)}</p>` : ""}</div></details>`).join("")}</div></section>`;
};

/* ================= ESTRATEGIA ================= */
const TABS = [["resumen","Resumen"],["estructura","Estructura del video"],["ganchos","Ganchos"],["stories","Stories"],["plataformas","Plataformas"],["checklist","Checklist"],["plan","Plan 30 días"],["nicho","Lo que funciona hoy"]];
V_.estrategia = (tab) => {
  const t = TABS.find(x => x[0] === tab) ? tab : "resumen";
  return `<div class="tabs">${TABS.map(([k, n]) => `<button class="${t === k ? "on" : ""}" data-go="estrategia/${k}">${n}</button>`).join("")}</div>${EST[t]()}`;
};
const lst = a => `<ul class="clean">${a.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
const EST = {
  resumen: () => `
    <section class="card w"><span class="lab">La promesa de la cuenta</span><h2 style="margin-top:6px;font-size:1.6rem">IA práctica para negocios</h2>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:12px">${REGLAS.map((r, i) => `<p><b style="color:var(--butter)">${i + 1}.</b> ${esc(r)}</p>`).join("")}</div></section>
    <section><h2 style="margin-bottom:10px">Los 4 pilares</h2><div class="grid g2">${PILARES.map(p => `<div class="pil"><div class="ph" style="--pc:${p.col};${p.col === "#6B1626" || p.col === "#D3322A" ? "color:#fff" : ""}"><b>${esc(p.n)}</b><span>${p.p}%</span></div><div class="pb"><p><b>Qué va:</b> ${esc(p.que)}</p><p><b>Para:</b> ${esc(p.ob)}</p><p class="muted">${esc(p.meta)}</p>${lst(p.ideas)}<p class="sm"><b>Mide:</b> ${esc(p.mide.join(" · "))}</p></div></div>`).join("")}</div></section>
    <section class="card"><h3>Qué queremos tener en 30 días</h3><div class="grid g2" style="margin-top:10px">${OBJ30.map(o => `<div><b>${esc(o[0])}</b><p class="sm muted">${esc(o[1])}</p></div>`).join("")}</div></section>
    <section class="card"><h3>Bloques de trabajo de la semana</h3><table class="cmp" style="margin-top:8px"><tbody>${WORKBLOCKS.map(w => `<tr><td>${esc(w[0])}</td><td style="white-space:nowrap">${esc(w[1])}</td><td>${esc(w[2])}</td></tr>`).join("")}</tbody></table></section>`,
  estructura: () => `
    <section><h2 style="margin-bottom:10px">Estructura de un video corto</h2><div class="struct">${STRUCT.map(s => `<div style="--pc:${s.col};--pk:${s.k}"><small>${esc(s.t)}</small><b>${esc(s.n)}</b><p class="sm" style="font-style:italic;margin-top:4px">${esc(s.q)}</p><p class="sm" style="margin-top:4px">${esc(s.d)}</p></div>`).join("")}</div></section>
    <section><h2 style="margin-bottom:10px">Técnicas de retención</h2><div class="grid g2">${TECNICAS.map(x => `<div class="tile"><div class="bar" style="--pc:${x.col}"></div><b>${esc(x.t)}</b><span class="sm">${esc(x.d)}</span><span class="sm"><b>En la práctica:</b> ${esc(x.p)}</span></div>`).join("")}</div></section>`,
  ganchos: () => `
    <section><h2 style="margin-bottom:10px">Fórmulas que funcionan</h2><div class="grid g2">${GANCHO_FORMULAS.map(f => `<div class="tile"><b>${esc(f.n)}</b><p style="font:700 1.05rem/1.3 var(--display)">“${esc(f.ej)}”</p><span class="sm muted">${esc(f.cuando)}</span></div>`).join("")}</div></section>
    <section class="card"><h3>Plantillas para completar</h3><p class="sm muted">Cambia lo que está entre corchetes. Toca para copiar.</p><div style="margin-top:8px">${HOOKS.map(h => `<div class="copyline"><span>${esc(h)}</span><button class="btn sm ghost" data-copy="${esc(h)}">${ic("copy")}</button></div>`).join("")}</div></section>
    <section class="card"><h3>Tipos de gancho para variar</h3><div class="row" style="margin-top:8px">${HOOK_TYPES.map(h => `<span class="chip">${esc(h)}</span>`).join("")}</div></section>`,
  stories: () => `
    <section class="card"><h3>Las 4 Stories del día</h3><div class="grid g4" style="margin-top:10px">${STORY_SLOTS.map(s => `<div class="tile"><b>${esc(s[1])} · ${esc(s[2])}</b><span class="sm">${esc(s[3])}</span></div>`).join("")}</div></section>
    <section><h2 style="margin-bottom:10px">Secuencia de 5 Stories</h2><div class="struct">${STORY_SLIDES.map(s => `<div style="--pc:${s.col}"><small>${s.n} · ${esc(s.stk)}</small><b>${esc(s.tipo)}</b><p class="sm" style="margin-top:4px">“${esc(s.ej)}”</p><p class="sm" style="margin-top:4px">${esc(s.how)}</p></div>`).join("")}</div></section>
    <section class="card"><h3>El día que sale un Reel</h3><div class="grid g4" style="margin-top:10px">${REEL_DAY.map((r, i) => `<div class="tile"><b>${i + 1}. ${esc(r.t)}</b><span class="sm">${esc(r.d)}</span></div>`).join("")}</div></section>
    <section><h2 style="margin-bottom:10px">Banco de dinámicas</h2><div class="grid g2">${STORY_BANK.map(s => `<div class="tile"><div class="bar" style="--pc:${s.col}"></div><div class="sec"><b>${esc(s.n)}</b><span class="chip">${esc(s.st)}</span></div><span class="sm muted">${esc(s.que)}</span><div class="copyline" style="border:0;padding:0"><span class="sm">“${esc(s.ex)}”</span><button class="btn sm ghost" data-copy="${esc(s.ex)}">${ic("copy")}</button></div><span class="sm"><b>Cómo:</b> ${esc(s.how)}</span></div>`).join("")}</div></section>`,
  plataformas: () => `
    <section class="card"><h3>Instagram vs. TikTok</h3><div class="tw"><table class="cmp" style="margin-top:8px"><thead><tr><th></th><th>Instagram</th><th>TikTok</th></tr></thead><tbody>${CMP.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</tbody></table></div></section>
    <section class="card"><h3>Un video, dos apps</h3><div class="grid g3" style="margin-top:10px">${ADAPT_STEPS.map((s, i) => `<div class="tile"><b>${i + 1}. ${esc(s[0])}</b><span class="sm">${esc(s[1])}</span></div>`).join("")}</div>
      <div class="grid g2" style="margin-top:12px"><div><span class="lab">Se mantiene</span>${lst(KEEP)}</div><div><span class="lab">Se adapta</span>${lst(CHANGE)}</div></div></section>
    <div class="grid g2"><section class="card"><h3>Antes de publicar</h3><div style="margin-top:8px">${lst(PUB_BEFORE)}</div></section><section class="card"><h3>Después de publicar</h3><div style="margin-top:8px">${lst(PUB_AFTER)}</div></section></div>
    <div class="grid g2">${Object.keys(SALUD).map(k => `<section class="card"><h3>Salud del perfil · ${k}</h3><div style="margin-top:8px">${lst(SALUD[k])}</div></section>`).join("")}</div>`,
  checklist: () => `<p class="muted">Lista general para cada video. La parte de “Al grabar” también aparece al terminar el modo grabar.</p>
    <div class="grid g2">${CKG.map(c => `<section class="tile" style="border-top:8px solid ${c.col}"><b style="font:800 1.1rem var(--display)">${esc(c.t)}</b>${lst(c.items)}</section>`).join("")}</div>`,
  plan: () => `
    <div class="grid g2">${WEEKS.map((w, i) => `<section class="pil"><div class="ph" style="--pc:${w.col}"><b>Semana ${i + 1} · ${esc(w.t)}</b></div><div class="pb">${lst(w.items)}</div></section>`).join("")}</div>
    <section class="card"><h3>La semana tipo</h3><div class="tw"><table class="cmp" style="margin-top:8px"><thead><tr><th>Día</th><th>Pieza</th><th>Formato</th><th>Objetivo</th><th>Stories</th></tr></thead><tbody>${CAL.map(c => `<tr><td><span class="dot" style="background:${objCol(c.ob)}"></span> ${esc(c.d)}</td><td>${esc(c.pz)}</td><td>${esc(c.fm)}</td><td>${esc(c.ob)}</td><td>${esc(c.st)}</td></tr>`).join("")}</tbody></table></div></section>
    <section class="card"><h3>Ideas extra</h3><div class="grid g2" style="margin-top:8px"><div><span class="lab">Carruseles</span>${lst(CARRUSEL_IDEAS)}</div><div><span class="lab">Noticias con criterio</span>${lst(NOTICIA_IDEAS)}</div></div></section>`,
  nicho: () => `
    <p class="muted">Investigación del 29 de octubre de 2026 sobre lo que se está moviendo en IA para negocios.</p>
    <div class="grid g2">${NICHO.map(n => `<div class="tile"><b>${esc(n.t)}</b><span class="sm">${esc(n.d)}</span><span class="sm" style="background:#FFF3D6;border-left:4px solid var(--wine);padding:6px 8px;border-radius:6px"><b>Para ustedes:</b> ${esc(n.q)}</span></div>`).join("")}</div>
    <section class="card"><h3>Fuentes</h3><ul class="clean" style="margin-top:8px">${NICHO_FUENTES.concat(OFFICIAL).map(f => `<li><a href="${esc(f[1])}" target="_blank" rel="noopener">${esc(f[0])}</a></li>`).join("")}</ul></section>`
};

/* ================= DATOS / GITHUB ================= */
function dataModal(){
  const c = ghCfg();
  modal(`<h3>Datos y GitHub</h3>
    <p class="sm">Todo vive en un solo archivo: <b>data/db.json</b> (${DB.guiones.length} guiones). Se guarda solo en este equipo${CLOUD ? " y en la nube de Claude" : ""}. Para el repositorio, súbelo a GitHub.</p>
    <p class="sm"><b>Estado:</b> ${ghDirty ? "hay cambios sin subir a GitHub" : "GitHub al día"} · última edición ${DB.actualizado ? new Date(DB.actualizado).toLocaleString("es-CO") : "—"}</p>
    <div class="row"><button class="btn wine" data-ghpush="1">${ic("up")} Subir a GitHub</button><button class="btn" data-ghpull="1">${ic("down")} Traer de GitHub</button></div>
    <details class="acc"><summary>Configurar GitHub</summary><div>
      <div class="grid g2"><label class="f">Usuario u organización<input type="text" id="ghO" value="${esc(c.owner)}" placeholder="felipeog"></label><label class="f">Repositorio<input type="text" id="ghR" value="${esc(c.repo)}" placeholder="bonxai-contenido"></label>
      <label class="f">Rama<input type="text" id="ghB" value="${esc(c.branch)}"></label><label class="f">Archivo<input type="text" id="ghP" value="${esc(c.path)}"></label></div>
      <label class="f">Token (fine-grained, permiso “Contents: Read and write” solo en ese repo)<input type="password" id="ghT" value="${esc(c.token)}" placeholder="github_pat_…"></label>
      <label class="sm" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="ghA" ${c.auto ? "checked" : ""}> Subir automáticamente unos segundos después de cada cambio</label>
      <p class="sm muted">El token se guarda solo en este navegador. Cada persona configura el suyo en su celular o computador.</p>
      <button class="btn sage" data-ghsave="1" style="align-self:flex-start">Guardar configuración</button></div></details>
    <div class="row"><button class="btn" data-export="1">${ic("down")} Exportar db.json</button><label class="btn">${ic("up")} Importar db.json<input type="file" accept="application/json,.json" id="impF" hidden></label></div>
    <button class="btn ghost" data-close="1" style="align-self:flex-end">Cerrar</button>`);
}

/* ================= EVENTOS ================= */
document.addEventListener("click", e => {
  const t = e.target.closest("[data-go],[data-rec],[data-new],[data-edit],[data-estado],[data-usehook],[data-copy],[data-copy-g],[data-dup],[data-del],[data-filter],[data-addsc],[data-delsc],[data-mvsc],[data-addhook],[data-delhook],[data-wk],[data-fill],[data-pickday],[data-assign],[data-quick],[data-close],[data-red],[data-recx],[data-recgo],[data-recn],[data-recf],[data-recdone],[data-data],[data-ghpush],[data-ghpull],[data-ghsave],[data-export]");
  if (!t) { if (REC && e.target.closest("#recStage") && !e.target.closest("input,label,button")) { const r = $("#recStage").getBoundingClientRect(); recGo(REC.i + (e.clientX < r.left + r.width / 3 ? -1 : 1)); } return; }
  const d = t.dataset;
  if (d.go != null) { if (d.go.startsWith("guiones")) UI.edit = false; closeModal(); go(d.go); return; }
  if (d.rec) { go("grabar/" + d.rec); return; }
  if (d.new) { const g = newGuion(); UI.edit = true; UI.estado = ""; go("guiones/" + g.id); return; }
  if (d.edit != null) { UI.edit = d.edit === "1"; refresh(); return; }
  if (d.estado) { const g = G(d.id); g.estado = d.estado; save(); refresh(); if (d.estado === "publicado") toast("¡Publicado! Anota sus números en Métricas en unos días"); return; }
  if (d.usehook) { const g = G(d.id), old = g.gancho; g.gancho = d.usehook; if (g.escenas[0] && g.escenas[0].digo === old) g.escenas[0].digo = d.usehook; save(); refresh(); toast("Gancho cambiado"); return; }
  if (d.copy != null) { copy(d.copy); return; }
  if (d.copyG) { copy(scriptText(G(d.copyG))); return; }
  if (d.dup) { const s = G(d.dup), g = JSON.parse(JSON.stringify(s)); Object.assign(g, {id: uid(), n: nextNum(), titulo: s.titulo + " (copia)", estado: "idea", fecha: "", hora: "", links: {ig: "", tt: ""}, metricas: {}}); DB.guiones.push(g); save(); go("guiones/" + g.id); toast("Duplicado"); return; }
  if (d.del) { const g = G(d.del); if (confirm(`¿Eliminar “${g.titulo || "este guion"}”? Esto no se puede deshacer.`)) { DB.guiones = DB.guiones.filter(x => x !== g); save(); go("guiones"); toast("Eliminado"); } return; }
  if (d.filter) { UI.estado = d.filter; UI.pilar = ""; UI.q = ""; const f = filtered()[0]; go("guiones" + (f && window.innerWidth > 900 ? "/" + f.id : "")); if (route().v === "guiones") refresh(); return; }
  if (d.addsc) { G(d.addsc).escenas.push({t: "", nombre: "", digo: "", como: "", pantalla: ""}); save(); refresh(); return; }
  if (d.delsc != null) { G(d.id).escenas.splice(+d.delsc, 1); save(); refresh(); return; }
  if (d.mvsc) { const a = G(d.id).escenas, i = +d.i, j = i + +d.mvsc; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; save(); refresh(); return; }
  if (d.addhook) { G(d.addhook).ganchos.push({tipo: "", txt: ""}); save(); refresh(); return; }
  if (d.delhook != null) { G(d.id).ganchos.splice(+d.delhook, 1); save(); refresh(); return; }
  if (d.wk != null) { UI.wk = d.wk === "0" ? 0 : UI.wk + +d.wk; refresh(); return; }
  if (d.fill) { fillWeek(d.fill); return; }
  if (d.pickday) { pickDay(d.pickday); return; }
  if (d.assign) { const g = G(d.assign); g.fecha = d.day; if (!g.hora) g.hora = "12:00"; save(); closeModal(); refresh(); toast("Programado para el " + fmtD(parseD(d.day))); return; }
  if (d.quick) { const tt = $("#qT").value.trim(); if (!tt) { toast("Escribe un título"); return; } const f = $("#qF").value; const ex = {titulo: tt, formato: f, fecha: d.quick, hora: $("#qH").value}; if (/Carrusel|Stories|Otro/.test(f)) ex.escenas = []; newGuion(ex); closeModal(); refresh(); toast("Creado y programado"); return; }
  if (d.close) { closeModal(); return; }
  if (d.red) { UI.red = d.red; refresh(); return; }
  if (d.recx) { go("guiones/" + (REC ? REC.g.id : "")); return; }
  if (d.recgo != null) { recGo(+d.recgo); return; }
  if (d.recn) { recPrefs.notes = !recPrefs.notes; saveRecPrefs(); drawRec(); return; }
  if (d.recf) { recPrefs.fs = Math.max(1.4, Math.min(4.6, +(recPrefs.fs + +d.recf * 0.3).toFixed(1))); saveRecPrefs(); drawRec(); return; }
  if (d.recdone) { const g = G(d.recdone); if (estIdx(g.estado) < 2) g.estado = "grabado"; save(); toast("¡Grabado! 🎬 Sigue la edición"); go("guiones/" + g.id); return; }
  if (d.data) { dataModal(); return; }
  if (d.ghsave) { ghSave({owner: $("#ghO").value.trim(), repo: $("#ghR").value.trim(), branch: $("#ghB").value.trim() || "main", path: $("#ghP").value.trim() || "data/db.json", token: $("#ghT").value.trim(), auto: $("#ghA").checked}); toast("Configuración guardada"); return; }
  if (d.ghpush) { closeModal(); ghPush(false); return; }
  if (d.ghpull) { closeModal(); ghPull(); return; }
  if (d.export) { exportJSON(); return; }
});
document.addEventListener("input", e => {
  const el = e.target, d = el.dataset; if (!d) return;
  if (el.tagName === "TEXTAREA") { el.style.height = "auto"; el.style.height = (el.scrollHeight + 4) + "px"; }
  if (d.gf) { const g = G(d.id); g[d.gf] = el.value; save(); if (d.gf === "titulo") { const h = $(".gd-head h2"); if (h) h.textContent = el.value || "Nuevo guion"; } if (d.gf === "fecha" || d.gf === "formato" || d.gf === "pilar") rerenderList(); return; }
  if (d.gs) { G(d.id).escenas[+d.i][d.gs] = el.value; save(); return; }
  if (d.gh) { G(d.id).ganchos[+d.i][d.gh] = el.value; save(); return; }
  if (d.gl) { G(d.id).links[d.gl] = el.value; save(); return; }
  if (d.db) { DB[d.db] = el.value; save(); return; }
  if (d.met) { const g = G(d.id); g.metricas[UI.red] = g.metricas[UI.red] || {}; if (el.value === "") delete g.metricas[UI.red][d.met]; else g.metricas[UI.red][d.met] = +el.value; save();
    const x = g.metricas[UI.red], rg = rate(+x.guard, +x.alcance), rc = rate(+x.comp, +x.alcance); $("#rg-" + g.id).textContent = rg != null ? rg.toFixed(1) : "—"; $("#rc-" + g.id).textContent = rc != null ? rc.toFixed(1) : "—"; $("#bestBox").innerHTML = bestHTML(); return; }
  if (d.ui) { UI[d.ui] = el.value; rerenderList(); if (d.ui === "q") { const s = $("[data-ui=q]"); s.focus(); s.setSelectionRange(s.value.length, s.value.length); } return; }
});
document.addEventListener("change", e => {
  const el = e.target;
  if (el.dataset && el.dataset.ck) { DB.checks[el.dataset.ck] = el.checked; save(); }
  if (el.id === "impF" && el.files[0]) { importJSON(el.files[0]); closeModal(); }
  if (el.dataset && (el.dataset.gf === "fecha" || el.dataset.db === "inicioPlan")) { /* ya guardado en input */ }
});
function rerenderList(){ const l = $("#glList"); if (l) { const sel = route().a; l.innerHTML = listHTML(sel); counts(); } }
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { if ($("#modal")) closeModal(); else if (REC) $("[data-recx]").click(); }
  if (!REC || e.target.matches("input,textarea,select")) return;
  if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); recGo(REC.i + 1); }
  if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); recGo(REC.i - 1); }
});
window.addEventListener("hashchange", render);

(async function init(){
  buildNav();
  await loadDB();
  render();
  initCloud();
})();

/* Datos: un solo archivo, data/db.json, es la base de todo lo que grabamos.
   - Se guarda al instante en este navegador.
   - Si la página corre como artefacto de Claude, se sincroniza en la nube del artefacto (celular ↔ computador).
   - Con GitHub configurado, "Subir a GitHub" escribe data/db.json en el repositorio. */
const LSK = "bonxai-v3-db", GHK = "bonxai-v3-github";
let DB = null;            // la base en memoria
let CLOUD = null;         // base del artefacto (si existe)
let ghDirty = false;

const nowISO = () => new Date().toISOString();
const newer = (a, b) => (a && a.actualizado || "") > (b && b.actualizado || "");

function normalize(d){
  d = d && typeof d === "object" ? d : {};
  d.version = 3;
  d.guiones = Array.isArray(d.guiones) ? d.guiones : [];
  d.guiones.forEach(g => {
    g.ganchos = g.ganchos || []; g.escenas = g.escenas || []; g.links = g.links || {ig:"", tt:""};
    g.metricas = g.metricas || {}; g.estado = g.estado || "idea"; g.formato = g.formato || "Reel + TikTok";
    ["titulo","pilar","objetivo","duracion","gancho","textoPantalla","edicion","stories","descripcion","fecha","hora","notas"].forEach(k => { if (g[k] == null) g[k] = ""; });
  });
  d.inicioPlan = d.inicioPlan || "";
  d.notas = d.notas || "";
  d.checks = d.checks || {};
  d.actualizado = d.actualizado || "";
  return d;
}

async function loadDB(){
  let base = null, local = null;
  try { const r = await fetch("data/db.json", {cache: "no-store"}); if (r.ok) base = await r.json(); } catch (e) {}
  try { local = JSON.parse(localStorage.getItem(LSK) || "null"); } catch (e) {}
  DB = normalize(local && (!base || !newer(base, local)) ? local : (base || local || {}));
  if (base && local && newer(base, local)) toast("Se cargó la versión más reciente del repositorio");
  try { ghDirty = localStorage.getItem(GHK + "-dirty") === "1"; } catch (e) {}
}

let saveT = null, cloudT = null, ghT = null;
function save(){
  DB.actualizado = nowISO();
  clearTimeout(saveT);
  saveT = setTimeout(() => { try { localStorage.setItem(LSK, JSON.stringify(DB)); } catch (e) {} }, 150);
  ghDirty = true; try { localStorage.setItem(GHK + "-dirty", "1"); } catch (e) {}
  syncLabel();
  if (CLOUD) { clearTimeout(cloudT); cloudT = setTimeout(pushCloud, 1200); }
  const g = ghCfg(); if (g.auto && g.token) { clearTimeout(ghT); ghT = setTimeout(() => ghPush(true), 8000); }
}
window.addEventListener("pagehide", () => { try { localStorage.setItem(LSK, JSON.stringify(DB)); } catch (e) {} });

/* ---------- nube del artefacto ---------- */
function syncLabel(t){
  const el = document.getElementById("syncSt"); if (!el) return;
  if (t) { el.textContent = t; return; }
  el.textContent = (CLOUD ? "Nube ✓" : "Guardado en este equipo") + (ghDirty ? " · cambios sin subir a GitHub" : " · GitHub al día");
}
async function pushCloud(){
  if (!CLOUD) return;
  try { await CLOUD.doc("app/db").set({actualizado: DB.actualizado, data: JSON.stringify(DB)}); syncLabel(); }
  catch (e) { syncLabel("No se pudo guardar en la nube"); }
}
const typing = () => { const a = document.activeElement; return !!(a && a.matches && a.matches("input,textarea,select")); };
function initCloud(){
  syncLabel();
  if (!(window.claude && claude.use)) return;
  claude.use("db").then(d => {
    if (!d) return; CLOUD = d;
    CLOUD.doc("app/db").onSnapshot(s => {
      if (!s.exists) { pushCloud(); return; }
      const r = s.data() || {};
      if ((r.actualizado || "") > (DB.actualizado || "")) {
        const apply = () => { try { DB = normalize(JSON.parse(r.data)); localStorage.setItem(LSK, r.data); } catch (e) { return; } refresh(); toast("Datos actualizados desde la nube"); };
        if (typing()) { const once = () => { document.removeEventListener("focusout", once, true); setTimeout(apply, 300); }; document.addEventListener("focusout", once, true); }
        else apply();
      } else if ((r.actualizado || "") < (DB.actualizado || "")) pushCloud();
      syncLabel();
    }, () => {});
  }).catch(() => {});
}

/* ---------- GitHub ---------- */
function ghCfg(){
  let c = {}; try { c = JSON.parse(localStorage.getItem(GHK) || "{}"); } catch (e) {}
  if (!c.owner && /\.github\.io$/.test(location.hostname)) { c.owner = location.hostname.split(".")[0]; c.repo = c.repo || location.pathname.split("/").filter(Boolean)[0] || ""; }
  return Object.assign({owner:"", repo:"", branch:"main", path:"data/db.json", token:"", auto:false}, c);
}
function ghSave(c){ try { localStorage.setItem(GHK, JSON.stringify(c)); } catch (e) {} }
const b64 = s => btoa(unescape(encodeURIComponent(s)));
const unb64 = s => decodeURIComponent(escape(atob(s.replace(/\s/g, ""))));
async function ghReq(method, body){
  const c = ghCfg();
  if (!c.owner || !c.repo || !c.token) throw new Error("Falta configurar usuario, repositorio o token de GitHub.");
  const url = `https://api.github.com/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${c.path.split("/").map(encodeURIComponent).join("/")}` + (method === "GET" ? `?ref=${encodeURIComponent(c.branch)}` : "");
  const r = await fetch(url, {method, headers: {"Authorization": "Bearer " + c.token, "Accept": "application/vnd.github+json"}, body: body ? JSON.stringify(body) : undefined});
  if (r.status === 404 && method === "GET") return null;
  if (!r.ok) { let m = ""; try { m = (await r.json()).message; } catch (e) {} throw new Error(`GitHub respondió ${r.status}${m ? ": " + m : ""}`); }
  return r.json();
}
async function ghPush(silent){
  try {
    syncLabel("Subiendo a GitHub…");
    const cur = await ghReq("GET");
    if (cur && !silent) {
      try { const remote = JSON.parse(unb64(cur.content)); if (newer(remote, DB) && !confirm("En GitHub hay una versión más nueva que la tuya. ¿Quieres reemplazarla de todos modos?")) { syncLabel(); return; } } catch (e) {}
    }
    const c = ghCfg();
    await ghReq("PUT", {message: "Actualiza guiones y calendario · " + new Date().toLocaleString("es-CO"), content: b64(JSON.stringify(DB, null, 2) + "\n"), branch: c.branch, sha: cur ? cur.sha : undefined});
    ghDirty = false; try { localStorage.setItem(GHK + "-dirty", "0"); } catch (e) {}
    syncLabel(); if (!silent) toast("Subido a GitHub ✓");
  } catch (e) { syncLabel(); toast(ghErr(e)); }
}
async function ghPull(){
  try {
    syncLabel("Trayendo de GitHub…");
    const cur = await ghReq("GET");
    if (!cur) { toast("Ese archivo todavía no existe en GitHub. Súbelo primero."); syncLabel(); return; }
    const remote = normalize(JSON.parse(unb64(cur.content)));
    if (newer(DB, remote) && ghDirty && !confirm("Tienes cambios aquí más nuevos que los de GitHub. ¿Reemplazarlos con la versión de GitHub?")) { syncLabel(); return; }
    DB = remote; try { localStorage.setItem(LSK, JSON.stringify(DB)); localStorage.setItem(GHK + "-dirty", "0"); } catch (e) {}
    ghDirty = false; if (CLOUD) pushCloud(); refresh(); syncLabel(); toast("Traído de GitHub ✓");
  } catch (e) { syncLabel(); toast(ghErr(e)); }
}
const ghErr = e => /Failed to fetch|NetworkError|Load failed/i.test(e.message) ? "No se pudo llegar a GitHub desde aquí. Desde la página publicada en GitHub sí funciona; aquí usa Exportar." : e.message;

/* ---------- exportar / importar ---------- */
function exportJSON(){
  const blob = new Blob([JSON.stringify(DB, null, 2) + "\n"], {type: "application/json"});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "db.json"; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast("Descargado db.json · súbelo a la carpeta data/ del repositorio");
}
function importJSON(file){
  const r = new FileReader();
  r.onload = () => {
    try { const d = JSON.parse(r.result); if (!Array.isArray(d.guiones)) throw 0; DB = normalize(d); save(); refresh(); toast("Importado ✓"); }
    catch (e) { toast("Ese archivo no parece un db.json de BONXAI"); }
  };
  r.readAsText(file);
}

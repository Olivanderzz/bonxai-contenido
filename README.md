# BONXAI · Plan de contenido

App sencilla para planear, grabar y medir el contenido de BONXAI en Instagram y TikTok.

## Secciones

- **Hoy**: qué toca hoy, el siguiente guion listo para grabar y cómo va todo.
- **Guiones**: el banco de guiones con su estado (Idea → Listo para grabar → Grabado → Editado → Publicado). Se leen limpios; con **Editar** se cambia todo.
- **Grabar**: modo teleprompter a pantalla completa. Una escena a la vez, letra grande, toca la pantalla o usa ← → para avanzar. La pantalla no se apaga mientras grabas.
- **Calendario**: la semana con el tipo de pieza y objetivo de cada día. “Rellenar semana” reparte los guiones listos.
- **Métricas**: los números de cada video por red; calcula guardados y compartidos por cada 1.000 de alcance y muestra cuál ganó.
- **Estrategia**: pilares, estructura del video, ganchos, Stories, plataformas, checklist, plan de 30 días e investigación del nicho.

## Dónde están los datos

Todo lo que grabamos vive en **`data/db.json`** (guiones, fechas, estados, links y métricas).
La estrategia (material de consulta) está en `js/content.js`.

| Archivo | Qué tiene |
|---|---|
| `data/db.json` | La base de datos: guiones, calendario, estados, métricas |
| `js/content.js` | Estrategia, pilares, ganchos, Stories, checklist (solo lectura) |
| `js/app.js` | La interfaz |
| `js/store.js` | Guardado local, nube y GitHub |
| `css/app.css` | El estilo |

## Publicarlo en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `bonxai-contenido`) y sube todos estos archivos.
2. En el repo: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / root** → Save.
3. En un minuto queda en `https://TU-USUARIO.github.io/bonxai-contenido/`.

## Guardar los cambios en el repositorio desde la app

1. En GitHub: **Settings (de tu cuenta) → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
   - Repository access: *Only select repositories* → tu repo.
   - Permissions → Repository permissions → **Contents: Read and write**.
2. En la app: **Datos y GitHub → Configurar GitHub**, pega usuario, repo y token → Guardar.
3. Usa **Subir a GitHub** cuando terminen de trabajar (o activa la subida automática). Cada subida queda como un commit, así tienen el historial de todo.
4. En otro celular o computador: **Traer de GitHub** para tener la última versión.

El token solo se guarda en el navegador de quien lo pega. No lo compartas ni lo subas al repo.

Sin token también funciona: **Exportar db.json** y súbelo a mano a la carpeta `data/` del repositorio.

## Probarlo en el computador

Abre una terminal en esta carpeta y ejecuta `npx serve` (o `python3 -m http.server`), luego entra a la dirección que aparece.
Abrir `index.html` con doble clic no carga `data/db.json` porque el navegador bloquea esa lectura.

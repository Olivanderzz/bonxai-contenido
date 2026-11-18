/* Estrategia y material de consulta del Plan Maestro BONXAI (solo lectura).
   Los guiones NO están aquí: viven en data/db.json */
const CAL = [
  {d:"Lunes",    gd:1, pz:"Hablando a cámara · Problema", cat:"Problema",              fm:"Hablando a cámara",  ob:"Seguidores",  st:"Detrás de cámaras del caso + encuesta", col:"#D79A9A", quick:[["Reel","Instagram"],["Carrusel","Instagram"],["Stories","Instagram"]],
    ideas:["Gancho: \"Si [situación], te está pasando esto y no lo ves\".","Caso fuerte en 7 bloques (35-45 s): tu prueba en pantalla real.","Si toca carrusel esta semana, sale el mismo día que un reel, nunca en su lugar."]},
  {d:"Martes",   gd:2, pz:"B-roll con texto · Creencia", cat:"Creencia",        fm:"B-roll con texto",   ob:"Envíos",      st:"Sticker del día (encuesta o quiz)",      col:"#AEC38E", quick:[["Reel","Instagram"],["Stories","Instagram"]],
    ideas:["Gancho: \"Crees que [creencia]. Yo también, hasta que [hecho]\".","Tomas tuyas (trabajando, en la calle, en los apartamentos) con el gancho y el valor en texto grande.","Cada toma se usa en un solo reel publicado: nunca repetir una toma."]},
  {d:"Miércoles",gd:3, pz:"Hablando a cámara · Resultado (caso)", cat:"Resultado (caso)",              fm:"Hablando a cámara",  ob:"Seguidores",  st:"El CRM o el sistema por dentro",          col:"#D79A9A", quick:[["Reel","Instagram"],["Carrusel","Instagram"],["Stories","Instagram"]],
    ideas:["Gancho: \"[Resultado concreto]. Así lo hicimos\". Aquí sí va DIAGNÓSTICO.","Otro caso fuerte en 7 bloques, con otra familia de gancho que el del lunes."]},
  {d:"Jueves",   gd:4, pz:"Cómico · Carencia", cat:"Carencia",  fm:"Cómico",             ob:"Envíos",      st:"Caja de preguntas",                       col:"#F7D774", quick:[["Reel","Instagram"],["Stories","Instagram"]],
    ideas:["Gancho: \"Dime que eres dueño de negocio sin decirme que…\" o un POV.","Humor de 7-15 s: situación que duele → remate. Sin solución.","Cierre: “mándaselo a…”."]},
  {d:"Viernes",  gd:5, pz:"Hablando a cámara · Pregunta", cat:"Pregunta",              fm:"Hablando a cámara",  ob:"Seguidores",  st:"Caso de la tienda por partes",            col:"#D79A9A", quick:[["Reel","Instagram"],["Carrusel","Instagram"],["Stories","Instagram"]],
    ideas:["Gancho: \"¿[Pregunta que me hacen]? Te doy la respuesta real\".","Tercer caso fuerte de la semana."]},
  {d:"Sábado",   gd:6, pz:"B-roll con texto · Tendencia", cat:"Tendencia",        fm:"B-roll con texto",   ob:"Envíos",      st:"Prompt del día o detrás de cámaras",      col:"#AEC38E", quick:[["Reel","Instagram"],["Stories","Instagram"]],
    ideas:["Gancho: \"[Novedad de IA de la semana]: lo que significa para tu negocio\". Se elige el lunes con el radar.","Primer cuadro en movimiento, gancho de 5-8 palabras, máximo 3 líneas por pantalla."]},
  {d:"Domingo",  gd:0, pz:"Hablando a cámara · Resultado o Carencia (historia)", cat:"Resultado o Carencia (historia)",fm:"Hablando a cámara", ob:"Comentarios", st:"La época de Europa o una frase motivacional (van en Stories)", col:"#EBCB9D", quick:[["Reel","Instagram"],["Stories","Instagram"]],
    ideas:["1 domingo de cada 2 puede ser BOFU (DIAGNÓSTICO).","Opinión (25-35 s), historia o lista para guardar.","Las frases motivacionales salen del feed: van en Stories."]}
];
const FMTS = ["Reel","Video","Carrusel","Stories","Foto","Otro"];
const PLATS = ["Instagram","TikTok","Ambas"];
/* orden sugerido (índice de día del plan -> video). Solo semanas 1 y 2 y dos de la 3; el resto queda para repetir lo que mejor funcione. */
const SUGGEST = {0:2,2:1,3:3,4:9,5:8, 7:7,9:4,10:6,11:5,12:10, 14:11,19:12};
const DEFAULT_PILAR = ["Construyendo BONXAI","IA práctica","IA para negocios","IA práctica","IA práctica","IA para negocios","IA práctica","Construyendo BONXAI","IA práctica","IA para negocios","IA práctica","Construyendo BONXAI"];

const WORKBLOCKS = [
  ["Lunes","30 a 45 min","Revisar estadísticas de la semana anterior, escoger temas y escribir ganchos."],
  ["Martes","60 a 90 min","Grabar 2 o 3 videos en bloque, con cambios de plano y ejemplos visuales."],
  ["Miércoles","30 a 45 min","Editar, poner subtítulos y preparar versiones limpias para cada plataforma."],
  ["Jueves a sábado","15 a 25 min al día","Publicar, responder comentarios y guardar preguntas para nuevos videos."],
  ["Domingo","20 min","Registrar métricas y elegir los tres experimentos de la semana siguiente."]
];

const PILARES = [
  {n:"IA práctica", p:40, col:"#F7D774", que:"Tutoriales, prompts, herramientas, antes/después", ob:"Descubrimiento y guardados",
   meta:"Que tu cuenta sea el lugar al que la gente vuelve para aprender algo aplicable en minutos.",
   ideas:["Tutoriales de un solo paso con resultado visible.","Prompts y estructuras que se pueden copiar y guardar.","Comparaciones de herramientas con criterios claros.","Antes y después de un resultado con y sin buena instrucción."], mide:["Guardados por alcance","Compartidos por alcance"]},
  {n:"IA para negocios", p:30, col:"#D3322A", que:"Ventas, WhatsApp, productividad, procesos", ob:"Audiencia relevante",
   meta:"Atraer a dueños de negocio y emprendedores que tienen un problema concreto que resolver.",
   ideas:["Flujos de WhatsApp y seguimiento de clientes.","Las tareas que conviene automatizar primero.","Errores que hacen perder oportunidades.","Ejemplos para un negocio pequeño, con datos anonimizados."], mide:["Comentarios útiles","Visitas al perfil"]},
  {n:"Construyendo BONXAI", p:20, col:"#6B1626", que:"Demos, pruebas, aprendizajes, errores", ob:"Confianza y autoridad",
   meta:"Mostrar el proceso real para que la audiencia te siga y confíe en lo que construyes.",
   ideas:["El reto del día y cómo se resolvió.","Demos con sus límites a la vista.","Errores y lo que aprendiste de ellos.","Decisiones de producto y por qué las tomaste."], mide:["Seguidores por alcance","Visitas al perfil"]},
  {n:"Noticias con criterio", p:10, col:"#AEC38E", que:"Qué cambió, para quién sirve y cómo probarlo", ob:"Actualidad sin ser una cuenta genérica",
   meta:"Estar al día sin parecer una cuenta de noticias: siempre con tu criterio y algo que probar.",
   ideas:["Qué cambió, dicho en una frase.","Para quién sirve y para quién no.","Cómo probarlo hoy en diez minutos.","Qué dato falta verificar antes de creerlo."], mide:["Compartidos por alcance","Retención"]}
];
const OBJ30 = [
  ["2 o 3 formatos repetibles","Formatos que producen buena retención, compartidos, visitas al perfil y seguidores adecuados."],
  ["Tu línea base propia","Los números de tus dos cuentas medidos en la misma ventana de tiempo, para comparar sin adivinar."],
  ["Una cuenta que se entiende sola","Bio, portadas y publicaciones fijadas que cuentan la misma historia: IA práctica para negocios."],
  ["Un banco de preguntas reales","Lo que tu audiencia pregunta, convertido en ideas de videos y de series."],
  ["Decisiones claras para el mes 2","Qué dos formatos mantener y cuál pausar, con datos y no con corazonadas."]
];
const REGLAS = [
  "Cada video debe resolver una pregunta, mostrar un resultado o contar un experimento concreto.",
  "No prometas ingresos, viralidad ni resultados garantizados. Muestra qué hiciste, qué funcionó y qué limitaciones tiene.",
  "Mantén una línea reconocible: IA práctica para negocios. Puedes hablar de herramientas diversas si todas conectan con esa promesa.",
  "Prioriza material original: tu voz, tu pantalla, tus pruebas, tu opinión y tus ejemplos."
];

const STAGES = ["Idea revisada","Grabado","Editado","Publicado","Métricas registradas"];

const STORY_SLIDES = [
  {n:1, tipo:"Presencia / proceso", ej:"Hoy estoy probando una forma de automatizar este paso.", fn:"Mostrar contexto humano", how:"Cinco segundos de tu pantalla o tu escritorio con una frase corta encima.", stk:"Texto + cámara", col:"#AEC38E"},
  {n:2, tipo:"Problema", ej:"¿Qué te quita más tiempo: responder, cotizar o hacer seguimiento?", fn:"Conocer a la audiencia", how:"Una pregunta con dos o tres opciones que se contesten con un toque.", stk:"Encuesta", col:"#F7B7A8"},
  {n:3, tipo:"Microvalor", ej:"Un tip concreto en 1 o 2 frases.", fn:"Aportar utilidad", how:"Una sola idea que se pueda aplicar hoy. Si necesita más de dos frases, es un Reel.", stk:"Tip", col:"#EBCB9D"},
  {n:4, tipo:"Prueba / detrás de cámaras", ej:"Captura del proceso, sin datos sensibles.", fn:"Demostrar experiencia", how:"Tapa nombres, números y claves antes de subirla. Muestra el proceso, no el dato.", stk:"Captura", col:"#D79A9A"},
  {n:5, tipo:"Conversación / CTA", ej:"Encuesta, caja de preguntas o enlace pertinente.", fn:"Generar interacción", how:"Cierra con una sola pregunta fácil de responder. Usa lo que contesten para el próximo video.", stk:"Pregunta", col:"#F7D774"}
];
const REEL_DAY = [
  {t:"Antes de publicar", d:"Plantea el problema en una Story y añade una encuesta o pregunta."},
  {t:"Publicas el Reel", d:"Compártelo en Stories con una frase que dé contexto; no te limites a poner “nuevo video”."},
  {t:"Más tarde", d:"Añade un ejemplo, un detalle extra o responde una pregunta que haya surgido."},
  {t:"Al día siguiente", d:"Si hay comentarios interesantes, conviértelos en otra pieza de contenido."}
];

const STRUCT = [
  {t:"0–2 s",   n:"Gancho",            q:"Atención", d:"Tú + situación concreta. Máximo 12 palabras habladas desde el primer cuadro y 5-8 en pantalla. Arranca en movimiento, mirando al lente.", col:"#6B1626", k:"#fff"},
  {t:"2–7 s",   n:"Dolor",             q:"Problema · interés", d:"La escena exacta que vive, para que diga “ese soy yo”.", col:"#D79A9A", k:"#2B1710"},
  {t:"7–12 s",  n:"Agitar",            q:"Agitar", d:"Lo que le cuesta: plata, clientes, noches. Funciona como re-gancho.", col:"#F9A08D", k:"#2B1710"},
  {t:"12–17 s", n:"El después",        q:"Deseo · después", d:"Cómo se ve su día cuando está resuelto (“Imagínate…”).", col:"#F7D774", k:"#2B1710"},
  {t:"17–32 s", n:"Puente con prueba", q:"Solución · puente", d:"Cómo lo logré yo, en pantalla real. Qué se hizo, no cómo se programa.", col:"#AEC38E", k:"#2B1710"},
  {t:"32–38 s", n:"Giro",              q:"Deseo", d:"Resultado inesperado, error u opinión: lo que hace que lo reenvíen.", col:"#EBCB9D", k:"#2B1710"},
  {t:"Últimos 3 s", n:"Acción",        q:"Acción", d:"Una sola: enviar, guardar o palabra clave. Conecta con el gancho para que el video vuelva a empezar.", col:"#8FB07A", k:"#2B1710"}
];
const TECNICAS = [
  {t:"Polémica con argumento", d:"Toma una postura clara contra una creencia común y defiéndela con una razón y un ejemplo. Ataca la idea, nunca a una persona.", p:"Cierra con la solución y una pregunta: “¿estás de acuerdo o no?”. Responde con respeto a quien opine distinto.", col:"#D3322A", k:"#fff"},
  {t:"Resultado primero", d:"Abre con el producto, la pantalla o el antes/después.", p:"Arrastra el mejor fotograma del final al segundo cero y cuenta el resto después.", col:"#AEC38E"},
  {t:"Una idea por video", d:"Si hay tres tutoriales diferentes, conviértelos en una serie.", p:"Antes de grabar, escribe la idea en una frase. Si necesitas “y además”, son dos videos.", col:"#F7B7A8"},
  {t:"Gancho específico", d:"Identifica a quién ayudas y qué verá; evita frases vacías como “no creerás esto”.", p:"Nombra el tipo de negocio o la tarea en la primera frase.", col:"#EBCB9D"},
  {t:"Patrón visual", d:"Alterna cara, pantalla, detalle y resultado cuando tenga sentido; no edites rápido solo por editar.", p:"Cambia de plano cuando cambie la idea, no por reloj.", col:"#D79A9A"},
  {t:"Curiosidad honesta", d:"Plantea una pregunta que el video sí responda.", p:"Si la pregunta del gancho no se contesta antes del cierre, reescríbela.", col:"#F7D774"},
  {t:"Subtítulos legibles", d:"Pocas palabras por línea, buen contraste y espacio lejos de los botones de la app.", p:"Máximo dos líneas a la vez y deja margen abajo y a la derecha.", col:"#8FB07A"},
  {t:"Prueba el audio", d:"Voz clara, sin música que compita; el micrófono debe estar cerca.", p:"Graba diez segundos de prueba y escúchalos con audífonos antes de seguir.", col:"#E8D5C0"},
  {t:"Recorta silencios", d:"Recorta silencios y repeticiones, pero deja tiempo para entender los pasos.", p:"Quita los “eh” y las respiraciones largas, pero deja medio segundo tras cada paso importante.", col:"#F0C9B8"},
  {t:"CTA único", d:"Pedir comentario, guardado o visita al perfil, según el objetivo principal.", p:"Elige el CTA del día en el calendario: alcance, guardados, compartidos o comentarios.", col:"#C5CF8F"},
  {t:"No alargues", d:"La duración debe corresponder al valor de la explicación.", p:"Si un tramo no cambia lo que la persona entiende, córtalo.", col:"#F9A08D"}
];
const HOOKS = [
 "Si tienes [tipo de negocio], prueba esto antes de [tarea común].",
 "El error que cometes cuando usas [herramienta] es este.",
 "Probé [método/herramienta] para resolver [problema]. Este fue el resultado.",
 "Antes de pagar por [herramienta], revisa estas tres cosas.",
 "Te muestro cómo pasé de [proceso manual] a [proceso más ordenado].",
 "La diferencia entre [concepto A] y [concepto B], explicada con un ejemplo.",
 "No necesitas automatizarlo todo. Empieza por esta tarea.",
 "Esto parece complicado, pero son solo tres pasos.",
 "Opinión impopular: [creencia común] no es verdad. Te explico por qué.",
 "Deja de [hábito común con IA]. Lo que necesitas es [alternativa]."
];
const HOOK_TYPES = ["Polémica","Resultado primero","Problema primero","Error común","Antes / después","Pregunta","Comparación","Experimento","Lista o tres pasos","Historia de construcción"];

/* checklist por video: 4 grupos */
const CKG = [
  {t:"Antes de grabar", col:"#C5CF8F", items:["Sé para quién es el video.","El video resuelve una sola pregunta.","Tengo un resultado o ejemplo que puedo mostrar.","Escribí un gancho específico y grabaré varias versiones.","El CTA corresponde al objetivo del video."]},
  {t:"Al grabar", col:"#F7B7A8", items:["Limpia la lente y graba en vertical 9:16.","Ilumina el rostro desde delante o a 45 grados y revisa que el fondo no distraiga.","Graba el gancho en 2 o 3 versiones antes de continuar.","Captura la pantalla por separado para poder insertar demostraciones limpias.","Comprueba que no se vean contraseñas, conversaciones privadas, datos de clientes ni claves API.","Deja aire al principio y al final de cada toma para editar sin cortar palabras."]},
  {t:"Antes de publicar", col:"#EBCB9D", items:["El primer segundo tiene un motivo visual para quedarse.","El audio y los subtítulos son claros.","Verifiqué nombres, cifras y afirmaciones.","Eliminé información privada y marcas de agua ajenas.","La portada y la descripción son coherentes con el video."]},
  {t:"Después de publicar", col:"#D79A9A", items:["Respondí comentarios relevantes.","Registré métricas iniciales y fecha de revisión.","Anoté una hipótesis para mejorar el siguiente video.","Guardé preguntas de la audiencia como ideas futuras."]}
];

const WEEKS = [
 {t:"Línea base", col:"#AEC38E", items:["Publica 5 o 6 piezas de los pilares definidos, con variedad de ganchos y formatos.","Registra métricas y guarda enlaces o capturas de cada publicación.","Observa qué tema atrae a la audiencia correcta; no declares ganador por una sola métrica."]},
 {t:"Repetir con intención", col:"#F7B7A8", items:["Elige los dos temas que dieron mejores señales.","Crea dos variaciones de cada tema: cambia el enfoque o el gancho, no todo a la vez.","Prueba resultado primero frente a problema primero."]},
 {t:"Serie y comunidad", col:"#EBCB9D", items:["Convierte el tema más prometedor en una serie de 3 partes.","Responde una pregunta real con video y usa Stories para pedir nuevas preguntas.","Publica una demostración real de BONXAI, con límites y estado del producto explicados claramente."]},
 {t:"Optimizar y convertir", col:"#C5CF8F", items:["Repite los tres formatos con mejores resultados.","Revisa la bio, portadas y publicaciones fijadas.","Evalúa seguidores relevantes, conversaciones y consultas, no solo reproducciones.","Decide qué dos formatos mantener el mes siguiente y cuál pausar."]}
];

/* plataformas */
const CMP = [
 ["Formato","Reel, carrusel y Stories. El carrusel funciona bien para guardados.","Video vertical. Un carrusel o una foto solo si el tema lo pide."],
 ["Primer segundo","Resultado visible desde el primer fotograma. El Reel puede llegar a gente que no te conoce, así que explica el tema sin contexto previo.","Abre con el problema o la pregunta que alguien escribiría al buscar. Aquí el gancho hablado pesa mucho."],
 ["Portada","Legible, con un beneficio concreto y pocas palabras. Mira cómo se ve junto a las demás en la cuadrícula del perfil.","Elige un fotograma que explique el tema. Pesa menos que el gancho, pero no la dejes al azar."],
 ["Descripción","Tema principal en la primera línea y una pregunta natural al final.","Incluye las palabras que alguien usaría para buscar el tema, por ejemplo “automatizar WhatsApp para negocios”."],
 ["Hashtags","Pocos y relevantes. No dependas de una lista enorme.","Pocos y relevantes. Los términos de búsqueda en la descripción suelen aportar más."],
 ["Texto en pantalla","Subtítulos grandes, dos líneas como máximo, lejos del borde inferior y del lado derecho.","Igual: deja margen abajo y a la derecha, donde la app pone botones y descripción."],
 ["CTA","Guardar, compartir o comentar una palabra. Después sigue la conversación en Stories.","Comentar una palabra o una pregunta concreta. Si te preguntan algo bueno, respóndelo con otro video."],
 ["Qué mirar","Guardados, compartidos, visitas al perfil y seguidores por alcance.","Tiempo medio visto, compartidos, comentarios y los términos de búsqueda de tu audiencia."],
 ["Hora","Prueba dos franjas que puedas sostener, por ejemplo mediodía y tarde-noche en hora de Colombia.","Prueba otras dos franjas distintas a las de Instagram y decide con tus estadísticas."]
];
const ADAPT_STEPS = [
 ["Graba una versión limpia","Un solo archivo sin marca de agua de otra app y sin textos pegados a los bordes."],
 ["Edita una vez en vertical","9:16 (1080×1920) con margen en la parte baja y el lado derecho. Un archivo base sirve para las dos apps."],
 ["Decide qué cambia","Mantén la idea, la prueba y el resultado. Cambia descripción, portada, CTA y, si hace falta, el gancho hablado."],
 ["Reescribe la descripción","Instagram: tema + pregunta natural. TikTok: las palabras que la gente buscaría."],
 ["Elige portada y hora","No cambies hora, gancho y tema al mismo tiempo, o no sabrás qué movió el resultado."],
 ["Registra con plataforma","Anota el resultado de cada app por separado en Métricas. Así comparas lo mismo con lo mismo."]
];
const KEEP = ["La idea del video","La prueba visual","El resultado que muestras","La voz y el tono","El archivo base 9:16"];
const CHANGE = ["Descripción y palabras de búsqueda","Portada","CTA","Los primeros 2 segundos si no retienen","Hashtags","Hora de publicación"];
const PUB_BEFORE = ["Comprueba que el primer fotograma explica visualmente el tema.","Revisa subtítulos, nombres de herramientas y afirmaciones técnicas.","Escribe una descripción útil con el tema principal y una pregunta natural si encaja.","Añade solo hashtags relevantes; no dependas de una lista enorme de etiquetas.","Usa una portada legible, con un beneficio concreto y pocas palabras.","Publica un archivo limpio sin marca de agua de otra plataforma; adapta texto, descripción y encuadre a cada app."];
const PUB_AFTER = ["Responde comentarios de forma útil y humana, especialmente las preguntas reales.","Guarda las preguntas que se repiten: pueden ser nuevos videos.","No borres de inmediato un video solo porque empezó lento; revisa su comportamiento en una ventana razonable.","No compres seguidores, no uses bots ni hagas intercambios artificiales de interacción.","Si una pieza funciona, crea una nueva versión que amplíe el tema; no subas exactamente lo mismo de forma repetitiva."];

/* métricas */
const METRICS = [
 {t:"Retención / tiempo medio", i:"Interés sostenido", b:"El comienzo o el desarrollo puede no conectar", p:"Resultado antes, menos introducción, más claridad", col:"#6B1626", k:"#fff"},
 {t:"Compartidos por alcance", i:"Valor para recomendar", b:"Tema poco compartible o poco específico", p:"Resolver un problema concreto o crear una comparación útil", col:"#AEC38E", k:"#2B1710"},
 {t:"Guardados por alcance", i:"Utilidad para volver", b:"Poco valor práctico o poca estructura", p:"Pasos, checklist, plantilla o ejemplo", col:"#EBCB9D", k:"#2B1710"},
 {t:"Visitas al perfil", i:"Curiosidad por el creador", b:"El video entretiene pero no muestra tu enfoque", p:"Conecta el tema con tu experiencia y perfil", col:"#D79A9A", k:"#2B1710"},
 {t:"Seguidores por alcance", i:"Conversión en audiencia", b:"La promesa de la cuenta no es clara", p:"Mejora bio, publicaciones fijadas y coherencia temática", col:"#F7D774", k:"#2B1710"},
 {t:"Comentarios útiles", i:"Conversación / intención", b:"La pregunta final es vaga", p:"Haz una pregunta específica y fácil de responder", col:"#2F5D2A", k:"#fff"}
];
const SEND_STEPS = {
 Instagram:["Abre tu perfil y entra al panel profesional o a Estadísticas (el nombre cambia según la versión).","Captura la vista general de los últimos 30 días: alcance, interacciones, seguidores y audiencia.","Abre 3 o 4 Reels y captura sus estadísticas: alcance, tiempo reproducido, compartidos, guardados y visitas al perfil.","Si puedes, captura la parte de contenido que ordena tus publicaciones por alcance."],
 TikTok:["Abre Herramientas para creadores y entra en Analíticas (el nombre cambia según la versión).","Captura la vista general de los últimos 28 o 30 días: vistas de video, visitas al perfil y seguidores.","Abre 3 o 4 videos y captura sus estadísticas: tiempo medio visto, compartidos, comentarios y de dónde llegan las visualizaciones.","Si lo tienes, captura los términos de búsqueda que descubre tu audiencia."]
};

/* diagnóstico */
const SINTOMAS = [
 {t:"Muchas impresiones, poca retención", ves:"El video llega a mucha gente, pero se van en los primeros segundos.", causa:["Gancho genérico o con saludo largo.","El primer plano no da motivo visual para quedarse.","La promesa del gancho no coincide con el video.","Llegó a una audiencia que no esperaba ese tema."], prueba:["Abre con el resultado o el antes/después.","Recorta el saludo y empieza en la acción.","Reescribe el gancho nombrando a quién ayudas.","Cambia solo el primer plano y compara con el original."], nota:"Compara con otros videos de la misma plataforma y la misma ventana de tiempo."},
 {t:"Buena retención, pocos compartidos", ves:"La gente lo ve completo, pero nadie lo envía.", causa:["Es interesante, pero no es útil para mandárselo a alguien.","El tema es muy personal o muy amplio.","No hay una persona clara a quien enviárselo."], prueba:["Resuelve un problema concreto de un tipo de negocio.","Haz una comparación o una lista útil.","Cierra con “compártelo con alguien que…”."], nota:"Un video sobre errores o comparaciones suele ser más fácil de enviar que uno de opinión."},
 {t:"Muchos guardados, pocas visitas al perfil", ves:"Guardan el contenido, pero no entran a ver quién eres.", causa:["Enseñas bien, pero no conectas el tema con tu propuesta.","No aparece tu experiencia ni BONXAI en el video."], prueba:["Menciona qué construiste o probaste tú.","Muestra tu proceso real al menos una vez por semana.","Cierra con una invitación al perfil solo si hay algo que ver allí."], nota:"Revisa que el perfil responda rápido a la pregunta “¿qué hace esta cuenta?”."},
 {t:"Muchas visitas al perfil, pocos seguidores", ves:"Entran, miran y se van.", causa:["Bio poco clara.","Publicaciones fijadas desordenadas.","Temas dispersos: no se entiende qué van a recibir."], prueba:["Escribe la bio con la promesa: a quién ayudas y cómo.","Fija tus tres mejores demostraciones.","Revisa que las últimas 9 publicaciones cuenten la misma historia."], nota:"Usa la sección Salud de la cuenta de abajo para revisarlo punto por punto."},
 {t:"Muchas visualizaciones, audiencia poco relevante", ves:"Los números suben, pero los comentarios y mensajes no vienen de negocios.", causa:["Tema genérico o de curiosidad.","Atrae por la noticia o el truco, no por el problema de negocio."], prueba:["Nombra el tipo de negocio o la tarea en el gancho.","Habla de ventas, WhatsApp, seguimiento o procesos.","Compara quién comenta en cada video."], nota:"Un video con menos alcance y mejor audiencia puede servirte más."},
 {t:"Pocos comentarios útiles", ves:"Hay vistas, pero nadie responde la pregunta final.", causa:["La pregunta final es vaga.","Pide demasiado esfuerzo para contestar."], prueba:["Haz una pregunta que se conteste con una palabra o eligiendo A o B.","Usa una palabra clave de CTA y cumple lo prometido.","Responde los primeros comentarios con una pregunta de vuelta."], nota:"Si prometes un recurso al comentar, entrégalo. Evita mensajes masivos no solicitados."},
 {t:"Buen contenido, poco alcance", ves:"Los que lo ven responden bien, pero lo ven pocos.", causa:["El tema tiene poca demanda o no se encuentra fácil.","La descripción no incluye las palabras que se buscan.","Es muy pronto para juzgarlo.","El primer fotograma no explica el tema."], prueba:["Revisa el video a los 7 días antes de decidir.","Ajusta descripción y portada en el siguiente video del mismo tema.","Busca los términos de tu audiencia y úsalos."], nota:"No lo borres de inmediato solo porque empezó lento."},
 {t:"Un video salió mucho mejor que los demás", ves:"Un video rinde varias veces más que tu promedio.", causa:["Puede ser el tema, el gancho, el formato o el momento.","Puede ser casualidad."], prueba:["Anota qué tenía distinto: gancho, tema, edición, duración.","Haz dos variaciones cambiando una sola cosa.","Conviértelo en una serie de 3 partes."], nota:"Una pieza no define una estrategia. Busca que se repita."},
 {t:"El alcance baja después de varios buenos", ves:"Venías bien y los últimos videos rinden menos.", causa:["Cambiaste tema o formato sin querer.","Hubo menos constancia.","Audio o iluminación peores.","Repetiste demasiado el mismo formato."], prueba:["Compara tus últimos cinco videos con los cinco mejores.","Vuelve al formato que mejor funcionó.","Cambia una variable por vez."], nota:"Las bajadas de unos días son normales. Mira la tendencia de varias semanas."},
 {t:"Suben los seguidores, pero no hay conversaciones", ves:"Crece la cuenta, pero nadie escribe ni pregunta.", causa:["Audiencia curiosa, sin una necesidad concreta.","Pocas Stories o sin preguntas.","CTA sin acción clara."], prueba:["Usa encuestas y cajas de preguntas en Stories.","Pide un comentario con una palabra.","Haz un video respondiendo una pregunta real."], nota:"Mide consultas y conversaciones, no solo seguidores."},
 {t:"Funciona en una app y en la otra no", ves:"Instagram responde y TikTok no, o al revés.", causa:["La audiencia y la forma de descubrir son distintas.","Subiste el mismo archivo y la misma descripción en las dos."], prueba:["Adapta gancho hablado, descripción y portada.","Compara en la misma ventana de tiempo.","Mira qué temas funcionan en cada una y no los fuerces."], nota:"Revisa la sección Plataformas para adaptar paso a paso."},
 {t:"Todo bajo en la primera semana", ves:"Ninguna métrica destaca.", causa:["Aún no hay línea base.","Pocas piezas publicadas.","La cuenta todavía no deja claro qué ofrece."], prueba:["Publica las 5 o 6 piezas de la semana 1 antes de sacar conclusiones.","Registra todo en la misma ventana de tiempo.","Revisa bio y fijados."], nota:"El objetivo de la semana 1 es medir, no ganar."},
 {t:"Se pierden a mitad del video", ves:"La gráfica de retención cae en el centro.", causa:["Ritmo lento o relleno.","El resultado llega muy tarde.","Demasiada explicación antes de la demostración."], prueba:["Recorta silencios y repeticiones.","Cambia de plano cuando cambie la idea, cada 2 a 4 segundos.","Adelanta el resultado."], nota:"Mira en qué segundo cae y revisa qué pasa justo antes."},
 {t:"Tengo estadísticas pero no sé qué mejorar", ves:"Hay números y ninguna conclusión.", causa:["Se miran todas las métricas a la vez."], prueba:["Elige una métrica objetivo por video, según el día del calendario.","Formula una hipótesis y cambia una sola cosa.","Registra el resultado y repite."], nota:"Mándame las capturas y las revisamos juntas."}
];
const SALUD = {
 Instagram:["La bio explica a quién ayudas y cómo.","Tengo tres publicaciones fijadas con mis mejores demostraciones.","Las portadas son legibles y coherentes en la cuadrícula.","El enlace o el CTA del perfil es claro.","Respondo comentarios y mensajes con regularidad.","Publico 4 o 5 Stories los días que subo un Reel.","Mis temas encajan con los cuatro pilares.","Uso pocos hashtags y relevantes."],
 TikTok:["El nombre y la bio dicen IA para negocios.","Tengo fijados mis mejores videos de demostración.","Las descripciones incluyen palabras que la gente busca.","Reviso los términos de búsqueda de mi audiencia.","Respondo comentarios, y si la pregunta es buena, con un video.","Mis temas encajan con los cuatro pilares.","Subo el archivo limpio, sin marca de agua de otra app.","Reviso las estadísticas a las 24 horas y a los 7 días."]
};
const EXP_VARS = ["Gancho","Tema","Hora de publicación","Edición / ritmo","Portada","CTA","Formato","Duración"];
const PLAN_VERSION_FIELDS = [["fmt","Formato","Reel, carrusel, Stories…"],["gancho","Gancho hablado y en pantalla",""],["txt","Texto en pantalla",""],["desc","Descripción",""],["tags","Hashtags (pocos)",""],["portada","Portada",""],["hora","Fecha y hora de publicación",""],["cta","CTA",""]];
const SPOTS = ["Escritorio","Sala","Pantalla compartida","Oficina","Exterior","Fondo neutro","Cafetería"];
const MEDIR = ["Retención / tiempo medio","Compartidos","Guardados","Visitas al perfil","Seguidores","Comentarios útiles"];
const OFFICIAL = [
 ["Instagram · Best Practices para creadores","https://about.fb.com/news/2024/10/best-practices-education-hub-creators-instagram/"],
 ["Instagram · Trial Reels","https://about.fb.com/news/2024/12/trial-reels-try-content-non-followers-first-see-what-perfoms-best/"],
 ["TikTok · Creator Search Insights","https://newsroom.tiktok.com/creator-search-insights"]
];
const ANA_FIELDS = ["Mi video con mejor retención fue…","Mi video con más compartidos fue…","El tema que más visitas al perfil generó fue…","La hipótesis que aprendí…","La prueba que haré la próxima semana…"];

/* colores del calendario = objetivo del día */
const OBJ_COL = {"Seguidores":"#D79A9A","Envíos":"#AEC38E","Alcance":"#AEC38E","Guardados":"#F7B7A8","Autoridad":"#EBCB9D","Compartidos":"#D79A9A","Guardados y comentarios":"#F7D774","Conexión y confianza":"#8FB07A","Aprendizaje":"#E8D5C0","Comentarios":"#C5CF8F","Ventas":"#F9A08D"};
const objCol = ob => OBJ_COL[ob] || "#E8D5C0";
const OBJ_INFO = {
  "Seguidores":"Caso real tuyo en pantalla: es lo que trae seguidores (el Airbnb trajo 1 cada 257 vistas). El gancho habla de él, la prueba habla de ti.",
  "Envíos":"Que lo manden por DM: lista corta, POV o humor de dueño de negocio. Los envíos pesan más que los likes para llegar a gente nueva.",
  "Alcance":"Que te encuentre gente nueva. Piensa en el gancho y en lo que se entiende en dos segundos.",
  "Guardados":"Que alguien quiera volver a verlo: pasos, checklist, plantilla o ejemplo.",
  "Autoridad":"Mostrar que sabes lo que haces con una demostración real.",
  "Compartidos":"Que valga la pena mandárselo a alguien: un problema concreto o una comparación.",
  "Guardados y comentarios":"Una lista o un error común, con una pregunta final fácil de contestar.",
  "Conexión y confianza":"Contar el proceso de construir BONXAI, con lo que salió bien y lo que falta.",
  "Aprendizaje":"Revisar números, elegir pruebas y descansar. Ese día no tiene que haber video.",
  "Comentarios":"Abrir conversación: una pregunta, una palabra clave o responder a la audiencia.",
  "Ventas":"Invitar con claridad a conversar o probar, sin prometer resultados."
};
const WEEK_PRESETS = [
  {id:"base", n:"Plan original", d:"Tal como viene en tu documento.", days:{}},
  {id:"crecer", n:"Semana para crecer", d:"Más alcance y guardados, con una pieza ligera el domingo.", days:{
    1:{pz:"Video práctico de una herramienta", ob:"Alcance"}, 2:{pz:"Carrusel con pasos para guardar", ob:"Guardados"}, 3:{pz:"Tutorial corto con resultado visible", ob:"Alcance"},
    4:{pz:"Un problema de negocio y cómo se ordena", ob:"Compartidos"}, 5:{pz:"Lista o comparación para guardar", ob:"Guardados y comentarios"}, 6:{pz:"Detrás de cámaras de BONXAI", ob:"Conexión y confianza"},
    0:{pz:"Revisar métricas y una Story ligera", fm:"Sin video, solo Stories", ob:"Aprendizaje"}}},
  {id:"conversar", n:"Semana para conversar", d:"Preguntas, casos y demos para que te escriban.", days:{
    1:{pz:"Responder en video una pregunta de la audiencia", ob:"Comentarios"}, 2:{pz:"Caso de un negocio pequeño", ob:"Compartidos"}, 3:{pz:"Demostración de BONXAI con sus límites", ob:"Autoridad"},
    4:{pz:"Un error común en WhatsApp", ob:"Alcance"}, 5:{pz:"Preguntas y respuestas", ob:"Comentarios"}, 6:{pz:"Avance de BONXAI y lo que falta", ob:"Conexión y confianza"},
    0:{pz:"Revisar los mensajes y consultas de la semana", fm:"Sin publicar", ob:"Aprendizaje"}}},
  {id:"bonxai", n:"Semana BONXAI", d:"Todo gira alrededor de lo que estás construyendo.", days:{
    1:{pz:"El reto de la semana en BONXAI", ob:"Conexión y confianza"}, 2:{pz:"Carrusel: qué hace BONXAI, paso a paso", ob:"Guardados"}, 3:{pz:"Demo de una función", ob:"Autoridad"},
    4:{pz:"Un problema de cliente que BONXAI resuelve", ob:"Compartidos"}, 5:{pz:"Errores y aprendizajes del proceso", ob:"Guardados y comentarios"}, 6:{pz:"Resultado de la semana", ob:"Conexión y confianza"},
    0:{pz:"Elegir la próxima función con una encuesta", fm:"Stories", ob:"Aprendizaje"}}}
];

const TIPOS_PUB = [["Video práctico","#AEC38E"],["Demostración","#8FB07A"],["Carrusel","#F7B7A8"],["Noticia","#F7D774"],["Stories","#EBCB9D"],["Detrás de cámaras","#D79A9A"],["Otro","#E8D5C0"]];
const tipoCol = t => (TIPOS_PUB.find(x => x[0] === t) || [0, "#E8D5C0"])[1];

/* banco de dinámicas de Stories */
const STORY_BANK = [
 {id:1, n:"Encuesta de dos opciones", st:"Encuesta", slot:"pregunta", col:"#F7B7A8", que:"Conoces qué le pesa más a tu audiencia.", ex:"¿Qué te quita más tiempo: responder mensajes o hacer seguimiento?", how:"Pon el sticker de encuesta con dos opciones cortas. Mañana cuenta el resultado."},
 {id:2, n:"Caja de preguntas", st:"Preguntas", slot:"pregunta", col:"#EBCB9D", que:"Te da ideas para el próximo video.", ex:"Pregúntame lo que quieras sobre automatizar WhatsApp. Hoy respondo las mejores.", how:"Sticker de preguntas. Guarda las respuestas que se repiten: son videos."},
 {id:3, n:"Esto o aquello", st:"Encuesta", slot:"pregunta", col:"#D79A9A", que:"Genera participación rápida y deja una opinión clara.", ex:"¿Chatbot o agente de IA para un negocio pequeño? Vota y mañana te explico por qué.", how:"Dos opciones opuestas. Cierra con una promesa pequeña que sí cumplas."},
 {id:4, n:"Quiz de una pregunta", st:"Quiz", slot:"pregunta", col:"#AEC38E", que:"Enseña sin dar una clase.", ex:"¿Cuál de estos puede consultar un sistema conectado: el chatbot o el agente?", how:"Sticker de quiz con tres opciones. En la siguiente Story explica la respuesta."},
 {id:5, n:"Mito o verdad", st:"Encuesta", slot:"pregunta", col:"#F7D774", que:"Desmonta una idea que se repite mucho.", ex:"Mito o verdad: una herramienta de IA arregla un proceso desordenado.", how:"Pregunta primero, responde en la Story siguiente en una sola frase."},
 {id:6, n:"Tip del día", st:"Texto", slot:"valor", col:"#AEC38E", que:"Aporta algo útil en menos de diez segundos.", ex:"Tip: antes de automatizar una tarea, escríbela en tres pasos. Si no cabe, todavía no está lista.", how:"Una sola idea, una o dos frases, letra grande."},
 {id:7, n:"Detrás de cámaras", st:"Foto o video", slot:"presencia", col:"#EBCB9D", que:"Muestra el proceso real y genera confianza.", ex:"Hoy estoy construyendo esto en BONXAI. Así va.", how:"Cinco segundos de tu pantalla o de tu escritorio con una frase encima."},
 {id:8, n:"Captura del proceso", st:"Captura", slot:"valor", col:"#D79A9A", que:"Demuestra que sabes lo que haces.", ex:"Así se ve por dentro el flujo que respondió a un comentario. Sin datos de nadie.", how:"Tapa nombres, números y claves antes de subirla."},
 {id:9, n:"Antes y después", st:"Dos imágenes", slot:"valor", col:"#F7B7A8", que:"Hace visible el cambio.", ex:"Antes: seguimiento en notas sueltas. Después: cada contacto con su estado.", how:"Dos Stories seguidas, la segunda con el resultado."},
 {id:10, n:"Cuenta regresiva", st:"Cuenta regresiva", slot:"cierre", col:"#F7D774", que:"Anuncia un video y trae gente de vuelta.", ex:"En dos horas subo un video sobre un error común en WhatsApp. Activa el recordatorio.", how:"Sticker de cuenta regresiva con la hora real de publicación."},
 {id:11, n:"Resultado de la encuesta", st:"Texto", slot:"cierre", col:"#C5CF8F", que:"Cierra el ciclo y muestra que escuchas.", ex:"Ganó la opción [A]. Por eso el próximo video va de eso.", how:"Usa el resultado real de la encuesta de ayer."},
 {id:12, n:"Pregunta de tu audiencia", st:"Texto", slot:"valor", col:"#EBCB9D", que:"Responde algo real y se vuelve contenido.", ex:"Me preguntaron: “¿Se puede automatizar sin saber programar?”. Respuesta corta: sí, pero depende de la tarea.", how:"Pega la pregunta (sin nombre) y responde en dos frases."},
 {id:13, n:"Herramienta de la semana", st:"Texto", slot:"valor", col:"#F7B7A8", que:"Aporta criterio y no solo noticias.", ex:"Probé esta herramienta: qué hace, cuánto cuesta y para quién sirve.", how:"Tres datos: qué hace, cuánto cuesta, para quién. Nada más."},
 {id:14, n:"El error de hoy", st:"Texto", slot:"presencia", col:"#D79A9A", que:"Humaniza y enseña a la vez.", ex:"Hoy se me rompió esto. Lo que aprendí, en una frase.", how:"Cuéntalo sin dramatismo y con lo que aprendiste."},
 {id:15, n:"Reto de tres minutos", st:"Texto", slot:"cierre", col:"#AEC38E", que:"Invita a actuar y deja pie a un video.", ex:"Reto: anota hoy las tres tareas que repites todos los días. Mañana te cuento cuál automatizaría.", how:"Reto pequeño y fácil. Vuelve a mencionarlo mañana."},
 {id:16, n:"Comenta una palabra", st:"Texto", slot:"cierre", col:"#F7D774", que:"Pasa a la conversación privada.", ex:"Comenta GUÍA en el último Reel y te envío el checklist de seguimiento.", how:"Solo si el recurso existe y lo envías. No mandes mensajes masivos."},
 {id:17, n:"Noticia con criterio", st:"Texto", slot:"valor", col:"#F7D774", que:"Actualidad con tu mirada.", ex:"Salió [la noticia]. Para quién sirve, para quién no y cómo probarlo hoy.", how:"Una frase por punto. Si no estás segura de un dato, no lo cuentes."},
 {id:18, n:"Mini tutorial en 3 Stories", st:"Video corto", slot:"valor", col:"#8FB07A", que:"Enseña un paso concreto.", ex:"Cómo ordenar contactos de WhatsApp en tres pasos. Desliza.", how:"Una Story por paso, con el número en grande."}
];
const STORY_SLOTS = [["presencia", "Mañana", "08:30", "Una Story de presencia o de proceso"], ["pregunta", "Mediodía", "12:30", "Una pregunta para la audiencia"], ["valor", "Tarde", "17:30", "Algo útil: un tip, una captura o un mini tutorial"], ["cierre", "Noche", "20:30", "Una Story que abra conversación o anuncie lo siguiente"]];

/* lo que se está moviendo en el nicho (investigación del 29 de octubre de 2026) */
const NICHO = [
 {t:"Se premia lo que la gente manda a otra persona", d:"Para Reels, las guías del sector coinciden en que pesan más el tiempo que se ve el video, los envíos por mensaje directo y los guardados que los “me gusta”.", q:"Haz videos que alguien le mandaría a un amigo con negocio: un error común, una comparación o una lista corta."},
 {t:"El gancho dice a quién le hablas y qué va a ver", d:"Las fórmulas que más se repiten: resultado primero, afirmación contraintuitiva, pregunta que la persona se hace, número más promesa, y dejar claro para quién es.", q:"Tu primera frase debe nombrar al negocio o la tarea y prometer algo que se vea en el video."},
 {t:"“Cómo uso [herramienta] para [trabajo concreto]” gana a anunciar herramientas", d:"En TikTok funcionan los micro tutoriales de una sola habilidad, el “deja de hacer X así” y las listas cortas. Las demos de funciones nuevas viajan rápido, pero rinden más cuando se ligan a un trabajo real.", q:"Cada video resuelve un trabajo: responder clientes, hacer seguimiento, ordenar cotizaciones."},
 {t:"Comentar una palabra y recibir un mensaje se volvió táctica común", d:"Muchos creadores y negocios piden comentar una palabra clave y envían un recurso por mensaje directo. Sirve si el recurso existe y lo entregas, y si respetas las normas de la app.", q:"Tus CTA con palabra (AUTOMATIZAR, VENTAS, AGENTE) están bien encaminados. Prepara el recurso antes de publicar."},
 {t:"Lo real y humano rinde más que lo genérico hecho con IA", d:"Varias fuentes advierten que el exceso de contenido genérico generado con IA cansa y que Instagram premia lo auténtico. Tu ventaja es mostrar tu pantalla, tu voz y tus errores.", q:"Muestra el proceso de BONXAI con sus fallos. Evita frases que suenen a texto de plantilla."},
 {t:"Constancia antes que volumen", d:"Para negocios pequeños, de tres a cuatro piezas por semana en una red principal funcionan mejor que siete de baja calidad.", q:"Tu plan de cinco o seis piezas es exigente. Si hay que recortar, recorta cantidad, no claridad del gancho."},
 {t:"TikTok también se busca", d:"TikTok funciona cada vez más como buscador. Las descripciones con las palabras que la gente escribe ayudan a que te encuentren.", q:"Escribe en cada descripción la frase que alguien buscaría, por ejemplo “automatizar WhatsApp para negocios”."}
];
const NICHO_FUENTES = [
 ["Hootsuite · Algoritmo de Instagram","https://blog.hootsuite.com/instagram-algorithm/"],
 ["Eclincher · Cómo funciona el algoritmo de Instagram en 2026","https://www.eclincher.com/articles/how-the-instagram-algorithm-works-in-2026"],
 ["Metricool · Guía de Reels 2026","https://metricool.com/instagram-reels-guide/"],
 ["BigVu · 20 ganchos que detienen el scroll","https://bigvu.tv/blog/social-media-hooks-scroll-stopping-video/"],
 ["Miraflow · 10 formatos de IA que funcionan","https://miraflow.ai/blog/ai-shorts-formats-that-go-viral-2026"],
 ["Unilink · Tendencias de TikTok 2026","https://unil.ink/blog/tiktok-trends-2026"],
 ["Manychat · Automatizar comentarios","https://manychat.com/blog/?p=33694"],
 ["Metricool · Capturar leads desde comentarios","https://metricool.com/instagram-comment-lead-capture/"],
 ["3L3C · Tendencias de redes 2026 para negocios pequeños","https://www.3l3c.ai/blog/ai-marketing-tools-for-small-business/social-media-trends-2026"]
];
const GANCHO_FORMULAS = [
 {n:"Resultado primero", ej:"Comenté una palabra y un sistema que construí yo me respondió solo.", cuando:"Cuando tienes una demostración que ya funciona.", g:1},
 {n:"Deja de hacer X", ej:"Tu flyer sale feo porque se lo pides mal. Mira la diferencia.", cuando:"Cuando hay un error común y una forma mejor.", g:2},
 {n:"Un solo trabajo", ej:"Cómo ordeno los mensajes de WhatsApp de un cliente en tres pasos.", cuando:"Para micro tutoriales de una herramienta y una tarea.", g:3},
 {n:"Contraintuitivo", ej:"Ninguna herramienta de IA te va a hacer ganar dinero por sí sola.", cuando:"Para diferenciarte del contenido exagerado.", g:10},
 {n:"Lista corta", ej:"Si tuviera un negocio pequeño, automatizaría estas tres tareas primero.", cuando:"Para guardados y compartidos.", g:6},
 {n:"Pregunta incómoda", ej:"Abre tu WhatsApp ahora: ¿cuántos clientes quedaron sin seguimiento?", cuando:"Para abrir conversación con dueños de negocio.", g:3},
 {n:"Proceso real", ej:"Hoy construyendo BONXAI se me rompió algo. Así lo arreglé.", cuando:"Para la serie de construcción y la confianza.", g:8}
];

/* ideas que se sugieren en el calendario */
const CARRUSEL_IDEAS = ["Cinco pasos para ordenar los mensajes de WhatsApp de un negocio", "Antes y después de un seguimiento de clientes desordenado y uno con estados", "Checklist: qué preguntarle a una herramienta de IA antes de pagarla", "Tres errores al pedirle imágenes a la IA y cómo corregirlos", "Chatbot o agente de IA: la diferencia explicada con un pedido", "Las tres tareas que automatizaría primero en un negocio pequeño", "Cómo convertir una pregunta de tu audiencia en cinco ideas de video", "Plantilla de instrucción para que la IA escriba mejores textos de venta"];
const NOTICIA_IDEAS = ["Una novedad de WhatsApp Business: para quién sirve y cómo probarla", "Una función nueva de Instagram o TikTok y qué cambia para un negocio pequeño", "Una actualización de una herramienta de IA que usas y si vale la pena", "Un cambio en las reglas de mensajes automáticos y qué debes revisar", "Una noticia de IA con tu criterio: qué dato falta verificar"];

/* propuesta semanal: cuatro variantes por día para que ninguna semana sea igual */
const WEEK_SUG = {
 1:[{tipo:"Video práctico",txt:"Tutorial corto de una herramienta con resultado visible",h:"12:00"},{tipo:"Video práctico",txt:"Cómo uso una herramienta de IA para un trabajo concreto",h:"12:00"},{tipo:"Demostración",txt:"Demo de una automatización que ya funciona",h:"12:00"},{tipo:"Video práctico",txt:"Una instrucción que ahorra tiempo, con antes y después",h:"12:00"}],
 2:[{tipo:"Carrusel",txt:"Cinco pasos para guardar: ordenar los mensajes de WhatsApp",h:"16:00"},{tipo:"Carrusel",txt:"Errores comunes y cómo corregirlos",h:"16:00"},{tipo:"Carrusel",txt:"Plantilla de instrucción lista para copiar",h:"16:00"},{tipo:"Carrusel",txt:"Comparación de dos formas de hacer lo mismo",h:"16:00"}],
 3:[{tipo:"Demostración",txt:"Demo de BONXAI con sus límites a la vista",h:"12:00"},{tipo:"Demostración",txt:"Una automatización paso a paso",h:"12:00"},{tipo:"Demostración",txt:"Antes y después de un proceso de ventas",h:"12:00"},{tipo:"Demostración",txt:"Un flujo de WhatsApp funcionando",h:"12:00"}],
 4:[{tipo:"Video práctico",txt:"IA aplicada a un negocio pequeño",h:"18:00"},{tipo:"Noticia",txt:"Una novedad con tu criterio: para quién sirve y cómo probarla",h:"18:00"},{tipo:"Video práctico",txt:"Caso de un negocio: el error que le hacía perder clientes",h:"18:00"},{tipo:"Demostración",txt:"Un agente de IA haciendo una tarea de negocio",h:"18:00"}],
 5:[{tipo:"Carrusel",txt:"Lista o comparación para guardar",h:"17:00"},{tipo:"Video práctico",txt:"Tres errores comunes con IA",h:"17:00"},{tipo:"Carrusel",txt:"Preguntas frecuentes de tu audiencia",h:"17:00"},{tipo:"Noticia",txt:"Resumen de la semana en IA para negocios",h:"17:00"}],
 6:[{tipo:"Detrás de cámaras",txt:"Avance de BONXAI: qué funcionó y qué falta",h:"12:00"},{tipo:"Detrás de cámaras",txt:"El reto de la semana construyendo BONXAI",h:"12:00"},{tipo:"Video práctico",txt:"Experimento: probé algo y te cuento el resultado",h:"12:00"},{tipo:"Detrás de cámaras",txt:"Lo que aprendí esta semana",h:"12:00"}],
 0:[{tipo:"Otro",txt:"Revisar las métricas y elegir tres pruebas",h:"10:00"},{tipo:"Otro",txt:"Grabar el lote de videos de la semana",h:"10:00"},{tipo:"Otro",txt:"Leer los mensajes y comentarios de la semana",h:"10:00"},{tipo:"Otro",txt:"Planear la semana que viene",h:"10:00"}]
};


/* ===== MÁSTER del 16 nov 2026 (00-Estrategia/marca-personal/06_MASTER_16nov.md) ===== */
const MASTER = {
  tema: "IA aplicada a negocios reales, mostrada por alguien que la usa en los suyos.",
  linea: "Pasé de ejecutar el sistema de otro a construir los míos. Hoy los construyo para tu negocio.",
  reglas: [
    "El héroe es el cliente: el gancho habla de él, la prueba habla de mí.",
    "Sin jerga técnica: resultados siempre, herramientas casi nunca.",
    "Una idea por video. El detalle técnico va al DM o al carrusel.",
    "Nunca el mismo clip con otro texto. Para repetir un tema que funcionó, se graba material nuevo.",
    "1 reel al día, nunca más. Si no está terminado a tiempo, ese día no se publica.",
    "Noticias solo verificadas y en primera persona: qué significa para un negocio como el de quien ve.",
    "Las cifras salen solo del banco de cifras. Si falta algo: [PENDIENTE].",
    "Palabra clave solo si se entrega algo concreto; si no, el cierre es “mándaselo a…”."
  ],
  fallas: [
    ["Los seguidores llegan con prueba propia, no con vistas", "“Convertí mi Airbnb…”: 1.800 vistas y 7 seguidores (1 cada 257). “Ya estoy afuera”: 3.500 vistas y 2 seguidores."],
    ["Duplicados y reciclaje", "Instagram reparte menos lo que se parece a algo ya publicado (Jensen Huang dos veces, “Comenta PUEBLO” con 0 vistas)."],
    ["Demasiados reels seguidos", "Seis en dos días, casi todos bajo 300 vistas."],
    ["Perfil que no convierte", "497 visitas al perfil y 0 toques en el enlace."],
    ["Tres públicos mezclados", "Aprender IA, motivación y dueños de negocio: el algoritmo no sabe a quién mostrar."]
  ],
  hueco: "Casi nadie muestra negocios reales de Colombia funcionando con IA. Ese contenido lo comparte un comerciante con otro, y ese es el cliente."
};
const SEMANA_META = [
  {f:"Hablando a cámara", meta:4, que:"3 casos fuertes (7 bloques) + 1 de opinión, lista o emoción", col:"#D79A9A"},
  {f:"B-roll con texto",  meta:2, que:"Lista corta, POV o tip con tus tomas; el valor va en pantalla", col:"#AEC38E"},
  {f:"Cómico",            meta:1, que:"Sketch o POV de dueño de negocio, 7-15 s, “mándaselo a…”", col:"#F7D774"},
  {f:"Carrusel",          meta:1, max:2, que:"Caso paso a paso o lista para guardar, el mismo día que un reel", col:"#F7B7A8"}
];
const TIPOS_GUION = [
  ["Fuerte (caso real)", "35–45 s", "Los 7 bloques"],
  ["Lista o tips", "25–40 s", "Gancho → dolor en 1 frase → cada punto con su mini-resultado → acción (guardar o enviar)"],
  ["Opinión", "25–35 s", "Gancho contrario → por qué todos lo creen → por qué falla, con mi prueba → qué hacer → acción"],
  ["Humor / POV", "7–15 s", "Situación que duele → remate. Sin solución; la acción es “mándaselo a…”"]
];
const RETENCION = ["Lo prometido en el gancho llega antes del 60 % del video.", "Micro-gancho cada 5-7 s (“pero eso no es lo peor”).", "Cambio de plano cada 3-5 s: cara, pantalla, texto, acercamiento.", "Subtítulos siempre."];
const HOOK_FAM = [
  {n:"Situación tuya", p:"Si [situación concreta], [consecuencia]", ej:["Si tienes vendedores, se te está yendo plata y no sabes por dónde.","Si tienes un Airbnb, vives pegado al celular."]},
  {n:"Pérdida", p:"Estás perdiendo [plata/clientes/tiempo] por [cosa pequeña]", ej:["Estás perdiendo clientes por contestar el WhatsApp a las 9 de la noche."]},
  {n:"Dato que te afecta", p:"[Quién] te [castiga/premia] por [acción]", ej:["Instagram te quita alcance por subir el mismo video dos veces."]},
  {n:"Mándale esto a…", p:"Mándale esto a [persona] que [hábito]", ej:["Mándale esto a tu socio, el que todavía cuadra la caja en un cuaderno."]},
  {n:"POV / identificación", p:"POV: [escena] · Dime que eres… sin decirme…", ej:["Dime que tienes vendedores sin decirme que preguntas “¿cuánto se vendió hoy?”"]},
  {n:"Contraste", p:"[Lo que todos creen] no va a [resolver X]. Esto sí", ej:["Contratar otro vendedor no va a arreglar tus ventas."]},
  {n:"Resultado primero", p:"Muestro el final y luego el inicio", ej:["Así ve esta dueña sus ventas sin estar en la tienda."]},
  {n:"Pregunta que te hacen", p:"¿[Pregunta real]?", ej:["¿Cuánto cuesta automatizar un negocio pequeño?"]},
  {n:"Opinión impopular", p:"Opinión impopular: [afirmación]", ej:["Opinión impopular: la IA no le sirve a un negocio desordenado."]}
];
const CK_CAMARA = ["Empiezo hablando en el primer cuadro (sin “bueno”, sin respirar, sin mirar al lado).", "Le hablo a una persona: “tú”, nunca “chicos”.", "Hablo como hablo en Santa Rosa: mi acento y mi historia de vendedor son ventaja.", "Energía un punto arriba de lo normal; grabo de pie.", "Frases cortas, sin palabras técnicas.", "Cambio de plano cada 3-5 s (regla para Juliana).", "Subtítulos grandes, centrados, sin tapar la cara.", "Luz de frente, mirada al lente.", "Prueba en silencio: ¿se entiende el gancho en 2 s?", "3 versiones del gancho; gana la más natural."];
const METAS_REEL = [
  ["Omisión en los primeros 3 s", "Menos de 35 %"],
  ["Visualización media", "Más de la mitad del video"],
  ["Envíos por cada 1.000 de alcance", "10 o más"],
  ["Seguidores por cada 1.000 vistas", "Comparar con el promedio (Airbnb ≈ 3,9)"]
];
const PLAN4 = [
  ["1 · 16–22 nov", "Máster 2, 6, 1 + 4 (opinión)", "2 nuevos con tomas ya grabadas", "Máster 5", "Caso de la tienda paso a paso", "Grabar en la tienda y las pantallas del CRM antes del miércoles"],
  ["2 · 23–29 nov", "Máster 3 y 7 + 2 nuevos", "Máster 8 (lista) + 1 nuevo", "1 nuevo", "Apartamentos: antes y después", "Comparar vistas y seguidores por reel con el promedio"],
  ["3 · 30 nov–6 dic", "3 casos del tipo que más seguidores trajo + 1 opinión", "2 del tipo con más envíos", "1 nuevo", "Una lista para guardar", "Conseguir un caso nuevo publicable"],
  ["4 · 7–13 dic", "Igual, con ganchos nuevos", "Igual, con ganchos nuevos", "1 nuevo", "Caso o lista nueva", "Revisar qué formato trajo más seguidores por cada 1.000 vistas"]
];


// Embudo del máster (versión del 18 nov 2026)
const EMBUDO = [
  ["TOFU (arriba)", "Que un desconocido me descubra, se identifique y me siga", "Reels de las 6 categorías", "5-6 de los 7 reels"],
  ["MOFU (medio)", "Que el seguidor confíe en mí", "Carruseles de casos paso a paso, historias de detrás de cámaras, procesos", "1-2 carruseles + historias diarias"],
  ["BOFU (abajo)", "Que el que confía pida el diagnóstico", "CTA “Comenta DIAGNÓSTICO”, historias con cupos y testimonios", "Máx. 1 reel cada 2 semanas + historias"],
];
const AVATAR = "Dueño de negocio en Colombia, con empleados o vendedores (o con alojamientos), que ya vende pero siente que todo pasa por él.";
const TOFU_CAT = [
  {n:"Problemas", q:"Un dolor que vive hoy", c:"Le muestro una consecuencia que no ha visto", i:"Describo su escena exacta", g:"Si [situación], te está pasando esto y no lo ves", col:"#D79A9A",
   ideas:["Si tu negocio no funciona cuando te vas una semana, no tienes un negocio: tienes un trabajo.","Si tus vendedores anotan en un cuaderno, esto te está pasando.","Contestas el WhatsApp a las 11 de la noche y crees que es normal.","Si tienes un Airbnb, el problema no son los huéspedes: es que todo pasa por tu celular.","Tu negocio creció, pero tu control no creció con él."]},
  {n:"Creencias", q:"Algo que cree y lo frena", c:"Le contradigo lo que cree", i:"Uso su frase de siempre", g:"Crees que [creencia]. Yo también, hasta que [hecho]", col:"#AEC38E",
   ideas:["Creía que la IA era para empresas grandes. Hasta que la puse en una tienda con dos vendedores.","Contratar otro empleado no va a arreglar tu desorden.","Si le metes IA a tu negocio desordenado, lo vas a empeorar.","No necesitas saber programar para ver tus ventas en el celular.","La IA no te va a quitar clientes. Te los va a quitar el negocio de al lado que contesta más rápido."]},
  {n:"Carencias", q:"Lo que le falta: tiempo, control, información, libertad", c:"Le pregunto algo que no sabe responder", i:"Le hago verse en un espejo (POV, humor)", g:"¿Sabes [dato de su negocio]? Si no, te falta esto", col:"#F7D774",
   ideas:["Dime que eres dueño de negocio sin decirme que no te has tomado vacaciones.","¿Sabes cuál es el producto que más vendes? Esta dueña no lo sabía.","Lo que nadie te dice de tener negocio propio: no tienes jefe, tienes a todos.","POV: eres el dueño, el contador, el que contesta el WhatsApp y el que abre a las 7.","¿Sabes cuánto te dejó cada apartamento (o cada sede) el mes pasado? Si no, te falta esto."]},
  {n:"Preguntas", q:"Lo que se pregunta antes de comprar", c:"Prometo la respuesta real, con cifra", i:"Uso su pregunta tal cual", g:"¿[Pregunta que me hacen]? Te doy la respuesta real", col:"#9EC1CF",
   ideas:["¿Cuánto cuesta automatizar un negocio? Te digo el número real.","¿Por dónde empiezo a usar IA en mi negocio? Por aquí no.","¿La IA puede atender a mis clientes sin que suene a robot?","¿Qué automatizo primero: ventas, equipo o clientes?","¿Se puede manejar un Airbnb sin estar ahí?"]},
  {n:"Resultados", q:"Lo que logró alguien como él", c:"Muestro el resultado primero y el cómo después", i:"El caso es de un negocio como el suyo", g:"[Resultado concreto]. Así lo hicimos", col:"#EBCB9D",
   ideas:["De ir todos los días a ir dos veces por semana a mis apartamentos.","Tres fallas de dinero por semana que nadie veía.","Mi Instagram contesta solo mientras duermo.","Le pedí a Claude un CRM y me hizo un videojuego.","Así ve esta dueña sus ventas sin estar en la tienda."]},
  {n:"Tendencias", q:"Lo nuevo de IA, traducido a su negocio", c:"“Todo el mundo habla de X; casi nadie dice esto”", i:"“Lo que esto significa para un negocio como el tuyo”", g:"[Novedad]: lo que significa para tu negocio", col:"#C9B6E4",
   ideas:["[Herramienta o novedad de IA de la semana]: lo que significa para un negocio como el tuyo.","Todo el mundo está hablando de [X]. Esto es lo único que le sirve a un dueño de negocio.","Probé [novedad] en mi negocio real. Esto pasó.","Trend o audio del momento con giro de dueño de negocio.","[Noticia grande de tecnología] y por qué debería importarle a tu negocio (en primera persona)."]},
];
const PRUEBA_CI = [
  "Identificación: en el primer segundo, ¿mi avatar sabe que es para él? (lo nombro o describo su escena)",
  "Curiosidad: ¿hay algo que solo se resuelve viendo hasta el final?",
  "Categoría: ¿es problema, creencia, carencia, pregunta, resultado o tendencia?",
  "Cercanía: ¿se me ve a mí, mi negocio o mi historia?",
  "Siguiente paso: ¿el cierre lleva a seguirme, enviarlo o guardarlo? (en TOFU, casi nunca a vender)",
];
const CIERRES_TOFU = ["Sígueme si tienes un negocio y no quieres que todo dependa de ti","Mándaselo a [persona concreta]","Guárdalo para cuando lo vayas a hacer"];

const CATS = ["Problema","Creencia","Carencia","Pregunta","Resultado","Tendencia"];
const ETAPAS = [["TOFU","Darme a conocer"],["MOFU","Confianza"],["BOFU","Venta (DIAGNÓSTICO)"]];
const CAT_COL = {Problema:"#D79A9A", Creencia:"#AEC38E", Carencia:"#F7D774", Pregunta:"#9EC1CF", Resultado:"#EBCB9D", Tendencia:"#C9B6E4"};
// Cupo de una jornada de grabación (cubre 2 semanas del calendario): hablando 8, B-roll 4, cómico 2
const JORNADA = [{f:"Hablando a cámara", n:8}, {f:"B-roll con texto", n:4}, {f:"Cómico", n:2}];

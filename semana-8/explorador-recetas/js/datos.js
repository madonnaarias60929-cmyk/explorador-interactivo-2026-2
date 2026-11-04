// js/datos.js
// Habla con TheMealDB y traduce nombres, ingredientes e instrucciones al español.
// Regla principal: nombre, foto, categoría y país salen SIEMPRE
// del mismo registro (mismo idMeal). Nunca escribimos fotos a mano.
//
// Orden de traducción: diccionario -> traductor integrado de Chrome
// (sin límite diario) -> servicio MyMemory (con límite diario) -> texto original.

const API = "https://www.themealdb.com/api/json/v1/1";

// OPCIONAL: tu correo sube el límite diario de MyMemory de 5.000 a 50.000
// caracteres. Ejemplo: "tucorreo@gmail.com"
const CORREO_MYMEMORY = "";

const PREFIJO_CACHE = "traduccion-es-v1:";
let cuotaAgotada = false;

// ---------- Diccionarios de traducción ----------

const categoriasEnEspanol = {
  Beef: "Res",
  Chicken: "Pollo",
  Dessert: "Postres",
  Lamb: "Cordero",
  Miscellaneous: "Otros platos",
  Pasta: "Pasta",
  Pork: "Cerdo",
  Seafood: "Mariscos",
  Side: "Acompañamientos",
  Starter: "Entradas",
  Vegan: "Vegana",
  Vegetarian: "Vegetariana",
  Breakfast: "Desayuno",
  Goat: "Cabra"
};

const paisesEnEspanol = {
  American: "Estados Unidos",
  Argentinian: "Argentina",
  British: "Reino Unido",
  Canadian: "Canadá",
  Chinese: "China",
  Croatian: "Croacia",
  Dutch: "Países Bajos",
  Egyptian: "Egipto",
  Filipino: "Filipinas",
  French: "Francia",
  Greek: "Grecia",
  Indian: "India",
  Irish: "Irlanda",
  Italian: "Italia",
  Jamaican: "Jamaica",
  Japanese: "Japón",
  Kenyan: "Kenia",
  Malaysian: "Malasia",
  Mexican: "México",
  Moroccan: "Marruecos",
  Norwegian: "Noruega",
  Polish: "Polonia",
  Portuguese: "Portugal",
  Russian: "Rusia",
  "Saudi Arabian": "Arabia Saudita",
  Slovakian: "Eslovaquia",
  Spanish: "España",
  Syrian: "Siria",
  Thai: "Tailandia",
  Tunisian: "Túnez",
  Turkish: "Turquía",
  Ukrainian: "Ucrania",
  Uruguayan: "Uruguay",
  Venezuelan: "Venezuela",
  Vietnamese: "Vietnam"
};

// Ingredientes comunes. Los que no estén aquí se envían al traductor.
const ingredientesEnEspanol = {
  // Carnes, pescados y huevos
  chicken: "pollo",
  "chicken breast": "pechuga de pollo",
  "chicken thighs": "muslos de pollo",
  beef: "carne de res",
  "minced beef": "carne molida de res",
  "ground beef": "carne molida de res",
  "beef mince": "carne molida de res",
  pork: "cerdo",
  lamb: "cordero",
  bacon: "tocino",
  ham: "jamón",
  sausages: "salchichas",
  chorizo: "chorizo",
  salmon: "salmón",
  tuna: "atún",
  cod: "bacalao",
  prawns: "camarones",
  "king prawns": "langostinos",
  egg: "huevo",
  eggs: "huevos",
  "egg yolks": "yemas de huevo",
  "egg white": "clara de huevo",
  "egg whites": "claras de huevo",

  // Lácteos
  milk: "leche",
  butter: "mantequilla",
  cheese: "queso",
  "parmesan cheese": "queso parmesano",
  parmesan: "queso parmesano",
  parmigiano: "queso parmesano",
  mozzarella: "mozzarella",
  cheddar: "queso cheddar",
  "cheddar cheese": "queso cheddar",
  feta: "queso feta",
  "feta cheese": "queso feta",
  ricotta: "ricota",
  "cream cheese": "queso crema",
  cream: "crema de leche",
  "double cream": "crema de leche",
  "single cream": "crema de leche ligera",
  "sour cream": "crema agria",
  "heavy cream": "crema de leche",
  "evaporated milk": "leche evaporada",
  "condensed milk": "leche condensada",
  "sweetened condensed milk": "leche condensada",
  yogurt: "yogur",
  "greek yogurt": "yogur griego",
  "natural yoghurt": "yogur natural",
  yoghurt: "yogur",
  "greek yoghurt": "yogur griego",

  // Harinas, azúcares y panadería
  flour: "harina",
  "plain flour": "harina de trigo",
  "self-raising flour": "harina con polvo de hornear",
  "self raising flour": "harina con polvo de hornear",
  "bread flour": "harina de trigo para pan",
  cornstarch: "maicena",
  cornflour: "maicena",
  sugar: "azúcar",
  "brown sugar": "azúcar morena",
  "caster sugar": "azúcar fina",
  "icing sugar": "azúcar glas",
  "light brown soft sugar": "azúcar morena suave",
  "baking powder": "polvo de hornear",
  "baking soda": "bicarbonato de sodio",
  "bicarbonate of soda": "bicarbonato de sodio",
  yeast: "levadura",
  "vanilla extract": "extracto de vainilla",
  cocoa: "cacao en polvo",
  "cocoa powder": "cacao en polvo",
  chocolate: "chocolate",
  "dark chocolate": "chocolate oscuro",
  "milk chocolate": "chocolate con leche",
  bread: "pan",
  breadcrumbs: "pan rallado",
  tortillas: "tortillas",
  noodles: "fideos",
  "rice noodles": "fideos de arroz",
  rice: "arroz",
  pasta: "pasta",
  spaghetti: "espagueti",

  // Verduras y frutas
  tomato: "tomate",
  tomatoes: "tomates",
  "tomato puree": "puré de tomate",
  "tomato ketchup": "salsa de tomate",
  "chopped tomatoes": "tomates picados",
  potato: "papa",
  potatoes: "papas",
  "sweet potatoes": "batatas",
  "sweet potato": "batata",
  carrots: "zanahorias",
  carrot: "zanahoria",
  celery: "apio",
  mushrooms: "champiñones",
  peppers: "pimientos",
  "red pepper": "pimiento rojo",
  "green pepper": "pimiento verde",
  "red chilli": "chile rojo",
  "green chilli": "chile verde",
  chilli: "chile",
  jalapeno: "jalapeño",
  aubergine: "berenjena",
  courgette: "calabacín",
  zucchini: "calabacín",
  spinach: "espinaca",
  broccoli: "brócoli",
  cabbage: "repollo",
  cucumber: "pepino",
  lettuce: "lechuga",
  avocado: "aguacate",
  onion: "cebolla",
  onions: "cebollas",
  "red onions": "cebollas moradas",
  "red onion": "cebolla morada",
  "spring onions": "cebollín",
  "spring onion": "cebollín",
  garlic: "ajo",
  "garlic clove": "diente de ajo",
  "garlic cloves": "dientes de ajo",
  ginger: "jengibre",
  lemon: "limón",
  "lemon juice": "jugo de limón",
  lime: "lima",
  orange: "naranja",
  apple: "manzana",
  apples: "manzanas",
  bananas: "bananos",
  raisins: "pasas",
  corn: "maíz",
  peas: "arvejas",

  // Legumbres y frutos secos
  beans: "frijoles",
  "kidney beans": "frijoles rojos",
  chickpeas: "garbanzos",
  lentils: "lentejas",
  almonds: "almendras",
  "flaked almonds": "almendras en láminas",
  walnuts: "nueces",
  peanuts: "maní",
  "peanut butter": "mantequilla de maní",
  "sesame seed": "semillas de ajonjolí",
  "sesame seeds": "semillas de ajonjolí",
  tahini: "tahini",

  // Hierbas y especias
  salt: "sal",
  pepper: "pimienta",
  "black pepper": "pimienta negra",
  "cayenne pepper": "pimienta de cayena",
  parsley: "perejil",
  coriander: "cilantro",
  basil: "albahaca",
  oregano: "orégano",
  thyme: "tomillo",
  rosemary: "romero",
  sage: "salvia",
  mint: "menta",
  dill: "eneldo",
  cumin: "comino",
  paprika: "pimentón",
  cinnamon: "canela",
  turmeric: "cúrcuma",
  nutmeg: "nuez moscada",
  cardamom: "cardamomo",
  saffron: "azafrán",
  cloves: "clavos de olor",
  "bay leaves": "hojas de laurel",
  "bay leaf": "hoja de laurel",
  "chilli powder": "chile en polvo",

  // Aceites, caldos y salsas
  "olive oil": "aceite de oliva",
  "vegetable oil": "aceite vegetal",
  "sesame oil": "aceite de ajonjolí",
  oil: "aceite",
  water: "agua",
  "chicken stock": "caldo de pollo",
  "beef stock": "caldo de res",
  "vegetable stock": "caldo de verduras",
  "fish stock": "caldo de pescado",
  "stock cube": "cubo de caldo",
  "coconut milk": "leche de coco",
  "soy sauce": "salsa de soya",
  "fish sauce": "salsa de pescado",
  "oyster sauce": "salsa de ostras",
  "worcestershire sauce": "salsa inglesa",
  mustard: "mostaza",
  "dijon mustard": "mostaza de Dijon",
  mayonnaise: "mayonesa",
  vinegar: "vinagre",
  "white wine vinegar": "vinagre de vino blanco",
  "red wine vinegar": "vinagre de vino tinto",
  "rice vinegar": "vinagre de arroz",
  "red wine": "vino tinto",
  "white wine": "vino blanco",
  honey: "miel"
};

// Medidas y palabras sueltas que aparecen en las cantidades.
const medidasEnEspanol = [
  [/\btbsp\b|\btbs\b|\btblsp\b|\btablespoons?\b/gi, "cda"],
  [/\btsp\b|\bteaspoons?\b/gi, "cdta"],
  [/\bcups?\b/gi, "taza(s)"],
  [/\bpinch\b/gi, "pizca"],
  [/\bhandful\b/gi, "puñado"],
  [/\bdash\b/gi, "chorrito"],
  [/\bknob\b/gi, "trozo"],
  [/\bbunch\b/gi, "manojo"],
  [/\bsprigs?\b/gi, "ramita(s)"],
  [/\bslices?\b/gi, "rodaja(s)"],
  [/\bcloves?\b/gi, "diente(s)"],
  [/\bto taste\b/gi, "al gusto"],
  [/\bfinely chopped\b/gi, "picado finamente"],
  [/\bchopped\b/gi, "picado"],
  [/\bsliced\b/gi, "en rodajas"],
  [/\bdiced\b/gi, "en cubos"],
  [/\bgrated\b/gi, "rallado"],
  [/\bminced\b/gi, "molido"],
  [/\bcrushed\b/gi, "triturado"],
  [/\bbeaten\b/gi, "batido"],
  [/\bmelted\b/gi, "derretido"],
  [/\bsoftened\b/gi, "suavizado"],
  [/\bwhole\b/gi, "entero"],
  [/\blarge\b/gi, "grande"],
  [/\bsmall\b/gi, "pequeño"],
  [/\bmedium\b/gi, "mediano"]
];

// ---------- Caché ----------

function leerCache(texto) {
  try {
    return localStorage.getItem(PREFIJO_CACHE + texto);
  } catch {
    return null;
  }
}

function guardarCache(texto, traduccion) {
  try {
    localStorage.setItem(PREFIJO_CACHE + texto, traduccion);
  } catch {
    // Si el navegador no deja guardar, seguimos sin caché.
  }
}

// ---------- Traductor integrado de Chrome (sin límite diario) ----------

let traductorChrome = null;
let intentoCreacion = null;

// Intenta preparar el traductor de Chrome. Devuelve el traductor o null.
// Chrome puede exigir un clic del usuario para descargar el modelo;
// si falla por eso, se vuelve a intentar en el siguiente clic.
async function prepararTraductorChrome() {
  if (traductorChrome) return traductorChrome;
  if (!("Translator" in self)) return null;
  if (intentoCreacion) return intentoCreacion;

  intentoCreacion = (async () => {
    try {
      const opciones = { sourceLanguage: "en", targetLanguage: "es" };
      const estado = await Translator.availability(opciones);

      if (estado === "unavailable") return null;

      traductorChrome = await Translator.create(opciones);
      console.log("Traductor integrado de Chrome listo.");
      return traductorChrome;
    } catch (error) {
      console.warn("El traductor de Chrome aún no está listo:", error);
      intentoCreacion = null; // permite reintentar con el próximo clic
      return null;
    }
  })();

  return intentoCreacion;
}

/** app.js lo usa para saber si ya se puede traducir sin límite. */
export async function traductorLocalListo() {
  return Boolean(await prepararTraductorChrome());
}

// ---------- Traducción ----------

// El servicio puede devolver símbolos como &#39; ; los convertimos a texto normal.
function decodificarEntidades(texto) {
  const area = document.createElement("textarea");
  area.innerHTML = texto;
  return area.value;
}

function capitalizar(texto = "") {
  return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;
}

// Traduce un fragmento corto de inglés a español. Devuelve { texto, ok }.
// Si algo falla, devuelve el texto original con ok:false.
// Con { externo: false } nunca usa el servicio con límite diario.
async function traducirFragmento(texto, { externo = true } = {}) {
  const limpio = texto.trim();
  if (!limpio) return { texto: limpio, ok: true };

  const guardado = leerCache(limpio);
  if (guardado) return { texto: guardado, ok: true };

  // 1) Traductor integrado de Chrome
  if (traductorChrome) {
    try {
      const resultado = (await traductorChrome.translate(limpio)).trim();
      if (resultado) {
        guardarCache(limpio, resultado);
        return { texto: resultado, ok: true };
      }
    } catch (error) {
      console.warn("Falló el traductor de Chrome:", error);
    }
  }

  // 2) Servicio MyMemory (solo si se permite y queda cuota)
  const fallo = { texto: limpio, ok: false };
  if (!externo || cuotaAgotada) return fallo;

  try {
    const parametros = new URLSearchParams({ q: limpio, langpair: "en|es" });
    if (CORREO_MYMEMORY) parametros.set("de", CORREO_MYMEMORY);

    const respuesta = await fetch(
      `https://api.mymemory.translated.net/get?${parametros}`
    );

    if (respuesta.status === 429) {
      cuotaAgotada = true;
      return fallo;
    }
    if (!respuesta.ok) return fallo;

    const datos = await respuesta.json();
    const traducido = decodificarEntidades(
      datos?.responseData?.translatedText || ""
    ).trim();

    // Cuando se acaba la cuota, el servicio responde con un mensaje de aviso.
    // No debemos mostrarlo ni guardarlo como si fuera una traducción.
    if (/MYMEMORY WARNING/i.test(traducido) || Number(datos.responseStatus) === 429) {
      cuotaAgotada = true;
      return fallo;
    }

    if (Number(datos.responseStatus) !== 200 || !traducido) return fallo;

    guardarCache(limpio, traducido);
    return { texto: traducido, ok: true };
  } catch (error) {
    console.warn("No se pudo traducir:", limpio.slice(0, 40), error);
    return fallo;
  }
}

// Parte un texto largo en fragmentos por oraciones.
function dividirEnFragmentos(texto, maximo = 450) {
  const oraciones = texto.split(/(?<=[.!?])\s+/);
  const fragmentos = [];
  let actual = "";

  for (const oracion of oraciones) {
    if (oracion.length > maximo) {
      if (actual) fragmentos.push(actual);
      actual = "";
      for (let i = 0; i < oracion.length; i += maximo) {
        fragmentos.push(oracion.slice(i, i + maximo));
      }
      continue;
    }

    if ((actual + " " + oracion).trim().length > maximo) {
      fragmentos.push(actual);
      actual = oracion;
    } else {
      actual = (actual + " " + oracion).trim();
    }
  }

  if (actual) fragmentos.push(actual);
  return fragmentos;
}

// Traduce un texto de cualquier largo. Devuelve { texto, ok }.
async function traducirTexto(texto) {
  const fragmentos = dividirEnFragmentos(texto.trim());
  const partes = [];
  let todoOk = true;

  for (const fragmento of fragmentos) {
    const resultado = await traducirFragmento(fragmento);
    partes.push(resultado.texto);
    if (!resultado.ok) todoOk = false;
  }

  return { texto: partes.join(" "), ok: todoOk };
}

// Ejecuta una función sobre una lista, con pocas tareas a la vez.
async function mapearConLimite(lista, limite, funcion) {
  const resultados = new Array(lista.length);
  let siguiente = 0;

  async function trabajador() {
    while (siguiente < lista.length) {
      const indice = siguiente++;
      resultados[indice] = await funcion(lista[indice], indice);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limite, lista.length) }, trabajador)
  );

  return resultados;
}

// ---------- Funciones de apoyo ----------

async function consultarAPI(ruta) {
  const respuesta = await fetch(`${API}/${ruta}`);

  if (!respuesta.ok) {
    throw new Error(`Error consultando recetas: ${respuesta.status}`);
  }

  return respuesta.json();
}

function traducirPais(areaOriginal) {
  if (!areaOriginal || areaOriginal === "Unknown") {
    return "Origen no registrado";
  }
  return paisesEnEspanol[areaOriginal] || areaOriginal;
}

function traducirCategoria(categoriaOriginal) {
  return categoriasEnEspanol[categoriaOriginal] || categoriaOriginal || "Receta";
}

function traducirMedida(medida) {
  let resultado = medida;
  for (const [patron, reemplazo] of medidasEnEspanol) {
    resultado = resultado.replace(patron, reemplazo);
  }
  return resultado;
}

// Devuelve { texto, ok } para un ingrediente.
async function traducirIngrediente(nombre) {
  const clave = nombre.trim().toLowerCase();

  if (ingredientesEnEspanol[clave]) {
    return { texto: capitalizar(ingredientesEnEspanol[clave]), ok: true };
  }

  const resultado = await traducirFragmento(nombre);
  return { texto: capitalizar(resultado.texto), ok: resultado.ok };
}

/**
 * Consulta cada país de la API y devuelve un mapa:
 * idMeal -> nombre original del país (ej. "Italian").
 */
async function obtenerMapaDePaises() {
  const mapa = new Map();

  try {
    const lista = await consultarAPI("list.php?a=list");
    const areas = (lista.meals || []).map((item) => item.strArea);

    await Promise.all(
      areas.map(async (area) => {
        try {
          const datos = await consultarAPI(`filter.php?a=${encodeURIComponent(area)}`);
          for (const plato of datos.meals || []) {
            mapa.set(String(plato.idMeal), area);
          }
        } catch (error) {
          console.warn(`No se pudo cargar el país ${area}`, error);
        }
      })
    );
  } catch (error) {
    console.warn("No se pudo cargar la lista de países", error);
  }

  return mapa;
}

// ---------- Funciones principales (las usa app.js) ----------

/**
 * Carga el catálogo completo. Cada receta conserva su foto original.
 * El nombre aparece en español si ya estaba guardado en la caché;
 * si no, se muestra el original hasta que llegue la traducción.
 */
export async function cargarRecetas(limite = Infinity) {
  const datosCategorias = await consultarAPI("categories.php");
  const categorias = datosCategorias.categories || [];

  const [resultadosCategorias, mapaPaises] = await Promise.all([
    Promise.all(
      categorias.map(async (categoria) => {
        try {
          const datos = await consultarAPI(
            `filter.php?c=${encodeURIComponent(categoria.strCategory)}`
          );
          return (datos.meals || []).map((plato) => ({
            plato,
            categoriaOriginal: categoria.strCategory
          }));
        } catch (error) {
          console.warn(`No se pudo cargar la categoría ${categoria.strCategory}`, error);
          return [];
        }
      })
    ),
    obtenerMapaDePaises()
  ]);

  const unicas = new Map();
  const nombresVistos = new Set();

  for (const grupo of resultadosCategorias) {
    for (const { plato, categoriaOriginal } of grupo) {
      const id = String(plato.idMeal);
      const nombreOriginal = (plato.strMeal || "").trim();
      const imagen = (plato.strMealThumb || "").trim();

      // Descartamos datos incompletos y duplicados (por id y por nombre).
      if (!id || !nombreOriginal || !imagen) continue;
      if (unicas.has(id)) continue;
      if (nombresVistos.has(nombreOriginal.toLowerCase())) continue;

      const paisOriginal = mapaPaises.get(id) || "Unknown";
      const categoriaEsp = traducirCategoria(categoriaOriginal);
      const nombreEnCache = leerCache(nombreOriginal);

      nombresVistos.add(nombreOriginal.toLowerCase());
      unicas.set(id, {
        id: Number(id),
        nombre: nombreEnCache ? capitalizar(nombreEnCache) : nombreOriginal,
        nombreOriginal,
        nombreTraducido: Boolean(nombreEnCache),
        imagen,
        categoriaOriginal,
        etiqueta: categoriaEsp,
        categoria: categoriaEsp,
        paisOriginal,
        pais: traducirPais(paisOriginal)
      });
    }
  }

  const recetas = [...unicas.values()].slice(0, limite);

  if (recetas.length === 0) {
    throw new Error("No se pudieron cargar recetas. Revisa tu conexión.");
  }

  // Comprobación para ti: mira estos números en la consola del navegador.
  console.log(`Recetas cargadas: ${recetas.length}`);
  console.log(
    `Recetas sin país registrado: ${
      recetas.filter((r) => r.paisOriginal === "Unknown").length
    }`
  );

  return recetas;
}

/**
 * Traduce los nombres en segundo plano usando SOLO el traductor local
 * (así no se gasta la cuota diaria del servicio externo).
 * Cada vez que uno se traduce, llama a alTraducir(receta).
 */
export async function traducirNombres(recetas, alTraducir = () => {}) {
  await mapearConLimite(recetas, 3, async (receta) => {
    if (receta.nombreTraducido) return;

    const resultado = await traducirFragmento(receta.nombreOriginal, {
      externo: false
    });

    if (resultado.ok) {
      receta.nombre = capitalizar(resultado.texto);
      receta.nombreTraducido = true;
      alTraducir(receta);
    }
  });
}

/**
 * Carga ingredientes, país e instrucciones del plato seleccionado,
 * ya traducidos. "traducido" es false si algo quedó en inglés.
 */
export async function cargarDetalleReceta(id) {
  const datos = await consultarAPI(`lookup.php?i=${encodeURIComponent(id)}`);
  const plato = datos.meals?.[0];

  if (!plato) {
    throw new Error("No encontramos el detalle de esta receta.");
  }

  // Abrir una receta es un clic del usuario: buen momento para preparar
  // el traductor de Chrome si todavía no estaba listo.
  await prepararTraductorChrome();

  // Ingredientes y cantidades originales
  const ingredientesOriginales = [];
  for (let i = 1; i <= 20; i++) {
    const ingrediente = plato[`strIngredient${i}`]?.trim();
    const cantidad = plato[`strMeasure${i}`]?.trim();
    if (ingrediente) {
      ingredientesOriginales.push({ ingrediente, cantidad });
    }
  }

  // Pasos originales (quitamos líneas como "STEP 1" o "1.")
  const pasosOriginales = (plato.strInstructions || "")
    .split(/\r?\n/)
    .map((paso) => paso.trim().replace(/^\d+[.)]\s*/, ""))
    .filter((paso) => paso && !/^step\s*\d+\.?$/i.test(paso));

  const nombreOriginal = (plato.strMeal || "").trim();

  const [ingredientesTraducidos, pasosTraducidos, nombreTraducido] =
    await Promise.all([
      mapearConLimite(ingredientesOriginales, 3, async ({ ingrediente, cantidad }) => {
        const resultado = await traducirIngrediente(ingrediente);
        const medida = cantidad ? traducirMedida(cantidad) : "";
        return {
          texto: medida ? `${resultado.texto}: ${medida}` : resultado.texto,
          ok: resultado.ok
        };
      }),
      mapearConLimite(pasosOriginales, 3, (paso) => traducirTexto(paso)),
      traducirFragmento(nombreOriginal)
    ]);

  const todoTraducido =
    ingredientesTraducidos.every((i) => i.ok) &&
    pasosTraducidos.every((p) => p.ok);

  return {
    nombre: nombreTraducido.ok ? capitalizar(nombreTraducido.texto) : nombreOriginal,
    nombreOriginal,
    pais: traducirPais(plato.strArea),
    categoria: traducirCategoria(plato.strCategory),
    imagen: plato.strMealThumb,
    ingredientes: ingredientesTraducidos.map((i) => i.texto),
    preparacion: pasosTraducidos.map((p) => p.texto),
    traducido: todoTraducido,
    fuente: plato.strSource || ""
  };
}
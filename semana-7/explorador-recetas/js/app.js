// js/app.js
// Archivo principal: carga las recetas, dibuja las tarjetas y maneja
// el buscador, los filtros, los favoritos y la ventana modal.

import {
  cargarRecetas,
  cargarDetalleReceta,
  traducirNombres,
  traductorLocalListo
} from "./datos.js";

import {
  filtrarRecetas,
  obtenerFavoritos
} from "./logica.js";

// ---------- Elementos de la página ----------
const listaRecetas = document.querySelector("#lista-recetas");
const totalRecetas = document.querySelector("#total-recetas");
const sinResultados = document.querySelector("#sin-resultados");
const campoBusqueda = document.querySelector("#buscar-receta");
const filtroCategoria = document.querySelector("#filtro-categoria");
const formularioBusqueda = document.querySelector("#form-busqueda");
const botonLimpiar = document.querySelector("#limpiar-filtros");
const botonFavoritos = document.querySelector("#btn-favoritos");
const contadorFavoritos = document.querySelector("#contador-favoritos");
const modal = document.querySelector("#modal-receta");
const contenidoModal = document.querySelector("#contenido-modal");

// ---------- Estado de la aplicación ----------
let recetas = [];
const favoritos = new Set();
let mostrarSoloFavoritos = false;

// Recuadro gris que se muestra solo si una foto no carga.
// No es una foto de comida: avisa que no hay imagen disponible.
const IMAGEN_NO_DISPONIBLE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <rect width="600" height="450" fill="#e2e8f0"/>
      <text x="300" y="225" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif" font-size="26" fill="#64748b">
        Foto no disponible
      </text>
    </svg>`
  );

// ---------- Funciones de apoyo ----------

// Evita que un texto de la API se interprete como código HTML.
function escaparHTML(valor = "") {
  return String(valor).replace(/[&<>"']/g, (caracter) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caracter]);
}

// Llena el selector con las categorías que realmente existen en el catálogo.
function llenarCategorias() {
  const categorias = [...new Set(recetas.map((receta) => receta.categoria))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "es"));

  filtroCategoria.innerHTML =
    `<option value="Todas">Todas las categorías</option>` +
    categorias
      .map((categoria) =>
        `<option value="${escaparHTML(categoria)}">${escaparHTML(categoria)}</option>`
      )
      .join("");
}

// Si una imagen falla (error 404, sin internet...), mostramos el recuadro gris.
// El evento "error" no sube por el DOM, por eso se escucha en fase de captura.
document.addEventListener(
  "error",
  (evento) => {
    const imagen = evento.target;

    if (imagen.tagName === "IMG" && !imagen.dataset.sinFoto) {
      imagen.dataset.sinFoto = "1";
      imagen.src = IMAGEN_NO_DISPONIBLE;
    }
  },
  true
);

// Cuando llega la traducción de un nombre, lo cambiamos en la tarjeta
// sin volver a dibujar todas las tarjetas.
function actualizarNombreEnPantalla(receta) {
  const titulo = listaRecetas.querySelector(`[data-nombre="${receta.id}"]`);

  if (titulo) {
    titulo.textContent = receta.nombre;
    titulo
      .closest("article")
      ?.querySelector("img")
      ?.setAttribute("alt", receta.nombre);
  }
}

// ---------- Tarjetas ----------

function crearTarjeta(receta) {
  const esFavorito = favoritos.has(receta.id);

  return `
    <article class="tarjeta-receta group overflow-hidden rounded-2xl
      border border-slate-200 bg-white shadow-sm transition duration-300
      hover:-translate-y-1 hover:shadow-lg">

      <div class="relative overflow-hidden bg-slate-200">
        <img
          class="foto-receta"
          src="${escaparHTML(receta.imagen)}"
          alt="${escaparHTML(receta.nombre)}"
          loading="lazy"
          width="600"
          height="450"
        >

        <button
          type="button"
          data-favorito="${receta.id}"
          aria-label="${esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}"
          aria-pressed="${esFavorito}"
          class="absolute right-3 top-3 flex h-11 w-11 items-center
            justify-center rounded-full bg-white text-2xl shadow-md
            transition hover:scale-110
            ${esFavorito ? "text-rose-500" : "text-slate-500"}">
          ${esFavorito ? "♥" : "♡"}
        </button>
      </div>

      <div class="p-5">
        <span class="text-xs font-medium text-slate-400">
          RECETA #${receta.id}
        </span>

        <h2 data-nombre="${receta.id}"
          class="mt-2 text-xl font-extrabold tracking-tight">
          ${escaparHTML(receta.nombre)}
        </h2>

        <div class="mt-3">
          <span class="inline-flex rounded-full bg-indigo-100 px-3 py-1
            text-xs font-semibold text-indigo-700">
            ${escaparHTML(receta.etiqueta)}
          </span>
        </div>

        <p class="mt-3 text-sm text-slate-500">
          🌎 ${escaparHTML(receta.pais)}
          <span class="mx-1">·</span>
          ${escaparHTML(receta.categoria)}
        </p>

        <button
          type="button"
          data-detalle="${receta.id}"
          class="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3
            font-bold text-white transition hover:bg-indigo-700
            focus:outline-none focus:ring-2 focus:ring-indigo-400
            focus:ring-offset-2">
          Ver receta
        </button>
      </div>
    </article>
  `;
}

function renderizarRecetas() {
  let resultados = mostrarSoloFavoritos
    ? obtenerFavoritos(recetas, favoritos)
    : recetas;

  resultados = filtrarRecetas(
    resultados,
    campoBusqueda.value,
    filtroCategoria.value
  );

  listaRecetas.innerHTML = resultados.map(crearTarjeta).join("");

  totalRecetas.textContent = mostrarSoloFavoritos
    ? `${resultados.length} recetas favoritas`
    : `${resultados.length} de ${recetas.length} recetas · Sabores de todo el mundo`;

  sinResultados.classList.toggle("hidden", resultados.length !== 0);
  listaRecetas.classList.toggle("hidden", resultados.length === 0);

  contadorFavoritos.textContent = favoritos.size;

  botonFavoritos.setAttribute(
    "aria-pressed",
    String(mostrarSoloFavoritos)
  );
}

// ---------- Ventana modal ----------

async function abrirDetalle(id) {
  contenidoModal.innerHTML = `
    <div class="p-8 text-center text-slate-600">
      Cargando y traduciendo ingredientes y preparación...
    </div>
  `;

  if (!modal.open) {
    modal.showModal();
  }

  try {
    const receta = await cargarDetalleReceta(id);

    // Si el nombre en español es distinto del original, mostramos ambos.
    const nombreOriginal =
      receta.nombreOriginal && receta.nombreOriginal !== receta.nombre
        ? `<p class="mt-1 text-sm text-slate-500">
            Nombre original: ${escaparHTML(receta.nombreOriginal)}
          </p>`
        : "";

    // Aviso si algo no se pudo traducir (por ejemplo, límite diario del servicio).
    const avisoTraduccion = receta.traducido
      ? ""
      : `<p class="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Una parte de esta receta no se pudo traducir (el servicio de
          traducción alcanzó su límite o no respondió). Se muestra el texto
          original en inglés.
        </p>`;

    contenidoModal.innerHTML = `
      <img
        src="${escaparHTML(receta.imagen)}"
        alt="${escaparHTML(receta.nombre)}"
        class="h-56 w-full object-cover sm:h-72"
        width="900"
        height="600"
      >

      <div class="p-6 sm:p-8">
        <p class="text-sm font-bold uppercase tracking-widest text-indigo-600">
          ${escaparHTML(receta.pais)}
        </p>

        <h2 class="mt-2 text-3xl font-extrabold tracking-tight">
          ${escaparHTML(receta.nombre)}
        </h2>
        ${nombreOriginal}

        <span class="mt-3 inline-flex rounded-full bg-indigo-100
          px-3 py-1 text-sm font-semibold text-indigo-700">
          ${escaparHTML(receta.categoria)}
        </span>

        ${avisoTraduccion}

        <h3 class="mt-7 text-xl font-bold">Ingredientes</h3>

        <ul class="mt-3 list-disc space-y-2 pl-5 text-slate-600">
          ${receta.ingredientes.map((ingrediente) =>
            `<li>${escaparHTML(ingrediente)}</li>`
          ).join("")}
        </ul>

        <h3 class="mt-7 text-xl font-bold">
          Preparación paso a paso
        </h3>

        <ol class="mt-3 list-decimal space-y-3 pl-5 text-slate-600">
          ${receta.preparacion.map((paso) =>
            `<li class="pl-1 leading-relaxed">${escaparHTML(paso)}</li>`
          ).join("")}
        </ol>

        ${receta.fuente ? `
          <p class="mt-6 text-sm text-slate-500">
            Fuente original:
            <a href="${escaparHTML(receta.fuente)}"
              target="_blank" rel="noopener noreferrer"
              class="font-semibold text-indigo-600 underline">
              Consultar receta
            </a>
          </p>
        ` : ""}
      </div>
    `;
  } catch (error) {
    contenidoModal.innerHTML = `
      <div class="p-8 text-center">
        <h2 class="text-xl font-bold">No pudimos cargar la receta</h2>
        <p class="mt-2 text-slate-600">
          Comprueba tu conexión e inténtalo nuevamente.
        </p>
      </div>
    `;

    console.error(error);
  }
}

// ---------- Eventos ----------

listaRecetas.addEventListener("click", (evento) => {
  const botonFavorito = evento.target.closest("[data-favorito]");

  if (botonFavorito) {
    const id = Number(botonFavorito.dataset.favorito);

    if (favoritos.has(id)) {
      favoritos.delete(id);
    } else {
      favoritos.add(id);
    }

    renderizarRecetas();
    return;
  }

  const botonDetalle = evento.target.closest("[data-detalle]");

  if (botonDetalle) {
    abrirDetalle(Number(botonDetalle.dataset.detalle));
  }
});

formularioBusqueda.addEventListener("submit", (evento) => {
  evento.preventDefault();
  renderizarRecetas();
});

campoBusqueda.addEventListener("input", renderizarRecetas);
filtroCategoria.addEventListener("change", renderizarRecetas);

botonLimpiar.addEventListener("click", () => {
  campoBusqueda.value = "";
  filtroCategoria.value = "Todas";
  mostrarSoloFavoritos = false;
  renderizarRecetas();
});

botonFavoritos.addEventListener("click", () => {
  mostrarSoloFavoritos = !mostrarSoloFavoritos;

  document.querySelector("#recetas").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  renderizarRecetas();
});

// Cierra el modal al pulsar fuera de él.
modal.addEventListener("click", (evento) => {
  if (evento.target === modal) {
    modal.close();
  }
});
// Traduce los nombres cuando el traductor de Chrome está listo.
// Se intenta al cargar la página y otra vez con el primer clic del usuario
// (Chrome puede pedir un clic para descargar el modelo de traducción).
let traduciendoNombres = false;

async function iniciarTraduccionDeNombres() {
  if (traduciendoNombres) return;

  const listo = await traductorLocalListo();
  if (!listo) return;

  traduciendoNombres = true;
  await traducirNombres(recetas, actualizarNombreEnPantalla);
  renderizarRecetas();
}

// ---------- Carga inicial ----------

async function iniciarAplicacion() {
  totalRecetas.textContent = "Cargando recetas del catálogo...";

  try {
    // Sin límite: se muestran todas las recetas que la API entregue.
    recetas = await cargarRecetas();
    llenarCategorias();
    renderizarRecetas();

    // Los nombres se traducen en segundo plano: cada uno cambia en pantalla
    // cuando llega su traducción. Al final dibujamos una vez más para que
    // la búsqueda use los nombres ya traducidos.
    iniciarTraduccionDeNombres();
    document.addEventListener("click", iniciarTraduccionDeNombres, { once: true });
    } catch (error) {
    console.error(error);

    totalRecetas.textContent =
      "No se pudo conectar con el catálogo de recetas. Revisa tu conexión e inténtalo de nuevo.";

    sinResultados.classList.remove("hidden");
    listaRecetas.classList.add("hidden");
  }
}

iniciarAplicacion();
// js/logica.js
// Funciones de lógica pura: filtran la lista sin tocar la pantalla.

/**
 * Convierte un texto a minúsculas y le quita los acentos,
 * para que "Japón" y "japon" se consideren iguales.
 */
function normalizarTexto(valor = "") {
  return String(valor ?? "")
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Filtra las recetas por nombre (en español u original), país y categoría.
 * No modifica el catálogo original.
 */
export function filtrarRecetas(recetas, texto = "", categoria = "Todas") {
  const busqueda = normalizarTexto(texto);

  return recetas.filter((receta) => {
    const nombre = normalizarTexto(receta.nombre);
    const nombreOriginal = normalizarTexto(receta.nombreOriginal);
    const pais = normalizarTexto(receta.pais);
    const etiqueta = normalizarTexto(receta.etiqueta);

    const coincideTexto =
      nombre.includes(busqueda) ||
      nombreOriginal.includes(busqueda) ||
      pais.includes(busqueda) ||
      etiqueta.includes(busqueda);

    const coincideCategoria =
      categoria === "Todas" ||
      receta.categoria === categoria;

    return coincideTexto && coincideCategoria;
  });
}

/**
 * Obtiene únicamente las recetas marcadas como favoritas.
 */
export function obtenerFavoritos(recetas, favoritos) {
  return recetas.filter((receta) => favoritos.has(receta.id));
}
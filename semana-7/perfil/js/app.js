// js/app.js
import { habilidadesData, proyectosData } from './datos.js';

document.addEventListener('DOMContentLoaded', () => {
  // Renderizar Habilidades dinámicamente
  const gridHabilidades = document.getElementById('grid-habilidades');
  if (gridHabilidades) {
    gridHabilidades.innerHTML = habilidadesData.map(h => `
      <div class="rounded-xl border border-rose-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800 text-center">
        <span class="font-semibold block text-slate-800 dark:text-slate-200">${h.titulo}</span>
        <span class="text-xs text-rose-500 dark:text-rose-400">${h.subtitulo}</span>
      </div>
    `).join('');
  }

  // Renderizar Proyectos dinámicamente
  const gridProyectos = document.getElementById('grid-proyectos');
  if (gridProyectos) {
    gridProyectos.innerHTML = proyectosData.map(p => `
      <article class="flex flex-col justify-between rounded-2xl border border-rose-100 bg-white p-6 shadow-sm hover:shadow-md transition dark:border-slate-800 dark:bg-slate-800">
        <div class="space-y-2">
          <span class="text-xs font-semibold text-rose-500 dark:text-rose-400">${p.categoria}</span>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">${p.titulo}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            ${p.descripcion}
          </p>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
          <span class="text-xs text-slate-500 dark:text-slate-400">${p.tecnologias}</span>
          <a href="${p.enlace}" class="text-sm font-semibold text-rose-500 hover:underline dark:text-rose-400">Ver proyecto &rarr;</a>
        </div>
      </article>
    `).join('');
  }
});
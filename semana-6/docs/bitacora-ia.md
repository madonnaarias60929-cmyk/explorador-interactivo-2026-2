# Bitácora de Inteligencia Artificial - Explorador Multiverso

## 2026-10-18 · Modal de detalle

**Herramienta:** GitHub Copilot / ChatGPT  

**Spec que usé:**
- **QUÉ:** Modal de detalle de un personaje de Rick and Morty para mi Explorador.
- **ESTRUCTURA:** Elemento nativo `<dialog id="modal-detalle">`, abierto con `showModal()`. Imagen cuadrada arriba, `<h2>` con el nombre, lista `<dl>` con estado, especie, origen y ubicación, y un botón "Cerrar".
- **ESTILO:** Tailwind CSS v4 (sin `tailwind.config.js`, sin CSS propio, sin `style=""`). `rounded-2xl`, `max-w-md`, sombra grande, fondo del backdrop oscuro semitransparente. Dark mode con `dark:` (`slate-800`).
- **COMPORTAMIENTO:** Se abre desde un botón con `id="ver-detalle"`. Se cierra con `Esc`, con el botón Cerrar (`<form method="dialog">`) y al hacer clic en el fondo oscuro.
- **RESTRICCIONES:** HTML + JS vainilla en el mismo archivo. Sin librerías. Comentarios en español. `aria-labelledby` apuntando al `h2`. `alt` en la imagen.
- **CONTEXTO (Datos de la API):** `{"name":"Rick Sanchez","status":"Alive","species":"Human","origin":{"name":"Earth (C-137)"},"location":{"name":"Citadel of Ricks"},"image":"https://rickandmortyapi.com/api/character/avatar/1.jpeg"}`

**Auditoría contra la spec:**
- [x] Usa `<dialog>` y `showModal()`
- [x] Cierra con `Esc` y con el botón
- [ ] Cierre con clic en el fondo → no lo hizo por defecto, lo agregué manualmente (`if (e.target === modal) modal.close()`)
- [x] Dark mode aplicado correctamente en superficies y textos

**Clases o sintaxis inventadas que encontré:**
- `shadow-3xl` (la IA sugirió esta, pero no existe en Tailwind; la corregí por `shadow-2xl`).

**Qué no entendí y cómo lo resolví:**
- El uso del pseudo-elemento `backdrop:` en Tailwind para el fondo oscuro del modal. Lo consulté en la documentación oficial para entender cómo aplicar el desenfoque (`backdrop-blur-sm`).

**¿Puedo explicar cada línea?** 
Sí, comprendo cómo el evento `click` activa el modal y cómo el método nativo maneja el foco y la accesibilidad.
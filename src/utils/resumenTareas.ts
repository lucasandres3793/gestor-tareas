import type { Task } from "../types/task";

// Arma el texto del email a partir de las tareas del usuario.
// Funcion pura: mismas tareas, mismo texto.
export function armarResumen(tareas: Task[]): string {
  if (tareas.length === 0) {
    return "No tenés tareas cargadas todavía.";
  }

  const pendientes = tareas.filter((t) => !t.completed);
  const completadas = tareas.filter((t) => t.completed);

  const lineas: string[] = [];
  lineas.push("Resumen de tus tareas");
  lineas.push("");
  lineas.push(`Total: ${tareas.length}`);
  lineas.push(`Pendientes: ${pendientes.length}`);
  lineas.push(`Completadas: ${completadas.length}`);

  if (pendientes.length > 0) {
    lineas.push("");
    lineas.push("PENDIENTES");
    pendientes.forEach((t) => {
      const vence = t.dueDate === null ? "sin fecha" : `vence ${t.dueDate}`;
      lineas.push(`- ${t.title} (prioridad ${t.priority}, ${vence})`);
    });
  }

  if (completadas.length > 0) {
    lineas.push("");
    lineas.push("COMPLETADAS");
    completadas.forEach((t) => {
      lineas.push(`- ${t.title}`);
    });
  }

  return lineas.join("\n");
}

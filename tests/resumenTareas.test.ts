import { describe, it, expect } from "vitest";
import { armarResumen } from "../src/utils/resumenTareas";
import type { Task } from "../src/types/task";

function tarea(parcial: Partial<Task>): Task {
  return {
    id: "t1",
    userId: "u1",
    title: "Tarea",
    description: "",
    completed: false,
    priority: "media",
    dueDate: null,
    createdAt: null,
    ...parcial,
  };
}

describe("armarResumen", () => {
  it("caso borde: avisa cuando no hay tareas", () => {
    expect(armarResumen([])).toBe("No tenés tareas cargadas todavía.");
  });

  it("cuenta totales, pendientes y completadas", () => {
    const resumen = armarResumen([
      tarea({ id: "1", title: "Comprar pan" }),
      tarea({ id: "2", title: "Pagar luz", completed: true }),
    ]);
    expect(resumen).toContain("Total: 2");
    expect(resumen).toContain("Pendientes: 1");
    expect(resumen).toContain("Completadas: 1");
  });

  it("separa las tareas por estado", () => {
    const resumen = armarResumen([
      tarea({ id: "1", title: "Comprar pan" }),
      tarea({ id: "2", title: "Pagar luz", completed: true }),
    ]);
    expect(resumen).toContain("PENDIENTES");
    expect(resumen).toContain("COMPLETADAS");
  });

  it("indica sin fecha cuando la tarea no tiene vencimiento", () => {
    const resumen = armarResumen([tarea({ title: "Comprar pan", dueDate: null })]);
    expect(resumen).toContain("- Comprar pan (prioridad media, sin fecha)");
  });
});

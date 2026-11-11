import type { Timestamp } from "firebase/firestore";

export type Prioridad = "baja" | "media" | "alta";

// Una tarea tal como se guarda en Firestore.
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Prioridad;
  dueDate: string | null;
  createdAt: Timestamp | null;
}

// Lo que el formulario entrega al crear o editar.
// Omite lo que decide el sistema: id, userId, createdAt.
export interface TaskInput {
  title: string;
  description: string;
  priority: Prioridad;
  dueDate: string | null;
}

// Filtro de la vista (extra credit).
export type FiltroTareas = "todas" | "pendientes" | "completadas";

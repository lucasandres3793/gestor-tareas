import { TodoItem } from "./TodoItem";
import type { Task, TaskInput } from "../types/task";

interface Props {
  tareas: Task[];
  cargando: boolean;
  error: string;
  onAlternar: (tarea: Task) => void;
  onEditar: (taskId: string, cambios: TaskInput) => Promise<void>;
  onBorrar: (taskId: string) => void;
}

export function TodoList({ tareas, cargando, error, onAlternar, onEditar, onBorrar }: Props) {
  if (cargando) {
    return <p>Cargando tareas...</p>;
  }

  if (error !== "") {
    return <p role="alert">{error}</p>;
  }

  if (tareas.length === 0) {
    return <p>No tenés tareas todavía. Agregá la primera con el formulario de arriba.</p>;
  }

  return (
    <ul>
      {tareas.map((tarea) => (
        <TodoItem
          key={tarea.id}
          tarea={tarea}
          onAlternar={onAlternar}
          onEditar={onEditar}
          onBorrar={onBorrar}
        />
      ))}
    </ul>
  );
}

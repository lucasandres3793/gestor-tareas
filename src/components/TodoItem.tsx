import { useState } from "react";
import { TodoForm } from "./TodoForm";
import type { Task, TaskInput } from "../types/task";

interface Props {
  tarea: Task;
  onAlternar: (tarea: Task) => void;
  onEditar: (taskId: string, cambios: TaskInput) => Promise<void>;
  onBorrar: (taskId: string) => void;
}

export function TodoItem({ tarea, onAlternar, onEditar, onBorrar }: Props) {
  const [editando, setEditando] = useState<boolean>(false);
  const [guardando, setGuardando] = useState<boolean>(false);

  async function guardarCambios(entrada: TaskInput) {
    setGuardando(true);
    try {
      await onEditar(tarea.id, entrada);
      setEditando(false);
    } finally {
      setGuardando(false);
    }
  }

  if (editando) {
    return (
      <li>
        <TodoForm
          valorInicial={{
            title: tarea.title,
            description: tarea.description,
            priority: tarea.priority,
            dueDate: tarea.dueDate,
          }}
          textoBoton="Guardar cambios"
          enviando={guardando}
          onEnviar={guardarCambios}
          onCancelar={() => setEditando(false)}
        />
      </li>
    );
  }

  return (
    <li>
      <input
        type="checkbox"
        checked={tarea.completed}
        onChange={() => onAlternar(tarea)}
        aria-label={`Marcar "${tarea.title}" como completada`}
      />

      <div>
        <h3 style={{ textDecoration: tarea.completed ? "line-through" : "none" }}>
          {tarea.title}
        </h3>

        {tarea.description && <p>{tarea.description}</p>}

        <p>
          <span>Prioridad: {tarea.priority}</span>
          {tarea.dueDate && <span> · Vence: {tarea.dueDate}</span>}
        </p>
      </div>

      <button type="button" onClick={() => setEditando(true)}>
        Editar
      </button>

      <button type="button" onClick={() => onBorrar(tarea.id)}>
        Eliminar
      </button>
    </li>
  );
}

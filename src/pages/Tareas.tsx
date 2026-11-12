import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { cerrarSesion } from "../services/auth";
import { crearTarea, editarTarea, alternarCompletada, borrarTarea } from "../services/tasks";
import { TodoForm } from "../components/TodoForm";
import { TodoList } from "../components/TodoList";
import type { Task, TaskInput, FiltroTareas } from "../types/task";

export function Tareas() {
  const { user } = useAuth();
  const { tareas, cargando, error } = useTasks();

  const [filtro, setFiltro] = useState<FiltroTareas>("todas");
  const [creando, setCreando] = useState<boolean>(false);
  const [errorAccion, setErrorAccion] = useState<string>("");

  // Valor derivado: se calcula en cada render, no es estado.
  const visibles = useMemo(() => {
    if (filtro === "pendientes") return tareas.filter((t) => !t.completed);
    if (filtro === "completadas") return tareas.filter((t) => t.completed);
    return tareas;
  }, [tareas, filtro]);

  const pendientes = tareas.filter((t) => !t.completed).length;

  async function agregar(entrada: TaskInput) {
    if (user === null) return;
    setErrorAccion("");
    setCreando(true);
    try {
      await crearTarea(user.uid, entrada);
    } catch (e: unknown) {
      console.error(e);
      setErrorAccion("No pudimos crear la tarea. Intentá de nuevo.");
    } finally {
      setCreando(false);
    }
  }

  async function editar(taskId: string, cambios: TaskInput) {
    setErrorAccion("");
    try {
      await editarTarea(taskId, cambios);
    } catch (e: unknown) {
      console.error(e);
      setErrorAccion("No pudimos guardar los cambios.");
    }
  }

  async function alternar(tarea: Task) {
    setErrorAccion("");
    try {
      await alternarCompletada(tarea.id, tarea.completed);
    } catch (e: unknown) {
      console.error(e);
      setErrorAccion("No pudimos actualizar la tarea.");
    }
  }

  async function borrar(taskId: string) {
    setErrorAccion("");
    try {
      await borrarTarea(taskId);
    } catch (e: unknown) {
      console.error(e);
      setErrorAccion("No pudimos eliminar la tarea.");
    }
  }

  return (
    <main>
      <header>
        <h1>Mis tareas</h1>
        <p>{user?.email}</p>
        <button type="button" onClick={() => cerrarSesion()}>
          Cerrar sesión
        </button>
      </header>

      <section>
        <h2>Nueva tarea</h2>
        <TodoForm enviando={creando} onEnviar={agregar} />
      </section>

      <section>
        <h2>
          Tareas ({pendientes} {pendientes === 1 ? "pendiente" : "pendientes"})
        </h2>

        <div>
          <button
            type="button"
            onClick={() => setFiltro("todas")}
            disabled={filtro === "todas"}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setFiltro("pendientes")}
            disabled={filtro === "pendientes"}
          >
            Pendientes
          </button>
          <button
            type="button"
            onClick={() => setFiltro("completadas")}
            disabled={filtro === "completadas"}
          >
            Completadas
          </button>
        </div>

        {errorAccion && <p role="alert">{errorAccion}</p>}

        <TodoList
          tareas={visibles}
          cargando={cargando}
          error={error}
          onAlternar={alternar}
          onEditar={editar}
          onBorrar={borrar}
        />
      </section>
    </main>
  );
}

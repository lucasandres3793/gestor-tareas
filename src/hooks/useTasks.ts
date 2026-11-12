import { useEffect, useState } from "react";
import { escucharTareas } from "../services/tasks";
import { useAuth } from "./useAuth";
import type { Task } from "../types/task";

interface EstadoTareas {
  tareas: Task[];
  cargando: boolean;
  error: string;
}

export function useTasks(): EstadoTareas {
  const { user } = useAuth();
  const [tareas, setTareas] = useState<Task[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Sin usuario no hay nada que escuchar.
    if (user === null) {
      setTareas([]);
      setCargando(false);
      return;
    }

    setCargando(true);
    setError("");

    const desuscribir = escucharTareas(
      user.uid,
      (recibidas) => {
        setTareas(recibidas);
        setCargando(false);
      },
      (e) => {
        console.error(e);
        setError("No pudimos cargar tus tareas. Probá recargar la página.");
        setCargando(false);
      }
    );

    // Limpieza: cancela la suscripcion al desmontar o al cambiar de usuario.
    return desuscribir;
  }, [user]);

  return { tareas, cargando, error };
}

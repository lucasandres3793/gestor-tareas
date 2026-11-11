import { useAuth } from "../hooks/useAuth";
import { cerrarSesion } from "../services/auth";

export function Tareas() {
  const { user } = useAuth();

  return (
    <main>
      <header>
        <h1>Mis tareas</h1>
        <p>Sesión iniciada como: <strong>{user?.email}</strong></p>
        <button type="button" onClick={() => cerrarSesion()}>
          Cerrar sesión
        </button>
      </header>

      <p>Acá van a ir las tareas (hito 6).</p>
    </main>
  );
}

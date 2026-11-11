import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface Props {
  children: ReactNode;
}

// Para login y registro: si ya hay sesion, no tiene sentido verlas.
export function RutaPublica({ children }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Cargando sesión...</p>;
  }

  if (user !== null) {
    // Vuelve a donde queria ir antes del login, o a /tareas.
    const destino = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/tareas";
    return <Navigate to={destino} replace />;
  }

  return <>{children}</>;
}

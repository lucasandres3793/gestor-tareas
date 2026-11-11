import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface Props {
  children: ReactNode;
}

export function RutaProtegida({ children }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Primero el estado de carga: todavia no sabemos si hay sesion.
  // Sin esto, al recargar se redirige al login a un usuario logueado.
  if (loading) {
    return <p>Cargando sesión...</p>;
  }

  // Ahora si: Firebase respondio y no hay usuario.
  // state.from guarda a donde queria ir, para volver despues del login.
  if (user === null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

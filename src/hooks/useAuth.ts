import { useContext } from "react";
import { AuthContext } from "../features/auth/AuthProvider";
import type { AuthState } from "../types/auth";

export function useAuth(): AuthState {
  const contexto = useContext(AuthContext);

  // Si es undefined, el componente esta fuera del AuthProvider.
  if (contexto === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return contexto;
}

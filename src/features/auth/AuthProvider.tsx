import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { escucharSesion } from "../../services/auth";
import type { AuthState } from "../../types/auth";

// El contexto empieza en undefined para detectar si alguien
// usa useAuth fuera del proveedor.
export const AuthContext = createContext<AuthState | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Una sola suscripcion para toda la app: unica fuente de verdad.
    const desuscribir = escucharSesion((usuario) => {
      setUser(usuario);
      setLoading(false);
    });

    // Limpieza: cierra la suscripcion al desmontar.
    return desuscribir;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

import type { User } from "firebase/auth";

// Lo que el resto de la app sabe sobre la sesión.
// loading distingue "todavía no sé" de "no hay usuario".
export interface AuthState {
  user: User | null;
  loading: boolean;
}

// Credenciales del formulario de login y registro.
export interface Credenciales {
  email: string;
  password: string;
}

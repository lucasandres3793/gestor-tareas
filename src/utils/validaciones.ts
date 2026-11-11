import type { Credenciales } from "../types/auth";

// Un error por campo. Si el objeto esta vacio, el formulario es valido.
export type ErroresCredenciales = Partial<Record<keyof Credenciales, string>>;

export function validarCredenciales({ email, password }: Credenciales): ErroresCredenciales {
  const errores: ErroresCredenciales = {};

  if (email.trim() === "") {
    errores.email = "El email es obligatorio.";
  } else if (!email.includes("@") || !email.includes(".")) {
    errores.email = "Ingresá un email válido.";
  }

  if (password === "") {
    errores.password = "La contraseña es obligatoria.";
  } else if (password.length < 6) {
    errores.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  return errores;
}

export function hayErrores(errores: ErroresCredenciales): boolean {
  return Object.keys(errores).length > 0;
}

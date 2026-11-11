// Traduce los codigos de Firebase a mensajes para el usuario.
// Credenciales invalidas y usuario inexistente comparten mensaje
// a proposito: decir cual de los dos falla revela que emails
// estan registrados.
const MENSAJES: Record<string, string> = {
  "auth/invalid-credential": "Email o contraseña incorrectos.",
  "auth/invalid-email": "El email no tiene un formato válido.",
  "auth/email-already-in-use": "Ya existe una cuenta con ese email.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/too-many-requests": "Demasiados intentos. Esperá unos minutos.",
  "auth/network-request-failed": "No hay conexión. Revisá tu internet.",
  "auth/popup-closed-by-user": "Cerraste la ventana de Google antes de terminar.",
};

export function mensajeDeError(error: unknown): string {
  // El error llega como unknown: hay que comprobar su forma antes de usarlo.
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  ) {
    const codigo = (error as { code: string }).code;
    return MENSAJES[codigo] ?? "No pudimos completar la operación. Intentá de nuevo.";
  }

  return "Ocurrió un error inesperado. Intentá de nuevo.";
}

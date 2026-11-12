// El frontend solo habla con nuestra funcion, nunca con AWS.
// Las credenciales viven del lado del servidor.

interface RespuestaOk {
  ok: true;
  messageId?: string;
}

interface RespuestaError {
  error: string;
}

export async function enviarResumen(to: string, summary: string): Promise<RespuestaOk> {
  const respuesta = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, summary }),
  });

  const datos: unknown = await respuesta.json();

  if (!respuesta.ok) {
    const mensaje =
      typeof datos === "object" && datos !== null && "error" in datos
        ? String((datos as RespuestaError).error)
        : "No pudimos enviar el email.";
    throw new Error(mensaje);
  }

  return datos as RespuestaOk;
}

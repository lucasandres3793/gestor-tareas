import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

// Codigo de servidor: nunca llega al navegador.
// Por eso aca pueden vivir las credenciales de AWS.

interface Pedido {
  to: string;
  summary: string;
}

function esPedidoValido(body: unknown): body is Pedido {
  if (typeof body !== "object" || body === null) return false;
  const posible = body as Record<string, unknown>;
  return (
    typeof posible.to === "string" &&
    posible.to.includes("@") &&
    typeof posible.summary === "string" &&
    posible.summary.length > 0
  );
}

export default async function handler(request: Request): Promise<Response> {
  // 1. Solo POST.
  if (request.method !== "POST") {
    return Response.json({ error: "Método no permitido." }, { status: 405 });
  }

  // 2. Validar lo que manda el cliente.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "El cuerpo no es JSON válido." }, { status: 400 });
  }

  if (!esPedidoValido(body)) {
    return Response.json(
      { error: "Faltan datos: se requieren 'to' (email) y 'summary' (texto)." },
      { status: 400 }
    );
  }

  // 3. Leer la configuracion del entorno del servidor.
  const region = process.env.SES_REGION;
  const from = process.env.SES_FROM_EMAIL;
  const accessKeyId = process.env.SES_ACCESS_KEY_ID;
  const secretAccessKey = process.env.SES_SECRET_ACCESS_KEY;

  if (!region || !from || !accessKeyId || !secretAccessKey) {
    console.error("Faltan variables de entorno de SES.");
    return Response.json({ error: "El servidor no está configurado." }, { status: 500 });
  }

  // 4. Armar el comando. El remitente lo fija el servidor, no el cliente.
  const ses = new SESv2Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });

  const comando = new SendEmailCommand({
    FromEmailAddress: from,
    Destination: { ToAddresses: [body.to] },
    Content: {
      Simple: {
        Subject: { Data: "Resumen de tus tareas", Charset: "UTF-8" },
        Body: { Text: { Data: body.summary, Charset: "UTF-8" } },
      },
    },
  });

  // 5. Enviar y responder.
  try {
    const resultado = await ses.send(comando);
    return Response.json({ ok: true, messageId: resultado.MessageId });
  } catch (e: unknown) {
    console.error("Error al enviar con SES:", e);
    return Response.json({ error: "No pudimos enviar el email." }, { status: 502 });
  }
}

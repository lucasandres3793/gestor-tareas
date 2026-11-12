import type { VercelRequest, VercelResponse } from "@vercel/node";
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Solo POST.
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido." });
  }

  // 2. Validar lo que manda el cliente.
  const body: unknown = req.body;

  if (!esPedidoValido(body)) {
    return res.status(400).json({
      error: "Faltan datos: se requieren 'to' (email) y 'summary' (texto).",
    });
  }

  // 3. Leer la configuracion del entorno del servidor.
  const region = process.env.SES_REGION;
  const from = process.env.SES_FROM_EMAIL;
  const accessKeyId = process.env.SES_ACCESS_KEY_ID;
  const secretAccessKey = process.env.SES_SECRET_ACCESS_KEY;

  if (!region || !from || !accessKeyId || !secretAccessKey) {
    console.error("Faltan variables de entorno de SES.");
    return res.status(500).json({ error: "El servidor no está configurado." });
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
    return res.status(200).json({ ok: true, messageId: resultado.MessageId });
  } catch (e: unknown) {
    console.error("Error al enviar con SES:", e);
    return res.status(502).json({ error: "No pudimos enviar el email." });
  }
}

# Gestor estratégico de tareas

Aplicación web SPA para gestionar tareas diarias, con cuentas de usuario, persistencia en la nube y envío de un resumen por email.

**Producción:** https://gestor-tareas-gold.vercel.app
**Repositorio:** https://github.com/lucasandres3793/gestor-tareas

Proyecto Integrador del Módulo 4 del bootcamp Web Fullstack de SoyHenry.

## Qué hace

- Registro e inicio de sesión con email y contraseña o con Google.
- Sesión persistente: al recargar la página el usuario sigue dentro.
- Rutas privadas: las tareas no se ven sin sesión activa, ni siquiera entrando por URL directa.
- CRUD completo de tareas: crear, listar, editar, eliminar y marcar como completadas.
- Cada usuario ve únicamente sus propias tareas, garantizado por reglas de seguridad en la base de datos.
- Sincronización en tiempo real: la interfaz se actualiza sola después de cada operación, sin recargar.
- Envío de un resumen del estado de las tareas por email, con un botón.
- Extras: filtros por estado (todas, pendientes, completadas), prioridad y fecha de vencimiento.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript, con Vite |
| Ruteo | React Router |
| Autenticación | Firebase Authentication |
| Base de datos | Cloud Firestore |
| Email | AWS SES, invocado desde una Vercel Function |
| Testing | Vitest + React Testing Library |
| Deploy | Vercel |

## Decisiones arquitectónicas

### Organización por capas

El código se separa por responsabilidad, de modo que cada parte tenga un único lugar previsible:

La regla que ordena todo: **`services/` es la única capa que conoce Firebase y AWS.** Los componentes reciben datos por props y avisan hacia arriba con callbacks; no saben de dónde salen los datos. Si mañana cambiara el proveedor de base de datos, solo se tocaría esa carpeta.

### Una sola fuente de verdad para la sesión

`AuthProvider` abre **una** suscripción a `onAuthStateChanged` y comparte el estado con toda la app vía Context. Ningún componente consulta Firebase por su cuenta, lo que evita que distintas partes de la interfaz muestren estados contradictorios.

El estado de sesión tiene tres valores, no dos: `loading`, "sin usuario" y "con usuario". Esa distinción es la que evita el bug clásico de redirigir al login a un usuario ya autenticado durante el instante en que Firebase recupera la sesión al recargar.

### Tipado estricto, sin `any`

TypeScript corre en modo `strict`. Las uniones de literales (`"baja" | "media" | "alta"`, `"idle" | "enviando" | "ok" | "error"`) modelan los valores posibles de forma que el compilador detecte cualquier valor inválido. Los datos que vienen de afuera, como los errores de un `catch`, se tipan como `unknown` y se validan antes de usarlos.

Hay dos interfaces para una tarea: `Task` describe lo que está guardado y `TaskInput` lo que el formulario entrega. La diferencia no es cosmética: `userId` no está en `TaskInput`, así que el formulario no puede decidir de quién es una tarea. Eso lo define el servicio a partir de la sesión, y la regla de Firestore lo verifica.

### Seguridad de los datos

Filtrar por `userId` en el frontend sirve para mostrar lo correcto, no para proteger nada: cualquiera puede llamar a Firestore directamente sin pasar por la app. La protección real está en las reglas (`firestore.rules`), versionadas en el repo:

- Leer, editar y borrar requieren que el `userId` del documento guardado coincida con el del usuario autenticado.
- Crear verifica el `userId` que **llega** en el pedido, además de la forma de los campos (tipos, título no vacío, prioridad dentro de los valores permitidos).
- Todo lo que no esté explícitamente permitido queda bloqueado.

### Tiempo real con `onSnapshot`

La lista usa `onSnapshot`, que mantiene una suscripción abierta en lugar de pedir los datos una vez. Por eso la interfaz se actualiza sola después de crear, editar o borrar. La suscripción se cancela en la limpieza del `useEffect`, para no dejar conexiones abiertas cuando el componente se desmonta.

### Por qué el email pasa por una función serverless

Las credenciales de AWS no pueden estar en el frontend: todo lo que llega al navegador es legible por cualquiera. Por eso el envío sigue el patrón BFF (Backend for Frontend):

1. React arma el texto del resumen y hace un POST a `/api/send-email`.
2. La función, que corre en el servidor de Vercel, verifica el método, valida el cuerpo y lee las credenciales de las variables de entorno.
3. El **remitente lo fija el servidor**, nunca el cliente. Si lo decidiera el cliente, cualquiera podría usar la función para enviar correos haciéndose pasar por otra dirección.
4. La función llama a AWS SES y devuelve el resultado.
5. El frontend muestra el estado: enviando, éxito o error.

El usuario de AWS (`ses-sender-gestor-tareas`) tiene una política con un solo permiso, `ses:SendEmail`. Si esa credencial se filtrara, el daño máximo sería enviar correos desde la dirección verificada, en lugar de acceso a toda la cuenta.

SES está en modo sandbox, así que solo envía a direcciones verificadas. Para este proyecto alcanza, porque el resumen se manda al propio usuario.

## Instalación

Requiere Node.js 20 o superior.

```bash
git clone https://github.com/lucasandres3793/gestor-tareas.git
cd gestor-tareas
npm install
cp .env.example .env   # completar con las credenciales propias
npm run dev
```

### Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (solo frontend) |
| `npx vercel dev` | Servidor con las funciones de `api/` |
| `npm run build` | Verificación de tipos y build de producción |
| `npm test` | Tests con Vitest |

## Variables de entorno

Se declaran en `.env.example`. El archivo `.env` está en `.gitignore` y nunca se sube al repositorio.

**Frontend (llevan el prefijo `VITE_` porque las usa el navegador):**

| Variable | Descripción |
|---|---|
| `VITE_FIREBASE_API_KEY` | Clave de la app web de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Dominio de autenticación |
| `VITE_FIREBASE_PROJECT_ID` | Id del proyecto |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de almacenamiento |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Id del remitente de mensajería |
| `VITE_FIREBASE_APP_ID` | Id de la app |

**Servidor (sin prefijo: Vite nunca las expone al navegador):**

| Variable | Descripción |
|---|---|
| `SES_ACCESS_KEY_ID` | Clave de acceso del usuario IAM |
| `SES_SECRET_ACCESS_KEY` | Clave secreta del usuario IAM |
| `SES_REGION` | Región de SES donde está verificada la identidad |
| `SES_FROM_EMAIL` | Dirección remitente verificada en SES |

La configuración de Firebase no es secreta: está pensada para viajar al navegador. Lo que protege los datos son las reglas de Firestore. Las de AWS sí son secretas y viven únicamente del lado del servidor.

En producción, las variables se cargan en Vercel (Settings → Environments). Se leen en el momento del build, así que un cambio requiere un nuevo despliegue.

## Testing

24 tests en 5 archivos.

- **Unitarios** de las funciones puras: validación de credenciales, traducción de errores de Firebase y armado del resumen.
- **De componentes**: `TodoForm` y `TodoList`, probando comportamiento observable (lo que el usuario ve y hace), no detalles internos.
- **Casos borde** cubiertos: contraseña de exactamente 6 caracteres, título de solo espacios, lista vacía, fallo de lectura y fallo de envío de email.
- **Mock de servicios externos**: el servicio de email se simula con `vi.mock`, así ningún test sale a la red ni toca AWS.

Un detalle de diseño que los tests dejan documentado: ante credenciales inválidas, el mensaje es el mismo trate de un email inexistente o de una contraseña incorrecta. Distinguirlos revelaría qué direcciones tienen cuenta, lo que habilita la enumeración de usuarios.

## Deploy

Desplegado en Vercel. El build corre `tsc -b && vite build`, así que un error de tipos frena el despliegue antes de llegar a producción.

El archivo `vercel.json` reescribe todas las rutas que no empiezan con `/api/` hacia `index.html`. Sin eso, recargar la página estando en `/tareas` devuelve 404: el servidor busca un archivo con ese nombre, que no existe, porque en una SPA el ruteo lo resuelve el navegador.

## Uso de IA en el desarrollo

(Esta sección la completás vos; en PROMPTS.md están los prompts usados.)

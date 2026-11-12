# Uso de IA en el desarrollo

Registro de cómo usé asistencia de IA durante el Proyecto Integrador, qué pedí en cada etapa y qué decisiones tomé a partir de las respuestas.

## Cómo trabajé

Usé la IA como tutor, no como generador de código. El flujo fue siempre el mismo: pedía la explicación del concepto antes del código, revisaba lo que me daba, lo ejecutaba y sobre el resultado real decidía el paso siguiente. Cuando algo fallaba, llevaba el error completo en lugar de pedir que lo arreglara a ciegas.

## Prompts por hito

### Hito 1 y 2: setup y Firebase

> Contexto: Proyecto Integrador del M4 de Henry, una SPA de gestión de tareas. Stack: React + TypeScript con Vite, Firebase (Auth + Firestore), AWS SES vía Vercel Functions, Vitest + React Testing Library, deploy en Vercel. Trabajo en Mac, con Node 24.
> Objetivo: hacer el setup inicial del proyecto, definir la estructura de carpetas por capas y dejar el manejo de variables de entorno seguro.
> Restricciones: TypeScript estricto, sin `any`. El archivo `.env` nunca debe llegar al repositorio.
> Formato: guiame paso a paso, un comando por vez, explicando qué hace cada uno y por qué se elige esa estructura.
> Criterio de aceptación: el proyecto corre en local sin errores, existe `.env.example` sin valores reales, `.env` está en `.gitignore` antes del primer commit y el primer commit es semántico.

**Qué decidí a partir de la respuesta:** separar las variables en dos grupos según el prefijo `VITE_`, porque solo las del frontend deben llegar al navegador. También versionar las reglas de Firestore y el índice compuesto en el repo, aunque Firebase los guarde en su consola, para que queden documentados.

### Hito 3 a 5: autenticación, rutas y modelo de datos

> Necesito la autenticación con Firebase: registro, login con email y con Google, logout y sesión persistente. Explicame cómo funciona `onAuthStateChanged` y el patrón Observer antes del código. Los errores de Firebase tienen que llegar al usuario como mensajes comprensibles, no como códigos internos.

**Qué decidí:** modelar el estado de sesión con tres valores (`loading`, sin usuario, con usuario) en lugar de dos. Entender el patrón Observer fue lo que me hizo ver que, sin el estado de carga, el guardia de ruta decide antes de que Firebase responda y expulsa al usuario al recargar.

También decidí que el mensaje de error sea el mismo para email inexistente y contraseña incorrecta. La IA me explicó que distinguirlos habilita la enumeración de usuarios.

### Hito 6: CRUD en tiempo real

> Quiero el CRUD de tareas con `onSnapshot` para que la interfaz se actualice sola. Explicame la diferencia con una consulta normal y qué es un memory leak en este contexto. La lógica no puede vivir en los componentes.

**Qué decidí:** poner la lectura en un hook propio (`useTasks`) y las escrituras en un servicio, de modo que los componentes solo reciban props. Y calcular la lista filtrada y el contador de pendientes como valores derivados, sin estado propio, para evitar el ciclo infinito que aparece cuando un efecto escribe en su propia dependencia.

### Hito 7: email con AWS SES

> Necesito enviar un resumen por email con AWS SES sin exponer credenciales en el frontend. Explicame por qué no se puede llamar a SES directamente desde el navegador y qué arquitectura resuelve eso.

**Qué decidí:** usar el patrón BFF con una Vercel Function, y que el remitente lo fije el servidor y no el cliente. También crear el usuario de IAM con una política de un solo permiso (`ses:SendEmail`) en lugar de la política completa de SES, aplicando mínimo privilegio.

### Hito 8: testing

> Armá tests unitarios de las funciones puras y de componentes para TodoForm y TodoList, con los servicios externos mockeados. Quiero que prueben comportamiento, no detalles internos, y que haya al menos un caso de error o borde.

**Qué decidí:** buscar los elementos por rol y por etiqueta accesible en lugar de por `data-testid`, para que los tests sigan pasando si cambia la estructura interna del componente.

## Errores reales y qué aprendí de cada uno

| Qué pasó | Causa | Cómo lo resolví |
|---|---|---|
| La lista de tareas no cargaba y mostraba un error | Firestore necesita un índice compuesto cuando una consulta filtra por un campo y ordena por otro | El error traía un link que crea el índice; lo versioné en `firestore.indexes.json` |
| El build de Vercel falló | Un `import` sin usar, que `noUnusedLocals` rechaza | Lo detecté corriendo `npm run build` en local antes de volver a desplegar |
| El botón de email quedaba colgado para siempre | Escribí la función con la firma web (`Request`/`Response`) y el runtime de Node en Vercel espera `(req, res)` | La reescribí con la firma correcta usando los tipos de `@vercel/node` |
| Recargar la página en `/tareas` devolvía 404 | En una SPA el ruteo lo resuelve el navegador; el servidor busca un archivo que no existe | Un `vercel.json` con un rewrite de todas las rutas que no empiezan con `/api/` hacia `index.html` |
| El primer email llegó a spam | Es un remitente nuevo sin dominio propio verificado | Confirmado como legítimo; en un proyecto real se verifica el dominio completo en SES |

## Qué me llevo sobre trabajar con IA

**Lo que funcionó mejor fue pedir el porqué antes del código.** Entender el patrón Observer, la diferencia entre `resource` y `request.resource` en las reglas de Firestore, o por qué el estado de sesión necesita tres valores, me permitió revisar lo que recibía en lugar de aceptarlo.

**El error más caro fue el de la firma de la Vercel Function**, y es un buen ejemplo del límite de la herramienta: el código era correcto en abstracto, pero no para el runtime concreto en el que iba a correr. La IA no tenía cómo saberlo sin ejecutarlo; lo detectamos probando.

**El patrón que adopté:** especificar siempre versión y entorno en el prompt, pedir el plan antes del código en los cambios grandes, y validar ejecutando en lugar de leyendo. Un error que se ve en la terminal cuesta minutos; el mismo error descubierto en producción cuesta mucho más.

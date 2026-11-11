import { auth, db } from "./services/firebase";

function App() {
  // Si la configuración está bien, estos dos valores existen.
  const proyecto = auth.app.options.projectId;
  const firestoreListo = db !== undefined;

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Gestor de tareas</h1>
      <p>Proyecto de Firebase: <strong>{proyecto}</strong></p>
      <p>Authentication: <strong>{auth ? "conectado" : "error"}</strong></p>
      <p>Firestore: <strong>{firestoreListo ? "conectado" : "error"}</strong></p>
    </main>
  );
}

export default App;

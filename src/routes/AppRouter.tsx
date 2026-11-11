import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/Login";
import { Registro } from "../pages/Registro";
import { Tareas } from "../pages/Tareas";
import { RutaProtegida } from "./RutaProtegida";
import { RutaPublica } from "./RutaPublica";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <RutaPublica>
              <Login />
            </RutaPublica>
          }
        />

        <Route
          path="/registro"
          element={
            <RutaPublica>
              <Registro />
            </RutaPublica>
          }
        />

        <Route
          path="/tareas"
          element={
            <RutaProtegida>
              <Tareas />
            </RutaProtegida>
          }
        />

        {/* La raiz lleva a tareas; si no hay sesion, el guardia manda al login. */}
        <Route path="/" element={<Navigate to="/tareas" replace />} />

        {/* Cualquier otra URL: tambien a tareas. */}
        <Route path="*" element={<Navigate to="/tareas" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

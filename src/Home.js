import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./Componetes/Login";
import Register from "./Componetes/Register";
import Profile from "./pages/Profile";
import CreateTask from "./pages/Create-Task";
import EditTask from "./pages/EditTask";
import PrivateRoute from "./Componetes/PrivateRoute";
import ResetPassword from "./pages/resetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./Componetes/Navbar";

function Home() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/crear-tarea"
          element={
            <PrivateRoute>
              <CreateTask />
            </PrivateRoute>
          }
        />
        <Route
          path="/editar-tareas/:taskId"
          element={
            <PrivateRoute>
              <EditTask />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default Home;

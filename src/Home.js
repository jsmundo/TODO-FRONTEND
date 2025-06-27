import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./Componetes/Login";
import Register from "./Componetes/Register";
import TaskList from "./pages/TaskList";
import PrivateRoute from "./Componetes/PrivateRoute";
import ResetPassword from "./pages/resetPassword";
import Navbar from "./Componetes/Navbar";

function Home() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <TaskList />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default Home;

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../context/AppContext";

const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logout();
    navigate("/login"); // Redirige al login
  };

  return (
    <nav>
      {!store.token ? (
        <>
          <Link to="/register">Registro</Link> | <Link to="/login">Login</Link>
        </>
      ) : (
        <>
          <Link to="/tasks">Mis Tareas</Link> |{" "}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;

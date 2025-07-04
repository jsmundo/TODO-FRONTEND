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
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <div className="container-fluid">
        <div className="d-flex">
          {!store.token ? (
            <>
              <Link className="nav-link" to="/register">
                Registro
              </Link>
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/profile">
                Mis Tareas
              </Link>
              <button
                className="btn btn-outline-danger btn-sm ms-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

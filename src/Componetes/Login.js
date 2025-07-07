import React, { useState, useContext } from "react";
import { Context } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await actions.Login({ email, password });
    if (success) {
      setTimeout(() => {
        navigate("/profile"); // o la ruta que sea
      }, 100);
      alert("✅ Login exitoso");
    } else {
      alert("❌ Error en login, verifica credenciales");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Iniciar sesión</button>
      <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
      <Link to="/register">¿No tienes cuenta? Regístrate</Link>
    </form>
  );
};

export default Login;

import React, { useState, useContext } from "react";
import { Context } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await actions.Login({ email, password });
    if (success) {
      alert("✅ Login exitoso");
      navigate("/tasks");
    } else {
      alert("❌ Error en login, verifica credenciales");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
    </form>
  );
};

export default Login;

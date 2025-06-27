import React, { useState, useContext } from "react";
import { Context } from "../context/AppContext"; // Importas el contexto
import { useNavigate } from "react-router-dom"; // Importas el hook para redirigir

function Register() {
  const navigate = useNavigate(); // Hook para redirigir
  const { actions } = useContext(Context); // Accedes a las acciones
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await actions.register(formData); // Llamas a la acción
    if (result.success) {
      alert(result.message);
      navigate("/login"); // Rediriges al login
    } else {
      alert(`❌ ${result.message}`);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;

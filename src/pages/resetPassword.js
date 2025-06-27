import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../context/AppContext";

const ResetPassword = () => {
  const { actions } = useContext(Context);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!actions || !actions.resetPassword) {
      console.error(
        "ERROR:'actions.resetPassword' no esta defino en el contexto"
      );
      return;
    }

    const success = await actions.resetPassword(token, newPassword);
    if (success) {
      alert("✅ Contraseña cambiada exitosamente");
      navigate("/login"); // Redirigir a la página de login
    }
  };

  return (
    <div>
      <h1>Restablecer Contraseña</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva Contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Restablecer</button>
      </form>
    </div>
  );
};

export default ResetPassword;

import React, { useState, useContext } from "react";
import { Context } from "../context/AppContext";

const ForgotPassword = () => {
  const { actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // "ok" | "error" | null

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const bueno = await actions.sendResetEmail(email); // acción que verás más abajo
    setLoading(false);
    setStatus(bueno ? "bueno" : "error");
  };

  return (
    <div className="forgot-wrapper">
      <h1>¿Olvidaste tu contraseña?</h1>

      {status === "bueno" && (
        <p className="msg-bueno">
          📩 Te enviamos un correo con el enlace para restablecer la contraseña.
          Revisa tu bandeja y spam.
        </p>
      )}
      {status === "error" && (
        <p className="msg-error">
          ❌ No pudimos enviar el correo. Verifica el email o inténtalo de
          nuevo.
        </p>
      )}

      {status === null && (
        <form onSubmit={handleSubmit}>
          <label>
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;

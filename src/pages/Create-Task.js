import React, { useState, useContext } from "react";
import { Context } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
  const { actions } = useContext(Context);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await actions.createTask({ title, description });
    if (success) {
      navigate("/profile"); // Redirigir a la lista de tareas
    } else {
      alert("No se pudo crear la tarea");
    }
  };

  return (
    <div>
      <h2>Crear Nueva Tarea</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Crear</button>
      </form>
    </div>
  );
};

export default CreateTask;

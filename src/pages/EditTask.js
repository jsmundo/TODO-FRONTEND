import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../context/AppContext";

const EditTask = () => {
  const { store, actions } = useContext(Context);
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });

  useEffect(() => {
    const tarea = store.tasks.find((task) => task.id === parseInt(taskId));
    if (tarea) {
      setForm({ title: tarea.title, description: tarea.description });
    }
  }, [store.tasks, taskId]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = await actions.updateTask(parseInt(taskId), form);
    if (updated) {
      navigate("/tasks");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Editar Tareas</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Título</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="form-control"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success">
          Actualizar
        </button>
      </form>
    </div>
  );
};
export default EditTask;

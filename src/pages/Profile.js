import React, { useContext, useEffect } from "react";
import { Context } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  // cargar tareas al montar
  useEffect(() => {
    console.log("🧪 TOKEN desde store:", store.token);
    console.log("🧪 TOKEN desde localStorage:", localStorage.getItem("token"));
    if (!store.token) {
      actions.clearTasks();
      return;
    }

    // actions.clearTasks();
    actions.getTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.token]);

  const handleLoadTasks = async () => {
    const data = await actions.getTasks();
    if (data) {
      console.log("Tareas cargadas");
    }
  };

  const handleCreate = () => {
    navigate("/crear-tarea");
  };

  const handleUpdateTask = (taskId) => {
    navigate(`/editar-tareas/${taskId}`);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Seguro que querés eliminar esta tarea?");
    if (confirm) {
      const success = await actions.deleteTask(id);
      console.log("Resultado de deleteTask:", success);
      if (success) {
        alert("Tarea eliminada");
        handleLoadTasks(); // recarga después de borrar
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Hola, {store.user?.email || "Usuario"}</h2>
      <p>Estas son tus tareas protegidas 🚀</p>

      <button onClick={handleCreate} className="btn btn-primary my-3">
        Crear nueva tarea
      </button>

      {store.tasks.length === 0 ? (
        <p>No hay tareas disponibles.</p>
      ) : (
        <ul className="list-group">
          {store.tasks.map((task) => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{task.title}</strong> - {task.description}
              </div>
              <div>
                <button
                  onClick={() => handleUpdateTask(task.id)}
                  className="btn btn-warning btn-sm me-2"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="btn btn-danger btn-sm"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;

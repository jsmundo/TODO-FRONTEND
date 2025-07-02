import React, { useContext } from "react";
import { Context } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const TaskList = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  // cargo tareas de la API
  const handleLoadTasks = async () => {
    const data = await actions.getTasks();
    if (data) {
      console.log("Tareas cargadas");
    }
  };
  // formulario de CREAR TAREAS
  const handleCreate = () => {
    navigate("/crear-tarea");
  };
  // Actulizar tarea ESPESIFICA
  const handleUpdateTask = (taskId) => {
    navigate(`/editar-tareas/${taskId}`);
    console.log(handleUpdateTask);
  };
  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Seguro que querés eliminar esta tarea?");
    if (confirm) {
      const success = await actions.deleteTask(id);
      console.log("Resultado de deleteTask:", success);
      if (success) {
        alert("Tarea eliminada");
        handleLoadTasks();
      }
    }
  };
  return (
    <div>
      <h1>Lista de Tareas</h1>
      <p>Bienvenido, aquí verás tus tareas protegidas 🚀</p>

      <button onClick={handleLoadTasks}>Obtener Tareas</button>
      <button onClick={handleCreate}>Crear Tareas</button>

      {store.tasks.length === 0 ? (
        <p>No hay tareas disponibles.</p>
      ) : (
        <ul>
          {store.tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong> - {task.description}{" "}
              <button onClick={() => handleUpdateTask(task.id)}>
                ✏️ Editar
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="btn btn-danger-sm me-2"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default TaskList;

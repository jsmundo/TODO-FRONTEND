import React, { useEffect, useState, useContext } from "react";
import { Context } from "../context/AppContext";

const TaskList = () => {
  const { actions } = useContext(Context);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarTareas = async () => {
      const data = await actions.getTasks();
      if (data) {
        setTasks(data);
      } else {
        setError("No se puedieron cragar las tareas");
      }
    };
    cargarTareas();
  }, [actions]);

  return (
    <div>
      <h1>Lista de Tareas</h1>
      <p>Bienvenido, aquí verás tus tareas protegidas 🚀</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task.titulo || task.nombre}</li>
        ))}
      </ul>
    </div>
  );
};
export default TaskList;

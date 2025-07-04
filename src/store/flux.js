const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      tasks: [],
      user: null,
      token: localStorage.getItem("token") || null,
    },
    actions: {
      register: async (formData) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/register`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            }
          );
          const data = await response.json();
          if (response.ok) {
            return { success: true, message: "Registro exitoso" };
          } else {
            return {
              success: false,
              message: data.error || "Error desconocido",
            };
          }
        } catch (error) {
          console.error("Error en registro:", error);
          return { success: false, message: "Error en la conexión" };
        }
      },

      Login: async (credentials) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials),
            }
          );
          if (!response.ok) {
            throw new Error("Credenciales incorrectas");
          }
          const data = await response.json();
          // ✅ Guardar user y token
          setStore({
            user: { id: data.user_id, email: data.email },
            token: data.access_token,
            tasks: [], // Limpia tareas previas
          });
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          console.log("✅ Login exitoso:", data);
          // ✅ Cargar tareas inmediatamente
          await getActions().getTasks();
          return true;
        } catch (error) {
          console.error("❌ Error en login:", error);
          alert("Error al iniciar sesión");
          return false;
        }
      },

      refreshToken: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/refresh`,
            {
              method: "POST",
              headers: {
                Authorization:
                  "Bearer " + localStorage.getItem("refresh_token"),
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) throw new Error("No se pudo resfrescar el token");
          const data = await response.json();
          setStore({ token: data.access_token });
          localStorage.getItem("token", data.access_token);
          return true;
        } catch (error) {
          console.error("Error al refrescar token:", error);
        }
      },
      logout: () => {
        setStore({ user: null, token: null, tasks: [] });
        localStorage.clear();

        setTimeout(() => {
          console.log("🧼 Post-logout (100ms):");
          console.log("🧠 store.token:", getStore().token); //
          console.log("📦 localStorage token:", localStorage.getItem("token"));
        }, 100);
      },

      clearTasks: () => {
        console.log("🧹 Limpiando tareas...");
        setStore({ tasks: [] });
      },

      getTasks: async () => {
        const store = getStore();
        const token = store.token;
        if (!token) {
          console.warn("🚫 No hay token disponible para getTasks");
          return;
        }
        console.log("🔐 Token usado en getTasks:", token);
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/tareas`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            if (response.status === 401) {
              console.error("❌ Token inválido o expirado. Cerrando sesión.");
              getActions().logout();
            } else {
              console.error(
                "❌ Error HTTP al obtener tareas:",
                response.status
              );
            }
            return;
          }
          const data = await response.json();
          setStore({ tasks: data });
          return data;
        } catch (error) {
          console.error("❌ Error de red al obtener tareas:", error);
        }
      },

      createTask: async (tasksData) => {
        const store = getStore();
        console.log("Token usado para crear tarea:", store.token);

        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/tareas`,
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + store.token,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(tasksData),
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Detalles del error al crear la tarea:", errorData);
            if (errorData.msg === "Token has expired") {
              const refreshed = await getActions().refreshToken();
              if (refreshed) {
                return await getActions().createTask(tasksData);
              }
            }
            throw new Error("Error al crear la tarea");
          }
          const data = await response.json();
          setStore({ tasks: [...store.tasks, data] });
          return data;
        } catch (error) {
          console.error("Error al crear la tarea:", error);
          return null;
        }
      },

      updateTask: async (taskId, updatedData) => {
        const store = getStore();

        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/tareas/${taskId}`,
            {
              method: "PUT",
              headers: {
                Authorization: "Bearer " + store.token,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedData),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error al actualizar tarea:", errorData);

            if (errorData.msg === "Token has expired") {
              const refreshed = await getActions().refreshToken();
              if (refreshed) {
                // 🔁 Reintenta la actualización
                return await getActions().updateTask(taskId, updatedData);
              }
            }

            throw new Error("Error al actualizar la tarea");
          }

          const updatedTask = await response.json();
          // Actualiza el store local
          const updatedTasks = store.tasks.map((task) =>
            task.id === taskId ? updatedTask : task
          );
          setStore({ tasks: updatedTasks });
          return updatedTask;
        } catch (error) {
          console.error("❌ Error en updateTask:", error);
          return null;
        }
      },

      deleteTask: async (taskId) => {
        const store = getStore();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/tareas/${taskId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: "Bearer " + store.token,
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error al eliminar tarea:", errorData);

            if (errorData.msg === "Token has espired") {
              const refreshed = await getActions().refreshToken();
              if (refreshed) {
                return getActions().deleteTask(taskId);
              }
            }
            return false;
          }
          const updatedTask = store.tasks.filter((task) => task.id !== taskId);
          setStore({ tasks: updatedTask });
          return true;
        } catch (error) {
          console.error("Error en deletetask:", error);
          return false;
        }
      },

      resetPassword: async (token, newPassword) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/reset-password/${token}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ newPassword: newPassword }),
            }
          );
          if (!response.ok) {
            throw new Error("Error al cambiar la contraseña");
          }
          const data = await response.json();
          console.log("✅ Contraseña cambiada exitosamente:", data);
          return true;
        } catch (error) {
          console.error("Error en reset password:", error);
          alert("Error al cambiar la contraseña");
          return false;
        }
      },
    },
  };
};
export default getState;

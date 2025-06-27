const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
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
                "Content-Type": "application/json", // ✅ Corrección del error en el Content-Type
              },
              body: JSON.stringify(credentials),
            }
          );

          if (!response.ok) {
            throw new Error("Credenciales incorrectas"); // Manejo de errores
          }

          const data = await response.json();

          setStore({
            user: { username: data.username, id: data.user_id },
            token: data.access_token,
          });

          localStorage.setItem("token", data.access_token);
          console.log("✅ Login exitoso:", data);
          return true; // Indicar que el login fue exitoso
        } catch (error) {
          console.error("❌ Error en el login:", error);
          alert("Error al iniciar sesión");
          return false; // Indicar que el login falló
        }
      },
      logout: () => {
        setStore({ user: null, token: null });
        localStorage.removeItem("token");
      },

      getTasks: async () => {
        const store = getStore();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/tereas`,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer" + store.token,
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Error al cargar las tareas");
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error al obtener tereas:", error);
          return null;
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

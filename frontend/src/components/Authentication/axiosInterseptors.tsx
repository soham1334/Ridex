import axios from "axios"
const VITE_API_SERVER = import.meta.env.VITE_API_SERVER 

export const api = axios.create({
  baseURL: `${VITE_API_SERVER}`,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => {
    return response
  },

  async (error) => {
    if (error.response?.status === 401 && error.config?.url !== "/api/user/auth/refresh" && !error.config?._retry) {
      error.config._retry = true
      try {
        await api.post("/api/user/auth/refresh")

        return api(error.config)

      } catch (refreshError) {
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
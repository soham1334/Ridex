
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "./AuthContext"

function ProtectedRoute() {
  const { isLoggedIn ,authLoading} = useContext(AuthContext)
  const location = useLocation()


  if (authLoading) {
  return null;
}


  if (!isLoggedIn) {

console.log("REDIRECTING TO LOGIN")


    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute
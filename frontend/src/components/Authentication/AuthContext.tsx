import {useState, createContext, type ReactNode,useEffect} from 'react';
import { api } from './axiosInterseptors';



export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 
    const [authLoading ,setAuthLoading] = useState(true)


useEffect(() => {

  const checkAuth = async () => {

    console.log("AUTH CHECK START")

    try {

      const response = await api.post(
        "/api/user/auth/refresh"
      )

      

      setIsLoggedIn(true)

    } catch (error) {

      

      setIsLoggedIn(false)

    } finally {

      setAuthLoading(false)

    }

  }

  checkAuth()

}, [])

useEffect(() => {
  
}, [isLoggedIn, authLoading])

    return (
      <AuthContext.Provider value = {{ isLoggedIn, setIsLoggedIn, authLoading}}>
        {children}
      </AuthContext.Provider>
    )
}
  
import { Route,Routes } from "react-router-dom"
import BikeCard from "./components/Bike"
import CarCard from "./components/Car"
import { ToastContainer } from "react-toastify"


import Home from "./components/Home"
import CarDetails from "./components/CarDetails"
import BikeDetails from "./components/BikeDetails"
import AccountInformation from "./components/UserDropDown/AccountInformation"
import Settings from "./components/UserDropDown/Settings"
import Cart from "./components/Cart"
import Bookings from "./components/UserDropDown/MyBookings"
import ListedVehicles from "./components/UserDropDown/ListedVehicles"
import Earnings from "./components/UserDropDown/Earnings"
import Login from "./components/Authentication/Login"
import Signup from "./components/Authentication/Signup"
import Bookingform from "./components/BookingForm"
import {AuthProvider} from "./components/Authentication/AuthContext"
import ProtectedView from "./components/Authentication/ProtectedView"
import ListVehicle from "./components/ListVehicle"
import AdminDashboard from "./components/Admin/Adminpanel"
import AdminVehicles from "./components/Admin/Adminvehicles"
import AdminVehicleEdit from "./components/Admin/AdminVehicleEdit"

function App() {
  

  return (
    <>
    <AuthProvider>
    <ToastContainer/>
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />  
    <Route path = "/" element ={<Home/>}/>
    <Route path = "/user/bikes" element ={<BikeCard/>}/>
    <Route path = "/user/bikes/:model" element = {<BikeDetails/>}/>
    <Route path = "/user/cars" element ={<CarCard/>}/>
    <Route path = "/user/cars/:model" element = {<CarDetails/>}/>
    <Route path="/user/cart" element={<Cart />} />
    <Route element = {<ProtectedView/>}>
    <Route path = "/user/account" element ={<AccountInformation/>}/>
    <Route path="/user/settings" element={<Settings />} />
    <Route path="/user/list-vehicle" element={<ListVehicle />}/>
    <Route path="/user/booking/single/:vehicleType/:vehicleId" element={<Bookingform/>}/>
    <Route path="/user/booking/cart" element={<Bookingform/>}/>
    <Route path="/user/bookings" element={<Bookings />} />
    <Route path="/user/listed-vehicles" element={<ListedVehicles />} />
    <Route path="/user/earnings" element={<Earnings />} />
    <Route path = "/admin/dashboard" element = {<AdminDashboard/>}/>
    <Route path = "/admin/vehicles" element = {<AdminVehicles/>}/>
    <Route  path="/admin/vehicles/edit/:vehicleId" element ={<AdminVehicleEdit/>}/>
    
    </Route>
    
    

    </Routes>
    </AuthProvider>
    </>
  )
}

export default App

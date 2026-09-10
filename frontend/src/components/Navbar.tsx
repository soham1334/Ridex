import { NavLink, useNavigate,useLocation } from "react-router-dom"

import { useState, useContext } from "react"
import { AuthContext } from "./Authentication/AuthContext"
import { toast} from "react-toastify"
import { api } from "./Authentication/axiosInterseptors"




function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const { isLoggedIn ,setIsLoggedIn} = useContext(AuthContext)

  const handlesignout = async() =>{
    console.log("logout func called")
      try{
        const response = await api.post("/api/user/auth/logout")
        console.log(response)
        setIsLoggedIn(false);
      }catch(error){
        toast.error("Try Again !")
      }
     }

  return (
    <nav className="fixed top-5 left-1/2 z-50 w-[92%] max-w-6xl -translate-x-1/2">

      {/* 3D bottom layer */}
      <div
        className="
          absolute -bottom-3 left-4 right-4 -z-10
          h-8 rounded-3xl
          bg-black/30 blur-xl
        "
      />

      {/* Navbar */}
      <div
        className="
          relative flex items-center justify-between
          rounded-2xl
          border border-white/10
          bg-[#171717]/95
          px-5 py-3
          shadow-[0_12px_30px_rgba(0,0,0,0.35),0_4px_8px_rgba(0,0,0,0.25)]
          backdrop-blur-xl
        "
      >

        {/* TOP HIGHLIGHT */}
        <div
          className="
            pointer-events-none
            absolute left-6 right-6 top-0
            h-px
            bg-linear-to-r
            from-transparent
            via-orange-400/70
            to-transparent
          "
        />

        {/* LEFT SIDE */}
        <div className="flex items-center gap-1">

          {/* LOGO / BRAND */}
          <div className="mr-5 flex items-center gap-2">

            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl
                bg-linear-to-r
                from-orange-400
                to-orange-600
                shadow-[0_5px_15px_rgba(249,115,22,0.35)]
              "
            >
              <span className="text-lg font-black text-white">
                R
              </span>
            </div>

            <span className="text-lg font-bold tracking-tight text-white">
              Ride<span className="text-orange-400">X</span>
            </span>

          </div>

          {/* HOME */}
          <NavLink
            to="/"
            className="
              group relative flex items-center gap-2
              rounded-xl px-5 py-3
              text-gray-300
              transition-all duration-200
              hover:-translate-y-1
              hover:bg-orange-500
              hover:text-white
              hover:shadow-[0_8px_20px_rgba(249,115,22,0.35)]
              active:translate-y-0
            "
          >
            <svg
              className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 11.5L12 4l9 7.5" />
              <path d="M5 10v10h14V10" />
            </svg>

            <span className="font-medium">
              Home
            </span>
          </NavLink>

          {/* BIKE */}
          <NavLink
            to="/user/bikes"
            className="
              group flex items-center gap-2
              rounded-xl px-5 py-3
              text-gray-300
              transition-all duration-200
              hover:-translate-y-1
              hover:bg-orange-500
              hover:text-white
              hover:shadow-[0_8px_20px_rgba(249,115,22,0.35)]
              active:translate-y-0
            "
          >
            <svg
              className="
                h-5 w-5
                transition-transform duration-200
                group-hover:scale-110
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="5" cy="17" r="3" />
              <circle cx="19" cy="17" r="3" />
              <path d="M5 17l4-7h4l3 7" />
              <path d="M9 10l-2-3h3" />
              <path d="M13 10h4l2 7" />
            </svg>

            <span className="font-medium">
              Bike
            </span>
          </NavLink>

          {/* CAR */}
          <NavLink
            to="/user/cars"
            className="
              group flex items-center gap-2
              rounded-xl px-5 py-3
              text-gray-300
              transition-all duration-200
              hover:-translate-y-1
              hover:bg-orange-500
              hover:text-white
              hover:shadow-[0_8px_20px_rgba(249,115,22,0.35)]
              active:translate-y-0
            "
          >
            <svg
              className="
                h-5 w-5
                transition-transform duration-200
                group-hover:scale-110
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 17h14" />
              <path d="M6 17H4v-5l2-1 2-5h8l2 5 2 1v5h-2" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
              <path d="M8 11h8" />
            </svg>

            <span className="font-medium">
              Car
            </span>
          </NavLink>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* CART */}
          <button
            onClick={() => navigate("/user/cart")}
            className="
              group relative
              flex h-12 w-12
              items-center justify-center
              rounded-xl
              border border-white/10
              bg-white/5
              text-gray-300
              shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]
              transition-all duration-200
              hover:-translate-y-1
              hover:border-orange-400/30
              hover:bg-orange-500/10
              hover:text-orange-400
              hover:shadow-[0_8px_20px_rgba(249,115,22,0.15)]
              active:translate-y-0
            "
          >
            <svg
              className="
                h-5 w-5
                transition-transform duration-200
                group-hover:scale-110
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 5h2l2 10h9l2-7H7" />
              <circle cx="10" cy="19" r="1.5" />
              <circle cx="17" cy="19" r="1.5" />
            </svg>
          </button>

          {/* =================================================
              LOGGED IN
          ================================================= */}

          {isLoggedIn ? (

            /* USER + DROPDOWN */
            <div className="relative">

              {/* USER BUTTON */}
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="
                  group flex items-center gap-3
                  rounded-xl
                  border border-orange-400/20
                  bg-linear-to-r
                  from-orange-400/15
                  to-orange-600/5
                  px-4 py-2.5
                  text-white
                  shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_6px_15px_rgba(0,0,0,0.3)]
                  transition-all duration-200
                  hover:-translate-y-1
                  hover:border-orange-400/40
                  hover:bg-orange-500/15
                  hover:shadow-[0_10px_25px_rgba(249,115,22,0.18)]
                  active:translate-y-0
                "
              >

                {/* PERSON ICON */}
                <div
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-full
                    bg-linear-to-r
                    from-orange-400
                    to-orange-600
                    shadow-[0_4px_12px_rgba(249,115,22,0.4)]
                    transition-transform duration-200
                    group-hover:scale-110
                  "
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5 20c.8-4 3.2-6 7-6s6.2 2 7 6" />
                  </svg>
                </div>

                <span className="font-semibold">
                  User
                </span>

                {/* DROPDOWN ARROW */}
                <svg
                  className={`
                    h-4 w-4
                    text-gray-400
                    transition-transform duration-200
                    ${userMenuOpen ? "rotate-180" : ""}
                  `}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>

              </button>

              {/* USER DROPDOWN */}
              {userMenuOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[calc(100%+12px)]
                    z-50
                    w-72
                    overflow-hidden
                    rounded-2xl
                    border border-gray-200
                    bg-white
                    shadow-[0_20px_50px_rgba(0,0,0,0.2)]
                  "
                >

                  {/* PROFILE HEADER */}
                  <div
                    className="
                      border-b border-gray-100
                      bg-linear-to-r
                      from-orange-50
                      to-white
                      px-5 py-4
                    "
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className="
                          flex h-11 w-11
                          items-center justify-center
                          rounded-full
                          bg-linear-to-r
                          from-orange-400
                          to-orange-600
                          text-lg
                          font-bold
                          text-white
                          shadow-[0_4px_12px_rgba(249,115,22,0.25)]
                        "
                      >
                        U
                      </div>

                      <div>

                        <p className="font-bold text-gray-900">
                          User
                        </p>

                        <p className="mt-0.5 text-xs text-gray-400">
                          user@ridex.com
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* MENU ITEMS */}
                  <div className="p-2">

                    {/* ACCOUNT */}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        navigate("/user/account")
                      }}
                      className="
                        flex w-full items-center gap-3
                        rounded-xl
                        px-3 py-3
                        text-left
                        text-sm font-medium
                        text-gray-700
                        transition-all duration-150
                        hover:bg-orange-50
                        hover:text-orange-500
                      "
                    >
                      <span className="text-lg">👤</span>
                      <span>Account Information</span>
                    </button>

                    {/* BOOKINGS */}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        navigate("/user/bookings")
                      }}
                      className="
                        flex w-full items-center gap-3
                        rounded-xl
                        px-3 py-3
                        text-left
                        text-sm font-medium
                        text-gray-700
                        transition-all duration-150
                        hover:bg-orange-50
                        hover:text-orange-500
                      "
                    >
                      <span className="text-lg">📅</span>
                      <span>My Bookings</span>
                    </button>

                    {/* LISTED VEHICLES */}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        navigate("/user/listed-vehicles")
                      }}
                      className="
                        flex w-full items-center gap-3
                        rounded-xl
                        px-3 py-3
                        text-left
                        text-sm font-medium
                        text-gray-700
                        transition-all duration-150
                        hover:bg-orange-50
                        hover:text-orange-500
                      "
                    >
                      <span className="text-lg">🚗</span>
                      <span>Listed Vehicles</span>
                    </button>

                    {/* EARNINGS */}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        navigate("/user/earnings")
                      }}
                      className="
                        flex w-full items-center gap-3
                        rounded-xl
                        px-3 py-3
                        text-left
                        text-sm font-medium
                        text-gray-700
                        transition-all duration-150
                        hover:bg-orange-50
                        hover:text-orange-500
                      "
                    >
                      <span className="text-lg">₹</span>
                      <span>Earnings</span>
                    </button>

                    {/* DIVIDER */}
                    <div className="my-2 border-t border-gray-100" />

                    {/* SETTINGS */}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        navigate("/user/settings")
                      }}
                      className="
                        flex w-full items-center gap-3
                        rounded-xl
                        px-3 py-3
                        text-left
                        text-sm font-medium
                        text-gray-700
                        transition-all duration-150
                        hover:bg-gray-100
                      "
                    >
                      <span className="text-lg">⚙️</span>
                      <span>Settings</span>
                    </button>

                    {/* SIGN OUT */}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)

                        handlesignout()
                      }}
                      className="
                        flex w-full items-center gap-3
                        rounded-xl
                        px-3 py-3
                        text-left
                        text-sm font-semibold
                        text-red-500
                        transition-all duration-150
                        hover:bg-red-50
                      "
                    >
                      <span className="text-lg">↪</span>
                      <span>Sign Out</span>
                    </button>

                  </div>

                </div>
              )}

            </div>

          ) : (

            /* =================================================
               LOGGED OUT
            ================================================= */

            <div className="flex items-center gap-2">

              <button
                onClick={() => navigate("/login", {
                                                  state: {
                                                          from: location
                                                         }
                                                  })}
                className="
                  rounded-xl
                  border border-white/10
                  bg-white/5
                  px-5 py-2.5
                  text-sm font-bold
                  text-gray-200
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:border-orange-400/30
                  hover:bg-orange-500/10
                  hover:text-orange-400
                "
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="
                  rounded-xl
                  bg-orange-500
                  px-5 py-2.5
                  text-sm font-bold
                  text-white
                  shadow-[0_6px_15px_rgba(249,115,22,0.25)]
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-orange-600
                  hover:shadow-[0_8px_20px_rgba(249,115,22,0.35)]
                "
              >
                Sign Up
              </button>

            </div>

          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar
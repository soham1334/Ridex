import { useState, useContext } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { AuthContext } from "./AuthContext"
import { api } from "./axiosInterseptors"


function Login() {

  const navigate = useNavigate()
  const location = useLocation()

  const { setIsLoggedIn } = useContext(AuthContext)

  const [showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [errors, setErrors] = useState<Record<string, string>>({})

  const [isSubmitting, setIsSubmitting] = useState(false)


  // ==========================================
  // HANDLE EMAIL CHANGE
  // ==========================================

  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setEmail(e.target.value)

    if (errors.email) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated.email
        return updated
      })
    }

    if (errors.general) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated.general
        return updated
      })
    }
  }


  // ==========================================
  // HANDLE PASSWORD CHANGE
  // ==========================================

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setPassword(e.target.value)

    if (errors.password) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated.password
        return updated
      })
    }

    if (errors.general) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated.general
        return updated
      })
    }
  }


  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {

    const newErrors: Record<string, string> = {}


    // EMAIL

    if (!email.trim()) {

      newErrors.email =
        "Please enter your email address."

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {

      newErrors.email =
        "Please enter a valid email address."

    }


    // PASSWORD

    if (!password) {

      newErrors.password =
        "Please enter your password."

    } else if (password.length < 8) {

      newErrors.password =
        "Password must be at least 8 characters."

    }


    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }


  // ==========================================
  // FORM SUBMIT
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault()


    // STOP SUBMISSION IF VALIDATION FAILS

    if (!validateForm()) {
      return
    }


    setIsSubmitting(true)


    try {

      // ==========================================
      // LOGIN API
      // ==========================================

      const response = await api.post("/api/user/auth/login",{
        email,
        password
      })
      // ==========================================
      // AFTER SUCCESSFUL LOGIN
      // ==========================================
      console.log(response.data) 
      setIsLoggedIn(true)


      const from = response.data.user.role === 'admin'? "/admin/dashboard" :location.state?.from || "/"


      navigate(from, {
        replace: true,
      })


    } catch (error:any) {

      console.error("Login failed:", error.response.data)

      setErrors({
        general:
          "Invalid email or password. Please try again.",
      })

    } finally {

      setIsSubmitting(false)

    }
  }


  return (

    <main className="min-h-screen bg-[#f5f5f0]">

      <div className="grid min-h-screen lg:grid-cols-2">


        {/* ==========================================
            LEFT BRAND SECTION
        ========================================== */}

        <section className="relative hidden overflow-hidden bg-[#171717] lg:flex">

          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />


          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">


            {/* LOGO */}

            <Link
              to="/"
              className="flex w-fit items-center gap-3"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-r from-orange-400 to-orange-600 shadow-[0_6px_18px_rgba(249,115,22,0.35)]">

                <span className="text-lg font-black text-white">
                  R
                </span>

              </div>

              <span className="text-xl font-black tracking-tight text-white">

                Ride<span className="text-orange-400">
                  X
                </span>

              </span>

            </Link>


            {/* MESSAGE */}

            <div className="max-w-lg">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">

                <span className="h-2 w-2 rounded-full bg-orange-400" />

                <span className="text-xs font-semibold text-gray-300">
                  Welcome back to RideX
                </span>

              </div>


              <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-white xl:text-6xl">

                Your journey

                <br />

                <span className="text-orange-400">
                  starts here.
                </span>

              </h1>


              <p className="mt-7 max-w-md text-base leading-7 text-gray-400">

                Sign in to manage your bookings, rent vehicles,
                list your own ride, and continue your journey with RideX.

              </p>


              {/* BENEFITS */}

              <div className="mt-10 grid grid-cols-2 gap-4">

                <Benefit
                  number="01"
                  title="Rent"
                  text="Find your perfect ride"
                />

                <Benefit
                  number="02"
                  title="Host"
                  text="List your own vehicle"
                />

                <Benefit
                  number="03"
                  title="Earn"
                  text="Make money from your vehicle"
                />

                <Benefit
                  number="04"
                  title="Explore"
                  text="Go wherever you want"
                />

              </div>

            </div>


            <p className="text-xs text-gray-600">
              © 2026 RideX. All rights reserved.
            </p>

          </div>

        </section>


        {/* ==========================================
            LOGIN SECTION
        ========================================== */}

        <section className="flex min-h-screen items-center justify-center px-6 py-10">

          <div className="w-full max-w-md">


            {/* MOBILE LOGO */}

            <Link
              to="/"
              className="mb-8 flex items-center justify-center gap-2 lg:hidden"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-orange-400 to-orange-600 shadow-[0_5px_15px_rgba(249,115,22,0.3)]">

                <span className="font-black text-white">
                  R
                </span>

              </div>

              <span className="text-xl font-black text-gray-900">

                Ride<span className="text-orange-500">
                  X
                </span>

              </span>

            </Link>


            {/* HEADER */}

            <div className="mb-7">

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
                Welcome back
              </p>

              <h2 className="text-4xl font-black tracking-tight text-gray-900">
                Sign in to <span className="text-orange-500">
                  RideX
                </span>
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Access your bookings, vehicles, and account.
              </p>

            </div>


            {/* ==========================================
                LOGIN FORM
            ========================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >


              {/* EMAIL */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email address
                </label>


                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  className={`
                    w-full rounded-xl
                    border
                    ${
                      errors.email
                        ? "border-red-400 focus:border-red-400 focus:ring-red-500/10"
                        : "border-gray-200 focus:border-orange-400 focus:ring-orange-500/10"
                    }
                    bg-white
                    px-4 py-3.5
                    text-sm
                    outline-none
                    transition
                    placeholder:text-gray-400
                    hover:border-gray-300
                    focus:ring-4
                  `}
                />


                {errors.email && (

                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.email}
                  </p>

                )}

              </div>


              {/* PASSWORD */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>


                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    className={`
                      w-full rounded-xl
                      border
                      ${
                        errors.password
                          ? "border-red-400 focus:border-red-400 focus:ring-red-500/10"
                          : "border-gray-200 focus:border-orange-400 focus:ring-orange-500/10"
                      }
                      bg-white
                      px-4 py-3.5 pr-12
                      text-sm
                      outline-none
                      transition
                      placeholder:text-gray-400
                      hover:border-gray-300
                      focus:ring-4
                    `}
                  />


                  {/* SHOW / HIDE */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="
                      absolute right-3 top-1/2
                      -translate-y-1/2
                      rounded-lg p-2
                      text-gray-400
                      hover:bg-gray-100
                      hover:text-gray-700
                    "
                  >

                    {showPassword
                      ? "◉"
                      : "○"}

                  </button>

                </div>


                {errors.password && (

                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.password}
                  </p>

                )}

              </div>


              {/* FORGOT PASSWORD */}

              <div className="flex justify-end">

                <button
                  type="button"
                  className="
                    text-sm font-semibold
                    text-orange-500
                    transition
                    hover:text-orange-600
                  "
                >
                  Forgot password?
                </button>

              </div>


              {/* GENERAL ERROR */}

              {errors.general && (

                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                  <p className="text-sm font-medium text-red-600">
                    {errors.general}
                  </p>

                </div>

              )}


              {/* SIGN IN BUTTON */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  mt-2
                  w-full rounded-xl
                  bg-orange-500
                  py-3.5
                  text-sm font-black
                  text-white
                  shadow-[0_8px_20px_rgba(249,115,22,0.25)]
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-orange-600
                  hover:shadow-[0_12px_25px_rgba(249,115,22,0.32)]
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >

                {isSubmitting ? (

                  <span className="flex items-center justify-center gap-2">

                    <span
                      className="
                        h-4 w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/40
                        border-t-white
                      "
                    />

                    Signing in...

                  </span>

                ) : (

                  "Sign In"

                )}

              </button>

            </form>


            {/* ==========================================
                DIVIDER
            ========================================== */}

            <div className="my-6 flex items-center gap-4">

              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs font-medium text-gray-400">
                OR
              </span>

              <div className="h-px flex-1 bg-gray-200" />

            </div>


            {/* ==========================================
                GOOGLE
            ========================================== */}

            <button
              type="button"
              className="
                flex w-full
                items-center justify-center gap-3
                rounded-xl
                border border-gray-200
                bg-white
                py-3.5
                text-sm font-bold
                text-gray-700
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:border-gray-300
                hover:shadow-md
              "
            >

              <span className="text-lg font-black">
                G
              </span>

              Continue with Google

            </button>


            {/* ==========================================
                SIGN UP
            ========================================== */}

            <p className="mt-7 text-center text-sm text-gray-500">

              Don't have an account?

              <Link
                to="/signup"
                state={{
                  from: location.state?.from
                }}
                className="
                  ml-1
                  font-bold
                  text-orange-500
                  hover:text-orange-600
                "
              >
                Create one
              </Link>

            </p>

          </div>

        </section>

      </div>

    </main>
  )
}


// ==========================================
// BENEFIT COMPONENT
// ==========================================

function Benefit({
  number,
  title,
  text,
}: {
  number: string
  title: string
  text: string
}) {

  return (

    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

      <p className="text-xs font-bold text-orange-400">
        {number}
      </p>

      <p className="mt-2 text-sm font-bold text-white">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-gray-500">
        {text}
      </p>

    </div>

  )
}


export default Login
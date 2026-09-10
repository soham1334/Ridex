import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { api } from "./axiosInterseptors"


function Signup() {
  const navigate = useNavigate()
  const location = useLocation()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // ==========================================
  // HANDLE INPUT CHANGES
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Remove error when user fixes the field
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // NAME
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your full name."
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters."
    }

    // EMAIL
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address."
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address."
    }

    // PHONE
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number."
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone =
        "Phone number must contain exactly 10 digits."
    }

    // PASSWORD
    if (!formData.password) {
      newErrors.password = "Please create a password."
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters."
    }

    // CONFIRM PASSWORD
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password."
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match."
    }

    // TERMS
    if (!formData.terms) {
      newErrors.terms =
        "You must agree to the Terms of Service and Privacy Policy."
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

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
        const user = {"name":formData.name,"email":formData.email,"phone":formData.phone,"password":formData.password}
       
        const response = await api.post("api/user/auth/signup",user) 
      
        console.log(response);

      setIsSuccess(true)

    } catch (error:any) {
      console.error(error)

      setErrors({
        general:
          error.response.data.message
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
                Ride<span className="text-orange-400">X</span>
              </span>

            </Link>


            {/* MESSAGE */}

            <div className="max-w-lg">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">

                <span className="h-2 w-2 rounded-full bg-orange-400" />

                <span className="text-xs font-semibold text-gray-300">
                  Join the RideX community
                </span>

              </div>


              <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-white xl:text-6xl">

                Your next

                <br />

                <span className="text-orange-400">
                  adventure awaits.
                </span>

              </h1>


              <p className="mt-7 max-w-md text-base leading-7 text-gray-400">

                Create your RideX account and discover a simpler
                way to rent cars and bikes whenever you need them.

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
            SIGNUP SECTION
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
                Ride<span className="text-orange-500">X</span>
              </span>

            </Link>


            {/* HEADER */}

            <div className="mb-7">

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
                Get started
              </p>

              <h2 className="text-4xl font-black tracking-tight text-gray-900">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Join RideX and start renting or listing vehicles today.
              </p>

            </div>


            {/* ==========================================
                SUCCESS SCREEN
            ========================================== */}

            {isSuccess ? (

              <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">

                {/* SUCCESS ICON */}

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">

                  <span className="text-3xl text-green-500">
                    ✓
                  </span>

                </div>


                <h3 className="mt-5 text-2xl font-black text-gray-900">
                  Account Created!
                </h3>


                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">

                  Your RideX account has been created successfully.
                  You can now sign in and start your journey.

                </p>


                {/* CONTINUE TO LOGIN */}

                <button
                  type="button"
                  onClick={() => navigate("/login", {
  state: {
    from: location.state?.from
  }
})}
                  className="
                    mt-7
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
                  "
                >
                  Continue to Sign In
                </button>


                <p className="mt-5 text-sm text-gray-500">

                  Already have an account?

                  <Link
                    to="/login"
                    className="ml-1 font-bold text-orange-500 hover:text-orange-600"
                  >
                    Sign in
                  </Link>

                </p>

              </div>

            ) : (

              /* ==========================================
                  FORM
              ========================================== */

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* NAME */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`
                      w-full rounded-xl
                      border
                      ${errors.name
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

                  {errors.name && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.name}
                    </p>
                  )}

                </div>


                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`
                      w-full rounded-xl
                      border
                      ${errors.email
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


                {/* PHONE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98765 43210"
                    className={`
                      w-full rounded-xl
                      border
                      ${errors.phone
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

                  {errors.phone && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.phone}
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
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className={`
                        w-full rounded-xl
                        border
                        ${errors.password
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

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
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
                      {showPassword ? "◉" : "○"}
                    </button>

                  </div>

                  {errors.password && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.password}
                    </p>
                  )}

                </div>


                {/* CONFIRM PASSWORD */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Confirm password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className={`
                        w-full rounded-xl
                        border
                        ${errors.confirmPassword
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

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
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
                      {showConfirmPassword ? "◉" : "○"}
                    </button>

                  </div>

                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}

                </div>


                {/* TERMS */}

                <div className="pt-2">

                  <div className="flex items-start gap-3">

                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={formData.terms}
                      onChange={handleChange}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-orange-500"
                    />

                    <label
                      htmlFor="terms"
                      className="text-xs leading-5 text-gray-500"
                    >

                      I agree to RideX's{" "}

                      <button
                        type="button"
                        className="font-semibold text-gray-700 hover:text-orange-500"
                      >
                        Terms of Service
                      </button>

                      {" "}and{" "}

                      <button
                        type="button"
                        className="font-semibold text-gray-700 hover:text-orange-500"
                      >
                        Privacy Policy
                      </button>

                      .

                    </label>

                  </div>

                  {errors.terms && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.terms}
                    </p>
                  )}

                </div>


                {/* GENERAL ERROR */}

                {errors.general && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                    <p className="text-sm font-medium text-red-600">
                      {errors.general}
                    </p>

                  </div>
                )}


                {/* CREATE ACCOUNT */}

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
                  {isSubmitting
                    ? "Creating Account..."
                    : "Create Account"}
                </button>

              </form>

            )}


            {/* ==========================================
                GOOGLE + LOGIN
                Hide after successful signup
            ========================================== */}

            {!isSuccess && (
              <>

                {/* DIVIDER */}

                <div className="my-6 flex items-center gap-4">

                  <div className="h-px flex-1 bg-gray-200" />

                  <span className="text-xs font-medium text-gray-400">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-gray-200" />

                </div>


                {/* GOOGLE */}

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


                {/* LOGIN */}

                <p className="mt-7 text-center text-sm text-gray-500">

                  Already have an account?

                  <Link
                    to="/login"
                    className="ml-1 font-bold text-orange-500 hover:text-orange-600"
                  >
                    Sign in
                  </Link>

                </p>

              </>
            )}

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


export default Signup
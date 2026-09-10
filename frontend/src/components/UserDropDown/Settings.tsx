import { useState,useContext } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../Navbar"
import React from "react"
import { api } from "../Authentication/axiosInterseptors"
import { AuthContext } from "../Authentication/AuthContext"


function Settings() {

  const navigate = useNavigate()
  const {setIsLoggedIn} = useContext(AuthContext)
  // ============================================================
  // TOGGLE STATES
  // ============================================================

  const [bookingUpdates, setBookingUpdates] = useState(true)
  const [promotionalOffers, setPromotionalOffers] = useState(false)
  const [vehicleReminders, setVehicleReminders] = useState(true)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)


  // ============================================================
  // DELETE ACCOUNT STATES
  // ============================================================

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [deleteEmail, setDeleteEmail] = useState("")
  const [deletePassword, setDeletePassword] = useState("")

  const [deleteError, setDeleteError] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)


  // ============================================================
  // OPEN DELETE MODAL
  // ============================================================

  const openDeleteModal = () => {

    setDeleteEmail("")
    setDeletePassword("")
    setDeleteError("")
    setShowDeleteModal(true)

  }


  // ============================================================
  // CLOSE DELETE MODAL
  // ============================================================

  const closeDeleteModal = () => {

    if (deleteLoading) return

    setShowDeleteModal(false)
    setDeleteEmail("")
    setDeletePassword("")
    setDeleteError("")

  }


  // ============================================================
  // DELETE ACCOUNT
  // ============================================================

  const handleDeleteAccount = async (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    setDeleteError("")


    // ==========================================================
    // BASIC VALIDATION
    // ==========================================================

    if (!deleteEmail.trim()) {

      setDeleteError(
        "Please enter your email address."
      )

      return

    }


    if (!deletePassword) {

      setDeleteError(
        "Please enter your password."
      )

      return

    }


    try {

      setDeleteLoading(true)


      // ========================================================
      // DELETE ACCOUNT API
      // ========================================================
      
     
      const response = await api.patch(
        "/api/user/acc/delete",
        {
            email: deleteEmail,
            password: deletePassword,
          
        }
      )
      setIsLoggedIn(false)
     navigate("/")


      
      if (!response.data.success) {
        setDeleteError(
          response.data.message ||
          "Unable to delete account."
        )

        return
      }
      



      /*
       * After successful API deletion:
       *
       * 1. Clear authentication information if required.
       * 2. Close modal.
       * 3. Redirect user to home page.
       */

      setShowDeleteModal(false)

     


    } catch (error: any) {

      console.error(
        "Delete account error:",
        error
      )


      // ========================================================
      // API ERROR
      // ========================================================

      setDeleteError(
        error?.response?.data?.message ||
        "Incorrect email or password."
      )

    } finally {

      setDeleteLoading(false)

    }

  }


  return (

    <main className="min-h-screen overflow-x-hidden bg-[#f5f5f0]">

      <Navbar />


      <section className="px-4 pb-20 pt-32 sm:px-6">

        <div className="mx-auto w-full max-w-6xl">


          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="mb-8 sm:mb-10">

            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
              Preferences
            </p>

            <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Settings
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Customize your RideX experience.
            </p>

          </div>


          {/* ==================================================
              SETTINGS LAYOUT
          ================================================== */}

          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <div className="h-fit rounded-3xl border border-gray-200 bg-white p-3 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">


              <button className="flex w-full items-center gap-3 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-[0_6px_15px_rgba(249,115,22,0.25)]">

                <span>⚙</span>

                General

              </button>


              <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-orange-50 hover:text-orange-500">

                <span>🔒</span>

                Security

              </button>


              <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-orange-50 hover:text-orange-500">

                <span>🔔</span>

                Notifications

              </button>


              <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-orange-50 hover:text-orange-500">

                <span>💳</span>

                Payments

              </button>


              <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-orange-50 hover:text-orange-500">

                <span>⚠</span>

                Account

              </button>

            </div>


            {/* =================================================
                SETTINGS CONTENT
            ================================================= */}

            <div className="min-w-0 space-y-6">


              {/* =================================================
                  APPEARANCE
              ================================================= */}

              <SettingSection
                title="Appearance"
                description="Control how RideX looks for you."
              >

                <SettingRow
                  title="Theme"
                  description="Choose your preferred appearance."
                >

                  <select
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 outline-none transition focus:border-orange-400"
                    defaultValue="System Default"
                  >

                    <option>
                      System Default
                    </option>

                    <option>
                      Light
                    </option>

                    <option>
                      Dark
                    </option>

                  </select>

                </SettingRow>

              </SettingSection>


              {/* =================================================
                  NOTIFICATIONS
              ================================================= */}

              <SettingSection
                title="Notifications"
                description="Choose which updates you want to receive."
              >

                <SettingRow
                  title="Booking Updates"
                  description="Receive updates about your bookings."
                >

                  <Toggle
                    enabled={bookingUpdates}
                    onChange={() =>
                      setBookingUpdates(
                        !bookingUpdates
                      )
                    }
                  />

                </SettingRow>


                <SettingRow
                  title="Promotional Offers"
                  description="Receive special offers and discounts."
                >

                  <Toggle
                    enabled={promotionalOffers}
                    onChange={() =>
                      setPromotionalOffers(
                        !promotionalOffers
                      )
                    }
                  />

                </SettingRow>


                <SettingRow
                  title="Vehicle Reminders"
                  description="Get reminders before your rental starts."
                >

                  <Toggle
                    enabled={vehicleReminders}
                    onChange={() =>
                      setVehicleReminders(
                        !vehicleReminders
                      )
                    }
                  />

                </SettingRow>

              </SettingSection>


              {/* =================================================
                  SECURITY
              ================================================= */}

              <SettingSection
                title="Security"
                description="Keep your RideX account secure."
              >

                <SettingRow
                  title="Password"
                  description="Change your account password."
                >

                  <button
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500"
                  >

                    Change

                  </button>

                </SettingRow>


                <SettingRow
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security."
                >

                  <Toggle
                    enabled={twoFactorAuth}
                    onChange={() =>
                      setTwoFactorAuth(
                        !twoFactorAuth
                      )
                    }
                  />

                </SettingRow>

              </SettingSection>


              {/* =================================================
                  ACCOUNT
              ================================================= */}

              <SettingSection
                title="Account"
                description="Manage your RideX account."
              >

                <SettingRow
                  title="Delete Account"
                  description="Permanently delete your RideX account."
                >

                  <button
                    onClick={openDeleteModal}
                    className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:border-red-300"
                  >

                    Delete

                  </button>

                </SettingRow>

              </SettingSection>


            </div>

          </div>

        </div>

      </section>


      {/* ========================================================
          DELETE ACCOUNT MODAL
      ======================================================== */}

      {showDeleteModal && (

        <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">


          {/* ====================================================
              MODAL
          ==================================================== */}

          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">


            {/* ==================================================
                MODAL HEADER
            ================================================== */}

            <div className="border-b border-gray-100 px-6 py-5">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h2 className="text-xl font-bold text-gray-900">
                    Delete Account
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    This action cannot be undone.
                  </p>

                </div>


                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleteLoading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  ×

                </button>

              </div>

            </div>


            {/* ==================================================
                MODAL CONTENT
            ================================================== */}

            <form
              onSubmit={handleDeleteAccount}
              className="px-6 py-6"
            >


              {/* WARNING */}

              <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4">

                <p className="text-sm font-semibold text-red-600">
                  Are you sure you want to delete your account?
                </p>

                <p className="mt-1 text-xs leading-5 text-red-500">
                  Your account and associated information will be
                  permanently deleted.
                </p>

              </div>


              {/* EMAIL */}

              <div className="mb-4">

                <label
                  htmlFor="delete-email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >

                  Email Address

                </label>

                <input
                  id="delete-email"
                  type="email"
                  value={deleteEmail}
                  onChange={(e) => {
                    setDeleteEmail(e.target.value)
                    setDeleteError("")
                  }}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={deleteLoading}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                />

              </div>


              {/* PASSWORD */}

              <div className="mb-2">

                <label
                  htmlFor="delete-password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >

                  Password

                </label>

                <input
                  id="delete-password"
                  type="password"
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value)
                    setDeleteError("")
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={deleteLoading}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                />

              </div>


              {/* ERROR */}

              {deleteError && (

                <p className="mt-3 text-sm font-medium text-red-500">
                  {deleteError}
                </p>

              )}


              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleteLoading}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  disabled={deleteLoading}
                  className="rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {deleteLoading
                    ? "Deleting..."
                    : "Confirm Delete"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>

  )
}


/* ==============================================================
   SETTING SECTION
============================================================== */

function SettingSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {

  return (

    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] sm:p-7">


      <div className="mb-6">

        <h2 className="text-xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>

      </div>


      <div className="divide-y divide-gray-100">

        {children}

      </div>

    </div>

  )
}


/* ==============================================================
   SETTING ROW
============================================================== */

function SettingRow({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {

  return (

    <div className="flex items-center justify-between gap-6 py-5 first:pt-0 last:pb-0">


      <div className="min-w-0">

        <h3 className="text-sm font-bold text-gray-800">
          {title}
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>

      </div>


      <div className="shrink-0">
        {children}
      </div>


    </div>

  )
}


/* ==============================================================
   TOGGLE
============================================================== */

function Toggle({
  enabled = false,
  onChange,
}: {
  enabled?: boolean
  onChange?: () => void
}) {

  return (

    <button
      type="button"
      onClick={onChange}
      aria-pressed={enabled}
      className={`relative h-7 w-12 shrink-0 rounded-full p-1 transition-colors duration-200 ${
        enabled
          ? "bg-orange-500"
          : "bg-gray-200"
      }`}
    >

      <div
        className={`h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
          enabled
            ? "translate-x-5"
            : "translate-x-0"
        }`}
      />

    </button>

  )
}


export default Settings
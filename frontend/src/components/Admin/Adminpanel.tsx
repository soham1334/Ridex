import { useNavigate } from "react-router-dom"
import { api } from "../Authentication/axiosInterseptors"
import { useContext } from "react"
import { AuthContext } from "../Authentication/AuthContext"

function AdminDashboard() {

  const navigate = useNavigate()
 const {setIsLoggedIn} = useContext(AuthContext)

  /* ==============================================================
     LOGOUT
  ============================================================== */

  const handleLogout = async () => {

    try {

      await api.post("/api/user/auth/logout")

     setIsLoggedIn(false)
      navigate("/")

    } catch (error) {

      console.error("Logout failed:", error)

    }

  }


  return (

    <main className="min-h-screen overflow-x-hidden bg-[#f6f6f2]">


      {/* ==========================================================
          ADMIN HEADER
      ========================================================== */}

      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">


          {/* LOGO */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-900 text-lg font-black text-white shadow-sm">
              R
            </div>

            <div>

              <h1 className="text-lg font-black tracking-tight text-gray-900">
                RideX
              </h1>

              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                Administration
              </p>

            </div>

          </div>


          {/* RIGHT SIDE */}

          <div className="flex items-center gap-3">

            <div className="hidden rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-bold text-orange-500 sm:block">
              Administrator
            </div>


            <button
              type="button"
              onClick={handleLogout}
              className="group flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >

              <LogoutIcon />

              <span className="hidden sm:inline">
                Logout
              </span>

            </button>

          </div>

        </div>

      </header>


      {/* ==========================================================
          MAIN CONTENT
      ========================================================== */}

      <section className="px-4 pb-20 pt-8 sm:px-6 lg:px-8">

        <div className="mx-auto w-full max-w-7xl">


          {/* ======================================================
              WELCOME HEADER
          ====================================================== */}

          <div className="mb-8">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>

                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
                  Control Center
                </p>

                <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                  Admin Dashboard
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                  Manage vehicles, monitor platform activity and keep
                  RideX running smoothly from one place.
                </p>

              </div>


              {/* DASHBOARD STATUS */}

              <div className="flex items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm sm:self-auto">

                <span className="relative flex h-2.5 w-2.5">

                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />

                </span>

                <span className="text-xs font-semibold text-gray-600">
                  System operational
                </span>

              </div>

            </div>

          </div>


          {/* ======================================================
              STATISTICS
          ====================================================== */}

          <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


            <StatCard
              title="Total Vehicles"
              value="—"
              description="All listed vehicles"
              icon={<CarIcon />}
            />


            <StatCard
              title="Total Users"
              value="—"
              description="Registered users"
              icon={<UsersIcon />}
            />


            <StatCard
              title="Total Bookings"
              value="—"
              description="Platform bookings"
              icon={<CalendarIcon />}
            />


            <StatCard
              title="Pending Reviews"
              value="—"
              description="Require attention"
              icon={<AlertIcon />}
            />

          </div>


          {/* ======================================================
              QUICK ACTIONS
          ====================================================== */}

          <div className="mb-10">

            <SectionHeading
              title="Quick actions"
              description="Access the most important administration tools."
            />


            <div className="mt-5 grid gap-5 md:grid-cols-3">


              {/* VEHICLES */}

              <button
                type="button"
                onClick={() => navigate("/admin/vehicles")}
                className="group relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-6 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
              >

                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-50 transition duration-300 group-hover:scale-125" />


                <div className="relative">

                  <div className="mb-6 flex items-center justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                      <CarIcon />
                    </div>


                    <ArrowIcon />

                  </div>


                  <h3 className="text-lg font-bold text-gray-900 transition group-hover:text-orange-500">
                    Manage Vehicles
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    View all listed vehicles, inspect their details and
                    edit vehicle information.
                  </p>


                  <div className="mt-5 flex items-center gap-2 text-xs font-bold text-orange-500">

                    <span>
                      Open vehicle management
                    </span>

                    <ArrowIcon />

                  </div>

                </div>

              </button>


              {/* USERS */}

              <ComingSoonCard
                icon={<UsersIcon />}
                title="Manage Users"
                description="View registered users and manage account information."
              />


              {/* BOOKINGS */}

              <ComingSoonCard
                icon={<CalendarIcon />}
                title="Manage Bookings"
                description="Review bookings and manage rental activity."
              />

            </div>

          </div>


          {/* ======================================================
              VEHICLE MANAGEMENT SPOTLIGHT
          ====================================================== */}

          <div className="mb-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

            <div className="grid lg:grid-cols-[1.5fr_1fr]">


              {/* LEFT */}

              <div className="p-6 sm:p-8 lg:p-10">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-white">
                    <CarIcon />
                  </div>


                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
                      Available now
                    </p>

                    <h3 className="mt-1 text-2xl font-black tracking-tight text-gray-900">
                      Vehicle Management
                    </h3>

                  </div>

                </div>


                <p className="mt-5 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                  Manage every vehicle listed on RideX from a single
                  interface. Review vehicle information, rental rates,
                  owners and listing status.
                </p>


                <button
                  type="button"
                  onClick={() => navigate("/admin/vehicles")}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg"
                >

                  View all vehicles

                  <ArrowIcon />

                </button>

              </div>


              {/* RIGHT */}

              <div className="border-t border-gray-100 bg-[#fafaf7] p-6 sm:p-8 lg:border-l lg:border-t-0">

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                  What you can do
                </p>


                <div className="mt-5 space-y-4">


                  <FeatureRow
                    number="01"
                    title="View listings"
                    description="See all vehicles currently listed."
                  />


                  <FeatureRow
                    number="02"
                    title="Edit vehicles"
                    description="Update vehicle information and pricing."
                  />


                  <FeatureRow
                    number="03"
                    title="Monitor status"
                    description="Keep track of listing availability."
                  />

                </div>

              </div>

            </div>

          </div>


          {/* ======================================================
              PLATFORM STATUS
          ====================================================== */}

          <div>

            <SectionHeading
              title="Platform status"
              description="Current availability of administration modules."
            />


            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">


              <StatusCard
                title="Vehicle management"
                status="Available"
                active
              />


              <StatusCard
                title="User management"
                status="Coming soon"
              />


              <StatusCard
                title="Booking management"
                status="Coming soon"
              />

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}


/* ==============================================================
   SECTION HEADING
============================================================== */

function SectionHeading({
  title,
  description,
}: {
  title: string
  description: string
}) {

  return (

    <div>

      <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
        {title}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>

    </div>

  )
}


/* ==============================================================
   STAT CARD
============================================================== */

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {

  return (

    <div className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-orange-100 hover:shadow-[0_16px_35px_rgba(0,0,0,0.07)] sm:p-6">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight text-gray-900">
            {value}
          </p>

        </div>


        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 transition duration-300 group-hover:scale-105">
          {icon}
        </div>

      </div>


      <p className="mt-4 text-xs font-medium text-gray-400">
        {description}
      </p>

    </div>

  )
}


/* ==============================================================
   COMING SOON CARD
============================================================== */

function ComingSoonCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {

  return (

    <div className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(0,0,0,0.07)]">

      <div className="mb-6 flex items-center justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 transition duration-300 group-hover:bg-orange-50 group-hover:text-orange-500">
          {icon}
        </div>


        <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Coming soon
        </span>

      </div>


      <h3 className="text-lg font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {description}
      </p>

    </div>

  )
}


/* ==============================================================
   FEATURE ROW
============================================================== */

function FeatureRow({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {

  return (

    <div className="flex gap-4">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-black text-gray-400 shadow-sm">
        {number}
      </div>


      <div className="min-w-0">

        <h4 className="text-sm font-bold text-gray-800">
          {title}
        </h4>

        <p className="mt-0.5 text-xs leading-5 text-gray-500">
          {description}
        </p>

      </div>

    </div>

  )
}


/* ==============================================================
   STATUS CARD
============================================================== */

function StatusCard({
  title,
  status,
  active = false,
}: {
  title: string
  status: string
  active?: boolean
}) {

  return (

    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_5px_20px_rgba(0,0,0,0.03)]">

      <div className="flex items-center gap-3">

        <span
          className={`h-2.5 w-2.5 rounded-full ${
            active ? "bg-green-500" : "bg-gray-300"
          }`}
        />

        <span className="text-sm font-semibold text-gray-700">
          {title}
        </span>

      </div>


      <span
        className={`text-xs font-bold ${
          active ? "text-green-600" : "text-gray-400"
        }`}
      >
        {status}
      </span>

    </div>

  )
}


/* ==============================================================
   ICONS
============================================================== */

function CarIcon() {

  return (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="h-5 w-5"
    >

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.5 5.2 7.8A2 2 0 0 1 7.07 6.5h9.86a2 2 0 0 1 1.87 1.3L21 13.5M3 13.5v4a1 1 0 0 0 1 1h1.5M3 13.5h18M21 13.5v4a1 1 0 0 1-1 1h-1.5M6 18.5h12M7 18.5v1M17 18.5v1M6 13.5v-1.25a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1.25"
      />

    </svg>

  )
}


function UsersIcon() {

  return (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="h-5 w-5"
    >

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19a6 6 0 0 0-12 0M9 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM16 11a3 3 0 1 0 0-6M21 19a5 5 0 0 0-4.5-4.97"
      />

    </svg>

  )
}


function CalendarIcon() {

  return (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="h-5 w-5"
    >

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v3M17.25 3v3M3.75 9h16.5M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
      />

    </svg>

  )
}


function AlertIcon() {

  return (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="h-5 w-5"
    >

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.5M12 16.5h.01M10.29 3.86 2.82 17a2 2 0 0 0 1.74 3h14.88a2 2 0 0 0 1.74-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
      />

    </svg>

  )
}


function ArrowIcon() {

  return (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
    >

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M13 6l6 6-6 6"
      />

    </svg>

  )
}


function LogoutIcon() {

  return (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="h-4 w-4"
    >

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M18 15l3-3m0 0-3-3m3 3H9"
      />

    </svg>

  )
}


export default AdminDashboard
import { useEffect, useState } from "react"
import Navbar from "../Navbar"
import { api } from "../Authentication/axiosInterseptors"


interface IUser {
  _id: string
  name: string
  email: string
  phone: string
  role: "user" | "admin"
  drivingLicense?: string
  panNumber?: string
  createdAt: string
}


function AccountInformation() {

  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")


  // ============================================================
  // FETCH USER INFORMATION
  // ============================================================

  useEffect(() => {

    const fetchUserInfo = async () => {

      try {

        setLoading(true)
        setError("")


        // ======================================================
        // API CALL
        // ======================================================

        const response = await api.get(
          "/api/user/acc/info"
        )


        // ======================================================
        // EXPECTED RESPONSE:
        //
        // {
        //   user: {
        //     _id: "...",
        //     name: "...",
        //     email: "...",
        //     phone: "...",
        //     role: "user",
        //     drivingLicense: "...",
        //     panNumber: "...",
        //     createdAt: "..."
        //   }
        // }
        //
        // ======================================================
        console.log(response.data)
        setUser(response.data)

      } catch (err) {

        console.error(
          "Error fetching user information:",
          err
        )

        setError(
          "Unable to load account information."
        )

      } finally {

        setLoading(false)

      }

    }


    fetchUserInfo()

  }, [])


  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {

    return (

      <main className="min-h-screen overflow-x-hidden bg-[#f5f5f0]">

        <Navbar />

        <section className="px-4 pb-20 pt-32 sm:px-6">

          <div className="mx-auto w-full max-w-6xl">

            <div className="animate-pulse">

              {/* Header */}

              <div className="mb-3 h-4 w-28 rounded bg-gray-200" />

              <div className="mb-3 h-10 w-80 max-w-full rounded bg-gray-200" />

              <div className="mb-10 h-5 w-96 max-w-full rounded bg-gray-200" />


              {/* Profile */}

              <div className="mb-6 h-56 rounded-3xl bg-gray-200" />


              {/* Information cards */}

              <div className="grid gap-6 lg:grid-cols-2">

                <div className="h-64 rounded-3xl bg-gray-200" />

                <div className="h-64 rounded-3xl bg-gray-200" />

                <div className="h-64 rounded-3xl bg-gray-200" />

                <div className="h-64 rounded-3xl bg-gray-200" />

              </div>

            </div>

          </div>

        </section>

      </main>

    )

  }


  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error) {

    return (

      <main className="min-h-screen overflow-x-hidden bg-[#f5f5f0]">

        <Navbar />

        <section className="px-4 pb-20 pt-32 sm:px-6">

          <div className="mx-auto w-full max-w-6xl">

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">

              {error}

            </div>

          </div>

        </section>

      </main>

    )

  }


  // ============================================================
  // NO USER
  // ============================================================

  if (!user) {

    return (

      <main className="min-h-screen overflow-x-hidden bg-[#f5f5f0]">

        <Navbar />

        <section className="px-4 pb-20 pt-32 sm:px-6">

          <div className="mx-auto w-full max-w-6xl">

            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">

              No account information found.

            </div>

          </div>

        </section>

      </main>

    )

  }


  // ============================================================
  // USER DATA
  // ============================================================

  const fullName = user.name || "User"

  const firstLetter =
    fullName.charAt(0).toUpperCase() || "U"


  // ============================================================
  // MEMBER SINCE
  // Derived from createdAt
  // ============================================================

  const memberSince =
    new Date(user.createdAt).getFullYear()


  // ============================================================
  // VERIFICATION
  // ============================================================

  const hasDrivingLicense =
    Boolean(user.drivingLicense)

  const hasPanNumber =
    Boolean(user.panNumber)

  const isVerified =
    hasDrivingLicense && hasPanNumber


  // ============================================================
  // ACCOUNT CREATED DATE
  // ============================================================

  const accountCreatedDate =
    new Date(user.createdAt).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    )


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
              My Account
            </p>

            <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Account Information
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage your profile and personal information.
            </p>

          </div>


          {/* ==================================================
              PROFILE CARD
          ================================================== */}

          <div className="mb-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)]">


            {/* COVER */}

            <div className="h-24 bg-linear-to-r from-[#171717] via-[#252525] to-orange-500 sm:h-28" />


            {/* PROFILE CONTENT */}

            <div className="px-5 pb-7 sm:px-8 sm:pb-8">

              <div className="relative flex items-center">


                {/* AVATAR */}

                <div className="-mt-12 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-orange-500 text-2xl font-black text-white shadow-lg sm:h-24 sm:w-24 sm:text-3xl">

                  {firstLetter}

                </div>


                {/* USER INFORMATION */}

                 <div className="ml-4 min-w-0 sm:ml-5">
                 
                   <h2 className="wrap-break-word text-xl font-extrabold leading-tight tracking-tight text-[#111827] sm:text-2xl">
                     {fullName.toLocaleUpperCase()}
                   </h2>
                 
                   <div className="mt-1.5 flex items-center gap-2">
                     <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                 
                     <p className="text-xs font-medium tracking-wide text-gray-500 sm:text-sm">
                       Member since {memberSince}
                     </p>
                   </div>
                 
                 </div>


              </div>

            </div>

          </div>


          {/* ==================================================
              INFORMATION GRID
          ================================================== */}

          <div className="grid min-w-0 gap-6 lg:grid-cols-2">


            {/* =================================================
                CONTACT INFORMATION
            ================================================= */}

            <div className="min-w-0 rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] sm:p-7">


              <div className="mb-6">

                <h2 className="text-xl font-bold text-gray-900">
                  Contact Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your primary contact details.
                </p>

              </div>


              <div className="space-y-5">

                <InfoRow
                  label="Email Address"
                  value={user.email}
                />

                <InfoRow
                  label="Phone Number"
                  value={user.phone}
                />

              </div>

            </div>


            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <div className="min-w-0 rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] sm:p-7">


              <div className="mb-6">

                <h2 className="text-xl font-bold text-gray-900">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Basic information associated with your account.
                </p>

              </div>


              <div className="space-y-5">

                <InfoRow
                  label="Full Name"
                  value={user.name}
                />

                <InfoRow
                  label="Account Type"
                  value={
                    user.role === "admin"
                      ? "Administrator"
                      : "User"
                  }
                />

              </div>

            </div>


            {/* =================================================
                IDENTITY VERIFICATION
            ================================================= */}

            <div className="min-w-0 rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] sm:p-7">


              <div className="mb-6 flex items-start justify-between gap-4">

                <div className="min-w-0">

                  <h2 className="text-xl font-bold text-gray-900">
                    Identity Verification
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Your submitted identity documents.
                  </p>

                </div>


                {/* OVERALL STATUS */}

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                    isVerified
                      ? "bg-green-50 text-green-600"
                      : "bg-orange-50 text-orange-500"
                  }`}
                >

                  {isVerified
                    ? "Complete"
                    : "Pending"}

                </span>

              </div>


              <div className="space-y-4">


                {/* DRIVING LICENSE */}

                <VerificationRow
                  title="Driving License"
                  status={
                    hasDrivingLicense
                      ? "Submitted"
                      : "Not submitted"
                  }
                />


                {/* PAN NUMBER */}

                <VerificationRow
                  title="PAN Number"
                  status={
                    hasPanNumber
                      ? "Submitted"
                      : "Not submitted"
                  }
                />


              </div>


              {!isVerified && (

                <button
                  className="mt-6 w-full rounded-xl bg-[#171717] py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-orange-500"
                >

                  Complete Verification

                </button>

              )}

            </div>


            {/* =================================================
                ACCOUNT DETAILS
            ================================================= */}

            <div className="min-w-0 rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] sm:p-7">


              <div className="mb-6">

                <h2 className="text-xl font-bold text-gray-900">
                  Account Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Information about your account.
                </p>

              </div>


              <div className="space-y-5">

                <InfoRow
                  label="Account ID"
                  value={user._id}
                />

                <InfoRow
                  label="Role"
                  value={
                    user.role === "admin"
                      ? "Administrator"
                      : "User"
                  }
                />

                <InfoRow
                  label="Member Since"
                  value={accountCreatedDate}
                />

              </div>

            </div>


          </div>

        </div>

      </section>

    </main>

  )
}


/* ==============================================================
   INFO ROW
============================================================== */

function InfoRow({
  label,
  value,
}: {
  label: string
  value: string
}) {

  return (

    <div className="flex min-w-0 items-start justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">

      <span className="shrink-0 text-sm text-gray-500">
        {label}
      </span>

      <span className="min-w-0 break-all text-right text-sm font-semibold text-gray-800">
        {value}
      </span>

    </div>

  )
}


/* ==============================================================
   VERIFICATION ROW
============================================================== */

function VerificationRow({
  title,
  status,
}: {
  title: string
  status: string
}) {

  const submitted =
    status === "Submitted"


  return (

    <div className="flex min-w-0 items-center justify-between gap-4 rounded-xl bg-[#f7f7f3] px-4 py-3">

      <span className="text-sm font-semibold text-gray-700">
        {title}
      </span>

      <span
        className={`shrink-0 text-xs font-medium ${
          submitted
            ? "text-green-600"
            : "text-gray-400"
        }`}
      >

        {status}

      </span>

    </div>

  )
}


export default AccountInformation
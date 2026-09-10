import { useEffect, useMemo, useState ,useContext} from "react"
import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../Authentication/axiosInterseptors"
import { AuthContext } from "../Authentication/AuthContext"



/* ==============================================================
   TYPES
============================================================== */

type VehicleType = "car" | "bike"

type ListingFilter =
  | "all"
  | "listed"
  | "unlisted"

type VehicleTypeFilter =
  | "all"
  | "car"
  | "bike"

type SortOption =
  | "default"
  | "company"
  | "rentLow"
  | "rentHigh"
  | "rating"
  | "reviews"


interface IOwner {
  _id: string
  name?: string
  email?: string
}


interface IVehicle {

  _id: string

  vehicleType: VehicleType

  company: string

  model: string

  ownerId: string | IOwner

  vehicleNo: string

  images?: string[]

  rent: number

  rating: number

  reviews: number

  fuel: string

  transmission: string

  seats: number

  mileage: number

  age: number

  distanceCovered: number

  description: string

  isListed: boolean

  // Only available for bikes
  engine?: number
}




/* ==============================================================
   MAIN COMPONENT
============================================================== */

function AdminVehicles() {

  const navigate = useNavigate()
const {setIsLoggedIn} = useContext(AuthContext)

  /* ============================================================
     STATE
  ============================================================ */

  const [vehicles, setVehicles] =
    useState<IVehicle[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const [search, setSearch] =
    useState("")

  const [listingFilter, setListingFilter] =
    useState<"all" | "listed" | "unlisted">("all")

  const [typeFilter, setTypeFilter] =
    useState<"all" | "car" | "bike">("all")

  const [sortBy, setSortBy] =
    useState<SortOption>("default")

  const [selectedVehicle, setSelectedVehicle] =
    useState<IVehicle | null>(null)

  const [showLogoutModal, setShowLogoutModal] =
    useState(false)

  const [loggingOut, setLoggingOut] =
    useState(false)

  const [refreshing, setRefreshing] =
    useState(false)


  /* ============================================================
     FETCH VEHICLES
  ============================================================ */

  const fetchVehicles = async (
    showRefreshLoader = false
  ) => {

    try {

      if (showRefreshLoader) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError("")



        const response = await api.get(
          "/api/admin/vehicles"
        )

        console.log(response.data)

        setVehicles(response.data )


    } catch (err) {

      console.error(
        "Error fetching vehicles:",
        err
      )

      setError(
        "Unable to load vehicles. Please try again."
      )

    } finally {

      setLoading(false)
      setRefreshing(false)

    }

  }


  /* ============================================================
     INITIAL FETCH
  ============================================================ */

  useEffect(() => {

    fetchVehicles()

  }, [])


  /* ============================================================
     OWNER HELPERS
  ============================================================ */

  const getOwnerName = (
    ownerId: string | IOwner
  ) => {

    if (
      typeof ownerId === "object" &&
      ownerId !== null
    ) {
      return ownerId.name || "Unknown owner"
    }

    return ownerId
      ? `${ownerId.slice(0, 6)}...${ownerId.slice(-4)}`
      : "Unknown owner"

  }


  const getOwnerEmail = (
    ownerId: string | IOwner
  ) => {

    if (
      typeof ownerId === "object" &&
      ownerId !== null
    ) {
      return ownerId.email || "No email available"
    }

    return "Owner ID"

  }


  /* ============================================================
     FILTER + SORT
  ============================================================ */

  const filteredVehicles = useMemo(() => {

    const searchText =
      search.toLowerCase().trim()


    const result =
      vehicles.filter((vehicle) => {

        const ownerName =
          getOwnerName(vehicle.ownerId)

        const ownerEmail =
          getOwnerEmail(vehicle.ownerId)


        const matchesSearch =

          !searchText ||

          vehicle.company
            ?.toLowerCase()
            .includes(searchText) ||

          vehicle.model
            ?.toLowerCase()
            .includes(searchText) ||

          vehicle.vehicleNo
            ?.toLowerCase()
            .includes(searchText) ||

          vehicle.fuel
            ?.toLowerCase()
            .includes(searchText) ||

          vehicle.transmission
            ?.toLowerCase()
            .includes(searchText) ||

          ownerName
            ?.toLowerCase()
            .includes(searchText) ||

          ownerEmail
            ?.toLowerCase()
            .includes(searchText)


        const matchesListing =

          listingFilter === "all" ||

          (
            listingFilter === "listed" &&
            vehicle.isListed
          ) ||

          (
            listingFilter === "unlisted" &&
            !vehicle.isListed
          )


        const matchesType =

          typeFilter === "all" ||

          vehicle.vehicleType === typeFilter


        return (
          matchesSearch &&
          matchesListing &&
          matchesType
        )

      })


    /* ==========================================================
       SORT
    ========================================================== */

    return [...result].sort((a, b) => {

      if (sortBy === "company") {

        return (
          `${a.company} ${a.model}`
            .localeCompare(
              `${b.company} ${b.model}`
            )
        )

      }


      if (sortBy === "rentLow") {

        return a.rent - b.rent

      }


      if (sortBy === "rentHigh") {

        return b.rent - a.rent

      }


      if (sortBy === "rating") {

        return b.rating - a.rating

      }


      if (sortBy === "reviews") {

        return b.reviews - a.reviews

      }


      return 0

    })

  }, [
    vehicles,
    search,
    listingFilter,
    typeFilter,
    sortBy,
  ])


  /* ============================================================
     STATISTICS
  ============================================================ */

  const vehicleStats = useMemo(() => {

    return {

      total:
        vehicles.length,

      cars:
        vehicles.filter(
          vehicle =>
            vehicle.vehicleType === "car"
        ).length,

      bikes:
        vehicles.filter(
          vehicle =>
            vehicle.vehicleType === "bike"
        ).length,

      listed:
        vehicles.filter(
          vehicle =>
            vehicle.isListed
        ).length,

      unlisted:
        vehicles.filter(
          vehicle =>
            !vehicle.isListed
        ).length,

    }

  }, [vehicles])


  /* ============================================================
     RESET FILTERS
  ============================================================ */

  const resetFilters = () => {

    setSearch("")
    setListingFilter("all")
    setTypeFilter("all")
    setSortBy("default")

  }


  /* ============================================================
     LOGOUT
  ============================================================ */

  const handleLogout = async () => {

    if (loggingOut) return


    try {

      setLoggingOut(true)

     await api.post("/api/user/auth/logout")
     
      setIsLoggedIn(false)
      navigate("/")

    } catch (err) {

      console.error(
        "Logout failed:",
        err
      )

    } finally {

      setLoggingOut(false)
      setShowLogoutModal(false)

    }

  }


  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {

    return <LoadingScreen />

  }


  /* ============================================================
     ERROR
  ============================================================ */

  if (error) {

    return (

      <main className="min-h-screen bg-[#f6f6f2]">

        <AdminHeader
          onLogout={() =>
            setShowLogoutModal(true)
          }
        />


        <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <button
              onClick={() =>
                navigate("/admin/dashboard")
              }
              className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-orange-500"
            >

              <BackIcon />

              Back to Dashboard

            </button>


            <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500">

                  <AlertIcon />

                </div>


                <div>

                  <h2 className="font-bold text-red-700">
                    Unable to load vehicles
                  </h2>

                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>


                  <button
                    onClick={() =>
                      fetchVehicles()
                    }
                    className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
                  >
                    Try again
                  </button>

                </div>

              </div>

            </div>

          </div>

        </section>


        <LogoutModal
          open={showLogoutModal}
          loading={loggingOut}
          onCancel={() =>
            setShowLogoutModal(false)
          }
          onConfirm={handleLogout}
        />

      </main>

    )

  }


  /* ============================================================
     MAIN UI
  ============================================================ */

  return (

    <main className="min-h-screen overflow-x-hidden bg-[#f6f6f2]">


      {/* ========================================================
          HEADER
      ======================================================== */}

      <AdminHeader
        onLogout={() =>
          setShowLogoutModal(true)
        }
      />


      {/* ========================================================
          CONTENT
      ======================================================== */}

      <section className="px-4 pb-20 pt-8 sm:px-6 lg:px-8">

        <div className="mx-auto w-full max-w-7xl">


          {/* ======================================================
              BACK
          ====================================================== */}

          <button
            onClick={() =>
              navigate("/admin/dashboard")
            }
            className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 transition duration-200 hover:text-orange-500"
          >

            <BackIcon />

            Back to Dashboard

          </button>


          {/* ======================================================
              PAGE HEADER
          ====================================================== */}

          <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-500 sm:text-sm">
                Administration
              </p>


              <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                All Vehicles
              </h1>


              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Manage every car and bike listed on RideX
                from one centralized workspace.
              </p>

            </div>


            {/* HEADER ACTIONS */}

            <div className="flex flex-wrap gap-3">

              <button
                onClick={() =>
                  fetchVehicles(true)
                }
                disabled={refreshing}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <RefreshIcon
                  spinning={refreshing}
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}

              </button>


              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">

                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                <span className="text-xs font-bold text-gray-600">
                  {vehicleStats.total} vehicles
                </span>

              </div>

            </div>

          </div>


          {/* ======================================================
              STAT CARDS
          ====================================================== */}

          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">


            <VehicleStat
              label="Total Vehicles"
              value={vehicleStats.total}
              icon={<CarIcon />}
            />


            <VehicleStat
              label="Cars"
              value={vehicleStats.cars}
              icon={<CarIcon />}
              color="blue"
            />


            <VehicleStat
              label="Bikes"
              value={vehicleStats.bikes}
              icon={<BikeIcon />}
              color="orange"
            />


            <VehicleStat
              label="Listed"
              value={vehicleStats.listed}
              icon={<CheckIcon />}
              color="green"
            />


            <VehicleStat
              label="Unlisted"
              value={vehicleStats.unlisted}
              icon={<PauseIcon />}
              color="gray"
            />

          </div>


          {/* ======================================================
              SEARCH / FILTER BAR
          ====================================================== */}

          <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-5">

            <div className="flex flex-col gap-3 xl:flex-row">


              {/* SEARCH */}

              <div className="relative min-w-0 flex-1">

                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">

                  <SearchIcon />

                </div>


                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search company, model, vehicle number or owner..."
                  className="w-full rounded-2xl border border-gray-200 bg-[#fafaf7] py-3.5 pl-11 pr-10 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                />


                {search && (

                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  >

                    <CloseIcon />

                  </button>

                )}

              </div>


              {/* VEHICLE TYPE */}

              <div className="relative">

                <select
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(
                      e.target.value as VehicleTypeFilter
                    )
                  }
                  className="w-full appearance-none rounded-2xl border border-gray-200 bg-[#fafaf7] px-4 py-3.5 pr-10 text-sm font-semibold text-gray-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50 xl:w-40"
                >

                  <option value="all">
                    All Types
                  </option>

                  <option value="car">
                    Cars
                  </option>

                  <option value="bike">
                    Bikes
                  </option>

                </select>


                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">

                  <ChevronIcon />

                </div>

              </div>


              {/* LISTING */}

              <div className="relative">

                <select
                  value={listingFilter}
                  onChange={(e) =>
                    setListingFilter(
                      e.target.value as ListingFilter
                    )
                  }
                  className="w-full appearance-none rounded-2xl border border-gray-200 bg-[#fafaf7] px-4 py-3.5 pr-10 text-sm font-semibold text-gray-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50 xl:w-40"
                >

                  <option value="all">
                    All Listings
                  </option>

                  <option value="listed">
                    Listed
                  </option>

                  <option value="unlisted">
                    Unlisted
                  </option>

                </select>


                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">

                  <ChevronIcon />

                </div>

              </div>


              {/* SORT */}

              <div className="relative">

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as SortOption
                    )
                  }
                  className="w-full appearance-none rounded-2xl border border-gray-200 bg-[#fafaf7] px-4 py-3.5 pr-10 text-sm font-semibold text-gray-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50 xl:w-48"
                >

                  <option value="default">
                    Default order
                  </option>

                  <option value="company">
                    Company A–Z
                  </option>

                  <option value="rentLow">
                    Rent: Low to High
                  </option>

                  <option value="rentHigh">
                    Rent: High to Low
                  </option>

                  <option value="rating">
                    Highest Rating
                  </option>

                  <option value="reviews">
                    Most Reviews
                  </option>

                </select>


                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">

                  <ChevronIcon />

                </div>

              </div>


              {/* RESET */}

              {(search ||
                listingFilter !== "all" ||
                typeFilter !== "all" ||
                sortBy !== "default") && (

                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-bold text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500"
                >
                  Reset
                </button>

              )}

            </div>


            {/* FILTER INFO */}

            <div className="mt-4 flex flex-col justify-between gap-2 border-t border-gray-100 pt-4 text-xs sm:flex-row sm:items-center">

              <p className="text-gray-400">

                Showing{" "}

                <span className="font-bold text-gray-700">
                  {filteredVehicles.length}
                </span>{" "}

                of{" "}

                <span className="font-bold text-gray-700">
                  {vehicles.length}
                </span>{" "}

                vehicles

              </p>


              {search && (

                <p className="text-gray-400">

                  Search results for{" "}

                  <span className="font-semibold text-gray-700">
                    "{search}"
                  </span>

                </p>

              )}

            </div>

          </div>


          {/* ======================================================
              TABLE
          ====================================================== */}

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)]">


            {/* TABLE HEADER */}

            <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">

              <div>

                <h2 className="text-lg font-black tracking-tight text-gray-900">
                  Vehicle listings
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Review vehicle information and manage listings.
                </p>

              </div>


              <div className="flex items-center gap-2 rounded-xl bg-[#fafaf7] px-3 py-2">

                <span className="h-2 w-2 rounded-full bg-orange-500" />

                <span className="text-xs font-semibold text-gray-500">
                  Admin workspace
                </span>

              </div>

            </div>


            {/* MOBILE SCROLL */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px] border-collapse">

                <thead>

                  <tr className="border-b border-gray-100 bg-[#fafaf7]">

                    <TableHeader>
                      Vehicle
                    </TableHeader>

                    <TableHeader>
                      Owner
                    </TableHeader>

                    <TableHeader>
                      Vehicle No.
                    </TableHeader>

                    <TableHeader>
                      Specifications
                    </TableHeader>

                    <TableHeader>
                      Rent
                    </TableHeader>

                    <TableHeader>
                      Rating
                    </TableHeader>

                    <TableHeader>
                      Listing
                    </TableHeader>

                    <TableHeader align="right">
                      Action
                    </TableHeader>

                  </tr>

                </thead>


                <tbody className="divide-y divide-gray-100">

                  {filteredVehicles.length === 0 ? (

                    <tr>

                      <td
                        colSpan={8}
                        className="px-6 py-20 text-center"
                      >

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">

                          <CarIcon />

                        </div>


                        <h3 className="mt-5 text-base font-bold text-gray-900">
                          No vehicles found
                        </h3>


                        <p className="mt-1 text-sm text-gray-500">
                          Try changing your search or filters.
                        </p>


                        <button
                          onClick={resetFilters}
                          className="mt-5 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-orange-500"
                        >
                          Clear filters
                        </button>

                      </td>

                    </tr>

                  ) : (

                    filteredVehicles.map(
                      (vehicle) => (

                        <VehicleRow
                          key={vehicle._id}
                          vehicle={vehicle}

                          onEdit={() => {

                                navigate(`/admin/vehicles/edit/${vehicle._id}`, {
                                  state: {
                                    vehicle,
                                  },
                                })
                          }}

                          onView={() =>
                            setSelectedVehicle(
                              vehicle
                            )
                          }
                        />

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>


            {/* MOBILE HINT */}

            <div className="border-t border-gray-100 bg-[#fafaf7] px-4 py-2.5 text-center text-[11px] font-medium text-gray-400 sm:hidden">
              Swipe horizontally to view all vehicle details
            </div>

          </div>


          {/* FOOTER */}

          <div className="mt-6 flex flex-col justify-between gap-2 text-xs text-gray-400 sm:flex-row">

            <p>
              RideX Admin • Vehicle Management
            </p>

            <p>
              {filteredVehicles.length} vehicles displayed
            </p>

          </div>

        </div>

      </section>


      {/* ==========================================================
          VEHICLE DETAILS MODAL
      ========================================================== */}

      {selectedVehicle && (

        <VehicleDetailsModal
          vehicle={selectedVehicle}

          onClose={() =>
            setSelectedVehicle(null)
          }

          onEdit={() => {

            setSelectedVehicle(null)

            navigate(
              `/admin/vehicles/${selectedVehicle.vehicleType}/${selectedVehicle._id}/edit`
            )

          }}

        />

      )}


      {/* ==========================================================
          LOGOUT MODAL
      ========================================================== */}

      <LogoutModal
        open={showLogoutModal}
        loading={loggingOut}

        onCancel={() =>
          setShowLogoutModal(false)
        }

        onConfirm={handleLogout}
      />

    </main>

  )

}


/* ==============================================================
   ADMIN HEADER
============================================================== */

function AdminHeader({
  onLogout,
}: {
  onLogout: () => void
}) {

  return (

    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">


        {/* BRAND */}

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-lg font-black text-white shadow-sm">
            R
          </div>


          <div>

            <h1 className="text-lg font-black tracking-tight text-gray-900">
              RideX
            </h1>

            <p className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 sm:block">
              Admin Console
            </p>

          </div>

        </div>


        {/* RIGHT */}

        <div className="flex items-center gap-3">

          <div className="hidden items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 sm:flex">

            <span className="h-2 w-2 rounded-full bg-orange-500" />

            <span className="text-xs font-bold text-orange-600">
              Administrator
            </span>

          </div>


          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:px-4"
          >

            <LogoutIcon />

            <span>
              Logout
            </span>

          </button>

        </div>

      </div>

    </header>

  )

}


/* ==============================================================
   VEHICLE STAT
============================================================== */

function VehicleStat({
  label,
  value,
  icon,
  color = "gray",
}: {
  label: string
  value: number
  icon: ReactNode
  color?: "gray" | "green" | "blue" | "orange"
}) {

  const styles = {

    gray: {
      box: "bg-gray-100 text-gray-600",
      value: "text-gray-900",
    },

    green: {
      box: "bg-green-50 text-green-600",
      value: "text-green-700",
    },

    blue: {
      box: "bg-blue-50 text-blue-600",
      value: "text-blue-700",
    },

    orange: {
      box: "bg-orange-50 text-orange-500",
      value: "text-orange-600",
    },

  }


  return (

    <div className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_5px_20px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] sm:p-5">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${styles[color].box}`}
        >
          {icon}
        </div>


        <span className={`text-2xl font-black ${styles[color].value}`}>
          {value}
        </span>

      </div>


      <p className="mt-4 text-xs font-semibold text-gray-500">
        {label}
      </p>

    </div>

  )

}


/* ==============================================================
   TABLE HEADER
============================================================== */

function TableHeader({
  children,
  align = "left",
}: {
  children: ReactNode
  align?: "left" | "right"
}) {

  return (

    <th
      className={`px-5 py-4 text-${align} text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400`}
    >
      {children}
    </th>

  )

}


/* ==============================================================
   VEHICLE ROW
============================================================== */

function VehicleRow({
  vehicle,
  onEdit,
  onView,
}: {
  vehicle: IVehicle
  onEdit: () => void
  onView: () => void
}) {

  const vehicleName =
    `${vehicle.company} ${vehicle.model}`


  const image =
    vehicle.images?.[0]


  const ownerName =vehicle.ownerId === null?"Ridex"
    :typeof vehicle.ownerId === "object"
      ? vehicle.ownerId.name || "Unknown"
      : "Owner"


  const ownerEmail =vehicle.ownerId === null? "Ridex@gmail.com"
    :typeof vehicle.ownerId === "object"
      ? vehicle.ownerId.email || "—"
      : "Owner ID"


  return (

    <tr className="group transition duration-200 hover:bg-[#fffaf7]">


      {/* ========================================================
          VEHICLE
      ======================================================== */}

      <td className="px-5 py-5">

        <div className="flex items-center gap-4">

          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">

            {image ? (

              <img
                src={image}
                alt={vehicleName}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

            ) : (

              <div className="flex h-full w-full items-center justify-center text-gray-400">

                {vehicle.vehicleType === "car"
                  ? <CarIcon />
                  : <BikeIcon />
                }

              </div>

            )}


            <div className="absolute bottom-1.5 left-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] font-black uppercase text-gray-700 shadow-sm">
              {vehicle.vehicleType}
            </div>

          </div>


          <div className="min-w-0">

            <p className="truncate text-sm font-bold text-gray-900">
              {vehicleName}
            </p>


            <p className="mt-1 text-xs text-gray-400">
              {vehicle.fuel} • {vehicle.transmission}
            </p>

          </div>

        </div>

      </td>


      {/* ========================================================
          OWNER
      ======================================================== */}

      <td className="px-5 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">

            {ownerName
              .charAt(0)
              .toUpperCase()}

          </div>


          <div className="min-w-0">

            <p className="max-w-[150px] truncate text-sm font-semibold text-gray-800">
              {ownerName}
            </p>

            <p className="mt-0.5 max-w-[150px] truncate text-[11px] text-gray-400">
              {ownerEmail}
            </p>

          </div>

        </div>

      </td>


      {/* ========================================================
          VEHICLE NUMBER
      ======================================================== */}

      <td className="px-5 py-5">

        <span className="inline-flex rounded-lg bg-gray-100 px-3 py-1.5 text-[11px] font-black tracking-wide text-gray-600">
          {vehicle.vehicleNo}
        </span>

      </td>


      {/* ========================================================
          SPECIFICATIONS
      ======================================================== */}

      <td className="px-5 py-5">

        <div className="space-y-1">

          <p className="text-xs font-semibold text-gray-700">
            {vehicle.seats} seats
            <span className="mx-1 text-gray-300">
              •
            </span>
            {vehicle.mileage} km/l
          </p>


          <p className="text-[11px] text-gray-400">

            {vehicle.age} yr old

            <span className="mx-1">
              •
            </span>

            {vehicle.distanceCovered.toLocaleString()} km

          </p>


          {vehicle.vehicleType === "bike" &&
            vehicle.engine !== undefined && (

              <p className="text-[11px] font-semibold text-orange-500">
                {vehicle.engine} cc
              </p>

            )}

        </div>

      </td>


      {/* ========================================================
          RENT
      ======================================================== */}

      <td className="px-5 py-5">

        <div>

          <p className="text-base font-black text-gray-900">
            ₹{vehicle.rent}
            <span className="ml-1 text-[10px] font-medium text-gray-400">
              /hr
            </span>
          </p>

        </div>

      </td>


      {/* ========================================================
          RATING
      ======================================================== */}

      <td className="px-5 py-5">

        <div>

          <div className="flex items-center gap-1">

            <span className="text-sm text-yellow-500">
              ★
            </span>

            <span className="text-sm font-black text-gray-800">
              {vehicle.rating.toFixed(1)}
            </span>

          </div>


          <p className="mt-1 text-[11px] text-gray-400">
            {vehicle.reviews} reviews
          </p>

        </div>

      </td>


      {/* ========================================================
          LISTING
      ======================================================== */}

      <td className="px-5 py-5">

        <ListingStatus
          isListed={vehicle.isListed}
        />

      </td>


      {/* ========================================================
          ACTION
      ======================================================== */}

      <td className="px-5 py-5">

        <div className="flex justify-end gap-2">


          {/* VIEW */}

          <button
            type="button"
            onClick={onView}
            title="View details"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
          >

            <EyeIcon />

          </button>


          {/* EDIT */}

          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-3.5 py-2.5 text-xs font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-orange-500 hover:shadow-[0_7px_18px_rgba(249,115,22,0.20)]"
          >

            <EditIcon />

            Edit

          </button>

        </div>

      </td>

    </tr>

  )

}


/* ==============================================================
   LISTING STATUS
============================================================== */

function ListingStatus({
  isListed,
}: {
  isListed: boolean
}) {

  return (

    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold ${
        isListed
          ? "bg-green-50 text-green-600"
          : "bg-gray-100 text-gray-500"
      }`}
    >

      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isListed
            ? "bg-green-500"
            : "bg-gray-400"
        }`}
      />

      {isListed
        ? "Listed"
        : "Unlisted"}

    </span>

  )

}


/* ==============================================================
   VEHICLE DETAILS MODAL
============================================================== */

function VehicleDetailsModal({
  vehicle,
  onClose,
  onEdit,
}: {
  vehicle: IVehicle
  onClose: () => void
  onEdit: () => void
}) {

  const vehicleName =
    `${vehicle.company} ${vehicle.model}`


  const image =
    vehicle.images?.[0]


  const ownerName =
    typeof vehicle.ownerId === "object"
      ? vehicle.ownerId.name || "Unknown owner"
      : "Owner ID"


  const ownerEmail =
    typeof vehicle.ownerId === "object"
      ? vehicle.ownerId.email || "—"
      : vehicle.ownerId


  return (

    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {

        if (
          e.target === e.currentTarget
        ) {
          onClose()
        }

      }}
    >

      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">


        {/* ========================================================
            IMAGE
        ======================================================== */}

        <div className="relative h-56 bg-gray-100 sm:h-64">

          {image ? (

            <img
              src={image}
              alt={vehicleName}
              className="h-full w-full object-cover"
            />

          ) : (

            <div className="flex h-full items-center justify-center text-gray-400">

              {vehicle.vehicleType === "car"
                ? <CarIcon />
                : <BikeIcon />
              }

            </div>

          )}


          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />


          {/* CLOSE */}

          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition hover:bg-black/50"
          >

            <CloseIcon />

          </button>


          {/* TITLE */}

          <div className="absolute bottom-5 left-5 right-5">

            <div className="flex items-center gap-2">

              <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase text-gray-800">
                {vehicle.vehicleType}
              </span>


              <ListingStatus
                isListed={vehicle.isListed}
              />

            </div>


            <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
              {vehicleName}
            </h2>

          </div>

        </div>


        {/* ========================================================
            DETAILS
        ======================================================== */}

        <div className="max-h-[65vh] overflow-y-auto p-6 sm:p-7">


          {/* BASIC */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <DetailItem
              label="Company"
              value={vehicle.company}
            />

            <DetailItem
              label="Model"
              value={vehicle.model}
            />

            <DetailItem
              label="Vehicle number"
              value={vehicle.vehicleNo}
            />

            <DetailItem
              label="Fuel"
              value={vehicle.fuel}
            />

            <DetailItem
              label="Transmission"
              value={vehicle.transmission}
            />

            <DetailItem
              label="Seats"
              value={`${vehicle.seats}`}
            />

            <DetailItem
              label="Rent"
              value={`₹${vehicle.rent}/hr`}
            />

            <DetailItem
              label="Rating"
              value={`${vehicle.rating.toFixed(1)} / 5`}
            />

            <DetailItem
              label="Reviews"
              value={`${vehicle.reviews}`}
            />

            <DetailItem
              label="Mileage"
              value={`${vehicle.mileage} km/l`}
            />

            <DetailItem
              label="Vehicle age"
              value={`${vehicle.age} year${vehicle.age === 1 ? "" : "s"}`}
            />

            <DetailItem
              label="Distance covered"
              value={`${vehicle.distanceCovered.toLocaleString()} km`}
            />

            {vehicle.vehicleType === "bike" &&
              vehicle.engine !== undefined && (

                <DetailItem
                  label="Engine"
                  value={`${vehicle.engine} cc`}
                />

              )}

          </div>


          {/* DESCRIPTION */}

          <div className="mt-6 rounded-2xl border border-gray-100 bg-[#fafaf7] p-4">

            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
              Description
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {vehicle.description || "No description provided."}
            </p>

          </div>


          {/* OWNER */}

          <div className="mt-6 rounded-2xl border border-gray-100 bg-[#fafaf7] p-4">

            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
              Vehicle owner
            </p>


            <div className="mt-3 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">

                {ownerName
                  .charAt(0)
                  .toUpperCase()}

              </div>


              <div className="min-w-0">

                <p className="truncate text-sm font-bold text-gray-800">
                  {ownerName}
                </p>

                <p className="mt-0.5 break-all text-xs text-gray-400">
                  {ownerEmail}
                </p>

              </div>

            </div>

          </div>


          {/* ACTIONS */}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
            >
              Close
            </button>


            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
            >

              <EditIcon />

              Edit Vehicle

            </button>

          </div>

        </div>

      </div>

    </div>

  )

}


/* ==============================================================
   DETAIL ITEM
============================================================== */

function DetailItem({
  label,
  value,
}: {
  label: string
  value?: string
}) {

  return (

    <div className="rounded-2xl border border-gray-100 bg-[#fafaf7] p-4">

      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
        {label}
      </p>


      <p className="mt-2 break-words text-sm font-bold text-gray-800">
        {value || "Not provided"}
      </p>

    </div>

  )

}


/* ==============================================================
   LOGOUT MODAL
============================================================== */

function LogoutModal({
  open,
  loading,
  onCancel,
  onConfirm,
}: {
  open: boolean
  loading: boolean
  onCancel: () => void
  onConfirm: () => void
}) {

  if (!open) return null


  return (

    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl sm:p-7">


        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">

          <LogoutIcon />

        </div>


        <h2 className="mt-5 text-xl font-black text-gray-900">
          Logout from admin?
        </h2>


        <p className="mt-2 text-sm leading-6 text-gray-500">
          You will be signed out of the RideX administration
          console.
        </p>


        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">

          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>


          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading
              ? "Logging out..."
              : "Logout"}

          </button>

        </div>

      </div>

    </div>

  )

}


/* ==============================================================
   LOADING SCREEN
============================================================== */

function LoadingScreen() {

  return (

    <main className="min-h-screen bg-[#f6f6f2]">


      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />

            <div>

              <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />

              <div className="mt-2 h-2.5 w-24 animate-pulse rounded bg-gray-100" />

            </div>

          </div>


          <div className="h-10 w-20 animate-pulse rounded-xl bg-gray-200" />

        </div>

      </header>


      <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="h-4 w-32 rounded bg-gray-200" />

          <div className="mt-4 h-10 w-72 rounded bg-gray-200" />

          <div className="mt-3 h-5 w-96 max-w-full rounded bg-gray-200" />


          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">

            {[1, 2, 3, 4, 5].map(
              (item) => (

                <div
                  key={item}
                  className="h-28 rounded-2xl bg-gray-200"
                />

              )
            )}

          </div>


          <div className="mt-8 h-28 rounded-3xl bg-gray-200" />

          <div className="mt-6 h-[500px] rounded-3xl bg-gray-200" />

        </div>

      </section>

    </main>

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


function BikeIcon() {

  return (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="h-5 w-5"
    >

      <circle
        cx="5.5"
        cy="17.5"
        r="3.5"
      />

      <circle
        cx="18.5"
        cy="17.5"
        r="3.5"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.5 17.5h3l3-6h2M11.5 17.5l-3-6h3l2 3M14.5 11.5l-1.5-2h2"
      />

    </svg>

  )

}


function SearchIcon() {

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
        d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
      />

    </svg>

  )

}


// function CalendarIcon() {

//   return (

//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth={1.8}
//       stroke="currentColor"
//       className="h-5 w-5"
//     >

//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M6.75 3v3M17.25 3v3M3.75 9h16.5M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
//       />

//     </svg>

//   )

// }


function CheckIcon() {

  return (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-5 w-5"
    >

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 12 4 4L19 6"
      />

    </svg>

  )

}


function PauseIcon() {

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
        d="M8.5 6.5v11M15.5 6.5v11"
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


function RefreshIcon({
  spinning = false,
}: {
  spinning?: boolean
}) {

  return (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className={`h-4 w-4 ${
        spinning
          ? "animate-spin"
          : ""
      }`}
    >

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4"
      />

    </svg>

  )

}


function EditIcon() {

  return (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="h-3.5 w-3.5"
    >

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.86 4.49 2.65 2.65M5 19l3.9-.9L18.9 8.1a1.88 1.88 0 0 0-2.65-2.65l-10 10L5 19Z"
      />

    </svg>

  )

}


function EyeIcon() {

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
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
      />

      <circle
        cx="12"
        cy="12"
        r="2.5"
      />

    </svg>

  )

}


function ChevronIcon() {

  return (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-4 w-4"
    >

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6 9 6 6 6-6"
      />

    </svg>

  )

}


function CloseIcon() {

  return (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-4 w-4"
    >

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6 6 12 12M18 6 6 18"
      />

    </svg>

  )

}


function BackIcon() {

  return (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-4 w-4"
    >

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 12H5m6 6-6-6 6-6"
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


export default AdminVehicles
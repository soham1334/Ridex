import { useEffect, useState } from "react"
import Navbar from "../Navbar"
import { useNavigate } from "react-router-dom"

import {
  CarFront,
  Bike,
  CalendarDays,
  Star,
  IndianRupee,
  Pencil,
  EyeOff,
  Eye,
  Trash2,
  ArrowRight,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"

import { api } from "../Authentication/axiosInterseptors"
import { toast } from "react-toastify"


// ============================================================
// TYPES
// ============================================================

type VehicleType = "Car" | "Bike"


interface Vehicle {
  id: string

  company: string
  model: string

  type: VehicleType

  image: string

  rent: number
  bookings: number
  rating: number
  earnings: number

  isListed: boolean

  // Backend fields
  vehicleNo?: string

  fuel?: string
  transmission?: string

  seats?: number
  mileage?: number
  age?: number
  distanceCovered?: number

  engine?: number

  description?: string

  createdAt?: string
}


interface EditForm {
  rent: number

  fuel: string
  transmission: string

  seats: number
  mileage: number
  age: number
  distanceCovered: number

  engine: number

  description: string
}


// ============================================================
// COMPONENT
// ============================================================

const ListedVehicles = () => {

  const navigate = useNavigate()


  // ==========================================================
  // VEHICLES
  // ==========================================================

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([])


  // ==========================================================
  // MODAL STATE
  // ==========================================================

  const [detailsVehicle, setDetailsVehicle] =
    useState<Vehicle | null>(null)


  const [editVehicle, setEditVehicle] =
    useState<Vehicle | null>(null)


  const [confirmationVehicle, setConfirmationVehicle] =
    useState<Vehicle | null>(null)


  const [confirmationType, setConfirmationType] =
    useState<
      "unlist" |
      "list" |
      "delete" |
      null
    >(null)


  // ==========================================================
  // EDIT FORM
  // ==========================================================

  const [editForm, setEditForm] =
    useState<EditForm>({
      rent: 0,

      fuel: "",
      transmission: "",

      seats: 0,
      mileage: 0,
      age: 0,
      distanceCovered: 0,

      engine: 0,

      description: "",
    })


  // ==========================================================
  // CONFIRMATION CREDENTIALS
  // ==========================================================

  const [email, setEmail] =
    useState("")


  const [password, setPassword] =
    useState("")


  // ==========================================================
  // UI STATE
  // ==========================================================

  const [loading, setLoading] =
    useState(false)


  // NEW:
  // Only used while vehicles are initially
  // being fetched from the backend.
  const [fetchingVehicles, setFetchingVehicles] =
    useState(true)


  const [message, setMessage] =
    useState<{
      type: "success" | "error"
      text: string
    } | null>(null)


  // ==========================================================
  // HELPER
  // ==========================================================

  const showMessage = (
    type: "success" | "error",
    text: string
  ) => {

    setMessage({
      type,
      text,
    })


    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }


  // ==========================================================
  // CLOSE CONFIRMATION
  // ==========================================================

  const closeConfirmation = () => {

    if (loading) return


    setConfirmationVehicle(null)

    setConfirmationType(null)

    setEmail("")

    setPassword("")
  }


  // ==========================================================
  // FETCH HOST VEHICLES
  // ==========================================================

  useEffect(() => {

    const fetchVehicles = async () => {

      try {

        setFetchingVehicles(true)


        const response = await api.get(
          "/api/host/listedvehicles"
        )
        console.log(response.data) 

        const backendVehicles =
          Array.isArray(response.data)
            ? response.data
            : response.data.vehicles || []


        const formattedVehicles: Vehicle[] =
          backendVehicles.map(
            (item: any) => ({

              // MongoDB ID
              id: item._id,


              // Vehicle information
              company: item.company,

              model: item.model,


              // Vehicle type
              type:
                item.vehicleType === "car"
                  ? "Car"
                  : "Bike",


              // First image
              image:
                item.images?.[0] || "",


              // Rental information
              rent: item.rent,


              // Booking statistics
              bookings:
                item.bookings || 0,


              // Rating
              rating:
                item.rating || 0,


              // Earnings from aggregation
              earnings:
                item.totalEarnings || 0,


              // Listing status
              isListed:
                item.isListed,


              // Registration number
              vehicleNo:
                item.vehicleNo,


              // Vehicle specifications
              fuel:
                item.fuel,

              transmission:
                item.transmission,

              seats:
                item.seats,

              mileage:
                item.mileage,

              age:
                item.age,

              distanceCovered:
                item.distanceCovered,

              engine:
                item.engine,


              // Description
              description:
                item.description,


              // Created date if available
              createdAt:
                item.createdAt,
            })
          )


        setVehicles(formattedVehicles)


      } catch (error: any) {

  console.error(
    "FETCH VEHICLES ERROR:",
    error
  )

  console.error(
    "STATUS:",
    error.response?.status
  )

  console.error(
    "DATA:",
    error.response?.data
  )

  showMessage(
    "error",
    "Unable to load vehicles"
  )



      } finally {

        setFetchingVehicles(false)

      }

    }


    fetchVehicles()

  }, [])


  // ==========================================================
  // VIEW DETAILS
  // ==========================================================

  const handleViewDetails = (
    vehicle: Vehicle
  ) => {

    setDetailsVehicle(vehicle)

  }


  // ==========================================================
  // OPEN EDIT
  // ==========================================================

  const handleOpenEdit = (
    vehicle: Vehicle
  ) => {

    setEditVehicle(vehicle)


    setEditForm({

      rent:
        vehicle.rent,

      fuel:
        vehicle.fuel || "",

      transmission:
        vehicle.transmission || "",

      seats:
        vehicle.seats || 0,

      mileage:
        vehicle.mileage || 0,

      age:
        vehicle.age || 0,

      distanceCovered:
        vehicle.distanceCovered || 0,

      engine:
        vehicle.engine || 0,

      description:
        vehicle.description || "",
    })

  }


  // ==========================================================
  // EDIT VEHICLE
  // ==========================================================

  const handleEditSubmit = async () => {

    if (!editVehicle) return


    if (editForm.rent <= 0) {

      showMessage(
        "error",
        "Rent must be greater than 0"
      )

      return
    }


    setLoading(true)


    try {

      /*
        IMPORTANT:

        company
        model
        vehicleNo

        are intentionally NOT sent.

        They are immutable.
      */

      const payload: any = {

        vehicleType:
          editVehicle.type.toLowerCase(),

        rent:
          editForm.rent,

        fuel:
          editForm.fuel,

        transmission:
          editForm.transmission,

        seats:
          editForm.seats,

        mileage:
          editForm.mileage,

        age:
          editForm.age,

        distanceCovered:
          editForm.distanceCovered,

        description:
          editForm.description,
      }


      // Engine is relevant for bikes
      if (
        editVehicle.type === "Bike"
      ) {

        payload.engine =
          editForm.engine

      }


      const response =
        await api.patch(
          `/api/host/editvehicle/${editVehicle.id}`,
          payload
        )


      console.log(
        "EDIT RESPONSE:",
        response.data
      )


      // Update local vehicle
      setVehicles(
        (previousVehicles) =>
          previousVehicles.map(
            (vehicle) =>
              vehicle.id === editVehicle.id
                ? {
                    ...vehicle,

                    rent:
                      editForm.rent,

                    fuel:
                      editForm.fuel,

                    transmission:
                      editForm.transmission,

                    seats:
                      editForm.seats,

                    mileage:
                      editForm.mileage,

                    age:
                      editForm.age,

                    distanceCovered:
                      editForm.distanceCovered,

                    engine:
                      editForm.engine,

                    description:
                      editForm.description,
                  }
                : vehicle
          )
      )


      setEditVehicle(null)


      showMessage(
        "success",
        "Vehicle updated successfully"
      )


    } catch (error: any) {

      console.error(
        "EDIT VEHICLE ERROR:",
        error
      )


      showMessage(
        "error",
        error.response?.data?.message ||
        "Unable to update vehicle"
      )


    } finally {

      setLoading(false)

    }

  }


  // ==========================================================
  // OPEN LIST / UNLIST
  // ==========================================================

  const handleToggleListing = (
    vehicle: Vehicle
  ) => {

    setConfirmationVehicle(vehicle)


    setConfirmationType(
      vehicle.isListed
        ? "unlist"
        : "list"
    )


    setEmail("")

    setPassword("")

  }


  // ==========================================================
  // CONFIRM LIST / UNLIST
  // ==========================================================

  const handleConfirmListing = async () => {

    if (!confirmationVehicle) return


    /*
      Password is required only
      when unlisting.
    */

    if (
      confirmationType &&
      (
        !email.trim() ||
        !password
      )
    ) 
    {

      showMessage(
        "error",
        "Email and password are required"
      )

      return
    }


    setLoading(true)


    try {

      const response =
        await api.patch(
          `/api/host/un_list/${confirmationVehicle.id}`,
          {
            email,
            password,

            vehicleType:
              confirmationVehicle.type.toLowerCase(),
          }
        )


      console.log(
        "LIST STATUS RESPONSE:",
        response.data
      )


      /*
        Prefer backend's actual
        returned status.
      */

      const newListingStatus =
        response.data?.isListed ??
        (
          confirmationType === "list"
        )


      setVehicles(
        (previousVehicles) =>
          previousVehicles.map(
            (vehicle) =>
              vehicle.id ===
              confirmationVehicle.id
                ? {
                    ...vehicle,

                    isListed:
                      newListingStatus,
                  }
                : vehicle
          )
      )


      closeConfirmation()


      showMessage(
        "success",
        newListingStatus
          ? "Vehicle listed successfully"
          : "Vehicle unlisted successfully"
      )


    } catch (error: any) {

      console.error(
        "LIST/UNLIST ERROR:",
        error
      )


      showMessage(
        "error",
        error.response?.data?.message ||
        "Unable to update vehicle listing"
      )


    } finally {

      setLoading(false)

    }

  }


  // ==========================================================
  // OPEN DELETE
  // ==========================================================

  const handleDelete = (
    vehicle: Vehicle
  ) => {

    setConfirmationVehicle(vehicle)

    setConfirmationType("delete")

    setEmail("")

    setPassword("")

  }


  // ==========================================================
  // CONFIRM DELETE
  // ==========================================================

  const handleConfirmDelete = async () => {

    if (!confirmationVehicle) return


    if (
      !email.trim() ||
      !password
    ) {

      showMessage(
        "error",
        "Email and password are required"
      )

      return
    }


    setLoading(true)


    try {

      const response =
        await api.patch(
          `/api/host/deletevehicle/${confirmationVehicle.id}`,
          {
            email,
            password,

            vehicleType:
              confirmationVehicle.type.toLowerCase(),
          }
        )


      console.log(
        "DELETE RESPONSE:",
        response.data
      )


      setVehicles(
        (previousVehicles) =>
          previousVehicles.filter(
            (vehicle) =>
              vehicle.id !==
              confirmationVehicle.id
          )
      )


      closeConfirmation()


      showMessage(
        "success",
        "Vehicle deleted successfully"
      )


    } catch (error: any) {
      toast.error(error.response.data)

      console.error(
        "DELETE VEHICLE ERROR:",
        error
      )


      showMessage(
        "error",
        error.response?.data?.message ||
        "Unable to delete vehicle"
      )


    } finally {

      setLoading(false)

    }

  }


  // ==========================================================
  // COUNTS
  // ==========================================================

  const totalCars =
    vehicles.filter(
      (vehicle) =>
        vehicle.type === "Car"
    ).length


  const totalBikes =
    vehicles.filter(
      (vehicle) =>
        vehicle.type === "Bike"
    ).length


  const totalListed =
    vehicles.filter(
      (vehicle) =>
        vehicle.isListed
    ).length


  // ==========================================================
  // JSX
  // ==========================================================

  return (

    <div className="min-h-screen bg-[#f5f5f0] text-slate-900">

      <Navbar />


      {/* =====================================================
          TOAST
      ====================================================== */}

      {message && (

        <div className="pt-86 right-6 z-100">

          <div
            className={`flex items-center gap-3 rounded-xl border bg-white px-5 py-4 shadow-xl ${
              message.type === "success"
                ? "border-green-200"
                : "border-red-200"
            }`}
          >

            {message.type === "success" ? (

              <CheckCircle2
                size={20}
                className="text-green-600"
              />

            ) : (

              <AlertTriangle
                size={20}
                className="text-red-600"
              />

            )}


            <span className="text-sm font-medium">
              {message.text}
            </span>

          </div>

        </div>

      )}


      <main className="mx-auto max-w-7xl px-6 py-36">


        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>

            <h1
              className="
                text-4xl
                font-black
                tracking-tight
                text-gray-900
              "
            >
              Listed Vehicles
            </h1>


            <p className="mt-2 text-sm text-slate-500">
              Manage your rental vehicles and listings
            </p>

          </div>


          <button
            onClick={() =>
              navigate(
                "/user/list-vehicle"
              )
            }
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-orange-500
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-orange-600
            "
          >

            <Plus size={18} />

            List New Vehicle

          </button>

        </div>


        {/* ===================================================
            SUMMARY CARDS
        ==================================================== */}

        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">


          {/* LISTED VEHICLES */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div className="rounded-xl bg-orange-50 p-3">

                <CarFront
                  size={22}
                  className="text-orange-500"
                />

              </div>


              <span className="text-xs font-bold text-slate-800">
                ACTIVE
              </span>

            </div>


            <p className="text-sm text-slate-500">
              Listed Vehicles
            </p>


            <p className="mt-1 text-3xl font-bold">
              {totalListed}
            </p>

          </div>


          {/* TOTAL CARS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div className="rounded-xl bg-blue-50 p-3">

                <CarFront
                  size={22}
                  className="text-blue-500"
                />

              </div>


              <span className="text-xs font-bold text-slate-800">
                CARS
              </span>

            </div>


            <p className="text-sm text-slate-500">
              Total Cars
            </p>


            <p className="mt-1 text-3xl font-bold">
              {totalCars}
            </p>

          </div>


          {/* TOTAL BIKES */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div className="rounded-xl bg-purple-50 p-3">

                <Bike
                  size={22}
                  className="text-purple-500"
                />

              </div>


              <span className="text-xs font-bold text-slate-800">
                BIKES
              </span>

            </div>


            <p className="text-sm text-slate-500">
              Total Bikes
            </p>


            <p className="mt-1 text-3xl font-bold">
              {totalBikes}
            </p>

          </div>

        </div>


        {/* ===================================================
            VEHICLES
        ==================================================== */}

        {fetchingVehicles ? (

          /* =================================================
             MODERN LOADING STATE
          ================================================== */

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {[1, 2].map((item) => (

              <div
                key={item}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                "
              >

                {/* IMAGE SKELETON */}

                <div className="relative h-52 overflow-hidden bg-slate-100">

                  <div className="absolute inset-0 animate-pulse bg-linear-to-r from-transparent via-white/60 to-transparent" />

                  <div className="flex h-full items-center justify-center">

                    <div className="flex flex-col items-center gap-3">

                      <div className="rounded-2xl bg-white p-4 shadow-sm">

                        <Loader2
                          size={30}
                          className="animate-spin text-orange-500"
                        />

                      </div>

                    </div>

                  </div>

                </div>


                {/* CONTENT SKELETON */}

                <div className="p-5">

                  <div className="flex items-start justify-between gap-4">

                    <div className="w-full">

                      <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />

                      <div className="mt-3 h-6 w-40 animate-pulse rounded bg-slate-200" />

                      <div className="mt-3 h-3 w-28 animate-pulse rounded bg-slate-100" />

                    </div>


                    <div className="shrink-0">

                      <div className="h-3 w-10 animate-pulse rounded bg-slate-200" />

                      <div className="mt-2 h-5 w-20 animate-pulse rounded bg-slate-200" />

                    </div>

                  </div>


                  <div className="mt-5 flex gap-5 border-t border-slate-100 pt-4">

                    <div>

                      <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />

                      <div className="mt-2 h-4 w-8 animate-pulse rounded bg-slate-100" />

                    </div>


                    <div>

                      <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />

                      <div className="mt-2 h-4 w-8 animate-pulse rounded bg-slate-100" />

                    </div>

                  </div>


                  <div className="mt-5 flex items-center justify-center rounded-2xl bg-[#f7f7f3] p-5">

                    <div className="flex items-center gap-3">

                      <Loader2
                        size={18}
                        className="animate-spin text-orange-500"
                      />

                      <span className="text-sm font-medium text-slate-500">
                        Loading your vehicles...
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : vehicles.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================== */

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">

            <CarFront
              size={42}
              className="mx-auto mb-4 text-slate-300"
            />


            <h3 className="text-lg font-semibold">
              Currently no vehicles are listed
            </h3>


            <p className="mt-2 text-sm text-slate-500">
              Start earning by listing your first vehicle.
            </p>


            <button
              onClick={() =>
                navigate(
                  "/user/list-vehicle"
                )
              }
              className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
            >
              List Vehicle
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {vehicles.map(
              (vehicle) => (

                <div
                  key={vehicle.id}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-md
                  "
                >

                  {/* =================================================
                      IMAGE
                  ================================================== */}

                  <div className="relative h-52 bg-slate-100">

                    {vehicle.image ? (

                      <img
                        src={vehicle.image}
                        alt={`${vehicle.company} ${vehicle.model}`}
                        className={`h-full w-full object-cover ${
                          !vehicle.isListed
                            ? "grayscale"
                            : ""
                        }`}
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center">

                        {vehicle.type === "Car" ? (

                          <CarFront
                            size={70}
                            className="text-slate-300"
                          />

                        ) : (

                          <Bike
                            size={70}
                            className="text-slate-300"
                          />

                        )}

                      </div>

                    )}


                    {/* =================================================
                        BADGES
                    ================================================== */}

                    <div className="absolute left-4 top-4 flex gap-2">

                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">

                        {vehicle.type === "Car" ? (

                          <CarFront
                            size={13}
                            className="mr-1 inline"
                          />

                        ) : (

                          <Bike
                            size={13}
                            className="mr-1 inline"
                          />

                        )}

                        {vehicle.type}

                      </span>


                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
                          vehicle.isListed
                            ? "bg-green-50 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >

                        {vehicle.isListed
                          ? "Listed"
                          : "Unlisted"}

                      </span>

                    </div>

                  </div>


                  {/* =================================================
                      VEHICLE INFORMATION
                  ================================================== */}

                  <div className="p-5">

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                          {vehicle.company}
                        </p>


                        <h2 className="mt-1 truncate text-xl font-black text-gray-900">
                          {vehicle.model}
                        </h2>


                        <p className="mt-1 text-xs font-medium text-gray-700">
                          {vehicle.vehicleNo ||
                            "Registration not available"}
                        </p>

                      </div>


                      <div className="shrink-0 text-right">

                        <p className="text-xs text-gray-400">
                          Rent
                        </p>


                        <p className="text-lg font-black text-gray-900">
                          ₹{vehicle.rent}/hr
                        </p>

                      </div>

                    </div>


                    {/* =================================================
                        QUICK STATS
                    ================================================== */}

                    <div className="mt-5 flex flex-wrap gap-5 border-t border-slate-100 pt-4">

                      {/* BOOKINGS */}

                      <div className="min-w-20">

                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Bookings
                        </p>


                        <p className="mt-1 text-sm font-bold text-gray-800">
                          {vehicle.bookings}
                        </p>

                      </div>


                      {/* RATING */}

                      <div className="min-w-20">

                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Rating
                        </p>


                        <p className="mt-1 text-sm font-bold text-yellow-500">
                          ★ <span className="mt-1 text-sm font-bold text-slate-800"> {vehicle.rating}</span>
                        </p>

                      </div>

                    </div>


                    {/* =================================================
                        VEHICLE EARNINGS
                    ================================================== */}

                    <div className="flex flex-col gap-4 rounded-2xl bg-[#f7f7f3] p-5 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Total Earnings
                        </p>


                        <p className="mt-1 text-2xl font-black text-green-600">
                          ₹
                          {vehicle.earnings.toLocaleString(
                            "en-IN"
                          )}
                        </p>


                        <p className="mt-1 text-xs text-gray-500">
                          Generated from {vehicle.bookings} bookings
                        </p>

                      </div>


                      <div className="flex flex-wrap gap-2">

                        {/* VIEW DETAILS */}

                        <button
                          onClick={() =>
                            handleViewDetails(
                              vehicle
                            )
                          }
                          className="rounded-xl bg-[#171717] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-orange-500"
                        >
                          View Details
                        </button>


                        {/* EDIT */}

                        <button
                          onClick={() =>
                            handleOpenEdit(
                              vehicle
                            )
                          }
                          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500"
                        >

                          <Pencil
                            size={14}
                            className="mr-1 inline"
                          />

                          Edit

                        </button>

                      </div>

                    </div>


                    {/* =================================================
                        MANAGEMENT BUTTONS
                    ================================================== */}

                    <div className="mt-3 flex flex-wrap gap-2">

                      {/* LIST / UNLIST */}

                      <button
                        onClick={() =>
                          handleToggleListing(
                            vehicle
                          )
                        }
                        className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                          vehicle.isListed
                            ? "border-red-200 text-red-600 hover:bg-orange-50"
                            : "border-green-200 text-green-600 hover:bg-green-50"
                        }`}
                      >

                        {vehicle.isListed ? (

                          <>

                            <EyeOff
                              size={15}
                            />

                            Unlist

                          </>

                        ) : (

                          <>

                            <Eye
                              size={15}
                            />

                            List

                          </>

                        )}

                      </button>


                      {/* DELETE */}

                      <button
                        onClick={() =>
                          handleDelete(
                            vehicle
                          )
                        }
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-red-200
                          px-4
                          py-2.5
                          text-xs
                          font-bold
                          text-red-500
                          transition
                          hover:bg-red-50
                        "
                      >

                        <Trash2
                          size={15}
                        />

                        Delete

                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}


        {/* ===================================================
            EARNINGS CTA
        ==================================================== */}

        <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl bg-slate-900 p-6 text-white md:flex-row md:items-center">

          <div>

            <h3 className="text-lg font-bold">
              Track your rental earnings
            </h3>


            <p className="mt-1 text-sm text-slate-400">
              View your earnings, payouts and transaction history.
            </p>

          </div>


          <button
            onClick={() =>
              navigate("/user/earnings")
            }
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >

            View Earnings

            <ArrowRight
              size={17}
            />

          </button>

        </div>

      </main>


      {/* =====================================================
          VIEW DETAILS MODAL
      ====================================================== */}

      {detailsVehicle && (

        <div
          className="
            fixed
            inset-0
            z-90
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
          "
          onClick={() =>
            setDetailsVehicle(null)
          }
        >

          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              max-h-[90vh]
              w-full
              max-w-2xl
              overflow-y-auto
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <p className="font-bold text text-orange-600">
                  {detailsVehicle.company}
                </p>


                <h2 className="text-xl font-bold">
                  {detailsVehicle.model}
                </h2>

              </div>


              <button
                onClick={() =>
                  setDetailsVehicle(null)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >

                <X
                  size={20}
                />

              </button>

            </div>


            {/* IMAGE */}

            <div className="flex h-56 items-center justify-center bg-slate-100">

              {detailsVehicle.image ? (

                <img
                  src={detailsVehicle.image}
                  alt={detailsVehicle.model}
                  className="h-full w-full object-cover"
                />

              ) : (

                detailsVehicle.type === "Car" ? (

                  <CarFront
                    size={90}
                    className="text-slate-300"
                  />

                ) : (

                  <Bike
                    size={90}
                    className="text-slate-300"
                  />

                )

              )}

            </div>


            <div className="space-y-6 p-6">


              {/* STATUS */}

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  Listing Status
                </span>


                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    detailsVehicle.isListed
                      ? "bg-green-50 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >

                  {detailsVehicle.isListed
                    ? "Listed"
                    : "Unlisted"}

                </span>

              </div>


              {/* VEHICLE INFO */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Vehicle Information
                </h3>


                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

                  {/* TYPE */}

                  <DetailItem
                    label="Type"
                    value={
                      detailsVehicle.type
                    }
                  />


                  {/* RENT */}

                  <DetailItem
                    label="Rent"
                    value={`₹${detailsVehicle.rent}/hr`}
                  />


                  {/* REGISTRATION */}

                  <DetailItem
                    label="Registration"
                    value={
                      detailsVehicle.vehicleNo ||
                      "Not available"
                    }
                  />


                  {/* FUEL */}

                  <DetailItem
                    label="Fuel"
                    value={
                      detailsVehicle.fuel ||
                      "Not available"
                    }
                  />


                  {/* TRANSMISSION */}

                  <DetailItem
                    label="Transmission"
                    value={
                      detailsVehicle.transmission ||
                      "Not available"
                    }
                  />


                  {/* SEATS */}

                  <DetailItem
                    label="Seats"
                    value={
                      detailsVehicle.seats
                        ? `${detailsVehicle.seats}`
                        : "Not available"
                    }
                  />


                  {/* MILEAGE */}

                  <DetailItem
                    label="Mileage"
                    value={
                      detailsVehicle.mileage !==
                      undefined
                        ? `${detailsVehicle.mileage} km/l`
                        : "Not available"
                    }
                  />


                  {/* AGE */}

                  <DetailItem
                    label="Vehicle Age"
                    value={
                      detailsVehicle.age !==
                      undefined
                        ? `${detailsVehicle.age} ${
                            detailsVehicle.age === 1
                              ? "Year"
                              : "Years"
                          }`
                        : "Not available"
                    }
                  />


                  {/* DISTANCE */}

                  <DetailItem
                    label="Distance Covered"
                    value={
                      detailsVehicle.distanceCovered !==
                      undefined
                        ? `${detailsVehicle.distanceCovered.toLocaleString(
                            "en-IN"
                          )} km`
                        : "Not available"
                    }
                  />


                  {/* ENGINE */}

                  {detailsVehicle.type ===
                    "Bike" && (

                    <DetailItem
                      label="Engine"
                      value={
                        detailsVehicle.engine
                          ? `${detailsVehicle.engine} CC`
                          : "Not available"
                      }
                    />

                  )}

                </div>

              </div>


              {/* PERFORMANCE */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                  Performance
                </h3>


                <div className="grid grid-cols-3 gap-3">

                  <PerformanceItem
                    icon={
                      <CalendarDays
                        size={18}
                      />
                    }
                    value={
                      detailsVehicle.bookings
                    }
                    label="Bookings"
                  />


                  <PerformanceItem
                    icon={
                      <Star
                        size={18}
                      />
                    }
                    value={
                      detailsVehicle.rating
                    }
                    label="Rating"
                  />


                  <PerformanceItem
                    icon={
                      <IndianRupee
                        size={18}
                      />
                    }
                    value={`₹${detailsVehicle.earnings.toLocaleString(
                      "en-IN"
                    )}`}
                    label="Earnings"
                  />

                </div>

              </div>


              {/* DESCRIPTION */}

              {detailsVehicle.description && (

                <div>

                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-400">
                    Description
                  </h3>


                  <p className="text-sm leading-6 text-slate-600">
                    {detailsVehicle.description}
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          EDIT MODAL
      ====================================================== */}

      {editVehicle && (

        <div
          className="
            fixed
            inset-0
            z-90
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
            overflow-y-auto
          "
          onClick={() => {

            if (!loading) {
              setEditVehicle(null)
            }

          }}
        >

          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              w-full
              max-w-2xl
              max-h-[90vh]
              overflow-y-auto
              bg-white
              rounded-lg
            "
          >

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <p className="text-sm text-slate-400">
                  Edit Vehicle
                </p>


                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {editVehicle.company}{" "}
                  {editVehicle.model}
                </h2>


                <p className="mt-1 text-xs text-slate-400">
                  Registration:{" "}
                  {editVehicle.vehicleNo ||
                    "Not available"}
                </p>

              </div>


              <button
                disabled={loading}
                onClick={() =>
                  setEditVehicle(null)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >

                <X
                  size={20}
                />

              </button>

            </div>


            {/* FORM */}

            <div className="space-y-5 p-6">

              {/* RENT */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Rent per hour
                </label>


                <input
                  type="number"
                  value={editForm.rent}
                  onChange={(event) =>
                    setEditForm(
                      (previous) => ({
                        ...previous,
                        rent:
                          Number(
                            event.target.value
                          ),
                      })
                    )
                  }
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-orange-400
                    focus:ring-2
                    focus:ring-orange-100
                    disabled:bg-slate-50
                  "
                />

              </div>


              {/* FUEL */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Fuel
                </label>


                <input
                  type="text"
                  value={editForm.fuel}
                  onChange={(event) =>
                    setEditForm(
                      (previous) => ({
                        ...previous,
                        fuel:
                          event.target.value,
                      })
                    )
                  }
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-orange-400
                    focus:ring-2
                    focus:ring-orange-100
                    disabled:bg-slate-50
                  "
                />

              </div>


              {/* TRANSMISSION */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Transmission
                </label>


                <input
                  type="text"
                  value={
                    editForm.transmission
                  }
                  onChange={(event) =>
                    setEditForm(
                      (previous) => ({
                        ...previous,
                        transmission:
                          event.target.value,
                      })
                    )
                  }
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-orange-400
                    focus:ring-2
                    focus:ring-orange-100
                    disabled:bg-slate-50
                  "
                />

              </div>


              {/* SEATS + MILEAGE */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Seats
                  </label>


                  <input
                    type="number"
                    value={editForm.seats}
                    onChange={(event) =>
                      setEditForm(
                        (previous) => ({
                          ...previous,
                          seats:
                            Number(
                              event.target.value
                            ),
                        })
                      )
                    }
                    disabled={loading}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-orange-400
                      focus:ring-2
                      focus:ring-orange-100
                      disabled:bg-slate-50
                    "
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Mileage
                  </label>


                  <input
                    type="number"
                    value={editForm.mileage}
                    onChange={(event) =>
                      setEditForm(
                        (previous) => ({
                          ...previous,
                          mileage:
                            Number(
                              event.target.value
                            ),
                        })
                      )
                    }
                    disabled={loading}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-orange-400
                      focus:ring-2
                      focus:ring-orange-100
                      disabled:bg-slate-50
                    "
                  />

                </div>

              </div>


              {/* AGE + DISTANCE */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Vehicle Age
                  </label>


                  <input
                    type="number"
                    value={editForm.age}
                    onChange={(event) =>
                      setEditForm(
                        (previous) => ({
                          ...previous,
                          age:
                            Number(
                              event.target.value
                            ),
                        })
                      )
                    }
                    disabled={loading}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-orange-400
                      focus:ring-2
                      focus:ring-orange-100
                      disabled:bg-slate-50
                    "
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Distance Covered
                  </label>


                  <input
                    type="number"
                    value={
                      editForm.distanceCovered
                    }
                    onChange={(event) =>
                      setEditForm(
                        (previous) => ({
                          ...previous,
                          distanceCovered:
                            Number(
                              event.target.value
                            ),
                        })
                      )
                    }
                    disabled={loading}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-orange-400
                      focus:ring-2
                      focus:ring-orange-100
                      disabled:bg-slate-50
                    "
                  />

                </div>

              </div>


              {/* ENGINE — BIKE ONLY */}

              {editVehicle.type ===
                "Bike" && (

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Engine (CC)
                  </label>


                  <input
                    type="number"
                    value={
                      editForm.engine
                    }
                    onChange={(event) =>
                      setEditForm(
                        (previous) => ({
                          ...previous,
                          engine:
                            Number(
                              event.target.value
                            ),
                        })
                      )
                    }
                    disabled={loading}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-orange-400
                      focus:ring-2
                      focus:ring-orange-100
                      disabled:bg-slate-50
                    "
                  />

                </div>

              )}


              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>


                <textarea
                  value={
                    editForm.description
                  }
                  onChange={(event) =>
                    setEditForm(
                      (previous) => ({
                        ...previous,
                        description:
                          event.target.value,
                      })
                    )
                  }
                  disabled={loading}
                  rows={4}
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-orange-400
                    focus:ring-2
                    focus:ring-orange-100
                    disabled:bg-slate-50
                  "
                />

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  disabled={loading}
                  onClick={() =>
                    setEditVehicle(null)
                  }
                  className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>


                <button
                  disabled={loading}
                  onClick={
                    handleEditSubmit
                  }
                  className="
                    flex
                    min-w-32.5
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-orange-500
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-orange-600
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {loading && (

                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                  )}


                  {loading
                    ? "Saving..."
                    : "Save Changes"}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          CONFIRMATION MODAL
      ====================================================== */}

      {confirmationVehicle &&
        confirmationType && (

          <div
            className="
              fixed
              inset-0
              z-100
              flex
              items-center
              justify-center
              bg-black/50
              p-4
              backdrop-blur-sm
            "
            onClick={() => {

              if (!loading) {
                closeConfirmation()
              }

            }}
          >

            <div
              onClick={(event) =>
                event.stopPropagation()
              }
              className="
                w-full
                max-w-md
                rounded-2xl
                bg-white
                shadow-2xl
              "
            >

              <div className="p-6">


                {/* ICON */}

                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${
                    confirmationType ===
                    "delete"
                      ? "bg-red-50"
                      : confirmationType ===
                        "unlist"
                      ? "bg-orange-50"
                      : "bg-green-50"
                  }`}
                >

                  {confirmationType ===
                  "delete" ? (

                    <Trash2
                      size={23}
                      className="text-red-500"
                    />

                  ) : confirmationType ===
                    "unlist" ? (

                    <EyeOff
                      size={23}
                      className="text-orange-500"
                    />

                  ) : (

                    <Eye
                      size={23}
                      className="text-green-500"
                    />

                  )}

                </div>


                {/* TITLE */}

                <h2 className="text-xl font-bold">

                  {confirmationType ===
                  "delete"
                    ? "Delete this vehicle?"
                    : confirmationType ===
                      "unlist"
                    ? "Unlist this vehicle?"
                    : "List this vehicle?"}

                </h2>


                {/* DESCRIPTION */}

                <p className="mt-2 text-sm leading-6 text-slate-500">

                  {confirmationType ===
                  "delete"
                    ? `This will permanently remove ${confirmationVehicle.company} ${confirmationVehicle.model} from your vehicles. This action cannot be undone.`
                    : confirmationType ===
                      "unlist"
                    ? `This will make ${confirmationVehicle.company} ${confirmationVehicle.model} unavailable for new bookings. Existing bookings will remain unaffected.`
                    : `This will make ${confirmationVehicle.company} ${confirmationVehicle.model} available for renters again.`}

                </p>


                {/* EMAIL + PASSWORD */}

                {(confirmationType ===
                  "delete" ||
                  confirmationType ===
                    "unlist" ||
                  confirmationType ===
                    "list") && (

                  <div className="mt-6 space-y-4">

                    {/* EMAIL */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Email
                      </label>


                      <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(
                            event.target.value
                          )
                        }
                        placeholder="Enter your account email"
                        disabled={loading}
                        className="
                          w-full
                          rounded-xl
                          border
                          border-slate-200
                          px-4
                          py-3
                          text-sm
                          outline-none
                          focus:border-orange-400
                          focus:ring-2
                          focus:ring-orange-100
                          disabled:bg-slate-50
                        "
                      />

                    </div>


                    {/* PASSWORD */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Password
                      </label>


                      <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                          setPassword(
                            event.target.value
                          )
                        }
                        placeholder="Enter your password"
                        disabled={loading}
                        className="
                          w-full
                          rounded-xl
                          border
                          border-slate-200
                          px-4
                          py-3
                          text-sm
                          outline-none
                          focus:border-orange-400
                          focus:ring-2
                          focus:ring-orange-100
                          disabled:bg-slate-50
                        "
                      />

                    </div>


                    {/* SECURITY MESSAGE */}

                    <div className="rounded-xl bg-slate-50 p-3">

                      <p className="text-xs leading-5 text-slate-500">
                        For your security, please confirm your
                        account credentials before continuing.
                      </p>

                    </div>

                  </div>

                )}


                {/* BUTTONS */}

                <div className="mt-7 flex justify-end gap-3">

                  <button
                    disabled={loading}
                    onClick={
                      closeConfirmation
                    }
                    className="
                      rounded-xl
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-slate-600
                      hover:bg-slate-100
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>


                  <button
                    disabled={loading}
                    onClick={
                      confirmationType ===
                      "delete"
                        ? handleConfirmDelete
                        : handleConfirmListing
                    }
                    className={`
                      flex
                      min-w-33.75
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      disabled:cursor-not-allowed
                      disabled:opacity-60

                      ${
                        confirmationType ===
                        "delete"
                          ? "bg-red-500 hover:bg-red-600"
                          : confirmationType ===
                            "unlist"
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-green-500 hover:bg-green-600"
                      }
                    `}
                  >

                    {loading && (

                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                    )}


                    {loading
                      ? "Processing..."
                      : confirmationType ===
                        "delete"
                      ? "Delete Vehicle"
                      : confirmationType ===
                        "unlist"
                      ? "Confirm Unlist"
                      : "List Vehicle"}

                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

    </div>
  )
}


// ============================================================
// DETAIL ITEM
// ============================================================

const DetailItem = ({
  label,
  value,
}: {
  label: string
  value: string
}) => {

  return (

    <div className="rounded-xl bg-slate-50 p-3">

      <p className="text-xs text-slate-400">
        {label}
      </p>


      <p className="mt-1 truncate text-sm font-semibold text-slate-700">
        {value}
      </p>

    </div>
  )
}


// ============================================================
// PERFORMANCE ITEM
// ============================================================

const PerformanceItem = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string | number
  label: string
}) => {

  return (

    <div className="rounded-xl bg-slate-50 p-4 text-center">

      <div className="mb-2 flex justify-center text-slate-400">

        {icon}

      </div>


      <p className="text-lg font-bold">
        {value}
      </p>


      <p className="text-xs text-slate-400">
        {label}
      </p>

    </div>
  )
}


export default ListedVehicles
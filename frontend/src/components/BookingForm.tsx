import { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"

import { toast } from "react-toastify"
import { api } from "./Authentication/axiosInterseptors"

function Bookingform() {
  const navigate = useNavigate()
  const location = useLocation()

  const { vehicleType, vehicleId } = useParams()

  // ==========================================
  // TYPES
  // ==========================================

  type BookingVehicle = {
    vehicle: {
      _id: string
      company: string
      model: string
      images: string[]
      rent: number
    }

    vehicleType: "car" | "bike"

    startDate: string
    endDate: string
  }

 
  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pickupLocation: "",
    dropoffLocation: "",
    drivingLicense: "",
    specialRequest: "",
    paymentMethod: "payLater",
    terms: false,
  })

  const [errors, setErrors] =
    useState<Record<string, string>>({})

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [isSuccess, setIsSuccess] =
    useState(false)

  // ==========================================
  // VEHICLE STATE
  // ==========================================

  const [vehicles, setVehicles] = useState<BookingVehicle[]>([])

  const [isLoading, setIsLoading] = useState(true)

  // ==========================================
  // VEHICLE CAROUSEL STATE
  // ==========================================

  const [carIndex, setCarIndex] = useState(0)

  const [bikeIndex, setBikeIndex] = useState(0)

  // Separate cars and bikes

  const cars = vehicles.filter(
    (item) => item.vehicleType === "car"
  )

  const bikes = vehicles.filter(
    (item) => item.vehicleType === "bike"
  )

  // ==========================================
  // CAROUSEL CONTROLS
  // ==========================================

  const handlePreviousCar = () => {
    setCarIndex((prev) =>
      prev === 0
        ? cars.length - 1
        : prev - 1
    )
  }

  const handleNextCar = () => {
    setCarIndex((prev) =>
      prev === cars.length - 1
        ? 0
        : prev + 1
    )
  }

  const handlePreviousBike = () => {
    setBikeIndex((prev) =>
      prev === 0
        ? bikes.length - 1
        : prev - 1
    )
  }

  const handleNextBike = () => {
    setBikeIndex((prev) =>
      prev === bikes.length - 1
        ? 0
        : prev + 1
    )
  }

  // ==========================================
  // PLATFORM FEE
  // ==========================================

  const platformFee = 99

  // ==========================================
  // FETCH BOOKING DATA
  // ==========================================

  useEffect(() => {
    

    const fetchVehicles = async () => {
      try {
        setIsLoading(true)

        // ==========================================
        // SINGLE VEHICLE BOOKING
        // ==========================================

        if (vehicleId && vehicleType) {
          
          const response = vehicleType === "car" 
          ?await api.get(
            `/user/cars/id/${vehicleId}`
          )
          :await api.get(
            `/user/bikes/id/${vehicleId}`
          )

          const startDate =
            location.state?.startDate || new Date().toISOString()
          
          const endDate =
            location.state?.endDate ||
            new Date(
              new Date(startDate).getTime() +
                20 * 60 * 60 * 1000
            ).toISOString()

          setVehicles([
            {
              vehicle: response.data,

              vehicleType:
                vehicleType as "car" | "bike",

              startDate,

              endDate, 
            },
          ])

        } else {

          // ==========================================
          // CART BOOKING
          // ==========================================

          const response = await api.get(
            "/user/cart/vehicles"
          )
          console.log("CART RESPONSE:", response.data)
          setVehicles(response.data)
        }

      } catch (error) {
        console.error(
          "Failed to fetch booking data:",
          error
        )

        setErrors({
          general:
            "Unable to load booking details. Please try again.",
        })

      } finally {
        setIsLoading(false)
      }
    }

    fetchVehicles()

  }, [vehicleId, vehicleType])

  // ==========================================
  // HANDLE FORM INPUT CHANGE
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {

    const {
      name,
      value,
      type,
    } = e.target

    const checked =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : false

    setFormData((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }))

    // Remove error when user fixes field

    if (errors[name]) {

      setErrors((prev) => {

        const updated = {
          ...prev,
        }

        delete updated[name]

        return updated
      })
    }
  }

  // ==========================================
  // FORMAT DATE FOR DISPLAY
  // ==========================================

  const formatDate = (date: string) => {

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    )
  }

  // ==========================================
  // FORMAT DATE FOR DATETIME-LOCAL INPUT
  // ==========================================

  const formatDateTimeLocal = (
    date: string
  ) => {

    const value = new Date(date)

    const offset =
      value.getTimezoneOffset() *
      60000

    return new Date(
      value.getTime() - offset
    )
      .toISOString()
      .slice(0, 20)
  }

  // ==========================================
  // GET RENTAL DURATION
  // ==========================================

const getDuration = (
  startDate: string,
  endDate: string
) => {

  const start =
    new Date(startDate).getTime()

  const end =
    new Date(endDate).getTime()

  const duration =
    (end - start) /
    (1000 * 60 * 60)

  return duration < 20
    ? duration
    : Math.floor(duration / 24) * 20 +
      (duration % 24 < 20
        ? duration % 24
        : 20)
}
  // ==========================================
  // FORMAT RENTAL DURATION FOR DISPLAY
  // ==========================================

  const formatDuration = (
    startDate: string,
    endDate: string
  ) => {

    const start = new Date(startDate)
    const end = new Date(endDate)

    const difference =
      end.getTime() - start.getTime()

    const totalMinutes = Math.floor(
      difference / (1000 * 60)
    )

    const days = Math.floor(
      totalMinutes / (24 * 60)
    )

    const hours = Math.floor(
      (totalMinutes % (24 * 60)) / 60
    )

    const minutes =
      totalMinutes % 60

    if (days > 0) {

      if (hours > 0 && minutes > 0) {
        return `${days} day${days !== 1 ? "s" : ""} ${hours} hr${hours !== 1 ? "s" : ""} ${minutes} mins`
      }

      if (hours > 0) {
        return `${days} day${days !== 1 ? "s" : ""} ${hours} hr${hours !== 1 ? "s" : ""}`
      }

      if (minutes > 0) {
        return `${days} day${days !== 1 ? "s" : ""} ${minutes} mins`
      }

      return `${days} day${days !== 1 ? "s" : ""}`
    }

    if (hours > 0 && minutes > 0) {
      return `${hours} hr${hours !== 1 ? "s" : ""} ${minutes} mins`
    }

    if (hours > 0) {
      return `${hours} hr${hours !== 1 ? "s" : ""}`
    }

    return `${minutes} mins`
  }

  // ==========================================
  // VALIDATE MANUAL DATE/TIME INPUT
  // ==========================================

  const isValidDateTime = (value: string) => {

    if (!value) {
      return false
    }

    if (
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(
        value
      )
    ) {
      return false
    }

    const date = new Date(value)

    return !Number.isNaN(date.getTime())
  }

  // ==========================================
  // HANDLE DATE CHANGE
  // ==========================================

  const handleDateChange = async (
    vehicleId: string,
    vehicleType:string,
    field:
      | "startDate"
      | "endDate",
    value: string
  ) => {

    // Do not allow the calendar Clear option
    // to remove a required booking date.
    if (!value) {
      return
    }

    // Validate the value before storing it.
    // This also protects against invalid manual input.
    if (!isValidDateTime(value)) {
      alert(
        "Please enter a valid date and time."
      )
      return
    }

    const item = vehicles.find(
      (item) => item.vehicle._id === vehicleId
    )

    if (!item) {
      return
    }

    // Start date must be before end date.
    if (
      field === "startDate" &&
      item.endDate &&
      new Date(value) >= new Date(item.endDate)
    ) {
      alert(
        "Pick-up date and time must be before the drop-off date and time."
      )
      return
    }

    // End date must be after start date.
    if (
      field === "endDate" &&
      item.startDate &&
      new Date(value) <= new Date(item.startDate)
    ) {
      alert(
        "Drop-off date and time must be after the pick-up date and time."
      )
      return
    }
    const updatedStartDate =
      field === "startDate"
      ? value
      : item.startDate

   const updatedEndDate =
      field === "endDate"
      ? value
      : item.endDate

    setVehicles((prevVehicles) =>

      prevVehicles.map((item) => {

        if (
          item.vehicle._id !==
          vehicleId
        ) {
          return item
        }

        return {
          ...item,

          [field]: value,
        }
      })
    )
   
    try{
       const response = await api.post(`/user/datevalidate/${vehicleId}`,{
      vehicleType ,
      startDate:updatedStartDate, 
      endDate :updatedEndDate
    })

    console.log(response.data)

    }catch(error:any){
      toast.error(error.response.data)
    }
  }


  // ==========================================
  // CALCULATE RENTAL AMOUNT
  // ==========================================

const rentalAmount =
  vehicles.reduce(
    (total, item) => {

      const duration =
        getDuration(
          item.startDate,
          item.endDate
        )

      return (
        total +
        item.vehicle.rent *
          duration
      )
    },
    0
  )

  // ==========================================
  // TOTAL
  // ==========================================

  const total =
    rentalAmount +
    platformFee

  // ==========================================
  // VALIDATE FORM
  // ==========================================

  const validateForm = () => {

    const newErrors:
      Record<string, string> = {}

    // Full name

    if (
      !formData.fullName.trim()
    ) {

      newErrors.fullName =
        "Please enter your full name."

    } else if (
      formData.fullName.trim()
        .length < 2
    ) {

      newErrors.fullName =
        "Name must be at least 2 characters."
    }

    // Email

    if (
      !formData.email.trim()
    ) {

      newErrors.email =
        "Please enter your email address."

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {

      newErrors.email =
        "Please enter a valid email address."
    }

    // Phone

    if (
      !formData.phone.trim()
    ) {

      newErrors.phone =
        "Please enter your phone number."

    } else if (
      !/^[0-9]{10}$/.test(
        formData.phone
      )
    ) {

      newErrors.phone =
        "Phone number must contain exactly 10 digits."
    }

    // Pickup

    if (
      !formData.pickupLocation.trim()
    ) {

      newErrors.pickupLocation =
        "Please enter the pickup location."
    }

    // Drop-off

    if (
      !formData.dropoffLocation.trim()
    ) {

      newErrors.dropoffLocation =
        "Please enter the drop-off location."
    }

    // Driving license

    if (
      !formData.drivingLicense.trim()
    ) {

      newErrors.drivingLicense =
        "Please enter your driving license number."
    }

    // Terms

    if (!formData.terms) {

      newErrors.terms =
        "You must agree to the booking terms."
    }

    setErrors(newErrors)

    return (
      Object.keys(newErrors)
        .length === 0
    )
  }

  // ==========================================
  // CONFIRM BOOKING
  // ==========================================

  const handleConfirmBooking = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault()
    console.log("Entered into handle func")
    if (!validateForm()) {
      return
    }

    if (!vehicles.length) {
      setErrors({
        general:
          "No vehicle selected for booking.",
      })

      return
    }
   console.log("gng to enter into try block")
    setIsSubmitting(true)

    try {

      // ==========================================
      // BOOKING DATA
      // ==========================================
     console.log("entered into try block")
      const bookingData = {

        vehicles:
          vehicles.map((item) => ({

            vehicleId:
              item.vehicle._id,

            vehicleType:
              item.vehicleType,

            startDate:
              new Date(
                item.startDate
              ).toISOString(),

            endDate:
              new Date(
                item.endDate
              ).toISOString(),
          })),


        pickupLocation:
          formData.pickupLocation,

        dropoffLocation:
          formData.dropoffLocation,

        drivingLicense:
          formData.drivingLicense,

        specialRequest:
          formData.specialRequest,

        paymentMethod:
          formData.paymentMethod,
      }

      console.log(
        "BOOKING DATA:",
        bookingData
      )

     const response = await api.post("/user/booking",bookingData)

     console.log(response.data)
     toast.success("Your Booking is Confirmed")
      setIsSuccess(true)

    } catch (error) {

      console.error(error)

      setErrors({
        general:
          "Unable to confirm your booking. Please try again.",
      })

    } finally {

      setIsSubmitting(false)
    }
  }

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (isLoading) {

    return (
      <main className="min-h-screen bg-[#f5f5f0]">

        <section className="flex min-h-screen items-center justify-center">

          <div className="text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

            <p className="mt-4 text-sm text-gray-500">
              Loading booking details...
            </p>

          </div>

        </section>

      </main>
    )
  }

  // ==========================================
  // NO VEHICLE SCREEN
  // ==========================================

  if (!vehicles.length) {

    return (
      <main className="min-h-screen bg-[#f5f5f0]">

        <section className="flex min-h-screen items-center justify-center px-6">

          <div className="text-center">

            <h1 className="text-2xl font-black text-gray-900">
              No vehicle found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              We couldn't find any vehicle for this booking.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              className="
                mt-6
                rounded-xl
                bg-orange-500
                px-6
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-orange-600
              "
            >
              Back to Home
            </button>

          </div>

        </section>

      </main>
    )
  }

  // ==========================================
  // SUCCESS SCREEN
  // ==========================================

  if (isSuccess) {

    return (
      <main className="min-h-screen bg-[#f5f5f0]">

        <section className="flex min-h-screen items-center justify-center px-6 py-20">

          <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-[0_12px_40px_rgba(0,0,0,0.07)]">

            <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-green-50">

              <span className="text-4xl text-green-500">
                ✓
              </span>

            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Booking Confirmed
            </p>

            <h1 className="mt-2 text-3xl font-black text-gray-900">
              You're all set!
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">

              Your booking request for{" "}

              {vehicles.length === 1
                ? vehicles[0].vehicle.model
                : `${vehicles.length} vehicles`}

              {" "}has been successfully submitted.

            </p>

            <div className="mt-7 rounded-2xl bg-[#f5f5f0] p-5 text-left">

              <div className="flex justify-between">

                <span className="text-sm text-gray-500">
                  Vehicles
                </span>

                <span className="text-sm font-bold text-gray-900">
                  {vehicles.length}
                </span>

              </div>

              <div className="mt-3">

                <p className="text-sm text-gray-500">
                  Booked vehicles
                </p>

                <div className="mt-2 space-y-1">

                  {vehicles.map(
                    (item) => (

                      <p
                        key={
                          item.vehicle._id
                        }
                        className="text-sm font-semibold text-gray-900"
                      >
                        {item.vehicle.company}{" "}
                        {item.vehicle.model}
                      </p>

                    )
                  )}

                </div>

              </div>

              <div className="mt-3 flex justify-between">

                <span className="text-sm text-gray-500">
                  Rental
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  ₹
                  {rentalAmount.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              <div className="mt-3 flex justify-between">

                <span className="text-sm text-gray-500">
                  Platform fee
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  ₹{platformFee}
                </span>

              </div>

              <div className="mt-3 flex justify-between border-t border-gray-200 pt-3">

                <span className="text-sm font-semibold text-gray-600">
                  Total
                </span>

                <span className="text-lg font-black text-orange-500">
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/user/bookings"
                )
              }
              className="
                mt-7
                w-full
                rounded-xl
                bg-orange-500
                py-3.5
                text-sm
                font-black
                text-white
                shadow-[0_8px_20px_rgba(249,115,22,0.25)]
                transition-all
                hover:-translate-y-0.5
                hover:bg-orange-600
              "
            >
              View My Bookings
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              className="
                mt-3
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                py-3.5
                text-sm
                font-bold
                text-gray-600
                transition
                hover:border-orange-300
                hover:bg-orange-50
                hover:text-orange-500
              "
            >
              Back to Home
            </button>

          </div>

        </section>

      </main>
    )
  }

  // ==========================================
  // MAIN BOOKING PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-[#f5f5f0]">

      <section className="px-6 pb-20 pt-12">

        <div className="mx-auto max-w-7xl">

          {/* PAGE HEADER */}

          <div className="mb-8">

            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
              Final Step
            </p>

            <h1 className="text-4xl font-black tracking-tight text-gray-900">
              Confirm your booking
            </h1>

            <p className="mt-2 text-gray-500">
              Enter your details to complete your vehicle booking.
            </p>

          </div>

          <form
            onSubmit={
              handleConfirmBooking
            }
          >

            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">

              {/* ==========================================
                  LEFT SIDE
              ========================================== */}

              <div className="space-y-6">

                {/* CUSTOMER DETAILS */}

                <div className="rounded-2xl border border-gray-200 bg-white p-6">

                  <div className="mb-5">

                    <h2 className="text-lg font-bold text-gray-900">
                      Personal information
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      We'll use these details for your booking.
                    </p>

                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    {/* FULL NAME */}

                    <div className="sm:col-span-2">

                      <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                        Full name
                      </label>

                      <input
                        type="text"
                        name="fullName"
                        value={
                          formData.fullName
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter your full name"
                        className={`
                          w-full rounded-xl border
                          ${
                            errors.fullName
                              ? "border-red-400"
                              : "border-gray-200"
                          }
                          bg-gray-50
                          px-4 py-3
                          text-sm
                          outline-none
                          transition
                          focus:border-orange-400
                          focus:ring-4
                          focus:ring-orange-500/10
                        `}
                      />

                      {errors.fullName && (

                        <p className="mt-1.5 text-xs font-medium text-red-500">
                          {errors.fullName}
                        </p>

                      )}

                    </div>

                    {/* EMAIL */}

                    <div>

                      <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                        Email address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={
                          formData.email
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="you@example.com"
                        className={`
                          w-full rounded-xl border
                          ${
                            errors.email
                              ? "border-red-400"
                              : "border-gray-200"
                          }
                          bg-gray-50
                          px-4 py-3
                          text-sm
                          outline-none
                          transition
                          focus:border-orange-400
                          focus:ring-4
                          focus:ring-orange-500/10
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

                      <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                        Phone number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={
                          formData.phone
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="98765 43210"
                        className={`
                          w-full rounded-xl border
                          ${
                            errors.phone
                              ? "border-red-400"
                              : "border-gray-200"
                          }
                          bg-gray-50
                          px-4 py-3
                          text-sm
                          outline-none
                          transition
                          focus:border-orange-400
                          focus:ring-4
                          focus:ring-orange-500/10
                        `}
                      />

                      {errors.phone && (

                        <p className="mt-1.5 text-xs font-medium text-red-500">
                          {errors.phone}
                        </p>

                      )}

                    </div>

                  </div>

                </div>

                {/* RENTAL DETAILS */}

                <div className="rounded-2xl border border-gray-200 bg-white p-6">

                  <div className="mb-5">

                    <h2 className="text-lg font-bold text-gray-900">
                      Rental details
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Confirm where you'll collect and return the vehicle.
                    </p>

                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    {/* PICKUP */}

                    <div>

                      <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                        Pickup location
                      </label>

                      <input
                        type="text"
                        name="pickupLocation"
                        value={
                          formData.pickupLocation
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter pickup location"
                        className={`
                          w-full rounded-xl border
                          ${
                            errors.pickupLocation
                              ? "border-red-400"
                              : "border-gray-200"
                          }
                          bg-gray-50
                          px-4 py-3
                          text-sm
                          outline-none
                          transition
                          focus:border-orange-400
                          focus:ring-4
                          focus:ring-orange-500/10
                        `}
                      />

                      {errors.pickupLocation && (

                        <p className="mt-1.5 text-xs font-medium text-red-500">
                          {errors.pickupLocation}
                        </p>

                      )}

                    </div>

                    {/* DROP OFF */}

                    <div>

                      <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                        Drop-off location
                      </label>

                      <input
                        type="text"
                        name="dropoffLocation"
                        value={
                          formData.dropoffLocation
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter drop-off location"
                        className={`
                          w-full rounded-xl border
                          ${
                            errors.dropoffLocation
                              ? "border-red-400"
                              : "border-gray-200"
                          }
                          bg-gray-50
                          px-4 py-3
                          text-sm
                          outline-none
                          transition
                          focus:border-orange-400
                          focus:ring-4
                          focus:ring-orange-500/10
                        `}
                      />

                      {errors.dropoffLocation && (

                        <p className="mt-1.5 text-xs font-medium text-red-500">
                          {errors.dropoffLocation}
                        </p>

                      )}

                    </div>

                    {/* LICENSE */}

                    <div className="sm:col-span-2">

                      <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                        Driving license number
                      </label>

                      <input
                        type="text"
                        name="drivingLicense"
                        value={
                          formData.drivingLicense
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter your driving license number"
                        className={`
                          w-full rounded-xl border
                          ${
                            errors.drivingLicense
                              ? "border-red-400"
                              : "border-gray-200"
                          }
                          bg-gray-50
                          px-4 py-3
                          text-sm
                          uppercase
                          outline-none
                          transition
                          focus:border-orange-400
                          focus:ring-4
                          focus:ring-orange-500/10
                        `}
                      />

                      {errors.drivingLicense && (

                        <p className="mt-1.5 text-xs font-medium text-red-500">
                          {errors.drivingLicense}
                        </p>

                      )}

                      <p className="mt-1.5 text-[11px] text-gray-400">
                        Your license may be required when collecting the vehicle.
                      </p>

                    </div>

                    {/* SPECIAL REQUEST */}

                    <div className="sm:col-span-2">

                      <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                        Special request

                        <span className="ml-1 font-normal text-gray-400">
                          (optional)
                        </span>
                      </label>

                      <textarea
                        name="specialRequest"
                        value={
                          formData.specialRequest
                        }
                        onChange={
                          handleChange
                        }
                        rows={3}
                        placeholder="Anything we should know?"
                        className="
                          w-full
                          resize-none
                          rounded-xl
                          border border-gray-200
                          bg-gray-50
                          px-4 py-3
                          text-sm
                          outline-none
                          transition
                          placeholder:text-gray-400
                          focus:border-orange-400
                          focus:ring-4
                          focus:ring-orange-500/10
                        "
                      />

                    </div>

                  </div>

                </div>

                {/* PAYMENT */}

                <div className="rounded-2xl border border-gray-200 bg-white p-6">

                  <div className="mb-5">

                    <h2 className="text-lg font-bold text-gray-900">
                      Payment
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Choose how you'd like to proceed with payment.
                    </p>

                  </div>

                  <div className="space-y-3">

                    {/* PAY LATER */}

                    <label
                      className={`
                        flex cursor-pointer items-center justify-between
                        rounded-xl border p-4
                        transition
                        ${
                          formData.paymentMethod ===
                          "pay_at_pickup"
                            ? "border-orange-400 bg-orange-50/40"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >

                      <div className="flex items-center gap-3">

                        <input
                          type="radio"
                          name="paymentMethod"
                          value="pay_at_pickup"
                          checked={
                            formData.paymentMethod ===
                            "pay_at_pickup"
                          }
                          onChange={
                            handleChange
                          }
                          className="accent-orange-500"
                        />

                        <div>

                          <p className="text-sm font-bold text-gray-800">
                            Pay at pickup
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            Payment handled when you collect the vehicle.
                          </p>

                        </div>

                      </div>

                    </label>

                    {/* ONLINE */}

                    <label
                      className={`
                        flex cursor-pointer items-center justify-between
                        rounded-xl border p-4
                        transition
                        ${
                          formData.paymentMethod ===
                          "online"
                            ? "border-orange-400 bg-orange-50/40"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >

                      <div className="flex items-center gap-3">

                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={
                            formData.paymentMethod ===
                            "online"
                          }
                          onChange={
                            handleChange
                          }
                          className="accent-orange-500"
                        />

                        <div>

                          <p className="text-sm font-bold text-gray-800">
                            Pay online
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            Online payment integration can be connected later.
                          </p>

                        </div>

                      </div>

                    </label>

                  </div>

                </div>

                {/* GENERAL ERROR */}

                {errors.general && (

                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                    <p className="text-sm font-medium text-red-600">
                      {errors.general}
                    </p>

                  </div>

                )}

                {/* TERMS */}

                <div>

                  <div className="flex items-start gap-3">

                    <input
                      id="bookingTerms"
                      name="terms"
                      type="checkbox"
                      checked={
                        formData.terms
                      }
                      onChange={
                        handleChange
                      }
                      className="mt-0.5 h-4 w-4 shrink-0 accent-orange-500"
                    />

                    <label
                      htmlFor="bookingTerms"
                      className="text-xs leading-5 text-gray-500"
                    >

                      I confirm that the information provided is
                      accurate and agree to RideX's{" "}

                      <button
                        type="button"
                        className="font-semibold text-gray-700 hover:text-orange-500"
                      >
                        Booking Terms
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

                {/* CONFIRM BUTTON */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    w-full
                    rounded-xl
                    bg-orange-500
                    py-4
                    text-sm
                    font-black
                    text-white
                    shadow-[0_8px_20px_rgba(249,115,22,0.25)]
                    transition-all
                    hover:-translate-y-0.5
                    hover:bg-orange-600
                    hover:shadow-[0_12px_25px_rgba(249,115,22,0.32)]
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                  "
                >

                  {isSubmitting
                    ? "Confirming Booking..."
                    : "Confirm Booking"}

                </button>

              </div>


              {/* ==========================================
                  RIGHT SIDE — BOOKING SUMMARY
              ========================================== */}

              <div className="h-fit lg:sticky lg:top-8">

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)]">

                  {/* SUMMARY HEADER */}

                  <div className="border-b border-gray-100 p-5">

                    <p className="text-2xl font-extrabold uppercase tracking-[0.16em] text-orange-500">
                      Booking Summary
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Review your selected vehicles.
                    </p>

                  </div>


                  {/* ==========================================
                      CAR SERIES
                  ========================================== */}

                  {cars.length > 0 && (

                    <div className="border-b border-gray-100 p-4">

                      {/* SERIES HEADER */}

                      <div className="mb-3 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <span className="text-base">
                            🚗
                          </span>

                          <div>

                            <h3 className="text-sm font-bold text-gray-900">
                              Cars
                            </h3>

                            <p className="text-[10px] text-gray-400">
                              {carIndex + 1} of {cars.length}
                            </p>

                          </div>

                        </div>


                        {/* CAR ARROWS */}

                        {cars.length > 1 && (

                          <div className="flex items-center gap-1">

                            <button
                              type="button"
                              onClick={
                                handlePreviousCar
                              }
                              className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-gray-200
                                bg-white
                                text-gray-500
                                transition
                                hover:border-orange-300
                                hover:bg-orange-50
                                hover:text-orange-500
                              "
                              aria-label="Previous car"
                            >
                              ‹
                            </button>

                            <button
                              type="button"
                              onClick={
                                handleNextCar
                              }
                              className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-gray-200
                                bg-white
                                text-gray-500
                                transition
                                hover:border-orange-300
                                hover:bg-orange-50
                                hover:text-orange-500
                              "
                              aria-label="Next car"
                            >
                              ›
                            </button>

                          </div>

                        )}

                      </div>


                      {/* CURRENT CAR */}

                      {(() => {

                        const item =
                          cars[carIndex]

                        return (

                          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3">

                            {/* VEHICLE */}

                            <div className="flex gap-3">

                              <div className="
                                flex
                                h-16
                                w-20
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-lg
                                bg-white
                              ">

                                <img
                                  src={
                                    item.vehicle.images?.[0]
                                  }
                                  alt={
                                    item.vehicle.model
                                  }
                                  className="h-full w-full object-contain"
                                />

                              </div>


                              <div className="min-w-0 flex-1">

                                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                  {
                                    item.vehicle.company
                                  }
                                </p>

                                <h4 className="mt-0.5 truncate text-sm font-black text-gray-900">
                                  {
                                    item.vehicle.model
                                  }
                                </h4>

                                <div className="mt-1 flex items-center gap-1.5">

                                  <span className="text-[10px] font-semibold text-gray-600">
                                    ₹
                                    {
                                      item.vehicle.rent
                                    }
                                    /hr
                                  </span>

                                  <span className="text-gray-300">
                                    •
                                  </span>

                                  <span className="text-[10px] font-semibold text-orange-500">
                                    {formatDuration(
                                      item.startDate,
                                      item.endDate
                                    )}
                                  </span>

                                </div>

                              </div>

                            </div>


                            {/* DATES */}

                            <div className="mt-3 grid grid-cols-2 gap-2">

                              <div className="rounded-lg bg-white px-2.5 py-2">

                                <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                                  Pick-up
                                </p>

                                <p className="mt-1 text-[10px] font-semibold leading-4 text-gray-700">
                                  {
                                    formatDate(
                                      item.startDate
                                    )
                                  }
                                </p>

                              </div>


                              <div className="rounded-lg bg-white px-2.5 py-2">

                                <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                                  Drop-off
                                </p>

                                <p className="mt-1 text-[10px] font-semibold leading-4 text-gray-700">
                                  {
                                    formatDate(
                                      item.endDate
                                    )
                                  }
                                </p>

                              </div>

                            </div>


                            {/* DATE CONTROLS */}

                            <div className="mt-2 grid grid-cols-2 gap-2">

                              <input
                                type="datetime-local"
                                value={
                                  formatDateTimeLocal(
                                    item.startDate
                                  )
                                }
                                max={
                                  formatDateTimeLocal(
                                    item.endDate
                                  )
                                }
                                onChange={(e) =>
                                  handleDateChange(
                                    item.vehicle._id,
                                    "car",
                                    "startDate",
                                    e.target.value
                                  )
                                }
                                className="
                                  w-full
                                  rounded-lg
                                  border
                                  border-gray-200
                                  bg-white
                                  px-2
                                  py-2
                                  text-[9px]
                                  font-semibold
                                  text-gray-600
                                  outline-none
                                  transition
                                  focus:border-orange-400
                                  focus:ring-2
                                  focus:ring-orange-500/10
                                "
                              />

                              <input
                                type="datetime-local"
                                value={
                                  formatDateTimeLocal(
                                    item.endDate
                                  )
                                }
                                min={
                                  formatDateTimeLocal(
                                    item.startDate
                                  )
                                }
                                onChange={(e) =>
                                  handleDateChange(
                                    item.vehicle._id,
                                    "car",
                                    "endDate",
                                    e.target.value
                                  )
                                }
                                className="
                                  w-full
                                  rounded-lg
                                  border
                                  border-gray-200
                                  bg-white
                                  px-2
                                  py-2
                                  text-[9px]
                                  font-semibold
                                  text-gray-600
                                  outline-none
                                  transition
                                  focus:border-orange-400
                                  focus:ring-2
                                  focus:ring-orange-500/10
                                "
                              />

                            </div>

                          </div>

                        )

                      })()}

                    </div>

                  )}


                  {/* ==========================================
                      BIKE SERIES
                  ========================================== */}

                  {bikes.length > 0 && (

                    <div className="border-b border-gray-100 p-4">

                      {/* SERIES HEADER */}

                      <div className="mb-3 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <span className="text-base">
                            🏍️
                          </span>

                          <div>

                            <h3 className="text-sm font-bold text-gray-900">
                              Bikes
                            </h3>

                            <p className="text-[10px] text-gray-400">
                              {bikeIndex + 1} of {bikes.length}
                            </p>

                          </div>

                        </div>


                        {/* BIKE ARROWS */}

                        {bikes.length > 1 && (

                          <div className="flex items-center gap-1">

                            <button
                              type="button"
                              onClick={
                                handlePreviousBike
                              }
                              className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-gray-200
                                bg-white
                                text-gray-500
                                transition
                                hover:border-orange-300
                                hover:bg-orange-50
                                hover:text-orange-500
                              "
                              aria-label="Previous bike"
                            >
                              ‹
                            </button>

                            <button
                              type="button"
                              onClick={
                                handleNextBike
                              }
                              className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-gray-200
                                bg-white
                                text-gray-500
                                transition
                                hover:border-orange-300
                                hover:bg-orange-50
                                hover:text-orange-500
                              "
                              aria-label="Next bike"
                            >
                              ›
                            </button>

                          </div>

                        )}

                      </div>


                      {/* CURRENT BIKE */}

                      {(() => {

                        const item =
                          bikes[bikeIndex]

                        return (

                          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3">

                            {/* VEHICLE */}

                            <div className="flex gap-3">

                              <div className="
                                flex
                                h-16
                                w-20
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-lg
                                bg-white
                              ">

                                <img
                                  src={
                                    item.vehicle.images?.[0]
                                  }
                                  alt={
                                    item.vehicle.model
                                  }
                                  className="h-full w-full object-contain"
                                />

                              </div>


                              <div className="min-w-0 flex-1">

                                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                  {
                                    item.vehicle.company
                                  }
                                </p>

                                <h4 className="mt-0.5 truncate text-sm font-black text-gray-900">
                                  {
                                    item.vehicle.model
                                  }
                                </h4>

                                <div className="mt-1 flex items-center gap-1.5">

                                  <span className="text-[10px] font-semibold text-gray-600">
                                    ₹
                                    {
                                      item.vehicle.rent
                                    }
                                    /hr
                                  </span>

                                  <span className="text-gray-300">
                                    •
                                  </span>

                                  <span className="text-[10px] font-semibold text-orange-500">
                                    {formatDuration(
                                      item.startDate,
                                      item.endDate
                                    )}
                                  </span>

                                </div>

                              </div>

                            </div>


                            {/* DATES */}

                            <div className="mt-3 grid grid-cols-2 gap-2">

                              <div className="rounded-lg bg-white px-2.5 py-2">

                                <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                                  Pick-up
                                </p>

                                <p className="mt-1 text-[10px] font-semibold leading-4 text-gray-700">
                                  {
                                    formatDate(
                                      item.startDate
                                    )
                                  }
                                </p>

                              </div>


                              <div className="rounded-lg bg-white px-2.5 py-2">

                                <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                                  Drop-off
                                </p>

                                <p className="mt-1 text-[10px] font-semibold leading-4 text-gray-700">
                                  {
                                    formatDate(
                                      item.endDate
                                    )
                                  }
                                </p>

                              </div>

                            </div>


                            {/* DATE CONTROLS */}

                            <div className="mt-2 grid grid-cols-2 gap-2">

                              <input
                                type="datetime-local"
                                value={
                                  formatDateTimeLocal(
                                    item.startDate
                                  )
                                }
                                max={
                                  formatDateTimeLocal(
                                    item.endDate
                                  )
                                }
                                onChange={(e) =>
                                  handleDateChange(
                                    item.vehicle._id,
                                    "bike",
                                    "startDate",
                                    e.target.value
                                  )
                                }
                                className="
                                  w-full
                                  rounded-lg
                                  border
                                  border-gray-200
                                  bg-white
                                  px-2
                                  py-2
                                  text-[9px]
                                  font-semibold
                                  text-gray-600
                                  outline-none
                                  transition
                                  focus:border-orange-400
                                  focus:ring-2
                                  focus:ring-orange-500/10
                                "
                              />

                              <input
                                type="datetime-local"
                                value={
                                  formatDateTimeLocal(
                                    item.endDate
                                  )
                                }
                                min={
                                  formatDateTimeLocal(
                                    item.startDate
                                  )
                                }
                                onChange={(e) =>
                                  handleDateChange(
                                    item.vehicle._id,
                                    "bike",
                                    "endDate",
                                    e.target.value
                                  )
                                }
                                className="
                                  w-full
                                  rounded-lg
                                  border
                                  border-gray-200
                                  bg-white
                                  px-2
                                  py-2
                                  text-[9px]
                                  font-semibold
                                  text-gray-600
                                  outline-none
                                  transition
                                  focus:border-orange-400
                                  focus:ring-2
                                  focus:ring-orange-500/10
                                "
                              />

                            </div>

                          </div>

                        )

                      })()}

                    </div>

                  )}


                  {/* ==========================================
                      PRICE
                  ========================================== */}

                  <div className="p-5">

                    <div className="space-y-3">

                      <div className="flex justify-between text-sm">

                        <span className="text-gray-500">
                          Rental
                        </span>

                        <span className="font-semibold text-gray-700">
                          ₹
                          {rentalAmount.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </div>


                      <div className="flex justify-between text-sm">

                        <span className="text-gray-500">
                          Platform fee
                        </span>

                        <span className="font-semibold text-gray-700">
                          ₹{platformFee}
                        </span>

                      </div>

                    </div>


                    <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-5">

                      <span className="text-sm font-semibold text-gray-600">
                        Total
                      </span>

                      <span className="text-2xl font-black text-orange-500">
                        ₹
                        {total.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                  </div>

                </div>


                <p className="mt-4 text-center text-[11px] leading-5 text-gray-400">
                  Your booking will be confirmed after your information is successfully submitted.
                </p>

              </div>

            </div>

          </form>

        </div>

      </section>

    </main>
  )
}

export default Bookingform
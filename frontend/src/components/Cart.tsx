import Navbar from "./Navbar"
import { useState, useEffect, useRef, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Trash2 } from "lucide-react"
import { toast } from "react-toastify"
import { AuthContext } from "./Authentication/AuthContext"
import { api } from "./Authentication/axiosInterseptors"

function Cart() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn,authLoading } = useContext(AuthContext)

  const [cartItems, setCartItems] = useState<any[]>([])
  const [fetchingCart, setFetchingCart] = useState(true)

  const dateInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // ==========================================
  // FETCH CART
  // ==========================================

  useEffect(() => {
    if (!isLoggedIn) {
      setFetchingCart(false)
      return
    }

    const fetch_cartVehicles = async () => {
      try {
        setFetchingCart(true)

        const response = await api.get(
          "/user/cart/vehicles"
        )

        setCartItems(response.data)
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
          error.response?.data ||
          "Failed to load cart"
        )
      } finally {
        setFetchingCart(false)
      }
    }

    fetch_cartVehicles()
  }, [isLoggedIn])

  // ==========================================
  // CALCULATE RENTAL DURATION
  // ==========================================

  const calculateDuration = (
    startDate: string,
    endDate: string
  ) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const difference =
      end.getTime() - start.getTime()

    const duration =
      difference / (1000 * 60 * 60)

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
  // FORMAT DATETIME LOCAL
  // ==========================================

  const formatDateTimeLocal = (
    dateString: string
  ) => {
    const date = new Date(dateString)

    const offset =
      date.getTimezoneOffset() * 60000

    return new Date(
      date.getTime() - offset
    )
      .toISOString()
      .slice(0, 20)
  }

  // ==========================================
  // REMOVE VEHICLE
  // ==========================================

  const handleRemove = async (
    vehicleId: string
  ) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          item.vehicle._id !== vehicleId
      )
    )

    // ==========================================
    // API
    // ==========================================

    try {
      const response = await api.delete(
        `/user/cart/${vehicleId}`
      )

      console.log(response.data)
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to remove vehicle"
      )
    }
  }

  // ==========================================
  // FORMAT DATE
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
  // OPEN DATE PICKER
  // ==========================================

  const openDatePicker = (
    inputId: string
  ) => {
    const input =
      dateInputRefs.current[inputId]

    if (input) {
      input.showPicker()
    }
  }

  // ==========================================
  // CHANGE START DATE
  // ==========================================

  const handleStartDateChange = async (
    vehicleId: string,
    newStartDate: string
  ) => {
    if (!newStartDate) {
      return
    }

    const item = cartItems.find(
      (item) =>
        item.vehicle._id === vehicleId
    )

    if (!item) return

    if (
      item.endDate &&
      new Date(newStartDate) >=
        new Date(item.endDate)
    ) {
      alert(
        "Start date must be before the end date"
      )
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.vehicle._id === vehicleId
          ? {
              ...item,
              startDate: newStartDate,
            }
          : item
      )
    )

    const dates = {
      startDate: newStartDate,
      endDate: item.endDate,
    }

    // ==========================================
    // API
    // ==========================================

    try {
      const response = await api.patch(
        `/user/cart/dateChange/${vehicleId}`,
        dates
      )

      toast.success(
        response.data.message
      )

      console.log(response.data)
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to update date"
      )
    }
  }

  // ==========================================
  // CHANGE END DATE
  // ==========================================

  const handleEndDateChange = async (
    vehicleId: string,
    newEndDate: string
  ) => {
    if (!newEndDate) {
      return
    }

    const item = cartItems.find(
      (item) =>
        item.vehicle._id === vehicleId
    )

    if (!item) return

    if (
      item.startDate &&
      new Date(newEndDate) <=
        new Date(item.startDate)
    ) {
      alert(
        "End date must be after the start date"
      )
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.vehicle._id === vehicleId
          ? {
              ...item,
              endDate: newEndDate,
            }
          : item
      )
    )

    const dates = {
      startDate: item.startDate,
      endDate: newEndDate,
    }

    // ==========================================
    // API
    // ==========================================

    try {
      const response = await api.patch(
        `/user/cart/dateChange/${vehicleId}`,
        dates
      )

      toast.success(
        response.data.message
      )
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to update date"
      )
    }
  }

  // ==========================================
  // BOOK NOW / PROCEED TO BOOKING
  // ==========================================

  const handleBooking = () => {
    if (authLoading) {
       return <div>Loading...</div>;
    }
    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: location
        }
      })
      return
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty")
      return
    }

    navigate("/user/booking/cart")
  }

  // ==========================================
  // CALCULATE SUBTOTAL
  // ==========================================

  const subtotal = cartItems.reduce(
    (total, item) => {
      const duration =
        calculateDuration(
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

  const platformFee = 99

  const total =
    subtotal + platformFee

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-[#f5f5f0]">

      <Navbar />

      <section className="px-6 pb-20 pt-32">

        <div className="mx-auto max-w-6xl">

          {/* HEADER */}

          <div className="mb-10">

            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
              Your Rides
            </p>

            <h1 className="text-4xl font-black tracking-tight text-gray-900">
              Your Cart
            </h1>

            <p className="mt-2 text-gray-500">
              Review your selected vehicles before booking.
            </p>

          </div>


          {/* =================================================
              NOT LOGGED IN
          ================================================= */}

          {!isLoggedIn ? (

            <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-[0_8px_30px_rgba(0,0,0,0.05)]">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">

                <span className="text-3xl">
                  🔐
                </span>

              </div>

              <h2 className="mt-5 text-2xl font-black text-gray-900">
                Login to view your cart
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Please login to access your saved vehicles
                and continue with your booking.
              </p>

              <button
                onClick={() => navigate("/login", {
                  state: {
                    from: location
                  }
                })}
                className="
                  mt-6
                  rounded-xl
                  bg-orange-500
                  px-7
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_8px_20px_rgba(249,115,22,0.25)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-orange-600
                "
              >
                Login to Continue
              </button>

            </div>

          ) : fetchingCart ? (

            <div className="flex min-h-90 flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)]">

              <div className="relative flex h-16 w-16 items-center justify-center">

                {/* Outer ring */}
                <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

                {/* Inner ring */}
                <div className="absolute h-9 w-9 animate-spin rounded-full border-4 border-gray-100 border-b-gray-900 [animation-direction:reverse]" />

              </div>

              <p className="mt-6 text-base font-semibold text-gray-700">
                Loading your cart
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Fetching your saved vehicles...
              </p>

            </div>

          ) : cartItems.length === 0 ? (

            /* =================================================
               EMPTY CART
            ================================================= */

            <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-[0_8px_30px_rgba(0,0,0,0.05)]">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">

                <span className="text-3xl">
                  🛒
                </span>

              </div>

              <h2 className="mt-5 text-2xl font-black text-gray-900">
                Your cart is empty
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Add a vehicle to start your rental.
              </p>

              <button
                onClick={() =>
                  navigate("/user/cars")
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
                  shadow-[0_8px_20px_rgba(249,115,22,0.25)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-orange-600
                "
              >
                Browse Vehicles
              </button>

            </div>

          ) : (

            /* =================================================
               CART WITH ITEMS
            ================================================= */

            <div className="grid gap-7 lg:grid-cols-[1fr_360px]">

              {/* =================================================
                  ITEMS
              ================================================= */}

              <div className="space-y-4">

                {cartItems.map((item) => {

                  const duration =
                    calculateDuration(
                      item.startDate,
                      item.endDate
                    )

                  return (

                    <div
                      key={item.vehicle._id}
                      className="
                        rounded-2xl
                        border border-gray-200
                        bg-white
                        p-4
                        shadow-[0_5px_20px_rgba(0,0,0,0.04)]
                        transition
                        hover:shadow-[0_8px_25px_rgba(0,0,0,0.07)]
                      "
                    >

                      <div className="flex flex-col gap-4 sm:flex-row">

                        {/* IMAGE */}

                        <div
                          className="
                            flex
                            h-32
                            w-full
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-xl
                            bg-[#f5f5f0]
                            sm:h-32
                            sm:w-44
                          "
                        >

                          <img
                            src={
                              item.vehicle.images?.[0]
                            }
                            alt={
                              item.vehicle.model
                            }
                            className="
                              h-full
                              w-full
                              object-contain
                            "
                          />

                        </div>


                        {/* VEHICLE INFORMATION */}

                        <div className="flex min-w-0 flex-1 flex-col">

                          {/* VEHICLE NAME + REMOVE */}

                          <div className="flex items-start justify-between">

                            <div>

                              <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-500">
                                {
                                  item.vehicle.company
                                }
                              </p>

                              <h2 className="mt-0.5 text-xl font-bold text-gray-900">
                                {
                                  item.vehicle.model
                                }
                              </h2>

                            </div>


                            {/* REMOVE */}

                            <button
                              onClick={() =>
                                handleRemove(
                                  item.vehicle._id
                                )
                              }
                              className="
                                rounded-lg
                                p-1.5
                                text-gray-400
                                transition
                                hover:bg-red-50
                                hover:text-red-500
                              "
                              title="Remove vehicle"
                            >
                              <Trash2
                                size={18}
                                strokeWidth={1.8}
                              />
                            </button>

                          </div>


                          {/* PRICE + DURATION */}

                          <div className="mt-2.5 flex flex-wrap gap-2">

                            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                              ₹
                              {
                                item.vehicle.rent
                              }
                              /hr
                            </span>

                            <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-500">
                              {formatDuration(
                                item.startDate,
                                item.endDate
                              )}
                            </span>

                          </div>


                          {/* DATES */}

                          <div className="mt-3 grid gap-2 sm:grid-cols-2">

                            {/* START DATE */}

                            <div>

                              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                Pick-up
                              </p>

                              <div className="relative">

                                <button
                                  type="button"
                                  onClick={() =>
                                    openDatePicker(
                                      `start-${item.vehicle._id}`
                                    )
                                  }
                                  className="
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-lg
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    px-2.5
                                    py-2
                                    text-left
                                    transition
                                    hover:border-orange-300
                                    hover:bg-orange-50/40
                                    focus:outline-none
                                    focus:ring-4
                                    focus:ring-orange-500/10
                                  "
                                >

                                  <div className="flex min-w-0 items-center gap-2">

                                    <span className="text-sm">
                                      📅
                                    </span>

                                    <span className="truncate text-xs font-semibold text-gray-700">
                                      {
                                        formatDate(
                                          item.startDate
                                        )
                                      }
                                    </span>

                                  </div>

                                  <span className="ml-2 text-xs text-gray-400">
                                    ›
                                  </span>

                                </button>


                                <input
                                  ref={(element) => {
                                    dateInputRefs.current[
                                      `start-${item.vehicle._id}`
                                    ] = element
                                  }}
                                  type="datetime-local"
                                  value={formatDateTimeLocal(
                                    item.startDate
                                  )}
                                  onChange={(event) =>
                                    handleStartDateChange(
                                      item.vehicle._id,
                                      event.target.value
                                    )
                                  }
                                  className="absolute h-0 w-0 opacity-0"
                                  tabIndex={-1}
                                />

                              </div>

                            </div>


                            {/* END DATE */}

                            <div>

                              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                Drop-off
                              </p>

                              <div className="relative">

                                <button
                                  type="button"
                                  onClick={() =>
                                    openDatePicker(
                                      `end-${item.vehicle._id}`
                                    )
                                  }
                                  className="
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-lg
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    px-2.5
                                    py-2
                                    text-left
                                    transition
                                    hover:border-orange-300
                                    hover:bg-orange-50/40
                                    focus:outline-none
                                    focus:ring-4
                                    focus:ring-orange-500/10
                                  "
                                >

                                  <div className="flex min-w-0 items-center gap-2">

                                    <span className="text-sm">
                                      📅
                                    </span>

                                    <span className="truncate text-xs font-semibold text-gray-700">
                                      {
                                        formatDate(
                                          item.endDate
                                        )
                                      }
                                    </span>

                                  </div>

                                  <span className="ml-2 text-xs text-gray-400">
                                    ›
                                  </span>

                                </button>


                                <input
                                  ref={(element) => {
                                    dateInputRefs.current[
                                      `end-${item.vehicle._id}`
                                    ] = element
                                  }}
                                  type="datetime-local"
                                  value={formatDateTimeLocal(
                                    item.endDate
                                  )}
                                  onChange={(event) =>
                                    handleEndDateChange(
                                      item.vehicle._id,
                                      event.target.value
                                    )
                                  }
                                  className="absolute h-0 w-0 opacity-0"
                                  tabIndex={-1}
                                />

                              </div>

                            </div>

                          </div>


                          {/* ESTIMATED RENTAL */}

                          <div className="mt-5 flex items-center justify-between">

                            <span className="text-sm text-gray-500">
                              Estimated rental
                            </span>

                            <span className="text-xl font-black text-gray-900">
                              ₹
                              {(
                                item.vehicle.rent *
                                duration
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                  )
                })}


                {/* CONTINUE BROWSING */}

                <button
                  onClick={() =>
                    navigate("/user/car")
                  }
                  className="
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-gray-700
                    transition
                    hover:border-orange-300
                    hover:bg-orange-50
                    hover:text-orange-500
                  "
                >
                  ← Continue Browsing
                </button>

              </div>


              {/* =================================================
                  BOOKING SUMMARY
              ================================================= */}

              <div
                className="
                  h-fit
                  rounded-3xl
                  border
                  border-gray-200
                  bg-[#171717]
                  p-7
                  text-white
                  shadow-[0_15px_40px_rgba(0,0,0,0.18)]
                "
              >

                <h2 className="text-xl font-bold">
                  Booking Summary
                </h2>


                <div className="mt-7 space-y-4 border-b border-white/10 pb-6">

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-400">
                      Rental subtotal
                    </span>

                    <span>
                      ₹
                      {subtotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>


                  <div className="flex justify-between text-sm">

                    <span className="text-gray-400">
                      Platform fee
                    </span>

                    <span>
                      ₹{platformFee}
                    </span>

                  </div>

                </div>


                <div className="flex items-end justify-between py-6">

                  <span className="text-sm text-gray-400">
                    Total
                  </span>

                  <span className="text-3xl font-black text-orange-400">
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>


                <button
                  onClick={handleBooking}
                  className="
                    w-full
                    rounded-xl
                    bg-orange-500
                    py-3.5
                    text-sm
                    font-black
                    text-white
                    shadow-[0_8px_20px_rgba(249,115,22,0.3)]
                    transition
                    hover:-translate-y-0.5
                    hover:bg-orange-600
                  "
                >
                  Proceed to Booking
                </button>


                <p className="mt-4 text-center text-xs text-gray-500">
                  No payment will be charged at this stage.
                </p>

              </div>

            </div>

          )}

        </div>

      </section>

    </main>
  )
}

export default Cart
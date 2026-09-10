import { useEffect, useState, useContext } from "react"
import Navbar from "../Navbar"
import { api } from "../Authentication/axiosInterseptors"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { AuthContext } from "../Authentication/AuthContext"

type Booking = {
  _id: string
  id: string
  company: string
  model: string
  vehicleNo: string
  image: string
  date: string
  time: string
  startDate: string
  endDate: string
  duration: string
  amount: number
  rentalAmount: number
  platformFee: number
  pickupLocation: string
  dropoffLocation: string
  paymentMethod: string
  paymentStatus: string
  drivingLicenseNumber: string
  specialRequest?: string
  status: "Upcoming" | "Completed" | "Cancelled"
  type: "Car" | "Bike"
}

type BookingTab =
  | "all"
  | "upcoming"
  | "completed"
  | "cancelled"


function Bookings() {

  const navigate = useNavigate()

  const { isLoggedIn,authLoading } =
    useContext(AuthContext)


  const [activeTab,setActiveTab] =
    useState<BookingTab>("all")

  const [bookings, setBookings] =
    useState<Booking[]>([])

  // =====================================================
  // CANCELLATION STATE
  // =====================================================

  const [cancelBooking, setCancelBooking] =
    useState<Booking | null>(null)

  const [isCancelling, setIsCancelling] =
    useState(false)

  // =====================================================
  // VIEW DETAILS STATE
  // =====================================================

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null)


  // =====================================================
  // FETCH BOOKINGS
  // =====================================================

  useEffect(() => {

    if (!isLoggedIn) {
      return
    }

    fetchBookings(activeTab)

  }, [activeTab, isLoggedIn])


  const fetchBookings = async (
    tab: BookingTab
  ) => {

    try {

      const response = await api.get(
        `/user/mybookings/${tab}`
      )

      const backendBookings = response.data

      // console.log(
      //   "BOOKINGS:",
      //   backendBookings,
      //   tab
      // )


      const formattedBookings = backendBookings.map(
        (booking: any) => ({

          // =========================
          // MONGODB ID
          // =========================

          _id: booking._id,


          // =========================
          // BOOKING CODE
          // =========================

          id: booking.bookingCode,


          // =========================
          // VEHICLE
          // =========================

          company:
            booking.vehicleSnapshot.company,

          model:
            booking.vehicleSnapshot.model,

          vehicleNo:
            booking.vehicleSnapshot.vehicleNo,

          image:
            booking.vehicleSnapshot.image,


          // =========================
          // PICKUP DATE
          // =========================

          date:
            new Date(
              booking.startDate
            ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),


          // =========================
          // PICKUP TIME
          // =========================

          time:
            new Date(
              booking.startDate
            ).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            }),


          // =========================
          // RAW START DATE
          // Used for cancellation
          // =========================

          startDate:
            booking.startDate,


          // =========================
          // RAW END DATE
          // Used for details modal
          // =========================

          endDate:
            booking.endDate,


          // =========================
          // DURATION
          // =========================

          duration:
            `${Math.ceil(
              booking.durationHours / 24
            )} Days`,


          // =========================
          // TOTAL AMOUNT
          // =========================

          amount:
            booking.totalAmount,


          // =========================
          // RENTAL AMOUNT
          // Used for details modal
          // =========================

          rentalAmount:
            booking.rentalAmount,


          // =========================
          // PLATFORM FEE
          // Used for details modal
          // =========================

          platformFee:
            booking.platformFee,


          // =========================
          // PICKUP LOCATION
          // =========================

          pickupLocation:
            booking.pickupLocation,


          // =========================
          // DROP-OFF LOCATION
          // =========================

          dropoffLocation:
            booking.dropoffLocation,


          // =========================
          // PAYMENT METHOD
          // =========================

          paymentMethod:
            booking.paymentMethod,


          // =========================
          // PAYMENT STATUS
          // =========================

          paymentStatus:
            booking.paymentStatus,


          // =========================
          // DRIVING LICENSE
          // =========================

          drivingLicenseNumber:
            booking.drivingLicenseNumber,


          // =========================
          // SPECIAL REQUEST
          // =========================

          specialRequest:
            booking.specialRequest,


          // =========================
          // STATUS
          // =========================

          status:
            booking.bookingStatus === "confirmed"
              ? "Upcoming"
              : booking.bookingStatus === "completed"
              ? "Completed"
              : booking.bookingStatus === "cancelled"
              ? "Cancelled"
              : "Upcoming",


          // =========================
          // VEHICLE TYPE
          // =========================

          type:
            booking.vehicleType === "car"
              ? "Car"
              : "Bike",

        })
      )


      setBookings(formattedBookings)

    } catch (error) {

      console.error(
        "Failed to fetch bookings:",
        error
      )

      setBookings([])

    }

  }


  // =====================================================
  // CANCELLATION INFORMATION
  // =====================================================

  const getCancellationInfo = (
    booking: Booking
  ) => {

    const pickupDate =
      new Date(booking.startDate)

    const now =
      new Date()

    const hoursUntilPickup =
      (
        pickupDate.getTime() -
        now.getTime()
      ) / (1000 * 60 * 60)


    const refundEligible =
      hoursUntilPickup >= 48


    const platformFee = 99

    const cancellationCharge = 150


    const refundAmount =
      refundEligible
        ? Math.max(
            0,
            booking.amount -
            platformFee -
            cancellationCharge
          )
        : 0


    return {
      hoursUntilPickup,
      refundEligible,
      platformFee,
      cancellationCharge,
      refundAmount
    }

  }


  // =====================================================
  // CANCEL BOOKING
  // =====================================================

  const handleCancelBooking = async () => {

    if (!cancelBooking) return


    try {

      setIsCancelling(true)



      
      await api.patch(
        `/user/mybookings/cancel/${cancelBooking._id}`,
        {
          cancellationReason:
            "Cancelled by renter"
        }
      )
      


      // =================================================
      // TEMPORARY FRONTEND UPDATE
      // =================================================

      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === cancelBooking._id
            ? {
                ...booking,
                status: "Cancelled"
              }
            : booking
        )
      )

      toast.success("Booking cancelled successfully")
      setCancelBooking(null)


    } catch (error) {

      console.error(
        "Failed to cancel booking:",
        error
      )

    } finally {

      setIsCancelling(false)

    }

  }


  return (
    <main className="min-h-screen bg-[#f5f5f0]">

      <Navbar />


      <section className="px-6 pb-20 pt-32">

        <div className="mx-auto max-w-6xl">


          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="mb-8">

            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
              Ride History
            </p>

            <h1 className="text-4xl font-black tracking-tight text-gray-900">
              My Bookings
            </h1>

            <p className="mt-2 text-gray-500">
              Track and manage all your RideX rentals.
            </p>

          </div>


          {/* =====================================================
              NOT LOGGED IN
          ===================================================== */}
           {authLoading? (<div>Loading...</div>):
          !isLoggedIn ? (

            <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-[0_8px_30px_rgba(0,0,0,0.05)]">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">

                <span className="text-3xl">
                  🔐
                </span>

              </div>

              <h2 className="mt-5 text-2xl font-black text-gray-900">
                Login to view your bookings
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Please login to view your bookings
                and manage your RideX rentals.
              </p>

              <button
                onClick={() =>
                  navigate("/login")
                }
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

          ) : (

            <>
              {/* =====================================================
                  FILTERS
              ===================================================== */}

              <div className="mb-5 flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">

                {/* ALL */}

                <button
                  onClick={() =>
                    setActiveTab("all")
                  }
                  className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                    activeTab === "all"
                      ? "bg-orange-500 text-white"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                  }`}
                >
                  All Bookings
                </button>


                {/* UPCOMING */}

                <button
                  onClick={() =>
                    setActiveTab("upcoming")
                  }
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                    activeTab === "upcoming"
                      ? "bg-orange-500 text-white"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                  }`}
                >
                  Upcoming
                </button>


                {/* COMPLETED */}

                <button
                  onClick={() =>
                    setActiveTab("completed")
                  }
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                    activeTab === "completed"
                      ? "bg-orange-500 text-white"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                  }`}
                >
                  Completed
                </button>


                {/* CANCELLED */}

                <button
                  onClick={() =>
                    setActiveTab("cancelled")
                  }
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                    activeTab === "cancelled"
                      ? "bg-orange-500 text-white"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                  }`}
                >
                  Cancelled
                </button>

              </div>


              {/* =====================================================
                  BOOKINGS LIST
              ===================================================== */}

              <div className="space-y-4">

                {bookings.length === 0 ? (

                  <div className="rounded-3xl border border-gray-200 bg-white py-14 text-center shadow-[0_8px_30px_rgba(0,0,0,0.05)]">

                    <p className="text-lg font-bold text-gray-800">
                      No bookings found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      There are no bookings in this category.
                    </p>

                  </div>

                ) : (

                  bookings.map((booking) => (

                    <div
                      key={booking._id}
                      className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
                    >


                      <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center">


                        {/* =================================================
                            VEHICLE
                        ================================================= */}

                        <div className="flex flex-1 items-center gap-4">

                          <div className="h-18 w-18 min-h-18 min-w-18 overflow-hidden rounded-2xl bg-orange-50">

                            {booking.image ? (

                              <img
                                src={booking.image}
                                alt={`${booking.company} ${booking.model}`}
                                className="h-full w-full object-cover"
                              />

                            ) : (

                              <div className="flex h-full w-full items-center justify-center text-3xl">

                                {booking.type === "Car"
                                  ? "🚗"
                                  : "🏍️"}

                              </div>

                            )}

                          </div>


                          <div>

                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                              {booking.company}
                            </p>

                            <h2 className="mt-1 text-lg font-bold text-gray-900">
                              {booking.model}
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                              Booking ID: {booking.id}
                            </p>

                          </div>

                        </div>


                        {/* =================================================
                            DATE
                        ================================================= */}

                        <div className="min-w-36">

                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Pickup
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-800">
                            {booking.date}
                          </p>

                          <p className="text-xs text-gray-500">
                            {booking.time}
                          </p>

                        </div>


                        {/* =================================================
                            DURATION
                        ================================================= */}

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Duration
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-800">
                            {booking.duration}
                          </p>

                        </div>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <div>

                          <StatusBadge
                            status={booking.status}
                          />

                        </div>


                        {/* =================================================
                            PRICE
                        ================================================= */}

                        <div className="md:text-right">

                          <p className="text-xs text-gray-400">
                            Total
                          </p>

                          <p className="text-xl font-black text-gray-900">
                            ₹{booking.amount.toLocaleString()}
                          </p>

                        </div>

                      </div>


                      {/* =====================================================
                          ACTIONS
                      ===================================================== */}

                      <div className="flex flex-wrap gap-3 border-t border-gray-100 bg-[#fafaf7] px-5 py-3.5">


                        {/* VIEW DETAILS */}

                        <button
                          onClick={() =>
                            setSelectedBooking(booking)
                          }
                          className="rounded-xl bg-[#171717] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-orange-500"
                        >
                          View Details
                        </button>


                        {/* UPCOMING ACTIONS */}

                        {booking.status === "Upcoming" && (
                          <>

                            <button
                             disabled
                              className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500" 
                            >
                              Modify Booking
                            </button>


                            <button
                              onClick={() =>
                                setCancelBooking(booking)
                              }
                              className="rounded-xl border border-red-200 px-5 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-50"
                            >
                              Cancel Booking
                            </button>

                          </>
                        )}


                        {/* COMPLETED ACTION */}

                        {booking.status === "Completed" && (

                          <button
                            className="rounded-xl border border-orange-200 px-5 py-2.5 text-xs font-bold text-orange-500 transition hover:bg-orange-50"
                          >
                            Book Again
                          </button>

                        )}

                      </div>

                    </div>

                  ))

                )}

              </div>

            </>

          )}

        </div>

      </section>


      {/* =========================================================
          VIEW DETAILS MODAL
      ========================================================= */}

      {selectedBooking && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-5 backdrop-blur-sm"
          onClick={() =>
            setSelectedBooking(null)
          }
        >

          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-500">
                  Booking Details
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-900">
                  {selectedBooking.company}{" "}
                  {selectedBooking.model}
                </h2>

              </div>


              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                ×
              </button>

            </div>


            {/* =====================================================
                SCROLLABLE CONTENT
            ===================================================== */}

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">

              <div className="space-y-5">


                {/* =================================================
                    VEHICLE
                ================================================= */}

                <div className="flex items-center gap-4 rounded-2xl bg-[#fafaf7] p-4">

                  <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-orange-50">

                    {selectedBooking.image ? (

                      <img
                        src={selectedBooking.image}
                        alt={`${selectedBooking.company} ${selectedBooking.model}`}
                        className="h-full w-full object-cover"
                      />

                    ) : (

                      <div className="flex h-full w-full items-center justify-center text-3xl">

                        {selectedBooking.type === "Car"
                          ? "🚗"
                          : "🏍️"}

                      </div>

                    )}

                  </div>


                  <div className="min-w-0 flex-1">

                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                      {selectedBooking.company}
                    </p>

                    <h3 className="text-lg font-black text-gray-900">
                      {selectedBooking.model}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Booking ID: {selectedBooking.id}
                    </p>

                    {/* VEHICLE NUMBER */}

                    <p className="mt-1 text-xs text-gray-400">
                      Vehicle No: {" "}
                      <span className="font-semibold text-gray-700">
                        {selectedBooking.vehicleNo}
                      </span>
                    </p>

                  </div>


                  <StatusBadge
                    status={selectedBooking.status}
                  />

                </div>


                {/* =================================================
                    TRIP DETAILS
                ================================================= */}

                <div>

                  <p className="mb-3 text-sm font-bold text-gray-900">
                    Trip Details
                  </p>


                  <div className="grid gap-3 sm:grid-cols-2">


                    {/* PICKUP */}

                    <div className="rounded-2xl border border-gray-200 p-4">

                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Pickup
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {selectedBooking.date}
                      </p>

                      <p className="text-xs text-gray-500">
                        {selectedBooking.time}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        {selectedBooking.pickupLocation ||
                          "Pickup location not specified"}
                      </p>

                    </div>


                    {/* DROP-OFF */}

                    <div className="rounded-2xl border border-gray-200 p-4">

                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Drop-off
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-900">

                        {new Date(
                          selectedBooking.endDate
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}

                      </p>

                      <p className="text-xs text-gray-500">

                        {new Date(
                          selectedBooking.endDate
                        ).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}

                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        {selectedBooking.dropoffLocation ||
                          "Drop-off location not specified"}
                      </p>

                    </div>

                  </div>


                  {/* DURATION */}

                  <div className="mt-3 rounded-2xl bg-orange-50 px-4 py-3">

                    <div className="flex items-center justify-between">

                      <span className="text-sm font-semibold text-gray-600">
                        Rental Duration
                      </span>

                      <span className="text-sm font-black text-orange-600">
                        {selectedBooking.duration}
                      </span>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    PAYMENT
                ================================================= */}

                <div>

                  <p className="mb-3 text-sm font-bold text-gray-900">
                    Payment
                  </p>

                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-4">

                    {selectedBooking.status === "Cancelled" ? (

                      <span className="text-sm font-bold text-red-500">
                        Cancelled
                      </span>

                    ) : selectedBooking.paymentStatus === "paid" ? (

                      <span className="text-sm font-bold text-green-600">
                        Paid
                      </span>

                    ) : (

                      <>

                        <span className="text-sm font-semibold text-gray-600">
                          Total
                        </span>

                        <div className="flex items-center gap-3">

                          <span className="text-lg font-black text-gray-900">
                            ₹{selectedBooking.amount.toLocaleString()}
                          </span>

                          <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
                            Pending
                          </span>

                        </div>

                      </>

                    )}

                  </div>

                </div>


                {/* =================================================
                    ADDITIONAL INFORMATION
                ================================================= */}

                <div>

                  <p className="mb-3 text-sm font-bold text-gray-900">
                    Additional Information
                  </p>


                  <div className="rounded-2xl border border-gray-200">


                    {/* LICENSE */}

                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">

                      <span className="text-sm text-gray-500">
                        Driving License
                      </span>

                      <span className="text-sm font-semibold text-gray-800">
                        {selectedBooking.drivingLicenseNumber ||
                          "Not provided"}
                      </span>

                    </div>


                    {/* SPECIAL REQUEST */}

                    {selectedBooking.specialRequest && (

                      <div className="px-4 py-3">

                        <p className="text-sm text-gray-500">
                          Special Request
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {selectedBooking.specialRequest}
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            </div>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <div className="shrink-0 border-t border-gray-100 bg-[#fafaf7] px-6 py-3.5">

              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="w-full rounded-xl bg-[#171717] px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =========================================================
          CANCELLATION MODAL
      ========================================================= */}

      {cancelBooking && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-5 backdrop-blur-sm"
          onClick={() => {
            if (!isCancelling) {
              setCancelBooking(null)
            }
          }}
        >

          <div
            className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* =====================================================
                MODAL HEADER
            ===================================================== */}

            <div className="shrink-0 border-b border-gray-100 px-5 py-4">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h2 className="text-lg font-black text-gray-900">
                    Cancel this booking?
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Please review the cancellation details before continuing.
                  </p>

                </div>


                <button
                  onClick={() =>
                    setCancelBooking(null)
                  }
                  disabled={isCancelling}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl leading-none text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed"
                >
                  ×
                </button>

              </div>

            </div>


            {/* =====================================================
                MODAL SCROLLABLE CONTENT
            ===================================================== */}

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">


              {/* =================================================
                  VEHICLE SUMMARY
              ================================================= */}

              <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[#fafaf7] p-3">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50">

                  {cancelBooking.image ? (

                    <img
                      src={cancelBooking.image}
                      alt={`${cancelBooking.company} ${cancelBooking.model}`}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <span className="text-2xl">

                      {cancelBooking.type === "Car"
                        ? "🚗"
                        : "🏍️"}

                    </span>

                  )}

                </div>


                <div className="min-w-0">

                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    {cancelBooking.company}
                  </p>

                  <p className="truncate text-base font-bold text-gray-900">
                    {cancelBooking.model}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {cancelBooking.date} • {cancelBooking.time}
                  </p>

                </div>

              </div>


              {/* =================================================
                  CANCELLATION INFORMATION
              ================================================= */}

              {(() => {

                const info =
                  getCancellationInfo(
                    cancelBooking
                  )


                return (
                  <div className="space-y-4">


                    {/* =================================================
                        REFUND ELIGIBLE
                    ================================================= */}

                    {info.refundEligible ? (

                      <div className="rounded-2xl border border-green-200 bg-green-50 p-3.5">

                        <div className="flex items-start gap-3">

                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600">
                            ✓
                          </div>

                          <div>

                            <p className="text-sm font-bold text-green-700">
                              Eligible for refund
                            </p>

                            <p className="mt-1 text-xs leading-5 text-green-600">
                              You are cancelling at least 48 hours before pickup and are eligible for a refund after applicable charges.
                            </p>

                          </div>

                        </div>

                      </div>

                    ) : (

                      <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5">

                        <div className="flex items-start gap-3">

                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-500">
                            !
                          </div>

                          <div>

                            <p className="text-sm font-bold text-red-600">
                              Refund not available
                            </p>

                            <p className="mt-1 text-xs leading-5 text-red-500">
                              This booking is less than 48 hours away from pickup, so it is not eligible for a refund under the cancellation policy.
                            </p>

                          </div>

                        </div>

                      </div>

                    )}


                    {/* =================================================
                        REFUND BREAKDOWN
                    ================================================= */}

                    <div className="rounded-2xl border border-gray-200">

                      <div className="border-b border-gray-100 px-4 py-3">

                        <p className="text-sm font-bold text-gray-800">
                          Refund breakdown
                        </p>

                      </div>


                      <div className="space-y-2.5 px-4 py-3.5">


                        {/* AMOUNT PAID */}

                        <div className="flex items-center justify-between text-sm">

                          <span className="text-gray-500">
                            Amount paid
                          </span>

                          <span className="font-semibold text-gray-800">
                            ₹{cancelBooking.amount.toLocaleString()}
                          </span>

                        </div>


                        {/* PLATFORM FEE */}

                        <div className="flex items-center justify-between text-sm">

                          <span className="text-gray-500">
                            Platform fee
                          </span>

                          <span className="font-semibold text-red-500">
                            −₹{info.platformFee}
                          </span>

                        </div>


                        {/* CANCELLATION CHARGE */}

                        <div className="flex items-center justify-between text-sm">

                          <span className="text-gray-500">
                            Cancellation charge
                          </span>

                          <span className="font-semibold text-red-500">
                            −₹{info.cancellationCharge}
                          </span>

                        </div>


                        {/* ESTIMATED REFUND */}

                        <div className="border-t border-dashed border-gray-200 pt-3">

                          <div className="flex items-center justify-between">

                            <span className="text-sm font-bold text-gray-800">
                              Estimated refund
                            </span>

                            <span
                              className={`text-lg font-black ${
                                info.refundEligible
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            >
                              ₹{info.refundAmount.toLocaleString()}
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>


                    {/* =================================================
                        POLICY
                    ================================================= */}

                    <p className="pb-1 text-center text-[11px] leading-5 text-gray-400">

                      Cancellations made at least 48 hours before pickup
                      are eligible for a refund after the platform fee
                      and cancellation charge. Final refund eligibility
                      is determined by RideX at the time of cancellation.

                    </p>

                  </div>
                )

              })()}

            </div>


            {/* =====================================================
                MODAL FOOTER
            ===================================================== */}

            <div className="flex shrink-0 gap-3 border-t border-gray-100 bg-[#fafaf7] px-5 py-3.5">

              {/* KEEP BOOKING */}

              <button
                onClick={() =>
                  setCancelBooking(null)
                }
                disabled={isCancelling}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep Booking
              </button>


              {/* CONFIRM CANCELLATION */}

              <button
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {isCancelling
                  ? "Cancelling..."
                  : "Confirm Cancellation"}

              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  )
}


// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({
  status
}: {
  status: string
}) {

  if (status === "Upcoming") {

    return (
      <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-500">
        Upcoming
      </span>
    )

  }


  if (status === "Completed") {

    return (
      <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">
        Completed
      </span>
    )

  }


  return (
    <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-500">
      Cancelled
    </span>
  )

}


export default Bookings
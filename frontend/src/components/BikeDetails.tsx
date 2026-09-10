import { useState, useEffect, useContext } from "react"
const VITE_API_SERVER = import.meta.env.VITE_API_SERVER 
import {
  Link,
  useParams,
  useNavigate,
  useLocation
} from "react-router-dom"
import { api } from "./Authentication/axiosInterseptors"
import { ToastContainer, toast } from "react-toastify"
import { AuthContext } from "./Authentication/AuthContext"
import axios from 'axios'
import {
  CalendarDays,
  Clock3,
  ArrowRight,
  MapPin
} from "lucide-react"

import { type Bike } from "../assets/bikeType"


const reviews = [
  {
    name: "Aarav Sharma",
    rating: 5,
    comment:
      "The bike was clean and in excellent condition. Pickup was quick and hassle-free.",
  },
  {
    name: "Sneha Patil",
    rating: 4.8,
    comment:
      "Great bike for city rides. The rental process was simple and the bike performed really well.",
  },
  {
    name: "Rohan Mehta",
    rating: 4.7,
    comment:
      "The bike was exactly as described. Had a great experience during my weekend trip.",
  },
]


function BikeDetails() {

  const { model } = useParams()

  const navigate = useNavigate()

  const location = useLocation()

  const { isLoggedIn,authLoading } = useContext(AuthContext)


  const [selectedImage, setSelectedImage] = useState(0)

  const [bike, setBike] = useState<Bike | null>(null)
  const [fetchingBike, setFetchingBike] = useState(true)

  const [showLoginModal, setShowLoginModal] = useState(false)


  /*
    Rental dates are received from BikeCard
    through React Router state.

    Example:

    navigate("/user/bikes/Activa", {
      state: {
        startDate,
        endDate
      }
    })
  */

  const [startDate, setStartDate] = useState<string>(
    location.state?.startDate || ""
  )

  const [endDate, setEndDate] = useState<string>(
    location.state?.endDate || ""
  )


  /*
    Format only the date.
  */

  const formatDateOnly = (date: string) => {

    if (!date) {
      return "Not selected"
    }


    const parsedDate = new Date(date)


    if (isNaN(parsedDate.getTime())) {
      return "Not selected"
    }


    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }


  /*
    Format only the time.
  */

  const formatTimeOnly = (date: string) => {

    if (!date) {
      return ""
    }


    const parsedDate = new Date(date)


    if (isNaN(parsedDate.getTime())) {
      return ""
    }


    return parsedDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }


  /*
    Format rental duration.
  */

  const formatDuration = (
    startDate: string,
    endDate: string
  ) => {

    const start = new Date(startDate)

    const end = new Date(endDate)


    const totalMinutes = Math.floor(
      (end.getTime() - start.getTime()) /
      (1000 * 60)
    )


    if (totalMinutes <= 0) {
      return "0 mins"
    }


    const days = Math.floor(
      totalMinutes / (24 * 60)
    )


    const hours = Math.floor(
      (totalMinutes % (24 * 60)) / 60
    )


    const minutes = totalMinutes % 60


    const parts: string[] = []


    if (days > 0) {

      parts.push(
        `${days} ${days === 1 ? "day" : "days"}`
      )

    }


    if (hours > 0) {

      parts.push(
        `${hours} ${hours === 1 ? "hr" : "hrs"}`
      )

    }


    if (minutes > 0) {

      parts.push(
        `${minutes} mins`
      )

    }


    return parts.join(" ")
  }


  /*
    Add bike to cart.
  */

  const handleCartBttn = async () => {
    if (authLoading) {
      return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }

    let selectedStartDate = startDate

    let selectedEndDate = endDate


    if (!selectedStartDate || !selectedEndDate) {

      const defaultStartDate = new Date()


      const defaultEndDate = new Date(
        defaultStartDate.getTime() +
        16 * 60 * 60 * 1000
      )


      selectedStartDate =
        defaultStartDate.toISOString()


      selectedEndDate =
        defaultEndDate.toISOString()


      setStartDate(selectedStartDate)

      setEndDate(selectedEndDate)

    }


    const data = {

      vehicleId: bike?._id,

      vehicleType: "bike",

      startDate: new Date(
        selectedStartDate
      ).toISOString(),

      endDate: new Date(
        selectedEndDate
      ).toISOString()

    }


    try {

      const response = await api.post(
        "/user/cart/add",
        data
      )


      toast.success(
        "Vehicle added to cart"
      )


      navigate("/user/cart")


      console.log(response.data)

    } catch (error: any) {

      if (error.response?.data?.message) {

        toast.error(
          error.response.data.message
        )

      } else {

        toast.error(
          "Failed to Add in Cart"
        )

      }

    }

  }


  /*
    Fetch bike using model from URL.
  */

  useEffect(() => {

    const fetch_Bike = async () => {

      try {

        const response = await axios.get(
          `${VITE_API_SERVER}/user/bikes/${model}`
        )
        setFetchingBike(false)

        setBike(response.data)

      } catch (error) {

        toast.error(
          "Try Again Later !"
        )

      }

    }


    fetch_Bike()

  }, [])


  /*
    If BikeDetails is opened directly
    without rental dates, create a default
    16-hour rental period.
  */

  useEffect(() => {

    if (!startDate || !endDate) {

      const defaultStartDate = new Date()


      const defaultEndDate = new Date(
        defaultStartDate.getTime() +
        16 * 60 * 60 * 1000
      )


      setStartDate(
        defaultStartDate.toISOString()
      )


      setEndDate(
        defaultEndDate.toISOString()
      )

    }

  }, [])


  if (fetchingBike) {

    return (

      <>

        <ToastContainer />

        <main className="min-h-screen bg-[#f5f5f0]">

          <div className="flex min-h-screen flex-col items-center justify-center px-6">

            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
              <div className="absolute h-9 w-9 animate-spin rounded-full border-4 border-gray-100 border-b-gray-900 [animation-direction:reverse]" />
            </div>

            <p className="mt-6 text-base font-semibold text-gray-700">
              Loading bike details
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Please wait a moment...
            </p>

          </div>

        </main>

      </>

    )

  }


  if (!bike) {

    return (

      <>

        <ToastContainer />


        <main className="min-h-screen bg-[#f5f5f0]">

          <div className="flex min-h-screen items-center justify-center px-6">

            <div className="text-center">

              <h1 className="text-3xl font-bold text-gray-900">
                Bike not found
              </h1>


              <p className="mt-2 text-gray-500">
                The bike you are looking for does not exist.
              </p>


              <Link
                to="/user/bikes"
                className="
                  mt-6
                  inline-block
                  rounded-xl
                  bg-orange-500
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-md
                  transition-all
                  hover:bg-orange-600
                "
              >
                Back to Bikes
              </Link>

            </div>

          </div>

        </main>

      </>

    )

  }


  const images = bike.images


  const dailyRent = bike.rent * 16


  return (

    <>

      <ToastContainer />


      <main className="min-h-screen bg-[#f5f5f0] pb-36">


        <div className="mx-auto max-w-6xl px-6 pt-12">


          {/* BACK BUTTON */}

          <Link
            to="/user/bikes"
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              text-1xl
              font-semibold
              text-gray-500
              transition-colors
              hover:text-orange-500
            "
          >
            ← Back to bikes
          </Link>



          {/* =====================================================
              MAIN PRODUCT SECTION
          ====================================================== */}

          <div className="grid gap-10 lg:grid-cols-2">


            {/* =================================================
                IMAGE GALLERY
            ================================================== */}

            <div>


              {/* MAIN IMAGE */}

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-3xl
                  bg-gray-100
                  shadow-[0_12px_35px_rgba(0,0,0,0.12)]
                "
              >

                <img
                  src={images[selectedImage]}
                  alt={`${bike.company} ${bike.model}`}
                  className="
                    h-115
                    w-full
                    object-cover
                    transition-all
                    duration-300
                  "
                />


                {/* RATING */}

                <div
                  className="
                    absolute
                    right-5
                    top-5
                    flex
                    items-center
                    gap-1
                    rounded-full
                    bg-white/95
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-gray-800
                    shadow-lg
                    backdrop-blur
                  "
                >

                  <span className="text-orange-500">
                    ★
                  </span>

                  {bike.rating}

                </div>

              </div>



              {/* THUMBNAILS */}

              <div className="mt-4 grid grid-cols-3 gap-4">

                {images.map((image, index) => (

                  <button
                    key={index}
                    onClick={() =>
                      setSelectedImage(index)
                    }
                    className={`
                      overflow-hidden
                      rounded-xl
                      border-2
                      bg-white
                      transition-all

                      ${
                        selectedImage === index
                          ? "border-orange-500 shadow-md"
                          : "border-transparent hover:border-orange-200"
                      }
                    `}
                  >

                    <img
                      src={image}
                      alt={`${bike.model} view ${index + 1}`}
                      className="
                        h-24
                        w-full
                        object-cover
                        transition-transform
                        duration-300
                        hover:scale-105
                      "
                    />

                  </button>

                ))}

              </div>

            </div>



            {/* =================================================
                BIKE INFORMATION
            ================================================== */}

            <div>


              {/* COMPANY */}

              <p
                className="
                  text-2xl
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-orange-500
                "
              >
                {bike.company}
              </p>



              {/* MODEL */}

              <h1
                className="
                  mt-2
                  text-5xl
                  font-bold
                  tracking-tight
                  text-gray-900
                "
              >
                {bike.model}
              </h1>



              {/* RATING + REVIEWS */}

              <div className="mt-5 flex items-center gap-3">

                <div
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-full
                    bg-orange-50
                    px-3
                    py-1.5
                  "
                >

                  <span className="text-orange-500">
                    ★
                  </span>


                  <span className="font-semibold text-gray-800">
                    {bike.rating}
                  </span>

                </div>


                <span className="text-sm text-gray-400">
                  {bike.reviews} customer reviews
                </span>

              </div>



              {/* PRICE */}

              <div className="mt-8">

                <p className="text-sm text-gray-400">
                  Rental price
                </p>


                <div className="mt-1 flex items-baseline gap-2">

                  <span className="text-4xl font-bold text-gray-900">
                    ₹{bike.rent}
                  </span>


                  <span className="text-lg text-gray-400">
                    /hr
                  </span>

                </div>


                <p className="mt-2 text-sm text-gray-500">

                  ₹{dailyRent.toLocaleString("en-IN")} / day

                  <span className="ml-1 text-gray-400">
                    (16 hours)
                  </span>

                </p>

              </div>



              {/* DESCRIPTION */}

              <p
                className="
                  mt-6
                  leading-7
                  text-gray-500
                "
              >
                {bike.description}
              </p>



              {/* =================================================
                  YOUR RENTAL PERIOD
              ================================================== */}

              <div
                className="
                  relative
                  mt-7
                  overflow-hidden
                  rounded-3xl
                  border
                  border-orange-100
                  bg-linear-to-br
                  from-[#fffaf4]
                  via-[#fff8f0]
                  to-[#fff1df]
                  px-5
                  py-5
                  shadow-[0_10px_30px_rgba(0,0,0,0.05)]
                  sm:px-6
                  sm:py-6
                "
              >


                {/* SUBTLE BACKGROUND DECORATION */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-12
                    -top-12
                    h-32
                    w-32
                    rounded-full
                    bg-orange-100/50
                    blur-3xl
                  "
                />


                {/* HEADER */}

                <div className="relative">

                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.22em]
                      text-orange-500
                    "
                  >
                    Your Rental Period
                  </p>


                  <p className="mt-1 text-xs text-gray-500">
                    Plan your journey with ease
                  </p>

                </div>



                {/* =================================================
                    COMPACT RENTAL TIMELINE
                ================================================== */}

                <div
                  className="
                    relative
                    mt-6
                    grid
                    grid-cols-[1fr_auto_1fr_auto_1fr]
                    items-center
                    gap-2
                  "
                >


                  {/* =================================================
                      PICKUP
                  ================================================== */}

                  <div className="min-w-0">

                    <div className="flex items-start gap-2.5">


                      {/* ICON */}

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-orange-100
                          text-orange-500
                        "
                      >

                        <CalendarDays
                          size={18}
                          strokeWidth={2}
                        />

                      </div>


                      {/* CONTENT */}

                      <div className="min-w-0">

                        <p
                          className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-gray-400
                          "
                        >
                          Pickup
                        </p>


                        <p
                          className="
                            mt-1
                            whitespace-nowrap
                            text-sm
                            font-black
                            text-gray-900
                          "
                        >
                          {formatDateOnly(startDate)}
                        </p>


                        <div
                          className="
                            mt-0.5
                            flex
                            items-center
                            gap-1
                          "
                        >

                          <Clock3
                            size={11}
                            className="text-gray-400"
                          />

                          <p className="text-[11px] font-medium text-gray-500">
                            {formatTimeOnly(startDate)}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* LOCATION LABEL */}

                    <div
                      className="
                        mt-2.5
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-white/75
                        px-2
                        py-1
                        text-[9px]
                        font-semibold
                        text-gray-500
                      "
                    >

                      <MapPin size={10} />

                      Start

                    </div>

                  </div>



                  {/* =================================================
                      ARROW
                  ================================================== */}

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-orange-100
                      bg-white
                      text-orange-500
                      shadow-sm
                    "
                  >

                    <ArrowRight
                      size={15}
                      strokeWidth={2.2}
                    />

                  </div>



                  {/* =================================================
                      DROP-OFF
                  ================================================== */}

                  <div className="min-w-0">

                    <div className="flex items-start gap-2.5">


                      {/* ICON */}

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-orange-100
                          text-orange-500
                        "
                      >

                        <CalendarDays
                          size={18}
                          strokeWidth={2}
                        />

                      </div>


                      {/* CONTENT */}

                      <div className="min-w-0">

                        <p
                          className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-gray-400
                          "
                        >
                          Drop-off
                        </p>


                        <p
                          className="
                            mt-1
                            whitespace-nowrap
                            text-sm
                            font-black
                            text-gray-900
                          "
                        >
                          {formatDateOnly(endDate)}
                        </p>


                        <div
                          className="
                            mt-0.5
                            flex
                            items-center
                            gap-1
                          "
                        >

                          <Clock3
                            size={11}
                            className="text-gray-400"
                          />

                          <p className="text-[11px] font-medium text-gray-500">
                            {formatTimeOnly(endDate)}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* LOCATION LABEL */}

                    <div
                      className="
                        mt-2.5
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-white/75
                        px-2
                        py-1
                        text-[9px]
                        font-semibold
                        text-gray-500
                      "
                    >

                      <MapPin size={10} />

                      End

                    </div>

                  </div>



                  {/* =================================================
                      DIVIDER
                  ================================================== */}

                  <div
                    className="
                      h-20
                      w-px
                      shrink-0
                      bg-orange-200/70
                    "
                  />



                  {/* =================================================
                      DURATION
                  ================================================== */}

                  <div className="min-w-0">

                    <div className="flex items-start gap-2.5">


                      {/* ICON */}

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-orange-100
                          text-orange-500
                        "
                      >

                        <Clock3
                          size={18}
                          strokeWidth={2}
                        />

                      </div>


                      {/* CONTENT */}

                      <div className="min-w-0">

                        <p
                          className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-gray-400
                          "
                        >
                          Duration
                        </p>


                        <p
                          className="
                            mt-1
                            whitespace-nowrap
                            text-sm
                            font-black
                            text-gray-900
                          "
                        >
                          {formatDuration(
                            startDate,
                            endDate
                          )}
                        </p>


                        <p
                          className="
                            mt-0.5
                            whitespace-nowrap
                            text-[11px]
                            font-medium
                            text-gray-500
                          "
                        >

                          {Math.floor(
                            (
                              new Date(endDate).getTime() -
                              new Date(startDate).getTime()
                            ) /
                            (1000 * 60 * 60)
                          )}{" "}

                          hours

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>



              {/* =================================================
                  SPECIFICATIONS
              ================================================== */}

              <div
                className="
                  mt-8
                  grid
                  grid-cols-2
                  gap-3
                  sm:grid-cols-3
                "
              >


                {/* PEOPLE */}

                <div className="rounded-2xl bg-white p-4 shadow-sm">

                  <p className="text-xs text-gray-400">
                    People
                  </p>


                  <p className="mt-2 font-semibold text-gray-900">
                    {bike.seats}
                  </p>

                </div>



                {/* MILEAGE */}

                <div className="rounded-2xl bg-white p-4 shadow-sm">

                  <p className="text-xs text-gray-400">
                    Mileage
                  </p>


                  <p className="mt-2 font-semibold text-gray-900">
                    {bike.mileage} km/l
                  </p>

                </div>



                {/* ENGINE */}

                <div className="rounded-2xl bg-white p-4 shadow-sm">

                  <p className="text-xs text-gray-400">
                    Engine
                  </p>


                  <p className="mt-2 font-semibold text-gray-900">
                    {bike.engine} cc
                  </p>

                </div>



                {/* FUEL */}

                <div className="rounded-2xl bg-white p-4 shadow-sm">

                  <p className="text-xs text-gray-400">
                    Fuel
                  </p>


                  <p className="mt-2 font-semibold text-gray-900">
                    {bike.fuel}
                  </p>

                </div>



                {/* GEAR */}

                <div className="rounded-2xl bg-white p-4 shadow-sm">

                  <p className="text-xs text-gray-400">
                    Gear
                  </p>


                  <p className="mt-2 font-semibold text-gray-900">
                    {bike.transmission}
                  </p>

                </div>



                {/* VEHICLE AGE */}

                <div className="rounded-2xl bg-white p-4 shadow-sm">

                  <p className="text-xs text-gray-400">
                    Vehicle Age
                  </p>


                  <p className="mt-2 font-semibold text-gray-900">

                    {bike.age}{" "}

                    {bike.age === 1
                      ? "Year"
                      : "Years"}

                  </p>

                </div>

              </div>

            </div>

          </div>



          {/* =====================================================
              VEHICLE DETAILS
          ====================================================== */}

          <section className="mt-16">

            <h2 className="text-2xl font-bold text-gray-900">
              Vehicle Details
            </h2>


            <div
              className="
                mt-6
                grid
                gap-4
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >


              {/* DAILY RENT */}

              <div className="rounded-2xl bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-400">
                  Daily Rental
                </p>


                <p className="mt-2 text-xl font-bold text-gray-900">
                  ₹{dailyRent.toLocaleString("en-IN")}
                </p>

              </div>



              {/* MILEAGE */}

              <div className="rounded-2xl bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-400">
                  Mileage
                </p>


                <p className="mt-2 text-xl font-bold text-gray-900">
                  {bike.mileage} km/l
                </p>

              </div>



              {/* DISTANCE */}

              <div className="rounded-2xl bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-400">
                  Distance Covered
                </p>


                <p className="mt-2 text-xl font-bold text-gray-900">
                  {bike.distanceCovered.toLocaleString("en-IN")} km
                </p>

              </div>



              {/* ENGINE */}

              <div className="rounded-2xl bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-400">
                  Engine
                </p>


                <p className="mt-2 text-xl font-bold text-gray-900">
                  {bike.engine} cc
                </p>

              </div>

            </div>

          </section>



          {/* =====================================================
              ABOUT
          ====================================================== */}

          <section className="mt-16">

            <h2 className="text-2xl font-bold text-gray-900">
              About this bike
            </h2>


            <p
              className="
                mt-4
                max-w-4xl
                leading-7
                text-gray-500
              "
            >
              {bike.description}
            </p>

          </section>



          {/* =====================================================
              FEATURES
          ====================================================== */}

          <section className="mt-16">

            <h2 className="text-2xl font-bold text-gray-900">
              Features
            </h2>


            <div className="mt-6 flex flex-wrap gap-3">

              {[
                "LED Headlamp",
                "Digital Display",
                "USB Charging",
                "Disc Brakes",
                "Tubeless Tyres",
                "Comfortable Seat",
                "Good Suspension",
                "Helmet Included",
              ].map((feature) => (

                <span
                  key={feature}
                  className="
                    rounded-full
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-600
                    shadow-sm
                  "
                >
                  {feature}
                </span>

              ))}

            </div>

          </section>



          {/* =====================================================
              RENTAL INFORMATION
          ====================================================== */}

          <section className="mt-16">

            <h2 className="text-2xl font-bold text-gray-900">
              Rental Information
            </h2>


            <div className="mt-6 grid gap-5 md:grid-cols-2">


              {/* INCLUDED */}

              <div
                className="
                  rounded-2xl
                  bg-white
                  p-6
                  shadow-sm
                "
              >

                <h3 className="font-semibold text-gray-900">
                  What's included
                </h3>


                <ul className="mt-5 space-y-3 text-sm text-gray-500">

                  <li>
                    ✓ Clean and sanitized bike
                  </li>

                  <li>
                    ✓ Helmet included
                  </li>

                  <li>
                    ✓ Basic roadside assistance
                  </li>

                  <li>
                    ✓ Vehicle documents
                  </li>

                </ul>

              </div>



              {/* BEFORE BOOKING */}

              <div
                className="
                  rounded-2xl
                  bg-white
                  p-6
                  shadow-sm
                "
              >

                <h3 className="font-semibold text-gray-900">
                  Before you book
                </h3>


                <ul className="mt-5 space-y-3 text-sm text-gray-500">

                  <li>
                    ✓ Valid driving license required
                  </li>

                  <li>
                    ✓ Valid government ID required
                  </li>

                  <li>
                    ✓ Security deposit may apply
                  </li>

                  <li>
                    ✓ Bike must be returned on time
                  </li>

                </ul>

              </div>

            </div>

          </section>



          {/* =====================================================
              REVIEWS
          ====================================================== */}

          <section className="mt-16">


            {/* REVIEW HEADER */}

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Customer Reviews
                </h2>


                <p className="mt-1 text-sm text-gray-400">
                  What our customers say
                </p>

              </div>



              {/* RATING */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-4
                  py-3
                  shadow-sm
                "
              >

                <span className="text-xl text-orange-500">
                  ★
                </span>


                <span className="font-bold text-gray-900">
                  {bike.rating}
                </span>

              </div>

            </div>



            {/* REVIEW CARDS */}

            <div
              className="
                mt-6
                grid
                gap-5
                md:grid-cols-3
              "
            >

              {reviews.map((review) => (

                <div
                  key={review.name}
                  className="
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    p-5
                    shadow-[0_6px_20px_rgba(0,0,0,0.05)]
                  "
                >

                  <div className="flex items-center justify-between">

                    <p className="font-semibold text-gray-900">
                      {review.name}
                    </p>


                    <span
                      className="
                        text-sm
                        font-semibold
                        text-orange-500
                      "
                    >
                      ★ {review.rating}
                    </span>

                  </div>


                  <p
                    className="
                      mt-4
                      text-sm
                      leading-6
                      text-gray-500
                    "
                  >
                    "{review.comment}"
                  </p>

                </div>

              ))}

            </div>

          </section>

        </div>



        {/* =====================================================
            FIXED BOOKING BAR
        ====================================================== */}

        <div
          className="
            fixed
            bottom-5
            left-1/2
            z-40
            w-[calc(100%-32px)]
            max-w-2xl
            -translate-x-1/2
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-4
            shadow-[0_15px_45px_rgba(0,0,0,0.18)]
          "
        >

          <div className="flex items-center justify-between gap-4">


            {/* PRICE */}

            <div>

              <p className="text-xs text-gray-400">
                Starting price
              </p>


              <div className="mt-1 flex items-baseline gap-1">

                <span className="text-2xl font-bold text-gray-900">
                  ₹{bike.rent}
                </span>


                <span className="text-sm text-gray-400">
                  /hr
                </span>

              </div>

            </div>



            {/* BIKE NAME */}

            <p className="hidden text font-semibold text-orange-600 sm:block">
              {bike.company} {bike.model}
            </p>



            {/* BUTTONS */}

            <div className="flex gap-3">


              {/* ADD TO CART */}

              <button
                className="
                  rounded-xl
                  border-2
                  border-gray-900
                  bg-white
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-gray-900
                  transition-all
                  hover:bg-gray-900
                  hover:text-white
                  active:scale-95
                "
                onClick={handleCartBttn}
              >
                Add to Cart
              </button>



              {/* BOOK NOW */}

              <button
                className="
                  rounded-xl
                  bg-orange-500
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_6px_18px_rgba(249,115,22,0.3)]
                  transition-all
                  hover:-translate-y-0.5
                  hover:bg-orange-600
                  hover:shadow-[0_10px_25px_rgba(249,115,22,0.4)]
                  active:translate-y-0
                "
                onClick={() => {
                  if (authLoading) {
                    return <div>Loading...</div>;
                  }
                  if (!isLoggedIn) {
                    setShowLoginModal(true)
                    return
                  }

                  navigate(
                    `/user/booking/single/bike/${bike._id}`,
                    {
                      state: {
                        startDate,
                        endDate
                      }
                    }
                  )
                }}
              >
                Book Now
              </button>

            </div>

          </div>

        </div>


        {/* =====================================================
            LOGIN MODAL
        ====================================================== */}

        {showLoginModal && (
          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/40
              px-4
              backdrop-blur-sm
            "
            onClick={() => setShowLoginModal(false)}
          >

            <div
              className="
                w-full
                max-w-sm
                rounded-2xl
                bg-white
                p-6
                text-center
                shadow-[0_20px_60px_rgba(0,0,0,0.2)]
              "
              onClick={(e) => e.stopPropagation()}
            >

              <div
                className="
                  mx-auto
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-orange-100
                  text-xl
                "
              >
                🔐
              </div>

              <h2 className="mt-4 text-lg font-bold text-gray-900">
                Login Required
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Please login to add this bike to your cart or book it.
              </p>

              <button
                onClick={() => navigate("/login", {
  state: {
    from: location
  }
})}
                className="
                  mt-5
                  w-full
                  rounded-xl
                  bg-orange-500
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_6px_18px_rgba(249,115,22,0.3)]
                  transition-all
                  hover:bg-orange-600
                  active:scale-95
                "
              >
                Login to Continue
              </button>

              <button
                onClick={() => setShowLoginModal(false)}
                className="mt-3 text-sm font-medium text-gray-400 transition-colors hover:text-gray-600"
              >
                Cancel
              </button>

            </div>

          </div>
        )}

      </main>

    </>

  )

}


export default BikeDetails
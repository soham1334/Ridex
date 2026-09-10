import { useState, useEffect, useContext } from "react"
import { Link, useParams, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import {
  CalendarDays,
  Clock3,
  ArrowRight,
  MapPin,
} from "lucide-react"

import { type Car } from "../assets/carType"
import { AuthContext } from "./Authentication/AuthContext"
import { api } from "./Authentication/axiosInterseptors"
const VITE_API_SERVER = import.meta.env.VITE_API_SERVER 

const reviews = [
  {
    name: "Rahul Sharma",
    rating: 5,
    comment:
      "The car was in excellent condition and the pickup process was very smooth.",
  },
  {
    name: "Priya Patil",
    rating: 4.8,
    comment:
      "Very comfortable car for long drives. The overall experience was great.",
  },
  {
    name: "Aditya Mehta",
    rating: 4.7,
    comment:
      "Clean car, good service and exactly what was shown in the listing.",
  },
]


function CarDetails() {

  const { model } = useParams()

  console.log("URL model:", model)

  const navigate = useNavigate()

  const location = useLocation()

  const [selectedImage, setSelectedImage] = useState(0)

  const [car, setCar] = useState<Car | null>(null)

  const [fetchingCar, setFetchingCar] = useState(true)

  const { isLoggedIn,authLoading } = useContext(AuthContext)

  const [showLoginModal, setShowLoginModal] = useState(false)


  /*
    Rental dates are received from the CarCard page
    through React Router state.
  */

  const [startDate, setStartDate] = useState<string>(
    location.state?.startDate || ""
  )

  const [endDate, setEndDate] = useState<string>(
    location.state?.endDate || ""
  )


  /*
    Format date for displaying to the user.
  */

  // const formatDate = (date: string) => {

  //   if (!date) {
  //     return "Not selected"
  //   }

  //   const parsedDate = new Date(date)

  //   if (isNaN(parsedDate.getTime())) {
  //     return "Not selected"
  //   }

  //   return parsedDate.toLocaleString("en-IN", {
  //     day: "2-digit",
  //     month: "short",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   })
  // }


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
    Add vehicle to cart.
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

      vehicleId: car?._id,

      vehicleType: "car",

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
    Fetch car using the model from URL.
  */

  useEffect(() => {

    const fetch_model = async () => {

      try {
        setFetchingCar(true)

        const response = await axios.get(
          `${VITE_API_SERVER}/user/cars/${model}`
        )

        setCar(response.data)

      } catch (error) {

        toast.error(
          "Try Again Later!"
        )

      } finally {
        setFetchingCar(false)
      }

    }


    fetch_model()

  }, [])


  /*
    If dates are not available because the user
    directly opened this page, create default dates.
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


  if (fetchingCar) {

    return (

      <main className="min-h-screen bg-[#f5f5f0]">

        <div className="flex min-h-screen flex-col items-center justify-center px-6">

          <div className="relative flex h-16 w-16 items-center justify-center">

            <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

            <div className="absolute h-9 w-9 animate-spin rounded-full border-4 border-gray-100 border-b-gray-900 [animation-direction:reverse]" />

          </div>

          <p className="mt-6 text-base font-semibold text-gray-700">
            Loading car details
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Please wait a moment...
          </p>

        </div>

      </main>

    )

  }

  if (!car) {

    return (

      <main className="min-h-screen bg-[#f5f5f0]">

        <div className="flex min-h-screen items-center justify-center px-6">

          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-10
              text-center
              shadow-[0_15px_40px_rgba(0,0,0,0.06)]
            "
          >

            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-orange-50
                text-2xl
              "
            >
              🚗
            </div>

            <h1 className="mt-5 text-2xl font-black text-gray-900">
              Car not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              The car you are looking for does not exist.
            </p>


            <Link
              to="/user/cars"
              className="
                mt-7
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-orange-500
                px-6
                py-3
                text-sm
                font-bold
                text-white
                shadow-[0_7px_18px_rgba(249,115,22,0.25)]
                transition-all
                hover:-translate-y-0.5
                hover:bg-orange-600
              "
            >
              Back to Cars
            </Link>

          </div>

        </div>

      </main>

    )

  }


  const images = car.images

  const dailyRent = car.rent * 16


  return (

    <main className="min-h-screen bg-[#f5f5f0] pb-36">


      {/* =====================================================
          MAIN PAGE
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-6 lg:px-8">


        {/* =====================================================
            BACK BUTTON
        ====================================================== */}

        <Link
          to="/user/cars"
          className="
            mb-7
            inline-flex
            items-center
            gap-2
            rounded-lg
            px-1
            py-1
            text-sm
            font-semibold
            text-gray-500
            transition-all
            hover:text-orange-500
          "
        >

          <span className="text-lg">
            ←
          </span>

          Back to cars

        </Link>



        {/* =====================================================
            MAIN PRODUCT SECTION
        ====================================================== */}

        <div className="grid items-start gap-10 lg:grid-cols-[1.02fr_0.98fr]">


          {/* =================================================
              LEFT — IMAGE GALLERY
          ================================================== */}

          <div className="lg:sticky lg:top-8">


            {/* MAIN IMAGE */}

            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-gray-200
                bg-white
                shadow-[0_15px_40px_rgba(0,0,0,0.08)]
              "
            >

              <img
                src={images[selectedImage]}
                alt={`${car.company} ${car.model}`}
                className="
                  h-90
                  w-full
                  object-cover
                  transition-all
                  duration-300
                  sm:h-107.5
                  lg:h-117.5
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
                  gap-1.5
                  rounded-full
                  border
                  border-white/70
                  bg-white/95
                  px-3.5
                  py-2
                  text-sm
                  font-bold
                  text-gray-800
                  shadow-[0_6px_18px_rgba(0,0,0,0.12)]
                  backdrop-blur
                "
              >

                <span className="text-orange-500">
                  ★
                </span>

                {car.rating}

              </div>

            </div>



            {/* THUMBNAILS */}

            <div className="mt-4 grid grid-cols-3 gap-3">

              {images.map((image, index) => (

                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setSelectedImage(index)
                  }
                  className={`
                    overflow-hidden
                    rounded-2xl
                    border-2
                    bg-white
                    p-0.5
                    transition-all
                    duration-200

                    ${
                      selectedImage === index
                        ? "border-orange-500 shadow-[0_5px_15px_rgba(249,115,22,0.18)]"
                        : "border-transparent hover:border-orange-200"
                    }
                  `}
                >

                  <img
                    src={image}
                    alt={`${car.model} view ${index + 1}`}
                    className="
                      h-20
                      w-full
                      rounded-xl
                      object-cover
                      transition-transform
                      duration-300
                      hover:scale-105
                      sm:h-24
                    "
                  />

                </button>

              ))}

            </div>

          </div>



          {/* =================================================
              RIGHT — CAR INFORMATION
          ================================================== */}

          <div>


            {/* COMPANY */}

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.24em]
                text-orange-500
              "
            >
              {car.company}
            </p>



            {/* MODEL */}

            <h1
              className="
                mt-2
                text-4xl
                font-black
                tracking-tight
                text-gray-900
                sm:text-5xl
              "
            >
              {car.model}
            </h1>



            {/* RATING + REVIEWS */}

            <div className="mt-4 flex flex-wrap items-center gap-3">

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-orange-50
                  px-3
                  py-1.5
                "
              >

                <span className="text-orange-500">
                  ★
                </span>

                <span className="text-sm font-bold text-gray-800">
                  {car.rating}
                </span>

              </div>


              <span className="text-sm text-gray-400">
                {car.reviews} customer reviews
              </span>

            </div>



            {/* PRICE */}

            <div
              className="
                mt-7
                rounded-2xl
                border
                border-gray-200
                bg-white
                px-5
                py-4
                shadow-sm
              "
            >

              <p className="text-xs font-medium text-gray-400">
                Rental price
              </p>


              <div className="mt-1 flex items-baseline gap-2">

                <span
                  className="
                    text-3xl
                    font-black
                    tracking-tight
                    text-gray-900
                  "
                >
                  ₹{car.rent}
                </span>

                <span className="text-sm font-medium text-gray-400">
                  /hr
                </span>

              </div>


              <p className="mt-1 text-xs text-gray-500">

                ₹{dailyRent.toLocaleString("en-IN")} / day

                <span className="ml-1 text-gray-400">
                  (24 hours)
                </span>

              </p>

            </div>



            {/* DESCRIPTION */}

            <p
              className="
                mt-6
                text-sm
                leading-7
                text-gray-500
              "
            >
              {car.description}
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

              {/* DECORATIVE CIRCLE */}

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
                mt-7
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-3
              "
            >


              {/* SEATS */}

              <div
                className="
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >

                <p className="text-[11px] font-medium text-gray-400">
                  Seats
                </p>

                <p className="mt-1.5 text-sm font-bold text-gray-900">
                  {car.seats} People
                </p>

              </div>



              {/* MILEAGE */}

              <div
                className="
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >

                <p className="text-[11px] font-medium text-gray-400">
                  Mileage
                </p>

                <p className="mt-1.5 text-sm font-bold text-gray-900">
                  {car.mileage} km/l
                </p>

              </div>



              {/* FUEL */}

              <div
                className="
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >

                <p className="text-[11px] font-medium text-gray-400">
                  Fuel
                </p>

                <p className="mt-1.5 text-sm font-bold text-gray-900">
                  {car.fuel}
                </p>

              </div>



              {/* GEAR */}

              <div
                className="
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >

                <p className="text-[11px] font-medium text-gray-400">
                  Gear
                </p>

                <p className="mt-1.5 text-sm font-bold text-gray-900">
                  {car.transmission}
                </p>

              </div>



              {/* VEHICLE AGE */}

              <div
                className="
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >

                <p className="text-[11px] font-medium text-gray-400">
                  Vehicle Age
                </p>

                <p className="mt-1.5 text-sm font-bold text-gray-900">

                  {car.age}{" "}

                  {car.age === 1
                    ? "Year"
                    : "Years"}

                </p>

              </div>



              {/* DISTANCE */}

              <div
                className="
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >

                <p className="text-[11px] font-medium text-gray-400">
                  Distance Covered
                </p>

                <p className="mt-1.5 text-sm font-bold text-gray-900">
                  {car.distanceCovered.toLocaleString("en-IN")} km
                </p>

              </div>

            </div>

          </div>

        </div>



        {/* =====================================================
            VEHICLE DETAILS
        ====================================================== */}

        <section className="mt-16">

          <h2 className="text-2xl font-black tracking-tight text-gray-900">
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

            <div
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                transition-all
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              <p className="text-xs font-medium text-gray-400">
                Daily Rental
              </p>

              <p className="mt-2 text-xl font-black text-gray-900">
                ₹{dailyRent.toLocaleString("en-IN")}
              </p>

            </div>



            {/* MILEAGE */}

            <div
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                transition-all
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              <p className="text-xs font-medium text-gray-400">
                Mileage
              </p>

              <p className="mt-2 text-xl font-black text-gray-900">
                {car.mileage} km/l
              </p>

            </div>



            {/* DISTANCE */}

            <div
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                transition-all
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              <p className="text-xs font-medium text-gray-400">
                Distance Covered
              </p>

              <p className="mt-2 text-xl font-black text-gray-900">
                {car.distanceCovered.toLocaleString("en-IN")} km
              </p>

            </div>



            {/* AGE */}

            <div
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                transition-all
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              <p className="text-xs font-medium text-gray-400">
                Vehicle Age
              </p>

              <p className="mt-2 text-xl font-black text-gray-900">

                {car.age}{" "}

                {car.age === 1
                  ? "Year"
                  : "Years"}

              </p>

            </div>

          </div>

        </section>



        {/* =====================================================
            ABOUT THE CAR
        ====================================================== */}

        <section className="mt-16">

          <h2 className="text-2xl font-black tracking-tight text-gray-900">
            About this car
          </h2>


          <div
            className="
              mt-5
              max-w-4xl
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-sm
            "
          >

            <p
              className="
                leading-7
                text-gray-500
              "
            >
              {car.description}
            </p>

          </div>

        </section>



        {/* =====================================================
            FEATURES
        ====================================================== */}

        <section className="mt-16">

          <h2 className="text-2xl font-black tracking-tight text-gray-900">
            Features
          </h2>


          <div className="mt-6 flex flex-wrap gap-3">

            {[
              "Air Conditioning",
              "Bluetooth",
              "Power Steering",
              "USB Charging",
              "Central Locking",
              "Music System",
              "Comfortable Seats",
              "Safety Airbags",
            ].map((feature) => (

              <span
                key={feature}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-600
                  shadow-sm
                  transition-all
                  hover:border-orange-200
                  hover:bg-orange-50
                  hover:text-orange-600
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

          <h2 className="text-2xl font-black tracking-tight text-gray-900">
            Rental Information
          </h2>


          <div className="mt-6 grid gap-5 md:grid-cols-2">


            {/* INCLUDED */}

            <div
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                shadow-sm
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-orange-50
                    text-orange-500
                  "
                >
                  ✓
                </div>

                <h3 className="font-bold text-gray-900">
                  What's included
                </h3>

              </div>


              <ul className="mt-5 space-y-3 text-sm text-gray-500">

                <li>
                  ✓ Clean and sanitized vehicle
                </li>

                <li>
                  ✓ Basic roadside assistance
                </li>

                <li>
                  ✓ Vehicle documents
                </li>

                <li>
                  ✓ Regularly maintained vehicle
                </li>

              </ul>

            </div>



            {/* BEFORE BOOKING */}

            <div
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                shadow-sm
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-orange-50
                    text-orange-500
                  "
                >
                  !
                </div>

                <h3 className="font-bold text-gray-900">
                  Before you book
                </h3>

              </div>


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
                  ✓ Vehicle must be returned on time
                </li>

              </ul>

            </div>

          </div>

        </section>



        {/* =====================================================
            CUSTOMER REVIEWS
        ====================================================== */}

        <section className="mt-16">


          {/* REVIEW HEADER */}

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-black tracking-tight text-gray-900">
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
                border
                border-gray-200
                bg-white
                px-4
                py-3
                shadow-sm
              "
            >

              <span className="text-xl text-orange-500">
                ★
              </span>

              <span className="font-black text-gray-900">
                {car.rating}
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
                  border-gray-200
                  bg-white
                  p-5
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >

                <div className="flex items-center justify-between">

                  <p className="font-bold text-gray-900">
                    {review.name}
                  </p>


                  <span
                    className="
                      rounded-full
                      bg-orange-50
                      px-2
                      py-1
                      text-xs
                      font-bold
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
              Please login to add this car to your cart or book it.
            </p>

            <button
              type="button"
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
                transition-all
                hover:bg-orange-600
                active:scale-95
              "
            >
              Login to Continue
            </button>

            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="
                mt-3
                text-sm
                font-medium
                text-gray-400
                hover:text-gray-600
              "
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          FIXED BOOKING BAR
      ====================================================== */}

      <div
        className="
          fixed
          bottom-4
          left-1/2
          z-40
          w-[calc(100%-24px)]
          max-w-3xl
          -translate-x-1/2
          rounded-2xl
          border
          border-gray-200
          bg-white/95
          p-3
          shadow-[0_15px_45px_rgba(0,0,0,0.18)]
          backdrop-blur-xl
          sm:bottom-5
          sm:p-4
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            sm:gap-5
          "
        >


          {/* PRICE */}

          <div className="min-w-0">

            <p className="text-[10px] font-medium text-gray-400 sm:text-xs">
              Starting price
            </p>


            <div className="mt-0.5 flex items-baseline gap-1">

              <span className="text-xl font-black text-gray-900 sm:text-2xl">
                ₹{car.rent}
              </span>

              <span className="text-xs text-gray-400 sm:text-sm">
                /hr
              </span>

            </div>

          </div>



          {/* CAR NAME */}

          <div className="hidden min-w-0 sm:block">

            <p className="truncate text-sm font-bold text-gray-900">
              {car.company}
            </p>

            <p className="truncate text-xs font-medium text-orange-500">
              {car.model}
            </p>

          </div>



          {/* BUTTONS */}

          <div className="flex shrink-0 gap-2 sm:gap-3">


            {/* ADD TO CART */}

            <button
              type="button"
              onClick={handleCartBttn}
              className="
                rounded-xl
                border-2
                border-gray-900
                bg-white
                px-3
                py-2.5
                text-xs
                font-bold
                text-gray-900
                transition-all
                hover:bg-gray-900
                hover:text-white
                active:scale-95
                sm:px-4
                sm:py-3
                sm:text-sm
              "
            >
              Add to Cart
            </button>



            {/* BOOK NOW */}

            <button
              type="button"
              className="
                rounded-xl
                bg-orange-500
                px-4
                py-2.5
                text-xs
                font-bold
                text-white
                shadow-[0_6px_18px_rgba(249,115,22,0.28)]
                transition-all
                hover:-translate-y-0.5
                hover:bg-orange-600
                hover:shadow-[0_10px_25px_rgba(249,115,22,0.38)]
                active:translate-y-0
                sm:px-5
                sm:py-3
                sm:text-sm
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
                  `/user/booking/single/car/${car._id}`,
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

    </main>

  )

}


export default CarDetails
import { useState, useEffect } from "react"
import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { type Bike } from "../assets/bikeType"

const VITE_API_SERVER = import.meta.env.VITE_API_SERVER 

function BikeCard() {

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [bikes, setBikes] = useState<Bike[]>([])
  const [fetchingBikes, setFetchingBikes] = useState(true)

  // Rental period
  const [startDate, setStartDate] = useState(() => {
  return sessionStorage.getItem("rentalStartDate") || ""
  })
  
  const [endDate, setEndDate] = useState(() => {
    return sessionStorage.getItem("rentalEndDate") || ""
  })

  const Navigate = useNavigate()


  useEffect(() => {
    const fetch_bikes = async () => {
      if(startDate && endDate){
        handleSearch()
      }
      try {
        
        const response = await axios.get(`${VITE_API_SERVER}/user/bikes/`)
         setFetchingBikes(false)
        setBikes(response.data)

      } catch (error) {
        toast.error("Something went wrong . Try Again !")
      }
    }

    fetch_bikes()
  }, [])


  useEffect(() => {

  if (startDate) {
    sessionStorage.setItem("rentalStartDate",startDate)
  } else {
    sessionStorage.removeItem("rentalStartDate")
  }


  if (endDate) {
    sessionStorage.setItem(  "rentalEndDate",  endDate)
  } else {
    sessionStorage.removeItem(  "rentalEndDate")
  }

}, [startDate, endDate])

  let filteredBikes: Bike[] = bikes

  filteredBikes = bikes.filter((car) => {

    const matchesSearch =
      car.company.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase())

    const matchesFilter =
      filter === "all" ||
      (filter === "low" && car.rent < 300) ||
      (filter === "high" && car.rent >= 300)

    return matchesSearch && matchesFilter
  })


  // Search button
  const handleSearch = async() => {

    // If only one date is selected
    if (
      (startDate && !endDate) ||
      (!startDate && endDate)
    ) {
      toast.error("Please select both pickup and drop-off date")
      return
    }

    // Allow normal browsing without selecting dates
    if (!startDate && !endDate) {
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime())
    ) {
      toast.error("Please select valid dates")
      return
    }

    if (start >= end) {
      toast.error("Drop-off date must be after pickup date")
      return
    }
    try{
      
      const response = await axios.post(`${VITE_API_SERVER}/user/bikes/datefilter`,{
        startDate,
        endDate
      })
      
      setBikes(response.data)
      toast.success("Search updated")
    }catch(error:any){
      toast.error(error.response.data)
    }
    
  }


  // Rent button
  const handleRentNow = (bike: Bike) => {

    if (!startDate || !endDate) {
      toast.error("Please select pickup and drop-off date")
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime())
    ) {
      toast.error("Please select valid dates")
      return
    }

    if (start >= end) {
      toast.error("Drop-off date must be after pickup date")
      return
    }

    Navigate(
      `/user/bikes/${encodeURIComponent(bike.model)}`,
      {
        state: {
          startDate,
          endDate
        }
      }
    )
  }


  return (
    <>

      <section className="px-6 pt-32 pb-12 bg-[#f5f5f0]">

        <Navbar />

        {/* Heading */}
        <div className="mx-auto mb-8 max-w-6xl">

          {/* LEFT — Heading */}
          <div>

            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-500">
              Explore our bikes
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Find the perfect ride
            </h2>

            <p className="mt-2 text-gray-500">
              Reliable bikes at affordable hourly rates.
            </p>

          </div>

        </div>


        {/* Unified Search Bar */}
        <div className="mx-auto mb-10 flex max-w-6xl items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_8px_25px_rgba(0,0,0,0.08)]">


          {/* Search */}
          <div className="relative flex-1">

            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              type="text"
              placeholder="Search bikes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                h-12 w-full
                rounded-xl
                border border-gray-200
                bg-white
                pl-11 pr-4
                text-sm text-gray-800
                outline-none

                transition-all

                placeholder:text-gray-400

                hover:border-orange-400
                focus:border-orange-400
                focus:ring-2
                focus:ring-orange-100
              "
            />

          </div>


          {/* Pickup */}
          <div className="relative">

            <label className="pointer-events-none absolute left-4 top-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Pickup
            </label>

            <input
              type="datetime-local"
              value={startDate}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => {

                const value = e.target.value

                setStartDate(value)

                if (
                  endDate &&
                  new Date(value) >= new Date(endDate)
                ) {
                  setEndDate("")
                }

              }}
              className="
                h-12 w-52
                rounded-xl
                border border-gray-200
                bg-white
                px-4 pt-3
                text-sm text-gray-800
                outline-none

                transition-all

                hover:border-orange-400
                focus:border-orange-400
                focus:ring-2
                focus:ring-orange-100
              "
            />

          </div>


          {/* Drop-off */}
          <div className="relative">

            <label className="pointer-events-none absolute left-4 top-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Drop-off
            </label>

            <input
              type="datetime-local"
              value={endDate}
              min={
                startDate ||
                new Date().toISOString().slice(0, 16)
              }
              onChange={(e) => {

                const value = e.target.value

                if (
                  startDate &&
                  new Date(value) <= new Date(startDate)
                ) {
                  toast.error(
                    "Drop-off date must be after pickup date"
                  )
                  return
                }

                setEndDate(value)

              }}
              className="
                h-12 w-52
                rounded-xl
                border border-gray-200
                bg-white
                px-4 pt-3
                text-sm text-gray-800
                outline-none

                transition-all

                hover:border-orange-400
                focus:border-orange-400
                focus:ring-2
                focus:ring-orange-100
              "
            />

          </div>


          {/* Filter */}
          <div className="relative">

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="
                h-12
                appearance-none
                rounded-xl
                border border-gray-200
                bg-white
                px-4 pr-10
                text-sm font-medium
                text-gray-700
                outline-none

                transition-all

                hover:border-orange-300

                focus:border-orange-400
                focus:ring-2
                focus:ring-orange-100
              "
            >

              <option value="all" disabled>
                Filter
              </option>

              <option value="all">
                None
              </option>

              <option value="low">
                Under ₹300/hr
              </option>

              <option value="high">
                ₹300+/hr
              </option>

            </select>


            {/* Dropdown arrow */}
            <svg
              className="
                pointer-events-none
                absolute right-3 top-1/2
                h-4 w-4
                -translate-y-1/2
                text-gray-400
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>

          </div>


          {/* Search Bikes */}
          <button
            onClick={handleSearch}
            className="
              h-12
              rounded-xl
              bg-gray-900
              px-6
              text-sm font-semibold
              text-white

              shadow-md

              transition-all duration-200

              hover:bg-orange-500
              hover:shadow-[0_6px_18px_rgba(249,115,22,0.35)]

              active:scale-95
            "
          >
            Search Bikes
          </button>

        </div>


        {/* Cards */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* Loading */}
          {fetchingBikes && (
            <div className="col-span-full flex min-h-80 flex-col items-center justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
                <div className="absolute h-9 w-9 animate-spin rounded-full border-4 border-gray-100 border-b-gray-900 [animation-direction:reverse]" />
              </div>

              <p className="mt-6 text-base font-semibold text-gray-700">
                Finding available bikes
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Please wait a moment...
              </p>
            </div>
          )}

          {/* No results */}
          {!fetchingBikes && filteredBikes.length === 0 && (
            <div className="col-span-full py-16 text-center">

              <p className="text-lg font-semibold text-gray-700">
                No cars found
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Try a different search or filter.
              </p>

            </div>
          )}


          {/* Bike Cards */}
          {!fetchingBikes && filteredBikes.map((bike) => (

            <div
              key={bike.model}
              className="
                group overflow-hidden
                rounded-2xl
                border border-gray-200
                bg-white

                shadow-[0_8px_25px_rgba(0,0,0,0.08)]

                transition-all duration-300

                hover:-translate-y-2
                hover:border-orange-200
                hover:shadow-[0_18px_40px_rgba(0,0,0,0.14)]
              "
            >


              {/* IMAGE — approximately 40% */}
              <div className="relative h-52 overflow-hidden bg-gray-100">

                <img
                  src={bike.images[0]}
                  alt={`${bike.company} ${bike.model}`}
                  className="
                    h-full w-full object-cover
                    transition-transform duration-500
                    group-hover:scale-105
                  "
                />


                {/* Rating badge */}
                <div
                  className="
                    absolute right-4 top-4
                    flex items-center gap-1
                    rounded-full
                    bg-white/95
                    px-3 py-1.5
                    text-sm font-semibold
                    text-gray-800
                    shadow-md
                    backdrop-blur
                  "
                >

                  <span className="text-orange-500">
                    ★
                  </span>

                  {bike.rating}

                </div>

              </div>


              {/* INFORMATION — approximately 60% */}
              <div className="p-5">


                {/* Company + Model */}
                <div>

                  <p className="text-2xl font-bold text-gray-900 ">
                    {bike.company}
                  </p>

                  <h3 className="mt-1 text-xl font-medium text-orange-500">
                    {bike.model}
                  </h3>

                </div>


                {/* Bike specifications */}
                <div className="mt-4 flex gap-5 border-y border-gray-100 py-4">

                  <div>

                    <p className="text-xs text-gray-400">
                      Fuel
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {bike.fuel}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-gray-400">
                      Transmission
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {bike.transmission}
                    </p>

                  </div>

                </div>


                {/* Bottom section */}
                <div className="mt-5 flex items-end justify-between">

                  <div>

                    <p className="text-xs text-gray-400">
                      Starting from
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


                  {/* Rent button */}
                  <button
                    className="
                      rounded-xl
                      bg-gray-900
                      px-5 py-2.5
                      text-sm font-semibold
                      text-white

                      shadow-md

                      transition-all duration-200

                      hover:bg-orange-500
                      hover:shadow-[0_6px_18px_rgba(249,115,22,0.35)]

                      active:scale-95
                    "
                    onClick={() =>
                      handleRentNow(bike)
                    }
                  >
                    Rent Now
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

    </>
  )
}

export default BikeCard
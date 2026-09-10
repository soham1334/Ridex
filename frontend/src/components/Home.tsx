import { useNavigate, useLocation } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "./Authentication/AuthContext"
import { User } from "lucide-react"
import { api } from "./Authentication/axiosInterseptors"
import { toast } from "react-toastify"






function Home () {

   const Navigate = useNavigate()
   const location = useLocation()
   const { isLoggedIn,setIsLoggedIn } = useContext(AuthContext)
  
   const handleLogout = async() =>{
    console.log("entered into logout handle")
    try{
      const response = await api.post("/api/user/auth/logout")
      console.log(response.data)
      setIsLoggedIn(false);
    }catch(error){
      toast.error("Try Again !")
    }
   }
   

    return (
    <main className="min-h-screen bg-[#f5f5f0]">

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-28 pt-16">

        {/* Background decoration */}
        <div
          className="
            pointer-events-none
            absolute -right-32 top-20
            h-96 w-96
            rounded-full
            bg-orange-400/20
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute -left-32 bottom-10
            h-72 w-72
            rounded-full
            bg-orange-300/10
            blur-3xl
          "
        />


       <div className="relative mx-auto max-w-6xl">
        {/* AUTH BUTTONS */}
<div className="absolute right-0 top-0 flex items-center gap-3">

  {!isLoggedIn ? (
    <>
      <button
        className="
          px-5 py-2.5
          text-sm font-semibold
          text-orange-500
          rounded-full border
          border-orange-500
          transition-all duration-200
          hover:-translate-y-0.5
          hover:bg-orange-500
          hover:text-white
        "
        onClick={() => Navigate("/login", { state: { from: location } })}
      >
        Log in
      </button>

      <button
        className="
          rounded-xl
          bg-orange-500
          px-5 py-2.5
          text-sm font-semibold
          text-white
          transition-all duration-200
          hover:-translate-y-0.5
          hover:bg-orange-50
          hover:border border-orange-500
          hover:text-orange-500
          active:translate-y-0
        "
        onClick={() => Navigate("/signup", { state: { from: location } })}
      >
        Sign up
      </button>
    </>
  ) : (
    <>
      <button
        type="button"
        aria-label="Account"
        className="
          flex h-10 w-10
          items-center justify-center
          rounded-full
          border border-gray-200
          bg-white
          text-gray-700
          shadow-sm
          transition-all duration-200
          hover:-translate-y-0.5
          hover:border-orange-300
          hover:text-orange-500
        "
        onClick={() => Navigate("/user/account")}
      >
        <User size={20} />
      </button>

      <button
        className="
          rounded-xl
          border border-orange-500
          bg-white
          px-5 py-2.5
          text-sm font-semibold
          text-orange-500
          transition-all duration-200
          hover:-translate-y-0.5
          hover:bg-orange-500
          hover:text-white
          active:translate-y-0
        "
        onClick={() => handleLogout()}
      >
        Sign out
      </button>
    </>
  )}

</div>

  {/* BRAND */}
  <div className="mb-10 flex items-center gap-3">

    <div
      className="
        flex h-12 w-12
        items-center justify-center
        rounded-2xl
        bg-orange-500
        text-2xl font-black
        text-white
        shadow-[0_8px_20px_rgba(249,115,22,0.3)]
      "
    >
      R
    </div>

    <div>
      <h2 className="text-4xl font-black tracking-tight text-gray-900">
        Ride<span className="text-orange-500">X</span>
      </h2>

      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
        Move freely
      </p>
    </div>

  </div>


  {/* HERO CONTENT */}
  <div className="grid items-center gap-12 lg:grid-cols-2">



          {/* LEFT */}
          <div>

            <div
              className="
                mb-5 inline-flex items-center gap-2
                rounded-full
                border border-orange-200
                bg-orange-50
                px-4 py-2
                text-sm font-semibold
                text-orange-600
              "
            >
              <span className="h-2 w-2 rounded-full bg-orange-500" />

              Your journey starts here
            </div>


            <h1
              className="
                max-w-xl
                text-5xl font-black
                leading-[1.05]
                tracking-tight
                text-gray-900
                sm:text-6xl
              "
            >
              Find your
              <span className="text-orange-500">
                {" "}perfect 
              </span>
               {" "}ride.
            </h1>


            <p
              className="
                mt-6 max-w-lg
                text-lg leading-8
                text-gray-500
              "
            >
              From quick city rides to comfortable road trips,
              rent the car or bike that fits your journey.
            </p>


            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap gap-4">

              <button
                className="
                  rounded-xl
                  bg-orange-500
                  px-7 py-3.5
                  font-semibold
                  text-white

                  shadow-[0_8px_20px_rgba(249,115,22,0.3)]

                  transition-all duration-200

                  hover:-translate-y-1
                  hover:bg-orange-600
                  hover:shadow-[0_12px_25px_rgba(249,115,22,0.4)]

                  active:translate-y-0
                "
                onClick={() => Navigate("/user/bikes")}
              >
                Browse Vehicles
              </button>


              <button
                className="
                  rounded-xl
                  border border-gray-200
                  bg-white
                  px-7 py-3.5
                  font-semibold
                  text-gray-700

                  shadow-[0_5px_15px_rgba(0,0,0,0.06)]

                  transition-all duration-200

                  hover:-translate-y-1
                  hover:border-orange-300
                  hover:text-orange-500

                  active:translate-y-0
                "
              >
                How it works
              </button>

            </div>


            {/* Trust points */}
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3">

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-bold text-orange-500">✓</span>
                Easy booking
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-bold text-orange-500">✓</span>
                Affordable rates
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-bold text-orange-500">✓</span>
                Reliable vehicles
              </div>

            </div>

          </div>


          {/* RIGHT — VEHICLE IMAGE */}
          <div className="relative">

            {/* Orange glow */}
            <div
              className="
                absolute
                right-10 top-10
                h-72 w-72
                rounded-full
                bg-orange-500/20
                blur-3xl
              "
            />


            {/* Image container */}
            <div
              className="
                relative
                overflow-hidden
                rounded-4xl

                border
                border-white

                bg-gray-200

                shadow-[0_30px_70px_rgba(0,0,0,0.18)]
              "
            >

              <img
                src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=85"
                alt="Rental car"
                className="
                  h-107.5
                  w-full
                  object-cover
                "
              />


              {/* Image overlay */}
              <div
                className="
                  absolute inset-0
                  bg-linear-to-t
                  from-black/50
                  via-transparent
                  to-transparent
                "
              />



            </div>


            
          </div>

        </div>

       </div>
       

      </section>
      {/* STATS */}
<section className="relative z-20 px-6 pb-20">

  <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

    {/* Bikes */}
    <div
      className="
        group
        rounded-2xl
        border border-gray-200
        bg-white
        px-6 py-5

        shadow-[0_10px_25px_rgba(0,0,0,0.07)]

        transition-all duration-300

        hover:-translate-y-2
        hover:border-orange-200
        hover:shadow-[0_18px_35px_rgba(0,0,0,0.12)]
      "
    >

      <div className="flex items-center gap-4">

        <div
          className="
            flex h-12 w-12 shrink-0
            items-center justify-center
            rounded-xl
            bg-orange-100
            text-xl
            transition-transform duration-300
            group-hover:scale-110
          "
        >
          🏍️
        </div>

        <div>
          <p className="text-2xl font-bold text-orange-500">
            400+
          </p>

          <p className="text-sm font-medium text-gray-900">
            Bikes available
          </p>
        </div>

      </div>

    </div>


    {/* Cars */}
    <div
      className="
        group
        rounded-2xl
        border border-gray-200
        bg-white
        px-6 py-5

        shadow-[0_10px_25px_rgba(0,0,0,0.07)]

        transition-all duration-300

        hover:-translate-y-2
        hover:border-orange-200
        hover:shadow-[0_18px_35px_rgba(0,0,0,0.12)]
      "
    >

      <div className="flex items-center gap-4">

        <div
          className="
            flex h-12 w-12 shrink-0
            items-center justify-center
            rounded-xl
            bg-orange-100
            text-xl
            transition-transform duration-300
            group-hover:scale-110
          "
        >
          🚗
        </div>

        <div>
          <p className="text-2xl font-bold text-orange-500">
            300+
          </p>

          <p className="text-sm font-medium text-gray-900">
            Cars available
          </p>
        </div>

      </div>

    </div>


    {/* Completed rides */}
    <div
      className="
        group
        rounded-2xl
        border border-gray-200
        bg-white
        px-6 py-5

        shadow-[0_10px_25px_rgba(0,0,0,0.07)]

        transition-all duration-300

        hover:-translate-y-2
        hover:border-orange-200
        hover:shadow-[0_18px_35px_rgba(0,0,0,0.12)]
      "
    >

      <div className="flex items-center gap-4">

        <div
          className="
            flex h-12 w-12 shrink-0
            items-center justify-center
            rounded-xl
            bg-orange-100
            text-xl
            transition-transform duration-300
            group-hover:scale-110
          "
        >
          ✓
        </div>

        <div>
          <p className="text-2xl font-bold text-orange-500">
            1,200+
          </p>

          <p className="text-sm font-medium text-gray-900">
            Rides completed
          </p>
        </div>

      </div>

    </div>


    {/* Rating */}
    <div
      className="
        group
        rounded-2xl
        border border-gray-200
        bg-white
        px-6 py-5

        shadow-[0_10px_25px_rgba(0,0,0,0.07)]

        transition-all duration-300

        hover:-translate-y-2
        hover:border-orange-200
        hover:shadow-[0_18px_35px_rgba(0,0,0,0.12)]
      "
    >

      <div className="flex items-center gap-4">

        <div
          className="
            flex h-12 w-12 shrink-0
            items-center justify-center
            rounded-xl
            bg-orange-100
            text-xl
            transition-transform duration-300
            group-hover:scale-110
          "
        >
          ★
        </div>

        <div>
          <p className="text-2xl font-bold text-orange-500">
            4.8/5
          </p>

          <p className="text-sm font-medium text-gray-900">
            Customer rating
          </p>
        </div>

      </div>

    </div>

  </div>

</section>


{/* VEHICLE CATEGORIES */}
<section className="px-4"></section> 

      {/* VEHICLE CATEGORIES */}
      <section className="px-6 pb-20">

        <div className="mx-auto max-w-6xl">

          <div className="mb-8">

            <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
              Choose your ride
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              What are you looking for?
            </h2>

          </div>


          <div className="grid gap-6 md:grid-cols-2">

            {/* Bike */}
            <div
              className="
                group relative
                overflow-hidden
                rounded-3xl
                bg-gray-900
                p-8

                shadow-[0_12px_30px_rgba(0,0,0,0.12)]

                transition-all duration-300

                hover:-translate-y-2
                hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)]
              "
            >

              <div className="relative z-10">

                <p className="text-sm font-medium text-orange-400">
                  TWO WHEELER
                </p>

                <h3 className="mt-2 text-3xl font-bold text-white">
                  Bikes
                </h3>

                <p className="mt-3 max-w-sm text-gray-400">
                  Quick, economical and perfect for
                  exploring the city.
                </p>

                <button
                  className="
                    mt-6
                    rounded-xl
                    bg-orange-500
                    px-5 py-2.5
                    text-sm font-semibold
                    text-white

                    transition

                    hover:bg-orange-400
                  "
                  onClick={()=> Navigate("/user/bikes")}
                >
                  Explore Bikes →
                </button>

              </div>


              <div
                className="
                  absolute
                  -right-12
                  -bottom-16
                  text-[180px]
                  opacity-10
                  transition-transform duration-500
                  group-hover:scale-110
                "
              >
                🏍️
              </div>

            </div>


            {/* Car */}
            <div
              className="
                group relative
                overflow-hidden
                rounded-3xl
                bg-orange-500
                p-8

                shadow-[0_12px_30px_rgba(249,115,22,0.2)]

                transition-all duration-300

                hover:-translate-y-2
                hover:shadow-[0_20px_40px_rgba(249,115,22,0.3)]
              "
            >

              <div className="relative z-10">

                <p className="text-sm font-medium text-orange-100">
                  FOUR WHEELER
                </p>

                <h3 className="mt-2 text-3xl font-bold text-white">
                  Cars
                </h3>

                <p className="mt-3 max-w-sm text-orange-100">
                  Comfortable and reliable cars for
                  every kind of journey.
                </p>

                <button
                  className="
                    mt-6
                    rounded-xl
                    bg-white
                    px-5 py-2.5
                    text-sm font-semibold
                    text-orange-600

                    transition

                    hover:bg-gray-100
                  "
                  onClick = {() => Navigate("/user/cars")}
                >
                  Explore Cars →
                </button>

              </div>


              <div
                className="
                  absolute
                  -right-12
                  -bottom-16
                  text-[180px]
                  opacity-20
                  transition-transform duration-500
                  group-hover:scale-110
                "
              >
                🚗
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* WHY RIDEX */}
      <section className="border-t border-gray-200 bg-white px-6 py-20">

        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
              Why RideX?
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Renting made simple
            </h2>

          </div>


          <div className="mt-12 grid gap-8 md:grid-cols-3">

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                ⚡
              </div>

              <h3 className="mt-5 font-bold text-gray-900">
                Quick & Easy
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Find and book your vehicle in just a few simple steps.
              </p>

            </div>


            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                💰
              </div>

              <h3 className="mt-5 font-bold text-gray-900">
                Affordable
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Transparent hourly rates with no unnecessary surprises.
              </p>

            </div>


            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                🛡️
              </div>

              <h3 className="mt-5 font-bold text-gray-900">
                Reliable Vehicles
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Choose from well-maintained cars and bikes.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}

export default Home
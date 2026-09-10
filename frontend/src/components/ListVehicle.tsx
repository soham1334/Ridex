import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"
import { useRef, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import {
  ArrowLeft,
  CarFront,
  Bike,
  ImagePlus,
  X,
  Upload,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ExternalLink,
} from "lucide-react"
import { api } from "./Authentication/axiosInterseptors"

function ListVehicle() {

  const navigate = useNavigate()

  // ==========================================
  // REFS
  // ==========================================

  const imageInputRef =
    useRef<HTMLInputElement | null>(null)

  const rcInputRef =
    useRef<HTMLInputElement | null>(null)

  const insuranceInputRef =
    useRef<HTMLInputElement | null>(null)

  const pucInputRef =
    useRef<HTMLInputElement | null>(null)


  // ==========================================
  // VEHICLE TYPE
  // ==========================================

  const [vehicleType, setVehicleType] =
    useState<"car" | "bike">("car")


  // ==========================================
  // VEHICLE FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
  company: "",
  model: "",
  vehicleNo: "",
  rent: "",
  seats: "",
  mileage: "",
  engine: "",
  fuel: "",
  transmission: "",
  age: "",
  distanceCovered: "",
  description: "",
})


  // ==========================================
  // IMAGE STATE
  // ==========================================

  const [images, setImages] =
    useState<File[]>([])

  const [imagePreviews, setImagePreviews] =
    useState<string[]>([])

  const [imageUrls, setImageUrls] =
    useState<string[]>([])

  const [imageUrlInput, setImageUrlInput] =
    useState("")


  // ==========================================
  // DOCUMENT STATE
  // ==========================================

  const [documents, setDocuments] = useState({
    rc: null as File | null,
    insurance: null as File | null,
    puc: null as File | null,
  })


  // ==========================================
  // FORM ERRORS
  // ==========================================

  const [errors, setErrors] =
    useState<Record<string, string>>({})


  // ==========================================
  // SUBMITTING
  // ==========================================

  const [isSubmitting, setIsSubmitting] =
    useState(false)


  // ==========================================
  // HANDLE VEHICLE INPUT
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
    } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Remove error when field is corrected

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
  // HANDLE VEHICLE TYPE
  // ==========================================

  const handleVehicleTypeChange = (
    type: "car" | "bike"
  ) => {

    setVehicleType(type)

    if (errors.vehicleType) {

      setErrors((prev) => {

        const updated = {
          ...prev,
        }

        delete updated.vehicleType

        return updated
      })
    }
  }


  // ==========================================
  // IMAGE FILE UPLOAD
  // ==========================================

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const files =
      Array.from(e.target.files || [])

    if (!files.length) {
      return
    }

    const remainingSlots =
      5 -
      images.length -
      imageUrls.length

    if (remainingSlots <= 0) {

      toast.error(
        "You can add a maximum of 5 images."
      )

      return
    }

    const selectedFiles =
      files.slice(0, remainingSlots)

    const validFiles =
      selectedFiles.filter((file) => {

        if (!file.type.startsWith("image/")) {

          toast.error(
            `${file.name} is not a valid image.`
          )

          return false
        }

        if (
          file.size >
          5 * 1024 * 1024
        ) {

          toast.error(
            `${file.name} is larger than 5 MB.`
          )

          return false
        }

        return true
      })


    const previews =
      validFiles.map((file) =>
        URL.createObjectURL(file)
      )


    setImages((prev) => [
      ...prev,
      ...validFiles,
    ])

    setImagePreviews((prev) => [
      ...prev,
      ...previews,
    ])


    if (files.length > remainingSlots) {

      toast.info(
        "Only 5 vehicle images are allowed."
      )
    }


    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }


    // Clear image error

    if (validFiles.length > 0) {

      setErrors((prev) => {

        const updated = {
          ...prev,
        }

        delete updated.images

        return updated
      })
    }
  }


  // ==========================================
  // IMAGE URL VALIDATION
  // ==========================================

  const isValidImageUrl = (
    value: string
  ) => {

    try {

      const url =
        new URL(value)

      return (
        url.protocol === "http:" ||
        url.protocol === "https:"
      )

    } catch {

      return false

    }
  }


  // ==========================================
  // ADD IMAGE URL
  // ==========================================

  const handleAddImageUrl = () => {

    const url =
      imageUrlInput.trim()

    if (!url) {

      setErrors((prev) => ({
        ...prev,
        imageUrl:
          "Please enter an image URL.",
      }))

      return
    }


    if (!isValidImageUrl(url)) {

      setErrors((prev) => ({
        ...prev,
        imageUrl:
          "Please enter a valid image URL.",
      }))

      return
    }


    if (
      images.length +
      imageUrls.length >=
      5
    ) {

      toast.error(
        "You can add a maximum of 5 images."
      )

      return
    }


    // Prevent duplicate URLs

    if (imageUrls.includes(url)) {

      setErrors((prev) => ({
        ...prev,
        imageUrl:
          "This image URL has already been added.",
      }))

      return
    }


    setImageUrls((prev) => [
      ...prev,
      url,
    ])

    setImageUrlInput("")


    setErrors((prev) => {

      const updated = {
        ...prev,
      }

      delete updated.imageUrl
      delete updated.images

      return updated
    })
  }


  // ==========================================
  // REMOVE FILE IMAGE
  // ==========================================

  const removeFileImage = (
    index: number
  ) => {

    URL.revokeObjectURL(
      imagePreviews[index]
    )

    setImages((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    )

    setImagePreviews((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    )
  }


  // ==========================================
  // REMOVE URL IMAGE
  // ==========================================

  const removeUrlImage = (
    index: number
  ) => {

    setImageUrls((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    )
  }


  // ==========================================
  // DOCUMENT UPLOAD
  // ==========================================

  const handleDocumentUpload = (
    type: "rc" | "insurance" | "puc",
    file: File | undefined
  ) => {

    if (!file) {
      return
    }


    if (
      !file.type.startsWith("image/") &&
      file.type !== "application/pdf"
    ) {

      toast.error(
        "Please upload a PDF or image file."
      )

      return
    }


    if (
      file.size >
      10 * 1024 * 1024
    ) {

      toast.error(
        "Document must be smaller than 10 MB."
      )

      return
    }


    setDocuments((prev) => ({
      ...prev,
      [type]: file,
    }))


    setErrors((prev) => {

      const updated = {
        ...prev,
      }

      delete updated[type]

      return updated
    })
  }


  // ==========================================
  // REMOVE DOCUMENT
  // ==========================================

  const removeDocument = (
    type: "rc" | "insurance" | "puc"
  ) => {

    setDocuments((prev) => ({
      ...prev,
      [type]: null,
    }))
  }


  // ==========================================
  // VALIDATE FORM
  // ==========================================

  const validateForm = () => {

    const newErrors:
      Record<string, string> = {}


    // ========================================
    // VEHICLE TYPE
    // ========================================

    if (
      vehicleType !== "car" &&
      vehicleType !== "bike"
    ) {

      newErrors.vehicleType =
        "Please select a vehicle type."
    }


    // ========================================
    // COMPANY
    // ========================================

    if (
      !formData.company.trim()
    ) {

      newErrors.company =
        "Please enter the vehicle company."

    } else if (
      formData.company.trim().length < 2
    ) {

      newErrors.company =
        "Company name must be at least 2 characters."
    }


    // ========================================
    // MODEL
    // ========================================

    if (
      !formData.model.trim()
    ) {

      newErrors.model =
        "Please enter the vehicle model."

    } else if (
      formData.model.trim().length < 2
    ) {

      newErrors.model =
        "Model name must be at least 2 characters."
    }


    // ========================================
    // RENT
    // ========================================

    const rent =
      Number(formData.rent)

    if (!formData.rent) {

      newErrors.rent =
        "Please enter the hourly rental price."

    } else if (
      !Number.isFinite(rent) ||
      rent <= 0
    ) {

      newErrors.rent =
        "Rental price must be greater than 0."
    }

    // ========================================
// VEHICLE NUMBER
// ========================================

if (!formData.vehicleNo.trim()) {

  newErrors.vehicleNo =
    "Please enter the vehicle number."

} else if (
  formData.vehicleNo.trim().length < 3
) {

  newErrors.vehicleNo =
    "Please enter a valid vehicle number."
}


    // ========================================
    // SEATS
    // ========================================

    const seats =
      Number(formData.seats)

    if (!formData.seats) {

      newErrors.seats =
        "Please enter the seating capacity."

    } else if (
      !Number.isInteger(seats) ||
      seats <= 0
    ) {

      newErrors.seats =
        "Please enter a valid seating capacity."
    }


    // ========================================
    // MILEAGE
    // ========================================

    const mileage =
      Number(formData.mileage)

    if (!formData.mileage) {

      newErrors.mileage =
        "Please enter the mileage."

    } else if (
      !Number.isFinite(mileage) ||
      mileage <= 0
    ) {

      newErrors.mileage =
        "Mileage must be greater than 0."
    }


    // ========================================
    // ENGINE
    // ========================================

    const engine =
      Number(formData.engine)

    if (!formData.engine) {

      newErrors.engine =
        "Please enter the engine capacity."

    } else if (
      !Number.isFinite(engine) ||
      engine <= 0
    ) {

      newErrors.engine =
        "Engine capacity must be greater than 0."
    }


    // ========================================
    // FUEL
    // ========================================

    if (!formData.fuel) {

      newErrors.fuel =
        "Please select the fuel type."
    }


    // ========================================
    // TRANSMISSION
    // ========================================

    if (!formData.transmission) {

      newErrors.transmission =
        "Please select the transmission type."
    }


    // ========================================
    // AGE
    // ========================================

    const age =
      Number(formData.age)

    if (!formData.age) {

      newErrors.age =
        "Please enter the vehicle age."

    } else if (
      !Number.isInteger(age) ||
      age < 0
    ) {

      newErrors.age =
        "Vehicle age must be 0 or greater."
    }


    // ========================================
    // DISTANCE COVERED
    // ========================================

    const distance =
      Number(
        formData.distanceCovered
      )

    if (
      !formData.distanceCovered
    ) {

      newErrors.distanceCovered =
        "Please enter the distance covered."

    } else if (
      !Number.isFinite(distance) ||
      distance < 0
    ) {

      newErrors.distanceCovered =
        "Distance covered cannot be negative."
    }


    // ========================================
    // DESCRIPTION
    // ========================================

    const description =
      formData.description.trim()

    if (!description) {

      newErrors.description =
        "Please provide a vehicle description."

    } else if (
      description.length < 20
    ) {

      newErrors.description =
        "Description must contain at least 20 characters."
    }


    // ========================================
    // IMAGES
    // ========================================

    const totalImages =
      images.length +
      imageUrls.length

    if (totalImages === 0) {

      newErrors.images =
        "Please add at least one vehicle image."
    }


    // ========================================
    // DOCUMENTS
    // ========================================

    if (!documents.rc) {

      newErrors.rc =
        "Please upload the Registration Certificate."
    }


    if (!documents.insurance) {

      newErrors.insurance =
        "Please upload the insurance document."
    }


    if (!documents.puc) {

      newErrors.puc =
        "Please upload the PUC document."
    }


    setErrors(newErrors)


    // Scroll to first error

    if (
      Object.keys(newErrors).length > 0
    ) {

      setTimeout(() => {

        const firstError =
          document.querySelector(
            ".border-red-400"
          )

        firstError?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })

      }, 50)

      return false
    }


    return true
  }


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault()


    // Validate EVERYTHING first

    if (!validateForm()) {
      return
    }


    setIsSubmitting(true)


    try {

      // ========================================
      // API READY PAYLOAD
      // ========================================

      const data =
        new FormData()


      // ========================================
      // VEHICLE TYPE
      // ========================================

      data.append(
        "vehicleType",
        vehicleType
      )


      // ========================================
      // VEHICLE DATA
      // ========================================

      data.append(
        "company",
        formData.company.trim()
      )

      data.append(
        "model",
        formData.model.trim()
      )

      data.append(
        "rent",
        formData.rent
      )
      data.append(
  "vehicleNo",
  formData.vehicleNo.trim()
)

      data.append(
        "seats",
        formData.seats
      )

      data.append(
        "mileage",
        formData.mileage
      )

      data.append(
        "engine",
        formData.engine
      )

      data.append(
        "fuel",
        formData.fuel
      )

      data.append(
        "transmission",
        formData.transmission
      )

      data.append(
        "age",
        formData.age
      )

      data.append(
        "distanceCovered",
        formData.distanceCovered
      )

      data.append(
        "description",
        formData.description.trim()
      )


      // ========================================
      // VEHICLE IMAGE FILES
      // ========================================

      images.forEach((file) => {

        data.append(
          "pics",
          file
        )

      })


      // ========================================
      // VEHICLE IMAGE URLS
      // ========================================

      imageUrls.forEach((url) => {

        data.append(
          "images",
          url
        )

      })


      // ========================================
      // DOCUMENTS
      // ========================================

    //   if (documents.rc) {

    //     data.append(
    //       "rc",
    //       documents.rc
    //     )
    //   }


    //   if (documents.insurance) {

    //     data.append(
    //       "insurance",
    //       documents.insurance
    //     )
    //   }


    //   if (documents.puc) {

    //     data.append(
    //       "puc",
    //       documents.puc
    //     )
    //   }



      
        // =========================================
        // BACKEND API
        // =========================================

        

        const response = await api.post(
          "/api/host/addvehicle",
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        )

        console.log(response.data)

        


    
      console.log(
        "READY FOR API:",
        {
          vehicleType,
          formData,
          images,
          imageUrls,
          documents,
        }
      )


      toast.success(
        "Vehicle details are ready to be submitted!"
      )


      setIsSubmitting(false)
     


    } catch (error: any) {

      console.error(
        "LIST VEHICLE ERROR:",
        error
      )


      const message =
        error.response?.data?.message ||
        "Unable to list vehicle. Please try again."


      setErrors({
        general: message,
      })


      toast.error(message)


      setIsSubmitting(false)
    }
  }


  // ==========================================
  // INPUT CLASS
  // ==========================================

  const inputClass = (
    field: string
  ) => `
    w-full
    rounded-xl
    border
    ${
      errors[field]
        ? "border-red-400"
        : "border-gray-200"
    }
    bg-gray-50
    px-4
    py-3
    text-sm
    text-gray-800
    outline-none
    transition
    placeholder:text-gray-400
    hover:border-orange-300
    focus:border-orange-400
    focus:bg-white
    focus:ring-4
    focus:ring-orange-500/10
  `


  // ==========================================
  // DOCUMENT CARD
  // ==========================================

  const renderDocumentCard = (
    type: "rc" | "insurance" | "puc",
    title: string,
    description: string,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {

    const file =
      documents[type]

    return (

      <div
        className={`
          rounded-2xl
          border
          ${
            errors[type]
              ? "border-red-300 bg-red-50/30"
              : "border-gray-200 bg-gray-50/60"
          }
          p-4
          transition
        `}
      >

        <div className="flex items-start gap-3">

          <div className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-orange-100
            text-orange-500
          ">
            <FileText size={19} />
          </div>


          <div className="min-w-0 flex-1">

            <p className="
              text-sm
              font-bold
              text-gray-900
            ">
              {title}
              <span className="
                ml-1
                text-orange-500
              ">
                *
              </span>
            </p>

            <p className="
              mt-0.5
              text-xs
              leading-5
              text-gray-400
            ">
              {description}
            </p>

          </div>

        </div>


        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) =>
            handleDocumentUpload(
              type,
              e.target.files?.[0]
            )
          }
        />


        {file ? (

          <div className="
            mt-4
            flex
            items-center
            justify-between
            gap-3
            rounded-xl
            border
            border-green-200
            bg-green-50
            px-3
            py-2.5
          ">

            <div className="
              flex
              min-w-0
              items-center
              gap-2
            ">

              <CheckCircle2
                size={17}
                className="shrink-0 text-green-500"
              />

              <p className="
                truncate
                text-xs
                font-semibold
                text-green-700
              ">
                {file.name}
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                removeDocument(type)
              }
              className="
                shrink-0
                text-xs
                font-bold
                text-gray-400
                transition
                hover:text-red-500
              "
            >
              Remove
            </button>

          </div>

        ) : (

          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            className="
              mt-4
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-2.5
              text-xs
              font-bold
              text-gray-700
              transition
              hover:border-orange-300
              hover:bg-orange-50
              hover:text-orange-500
            "
          >

            <Upload size={15} />

            Upload document

          </button>

        )}


        {errors[type] && (

          <p className="
            mt-2
            text-xs
            font-medium
            text-red-500
          ">
            {errors[type]}
          </p>

        )}

      </div>

    )
  }


  return (

    <main className="
      min-h-screen
      bg-[#f5f5f0]
    ">

      <ToastContainer />


      <Navbar />


      <section className="
        px-6
        pb-20
        pt-32
      ">

        <div className="
          mx-auto
          max-w-5xl
        ">


          {/* ==========================================
              BACK BUTTON
          ========================================== */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/user/listed-vehicles"
              )
            }
            className="
              mb-7
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-gray-500
              transition
              hover:text-orange-500
            "
          >

            <ArrowLeft size={17} />

            Back to Listed Vehicles

          </button>


          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="mb-8">

            <p className="
              mb-2
              text-sm
              font-bold
              uppercase
              tracking-[0.18em]
              text-orange-500
            ">
              Host Dashboard
            </p>


            <h1 className="
              text-4xl
              font-black
              tracking-tight
              text-gray-900
            ">
              List your vehicle
            </h1>


            <p className="
              mt-2
              max-w-2xl
              text-gray-500
            ">
              Add your vehicle details, upload
              verification documents and start earning
              with RideX.
            </p>

          </div>


          {/* ==========================================
              FORM
          ========================================== */}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
          >


            {/* ========================================
                VEHICLE TYPE
            ========================================= */}

            <section className="
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-[0_8px_30px_rgba(0,0,0,0.05)]
              sm:p-7
            ">

              <div className="mb-6">

                <p className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-orange-500
                ">
                  Vehicle Type
                </p>


                <h2 className="
                  mt-1
                  text-xl
                  font-black
                  text-gray-900
                ">
                  What are you listing?
                </h2>


                <p className="
                  mt-1
                  text-sm
                  text-gray-500
                ">
                  Select the type of vehicle you want
                  to offer for rent.
                </p>

              </div>


              <div className="
                grid
                gap-4
                sm:grid-cols-2
              ">


                {/* CAR */}

                <button
                  type="button"
                  onClick={() =>
                    handleVehicleTypeChange("car")
                  }
                  className={`
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    border-2
                    p-5
                    text-left
                    transition-all
                    ${
                      vehicleType === "car"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/30"
                    }
                  `}
                >

                  <div className={`
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${
                      vehicleType === "car"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }
                  `}>

                    <CarFront size={25} />

                  </div>


                  <div className="flex-1">

                    <p className="
                      font-bold
                      text-gray-900
                    ">
                      Car
                    </p>

                    <p className="
                      mt-0.5
                      text-xs
                      text-gray-500
                    ">
                      Sedan, SUV, hatchback, etc.
                    </p>

                  </div>


                  {vehicleType === "car" && (

                    <CheckCircle2
                      size={20}
                      className="text-orange-500"
                    />

                  )}

                </button>


                {/* BIKE */}

                <button
                  type="button"
                  onClick={() =>
                    handleVehicleTypeChange("bike")
                  }
                  className={`
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    border-2
                    p-5
                    text-left
                    transition-all
                    ${
                      vehicleType === "bike"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/30"
                    }
                  `}
                >

                  <div className={`
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${
                      vehicleType === "bike"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }
                  `}>

                    <Bike size={25} />

                  </div>


                  <div className="flex-1">

                    <p className="
                      font-bold
                      text-gray-900
                    ">
                      Bike
                    </p>

                    <p className="
                      mt-0.5
                      text-xs
                      text-gray-500
                    ">
                      Scooter, commuter, sports bike, etc.
                    </p>

                  </div>


                  {vehicleType === "bike" && (

                    <CheckCircle2
                      size={20}
                      className="text-orange-500"
                    />

                  )}

                </button>

              </div>

            </section>


            {/* ========================================
                BASIC INFORMATION
            ========================================= */}

            <section className="
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-[0_8px_30px_rgba(0,0,0,0.05)]
              sm:p-7
            ">

              <div className="mb-6">

                <p className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-orange-500
                ">
                  Step 1
                </p>


                <h2 className="
                  mt-1
                  text-xl
                  font-black
                  text-gray-900
                ">
                  Basic information
                </h2>


                <p className="
                  mt-1
                  text-sm
                  text-gray-500
                ">
                  Tell renters what vehicle you're offering.
                </p>

              </div>


              <div className="
                grid
                gap-5
                sm:grid-cols-2
              ">


                {/* COMPANY */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-bold
                    text-gray-700
                  ">
                    Company
                  </label>


                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={
                      vehicleType === "car"
                        ? "e.g. Hyundai"
                        : "e.g. Royal Enfield"
                    }
                    className={inputClass("company")}
                  />


                  {errors.company && (

                    <p className="
                      mt-1.5
                      text-xs
                      font-medium
                      text-red-500
                    ">
                      {errors.company}
                    </p>

                  )}

                </div>


                {/* MODEL */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-bold
                    text-gray-700
                  ">
                    Model
                  </label>


                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder={
                      vehicleType === "car"
                        ? "e.g. Creta"
                        : "e.g. Classic 350"
                    }
                    className={inputClass("model")}
                  />


                  {errors.model && (

                    <p className="
                      mt-1.5
                      text-xs
                      font-medium
                      text-red-500
                    ">
                      {errors.model}
                    </p>

                  )}

                </div>

                {/* VEHICLE NUMBER */}

<div>

  <label className="
    mb-1.5
    block
    text-xs
    font-bold
    text-gray-700
  ">
    Vehicle Number
  </label>


  <input
    type="text"
    name="vehicleNo"
    value={formData.vehicleNo}
    onChange={handleChange}
    placeholder="e.g. MH12AB1234"
    className={inputClass("vehicleNo")}
  />


  {errors.vehicleNo && (

    <p className="
      mt-1.5
      text-xs
      font-medium
      text-red-500
    ">
      {errors.vehicleNo}
    </p>

  )}

</div>


                {/* RENT */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-bold
                    text-gray-700
                  ">
                    Rental price
                  </label>


                  <div className="relative">

                    <span className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-sm
                      font-bold
                      text-gray-500
                    ">
                      ₹
                    </span>


                    <input
                      type="number"
                      name="rent"
                      value={formData.rent}
                      onChange={handleChange}
                      min="1"
                      placeholder="900"
                      className={`
                        ${inputClass("rent")}
                        pl-8
                        pr-16
                      `}
                    />


                    <span className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-xs
                      text-gray-400
                    ">
                      / hour
                    </span>

                  </div>


                  {errors.rent && (

                    <p className="
                      mt-1.5
                      text-xs
                      font-medium
                      text-red-500
                    ">
                      {errors.rent}
                    </p>

                  )}

                </div>


                {/* SEATS */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-bold
                    text-gray-700
                  ">
                    Seating capacity
                  </label>


                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleChange}
                    min="1"
                    placeholder={
                      vehicleType === "car"
                        ? "5"
                        : "2"
                    }
                    className={inputClass("seats")}
                  />


                  {errors.seats && (

                    <p className="
                      mt-1.5
                      text-xs
                      font-medium
                      text-red-500
                    ">
                      {errors.seats}
                    </p>

                  )}

                </div>

              </div>

            </section>


            {/* ========================================
                SPECIFICATIONS
            ========================================= */}

            <section className="
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-[0_8px_30px_rgba(0,0,0,0.05)]
              sm:p-7
            ">

              <div className="mb-6">

                <p className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-orange-500
                ">
                  Step 2
                </p>


                <h2 className="
                  mt-1
                  text-xl
                  font-black
                  text-gray-900
                ">
                  Vehicle specifications
                </h2>


                <p className="
                  mt-1
                  text-sm
                  text-gray-500
                ">
                  Provide accurate specifications for renters.
                </p>

              </div>


              <div className="
                grid
                gap-5
                sm:grid-cols-2
                lg:grid-cols-3
              ">


                {/* MILEAGE */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-bold
                    text-gray-700
                  ">
                    Mileage
                  </label>


                  <div className="relative">

                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      min="0"
                      placeholder={
                        vehicleType === "car"
                          ? "18"
                          : "45"
                      }
                      className={`
                        ${inputClass("mileage")}
                        pr-14
                      `}
                    />


                    <span className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-xs
                      text-gray-400
                    ">
                      km/l
                    </span>

                  </div>


                  {errors.mileage && (

                    <p className="
                      mt-1.5
                      text-xs
                      font-medium
                      text-red-500
                    ">
                      {errors.mileage}
                    </p>

                  )}

                </div>


                {/* ENGINE */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-bold
                    text-gray-700
                  ">
                    Engine capacity
                  </label>


                  <div className="relative">

                    <input
                      type="number"
                      name="engine"
                      value={formData.engine}
                      onChange={handleChange}
                      min="0"
                      placeholder={
                        vehicleType === "car"
                          ? "1497"
                          : "350"
                      }
                      className={`
                        ${inputClass("engine")}
                        pr-14
                      `}
                    />


                    <span className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-xs
                      text-gray-400
                    ">
                      cc
                    </span>

                  </div>


                  {errors.engine && (

                    <p className="
                      mt-1.5
                      text-xs
                      font-medium
                      text-red-500
                    ">
                      {errors.engine}
                    </p>

                  )}

                </div>


                {/* FUEL */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-bold
                    text-gray-700
                  ">
                    Fuel type
                  </label>


                  <select
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleChange}
                    className={inputClass("fuel")}
                  >

                    <option value="">
                      Select fuel
                    </option>

                    <option value="Petrol">
                      Petrol
                    </option>

                    <option value="Diesel">
                      Diesel
                    </option>

                    <option value="Electric">
                      Electric
                    </option>

                    <option value="CNG">
                      CNG
                    </option>

                    <option value="Hybrid">
                      Hybrid
                    </option>

                  </select>


                  {errors.fuel && (

                    <p className="
                      mt-1.5
                      text-xs
                      font-medium
                      text-red-500
                    ">
                      {errors.fuel}
                    </p>

                  )}

                </div>


                {/* TRANSMISSION */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-bold
                    text-gray-700
                  ">
                    Transmission
                  </label>


                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className={inputClass("transmission")}
                  >

                    <option value="">
                      Select transmission
                    </option>

                    <option value="Manual">
                      Manual
                    </option>

                    <option value="Automatic">
                      Automatic
                    </option>

                    <option value="AMT">
                      AMT
                    </option>

                    <option value="CVT">
                      CVT
                    </option>

                  </select>


                  {errors.transmission && (

                    <p className="
                      mt-1.5
                      text-xs
                      font-medium
                      text-red-500
                    ">
                      {errors.transmission}
                    </p>

                  )}

                </div>


                {/* AGE */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-bold
                    text-gray-700
                  ">
                    Vehicle age
                  </label>


                  <div className="relative">

                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="0"
                      placeholder="2"
                      className={`
                        ${inputClass("age")}
                        pr-16
                      `}
                    />


                    <span className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-xs
                      text-gray-400
                    ">
                      years
                    </span>

                  </div>


                  {errors.age && (

                    <p className="
                      mt-1.5
                      text-xs
                      font-medium
                      text-red-500
                    ">
                      {errors.age}
                    </p>

                  )}

                </div>


                {/* DISTANCE */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-bold
                    text-gray-700
                  ">
                    Distance covered
                  </label>


                  <div className="relative">

                    <input
                      type="number"
                      name="distanceCovered"
                      value={
                        formData.distanceCovered
                      }
                      onChange={handleChange}
                      min="0"
                      placeholder="25000"
                      className={`
                        ${inputClass("distanceCovered")}
                        pr-14
                      `}
                    />


                    <span className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-xs
                      text-gray-400
                    ">
                      km
                    </span>

                  </div>


                  {errors.distanceCovered && (

                    <p className="
                      mt-1.5
                      text-xs
                      font-medium
                      text-red-500
                    ">
                      {errors.distanceCovered}
                    </p>

                  )}

                </div>

              </div>

            </section>


            {/* ========================================
                IMAGES
            ========================================= */}

            <section className="
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-[0_8px_30px_rgba(0,0,0,0.05)]
              sm:p-7
            ">

              <div className="mb-6">

                <p className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-orange-500
                ">
                  Step 3
                </p>


                <h2 className="
                  mt-1
                  text-xl
                  font-black
                  text-gray-900
                ">
                  Vehicle photos
                </h2>


                <p className="
                  mt-1
                  text-sm
                  text-gray-500
                ">
                  Upload photos or provide image URLs.
                  Add up to 5 clear photos.
                </p>

              </div>


              {/* ======================================
                  FILE UPLOAD
              ====================================== */}

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />


              <button
                type="button"
                disabled={
                  images.length +
                    imageUrls.length >=
                  5
                }
                onClick={() =>
                  imageInputRef.current?.click()
                }
                className="
                  flex
                  min-h-32
                  w-full
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border-2
                  border-dashed
                  border-gray-200
                  bg-gray-50
                  px-6
                  py-7
                  text-center
                  transition
                  hover:border-orange-300
                  hover:bg-orange-50/30
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <div className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-orange-100
                  text-orange-500
                ">

                  <ImagePlus size={23} />

                </div>


                <p className="
                  mt-3
                  text-sm
                  font-bold
                  text-gray-800
                ">
                  Upload from your device
                </p>


                <p className="
                  mt-1
                  text-xs
                  text-gray-400
                ">
                  JPG, PNG or WEBP • Max 5 MB each
                </p>

              </button>


              {/* ======================================
                  OR
              ====================================== */}

              <div className="
                my-5
                flex
                items-center
                gap-3
              ">

                <div className="
                  h-px
                  flex-1
                  bg-gray-200
                "
                />

                <span className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-gray-400
                ">
                  OR
                </span>

                <div className="
                  h-px
                  flex-1
                  bg-gray-200
                "
                />

              </div>


              {/* ======================================
                  IMAGE URL
              ====================================== */}

              <div>

                <label className="
                  mb-1.5
                  block
                  text-xs
                  font-bold
                  text-gray-700
                ">
                  Add image URL
                </label>


                <div className="
                  flex
                  flex-col
                  gap-2
                  sm:flex-row
                ">

                  <div className="relative flex-1">

                    <ExternalLink
                      size={16}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />


                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => {

                        setImageUrlInput(
                          e.target.value
                        )

                        if (errors.imageUrl) {

                          setErrors((prev) => {

                            const updated = {
                              ...prev,
                            }

                            delete updated.imageUrl

                            return updated
                          })
                        }
                      }}
                      placeholder="https://example.com/car.jpg"
                      className={`
                        ${inputClass("imageUrl")}
                        pl-10
                      `}
                    />

                  </div>


                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    disabled={
                      images.length +
                        imageUrls.length >=
                      5
                    }
                    className="
                      rounded-xl
                      bg-gray-900
                      px-5
                      py-3
                      text-sm
                      font-bold
                      text-white
                      transition
                      hover:bg-orange-500
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Add URL
                  </button>

                </div>


                {errors.imageUrl && (

                  <p className="
                    mt-1.5
                    text-xs
                    font-medium
                    text-red-500
                  ">
                    {errors.imageUrl}
                  </p>

                )}

              </div>


              {/* ======================================
                  IMAGE COUNT
              ====================================== */}

              <div className="
                mt-4
                flex
                items-center
                justify-between
              ">

                <p className="
                  text-xs
                  text-gray-400
                ">
                  {images.length + imageUrls.length} / 5 images added
                </p>

                <p className="
                  text-[11px]
                  text-gray-400
                ">
                  Your first image will be the main photo.
                </p>

              </div>


              {errors.images && (

                <p className="
                  mt-2
                  text-xs
                  font-medium
                  text-red-500
                ">
                  {errors.images}
                </p>

              )}


              {/* ======================================
                  IMAGE PREVIEWS
              ====================================== */}

              {(images.length > 0 ||
                imageUrls.length > 0) && (

                <div className="
                  mt-5
                  grid
                  grid-cols-2
                  gap-3
                  sm:grid-cols-3
                  lg:grid-cols-5
                ">


                  {/* FILE IMAGES */}

                  {imagePreviews.map(
                    (preview, index) => (

                      <div
                        key={`file-${index}`}
                        className="
                          group
                          relative
                          aspect-4/3
                          overflow-hidden
                          rounded-xl
                          bg-gray-100
                        "
                      >

                        <img
                          src={preview}
                          alt={`Vehicle ${index + 1}`}
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />


                        <button
                          type="button"
                          onClick={() =>
                            removeFileImage(index)
                          }
                          className="
                            absolute
                            right-2
                            top-2
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-full
                            bg-black/70
                            text-white
                            opacity-0
                            transition
                            group-hover:opacity-100
                          "
                        >

                          <X size={14} />

                        </button>


                        {index === 0 && (

                          <span className="
                            absolute
                            bottom-2
                            left-2
                            rounded-full
                            bg-white/90
                            px-2
                            py-1
                            text-[9px]
                            font-bold
                            text-gray-700
                          ">
                            Main photo
                          </span>

                        )}

                      </div>

                    )
                  )}


                  {/* URL IMAGES */}

                  {imageUrls.map(
                    (url, index) => (

                      <div
                        key={`url-${index}`}
                        className="
                          group
                          relative
                          aspect-4/3
                          overflow-hidden
                          rounded-xl
                          bg-gray-100
                        "
                      >

                        <img
                          src={url}
                          alt={`Vehicle URL ${index + 1}`}
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                          onError={() => {

                            toast.error(
                              "Unable to load one of the image URLs."
                            )

                          }}
                        />


                        <button
                          type="button"
                          onClick={() =>
                            removeUrlImage(index)
                          }
                          className="
                            absolute
                            right-2
                            top-2
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-full
                            bg-black/70
                            text-white
                            opacity-0
                            transition
                            group-hover:opacity-100
                          "
                        >

                          <X size={14} />

                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>


            {/* ========================================
                DOCUMENTS
            ========================================= */}

            <section className="
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-[0_8px_30px_rgba(0,0,0,0.05)]
              sm:p-7
            ">

              <div className="mb-6">

                <div className="
                  flex
                  items-start
                  gap-3
                ">

                  <div className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-orange-100
                    text-orange-500
                  ">

                    <ShieldCheck size={21} />

                  </div>


                  <div>

                    <p className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-orange-500
                    ">
                      Step 4
                    </p>


                    <h2 className="
                      mt-1
                      text-xl
                      font-black
                      text-gray-900
                    ">
                      Vehicle documents
                    </h2>


                    <p className="
                      mt-1
                      text-sm
                      leading-5
                      text-gray-500
                    ">
                      Upload the documents required to
                      verify your vehicle.
                    </p>

                  </div>

                </div>

              </div>



              <div className="
                grid
                gap-4
                md:grid-cols-3
              ">


                {renderDocumentCard(
                  "rc",
                  "Registration Certificate",
                  "RC / vehicle registration document.",
                  rcInputRef
                )}


                {renderDocumentCard(
                  "insurance",
                  "Insurance",
                  "Valid vehicle insurance document.",
                  insuranceInputRef
                )}


                {renderDocumentCard(
                  "puc",
                  "PUC Certificate",
                  "Valid pollution certificate.",
                  pucInputRef
                )}

              </div>

            </section>


            {/* ========================================
                DESCRIPTION
            ========================================= */}

            <section className="
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-[0_8px_30px_rgba(0,0,0,0.05)]
              sm:p-7
            ">

              <div className="mb-6">

                <p className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-orange-500
                ">
                  Step 5
                </p>


                <h2 className="
                  mt-1
                  text-xl
                  font-black
                  text-gray-900
                ">
                  Vehicle description
                </h2>


                <p className="
                  mt-1
                  text-sm
                  text-gray-500
                ">
                  Help renters understand the condition
                  and important features of your vehicle.
                </p>

              </div>


              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={handleChange}
                rows={6}
                maxLength={1000}
                placeholder={
                  vehicleType === "car"
                    ? "Example: Well-maintained Hyundai Creta with clean interiors, excellent AC and comfortable seating. Recently serviced..."
                    : "Example: Well-maintained Royal Enfield Classic 350 with comfortable seating, smooth engine and recently serviced..."
                }
                className={`
                  ${inputClass("description")}
                  resize-none
                `}
              />


              <div className="
                mt-2
                flex
                items-center
                justify-between
              ">

                {errors.description ? (

                  <p className="
                    text-xs
                    font-medium
                    text-red-500
                  ">
                    {errors.description}
                  </p>

                ) : (

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    Keep the description accurate and honest.
                  </p>

                )}


                <span className="
                  text-[11px]
                  text-gray-400
                ">
                  {formData.description.length}/1000
                </span>

              </div>

            </section>


            {/* ========================================
                GENERAL ERROR
            ========================================= */}

            {errors.general && (

              <div className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
              ">

                <p className="
                  text-sm
                  font-medium
                  text-red-600
                ">
                  {errors.general}
                </p>

              </div>

            )}


            {/* ========================================
                FINAL SUBMIT
            ========================================= */}

            <section className="
              rounded-3xl
              border
              border-orange-100
              bg-orange-50/60
              p-6
              sm:p-7
            ">

              <div className="
                flex
                flex-col
                gap-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              ">


                <div>

                  <div className="
                    flex
                    items-center
                    gap-2
                  ">

                    <CheckCircle2
                      size={19}
                      className="text-orange-500"
                    />


                    <h2 className="
                      font-black
                      text-gray-900
                    ">
                      Ready to list?
                    </h2>

                  </div>


                  <p className="
                    mt-1
                    max-w-xl
                    text-xs
                    leading-5
                    text-gray-500
                  ">
                    Review your vehicle information,
                    photos and documents before submitting.
                  </p>

                </div>


                <div className="
                  flex
                  w-full
                  gap-3
                  sm:w-auto
                ">


                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/user/listed-vehicles"
                      )
                    }
                    className="
                      flex-1
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
                      hover:border-gray-300
                      hover:bg-gray-50
                      sm:flex-none
                    "
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      flex-1
                      rounded-xl
                      bg-orange-500
                      px-6
                      py-3
                      text-sm
                      font-black
                      text-white
                      shadow-[0_8px_20px_rgba(249,115,22,0.25)]
                      transition-all
                      hover:-translate-y-0.5
                      hover:bg-orange-600
                      hover:shadow-[0_12px_25px_rgba(249,115,22,0.32)]
                      active:translate-y-0
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      sm:flex-none
                    "
                  >

                    {isSubmitting
                      ? "Submitting..."
                      : "List Vehicle"}

                  </button>

                </div>

              </div>

            </section>

          </form>

        </div>

      </section>

    </main>
  )
}

export default ListVehicle
import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import Navbar from "../Navbar"
import { api } from "../Authentication/axiosInterseptors"


type VehicleType = "car" | "bike"

interface IVehicle {
  _id: string

  vehicleType: VehicleType

  company: string
  model: string

  ownerId:
    | string
    | null
    | {
        _id: string
        name?: string
        email?: string
      }

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

  engine?: number

  description: string
  isListed: boolean
}

interface EditForm {
  company: string
  model: string
  ownerId: string
  vehicleNo: string

  rent: string
  rating: string
  reviews: string

  fuel: string
  transmission: string
  seats: string
  mileage: string
  age: string
  distanceCovered: string

  engine: string

  description: string
  isListed: boolean
}

const emptyForm: EditForm = {
  company: "",
  model: "",
  ownerId: "",
  vehicleNo: "",

  rent: "",
  rating: "",
  reviews: "",

  fuel: "",
  transmission: "",
  seats: "",
  mileage: "",
  age: "",
  distanceCovered: "",

  engine: "",

  description: "",
  isListed: true,
}

export default function AdminVehicleEdit() {
  const navigate = useNavigate()
  const location = useLocation()

  const { vehicleId } = useParams<{
    vehicleId: string
  }>()

  const vehicle = location.state?.vehicle as
    | IVehicle
    | undefined

  const [form, setForm] = useState<EditForm>(emptyForm)

  /*
    Existing image URLs already stored in MongoDB
  */
  const [existingImages, setExistingImages] = useState<string[]>(
    []
  )

  /*
    New image URLs entered by admin
  */
  const [newImageUrl, setNewImageUrl] = useState("")

  /*
    New image files selected by admin
  */
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!vehicle) {
      setError(
        "Vehicle information was not found. Please return to the vehicle list and try again."
      )

      setLoading(false)
      return
    }

    const ownerId =
      typeof vehicle.ownerId === "string"
        ? vehicle.ownerId
        : vehicle.ownerId?._id || ""

    setForm({
      company: vehicle.company || "",
      model: vehicle.model || "",
      ownerId,

      vehicleNo: vehicle.vehicleNo || "",

      rent: String(vehicle.rent ?? ""),
      rating: String(vehicle.rating ?? ""),
      reviews: String(vehicle.reviews ?? ""),

      fuel: vehicle.fuel || "",
      transmission: vehicle.transmission || "",

      seats: String(vehicle.seats ?? ""),
      mileage: String(vehicle.mileage ?? ""),
      age: String(vehicle.age ?? ""),
      distanceCovered: String(
        vehicle.distanceCovered ?? ""
      ),

      engine:
        vehicle.vehicleType === "bike"
          ? String(vehicle.engine ?? "")
          : "",

      description: vehicle.description || "",

      isListed: vehicle.isListed ?? true,
    })

    setExistingImages(vehicle.images || [])

    setLoading(false)
  }, [vehicle])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError("")
    setSuccess("")
  }

  const handleToggle = () => {
    setForm((previous) => ({
      ...previous,
      isListed: !previous.isListed,
    }))

    setError("")
    setSuccess("")
  }

  /*
    ============================================================
    IMAGE URL FUNCTIONS
    ============================================================
  */

  const addImageUrl = () => {
    const url = newImageUrl.trim()

    if (!url) {
      return
    }

    setExistingImages((previous) => [
      ...previous,
      url,
    ])

    setNewImageUrl("")

    setError("")
    setSuccess("")
  }

  const removeImageUrl = (index: number) => {
    setExistingImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    )

    setError("")
    setSuccess("")
  }

  /*
    ============================================================
    IMAGE FILE FUNCTIONS
    ============================================================
  */

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) {
      return
    }

    setError("")
    setSuccess("")

    /*
      Only image files
    */
    const invalidFiles = files.filter(
      (file) => !file.type.startsWith("image/")
    )

    if (invalidFiles.length > 0) {
      setError("Only image files can be uploaded.")
      return
    }

    /*
      Limit each file to 5 MB
    */
    const oversizedFiles = files.filter(
      (file) => file.size > 5 * 1024 * 1024
    )

    if (oversizedFiles.length > 0) {
      setError(
        "Each image must be smaller than 5 MB."
      )
      return
    }

    setSelectedFiles((previous) => [
      ...previous,
      ...files,
    ])

    /*
      Allow selecting the same file again later
    */
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((previous) =>
      previous.filter((_, fileIndex) => fileIndex !== index)
    )
  }

  /*
    ============================================================
    SUBMIT
    ============================================================
  */

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    if (!vehicleId) {
      setError("Vehicle ID is missing.")
      return
    }

    if (!vehicle) {
      setError("Vehicle information is missing.")
      return
    }

    /*
      ============================================================
      VALIDATION
      ============================================================
    */

    if (!form.company.trim()) {
      setError("Company is required.")
      return
    }

    if (!form.model.trim()) {
      setError("Model is required.")
      return
    }

    if (!form.vehicleNo.trim()) {
      setError("Vehicle number is required.")
      return
    }

    if (
      form.ownerId.trim() === "" &&
      vehicle.ownerId !== null
    ) {
      setError("Owner ID is required.")
      return
    }

    if (
      form.rent === "" ||
      Number(form.rent) < 0
    ) {
      setError("Please enter a valid rent.")
      return
    }

    if (
      form.rating === "" ||
      Number(form.rating) < 0 ||
      Number(form.rating) > 5
    ) {
      setError("Rating must be between 0 and 5.")
      return
    }

    if (
      form.reviews === "" ||
      Number(form.reviews) < 0
    ) {
      setError("Reviews cannot be negative.")
      return
    }

    if (
      form.seats === "" ||
      Number(form.seats) < 1
    ) {
      setError("Seats must be at least 1.")
      return
    }

    if (
      form.mileage === "" ||
      Number(form.mileage) < 0
    ) {
      setError("Please enter a valid mileage.")
      return
    }

    if (
      form.age === "" ||
      Number(form.age) < 0
    ) {
      setError("Age cannot be negative.")
      return
    }

    if (
      form.distanceCovered === "" ||
      Number(form.distanceCovered) < 0
    ) {
      setError(
        "Distance covered cannot be negative."
      )
      return
    }

    if (vehicle.vehicleType === "bike") {
      if (
        form.engine === "" ||
        Number(form.engine) < 0
      ) {
        setError(
          "Please enter a valid engine capacity."
        )
        return
      }
    }

    if (!form.description.trim()) {
      setError("Description is required.")
      return
    }

    /*
      ============================================================
      FORM DATA
      ============================================================
    */

    try {
      setSaving(true)

      const formData = new FormData()

      /*
        ==========================================================
        Vehicle type
      ==========================================================
      */

      formData.append(
        "vehicleType",
        vehicle.vehicleType
      )

      /*
        ==========================================================
        Basic fields
      ==========================================================
      */

      formData.append(
        "company",
        form.company.trim()
      )

      formData.append(
        "model",
        form.model.trim()
      )

      formData.append(
        "ownerId",
        form.ownerId.trim()
      )

      formData.append(
        "vehicleNo",
        form.vehicleNo.trim()
      )

      /*
        ==========================================================
        Numeric fields
      ==========================================================
      */

      formData.append(
        "rent",
        String(Number(form.rent))
      )

      formData.append(
        "rating",
        String(Number(form.rating))
      )

      formData.append(
        "reviews",
        String(Number(form.reviews))
      )

      /*
        ==========================================================
        Specifications
      ==========================================================
      */

      formData.append(
        "fuel",
        form.fuel.trim()
      )

      formData.append(
        "transmission",
        form.transmission.trim()
      )

      formData.append(
        "seats",
        String(Number(form.seats))
      )

      formData.append(
        "mileage",
        String(Number(form.mileage))
      )

      formData.append(
        "age",
        String(Number(form.age))
      )

      formData.append(
        "distanceCovered",
        String(Number(form.distanceCovered))
      )

      /*
        ==========================================================
        Bike-only field
      ==========================================================
      */

      if (vehicle.vehicleType === "bike") {
        formData.append(
          "engine",
          String(Number(form.engine))
        )
      }

      /*
        ==========================================================
        Description
      ==========================================================
      */

      formData.append(
        "description",
        form.description.trim()
      )

      /*
        ==========================================================
        Listing status
      ==========================================================
      */

      formData.append(
        "isListed",
        String(form.isListed)
      )

      /*
        ==========================================================
        EXISTING / URL IMAGES
        ==========================================================

        Send each URL individually.

        Backend can collect them using:
        req.body.images
      */

      existingImages.forEach((image) => {
        formData.append("images", image)
      })

      /*
        ==========================================================
        NEW IMAGE FILES
        ==========================================================

        All uploaded files are sent using the "pics" field.

        Backend multer example:

        upload.array("pics")
      */

      selectedFiles.forEach((file) => {
        formData.append("pics", file)
      })

      /*
        ==========================================================
        ADMIN VEHICLE EDIT API
        ==========================================================

        PATCH
        /api/admin/vehicles/edit/:vehicleId

        vehicleId -> URL

        vehicleType + vehicle data -> FormData

        images -> image URLs

        pics -> uploaded image files
      */

      await api.patch(
        `/api/admin/vehicles/edit/${vehicleId}`,
        formData
      )

      setSuccess(
        "Vehicle updated successfully."
      )

      setTimeout(() => {
        navigate("/admin/vehicles")
      }, 700)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to update vehicle. Please try again."
      )
    } finally {
      setSaving(false)
    }
  }

  /*
    ============================================================
    LOADING
    ============================================================
  */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#f5f5f0] px-4 pb-12 pt-28 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="animate-pulse">
              <div className="h-8 w-64 rounded-lg bg-gray-200" />

              <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-200" />

              <div className="mt-8 h-[600px] rounded-3xl bg-white shadow-sm" />
            </div>
          </div>
        </main>
      </>
    )
  }

  /*
    ============================================================
    NO VEHICLE
    ============================================================
  */

  if (!vehicle) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-[#f5f5f0] px-4 pt-20">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl">
              ⚠️
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-gray-900">
              Vehicle data unavailable
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              The vehicle information is no longer
              available on this page. Please return to
              the vehicle management page.
            </p>

            <button
              onClick={() =>
                navigate("/admin/vehicles")
              }
              className="mt-6 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
            >
              Back to Vehicles
            </button>
          </div>
        </main>
      </>
    )
  }

  /*
    ============================================================
    MAIN PAGE
    ============================================================
  */

  const ownerName =
    vehicle.ownerId &&
    typeof vehicle.ownerId !== "string"
      ? vehicle.ownerId.name || "Unknown Owner"
      : vehicle.ownerId === null
        ? "RideX"
        : "Unknown Owner"

  const ownerEmail =
    vehicle.ownerId &&
    typeof vehicle.ownerId !== "string"
      ? vehicle.ownerId.email || "No email available"
      : vehicle.ownerId === null
        ? "ridex@gamil.com"
        : "No email available"

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-x-hidden bg-[#f5f5f0] px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-5xl">

          {/* HEADER */}

          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/vehicles")
                }
                className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-500"
              >
                <span className="text-lg">
                  ←
                </span>

                Back to Vehicles
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-xl text-white shadow-lg shadow-orange-200">
                  {vehicle.vehicleType === "car"
                    ? "🚗"
                    : "🏍️"}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                      Edit Vehicle
                    </h1>

                    <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                      {vehicle.vehicleType}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Update vehicle information and
                    listing status.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Vehicle ID
              </p>

              <p className="mt-1 max-w-[260px] truncate font-mono text-xs font-semibold text-gray-700">
                {vehicleId}
              </p>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700">
              <span className="text-base font-bold">
                !
              </span>

              <p className="font-medium">
                {error}
              </p>
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-4 text-sm text-green-700">
              <span className="text-base font-bold">
                ✓
              </span>

              <p className="font-semibold">
                {success}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ==================================================
                BASIC INFORMATION
            ================================================== */}

            <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <SectionHeader
                title="Basic Information"
                description="Core identification details of the vehicle."
              />

              <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">

                <InputField
                  label="Company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. Toyota"
                  required
                />

                <InputField
                  label="Model"
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  placeholder="e.g. Fortuner"
                  required
                />

                <InputField
                  label="Vehicle Number"
                  name="vehicleNo"
                  value={form.vehicleNo}
                  onChange={handleChange}
                  placeholder="e.g. MH12AB1234"
                  required
                />

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Owner
                  </label>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="text-sm font-bold text-gray-800">
                      {ownerName}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {ownerEmail}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Owner ID
                    <span className="ml-1 text-orange-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="ownerId"
                    value={form.ownerId}
                    onChange={handleChange}
                    placeholder="MongoDB User ID"
                    required={vehicle.ownerId !== null}
                    disabled
                    className="w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none"
                  />
                </div>

              </div>
            </section>

            {/* ==================================================
                RENT & RATING
            ================================================== */}

            <section className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <SectionHeader
                title="Rental & Rating"
                description="Pricing and customer rating information."
              />

              <div className="grid gap-6 p-6 sm:grid-cols-3 sm:p-8">

                <NumberField
                  label="Rent"
                  name="rent"
                  value={form.rent}
                  onChange={handleChange}
                  min="0"
                  placeholder="₹ 0"
                  required
                />

                <NumberField
                  label="Rating"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="0 - 5"
                  required
                />

                <NumberField
                  label="Reviews"
                  name="reviews"
                  value={form.reviews}
                  onChange={handleChange}
                  min="0"
                  placeholder="Number of reviews"
                  required
                />

              </div>
            </section>

            {/* ==================================================
                SPECIFICATIONS
            ================================================== */}

            <section className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <SectionHeader
                title="Specifications"
                description="Technical and physical characteristics."
              />

              <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 sm:p-8">

                <InputField
                  label="Fuel"
                  name="fuel"
                  value={form.fuel}
                  onChange={handleChange}
                  placeholder="e.g. Petrol"
                  required
                />

                <InputField
                  label="Transmission"
                  name="transmission"
                  value={form.transmission}
                  onChange={handleChange}
                  placeholder="e.g. Automatic"
                  required
                />

                <NumberField
                  label="Seats"
                  name="seats"
                  value={form.seats}
                  onChange={handleChange}
                  min="1"
                  placeholder="Number of seats"
                  required
                />

                <NumberField
                  label="Mileage"
                  name="mileage"
                  value={form.mileage}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="e.g. 18"
                  required
                />

                <NumberField
                  label="Age"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  min="0"
                  placeholder="Vehicle age"
                  required
                />

                <NumberField
                  label="Distance Covered"
                  name="distanceCovered"
                  value={form.distanceCovered}
                  onChange={handleChange}
                  min="0"
                  placeholder="Distance covered"
                  required
                />

                {vehicle.vehicleType === "bike" && (
                  <NumberField
                    label="Engine"
                    name="engine"
                    value={form.engine}
                    onChange={handleChange}
                    min="0"
                    placeholder="Engine capacity"
                    required
                  />
                )}

              </div>
            </section>

            {/* ==================================================
                IMAGES
            ================================================== */}

            <section className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <SectionHeader
                title="Vehicle Images"
                description="Manage image URLs or upload new vehicle images."
              />

              <div className="space-y-8 p-6 sm:p-8">

                {/* ==================================================
                    EXISTING / URL IMAGES
                ================================================== */}

                <div>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900">
                        Image URLs
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        Add image URLs or remove existing ones.
                      </p>
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-gray-500">
                      {existingImages.length}{" "}
                      {existingImages.length === 1
                        ? "image"
                        : "images"}
                    </span>
                  </div>

                  {/* Existing URL images */}

                  {existingImages.length > 0 && (
                    <div className="mb-5 space-y-3">
                      {existingImages.map(
                        (image, index) => (
                          <div
                            key={`${image}-${index}`}
                            className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3"
                          >
                            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-200">
                              <img
                                src={image}
                                alt={`Vehicle ${index + 1}`}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none"
                                }}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium text-gray-600">
                                {image}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeImageUrl(index)
                              }
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                              aria-label="Remove image"
                            >
                              ✕
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* Add URL */}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) =>
                        setNewImageUrl(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addImageUrl()
                        }
                      }}
                      placeholder="https://example.com/vehicle-image.jpg"
                      className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />

                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
                    >
                      + Add URL
                    </button>
                  </div>
                </div>

                {/* DIVIDER */}

                <div className="h-px bg-gray-100" />

                {/* ==================================================
                    FILE UPLOAD
                ================================================== */}

                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-extrabold text-gray-900">
                      Upload Images
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Select one or multiple image files.
                      Each file must be smaller than 5 MB.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center transition hover:border-orange-300 hover:bg-orange-50/40"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                      📷
                    </div>

                    <p className="mt-4 text-sm font-extrabold text-gray-800">
                      Click to upload images
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      PNG, JPG, JPEG, WEBP • Max 5 MB each
                    </p>
                  </button>

                  {/* Selected files */}

                  {selectedFiles.length > 0 && (
                    <div className="mt-5">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          New images
                        </p>

                        <span className="text-xs font-semibold text-gray-500">
                          {selectedFiles.length} selected
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {selectedFiles.map(
                          (file, index) => (
                            <div
                              key={`${file.name}-${file.lastModified}-${index}`}
                              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
                            >
                              <div className="aspect-square overflow-hidden bg-gray-100">
                                <img
                                  src={URL.createObjectURL(
                                    file
                                  )}
                                  alt={file.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <div className="p-3">
                                <p className="truncate text-xs font-bold text-gray-700">
                                  {file.name}
                                </p>

                                <p className="mt-1 text-[10px] text-gray-400">
                                  {(
                                    file.size /
                                    1024 /
                                    1024
                                  ).toFixed(2)}{" "}
                                  MB
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeSelectedFile(
                                    index
                                  )
                                }
                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-xs font-bold text-gray-500 shadow-sm backdrop-blur transition hover:bg-red-500 hover:text-white"
                                aria-label="Remove selected image"
                              >
                                ✕
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* IMAGE INFO */}

                <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5">
                      💡
                    </span>

                    <div>
                      <p className="text-xs font-extrabold text-gray-800">
                        Image storage
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        URL images are stored in the{" "}
                        <span className="font-bold">
                          images
                        </span>{" "}
                        field, while uploaded image
                        files are sent through the{" "}
                        <span className="font-bold">
                          pics
                        </span>{" "}
                        field.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <section className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <SectionHeader
                title="Description"
                description="Provide a clear description of the vehicle."
              />

              <div className="p-6 sm:p-8">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Enter vehicle description..."
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  required
                />
              </div>
            </section>

            {/* ==================================================
                LISTING STATUS
            ================================================== */}

            <section className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <SectionHeader
                title="Listing Status"
                description="Control whether this vehicle is visible to users."
              />

              <div className="flex items-center justify-between gap-5 p-6 sm:p-8">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Vehicle Listing
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {form.isListed
                      ? "This vehicle is currently listed and visible."
                      : "This vehicle is currently unlisted."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggle}
                  aria-pressed={form.isListed}
                  className={`relative h-7 w-12 shrink-0 rounded-full p-1 transition-colors duration-200 ${
                    form.isListed
                      ? "bg-orange-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                      form.isListed
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/vehicles")
                }
                disabled={saving}
                className="rounded-2xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-gray-900 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-500 hover:shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            RideX Admin • Vehicle Management
          </p>
        </div>
      </main>
    </>
  )
}

/* ==============================================================
   SECTION HEADER
============================================================== */

function SectionHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="border-b border-gray-100 bg-[#fafaf7] px-6 py-5 sm:px-8">
      <h2 className="text-base font-extrabold text-gray-900">
        {title}
      </h2>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </div>
  )
}

/* ==============================================================
   TEXT INPUT
============================================================== */

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string
  name: string
  value: string
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-800">
        {label}

        {required && (
          <span className="ml-1 text-orange-500">
            *
          </span>
        )}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
      />
    </div>
  )
}

/* ==============================================================
   NUMBER INPUT
============================================================== */

function NumberField({
  label,
  name,
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
  required = false,
}: {
  label: string
  name: string
  value: string
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  min?: string
  max?: string
  step?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-800">
        {label}

        {required && (
          <span className="ml-1 text-orange-500">
            *
          </span>
        )}
      </label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
      />
    </div>
  )
}
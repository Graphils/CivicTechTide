import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { MapPin, Camera, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { reportService } from '../services/report.service'
import CivicMap from '../components/map/CivicMap'
import { categoryLabels } from '../utils/helpers'
import type { ReportCategory } from '../types'

interface FormData {
  title: string
  description: string
  category: ReportCategory
  address: string
}

export default function SubmitReportPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()
  const navigate = useNavigate()
  const [location, setLocation] = useState<[number, number] | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [detectingLocation, setDetectingLocation] = useState(false)

  const detectLocation = () => {
    setDetectingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude])
        toast.success('Location detected!')
        setDetectingLocation(false)
      },
      () => {
        toast.error('Could not detect location. Click the map to set it manually.')
        setDetectingLocation(false)
      }
    )
  }

  const onSubmit = async (data: FormData) => {
    if (!location) {
      toast.error('Please set your location by clicking on the map or using auto-detect.')
      return
    }

    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('category', data.category)
    formData.append('latitude', String(location[0]))
    formData.append('longitude', String(location[1]))
    if (data.address) formData.append('address', data.address)
    if (imageFile) formData.append('image', imageFile)

    try {
      const report = await reportService.create(formData)
      toast.success('Report submitted successfully! 🎉')
      navigate(`/reports/${report.id}`)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to submit report.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      <div className="mb-8">
        <h1 className="page-title">Report an Issue</h1>
        <p className="text-ocean/60 mt-1">Help improve your community by reporting problems that need attention.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Basic Info */}
        <div className="card space-y-5">
          <h2 className="section-title">Issue Details</h2>

          <div>
            <label className="label">Issue Title</label>
            <input {...register('title', { required: 'Title is required' })}
              className="input" placeholder="e.g. Large pothole on Main Street" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label">Category</label>
            <select {...register('category', { required: 'Category is required' })} className="input">
              <option value="">Select a category...</option>
              {(Object.entries(categoryLabels) as [ReportCategory, string][]).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea {...register('description', { required: 'Description is required' })}
              className="input resize-none h-28"
              placeholder="Describe the issue in detail. How long has it been there? Is it dangerous?" />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
        </div>

        {/* Image Upload */}
        <div className="card">
          <h2 className="section-title mb-4">Add a Photo</h2>
          <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors
            ${imagePreview ? 'border-wave bg-foam' : 'border-blue-100 hover:border-wave hover:bg-foam'}`}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-cover" />
            ) : (
              <>
                <Camera size={32} className="text-wave mb-2" />
                <p className="text-sm text-ocean/60">Click to upload a photo of the issue</p>
                <p className="text-xs text-ocean/40 mt-1">PNG, JPG up to 10MB</p>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setImageFile(file)
                setImagePreview(URL.createObjectURL(file))
              }
            }} />
          </label>
        </div>

        {/* Location */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Set Location</h2>
            <button type="button" onClick={detectLocation}
              className="btn-outline text-sm py-2 flex items-center gap-2" disabled={detectingLocation}>
              {detectingLocation ? <Loader size={15} className="animate-spin" /> : <MapPin size={15} />}
              Auto-detect
            </button>
          </div>

          <p className="text-sm text-ocean/60 mb-4">
            {location
              ? `📍 Location set: ${location[0].toFixed(5)}, ${location[1].toFixed(5)}`
              : 'Click on the map to pin the exact location of the issue.'}
          </p>

          <CivicMap
            reports={[]}
            height="350px"
            onMapClick={(lat, lng) => setLocation([lat, lng])}
            selectedLocation={location}
          />

          <div className="mt-4">
            <label className="label">Street Address <span className="text-ocean/40 font-normal">(optional)</span></label>
            <input {...register('address')} className="input" placeholder="e.g. Ring Road Central, Accra" />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="btn-primary w-full py-4 text-base" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Report 🚀'}
        </button>

      </form>
    </div>
  )
}

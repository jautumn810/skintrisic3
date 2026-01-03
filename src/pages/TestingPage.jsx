import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import { saveUser } from '../lib/storage'

export default function TestingPage() {
  const navigate = useNavigate()
  const nameInputRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')

    if (name && name.trim()) {
      setIsSubmitting(true)
      try {
        saveUser({ name: name.trim(), location: '' })
        navigate('/analysis/city')
      } catch (error) {
        console.error('Error submitting form:', error)
        alert('An error occurred. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <>
      <SiteHeader section="INTRO" />
      <div className="min-h-[90vh] flex flex-col items-center justify-center bg-white text-center">
        <div className="absolute top-16 left-9 text-left">
          <p className="font-semibold text-xs">TO START ANALYSIS</p>
        </div>
        <div className="relative flex flex-col items-center justify-center mb-40 w-full h-full">
          <p className="text-sm text-gray-400 tracking-wider uppercase mb-1">CLICK TO TYPE</p>
          <form className="relative z-10" id="name-form" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center"></div>
            <input
              ref={nameInputRef}
              className="text-5xl sm:text-6xl font-normal text-center bg-transparent border-b border-black focus:outline-none appearance-none w-[372px] sm:w-[432px] pt-1 tracking-[-0.07em] leading-[64px] text-[#1A1B1C] z-10"
              placeholder="Introduce Yourself"
              type="text"
              autoComplete="off"
              autoFocus
              name="name"
              id="name-input"
            />
            <button type="submit" className="sr-only">Submit</button>
          </form>
          <img
            alt="Diamond Large"
            width={762}
            height={762}
            className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-1/2 w-[480px] h-[480px] md:w-[762px] md:h-[762px] animate-spin-slow rotate-190"
            style={{ color: "transparent" }}
            src="/Diamond-light-large.png"
          />
          <img
            alt="Diamond Medium"
            width={682}
            height={682}
            className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-1/2 w-[400px] h-[400px] md:w-[682px] md:h-[682px] animate-spin-slower rotate-185"
            style={{ color: "transparent" }}
            src="/Diamond-medium-medium.png"
          />
          <img
            alt="Diamond Small"
            width={602}
            height={602}
            className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-1/2 w-[320px] h-[320px] md:w-[602px] md:h-[602px] animate-spin-slowest"
            style={{ color: "transparent" }}
            src="/Diamond-dark-small.png"
          />
        </div>
        <div className="absolute bottom-38.5 md:bottom-8 w-full flex justify-between md:px-9 px-13">
          <Link className="inset-0" aria-label="Back" to="/">
            <div>
              <div className="relative w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">BACK</span>
              </div>
              <div className="group hidden sm:flex flex-row relative justify-center items-center">
                <div className="w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                <span className="absolute left-[15px] bottom-[13px] scale-[0.9] rotate-180 hidden sm:block group-hover:scale-[0.92] ease duration-300">▶</span>
                <span className="text-sm font-semibold hidden sm:block ml-6">BACK</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}


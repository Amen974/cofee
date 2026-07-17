'use client'

import { useCheckout } from './useCheckout'
import { JSX, useRef } from 'react'
import { ArrowRight, MapPin } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

const Page = (): JSX.Element => {
  const containerRef = useRef<HTMLFormElement>(null)
  const {
    formState,
    deliveryState,
    submitState,
    formDispatch,
    deliveryDispatch,
    getLocation,
    handleSubmit,
  } = useCheckout()

  useGSAP(() => {
    gsap.fromTo(
      '.checkout-fade-in',
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
  }, { scope: containerRef })

  return (
    <form ref={containerRef} onSubmit={handleSubmit} className='flex justify-center items-center text-[#8D7E73] py-1 px-4'>
      <div className='checkout-fade-in flex flex-col gap-5 w-[90vw] max-w-130 p-7 rounded-3xl border-3 border-[#2A1F1C] bg-[#141110] shadow-2xl shadow-black/40'>
        <h1 className='text-[#A32D1C] text-3xl'>Your Details</h1>

        {submitState.error && (
          <div className='bg-[#A32D1C]/10 border border-[#A32D1C]/30 text-[#A32D1C] text-xs tracking-wide px-3 py-2 rounded-xs'>
            {submitState.error}
          </div>
        )}

        <div>
          <label className='uppercase text-[0.625rem] tracking-[0.25em] text-[#8D7E73]'>Full name</label>
          <input
            type='text'
            placeholder='Jane Doe'
            value={formState.name}
            onChange={(e) => formDispatch({ type: 'SET_NAME', payload: e.target.value })}
            className="flex h-10 w-full rounded-xs border border-[#8D7E73]/30 bg-transparent px-3 py-1 text-sm text-white transition-colors duration-300 placeholder:text-[#8D7E73]/40 focus-visible:outline-none focus-visible:border-[#A32D1C]/60 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div>
          <label className='uppercase text-[0.625rem] tracking-[0.25em] text-[#8D7E73]'>Phone</label>
          <input
            type='tel'
            placeholder='+1 555 000 000'
            value={formState.phone}
            onChange={(e) => formDispatch({ type: 'SET_PHONE', payload: e.target.value })}
            className="flex h-10 w-full rounded-xs border border-[#8D7E73]/30 bg-transparent px-3 py-1 text-sm text-white transition-colors duration-300 placeholder:text-[#8D7E73]/40 focus-visible:outline-none focus-visible:border-[#A32D1C]/60 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <h1 className='text-[#A32D1C] text-3xl'>Delivery</h1>

        <div>
          <button
            type='button'
            onClick={getLocation}
            data-cursor-hover
            className='text-[#A32D1C] bg-[#211c19] border border-[#A32D1C]/40 px-3 py-2 rounded-xs cursor-pointer hover:bg-[#2a221e] active:scale-95 transition-all duration-300 flex justify-center items-center gap-2 w-full text-[0.625rem] tracking-[0.25em] uppercase'
          >
            <MapPin size={16} />
            Use my current location
          </button>
          <span className='text-[0.625rem] tracking-wide text-[#8D7E73]/60 mt-1 block'>
            Or type your address manually below.
          </span>
        </div>

        <div>
          <label className='uppercase text-[0.625rem] tracking-[0.25em] text-[#8D7E73]'>Address</label>
          <input
            placeholder='Street, city, apt #'
            value={deliveryState.address}
            onChange={(e) => deliveryDispatch({ type: 'SET_ADDRESS', payload: e.target.value })}
            className="flex h-10 w-full rounded-xs border border-[#8D7E73]/30 bg-transparent px-3 py-1 text-sm text-white transition-colors duration-300 placeholder:text-[#8D7E73]/40 focus-visible:outline-none focus-visible:border-[#A32D1C]/60 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div>
          <label className='uppercase text-[0.625rem] tracking-[0.25em] text-[#8D7E73]'>Order notes (optional)</label>
          <textarea
            placeholder='Leave at the door, oat milk only...'
            value={formState.notes}
            onChange={(e) => formDispatch({ type: 'SET_NOTES', payload: e.target.value })}
            className="flex w-full rounded-xs border border-[#8D7E73]/30 bg-transparent px-3 py-2 text-sm text-white transition-colors duration-300 placeholder:text-[#8D7E73]/40 focus-visible:outline-none focus-visible:border-[#A32D1C]/60 disabled:cursor-not-allowed disabled:opacity-50 h-25 resize-none"
          />
        </div>

        <button
          type='submit'
          disabled={submitState.loading}
          data-cursor-hover
          className="w-full h-11 bg-[#9a2d1e] hover:bg-[#8d2414] transition-all duration-300 text-white text-[0.625rem] tracking-[0.25em] uppercase rounded-xs flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          Place order
          <ArrowRight size={14} />
        </button>
      </div>
    </form>
  )
}

export default Page
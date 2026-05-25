'use client'

import { useCheckout } from '../useCheckout'
import { useRouter } from 'next/navigation'
import { JSX, useEffect } from 'react'
import { ArrowRight, MapPin } from 'lucide-react'

const Page = (): JSX.Element => {
  const router = useRouter()
  const {
    formState,
    deliveryState,
    submitState,
    formDispatch,
    deliveryDispatch,
    getLocation,
    handleSubmit,
    isDeliveryInfoProvided,
  } = useCheckout()

  useEffect(() => {
    if (submitState.success) {
      router.push('/')
    }
  }, [submitState.success, router])

  return (
    <form onSubmit={handleSubmit} className='bg-black min-h-screen flex justify-center items-center text-white'>
      <div className='border border-gray-800 flex flex-col gap-4 rounded-xl shadow-2xl w-[90vw] max-w-130 p-7 bg-[#0a0a0a]'>
        <h1 className='text-red-700 text-3xl'>Your Details</h1>
        
        {submitState.error && (
          <div className='bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded-lg'>
            {submitState.error}
          </div>
        )}

        <div>
          <label className='uppercase text-xs text-gray-300'>Full name</label>
          <input
            required
            type='text'
            placeholder='Jane Doe'
            value={formState.name}
            onChange={(e) => formDispatch({ type: 'SET_NAME', payload: e.target.value })}
            className="flex h-10 w-full rounded-xl border border-gray-800 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-red-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
        </div>

        <div>
          <label className='uppercase text-xs text-gray-300'>Phone</label>
          <input
            required
            type='tel'
            placeholder='+1 555 000 000'
            value={formState.phone}
            onChange={(e) => formDispatch({ type: 'SET_PHONE', payload: e.target.value })}
            className="flex h-10 w-full rounded-xl border border-gray-800 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-red-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
        </div>

        <h1 className='text-red-700 text-3xl'>Delivery</h1>

        <div>
          <button type='button' onClick={getLocation} className='text-red-400 bg-[#200101] border border-red-700 px-3 py-2 rounded-xl cursor-pointer hover:bg-[#360202] active:scale-95 flex justify-center gap-2 w-full'>
            <MapPin size={18} className='mt-0.5' />
            Use my current location
          </button>
          <span className='text-xs text-gray-300'>Or type your address manually below.</span>
        </div>

        <div>
          <label className='uppercase text-xs text-gray-300'>Address</label>
          <input
            placeholder='Street, city, apt #'
            value={deliveryState.address}
            onChange={(e) => deliveryDispatch({ type: 'SET_ADDRESS', payload: e.target.value })}
            className="flex h-10 w-full rounded-xl border border-gray-800 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-red-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
        </div>

        <div>
          <label className='uppercase text-xs text-gray-300'>Order notes (optional)</label>
          <textarea
            placeholder='Leave at the door, oat milk only...'
            value={formState.notes}
            onChange={(e) => formDispatch({ type: 'SET_NOTES', payload: e.target.value })}
            className="flex w-full border border-gray-800 bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:border-red-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-25 resize-none rounded-xl"
          />
        </div>

        <button
          type='submit'
          disabled={!isDeliveryInfoProvided || submitState.loading}
          className="w-full bg-red-700 hover:bg-red-600 active:scale-95 transition-all text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {submitState.loading ? 'Placing order...' : 'Place order'}
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  )
}

export default Page
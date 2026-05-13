'use client'

import { useEffect } from "react"
import { useIsOpen } from "@/lib/store/useIsOpen"

const IsOpen = () => {
  const { isOpen, fetchIsOpen } = useIsOpen()

  useEffect(() => {
    fetchIsOpen()
  }, [fetchIsOpen])

  return (
    <>
      {!isOpen && (
        <div className="w-full absolute top-20 left-1/2 transform -translate-x-1/2 px-10 md:px-50 z-50">
          <h1 className="text-red-700 text-2xl md:text-4xl text-center bg-black border border-gray-900 py-5 rounded-2xl">the store is closed for now</h1>
        </div>
      )}
    </>
  )
}

export default IsOpen
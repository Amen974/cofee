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
        <div className="bg-black absolute top-30 left-1/2 transform -translate-x-1/2 px-40 py-5 text-4xl text-red-700  rounded-2xl z-50">
          <h1>the store is closed for now</h1>
        </div>
      )}
    </>
  )
}

export default IsOpen
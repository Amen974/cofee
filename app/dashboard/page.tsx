'use client'

import { useIsOpen } from "@/lib/store/useIsOpen"

const Page = () => {
  const { setIsOpen } = useIsOpen()
  return (
    <>
    <button onClick={setIsOpen}>Change is Open</button>
    </>
  )
}

export default Page
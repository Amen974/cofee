"use client"

import Image from "next/image"
import { ReactElement } from "react"
import { MenuItemFormProps } from "@/types"
import useMenuItemForm from "./useMenuItemForm"

const MenuItemForm = ({ item, setIsUpdating }: MenuItemFormProps): ReactElement => {
  const {
    description,
    imageUrl,
    isSaving,
    isUploadingImage,
    name,
    price,
    quantity,
    handleSubmit,
    handleImageChange,
    dispatch,
  } = useMenuItemForm(item, setIsUpdating)

  const uploadInputId = `menu-item-image-upload-${item.id}`

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-3xl rounded-2xl border border-[#8D7E73]/20 bg-[#211c19] p-6 text-[#8D7E73] shadow-2xl"
    >
      <div className="flex flex-col items-center gap-4">
        <label
          htmlFor={uploadInputId}
          className="group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-[#8D7E73]/30 bg-[#1b1816] p-4 text-center transition-colors duration-300 hover:border-[#A32D1C]/60"
        >
          <span className="text-[0.625rem] uppercase tracking-[0.25em] text-[#8D7E73]">Upload Image</span>
          <div className="relative h-64 w-64 overflow-hidden rounded-2xl bg-[#8D7E73]/10">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Selected item"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[#8D7E73]/60 text-sm">
                Click to select image
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/60 p-2 text-xs tracking-widest text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Click image to change
            </div>
          </div>
        </label>

        <input
          id={uploadInputId}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          disabled={isUploadingImage || isSaving}
        />
        {isUploadingImage && <span className="text-xs tracking-widest text-[#8D7E73]">Uploading image...</span>}
      </div>

      <div className="grid gap-4 md:grid-cols-2 pt-4">
        <label className="flex flex-col gap-2 text-xs tracking-[0.15em] uppercase text-[#8D7E73]">
          Name
          <input
            value={name}
            onChange={(event) => dispatch({ type: "SET_NAME", payload: event.target.value })}
            className="rounded-xs border border-[#8D7E73]/30 bg-[#1b1816] px-3 py-2 text-sm tracking-normal text-white outline-none transition-colors duration-300 focus:border-[#A32D1C]/60"
          />
        </label>

        <label className="flex flex-col gap-2 text-xs tracking-[0.15em] uppercase text-[#8D7E73]">
          Description
          <textarea
            value={description}
            onChange={(event) => dispatch({ type: "SET_DESCRIPTION", payload: event.target.value })}
            className="rounded-xs border border-[#8D7E73]/30 bg-[#1b1816] px-3 py-2 text-sm tracking-normal text-white outline-none transition-colors duration-300 focus:border-[#A32D1C]/60"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2 pt-4">
        <label className="flex flex-col gap-2 text-xs tracking-[0.15em] uppercase text-[#8D7E73]">
          Price
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(event) => dispatch({ type: "SET_PRICE", payload: event.target.value })}
            className="rounded-xs border border-[#8D7E73]/30 bg-[#1b1816] px-3 py-2 text-sm tracking-normal text-white outline-none transition-colors duration-300 focus:border-[#A32D1C]/60"
          />
        </label>

        <label className="flex flex-col gap-2 text-xs tracking-[0.15em] uppercase text-[#8D7E73]">
          Quantity
          <input
            type="number"
            value={quantity}
            onChange={(event) => dispatch({ type: "SET_QUANTITY", payload: event.target.value })}
            className="rounded-xs border border-[#8D7E73]/30 bg-[#1b1816] px-3 py-2 text-sm tracking-normal text-white outline-none transition-colors duration-300 focus:border-[#A32D1C]/60"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3 pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xs bg-[#9a2d1e] px-4 py-2 text-[0.625rem] tracking-[0.2em] uppercase text-white transition-colors duration-300 hover:bg-[#8d2414] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Item"}
        </button>

        <button
          type="button"
          onClick={() => setIsUpdating(false)}
          className="rounded-xs bg-[#8D7E73]/15 border border-[#8D7E73]/30 px-4 py-2 text-[0.625rem] tracking-[0.2em] uppercase text-white transition-colors duration-300 hover:bg-[#8D7E73]/25"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default MenuItemForm
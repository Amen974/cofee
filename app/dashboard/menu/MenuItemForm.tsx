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
      className="mx-auto w-full max-w-3xl rounded-3xl border-2 border-red-700 bg-slate-950 p-6 text-white shadow-2xl"
    >
      <div className="flex flex-col items-center gap-4">
        <label
          htmlFor={uploadInputId}
          className="group flex cursor-pointer flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-4 text-center transition hover:border-red-700"
        >
          <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Upload Image</span>
          <div className="relative h-64 w-64 overflow-hidden rounded-3xl bg-slate-800">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Selected item"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                Click to select image
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/60 p-2 text-sm text-slate-200 opacity-0 transition group-hover:opacity-100">
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
        {isUploadingImage && <span className="text-sm text-slate-300">Uploading image...</span>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-white">
          Name
          <input
            value={name}
            onChange={(event) => dispatch({ type: "SET_NAME", payload: event.target.value })}
            className="rounded-xl border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-2 text-white">
          Description
          <textarea
            value={description}
            onChange={(event) => dispatch({ type: "SET_DESCRIPTION", payload: event.target.value })}
            className="rounded-xl border px-3 py-2"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-white">
          Price
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(event) => dispatch({ type: "SET_PRICE", payload: event.target.value })}
            className="rounded-xl border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-2 text-white">
          Quantity
          <input
            type="number"
            value={quantity}
            onChange={(event) => dispatch({ type: "SET_QUANTITY", payload: event.target.value })}
            className="rounded-xl border px-3 py-2"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3 pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Item"}
        </button>

        <button
          type="button"
          onClick={() => setIsUpdating(false)}
          className="rounded-xl bg-gray-700 px-4 py-2 font-semibold text-white hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default MenuItemForm
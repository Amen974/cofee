"use client"

import React, { ChangeEvent, FormEvent, ReactElement, useReducer } from "react"
import Image from "next/image"
import { AddMenuItemState, ItemForm, AddMenuItemAction } from "@/types"
import { addItem, uploadImage } from "./actions"

const AddMenuItem = (): ReactElement => {
  const initialState: AddMenuItemState = {
    isOpen: false,
    name: "",
    description: "",
    price: "0",
    quantity: "1",
    imageUrl: "",
    isSaving: false,
    isUploadingImage: false,
  }

  const reducer = (state: AddMenuItemState, action: AddMenuItemAction): AddMenuItemState => {
    switch (action.type) {
      case "SET_IS_OPEN":
        return { ...state, isOpen: action.payload }
      case "SET_NAME":
        return { ...state, name: action.payload }
      case "SET_DESCRIPTION":
        return { ...state, description: action.payload }
      case "SET_PRICE":
        return { ...state, price: action.payload }
      case "SET_QUANTITY":
        return { ...state, quantity: action.payload }
      case "SET_IMAGE_URL":
        return { ...state, imageUrl: action.payload }
      case "SET_IS_SAVING":
        return { ...state, isSaving: action.payload }
      case "SET_IS_UPLOADING_IMAGE":
        return { ...state, isUploadingImage: action.payload }
      case "RESET":
        return { ...initialState }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const uploadInputId = `menu-item-image-upload-new`

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (!file) return
    dispatch({ type: "SET_IS_UPLOADING_IMAGE", payload: true })

    try {
      const result = await uploadImage(file)
      if (!result.success) {
        console.error("[AddMenuItem] Image upload failed:", result.error)
        return
      }

      if (result.url) dispatch({ type: "SET_IMAGE_URL", payload: result.url })
    } catch (error) {
      console.error("[AddMenuItem] Error uploading image:", error)
    } finally {
      dispatch({ type: "SET_IS_UPLOADING_IMAGE", payload: false })
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    dispatch({ type: "SET_IS_SAVING", payload: true })
    const formData: ItemForm = {
      name: state.name,
      description: state.description,
      price: Number(state.price),
      quantity: Number(state.quantity),
      image_url: state.imageUrl,
      is_available: true,
    }

    try {
      const res = await addItem(formData)
      if (res.success) {
        dispatch({ type: "RESET" })
      } else {
        console.error("[AddMenuItem] addItem failed:", res.error)
      }
    } catch (error) {
      console.error("[AddMenuItem] Error adding item:", error)
    } finally {
      dispatch({ type: "SET_IS_SAVING", payload: false })
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dispatch({ type: "SET_IS_OPEN", payload: true })}
        className="border-2 border-red-700 rounded-2xl h-110 w-62 flex items-center justify-center bg-white/10 text-white text-6xl font-bold transition hover:bg-white/20 cursor-pointer"
      >
        +
      </button>

      {state.isOpen && (
        <div className="fixed inset-0 z-40 overflow-auto bg-black/70 p-4">
          <div className="flex min-h-full items-center justify-center">
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
                    {state.imageUrl ? (
                      <Image src={state.imageUrl} alt="Selected item" fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-500">Click to select image</div>
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
                  disabled={state.isUploadingImage || state.isSaving}
                />
                {state.isUploadingImage && <span className="text-sm text-slate-300">Uploading image...</span>}
              </div>

              <div className="grid gap-4 md:grid-cols-2 pt-4">
                <label className="flex flex-col gap-2 text-white">
                  Name
                  <input value={state.name} onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })} className="rounded-xl border px-3 py-2" />
                </label>

                <label className="flex flex-col gap-2 text-white">
                  Description
                  <textarea value={state.description} onChange={(e) => dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })} className="rounded-xl border px-3 py-2" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2 pt-4">
                <label className="flex flex-col gap-2 text-white">
                  Price
                  <input type="number" step="0.01" value={state.price} onChange={(e) => dispatch({ type: "SET_PRICE", payload: e.target.value })} className="rounded-xl border px-3 py-2" />
                </label>

                <label className="flex flex-col gap-2 text-white">
                  Quantity
                  <input type="number" value={state.quantity} onChange={(e) => dispatch({ type: "SET_QUANTITY", payload: e.target.value })} className="rounded-xl border px-3 py-2" />
                </label>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  type="submit"
                  disabled={state.isSaving}
                  className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {state.isSaving ? "Saving..." : "Add Item"}
                </button>

                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_IS_OPEN", payload: false })}
                  className="rounded-xl bg-gray-700 px-4 py-2 font-semibold text-white hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default AddMenuItem

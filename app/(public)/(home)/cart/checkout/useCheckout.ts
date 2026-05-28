'use client'

import { useReducer, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usecart } from '@/lib/store/useCart'
import { FormAction, DeliveryAction, SubmitAction, Item } from '@/types'

interface FormState {
  name: string
  phone: string
  notes: string
}

interface DeliveryState {
  address: string
  lat: number | null
  lng: number | null
}

interface SubmitState {
  loading: boolean
  error: string | null
  success: boolean
}

interface Settings {
  tax_rate: number
  delivery_fee: number
}

const INITIAL_FORM: FormState = { name: '', phone: '', notes: '' }
const INITIAL_DELIVERY: DeliveryState = { address: '', lat: null, lng: null }
const INITIAL_SUBMIT: SubmitState = { loading: false, error: null, success: false }

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_NAME':    return { ...state, name: action.payload }
    case 'SET_PHONE':   return { ...state, phone: action.payload }
    case 'SET_NOTES':   return { ...state, notes: action.payload }
    case 'RESET':       return INITIAL_FORM
    default:            return state
  }
}

const deliveryReducer = (state: DeliveryState, action: DeliveryAction): DeliveryState => {
  switch (action.type) {
    case 'SET_ADDRESS':
      return { ...state, address: action.payload, lat: null, lng: null }
    case 'SET_COORDINATES':
      return { address: '', lat: action.payload.lat, lng: action.payload.lng }
    case 'RESET':
      return INITIAL_DELIVERY
    default:
      return state
  }
}

const submitReducer = (state: SubmitState, action: SubmitAction): SubmitState => {
  switch (action.type) {
    case 'SUBMITTING': return { loading: true, error: null, success: false }
    case 'SUCCESS':    return { loading: false, error: null, success: true }
    case 'ERROR':      return { loading: false, error: action.payload, success: false }
    case 'RESET':      return INITIAL_SUBMIT
    default:           return state
  }
}

const validatePhone = (phone: string): boolean => {
  const numericPhone = phone.replace(/\D/g, '')
  return /^\+?[\d\s()\-]+$/.test(phone) && numericPhone.length >= 7 && numericPhone.length <= 15
}

const validateName = (name: string): boolean => {
  const trimmed = name.trim()
  return trimmed.length >= 2 && trimmed.length <= 100
}

const validateAddress = (address: string): boolean => {
  const trimmed = address.trim()
  return trimmed.length >= 5 && trimmed.length <= 200
}

export const useCheckout = () => {
  const supabase = createClient()
  const { items, totalPrice, clearCart } = usecart()

  const [formState, formDispatch] = useReducer(formReducer, INITIAL_FORM)
  const [deliveryState, deliveryDispatch] = useReducer(deliveryReducer, INITIAL_DELIVERY)
  const [submitState, submitDispatch] = useReducer(submitReducer, INITIAL_SUBMIT)
  const [settings, setSettings] = useState<Settings>({ tax_rate: 0, delivery_fee: 0 })

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('tax_rate, delivery_fee')
        .maybeSingle()
      if (error) return console.error('[useCheckout] fetchSettings failed', error)
      if (data) setSettings(data)
    }
    fetch()
  }, [supabase])

  const subtotal = totalPrice()
  const tax = subtotal * (settings.tax_rate / 100)
  const total = subtotal + tax + settings.delivery_fee
  const isDeliveryInfoProvided =
    deliveryState.address.trim().length > 0 ||
    (deliveryState.lat !== null && deliveryState.lng !== null)

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => deliveryDispatch({
        type: 'SET_COORDINATES',
        payload: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      }),
      (err) => {
        console.error('[useCheckout] getLocation failed', err)
        submitDispatch({ type: 'ERROR', payload: 'Unable to access your location' })
      }
    )
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateName(formState.name))
      return submitDispatch({ type: 'ERROR', payload: 'Please enter a valid name (2-100 characters)' })

    if (!validatePhone(formState.phone))
      return submitDispatch({ type: 'ERROR', payload: 'Please enter a valid phone number' })

    const hasAddress = deliveryState.address.trim().length > 0
    const hasCoordinates = deliveryState.lat !== null && deliveryState.lng !== null

    if (!hasCoordinates && (hasAddress && !validateAddress(deliveryState.address)))
      return submitDispatch({ type: 'ERROR', payload: 'Please enter a valid address (5-200 characters)' })

    if (!hasCoordinates && !hasAddress)
      return submitDispatch({ type: 'ERROR', payload: 'Please provide a delivery address or use your current location' })

    submitDispatch({ type: 'SUBMITTING' })

    const { error } = await supabase.from('orders').insert({
      customer_name: formState.name,
      phone: formState.phone,
      lat: deliveryState.lat,
      lng: deliveryState.lng,
      address: deliveryState.address || null,
      notes: formState.notes,
      items: items as Item[],
      total_price: total,
      status: 'pending',
    })

    if (error) {
      console.error('[useCheckout] handleSubmit failed', error)
      return submitDispatch({ type: 'ERROR', payload: 'Failed to place order. Please try again.' })
    }

    submitDispatch({ type: 'SUCCESS' })
    formDispatch({ type: 'RESET' })
    deliveryDispatch({ type: 'RESET' })
    clearCart()
  }

  return {
    formState,
    deliveryState,
    submitState,
    settings,
    subtotal,
    tax,
    total,
    isDeliveryInfoProvided,   
    formDispatch,
    deliveryDispatch,
    getLocation,
    handleSubmit,             
  }
}
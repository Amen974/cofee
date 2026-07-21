'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ReservationSettings } from '@/types'
import { useBooking } from './useBooking'
import { useReservationPanel } from '@/lib/store/useReservationPanel'

gsap.registerPlugin(useGSAP)

const fieldClass =
  "w-full bg-[#0D0907] border border-[#2A1F1C] px-4 py-3.5 text-xs text-[#E8E0D8] tracking-[0.1em] placeholder-[#6B6360] focus:outline-none focus:border-[#7C1515] transition-colors"
const labelClass = "text-[10px] tracking-[0.2em] text-[#6B6360] uppercase"

const BookingClient = ({ settings }: { settings: ReservationSettings }) => {
  const {
    state,
    status,
    maxBookingDate,
    partySizeOptions,
    setDate,
    setPartySize,
    setSelected,
    setGuestName,
    setGuestPhone,
    book,
  } = useBooking(settings)

  const { isOpen, close } = useReservationPanel()

  const rootRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (isOpen) {
      gsap.set(rootRef.current, { pointerEvents: 'auto' })

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.to(backdropRef.current, { autoAlpha: 1, duration: 0.5 })
        .to(panelRef.current, { x: '0%', duration: 0.8 }, '-=0.4')
        .fromTo('.booking-field',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 },
          '-=0.45')
    } else {
      gsap.timeline({ onComplete: () => gsap.set(rootRef.current, { pointerEvents: 'none' }) })
        .to(panelRef.current, { x: '100%', duration: 0.6, ease: 'power3.in' })
        .to(backdropRef.current, { autoAlpha: 0, duration: 0.4 }, '-=0.4')
    }
  }, { scope: rootRef, dependencies: [isOpen] })

  return (
    <div ref={rootRef} className="fixed inset-0 z-45 pointer-events-none">
      <div ref={backdropRef} onClick={close} className="absolute inset-0 bg-black/60 invisible" />

      <div
        ref={panelRef}
        className="absolute top-0 right-0 translate-x-full w-full max-w-lg h-full bg-[#0D0907] border-l border-[#2A1F1C] px-8 md:px-12 py-12 flex flex-col justify-between z-10 overflow-y-auto scroll-bar-non"
      >
        <div className="space-y-8">
          <div className="booking-field flex items-center justify-between">
            <div>
              <h2 className="text-4xl text-[#7C1515]">Table Securement</h2>
              <p className="text-[10px] tracking-[0.25em] text-[#6B6360] uppercase mt-1">
                Exquisite Gastronomy Awaits
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close reservation panel"
              className="text-[#6B6360] hover:text-[#E8E0D8] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6 pt-6">
            <div className="booking-field space-y-2">
              <label className={labelClass}>Guest count</label>
              <select
                value={state.partySize}
                onChange={e => setPartySize(Number(e.target.value))}
                className={`${fieldClass} uppercase`}
              >
                {partySizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size} {size === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            <div className="booking-field space-y-2">
              <label className={labelClass}>Desired Evening Date</label>
              <input
                type="date"
                value={state.date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                max={maxBookingDate}
                className={`${fieldClass} uppercase scheme-dark`}
              />
            </div>

            <div className="booking-field space-y-2">
              <label className={labelClass}>Arrival Session</label>
              <div className="grid grid-cols-3 gap-3">
                {status.loading ? (
                  <p className="col-span-3 text-[#6B6360] text-xs italic">Loading availability...</p>
                ) : state.slots.length === 0 ? (
                  <p className="col-span-3 text-[#6B6360] text-xs italic">No available times for this selection</p>
                ) : (
                  state.slots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelected(slot)}
                      className={`border py-3 text-xs tracking-[0.2em] transition-all ${state.selected === slot
                        ? 'border-[#7C1515] bg-[#7C1515]/15 text-[#E8E0D8]'
                        : 'border-[#2A1F1C] text-[#E8E0D8] hover:border-[#7C1515] hover:bg-[#7C1515]/5'
                        }`}
                    >
                      {slot}
                    </button>
                  ))
                )}
              </div>
            </div>

            {state.selected && (
              <>
                <div className="booking-field space-y-2">
                  <label className={labelClass}>Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={state.guestName}
                    onChange={e => setGuestName(e.target.value)}
                    className={fieldClass}
                  />
                </div>

                <div className="booking-field space-y-2">
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={state.guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="booking-field space-y-4 pt-8">
          {status.error && (
            <div className="bg-[#A32D1C]/10 border border-[#A32D1C]/30 text-[#A32D1C] text-xs tracking-wide px-3 py-2 rounded-xs">
              {status.error}
            </div>
          )}

          {status.success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-500 text-xs tracking-wide px-3 py-2 rounded-xs">
              {status.success}
            </div>
          )}

          <button
            type="button"
            onClick={book}
            disabled={status.loading || !state.selected}
            data-cursor-hover
            className="w-full bg-[#7C1515] text-[#E8E0D8] text-xs tracking-[0.25em] uppercase py-4 hover:bg-[#8B1A1A] transition-colors shadow-lg shadow-black/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Reservation
          </button>
          <p className="text-[9px] tracking-[0.15em] text-[#6B6360] uppercase text-center">
            Secure access guarantees single-origin tasting flight allocation.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BookingClient
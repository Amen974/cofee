'use client'
import { useRef, useState } from "react"
import { InstagramLogoIcon, FacebookLogoIcon, EnvelopeSimpleIcon, ArrowRightIcon } from "@phosphor-icons/react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)
 
const SOCIALS = [
  { icon: InstagramLogoIcon, href: "#", label: "Instagram" },
  { icon: FacebookLogoIcon, href: "#", label: "Facebook" },
]


const Page = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" })
 
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
 
    tl.fromTo('.contact-title',
      { autoAlpha: 0, y: 60 },
      { autoAlpha: 1, y: 0, duration: 1.2 })
      .fromTo('.reveal-line',
        { yPercent: 100 },
        { yPercent: 0, duration: 1, stagger: 0.1 },
        '-=0.7')
      .fromTo('.contact-divider',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, transformOrigin: 'left' },
        '-=0.6')
      .fromTo('.contact-info-item',
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 },
        '-=0.4')
      .fromTo('.contact-field',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 },
        '-=0.5')
      .fromTo('.contact-submit',
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.6 },
        '-=0.3')
  }, { scope: containerRef })
 
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { id, value } = e.target
    setForm((f) => ({ ...f, [id]: value }))
  }

  return (
    <main
      ref={containerRef}
      className="min-h-screen flex flex-col md:justify-center items-center relative text-[#8D7E73] px-4 md:px-10 lg:px-25 pt-28 md:pt-10 pb-20"
    >
      <div className="grid md:grid-cols-2 gap-14 md:gap-10 max-w-5xl">
        {/* Left: intro + info */}
        <div className="flex flex-col justify-center">
          <h1 className="contact-title text-[clamp(2.5rem,12vw,6rem)] text-[#A32D1C] leading-none">
            Get in Touch
          </h1>
 
          <div className="overflow-hidden mt-5">
            <p className="reveal-line uppercase tracking-[0.25em] text-[clamp(0.9rem,4vw,1.25rem)]">
              We&apos;d love to hear from you.
            </p>
          </div>
 
          <div className="contact-divider w-16 h-px bg-[#A32D1C] my-8" />
 
          <p className="contact-info-item w-full md:w-80 text-sm md:text-base leading-relaxed">
            Whether you have questions, feedback, or just want to say hello, feel
            free to reach out.
          </p>
 
          <div className="flex flex-col gap-5 mt-10">
            <a
              href="mailto:hello@obsidiancoffee.com"
              data-cursor-hover
              className="contact-info-item flex items-center gap-3 w-fit text-sm text-[#ddd1c7] hover:text-[#A32D1C] transition-colors duration-300"
            >
              <EnvelopeSimpleIcon size={18} weight="thin" />
              hello@obsidiancoffee.com
            </a>
 
            <div className="contact-info-item flex gap-5">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  data-cursor-hover
                  className="text-[#8D7E73] hover:text-[#A32D1C] transition-colors duration-300"
                >
                  <Icon size={20} weight="thin" />
                </a>
              ))}
            </div>
          </div>
        </div>
 
        {/* Right: form */}
        <div className="flex flex-col justify-center">
          <form className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="contact-field flex flex-col flex-1">
                <label htmlFor="firstName" className="text-[0.625rem] tracking-[0.2em] uppercase text-[#8D7E73]/70 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  className="h-11 rounded-xs border border-[#8D7E73]/30 bg-[#211c19] px-4 text-xs tracking-widest text-white placeholder:text-[#8D7E73]/60 outline-none transition-colors duration-300 focus:border-[#A32D1C]/60"
                />
              </div>
              <div className="contact-field flex flex-col flex-1">
                <label htmlFor="lastName" className="text-[0.625rem] tracking-[0.2em] uppercase text-[#8D7E73]/70 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  className="h-11 rounded-xs border border-[#8D7E73]/30 bg-[#211c19] px-4 text-xs tracking-widest text-white placeholder:text-[#8D7E73]/60 outline-none transition-colors duration-300 focus:border-[#A32D1C]/60"
                />
              </div>
            </div>
 
            <div className="contact-field flex flex-col">
              <label htmlFor="email" className="text-[0.625rem] tracking-[0.2em] uppercase text-[#8D7E73]/70 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="h-11 rounded-xs border border-[#8D7E73]/30 bg-[#211c19] px-4 text-xs tracking-widest text-white placeholder:text-[#8D7E73]/60 outline-none transition-colors duration-300 focus:border-[#A32D1C]/60"
              />
            </div>
 
            <div className="contact-field flex flex-col">
              <label htmlFor="message" className="text-[0.625rem] tracking-[0.2em] uppercase text-[#8D7E73]/70 mb-2">
                Message
              </label>
              <textarea
                id="message"
                value={form.message}
                onChange={handleChange}
                className="h-32 w-full resize-none rounded-xs border border-[#8D7E73]/30 bg-[#211c19] p-4 text-xs tracking-widest text-white placeholder:text-[#8D7E73]/60 outline-none transition-colors duration-300 focus:border-[#A32D1C]/60"
              />
            </div>
 
            <button
              type="submit"
              disabled={status === "submitting"}
              data-cursor-hover
              className="contact-submit flex items-center gap-2 w-fit text-[0.625rem] tracking-[0.25em] uppercase text-white bg-[#9a2d1e] px-6 py-3 rounded-xs hover:bg-[#8d2414] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              Send Message<ArrowRightIcon size={12} />
            </button>
 
          </form>
        </div>
      </div>
    </main>
  )
}

export default Page
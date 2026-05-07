import Link from "next/link"

const Hero = () => {
  return (
    <section className='h-[80vh] md:h-screen w-full background_img flex flex-col justify-center items-center'>

      <h1 className="text-red-600 font-bold text-7xl mb-2 max-md:text-5xl">A sip of joy</h1>

      <span className="text-white text-2xl max-md:text-[19px]">A unique world of flavers</span>

      <p className="text-white text-[1rem] max-w-160 text-center mb-6">
        Discover freshly roasted coffee crafted with passion, sourced from the
        finest farms around the world. Whether you crave a bold espresso or a
        smooth, creamy latte, every cup is brewed to awaken your senses and
        brighten your day.
      </p>

      <div className="flex gap-4 mb-7">
        <Link href="" className="text-white bg-red-700 text-[1rem] px-5 py-2 rounded-md shadow-md hover:bg-red-800">Eplore more</Link>
        <Link href="" className="bg-white text-[15px] px-5 py-2 rounded-md shadow-md hover:bg-gray-200">Learn more</Link>
      </div>

      <div className="flex gap-8 text-green-700 px-6 py-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brown-800">50k+</h2>
          <p className="text-sm text-gray-400">Happy Customers</p>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brown-800">100%</h2>
          <p className="text-sm text-gray-400">Organic Beans</p>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brown-800">10+</h2>
          <p className="text-sm text-gray-400">Years of Excellence</p>
        </div>
      </div>

    </section>
  )
}

export default Hero
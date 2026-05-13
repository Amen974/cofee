import Image from "next/image";


const BestSellers = () => {
  return (
    <section>
      <div className="relative bg-black h-[26vh] md:h-[45vh] flex justify-center items-center">
        <Image
          src="/coffee-beans-right.png"
          alt="right-beans"
          fill
          loading="eager"
          className="object-contain object-right"
        />

        <h1 className="text-red-700 text-[150px] font-bold max-sm:text-[100px] z-10">
          Best Sell
        </h1>
      </div>

      <div className="relative bg-black h-[26vh] md:h-[45vh]">
        <Image
          src="/coffee-beans-left.png"
          alt="left-beans"
          fill
          loading="eager"
          className="object-contain object-left"
        />

        <div className="w-full h-full flex justify-center items-center">
          <div>
            
          </div>

          <div>

          </div>
        </div>
      </div>

      <div className="relative bg-black h-[26vh] md:h-[45vh]">
        <Image
          src="/coffee-beans-right.png"
          alt="right-beans"
          fill
          loading="eager"
          className="object-contain object-right"
        />
      </div>

      <div className="relative bg-black h-[26vh] md:h-[45vh]">
        <Image
          src="/coffee-beans-left.png"
          alt="left-beans"
          fill
          loading="eager"
          className="object-contain object-left"
        />
      </div>
    </section>
  )
}

export default BestSellers
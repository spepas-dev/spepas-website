export default function Banner() {
  return (
    <section className="max-w-[1170px] bg-gradient-to-b from-gray-900 to-gray-300 py-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        {/* <!-- Text Section --> */}
        <div className="pl-12 text-left text-white mb-6 md:mb-0 md:w-1/2">
          <p className="text-[#4a36ec] text-lg font-semibold animate-pulse">Shop With Confidence</p>
          <h1 className="text-8xl font-bold mt-2 ">WELCOME TO SPEPAS</h1>
          <p className="text-[#4a36ec] text-sm font-medium mt-2 text-gray-300">THE LEADING PARTS STORE IN GHANA</p>
        </div>
        {/* <!-- Image Section --> */}
        <div className="md:w-1/2 animate-pulse">
          <img src="/image1.png" alt="Banner Image" className="mx-auto w-full max-w-lg  -mb-16"></img>
        </div>
      </div>
    </section>
  );
}

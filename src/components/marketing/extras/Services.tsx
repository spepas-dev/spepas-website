export default function Services() {
  return (
    <section className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 bg-gray-50 py-12 shadow-xl rounded-xl mt-12">
      <div className="container mx-auto px-6">
        {/* <!-- Our Services Section --> */}
        <div className="mb-16">
          <h2 className="text-[#4a36ec] text-3xl font-semibold mb-4">OUR SERVICES</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* <!-- Text Content --> */}
            <div className="text-gray-600 text-justify space-y-4">
              <p>
                SpePas is an online marketplace designed to bridge the gap between buyers and sellers of auto parts. Whether you’re a car
                owner or mechanics (buyers) looking for a specific part, a seller seeking a broader customer base, or an industry partner
                aiming to enhance accessibility, our platform offers a simple and efficient solution.
              </p>
              <p>
                We collaborate with key industry partners to ensure a reliable and well-connected ecosystem that benefits all stakeholders.
                By working together, we enhance the accessibility, quality, and availability of auto parts, making it easier for buyers to
                find what they need and for sellers to reach the right customers. With a wide range of parts available at your fingertips,
                SpePas brings choice, convenience, and confidence to the auto parts market.
              </p>
            </div>
            {/* <!-- Image Content --> */}
            <div className="relative w-full max-w-md mx-auto">
              {/* Service Image 1 (background, top left) */}
              <img
                src="/images/products/service image 1.jpg"
                alt="Service Image 1"
                className="rounded-lg shadow max-w-[300px] h-auto"
                style={{ transform: 'translate(-10%, -5%)' }}
              />
              {/* Service Image 2 (foreground, bottom right) */}
              <img
                src="/images/products/service image 2.jpg"
                alt="Service Image 2"
                className="rounded-lg shadow absolute bottom-0 right-0 z-10 max-w-[250px] h-auto translate-x-[5%] translate-y-[60%] md:translate-y-[10%]"
              />
            </div>
          </div>
        </div>

        {/* <!-- Why SpePas Section --> */}
        {/* <div>
                <h2 class="text-[#4a36ec] text-3xl font-semibold mb-4 text-right">WHY SPEPAS</h2>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     Image Content 
                    <div>
                        <img src="/why.jpg" alt="Why SpePas Image" class="w-full h-auto rounded-lg shadow"></img>
                    </div>
                     Text Content 
                    <div class="text-gray-600 text-justify space-y-4">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                            laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                            ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                        </p>
                        <p>
                            Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore
                            eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum
                            zzril delenit augue duis dolore te feugait nulla facilisi.
                        </p>
                    </div>
                </div>
            </div> */}
      </div>
    </section>
  );
}

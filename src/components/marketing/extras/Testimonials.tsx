export default function Testimonials() {
  return (
    <section className="py-12 bg-gray-50 shadow-xl rounded-xl pt-10 mt-8">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-semibold mb-6 text-[#4a36ec]">From Our Clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <img src="/profile.jpg" alt="Client 1" className="w-20 h-20 mx-auto rounded-full mb-4"></img>
            <h3 className="text-lg font-semibold mb-2">Name</h3>
            <p className="text-gray-600">Lorem ipsum dolor sit amet...</p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <img src="/profile.jpg" alt="Client 2" className="w-20 h-20 mx-auto rounded-full mb-4"></img>
            <h3 className="text-lg font-semibold mb-2">Name</h3>
            <p className="text-gray-600">Lorem ipsum dolor sit amet...</p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <img src="/profile.jpg" alt="Client 3" className="w-20 h-20 mx-auto rounded-full mb-4"></img>
            <h3 className="text-lg font-semibold mb-2">Name</h3>
            <p className="text-gray-600">Lorem ipsum dolor sit amet...</p>
          </div>
        </div>
      </div>
    </section>
  );
}

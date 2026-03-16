export default function Testimonials() {
  return (
    <section className="py-12 bg-gray-50 shadow-xl rounded-xl pt-10 mt-8">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-semibold mb-6 text-[#4a36ec]">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <img src="/profile.jpg" alt="Kwame A." className="w-20 h-20 mx-auto rounded-full mb-4"></img>
            <h3 className="text-lg font-semibold mb-2">Kwame A.</h3>
            <p className="text-gray-600">"I found a hard-to-get alternator for my Hyundai in under 10 minutes. SpePas made it so easy."</p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <img src="/profile.jpg" alt="Ama S." className="w-20 h-20 mx-auto rounded-full mb-4"></img>
            <h3 className="text-lg font-semibold mb-2">Ama S.</h3>
            <p className="text-gray-600">"As a mechanic, I use SpePas to source parts for my clients. The request feature saves me hours."</p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <img src="/profile.jpg" alt="Kofi M." className="w-20 h-20 mx-auto rounded-full mb-4"></img>
            <h3 className="text-lg font-semibold mb-2">Kofi M.</h3>
            <p className="text-gray-600">"I listed my shop's inventory and started getting orders within the first week. Great platform."</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// src/components/marketing/AboutUs/index.tsx
import React from 'react'

const AboutUs: React.FC = () => {
  return (
    <main className="space-y-16">

      {/* Intro Section */}
      <section className="max-w-[1170px] mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue mb-6">
          About SpePas
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-4">
          SpePas is Ghana's online marketplace for new and used auto parts. We connect buyers, sellers, and mechanics —
          making it easy to find the right part and get it delivered.
        </p>
        <p className="max-w-2xl mx-auto text-lg text-gray-700">
          Our mission is to make finding and selling auto parts simple, trusted, and accessible —
          starting in Ghana, expanding across West Africa.
        </p>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-3xl font-semibold text-blue">10K+</h3>
            <p className="text-sm text-gray-600">Auto parts (target)</p>
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-blue">500+</h3>
            <p className="text-sm text-gray-600">Sellers (target)</p>
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-blue">20K+</h3>
            <p className="text-sm text-gray-600">Buyers (target)</p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="max-w-[1170px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Our Vision */}
        <div className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-blue mb-3">Our Vision</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We envision a future where finding the right auto parts is effortless, fast, and transparent. By leveraging technology and
            strategic partnerships, we strive to become the leading online marketplace for spare parts in Ghana and West Africa. Our goal is
            to create an ecosystem where buyers, sellers, and industry partners can thrive through innovation, trust, and convenience.
          </p>
        </div>

        {/* Our Mission */}
        <div className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-blue mb-3">Our Mission</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            At SpePas, our mission is to revolutionize how auto parts are bought and sold by providing a seamless, reliable, and accessible
            online marketplace. We connect buyers with a vast selection of spare parts while empowering sellers with a trusted platform to
            reach more customers. Through efficiency and convenience, we aim to simplify the auto parts industry for everyone in Africa and
            beyond.
          </p>
        </div>

        {/* Why SpePas */}
        <div className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-blue mb-3">Why SpePas</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Ghana's auto parts market has long relied on word-of-mouth and in-person searches. SpePas brings this market online —
            giving buyers access to a wider selection, giving sellers a larger audience, and giving mechanics a faster way to source
            parts for their clients.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-[1170px] mx-auto px-6">
        <h2 className="text-3xl font-bold text-blue mb-4">Our Team</h2>
        <p className="text-lg text-gray-700 mb-8">
          Our team is passionate about making auto parts accessible across Ghana.
        </p>

        {/* Leadership */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {/* Replace src and names with your real data */}
          <div className="text-center">
            <img src="/images/team/user-04.jpg" alt="Kofi Mensah" className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"/>
            <h3 className="font-semibold text-gray-800">Ben Kwame</h3>
            <p className="text-sm text-gray-600">Co-Founder & CEO</p>
          </div>
          <div className="text-center">
            <img src="/images/team/user-03.jpg" alt="Ama Asante" className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"/>
            <h3 className="font-semibold text-gray-800">Gaia Carini</h3>
            <p className="text-sm text-gray-600">Chief Technology Officer</p>
          </div>
          <div className="text-center">
            <img src="/images/team/user-04.jpg" alt="Thomas Badu" className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"/>
            <h3 className="font-semibold text-gray-800">Joseph Boadi</h3>
            <p className="text-sm text-gray-600">Head of Operations</p>
          </div>
          <div className="text-center">
            <img src="/images/team/user-03.jpg" alt="Selina Opoku" className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"/>
            <h3 className="font-semibold text-gray-800">Abigail Ayisi-Addo</h3>
            <p className="text-sm text-gray-600">Marketing Lead</p>
          </div>
        </div>

        {/* SpePas Family */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">The SpePas Family</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          
          {[...Array(12)].map((_, i) => (
            <img
              key={i}
              src={`/images/team/avatar-${i + 1}.jpg`}
              alt={`Team member ${i + 1}`}
              className="w-16 h-16 rounded-full object-cover"
            />
          ))}
        </div>
      </section>
      
    </main>
  )
}

export default AboutUs

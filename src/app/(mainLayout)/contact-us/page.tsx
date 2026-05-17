
import React from 'react'
import Contact from '@/assets/HeroBannerSection/Contact.png';
import Image from 'next/image';
import { FiMail, FiPhone } from 'react-icons/fi';
const ContactUsPage = () => {
  return (
    <section className='responsive-padding'>
       <Image className='py-7 mt-10 md:mt-20 mx-auto' src={Contact} alt='contact' />
       <div className="flex items-center gap-1  justify-center">
        <h2 className="text-md sm:text-xl md:text-3xl lg:text-[48px] font-bold text-gray-900">
          Ta kontakt med oss
        </h2>
        <span className="text-xl md:text-3xl lg:text-5xl">🔥</span>
      </div>
      <div className="py-5 md:py-10">
      <div className="w-full md:w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Section - Company Info */}
        <div className="space-y-6">
          {/* Company Address */}
          <div className="bg-[#FFBA5D]/90 rounded-2xl p-2 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Mobilklar</h2>
            <p className="text-gray-700">123 Markedsgate, Norge</p>
          </div>

          {/* Contact Information */}
          <div className="bg-[#FFBA5D]/90 rounded-2xl p-2 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              ## Kontaktinformasjon
            </h3>
            <p className="text-gray-700 mb-6">
              For spørsmål angående disse vilkårene, vennligst kontakt oss på:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-800">
                <FiPhone className="w-5 h-5" />
                <span>+5905459889089</span>
              </div>
              <div className="flex items-center gap-3 text-gray-800">
                <FiMail className="w-5 h-5" />
                <span>support@mobilklar.no</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="bg-[#FFBA5D]/90 rounded-2xl p-2 md:p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Kontakt
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Navn"
                className="w-full px-4 py-3 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800 placeholder-gray-500"
              />
              <input
                type="email"
                placeholder="E-post"
                className="w-full px-4 py-3 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800 placeholder-gray-500"
              />
            </div>
            
            <textarea
              placeholder="Melding"
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800 placeholder-gray-500 resize-none"
            ></textarea>
            
            <div className="flex justify-center">
              <button className="px-12 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full shadow-md transition-colors duration-200 cursor-pointer">
                Send inn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  )
}

export default ContactUsPage
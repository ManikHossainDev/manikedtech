import Image from "next/image";
import logo from "@/assets/Authentication/logof.png";
import Link from "next/link";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { LandingContact } from "@/types/landing.types";

interface FooterProps {
  contactData?: LandingContact | null;
}

const Footer = ({ contactData }: FooterProps) => {
  const phone = contactData?.phone || '+4604328390903';
  const email = contactData?.email || 'demo@gmail.com';
  const address = contactData?.address || 'Norway';
  return (
    <footer id="Contact" className=" bg-[#FFDA9A] text-black">
      <div className="w-full  py-8 border-b border-gray-300">
        <div className="md:container mx-auto grid md:grid-cols-12 gap-2 lg:gap-8 px-7 md:px-2 lg:px-5">
          {/* Logo Section */}
          <div className="lg:col-span-3 col-span-10 flex md:justify-start justify-center">
            <Link href="/">
              <Image
                src={logo}
                width={500}
                height={500}
                alt="Mobilklar logo"
                className="w-[200px] h-[80px] object-contain"
              />
            </Link>
          </div>

          {/* Navigation Links Grid */}
          <div className="lg:col-span-9 col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-2 lg:gap-8">
            {/* Works Section */}
            <div>
              <h3 className="font-semibold text-base mb-3">Slik fungerer det</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/#Features" className="hover:underline">
                    Moduler
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    Kjøp nå
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="font-semibold text-base mb-3">Info</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/#aboutus" className="hover:underline">
                    Om oss
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:underline">
                    Ofte stilte spørsmål
                  </Link>
                </li>
              </ul>
            </div>

            {/* Privacy Policy Section */}
            <div>
              <h3 className="font-semibold text-base mb-3">EdTech-retningslinjer</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms-condition" className="hover:underline">
                    Vilkår og betingelser
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:underline">
                    Personvern
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info Section */}
            <div>
              <h3 className="font-semibold text-base mb-3">Kontakt</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <FaPhone
                    className="mt-1 flex-shrink-0 text-gray-600"
                    size={12}
                  />
                  <Link href={`tel:${phone}`} className="hover:underline">
                    {phone}
                  </Link>
                </li>
                <li className="flex items-start gap-2">
                  <FaEnvelope
                    className="mt-1 flex-shrink-0 text-gray-600"
                    size={12}
                  />
                  <Link
                    href={`mailto:${email}`}
                    className="hover:underline break-all"
                  >
                    {email}
                  </Link>
                </li>
                <li className="flex items-start gap-2">
                  <FaMapMarkerAlt
                    className="mt-1 flex-shrink-0 text-gray-600"
                    size={12}
                  />
                  <span>{address}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="w-full py-4">
        <div className=" px-4 text-center">
          <p className="text-sm text-gray-700">
            © Opphavsrett 2025. Alle rettigheter forbeholdt.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

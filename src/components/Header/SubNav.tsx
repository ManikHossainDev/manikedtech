import Link from "next/link";
import { FaEnvelope } from "react-icons/fa";
import { PiHeadsetDuotone } from "react-icons/pi";

const SubNav = () => {
  return (
    <section className="w-full bg-[#E25050] p-4 text-white">
      <div className="w-full md:container flex justify-between items-center">
        <ul className="flex items-center gap-4">
          {/* Email Link */}
          <li className="flex items-center gap-2 font-semibold">
            <FaEnvelope className="font-bold size-6"/>
            <Link href="/" className="">
              example@example.com
            </Link>
          </li>

          {/* Phone Link */}
          <li className="flex items-center gap-2 font-semibold">
            <PiHeadsetDuotone  className="font-bold size-6"/>
            <Link href="/about-us" className="">
              999
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default SubNav;

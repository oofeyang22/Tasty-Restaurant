import Link from "next/link";
import { 
  FaGithub, 
  FaFacebookF, 
  FaYoutube, 
  FaLinkedinIn 
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-purple-300 text-black py-12 mt-20 dark:bg-gray-900 dark:text-gray-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-10">
        
        {/* Logo & Description */}
        <div>
          <Logo />
          <p className="text-lg  leading-relaxed mt-2">
            Authentic taste with premium ingredients. 
            Serving happiness in every taste.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-700
           mb-4">
            Quick Links
          </h3>
          <ul className="space-y-3">
            <li>
              <Link href="/" className=" underline hover:text-yellow-400 
             transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/items" className=" underline hover:text-yellow-400
               transition-colors">
                Menu
              </Link>
            </li>
            <li>
              <Link href="/about" className=" underline
               hover:text-yellow-400 
              transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className=" underline hover:text-yellow-400
               transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4
           text-yellow-700">
            Follow Us
          </h3>
          <div className="flex gap-4 text-white dark:text-gray-300">
            
            <a
              href="https://github.com/oofeyang22"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-500 hover:text-black transition-colors"
            >
              <FaGithub />
            </a>

            <a
              href="https://github.com/oofeyang22"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-800 hover:bg-blue-500 hover:text-black transition-colors"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://github.com/oofeyang22"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-red-700 hover:bg-red-500 hover:text-black transition-colors"
            >
              <FaYoutube />
            </a>

            <a
              href="https://x.com/olaitan_feranmi"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-black hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaXTwitter />
            </a>

            <a
              href="https://www.linkedin.com/in/emmanuel-feranmi-6a6a00279/"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-900 hover:bg-blue-700 hover:text-white transition-colors"
            >
              <FaLinkedinIn />
            </a>

          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className=" mt-10 pt-6 text-center text-sm">
        © {new Date().getFullYear()} Tasty Restaurants. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
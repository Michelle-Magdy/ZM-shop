import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaLink,
  FaAngleRight,
  FaHeadset,
  FaAddressCard,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaBox,
  FaUndo,
  FaShippingFast,
  FaShieldAlt,
  FaGift,
  FaPaperPlane,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaPaypal,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="py-8 mt-12 text-[#e3e3e3] bg-primary px-4  md:px-6 lg:px-14">
      {/* Main Footer Content */}
      <div className=" mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">ShopHub</h3>
            <p className="text-sm leading-relaxed">
              Your one-stop destination for premium products. Quality meets
              convenience in every purchase.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <FaLink className="mr-2 text-link" />
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-link-hover text-link transition-colors duration-200 flex items-center"
                >
                  <FaAngleRight className="text-xs mr-2" />
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-link-hover text-link transition-colors duration-200 flex items-center"
                >
                  <FaAngleRight className="text-xs mr-2" />
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-link-hover text-link transition-colors duration-200 flex items-center"
                >
                  <FaAngleRight className="text-xs mr-2" />
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-link-hover text-link transition-colors duration-200 flex items-center"
                >
                  <FaAngleRight className="text-xs mr-2" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-link-hover text-link transition-colors duration-200 flex items-center"
                >
                  <FaAngleRight className="text-xs mr-2" />
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <FaHeadset className="mr-2 text-link" />
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-link-hover text-link transition-colors duration-200 flex items-center"
                >
                  <FaAngleRight className="text-xs mr-2" />
                  Track Order
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-link-hover text-link transition-colors duration-200 flex items-center"
                >
                  <FaAngleRight className="text-xs mr-2" />
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-link-hover text-link transition-colors duration-200 flex items-center"
                >
                  <FaAngleRight className="text-xs mr-2" />
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-link-hover text-link transition-colors duration-200 flex items-center"
                >
                  <FaAngleRight className="text-xs mr-2" />
                  Secure Payment
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-link-hover text-link transition-colors duration-200 flex items-center"
                >
                  <FaAngleRight className="text-xs mr-2" />
                  Gift Cards
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <FaAddressCard className="mr-2 text-link" />
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-link" />
                <span>
                  123 Commerce Street, Suite 100
                  <br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-3 text-link" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-link" />
                <span>support@shophub.com</span>
              </li>
              <li className="flex items-center">
                <FaClock className="mr-3 text-link" />
                <span>Mon - Fri: 9AM - 6PM EST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-white font-semibold text-lg mb-1">
                Subscribe to Our Newsletter
              </h4>
              <p className="text-sm text-slate-400">
                Get the latest deals and updates delivered to your inbox.
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <div className="relative grow md:grow-0">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent w-full md:w-80"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-cyan-900 dark:hover:bg-cyan-800 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center whitespace-nowrap border-2 border-cyan-50"
              >
                <FaPaperPlane className="mr-2" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4 text-2xl text-link">
              <FaCcVisa className="hover:text-white transition-colors" />
              <FaCcMastercard className="hover:text-white transition-colors" />
              <FaCcAmex className="hover:text-white transition-colors" />
              <FaPaypal className="hover:text-white transition-colors" />
            </div>
            <p className="text-sm text-slate-500">
              © 2026 ZM Shop. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

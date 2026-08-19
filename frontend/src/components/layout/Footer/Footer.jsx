// // src/components/layout/Footer/Footer.js
// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   FaInstagram,
//   FaYoutube,
//   FaFacebook,
//   FaApple,
//   FaGooglePlay,
// } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white mt-16">
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Left Section - App Download */}
//           <div className="flex flex-col items-center md:items-start">
//             <h4 className="text-xl font-bold mb-4">DOWNLOAD OUR APP</h4>
//             <p className="text-gray-400 text-center md:text-left mb-4">
//               Download App for Android and iOS mobile phone
//             </p>
//             <div className="flex space-x-4">
//               <a
//                 href="#"
//                 className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
//               >
//                 <FaGooglePlay className="text-2xl" />
//               </a>
//               <a
//                 href="#"
//                 className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
//               >
//                 <FaApple className="text-2xl" />
//               </a>
//             </div>
//           </div>

//           {/* Middle Section - Company Info */}
//           <div className="text-center md:text-center">
//             <h1 className="text-4xl font-bold text-red-500 mb-4">ECOMMERCE.</h1>
//             <p className="text-gray-400 max-w-md mx-auto">
//               High Quality is our first priority
//             </p>
//             <p className="text-gray-500 text-sm mt-4">
//               Copyrights 2024 &copy; YourCompany
//             </p>
//           </div>

//           {/* Right Section - Social Links */}
//           <div className="flex flex-col items-center md:items-end">
//             <h4 className="text-xl font-bold mb-4 underline">Follow Us</h4>
//             <div className="flex space-x-4">
//               <a
//                 href="https://instagram.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-gray-400 hover:text-red-500 transition-colors"
//               >
//                 <FaInstagram className="text-2xl" />
//               </a>
//               <a
//                 href="https://youtube.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-gray-400 hover:text-red-500 transition-colors"
//               >
//                 <FaYoutube className="text-2xl" />
//               </a>
//               <a
//                 href="https://facebook.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-gray-400 hover:text-red-500 transition-colors"
//               >
//                 <FaFacebook className="text-2xl" />
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

// src/components/layout/Footer/Footer.jsx

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaApple,
  FaGooglePlay,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: FaInstagram,
      url: "https://instagram.com",
      color: "hover:text-pink-500",
    },
    {
      icon: FaYoutube,
      url: "https://youtube.com",
      color: "hover:text-red-600",
    },
    {
      icon: FaFacebook,
      url: "https://facebook.com",
      color: "hover:text-blue-600",
    },
    {
      icon: FaTwitter,
      url: "https://twitter.com",
      color: "hover:text-blue-400",
    },
    { icon: FaGithub, url: "https://github.com", color: "hover:text-gray-300" },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-20">
      {/* 🎯 Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">
              Subscribe to our Newsletter
            </h3>
            <p className="text-gray-400 mb-6">
              Get the latest updates on new products and upcoming sales
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
              />
              <button className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* 🏪 Brand Section */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-red-500">ECOMMERCE.</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              High Quality is our first priority. We provide the best products
              with premium quality at affordable prices.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-all ${social.color}`}
                >
                  <social.icon className="text-lg" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* 📌 Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 relative">
              Quick Links
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-red-500 mt-1"></span>
            </h4>
            <ul className="space-y-3">
              {["About Us", "Contact", "Products", "Orders"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase().replace(" ", "")}`}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 📞 Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 relative">
              Contact Info
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-red-500 mt-1"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <MdLocationOn className="text-red-500 text-xl" />
                <span>123 Street, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <MdPhone className="text-red-500 text-xl" />
                <span>+92 123 4567890</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <MdEmail className="text-red-500 text-xl" />
                <span>info@ecommerce.com</span>
              </li>
            </ul>
          </div>

          {/* 📱 Download App */}
          <div>
            <h4 className="text-lg font-bold mb-4 relative">
              Download App
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-red-500 mt-1"></span>
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Download App for Android and iOS mobile phone
            </p>
            <div className="flex flex-col gap-3">
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-all"
              >
                <FaGooglePlay className="text-2xl" />
                <div>
                  <p className="text-xs text-gray-400">GET IT ON</p>
                  <p className="font-semibold">Google Play</p>
                </div>
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-all"
              >
                <FaApple className="text-2xl" />
                <div>
                  <p className="text-xs text-gray-400">Download on</p>
                  <p className="font-semibold">App Store</p>
                </div>
              </motion.a>
            </div>
          </div>
        </div>

        {/* 🔒 Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            Copyrights {currentYear} &copy; YourCompany. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/support"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

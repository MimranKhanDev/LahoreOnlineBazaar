// src/components/layout/Footer/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section - App Download */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xl font-bold mb-4">DOWNLOAD OUR APP</h4>
            <p className="text-gray-400 text-center md:text-left mb-4">
              Download App for Android and iOS mobile phone
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaGooglePlay className="text-2xl" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaApple className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Middle Section - Company Info */}
          <div className="text-center md:text-center">
            <h1 className="text-4xl font-bold text-red-500 mb-4">ECOMMERCE.</h1>
            <p className="text-gray-400 max-w-md mx-auto">
              High Quality is our first priority
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Copyrights 2024 &copy; YourCompany
            </p>
          </div>

          {/* Right Section - Social Links */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-xl font-bold mb-4 underline">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaYoutube className="text-2xl" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaFacebook className="text-2xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

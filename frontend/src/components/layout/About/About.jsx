// src/components/layout/About/About.jsx

import React from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const About = () => {
  // Social links
  const socialLinks = [
    {
      icon: FaInstagram,
      url: "https://instagram.com/anyUsercurrentlyIdon'tHave",
      color: "hover:text-pink-500",
      label: "Instagram",
    },
    {
      icon: FaYoutube,
      url: "https://www.youtube.com",
      color: "hover:text-red-600",
      label: "YouTube",
    },
    {
      icon: FaTwitter,
      url: "https://twitter.com",
      color: "hover:text-blue-400",
      label: "Twitter",
    },
    {
      icon: FaLinkedin,
      url: "https://linkedin.com",
      color: "hover:text-blue-700",
      label: "LinkedIn",
    },
    {
      icon: FaGithub,
      url: "https://github.com",
      color: "hover:text-gray-600",
      label: "GitHub",
    },
  ];

  // Team members (you can replace with actual data)
  const teamMembers = [
    {
      name: "Abhishek Singh",
      role: "Founder & CEO",
      avatar:
        "https://res.cloudinary.com/tripleayt/image/upload/v1631555947/products/jpyibarlaxawvcvqjv5b.png",
      bio: "Full-stack developer and content creator",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        {/* 🎯 Header Section */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            About <span className="text-red-500">Us</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-300 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Learn more about our journey, mission, and the team behind your
            favorite products
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 👤 Left: Founder Profile */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="relative inline-block">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={teamMembers[0].avatar}
                  alt={teamMembers[0].name}
                  className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-red-500 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
              </div>

              <h2 className="text-2xl font-bold mt-4">{teamMembers[0].name}</h2>
              <p className="text-red-500 font-medium">{teamMembers[0].role}</p>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                {teamMembers[0].bio}
              </p>

              <div className="mt-6 flex justify-center gap-3">
                {socialLinks.slice(0, 3).map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-gray-100 p-3 rounded-full ${social.color} hover:bg-gray-200 transition-all`}
                    aria-label={social.label}
                  >
                    <social.icon className="text-xl" />
                  </motion.a>
                ))}
              </div>

              <motion.a
                href="https://instagram.com/meabhisingh"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
              >
                Follow on Instagram
              </motion.a>
            </div>
          </motion.div>

          {/* 📝 Middle: About Content */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Mission Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                🎯 Our Mission
              </h3>
              <p className="text-gray-700 leading-relaxed">
                This is a sample e-commerce platform built with the MERN stack
                (MongoDB, Express.js, React, Node.js). Created with the purpose
                to teach full-stack development and provide a real-world project
                for learning and practice.
              </p>
            </div>

            {/* What We Offer */}
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                ✨ What We Offer
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: "🛒", text: "Quality Products" },
                  { icon: "🚀", text: "Fast Delivery" },
                  { icon: "💳", text: "Secure Payments" },
                  { icon: "⭐", text: "Best Prices" },
                  { icon: "🎓", text: "Learning Resources" },
                  { icon: "🤝", text: "24/7 Support" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-700 font-medium">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                🌐 Connect With Us
              </h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-5 py-3 bg-gray-100 rounded-full ${social.color} hover:bg-gray-200 transition-all`}
                  >
                    <social.icon className="text-xl" />
                    <span className="font-medium">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">📬 Get in Touch</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <MdEmail className="text-2xl" />
                  <span>support@ecommerce.com</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <MdPhone className="text-2xl" />
                  <span>+92 123 4567890</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <MdLocationOn className="text-2xl" />
                  <span>Lahore, Pakistan</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;

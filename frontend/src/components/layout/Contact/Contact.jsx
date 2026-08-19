// src/components/layout/Contact/Contact.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdSend,
  MdCheckCircle,
} from "react-icons/md";
import { FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: MdEmail,
      title: "Email",
      details: "support@ecommerce.com",
      link: "mailto:support@ecommerce.com",
      color: "text-red-500",
    },
    {
      icon: MdPhone,
      title: "Phone",
      details: "+92 123 4567890",
      link: "tel:+921234567890",
      color: "text-blue-500",
    },
    {
      icon: MdLocationOn,
      title: "Location",
      details: "Lahore, Pakistan",
      link: "#",
      color: "text-green-500",
    },
  ];

  const socialLinks = [
    {
      icon: FaWhatsapp,
      url: "https://wa.me/923001234567",
      color: "text-green-500",
    },
    { icon: FaFacebook, url: "https://facebook.com", color: "text-blue-600" },
    { icon: FaInstagram, url: "https://instagram.com", color: "text-pink-500" },
    { icon: FaTwitter, url: "https://twitter.com", color: "text-blue-400" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        {/* 🎯 Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Contact <span className="text-red-500">Us</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-300 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Reach out to us anytime
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 📋 Contact Info Cards */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 space-y-4"
          >
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                whileHover={{ scale: 1.02, x: 5 }}
                className="block bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-gray-50 rounded-xl ${info.color}`}>
                    <info.icon className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      {info.title}
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {info.details}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-all ${social.color}`}
                  >
                    <social.icon className="text-xl" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Response */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-2">📨 Quick Response</h3>
              <p className="text-sm opacity-90">
                We typically respond within 24 hours. For urgent inquiries,
                please call us directly.
              </p>
            </div>
          </motion.div>

          {/* ✉️ Contact Form */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MdSend className="text-red-500" />
                Send us a message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors resize-none"
                    placeholder="Tell us what you need..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitted ? (
                    <>
                      <MdCheckCircle className="text-xl" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <MdSend className="text-xl" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* 📍 Map Section (Optional) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217299.03743878917!2d74.21498269435136!3d31.483060600879107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0x23b6f25d4b2e9794!2sLahore%2C%20Pakistan!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Support</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <div className="flex items-center gap-4 text-gray-600">
            <Mail className="text-teal-600" />
            <span>support@vouchloop.com</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <Phone className="text-teal-600" />
            <span>+1 (800) 123-4567</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <MapPin className="text-teal-600" />
            <span>123 Commerce St, Tech City</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form className="flex flex-col gap-4">
            <input type="text" placeholder="Your Name" className="border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-teal-500" />
            <input type="email" placeholder="Your Email" className="border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-teal-500" />
            <textarea placeholder="Your Message" rows={4} className="border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-teal-500" />
            <button onClick={(e) => e.preventDefault()} className="bg-teal-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-700 transition">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

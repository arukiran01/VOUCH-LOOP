import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-gray-600 leading-relaxed mb-4">
          Welcome to VouchLoop, your premier destination for the best cashback, coupons, and gift card deals. We believe in making every purchase count by bringing you the most lucrative offers all in one integrated platform.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Our mission is to help shoppers maximize their savings safely and efficiently through our secure peer-to-peer voucher marketplace, powered by advanced AI and Escrow integration.
        </p>
      </div>
    </div>
  );
}

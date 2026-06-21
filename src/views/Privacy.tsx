import React from 'react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Information Collection</h2>
          <p className="text-gray-600 leading-relaxed">
            We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey or fill out a form required for KYC verification.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Use of Information</h2>
          <p className="text-gray-600 leading-relaxed">
            Any of the information we collect from you may be used in one of the following ways: To personalize your experience, to improve our website, to improve customer service, and to process secure transactions.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Data Protection</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
          </p>
        </section>
      </div>
    </div>
  );
}

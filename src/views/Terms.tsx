import React from 'react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing and using VouchLoop, you accept and agree to be bound by the terms and provision of this agreement. 
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
          <p className="text-gray-600 leading-relaxed">
            VouchLoop provides users with access to a rich collection of resources, including various customized gift card purchasing networks, cashback opportunities, and peer-to-peer selling functions.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">3. User Obligations</h2>
          <p className="text-gray-600 leading-relaxed">
            Users must complete KYC verification before executing peer-to-peer sales. Any fraudulent activity or misuse of the platform will result in immediate termination of the account and funds forfeiture according to our escrow rules.
          </p>
        </section>
      </div>
    </div>
  );
}

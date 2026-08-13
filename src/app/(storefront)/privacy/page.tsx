import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-16 max-w-4xl">
      <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-8">Privacy Policy</h1>
      
      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-charcoal mb-4 uppercase tracking-widest text-sm">1. Information We Collect</h2>
          <p>
            When you visit RJ Doctor Bat, we may collect personal information such as your name, email address, phone number, and shipping address when you make a purchase, book a service, or interact with our WhatsApp checkout system.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-charcoal mb-4 uppercase tracking-widest text-sm">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to fulfill your orders, provide customer support, communicate regarding service bookings (like bat knocking and repairs), and improve our website experience. 
            Because our checkout is handled via WhatsApp, your interactions and order details will also be subject to WhatsApp's privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-charcoal mb-4 uppercase tracking-widest text-sm">3. Data Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share generic aggregated demographic information not linked to any personal identification information with our business partners and trusted affiliates.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-charcoal mb-4 uppercase tracking-widest text-sm">4. Data Security</h2>
          <p>
            We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information and data stored on our site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-charcoal mb-4 uppercase tracking-widest text-sm">5. Changes to this Privacy Policy</h2>
          <p>
            RJ Doctor Bat has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes.
          </p>
        </section>
        
        <p className="pt-8 text-sm text-gray-400 border-t border-gray-100">
          Last updated: July 2026
        </p>
      </div>
    </div>
  );
}

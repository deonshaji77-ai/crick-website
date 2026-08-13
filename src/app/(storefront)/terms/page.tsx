import React from 'react';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-16 max-w-4xl">
      <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-8">Terms of Service</h1>
      
      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-charcoal mb-4 uppercase tracking-widest text-sm">1. Acceptance of Terms</h2>
          <p>
            By accessing and using RJ Doctor Bat, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-charcoal mb-4 uppercase tracking-widest text-sm">2. Products and Services</h2>
          <p>
            All products, including handpicked bats, protective gear, knocking services, and repairs, are subject to availability. We reserve the right to limit the quantities of any products or services that we offer. All descriptions of products or product pricing are subject to change at anytime without notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-charcoal mb-4 uppercase tracking-widest text-sm">3. WhatsApp Checkout & Orders</h2>
          <p>
            Our store utilizes WhatsApp for order processing and checkout. Submitting a cart to WhatsApp does not constitute a confirmed order until we verify inventory and send a confirmation and payment request back to you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-charcoal mb-4 uppercase tracking-widest text-sm">4. Returns and Refunds</h2>
          <p>
            Due to the bespoke nature of our handpicked bats and custom knocking/repair services, returns are only accepted in the case of manufacturing defects or shipping damage. Please contact us immediately if you receive a damaged product.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-charcoal mb-4 uppercase tracking-widest text-sm">5. User Conduct</h2>
          <p>
            You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without express written permission by us.
          </p>
        </section>

        <p className="pt-8 text-sm text-gray-400 border-t border-gray-100">
          Last updated: July 2026
        </p>
      </div>
    </div>
  );
}

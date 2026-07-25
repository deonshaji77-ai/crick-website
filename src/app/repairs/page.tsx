"use client";
import React, { useState } from 'react';
import { VisualRepairMenu } from "@/components/VisualRepairMenu";
import { RepairBookingForm } from "@/components/RepairBookingForm";

export default function RepairsPage() {
  const [selectedService, setSelectedService] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      {/* Hero Section */}
      <div className="bg-charcoal text-white pt-24 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight mb-6">
            Master Refurbishment
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            From cracked toes to broken handles, our expert craftsmen breathe new life into your prized willow. Review our reference images and book a repair below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Column: Visual Menu */}
          <div className="w-full lg:w-3/5 xl:w-2/3 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <VisualRepairMenu onSelect={(serviceName) => {
              setSelectedService(serviceName);
              // Scroll to form on mobile
              if (window.innerWidth < 1024) {
                document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
              }
            }} />
          </div>

          {/* Right Column: Booking Form (Sticky) */}
          <div id="booking-form" className="w-full lg:w-2/5 xl:w-1/3 lg:sticky lg:top-24">
            <RepairBookingForm selectedService={selectedService} />
          </div>

        </div>
      </div>
    </div>
  );
}

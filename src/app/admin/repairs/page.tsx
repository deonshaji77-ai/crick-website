"use client";

import React from "react";
import RepairManager from "../components/RepairManager";

export default function RepairsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-charcoal">
          Bat Repairs
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage repair services and pricing.
        </p>
      </div>
      <div className="h-[calc(100vh-220px)]">
        <RepairManager />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import KnockingManager from "../components/KnockingManager";

export default function KnockingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-charcoal">
          Knocking Service
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage knocking tiers and pricing.
        </p>
      </div>
      <div className="h-[calc(100vh-220px)]">
        <KnockingManager />
      </div>
    </div>
  );
}

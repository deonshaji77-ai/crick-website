"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getSiteSettingsFromFirestore, updateSiteSettingsInFirestore, SiteSettingsData } from "@/lib/firestore";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SiteSettingsData>({
    whatsappNumber: "",
    storeAddress: "",
    contactEmail: "",
    businessHours: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSiteSettingsFromFirestore();
        if (settings) {
          setFormData(settings);
        } else {
          // Default fallbacks if empty
          setFormData({
            whatsappNumber: "919876543210",
            storeAddress: "123 Cricket Lane, Mumbai, India",
            contactEmail: "support@rj doctor bat.com",
            businessHours: "Mon-Sat, 10 AM - 8 PM",
          });
        }
      } catch (err) {
        console.error("Failed to load settings", err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettingsInFirestore(formData);
      toast.success("Settings saved successfully! Refresh the page to see changes across the site.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-charcoal">
          Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure your admin panel and storefront preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-serif text-charcoal flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-slate-400" /> Site Configuration
              </CardTitle>
              <CardDescription>
                These details will be reflected dynamically across the storefront's navigation, footers, and checkout buttons.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="py-12 flex justify-center text-slate-500">Loading settings...</div>
              ) : (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp" className="text-charcoal font-semibold">WhatsApp Number</Label>
                      <Input 
                        id="whatsapp"
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                        placeholder="e.g. 919876543210 (Include Country Code, No Plus)"
                        required
                        className="bg-slate-50"
                      />
                      <p className="text-xs text-slate-400">Used for all checkout, booking, and support links.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-charcoal font-semibold">Contact Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                        placeholder="support@rj doctor bat.com"
                        required
                        className="bg-slate-50"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="text-charcoal font-semibold">Store Address</Label>
                      <Input 
                        id="address"
                        value={formData.storeAddress}
                        onChange={(e) => setFormData({...formData, storeAddress: e.target.value})}
                        placeholder="123 Cricket Lane, Mumbai, India"
                        required
                        className="bg-slate-50"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="hours" className="text-charcoal font-semibold">Business Hours</Label>
                      <Input 
                        id="hours"
                        value={formData.businessHours}
                        onChange={(e) => setFormData({...formData, businessHours: e.target.value})}
                        placeholder="Mon-Sat, 10 AM - 8 PM"
                        required
                        className="bg-slate-50"
                      />
                    </div>
                  </div>



                  <Button type="submit" disabled={saving} className="bg-charcoal text-white hover:bg-charcoal/90 mt-4">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-slate-200 bg-white shadow-sm h-full">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-serif text-charcoal">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-sm text-slate-600">
              <p>
                <strong>WhatsApp Formatting:</strong> Always include the country code without any special characters like <code>+</code> or <code>-</code>. For India, prepend with <code>91</code>.
              </p>
              <p>
                After saving, the changes take effect immediately on the front-end for all new sessions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

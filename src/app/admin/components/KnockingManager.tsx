"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function KnockingManager() {
  const [tiers, setTiers] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState(['']);

  const fetchTiers = async () => {
    try {
      const res = await fetch('/api/admin/knocking');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTiers(data);
      } else {
        console.error('Expected array for tiers, got:', data);
        setTiers([]);
      }
    } catch (err) {
      console.error('Failed to fetch tiers:', err);
      setTiers([]);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const handleAddFeature = () => setFeatures([...features, '']);
  
  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validFeatures = features.filter(f => f.trim() !== '');
      
      const payload = {
        name,
        price: parseFloat(price),
        features: validFeatures
      };

      const res = await fetch('/api/admin/knocking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsOpen(false);
        fetchTiers();
        // Reset form
        setName('');
        setPrice('');
        setFeatures(['']);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this knocking tier?")) return;
    try {
      await fetch(`/api/admin/knocking/${id}`, { method: 'DELETE' });
      fetchTiers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="border-none shadow-sm rounded-2xl h-full flex flex-col">
      <CardHeader className="bg-white border-b border-gray-100 px-6 py-4 flex flex-row items-center justify-between">
        <CardTitle className="font-serif text-xl text-charcoal">Knocking Tiers</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-charcoal text-white hover:bg-charcoal/90 font-bold uppercase tracking-widest text-[10px] px-3 h-8">
              + Add Tier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-charcoal">Add Knocking Tier</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tier Name</label>
                <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Standard Knocking" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                <Input required type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 500" />
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold text-charcoal">Features</label>
                  <Button type="button" onClick={handleAddFeature} variant="outline" size="sm" className="text-xs">
                    + Add Feature
                  </Button>
                </div>
                {features.map((feature, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <Input 
                      placeholder="e.g. 5000 machine strokes" 
                      value={feature} 
                      onChange={e => handleFeatureChange(i, e.target.value)} 
                      className="flex-1"
                    />
                    <button type="button" onClick={() => handleRemoveFeature(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-md">
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <Button disabled={loading} type="submit" className="w-full bg-neon text-charcoal font-bold mt-6">
                {loading ? "Saving..." : "Save Tier"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="bg-white p-6 flex-1 overflow-y-auto">
        {tiers.length === 0 ? (
          <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-xl">
            No knocking tiers configured yet.
          </div>
        ) : (
          <div className="space-y-4">
            {tiers.map((t: any) => (
              <div key={t.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-charcoal">{t.name}</h4>
                    <span className="text-sm font-medium text-gray-500">₹{t.price}</span>
                  </div>
                  <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </div>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4 mt-3">
                  {t.features?.map((f: any) => (
                    <li key={f.id}>{f.description}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

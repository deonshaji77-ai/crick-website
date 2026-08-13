"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PenTool, Trash2 } from 'lucide-react';

export default function CustomBatAdmin() {
  const [specs, setSpecs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [inputType, setInputType] = useState('text');
  const [optionsStr, setOptionsStr] = useState('');
  const [isRequired, setIsRequired] = useState(true);

  const fetchSpecs = async () => {
    try {
      const res = await fetch('/api/admin/custom-specs');
      const data = await res.json();
      setSpecs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSpecs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const options = inputType === 'dropdown' 
        ? optionsStr.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      
      const payload = {
        name,
        inputType,
        options,
        isRequired
      };

      const res = await fetch('/api/admin/custom-specs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsOpen(false);
        fetchSpecs();
        // Reset form
        setName('');
        setInputType('text');
        setOptionsStr('');
        setIsRequired(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this specification?")) return;
    try {
      await fetch(`/api/admin/custom-specs/${id}`, { method: 'DELETE' });
      fetchSpecs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-charcoal">
          Custom Bat Specifications
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage the dynamic fields shown to customers when ordering a custom bat.
        </p>
      </div>
      
      <div className="h-[calc(100vh-220px)]">
        <Card className="border-none shadow-sm rounded-2xl h-full flex flex-col">
          <CardHeader className="bg-white border-b border-gray-100 px-6 py-4 flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-xl text-charcoal flex items-center gap-2">
              <PenTool className="w-5 h-5 text-neon" />
              Dynamic Fields
            </CardTitle>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-charcoal text-white hover:bg-charcoal/90 font-bold uppercase tracking-widest text-[10px] px-3 h-8">
                  + Add Field
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl text-charcoal">Add Specification</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Field Name</label>
                    <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Edge Thickness" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Input Type</label>
                    <Select value={inputType} onValueChange={setInputType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select input type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text (Short Answer)</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="dropdown">Dropdown Options</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {inputType === 'dropdown' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Dropdown Options (Comma separated)</label>
                      <Input required value={optionsStr} onChange={e => setOptionsStr(e.target.value)} placeholder="Light, Medium, Heavy" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <label className="text-sm font-medium text-gray-700">Required Field?</label>
                    <Switch checked={isRequired} onCheckedChange={setIsRequired} />
                  </div>

                  <Button disabled={loading} type="submit" className="w-full bg-neon text-charcoal font-bold mt-6">
                    {loading ? "Saving..." : "Save Field"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          
          <CardContent className="bg-white p-6 flex-1 overflow-y-auto">
            {specs.length === 0 ? (
              <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-xl">
                No custom specifications configured yet.
              </div>
            ) : (
              <div className="space-y-4">
                {specs.map((s: any) => (
                  <div key={s.id} className="flex gap-4 border border-gray-100 rounded-xl p-4 bg-gray-50/50 items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-charcoal text-sm">{s.name}</h4>
                        {s.isRequired && <span className="text-[10px] uppercase font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">Required</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500 uppercase tracking-wider">{s.inputType}</span>
                        {s.inputType === 'dropdown' && (
                          <span className="text-xs text-gray-500 line-clamp-1">{s.options.join(', ')}</span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors self-start shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

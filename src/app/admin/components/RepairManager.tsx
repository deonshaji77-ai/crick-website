"use client";
import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function RepairManager() {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [turnaroundTime, setTurnaroundTime] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [imageReference, setImageReference] = useState('/images/bat_repair.jpg');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    setUploadingImage(true);
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "YOUR_CLOUD_NAME";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "YOUR_UPLOAD_PRESET";
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setImageReference(data.secure_url);
      } else {
        alert("Upload failed. Make sure you set an Unsigned Upload Preset in Cloudinary!");
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const fetchRepairs = async () => {
    try {
      const res = await fetch('/api/admin/repairs');
      const data = await res.json();
      setRepairs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name,
        turnaroundTime,
        basePrice: parseFloat(basePrice),
        imageReference
      };

      const res = await fetch('/api/admin/repairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsOpen(false);
        fetchRepairs();
        // Reset form
        setName('');
        setTurnaroundTime('');
        setBasePrice('');
        setImageReference('/images/bat_repair.jpg');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this repair service?")) return;
    try {
      await fetch(`/api/admin/repairs/${id}`, { method: 'DELETE' });
      fetchRepairs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="border-none shadow-sm rounded-2xl h-full flex flex-col">
      <CardHeader className="bg-white border-b border-gray-100 px-6 py-4 flex flex-row items-center justify-between">
        <CardTitle className="font-serif text-xl text-charcoal">Repair Services</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-charcoal text-white hover:bg-charcoal/90 font-bold uppercase tracking-widest text-[10px] px-3 h-8">
              + Add Repair
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-charcoal">Add Repair Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Service Name</label>
                <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Toe Binding" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Turnaround Time</label>
                <Input required value={turnaroundTime} onChange={e => setTurnaroundTime(e.target.value)} placeholder="e.g. 2-3 DAYS" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Base Price (₹)</label>
                <Input required type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} placeholder="e.g. 1500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Service Image</label>
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${dragActive ? 'border-neon bg-neon/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    ref={fileInputRef} 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) handleImageUpload(e.target.files[0]);
                    }}
                  />
                  {uploadingImage ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-8 h-8 text-charcoal animate-spin mb-2" />
                      <p className="text-sm font-medium text-gray-500">Uploading to Cloudinary...</p>
                    </div>
                  ) : imageReference && imageReference !== '/images/bat_repair.jpg' ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                      <p className="text-sm font-medium text-charcoal">Image Uploaded Successfully!</p>
                      <img src={imageReference} alt="Preview" className="w-16 h-16 object-cover rounded-lg mt-2 border border-gray-200 shadow-sm" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud className={`w-8 h-8 mb-2 ${dragActive ? 'text-neon' : 'text-gray-400'}`} />
                      <p className="text-sm font-medium text-charcoal mb-1">Click or drag image to upload</p>
                      <p className="text-xs text-gray-500">Automatically optimized via Cloudinary WebP/AVIF</p>
                    </div>
                  )}
                </div>
              </div>

              <Button disabled={loading} type="submit" className="w-full bg-neon text-charcoal font-bold mt-6">
                {loading ? "Saving..." : "Save Repair Service"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="bg-white p-6 flex-1 overflow-y-auto">
        {repairs.length === 0 ? (
          <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-xl">
            No repair services configured yet.
          </div>
        ) : (
          <div className="space-y-4">
            {repairs.map((r: any) => (
              <div key={r.id} className="flex gap-4 border border-gray-100 rounded-xl p-3 bg-gray-50/50 items-center">
                <img src={r.imageReference} alt={r.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                <div className="flex-1">
                  <h4 className="font-bold text-charcoal text-sm">{r.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">{r.turnaroundTime}</span>
                    <span className="text-xs font-bold text-gray-600">₹{r.basePrice}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(r.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors self-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

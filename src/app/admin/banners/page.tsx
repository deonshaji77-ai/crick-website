"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [linkableItems, setLinkableItems] = useState({ categories: [], products: [] });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState({
    image_url: '',
    target_type: 'custom',
    target_id: '',
    is_active: true,
    display_order: 0
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBanners();
    fetchLinkableItems();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      setBanners(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const fetchLinkableItems = async () => {
    try {
      const res = await fetch('/api/admin/linkable-items');
      const data = await res.json();
      setLinkableItems(data);
    } catch (err) {
      toast.error('Failed to load linkable items');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.image_url) {
      toast.error('Please upload an image');
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });
      
      if (!res.ok) throw new Error('Failed to save banner');
      
      toast.success('Banner added successfully');
      setIsFormOpen(false);
      setFormState({
        image_url: '',
        target_type: 'custom',
        target_id: '',
        is_active: true,
        display_order: banners.length
      });
      fetchBanners();
    } catch (err) {
      toast.error('Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete banner');
      
      toast.success('Banner deleted successfully');
      fetchBanners();
    } catch (err) {
      toast.error('Failed to delete banner');
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-neon" /></div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Banner Management</h1>
          <p className="text-gray-500 mt-2">Manage the storefront hero carousel banners.</p>
        </div>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-neon text-charcoal font-bold">
          {isFormOpen ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> Add Banner</>}
        </Button>
      </div>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Banner</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Banner Graphic</Label>
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-2 flex items-start gap-2">
                  <span className="text-amber-600 text-lg leading-none">⚠️</span>
                  <p className="text-sm font-bold text-amber-800">
                    IMPORTANT: Please upload images in a 16:9 aspect ratio for optimal display.
                  </p>
                </div>
                <div className="h-64">
                  <ImageUpload 
                    value={formState.image_url} 
                    onChange={(url) => setFormState({...formState, image_url: url})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Link Target Type</Label>
                  <Select 
                    value={formState.target_type} 
                    onValueChange={(val) => setFormState({...formState, target_type: val, target_id: ''})}
                  >
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="custom">Custom (No Link)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formState.target_type !== 'custom' && (
                  <div className="space-y-2">
                    <Label>Select {formState.target_type === 'product' ? 'Product' : 'Category'}</Label>
                    <Select 
                      value={formState.target_id} 
                      onValueChange={(val) => setFormState({...formState, target_id: val})}
                    >
                      <SelectTrigger><SelectValue placeholder="Select specific item" /></SelectTrigger>
                      <SelectContent>
                        {(formState.target_type === 'product' ? linkableItems.products : linkableItems.categories).map((item: any) => (
                          <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input 
                  type="number" 
                  value={formState.display_order} 
                  onChange={(e) => setFormState({...formState, display_order: parseInt(e.target.value) || 0})}
                />
              </div>

              <Button type="submit" disabled={saving} className="w-full bg-charcoal text-neon font-bold">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Banner'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <img src={banner.image_url} alt="Banner" className="w-full md:w-64 h-32 object-cover rounded-lg" />
              <div className="flex-1 w-full">
                <p className="font-bold text-lg">Type: <span className="capitalize">{banner.target_type}</span></p>
                {banner.target_id && <p className="text-gray-500 truncate">Target ID: {banner.target_id}</p>}
                <p className="text-gray-500">Order: {banner.display_order}</p>
                <p className="text-sm mt-2 font-medium">Status: {banner.is_active ? <span className="text-green-600">Active</span> : <span className="text-red-600">Inactive</span>}</p>
              </div>
              <Button variant="destructive" className="w-full md:w-auto mt-4 md:mt-0 py-6 md:py-2" onClick={() => handleDelete(banner.id)}>
                <Trash2 className="w-5 h-5 md:w-4 md:h-4 mr-2" /> Delete
              </Button>
            </CardContent>
          </Card>
        ))}
        {banners.length === 0 && !isFormOpen && (
          <div className="text-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No banners found. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

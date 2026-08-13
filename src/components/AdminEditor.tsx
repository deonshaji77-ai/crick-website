"use client";
import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/StoreContext";
import { useAuth } from "@/lib/AuthContext";
import { X, Save, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminEditor() {
  const { isEditorOpen, closeEditor, editingCollection, editingItem, updateItem, addItem, deleteItem } = useStore();
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({});
    }
  }, [editingItem]);

  if (!isAdmin || !isEditorOpen) return null;

  const handleSave = () => {
    if (!editingCollection) return;
    
    if (editingItem && editingItem.id) {
      updateItem(editingCollection as any, editingItem.id, formData);
    } else {
      addItem(editingCollection as any, formData);
    }
    closeEditor();
  };

  const handleDelete = () => {
    if (!editingCollection || !editingItem?.id) return;
    deleteItem(editingCollection as any, editingItem.id);
    closeEditor();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const isCommunity = editingCollection === "community";

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
        onClick={closeEditor}
      />
      
      {/* Editor Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-serif text-2xl font-medium text-charcoal">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
              Collection: {editingCollection}
            </p>
          </div>
          <button onClick={closeEditor} className="p-2 text-gray-400 hover:text-charcoal transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Name / Title</label>
            <Input 
              value={formData.name || formData.title || ''} 
              onChange={e => handleChange(formData.title !== undefined ? 'title' : 'name', e.target.value)} 
              placeholder="e.g. Classic Purist"
            />
          </div>

          {!isCommunity && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Price / Subtitle</label>
                <Input 
                  value={formData.price || formData.subtitle || ''} 
                  onChange={e => handleChange(formData.subtitle !== undefined ? 'subtitle' : 'price', e.target.value)} 
                  placeholder="e.g. ₹24,000"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Original Price</label>
                  <Input 
                    value={formData.originalPrice || ''} 
                    onChange={e => handleChange('originalPrice', e.target.value)} 
                    placeholder="e.g. ₹26,666"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Discount Label</label>
                  <Input 
                    value={formData.discount || ''} 
                    onChange={e => handleChange('discount', e.target.value)} 
                    placeholder="e.g. 10% off"
                  />
                </div>
              </div>
            </>
          )}

          {!isCommunity && editingCollection === "products" && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Category</label>
                <Input 
                  value={formData.category || ''} 
                  onChange={e => handleChange('category', e.target.value)} 
                  placeholder="e.g. Leather Bat"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Weight</label>
                  <Input 
                    value={formData.weight || ''} 
                    onChange={e => handleChange('weight', e.target.value)} 
                    placeholder="e.g. 1140g"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Edge</label>
                  <Input 
                    value={formData.edge || ''} 
                    onChange={e => handleChange('edge', e.target.value)} 
                    placeholder="e.g. 40mm"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Image URL
            </label>
            <Input 
              value={formData.image || ''} 
              onChange={e => handleChange('image', e.target.value)} 
              placeholder="https://..."
            />
            {formData.image && (
              <div className="mt-4 relative w-full aspect-video rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-4 bg-gray-50 mt-auto">
          {editingItem && (
            <Button 
              variant="outline" 
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-12 shrink-0 p-0"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button 
            className="flex-1 bg-neon text-charcoal font-bold hover:bg-neon/90 uppercase tracking-widest text-xs"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

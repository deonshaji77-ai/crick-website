"use client";

import React, { useState, useEffect } from "react";
import ImageUpload from "../components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addCommunityGalleryItem, getCommunityGalleryItems, deleteCommunityGalleryItem, CommunityGalleryItem } from "@/lib/firestore";
import { Trash2, Plus, Loader2 } from "lucide-react";

export default function GalleryManager() {
  const [items, setItems] = useState<(CommunityGalleryItem & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [playerName, setPlayerName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await getCommunityGalleryItems();
      setItems(data);
    } catch (err) {
      console.error("Failed to load gallery items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !imageUrl) return;

    setSubmitting(true);
    try {
      await addCommunityGalleryItem({
        playerName: playerName.trim(),
        imageUrl,
        createdAt: new Date().toISOString()
      });
      setPlayerName("");
      setImageUrl("");
      loadItems();
    } catch (err) {
      console.error("Failed to add gallery item", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    try {
      await deleteCommunityGalleryItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete gallery item", err);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">Community Gallery</h1>
          <p className="text-gray-500 mt-1">Manage player photos and gallery uploads.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-neon" /> Add New Photo
          </h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Player Name</label>
              <Input
                placeholder="e.g. Virat K."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Photo</label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>

            <Button 
              type="submit" 
              disabled={submitting || !playerName.trim() || !imageUrl}
              className="bg-charcoal text-white hover:bg-charcoal/90 w-full mt-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {submitting ? "Uploading..." : "Publish to Gallery"}
            </Button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : items.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
              No photos in the gallery yet. Upload one to get started!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {items.map(item => (
                <div key={item.id} className="relative group rounded-xl overflow-hidden aspect-[3/4] bg-gray-100 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.playerName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 flex flex-col justify-end p-4">
                    <span className="text-white font-serif text-lg font-medium">{item.playerName}</span>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

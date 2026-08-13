"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, ExternalLink, Instagram, UploadCloud, X, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";

interface InstagramPost {
  id: string;
  imageUrl: string;
  mediaType: string;
  postUrl: string;
  createdAt: string;
}

export default function InstagramAdminPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Form State
  const [imageUrl, setImageUrl] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [postUrl, setPostUrl] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/instagram");
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      toast.error("Failed to load Instagram posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const toastId = toast.loading("Uploading media...");
    
    try {
      // 1. Get signature
      const sigRes = await fetch("/api/cloudinary/sign");
      const { timestamp, signature } = await sigRes.json();
      
      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "");
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", "circvault-website"); // Matches backend

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      });
      
      const uploadData = await uploadRes.json();
      
      if (uploadData.secure_url) {
        setImageUrl(uploadData.secure_url);
        setMediaType(uploadData.resource_type === "video" ? "video" : "image");
        toast.success("Media uploaded successfully", { id: toastId });
      } else {
        throw new Error(uploadData.error?.message || "Upload failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload media", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error("Please upload an image or video first");
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, postUrl, mediaType }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Post added successfully!");
        setPosts([data.post, ...posts]);
        setIsModalOpen(false);
        setImageUrl("");
        setPostUrl("");
        setMediaType("image");
      } else {
        toast.error(data.error || "Failed to add post");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/instagram/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Post deleted");
        setPosts(posts.filter((p) => p.id !== id));
      } else {
        toast.error("Failed to delete post");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">
            Instagram Feed
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage the posts displayed in the dynamic storefront grid.
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-charcoal text-neon font-bold uppercase tracking-widest hover:bg-charcoal/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-charcoal">Add Instagram Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPost} className="space-y-4 mt-4">
              
              <div className="space-y-2">
                <Label className="text-charcoal font-semibold">Media (Image or Video)</Label>
                
                {imageUrl ? (
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200 bg-black flex items-center justify-center group">
                    {mediaType === "video" ? (
                      <video src={imageUrl} className="w-full h-full object-cover" controls playsInline />
                    ) : (
                      <Image src={imageUrl} alt="Uploaded Media" fill className="object-cover" />
                    )}
                    <button 
                      type="button" 
                      onClick={() => { setImageUrl(""); setMediaType("image"); }}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${dragActive ? 'border-neon bg-neon/5' : 'border-gray-200 bg-gray-50'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      ref={fileInputRef} 
                      type="file" 
                      accept="image/*,video/*" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                    <UploadCloud className={`w-10 h-10 mb-3 ${dragActive ? 'text-neon' : 'text-gray-400'}`} />
                    <p className="text-sm font-medium text-charcoal mb-1">
                      {uploading ? "Uploading..." : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-xs text-gray-500">Supports JPG, PNG, MP4, WEBM</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postUrl" className="text-charcoal font-semibold">Post URL</Label>
                <Input 
                  id="postUrl"
                  required 
                  value={postUrl} 
                  onChange={e => setPostUrl(e.target.value)} 
                  placeholder="https://instagram.com/p/..."
                />
              </div>
              <Button type="submit" disabled={submitting || uploading || !imageUrl} className="w-full bg-charcoal text-neon font-bold uppercase hover:bg-charcoal/90">
                {submitting ? "Adding..." : "Add Post"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg font-serif text-charcoal flex items-center gap-2">
            <Instagram className="w-5 h-5 text-slate-400" /> All Posts
          </CardTitle>
          <CardDescription>
            {posts.length} {posts.length === 1 ? "post" : "posts"} total.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="py-12 flex justify-center text-slate-500">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="py-12 flex justify-center text-slate-500">No Instagram posts added yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {posts.map((post) => (
                <div key={post.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden border border-slate-200 bg-black flex items-center justify-center">
                      {post.mediaType === "video" ? (
                        <>
                          <video src={post.imageUrl} className="w-full h-full object-cover opacity-60" />
                          <PlayCircle className="w-6 h-6 text-white absolute" />
                        </>
                      ) : post.imageUrl ? (
                        <Image src={post.imageUrl} alt="Instagram Post" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                          <Instagram className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <a 
                        href={post.postUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-charcoal flex items-center gap-1 hover:text-neon hover:underline"
                      >
                        View on Instagram <ExternalLink className="w-3 h-3" />
                      </a>
                      <p className="text-xs text-slate-500 mt-1">
                        Added on {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, User, Star, Truck, Quote, ExternalLink, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ReviewData } from "@/lib/firestore";
import Image from "next/image";

interface SocialProofProps {
  initialReviews: ReviewData[];
}

interface InstagramPost {
  id: string;
  imageUrl: string;
  mediaType: string;
  postUrl: string;
}

export default function SocialProof({ initialReviews }: SocialProofProps) {
  const [reviews, setReviews] = useState<ReviewData[]>(initialReviews.filter(r => r.status === 'approved'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  // Instagram State
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [instaIndex, setInstaIndex] = useState(0);
  const [isInstaHovered, setIsInstaHovered] = useState(false);
  const [loadingInsta, setLoadingInsta] = useState(true);

  // Fetch Instagram Posts
  useEffect(() => {
    const fetchInsta = async () => {
      try {
        const res = await fetch("/api/instagram");
        const data = await res.json();
        if (data.success && data.posts) {
          setInstagramPosts(data.posts);
        }
      } catch (err) {
        console.error("Failed to load Instagram posts", err);
      } finally {
        setLoadingInsta(false);
      }
    };
    fetchInsta();
  }, []);

  // Reviews Rotation
  useEffect(() => {
    if (reviews.length <= 1) return;
    
    let timer: NodeJS.Timeout;
    if (!isHovered) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [reviews.length, isHovered]);

  // Instagram Rotation
  useEffect(() => {
    if (instagramPosts.length <= 4) return;
    
    let timer: NodeJS.Timeout;
    if (!isInstaHovered) {
      timer = setInterval(() => {
        setInstaIndex((prev) => (prev + 4) % instagramPosts.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [instagramPosts.length, isInstaHovered]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, text }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review submitted successfully!");
        setReviews([data.review, ...reviews]);
        setIsModalOpen(false);
        setName("");
        setRating(5);
        setText("");
      } else {
        toast.error("Failed to submit review");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate visible Instagram posts (exactly 4)
  const visiblePosts = [];
  if (instagramPosts.length > 0) {
    for (let i = 0; i < 4; i++) {
      if (instagramPosts.length <= 4) {
        if (instagramPosts[i]) visiblePosts.push(instagramPosts[i]);
      } else {
        visiblePosts.push(instagramPosts[(instaIndex + i) % instagramPosts.length]);
      }
    }
  }

  return (
    <section className="py-16 bg-black text-white border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Stats */}
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Why Players Choose RJ Doctor Bat</h3>
          <div className="grid grid-cols-2 gap-y-8 gap-x-4">
            <div>
              <ShieldCheck className="w-8 h-8 text-neon mb-3" />
              <div className="font-sans text-2xl font-black">100%</div>
              <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Quality<br/>Assured</div>
            </div>
            <div>
              <User className="w-8 h-8 text-neon mb-3" />
              <div className="font-sans text-2xl font-black">5000+</div>
              <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Happy<br/>Customers</div>
            </div>
            <div>
              <Star className="w-8 h-8 text-neon mb-3" />
              <div className="font-sans text-2xl font-black">4.9★</div>
              <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Average<br/>Rating</div>
            </div>
            <div>
              <Truck className="w-8 h-8 text-neon mb-3" />
              <div className="font-sans text-2xl font-black">Fast</div>
              <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Pan India<br/>Delivery</div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="flex flex-col h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">What Our Customers Say</h3>
            
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 text-neon hover:text-[#B89B2B] hover:bg-transparent text-xs uppercase tracking-widest font-bold">
                  Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-[#111] border-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-serif text-neon uppercase tracking-wider">Share Your Experience</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitReview} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Name</label>
                    <Input 
                      required 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="bg-black border-gray-800 focus-visible:ring-neon" 
                      placeholder="e.g. Virat Kohli" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          type="button" 
                          key={star} 
                          onClick={() => setRating(star)} 
                          className="focus:outline-none"
                        >
                          <Star className={`w-6 h-6 ${star <= rating ? "fill-amber-500 text-amber-500" : "text-gray-600"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Review</label>
                    <textarea 
                      required 
                      value={text} 
                      onChange={e => setText(e.target.value)} 
                      className="w-full h-24 bg-black border border-gray-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-neon" 
                      placeholder="Tell us about the quality, balance, and pickup..." 
                    />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full bg-neon text-charcoal font-bold uppercase tracking-widest hover:bg-[#B89B2B]">
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div 
            className="bg-[#111] border border-gray-800 rounded-2xl p-8 flex-1 flex flex-col justify-center text-center relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Quote className="absolute top-4 right-4 w-12 h-12 text-gray-800 opacity-50 z-0" />
            
            {reviews.length > 0 ? (
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center w-full"
                  >
                    <div className="flex justify-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < reviews[currentIndex].rating ? "fill-neon text-neon" : "text-gray-700"}`} />
                      ))}
                    </div>
                    <p className="text-gray-300 text-sm italic mb-6 leading-relaxed line-clamp-4 min-h-[80px]">
                      "{reviews[currentIndex].text}"
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white uppercase tracking-wider">{reviews[currentIndex].name}</div>
                        <div className="text-[10px] text-neon uppercase tracking-widest">Verified Customer</div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Dots indicator */}
                {reviews.length > 1 && (
                  <div className="absolute bottom-[-16px] left-0 right-0 flex justify-center gap-2">
                    {reviews.map((_, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? "bg-neon w-3" : "bg-gray-700"}`} 
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-sm relative z-10">No reviews yet. Be the first!</div>
            )}
          </div>
        </div>

        {/* Instagram Grid */}
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex justify-between items-center">
            Follow Us
            <span className="text-neon lowercase tracking-normal">@rj doctor bat</span>
          </h3>
          <div 
            className="flex-1 h-[312px] relative overflow-hidden"
            onMouseEnter={() => setIsInstaHovered(true)}
            onMouseLeave={() => setIsInstaHovered(false)}
          >
            {loadingInsta ? (
              <div className="grid grid-cols-2 gap-3 h-full">
                {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-square bg-[#111] animate-pulse rounded-xl border border-gray-800" />
                ))}
              </div>
            ) : visiblePosts.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={instaIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="grid grid-cols-2 gap-3 absolute inset-0"
                >
                  {visiblePosts.map((item, i) => (
                    item.imageUrl ? (
                      <a 
                        key={item.id || i} 
                        href={item.postUrl || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block aspect-square bg-[#111] rounded-xl overflow-hidden relative group cursor-pointer border border-gray-800 hover:border-neon transition-colors"
                      >
                        {item.mediaType === "video" ? (
                          <video 
                            src={item.imageUrl} 
                            autoPlay 
                            muted 
                            loop 
                            playsInline 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <Image src={item.imageUrl} alt="Instagram post" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <ExternalLink className="w-6 h-6 text-neon" />
                        </div>
                      </a>
                    ) : (
                      <div key={i} className="aspect-square bg-[#111] rounded-xl relative border border-gray-800 flex items-center justify-center">
                        <Instagram className="w-6 h-6 text-gray-700" />
                      </div>
                    )
                  ))}
                  {/* Fill empty slots if less than 4 posts exist in total */}
                  {Array.from({ length: Math.max(0, 4 - visiblePosts.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square bg-[#111] rounded-xl relative border border-gray-800 flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-gray-700 opacity-50" />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="grid grid-cols-2 gap-3 h-full">
                {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-square bg-[#111] rounded-xl relative border border-gray-800 flex items-center justify-center">
                    <span className="text-[10px] text-gray-700 font-bold uppercase">Instagram</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

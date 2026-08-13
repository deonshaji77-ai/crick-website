"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, Trash2, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ReviewData } from "@/lib/firestore";

interface ReviewWithId extends ReviewData {
  id: string;
}

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<ReviewWithId[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== id));
        toast.success("Review deleted");
      } else {
        toast.error("Failed to delete review");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">
            Reviews Moderation
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage customer feedback from the storefront.
          </p>
        </div>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-lg font-serif text-charcoal flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-400" /> Customer Reviews
          </CardTitle>
          <CardDescription>
            All submitted reviews are displayed here. You can remove inappropriate or spam reviews.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="text-sm font-medium">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
              <MessageSquare className="w-12 h-12 opacity-20" />
              <p className="text-sm font-medium">No reviews found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 uppercase tracking-wider text-xs">Customer</th>
                    <th className="px-6 py-4 uppercase tracking-wider text-xs">Rating</th>
                    <th className="px-6 py-4 uppercase tracking-wider text-xs w-1/2">Review Text</th>
                    <th className="px-6 py-4 uppercase tracking-wider text-xs">Date</th>
                    <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-charcoal">{review.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? "fill-amber-500" : "fill-transparent text-slate-300"}`} 
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="max-w-md break-words">
                          "{review.text}"
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(review.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

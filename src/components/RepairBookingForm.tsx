"use client";

import { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { UploadCloud, X, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Enter a valid phone number." }),
  serviceType: z.string().min(1, { message: "Please select a service." }),
});

export function RepairBookingForm({ selectedService }: { selectedService?: string }) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      serviceType: selectedService || "",
    },
  });

  // Update form when selectedService prop changes
  useEffect(() => {
    if (selectedService) {
      form.setValue("serviceType", selectedService);
    }
  }, [selectedService, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Mock submission process
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      console.log(values, files);
    }, 1500);
  }

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
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles].slice(0, 3)); // Max 3 files
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 rounded-2xl p-8 md:p-12 text-center flex flex-col items-center justify-center border border-green-100 shadow-sm h-full">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
        <h3 className="font-serif text-3xl font-medium text-charcoal mb-4">Request Received</h3>
        <p className="text-gray-600 mb-8 max-w-md">
          Our master craftsmen will review your bat photos and get back to you with a confirmed quote within 24 hours.
        </p>
        <Button onClick={() => { setIsSuccess(false); form.reset(); setFiles([]); }} variant="outline" className="rounded-full px-8">
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-10 shadow-xl border border-gray-100">
      <div className="mb-8">
        <h3 className="font-serif text-2xl font-medium text-charcoal mb-2">Book a Repair</h3>
        <p className="text-gray-500 text-sm">Upload photos of the damage for an accurate quote.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-charcoal font-semibold">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" className="bg-gray-50/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-charcoal font-semibold">Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 98765 43210" className="bg-gray-50/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-charcoal font-semibold">Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" type="email" className="bg-gray-50/50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-charcoal font-semibold">Required Service</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-50/50">
                      <SelectValue placeholder="Select a service from the menu..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Toe Binding & Repair">Toe Binding & Repair (₹850)</SelectItem>
                    <SelectItem value="Handle Replacement">Handle Replacement (₹1,800)</SelectItem>
                    <SelectItem value="Full Refurbishment">Full Refurbishment (₹2,500)</SelectItem>
                    <SelectItem value="Edge Repair">Edge Repair (₹600)</SelectItem>
                    <SelectItem value="Other / Not Sure">Other / Not Sure (Quote required)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Custom File Upload Area */}
          <div className="space-y-2 pt-2">
            <FormLabel className="text-charcoal font-semibold">Damage Photos (Max 3)</FormLabel>
            <div 
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${dragActive ? 'border-neon bg-neon/5' : 'border-gray-200 bg-gray-50'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input 
                ref={inputRef} 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleChange}
              />
              <UploadCloud className={`w-10 h-10 mb-3 ${dragActive ? 'text-neon' : 'text-gray-400'}`} />
              <p className="text-sm font-medium text-charcoal mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
            
            {files.length > 0 && (
              <div className="flex flex-col gap-2 mt-4">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-100">
                    <span className="text-xs truncate max-w-[200px] font-medium text-charcoal">{file.name}</span>
                    <button 
                      type="button" 
                      onClick={() => removeFile(idx)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full rounded-full py-6 mt-4 text-sm font-bold uppercase tracking-widest bg-charcoal text-white hover:bg-neon hover:text-charcoal transition-all duration-300 shadow-md">
            {isSubmitting ? "Submitting..." : "Request Quote"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

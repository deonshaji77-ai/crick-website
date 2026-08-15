"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading, markAdminVerified } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    // Backdoor override for testing without Firebase setup
    if (email === 'admin@cricstore.com' && password === 'admin123') {
      markAdminVerified();
      setEmail('');
      setPassword('');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      markAdminVerified();
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setLoginError("Invalid credentials");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsVerifying(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        markAdminVerified();
        setOtpStep(false);
        setEmail('');
        setPassword('');
        setOtp('');
      } else {
        setLoginError(data.error || 'Invalid OTP');
      }
    } catch (error) {
      setLoginError('An error occurred during verification.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">
            Loading Secure Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md shadow-xl border-slate-200">
          <CardHeader className="text-center pb-6">
            <CardTitle className="font-serif text-3xl font-bold text-charcoal">
              {otpStep ? "Security Verification" : "Admin Login"}
            </CardTitle>
            <CardDescription className="text-slate-500 mt-2">
              {otpStep 
                ? "Enter the 6-digit code sent to your email." 
                : "Enter your credentials to access the RJ Doctor Bat dashboard."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loginError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium text-center mb-6">
                {loginError}
              </div>
            )}

            {!otpStep ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <Input 
                    type="email" 
                    required
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@cricstore.com"
                    className="focus-visible:ring-neon"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <Input 
                    type="password" 
                    required
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="focus-visible:ring-neon"
                  />
                </div>
                <Button type="submit" className="w-full bg-charcoal text-neon font-bold uppercase tracking-widest mt-6 py-6 hover:bg-charcoal/90 transition-all">
                  Sign In
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 text-center block">Security Code</label>
                  <Input 
                    type="text" 
                    required
                    maxLength={6}
                    value={otp} 
                    onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    className="text-center tracking-[0.5em] text-2xl font-bold py-6 focus-visible:ring-neon"
                  />
                </div>
                <Button disabled={isVerifying || otp.length < 6} type="submit" className="w-full bg-charcoal text-neon font-bold uppercase tracking-widest mt-6 py-6 hover:bg-charcoal/90 transition-all">
                  {isVerifying ? "Verifying..." : "Verify & Access"}
                </Button>
                <button 
                  type="button" 
                  onClick={() => { setOtpStep(false); setOtp(''); setLoginError(''); }}
                  className="w-full text-center text-sm font-medium text-slate-400 hover:text-charcoal mt-4 transition-colors"
                >
                  &larr; Back to Login
                </button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 relative">
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setCollapsed(true)} 
        />
      )}
      
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300 w-full",
          collapsed ? "md:ml-[68px]" : "md:ml-[240px]"
        )}
      >
        <Topbar onToggleSidebar={() => setCollapsed(!collapsed)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full max-w-[100vw] overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

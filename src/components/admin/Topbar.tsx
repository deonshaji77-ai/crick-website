"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  LogOut,
  User,
  Shield,
} from "lucide-react";
import { navItems } from "./Sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/AuthContext";

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const matchedNav = navItems.find((item) => item.href === currentPath);
    const label = matchedNav
      ? matchedNav.label
      : segment.charAt(0).toUpperCase() + segment.slice(1);
    crumbs.push({ label, href: currentPath });
  }

  return crumbs;
}

export default function Topbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-1.5 text-sm">
        <button 
          className="md:hidden p-2 -ml-2 mr-1 text-slate-500 hover:bg-slate-100 rounded-md"
          onClick={onToggleSidebar}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
        <Link
          href="/admin"
          className="hidden sm:block text-slate-400 hover:text-charcoal transition-colors font-medium"
        >
          Admin
        </Link>
        {breadcrumbs.slice(1).map((crumb) => (
          <React.Fragment key={crumb.href}>
            <ChevronRight className="hidden sm:block h-3.5 w-3.5 text-slate-300" />
            <Link
              href={crumb.href}
              className="text-slate-400 hover:text-charcoal transition-colors font-medium capitalize"
            >
              {crumb.label}
            </Link>
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search..."
            className="h-9 w-64 rounded-lg border-slate-200 bg-slate-50 pl-9 text-sm placeholder:text-slate-400 focus:bg-white"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-charcoal text-neon text-xs font-bold">
                  {currentUser?.email
                    ? currentUser.email.charAt(0).toUpperCase()
                    : "A"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-charcoal leading-none">
                  Admin
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentUser?.email || "admin@rj doctor bat.com"}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-charcoal">Admin User</p>
                <p className="text-xs text-slate-400">
                  {currentUser?.email || "admin@rj doctor bat.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                View Storefront
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-500"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

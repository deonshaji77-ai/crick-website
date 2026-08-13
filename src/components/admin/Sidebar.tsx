"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Hammer,
  Image as ImageIcon,
  PenTool,
  MessageSquare,
  Instagram,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Inventory", href: "/admin/inventory", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Knocking", href: "/admin/knocking", icon: Hammer },
  { label: "Repairs", href: "/admin/repairs", icon: Wrench },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Custom Bat Specs", href: "/admin/custom-bat", icon: PenTool },
  { label: "Instagram", href: "/admin/instagram", icon: Instagram },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-slate-200 bg-white transition-all duration-300 ease-in-out flex flex-col",
          collapsed ? "w-[68px]" : "w-60"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 shrink-0">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal">
                <span className="text-xs font-bold text-neon">RJ</span>
              </div>
              <span className="text-lg font-serif font-bold text-charcoal tracking-tight">
                RJ Doctor Bat
              </span>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal">
              <span className="text-xs font-bold text-neon">RJ</span>
            </div>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3 mt-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-charcoal text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-charcoal",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <React.Fragment key={item.href}>{linkContent}</React.Fragment>;
          })}
        </nav>

        <div className="border-t border-slate-200 p-3 shrink-0">
          <button
            onClick={onToggle}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-100 hover:text-charcoal"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}

export { navItems };

"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  Tags,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProductsFromFirestore, getCategoriesFromFirestore, getOrdersFromFirestore } from "@/lib/firestore";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    activeCategories: 0,
    pendingOrders: 0,
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [products, categories, orders] = await Promise.all([
          getProductsFromFirestore(),
          getCategoriesFromFirestore(),
          getOrdersFromFirestore(),
        ]);
        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          activeCategories: categories.filter(
            (c: any) => c.status === "active"
          ).length,
          pendingOrders: orders.filter((o: any) => o.status === "pending").length,
        });
        setRecentProducts(products.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      change: "+12%",
      up: true,
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: Tags,
      change: `${stats.activeCategories} active`,
      up: true,
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: ShoppingCart,
      change: stats.pendingOrders > 0 ? `${stats.pendingOrders} action needed` : "No pending",
      up: stats.pendingOrders > 0,
    },
    {
      title: "Revenue (MTD)",
      value: "₹0",
      icon: TrendingUp,
      change: "—",
      up: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-charcoal">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Overview of your RJ Doctor Bat admin panel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            className="border-slate-200 bg-white shadow-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-charcoal">{stat.value}</div>
              <div className="mt-1 flex items-center gap-1">
                {stat.up ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-slate-400" />
                )}
                <span className="text-xs text-slate-500">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg font-serif text-charcoal">
            Recent Products
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">
                No products yet. Head to Inventory to add your first product.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentProducts.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-10 w-10 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-400">{p.category}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    ₹{p.basePrice}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

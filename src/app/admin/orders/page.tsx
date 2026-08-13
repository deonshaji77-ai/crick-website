"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOrdersFromFirestore, updateOrderStatusInFirestore } from "@/lib/firestore";
import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getOrdersFromFirestore();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateOrderStatusInFirestore(id, newStatus);
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-charcoal">Orders</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track and manage customer orders.
        </p>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-lg font-serif text-charcoal">
            All Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-sm">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">
                No orders yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                When customers checkout, their orders will appear here.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="font-semibold text-slate-600">Order ID</TableHead>
                  <TableHead className="font-semibold text-slate-600">Date</TableHead>
                  <TableHead className="font-semibold text-slate-600">Items</TableHead>
                  <TableHead className="font-semibold text-slate-600">Total</TableHead>
                  <TableHead className="font-semibold text-slate-600">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs text-slate-500">{o.id}</TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {o.items.map((item: any, i: number) => (
                        <div key={i} className="mb-1">
                          {item.quantity || 1}x {item.product?.name || item.name}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{o.totalPrice.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={o.status} 
                        onValueChange={(val) => handleStatusChange(o.id, val)}
                      >
                        <SelectTrigger className="h-8 text-xs w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import {
  getCategoriesFromFirestore,
  addCategoryToFirestore,
  updateCategoryInFirestore,
  deleteCategoryFromFirestore,
  getProductsFromFirestore,
} from "@/lib/firestore";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [funnel, setFunnel] = useState<"bats" | "store">("store");

  const fetchCategories = async () => {
    try {
      const data = await getCategoriesFromFirestore();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProductsFromFirestore();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("");
    setStatus("active");
    setFunnel("store");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!editingId) {
      setSlug(generateSlug(value));
    }
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setStatus(cat.status || "active");
    setFunnel(cat.funnel || "store");
    setIsSheetOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug || generateSlug(name),
        description: description.trim(),
        image,
        funnel,
        status,
        createdAt: new Date().toISOString(),
      };

      if (editingId) {
        await updateCategoryInFirestore(editingId, payload);
      } else {
        await addCategoryToFirestore(payload);
      }

      setIsSheetOpen(false);
      fetchCategories();
      resetForm();
      
      // Trigger storefront cache bust
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: ['categories', 'products'] })
      }).catch(console.error);

    } catch (err) {
      console.error(err);
      alert("An error occurred while saving the category.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategoryFromFirestore(id);
      fetchCategories();
      
      // Trigger storefront cache bust
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: ['categories', 'products'] })
      }).catch(console.error);

    } catch (err) {
      console.error(err);
    }
  };

  const getProductCount = (categoryName: string) => {
    return products.filter((p) => p.category === categoryName).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">
            Categories
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage product categories dynamically.
          </p>
        </div>
        <Button
          variant="neon"
          size="sm"
          onClick={() => {
            resetForm();
            setIsSheetOpen(true);
          }}
          className="uppercase tracking-widest text-xs"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Category
        </Button>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-lg font-serif text-charcoal">
            All Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Package className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500 font-medium">
                No categories yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Create your first category to organize products.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="font-semibold text-slate-600">
                    Category
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Slug
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Funnel
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Items
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat: any) => (
                  <TableRow key={cat.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="h-9 w-9 rounded-lg object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Package className="h-4 w-4 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-charcoal block">
                            {cat.name}
                          </span>
                          {cat.description && (
                            <span className="text-xs text-slate-400 line-clamp-1">
                              {cat.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">
                      {cat.slug}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="uppercase text-[10px]">
                        {cat.funnel || "store"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getProductCount(cat.name)} products
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          cat.status === "active" ? "neon" : "outline"
                        }
                      >
                        {cat.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(cat)}
                          className="text-slate-500 hover:text-charcoal h-8 w-8 p-0"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(cat.id)}
                          className="text-slate-500 hover:text-red-500 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={(open) => {
        setIsSheetOpen(open);
        if (!open) resetForm();
      }}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl font-serif text-charcoal">
              {editingId ? "Edit Category" : "New Category"}
            </SheetTitle>
            <SheetDescription>
              {editingId
                ? "Update the category details below."
                : "Fill in the details to create a new product category."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Category Name
              </label>
              <Input
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. English Willow Bats"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Slug
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-from-name"
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-400">
                Auto-generated from name. Edit if needed.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this category"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Status
              </label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as "active" | "draft")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Funnel
              </label>
              <Select
                value={funnel}
                onValueChange={(val) => setFunnel(val as "bats" | "store")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="store">Gear Store</SelectItem>
                  <SelectItem value="bats">Handpicked Bats</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Category Image / Icon
              </label>
              <ImageUpload value={image} onChange={setImage} />
            </div>

            <SheetFooter className="pt-4">
              <Button
                disabled={loading}
                type="submit"
                className="w-full bg-charcoal text-white font-bold"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Category"
                  : "Create Category"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import {
  getProductsFromFirestore,
  addProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
  getCategoriesFromFirestore,
} from "@/lib/firestore";

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [funnel, setFunnel] = useState<"bats" | "store">("store");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [image, setImage] = useState("");
  const [weight, setWeight] = useState("");
  const [edge, setEdge] = useState("");
  const [grains, setGrains] = useState("");
  const [willowGrade, setWillowGrade] = useState("");
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  const isHandpicked = funnel === "bats";

  const fetchProducts = async () => {
    try {
      const data = await getProductsFromFirestore();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategoriesFromFirestore();
      const active = data.filter((c: any) => c.status === "active");
      setCategories(active);
      if (active.length > 0 && !category) {
        setCategory(active[0].name);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const resetForm = () => {
    const funnelCategories = categories.filter((c: any) => (c.funnel || "store") === "store");
    setFunnel("store");
    setEditingId(null);
    setName("");
    setCategory(funnelCategories.length > 0 ? funnelCategories[0].name : "");
    setBasePrice("");
    setImage("");
    setWeight("");
    setEdge("");
    setGrains("");
    setWillowGrade("");
    setSpecs([{ key: "", value: "" }]);
  };

  const handleEdit = (product: any) => {
    const productFunnel = product.funnel || "store";
    setFunnel(productFunnel);
    setEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setBasePrice(product.basePrice.toString());
    setImage(product.image || "");
    setWeight(product.weight || "");
    setEdge(product.edge || "");
    setGrains(product.grains || "");
    setWillowGrade(product.willowGrade || "");
    if (product.specifications && product.specifications.length > 0) {
      setSpecs(
        product.specifications.map((s: any) => ({
          key: s.key,
          value: s.value,
        }))
      );
    } else {
      setSpecs([{ key: "", value: "" }]);
    }
    setIsOpen(true);
  };

  const handleAddSpec = () => setSpecs([...specs, { key: "", value: "" }]);

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload a product image.");
      return;
    }
    setLoading(true);
    try {
      const validSpecs = specs.filter(
        (s) => s.key.trim() !== "" && s.value.trim() !== ""
      );
      
      const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const payload: any = {
        name,
        category,
        categorySlug,
        funnel,
        basePrice: parseFloat(basePrice),
        image,
        specifications: validSpecs,
      };

      if (isHandpicked) {
        if (weight) payload.weight = weight;
        if (edge) payload.edge = edge;
        if (grains) payload.grains = grains;
        if (willowGrade) payload.willowGrade = willowGrade;
      }

      if (editingId) {
        await updateProductInFirestore(editingId, payload);
        toast.success("Product updated successfully!");
      } else {
        await addProductToFirestore(payload);
        toast.success("Product added successfully!");
      }

      setIsOpen(false);
      fetchProducts();
      resetForm();
      
      // Trigger storefront cache bust
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: ['products'] })
      }).catch(console.error);

    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProductFromFirestore(id);
      fetchProducts();
      toast.success("Product deleted successfully!");
      
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: ['products'] })
      }).catch(console.error);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting the product.");
    }
  };

  const handleMigrateCategories = async () => {
    if (!confirm("Are you sure you want to migrate all legacy categories? This will update all products without a valid categorySlug.")) return;
    setLoading(true);
    try {
      let count = 0;
      for (const p of products) {
        if (!p.categorySlug) {
          const generatedSlug = p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          await updateProductInFirestore(p.id, { categorySlug: generatedSlug });
          count++;
        }
      }
      toast.success(`Migration complete! Patched ${count} legacy products.`);
      fetchProducts();
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: ['products'] })
      }).catch(console.error);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during migration.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">
            Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your product catalog and stock.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMigrateCategories}
            disabled={loading}
            className="text-xs tracking-wider"
          >
            Migrate Legacy Categories
          </Button>
          <Dialog
            open={isOpen}
            onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="neon"
              size="sm"
              onClick={resetForm}
              className="uppercase tracking-widest text-xs"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-charcoal">
                {editingId ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Product Name
                  </label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Phantom Pro"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Funnel
                  </label>
                  <Select 
                    value={funnel} 
                    onValueChange={(val: "bats" | "store") => {
                      setFunnel(val);
                      const fCats = categories.filter((c: any) => (c.funnel || "store") === val);
                      setCategory(fCats.length > 0 ? fCats[0].name : "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select funnel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="store">Gear Store</SelectItem>
                      <SelectItem value="bats">Handpicked Bats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c: any) => (c.funnel || "store") === funnel)
                        .map((c: any) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Base Price
                  </label>
                  <Input
                    required
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="e.g. 5000"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-slate-700">
                    Product Image
                  </label>
                  <ImageUpload value={image} onChange={setImage} />
                </div>
              </div>

              {isHandpicked && (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-charcoal mb-4">Handpicked Reserve Specs</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-700">Weight</label>
                      <Input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 1140g" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-700">Edge</label>
                      <Input value={edge} onChange={(e) => setEdge(e.target.value)} placeholder="e.g. 40mm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-700">Grains</label>
                      <Input value={grains} onChange={(e) => setGrains(e.target.value)} placeholder="e.g. 10 Straight Grains" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-700">Willow Grade</label>
                      <Input value={willowGrade} onChange={(e) => setWillowGrade(e.target.value)} placeholder="e.g. Grade 1 Pro" />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold text-charcoal">
                    Specifications
                  </label>
                  <Button
                    type="button"
                    onClick={handleAddSpec}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    + Add Spec
                  </Button>
                </div>
                {specs.map((spec, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <Input
                      placeholder="Key (e.g. Weight)"
                      value={spec.key}
                      onChange={(e) =>
                        handleSpecChange(i, "key", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value (e.g. 1150g)"
                      value={spec.value}
                      onChange={(e) =>
                        handleSpecChange(i, "value", e.target.value)
                      }
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(i)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                disabled={loading}
                type="submit"
                className="w-full bg-charcoal text-white font-bold mt-6"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Save Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-serif text-charcoal">
              All Products
            </CardTitle>
            <div className="relative">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-64 bg-slate-50 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Pencil className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500 font-medium">
                No products found
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Add your first product to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="font-semibold text-slate-600">
                    Product
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Funnel
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Category
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Price
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Specs
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover border border-slate-200"
                        />
                        <span className="font-medium text-charcoal">
                          {p.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="uppercase text-[10px]">{p.funnel || "store"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{p.basePrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {p.specifications?.length || 0} specs
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(p)}
                          className="text-slate-500 hover:text-charcoal h-8 w-8 p-0"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-500 hover:text-red-500 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete <strong>{p.name}</strong> from your inventory.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
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

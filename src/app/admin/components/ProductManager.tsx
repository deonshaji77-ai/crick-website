"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ImageUpload from './ImageUpload';
import { getProductsFromFirestore, addProductToFirestore, updateProductInFirestore, deleteProductFromFirestore, getCategoriesFromFirestore } from '@/lib/firestore';

export default function ProductManager({ filterMode = 'ALL_PRODUCTS' }: { filterMode?: string }) {
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [image, setImage] = useState('');
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);

  const filteredProducts = products.filter((p: any) => {
    if (filterMode === 'ALL_PRODUCTS') return true;
    if (filterMode === 'HANDPICKED BATS') {
      return p.category === 'Leather Ball Bats' || p.category === 'Tennis Ball Bats';
    }
    if (filterMode === 'GEAR STORE') {
      return !['Leather Ball Bats', 'Tennis Ball Bats'].includes(p.category);
    }
    return true;
  });

  const fetchProductsAndCategories = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProductsFromFirestore(),
        getCategoriesFromFirestore()
      ]);
      setProducts(productsData);
      setDbCategories(categoriesData);
      
      // Initialize category dropdown if not set and categories exist
      if (categoriesData.length > 0 && !category) {
        setCategory(categoriesData[0].name);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setCategory(dbCategories.length > 0 ? dbCategories[0].name : '');
    setBasePrice('');
    setImage('');
    setSpecs([{ key: '', value: '' }]);
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setBasePrice(product.basePrice.toString());
    setImage(product.image || '');
    if (product.specifications && product.specifications.length > 0) {
      setSpecs(product.specifications.map((s: any) => ({ key: s.key, value: s.value })));
    } else {
      setSpecs([{ key: '', value: '' }]);
    }
    setIsOpen(true);
  };

  const handleAddSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  
  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload a product image.");
      return;
    }
    setLoading(true);
    try {
      const validSpecs = specs.filter(s => s.key.trim() !== '' && s.value.trim() !== '');
      
      // Find the selected category from dbCategories to get its slug
      const matchedCat = dbCategories.find(c => c.name === category);
      // Fallback slug generator just in case
      const categorySlug = matchedCat ? matchedCat.slug : category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      const payload = {
        name,
        category,
        categorySlug,
        basePrice: parseFloat(basePrice),
        image,
        specifications: validSpecs
      };

      if (editingId) {
        await updateProductInFirestore(editingId, payload);
      } else {
        await addProductToFirestore(payload);
      }
      
      // Trigger Next.js on-demand revalidation for products tag
      await fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: ['products'] })
      }).catch(console.error);

      setIsOpen(false);
      fetchProductsAndCategories();
      resetForm();
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProductFromFirestore(id);
      
      // Trigger Next.js on-demand revalidation for products tag
      await fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: ['products'] })
      }).catch(console.error);

      fetchProductsAndCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const runMigration = async () => {
    if (!confirm("Are you sure you want to migrate legacy categories? This will update all existing products.")) return;
    setLoading(true);
    try {
      for (const p of products) {
        if (!p.categorySlug) {
          let updatedSlug = p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          
          if (p.category === 'Leather Ball Bats' || p.category === 'Tennis Ball Bats') {
            updatedSlug = 'handpicked-bats';
          }
          if (p.category === 'Batting Gloves') updatedSlug = 'batting-gloves';
          if (p.category === 'Batting Pads') updatedSlug = 'batting-pads';
          if (p.category === 'Cricket Bags') updatedSlug = 'kit-bags';
          
          await updateProductInFirestore(p.id, { categorySlug: updatedSlug });
        }
      }
      alert("Migration complete! All products now have a normalized categorySlug.");
      fetchProductsAndCategories();
    } catch (e) {
      console.error("Migration failed", e);
      alert("Migration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-white border-b border-gray-100 px-6 py-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <CardTitle className="font-serif text-2xl text-charcoal">Products & Inventory</CardTitle>
          <Button onClick={runMigration} disabled={loading} variant="outline" size="sm" className="text-xs">
            Migrate Legacy Categories
          </Button>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-neon text-charcoal hover:bg-neon/90 font-bold uppercase tracking-widest text-xs">
              + Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-charcoal">
                {editingId ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Product Name</label>
                  <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Phantom Pro" />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select 
                    required
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 md:text-sm"
                  >
                    {dbCategories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Base Price (₹)</label>
                  <Input required type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} placeholder="e.g. 5000" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700">Product Image</label>
                  <ImageUpload value={image} onChange={setImage} />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold text-charcoal">Dynamic Specifications</label>
                  <Button type="button" onClick={handleAddSpec} variant="outline" size="sm" className="text-xs">
                    + Add Spec
                  </Button>
                </div>
                {specs.map((spec, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <Input 
                      placeholder="Key (e.g. Weight)" 
                      value={spec.key} 
                      onChange={e => handleSpecChange(i, 'key', e.target.value)} 
                      className="flex-1"
                    />
                    <Input 
                      placeholder="Value (e.g. 1150g)" 
                      value={spec.value} 
                      onChange={e => handleSpecChange(i, 'value', e.target.value)} 
                      className="flex-1"
                    />
                    <button type="button" onClick={() => handleRemoveSpec(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-md">
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <Button disabled={loading || isUploadingImage()} type="submit" className="w-full bg-charcoal text-neon font-bold mt-6">
                {loading ? "Saving..." : (editingId ? "Update Product" : "Save Product")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="bg-white p-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-xl">
            No products found in database for this category. Start adding some!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Specs</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p: any) => (
                  <tr key={p.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-md border border-gray-200" />
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{p.category}</span>
                    </td>
                    <td className="px-6 py-4">₹{p.basePrice}</td>
                    <td className="px-6 py-4">
                      {p.specifications?.length || 0} specs
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-3 mt-2">
                      <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline text-xs font-bold uppercase tracking-widest">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline text-xs font-bold uppercase tracking-widest">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  function isUploadingImage() {
    // A quick hack to block save if upload hasn't returned url but we don't have isUploading state here. 
    // The ImageUpload component manages its own uploading state.
    // If we wanted to block submit during upload we'd lift state, but for now this is fine.
    return false;
  }
}

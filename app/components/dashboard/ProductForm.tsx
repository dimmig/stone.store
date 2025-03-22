import { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  productId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductForm({ productId, onClose, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    images: [''],
    sizes: [''],
    colors: [''],
    inStock: true,
  });

  useEffect(() => {
    fetchCategories();
    if (productId && productId !== 'new') {
      fetchProduct();
    }
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
      if (data.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchProduct = async () => {
    setInitialLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const product = await response.json();
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        categoryId: product.categoryId,
        images: product.images.length > 0 ? product.images : [''],
        sizes: product.sizes.length > 0 ? product.sizes : [''],
        colors: product.colors.length > 0 ? product.colors : [''],
        inStock: product.inStock,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = productId === 'new' ? 'POST' : 'PUT';
      const url = productId === 'new' ? '/api/products' : `/api/products/${productId}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          images: formData.images.filter(Boolean),
          sizes: formData.sizes.filter(Boolean),
          colors: formData.colors.filter(Boolean),
        }),
      });

      if (!response.ok) throw new Error('Failed to save product');

      toast.success(productId === 'new' ? 'Product created successfully' : 'Product updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayInput = (
    field: 'images' | 'sizes' | 'colors',
    index: number,
    value: string
  ) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      
      // Add new empty field if this is the last one and it's not empty
      if (index === newArray.length - 1 && value) {
        newArray.push('');
      }
      
      // Remove empty fields except the last one
      const filtered = newArray.filter((item, i) => 
        item || i === newArray.length - 1
      );
      
      return { ...prev, [field]: filtered };
    });
  };

  const removeArrayItem = (field: 'images' | 'sizes' | 'colors', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1], // Custom spring-like easing
            opacity: { duration: 0.15 }
          }}
        >
          <DialogHeader className="px-6 py-4 border-b border-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.05 }}
            >
              <DialogTitle className="text-xl font-semibold">
                {productId === 'new' ? 'Add New Product' : 'Edit Product'}
              </DialogTitle>
            </motion.div>
          </DialogHeader>

          {initialLoading ? (
            <motion.div 
              className="flex flex-col items-center justify-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-8 w-8 text-gray-500 mb-4" />
              </motion.div>
              <motion.p 
                className="text-sm text-gray-500"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.1 }}
              >
                Loading product details...
              </motion.p>
            </motion.div>
          ) : (
            <motion.form 
              onSubmit={handleSubmit} 
              className="p-6 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.1 }}
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                    placeholder="Enter product name"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                    placeholder="Enter product description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images (URLs)
                  </label>
                  <div className="space-y-2">
                    {formData.images.map((url, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.15,
                          delay: index * 0.03,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        className="flex gap-2"
                      >
                        <div className="flex-1 flex gap-2">
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => handleArrayInput('images', index, e.target.value)}
                            placeholder="Image URL"
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                          />
                          {url && (
                            <div className="relative h-10 w-10 rounded-lg overflow-hidden">
                              <Image
                                src={url}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('images', index)}
                          className="p-2 text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </motion.div>
                    ))}
                    <motion.button
                      type="button"
                      onClick={() => handleArrayInput('images', formData.images.length, '')}
                      className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Plus className="h-4 w-4" />
                      Add Image
                    </motion.button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sizes
                  </label>
                  <div className="space-y-2">
                    {formData.sizes.map((size, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.15,
                          delay: index * 0.03,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={size}
                          onChange={(e) => handleArrayInput('sizes', index, e.target.value)}
                          placeholder="Size (e.g., S, M, L)"
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('sizes', index)}
                          className="p-2 text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </motion.div>
                    ))}
                    <motion.button
                      type="button"
                      onClick={() => handleArrayInput('sizes', formData.sizes.length, '')}
                      className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Plus className="h-4 w-4" />
                      Add Size
                    </motion.button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colors
                  </label>
                  <div className="space-y-2">
                    {formData.colors.map((color, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.15,
                          delay: index * 0.03,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => handleArrayInput('colors', index, e.target.value)}
                          placeholder="Color name"
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('colors', index)}
                          className="p-2 text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </motion.div>
                    ))}
                    <motion.button
                      type="button"
                      onClick={() => handleArrayInput('colors', formData.colors.length, '')}
                      className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Plus className="h-4 w-4" />
                      Add Color
                    </motion.button>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                      className="rounded border-gray-300 text-black focus:ring-black transition-colors"
                    />
                    <span className="text-sm font-medium text-gray-700">In Stock</span>
                  </label>
                </div>
              </div>

              <DialogFooter className="px-6 py-4 border-t border-gray-100">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg shadow-sm transition-all duration-200 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800 hover:shadow-md'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                >
                  {loading ? 'Saving...' : productId === 'new' ? 'Create Product' : 'Save Changes'}
                </motion.button>
              </DialogFooter>
            </motion.form>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
} 
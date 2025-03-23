
import React, {useState, useEffect} from 'react';
import {Plus, Trash2, Loader2, Minus} from 'lucide-react';
import {toast} from 'sonner';
import {motion, AnimatePresence} from 'framer-motion';
import ImageUpload from '@/app/components/ui/image-upload';
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

interface FormData {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  sizes: string[];
  colors: string[];
  stockQuantity: string;
  images: File[];
  currentImageUrls: string[];
  currentImageFilenames: string[];
}

interface ProductFormProps {
  productId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductForm({productId, onClose, onSuccess}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    sizes: [],
    colors: [],
    stockQuantity: '',
    images: [],
    currentImageUrls: [],
    currentImageFilenames: [],
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      sizes: [],
      colors: [],
      stockQuantity: '',
      images: [],
      currentImageUrls: [],
      currentImageFilenames: [],
    });
  };

  useEffect(() => {
    fetchCategories();
    if (productId === 'new') {
      resetForm();
    } else {
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
        setFormData(prev => ({...prev, categoryId: data[0].id}));
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
        sizes: product.sizes,
        colors: product.colors,
        stockQuantity: product.stockQuantity.toString(),
        images: [],
        currentImageUrls: product.imageUrls || [],
        currentImageFilenames: product.imageFilenames || [],
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

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('categoryId', formData.categoryId);
    formDataToSend.append('sizes', formData.sizes.join(','));
    formDataToSend.append('colors', formData.colors.join(','));
    formDataToSend.append('stockQuantity', formData.stockQuantity);
    formDataToSend.append('currentImageUrls', JSON.stringify(formData.currentImageUrls));
    formDataToSend.append('currentImageFilenames', JSON.stringify(formData.currentImageFilenames));

    formData.images.forEach((image) => {
      formDataToSend.append('images', image);
    });

    try {
      const url = productId === 'new' ? '/api/products' : `/api/products/${productId}`;
      const method = productId === 'new' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save product');
      }

      toast.success(`Product ${productId === 'new' ? 'created' : 'updated'} successfully`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayInput = (
      field: 'sizes' | 'colors',
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

      return {...prev, [field]: filtered};
    });
  };

  const removeArrayItem = (field: 'sizes' | 'colors', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addArrayItem = (field: 'sizes' | 'colors') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-0">
          <motion.div
              initial={{opacity: 0, scale: 0.98}}
              animate={{opacity: 1, scale: 1}}
              transition={{
                duration: 0.2,
                ease: [0.16, 1, 0.3, 1],
                opacity: {duration: 0.15}
              }}
          >
            <DialogHeader className="px-6 py-4 border-b border-gray-100">
              <motion.div
                  initial={{opacity: 0, y: 5}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.15, delay: 0.05}}
              >
                <DialogTitle className="text-xl font-semibold">
                  {productId === 'new' ? 'Add New Product' : 'Edit Product'}
                </DialogTitle>
              </motion.div>
            </DialogHeader>

            {initialLoading ? (
                <motion.div
                    className="flex flex-col items-center justify-center py-12"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.15}}
                >
                  <motion.div
                      animate={{rotate: 360}}
                      transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                  >
                    <Loader2 className="h-8 w-8 text-gray-500 mb-4"/>
                  </motion.div>
                  <motion.p
                      className="text-sm text-gray-500"
                      initial={{opacity: 0, y: 5}}
                      animate={{opacity: 1, y: 0}}
                      transition={{duration: 0.15, delay: 0.1}}
                  >
                    Loading product details...
                  </motion.p>
                </motion.div>
            ) : (
                <motion.form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-6"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.15, delay: 0.1}}
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
                          onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
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
                          onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                          placeholder="Enter product description"
                          rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                      </label>
                      <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                          placeholder="Enter price"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <Select
                          value={formData.categoryId}
                          onValueChange={(value) => setFormData(prev => ({...prev, categoryId: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category"/>
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
                        Product Images
                      </label>
                      <ImageUpload
                          onImageSelect={(files: File[]) => setFormData(prev => ({
                            ...prev,
                            images: [...prev.images, ...files]
                          }))}
                          onImageRemove={(index: number) => {
                            setFormData(prev => ({
                              ...prev,
                              currentImageUrls: prev.currentImageUrls.filter((_, i) => i !== index),
                              currentImageFilenames: prev.currentImageFilenames.filter((_, i) => i !== index),
                              images: prev.images.filter((_, i) => i !== index)
                            }));
                          }}
                          currentImageUrls={formData.currentImageUrls}
                          uploadedImages={formData.images}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sizes
                      </label>
                      <div className="space-y-2">
                        {formData.sizes.map((size, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                  type="text"
                                  value={size}
                                  onChange={(e) => handleArrayInput('sizes', index, e.target.value)}
                                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                  placeholder="Enter size"
                              />
                              <button
                                  type="button"
                                  onClick={() => addArrayItem('sizes')}
                                  className="p-2 text-gray-500 hover:text-black transition-colors"
                              >
                                <Plus />
                              </button>
                              <button
                                  type="button"
                                  onClick={() => removeArrayItem('sizes', index)}
                                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="h-4 w-4"/>
                              </button>
                            </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Colors
                      </label>
                      <div className="space-y-2">
                        {formData.colors.map((color, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                  type="text"
                                  value={color}
                                  onChange={(e) => handleArrayInput('colors', index, e.target.value)}
                                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                  placeholder="Enter color"
                              />
                              <button
                                  type="button"
                                  onClick={() => addArrayItem('colors')}
                                  className="p-2 text-gray-500 hover:text-black transition-colors"
                              >
                                <Plus/>
                              </button>
                              <button
                                  type="button"
                                  onClick={() => removeArrayItem('colors', index)}
                                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="h-4 w-4"/>
                              </button>
                            </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Quantity
                      </label>
                      <input
                          type="number"
                          required
                          min="0"
                          value={formData.stockQuantity}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            stockQuantity: e.target.value
                          }))}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                          placeholder="Enter stock quantity"
                      />
                    </div>
                  </div>

                  <DialogFooter className="px-6 py-4 border-t border-gray-100">
                    <div className="flex justify-end gap-3">
                      <button
                          type="button"
                          onClick={onClose}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin"/>
                              Saving...
                            </div>
                        ) : (
                            'Save Product'
                        )}
                      </button>
                    </div>
                  </DialogFooter>
                </motion.form>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>
  );
} 
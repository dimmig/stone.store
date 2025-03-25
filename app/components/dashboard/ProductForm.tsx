import React, {useState, useEffect, useRef} from 'react';
import {Plus, Trash2, Loader2, Minus, Pipette} from 'lucide-react';
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
  colorImageMapping: { [key: string]: number };
}

interface ProductFormProps {
  productId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface MagnifierPosition {
  x: number;
  y: number;
}

interface ColorMapping {
  [key: string]: number;
}

interface NestedColorMapping {
  set: ColorMapping;
}

type ColorMappingType = ColorMapping | NestedColorMapping;

// Add type for EyeDropper
declare global {
  interface Window {
    EyeDropper?: {
      new(): {
        open: () => Promise<{ sRGBHex: string }>;
      };
    };
  }
}

// Add validation function for color mapping
const validateColorMapping = (mapping: ColorMappingType, colors: string[], imageCount: number): boolean => {
  // Check if all colors have a valid mapping
  const validColors = colors.filter(color => color.trim() !== '');
  
  // Handle nested structure
  const actualMapping = 'set' in mapping ? mapping.set : mapping;
  
  // Only validate that image indices are valid numbers within range
  const hasInvalidIndex = Object.values(actualMapping).some(index => {
    const isValid = typeof index === 'number' && index >= 0 && index < imageCount;
    if (!isValid) {
      console.log('Invalid image index:', { index, imageCount });
    }
    return !isValid;
  });
  
  return !hasInvalidIndex;
};

// Add helper function to update color mapping
const updateColorMapping = (
  currentMapping: ColorMappingType,
  color: string,
  imageIndex: number,
  totalImages: number
): ColorMapping => {
  // Handle nested structure
  const actualMapping = 'set' in currentMapping ? currentMapping.set : currentMapping;
  
  // Create new mapping object
  const newMapping: ColorMapping = {};
  
  // Copy only mappings that don't point to the current image index
  Object.entries(actualMapping).forEach(([existingColor, mappedIndex]) => {
    if (typeof mappedIndex === 'number' && mappedIndex !== imageIndex) {
      newMapping[existingColor] = mappedIndex;
    }
  });
  
  // Add the new color mapping
  newMapping[color] = imageIndex;
  
  return newMapping;
};

// Add helper function to check if an image exists
const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking image:', error);
    return false;
  }
};

export default function ProductForm({productId, onClose, onSuccess}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isColorPickerActive, setIsColorPickerActive] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    sizes: [''],
    colors: [''],
    stockQuantity: '',
    images: [],
    currentImageUrls: [],
    currentImageFilenames: [],
    colorImageMapping: {},
  });
  const [magnifierPosition, setMagnifierPosition] = useState<MagnifierPosition | null>(null);
  const [magnifierColor, setMagnifierColor] = useState<string | null>(null);
  const magnifierSize = 100; // Size of the magnifier preview
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Create canvas once and reuse it
  useEffect(() => {
    canvasRef.current = document.createElement('canvas');
  }, []);

  const getColorFromImage = (img: HTMLImageElement, x: number, y: number) => {
    if (!canvasRef.current || !img.complete) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    const pixelX = Math.floor(x * scaleX);
    const pixelY = Math.floor(y * scaleY);

    // Ensure coordinates are within bounds
    if (pixelX < 0 || pixelX >= img.naturalWidth || pixelY < 0 || pixelY >= img.naturalHeight) return null;

    try {
      // Set canvas size to match the image's natural dimensions
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Clear the canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the image at its natural size
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

      // Get the pixel data at the clicked position
      const pixelData = ctx.getImageData(pixelX, pixelY, 1, 1).data;
      
      // Ensure we have valid pixel data
      if (pixelData.length < 3) return null;

      // Convert RGB values to hex
      const r = pixelData[0].toString(16).padStart(2, '0');
      const g = pixelData[1].toString(16).padStart(2, '0');
      const b = pixelData[2].toString(16).padStart(2, '0');
      
      return `#${r}${g}${b}`;
    } catch (error) {
      console.error('Error getting color from image:', error);
      return null;
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      sizes: [''],
      colors: [''],
      stockQuantity: '',
      images: [],
      currentImageUrls: [],
      currentImageFilenames: [],
      colorImageMapping: {},
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

      // Handle nested color mapping structure
      const colorMapping = product.colorImageMapping?.set || product.colorImageMapping || {};

      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        categoryId: product.categoryId,
        sizes: product.sizes?.length > 0 ? product.sizes : [''],
        colors: product.colors?.length > 0 ? product.colors : [''],
        stockQuantity: product.stockQuantity.toString(),
        images: [],
        currentImageUrls: product.imageUrls || [],
        currentImageFilenames: product.imageFilenames || [],
        colorImageMapping: colorMapping,
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

    // Filter out empty values from sizes and colors arrays
    const validSizes = formData.sizes.filter(size => size.trim() !== '');
    const validColors = formData.colors.filter(color => color.trim() !== '');

    if (validSizes.length === 0 || validColors.length === 0) {
      toast.error('Please add at least one size and one color');
      setLoading(false);
      return;
    }

    // Validate color mapping before submission
    const totalImages = formData.currentImageUrls.length + formData.images.length;
    if (!validateColorMapping(formData.colorImageMapping, validColors, totalImages)) {
      toast.error('Invalid color mapping. Please ensure all colors are properly mapped to images.');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('categoryId', formData.categoryId);
    formDataToSend.append('sizes', validSizes.join(','));
    formDataToSend.append('colors', validColors.join(','));
    formDataToSend.append('stockQuantity', formData.stockQuantity);
    formDataToSend.append('currentImageUrls', JSON.stringify(formData.currentImageUrls));
    formDataToSend.append('currentImageFilenames', JSON.stringify(formData.currentImageFilenames));
    
    // Ensure color mapping is not nested before sending
    const flatColorMapping = 'set' in formData.colorImageMapping ? formData.colorImageMapping.set : formData.colorImageMapping;
    formDataToSend.append('colorImageMapping', JSON.stringify(flatColorMapping));

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

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>, index: number) => {
    if (!isColorPickerActive || activeColorIndex === null || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const color = getColorFromImage(imageRef.current, x, y);
    if (color) {
      const newColors = [...formData.colors];
      newColors[activeColorIndex] = color;
      
      // Only count existing images
      const existingImages = formData.currentImageUrls.filter(url => url && url.trim() !== '');
      const totalImages = existingImages.length + formData.images.length;
      
      const newMapping = updateColorMapping(formData.colorImageMapping, color, index, totalImages);
      
      // Validate the new mapping
      if (!validateColorMapping(newMapping, newColors, totalImages)) {
        toast.error('Invalid color mapping. Please ensure the image exists and try again.');
        return;
      }
      
      setFormData(prev => ({ 
        ...prev, 
        colors: newColors,
        colorImageMapping: newMapping
      }));
    }

    setIsColorPickerActive(false);
    setActiveColorIndex(null);
  };

  const handleColorPickerClick = async (index: number) => {
    try {
      if (!window.EyeDropper) {
        toast.error('Your browser does not support the color picker');
        return;
      }

      if (selectedImageIndex === null) {
        toast.error('Please select an image first');
        return;
      }

      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      const newColor = result.sRGBHex;

      // Update colors array
      const newColors = [...formData.colors];
      newColors[index] = newColor;

      // Only count existing images
      const existingImages = formData.currentImageUrls.filter(url => url && url.trim() !== '');
      const totalImages = existingImages.length + formData.images.length;
      
      const newMapping = updateColorMapping(formData.colorImageMapping, newColor, selectedImageIndex, totalImages);

      // Validate the new mapping
      if (!validateColorMapping(newMapping, newColors, totalImages)) {
        toast.error('Invalid color mapping. Please ensure the image exists and try again.');
        return;
      }

      // Update form data
      setFormData(prev => ({
        ...prev,
        colors: newColors,
        colorImageMapping: newMapping
      }));

      // Reset selected image index
      setSelectedImageIndex(null);
    } catch (error) {
      console.error('Error using color picker:', error);
    }
  };

  return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
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
                  <div className="grid grid-cols-2 gap-8">
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
                        ref={imageRef}
                        onImageSelect={(files: File[]) => setFormData(prev => ({
                          ...prev,
                          images: [...prev.images, ...files]
                        }))}
                        onImageRemove={(index: number) => {
                          setFormData(prev => {
                            const currentImageCount = prev.currentImageUrls.filter(url => url && url.trim() !== '').length;
                            
                            if (index < currentImageCount) {
                              // Removing an existing image
                              const newImageUrls = prev.currentImageUrls.filter((_, i) => i !== index);
                              const newImageFilenames = prev.currentImageFilenames.filter((_, i) => i !== index);
                              
                              // Remove color mappings for the deleted image and adjust indices
                              const newMapping = Object.fromEntries(
                                Object.entries(prev.colorImageMapping)
                                  .filter(([_, mappedIndex]) => mappedIndex !== index) // Remove mappings for deleted image
                                  .map(([color, mappedIndex]) => {
                                    if (mappedIndex > index) {
                                      // Decrease indices for images after the deleted one
                                      return [color, mappedIndex - 1];
                                    }
                                    return [color, mappedIndex];
                                  })
                              );

                              // Remove colors that were mapped to the deleted image
                              const newColors = prev.colors.filter((_, colorIndex) => {
                                const mappedIndex = Object.values(newMapping).findIndex(index => index === colorIndex);
                                return mappedIndex !== -1;
                              });

                              // Ensure we always have at least one color input
                              if (newColors.length === 0) {
                                newColors.push('');
                              }

                              return {
                                ...prev,
                                currentImageUrls: newImageUrls,
                                currentImageFilenames: newImageFilenames,
                                colorImageMapping: newMapping,
                                colors: newColors
                              };
                            } else {
                              // Removing a newly uploaded image
                              const uploadedIndex = index - currentImageCount;
                              const newImages = prev.images.filter((_, i) => i !== uploadedIndex);
                              
                              // Remove color mappings for the deleted image and adjust indices
                              const newMapping = Object.fromEntries(
                                Object.entries(prev.colorImageMapping)
                                  .filter(([_, mappedIndex]) => mappedIndex !== index) // Remove mappings for deleted image
                                  .map(([color, mappedIndex]) => {
                                    if (mappedIndex > index) {
                                      // Decrease indices for images after the deleted one
                                      return [color, mappedIndex - 1];
                                    }
                                    return [color, mappedIndex];
                                  })
                              );

                              // Remove colors that were mapped to the deleted image
                              const newColors = prev.colors.filter((_, colorIndex) => {
                                const mappedIndex = Object.values(newMapping).findIndex(index => index === colorIndex);
                                return mappedIndex !== -1;
                              });

                              // Ensure we always have at least one color input
                              if (newColors.length === 0) {
                                newColors.push('');
                              }

                              return {
                                ...prev,
                                images: newImages,
                                colorImageMapping: newMapping,
                                colors: newColors
                              };
                            }
                          });
                        }}
                        currentImageUrls={formData.currentImageUrls}
                        uploadedImages={formData.images}
                        onImageClick={(e: React.MouseEvent<HTMLImageElement>, index: number) => {
                          setSelectedImageIndex(index);
                          handleImageClick(e, index);
                        }}
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
                              <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => handleArrayInput('colors', index, e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                    placeholder="Enter color"
                                />
                                <div
                                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                                    style={{ backgroundColor: color }}
                                    title="Color preview"
                                />
                              </div>
                              <div className="relative group">
                                <button
                                    type="button"
                                    onClick={() => handleColorPickerClick(index)}
                                    className={`p-2 rounded-lg transition-colors ${
                                        selectedImageIndex === null
                                            ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                            : 'text-gray-500 hover:text-black hover:bg-gray-50'
                                    }`}
                                    title={selectedImageIndex === null ? "Select an image first to pick a color" : "Pick color from image"}
                                    disabled={selectedImageIndex === null}
                                >
                                    <Pipette className="h-4 w-4" />
                                </button>
                                {selectedImageIndex === null && (
                                    <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        Select an image first to pick a color
                                    </div>
                                )}
                              </div>
                              <button
                                  type="button"
                                  onClick={() => addArrayItem('colors')}
                                  className="p-2 text-gray-500 hover:text-black transition-colors"
                              >
                                <Plus />
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

        {/* Magnifier Preview */}
        {isColorPickerActive && magnifierPosition && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: magnifierPosition.x,
              top: magnifierPosition.y,
              width: magnifierSize,
              height: magnifierSize,
              border: '2px solid #000',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            }}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundColor: magnifierColor || '#fff',
                opacity: 0.8,
              }}
            />
          </div>
        )}
      </Dialog>
  );
} 
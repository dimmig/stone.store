'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, Plus, X, Upload, Image as ImageIcon, Edit2, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/app/components/ui/confirm-dialog';
import ImageUpload from '@/app/components/ui/image-upload';

interface Collection {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  products: Product[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    image: null as File | null,
    productIds: [] as string[],
  });
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [currentImageUrls, setCurrentImageUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchCollections();
    fetchProducts();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setAvailableProducts(data?.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setNewCollection({ ...newCollection, image: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
  };

  const handleImageSelect = (files: File[]) => {
    if (files.length > 0) {
      setUploadedImages([files[0]]);
      setCurrentImageUrls([]);
    }
  };

  const handleImageRemove = (index: number) => {
    if (index < currentImageUrls.length) {
      setCurrentImageUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      setUploadedImages([]);
    }
  };

  const handleCreateCollection = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newCollection.name);
      formData.append('description', newCollection.description);
      if (newCollection.image) {
        formData.append('image', newCollection.image);
      }
      formData.append('productIds', JSON.stringify(newCollection.productIds));

      const response = await fetch('/api/categories', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to create collection');

      const data = await response.json();
      setCollections([data, ...collections]);
      setIsCreateModalOpen(false);
      setNewCollection({ name: '', description: '', image: null, productIds: [] });
      setImagePreview(null);
      toast.success('Collection created successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create collection');
    }
  };

  const handleEditCollection = async () => {
    if (!editingCollection) return;

    try {
      const formData = new FormData();
      formData.append('id', editingCollection.id);
      formData.append('name', newCollection.name);
      formData.append('description', newCollection.description);
      if (newCollection.image) {
        formData.append('image', newCollection.image);
      }
      formData.append('productIds', JSON.stringify(newCollection.productIds));

      const response = await fetch('/api/categories', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update collection');

      const data = await response.json();
      setCollections(collections.map(c => c.id === data.id ? data : c));
      setIsEditModalOpen(false);
      setEditingCollection(null);
      setNewCollection({ name: '', description: '', image: null, productIds: [] });
      setImagePreview(null);
      toast.success('Collection updated successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update collection');
    }
  };

  const handleDeleteCollection = async (collection: Collection) => {
    setCollectionToDelete(collection);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCollection = async () => {
    if (!collectionToDelete) return;

    try {
      const response = await fetch(`/api/categories?id=${collectionToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete collection');

      setCollections(collections.filter(c => c.id !== collectionToDelete.id));
      toast.success('Collection deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete collection');
    }
  };

  const resetForm = () => {
    setNewCollection({
      name: '',
      description: '',
      image: null,
      productIds: [],
    });
    setImagePreview(null);
    setEditingCollection(null);
    setUploadedImages([]);
    setCurrentImageUrls([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    resetForm();
  };

  const openEditModal = (collection: Collection) => {
    setEditingCollection(collection);
    setNewCollection({
      name: collection.name,
      description: collection.description || '',
      image: null,
      productIds: collection.products.map(p => p.id),
    });
    setCurrentImageUrls(collection.image ? [collection.image] : []);
    setUploadedImages([]);
    setIsEditModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (editingCollection) {
      formData.append('id', editingCollection.id);
      if (uploadedImages.length > 0) {
        formData.append('shouldReplaceImage', 'true');
      }
    }
    formData.append('name', newCollection.name);
    formData.append('description', newCollection.description);
    formData.append('productIds', JSON.stringify(newCollection.productIds));
    
    if (!(editingCollection && uploadedImages.length > 0)) {
      formData.append('currentImageUrls', JSON.stringify(currentImageUrls));
    }
    
    if (uploadedImages.length > 0) {
      formData.append('images', uploadedImages[0]);
    }

    try {
      const url = editingCollection
        ? `/api/categories?id=${editingCollection.id}`
        : '/api/categories';
      const method = editingCollection ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save collection');
      }

      toast.success(`Collection ${editingCollection ? 'updated' : 'created'} successfully`);
      fetchCollections();
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving collection:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save collection');
    } finally {
      setLoading(false);
    }
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold text-gray-900"
              >
                Collections
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-2 text-gray-500"
              >
                Explore our curated collections of premium clothing and accessories
              </motion.p>
            </div>
            {session?.user?.role === 'ADMIN' && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create Collection
              </motion.button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="relative mb-8"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collections..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </motion.div>

        {/* Collections Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCollections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group relative"
            >
              <Link href={`/collections/${collection.id}`}>
                <div className="relative h-48">
                  {collection.image ? (
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{collection.name}</h3>
                  {collection.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{collection.description}</p>
                  )}
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>{collection.products.length} products</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Link>
              {session?.user?.role === 'ADMIN' && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openEditModal(collection);
                    }}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                    title="Edit collection"
                  >
                    <Edit2 className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteCollection(collection);
                    }}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                    title="Delete collection"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Create Collection Modal */}
        <AnimatePresence>
          {isCreateModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Collection</h2>
                  <button
                    onClick={handleCloseCreateModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newCollection.name}
                      onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Collection name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newCollection.description}
                      onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      rows={3}
                      placeholder="Collection description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Collection Image
                    </label>
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      onImageRemove={handleImageRemove}
                      currentImageUrls={currentImageUrls}
                      uploadedImages={uploadedImages}
                      maxFiles={1}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Products
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4">
                      {availableProducts?.map((product) => (
                        <label key={product.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newCollection.productIds.includes(product.id)}
                            onChange={(e) => {
                              const newProductIds = e.target.checked
                                ? [...newCollection.productIds, product.id]
                                : newCollection.productIds.filter(id => id !== product.id);
                              setNewCollection({ ...newCollection, productIds: newProductIds });
                            }}
                            className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                          />
                          <span className="text-sm text-gray-700">{product.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={handleCloseCreateModal}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!newCollection.name}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Collection
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Collection Modal */}
        <AnimatePresence>
          {isEditModalOpen && editingCollection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Collection</h2>
                  <button
                    onClick={handleCloseEditModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newCollection.name}
                      onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Collection name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newCollection.description}
                      onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      rows={3}
                      placeholder="Collection description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Collection Image
                    </label>
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      onImageRemove={handleImageRemove}
                      currentImageUrls={currentImageUrls}
                      uploadedImages={uploadedImages}
                      maxFiles={1}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Products
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4">
                      {availableProducts.map((product) => (
                        <label key={product.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newCollection.productIds.includes(product.id)}
                            onChange={(e) => {
                              const newProductIds = e.target.checked
                                ? [...newCollection.productIds, product.id]
                                : newCollection.productIds.filter(id => id !== product.id);
                              setNewCollection({ ...newCollection, productIds: newProductIds });
                            }}
                            className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                          />
                          <span className="text-sm text-gray-700">{product.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={handleCloseEditModal}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!newCollection.name}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update Collection
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Collection"
          description={`Are you sure you want to delete "${collectionToDelete?.name}"? This action cannot be undone.`}
          onConfirm={confirmDeleteCollection}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </motion.div>
  );
} 
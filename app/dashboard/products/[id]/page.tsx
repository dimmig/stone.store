'use client';

import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {ArrowLeft, Loader2} from 'lucide-react';
import {toast} from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrls: string[];
    categoryId: string;
    category: {
        name: string;
    };
    sizes: string[];
    colors: string[];
    stockQuantity: number;
    createdAt: string;
}

export default function ProductPage({params}: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetchProduct();
    }, [params.id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${params.id}`);
            if (!response.ok) throw new Error('Failed to fetch product');
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center gap-4"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <Loader2 className="h-8 w-8 text-gray-500"/>
                    </motion.div>
                    <p className="text-sm text-gray-500">Loading product details...</p>
                </motion.div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
                    <Link
                        href="/dashboard/products"
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                        <ArrowLeft className="h-4 w-4"/>
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <Link
                    href="/dashboard/products"
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4"
                >
                    <ArrowLeft className="h-4 w-4"/>
                    Back to Products
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        {product.imageUrls[selectedImage] && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src={product.imageUrls[selectedImage]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    onLoadingComplete={() => setImageLoading(false)}
                                    priority
                                />
                                {imageLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 flex items-center justify-center bg-gray-100"
                                    >
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Loader2 className="h-8 w-8 text-gray-400"/>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {product.imageUrls.map((image, index) => (
                            <motion.button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`relative aspect-square rounded-lg overflow-hidden ${
                                    selectedImage === index ? 'ring-2 ring-black' : ''
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Image
                                    src={image}
                                    alt={`${product.name} ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                        <p className="text-gray-600">{product.description}</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Category</h2>
                        <p className="text-gray-600">{product.category.name}</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Price</h2>
                        <p className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Stock Status</h2>
                        <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                            product.stockQuantity > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {product.stockQuantity > 0 ? `${product.stockQuantity} in Stock` : 'Out of Stock'}
                        </span>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Available Sizes</h2>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size) => (
                                <span
                                    key={size}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                >
                                    {size}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Available Colors</h2>
                        <div className="flex flex-wrap gap-2">
                            {product.colors.map((color) => (
                                <span
                                    key={color}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                >
                                    {color}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
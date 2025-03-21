'use client';

import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import {motion} from 'framer-motion';
import {Heart, Minus, Plus, ShoppingBag, ChevronRight, Star, Check, Ban} from 'lucide-react';
import {useCart} from '@/app/providers/CartProvider';
import {useWishlist} from '@/app/providers/WishlistProvider';
import {Product} from '@/types';

interface ProductPageProps {
    params: { id: string };
}

const fadeIn = {
    initial: {opacity: 0, y: 20},
    animate: {opacity: 1, y: 0},
    exit: {opacity: 0, y: 10}
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ProductPage({params}: ProductPageProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    const {addToCart} = useCart();
    const {addToWishlist, removeFromWishlist, isInWishlist} = useWishlist();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/products/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await response.json();
                setProduct(data);
                setSelectedSize(data.sizes?.[0] || '');
                setSelectedColor(data.colors?.[0] || '');

                const relatedResponse = await fetch(`/api/products?category=${data.categoryId}&limit=4`);
                if (relatedResponse.ok) {
                    const relatedData = await relatedResponse.json();
                    setRelatedProducts(relatedData.filter((p: Product) => p.id !== data.id).slice(0, 4));
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-accent-gold"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-gray-900">Error</h1>
                <p className="text-gray-500 mt-2">{error || 'Product not found'}</p>
            </div>
        );
    }

    const handleQuantityChange = (value: number) => {
        setQuantity(Math.max(1, Math.min(10, value)));
    };

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert('Please select size and color');
            return;
        }
        addToCart(product, quantity, selectedSize, selectedColor);
    };

    const handleToggleWishlist = () => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            className="min-h-[calc(100vh-4rem)] bg-gray-50/50 px-4 py-6 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-7xl">
                {/* Breadcrumb */}
                <motion.nav
                    variants={fadeIn}
                    className="mb-6 flex items-center space-x-2 text-sm text-gray-500"
                >
                    <a href="/store" className="hover:text-gray-900">Store</a>
                    <ChevronRight className="h-4 w-4"/>
                    <span className="text-gray-900">{product?.name}</span>
                </motion.nav>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Image Gallery */}
                    <motion.div
                        variants={fadeIn}
                        className="overflow-hidden rounded-3xl bg-white p-6 shadow-sm"
                    >
                        <motion.div
                            initial={{scale: 0.95, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{duration: 0.5}}
                            className="aspect-[4/5] overflow-hidden rounded-2xl bg-gray-50"
                        >
                            <Image
                                src={product.images[activeImage]}
                                alt={product.name}
                                width={800}
                                height={1000}
                                className="h-full w-full object-cover object-center"
                                priority
                            />
                        </motion.div>
                        <motion.div
                            variants={staggerContainer}
                            className="mt-6 grid grid-cols-4 gap-4"
                        >
                            {product.images.map((image, index) => (
                                <motion.button
                                    key={image}
                                    variants={fadeIn}
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                    onClick={() => setActiveImage(index)}
                                    className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all hover:opacity-75 ${
                                        activeImage === index ? 'border-black' : 'border-transparent'
                                    }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${product.name} - View ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </motion.button>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Main Info Card */}
                        <motion.div
                            variants={fadeIn}
                            className="overflow-hidden rounded-3xl bg-white p-6 shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <motion.h1
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        className="text-2xl font-semibold text-gray-900"
                                    >
                                        {product.name}
                                    </motion.h1>
                                    <motion.div
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{delay: 0.2}}
                                        className="mt-2 flex items-center gap-2"
                                    >
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400"/>
                                            <span className="text-sm font-medium text-gray-900">4.8</span>
                                        </div>
                                        <span className="text-sm text-gray-500">·</span>
                                        <span className="text-sm text-gray-500">42 reviews</span>
                                    </motion.div>
                                </div>
                                <motion.div
                                    initial={{opacity: 0, x: 20}}
                                    animate={{opacity: 1, x: 0}}
                                    className="text-right"
                                >
                                    <p className="text-2xl font-semibold text-gray-900">${product.price}</p>
                                    {product.discount > 0 && (
                                        <p className="text-sm text-gray-500 line-through">
                                            ${Math.round(product.price * (1 + product.discount / 100))}
                                        </p>
                                    )}
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: 0.3}}
                                className="mt-6"
                            >
                                <p className="text-sm leading-relaxed text-gray-500">{product.description}</p>
                            </motion.div>
                        </motion.div>

                        {/* Options Card */}
                        <motion.div
                            variants={fadeIn}
                            className="overflow-hidden rounded-3xl bg-white p-6 shadow-sm"
                        >
                            {/* Size Selector */}
                            <motion.div variants={staggerContainer} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                                    <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                        Size guide
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {product.sizes.map((size) => (
                                        <motion.button
                                            key={size}
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 0.95}}
                                            onClick={() => setSelectedSize(size)}
                                            className={`flex h-11 items-center justify-center rounded-xl border text-sm font-medium uppercase transition-all hover:border-black ${
                                                selectedSize === size
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-200 text-gray-900'
                                            }`}
                                        >
                                            {size}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div variants={staggerContainer} className="mt-6 space-y-4">
                                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                                <div className="grid grid-cols-4 gap-3">
                                    {product.colors.map((color) => (
                                        <motion.button
                                            key={color}
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                            onClick={() => setSelectedColor(color)}
                                            className={`group relative h-12 w-full overflow-hidden rounded-xl ring-offset-2 transition-all duration-200 hover:shadow-lg ${
                                                selectedColor === color
                                                    ? 'ring-2 ring-black ring-offset-2'
                                                    : 'ring-1 ring-gray-200'
                                            }`}
                                        >
                                            <div
                                                className="absolute inset-0 transition-opacity"
                                                style={{backgroundColor: color.toLowerCase()}}
                                            />
                                            {selectedColor === color && (
                                                <motion.div
                                                    initial={{opacity: 0, scale: 0.5}}
                                                    animate={{opacity: 1, scale: 1}}
                                                    className="absolute inset-0 flex items-center justify-center"
                                                >
                                                    <div className="rounded-full bg-white p-1 shadow-sm">
                                                        <Check className="h-3 w-3 text-black"/>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Quantity Selector */}
                            <motion.div
                                variants={fadeIn}
                                className="mt-6 space-y-4"
                            >
                                <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                                <div className="flex items-center space-x-3">
                                    <motion.button
                                        whileHover={{scale: 1.1}}
                                        whileTap={{scale: 0.9}}
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition-colors hover:border-black"
                                    >
                                        <Minus className="h-5 w-5"/>
                                    </motion.button>
                                    <motion.input
                                        whileFocus={{scale: 1.05}}
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                                        className="h-11 w-20 rounded-xl border border-gray-200 px-3 text-center text-base focus:border-black focus:outline-none focus:ring-0"
                                    />
                                    <motion.button
                                        whileHover={{scale: 1.1}}
                                        whileTap={{scale: 0.9}}
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition-colors hover:border-black"
                                    >
                                        <Plus className="h-5 w-5"/>
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                variants={fadeIn}
                                className="mt-8 flex gap-4"
                            >
                                <motion.button
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock}
                                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-black px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:bg-white disabled:text-black disabled:border-2 disabled:pointer-events-none"
                                >
                                    <>
                                        {product.inStock ? (
                                            <>
                                                <ShoppingBag className="h-5 w-5"/>
                                                Add to Cart
                                            </>
                                        ) : (
                                            <>
                                                <Ban className="h-5 w-5"/>
                                                Unavailable
                                            </>
                                        )}
                                    </>
                                </motion.button>
                                <motion.button
                                    whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.9}}
                                    onClick={handleToggleWishlist}
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-colors ${
                                        isInWishlist(product.id)
                                            ? 'border-red-200 bg-red-50 text-red-500'
                                            : 'border-gray-200 text-gray-600 hover:border-black'
                                    }`}
                                >
                                    <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`}/>
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <motion.div
                        variants={fadeIn}
                        className="mt-12"
                    >
                        <h2 className="mb-6 text-xl font-semibold text-gray-900">Related Products</h2>
                        <motion.div
                            variants={staggerContainer}
                            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                        >
                            {relatedProducts.map((relatedProduct, index) => (
                                <motion.a
                                    key={relatedProduct.id}
                                    variants={fadeIn}
                                    initial="initial"
                                    animate="animate"
                                    transition={{delay: index * 0.1}}
                                    href={`/products/${relatedProduct.id}`}
                                    className="group overflow-hidden rounded-3xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
                                >
                                    <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gray-50">
                                        <Image
                                            src={relatedProduct.images[0]}
                                            alt={relatedProduct.name}
                                            width={500}
                                            height={600}
                                            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-sm font-medium text-gray-900">{relatedProduct.name}</h3>
                                        <div className="mt-1 flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900">${relatedProduct.price}</p>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400"/>
                                                <span className="text-sm text-gray-600">4.8</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
} 
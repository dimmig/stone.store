'use client';

import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import {motion} from 'framer-motion';
import {Heart, Minus, Plus, ShoppingBag, ChevronRight, Star, Check, Ban, Loader2} from 'lucide-react';
import {useCart} from '@/app/providers/CartProvider';
import {useWishlist} from '@/app/providers/WishlistProvider';
import {Product} from '@/types';
import {useSession} from 'next-auth/react';
import {toast} from 'sonner';
import { useUserStore } from '@/store/user-store';

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
    const [imageLoading, setImageLoading] = useState(true);
    const [mainImageLoaded, setMainImageLoaded] = useState(false);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [colorImages, setColorImages] = useState<{[key: string]: number}>({});

    const {addToCart} = useCart();
    const {addToWishlist, removeFromWishlist, isInWishlist, items} = useWishlist();

    const [activeTab, setActiveTab] = useState('details');
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewLoading, setReviewLoading] = useState(true);

    const {data: session} = useSession();
    const {user} = useUserStore()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newReview, setNewReview] = useState({rating: 5, comment: ''});
    const [userReview, setUserReview] = useState<any>(null);
    const [isReviewed, setIsReviewed] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    useEffect(() => {
       if (reviews) {
        reviews?.forEach((review: any) => {
            if (review.userId === user?.id) {
                setIsReviewed(true);
            }
        });
       }
    }, [reviews]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/products/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await response.json();
                console.log('Product data:', data);
                
                // Handle nested 'set' objects in the mapping
                let mapping = data.colorImageMapping;
                while (mapping?.set && typeof mapping.set === 'object') {
                    mapping = mapping.set;
                }
                console.log('Processed color mapping:', mapping);
                
                setProduct({
                    ...data,
                    colorImageMapping: mapping
                });
                setSelectedSize(data.sizes?.[0] || '');
                setSelectedColor(data.colors?.[0] || '');

                // Set initial active image based on the first color's mapping
                if (mapping && data.colors?.[0] && typeof mapping[data.colors[0]] === 'number') {
                    setActiveImage(mapping[data.colors[0]]);
                }

                // Preload all product images
                if (data.imageUrls) {
                    data.imageUrls.forEach((url: string) => {
                        const img = document.createElement('img');
                        img.src = url;
                    });
                }

                const relatedResponse = await fetch(`/api/products?category=${data.categoryId}&limit=4`);
                if (relatedResponse.ok) {
                    const relatedData = await relatedResponse.json();
                    const filteredProducts = relatedData.products?.filter((p: Product) => p.id !== data.id).slice(0, 4);
                    setRelatedProducts(filteredProducts);
                    
                    // Preload related product images
                    filteredProducts.forEach((product: Product) => {
                        if (product.imageUrls?.[0]) {
                            const img = document.createElement('img');
                            img.src = product.imageUrls[0];
                        }
                    });
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
                setImageLoading(false);
            }
        };

        fetchProduct();
    }, [params.id]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/products/${params.id}/reviews`);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                    // Find user's review if logged in
                    if (session?.user) {
                        const userReview = data.find((review: any) => review.userId === session.user.id);
                        setUserReview(userReview);
                    }
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setReviewLoading(false);
            }
        };

        fetchReviews();
    }, [params.id, session?.user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
                    <p className="text-sm text-gray-500">Loading product...</p>
                </div>
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
            toast.error('Please select size and color');
            return;
        }
        if (!product) return;

        if (product.stockQuantity < quantity) {
            toast.error(`Only ${product.stockQuantity} items available in stock`);
            return;
        }

        setIsAddingToCart(true);
        addToCart(product, quantity, selectedSize, selectedColor)
            .catch((error) => {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error('Failed to add to cart');
                }
            })
            .finally(() => {
                setIsAddingToCart(false);
            });
    };

    const handleToggleWishlist = () => {
        if (isInWishlist(product.id)) {
            const wishlistItem = items.find(item => item.productId === product.id);
            if (wishlistItem) {
                removeFromWishlist(wishlistItem.id);
            }
        } else {
            addToWishlist(product);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            toast.error('Please sign in to leave a review');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/products/${params.id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newReview),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to submit review');
            }

            const review = await response.json();
            setReviews(prev => [review, ...prev]);
            setUserReview(review);
            setNewReview({rating: 5, comment: ''});
            toast.success('Review submitted successfully');
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!session) return;

        try {
            const response = await fetch(`/api/products/${params.id}/reviews/${reviewId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete review');
            }

            setReviews(prev => prev.filter(review => review.id !== reviewId));
            setUserReview(null);
            toast.success('Review deleted successfully');
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to delete review');
        }
    };

    const handleColorSelect = (color: string) => {
        console.log('Selected color:', color);
        console.log('Raw color mapping:', product?.colorImageMapping);
        
        setSelectedColor(color);
        if (product?.colorImageMapping) {
            // Handle nested 'set' objects in the mapping
            let mapping = product.colorImageMapping;
            while (mapping?.set && typeof mapping.set === 'object') {
                mapping = mapping.set;
            }
            
            console.log('Processed color mapping:', mapping);
            if (mapping && typeof mapping[color] === 'number') {
                setImageLoading(true);
                setActiveImage(mapping[color]);
                setTimeout(() => {
                    setImageLoading(false);
                }, 300);
            }
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
                            className="aspect-[4/5] overflow-hidden rounded-2xl bg-gray-50 relative"
                        >
                            {imageLoading && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
                                    </div>
                                </div>
                            )}
                            <Image
                                key={`${activeImage}-${selectedColor}`}
                                src={product.imageUrls[activeImage]}
                                alt={`${product.name} - ${selectedColor}`}
                                width={800}
                                height={1000}
                                quality={85}
                                priority={true}
                                className={`h-full w-full object-cover object-center transition-all duration-300 ${imageLoading ? 'scale-105 blur-sm' : 'scale-100 blur-0'}`}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                                onLoadingComplete={() => setImageLoading(false)}
                            />
                        </motion.div>

                        {/* Thumbnail Gallery */}
                        <motion.div
                            variants={staggerContainer}
                            className="mt-6 grid grid-cols-4 gap-4"
                        >
                            {product.imageUrls.map((image: string, index: number) => (
                                <motion.button
                                    key={index}
                                    onClick={() => {
                                        setImageLoading(true);
                                        setActiveImage(index);
                                        // Find and set the color that maps to this image
                                        const colorForImage = Object.entries(product.colorImageMapping || {}).find(
                                            ([_, imgIndex]) => imgIndex === index
                                        )?.[0];
                                        if (colorForImage) {
                                            setSelectedColor(colorForImage);
                                        }
                                    }}
                                    className={`relative aspect-square overflow-hidden rounded-lg ${
                                        activeImage === index ? 'ring-2 ring-black' : ''
                                    }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${product.name} - Image ${index + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 25vw, 10vw"
                                        quality={60}
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
                                            <span className="text-sm font-medium text-gray-900">{product.rating.toFixed(1)}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">·</span>
                                        <span className="text-sm text-gray-500">{reviews.length} reviews</span>
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
                                <p className="text-sm leading-relaxed text-gray-500 whitespace-pre-wrap">{product.description}</p>
                            </motion.div>
                        </motion.div>

                        {/* Stock Status */}
                        <motion.div
                            variants={fadeIn}
                            className="mt-4"
                        >
                            <div className="flex items-center gap-2">
                                {product.stockQuantity > 0 ? (
                                    <>
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                                        <span className="text-sm text-gray-600">
                                            {product.stockQuantity} items available in stock
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                                        <span className="text-sm text-gray-600">Out of stock</span>
                                    </>
                                )}
                            </div>
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
                                    <button 
                                        onClick={() => setIsSizeGuideOpen(true)}
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                                    >
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

                            {/* Color Selection */}
                            <div className="mt-6 space-y-4">
                                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => handleColorSelect(color)}
                                            className={`relative h-12 w-20 rounded-xl transition-all ${
                                                selectedColor === color
                                                    ? 'ring-2 ring-black ring-offset-2'
                                                    : 'ring-1 ring-gray-200'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        >
                                            <span className="sr-only">{color}</span>
                                            {selectedColor === color && (
                                                <span className="absolute inset-0 flex items-center justify-center">
                                                    <Check className="h-4 w-4 text-white" />
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

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
                                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition-colors hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-5 w-5"/>
                                    </motion.button>
                                    <motion.input
                                        whileFocus={{scale: 1.05}}
                                        type="number"
                                        min="1"
                                        max={product.stockQuantity}
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                                        className="h-11 w-20 rounded-xl border border-gray-200 px-3 text-center text-base focus:border-black focus:outline-none focus:ring-0"
                                    />
                                    <motion.button
                                        whileHover={{scale: 1.1}}
                                        whileTap={{scale: 0.9}}
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition-colors hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={quantity >= product.stockQuantity}
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
                                    disabled={product.stockQuantity <= 0 || isAddingToCart}
                                    className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-black px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:bg-white disabled:text-black disabled:border-2 disabled:pointer-events-none ${
                                        isAddingToCart ? 'cursor-not-allowed opacity-50' : ''
                                    }`}
                                >
                                    <>
                                        {product.stockQuantity > 0 ? (
                                            isAddingToCart ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingBag className="h-5 w-5"/>
                                                    Add to Cart
                                                </>
                                            )
                                        ) : (
                                            <>
                                                <Ban className="h-5 w-5"/>
                                                Out of Stock
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

                {/* Tabs */}
                <div className="mt-12 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {['details', 'reviews', 'shipping'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${
                                    activeTab === tab
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium capitalize`}
                            >
                                {tab.replace('-', ' ')}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-8">
                    {/* Product Details Tab */}
                    {activeTab === 'details' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Material</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{product.material || 'Premium cotton blend'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Care Instructions</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{product.careInstructions || 'Machine wash cold'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Origin</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{product.origin || 'Made in Portugal'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">SKU</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{product.id}</dd>
                                        </div>
                                    </dl>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Care Instructions</h3>
                                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                                        <li>Machine wash cold</li>
                                        <li>Do not bleach</li>
                                        <li>Tumble dry low</li>
                                        <li>Iron on medium heat</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
                                    <div className="mt-1 flex items-center gap-2">
                                        <div className="flex items-center">
                                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400"/>
                                            <span className="ml-1 text-sm font-medium text-gray-900">{product.rating.toFixed(1)}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">·</span>
                                        <span className="text-sm text-gray-500">{reviews.length} reviews</span>
                                    </div>
                                </div>
                            </div>

                            {/* Review Form */}
                            {(session && !userReview && !isReviewed) && (
                                <motion.form
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onSubmit={handleSubmitReview}
                                    className="rounded-2xl bg-white p-6 shadow-sm"
                                >
                                    <h4 className="text-sm font-medium text-gray-900">Write a Review</h4>
                                    <div className="mt-4">
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                                    className="focus:outline-none"
                                                >
                                                    <Star
                                                        className={`h-6 w-6 ${
                                                            star <= newReview.rating
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'fill-gray-200 text-gray-200'
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                            <textarea
                                                value={newReview.comment}
                                                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                            placeholder="Share your thoughts about this product..."
                                            className="mt-4 w-full rounded-xl border border-gray-200 p-4 text-sm focus:border-black focus:outline-none focus:ring-0"
                                            rows={4}
                                            required
                                        />
                                        
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="rounded-xl bg-black px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.form>
                            )}

                            {/* User's Review */}
                            {session && userReview && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-2xl bg-white p-6 shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-gray-900">Your Review</h4>
                                        <button
                                            onClick={() => handleDeleteReview(userReview.id)}
                                            className="text-sm text-red-500 hover:text-red-600"
                                        >
                                            Delete Review
                                        </button>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-5 w-5 ${
                                                        star <= userReview.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'fill-gray-200 text-gray-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600">{userReview.comment}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Reviews List */}
                            {reviewLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {reviews
                                        .filter(review => !userReview || review.id !== userReview.id)
                                        .map((review) => (
                                            <div key={review.id} className="rounded-2xl bg-white p-6 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-4 w-4 ${
                                                                        i < review.rating
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'fill-gray-200 text-gray-200'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">{review.user.name}</span>
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Shipping Tab */}
                    {activeTab === 'shipping' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Shipping Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Standard Shipping</h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Free shipping on orders over $50. Delivery within 3-5 business days.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Express Shipping</h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Available for an additional fee. Delivery within 1-2 business days.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">International Shipping</h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Available to most countries. Shipping costs and delivery times vary by location.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Returns & Exchanges</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">30-Day Returns</h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                We offer a 30-day return window for all unused items in their original packaging.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Free Returns</h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Returns are free with our prepaid shipping label.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Exchange Policy</h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                We offer free exchanges for size or color changes within 30 days of purchase.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            <div className="mt-16">
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
                                    <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gray-50 relative">
                                        {imageLoading && (
                                            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                                        )}
                                        <Image
                                            src={relatedProduct.imageUrls[0]}
                                            alt={relatedProduct.name}
                                            width={500}
                                            height={600}
                                            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            placeholder="blur"
                                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qQEBALkE6Oz5DRVlLT01RW2NhYGBtcW1+f5Hh4f/2wBDARUXFyAcIHxISHz4qIyk+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                            onLoadingComplete={() => setImageLoading(false)}
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

            {/* Size Guide Modal */}
            {isSizeGuideOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <button
                            onClick={() => setIsSizeGuideOpen(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-lg font-semibold text-gray-900">Size Guide</h3>
                        
                        <div className="mt-4">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chest (in)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waist (in)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hip (in)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {[
                                            { size: 'XS', chest: '32-34', waist: '26-28', hip: '35-37' },
                                            { size: 'S', chest: '34-36', waist: '28-30', hip: '37-39' },
                                            { size: 'M', chest: '36-38', waist: '30-32', hip: '39-41' },
                                            { size: 'L', chest: '38-40', waist: '32-34', hip: '41-43' },
                                            { size: 'XL', chest: '40-42', waist: '34-36', hip: '43-45' },
                                            { size: '2XL', chest: '42-44', waist: '36-38', hip: '45-47' },
                                        ].map((row) => (
                                            <tr key={row.size}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.size}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.chest}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.waist}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.hip}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 space-y-4">
                                <h4 className="text-sm font-medium text-gray-900">How to Measure</h4>
                                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                                    <li>Chest: Measure around the fullest part of your chest, keeping the tape horizontal.</li>
                                    <li>Waist: Measure around your natural waistline, keeping the tape comfortably loose.</li>
                                    <li>Hip: Measure around the fullest part of your hips, keeping the tape horizontal.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setIsSizeGuideOpen(false)}
                                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
} 
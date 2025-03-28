'use client';

import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Heart, ShoppingBag, Search, Filter, X, Star, Pin, PinOff, Check, ChevronDown, ChevronUp, Loader2, ChevronLeft, ChevronRight, Eye, Clock, Trash2} from 'lucide-react';
import {useCart} from '@/app/providers/CartProvider';
import {useWishlist} from '@/app/providers/WishlistProvider';
import {Product} from '@/types';
import {motion, AnimatePresence} from 'framer-motion';
import {useSession} from 'next-auth/react';
import {useRouter} from "next/navigation";
import moment from "moment"
import {useUserStore} from "@/store/user-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"

interface ProductFilters {
    category?: string;
    priceRange?: string;
    sortBy?: string;
    color?: string;
    size?: string;
    rating?: string;
    stockFilter?: string;
}

interface FilterOptions {
    categories: Array<{ label: string; value: string }>;
    colors: Array<{ label: string; value: string; class: string }>;
    sizes: string[];
    priceRanges: Array<{ label: string; value: string }>;
    ratingOptions: Array<{ label: string; value: string; count: number }>;
}

async function getProducts(searchQuery = '', filters: ProductFilters = {}, page = 1, limit = 12) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(filters.category && { category: filters.category }),
        ...(filters.priceRange && { priceRange: filters.priceRange }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.color && { color: filters.color }),
        ...(filters.size && { size: filters.size }),
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.stockFilter && { stockFilter: filters.stockFilter })
    });

    const response = await fetch(`/api/products?${params}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
}

export default function StorePage() {
    const {data: session, status} = useSession();
    const {user} = useUserStore()
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [loadingStates, setLoadingStates] = useState<{[key: string]: {cart?: boolean, wishlist?: boolean}}>({});
    const [filters, setFilters] = useState({
        category: '',
        priceRange: '',
        sortBy: 'newest',
        stockFilter: '',
        color: '',
        size: '',
        rating: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 12;
    const [totalProducts, setTotalProducts] = useState(0);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        categories: [],
        colors: [],
        sizes: [],
        priceRanges: [],
        ratingOptions: []
    });
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [isRecentlyViewedLoading, setIsRecentlyViewedLoading] = useState(true);
    const [isRecentlyViewedExpanded, setIsRecentlyViewedExpanded] = useState(false);
    const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

    const {addToCart} = useCart();
    const {addToWishlist, removeFromWishlist, isInWishlist, items} = useWishlist();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getProducts(
                    searchQuery,
                    {
                        category: filters.category,
                        priceRange: filters.priceRange,
                        sortBy: filters.sortBy,
                        color: filters.color,
                        size: filters.size,
                        rating: filters.rating,
                        stockFilter: filters.stockFilter
                    },
                    currentPage,
                    productsPerPage
                );

                if (data && data.products) {
                    setProducts(data.products);
                    setTotalProducts(data.total);
                    setTotalPages(data.totalPages);
                } else {
                    setProducts([]);
                    setTotalProducts(0);
                    setTotalPages(1);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
                setTotalProducts(0);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, searchQuery, filters, productsPerPage]);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await fetch('/api/filters');
                if (!response.ok) throw new Error('Failed to fetch filter options');
                const data = await response.json();
                setFilterOptions(data);
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };

        fetchFilterOptions();
    }, []);

    useEffect(() => {
        // Load recently viewed products from localStorage
        const viewed = localStorage.getItem('recentlyViewed');
        if (viewed) {
            setRecentlyViewed(JSON.parse(viewed));
        }
        setIsRecentlyViewedLoading(false);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        if (!session) {
            return router.push('auth/signin')
        }
        setLoadingStates(prev => ({...prev, [product.id]: {...prev[product.id], cart: true}}));
        try {
            await addToCart(product, 1, product.sizes[0], product.colors[0]);
        } finally {
            setLoadingStates(prev => ({...prev, [product.id]: {...prev[product.id], cart: false}}));
        }
    };

    const handleToggleWishlist = async (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        if (!session) {
            return router.push('auth/signin')
        }
        setLoadingStates(prev => ({...prev, [product.id]: {...prev[product.id], wishlist: true}}));
        try {
            if (isInWishlist(product.id)) {
                const wishlistItem = items.find(item => item.productId === product.id);
                if (wishlistItem) {
                    await removeFromWishlist(wishlistItem.id);
                }
            } else {
                await addToWishlist(product);
            }
        } finally {
            setLoadingStates(prev => ({...prev, [product.id]: {...prev[product.id], wishlist: false}}));
        }
    };

    const addToRecentlyViewed = (product: Product) => {
        setRecentlyViewed(prev => {
            const filtered = prev.filter(p => p.id !== product.id);
            const updated = [product, ...filtered].slice(0, 4);
            localStorage.setItem('recentlyViewed', JSON.stringify(updated));
            return updated;
        });
    };

    const sortOptions = [
        {label: 'Newest', value: 'newest'},
        {label: 'Price: Low to High', value: 'price-asc'},
        {label: 'Price: High to Low', value: 'price-desc'},
        {label: 'Most Popular', value: 'popular'},
        {label: 'Best Rating', value: 'rating-desc'}
    ];

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    <p className="mt-1 text-sm text-gray-500">Refine your results</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPinned(!isPinned)}
                        className="group rounded-full p-2 hover:bg-gray-100 transition-colors"
                        title={isPinned ? "Unpin filters" : "Pin filters"}
                    >
                        {isPinned ? (
                            <PinOff className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        ) : (
                            <Pin className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        )}
                    </button>
                    {!isPinned && (
                        <button
                            onClick={() => setShowFilters(false)}
                            className="group rounded-full p-2 hover:bg-gray-100 transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </button>
                    )}
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setFilters({...filters, category: ''})}
                        className={`flex items-center justify-center rounded-lg px-3 py-2.5 text-sm transition-all ${
                            !filters.category
                                ? 'bg-black text-white'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        All Categories
                    </button>
                    {filterOptions.categories.map((category) => (
                        <button
                            key={category.value}
                            onClick={() => setFilters({...filters, category: category.value})}
                            className={`flex items-center justify-center rounded-lg px-3 py-2.5 text-sm transition-all ${
                                filters.category === category.value
                                    ? 'bg-black text-white'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                    {filterOptions.priceRanges.map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setFilters({...filters, priceRange: range.value})}
                            className={`flex items-center justify-center rounded-lg px-3 py-2.5 text-sm transition-all ${
                                filters.priceRange === range.value
                                    ? 'bg-black text-white'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Colors</h3>
                <div className="flex flex-wrap gap-3">
                    {filterOptions.colors.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => setFilters({...filters, color: color.value})}
                            className={`group relative h-12 w-12 overflow-hidden rounded-xl ${color.class} ${
                                filters.color === color.value ? 'ring-2 ring-black ring-offset-2' : ''
                            } transition-all hover:scale-105`}
                            title={color.label}
                        >
                            {filters.color === color.value && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <Check className="h-5 w-5 text-white drop-shadow" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                    {filterOptions.sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setFilters({...filters, size})}
                            className={`relative h-11 w-11 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                                filters.size === size
                                    ? 'bg-black text-white'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rating */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Rating</h3>
                <div className="space-y-2">
                    {filterOptions.ratingOptions.map((rating) => (
                        <button
                            key={rating.value}
                            onClick={() => setFilters({...filters, rating: rating.value})}
                            className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm transition-all ${
                                filters.rating === rating.value
                                    ? 'bg-black text-white'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
              <span className="flex items-center gap-1.5">
                                {rating.label.split(' ')[0]}
                                <Star className={`h-4 w-4 ${
                                    filters.rating === rating.value ? 'fill-white text-white' : 'fill-yellow-400 text-yellow-400'
                                }`} />
                & up
              </span>
                            <span className={`text-xs ${
                                filters.rating === rating.value ? 'text-white/60' : 'text-gray-500'
                            }`}>
                                ({rating.count?.toFixed(1)})
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* In Stock Toggle */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Availability</h3>
                <label className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 px-4 py-3 hover:bg-gray-100">
                    <span className="text-sm text-gray-700">Show In-Stock Items Only</span>
                    <div className={`relative h-6 w-11 rounded-full transition-colors ${
                        filters.stockFilter === 'inStock' ? 'bg-black' : 'bg-gray-300'
                    }`}>
                        <div className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                            filters.stockFilter === 'inStock' ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={filters.stockFilter === 'inStock'}
                            onChange={(e) => setFilters({...filters, stockFilter: e.target.checked ? 'inStock' : ''})}
                        />
                    </div>
                </label>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 -mx-6 -mb-6 border-t border-gray-200 bg-white p-6 pt-4">
                <div className="flex gap-3">
                <button
                    onClick={() => setFilters({
                        category: '',
                        priceRange: '',
                        sortBy: 'newest',
                        stockFilter: '',
                        color: '',
                        size: '',
                        rating: ''
                    })}
                        className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                    Clear All
                </button>
                <button
                    onClick={() => setShowFilters(false)}
                        className="flex-1 rounded-xl bg-black py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                    Apply Filters
                </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Search and Filters Header */}
            <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1">
                            <input
                                type="search"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border-0 bg-gray-100 px-4 py-2.5 pl-10 text-sm ring-0 placeholder:text-gray-500 focus:border-0 focus:outline-none focus:ring-2 focus:ring-black/5"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500"/>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select
                                value={filters.sortBy}
                                onValueChange={(value: string) => setFilters({...filters, sortBy: value})}
                            >
                                <SelectTrigger className="w-[180px] bg-gray-100 border-0 focus:ring-2 focus:ring-black/5">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="clear">Clear sorting</SelectItem>
                                    {sortOptions.map((option) => (
                                        <SelectItem 
                                            key={option.value} 
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {!isPinned && (
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200"
                                >
                                    <Filter className="h-5 w-5"/>
                                    <span>Filters</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-6">
                {/* Recently Viewed Section - Redesigned */}
                {recentlyViewed.length > 0 && (
                    <div className="mb-8">
                        <button 
                            onClick={() => setIsRecentlyViewedExpanded(!isRecentlyViewedExpanded)}
                            className="flex w-full items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-black/5 p-2">
                                    <Clock className="h-5 w-5 text-gray-600" />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-lg font-medium text-gray-900">Recently Viewed</h2>
                                    <p className="text-sm text-gray-500">{recentlyViewed.length} items</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        localStorage.removeItem('recentlyViewed');
                                        setRecentlyViewed([]);
                                    }}
                                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Clear
                                </button>
                                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isRecentlyViewedExpanded ? 'rotate-180' : ''}`} />
                            </div>
                        </button>
                        
                        <AnimatePresence>
                            {isRecentlyViewedExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                        {recentlyViewed.map((product, index) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50"
                                            >
                                                <Link
                                                    href={`/products/${product.id}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setLoadingProductId(product.id);
                                                        addToRecentlyViewed(product);
                                                        router.push(`/products/${product.id}`);
                                                    }}
                                                    className={`block ${
                                                        loadingProductId === product.id ? 'cursor-wait pointer-events-none' : ''
                                                    }`}
                                                >
                                                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-50">
                                                        <div className={`absolute inset-0 bg-black/[0.03] transition-opacity duration-300 ${
                                                            loadingProductId === product.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                        }`} />
                                                        {loadingProductId === product.id && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[2px]">
                                                                <div className="rounded-lg bg-white/90 p-3">
                                                                    <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <Image
                                                            src={product.imageUrls[0]}
                                                            alt={product.name}
                                                            fill
                                                            className={`object-cover rounded-lg transition-all duration-500 ${
                                                                loadingProductId === product.id ? 'scale-[1.02] blur-[2px]' : 'group-hover:scale-[1.02]'
                                                            }`}
                                                        />
                                                        <div className="absolute right-3 top-3 flex gap-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    setQuickViewProduct(product);
                                                                    setIsQuickViewOpen(true);
                                                                }}
                                                                className="rounded-xl bg-white/90 p-2.5 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                            >
                                                                <Eye className="h-[18px] w-[18px]" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleToggleWishlist(e, product);
                                                                }}
                                                                className={`rounded-xl bg-white/90 p-2.5 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 ${
                                                                    isInWishlist(product.id)
                                                                        ? 'text-red-500 hover:bg-red-50'
                                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                                } ${loadingStates[product.id]?.wishlist ? 'cursor-not-allowed opacity-50' : ''}`}
                                                                disabled={loadingStates[product.id]?.wishlist}
                                                            >
                                                                {loadingStates[product.id]?.wishlist ? (
                                                                    <Loader2 className="h-[18px] w-[18px] animate-spin" />
                                                                ) : (
                                                                    <Heart className={`h-[18px] w-[18px] ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                                                                )}
                                                            </button>
                                                            {product.stockQuantity > 0 && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleAddToCart(e, product);
                                                                    }}
                                                                    className={`rounded-xl bg-white/90 p-2.5 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${loadingStates[product.id]?.cart ? 'cursor-not-allowed opacity-50' : ''}`}
                                                                    disabled={loadingStates[product.id]?.cart}
                                                                >
                                                                    {loadingStates[product.id]?.cart ? (
                                                                        <Loader2 className="h-[18px] w-[18px] animate-spin" />
                                                                    ) : (
                                                                        <ShoppingBag className="h-[18px] w-[18px]" />
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>
                                                        {product.discount > 0 && (
                                                            <div className="absolute left-3 top-3">
                                                                <div
                                                                    className="rounded-lg bg-black px-2 py-1 text-xs font-medium text-white">
                                                                    -{product.discount}%
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-5 space-y-2">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h3 className="flex-1 text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                                                            <div className="flex items-center gap-1">
                                                                <Star className="h-4 w-4 fill-current text-yellow-400"/>
                                                                <span className="text-xs font-medium text-gray-600">
                                                                    {product.rating || '4.5'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-x-2">
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    ${product.price}
                                                                </span>
                                                                {product.discount > 0 && (
                                                                    <span className="text-xs text-gray-500 line-through">
                                                                        ${Math.round(product.price * (1 + product.discount / 100))}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {product.stockQuantity > 0 ? (
                                                                <span className="text-xs font-medium text-green-600">In Stock</span>
                                                            ) : (
                                                                <span
                                                                    className="text-xs font-medium text-red-500">Out of Stock</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                <div className="flex gap-6">
                    {/* Pinned Filters Sidebar */}
                    {isPinned && (
                        <div className="w-72 shrink-0">
                            <div className="sticky top-20 rounded-2xl border border-gray-200/50 bg-white shadow-sm">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-gray-200/50 p-5">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                                        <p className="mt-1 text-sm text-gray-500">Refine your results</p>
                                    </div>
                                    <button
                                        onClick={() => setIsPinned(false)}
                                        className="group rounded-full p-2 hover:bg-gray-100 transition-colors"
                                        title="Unpin filters"
                                    >
                                        <PinOff className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                                    </button>
                                </div>

                                {/* Filter Content */}
                                <div className="p-5">
                                    {/* Categories */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setFilters({...filters, category: ''})}
                                                className={`flex items-center justify-center rounded-lg px-3 py-2.5 text-sm transition-all ${
                                                    !filters.category
                                                        ? 'bg-black text-white'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                All Categories
                                            </button>
                                            {filterOptions.categories.map((category) => (
                                                <button
                                                    key={category.value}
                                                    onClick={() => setFilters({...filters, category: category.value})}
                                                    className={`flex items-center justify-center rounded-lg px-3 py-2.5 text-sm transition-all ${
                                                        filters.category === category.value
                                                            ? 'bg-black text-white'
                                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {category.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Range */}
                                    <div className="mt-6 space-y-3">
                                        <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {filterOptions.priceRanges.map((range) => (
                                                <button
                                                    key={range.value}
                                                    onClick={() => setFilters({...filters, priceRange: range.value})}
                                                    className={`flex items-center justify-center rounded-lg px-3 py-2.5 text-sm transition-all ${
                                                        filters.priceRange === range.value
                                                            ? 'bg-black text-white'
                                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {range.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Colors */}
                                    <div className="mt-6 space-y-3">
                                        <h3 className="text-sm font-medium text-gray-900">Colors</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {filterOptions.colors.map((color) => (
                                                <button
                                                    key={color.value}
                                                    onClick={() => setFilters({...filters, color: color.value})}
                                                    className={`group relative h-12 w-12 overflow-hidden rounded-xl ${color.class} ${
                                                        filters.color === color.value ? 'ring-2 ring-black ring-offset-2' : ''
                                                    } transition-all hover:scale-105`}
                                                    title={color.label}
                                                >
                                                    {filters.color === color.value && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                            <Check className="h-5 w-5 text-white drop-shadow" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sizes */}
                                    <div className="mt-6 space-y-3">
                                        <h3 className="text-sm font-medium text-gray-900">Sizes</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {filterOptions.sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setFilters({...filters, size})}
                                                    className={`relative h-11 w-11 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                                                        filters.size === size
                                                            ? 'bg-black text-white'
                                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="mt-6 space-y-3">
                                        <h3 className="text-sm font-medium text-gray-900">Rating</h3>
                                        <div className="space-y-2">
                                            {filterOptions.ratingOptions.map((rating) => (
                                                <button
                                                    key={rating.value}
                                                    onClick={() => setFilters({...filters, rating: rating.value})}
                                                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm transition-all ${
                                                        filters.rating === rating.value
                                                            ? 'bg-black text-white'
                                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <span className="flex items-center gap-1.5">
                                                        {rating.label.split(' ')[0]}
                                                        <Star className={`h-4 w-4 ${
                                                            filters.rating === rating.value ? 'fill-white text-white' : 'fill-yellow-400 text-yellow-400'
                                                        }`} />
                                                        & up
                                                    </span>
                                                    <span className={`text-xs ${
                                                        filters.rating === rating.value ? 'text-white/60' : 'text-gray-500'
                                                    }`}>
                                                        ({rating.count?.toFixed(1)})
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* In Stock Toggle */}
                                    <div className="mt-6 space-y-3">
                                        <h3 className="text-sm font-medium text-gray-900">Availability</h3>
                                        <label className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 px-4 py-3 hover:bg-gray-100">
                                            <span className="text-sm text-gray-700">Show In-Stock Items Only</span>
                                            <div className={`relative h-6 w-11 rounded-full transition-colors ${
                                                filters.stockFilter === 'inStock' ? 'bg-black' : 'bg-gray-300'
                                            }`}>
                                                <div className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                                    filters.stockFilter === 'inStock' ? 'translate-x-5' : 'translate-x-0'
                                                }`} />
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={filters.stockFilter === 'inStock'}
                                                    onChange={(e) => setFilters({...filters, stockFilter: e.target.checked ? 'inStock' : ''})}
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 border-t border-gray-200/50 pt-4">
                                        <button
                                            onClick={() => setFilters({
                                                category: '',
                                                priceRange: '',
                                                sortBy: 'newest',
                                                stockFilter: '',
                                                color: '',
                                                size: '',
                                                rating: ''
                                            })}
                                            className="w-full rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="animate-pulse rounded-2xl bg-white p-5 shadow-sm">
                                        <div className="aspect-[4/5] rounded-xl bg-gray-100"/>
                                        <div className="mt-5 space-y-3">
                                            <div className="h-4 w-2/3 rounded-full bg-gray-100"/>
                                            <div className="flex items-center justify-between">
                                                <div className="h-4 w-1/4 rounded-full bg-gray-100"/>
                                                <div className="h-4 w-1/4 rounded-full bg-gray-100"/>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <p className="text-lg font-medium text-gray-900">No products found</p>
                                <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setFilters({
                                            category: '',
                                            priceRange: '',
                                            sortBy: 'newest',
                                            stockFilter: '',
                                            color: '',
                                            size: '',
                                            rating: ''
                                        });
                                        setCurrentPage(1);
                                    }}
                                    className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {products.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.id}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setLoadingProductId(product.id);
                                                addToRecentlyViewed(product);
                                                router.push(`/products/${product.id}`);
                                            }}
                                            className={`group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50 active:scale-[0.99] ${
                                                loadingProductId === product.id ? 'cursor-wait pointer-events-none' : ''
                                            }`}
                                        >
                                            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-50">
                                                <div className={`absolute inset-0 bg-black/[0.03] transition-opacity duration-300 ${
                                                    loadingProductId === product.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                }`} />
                                                {loadingProductId === product.id && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[2px]">
                                                        <div className="rounded-lg bg-white/90 p-3">
                                                            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
                                                        </div>
                                                    </div>
                                                )}
                                                <Image
                                                    src={product.imageUrls[0]}
                                                    alt={product.name}
                                                    fill
                                                    className={`object-cover rounded-lg transition-all duration-500 ${
                                                        loadingProductId === product.id ? 'scale-[1.02] blur-[2px]' : 'group-hover:scale-[1.02]'
                                                    }`}
                                                />
                                                <div className="absolute right-3 top-3 flex gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setQuickViewProduct(product);
                                                            setIsQuickViewOpen(true);
                                                        }}
                                                        className="rounded-xl bg-white/90 p-2.5 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                    >
                                                        <Eye className="h-[18px] w-[18px]" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleToggleWishlist(e, product);
                                                        }}
                                                        className={`rounded-xl bg-white/90 p-2.5 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 ${
                                                            isInWishlist(product.id)
                                                                ? 'text-red-500 hover:bg-red-50'
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                        } ${loadingStates[product.id]?.wishlist ? 'cursor-not-allowed opacity-50' : ''}`}
                                                        disabled={loadingStates[product.id]?.wishlist}
                                                    >
                                                        {loadingStates[product.id]?.wishlist ? (
                                                            <Loader2 className="h-[18px] w-[18px] animate-spin" />
                                                        ) : (
                                                            <Heart className={`h-[18px] w-[18px] ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                                                        )}
                                                    </button>
                                                    {product.stockQuantity > 0 && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleAddToCart(e, product);
                                                            }}
                                                            className={`rounded-xl bg-white/90 p-2.5 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${loadingStates[product.id]?.cart ? 'cursor-not-allowed opacity-50' : ''}`}
                                                            disabled={loadingStates[product.id]?.cart}
                                                        >
                                                            {loadingStates[product.id]?.cart ? (
                                                                <Loader2 className="h-[18px] w-[18px] animate-spin" />
                                                            ) : (
                                                                <ShoppingBag className="h-[18px] w-[18px]" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                                {product.discount > 0 && (
                                                    <div className="absolute left-3 top-3">
                                                        <div
                                                            className="rounded-lg bg-black px-2 py-1 text-xs font-medium text-white">
                                                            -{product.discount}%
                                                        </div>
                                                    </div>
                                                )}
                                                {moment(product.createdAt).isAfter(moment().subtract(1, 'weeks')) && (
                                                    <div className="absolute left-3 top-3">
                                                        <div
                                                            className="rounded-lg bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                                                            New
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-5 space-y-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="flex-1 text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-4 w-4 fill-current text-yellow-400"/>
                                                        <span className="text-xs font-medium text-gray-600">
                                                                    {product.rating || '4.5'}
                                                                </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="space-x-2">
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    ${product.price}
                                                                </span>
                                                        {product.discount > 0 && (
                                                            <span className="text-xs text-gray-500 line-through">
                                                            ${Math.round(product.price * (1 + product.discount / 100))}
                                                        </span>
                                                        )}
                                                    </div>
                                                    {product.stockQuantity > 0 ? (
                                                        <span className="text-xs font-medium text-green-600">In Stock</span>
                                                    ) : (
                                                        <span className="text-xs font-medium text-red-500">Out of Stock</span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4">
                                    <div className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{((currentPage - 1) * productsPerPage) + 1}</span> to <span className="font-medium">{Math.min(currentPage * productsPerPage, totalProducts)}</span> of{' '}
                                        <span className="font-medium">{totalProducts}</span> products
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                currentPage === 1
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                            whileHover={{ scale: currentPage === 1 ? 1 : 1.02 }}
                                            whileTap={{ scale: currentPage === 1 ? 1 : 0.98 }}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </motion.button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <motion.button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                        currentPage === page
                                                            ? 'bg-black text-white'
                                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                                    }`}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    {page}
                                                </motion.button>
                                            ))}
                                        </div>
                                        <motion.button
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                currentPage === totalPages
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                            whileHover={{ scale: currentPage === totalPages ? 1 : 1.02 }}
                                            whileTap={{ scale: currentPage === totalPages ? 1 : 0.98 }}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </motion.button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Drawer */}
            <AnimatePresence>
                {showFilters && !isPinned && (
                    <>
                        <motion.div
                            transition={{ duration: 0.2 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFilters(false)}
                            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white shadow-2xl"
                        >
                            <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 px-6 py-4 backdrop-blur-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                                        <p className="mt-1 text-sm text-gray-500">Refine your results</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setIsPinned(!isPinned)}
                                            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                            title={isPinned ? "Unpin filters" : "Pin filters"}
                                        >
                                            {isPinned ? <PinOff className="h-5 w-5" /> : <Pin className="h-5 w-5" />}
                                        </button>
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 px-6 py-6">
                                {/* Categories */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                                        {filters.category && (
                                            <button
                                                onClick={() => setFilters({...filters, category: ''})}
                                                className="text-xs text-gray-500 hover:text-gray-700"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setFilters({...filters, category: ''})}
                                            className={`flex items-center justify-center rounded-xl px-3 py-2.5 text-sm transition-all ${
                                                !filters.category
                                                    ? 'bg-black text-white shadow-sm'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            All Categories
                                        </button>
                                        {filterOptions.categories.map((category) => (
                                            <button
                                                key={category.value}
                                                onClick={() => setFilters({...filters, category: category.value})}
                                                className={`flex items-center justify-center rounded-xl px-3 py-2.5 text-sm transition-all ${
                                                    filters.category === category.value
                                                        ? 'bg-black text-white shadow-sm'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {category.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
                                        {filters.priceRange && (
                                            <button
                                                onClick={() => setFilters({...filters, priceRange: ''})}
                                                className="text-xs text-gray-500 hover:text-gray-700"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {filterOptions.priceRanges.map((range) => (
                                            <button
                                                key={range.value}
                                                onClick={() => setFilters({...filters, priceRange: range.value})}
                                                className={`flex items-center justify-center rounded-xl px-3 py-2.5 text-sm transition-all ${
                                                    filters.priceRange === range.value
                                                        ? 'bg-black text-white shadow-sm'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {range.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">Colors</h3>
                                        {filters.color && (
                                            <button
                                                onClick={() => setFilters({...filters, color: ''})}
                                                className="text-xs text-gray-500 hover:text-gray-700"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {filterOptions.colors.map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => setFilters({...filters, color: color.value})}
                                                className={`group relative h-12 w-12 overflow-hidden rounded-xl ${color.class} ${
                                                    filters.color === color.value ? 'ring-2 ring-black ring-offset-2' : ''
                                                } transition-all hover:scale-105 active:scale-95`}
                                                title={color.label}
                                            >
                                                {filters.color === color.value && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                        <Check className="h-5 w-5 text-white drop-shadow" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sizes */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">Sizes</h3>
                                        {filters.size && (
                                            <button
                                                onClick={() => setFilters({...filters, size: ''})}
                                                className="text-xs text-gray-500 hover:text-gray-700"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {filterOptions.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setFilters({...filters, size})}
                                                className={`relative h-11 w-11 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95 ${
                                                    filters.size === size
                                                        ? 'bg-black text-white shadow-sm'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">Rating</h3>
                                        {filters.rating && (
                                            <button
                                                onClick={() => setFilters({...filters, rating: ''})}
                                                className="text-xs text-gray-500 hover:text-gray-700"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {filterOptions.ratingOptions.map((rating) => (
                                            <button
                                                key={rating.value}
                                                onClick={() => setFilters({...filters, rating: rating.value})}
                                                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-all ${
                                                    filters.rating === rating.value
                                                        ? 'bg-black text-white shadow-sm'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                <span className="flex items-center gap-1.5">
                                                    {rating.label.split(' ')[0]}
                                                    <Star className={`h-4 w-4 ${
                                                        filters.rating === rating.value ? 'fill-white text-white' : 'fill-yellow-400 text-yellow-400'
                                                    }`} />
                                                    & up
                                                </span>
                                                <span className={`text-xs ${
                                                    filters.rating === rating.value ? 'text-white/60' : 'text-gray-500'
                                                }`}>
                                                    ({rating.count?.toFixed(1)})
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* In Stock Toggle */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">Availability</h3>
                                        {filters.stockFilter && (
                                            <button
                                                onClick={() => setFilters({...filters, stockFilter: ''})}
                                                className="text-xs text-gray-500 hover:text-gray-700"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <label className="flex cursor-pointer items-center justify-between rounded-xl bg-gray-50 px-4 py-3 hover:bg-gray-100">
                                        <span className="text-sm text-gray-700">Show In-Stock Items Only</span>
                                        <div className={`relative h-6 w-11 rounded-full transition-colors ${
                                            filters.stockFilter === 'inStock' ? 'bg-black' : 'bg-gray-300'
                                        }`}>
                                            <div className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                                                filters.stockFilter === 'inStock' ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={filters.stockFilter === 'inStock'}
                                                onChange={(e) => setFilters({...filters, stockFilter: e.target.checked ? 'inStock' : ''})}
                                            />
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="sticky bottom-0 border-t border-gray-100 bg-white/80 px-6 py-4 backdrop-blur-xl">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setFilters({
                                            category: '',
                                            priceRange: '',
                                            sortBy: 'newest',
                                            stockFilter: '',
                                            color: '',
                                            size: '',
                                            rating: ''
                                        })}
                                        className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 active:bg-gray-300"
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="flex-1 rounded-xl bg-black py-3 text-sm font-medium text-white transition-all hover:bg-gray-900 active:bg-gray-800"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Quick View Modal */}
            <AnimatePresence>
                {isQuickViewOpen && quickViewProduct && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsQuickViewOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsQuickViewOpen(false)}
                                className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="relative aspect-square">
                                    <Image
                                        src={quickViewProduct.imageUrls[0]}
                                        alt={quickViewProduct.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6 space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">{quickViewProduct.name}</h3>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-current text-yellow-400"/>
                                        <span className="text-sm text-gray-600">{quickViewProduct.rating || '4.5'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-medium text-gray-900">${quickViewProduct.price}</span>
                                        {quickViewProduct.discount > 0 && (
                                            <span className="text-sm text-gray-500 line-through">
                                                ${Math.round(quickViewProduct.price * (1 + quickViewProduct.discount / 100))}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-3">{quickViewProduct.description}</p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                handleAddToCart(e, quickViewProduct);
                                                setIsQuickViewOpen(false);
                                            }}
                                            disabled={loadingStates[quickViewProduct.id]?.cart}
                                            className={`flex-1 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors ${
                                                loadingStates[quickViewProduct.id]?.cart ? 'cursor-not-allowed opacity-50' : ''
                                            }`}
                                        >
                                            {loadingStates[quickViewProduct.id]?.cart ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span>Adding...</span>
                                                </div>
                                            ) : (
                                                'Add to Cart'
                                            )}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                handleToggleWishlist(e, quickViewProduct);
                                                setIsQuickViewOpen(false);
                                            }}
                                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            {isInWishlist(quickViewProduct.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back to Top Button */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={scrollToTop}
                        className="fixed bottom-24 right-8 z-50 rounded-full bg-black p-3 text-white shadow-lg hover:bg-gray-900 transition-colors duration-200"
                    >
                        <ChevronUp className="h-5 w-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
} 
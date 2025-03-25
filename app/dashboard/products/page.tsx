'use client';

import {useState, useEffect, useCallback} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Plus, Search, Filter, Trash2, Edit2, ChevronDown, ChevronUp, Loader2, ChevronLeft, ChevronRight} from 'lucide-react';
import {toast} from 'sonner';
import Image from 'next/image';
import ProductForm from '@/app/components/dashboard/ProductForm';
import {ConfirmDialog} from '@/app/components/ui/confirm-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import {useRouter} from 'next/navigation';

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

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<string>('all');
    const [stockFilter, setStockFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ id: string; name: string; }[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const productsPerPage = 10;
    const router = useRouter();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: productsPerPage.toString(),
                ...(searchQuery && { search: searchQuery }),
                ...(categoryFilter !== 'all' && { category: categoryFilter }),
                ...(priceRange !== 'all' && { priceRange }),
                ...(stockFilter !== 'all' && { stockFilter }),
                ...(sortBy !== 'newest' && { sortBy }),
                sortOrder
            });

            const response = await fetch(`/api/products?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();

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
            toast.error('Failed to load products');
            setProducts([]);
            setTotalProducts(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchQuery, categoryFilter, priceRange, stockFilter, sortBy, sortOrder, productsPerPage]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleDelete = async (productId: string) => {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete product');

            setProducts(products.filter(product => product.id !== productId));
            toast.success('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500"/>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <button
                    onClick={() => setEditingProduct('new')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus className="h-4 w-4"/>
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Category"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Price Range"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under50">Under $50</SelectItem>
                            <SelectItem value="50to100">$50 - $100</SelectItem>
                            <SelectItem value="over100">Over $100</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={stockFilter} onValueChange={setStockFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Stock Status"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Stock</SelectItem>
                            <SelectItem value="inStock">In Stock</SelectItem>
                            <SelectItem value="outOfStock">Out of Stock</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-4 mt-4">
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="price">Price</SelectItem>
                            <SelectItem value="category">Category</SelectItem>
                        </SelectContent>
                    </Select>

                    <button
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="p-2 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence>
                                    {products.map((product) => (
                                        <motion.tr
                                            key={product.id}
                                            initial={{opacity: 0, y: 20}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0, y: -20}}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => router.push(`/products/${product.id}`)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {product.imageUrls.length > 0 && (
                                                        <div className="relative h-10 w-10 rounded-lg overflow-hidden mr-3">
                                                            <Image
                                                                src={product.imageUrls[0]}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover rounded-lg"
                                                            />
                                                            {product.imageUrls.length > 1 && (
                                                                <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-tl">
                                                                    +{product.imageUrls.length - 1}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-sm text-gray-500 max-w-[200px]">
                                                            {product.description.length > 60 ? product.description.substring(0, 50) + "..." : product.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{product.category.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    product.stockQuantity > 0
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {product.stockQuantity > 0 ? `${product.stockQuantity} in Stock` : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => setEditingProduct(product.id)}
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        <Edit2 className="h-4 w-4"/>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setProductToDelete(product.id);
                                                            setDeleteDialogOpen(true);
                                                        }}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="h-4 w-4"/>
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalProducts > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{((currentPage - 1) * productsPerPage) + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(currentPage * productsPerPage, totalProducts)}</span> of{' '}
                                <span className="font-medium">{totalProducts}</span> products
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                                            onClick={() => handlePageChange(page)}
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
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
                    </div>
                )}
            </div>

            <AnimatePresence>
                {editingProduct && (
                    <ProductForm
                        productId={editingProduct}
                        onClose={() => setEditingProduct(null)}
                        onSuccess={fetchProducts}
                    />
                )}
            </AnimatePresence>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Product"
                description="Are you sure you want to delete this product? This action cannot be undone."
                onConfirm={() => productToDelete && handleDelete(productToDelete)}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
} 
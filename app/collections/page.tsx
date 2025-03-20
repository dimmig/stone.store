'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronRight, Shirt, Watch, Footprints, X, Check, ChevronDown } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
}

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [] as string[],
    priceRange: '',
    availability: [] as string[],
    sortBy: 'newest',
  });

  useEffect(() => {
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

    fetchCollections();
  }, []);

  const tabs = [
    { id: 'all', label: 'All Collections' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'footwear', label: 'Footwear' },
  ];

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      icon: Shirt,
      label: 'Clothing Items',
      value: '250+',
      color: 'text-accent-gold',
      bgColor: 'bg-accent-gold/10',
    },
    {
      icon: Watch,
      label: 'Accessories',
      value: '100+',
      color: 'text-accent-silver',
      bgColor: 'bg-accent-silver/10',
    },
    {
      icon: Footprints,
      label: 'Footwear Styles',
      value: '50+',
      color: 'text-accent-bronze',
      bgColor: 'bg-accent-bronze/10',
    },
  ];

  const filterSections = [
    {
      title: 'Categories',
      type: 'multiple',
      options: [
        { id: 'clothing', label: 'Clothing', count: 125 },
        { id: 'accessories', label: 'Accessories', count: 84 },
        { id: 'footwear', label: 'Footwear', count: 45 },
      ],
    },
    {
      title: 'Price Range',
      type: 'single',
      options: [
        { id: 'under-50', label: 'Under $50' },
        { id: '50-100', label: '$50 - $100' },
        { id: '100-200', label: '$100 - $200' },
        { id: 'over-200', label: 'Over $200' },
      ],
    },
    {
      title: 'Availability',
      type: 'multiple',
      options: [
        { id: 'in-stock', label: 'In Stock', count: 230 },
        { id: 'pre-order', label: 'Pre-Order', count: 12 },
      ],
    },
    {
      title: 'Sort By',
      type: 'single',
      options: [
        { id: 'newest', label: 'Newest First' },
        { id: 'price-asc', label: 'Price: Low to High' },
        { id: 'price-desc', label: 'Price: High to Low' },
        { id: 'popular', label: 'Most Popular' },
      ],
    },
  ];

  const handleFilterChange = (section: string, value: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (section === 'priceRange' || section === 'sortBy') {
        newFilters[section] = value;
      } else {
        const array = prev[section] as string[];
        if (array.includes(value)) {
          newFilters[section] = array.filter(item => item !== value);
        } else {
          newFilters[section] = [...array, value];
        }
      }
      return newFilters;
    });
  };

  const FiltersDrawer = () => (
    <AnimatePresence>
      {showFilters && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
            className="fixed inset-0 bg-black z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {filterSections.map((section) => (
                  <div key={section.title} className="border-b border-gray-200 pb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                      {section.title}
                    </h3>
                    <div className="space-y-3">
                      {section.options.map((option: FilterOption) => (
                        <label
                          key={option.id}
                          className="flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center">
                            {section.type === 'multiple' ? (
                              <div
                                className={`w-5 h-5 rounded border ${
                                  selectedFilters[section.title.toLowerCase()].includes(option.id)
                                    ? 'bg-accent-gold border-accent-gold'
                                    : 'border-gray-300 group-hover:border-accent-gold'
                                } flex items-center justify-center transition-colors duration-200`}
                              >
                                {selectedFilters[section.title.toLowerCase()].includes(option.id) && (
                                  <Check className="h-3 w-3 text-white" />
                                )}
                              </div>
                            ) : (
                              <div
                                className={`w-5 h-5 rounded-full border ${
                                  selectedFilters[section.title.toLowerCase()] === option.id
                                    ? 'border-4 border-accent-gold'
                                    : 'border-gray-300 group-hover:border-accent-gold'
                                } transition-colors duration-200`}
                              />
                            )}
                            <span className="ml-3 text-sm text-gray-700">
                              {option.label}
                            </span>
                          </div>
                          {option.count !== undefined && (
                            <span className="text-sm text-gray-500">
                              {option.count}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setSelectedFilters({
                    categories: [],
                    priceRange: '',
                    availability: [],
                    sortBy: 'newest',
                  })}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-accent-gold rounded-lg hover:bg-accent-gold-dark transition-colors duration-200"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <FiltersDrawer />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            Collections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-gray-500"
          >
            Explore our curated collections of premium clothing and accessories
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              {Object.values(selectedFilters).some(value => 
                Array.isArray(value) ? value.length > 0 : value !== ''
              ) && (
                <span className="ml-1 px-2 py-0.5 text-xs font-medium text-white bg-accent-gold rounded-full">
                  {Object.values(selectedFilters).reduce((count, value) => 
                    count + (Array.isArray(value) ? value.length : (value ? 1 : 0)), 0
                  )}
                </span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-accent-gold text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Collections Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading ? (
            // Loading skeletons
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : (
            filteredCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <Link href={`/store?category=${collection.id}`}>
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={collection.image || '/images/placeholder.jpg'}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {collection.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-accent-gold text-white text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-accent-gold transition-colors duration-200">
                      {collection.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {collection.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {collection.productCount} products
                      </span>
                      <ChevronRight className="h-5 w-5 text-accent-gold transform transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </motion.div>
  );
} 
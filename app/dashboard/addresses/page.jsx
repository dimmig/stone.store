'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Check,
} from 'lucide-react';
import { colors, typography, spacing, shadows, transitions } from '../../styles/design-system';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      isDefault: true,
    },
    {
      id: 2,
      name: 'John Doe',
      street: '456 Park Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      isDefault: false,
    },
  ]);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAddress) {
      // Update existing address
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id
            ? { ...addr, ...formData }
            : addr
        )
      );
      setEditingAddress(null);
    } else {
      // Add new address
      setAddresses([
        ...addresses,
        {
          id: addresses.length + 1,
          ...formData,
          isDefault: addresses.length === 0,
        },
      ]);
    }
    setIsAddingAddress(false);
    setFormData({
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
    });
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setIsAddingAddress(true);
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const setDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className={`${typography.h2} text-gray-900`}>Shipping Addresses</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingAddress(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-accent-gold text-white rounded-full hover:bg-accent-gold-dark transition-colors duration-300"
        >
          <Plus className="h-4 w-4" />
          <span>Add Address</span>
        </motion.button>
      </div>

      {/* Address Form */}
      {(isAddingAddress || editingAddress) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className={`${typography.h4} text-gray-900 mb-6`}>
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className={`${typography.body} text-gray-700 block mb-1`}
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                required
              />
            </div>
            <div>
              <label
                htmlFor="street"
                className={`${typography.body} text-gray-700 block mb-1`}
              >
                Street Address
              </label>
              <input
                type="text"
                id="street"
                value={formData.street}
                onChange={(e) =>
                  setFormData({ ...formData, street: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className={`${typography.body} text-gray-700 block mb-1`}
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="state"
                  className={`${typography.body} text-gray-700 block mb-1`}
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="zip"
                className={`${typography.body} text-gray-700 block mb-1`}
              >
                ZIP Code
              </label>
              <input
                type="text"
                id="zip"
                value={formData.zip}
                onChange={(e) =>
                  setFormData({ ...formData, zip: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setIsAddingAddress(false);
                  setEditingAddress(null);
                  setFormData({
                    name: '',
                    street: '',
                    city: '',
                    state: '',
                    zip: '',
                  });
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-4 py-2 bg-accent-gold text-white rounded-full hover:bg-accent-gold-dark transition-colors duration-300"
              >
                {editingAddress ? 'Update Address' : 'Add Address'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <motion.div
            key={address.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-accent-gold" />
                <h3 className={`${typography.h4} text-gray-900`}>
                  {address.name}
                </h3>
              </div>
              {address.isDefault && (
                <span className="px-2 py-1 bg-accent-gold/10 text-accent-gold rounded-full text-sm">
                  Default
                </span>
              )}
            </div>
            <div className="space-y-1">
              <p className={`${typography.body} text-gray-700`}>
                {address.street}
              </p>
              <p className={`${typography.body} text-gray-700`}>
                {address.city}, {address.state} {address.zip}
              </p>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              {!address.isDefault && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDefaultAddress(address.id)}
                  className="text-accent-gold hover:text-accent-gold-dark"
                >
                  Set as Default
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEdit(address)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Edit2 className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(address.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {addresses.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block p-4 rounded-full bg-accent-gold/10 mb-4">
            <MapPin className="h-8 w-8 text-accent-gold" />
          </div>
          <h3 className={`${typography.h4} text-gray-900 mb-2`}>
            No addresses saved
          </h3>
          <p className={`${typography.body} text-gray-500 mb-4`}>
            Add your shipping addresses to make checkout faster.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingAddress(true)}
            className="px-6 py-3 bg-accent-gold text-white rounded-full hover:bg-accent-gold-dark transition-colors duration-300"
          >
            Add Address
          </motion.button>
        </div>
      )}
    </div>
  );
} 
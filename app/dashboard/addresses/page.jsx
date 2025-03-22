'use client';

import { useState, useEffect } from 'react';
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
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/addresses');
      
      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/addresses', {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingId ? { ...formData, id: editingId } : formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      await fetchAddresses();
      resetForm();
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setIsAddingNew(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/user/addresses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      isDefault: false,
    });
    setEditingId(null);
    setIsAddingNew(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`${typography.h2} text-gray-900`}>My Addresses</h1>
        {!isAddingNew && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingNew(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-accent-gold text-white rounded-full hover:bg-accent-gold-dark transition-colors duration-300"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Address</span>
          </motion.button>
        )}
      </div>

      {isAddingNew ? (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
          onSubmit={handleSubmit}
        >
          <h2 className={`${typography.h3} text-gray-900 mb-6`}>
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`${typography.body} text-gray-600 block mb-1`}>
                Name / Label
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className={`${typography.body} text-gray-600 block mb-1`}>
                Street Address
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className={`${typography.body} text-gray-600 block mb-1`}>
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className={`${typography.body} text-gray-600 block mb-1`}>
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className={`${typography.body} text-gray-600 block mb-1`}>
                ZIP Code
              </label>
              <input
                type="text"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded border-gray-300 text-accent-gold focus:ring-accent-gold"
              />
              <label
                htmlFor="isDefault"
                className={`${typography.body} text-gray-600`}
              >
                Set as default address
              </label>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-accent-gold text-white rounded-full hover:bg-accent-gold-dark transition-colors duration-300"
            >
              {editingId ? 'Save Changes' : 'Add Address'}
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetForm}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-300"
            >
              Cancel
            </motion.button>
          </div>
        </motion.form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <p className={`${typography.body} text-gray-500 mt-2`}>
                No addresses saved yet
              </p>
            </div>
          ) : (
            addresses.map((address) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <h3 className={`${typography.h4} text-gray-900`}>
                      {address.name}
                    </h3>
                    {address.isDefault && (
                      <span className="px-2 py-1 bg-accent-gold/10 text-accent-gold text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(address)}
                      className="p-2 text-gray-500 hover:text-accent-gold rounded-full hover:bg-accent-gold/10 transition-colors duration-300"
                    >
                      <Edit2 className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(address.id)}
                      className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className={`${typography.body} text-gray-600`}>
                    {address.street}
                  </p>
                  <p className={`${typography.body} text-gray-600`}>
                    {address.city}, {address.state} {address.zip}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 
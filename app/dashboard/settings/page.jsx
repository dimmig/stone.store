'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Lock,
  CreditCard,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { colors, typography, spacing, shadows, transitions } from '../../styles/design-system';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    orderUpdates: true,
    promotions: false,
  });

  const settingsSections = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: User,
      description: 'Manage your account information and preferences',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Control how you receive updates and alerts',
    },
    {
      id: 'security',
      title: 'Security',
      icon: Lock,
      description: 'Manage your password and security settings',
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      icon: CreditCard,
      description: 'Manage your saved payment methods',
    },
    {
      id: 'language',
      title: 'Language & Region',
      icon: Globe,
      description: 'Set your preferred language and region',
    },
  ];

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`${typography.h4} text-gray-900 mb-4`}>
                Profile Information
              </h3>
              <div className="space-y-4">
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
                    defaultValue="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className={`${typography.body} text-gray-700 block mb-1`}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    defaultValue="john@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className={`${typography.body} text-gray-700 block mb-1`}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className={`${typography.h4} text-gray-900 mb-4`}>
                Account Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${typography.body} text-gray-900`}>
                      Marketing Emails
                    </p>
                    <p className={`${typography.body} text-gray-500`}>
                      Receive updates about new products and special offers
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-gold"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${typography.body} text-gray-900`}>
                      SMS Notifications
                    </p>
                    <p className={`${typography.body} text-gray-500`}>
                      Receive order updates via text message
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-gold"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className={`${typography.h4} text-gray-900 mb-4`}>
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                >
                  <div>
                    <p className={`${typography.body} text-gray-900 capitalize`}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className={`${typography.body} text-gray-500`}>
                      {key === 'email'
                        ? 'Receive updates via email'
                        : key === 'sms'
                        ? 'Receive updates via SMS'
                        : key === 'orderUpdates'
                        ? 'Get notified about your order status'
                        : 'Receive promotional offers and deals'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={value}
                      onChange={() => handleNotificationToggle(key)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-gold"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`${typography.h4} text-gray-900 mb-4`}>
                Change Password
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className={`${typography.body} text-gray-700 block mb-1`}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className={`${typography.body} text-gray-700 block mb-1`}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className={`${typography.body} text-gray-700 block mb-1`}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className={`${typography.h4} text-gray-900 mb-4`}>
                Two-Factor Authentication
              </h3>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div>
                  <p className={`${typography.body} text-gray-900`}>
                    Enable Two-Factor Authentication
                  </p>
                  <p className={`${typography.body} text-gray-500`}>
                    Add an extra layer of security to your account
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-gold"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className={`${typography.h4} text-gray-900`}>
                Saved Payment Methods
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-accent-gold text-white rounded-full hover:bg-accent-gold-dark transition-colors duration-300"
              >
                Add Payment Method
              </motion.button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gray-200 rounded"></div>
                    <div>
                      <p className={`${typography.body} text-gray-900`}>
                        Visa ending in 4242
                      </p>
                      <p className={`${typography.body} text-gray-500`}>
                        Expires 12/24
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </motion.button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-accent-gold"></div>
                  <p className={`${typography.body} text-gray-500`}>
                    Default payment method
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`${typography.h4} text-gray-900 mb-4`}>
                Language Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="language"
                    className={`${typography.body} text-gray-700 block mb-1`}
                  >
                    Preferred Language
                  </label>
                  <select
                    id="language"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="region"
                    className={`${typography.body} text-gray-700 block mb-1`}
                  >
                    Region
                  </label>
                  <select
                    id="region"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                    defaultValue="us"
                  >
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                    <option value="gb">United Kingdom</option>
                    <option value="au">Australia</option>
                    <option value="eu">European Union</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Settings Navigation */}
      <div className="lg:w-64 space-y-4">
        {settingsSections.map((section) => (
          <motion.button
            key={section.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors duration-300 ${
              activeSection === section.id
                ? 'bg-accent-gold text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <section.icon className="h-5 w-5" />
              <div className="text-left">
                <p className={`${typography.body} font-medium`}>
                  {section.title}
                </p>
                <p
                  className={`${typography.body} text-sm ${
                    activeSection === section.id
                      ? 'text-white/80'
                      : 'text-gray-500'
                  }`}
                >
                  {section.description}
                </p>
              </div>
            </div>
            <ChevronRight
              className={`h-5 w-5 ${
                activeSection === section.id ? 'text-white' : 'text-gray-400'
              }`}
            />
          </motion.button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          {renderSectionContent()}
        </motion.div>
      </div>
    </div>
  );
} 
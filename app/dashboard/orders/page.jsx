"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Search,
  Filter,
  MessageSquare,
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { typography } from "../../styles/design-system";
import { useUserStore } from "@/store/user-store";
import { Role } from "@prisma/client";
import Image from "next/image";

const statusConfig = {
  processing: {
    icon: Package,
    color: "text-accent-gold",
    bgColor: "bg-accent-gold/10",
    label: "Processing",
  },
  shipped: {
    icon: Truck,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    label: "Shipped",
  },
  delivered: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-50",
    label: "Delivered",
  },
  cancelled: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-50",
    label: "Cancelled",
  },
};

const OrderItems = ({ items, isExpanded, formatCurrency, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const expandedRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => setIsLoading(true);
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".order-items-button")) {
        return;
      }
      if (expandedRef.current && !expandedRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isExpanded, onClose]);

  if (!isExpanded || !items || items.length === 0) return null;

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent-gold"></div>
      </div>
    );
  }

  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );
  return (
    <div ref={expandedRef} className="overflow-hidden">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className={`${typography.h6} text-gray-900`}>Order Items</h4>
          <span className="text-sm text-gray-500">{items.length} items</span>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {/* Product Image */}
              <div className="w-20 h-20 rounded-lg bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                {item.product?.imageUrls?.[0] ? (
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                    <Image
                      src={item.product.imageUrls[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p
                      className={`${typography.body} text-gray-900 font-medium line-clamp-2`}
                    >
                      {item.product?.name || "Product Not Found"}
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                      {item.size && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100">
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100">
                          Color: {item.color}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.product?.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`${typography.body} font-medium text-gray-900`}
                    >
                      {formatCurrency(Number(item.price))}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-2 pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Item Total:{" "}
                    <span className="font-medium text-gray-900">
                      {formatCurrency(
                        Number(item.price) * Number(item.quantity)
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Subtotal</span>
              <span className={`${typography.body} font-medium text-gray-900`}>
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Shipping</span>
              <span className="text-gray-900">Free</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className={`${typography.h6} text-gray-900`}>Total</span>
              <span className={`${typography.h6} text-gray-900`}>
                {formatCurrency(subtotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const { data: session } = useSession();
  const { user } = useUserStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderNote, setOrderNote] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [noteText, setNoteText] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const ordersPerPage = 6;
  const isAdmin = user?.role === Role.ADMIN;

  // Add effect to handle status filter changes when switching tabs
  useEffect(() => {
    if (activeTab === "active") {
      setStatusFilter("all");
    } else {
      setStatusFilter("all");
    }
  }, [activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [isAdmin]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const endpoint = isAdmin ? "/api/orders/all" : "/api/orders/user";
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("Expected array of orders but got:", data);
        setOrders([]);
        return;
      }

      // Ensure each order has an items array
      const ordersWithItems = data.map((order) => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : [],
      }));

      setOrders(ordersWithItems);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const updatedOrder = await response.json();
      setOrders(
        orders.map((order) => (order.id === orderId ? updatedOrder : order))
      );
      setEditingOrderId(null);
      setEditingStatus("");
      setTrackingNumber("");
      setOrderNote("");
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleSaveNote = async () => {
    try {
      const response = await fetch(`/api/orders/${editingOrder}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: noteText }),
      });

      if (!response.ok) throw new Error("Failed to save note");

      const updatedOrder = await response.json();
      setOrders(
        orders.map((order) =>
          order.id === editingOrder ? updatedOrder : order
        )
      );
      setEditingOrder(null);
      setNoteText("");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (isAdmin &&
          (order.user?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
            order.user?.email
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())));

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      // Add tab filtering
      const matchesTab =
        activeTab === "active"
          ? order.status !== "delivered" && order.status !== "cancelled"
          : order.status === "delivered" || order.status === "cancelled";

      return matchesSearch && matchesStatus && matchesTab;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className={`${typography.h2} text-gray-900`}>
          {isAdmin ? "All Orders" : "My Orders"}
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
            activeTab === "active"
              ? "border-accent-gold text-accent-gold"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Active Orders
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
            activeTab === "history"
              ? "border-accent-gold text-accent-gold"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Order History
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder={isAdmin ? "Search orders..." : "Search by order ID..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200
                            focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
          />
        </div>
        <div className="relative min-w-[160px]">
          <button
            onClick={() =>
              setActiveDropdown(activeDropdown === "status" ? null : "status")
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                            flex items-center justify-between hover:border-gray-300 transition-colors duration-200"
          >
            <span className="text-gray-700">
              {statusFilter === "all"
                ? "All Statuses"
                : statusConfig[statusFilter]?.label}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          <AnimatePresence>
            {activeDropdown === "status" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute z-10 mt-2 w-full rounded-xl bg-white shadow-lg border border-gray-100 py-1"
              >
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setActiveDropdown(null);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                >
                  All Statuses
                </button>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <config.icon className={`h-4 w-4 ${config.color}`} />
                    <span className="text-gray-700">{config.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Orders Grid */}
      {activeTab === "active" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 relative"
              style={{ position: "relative" }}
            >
              <div className="flex flex-col h-full">
                {/* Order Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500 mb-1">Order ID</p>
                      <p
                        className={`${typography.body} font-medium text-gray-900 truncate`}
                      >
                        #{order.id}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap ${
                          statusConfig[order.status].bgColor
                        } ${statusConfig[order.status].color}`}
                      >
                        {React.createElement(statusConfig[order.status].icon, {
                          className: "h-4 w-4 flex-shrink-0",
                        })}
                        <span>{statusConfig[order.status].label}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    {isAdmin && (
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`${typography.body} text-gray-900 truncate`}
                          >
                            {order.user?.name || "Guest"}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {order.user?.email || "No email provided"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <p className="text-sm truncate">Order Date</p>
                        </div>
                        <p
                          className={`${typography.body} text-gray-900 truncate`}
                        >
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <DollarSign className="h-4 w-4 flex-shrink-0" />
                          <p className="text-sm truncate">Total</p>
                        </div>
                        <p
                          className={`${typography.body} text-gray-900 truncate`}
                        >
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <p className="text-sm truncate">Shipping Address</p>
                      </div>
                      <p
                        className={`${typography.body} text-gray-900 truncate`}
                      >
                        {order.shippingAddress.street}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zip}
                      </p>
                    </div>

                    {order.note && (
                      <div className="min-w-0 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <MessageSquare className="h-4 w-4 flex-shrink-0" />
                          <p className="text-sm">Admin Note</p>
                        </div>
                        <p className="text-sm text-gray-600">{order.note}</p>
                      </div>
                    )}

                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === `status-${order.id}`
                                  ? null
                                  : `status-${order.id}`
                              )
                            }
                            className="w-full px-4 py-2 rounded-lg bg-gray-900/10 text-gray-900 hover:bg-gray-900/20 transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <span>Update Status</span>
                            <ChevronDown className="h-4 w-4" />
                          </button>

                          <AnimatePresence>
                            {activeDropdown === `status-${order.id}` && (
                              <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                className="absolute left-0 right-0 mt-2 rounded-xl bg-white shadow-lg border border-gray-100 py-1 z-10"
                              >
                                {Object.entries(statusConfig).map(
                                  ([status, config]) => (
                                    <button
                                      key={status}
                                      onClick={() => {
                                        handleStatusUpdate(order.id, status);
                                        setActiveDropdown(null);
                                      }}
                                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <config.icon
                                        className={`h-4 w-4 ${config.color}`}
                                      />
                                      <span className="text-gray-700">
                                        {config.label}
                                      </span>
                                    </button>
                                  )
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <button
                          onClick={() => setEditingOrder(order.id)}
                          className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Note</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setExpandedOrderId(
                          expandedOrderId === order.id ? null : order.id
                        );
                      }}
                      className="order-items-button flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200"
                    >
                      <span>Order Items</span>
                      {expandedOrderId === order.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {expandedOrderId === order.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute left-0 right-0 ${
                      Math.ceil(
                        (paginatedOrders.findIndex((o) => o.id === order.id) +
                          1) /
                          3
                      ) === Math.ceil(paginatedOrders.length / 3)
                        ? "bottom-20"
                        : "top-full mt-2"
                    } bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-[100]`}
                  >
                    <div className="sticky top-0 right-0 p-2 flex justify-end bg-white border-b border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedOrderId(null);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                    <OrderItems
                      items={order.items}
                      isExpanded={expandedOrderId === order.id}
                      formatCurrency={formatCurrency}
                      onClose={() => setExpandedOrderId(null)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        statusConfig[order.status].bgColor
                      }`}
                    >
                      {React.createElement(statusConfig[order.status].icon, {
                        className: `h-5 w-5 ${
                          statusConfig[order.status].color
                        }`,
                      })}
                    </div>
                    <div>
                      <p
                        className={`${typography.body} font-medium text-gray-900`}
                      >
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`${typography.body} font-medium text-gray-900`}
                    >
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.items.length} items
                    </p>
                  </div>
                </div>

                {isAdmin && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-3 w-3 text-gray-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-900 truncate">
                        {order.user?.name || "Guest"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {order.user?.email || "No email provided"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600 truncate">
                        {order.shippingAddress.street},{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zip}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setExpandedOrderId(
                          expandedOrderId === order.id ? null : order.id
                        );
                      }}
                      className="order-items-button flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200"
                    >
                      <span>View Details</span>
                      {expandedOrderId === order.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedOrderId === order.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-100"
                  >
                    <OrderItems
                      items={order.items}
                      isExpanded={expandedOrderId === order.id}
                      formatCurrency={formatCurrency}
                      onClose={() => setExpandedOrderId(null)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border ${
              currentPage === 1
                ? "border-gray-100 text-gray-300 cursor-not-allowed"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            } transition-colors duration-200`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;

              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[40px] h-10 rounded-lg border ${
                      isActive
                        ? "border-gray-900 bg-gray-900/10 text-gray-900 font-medium"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    } transition-colors duration-200`}
                  >
                    {page}
                  </button>
                );
              }

              if (
                (page === currentPage - 2 && page > 2) ||
                (page === currentPage + 2 && page < totalPages - 1)
              ) {
                return (
                  <span key={page} className="text-gray-400">
                    ...
                  </span>
                );
              }

              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg border ${
              currentPage === totalPages
                ? "border-gray-100 text-gray-300 cursor-not-allowed"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            } transition-colors duration-200`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Add Note Modal - Only for admin */}
      {isAdmin && (
        <AnimatePresence>
          {editingOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setEditingOrder(null);
                  setNoteText("");
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h3 className={`${typography.h4} text-gray-900 mb-4`}>
                    Add Note
                  </h3>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter note about the order..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200
                                            focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => {
                        setEditingOrder(null);
                        setNoteText("");
                      }}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600
                                                hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNote}
                      disabled={!noteText.trim()}
                      className={`px-4 py-2 rounded-lg text-white transition-all duration-200 ${
                        noteText.trim()
                          ? "bg-black hover:bg-gray-800"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

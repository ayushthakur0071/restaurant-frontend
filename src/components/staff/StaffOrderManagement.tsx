import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StaffOrderManagement = () => {
  const { orders, updateOrderStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ['Ordered', 'Preparing', 'Ready', 'Out for delivery', 'Completed'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Order Management</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
        >
          <option value="All">All Status</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-stone-700">Order ID</th>
                <th className="px-6 py-3 text-left text-stone-700">Customer</th>
                <th className="px-6 py-3 text-left text-stone-700">Type</th>
                <th className="px-6 py-3 text-left text-stone-700">Total</th>
                <th className="px-6 py-3 text-left text-stone-700">Status</th>
                <th className="px-6 py-3 text-left text-stone-700">Time</th>
                <th className="px-6 py-3 text-left text-stone-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4">
                    <span>#{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div>{order.customerName}</div>
                      <div className="text-sm text-stone-600">{order.customerPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-sm ${
                      order.deliveryType === 'delivery'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.deliveryType === 'delivery' ? 'Delivery' : 'Collection'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-red-600">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                      className="px-3 py-1 border border-stone-300 rounded focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
                    >
                      {order.deliveryType === 'delivery' ? (
                        <>
                          <option value="Ordered">Ordered</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready">Ready</option>
                          <option value="Out for delivery">Out for delivery</option>
                          <option value="Completed">Completed</option>
                        </>
                      ) : (
                        <>
                          <option value="Ordered">Ordered</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready">Ready</option>
                          <option value="Completed">Completed</option>
                        </>
                      )}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        alert(`Order Details:\n\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\n${order.deliveryAddress ? `Address: ${order.deliveryAddress}\n` : ''}Total: $${order.total.toFixed(2)}`);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-stone-600">
              No orders found
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

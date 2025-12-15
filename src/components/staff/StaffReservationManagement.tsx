import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Search, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StaffReservationManagement = () => {
  const { reservations, updateReservationStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.customerPhone.includes(searchQuery);
    const matchesDate = !dateFilter || reservation.date === dateFilter;
    const matchesStatus = statusFilter === 'All' || reservation.status === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Reservation Management</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
        >
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Reservations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReservations.map(reservation => (
          <Card key={reservation.id}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="mb-1">{reservation.customerName}</h3>
                  <div className="text-sm text-stone-600">ID: {reservation.id}</div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm capitalize ${getStatusBadgeColor(reservation.status)}`}>
                  {reservation.status}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-stone-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-stone-500" />
                  <span>{new Date(reservation.date).toLocaleDateString()}</span>
                </div>
                <div className="text-sm">
                  <span className="text-stone-600">Time:</span> {reservation.time}
                </div>
                <div className="text-sm">
                  <span className="text-stone-600">Party Size:</span> {reservation.partySize} {reservation.partySize === 1 ? 'guest' : 'guests'}
                </div>
                <div className="text-sm">
                  <span className="text-stone-600">Email:</span> {reservation.customerEmail}
                </div>
                <div className="text-sm">
                  <span className="text-stone-600">Phone:</span> {reservation.customerPhone}
                </div>
              </div>

              {reservation.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                    className="flex-1 !py-2"
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                    className="flex-1 !py-2"
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {reservation.status === 'confirmed' && (
                <Button
                  variant="danger"
                  onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                  fullWidth
                  className="!py-2"
                >
                  Cancel Reservation
                </Button>
              )}

              {reservation.status === 'cancelled' && (
                <div className="text-center text-stone-500 text-sm py-2">
                  Reservation cancelled
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <Card>
          <div className="text-center py-12 text-stone-600">
            No reservations found
          </div>
        </Card>
      )}
    </div>
  );
};

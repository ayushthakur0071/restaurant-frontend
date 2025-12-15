import React from 'react';
import { Card } from '../ui/Card';
import { DollarSign, ShoppingBag, Users, Calendar, TrendingUp, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { MenuItem } from '../../data/menuData';

export const AdminDashboard = () => {
  const { orders, reservations } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(order => 
    order.createdAt.split('T')[0] === today
  );

  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const todayReservations = reservations.filter(res => res.date === today);

  // Calculate popular dishes (mock data based on reviews)
  // Popular dishes (placeholder for now — DB has no reviews yet)
const popularDishes: MenuItem[] = [
  {
    id: "1",
    name: "Classic Burger",
    price: 12.99,
    description: "",
    category: "Main Course",
    image: "",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    allergens: [],
    nutritionalInfo: { calories: 0, protein: "0g", carbs: "0g", fat: "0g" },
    reviews: [],
  },
  {
    id: "3",
    name: "Grilled Ribeye Steak",
    price: 28.99,
    description: "",
    category: "Main Course",
    image: "",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    allergens: [],
    nutritionalInfo: { calories: 0, protein: "0g", carbs: "0g", fat: "0g" },
    reviews: [],
  },
];

// For now, set total menu count manually or fetch later
const totalMenuItems = 10; // You can fetch this from database later

const stats = [
  {
    title: "Today's Revenue",
    value: `$${todayRevenue.toFixed(2)}`,
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
    trend: "+12%",
  },
  {
    title: "Orders Today",
    value: todayOrders.length.toString(),
    icon: ShoppingBag,
    color: "bg-blue-100 text-blue-600",
    trend: "+8%",
  },
  {
    title: "Reservations Today",
    value: todayReservations.length.toString(),
    icon: Calendar,
    color: "bg-purple-100 text-purple-600",
    trend: "+15%",
  },
  {
    title: "Total Menu Items",
    value: totalMenuItems.toString(),
    icon: Users,
    color: "bg-amber-100 text-amber-600",
    trend: "+2",
  },
];


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Admin Dashboard</h1>
        <p className="text-stone-600">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-green-600 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.trend}
                </span>
              </div>
              <div className="text-2xl mb-1">{stat.value}</div>
              <div className="text-stone-600 text-sm">{stat.title}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <div className="p-6">
            <h3 className="mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between pb-4 border-b border-stone-200 last:border-0">
                  <div>
                    <div>{order.id}</div>
                    <div className="text-sm text-stone-600">{order.customerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-600">${order.total.toFixed(2)}</div>
                    <div className={`text-sm ${
                      order.status === 'Completed' ? 'text-green-600' :
                      order.status === 'Preparing' ? 'text-amber-600' :
                      'text-blue-600'
                    }`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Popular Dishes */}
        <Card>
          <div className="p-6">
            <h3 className="mb-4">Popular Dishes</h3>
            <div className="space-y-4">
              {popularDishes.map((dish, index) => (
                <div key={dish.id} className="flex items-center gap-4 pb-4 border-b border-stone-200 last:border-0">
                  <div className={`w-8 h-8 rounded-lg ${
                    index === 0 ? 'bg-amber-100 text-amber-600' :
                    index === 1 ? 'bg-stone-200 text-stone-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-stone-100 text-stone-600'
                  } flex items-center justify-center flex-shrink-0`}>
                    {index === 0 && <Award className="w-5 h-5" />}
                    {index !== 0 && <span>{index + 1}</span>}
                  </div>
                  <div className="flex-1">
                    <div>{dish.name}</div>
                    <div className="text-sm text-stone-600">
                      {dish.reviews.length} {dish.reviews.length === 1 ? 'review' : 'reviews'}
                    </div>
                  </div>
                  <div className="text-red-600">
                    ${dish.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <div className="p-6">
            <h3 className="mb-4">Order Status Overview</h3>
            <div className="space-y-3">
              {['Ordered', 'Preparing', 'Ready', 'Out for delivery', 'Completed'].map(status => {
                const count = orders.filter(o => o.status === status).length;
                const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-stone-700">{status}</span>
                      <span className="text-stone-600">{count}</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Upcoming Reservations */}
        <Card>
          <div className="p-6">
            <h3 className="mb-4">Upcoming Reservations</h3>
            <div className="space-y-4">
              {reservations
                .filter(res => res.status === 'confirmed' || res.status === 'pending')
                .slice(0, 5)
                .map(reservation => (
                  <div key={reservation.id} className="flex items-center justify-between pb-4 border-b border-stone-200 last:border-0">
                    <div>
                      <div>{reservation.customerName}</div>
                      <div className="text-sm text-stone-600">
                        {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-stone-700">{reservation.partySize} guests</div>
                      <div className={`text-sm ${
                        reservation.status === 'confirmed' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {reservation.status}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

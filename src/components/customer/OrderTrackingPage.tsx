import React from 'react';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';

export const OrderTrackingPage = () => {
  const { orders, currentUser } = useApp();

  const userOrders = currentUser 
    ? orders.filter(order => order.customerName.toLowerCase() === currentUser.name.toLowerCase())
    : orders;

  const getStatusIcon = (status: string, currentStatus: string) => {
    const statusOrder = ['Ordered', 'Preparing', 'Ready', 'Out for delivery', 'Completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(status);

    if (stepIndex < currentIndex) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    } else if (stepIndex === currentIndex) {
      return <div className="w-6 h-6 rounded-full border-4 border-red-600 bg-white"></div>;
    } else {
      return <div className="w-6 h-6 rounded-full border-4 border-stone-300 bg-white"></div>;
    }
  };

  const getStatusColor = (status: string, currentStatus: string) => {
    const statusOrder = ['Ordered', 'Preparing', 'Ready', 'Out for delivery', 'Completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(status);

    if (stepIndex <= currentIndex) {
      return 'border-red-600';
    }
    return 'border-stone-300';
  };

  if (userOrders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Package className="w-24 h-24 text-stone-300 mx-auto mb-4" />
          <h2 className="mb-4">No Orders Yet</h2>
          <p className="text-stone-600 mb-8">
            You haven't placed any orders yet. Start exploring our menu!
          </p>
          <Button onClick={() => window.location.hash = '/menu'}>
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Your Orders</h1>

      <div className="space-y-6">
        {userOrders.map(order => {
          const statusSteps = order.deliveryType === 'delivery'
            ? ['Ordered', 'Preparing', 'Ready', 'Out for delivery', 'Completed']
            : ['Ordered', 'Preparing', 'Ready', 'Completed'];

          return (
            <Card key={order.id}>
              <div className="p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="mb-1">Order #{order.id}</h3>
                    <p className="text-stone-600 text-sm">
                      Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-red-600">${order.total.toFixed(2)}</div>
                    <div className="text-sm text-stone-600 flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      {order.estimatedTime}
                    </div>
                  </div>
                </div>

                {/* Delivery Type Badge */}
                <div className="mb-6">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
                    order.deliveryType === 'delivery' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.deliveryType === 'delivery' ? (
                      <>
                        <Truck className="w-4 h-4" />
                        Delivery
                      </>
                    ) : (
                      <>
                        <Package className="w-4 h-4" />
                        Collection
                      </>
                    )}
                  </span>
                </div>

                {/* Status Timeline */}
                <div className="mb-6">
                  <h4 className="mb-4">Order Status</h4>
                  <div className="relative">
                    {/* Status Line */}
                    <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-stone-200"></div>
                    
                    {/* Status Steps */}
                    <div className="space-y-6 relative">
                      {statusSteps.map((status, index) => {
                        const isActive = statusSteps.indexOf(order.status) >= index;
                        const isCurrent = order.status === status;
                        
                        return (
                          <div key={status} className="flex items-center gap-4">
                            <div className={`relative z-10 ${isActive ? 'text-red-600' : 'text-stone-400'}`}>
                              {getStatusIcon(status, order.status)}
                            </div>
                            <div className="flex-1">
                              <div className={`${isCurrent ? 'text-red-600' : isActive ? 'text-stone-900' : 'text-stone-400'}`}>
                                {status}
                              </div>
                              {isCurrent && (
                                <div className="text-sm text-stone-600 mt-1">
                                  Current status
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="border-t border-stone-200 pt-4">
                  <h4 className="mb-3">Delivery Information</h4>
                  <div className="text-stone-600 space-y-1">
                    <p>{order.customerName}</p>
                    <p>{order.customerPhone}</p>
                    {order.deliveryAddress && <p>{order.deliveryAddress}</p>}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

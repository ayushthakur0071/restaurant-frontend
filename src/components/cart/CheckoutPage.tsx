import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useApp } from '../../context/AppContext';

export const CheckoutPage = () => {
  const { cart, clearCart, addOrder, currentUser } = useApp();
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'collection'>('delivery');
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const deliveryFee = deliveryType === 'delivery' ? 5 : 0;
  const total = subtotal + tax + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    addOrder({
      items: cart,
      total,
      status: 'Ordered',
      customerName: name,
      customerPhone: phone,
      deliveryAddress: deliveryType === 'delivery' ? address : undefined,
      deliveryType,
      estimatedTime: deliveryType === 'delivery' ? '45-60 mins' : '20-30 mins'
    });

    clearCart();
    setOrderPlaced(true);
  };

  if (cart.length === 0 && !orderPlaced) {
    window.location.hash = '/cart';
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="mb-4">Order Placed Successfully!</h2>
            <p className="text-stone-600 mb-8">
              Thank you for your order. We're preparing your delicious meal!
            </p>
            <div className="space-y-3">
              <Button onClick={() => window.location.hash = '/orders'} fullWidth>
                Track Your Order
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.location.hash = '/menu'}
                fullWidth
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Type */}
            <Card>
              <div className="p-6">
                <h3 className="mb-4">Delivery Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      deliveryType === 'delivery'
                        ? 'border-red-600 bg-red-50'
                        : 'border-stone-300 hover:border-red-600'
                    }`}
                  >
                    <div>Delivery</div>
                    <div className="text-sm text-stone-600 mt-1">45-60 mins</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('collection')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      deliveryType === 'collection'
                        ? 'border-red-600 bg-red-50'
                        : 'border-stone-300 hover:border-red-600'
                    }`}
                  >
                    <div>Collection</div>
                    <div className="text-sm text-stone-600 mt-1">20-30 mins</div>
                  </button>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card>
              <div className="p-6">
                <h3 className="mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-stone-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-stone-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {deliveryType === 'delivery' && (
                    <div>
                      <label htmlFor="address" className="block text-stone-700 mb-2">
                        Delivery Address
                      </label>
                      <textarea
                        id="address"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="123 Main St, Apt 4B"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card>
              <div className="p-6">
                <h3 className="mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-stone-300 rounded-lg cursor-pointer hover:border-red-600">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-stone-300 rounded-lg cursor-pointer hover:border-red-600">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>Cash on {deliveryType === 'delivery' ? 'Delivery' : 'Collection'}</span>
                  </label>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <div className="p-6">
                <h3 className="mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-stone-600">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-stone-700">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-200 pt-3 space-y-2 mb-6">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {deliveryType === 'delivery' && (
                    <div className="flex justify-between text-stone-600">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-stone-200 pt-2 flex justify-between">
                    <span>Total</span>
                    <span className="text-red-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button type="submit" fullWidth>
                  Place Order
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useApp } from '../../context/AppContext';

export const ReservationPage = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reservationMade, setReservationMade] = useState(false);
  const { addReservation, currentUser } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addReservation({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      date,
      time,
      partySize
    });

    setReservationMade(true);
  };

  if (reservationMade) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="mb-4">Reservation Submitted!</h2>
            <p className="text-stone-600 mb-8">
              Thank you for your reservation request. We'll confirm your booking shortly via email or phone.
            </p>
            <div className="bg-stone-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="mb-4">Reservation Details</h3>
              <div className="space-y-2 text-stone-700">
                <p><span className="text-stone-600">Name:</span> {name}</p>
                <p><span className="text-stone-600">Date:</span> {new Date(date).toLocaleDateString()}</p>
                <p><span className="text-stone-600">Time:</span> {time}</p>
                <p><span className="text-stone-600">Party Size:</span> {partySize} {partySize === 1 ? 'guest' : 'guests'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <Button onClick={() => window.location.hash = '/'} fullWidth>
                Back to Home
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setReservationMade(false);
                  setDate('');
                  setTime('');
                  setName('');
                  setEmail('');
                  setPhone('');
                }}
                fullWidth
              >
                Make Another Reservation
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="mb-4">Reserve Your Table</h1>
        <p className="text-stone-600">
          Book a table for an unforgettable dining experience at The Griller.
        </p>
      </div>

      <Card>
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <label htmlFor="date" className="block text-stone-700 mb-2">
                  <Calendar className="w-5 h-5 inline mr-2" />
                  Select Date
                </label>
                <input
                  id="date"
                  type="date"
                  required
                  min={minDate}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label htmlFor="time" className="block text-stone-700 mb-2">
                  <Clock className="w-5 h-5 inline mr-2" />
                  Select Time
                </label>
                <select
                  id="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Choose a time</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              {/* Party Size */}
              <div>
                <label htmlFor="partySize" className="block text-stone-700 mb-2">
                  <Users className="w-5 h-5 inline mr-2" />
                  Number of Guests
                </label>
                <select
                  id="partySize"
                  required
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-stone-600 mt-2">
                  For parties larger than 10, please call us at (555) 123-4567
                </p>
              </div>

              {/* Contact Information */}
              <div className="border-t border-stone-200 pt-6">
                <h3 className="mb-4">Your Information</h3>
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
                    <label htmlFor="email" className="block text-stone-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      placeholder="you@example.com"
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
                </div>
              </div>

              <Button type="submit" fullWidth>
                Confirm Reservation
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Additional Info */}
      <div className="mt-8 text-center text-stone-600">
        <p className="mb-2">
          Reservations are held for 15 minutes. Please contact us if you're running late.
        </p>
        <p>
          For same-day reservations, please call us at (555) 123-4567
        </p>
      </div>
    </div>
  );
};

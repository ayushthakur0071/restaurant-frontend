import React, { useEffect, useState } from 'react';
import { ChefHat, Clock, Award, Star, Flame, MapPin, PhoneCall, Smartphone } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { MenuItem } from '../../data/menuData';

type ApiMenuItem = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  category: string;
  image_url: string;
  is_vegetarian: 0 | 1;
  is_vegan: 0 | 1;
  is_spicy: 0 | 1;
  allergens: string | null;
  calories: number | null;
  protein: string | null;
  carbs: string | null;
  fat: string | null;
};

function mapApiToMenuItem(row: ApiMenuItem): MenuItem {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description ?? '',
    price: typeof row.price === 'string' ? parseFloat(row.price) : row.price,
    category: row.category as MenuItem['category'],
    image: row.image_url,
    isVegetarian: !!row.is_vegetarian,
    isVegan: !!row.is_vegan,
    isSpicy: !!row.is_spicy,
    allergens: row.allergens
      ? row.allergens
          .split(',')
          .map(a => a.trim())
          .filter(Boolean)
      : [],
    nutritionalInfo: {
      calories: row.calories ?? 0,
      protein: row.protein ?? '0g',
      carbs: row.carbs ?? '0g',
      fat: row.fat ?? '0g',
    },
    reviews: [],
  };
}

export const HomePage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [pageLoaded, setPageLoaded] = useState(false);


  const handleNavigation = (path: string) => {
    window.location.hash = path;
  };

  const testimonials = [
    {
      id: 1,
      name: 'Jessica Martinez',
      rating: 5,
      comment:
        "Best restaurant experience I've had in years! The food is exceptional and the service is impeccable.",
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
    {
      id: 2,
      name: 'Michael Brown',
      rating: 5,
      comment:
        'The online ordering system is so convenient and the food always arrives hot and fresh.',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    },
    {
      id: 3,
      name: 'Emily Davis',
      rating: 5,
      comment:
        'Amazing atmosphere, delicious food, and great value for money. Highly recommended!',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        setMenuError(null);
        const res = await fetch('https://restaurant-backend-u1nf.onrender.com/api/menu');
        if (!res.ok) {
          throw new Error('Failed to load menu');
        }
        const data: ApiMenuItem[] = await res.json();
        setMenuItems(data.map(mapApiToMenuItem));
      } catch (err: any) {
        console.error('[HomePage] Error fetching menu:', err);
        setMenuError(err.message ?? 'Failed to load menu');
      } finally {
        setLoadingMenu(false);
      }
    })();
  }, []);

  // Choose some featured items (same idea as old project using ids 1,3,4,8)
  const featuredItems = menuItems.filter(item =>
    ['1', '3', '4', '8'].includes(item.id),
  );

  // Pick one item as "today's highlight" if available
  const todaysHighlight = featuredItems[0] ?? menuItems[0];

  return (
    <div>
      {/* Hero Section — same as old UI */}
      <section className="relative h-[600px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/restaurant.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-white mb-4">Welcome to The Griller</h1>
            <p className="text-xl mb-8 text-white">
              Experience culinary excellence with our handcrafted dishes made
              from the finest ingredients
            </p>
            <div className="flex gap-4">
              <Button onClick={() => handleNavigation('/menu')}>
                Order Now
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/reservation')}
                className="!text-white !border-white hover:!bg-white hover:!text-red-600"
              >
                Reserve Table
              </Button>
            </div>
          </div>
        </div>
      </section>
     
     <section className="bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">

        {/* Opening Hours */}
        <div
          className={`group flex flex-col items-center text-center gap-2 py-3 px-2 rounded-xl 
            hover:bg-stone-50 hover:shadow-sm transition-all duration-200
            lg:border-r lg:border-stone-200
            ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          <Clock className="w-6 h-6 text-red-600 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />
          <p className="font-semibold text-stone-800">Opening Hours</p>
          <p className="text-stone-500">Mon–Sun: 11:00 AM – 11:00 PM</p>
        </div>

        {/* Visit Us */}
        <div
          className={`group flex flex-col items-center text-center gap-2 py-3 px-2 rounded-xl 
            hover:bg-stone-50 hover:shadow-sm transition-all duration-200
            lg:border-r lg:border-stone-200
            ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          <MapPin className="w-6 h-6 text-red-600 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />
          <p className="font-semibold text-stone-800">Visit Us</p>
          <p className="text-stone-500">Your City, Main Street 123</p>
        </div>

        {/* Call to Reserve */}
        <div
          className={`group flex flex-col items-center text-center gap-2 py-3 px-2 rounded-xl 
            hover:bg-stone-50 hover:shadow-sm transition-all duration-200
            lg:border-r lg:border-stone-200
            ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          <PhoneCall className="w-6 h-6 text-red-600 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />
          <p className="font-semibold text-stone-800">Call to Reserve</p>
          <p className="text-stone-500">+1 (555) 123-4567</p>
        </div>

        {/* Order Online */}
        <div
          className={`group flex flex-col items-center text-center gap-2 py-3 px-2 rounded-xl 
            hover:bg-stone-50 hover:shadow-sm transition-all duration-200
            ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          <Smartphone className="w-6 h-6 text-red-600 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />
          <p className="font-semibold text-stone-800">Order Online</p>
          <p className="text-stone-500">Fast, simple & secure</p>
        </div>

      </div>
    </section>

      {/* Features (same as old Home) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`text-center transform transition-all duration-500 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <ChefHat className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="mb-2">Expert Chefs</h3>
              <p className="text-stone-600">
                Our chefs bring years of experience and passion to every dish
                they create.
              </p>
            </div>
            
            <div
              className={`text-center transform transition-all duration-500 delay-100 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="mb-2">Fast Delivery</h3>
              <p className="text-stone-600">
                Enjoy your favorite meals delivered hot and fresh to your
                doorstep.
              </p>
            </div>

            <div
              className={`text-center transform transition-all duration-500 delay-200 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Award className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="mb-2">Award Winning</h3>
              <p className="text-stone-600">
                Recognized for excellence in both cuisine and customer service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Experience Cards Section */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="mb-2">Choose Your Experience</h2>
              <p className="text-stone-600">
                Whether you&apos;re dining in or ordering out, we&apos;ve got you covered.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              onClick={() => handleNavigation('/reservation')}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Flame className="w-6 h-6 text-red-600" />
                  <h3 className="mb-0">Dine-In Experience</h3>
                </div>
                <p className="text-stone-600 mb-3">
                  Perfect for family dinners, celebrations, and relaxed evenings with friends.
                </p>
                <p className="text-sm text-red-600 font-medium">
                  Reserve your table →
                </p>
              </div>
            </Card>

            <Card
              className="cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              onClick={() => handleNavigation('/menu')}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="w-6 h-6 text-red-600" />
                  <h3 className="mb-0">Order Online</h3>
                </div>
                <p className="text-stone-600 mb-3">
                  Browse our full menu and get your favorites delivered to your door.
                </p>
                <p className="text-sm text-red-600 font-medium">
                  Start your order →
                </p>
              </div>
            </Card>

            <Card
              className="cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              onClick={() => handleNavigation('/menu')}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ChefHat className="w-6 h-6 text-red-600" />
                  <h3 className="mb-0">Chef&apos;s Specials</h3>
                </div>
                <p className="text-stone-600 mb-3">
                  Discover seasonal dishes and limited-time specialties crafted by our chefs.
                </p>
                <p className="text-sm text-red-600 font-medium">
                  View specials →
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Menu Section — same layout, but data from backend */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="mb-2">Featured Dishes</h2>
              <p className="text-stone-600">
                Discover our chef&apos;s special selections
              </p>
            </div>

            {/* NEW: Today's Highlight (small pill) */}
            {todaysHighlight && (
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-100">
                <Flame className="w-4 h-4 text-red-600" />
                <span className="text-sm text-stone-700">
                  Today&apos;s highlight:{' '}
                  <span className="font-semibold">{todaysHighlight.name}</span>
                </span>
                <button
                  onClick={() => handleNavigation(`/menu/${todaysHighlight.id}`)}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  View dish
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingMenu && (
              <p className="col-span-full text-center text-stone-500">
                Loading featured dishes...
              </p>
            )}

            {!loadingMenu && menuError && (
              <p className="col-span-full text-center text-red-600">
                Failed to load menu. Please try again later.
              </p>
            )}

            {!loadingMenu &&
              !menuError &&
              featuredItems.map(item => (
                <Card
                  key={item.id}
                  onClick={() => handleNavigation(`/menu/${item.id}`)}
                  className="cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                >
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2">{item.name}</h3>
                    <p className="text-stone-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-red-600">
                        £{item.price.toFixed(2)}
                      </span>
                      <Button
                        onClick={e => {
                          e.stopPropagation();
                          handleNavigation(`/menu/${item.id}`);
                        }}
                        className="!py-2 !px-4"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>

          <div className="text-center mt-8">
            <Button onClick={() => handleNavigation('/menu')}>
              View Full Menu
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials — copied from old HomePage */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-2">What Our Customers Say</h2>
            <p className="text-stone-600">
              Real reviews from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <Card key={testimonial.id}>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4>{testimonial.name}</h4>
                      <div className="flex gap-1 mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-stone-600 italic">
                    &quot;{testimonial.comment}&quot;
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section — same as old */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-4">
            Ready to Experience The Griller?
          </h2>
          <p className="text-xl mb-8 text-white">
            Order now or reserve your table for an unforgettable dining
            experience
          </p>
          <div className="flex justify-center gap-4">
            <Button 
             variant="ghost" 
             onClick={() => handleNavigation('/menu')}
             className="!text-white !border-white hover:!bg-white hover:!text-red-600"
            >
              Order Online
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/reservation')}
              className="!text-white !border-white hover:!bg-white hover:!text-red-600"
            >
              Book a Table
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

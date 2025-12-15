import React, { useEffect, useState } from 'react';
import { ArrowLeft, Minus, Plus, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { MenuItem } from '../../data/menuData';
import { useApp } from '../../context/AppContext';

interface MenuItemDetailProps {
  itemId: string;
}

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

// Convert DB → Frontend structure
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
      ? row.allergens.split(',').map(a => a.trim()).filter(Boolean)
      : [],
    nutritionalInfo: {
      calories: row.calories ?? 0,
      protein: row.protein ?? '0g',
      carbs: row.carbs ?? '0g',
      fat: row.fat ?? '0g',
    },
    reviews: [], // DB does not have reviews yet
  };
}

export const MenuItemDetail = ({ itemId }: MenuItemDetailProps) => {
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useApp();

  // Fetch from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`https://restaurant-backend-u1nf.onrender.com/api/menu`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const allItems = (await res.json()) as ApiMenuItem[];
        const foundItem = allItems.find(i => String(i.id) === itemId);

        if (!foundItem) {
          setError('Item not found');
        } else {
          setItem(mapApiToMenuItem(foundItem));
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load item from database.');
      } finally {
        setLoading(false);
      }
    })();
  }, [itemId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p>Loading item...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-red-600">{error || 'Item not found'}</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(item);
    alert(`${quantity} × ${item.name} added to cart!`);
    window.location.hash = '/menu';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => (window.location.hash = '/menu')}
        className="flex items-center gap-2 text-stone-600 hover:text-red-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Menu
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image */}
        <div className="rounded-xl overflow-hidden">
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-[500px] object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="mb-2">{item.name}</h1>
            </div>

            <div className="text-red-600 text-3xl">
              £{item.price.toFixed(2)}
            </div>
          </div>

          <p className="text-stone-600 mb-6">{item.description}</p>

          <div className="space-y-4 mb-6">
            {/* Tags */}
            <div className="flex gap-2">
              {item.isVegetarian && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg">
                  Vegetarian
                </span>
              )}
              {item.isVegan && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg">
                  Vegan
                </span>
              )}
              {item.isSpicy && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-lg">
                  Spicy
                </span>
              )}
            </div>

            {/* Allergens */}
            {item.allergens.length > 0 && (
              <div>
                <h3 className="mb-2">Allergens</h3>
                <p className="text-stone-600">{item.allergens.join(', ')}</p>
              </div>
            )}

            {/* Nutrition */}
            <div>
              <h3 className="mb-2">Nutritional Information</h3>
              <div className="grid grid-cols-2 gap-2 text-stone-600">
                <div>Calories: {item.nutritionalInfo.calories}</div>
                <div>Protein: {item.nutritionalInfo.protein}</div>
                <div>Carbs: {item.nutritionalInfo.carbs}</div>
                <div>Fat: {item.nutritionalInfo.fat}</div>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border-2 border-stone-300 flex items-center justify-center hover:border-red-600"
              >
                <Minus className="w-5 h-5" />
              </button>

              <span className="text-xl w-12 text-center">{quantity}</span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border-2 border-stone-300 flex items-center justify-center hover:border-red-600"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <Button onClick={handleAddToCart} fullWidth>
            Add to Cart — £{(item.price * quantity).toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
};

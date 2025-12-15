import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { MenuItem } from '../../data/menuData';
import { useApp } from '../../context/AppContext';

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
      ? row.allergens.split(',').map(a => a.trim()).filter(Boolean)
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

export const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    spicy: false,
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);

  const { addToCart } = useApp();

  const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Drinks'];

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://restaurant-backend-u1nf.onrender.com/api/menu");
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        const data = (await res.json()) as ApiMenuItem[];
        const mapped = data.map(mapApiToMenuItem);
        setMenuItems(mapped);
      } catch (err) {
        console.error('[MenuPage] Error fetching menu:', err);
        setMenuError('Failed to load menu from database.');
      } finally {
        setLoadingMenu(false);
      }
    })();
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilters =
      (!filters.vegetarian || item.isVegetarian) &&
      (!filters.vegan || item.isVegan) &&
      (!filters.spicy || item.isSpicy);

    return matchesCategory && matchesSearch && matchesFilters;
  });

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Our Menu</h1>
        <p className="text-stone-600">
          Explore our delicious selection of dishes
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setFilters({ ...filters, vegetarian: !filters.vegetarian })
              }
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                filters.vegetarian
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-stone-300 text-stone-700 hover:border-green-600'
              }`}
            >
              Vegetarian
            </button>
            <button
              onClick={() => setFilters({ ...filters, vegan: !filters.vegan })}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                filters.vegan
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-stone-300 text-stone-700 hover:border-green-600'
              }`}
            >
              Vegan
            </button>
            <button
              onClick={() =>
                setFilters({ ...filters, spicy: !filters.spicy })
              }
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                filters.spicy
                  ? 'bg-red-600 text-white border-red-600'
                  : 'border-stone-300 text-stone-700 hover:border-red-600'
              }`}
            >
              Spicy
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-stone-700 hover:bg-red-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loadingMenu && (
        <p className="text-center text-stone-500 py-8">Loading menu...</p>
      )}

      {menuError && (
        <p className="text-center text-red-600 py-2">{menuError}</p>
      )}

      {!loadingMenu && !menuError && (
        <>
          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <Card key={item.id}>
                <div
                  className="aspect-square overflow-hidden cursor-pointer"
                  onClick={() => (window.location.hash = `/menu/${item.id}`)}
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="flex-1">{item.name}</h3>
                    <span className="text-red-600 ml-2">
                      £{item.price ? item.price.toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <p className="text-stone-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex gap-2 mb-3">
                    {item.isVegetarian && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Vegetarian
                      </span>
                    )}
                    {item.isVegan && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Vegan
                      </span>
                    )}
                    {item.isSpicy && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Spicy
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        (window.location.hash = `/menu/${item.id}`)
                      }
                      variant="ghost"
                      className="flex-1 !py-2"
                    >
                      Details
                    </Button>
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 !py-2"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-600">
                No items found matching your criteria
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

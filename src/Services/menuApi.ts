// src/services/menuApi.ts
import type { MenuItem } from '../data/menuData';

// This is the shape coming from your Node + MySQL API
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

// Convert DB row → your frontend MenuItem type
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
    // You don't have reviews in DB yet → empty array for now
    reviews: [],
  };
}

export async function fetchMenu(): Promise<MenuItem[]> {
  const res = await fetch('https://restaurant-backend-u1nf.onrender.com/api/menu');

  if (!res.ok) {
    throw new Error('Failed to fetch menu');
  }

  const data = (await res.json()) as ApiMenuItem[];
  return data.map(mapApiToMenuItem);
}

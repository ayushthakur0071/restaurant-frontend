export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Starters' | 'Main Course' | 'Desserts' | 'Drinks';
  image: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  reviews: {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

/* export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with fresh lettuce, tomato, and our special sauce',
    price: 12.99,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1627378378955-a3f4e406c5de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    allergens: ['Gluten', 'Dairy'],
    nutritionalInfo: {
      calories: 650,
      protein: '28g',
      carbs: '45g',
      fat: '35g'
    },
    reviews: [
      {
        id: 'r1',
        userName: 'John Doe',
        rating: 5,
        comment: 'Best burger in town! Perfectly cooked.',
        date: '2025-11-20'
      },
      {
        id: 'r2',
        userName: 'Sarah Miller',
        rating: 4,
        comment: 'Delicious, but a bit too much sauce for my taste.',
        date: '2025-11-18'
      }
    ]
  },
  {
    id: '2',
    name: 'Creamy Carbonara',
    description: 'Traditional Italian pasta with bacon, eggs, and parmesan',
    price: 15.99,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1712746784067-e9e1bd86c043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    nutritionalInfo: {
      calories: 720,
      protein: '32g',
      carbs: '68g',
      fat: '38g'
    },
    reviews: [
      {
        id: 'r3',
        userName: 'Maria Garcia',
        rating: 5,
        comment: 'Authentic Italian flavor!',
        date: '2025-11-22'
      }
    ]
  },
  {
    id: '3',
    name: 'Grilled Ribeye Steak',
    description: 'Premium ribeye steak grilled to perfection with seasonal vegetables',
    price: 28.99,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1657143378504-681ac84e7b30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    allergens: [],
    nutritionalInfo: {
      calories: 580,
      protein: '48g',
      carbs: '12g',
      fat: '38g'
    },
    reviews: [
      {
        id: 'r4',
        userName: 'David Chen',
        rating: 5,
        comment: 'Cooked to perfection, medium rare as requested!',
        date: '2025-11-25'
      }
    ]
  },
  {
    id: '4',
    name: 'Sushi Platter',
    description: 'Assorted fresh sushi with salmon, tuna, and avocado rolls',
    price: 24.99,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1625937751876-4515cd8e78bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    allergens: ['Fish', 'Soy'],
    nutritionalInfo: {
      calories: 450,
      protein: '35g',
      carbs: '52g',
      fat: '12g'
    },
    reviews: [
      {
        id: 'r5',
        userName: 'Lisa Wong',
        rating: 5,
        comment: 'Super fresh fish! Will order again.',
        date: '2025-11-21'
      }
    ]
  },
  {
    id: '5',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, basil, and tomato sauce',
    price: 13.99,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    allergens: ['Gluten', 'Dairy'],
    nutritionalInfo: {
      calories: 520,
      protein: '22g',
      carbs: '58g',
      fat: '22g'
    },
    reviews: []
  },
  {
    id: '6',
    name: 'Fresh Garden Salad',
    description: 'Mixed greens with cherry tomatoes, cucumber, and balsamic vinaigrette',
    price: 8.99,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    allergens: [],
    nutritionalInfo: {
      calories: 120,
      protein: '3g',
      carbs: '15g',
      fat: '6g'
    },
    reviews: []
  },
  {
    id: '7',
    name: 'Tomato Basil Soup',
    description: 'Creamy tomato soup with fresh basil and croutons',
    price: 6.99,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1623073284788-0d846f75e329?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    allergens: ['Dairy', 'Gluten'],
    nutritionalInfo: {
      calories: 180,
      protein: '4g',
      carbs: '22g',
      fat: '8g'
    },
    reviews: []
  },
  {
    id: '8',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    price: 7.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    nutritionalInfo: {
      calories: 420,
      protein: '6g',
      carbs: '48g',
      fat: '24g'
    },
    reviews: [
      {
        id: 'r6',
        userName: 'Emma Taylor',
        rating: 5,
        comment: 'Heavenly dessert! The lava center is perfect.',
        date: '2025-11-26'
      }
    ]
  },
  {
    id: '9',
    name: 'Fluffy Pancakes',
    description: 'Stack of fluffy pancakes with maple syrup and fresh berries',
    price: 9.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1636743713732-125909a35dcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    nutritionalInfo: {
      calories: 380,
      protein: '8g',
      carbs: '62g',
      fat: '12g'
    },
    reviews: []
  },
  {
    id: '10',
    name: 'Signature Cocktails',
    description: 'Choose from our selection of handcrafted cocktails',
    price: 11.99,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1650691960684-c15e3e2d5c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    allergens: [],
    nutritionalInfo: {
      calories: 200,
      protein: '0g',
      carbs: '18g',
      fat: '0g'
    },
    reviews: []
  }
];

export const featuredItems = menuItems.filter(item => 
  ['1', '3', '4', '8'].includes(item.id)
);
 */
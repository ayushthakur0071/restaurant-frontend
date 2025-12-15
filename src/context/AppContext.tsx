import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { MenuItem } from '../data/menuData';

// --------------------
// API TYPES
// --------------------
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
    description: row.description ?? "",
    price: typeof row.price === "string" ? parseFloat(row.price) : row.price,
    category: row.category as MenuItem["category"],
    image: row.image_url,
    isVegetarian: !!row.is_vegetarian,
    isVegan: !!row.is_vegan,
    isSpicy: !!row.is_spicy,
    allergens: row.allergens
      ? row.allergens.split(",").map(a => a.trim()).filter(Boolean)
      : [],
    nutritionalInfo: {
      calories: row.calories ?? 0,
      protein: row.protein ?? "0g",
      carbs: row.carbs ?? "0g",
      fat: row.fat ?? "0g",
    },
    reviews: [],
  };
}

// --------------------
// CONTEXT TYPES
// --------------------
interface CartItem extends MenuItem {
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Ordered' | 'Preparing' | 'Ready' | 'Out for delivery' | 'Completed';
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  deliveryType: 'delivery' | 'collection';
  createdAt: string;
  estimatedTime: string;
}

interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  partySize: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'staff' | 'admin';
  phone?: string;
}

interface AppContextType {
  // MENU
  menu: MenuItem[];
  loadingMenu: boolean;
  errorMenu: string | null;

  // CART
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // ORDERS
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // RESERVATIONS
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'status'>) => void;
  updateReservationStatus: (reservationId: string, status: Reservation['status']) => void;

  // AUTH
  currentUser: User | null;
  authToken: string | null;
  login: (email: string, password: string, role: User['role']) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --------------------
// PROVIDER
// --------------------
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // MENU DATA
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [errorMenu, setErrorMenu] = useState<string | null>(null);

  // FETCH MENU ON LOAD
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://restaurant-backend-u1nf.onrender.com/api/menu");
        if (!res.ok) throw new Error("Failed to fetch");

        const data = (await res.json()) as ApiMenuItem[];
        setMenu(data.map(mapApiToMenuItem));
      } catch (err) {
        console.error(err);
        setErrorMenu("Failed to load menu from database");
      } finally {
        setLoadingMenu(false);
      }
    })();
  }, []);

  // --------------------
  // CART LOGIC
  // --------------------
  const [cart, setCart] = useState<CartItem[]>([]);
  const addToCart = (item: MenuItem) => {
    setCart(prev =>
      prev.some(c => c.id === item.id)
        ? prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
        : [...prev, { ...item, quantity: 1 }]
    );
  };

  const removeFromCart = (id: string) =>
    setCart(prev => prev.filter(i => i.id !== id));

  const updateCartItemQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCart([]);

  // --------------------
  // ORDERS / RESERVATIONS
  // --------------------
  const [orders, setOrders] = useState<Order[]>([]);
  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) =>
    setOrders(prev => [...prev, { ...order, id: "ORD" + Date.now(), createdAt: new Date().toISOString() }]);

  const updateOrderStatus = (id: string, status: Order['status']) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const addReservation = (r: Omit<Reservation, 'id' | 'status'>) =>
    setReservations(prev => [...prev, { ...r, id: "RES" + Date.now(), status: "pending" }]);

  const updateReservationStatus = (id: string, status: Reservation['status']) =>
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  // --------------------
  // AUTH
  // --------------------
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('authToken');
  });

  // Restore user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const login = async (email: string, password: string, role: User['role']) => {
    try {
      const res = await fetch('https://restaurant-backend-u1nf.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Login failed');
        return false;
      }

      const data = await res.json();

      const user: User = {
        id: String(data.user.id),
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        phone: data.user.phone ?? undefined,
      };

      setCurrentUser(user);
      setAuthToken(data.token);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(user));

      return true;
    } catch (err) {
      console.error('Login error', err);
      alert('Unable to connect to server');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await fetch('https://restaurant-backend-u1nf.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Registration failed');
        return false;
      }

      const data = await res.json();

      const user: User = {
        id: String(data.user.id),
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        phone: data.user.phone ?? undefined,
      };

      setCurrentUser(user);
      setAuthToken(data.token);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(user));

      return true;
    } catch (err) {
      console.error('Register error', err);
      alert('Unable to connect to server');
      return false;
    }
  };

  // --------------------
  // PROVIDE VALUES
  // --------------------
  return (
    <AppContext.Provider
      value={{
        menu,
        loadingMenu,
        errorMenu,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        orders,
        addOrder,
        updateOrderStatus,
        reservations,
        addReservation,
        updateReservationStatus,
        currentUser,
        authToken,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};

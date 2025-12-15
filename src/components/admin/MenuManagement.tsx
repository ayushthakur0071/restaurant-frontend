import React, { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Plus, Edit, Trash2, X } from "lucide-react";
import type { MenuItem } from "../../data/menuData";
import { useApp } from "../../context/AppContext";

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
    description: row.description ?? "",
    price: typeof row.price === "string" ? parseFloat(row.price) : row.price,
    category: row.category as MenuItem["category"],
    image: row.image_url,
    isVegetarian: !!row.is_vegetarian,
    isVegan: !!row.is_vegan,
    isSpicy: !!row.is_spicy,
    allergens: row.allergens ? row.allergens.split(",") : [],
    nutritionalInfo: {
      calories: row.calories ?? 0,
      protein: row.protein ?? "0g",
      carbs: row.carbs ?? "0g",
      fat: row.fat ?? "0g",
    },
    reviews: [],
  };
}

export const MenuManagement = () => {
  const { authToken } = useApp();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main Course" as MenuItem["category"],
    image: "",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
  });

  // Load menu from DB
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const res = await fetch("https://restaurant-backend-u1nf.onrender.com/api/menu");
        if (!res.ok) {
          throw new Error("Failed to load menu");
        }
        const data: ApiMenuItem[] = await res.json();
        setMenuItems(data.map(mapApiToMenuItem));
      } catch (err: any) {
        console.error("[MenuManagement] Error fetching menu:", err);
        setError(err.message ?? "Failed to load menu");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Main Course",
      image: "",
      isVegetarian: false,
      isVegan: false,
      isSpicy: false,
    });
    setShowModal(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isSpicy: item.isSpicy,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!authToken) {
      alert("You are not authorized to delete menu items");
      return;
    }

    if (!confirm("Delete this menu item?")) return;

    const res = await fetch(`https://restaurant-backend-u1nf.onrender.com/api/menu/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`, // ✅ send token
      },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to delete menu item");
      return;
    }

    setMenuItems(menuItems.filter((item) => item.id !== id));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authToken) {
      alert("You are not authorized to manage the menu");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image_url: formData.image,
      is_vegetarian: formData.isVegetarian ? 1 : 0,
      is_vegan: formData.isVegan ? 1 : 0,
      is_spicy: formData.isSpicy ? 1 : 0,
    };

    try {
      if (editingItem) {
        // ✅ UPDATE item
        const res = await fetch(
          `https://restaurant-backend-u1nf.onrender.com/api/menu/${editingItem.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data.error || "Failed to update item");
          return;
        }

        setMenuItems(
          menuItems.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  ...mapApiToMenuItem({
                    id: Number(item.id),
                    ...payload,
                  } as any),
                }
              : item
          )
        );
      } else {
        // ✅ ADD item
        const res = await fetch("https://restaurant-backend-u1nf.onrender.com/api/menu", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data.error || "Failed to create menu item");
          return;
        }

        const newRow = (await res.json()) as ApiMenuItem;
        setMenuItems([...menuItems, mapApiToMenuItem(newRow)]);
      }

      setShowModal(false);
    } catch (err) {
      console.error("[MenuManagement] submit error:", err);
      alert("Something went wrong while saving the menu item");
    }
  };


  if (loading) return <p>Loading menu...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1>Menu Management</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New Item
        </Button>
      </div>

      {/* Menu Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Tags</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {menuItems.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50">
                  <td className="px-6 py-3">
                    <ImageWithFallback
                      src={item.image}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </td>

                  <td className="px-6 py-3">
                    <div>{item.name}</div>
                  </td>

                  <td className="px-6 py-3">{item.category}</td>

                  <td className="px-6 py-3">£{item.price.toFixed(2)}</td>

                  <td className="px-6 py-3">
                    {item.isVegetarian && <span className="bg-green-100 px-2 py-1 text-xs">Veg</span>}
                    {item.isVegan && <span className="bg-green-100 px-2 py-1 text-xs">Vegan</span>}
                    {item.isSpicy && <span className="bg-red-100 px-2 py-1 text-xs">Spicy</span>}
                  </td>

                  <td className="px-6 py-3 flex gap-3">
                    <button onClick={() => handleEdit(item)} className="text-blue-600">
                      <Edit />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600">
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2>{editingItem ? "Edit Item" : "Add New Item"}</h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">

                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label>Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as MenuItem["category"] })
                    }
                    className="w-full border p-2 rounded"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>

                <div>
                  <label>Image URL</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isVegetarian}
                      onChange={(e) =>
                        setFormData({ ...formData, isVegetarian: e.target.checked })
                      }
                    />{" "}
                    Vegetarian
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isVegan}
                      onChange={(e) =>
                        setFormData({ ...formData, isVegan: e.target.checked })
                      }
                    />{" "}
                    Vegan
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isSpicy}
                      onChange={(e) =>
                        setFormData({ ...formData, isSpicy: e.target.checked })
                      }
                    />{" "}
                    Spicy
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" fullWidth>
                    {editingItem ? "Update" : "Add"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                </div>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

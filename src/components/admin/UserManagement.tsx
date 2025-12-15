import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'staff' | 'admin';
  phone?: string;
  joinedDate: string; // mapped from created_at in DB
}

interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'staff' | 'admin';
  phone: string | null;
  created_at: string;
}

export const UserManagement = () => {
  const { authToken } = useApp();

  const [users, setUsers] = useState<User[]>([]); // 🔹 no more hardcoded users
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'customer' as 'customer' | 'staff' | 'admin',
    phone: ''
  });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 🔹 Load users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      if (!authToken) {
        setLoadError('You are not authorized');
        setLoading(false);
        return;
      }

      try {
        setLoadError(null);
        const res = await fetch('https://restaurant-backend-u1nf.onrender.com/api/admin/users', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to load users');
        }

        const data: ApiUser[] = await res.json();

        const mapped: User[] = data.map(u => ({
          id: String(u.id),
          name: u.name,
          email: u.email,
          role: u.role,
          phone: u.phone || undefined,
          joinedDate: u.created_at, // use DB timestamp
        }));

        setUsers(mapped);
      } catch (err: any) {
        console.error('[Admin Users] fetch error:', err);
        setLoadError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authToken]);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddNew = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'customer',
      phone: ''
    });
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!authToken) return;
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`https://restaurant-backend-u1nf.onrender.com/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.status === 204) {
        setUsers(prev => prev.filter(user => user.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete user');
      }
    } catch (err) {
      console.error('[Admin Users] delete error:', err);
      alert('Failed to delete user');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    // Editing existing user → update in DB
    if (editingUser) {
      try {
        const res = await fetch(
          `https://restaurant-backend-u1nf.onrender.com/api/admin/users/${editingUser.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone || null,
              role: formData.role,
            }),
          }
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data.error || 'Failed to update user');
          return;
        }

        const updated: ApiUser = await res.json();

        const mappedUser: User = {
          id: String(updated.id),
          name: updated.name,
          email: updated.email,
          role: updated.role,
          phone: updated.phone || undefined,
          joinedDate: updated.created_at,
        };

        setUsers(prev =>
          prev.map(u => (u.id === mappedUser.id ? mappedUser : u))
        );

        setShowModal(false);
      } catch (err) {
        console.error('[Admin Users] update error:', err);
        alert('Failed to update user');
      }
    } else {
      // Adding new users from this panel is not yet hooked to backend.
      // We keep the UI the same but avoid fake, non-persistent data.
      alert(
        'Creating new users from the Admin panel is not supported yet.\n\n' +
        '- Customers should sign up from the Sign Up page.\n' +
        '- Staff/Admin accounts are predefined in the system.'
      );
      // Keep modal open so they can cancel or edit.
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'staff':
        return 'bg-blue-100 text-blue-800';
      case 'customer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1>User Management</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New User
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
        >
          <option value="All">All Roles</option>
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          {loadError && (
            <div className="text-red-600 px-6 py-4">
              {loadError}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-stone-600">
              Loading users...
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-stone-700">Name</th>
                    <th className="px-6 py-3 text-left text-stone-700">Email</th>
                    <th className="px-6 py-3 text-left text-stone-700">Phone</th>
                    <th className="px-6 py-3 text-left text-stone-700">Role</th>
                    <th className="px-6 py-3 text-left text-stone-700">Joined Date</th>
                    <th className="px-6 py-3 text-left text-stone-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-stone-50">
                      <td className="px-6 py-4">
                        <div>{user.name}</div>
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        {user.phone || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm capitalize ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        {new Date(user.joinedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && !loadError && (
                <div className="text-center py-12 text-stone-600">
                  No users found
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
                <button onClick={() => setShowModal(false)} className="text-stone-600 hover:text-stone-900">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-stone-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 mb-2">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 mb-2">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    >
                      <option value="customer">Customer</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" fullWidth>
                      {editingUser ? 'Update User' : 'Add User'}
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
        </div>
      )}
    </div>
  );
};

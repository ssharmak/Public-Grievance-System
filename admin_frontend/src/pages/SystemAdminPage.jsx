/**
 * @file SystemAdminPage.jsx
 * @description Page for Super Admin tasks (e.g., managing user roles and categories).
 * Currently uses mock data for demonstration purposes as full admin management backend is in Phase 2.
 */

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Plus, Trash2, Edit } from 'lucide-react';

const MOCK_USERS = [
  { id: 'u1', name: 'Official One', role: 'official', categories: ['water'] },
  { id: 'u2', name: 'Official Two', role: 'official', categories: ['electricity'] },
];

const MOCK_CATEGORIES = [
  { id: 'c1', name: 'Water' },
  { id: 'c2', name: 'Electricity' },
  { id: 'c3', name: 'Sanitation' },
];

const SystemAdminPage = () => {
  const { isSuperAdmin } = useAuth();
  
  // State for mock management
  const [users, setUsers] = useState(MOCK_USERS);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [newCategory, setNewCategory] = useState('');

  // Protect route: Only Super Admins allowed
  if (!isSuperAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  /**
   * Add Category Handler (Mock)
   */
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const newItem = { id: `c${categories.length + 1}`, name: newCategory };
    setCategories([...categories, newItem]);
    setNewCategory('');
  };

  return (
    <div className="container">
      <h1 className="text-2xl mb-6">System Administration</h1>

      <div className="grid-cols-2">
        {/* User Management Section */}
        <div className="card">
          <h2 className="text-xl mb-4">User Role Management</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Categories</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>
                    <select className="input" defaultValue={u.role} style={{ padding: '0.25rem' }}>
                      <option value="official">Official</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td>{u.categories.join(', ')}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.25rem' }}>
                      <Edit size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Category Management Section */}
        <div className="card">
          <h2 className="text-xl mb-4">Category Management</h2>
          <form onSubmit={handleAddCategory} className="flex gap-4 mb-4">
            <input 
              type="text" 
              className="input" 
              placeholder="New Category Name" 
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <Plus size={16} style={{ marginRight: '4px' }} /> Add
            </button>
          </form>

          <div className="flex" style={{ flexDirection: 'column', gap: '0.5rem' }}>
            {categories.map(c => (
              <div key={c.id} className="flex justify-between items-center" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '0.75rem' }}>
                <span>{c.name}</span>
                <button className="btn" style={{ color: 'var(--danger-color)' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminPage;

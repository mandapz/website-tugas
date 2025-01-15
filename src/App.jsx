import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

export default function CRUDApp() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost/crud-api/read.php');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing ? 'http://localhost/crud-api/update.php' : 'http://localhost/crud-api/create.php';
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setFormData({ id: '', name: '', email: '', phone: '' });
        setIsEditing(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch('http://localhost/crud-api/delete.php', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Webinar Data Registration
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Name"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition duration-200 flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} />
            {isEditing ? 'Update Data' : 'Add New Data'}
          </button>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-center">Name</th>
                <th className="p-3 text-center">Email</th>
                <th className="p-3 text-center">Phone</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.email}</td>
                  <td className="p-3">{item.phone}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="mr-2 text-blue-600 hover:text-blue-800 edit-button"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 delete-button"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
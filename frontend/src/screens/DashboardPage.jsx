import React, { useState, useEffect } from 'react';
import config from '../constants.js';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRestaurant, setNewRestaurant] = useState({ name: '', description: '', address: '', cuisine: 'Other' });

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const response = await manifest.from('Restaurant').find({ include: ['owner'], sort: { createdAt: 'desc' } });
      setRestaurants(response.data);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const created = await manifest.from('Restaurant').create(newRestaurant);
      setRestaurants([created, ...restaurants]);
      setNewRestaurant({ name: '', description: '', address: '', cuisine: 'Other' });
    } catch (error) {
      console.error('Failed to create restaurant:', error);
      alert('Could not create restaurant.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">FlavorFind Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user.name}!</span>
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">
              Admin
            </a>
            <button onClick={onLogout} className="text-sm font-medium bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add a New Restaurant</h2>
          <form onSubmit={handleCreateRestaurant} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <input type="text" placeholder="Restaurant Name" value={newRestaurant.name} onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 md:col-span-1" />
            <input type="text" placeholder="Address" value={newRestaurant.address} onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 md:col-span-1" />
            <select value={newRestaurant.cuisine} onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white md:col-span-1">
              <option>Italian</option><option>Mexican</option><option>Japanese</option><option>Indian</option><option>American</option><option>Other</option>
            </select>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 md:col-span-1">Add Restaurant</button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurants</h2>
          {loading ? (
            <p className="text-gray-500">Loading restaurants...</p>
          ) : restaurants.length === 0 ? (
            <p className="text-gray-500">No restaurants found. Be the first to add one!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map(restaurant => (
                <div key={restaurant.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800">{restaurant.name}</h3>
                    <p className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full inline-block mt-1 mb-2">{restaurant.cuisine}</p>
                    <p className="text-gray-600 text-sm mb-2">{restaurant.address}</p>
                    <p className="text-gray-500 text-xs">Owner: {restaurant.owner?.name || 'Unknown'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

import React, { useState } from 'react';

export default function AdminDashboard() {
  // Mock Data
  const [users] = useState([
    { id: 1, role: 'Farmer', name: 'Rajesh Kumar', mobile: '9876543210', extra: 'Crop: Rice, 50 Tons' },
    { id: 2, role: 'Buyer', name: 'AgriCorp', mobile: '9988776655', extra: 'GST: 22AAAAA0000A1Z5 (Verified)' },
    { id: 3, role: 'Consumer', name: 'Anita Sharma', mobile: 'user@gmail.com', extra: 'Verified via Google' },
  ]);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Additional Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.role === 'Farmer' ? 'bg-green-100 text-green-800' : 
                      user.role === 'Buyer' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.mobile}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{user.extra}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">View Files</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

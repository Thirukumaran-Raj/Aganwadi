import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State to hold the children data and loading status
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch children from the database when the dashboard loads
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await api.get('/children');
        setChildren(response.data);
      } catch (err) {
        setError('Failed to fetch children data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchChildren();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="p-8 text-center">Please log in to view this page.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Anganwadi Portal</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Hello, {user.name}</span>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-bold transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto p-6 mt-8">
        
        {/* UPDATED: Flex container holding all three buttons */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Dashboard Overview</h2>
          <div className="flex gap-4 flex-wrap justify-end">
            <button 
              onClick={() => navigate('/attendance')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold transition shadow-sm"
            >
              📝 Daily Tracker
            </button>
            <button 
              onClick={() => navigate('/inventory')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition shadow-sm"
            >
              Manage Inventory
            </button>
            <button 
              onClick={() => navigate('/add-child')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition shadow-sm"
            >
              + Register New Child
            </button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-700">Total Children</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {loading ? '...' : children.length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-700">Health Logs Today</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">0</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-700">Your Role</h3>
            <p className="text-xl font-medium text-purple-600 mt-2 capitalize">{user.role}</p>
          </div>
        </div>

        {/* Children Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800">Registered Beneficiaries</h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading data...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : children.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No children registered yet. Click the green button above to add one!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-200 text-sm text-gray-600">
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Date of Birth</th>
                    <th className="p-4 font-semibold">Gender</th>
                    <th className="p-4 font-semibold">Parent Name</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {children.map((child) => (
                    <tr key={child._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-800">{child.name}</td>
                      <td className="p-4 text-gray-600">{new Date(child.dateOfBirth).toLocaleDateString()}</td>
                      <td className="p-4 text-gray-600">{child.gender}</td>
                      <td className="p-4 text-gray-600">{child.parentName}</td>
                      <td className="p-4 text-center">
                        <button 
                            className="text-blue-500 hover:text-blue-700 font-medium text-sm px-3 py-1 border border-blue-500 rounded hover:bg-blue-50 transition"
                            onClick={() => navigate(`/child/${child._id}`)}
                        >
                        View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
// NEW: Import the charting tools
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ChildProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const { data } = await api.get(`/children/${id}`);
        setChild(data);
      } catch (error) {
        console.error('Error fetching child', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChild();
  }, [id]);

  const handleAddLog = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/children/${id}/health`, { 
        weight: Number(weight), 
        height: Number(height), 
        notes 
      });
      setChild(data);
      setWeight(''); setHeight(''); setNotes('');
    } catch (error) {
      alert('Failed to add health log');
    }
  };

  if (loading) return <div className="p-8 text-center text-xl">Loading profile...</div>;
  if (!child) return <div className="p-8 text-center text-red-500 text-xl">Child not found!</div>;

  // NEW: Prepare data for the chart (Reverse it so oldest is on the left, newest on the right)
  const chartData = [...child.healthLogs].reverse().map(log => ({
    date: new Date(log.date).toLocaleDateString(),
    Weight: log.weight,
    Height: log.height
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 font-bold mb-4 hover:underline">
          ← Back to Dashboard
        </button>

        {/* Profile Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{child.name}</h2>
            <p className="text-gray-600 mt-1">Parent: {child.parentName} | Gender: {child.gender}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-semibold text-gray-800">{new Date(child.dateOfBirth).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Add Health Log Form (Takes up 1 column on large screens) */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add Health Log</h3>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">Weight (kg)</label>
                <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} required className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Height (cm)</label>
                <input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} required className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Notes (Optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Given polio drops" />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition">Save Log</button>
            </form>
          </div>

          {/* NEW: Growth Chart (Takes up 2 columns on large screens) */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
             <h3 className="text-lg font-bold text-gray-800 mb-4">Growth Tracker</h3>
             {child.healthLogs.length < 2 ? (
               <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded border border-dashed">
                 Add at least two health logs to see the growth chart.
               </div>
             ) : (
               <div className="h-72 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                     <XAxis dataKey="date" tick={{fontSize: 12}} />
                     <YAxis yAxisId="left" tick={{fontSize: 12}} />
                     <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} />
                     <Tooltip />
                     <Legend />
                     <Line yAxisId="left" type="monotone" dataKey="Weight" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 8 }} />
                     <Line yAxisId="right" type="monotone" dataKey="Height" stroke="#16a34a" strokeWidth={3} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
             )}
          </div>
        </div>

        {/* Health Log History Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 w-full">
          <div className="px-6 py-4 border-b bg-gray-50"><h3 className="font-bold text-gray-800">Health History</h3></div>
          <div className="p-4 overflow-x-auto">
            {child.healthLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No health logs recorded yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-600"><th className="pb-2 min-w-[100px]">Date</th><th className="pb-2">Weight</th><th className="pb-2">Height</th><th className="pb-2">Notes</th></tr>
                </thead>
                <tbody>
                  {child.healthLogs.map((log, index) => (
                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="py-3 text-blue-600 font-bold">{log.weight} kg</td>
                      <td className="py-3 text-green-600 font-bold">{log.height} cm</td>
                      <td className="py-3 text-gray-600">{log.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChildProfile;
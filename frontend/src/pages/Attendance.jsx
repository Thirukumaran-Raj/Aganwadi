import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Attendance = () => {
  const navigate = useNavigate();
  // Set default date to today, formatted as YYYY-MM-DD for the input field
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch children and attendance for the selected date
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all registered children
        const childrenRes = await api.get('/children');
        const allChildren = childrenRes.data;

        // Fetch attendance for the specific date
        const attendanceRes = await api.get(`/attendance/${date}`);
        const savedAttendance = attendanceRes.data.records || [];

        // Merge the lists: Match saved attendance status, or default to false
        const mergedRecords = allChildren.map(child => {
          const existingRecord = savedAttendance.find(r => r.childId === child._id);
          return {
            childId: child._id,
            name: child.name,
            present: existingRecord ? existingRecord.present : false,
            mealProvided: existingRecord ? existingRecord.mealProvided : false,
          };
        });

        setRecords(mergedRecords);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]); // Re-run this whenever the date changes

  // Handle checking/unchecking boxes
  const handleToggle = (childId, field) => {
    setRecords(records.map(record => 
      record.childId === childId ? { ...record, [field]: !record[field] } : record
    ));
  };

  // Save to the database
  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/attendance', { date, records });
      alert('Attendance saved successfully!');
    } catch (error) {
      alert('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 font-bold mb-4 hover:underline">
          ← Back to Dashboard
        </button>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Daily Tracker</h2>
          <div className="flex items-center gap-4">
            <label className="font-bold text-gray-700">Date:</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading roster...</div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No children registered yet.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b text-gray-600">
                      <th className="p-4 font-bold text-lg">Child Name</th>
                      <th className="p-4 font-bold text-center">Present</th>
                      <th className="p-4 font-bold text-center">Meal Provided</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.childId} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800 text-lg">{record.name}</td>
                        <td className="p-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={record.present}
                            onChange={() => handleToggle(record.childId, 'present')}
                            className="w-6 h-6 text-blue-600 rounded border-gray-300 cursor-pointer"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={record.mealProvided}
                            onChange={() => handleToggle(record.childId, 'mealProvided')}
                            className="w-6 h-6 text-green-600 rounded border-gray-300 cursor-pointer"
                            // Optional: Disable meal checkbox if they aren't present
                            disabled={!record.present} 
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-gray-50 border-t flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-6 py-3 rounded-lg font-bold text-white transition ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {saving ? 'Saving...' : 'Save Daily Log'}
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Attendance;
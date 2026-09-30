import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ChildProfile.css';

const defaultGrowthForm = {
  date: new Date().toISOString().split('T')[0],
  ageInMonths: '',
  weight: '',
  height: '',
  muac: '',
  status: 'Normal',
  remarks: '',
};

const ChildProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [growthRecords, setGrowthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingGrowth, setSavingGrowth] = useState(false);

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [notes, setNotes] = useState('');
  const [growthForm, setGrowthForm] = useState(defaultGrowthForm);

  const fetchChild = async () => {
    try {
      const { data } = await api.get(`/children/${id}`);
      setChild(data);
    } catch (error) {
      console.error('Error fetching child', error);
    }
  };

  const fetchGrowthRecords = async () => {
    try {
      const { data } = await api.get(`/growth?childId=${id}`);
      setGrowthRecords(data || []);
    } catch (error) {
      console.error('Error fetching growth records', error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchChild(), fetchGrowthRecords()]);
      setLoading(false);
    };

    fetchAll();
  }, [id]);

  const handleAddLog = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/children/${id}/health`, {
        weight: Number(weight),
        height: Number(height),
        notes,
      });
      setChild(data);
      setWeight('');
      setHeight('');
      setNotes('');
    } catch (error) {
      alert('Failed to add health log');
    }
  };

  const handleGrowthFieldChange = (event) => {
    const { name, value } = event.target;
    setGrowthForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleGrowthSubmit = async (event) => {
    event.preventDefault();
    setSavingGrowth(true);

    try {
      await api.post('/growth', {
        child: id,
        date: growthForm.date,
        ageInMonths: growthForm.ageInMonths ? Number(growthForm.ageInMonths) : 0,
        weight: growthForm.weight ? Number(growthForm.weight) : 0,
        height: growthForm.height ? Number(growthForm.height) : 0,
        muac: growthForm.muac ? Number(growthForm.muac) : null,
        status: growthForm.status,
        remarks: growthForm.remarks,
      });
      setGrowthForm(defaultGrowthForm);
      await fetchChild();
      await fetchGrowthRecords();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save growth record');
    } finally {
      setSavingGrowth(false);
    }
  };

  const handleDeleteGrowthRecord = async (recordId) => {
    if (!window.confirm('Delete this growth record?')) return;

    try {
      await api.delete(`/growth/${recordId}`);
      await fetchChild();
      await fetchGrowthRecords();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete growth record');
    }
  };

  if (loading) return <div className="p-8 text-center text-xl">Loading profile...</div>;
  if (!child) return <div className="p-8 text-center text-red-500 text-xl">Child not found!</div>;

  const chartSource = (growthRecords.length > 0 ? growthRecords : child.healthLogs || []).slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  const chartData = chartSource.map((log) => ({
    date: new Date(log.date).toLocaleDateString(),
    Weight: Number(log.weight || 0),
    Height: Number(log.height || 0),
  }));

  const chartTooltipStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #dfe7ee',
    borderRadius: '10px',
    boxShadow: '0 8px 20px rgba(24, 63, 93, 0.08)',
    color: '#1d2d3d',
    fontWeight: 600,
    padding: '10px 12px'
  };

  return (
    <div className="child-profile-page">
      <div className="child-profile-shell">
        <button onClick={() => navigate('/dashboard')} className="child-profile-back" type="button">
          ← Back to Dashboard
        </button>

        <div className="profile-summary-card">
          <div>
            <h2>{child.name}</h2>
            <p className="profile-summary-meta">Parent: {child.parentName} | Gender: {child.gender}</p>
          </div>
          <div className="profile-summary-dob">
            <span className="profile-summary-dob-label">Date of Birth</span>
            <span className="profile-summary-dob-value">{new Date(child.dateOfBirth).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="profile-layout">
          <div className="profile-panel">
            <h3 className="profile-panel-title">Add Health Log</h3>
            <form onSubmit={handleAddLog} className="profile-form">
              <div className="profile-field">
                <label htmlFor="weight">Weight (kg)</label>
                <input id="weight" type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} required className="profile-input" />
              </div>
              <div className="profile-field">
                <label htmlFor="height">Height (cm)</label>
                <input id="height" type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} required className="profile-input" />
              </div>
              <div className="profile-field">
                <label htmlFor="notes">Notes (Optional)</label>
                <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="profile-textarea" placeholder="e.g., Given polio drops" />
              </div>
              <button type="submit" className="profile-save-button">Save Log</button>
            </form>
          </div>

          <div className="profile-panel growth-panel">
            <h3 className="profile-panel-title">Growth Tracker</h3>
            <form onSubmit={handleGrowthSubmit} className="growth-form">
              <div className="growth-form-grid">
                <label>
                  Date
                  <input type="date" name="date" value={growthForm.date} onChange={handleGrowthFieldChange} />
                </label>
                <label>
                  Age (months)
                  <input type="number" name="ageInMonths" value={growthForm.ageInMonths} onChange={handleGrowthFieldChange} placeholder="0" />
                </label>
                <label>
                  Weight (kg)
                  <input type="number" step="0.1" name="weight" value={growthForm.weight} onChange={handleGrowthFieldChange} placeholder="12.5" required />
                </label>
                <label>
                  Height (cm)
                  <input type="number" step="0.1" name="height" value={growthForm.height} onChange={handleGrowthFieldChange} placeholder="89" required />
                </label>
                <label>
                  MUAC (cm)
                  <input type="number" step="0.1" name="muac" value={growthForm.muac} onChange={handleGrowthFieldChange} placeholder="14.5" />
                </label>
                <label>
                  Status
                  <select name="status" value={growthForm.status} onChange={handleGrowthFieldChange}>
                    <option value="Normal">Normal</option>
                    <option value="Underweight">Underweight</option>
                    <option value="Stunted">Stunted</option>
                    <option value="Wasted">Wasted</option>
                    <option value="SAM">SAM</option>
                    <option value="MAM">MAM</option>
                  </select>
                </label>
              </div>
              <label className="growth-form-full">
                Remarks
                <textarea name="remarks" value={growthForm.remarks} onChange={handleGrowthFieldChange} placeholder="Nutrition or growth notes" />
              </label>
              <button type="submit" className="profile-save-button" disabled={savingGrowth}>
                {savingGrowth ? 'Saving growth data...' : 'Save growth record'}
              </button>
            </form>

            {chartData.length < 2 ? (
              <div className="growth-chart-box">
                Add at least two growth measurements to see a chart trend.
              </div>
            ) : (
              <div className="growth-chart-box has-data">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 16, right: 20, bottom: 10, left: 0 }}>
                    <defs>
                      <linearGradient id="heightFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#2d7fbd" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#2d7fbd" stopOpacity={0.03} />
                      </linearGradient>
                      <linearGradient id="weightFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#1dbd68" stopOpacity={0.24} />
                        <stop offset="95%" stopColor="#1dbd68" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 6" stroke="#e7edf4" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#66798d', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#dfe7ee' }} />
                    <YAxis yAxisId="left" tick={{ fill: '#66798d', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#dfe7ee' }} width={40} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: '#66798d', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#dfe7ee' }} width={40} />
                    <Tooltip contentStyle={chartTooltipStyle} formatter={(value, name) => [`${value}`, name]} labelStyle={{ color: '#1d2d3d', fontWeight: 700, marginBottom: 6 }} />
                    <Legend formatter={(value) => <span style={{ color: '#1d2d3d', fontWeight: 700 }}>{value}</span>} iconType="circle" />
                    <Area yAxisId="right" type="monotone" dataKey="Height" stroke="#2d7fbd" strokeWidth={3} fill="url(#heightFill)" activeDot={{ r: 6, fill: '#2d7fbd', strokeWidth: 0 }} animationDuration={1200} animationEasing="ease-out" />
                    <Area yAxisId="left" type="monotone" dataKey="Weight" stroke="#1dbd68" strokeWidth={3} fill="url(#weightFill)" activeDot={{ r: 6, fill: '#1dbd68', strokeWidth: 0 }} animationDuration={1200} animationEasing="ease-out" />
                    <defs>
                      <filter id="heightGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#2d7fbd" floodOpacity="0.35" />
                      </filter>
                      <filter id="weightGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#1dbd68" floodOpacity="0.38" />
                      </filter>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="profile-history-card">
          <div className="profile-history-header">
            <h3>Health History</h3>
          </div>
          <div className="profile-history-body">
            {(growthRecords.length === 0 && child.healthLogs.length === 0) ? (
              <p className="profile-empty-state">No health logs recorded yet.</p>
            ) : (
              <table className="profile-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight</th>
                    <th>Height</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(growthRecords.length > 0 ? growthRecords : child.healthLogs).map((log, index) => (
                    <tr key={log._id || `${log.date}-${index}`}>
                      <td>{new Date(log.date).toLocaleDateString()}</td>
                      <td><strong>{log.weight || '—'} kg</strong></td>
                      <td><strong>{log.height || '—'} cm</strong></td>
                      <td>{log.status || 'Normal'}</td>
                      <td>{log.remarks || log.notes || '-'}</td>
                      <td>
                        {log._id && (
                          <button type="button" className="growth-delete-button" onClick={() => handleDeleteGrowthRecord(log._id)}>
                            Delete
                          </button>
                        )}
                      </td>
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
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/authContextValue';

const emptyForm = {
  awcId: '',
  awcCode: '',
  centreName: '',
  state: '',
  district: '',
  block: '',
  sector: '',
  village: '',
  address: '',
  status: 'Active',
};

const Centres = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const canManage = ['admin', 'supervisor'].includes(String(user?.role || '').toLowerCase());
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState('');

  const fetchCentres = async () => {
    try {
      const { data } = await api.get('/centres');
      setCentres(data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load centres.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/centres')
      .then(({ data }) => setCentres(data || []))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load centres.'))
      .finally(() => setLoading(false));
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (!form.awcId.trim() || !form.centreName.trim()) {
        setError('AWC ID and centre name are required.');
        return;
      }
      const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
      if (editingId) {
        await api.put(`/centres/${editingId}`, payload);
        setSuccess('Centre details updated.');
      } else {
        await api.post('/centres', payload);
        setSuccess('Centre added to the directory.');
      }
      setForm(emptyForm);
      setEditingId(null);
      await fetchCentres();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create centre.');
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (centre) => {
    setEditingId(centre._id);
    setForm({
      awcId: centre.awcId || '',
      awcCode: centre.awcCode || '',
      centreName: centre.centreName || '',
      state: centre.state || '',
      district: centre.district || '',
      block: centre.block || '',
      sector: centre.sector || '',
      village: centre.village || '',
      address: centre.address || '',
      status: centre.status || 'Active',
    });
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setSuccess('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7fa', padding: '32px 22px' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          style={{
            border: 'none',
            background: 'transparent',
            color: '#287fbe',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            marginBottom: '18px',
          }}
        >
          ← Back to dashboard
        </button>

        <div style={{ background: '#fff', borderRadius: '18px', padding: '28px', boxShadow: '0 18px 42px rgba(17, 40, 64, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, color: '#7a8ca0', fontSize: '0.76rem', letterSpacing: '0.16em', fontWeight: 700 }}>PORTAL MODULE</p>
              <h2 style={{ margin: '8px 0 0', fontSize: '2.1rem', color: '#18334d' }}>Centre Directory</h2>
            </div>
            <span style={{ background: '#edf7ff', color: '#1f6ca7', padding: '10px 14px', borderRadius: '999px', fontWeight: 700 }}>
              {centres.length} centres
            </span>
          </div>

          {canManage ? <form onSubmit={handleFormSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28, padding: '20px', border: '1px solid #e7eef5', borderRadius: '14px', background: '#f9fbfd' }}>
            <h3 style={{ gridColumn: '1 / -1', margin: 0, color: '#18334d' }}>{editingId ? 'Edit centre' : 'Add a centre'}</h3>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              AWC ID
              <input name="awcId" value={form.awcId} onChange={handleFormChange} placeholder="AWC-001" required maxLength={80} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              AWC Code
              <input name="awcCode" value={form.awcCode} onChange={handleFormChange} placeholder="AWC-001" maxLength={80} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700, gridColumn: 'span 2' }}>
              Centre name
              <input name="centreName" value={form.centreName} onChange={handleFormChange} placeholder="Anganwadi centre name" required maxLength={120} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              State
              <input name="state" value={form.state} onChange={handleFormChange} placeholder="Tamil Nadu" maxLength={100} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              District
              <input name="district" value={form.district} onChange={handleFormChange} placeholder="District" maxLength={100} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              Block
              <input name="block" value={form.block} onChange={handleFormChange} placeholder="Block" maxLength={100} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              Sector
              <input name="sector" value={form.sector} onChange={handleFormChange} placeholder="Sector" maxLength={100} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              Village
              <input name="village" value={form.village} onChange={handleFormChange} placeholder="Village" maxLength={100} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700, gridColumn: 'span 2' }}>
              Address
              <input name="address" value={form.address} onChange={handleFormChange} placeholder="Full centre address" maxLength={200} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              Status
              <select name="status" value={form.status} onChange={handleFormChange} style={inputStyle}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Under Review">Under Review</option>
                <option value="Deactivated">Deactivated</option>
              </select>
            </label>
            <div style={{ display: 'flex', alignItems: 'end' }}>
              <button type="submit" disabled={saving} style={{ background: '#1f73b8', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 20px', fontWeight: 700, cursor: 'pointer', minWidth: '170px' }}>
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add centre'}
              </button>
              {editingId && <button type="button" onClick={cancelEditing} style={{ marginLeft: 10, border: '1px solid #cbd8e4', borderRadius: '10px', padding: '12px 16px', background: '#fff', color: '#345', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>}
            </div>
          </form> : <p style={{ color: '#566a7c', margin: '0 0 24px' }}>Centre changes are managed by administrators and supervisors.</p>}

          {error && <p style={{ color: '#b63a3a', marginBottom: 18 }}>{error}</p>}
          {success && <p role="status" style={{ color: '#1d8e58', marginBottom: 18 }}>{success}</p>}

          {loading ? (
            <p style={{ color: '#566a7c', margin: 0 }}>Loading centres...</p>
          ) : centres.length === 0 ? (
            <p style={{ color: '#5a6d7d', margin: 0 }}>No centres found yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              {centres.map((centre) => (
                <div key={centre._id} style={{ border: '1px solid #e6edf4', borderRadius: '16px', padding: '18px', background: '#f9fbfd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <strong style={{ color: '#18334d', fontSize: '1.08rem' }}>{centre.centreName}</strong>
                    <span style={{
                      background: centre.status === 'Active' ? '#e9f9ef' : '#fff4db',
                      color: centre.status === 'Active' ? '#1d8e58' : '#a76700',
                      fontSize: '0.72rem',
                      padding: '6px 8px',
                      borderRadius: '999px',
                      fontWeight: 700,
                    }}>
                      {centre.status || 'Active'}
                    </span>
                  </div>

                  <p style={{ margin: '14px 0 6px', color: '#5d7183' }}>
                    <strong style={{ color: '#1d2d3d' }}>Code:</strong> {centre.awcCode || centre.awcId || '—'}
                  </p>
                  <p style={{ margin: '0 0 6px', color: '#5d7183' }}>
                    <strong style={{ color: '#1d2d3d' }}>Location:</strong> {centre.district || 'Not assigned'}
                  </p>
                  <p style={{ margin: 0, color: '#5d7183' }}>
                    <strong style={{ color: '#1d2d3d' }}>Block:</strong> {centre.block || '—'}
                  </p>
                  {canManage && <button type="button" onClick={() => startEditing(centre)} style={{ marginTop: 16, border: '1px solid #c8dceb', borderRadius: '9px', background: '#fff', color: '#1f6ca7', padding: '9px 13px', fontWeight: 700, cursor: 'pointer' }}>Edit centre</button>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  border: '1px solid #d9e4ee',
  borderRadius: '10px',
  padding: '10px 12px',
  fontSize: '0.98rem',
  color: '#1d2d3d',
  background: '#fff',
};

export default Centres;

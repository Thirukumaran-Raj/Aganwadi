import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/authContextValue';

const emptyForm = {
  beneficiaryId: '',
  name: '',
  category: 'Child',
  gender: 'Female',
  dob: '',
  mobile: '',
  fatherName: '',
  motherName: '',
  guardian: '',
  address: '',
  state: '',
  district: '',
  block: '',
  village: '',
  awc: '',
  status: 'Active',
};

const Beneficiaries = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const canManage = ['admin', 'supervisor'].includes(String(user?.role || '').toLowerCase());
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState('');

  const fetchBeneficiaries = async () => {
    try {
      const { data } = await api.get('/beneficiaries');
      setBeneficiaries(data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load beneficiaries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/beneficiaries')
      .then(({ data }) => setBeneficiaries(data || []))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load beneficiaries.'))
      .finally(() => setLoading(false));
    api.get('/centres')
      .then(({ data }) => setCentres(data || []))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load centres.'));
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
      const payload = {
        ...form,
        dob: form.dob || null,
        awc: form.awc || null,
      };
      if (form.mobile && !/^\+?[0-9\s()-]{10,20}$/.test(form.mobile)) {
        setError('Enter a valid mobile number with 10 to 15 digits.');
        return;
      }
      if (editingId) {
        await api.put(`/beneficiaries/${editingId}`, payload);
        setSuccess('Beneficiary details updated.');
      } else {
        await api.post('/beneficiaries', payload);
        setSuccess('Beneficiary added to the registry.');
      }
      setForm(emptyForm);
      setEditingId(null);
      await fetchBeneficiaries();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save beneficiary.');
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (beneficiary) => {
    setEditingId(beneficiary._id);
    setForm({
      beneficiaryId: beneficiary.beneficiaryId || '',
      name: beneficiary.name || '',
      category: beneficiary.category || 'Child',
      gender: beneficiary.gender || 'Female',
      dob: beneficiary.dob ? new Date(beneficiary.dob).toISOString().slice(0, 10) : '',
      mobile: beneficiary.mobile || '',
      fatherName: beneficiary.fatherName || '',
      motherName: beneficiary.motherName || '',
      guardian: beneficiary.guardian || '',
      address: beneficiary.address || '',
      state: beneficiary.state || '',
      district: beneficiary.district || '',
      block: beneficiary.block || '',
      village: beneficiary.village || '',
      awc: beneficiary.awc?._id || '',
      status: beneficiary.status || 'Active',
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
              <h2 style={{ margin: '8px 0 0', fontSize: '2.1rem', color: '#18334d' }}>Beneficiary Registry</h2>
            </div>
            <span style={{ background: '#edf7ff', color: '#1f6ca7', padding: '10px 14px', borderRadius: '999px', fontWeight: 700 }}>
              {beneficiaries.length} records
            </span>
          </div>

          <form onSubmit={handleFormSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28, padding: '20px', border: '1px solid #e7eef5', borderRadius: '14px', background: '#f9fbfd' }}>
            <h3 style={{ gridColumn: '1 / -1', margin: 0, color: '#18334d' }}>{editingId ? 'Edit beneficiary' : 'Register a beneficiary'}</h3>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              Beneficiary ID
              <input name="beneficiaryId" value={form.beneficiaryId} onChange={handleFormChange} placeholder="BEN-001" maxLength={80} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700, gridColumn: 'span 2' }}>
              Full name
              <input name="name" value={form.name} onChange={handleFormChange} placeholder="Enter beneficiary name" required maxLength={120} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              Category
              <select name="category" value={form.category} onChange={handleFormChange} style={inputStyle}>
                <option value="Child">Child</option>
                <option value="Pregnant Woman">Pregnant Woman</option>
                <option value="Lactating Mother">Lactating Mother</option>
                <option value="Adolescent Girl">Adolescent Girl</option>
              </select>
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              Gender
              <select name="gender" value={form.gender} onChange={handleFormChange} style={inputStyle}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              Date of birth
              <input name="dob" type="date" value={form.dob} onChange={handleFormChange} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              Mobile
              <input name="mobile" type="tel" inputMode="tel" value={form.mobile} onChange={handleFormChange} placeholder="9876543210" maxLength={20} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              Father / guardian name
              <input name="fatherName" value={form.fatherName} onChange={handleFormChange} maxLength={120} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              Mother name
              <input name="motherName" value={form.motherName} onChange={handleFormChange} maxLength={120} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              Alternate guardian
              <input name="guardian" value={form.guardian} onChange={handleFormChange} maxLength={120} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700, gridColumn: 'span 2' }}>
              Address
              <input name="address" value={form.address} onChange={handleFormChange} placeholder="Street / landmark" maxLength={200} style={inputStyle} />
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
              Village
              <input name="village" value={form.village} onChange={handleFormChange} placeholder="Village" maxLength={100} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              Assigned centre
              <select name="awc" value={form.awc} onChange={handleFormChange} style={inputStyle}>
                <option value="">No centre assigned</option>
                {centres.map((centre) => <option key={centre._id} value={centre._id}>{centre.centreName} ({centre.awcCode || centre.awcId})</option>)}
              </select>
            </label>
            <label style={{ display: 'grid', gap: 6, color: '#2e4053', fontWeight: 700 }}>
              Status
              <select name="status" value={form.status} onChange={handleFormChange} style={inputStyle}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Transferred">Transferred</option>
                <option value="Deactivated">Deactivated</option>
              </select>
            </label>
            <div style={{ display: 'flex', alignItems: 'end', gridColumn: '1 / -1' }}>
              <button type="submit" disabled={saving} style={{ background: '#1f73b8', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 20px', fontWeight: 700, cursor: 'pointer', minWidth: '170px' }}>
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add beneficiary'}
              </button>
              {editingId && <button type="button" onClick={cancelEditing} style={{ marginLeft: 10, border: '1px solid #cbd8e4', borderRadius: '10px', padding: '12px 16px', background: '#fff', color: '#345', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>}
            </div>
          </form>

          {error && <p style={{ color: '#b63a3a', marginBottom: 18 }}>{error}</p>}
          {success && <p role="status" style={{ color: '#1d8e58', marginBottom: 18 }}>{success}</p>}

          {loading ? (
            <p style={{ color: '#566a7c', margin: 0 }}>Loading beneficiaries...</p>
          ) : beneficiaries.length === 0 ? (
            <p style={{ color: '#5a6d7d', margin: 0 }}>No beneficiaries found yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '18px' }}>
              {beneficiaries.map((beneficiary) => (
                <div key={beneficiary._id} style={{ border: '1px solid #e6edf4', borderRadius: '16px', padding: '18px', background: '#f9fbfd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <strong style={{ color: '#18334d', fontSize: '1.08rem' }}>{beneficiary.name}</strong>
                    <span style={{
                      background: beneficiary.status === 'Active' ? '#e9f9ef' : '#fff4db',
                      color: beneficiary.status === 'Active' ? '#1d8e58' : '#a76700',
                      fontSize: '0.72rem',
                      padding: '6px 8px',
                      borderRadius: '999px',
                      fontWeight: 700,
                    }}>
                      {beneficiary.status || 'Active'}
                    </span>
                  </div>

                  <p style={{ margin: '14px 0 6px', color: '#5d7183' }}>
                    <strong style={{ color: '#1d2d3d' }}>Category:</strong> {beneficiary.category || 'Child'}
                  </p>
                  <p style={{ margin: '0 0 6px', color: '#5d7183' }}>
                    <strong style={{ color: '#1d2d3d' }}>Gender:</strong> {beneficiary.gender || 'Female'}
                  </p>
                  <p style={{ margin: 0, color: '#5d7183' }}>
                    <strong style={{ color: '#1d2d3d' }}>Center:</strong> {beneficiary.awc?.centreName || 'Not assigned'}
                  </p>
                  {canManage && <button type="button" onClick={() => startEditing(beneficiary)} style={{ marginTop: 16, border: '1px solid #c8dceb', borderRadius: '9px', background: '#fff', color: '#1f6ca7', padding: '9px 13px', fontWeight: 700, cursor: 'pointer' }}>Edit beneficiary</button>}
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

export default Beneficiaries;

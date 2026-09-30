import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContextValue';
import api from '../services/api';
import './StaffManagement.css';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'worker',
  status: 'Active',
  assignedCentre: '',
  employeeId: '',
  mobile: '',
};

const StaffManagement = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [centres, setCentres] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchStaff = async () => {
    const { data } = await api.get('/users');
    setStaff(data || []);
  };

  const fetchAudit = async () => {
    const { data } = await api.get('/audit?limit=20');
    setAuditLogs(data.logs || []);
  };

  useEffect(() => {
    Promise.all([api.get('/users'), api.get('/centres'), api.get('/audit?limit=20')])
      .then(([usersResponse, centresResponse, auditResponse]) => {
        setStaff(usersResponse.data || []);
        setCentres(centresResponse.data || []);
        setAuditLogs(auditResponse.data.logs || []);
      })
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load staff records.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = { ...form, assignedCentre: form.assignedCentre || null };
    if (editingId && !payload.password) delete payload.password;

    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, payload);
        setSuccess('Staff account updated.');
      } else {
        await api.post('/users', payload);
        setSuccess('Staff account created. Share its initial password through a secure channel.');
      }
      resetForm();
      await Promise.all([fetchStaff(), fetchAudit()]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save staff account.');
    } finally {
      setSaving(false);
    }
  };

  const editStaff = (member) => {
    setEditingId(member._id);
    setForm({
      name: member.name || '',
      email: member.email || '',
      password: '',
      role: member.role || 'worker',
      status: member.status || 'Active',
      assignedCentre: member.assignedCentre?._id || '',
      employeeId: member.employeeId || '',
      mobile: member.mobile || '',
    });
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteStaff = async (member) => {
    const confirmed = window.confirm(`Permanently delete ${member.name} (${member.email})? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(member._id);
    setError('');
    setSuccess('');
    try {
      await api.delete(`/users/${member._id}`);
      setStaff((currentStaff) => currentStaff.filter((staffMember) => staffMember._id !== member._id));
      if (editingId === member._id) resetForm();
      setSuccess(`${member.name}'s account was deleted.`);
      await fetchAudit();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete staff account.');
    } finally {
      setDeletingId('');
    }
  };

  if (String(user?.role || '').toLowerCase() !== 'admin') {
    return <main className="staff-page"><p role="alert">Administrator access is required to manage staff.</p><button type="button" onClick={() => navigate('/dashboard')}>Back to dashboard</button></main>;
  }

  return (
    <main className="staff-page">
      <header className="staff-header">
        <div>
          <button className="staff-back" type="button" onClick={() => navigate('/dashboard')}>← Dashboard</button>
          <p className="staff-eyebrow">ADMINISTRATION / ACCESS</p>
          <h1>Staff &amp; audit</h1>
          <p>Manage staff access, centre assignments, and recent account changes.</p>
        </div>
        <span className="staff-count">{staff.length} accounts</span>
      </header>

      {(error || success) && <p className={error ? 'staff-message is-error' : 'staff-message is-success'} role={error ? 'alert' : 'status'}>{error || success}</p>}

      <section className="staff-section" aria-labelledby="staff-form-title">
        <div className="staff-section-heading">
          <div><span>ACCOUNT ACCESS</span><h2 id="staff-form-title">{editingId ? 'Update staff account' : 'Add staff account'}</h2></div>
        </div>
        <form className="staff-form" onSubmit={handleSubmit}>
          <label>Full name<input name="name" value={form.name} onChange={handleChange} required maxLength={120} /></label>
          <label>Email address<input name="email" type="email" value={form.email} onChange={handleChange} required /></label>
          <label>{editingId ? 'Reset password (optional)' : 'Temporary password'}<input name="password" type="password" value={form.password} onChange={handleChange} required={!editingId} minLength={12} autoComplete="new-password" /></label>
          <label>Role<select name="role" value={form.role} onChange={handleChange}><option value="worker">Worker</option><option value="supervisor">Supervisor</option><option value="admin">Administrator</option></select></label>
          <label>Account status<select name="status" value={form.status} onChange={handleChange}><option>Active</option><option>Inactive</option><option>Suspended</option><option>Transferred</option></select></label>
          <label>Assigned centre<select name="assignedCentre" value={form.assignedCentre} onChange={handleChange}><option value="">No centre assigned</option>{centres.map((centre) => <option key={centre._id} value={centre._id}>{centre.centreName} ({centre.awcCode || centre.awcId})</option>)}</select></label>
          <label>Employee ID<input name="employeeId" value={form.employeeId} onChange={handleChange} maxLength={40} /></label>
          <label>Mobile<input name="mobile" type="tel" value={form.mobile} onChange={handleChange} maxLength={20} /></label>
          <div className="staff-form-actions">
            <button className="staff-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create account'}</button>
            {editingId && <button className="staff-secondary" type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </section>

      <section className="staff-section" aria-labelledby="staff-list-title">
        <div className="staff-section-heading"><div><span>TEAM DIRECTORY</span><h2 id="staff-list-title">Staff accounts</h2></div></div>
        {loading ? <p className="staff-empty">Loading accounts…</p> : staff.length === 0 ? <p className="staff-empty">No staff accounts yet.</p> : (
          <div className="staff-table-wrap"><table className="staff-table">
            <thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Centre</th><th>Last sign-in</th><th>Action</th></tr></thead>
            <tbody>{staff.map((member) => (
              <tr key={member._id}>
                <td><strong>{member.name}</strong><small>{member.email}</small></td>
                <td>{member.role}</td>
                <td><span className={`staff-status status-${member.status?.toLowerCase()}`}>{member.status}</span></td>
                <td>{member.assignedCentre?.centreName || 'Not assigned'}</td>
                <td>{member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleString() : 'Never'}</td>
                <td><div className="staff-row-actions">
                  <button className="staff-edit" type="button" onClick={() => editStaff(member)}>Edit</button>
                  <button
                    className="staff-delete"
                    type="button"
                    onClick={() => deleteStaff(member)}
                    disabled={deletingId === member._id || member._id === user?._id}
                    title={member._id === user?._id ? 'You cannot delete your own account' : 'Delete staff account'}
                  >
                    {deletingId === member._id ? 'Deleting…' : 'Delete'}
                  </button>
                </div></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </section>

      <section className="staff-section" aria-labelledby="audit-title">
        <div className="staff-section-heading"><div><span>SECURITY HISTORY</span><h2 id="audit-title">Recent audit events</h2></div></div>
        {auditLogs.length === 0 ? <p className="staff-empty">No audit events recorded.</p> : (
          <div className="staff-table-wrap"><table className="staff-table audit-table">
            <thead><tr><th>Time</th><th>Action</th><th>Performed by</th><th>Record</th><th>Details</th></tr></thead>
            <tbody>{auditLogs.map((entry) => (
              <tr key={entry._id}>
                <td>{new Date(entry.createdAt).toLocaleString()}</td>
                <td>{entry.action}</td>
                <td>{entry.user?.name || 'System'}</td>
                <td>{entry.entity} / {entry.entityId}</td>
                <td>{entry.details?.name || entry.details?.role || entry.details?.fields?.join(', ') || '—'}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </section>
    </main>
  );
};

export default StaffManagement;
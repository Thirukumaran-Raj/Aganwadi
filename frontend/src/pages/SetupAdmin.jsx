import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContextValue';
import api from '../services/api';
import logo from '../assets/Logo.png';
import './Login.css';
import './Register.css';

const SetupAdmin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', bootstrapKey: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.post('/auth/bootstrap-admin', {
        name: form.name,
        email: form.email,
        password: form.password,
      }, {
        headers: { 'X-Admin-Bootstrap-Key': form.bootstrapKey },
      });
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create the administrator account.');
      setSaving(false);
    }
  };

  return (
    <main className="login-page register-page">
      <section className="login-story" aria-label="Anganwadi Portal">
        <div className="login-story__content">
          <Link className="login-brand" to="/login" aria-label="Anganwadi Portal home">
            <img src={logo} alt="" />
            <span>Anganwadi<span className="login-brand__light"> Portal</span></span>
          </Link>
          <div className="login-story__message">
            <span className="login-eyebrow"><span /> SECURE FIRST-TIME SETUP</span>
            <h1>Start with<br />trusted care.</h1>
            <p>Create the first administrator using the one-time key configured on the server.</p>
          </div>
          <div className="login-story__footer"><span className="login-story__rule" /><span>Stronger beginnings, together.</span></div>
        </div>
      </section>

      <section className="login-panel register-panel">
        <div className="login-panel__topline"><span>ANGANWADI PORTAL</span><span className="login-secure">INITIAL ADMINISTRATOR</span></div>
        <div className="login-form-wrap register-form-wrap">
          <div className="login-heading register-heading">
            <span className="login-heading__mark" aria-hidden="true">&#10038;</span>
            <p className="login-eyebrow login-eyebrow--dark">FIRST-TIME SETUP</p>
            <h2>Create administrator<span>.</span></h2>
            <p className="login-heading__copy">This setup closes automatically after the first administrator is created.</p>
          </div>

          {error && <div className="login-error" role="alert">{error}</div>}

          <form className="login-form register-form" onSubmit={handleSubmit}>
            <label className="login-field">
              <span>Administrator name</span>
              <span className="login-input-wrap"><input name="name" autoComplete="name" value={form.name} onChange={handleChange} required maxLength={120} /></span>
            </label>
            <label className="login-field">
              <span>Email address</span>
              <span className="login-input-wrap"><input name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required /></span>
            </label>
            <label className="login-field">
              <span>Password</span>
              <span className="login-input-wrap"><input name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} required minLength={12} /></span>
            </label>
            <label className="login-field">
              <span>One-time bootstrap key</span>
              <span className="login-input-wrap"><input name="bootstrapKey" type="password" autoComplete="off" value={form.bootstrapKey} onChange={handleChange} required /></span>
            </label>
            <button className="login-submit" type="submit" disabled={saving} aria-busy={saving}>
              <span>{saving ? 'Creating administrator' : 'Create administrator'}</span>
              {saving ? <span className="login-spinner" aria-hidden="true" /> : <span className="login-submit__arrow" aria-hidden="true">&#8594;</span>}
            </button>
          </form>
          <p className="login-register register-login-link">Already set up? <Link to="/login">Sign in <span aria-hidden="true">&#8599;</span></Link></p>
        </div>
        <p className="login-panel__footer">A little care can change a whole future.</p>
      </section>
    </main>
  );
};

export default SetupAdmin;
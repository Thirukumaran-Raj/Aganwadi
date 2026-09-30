import { useState, useContext } from 'react';
import { AuthContext } from '../context/authContextValue';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import './Login.css';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (registrationError) {
      setError(typeof registrationError === 'string'
        ? registrationError
        : 'We could not create your account. Check your details and try again.');
      setIsSubmitting(false);
    }
  };

  const clearError = () => setError('');

  return (
    <main className="login-page register-page">
      <section className="login-story" aria-label="Anganwadi Portal">
        <div className="login-story__content">
          <Link className="login-brand" to="/login" aria-label="Anganwadi Portal home">
            <img src={logo} alt="" />
            <span>Anganwadi<span className="login-brand__light"> Portal</span></span>
          </Link>
          <div className="login-story__message">
            <span className="login-eyebrow"><span /> A COMMUNITY THAT CARES</span>
            <h1>Care begins<br />close to home.</h1>
            <p>Join the people helping children and families thrive in every community.</p>
          </div>
          <div className="login-story__footer">
            <span className="login-story__rule" />
            <span>Stronger beginnings, together.</span>
          </div>
        </div>
        <span className="login-story__index" aria-hidden="true">01 / 01</span>
      </section>

      <section className="login-panel register-panel">
        <div className="login-panel__topline">
          <span>ANGANWADI PORTAL</span>
          <span className="login-secure"><span aria-hidden="true">&#9679;</span> ACCOUNT SETUP</span>
        </div>

        <div className="login-form-wrap register-form-wrap">
          <div className="login-heading register-heading">
            <span className="login-heading__mark" aria-hidden="true">&#10038;</span>
            <p className="login-eyebrow login-eyebrow--dark">GET STARTED</p>
            <h2>Create your account<span>.</span></h2>
            <p className="login-heading__copy">Set up your workspace in a few steps.</p>
          </div>

          {error && <div className="login-error" role="alert">{error}</div>}

          <form className="login-form register-form" onSubmit={handleRegister}>
            <label className="login-field">
              <span>Full name</span>
              <span className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">&#9675;</span>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(event) => { setName(event.target.value); clearError(); }}
                  required
                />
              </span>
            </label>

            <label className="login-field">
              <span>Email address</span>
              <span className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">@</span>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => { setEmail(event.target.value); clearError(); }}
                  required
                />
              </span>
            </label>

            <label className="login-field">
              <span>Password</span>
              <span className="login-input-wrap">
                <span className="login-input-icon login-input-icon--lock" aria-hidden="true">&#8226;&#8226;&#8226;</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => { setPassword(event.target.value); clearError(); }}
                  minLength={12}
                  required
                />
                <button
                  className="login-reveal"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </span>
            </label>

            <button className="login-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
              <span>{isSubmitting ? 'Creating account' : 'Create account'}</span>
              {isSubmitting
                ? <span className="login-spinner" aria-hidden="true" />
                : <span className="login-submit__arrow" aria-hidden="true">&#8594;</span>}
            </button>
          </form>

          <p className="login-register register-login-link">
            Already have an account? <Link to="/login">Sign in <span aria-hidden="true">&#8599;</span></Link>
          </p>
          <p className="login-register register-login-link">
            First-time portal setup? <Link to="/setup-admin">Create the first administrator</Link>
          </p>
        </div>

        <p className="login-panel__footer">A little care can change a whole future.</p>
      </section>
    </main>
  );
};

export default Register;

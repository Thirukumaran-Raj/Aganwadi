import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState(() => localStorage.getItem('rememberedEmail') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(() => Boolean(localStorage.getItem('rememberedEmail')));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (rememberEmail) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      await login(email, password);
      navigate('/dashboard');
    } catch (loginError) {
      setError(typeof loginError === 'string' ? loginError : 'We could not sign you in. Check your details and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-story" aria-label="Anganwadi Portal">
        <div className="login-story__content">
          <Link className="login-brand" to="/login" aria-label="Anganwadi Portal home">
            <img src={logo} alt="" />
            <span>Anganwadi<span className="login-brand__light"> Portal</span></span>
          </Link>
          <div className="login-story__message">
            <span className="login-eyebrow"><span /> A COMMUNITY THAT CARES</span>
            <h1>Care begins<br />close to home.</h1>
            <p>For the people who show up, lend a hand, and help little lives grow.</p>
          </div>
          <div className="login-story__footer">
            <span className="login-story__rule" />
            <span>Stronger beginnings, together.</span>
          </div>
        </div>
        <span className="login-story__index" aria-hidden="true">01 / 01</span>
      </section>

      <section className="login-panel">
        <div className="login-panel__topline">
          <span>ANGANWADI PORTAL</span>
          <span className="login-secure"><span aria-hidden="true">&#9679;</span> SECURE SIGN IN</span>
        </div>

        <div className="login-form-wrap">
          <div className="login-heading">
            <span className="login-heading__mark" aria-hidden="true">&#10038;</span>
            <p className="login-eyebrow login-eyebrow--dark">YOUR WORKSPACE</p>
            <h2>Welcome back<span>.</span></h2>
            <p className="login-heading__copy">Sign in to continue your day.</p>
          </div>

          {error && <div className="login-error" role="alert">{error}</div>}

          <form className="login-form" onSubmit={handleLogin}>
            <label className="login-field">
              <span>Email address</span>
              <span className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">@</span>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => { setEmail(event.target.value); setError(''); }}
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
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => { setPassword(event.target.value); setError(''); }}
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

            <div className="login-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(event) => setRememberEmail(event.target.checked)}
                />
                <span>Remember my email</span>
              </label>
              <span className="login-private">Never save your password</span>
            </div>

            <button className="login-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
              <span>{isSubmitting ? 'Signing in' : 'Sign in'}</span>
              {isSubmitting
                ? <span className="login-spinner" aria-hidden="true" />
                : <span className="login-submit__arrow" aria-hidden="true">&#8594;</span>}
            </button>
          </form>

          <p className="login-register">
            New to the portal? <Link to="/register">Create an account <span aria-hidden="true">&#8599;</span></Link>
          </p>
        </div>

        <p className="login-panel__footer">A little care can change a whole future.</p>
      </section>
    </main>
  );
};

export default Login;
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContextValue';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import logo from '../assets/Logo.png';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [overview, setOverview] = useState({
    totalChildren: 0,
    totalBeneficiaries: 0,
    totalCentres: 0,
    totalWorkers: 0,
    lowStockItems: 0,
    attendanceToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [childrenResponse, overviewResponse] = await Promise.all([
          api.get('/children'),
          api.get('/dashboard/overview').catch(() => ({ data: { data: overview } })),
        ]);

        setChildren(childrenResponse.data || []);
        setOverview((currentOverview) => ({
          ...currentOverview,
          ...(overviewResponse?.data?.data || {}),
        }));
      } catch {
        setError('We could not load beneficiary records. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleLogout = () => {
    setMobileNavOpen(false);
    logout();
    navigate('/login');
  };

  const navigateFromMenu = (path) => {
    setMobileNavOpen(false);
    navigate(path);
  };

  if (!user) {
    return <main className="dashboard-auth-message">Please log in to view this page.</main>;
  }

  const visibleChildren = children.filter((child) => {
    const query = searchTerm.trim().toLowerCase();
    return [child.name, child.parentName, child.gender]
      .some((value) => String(value || '').toLowerCase().includes(query));
  });

  const firstName = user.name?.trim().split(/\s+/)[0] || 'there';
  const initials = user.name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'A';
  const hasSearch = searchTerm.trim().length > 0;

  return (
    <div className="portal-shell">
      <button
        className={`portal-backdrop${mobileNavOpen ? ' is-visible' : ''}`}
        type="button"
        aria-label="Close navigation menu"
        tabIndex={mobileNavOpen ? 0 : -1}
        onClick={() => setMobileNavOpen(false)}
      />
      <aside className={`portal-sidebar${mobileNavOpen ? ' is-menu-open' : ''}`}>
        <Link className="portal-brand" to="/dashboard" aria-label="Anganwadi Portal dashboard">
          <img src={logo} alt="" />
          <span>Anganwadi<small>CARE PORTAL</small></span>
        </Link>

        <div className={`portal-nav-group${mobileNavOpen ? ' is-open' : ''}`} id="portal-navigation-panel">
          <p className="portal-nav-label">WORKSPACE</p>
          <nav className="portal-nav" aria-label="Main navigation">
            <button className="portal-nav-item is-active" type="button" aria-current="page" title="Overview" onClick={() => setMobileNavOpen(false)}>
              <span className="portal-nav-icon" aria-hidden="true">&#9638;</span> Overview
            </button>
            <button className="portal-nav-item" type="button" title="Beneficiaries" onClick={() => navigateFromMenu('/beneficiaries')}>
              <span className="portal-nav-icon" aria-hidden="true">&#9679;</span> Beneficiaries
            </button>
            <button className="portal-nav-item" type="button" title="Centres" onClick={() => navigateFromMenu('/centres')}>
              <span className="portal-nav-icon" aria-hidden="true">&#9633;</span> Centres
            </button>
            <button className="portal-nav-item" type="button" title="Daily tracker" onClick={() => navigateFromMenu('/attendance')}>
              <span className="portal-nav-icon" aria-hidden="true">&#10003;</span> Daily tracker
            </button>
            <button className="portal-nav-item" type="button" title="Inventory" onClick={() => navigateFromMenu('/inventory')}>
              <span className="portal-nav-icon" aria-hidden="true">&#9632;</span> Inventory
            </button>
            {String(user.role).toLowerCase() === 'admin' && (
              <button className="portal-nav-item" type="button" title="Staff and audit" onClick={() => navigateFromMenu('/staff')}>
                <span className="portal-nav-icon" aria-hidden="true">&#9673;</span> Staff &amp; audit
              </button>
            )}
          </nav>
        </div>

        <div className="portal-sidebar-bottom">
          <div className="portal-profile">
            <span className="portal-avatar" aria-hidden="true">{initials}</span>
            <span className="portal-profile-copy"><strong>{user.name}</strong><small>{user.role}</small></span>
          </div>
          <button className="portal-logout" type="button" title="Sign out" onClick={handleLogout}>
            <span aria-hidden="true">&#8594;</span><span className="portal-logout-label">Sign out</span>
          </button>
          <button
            className={`portal-menu-toggle${mobileNavOpen ? ' is-open' : ''}`}
            type="button"
            aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileNavOpen}
            aria-controls="portal-navigation-panel"
            title={mobileNavOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileNavOpen((isOpen) => !isOpen)}
          >
            <span className="portal-menu-glyph" aria-hidden="true"><span /></span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-kicker">OVERVIEW <span>/</span> YOUR CENTRE</p>
            <h1>Good day, {firstName}<span>.</span></h1>
            <p className="dashboard-subtitle">Here is what is happening at your centre.</p>
          </div>
          <button className="dashboard-primary-action" type="button" onClick={() => navigate('/add-child')}>
            <span aria-hidden="true">+</span> Register a child
          </button>
        </header>

        <section className="dashboard-metrics" aria-label="Centre summary">
          <article className="dashboard-metric dashboard-metric--blue">
            <span className="dashboard-metric-label">REGISTERED CHILDREN</span>
            <span className="dashboard-metric-value">{loading ? '—' : overview.totalChildren || children.length}</span>
            <span className="dashboard-metric-note">Beneficiaries in your centre</span>
            <span className="dashboard-metric-mark" aria-hidden="true">&#9675;</span>
          </article>
          <article className="dashboard-metric dashboard-metric--green">
            <span className="dashboard-metric-label">TODAY'S ATTENDANCE</span>
            <span className="dashboard-metric-value">{loading ? '—' : overview.attendanceToday}</span>
            <span className="dashboard-metric-note">Records checked today</span>
            <span className="dashboard-metric-mark" aria-hidden="true">&#10003;</span>
          </article>
          <article className="dashboard-metric dashboard-metric--amber">
            <span className="dashboard-metric-label">LOW STOCK ALERTS</span>
            <span className="dashboard-metric-role">{loading ? '—' : overview.lowStockItems}</span>
            <span className="dashboard-metric-note">Inventory items requiring action</span>
            <span className="dashboard-metric-mark" aria-hidden="true">&#9670;</span>
          </article>
        </section>

        <section className="beneficiaries-section" aria-labelledby="beneficiaries-title">
          <div className="beneficiaries-heading">
            <div>
              <p className="dashboard-kicker">CENTRE RECORDS</p>
              <h2 id="beneficiaries-title">Beneficiaries</h2>
              <p className="beneficiaries-count">{loading ? 'Loading records' : `${children.length} ${children.length === 1 ? 'child' : 'children'} registered`}</p>
            </div>
            <label className="beneficiary-search">
              <span aria-hidden="true">&#9906;</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search beneficiaries"
                aria-label="Search beneficiaries"
              />
            </label>
          </div>

          {loading ? (
            <div className="beneficiaries-state" role="status"><span className="dashboard-spinner" /> Loading records…</div>
          ) : error ? (
            <div className="beneficiaries-state beneficiaries-state--error" role="alert">{error}</div>
          ) : visibleChildren.length === 0 ? (
            <div className="beneficiaries-state">
              <span className="beneficiaries-empty-mark" aria-hidden="true">&#9675;</span>
              <strong>{children.length === 0 && !hasSearch ? 'Your centre is ready for its first record' : 'No matching beneficiaries'}</strong>
              <span>{children.length === 0 && !hasSearch ? 'Register a child to start building your centre records.' : 'Try another name or clear your search.'}</span>
              {children.length === 0 && !hasSearch && (
                <button type="button" className="dashboard-empty-action" onClick={() => navigate('/add-child')}>Register a child <span aria-hidden="true">&#8594;</span></button>
              )}
            </div>
          ) : (
            <div className="beneficiary-table-wrap">
              <table className="beneficiary-table">
                <thead>
                  <tr>
                    <th scope="col">Child</th>
                    <th scope="col">Date of birth</th>
                    <th scope="col">Gender</th>
                    <th scope="col">Parent / guardian</th>
                    <th scope="col"><span className="visually-hidden">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleChildren.map((child) => (
                    <tr key={child._id}>
                      <td><strong>{child.name}</strong></td>
                      <td>{new Date(child.dateOfBirth).toLocaleDateString()}</td>
                      <td><span className="beneficiary-gender">{child.gender}</span></td>
                      <td>{child.parentName}</td>
                      <td className="beneficiary-action-cell">
                        <button type="button" className="beneficiary-view-action" onClick={() => navigate(`/child/${child._id}`)}>
                          View profile <span aria-hidden="true">&#8594;</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="dashboard-footer">Anganwadi Portal <span>·</span> Stronger beginnings, together.</footer>
      </main>
    </div>
  );
};

export default Dashboard;

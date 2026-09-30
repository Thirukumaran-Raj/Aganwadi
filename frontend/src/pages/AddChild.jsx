import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import logo from '../assets/Logo.png';
import './AddChild.css';

const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
};

const parseDateForInput = (dateString) => {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(dateString);
  if (!match) return null;

  const [, dayText, monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
};

const getCalendarDays = (monthDate) => {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const firstCalendarDay = new Date(firstDay.getFullYear(), firstDay.getMonth(), 1 - firstDay.getDay());
  return Array.from({ length: 42 }, (_, index) => (
    new Date(firstCalendarDay.getFullYear(), firstCalendarDay.getMonth(), firstCalendarDay.getDate() + index)
  ));
};

const getAgeLabel = (dateString) => {
  if (!dateString) return '';

  const [year, month, day] = dateString.split('-').map(Number);
  const today = new Date();
  let years = today.getFullYear() - year;
  let months = today.getMonth() - (month - 1);

  if (today.getDate() < day) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) return '';
  if (years === 0 && months === 0) return 'Age estimate: under 1 month';

  const yearText = years ? `${years} ${years === 1 ? 'year' : 'years'}` : '';
  const monthText = months ? `${months} ${months === 1 ? 'month' : 'months'}` : '';
  return `Age estimate: ${[yearText, monthText].filter(Boolean).join(', ')}`;
};

const AddChild = () => {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: 'Male',
    parentName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [dateInput, setDateInput] = useState('');
  const [dateInputError, setDateInputError] = useState('');
  const navigate = useNavigate();
  const today = formatDateForInput(new Date());
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const selectedDate = formData.dateOfBirth ? new Date(`${formData.dateOfBirth}T00:00:00`) : null;
  const calendarDays = getCalendarDays(calendarMonth);

  const openCalendar = () => {
    if (selectedDate) setCalendarMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    setCalendarOpen(true);
  };

  const selectDate = (date) => {
    setFormData((currentData) => ({ ...currentData, dateOfBirth: formatDateForInput(date) }));
    setDateInput(formatDateForDisplay(formatDateForInput(date)));
    setDateInputError('');
    setError('');
    setCalendarOpen(false);
  };

  const handleDateInputChange = (event) => {
    const value = event.target.value;
    const parsedDate = parseDateForInput(value);
    setDateInput(value);
    setDateInputError('');
    setError('');
    setFormData((currentData) => ({
      ...currentData,
      dateOfBirth: parsedDate && formatDateForInput(parsedDate) <= today ? formatDateForInput(parsedDate) : '',
    }));
  };

  const handleDateInputBlur = () => {
    if (!dateInput) {
      setDateInputError('');
      return;
    }

    const parsedDate = parseDateForInput(dateInput);
    if (!parsedDate) {
      setDateInputError('Enter a valid date in DD-MM-YYYY format.');
    } else if (formatDateForInput(parsedDate) > today) {
      setDateInputError('Date of birth cannot be in the future.');
    } else {
      setDateInputError('');
    }
  };

  const handleChange = (event) => {
    setFormData((currentData) => ({ ...currentData, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!formData.dateOfBirth) {
      setDateInputError(dateInput ? 'Enter a valid date on or before today.' : 'Date of birth is required.');
      setError('Please enter a valid date of birth before saving.');
      return;
    }
    setLoading(true);

    try {
      await api.post('/children', formData);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not register this child. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="child-page">
      <header className="child-topbar">
        <div className="child-topbar__inner">
          <Link className="child-brand" to="/dashboard" aria-label="Anganwadi Portal dashboard">
            <img src={logo} alt="" />
            <span>Anganwadi<small>CARE PORTAL</small></span>
          </Link>
          <Link className="child-back" to="/dashboard"><span aria-hidden="true">&#8592;</span> Dashboard</Link>
        </div>
      </header>

      <div className="child-content">
        <nav className="child-breadcrumb" aria-label="Breadcrumb">
          <Link to="/dashboard">Workspace</Link>
          <span aria-hidden="true">/</span>
          <span>New child</span>
        </nav>

        <header className="child-heading">
          <div>
            <p className="child-eyebrow">BENEFICIARY RECORD</p>
            <h1>Register a child<span>.</span></h1>
            <p className="child-heading__copy">Add a new child and their parent or guardian to your centre.</p>
          </div>
          <span className="child-step" aria-label="Step 1 of 1"><span>01</span><small>NEW RECORD</small></span>
        </header>

        {error && <div className="child-error" role="alert">{error}</div>}

        <form className="child-form" onSubmit={handleSubmit}>
          <div className="child-form__section-heading">
            <h2>Child details</h2>
            <span>All fields are required</span>
          </div>

          <div className="child-fields">
            <label className="child-field child-field--wide">
              <span>Child's full name</span>
              <input
                type="text"
                name="name"
                autoComplete="off"
                placeholder="Enter the child's name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <div className="child-field">
              <label htmlFor="date-of-birth">Date of birth</label>
              <div className="child-date-control">
                <input
                  className="child-date-input"
                  id="date-of-birth"
                  type="text"
                  name="dateOfBirth"
                  placeholder="dd-mm-yyyy"
                  value={dateInput}
                  onChange={handleDateInputChange}
                  onBlur={handleDateInputBlur}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') setCalendarOpen(false);
                  }}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={10}
                  aria-haspopup="dialog"
                  aria-expanded={calendarOpen}
                  aria-controls="date-of-birth-calendar"
                  aria-invalid={Boolean(dateInputError || (error && !formData.dateOfBirth))}
                  aria-describedby="date-of-birth-hint date-of-birth-error"
                />
                <button
                  className="child-date-trigger"
                  type="button"
                  aria-label="Choose date of birth"
                  aria-haspopup="dialog"
                  aria-expanded={calendarOpen}
                  aria-controls="date-of-birth-calendar"
                  onClick={calendarOpen ? () => setCalendarOpen(false) : openCalendar}
                >
                  <span className="child-date-trigger__icon" aria-hidden="true" />
                </button>
                {calendarOpen && (
                  <div className="child-calendar" id="date-of-birth-calendar" role="dialog" aria-label="Choose date of birth">
                    <div className="child-calendar__header">
                      <div className="child-calendar__selectors">
                        <select
                          aria-label="Month"
                          value={calendarMonth.getMonth()}
                          onChange={(event) => setCalendarMonth(new Date(calendarMonth.getFullYear(), Number(event.target.value), 1))}
                        >
                          {Array.from({ length: 12 }, (_, month) => (
                            <option key={month} value={month} disabled={calendarMonth.getFullYear() === currentYear && month > currentMonth}>
                              {new Date(2000, month, 1).toLocaleDateString('en-US', { month: 'long' })}
                            </option>
                          ))}
                        </select>
                        <select
                          aria-label="Year"
                          value={calendarMonth.getFullYear()}
                          onChange={(event) => {
                            const year = Number(event.target.value);
                            setCalendarMonth(new Date(year, Math.min(calendarMonth.getMonth(), year === currentYear ? currentMonth : 11), 1));
                          }}
                        >
                          {Array.from({ length: currentYear - 1899 }, (_, index) => currentYear - index).map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <div className="child-calendar__navigation">
                        <button
                          type="button"
                          aria-label="Previous month"
                          disabled={calendarMonth.getFullYear() === 1900 && calendarMonth.getMonth() === 0}
                          onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                        >
                          <span aria-hidden="true">&#8592;</span>
                        </button>
                        <button
                          type="button"
                          aria-label="Next month"
                          disabled={calendarMonth.getFullYear() === currentYear && calendarMonth.getMonth() >= currentMonth}
                          onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                        >
                          <span aria-hidden="true">&#8594;</span>
                        </button>
                      </div>
                    </div>
                    <div className="child-calendar__weekdays" aria-hidden="true">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day}>{day}</span>)}
                    </div>
                    <div className="child-calendar__days">
                      {calendarDays.map((date) => {
                        const dateValue = formatDateForInput(date);
                        const isSelected = dateValue === formData.dateOfBirth;
                        const isToday = dateValue === today;
                        const isOutsideMonth = date.getMonth() !== calendarMonth.getMonth();

                        return (
                          <button
                            className={`child-calendar__day${isSelected ? ' is-selected' : ''}${isToday ? ' is-today' : ''}${isOutsideMonth ? ' is-outside' : ''}`}
                            key={dateValue}
                            type="button"
                            aria-label={date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            aria-pressed={isSelected}
                            disabled={dateValue > today}
                            onClick={() => selectDate(date)}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                    <div className="child-calendar__footer">
                      <button type="button" onClick={() => { setFormData((currentData) => ({ ...currentData, dateOfBirth: '' })); setDateInput(''); setDateInputError(''); setError(''); setCalendarOpen(false); }}>Clear</button>
                      <button type="button" onClick={() => selectDate(new Date())}>Today</button>
                    </div>
                  </div>
                )}
              </div>
              <small id="date-of-birth-hint" className="child-field-hint" aria-live="polite">
                {getAgeLabel(formData.dateOfBirth) || 'Type DD-MM-YYYY or choose a date'}
              </small>
              <small id="date-of-birth-error" className="child-date-error" aria-live="polite">{dateInputError}</small>
            </div>

            <fieldset className="child-gender">
              <legend>Gender</legend>
              <div className="child-gender__options">
                {['Male', 'Female'].map((gender) => (
                  <label className={`child-gender__option${formData.gender === gender ? ' is-selected' : ''}`} key={gender}>
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={handleChange}
                    />
                    <span className="child-gender__indicator" aria-hidden="true" />
                    <span>{gender}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="child-field child-field--wide">
              <span>Parent or guardian name</span>
              <input
                type="text"
                name="parentName"
                autoComplete="off"
                placeholder="Enter a parent or guardian's name"
                value={formData.parentName}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <footer className="child-form__footer">
            <p><span aria-hidden="true">&#9679;</span> Your information is saved securely to your centre.</p>
            <div>
              <Link className="child-cancel" to="/dashboard">Cancel</Link>
              <button className="child-submit" type="submit" disabled={loading} aria-busy={loading}>
                {loading ? <><span className="child-spinner" aria-hidden="true" /> Saving record</> : <>Save child record <span aria-hidden="true">&#8594;</span></>}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </main>
  );
};

export default AddChild;
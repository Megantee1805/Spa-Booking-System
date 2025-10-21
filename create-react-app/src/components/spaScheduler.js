import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AppNavbar from './navbar';
import { createBooking, fetchBookingsByMasseur } from '../services/bookings';

const localizer = momentLocalizer(moment);

const initialFormState = {
  customerName: '',
  customerEmail: '',
  notes: '',
};

const serviceCatalog = [
  {
    id: 'swedish-60',
    name: 'Swedish Renewal Massage',
    durationMinutes: 60,
    price: 129,
    description: 'Classic full-body massage with calming aromatherapy oils.',
  },
  {
    id: 'deep-tissue-75',
    name: 'Deep Tissue Reset',
    durationMinutes: 75,
    price: 159,
    description: 'Targets chronic tension with focused pressure and heat therapy.',
  },
  {
    id: 'pre-natal-90',
    name: 'Pre-natal Serenity',
    durationMinutes: 90,
    price: 189,
    description: 'Adaptive support cushions and gentle flow tailored for expecting mothers.',
  },
  {
    id: 'couples-90',
    name: 'Couples Ritual Suite',
    durationMinutes: 90,
    price: 249,
    description: 'Dual-therapist service with synchronized techniques in the suite.',
  },
];

const businessHours = {
  startHour: 8,
  endHour: 21,
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
});

const SpaBookingSystem = () => {
  const { id: masseurIdFromRoute } = useParams();
  const masseurId = useMemo(
    () => masseurIdFromRoute || 'unassigned',
    [masseurIdFromRoute]
  );

  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formState, setFormState] = useState(initialFormState);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(serviceCatalog[0].id);

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        const bookings = await fetchBookingsByMasseur(masseurId);
        if (!isMounted) return;

        const mappedEvents = bookings.map((booking) => ({
          id: booking.id,
          title: booking.serviceName
            ? `${booking.customerName || 'Guest'} · ${booking.serviceName}`
            : booking.customerName || 'Reserved Slot',
          start: new Date(booking.start),
          end: new Date(booking.end),
          allDay: false,
          resource: booking,
        }));
        setEvents(mappedEvents);
      } catch (error) {
        console.error('Failed to load bookings', error);
        if (isMounted) {
          setStatusMessage('Unable to load bookings at the moment.');
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, [masseurId]);

  const selectedService = useMemo(
    () => serviceCatalog.find((service) => service.id === selectedServiceId) || serviceCatalog[0],
    [selectedServiceId]
  );

  const minTime = useMemo(() => {
    const date = new Date();
    date.setHours(businessHours.startHour, 0, 0, 0);
    return date;
  }, []);

  const maxTime = useMemo(() => {
    const date = new Date();
    date.setHours(businessHours.endHour, 0, 0, 0);
    return date;
  }, []);

  const handleSelectSlot = ({ start }) => {
    if (moment(start).isBefore(moment(), 'minute')) {
      setStatusMessage('Please select a future time slot.');
      return;
    }

    const startTime = new Date(start);
    const endTime = moment(startTime).add(selectedService.durationMinutes, 'minutes').toDate();
    setSelectedSlot({
      start: startTime,
      end: endTime,
    });
    setStatusMessage('Selected slot pending confirmation. Complete the form to save.');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((previous) => ({ ...previous, [name]: value }));
  };

  const handleServiceChange = (event) => {
    const nextServiceId = event.target.value;
    setSelectedServiceId(nextServiceId);
    setSelectedSlot(null);
    setStatusMessage('Service updated. Select a new slot to reflect the duration.');
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();

    if (!selectedSlot) {
      setStatusMessage('Please select an available time slot on the calendar.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Saving booking…');

    try {
      await createBooking({
        masseurId,
        customerName: formState.customerName,
        customerEmail: formState.customerEmail,
        start: selectedSlot.start,
        end: selectedSlot.end,
        notes: formState.notes,
        serviceName: selectedService.name,
        durationMinutes: selectedService.durationMinutes,
        price: selectedService.price,
      });

      setStatusMessage('Booking saved successfully.');
      setFormState(initialFormState);
      setSelectedSlot(null);

      const bookings = await fetchBookingsByMasseur(masseurId);
      const mappedEvents = bookings.map((booking) => ({
        id: booking.id,
        title: booking.serviceName
          ? `${booking.customerName || 'Guest'} · ${booking.serviceName}`
          : booking.customerName || 'Reserved Slot',
        start: new Date(booking.start),
        end: new Date(booking.end),
        allDay: false,
        resource: booking,
      }));
      setEvents(mappedEvents);
    } catch (error) {
      console.error('Error saving booking', error);
      setStatusMessage('We were unable to save the booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedSlot = selectedSlot
    ? `${dateFormatter.format(new Date(selectedSlot.start))} · ${timeFormatter.format(
        new Date(selectedSlot.start)
      )} – ${timeFormatter.format(new Date(selectedSlot.end))}`
    : 'Select an open time from the calendar to begin.';

  const upcomingAppointments = useMemo(() => {
    return events
      .map((event) => event.resource || event)
      .filter((booking) => moment(booking.start).isSameOrAfter(moment(), 'day'))
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 6);
  }, [events]);

  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="content-container page-section">
        <header className="page-header">
          <span className="eyebrow">Booking studio</span>
          <h1 className="section-title">Schedule a serene experience</h1>
          <p>
            Choose an available slot to reserve time with your preferred therapist. Capture guest
            details and bespoke notes so the team can prepare a restorative journey.
          </p>
        </header>
        <div className="scheduler-layout">
          <section className="card-surface calendar-wrapper">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              step={15}
              timeslots={4}
              selectable
              onSelectSlot={handleSelectSlot}
              min={minTime}
              max={maxTime}
              style={{ minHeight: 520 }}
            />
          </section>
          <form onSubmit={handleBookingSubmit} className="card-surface form-card scheduler-form">
            <div>
              <h2 style={{ marginTop: 0 }}>Reserve the appointment</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>{formattedSlot}</p>
            </div>
            <div>
              <label htmlFor="service">Select treatment</label>
              <select
                id="service"
                name="service"
                value={selectedServiceId}
                onChange={handleServiceChange}
              >
                {serviceCatalog.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} · {service.durationMinutes} min · ${service.price}
                  </option>
                ))}
              </select>
              <p className="helper-text">{selectedService.description}</p>
            </div>
            <div>
              <label htmlFor="customerName">Guest name</label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                value={formState.customerName}
                onChange={handleInputChange}
                required
                placeholder="Enter guest full name"
              />
            </div>
            <div>
              <label htmlFor="customerEmail">Guest email</label>
              <input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={formState.customerEmail}
                onChange={handleInputChange}
                placeholder="Optional contact email"
              />
            </div>
            <div>
              <label htmlFor="notes">Session notes</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formState.notes}
                onChange={handleInputChange}
                placeholder="Preferences, focus areas, or enhancements"
              />
            </div>
            <button type="submit" className="button button-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Confirm booking'}
            </button>
          </form>
          <aside className="card-surface insights-card">
            <h3 style={{ marginTop: 0 }}>Studio pulse</h3>
            <p className="helper-text">Upcoming confirmed experiences across this therapist.</p>
            <ul className="insight-list">
              {upcomingAppointments.length === 0 && (
                <li className="insight-list__empty">No upcoming appointments have been scheduled yet.</li>
              )}
              {upcomingAppointments.map((booking) => (
                <li key={booking.id} className="insight-list__item">
                  <div>
                    <strong>{booking.customerName || 'Reserved Guest'}</strong>
                    <p>
                      {booking.serviceName || 'Treatment TBD'} · {booking.durationMinutes || 0} min
                    </p>
                  </div>
                  <span>
                    {dateFormatter.format(new Date(booking.start))} ·{' '}
                    {timeFormatter.format(new Date(booking.start))}
                  </span>
                </li>
              ))}
            </ul>
            <div className="divider" />
            <h4>Membership insight</h4>
            <p className="helper-text">
              Members booking this therapist prefer 90-minute rituals. Offer the Heritage or Luminary
              plans to bundle monthly treatments with exclusive lounge access.
            </p>
            <div className="insight-metric">
              <span className="insight-metric__value">72%</span>
              <span className="insight-metric__label">of recurring guests hold memberships</span>
            </div>
            <a className="button button-secondary" href="/memberships">
              View membership programs
            </a>
          </aside>
        </div>
        {statusMessage && <div className="status-banner">{statusMessage}</div>}
      </main>
    </div>
  );
};

export default SpaBookingSystem;

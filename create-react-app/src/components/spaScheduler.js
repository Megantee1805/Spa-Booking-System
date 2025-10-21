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

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        const bookings = await fetchBookingsByMasseur(masseurId);
        if (!isMounted) return;

        const mappedEvents = bookings.map((booking) => ({
          id: booking.id,
          title: booking.customerName || 'Reserved Slot',
          start: new Date(booking.start),
          end: new Date(booking.end),
          allDay: false,
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

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setStatusMessage('Selected slot pending confirmation. Complete the form to save.');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((previous) => ({ ...previous, [name]: value }));
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
      });

      setStatusMessage('Booking saved successfully.');
      setFormState(initialFormState);
      setSelectedSlot(null);

      const bookings = await fetchBookingsByMasseur(masseurId);
      const mappedEvents = bookings.map((booking) => ({
        id: booking.id,
        title: booking.customerName || 'Reserved Slot',
        start: new Date(booking.start),
        end: new Date(booking.end),
        allDay: false,
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
              style={{ minHeight: 520 }}
            />
          </section>
          <form onSubmit={handleBookingSubmit} className="card-surface form-card scheduler-form">
            <div>
              <h2 style={{ marginTop: 0 }}>Reserve the appointment</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>{formattedSlot}</p>
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
        </div>
        {statusMessage && <div className="status-banner">{statusMessage}</div>}
      </main>
    </div>
  );
};

export default SpaBookingSystem;

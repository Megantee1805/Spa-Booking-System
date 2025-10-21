import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { createBooking, fetchBookingsByMasseur } from '../services/bookings';

const localizer = momentLocalizer(moment);

const initialFormState = {
  customerName: '',
  customerEmail: '',
  notes: '',
};

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

  return (
    <div style={{ padding: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        step={15}
        timeslots={4}
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: 500 }}
      />

      <form onSubmit={handleBookingSubmit} style={{ marginTop: '2rem' }}>
        <fieldset disabled={isSubmitting} style={{ border: 'none', padding: 0 }}>
          <legend>Booking Details</legend>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="customerName">Customer Name</label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              value={formState.customerName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="customerEmail">Customer Email</label>
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              value={formState.customerEmail}
              onChange={handleInputChange}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formState.notes}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Confirm Booking</button>
        </fieldset>
      </form>

      {statusMessage && (
        <p role="status" style={{ marginTop: '1rem' }}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default SpaBookingSystem;

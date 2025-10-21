import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const SpaBookingSystem = () => {
  const [events, setEvents] = useState([]);

  const handleSelectSlot = (slotInfo) => {
    setEvents((currentEvents) => [
      ...currentEvents,
      {
        id: currentEvents.length + 1,
        title: 'New Booking',
        start: slotInfo.start,
        end: slotInfo.end,
        allDay: slotInfo.slots?.length === 1,
      },
    ]);
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
        selectable={true}
        onSelectSlot={handleSelectSlot}
        style={{ height: 700 }}
      />
    </div>
  );
};

export default SpaBookingSystem;


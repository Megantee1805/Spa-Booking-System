import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const masseurs = [
  {
    id: 1,
    name: 'Masseur 1',
  },
  {
    id: 2,
    name: 'Masseur 2',
  },
  // Add more masseurs here
];


const events = [


]; 

const SpaBookingSystem = () => {
  const [events, setEvents] = useState([]);
  const handleSelectSlot = (slotInfo) => {
    // slotInfo contains information about the selected slot
    // For example, slotInfo.start and slotInfo.end represent the selected start and end dates
    console.log('Selected start date:', slotInfo.start);
    console.log('Selected end date:', slotInfo.end);
  };
  
  // Function to handle event changes (booking appointments)
  const handleEventChange = (event) => {
    // Update the events array with the new booking information
    const updatedEvents = events.map((ev) =>
      ev.id === event.id ? { ...ev, ...event } : ev
    );
    setEvents(updatedEvents);
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

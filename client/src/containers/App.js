import React, { useState, useEffect } from 'react';

import './App.css';
import Grid from '../components/Grid/Grid';
import InputForm from '../components/InputForm/InputForm';
import { EVENTS_URL } from '../api/requests';

const App = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(0);
  const [operation, setOperation] = useState('');

  useEffect(() => {
      fetch(`${EVENTS_URL}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => response.json())
      .then(events => {
        setEvents(events);
      })
      .catch(err => alert(err));
  }, []);

  const onActionExecute = (action) => {
    setSelectedEvent(action.eventId);
    setOperation(action.action);
  }

  return (
    <div className="app p-3 my-3 mx-auto">
      <div className="app__header">Upcoming Events</div>
      <div className="app__grid">
        <Grid data={events} actionExecute={onActionExecute}/>
        <InputForm formValues={events} operation={operation} selectedEvent={selectedEvent} updateEvents={setEvents} />
      </div>
    </div>
  );
}

export default App;

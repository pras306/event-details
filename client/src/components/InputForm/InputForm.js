import React, { useState, useEffect } from 'react';

import './InputForm.css';
import { EVENTS_URL } from '../../api/requests';

const InputForm = ({ formValues, operation, selectedEvent, updateEvents }) => {
    const [formInputs, setFormInputs] = useState(null);
    const [organizers, setOrganizers] = useState([]);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {

        fetch(`${EVENTS_URL}/members/${selectedEvent}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            setOrganizers(data.organizers);
            setParticipants(data.participants);
            setFormInputs(formValues.filter(item => item.id === selectedEvent)[0]);
        })
        .catch(err => alert(err));
    },[formValues, selectedEvent]);

    const handleChange = (e) => {
        setFormInputs({
            ...formInputs,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        fetch(`${EVENTS_URL}`,{
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formInputs)
        })
        .then(response => response.json())
        .then(data => {
            updateEvents(data);
            alert("Updated Event Details");
        })
        .catch(err => alert(err));
    };

    const handleCancel = () => {
        setFormInputs(formValues.filter(item => item.id === selectedEvent)[0]);
    };

    const renderDetails = (groupName, groupData) => {
        if(groupData) {
            return (
                <React.Fragment>
                    <span>{groupName}</span>
                    {
                        groupData.map((item, idx) => {
                            return <span key={idx} className="badge badge-primary">{`${item.first_name} ${item.last_name}`}</span>
                        })
                    }
                </React.Fragment>
            )
        }
    };

    const renderForm = () => {
        if(formInputs) {
            return (
                <React.Fragment>
                    <div className="row">
                        <div className="form-group col-md-2">
                            <label>ID</label>
                            <input type="text" className="form-control" name="id" value={formInputs.id} readOnly/>
                        </div>
                        <div className="form-group col-md-4">
                            <label>Title</label>
                            <input type="text" className="form-control" name="event_title" value={formInputs.event_title} onChange={handleChange} />
                        </div>
                        <div className="form-group col-md-3">
                            <label>Date</label>
                            <input type="text" className="form-control" name="event_date" value={formInputs.event_date} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-9">
                            <label>Description</label>
                            <input type="text" className="form-control" name="event_description" value={formInputs.event_description} onChange={handleChange} />
                        </div>
                        <div className="col-md-1"></div>
                        <div className="form-group col-md-2">
                            <button className="btn btn-success" onClick={handleSave}>Save</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-2">
                            <label>Status</label>
                            <input type="text" className="form-control" name="event_status" value={formInputs.event_status} onChange={handleChange} />
                        </div>
                        <div className="form-group col-md-4">
                            <label>Start Time</label>
                            <input type="text" className="form-control" name="event_start_time" value={formInputs.event_start_time} onChange={handleChange} />
                        </div>
                        <div className="form-group col-md-3">
                            <label>Event Length</label>
                            <input type="text" className="form-control" name="event_length" value={formInputs.event_length} onChange={handleChange} />
                        </div>
                        <div className="col-md-1"></div>
                        <div className="form-group col-md-2">
                            <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-9 p-2">
                            {renderDetails('ORGANIZERS:', organizers)}
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-9 p-2">
                            {renderDetails('PARTICIPANTS:', participants)}
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }
    
    return (
        <div className="input-form bg-dark text-white">
            <h4 className="p-2">{operation.toUpperCase()} Form Data</h4>
            <form className="form-inline" onSubmit={(e) => e.preventDefault()}>
                <fieldset  className="p-2" disabled={operation === "view" ? true : false}>
                    {renderForm()}
                </fieldset>
            </form>
        </div>
    );
};

export default InputForm;

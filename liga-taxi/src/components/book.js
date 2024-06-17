import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import "../style/bookStyle.css";

const SERVICE_ACCOUNT_KEY = require('../key/calendar-426619-24f06dd61d75.json');
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

const Book = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        pickupLocation: '',
        dropOffLocation: '',
        pickupTime: '',
        pickupDate: '',
        phoneNumber: '',
        message: ''
    });

    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                // apiKey and clientId are not needed for service account auth
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                scope: SCOPES,
            }).then(() => {
                console.log("GAPI client initialized.");
                // After initialization, set up the service account authorization
                gapi.auth.setToken({
                    'access_token': SERVICE_ACCOUNT_KEY.private_key,
                    // Add additional token properties if necessary
                });
            }).catch(e => {
                console.error("Error initializing GAPI client", e);
            });
        };
        gapi.load("client:auth2", initClient);
    }, []);


    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const event = {
            summary: `${formData.firstName} ${formData.lastName} - Pickup`,
            location: formData.pickupLocation,
            description: formData.message,
            start: {
                dateTime: `${formData.pickupDate}T${formData.pickupTime}:00`,
                timeZone: 'America/Los_Angeles',
            },
            end: {
                dateTime: `${formData.pickupDate}T${formData.pickupTime}:00`,
                timeZone: 'America/Los_Angeles',
            },
            attendees: [{ email: formData.email }],
        };

        try {
            const response = await gapi.client.calendar.events.insert({
                calendarId: 'primary',  // Update with the calendar ID you want to modify
                resource: event,
            });
            console.log('Event created: ', response);
        } catch (error) {
            console.error('Error creating event: ', error);
        }
    };

    return (
        <div className="centerBook">
            <h1 className="font">Book Now!</h1>
            <form onSubmit={handleSubmit} className="inputBox">
                <div className="box1">
                    <div className="rowInput">
                        <div className="columnInput">
                            <label>Name (required)</label>
                            <input id="firstName" className="smallInput" type="text" onChange={handleChange} required />
                        </div>
                        <div className="columnInput">
                            <label>Surname (required)</label>
                            <input id="lastName" className="smallInput" type="text" onChange={handleChange} required />
                        </div>
                    </div>
                    <label>Email (required)</label>
                    <input id="email" className="bigInput" type="email" onChange={handleChange} required />
                    <label>Your Eircode / Pickup location (required)</label>
                    <input id="pickupLocation" className="bigInput" type="text" onChange={handleChange} required />
                    <label>Drop off location (required)</label>
                    <input id="dropOffLocation" className="bigInput" type="text" onChange={handleChange} required />
                    <div className="rowInput">
                        <div className="columnInput">
                            <label>Time (required)</label>
                            <input id="pickupTime" className="smallInput" type="time" onChange={handleChange} required />
                        </div>
                        <div className="columnInput">
                            <label>Date (required)</label>
                            <input id="pickupDate" className="smallInput" type="date" onChange={handleChange} required />
                        </div>
                    </div>
                </div>
                <div className="box2">
                    <label>Phone number (required)</label>
                    <h5 className="font margin">*Please include your country prefix - eg +353, +0044, +1 etc.</h5>
                    <input id="phoneNumber" className="bigInput" type="text" onChange={handleChange} required />
                    <label>Your message (optional)</label>
                    <textarea id="message" className="textArea" onChange={handleChange}></textarea>
                </div>
                <button className="bookNowBtn" type="submit">Book Now!</button>
            </form>
        </div>
    );
};

export default Book;

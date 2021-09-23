const express = require("express");
const fs = require("fs");

const router = express.Router();
const error = new Error();

////////////////////////////////GET METHOD - ALL EVENTS////////////////////////////////

// READ ALL events from the database/JSON file
router.get("/", (req, res, next) => {
    fs.readFile('./models/events.json', 'utf-8', (err, jsonString) => {
        if(err) {            
            error.message = 'Data Connection failed. Please try again later.';
            error.status = 400;
            next(error);
        } else {
            try {
                const data = JSON.parse(jsonString);
                return res.json(data);
            } catch(err) {
                error.message = 'Error Parsing JSON data.';
                error.status = 400;
                next(error);
            }
        }
    });    
});

//////////////////////////GET METHOD - GET SINGLE EVENT BASED ON ID//////////////////////

// READ an event specified by the id parameter in the REQUEST
router.get("/:id", (req, res, next) => {
    const eventId = req.params.id;
    fs.readFile('./models/events.json', 'utf-8', (err, jsonString) => {
        if(err) {
            error.message = 'Data Connection failed. Please try again later.';
            error.status = 400;
            next(error);
        } else {
            const events = JSON.parse(jsonString);
            if(events.length > 0) {
                const response = events.filter(event => {
                    return event.id === parseInt(eventId);
                });
                if(response.length <= 0){
                    error.message = `Event with id: ${eventId} does not exist`;
                    error.status = 400;
                    next(error);
                } else {
                    return res.json(response);
                }
            } else {
                error.message = `Unable to get event with id = ${eventId}`;
                error.status = 400;
                next(error);
            }
        }
    });
});

///////////////////////GET METHOD - SINGLE EVENT ORGANIZERS AND PARTICIPANTS//////////////////

// READ/GET organizers and participants for the specified event from the database/JSON file
router.get("/members/:eventId", (req, res, next) => {
    const eventId = req.params.eventId;
    const response = {
        organizers: [],
        participants: []
    };

// READ/GET ORGANIZERS FOR THE SPECIFIED EVENT    
    fs.readFile("./models/organizer.json", "utf-8", (err, jsonString) => {
        if(err) {
            error.message = 'Data Connection failed. Please try again later.';
            error.status = 400;
            next(error);
        } else {
            const organizers = JSON.parse(jsonString);
            response.organizers = organizers.filter(data => {
                return data.event_id === parseInt(eventId);
            });
        }
    });

// READ/GET PARTICIPANTS FOR THE SPECIFIED EVENT
    fs.readFile("./models/participants.json", "utf-8", (err, jsonString) => {
        if(err) {
            error.message = 'Data Connection failed. Please try again later.';
            error.status = 400;
            next(error);
        } else {
            const participants = JSON.parse(jsonString);
            response.participants = participants.filter(data => {
                return data.event_id === parseInt(eventId);
            });
            if(response.participants.length > 0 || response.organizers.length > 0) {
                return res.json(response);
            } else {
                error.message = `No organizers and participants found for event with id: ${eventId}`;
                error.status = 400;
                next(error);
            }
        }
    });
});

////////////////////////////////POST METHOD - CREATE AN EVENT////////////////////////////////

// WRITE an event into the database/JSON file based on the details provided from REQUEST body
router.post("/", (req, res, next) => {
    const { event_title, event_description, event_date, event_start_time, event_length, event_status } = req.body;
    if( !event_title || !event_date || !event_start_time) {
        error.message = 'Incorrect form submission';
        error.status = 400;
        next(error);
    };

    fs.readFile('./models/events.json', 'utf-8', (err, jsonString) => {
        if(err) {
            error.message = 'Data Connection failed. Please try again later.';
            error.status = 400;
            next(error);
        } else {
            const parseData = JSON.parse(jsonString);
            const data  = {
                id: parseData.length + 1,
                event_title: event_title,
                event_description: event_description,
                event_date: event_date,
                event_start_time: event_start_time,
                event_length: event_length,
                event_status: event_status
            };

            parseData.push(data);
            fs.writeFile('./models/events.json', JSON.stringify(parseData, null, 2), err => {
                if(err) {
                    error.message = 'Unable to create new event.';
                    error.status = 400;
                    next(error);
                } else {
                    return res.json(parseData);
                }
            });
        }
    });
});

////////////////////////////////DELETE METHOD - DELETE AN EVENT////////////////////////////////

//DELETE an event from the database/ JSON file based on the id parameter provided in REQUEST
router.delete("/:id", (req, res, next) => {
    const eventId = req.params.id;

    fs.readFile('./models/events.json', 'utf-8', (err, jsonString) => {
        if(err) {
            error.message = 'Data Connection failed. Please try again later.';
            error.status = 400;
            next(error);
        } else {
            let parseData = JSON.parse(jsonString);
            parseData = parseData.filter(data => {
                return data.id !== parseInt(eventId);
            });

            fs.writeFile('./models/events.json', JSON.stringify(parseData, null, 2), (err) => {
                if(err) {
                    error.message = `Unable to delete event: ${eventId}`;
                    error.status = 400;
                    next(error);
                } else {
                    return res.json(parseData);
                }
            });
        }
    });
});

////////////////////////////////PUT METHOD - EDIT AN EVENT///////////////////////////////////

//UPDATE an event in the database/JSON file 
router.put("/", (req, res, next) => {
    const { id, event_title, event_description, event_date, event_start_time, event_length, event_status } = req.body;

    fs.readFile('./models/events.json', 'utf-8', (err, jsonString) => {
        if(err) {
            error.message = 'Data Connection failed. Please try again later.';
            error.status = 400;
            next(error);
        } else {
            let parseData = JSON.parse(jsonString);
            parseData = parseData.map(data => {
                if(data.id === parseInt(id)) {
                    return {
                        id: parseInt(id),
                        event_title: event_title,
                        event_description: event_description,
                        event_date: event_date,
                        event_start_time: event_start_time,
                        event_length: event_length,
                        event_status: event_status
                    };
                } else {
                    return data;
                }
            });

            fs.writeFile('./models/events.json', JSON.stringify(parseData, null, 2), (err) => {
                if(err) {
                    error.message = 'Unable to update event.';
                    error.status = 400;
                    next(error);
                } else {
                    return res.json(parseData);
                }
            });
        }
    });
});


module.exports = router;
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'
import { useUser } from '../User/User'
import { useState, useRef, useEffect } from 'react'
import ical from 'ical.js'
import NavBar from '../Navbar/Navbar'
import { useTheme, ButtonGroup, Tooltip, TextField, IconButton, Button, styled, Toolbar, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, useMediaQuery } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { backendURL } from '../Backend/Backend.js';
import EventImport from './EventImport.js';

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment) // or globalizeLocalizer

const EventCalendar = (props) => {
    const { user, handleSetEvents, handleAddEvent, handleDeleteEvent, handleDeleteAllEvents } = useUser();
    const [open, setOpen] = useState(false);
    let eventStart = useRef(new Date());
    let eventEnd = useRef(new Date());
    const [title, setTitle] = useState('');
    const [openInstruction, setOpenInstruction] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
    const [canDeleteAll, setCanDeleteAll] = useState(false);
    useEffect(() => {
        if (user.getEvents().length > 0 && !canDeleteAll) {
            setCanDeleteAll(true);
        } else if (user.getEvents().length === 0 && canDeleteAll) {
            setCanDeleteAll(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.getEvents().length]);
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                parseICS(content);
            };
            reader.readAsText(file);
        }
    };

    const expandRecurringEvents = (vevent) => {
        const occurrences = [];
        const duration = new ical.Period({
            start: vevent.getFirstPropertyValue('dtstart'),
            end: vevent.getFirstPropertyValue('dtend')
        }).getDuration();
        const summary = vevent.getFirstPropertyValue('summary');

        const expand = new ical.RecurExpansion({
            component: vevent,
            dtstart: vevent.getFirstPropertyValue('dtstart')
        });
        let next;
        while ((next = expand.next()) && occurrences.length < 100) {
            const startDate = new Date(next.toString());
            next.addDuration(duration);
            const endDate = new Date(next.toString());
            occurrences.push({
                start: startDate,
                end: endDate,
                title: summary
            });
        }

        return occurrences;
    };

    const parseICS = (data) => {
        const jcalData = ical.parse(data);
        const comp = new ical.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent');

        const allEvents = [];
        vevents.forEach(vevent => {
            const occurrences = expandRecurringEvents(vevent);
            allEvents.push(...occurrences);
        });

        const updatedEvents = [...user.getEvents(), ...allEvents];
        const hasEvents = user.getEvents().length > 0;
        const dataToSend = JSON.stringify({ events: (hasEvents ? allEvents : updatedEvents) });
        fetch(`${backendURL}/events/${user.getId()}`, {
            method: (hasEvents ? 'PUT' : 'POST'),
            headers: {
                'Content-Type': 'application/json'
            },
            body: dataToSend
        }).catch(error => {
            console.error('Fetch error:', error);
        });
        sessionStorage.setItem(user.getId(), JSON.stringify(updatedEvents));
        handleSetEvents(user.getId(), updatedEvents);
    };
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });
    const theme = useTheme();
    const fullWidth = useMediaQuery(theme.breakpoints.down('md'));
    const handleSelect = ({ start, end }) => {
        setOpen(true);
        eventStart.current = start;
        eventEnd.current = end;
    };
    const handleSave = () => {
        const newEvent = {
            start: eventStart.current,
            end: eventEnd.current,
            title: title
        };
        handleAddEvent(newEvent);
        setOpen(false);
        setTitle('');
    };
    const handleCancel = () => {
        setOpen(false);
        setTitle('');
    };
    const handleEnter = (e, func) => {
        if (e.key === 'Enter') {
            func();
        }
    };
    const handleCloseDialog = () => {
        setOpenInstruction(false);
    };
    const handleSelectEvent = (event) => {
        if (!isSelected) {
            setIsSelected(true);
            setSelectedEvent(event);
            return;
        }
        if (selectedEvent.start === event.start && selectedEvent.end === event.end && selectedEvent.title === event.title) {
            setIsSelected(false);
            setSelectedEvent(null);
            return;
        }
        setSelectedEvent(event);
    };
    const handleDelete = () => {
        handleDeleteEvent(selectedEvent);
        setDeleteConfirm(false);
        setIsSelected(false);
        setSelectedEvent(null);
    }
    const handleDeleteAll = () => {
        handleDeleteAllEvents();
        setDeleteAllConfirm(false);
    };
    return (
        <div>
            <NavBar />
            <div style={{ top: '80px', height: 'calc(100vh - 80px)', width: '100%' }} >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                    <ButtonGroup variant="contained" >
                        <Button variant="contained" disabled={!isSelected} sx={{ backgroundColor: '#f44336' }} onClick={() => setDeleteConfirm(true)} >
                            <DeleteIcon /> Delete Event
                        </Button>
                        <Button variant="contained" disabled={!canDeleteAll} sx={{ backgroundColor: '#f44336' }} onClick={() => setDeleteAllConfirm(true)} >
                            <DeleteForeverIcon /> Delete All Events
                        </Button>
                    </ButtonGroup>
                    <div>
                        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                            Upload file (.ics)
                            <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
                        </Button>
                        <Tooltip title="Instructions for Exporting .ics File">
                            <IconButton variant="contained" sx={{ marginLeft: '10px' }} onClick={() => setOpenInstruction(true)}>
                                <InfoIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Toolbar>
                <EventImport openInStruction={openInstruction} handleCloseDialog={handleCloseDialog} />
                <Dialog open={open} onClose={handleCancel} maxWidth='md' fullWidth >
                    <DialogTitle sx={{ fontWeight: '900' }}>Add a New Event</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <strong>Selected Slot:</strong>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                <span>Start: {eventStart.current.toLocaleString()}</span>
                                <span>End: {eventEnd.current.toLocaleString()}</span>
                            </div>
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Event Title"
                            id='event-title'
                            type="text"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => handleEnter(e, handleSave)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={deleteAllConfirm} onClose={() => setDeleteAllConfirm(false)} maxWidth='md' fullWidth >
                    <DialogTitle sx={{ fontWeight: '900' }}>Delete All Events</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete all events?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteAllConfirm(false)}>Cancel</Button>
                        <Button sx={{ color: '#f44336' }} onClick={handleDeleteAll}>Delete ALL</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)} maxWidth='md' fullWidth >
                    <DialogTitle sx={{ fontWeight: '900' }}>Delete Event</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this event?
                        </DialogContentText>
                        <DialogContentText sx={{ marginTop: '16px', paddingLeft: '16px' }}>
                            <div><strong>Title: {selectedEvent?.title}</strong></div>
                            <div><strong>Start: {selectedEvent?.start?.toLocaleString()}</strong></div>
                            <div><strong>End: {selectedEvent?.end?.toLocaleString()}</strong></div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteConfirm(false)}>Cancel</Button>
                        <Button sx={{ color: '#f44336' }} onClick={handleDelete}>Delete</Button>
                    </DialogActions>
                </Dialog>
                <div style={{ height: 'calc(100vh - 80px - 64px)', width: '100%' }}>
                    <Calendar
                        localizer={localizer}
                        events={user.getEvents()}
                        popup
                        selectable
                        defaultView={fullWidth ? 'week' : 'month'}
                        onSelectSlot={handleSelect}
                        startAccessor="start"
                        endAccessor="end"
                        onSelectEvent={handleSelectEvent}
                        selected={selectedEvent}
                    />
                </div>
            </div>
        </div>
    );
}

export default EventCalendar;
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

const EventImport = (props) => {
    const { openInStruction, handleCloseDialog } = props;
    return (
        <Dialog open={openInStruction} onClose={handleCloseDialog}>
            <DialogTitle sx={{fontWeight: '900'}}>Export Calendar Events</DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1" sx={{ fontWeight: '600' }} >
                    To export calendar events as an ICS file from Outlook Calendar:
                </Typography>
                <Typography variant="body1" sx={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '16px' }} >
                    1. Open Outlook and click the gear icon at the top right corner.
                    <br />
                    2. Select "View All Outlook Settings".
                    <br />
                    3. Go to "Calendar" settings.
                    <br />
                    4. Click "Shared Calendars".
                    <br />
                    5. Under "Publish a Calendar", select your calendar.
                    <br />
                    6. Click "Publish" and a link will pop up.
                    <br />
                    7. Use the ICS link provided to download the calendar locally on your device.
                </Typography>
                <Typography variant="subtitle1" style={{ marginTop: '16px', fontWeight: '600' }}>
                    To export calendar events as an ICS file from Google Calendar:
                </Typography>
                <Typography variant="body1">
                    1. Open Google Calendar and go to your calendar.
                    <br />
                    2. Click on the settings icon and select "Settings".
                    <br />
                    3. Choose the calendar you want to export on the left-hand side.
                    <br />
                    4. Scroll down to find the "Export" section and click on "Export" to download the ICS file.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EventImport;
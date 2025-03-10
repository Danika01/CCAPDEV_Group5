/* Install Command:
    npm init -y
    npm i express express-handlebars body-parser
    npm install express-session
    npm install mongoose
    npm install dotenv
*/

require('dotenv').config();
const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    try {
        await mongoose.connect(process.env.DB_URI);
    } catch (err) {
        console.error(err);
    }
}

const express = require('express');
const server = express();
const dataModule = require('../model/data.js');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');


server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
const {data} = require("express-session/session/cookie");
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
}));

server.set('views', path.join(__dirname, '..', '..', 'src', 'views'));
server.use(express.static(path.join(__dirname, '..', 'public')));

// used to store user-specific data (e.g., the logged-in user's email)
server.use(session({
    secret: 'your-secret-key', // Replace with a secure key
    resave: false, // Don't save the session if it wasn't modified
    saveUninitialized: true, // Save new sessions
    cookie: { secure: false } // Set to true if using HTTPS
}));

// root route
server.get('/', function(req, resp) {
    resp.redirect('/login');
});

const carouselImages = [
    "../Images/lab.png",
    "../Images/lab2.png"
];

// render login.hbs (GET request)
server.get('/login', function(req, resp) {
    const announcements = dataModule.getAnnouncements(req, resp);
    const unavailableRooms = dataModule.getUnavailableRooms(req, resp);

    resp.render('login', {
        layout: 'index',
        title: 'Login Page',
        carouselImages: carouselImages, 
        announcements: announcements, 
        unavailableRooms: unavailableRooms
    });
});

// render login.hbs (POST request)
server.post('/login', function(req, resp) {
    const { email, password } = req.body;
    const user = dataModule.getUserData({email, password});

    if (user) {
        req.session.email = email; // Store email for search matching purposes
        resp.redirect('/account'); 
    } else {
        resp.status(404).send('User not found'); // User not found or invalid credentials
    }
});

// used for lab-select-building, room
const defaultSeats = 20; // Default number of seats for all rooms


// render home.hbs
server.get('/home', function(req, resp) {
    const email = req.session.email; 
    const userData = dataModule.getUserData({email});
    const reservations = dataModule.getReservationData(req, resp);
    const uniqueBuildings = dataModule.getBuildings();

    resp.render('home', {
        layout: 'index',
        title: 'Animo LabLink',
        reservations: reservations,
        currentRoute: 'home',
        uniqueBuildings: uniqueBuildings,
        selectedBuilding: req.session.building || "Choose a building",
        selectedDate: req.session.date || "",
        selectedTimeIn: req.session.timeIn || "08:00",
        selectedTimeOut: req.session.timeOut || "08:30",
        pfp: userData.pfp || '/Images/default.jpg'
    });
});


server.post('/set-session', (req, res) => {
   // req.session.building = req.body.building || "Choose building",
    req.session.date = req.body.date;
    req.session.timeIn = req.body.timeIn;
    req.session.timeOut = req.body.timeOut;
    res.json({ message: "Session updated successfully!" });
});


server.get('/get-session-data', (req, res) => {
    res.json({
        building: req.session.building || "Choose building",
        date: req.session.date || "",
        timeIn: req.session.timeIn || "08:00",
        timeOut: req.session.timeOut || "08:30"
    });
});


// render account.hbs
server.get('/account', function(req, resp) {
    const reservations = dataModule.getReservationData(req,resp);
    let email = req.session.email; 

    // USE EMAIL VARIABLE WHEN DONE CODING SESSION 
    const userData = dataModule.getUserData({email});

    console.log("User Data:", userData); // Debugging log

    resp.render('account', {
        layout: 'index',
        title: 'Account Page',
        name: userData.name, 
        aboutInfo: userData.aboutInfo,
        pfp: userData.pfp, // Should contain the image path
        reservations: reservations,
        currentRoute: 'account'
    });
});


// render edit-profile.hbs
server.get('/edit-profile', function(req, resp) {
    const email = req.session.email; 
    const userData = dataModule.getUserData({email});

    resp.render('edit-profile', {
        layout: 'index',
        title: 'Edit Profile',
        name: userData.name,
        aboutInfo: userData.aboutInfo,
        pfp: userData.pfp || '/Images/default.jpg'
    });
});

// render lab-select-building.hbs
server.get('/lab-select-building/:building?', function(req, res) {
    const email = req.session.email; 
    const userData = dataModule.getUserData({email});
    const uniqueBuildings = dataModule.getBuildings();

    // Get selected building from route param, session, or default
    let selectedBuilding = req.params.building || req.session.building || uniqueBuildings[0];

    let filteredRooms = dataModule.getLabsInBuilding(req, res);

    res.render('lab-select-building', {
        layout: 'index',
        title: 'Select Building and Room',
        uniqueBuildings,
        buildings: filteredRooms,
        defaultSeats: defaultSeats,
        currentRoute: 'lab-select-building',
        pfp: userData.pfp || '/Images/default.jpg',
        selectedBuilding,
        isTechnician: false
    });
});


// update table to only show rooms on selected building
server.get('/get-rooms', (req, res) => {
    const selectedBuilding = req.query.building; // get building from request
    const allRooms = dataModule.getLaboratories(req, res);
    const filteredRooms = allRooms.filter(lab => lab.building === selectedBuilding); 
    res.json(filteredRooms);
});


// render reservation.hbs
server.get('/reservations', function(req, resp) {
    const reservations = dataModule.getReservationData(req, resp);
    const email = req.session.email; 
    const userData = dataModule.getUserData({email});

    resp.render('reservations', {
        layout: 'index',
        title: 'Reservations',
        reservations: reservations,
        currentRoute: 'reservations',
        pfp: userData.pfp || '/Images/default.jpg'
    });
});

// render room.hbs
server.get('/room/:building/:room', function(req, resp) {
    const { building, room } = req.params;
    const email = req.session.email;
    const userData = dataModule.getUserData({email});

    // Get all seat data for this room
    const allSeats = dataModule.getSeatData();
    
    // Default date & time if not set in session
    if (!req.session.date) req.session.date = new Date().toISOString().split("T")[0];
    if (!req.session.timeIn) req.session.timeIn = "08:00";
    if (!req.session.timeOut) req.session.timeOut = "08:30";

    const selectedDate = req.session.date;
    const selectedStartTime = req.session.timeIn;
    const selectedEndTime = req.session.timeOut;

    console.log("Selected Date:", selectedDate);
    console.log("Start Time:", selectedStartTime);
    console.log("End Time:", selectedEndTime);

    const roomSeats = allSeats
        .filter(seat => seat.roomNum === room)
        .map(seat => {
            console.log(`Checking Seat ${seat.seatNum} in Room ${room}`);

            if (!Array.isArray(seat.reservations)) {
                console.log(`Seat ${seat.seatNum} has no reservations array.`);
                return { ...seat, reserved: false, reservationName: null, profileLink: null };
            }

            // Find reservation that matches the selected date & overlaps with the selected time
            const reservation = seat.reservations.find(r => 
                r.reservationDate === selectedDate &&
                !(r.endTime <= selectedStartTime || r.startTime >= selectedEndTime)
            );

            return {
                ...seat,
                reserved: !!reservation,
                reservationName: reservation ? reservation.name : null,
                isAnonymous: reservation ? reservation.isAnonymous : false,
                profileLink: reservation ? `/profile/${reservation.email}` : null
            };
        });

    resp.render('room', {
        layout: 'index',
        title: `Room ${room}`,
        seats: roomSeats,
        building: building,
        room: room,
        buildings: buildings,
        pfp: userData.pfp || '/Images/default.jpg',
        date: selectedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        hasAvailableSeats: roomSeats.some(seat => !seat.reserved)
    });
});



// check if seats are available
server.get('/check-seat-availability', (req, res) => {
    const { room, date, timeIn, timeOut } = req.query;

    if (!room || !date || !timeIn || !timeOut) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    // Get seat data for the selected room
    const seats = dataModule.getSeatData().filter(seat => seat.roomNum === room);

    // Check if ANY seat is occupied during the requested time
    const isSeatUnavailable = seats.some(seat => {
        return seat.reservations.some(reservation => {
            // Convert reservationDate to YYYY-MM-DD before comparing
            const formattedReservationDate = new Date(reservation.reservationDate).toISOString().split('T')[0];
    
            return formattedReservationDate === date &&
                   !(timeOut <= reservation.startTime || timeIn >= reservation.endTime);
        });
    });
    

    res.json({ hasAvailableSeats: !isSeatUnavailable });
});







// render admin-lab-reserve.hbs
server.get('/admin-lab-reserve/:building/:room', function(req, resp) {
    const seatData = dataModule.getSeatData(); 
    const building = req.params.building; 
    const room = req.params.room; 
    const email = req.session.email; 
    const userData = dataModule.getUserData({email});

    resp.render('admin-lab-reserve', {
        layout: 'index',
        title: 'Admin Lab Reservation',
        seats: seatData, 
        building: building, 
        room: room, 
        buildings: buildings, 
        pfp: userData.pfp || '/Images/default.jpg'
    });
});

// render edit-reservation.hbs
server.get('/edit-reservation/:reservationId', function(req, resp) {
    const reservationId = req.params.reservationId; // Get reservation ID from URL
    const reservations = dataModule.getReservationData(req, resp); // Get all reservations
    const reservation = reservations.find(res => res.reservationId === reservationId); // Find the specific reservation by ID

    const email = req.session.email; 
    const userData = dataModule.getUserData({email});
    
    if (!reservation) {
        // Handle case where reservation is not found
        resp.status(404).send('Reservation not found');
        return;
    }

    resp.render('edit-reservation', {
        layout: 'index',
        title: 'Edit Reservation',
        reservations: [reservation], // Pass the reservation as an array (for {{#each}})
        pfp: userData.pfp || '/Images/default.jpg'
    });
});

server.post('/edit-reservation', (req, res) => {
    const { building, room, reservationId, reservationDate, startTime, endTime } = req.body;

    req.session.date = reservationDate;
    req.session.timeIn = startTime;
    req.session.timeOut = endTime;

    console.log(`Editing reservation for Room: ${room} in ${building}`);
    console.log(`Reservation ID: ${reservationId}`);
    console.log(`Date: ${reservationDate}`);
    console.log(`Start Time: ${startTime}`);
    console.log(`End Time: ${endTime}`);

    // TODO: Update reservation logic in your data module

    // Redirect back to the room page after editing
    res.redirect(`/room/${building}/${room}`);
});


server.get('/logout', function(req, resp) {
    req.session.destroy(); 
    resp.redirect('/login');
});




const port = process.env.PORT || 3000;
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    server.listen(port, () => console.log('Listening at port '+port));
});

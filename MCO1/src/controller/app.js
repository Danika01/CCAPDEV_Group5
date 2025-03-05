/* Install Command:
    npm init -y
    npm i express express-handlebars body-parser
    npm install express-session
*/

const express = require('express');
const server = express();
const dataModule = require('../model/data.js');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');


server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
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
    const announcements = dataModule.getAnnouncements(); 
    const unavailableRooms = dataModule.getUnavailableRooms(); 

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
    const users = dataModule.getAllUsers(); 
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        req.session.email = email; // Store email for search matching purposes
        resp.redirect('/account'); 
    } else {
        resp.status(404).send('User not found'); // User not found or invalid credentials
    }
});

// used for lab-select-building, room
let buildings =  dataModule.getLaboratories();
const defaultSeats = 20; // Default number of seats for all rooms
let uniqueBuildings = [...new Set(buildings.map(lab => lab.building))];

// render home.hbs
server.get('/home', function(req, resp) {
    const email = req.session.email; 
    const userData = dataModule.getUserData("john_doe@dlsu.edu.ph");
    const reservations = dataModule.getReservationData(); 

    resp.render('home', {
        layout: 'index',
        title: 'Animo LabLink',
        reservations: reservations,
        currentRoute: 'home',
        uniqueBuildings: uniqueBuildings,
        pfp: userData.pfp || '/Images/default.jpg'
    });
});

// render account.hbs
server.get('/account', function(req, resp) {
    const reservations = dataModule.getReservationData();
    let email = req.session.email; 

    // USE EMAIL VARIABLE WHEN DONE CODING SESSION 
    const userData = dataModule.getUserData("john_doe@dlsu.edu.ph");  

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
    const userData = dataModule.getUserData("john_doe@dlsu.edu.ph"); 

    resp.render('edit-profile', {
        layout: 'index',
        title: 'Edit Profile',
        name: userData.name,
        aboutInfo: userData.aboutInfo,
        pfp: userData.pfp || '/Images/default.jpg'
    });
});

// render lab-select-building.hbs
server.get('/lab-select-building', function(req, resp) {
    const email = req.session.email; 
    const userData = dataModule.getUserData("john_doe@dlsu.edu.ph"); 
    let selectedBuilding = req.query.building || uniqueBuildings[0];
    let filteredRooms = buildings.filter(b => b.building === selectedBuilding);

    resp.render('lab-select-building', {
        layout: 'index',
        title: 'Select Building and Room',
        uniqueBuildings, 
        buildings: filteredRooms, 
        defaultSeats: defaultSeats,
        currentRoute: 'lab-select-building',
        pfp: userData.pfp || '/Images/default.jpg',
        selectedBuilding
    });
});




// update table to only show rooms on selected building
server.get('/get-rooms', (req, res) => {
    const selectedBuilding = req.query.building; // get building from request
    const allRooms = dataModule.getLaboratories();
    const filteredRooms = allRooms.filter(lab => lab.building === selectedBuilding); 
    res.json(filteredRooms);
});


// render reservation.hbs
server.get('/reservations', function(req, resp) {
    const reservations = dataModule.getReservationData(); 
    const email = req.session.email; 
    const userData = dataModule.getUserData("john_doe@dlsu.edu.ph"); 

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
    const userData = dataModule.getUserData("john_doe@dlsu.edu.ph");
    
    const allSeats = dataModule.getSeatData(); 
    const seatData = allSeats.filter(seat => seat.building === building && seat.room === room);
    console.log(seatData);

    // Render the room.hbs view with the filtered data
    resp.render('room', {
        layout: 'index',
        title: `Room ${room}`,
        seats: seatData, 
        building: building,
        room: room,
        buildings: buildings,
        pfp: userData.pfp || '/Images/default.jpg'
    });
});


// render admin-lab-reserve.hbs
server.get('/admin-lab-reserve/:building/:room', function(req, resp) {
    const seatData = dataModule.getSeatData(); 
    const building = req.params.building; 
    const room = req.params.room; 
    const email = req.session.email; 
    const userData = dataModule.getUserData("john_doe@dlsu.edu.ph"); 

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
    const reservations = dataModule.getReservationData(); // Get all reservations
    const reservation = reservations.find(res => res.reservationId === reservationId); // Find the specific reservation by ID

    const email = req.session.email; 
    const userData = dataModule.getUserData("john_doe@dlsu.edu.ph"); 
    
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

server.get('/logout', function(req, resp) {
    req.session.destroy(); 
    resp.redirect('/login');
});

const port = process.env.PORT || 3000;
server.listen(port, function(){
    console.log('Listening at port '+port);
});

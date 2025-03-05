/* Install Command:
    npm init -y
    npm i express express-handlebars body-parser
    npm install express-session
*/


const uri = "mongodb+srv://raiisidro:FJqTP3XObvW6TeF6@g5cluster.9w6ce.mongodb.net/?retryWrites=true&w=majority&appName=G5Cluster";
const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    try {
        await mongoose.connect(uri);
    } catch (err) {
        console.error(err);
    }
}

const express = require('express');
const server = express();
const dataModule = require('./data.js');
const session = require('express-session');
const path = require('path');

const bodyParser = require('body-parser');
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
const {mongo} = require("mongoose");
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
}));

server.set('views', path.join(__dirname, 'views'));
server.use(express.static('public'));

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

// render home.hbs
server.get('/home', function(req, resp) {
    const email = req.session.email; 
    const userData = dataModule.getUserData(email);
    const reservations = dataModule.getReservationData(); 

    resp.render('home', {
        layout: 'index',
        title: 'Animo LabLink',
        reservations: reservations,
        currentRoute: 'home',
        pfp: userData.pfp
    });
});

// render account.hbs
server.get('/account', function(req, resp) {
    const reservations = dataModule.getReservationData();
    const email = req.session.email; 
    const userData = dataModule.getUserData(email); 

    resp.render('account', {
        layout: 'index',
        title: 'Account Page',
        name: userData.name, 
        aboutInfo: userData.aboutInfo,
        pfp: userData.pfp,
        reservations: reservations,
        currentRoute: 'account'
    });
});

// render edit-profile.hbs
server.get('/edit-profile', function(req, resp) {
    const email = req.session.email; 
    const userData = dataModule.getUserData(email); 

    resp.render('edit-profile', {
        layout: 'index',
        title: 'Edit Profile',
        name: userData.name,
        aboutInfo: userData.aboutInfo,
        pfp: userData.pfp,
    });
});

// used for lab-lab-select-building, room
const buildings = [
    {
        name: "Andrew Building",
        rooms: ["A1706", "A1904"]
    },
    {
        name: "Gokongwei Building",
        rooms: ["G210", "G211", "G302A", "G302B", "G304A", "G304B", "G306A", "G306B", "G404A", "G404B"]
    },
    {
        name: "St. Joseph Hall",
        rooms: ["J212"]
    },
    {
        name: "St. La Salle Hall",
        rooms: ["L212", "L229", "L320", "L335"]
    },
    {
        name: "Velasco Hall",
        rooms: ["V103", "V205", "V206", "V208A", "V208B", "V301", "V310"]
    },
    {
        name: "Yuchengco Building",
        rooms: ["Y602"]
    }
];

const defaultSeats = 20; // Default number of seats for all rooms

// render lab-select-building.hbs
server.get('/lab-select-building', function(req, resp) {
    const email = req.session.email; 
    const userData = dataModule.getUserData(email); 

    resp.render('lab-select-building', {
        layout: 'index',
        title: 'Select Building and Room',
        buildings: buildings, 
        defaultSeats: defaultSeats,
        currentRoute: 'lab-select-building',
        pfp: userData.pfp
    });
});

// render reservation.hbs
server.get('/reservations', function(req, resp) {
    const reservations = dataModule.getReservationData(); 
    const email = req.session.email; 
    const userData = dataModule.getUserData(email); 

    resp.render('reservations', {
        layout: 'index',
        title: 'Reservations',
        reservations: reservations,
        currentRoute: 'reservations',
        pfp: userData.pfp
    });
});

// render room.hbs
server.get('/room/:building/:room', function(req, resp) {
    const seatData = dataModule.getSeatData(); // Get seat data from data.js
    const building = req.params.building; // Get building that the user is currently viewing from URL
    const room = req.params.room; // Get room from URL
    const email = req.session.email; 
    const userData = dataModule.getUserData(email); 

    resp.render('room', {
        layout: 'index',
        title: 'Room Page',
        seats: seatData, 
        building: building, // Building the user is currently viewing
        room: room, // Room the user is currently viewing
        buildings: buildings, // Array used to dynamically generate links or options for a dropdown or list of buildings
        pfp: userData.pfp
    });
});

// render admin-lab-reserve.hbs
server.get('/admin-lab-reserve/:building/:room', function(req, resp) {
    const seatData = dataModule.getSeatData(); 
    const building = req.params.building; 
    const room = req.params.room; 
    const email = req.session.email; 
    const userData = dataModule.getUserData(email); 

    resp.render('admin-lab-reserve', {
        layout: 'index',
        title: 'Admin Lab Reservation',
        seats: seatData, 
        building: building, 
        room: room, 
        buildings: buildings, 
        pfp: userData.pfp
    });
});

// render edit-reservation.hbs
server.get('/edit-reservation/:reservationId', function(req, resp) {
    const reservationId = req.params.reservationId; // Get reservation ID from URL
    const reservations = dataModule.getReservationData(); // Get all reservations
    const reservation = reservations.find(res => res.reservationId === reservationId); // Find the specific reservation by ID

    const email = req.session.email; 
    const userData = dataModule.getUserData(email); 
    
    if (!reservation) {
        // Handle case where reservation is not found
        resp.status(404).send('Reservation not found');
        return;
    }

    resp.render('edit-reservation', {
        layout: 'index',
        title: 'Edit Reservation',
        reservations: [reservation], // Pass the reservation as an array (for {{#each}})
        pfp: userData.pfp
    });
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


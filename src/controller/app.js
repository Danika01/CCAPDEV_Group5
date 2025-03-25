/* Install Command:
    npm init -y
    npm i express express-handlebars body-parser
    npm install express-session
    npm install mongoose
    npm install dotenv
*/

//require('dotenv').config();
// const mongoose = require('mongoose');

// Connect to MongoDB Atlas
const mongoose = require('mongoose');

const DB_URI = "mongodb+srv://raiisidro:FJqTP3XObvW6TeF6@g5cluster.9w6ce.mongodb.net/LabLink?retryWrites=true&w=majority&appName=G5Cluster";


mongoose.connect(DB_URI)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch(err => console.error("MongoDB Atlas connection error:", err));


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
    },
    allowProtoPropertiesByDefault: true,  
    allowProtoMethodsByDefault: true      
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
server.get('/login', async function(req, resp) {
    try {
        const announcements = await dataModule.getAnnouncements(req, resp);
        const unavailableRooms = await dataModule.getUnavailableRooms(req, resp);

        resp.render('login', {
            layout: 'index',
            title: 'Login Page',
            carouselImages: carouselImages,
            announcement: announcements,
            unavailableRooms: unavailableRooms
        });
    } catch (error) {
        console.error("Error fetching data for /login:", error);
        resp.status(500).send("Error: Unable to fetch required data.");
    }
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
server.get('/home', async function(req, resp) {
    try {
        const email = req.session.email || "john_doe@dlsu.edu.ph"; 
        const userData = await dataModule.getUserData(email); 

        const reservations = await dataModule.getReservationData(email);
        const uniqueBuildings = await dataModule.getBuildings();

        console.log("User Data:", userData);
        console.log("Buildings:", uniqueBuildings); 

        resp.render('home', {
            layout: 'index',
            title: 'Animo LabLink',
            reservations: reservations || [],
            currentRoute: 'home',
            uniqueBuildings: uniqueBuildings || [], 
            selectedBuilding: req.session.building || "Choose a building",
            selectedDate: req.session.date || "",
            selectedTimeIn: req.session.timeIn || "08:00",
            selectedTimeOut: req.session.timeOut || "08:30",
            pfp: userData?.pfp || '/Images/default.png', 
            name: userData?.name || "Guest"  
        });

    } catch (error) {
        console.error("Error fetching data for /home:", error);
        resp.status(500).send("Internal Server Error");
    }
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
server.get('/account', async function(req, resp) {
    try {
        let email = req.query.email || req.session.email || "john_doe@dlsu.edu.ph"; 
        const userData = await dataModule.getUserData(email); 
        const reservations = await dataModule.getReservationData(email); 

        console.log("User Data:", userData); 
        console.log("Reservations:", reservations); 

        resp.render('account', {
            layout: 'index',
            title: 'Account Page',
            name: userData?.name || "Guest",  
            aboutInfo: userData?.aboutInfo || "No information available.",
            pfp: userData?.pfp || '/Images/default.png', 
            reservations: reservations || [],
            currentRoute: 'account'
        });

    } catch (error) {
        console.error("Error fetching data for /account:", error);
        resp.status(500).send("Internal Server Error");
    }
});



// render edit-profile.hbs
server.get('/edit-profile', async function(req, resp) {
    try {
        const email = req.session.email || "john_doe@dlsu.edu.ph"; 
        const userData = await dataModule.getUserData(email); // Await here!

        resp.render('edit-profile', {
            layout: 'index',
            title: 'Edit Profile',
            name: userData?.name || "Guest",
            aboutInfo: userData?.aboutInfo || "No information available.",
            pfp: userData?.pfp || '/Images/test.jpg'
        });
    } catch (error) {
        console.error("Error fetching user data for /edit-profile:", error);
        resp.status(500).send("Internal Server Error");
    }
});


// render lab-select-building.hbs
server.get('/lab-select-building/:building?', async function(req, res) {
    const email = req.session.email; 
    const userData = await dataModule.getUserData("john_doe@dlsu.edu.ph");
    const uniqueBuildings = await dataModule.getBuildings();  // Get all unique buildings
    const selectedBuilding = req.params.building || req.session.building || uniqueBuildings[0];

    // Get labs in the selected building
    let filteredRooms = await dataModule.getLabsInBuilding(selectedBuilding); 
    filteredRooms = filteredRooms.map(room => room.toObject());
    console.log("THE ROOMS ARE" + filteredRooms);  


    res.render('lab-select-building', {
        layout: 'index',
        title: 'Select Building and Room',
        uniqueBuildings,
        laboratories: filteredRooms,  
        currentRoute: 'lab-select-building',
        pfp: userData.pfp || '/Images/default.png',
        selectedBuilding,
        isTechnician: false
    });
});


// update table to only show rooms on selected building
server.get('/get-rooms', async (req, res) => {
    const selectedBuilding = req.query.building;
    if (!selectedBuilding) {
        return res.status(400).send({ error: 'Building parameter is required.' });
    }
    const allRooms = await dataModule.getLaboratories(); 
    const filteredRooms = allRooms.filter(lab => lab.building === selectedBuilding);
    res.json(filteredRooms);
});



// render reservation.hbs
server.get('/reservations', async function(req, resp) {
    try {
        const email = req.session.email || "john_doe@dlsu.edu.ph"; // Use session email
        const reservations = await dataModule.getReservationData(email); 
        const userData = await dataModule.getUserData(email); 

        console.log("Reservations:", reservations); // Debugging

        resp.render('reservations', {
            layout: 'index',
            title: 'Reservations',
            reservations: reservations || [], 
            currentRoute: 'reservations',
            pfp: userData?.pfp || '/Images/default.png'
        });
    } catch (error) {
        console.error("Error fetching reservations:", error);
        resp.status(500).send("Internal Server Error");
    }
});




// render room.hbs
server.get('/room/:building/:room', async function(req, resp) {
    const { building, room } = req.params;
    const email = req.session.email;

    let userData;
    try {
        userData = await dataModule.getUserData(email || "john_doe@dlsu.edu.ph");
    } catch (error) {
        console.error("Error fetching user data:", error);
        return resp.status(500).send("Error: Unable to fetch user data.");
    }

    let allSeats;
    try {
        allSeats = await dataModule.getSeatData(); // Await the result from the DB
    } catch (error) {
        console.error("Error fetching seat data:", error);
        return resp.status(500).send("Error: Unable to fetch seat data.");
    }

    if (!Array.isArray(allSeats)) {
        console.error("Expected an array but got:", typeof allSeats);
        return resp.status(500).send("Error: Seat data is not an array.");
    }

    // Default date & time if not set in session
    if (!req.session.date) req.session.date = new Date().toISOString().split("T")[0];
    if (!req.session.timeIn) req.session.timeIn = "08:00";
    if (!req.session.timeOut) req.session.timeOut = "08:30";

    const selectedDate = req.session.date;
    const selectedStartTime = req.session.timeIn;
    const selectedEndTime = req.session.timeOut;

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
        buildings: req.session.building,
        pfp: userData?.pfp || '/Images/test.jpg',
        date: selectedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        currentRoute: 'reservations',
        hasAvailableSeats: roomSeats.some(seat => !seat.reserved)
    });
});


// check if seats are available
server.get('/check-seat-availability', async (req, res) => {
    const { room, date, timeIn, timeOut } = req.query;

    if (!room || !date || !timeIn || !timeOut) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    let seats;
    try {
        seats = await dataModule.getSeatData(); 
    } catch (error) {
        console.error("Error fetching seat data:", error);
        return res.status(500).json({ error: "Unable to fetch seat data" });
    }

    // Filter for the selected room
    const filteredSeats = seats.filter(seat => seat.roomNum === room);

    // Check if ANY seat is occupied during the requested time
    const isSeatUnavailable = filteredSeats.some(seat => {
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
server.get('/admin-lab-reserve/:building/:room', async function(req, resp) {
    try {
        const seatData = await dataModule.getSeatData();
        const building = req.params.building;
        const room = req.params.room;
        const email = req.session.email;

        const userData = await dataModule.getUserData(email || "john_doe@dlsu.edu.ph");

        resp.render('admin-lab-reserve', {
            layout: 'index',
            title: 'Admin Lab Reservation',
            seats: seatData, 
            building: building,
            room: room,
            buildings: buildings,
            pfp: userData?.pfp || '/Images/default.png'
        });
    } catch (error) {
        console.error("Error fetching data for /admin-lab-reserve:", error);
        resp.status(500).send("Error: Unable to fetch required data.");
    }
});


// render edit-reservation.hbs
server.get('/edit-reservation/:reservationId', async function(req, resp) {
    const reservationId = req.params.reservationId; // Get reservation ID from URL
    const email = req.session.email; 

    const reservation = await dataModule.getReservationByReservationId(reservationId); 
    const userData = await dataModule.getUserData("john_doe@dlsu.edu.ph");
    
    if (!reservation) {
        resp.status(404).send('Reservation not found');
        return;
    }

    resp.render('edit-reservation', {
        layout: 'index',
        title: 'Edit Reservation',
        reservation: reservation,
        pfp: userData.pfp || '/Images/default.png', // use session for this in the future
        currentRoute: 'reservations'
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

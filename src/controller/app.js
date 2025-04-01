/* Install Command:
    npm init -y
    npm i express express-handlebars body-parser
    npm install express-session
    npm install mongoose
    npm install dotenv
*/

// Connect to MongoDB Atlas
const mongoose = require('mongoose');
const DB_URI = "mongodb+srv://raiisidro:FJqTP3XObvW6TeF6@g5cluster.9w6ce.mongodb.net/LabLink?retryWrites=true&w=majority&appName=G5Cluster";


mongoose.connect(DB_URI)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch(err => console.error("MongoDB Atlas connection error:", err));

const express = require('express');
const server = express();

// dataModule 
const userDataModule = require('../model/userController.js');
const labDataModule = require('../model/labController.js');
const reservationDataModule = require('../model/reservationController.js');

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
    cookie: { 
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000
     } 
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

        // fix this in the future
         const announcements = await labDataModule.getAnnouncements();
         const unavailableRooms = null;
        // await dataModule.getUnavailableRooms(req, resp);

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
server.post('/login', async function(req, resp) {
    try {
        const { email, password } = req.body;
        const rememberMe = req.body.rememberMe === "on";

        let user = await userDataModule.getUser(email, password);

        if (user) {
            user.rememberMe = rememberMe;
            await user.save();

            req.session.email = email;
            req.session.user = user;

            if (rememberMe) {
                req.session.cookie.maxAge = 21 * 24 * 60 * 60 * 1000; // 3 weeks
            } else {
                req.session.cookie.maxAge = 60 * 60 * 1000; // 1 hour (default)
            }

            console.log("User logged in. Remember Me:", rememberMe, "Session expires in:", req.session.cookie.maxAge);
            return resp.redirect('/home');  
        }

        // Fix this in the future
        const announcements = await labDataModule.getAnnouncements(req, resp);
        const unavailableRooms = null;

        return resp.render('login', {
            layout: 'index',
            title: 'Login Page',
            carouselImages: carouselImages,
            announcement: announcements,
            unavailableRooms: unavailableRooms,
            errorMessage: 'Invalid email or password. Please try again.' 
        });

    } catch (error) {
        console.error("Error during login:", error);
        return resp.status(500).send("Error: Unable to process login request.");
    }
});


// sign up as new user
server.post('/signup', async (req, resp) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;
        const isTechnician = req.body.isTechnician === "on";

        // Fix this in the future
        const announcements = await labDataModule.getAnnouncements();
        const unavailableRooms = null;
        // const unavailableRooms = await dataModule.getUnavailableRooms(req, resp);

        if (password !== confirmPassword) {
            return resp.render('login', { 
                layout: 'index',
                title: 'Sign Up Error',
                carouselImages: carouselImages,
                announcement: announcements,
                unavailableRooms: unavailableRooms,
                errorMessage: "Passwords do not match" 
            });
        }

        const existingUser = await userDataModule.isExistingUser(email);
        if (existingUser) {
            return resp.render('login', { 
                layout: 'index',
                title: 'Sign Up Error',
                carouselImages: carouselImages,
                announcement: announcements,
                unavailableRooms: unavailableRooms,
                errorMessage: "User already exists!" 
            });
        }


        await userDataModule.createUser(firstName, lastName, email, password, isTechnician);
        return resp.redirect('/login');  

    } catch (error) {
        console.error("Error during signup:", error);
        return resp.status(500).send("Error: Unable to process signup request.");
    }
});

// render home.hbs
server.get('/home', async function(req, resp) {
    try { 
        if (!req.session.user) {
            return resp.redirect('/login'); 
        }

        const userData = req.session.user;

        const reservations = await reservationDataModule.getUserReservations(req.session.user._id);
        const uniqueBuildings = await labDataModule.getBuildings();
        const formattedReservations = reservations.map(reservation => {
            const resObj = reservation.toObject ? reservation.toObject() : reservation;
        
            return {
                ...resObj,
                requestDate: new Date(resObj.requestDate).toLocaleString("en-US", { timeZone: "Asia/Manila" }),
            };
        });

        console.log("User Data:", userData);
        console.log("Buildings:", uniqueBuildings); 

        resp.render('home', {
            layout: 'index',
            title: 'Animo LabLink',
            formattedReservations: formattedReservations || [],
            currentRoute: 'home',
            uniqueBuildings: uniqueBuildings || [], 
            selectedBuilding: req.session.building || "Choose a building",
            selectedDate: req.session.date || "",
            selectedTimeIn: req.session.timeIn || "08:00",
            selectedTimeOut: req.session.timeOut || "08:30",
            pfp: userData?.pfp || '/Images/default.png', 
            name: userData?.firstname || "Guest"
        });

    } catch (error) {
        console.error("Error fetching data for /home:", error);
        resp.status(500).send("Internal Server Error");
    }
});

server.get('/get-session-data', (req, res) => {
    res.json({
        building: req.session.building || "Choose building",
        date: req.session.date || "",
        timeIn: req.session.timeIn || "08:00",
        timeOut: req.session.timeOut || "08:30"
    });
});

// update session when searching
server.post('/set-session', (req, res) => {
    const { selectedBuildingText, date, startTime, endTime } = req.body;

    req.session.building = selectedBuildingText;
    req.session.date = date;
    req.session.timeIn = startTime;
    req.session.timeOut = endTime;

    console.log("Session updated:", req.session);
    res.json({ success: true, message: "Session updated successfully" });
});

// update session when building is changed in lab-select
server.post('/set-session-building', (req, res) => {
    const { building } = req.body;

    if (!building) {
        return res.status(400).json({ error: "Building is required." });
    }

    req.session.building = building;
    console.log("Session updated:", req.session); 

    res.json({ message: "Building saved in session", building: req.session.building });
});


// render account.hbs
server.get('/account', async function(req, resp) {
    try { 
        if (!req.session.user) {
            return resp.redirect('/login'); // Redirect if not logged in
        }

        const userData = req.session.user; 
        const reservations = await reservationDataModule.getUserReservations(req.session.user._id);
        const formattedReservations = reservations.map(reservation => {
            const resObj = reservation.toObject ? reservation.toObject() : reservation;
        
            return {
                ...resObj,
                requestDate: new Date(resObj.requestDate).toLocaleString("en-US", { timeZone: "Asia/Manila" }),
            };
        });

        console.log("User Data:", userData); 
        console.log("Reservations:", reservations); 

        resp.render('account', {
            layout: 'index',
            title: 'Account Page',
            firstname: userData?.firstname || "Guest",
            lastname: userData?.lastname,  
            aboutInfo: userData?.aboutInfo || "No information available.",
            pfp: userData?.pfp || '/Images/default.png', 
            reservations: formattedReservations,
            currentRoute: 'account'
        });

    } catch (error) {
        console.error("Error fetching data for /account:", error);
        resp.status(500).send("Internal Server Error");
    }
});

// Render edit-profile.hbs
server.get('/edit-profile', async function (req, resp) {
    try {
        if (!req.session.user) {
            return resp.redirect('/login'); // Redirect if not logged in
        }

        const userData = req.session.user; 

        if (!userData) {
            return resp.status(404).send("User not found.");
        }

        resp.render('edit-profile', {
            layout: 'index',
            title: 'Edit Profile',
            firstname: userData?.firstname || "Guest",
            lastname: userData?.lastname,
            aboutInfo: userData?.aboutInfo || "No information available.",
            pfp: userData?.pfp || '/Images/test.jpg'
        });
    } catch (error) {
        console.error("Error fetching user data for /edit-profile:", error);
        resp.status(500).send("Internal Server Error");
    }
});


server.post('/updateProfile', async function (req, res) {
    try {
        if (!req.session.user) {
            return resp.redirect('/login'); // Redirect if not logged in
        }

        const email = req.session.user.email; 
        const { aboutInfo } = req.body;

        // Ensure aboutInfo is not empty
        if (!aboutInfo.trim()) {
            return res.status(400).json({ error: "About info cannot be empty." });
        }

        // Update the user's about info in the database
        const updatedUser = await userDataModule.updateAboutInfo(email, aboutInfo);

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        // Update session data with the new aboutInfo
        req.session.user.aboutInfo = aboutInfo;

        res.json({ message: "About info updated successfully!", updatedAbout: aboutInfo });
    } catch (error) {
        console.error("Error updating about info:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete user and redirect to login
server.post('/delete-user', async (req, res) => {
    if (!req.session.user?._id) {
        console.error("No user ID found in session.");
        return res.status(400).json({ success: false, message: 'User not found in session' });
    }

    try {
        const result = await userDataModule.deleteUser(req.session.user._id);

        if (!result.success) {
            
            return res.status(404).json(result);
        }

        console.log("User deleted successfully. Destroying session...");
        req.session.destroy(() => {
            res.redirect('/login'); 
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});


// render lab-select-building.hbs
server.get('/lab-select-building/:building?', async function(req, res) {
    try {
        if (!req.session.user) {
            return resp.redirect('/login'); // Redirect if not logged in
        }

        const userData = req.session.user;
        const buildings = await labDataModule.getBuildings();
        const uniqueBuildings = buildings.map(building => building.name);

        const selectedBuilding = req.params.building || req.session.building;

        if (!selectedBuilding) {
            console.log("Error: No building selected.");
            return res.render('lab-select-building', {
                layout: 'index',
                title: 'Select Building and Room',
                uniqueBuildings: uniqueBuildings || [], 
                laboratories: [], 
                currentRoute: 'lab-select-building',
                pfp: userData?.pfp || '/Images/default.png',
                selectedBuilding: null,
                isTechnician: false
            });
        }

        const buildingId = await labDataModule.getBuildingIdByName(selectedBuilding);
        console.log("Building ID for", selectedBuilding, ":", buildingId);

        if (!buildingId) {
            console.log("Error: Building ID not found in the database.");
            return res.render('lab-select-building', {
                layout: 'index',
                title: 'Select Building and Room',
                uniqueBuildings: uniqueBuildings || [], 
                laboratories: [],  
                currentRoute: 'lab-select-building',
                pfp: userData?.pfp || '/Images/default.png',
                selectedBuilding: selectedBuilding,
                isTechnician: false
            });
        }

        // Get labs in the selected building
        const labs = await labDataModule.getLabsByBuildingId(buildingId);
        console.log("Labs found:", labs.length);

        res.render('lab-select-building', {
            layout: 'index',
            title: 'Select Building and Room',
            uniqueBuildings: uniqueBuildings || [], 
            laboratories: labs,  
            currentRoute: 'lab-select-building',
            pfp: userData?.pfp || '/Images/default.png',
            selectedBuilding: selectedBuilding,
            isTechnician: false
        });
    } catch (error) {
        console.error("Error fetching labs by building:", error.message);
        res.status(500).send("Internal Server Error");
    }
});


// update table to only show rooms on selected building
server.get('/get-rooms', async (req, res) => {
    if (!req.session.user) {
            return resp.redirect('/login'); // Redirect if not logged in
        }

    const buildings = await labDataModule.getBuildings();
    const uniqueBuildings = buildings.map(building => building.name);
    const selectedBuilding = req.params.building || req.session.building || uniqueBuildings[0];

    // Get labs in the selected building
    const buildingId = await labDataModule.getBuildingIdByName(selectedBuilding);
    console.log("The building id is " + buildingId);
    const labs = await labDataModule.getLabsByBuildingId(buildingId) ;

    if (!selectedBuilding) {
        return res.status(400).send({ error: 'Building parameter is required.' });
    }
    
    res.json(labs);
});


// render reservation.hbs
server.get('/reservations', async function(req, resp) {
    try {
        if (!req.session.user) {
            return resp.redirect('/login'); // Redirect if not logged in
        }

        const reservations = await reservationDataModule.getUserReservations(req.session.user._id);
        const formattedReservations = reservations.map(reservation => {
            const resObj = reservation.toObject ? reservation.toObject() : reservation;
        
            return {
                ...resObj,
                requestDate: new Date(resObj.requestDate).toLocaleString("en-US", { timeZone: "Asia/Manila" }),
            };
        }); 
        const userData = req.session.user; 

        console.log("Reservations:", reservations); // Debugging

        resp.render('reservations', {
            layout: 'index',
            title: 'Reservations',
            reservations: formattedReservations || [], 
            currentRoute: 'reservations',
            pfp: userData.pfp || '/Images/default.png'
        });
    } catch (error) {
        console.error("Error fetching reservations:", error);
        resp.status(500).send("Internal Server Error");
    }
});


// render room.hbs
server.get('/room/:building/:room', async function(req, resp) {
    if (!req.session.user) {
        return resp.redirect('/login'); 
    }

    const { building, room } = req.params; 
    const userData = req.session.user;

    const selectedDate = req.session.date || new Date().toISOString().split("T")[0];  
    const selectedStartTime = req.session.timeIn || "08:00";  
    const selectedEndTime = req.session.timeOut || "08:30"; 

    console.log(`Selected Date: ${selectedDate}, Time: ${selectedStartTime} to ${selectedEndTime}`);
    console.log(`Building: ${building}, Room: ${room}`);

    let labSeats = await labDataModule.getSeatsByLab(room);

    // Mark unavailable seats
    labSeats.seats.forEach(seat => {
        seat.unavailable = false; // Default to available
        
        
        seat.reservations.forEach(reservation => {
            const resDate = reservation.reservationDate;
            const resStartTime = reservation.timeIn;
            const resEndTime = reservation.timeOut;
    
            if (resDate === selectedDate && (
                (selectedStartTime >= resStartTime && selectedStartTime < resEndTime) ||
                (selectedEndTime > resStartTime && selectedEndTime <= resEndTime) ||
                (selectedStartTime <= resStartTime && selectedEndTime >= resEndTime) 
            )) {
                seat.unavailable = true; // Mark as unavailable
            }
        });
    });

    resp.render('room', {
        layout: 'index',
        title: `Room ${room}`,
        seats: labSeats.seats, 
        building: building,
        room: room,
        buildings: req.session.building,
        pfp: userData?.pfp || '/Images/test.jpg',
        date: selectedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        currentRoute: 'reservations',
        hasAvailableSeats: labSeats.seats.some(seat => !seat.unavailable)
    });
    
});


// set room session on search
server.post('/set-session-room', function(req, resp) {
    const { date, startTime, endTime, room, building } = req.body;

    // for debugging
    console.log("Before session update:", req.session);

    // Set the session data
    req.session.date = date;
    req.session.timeIn = startTime;
    req.session.timeOut = endTime;
    req.session.room = room;  
    req.session.building = building; 

    // Log the session after setting it
    console.log("After session update:", req.session);

    resp.json({
        room: room,
        building: building
    });
});

// render edit-reservation.hbs
server.get('/edit-reservation/:reservationId', async function(req, resp) {
    if (!req.session.user) {
        return resp.redirect('/login'); // Redirect if not logged in
    }

    const reservationId = req.params.reservationId; // Get reservation ID from URL

    const reservation = await reservationDataModule.getReservationById(reservationId); 
    const userData = req.session.user;
    
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

// edit reservation
server.post('/edit-reservation', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect if not logged in
    }
    
    const { reservationId } = req.body;
    
    try {
        // Find the reservation by ID
        const reservation = await reservationDataModule.getReservationById(reservationId);
        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        // Set session data
        req.session.date = reservation.reservationDate;
        req.session.timeIn = reservation.timeIn;
        req.session.timeOut = reservation.timeOut;
        
        const room = reservation.seat ? reservation.seat.roomNum : null;
        if (!room) {
            return res.status(400).json({ error: 'Room number is missing from the reservation' });
        }

        const lab = await labDataModule.getLabId(room);
        if (!lab) {
            return res.status(404).json({ error: 'Lab not found for the given room' });
        }

        const buildingId = lab.building;
        if (!buildingId) {
            return res.status(404).json({ error: 'Building ID not found for the lab' });
        }

        const building = await labDataModule.getBuildingById(buildingId);
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }

        // Log for debugging
        console.log(`Editing reservation for Room: ${room} in ${building.name}`);
        console.log(`Reservation ID: ${reservationId}`);
        console.log(`Date: ${reservation.reservationDate}`);
        console.log(`Start Time: ${reservation.timeIn}`);
        console.log(`End Time: ${reservation.timeOut}`);
        
        // Redirect to the room page with building and room info
        return res.redirect(`/room/${encodeURIComponent(building.name)}/${encodeURIComponent(room)}`);
    } catch (error) {
        console.error('Error editing reservation:', error);
        return res.status(500).json({ error: 'An error occurred while editing the reservation' });
    }
});

// reserve seat
server.post('/reserve-seat', async (req, res) => {
    const { room, reservationDate, timeIn, timeOut, seatNum, anonymous } = req.body;
    const user = req.session.user ? req.session.user._id : null;

    if (!seatNum || !reservationDate || !timeIn || !timeOut) {
        return res.status(400).send("Missing required fields.");
    }

    try {
        // Find the seat ID based on the room and seat number
        const seat = await labDataModule.findSeat(room, seatNum);

        if (!seat) {
            return res.status(404).send("Seat not found.");
        }

        console.log('Reservation Data:', {
            reservationDate: String(reservationDate),
            timeIn: String(timeIn),
            timeOut: String(timeOut),
            user: user ? new mongoose.Types.ObjectId(user) : null, 
            seat: seat._id,
            anonymous: anonymous === 'true' 
        });

        // Create new reservation
        const newReservation = await reservationDataModule.addReservation(reservationDate, timeIn, timeOut, user, seat, anonymous)
        await labDataModule.addReservationToSeat(seat._id, newReservation._id);

        res.redirect('/reservations');
    } catch (error) {
        console.error("Error saving reservation:", error);
        res.status(500).send("Server error.");
    }
});


// delete reservation
server.post('/reservations/delete', async (req, res) => {
    try {
        const { reservationId } = req.body;
        if (!reservationId) {
            return res.status(400).send("Reservation ID is required.");
        }

        const reservation = await reservationDataModule.getReservationById(reservationId);
        if (!reservation) {
            return res.status(404).send("Reservation not found.");
        }

        if (reservation.seat) {
            await labDataModule.removeReservationFromSeat(reservation.seat._id, reservationId);
        }

        await reservationDataModule.deleteReservation(reservationId);

        console.log(`Reservation ${reservationId} deleted.`);
        res.redirect('/reservations');
    } catch (error) {
        console.error("Error deleting reservation:", error.message);
        res.status(500).send("Error deleting reservation.");
    }
});

// view account of user
server.get('/view-account/:userId', async function(req, resp) {
    try { 
        if (!req.session.user) {
            return resp.redirect('/login'); // Redirect if not logged in
        }

        const userId = req.params.userId;

        // Fetch user data from MongoDB based on ID
        const userData = await userDataModule.findById(userId);

        if (!userData) {
            return resp.status(404).send("User not found");
        }

        console.log("User Data:", userData); 

        resp.render('view-account', {
            layout: 'index',
            title: userData.firstname + " " + userData.lastname,
            firstname: userData.firstname || "Guest",
            lastname: userData.lastname,  
            aboutInfo: userData.aboutInfo || "No information available.",
            pfp: userData.pfp || '/Images/default.png', 
            currentRoute: 'account'
        });

    } catch (error) {
        console.error("Error fetching data for /view-account:", error);
        resp.status(500).send("Internal Server Error");
    }
});


// about page
server.get('/about', async function(req, resp) {
    try { 
        if (!req.session.user) {
            return resp.redirect('/login'); // Redirect if not logged in
        }

        const userData = req.session.user; 
        const nodePackages = [
            "express",
            "express-handlebars",
            "body-parser",
            "express-session",
            "mongoose",
            "dotenv",
            "bcryptjs"
        ];

        resp.render('about', {
            layout: 'index',
            title: 'About Animo LabLink',
            currentRoute: 'about',
            pfp: userData?.pfp || '/Images/default.png', 
            nodePackages: nodePackages
        });

    } catch (error) {
        console.error("Error fetching data for /about:", error);
        resp.status(500).send("Internal Server Error");
    }

});

// logout
server.get('/logout', function(req, resp) {
    req.session.destroy(); 
    resp.redirect('/login');
});


const port = process.env.PORT || 3000;
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    server.listen(port, () => console.log('Listening at port '+port));
});

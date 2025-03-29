console.log("js loaded");

// SET DEFAULT DATE TO CURRENT DATE
document.addEventListener("DOMContentLoaded", function () {
    let dateInput = document.getElementById("date");
    let today = new Date().toISOString().split("T")[0];

    // Fetch session data and use it if available
    fetch('/get-session-data')
        .then(response => response.json())
        .then(data => {
            if (data.date) {
                dateInput.value = data.date; // Use session date if available
            } else {
                dateInput.value = today; // Default to today if no session value
            }
        })
        .catch(error => {
            console.error("Error fetching session data:", error);
            dateInput.value = today; // Fallback to today
        });
});

// Generate time options in 30-minute intervals
function generateTimeOptions() {
    let startTimeSelect = document.getElementById("startTime");

    function formatTime(hour, minute) {
        return (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute;
    }

    for (let hour = 8; hour <= 17; hour++) { 
        for (let minute = 0; minute < 60; minute += 30) {
            let timeOption = formatTime(hour, minute);
            let startOption = document.createElement("option");
            startOption.value = timeOption;
            startOption.textContent = timeOption;
            startTimeSelect.appendChild(startOption);
        }
    }

    startTimeSelect.addEventListener("change", updateEndTimeOptions);
    updateEndTimeOptions();
}

// Update end time options based on selected start time
function updateEndTimeOptions(sessionEndTime = null) {
    let startTime = document.getElementById("startTime").value;
    let endTimeSelect = document.getElementById("endTime");

    endTimeSelect.innerHTML = "";
    if (!startTime) return;

    let [startHour, startMinute] = startTime.split(':').map(Number);

    for (let hour = startHour; hour <= 18; hour++) {
        for (let minute = (hour === startHour ? startMinute + 30 : 0); minute < 60; minute += 30) {
            if (hour === 18 && minute > 0) break;

            let timeOption = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            let endOption = document.createElement("option");
            endOption.value = timeOption;
            endOption.textContent = timeOption;

            // Preselect the session-stored end time
            if (sessionEndTime && sessionEndTime === timeOption) {
                endOption.selected = true;
            }

            endTimeSelect.appendChild(endOption);
        }
    }
}

// Fetch session values on page load
document.addEventListener("DOMContentLoaded", function () {
    fetch('/get-session-data')
        .then(response => response.json())
        .then(data => {
            if (data.timeOut) {
                updateEndTimeOptions(data.timeOut); // Use session-stored end time
            } else {
                updateEndTimeOptions(); // Default behavior
            }
        })
        .catch(error => console.error("Error fetching session data:", error));
});


// update building selection in home.hbs dynamically
function selectItem(element) {
    let selectedBuilding = element.textContent.trim();
    document.getElementById("selectedBuildingText").textContent = selectedBuilding;

    // Save selected building to session
    fetch('/set-session-building', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ building: selectedBuilding })
    }).then(response => response.json())
      .then(data => console.log("Building updated in session:", data.message)) // Debugging log
      .catch(error => console.error("Error updating session:", error));
}


// Update profile info
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("saveProfileBtn").addEventListener("click", async function () {
        const aboutInfo = document.getElementById("editableText").value;

        const response = await fetch("/updateProfile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ aboutInfo }),
        });

        const result = await response.json();

        if (response.ok) {
            
        } else {
            alert("Error: " + result.error);
        }
    });
});



// Populate dropdowns when the page loads
document.addEventListener("DOMContentLoaded", function () {
    generateTimeOptions(); 
});

// Function to handle building selection and update session
function selectBuilding(building) {
    document.getElementById("selectedBuildingText").innerText = building;

    // Save selected building to session and redirect
    fetch('/set-session-building', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ building })
    }).then(response => response.json())
      .then(() => {
          window.location.href = `/lab-select-building/${encodeURIComponent(building)}`;
      })
      .catch(error => console.error("Error updating session:", error));
}

// Room and home "Search" button
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById("search-seat");

    if (searchButton) {
        searchButton.addEventListener("click", function () {

            let building = document.getElementById("selectedBuildingText").textContent.trim();
            let date = document.getElementById("date").value;
            let timeIn = document.getElementById("startTime").value;
            let timeOut = document.getElementById("endTime").value;

            console.log("Building:", building);
            console.log("Date:", date);
            console.log("Time In:", timeIn);
            console.log("Time Out:", timeOut);

            if (!building || building === "Choose building") {
                alert("Please select a building.");
                return;
            }

            fetch('/set-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    selectedBuildingText: building, 
                    date, 
                    startTime: timeIn, 
                    endTime: timeOut 
                })
            })
            .then(response => {
                console.log("Response status:", response.status);
                return response.json();
            })
            .then(data => {
                console.log("Server response:", data);
                console.log("Redirecting to:", `/lab-select-building/${encodeURIComponent(building)}`);
                window.location.href = `/lab-select-building/${encodeURIComponent(building)}`;
            })
            .catch(error => console.error("Error saving session:", error));
            
        });
    } else {
        console.log("Search seat button not found!"); 
    }
});




// Update the room table dynamically
function updateRoomTable(rooms) {
    const roomList = document.getElementById("room-list");
    roomList.innerHTML = ""; // Clear existing table rows

    rooms.forEach(room => {
        const row = document.createElement("tr");
        row.classList.add("clickable-row");
        row.setAttribute("data-href", `/room/${room.building}/${room.room}`);
        row.innerHTML = `
            <td>${room.building}</td>
            <td>${room.room}</td>
            <td>${room.capacity}</td>
        `;
        roomList.appendChild(row);
    });
}

// Redirect to room page
document.addEventListener('DOMContentLoaded', function () {
    const rows = document.querySelectorAll('.clickable-row');
    rows.forEach(function(row) {
        row.addEventListener('click', function() {
            const url = row.getAttribute('data-href');
            window.location.href = url;  // Redirect to the room URL
        });
    });
});



// Update profile photo
function previewImage(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("profileImage").src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please select a valid image file.");
    }
}

// Confirm deletion of account
function deleteAccount() {
    alert("Your account has been deleted.");
    var modal = bootstrap.Modal.getInstance(document.getElementById("deleteModal"));
    modal.hide();
   // window.location.href = "login.html"; // Redirect to login page
}

// Redirect table rows
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".clickable-row").forEach(row => {
        row.addEventListener("click", function () {
            window.location.href = this.dataset.href;
        });
    });
});

// UPDATE SEAT NUMBER IN MODAL WHEN RESERVING
document.addEventListener("DOMContentLoaded", function () {
    // Select all seat elements
    const seats = document.querySelectorAll(".seat");

    seats.forEach(seat => {
        seat.addEventListener("click", function () {
            // Get the seat number from the clicked seat
            const seatNumber = this.getAttribute("data-seat-number");

            // Find the modal seat number element and update its text
            document.getElementById("modalSeatNumber").textContent = seatNumber;
        });
    });
});


// update session values in room.hbs when search button is clicked
document.getElementById("search-form-room").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    // Send data to the server to update session
    fetch("/set-session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ date, timeIn: startTime, timeOut: endTime })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message); // Debugging
        location.reload(); // Reload page to reflect new session values
    })
    .catch(error => console.error("Error updating session:", error));
});


// Confirm deletion of reservation
function deleteReservation() {
    alert("Your reservation has been deleted.");
    var modal = bootstrap.Modal.getInstance(document.getElementById("deleteReservationModal"));
    modal.hide();
    window.location.href = "reservations.html"; // Redirect to reservations page
}

// Real-time clock
document.addEventListener("DOMContentLoaded", function () {
    function updateClock() {
        const now = new Date();
        const clock = document.getElementById("clock");

        if (!clock) {
            console.log("Clock element not found!");
            return;
        }

        clock.textContent = now.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        }).replace(" at ", " | ");
    }

    // Run immediately
    updateClock();

    // Update every second
    setInterval(updateClock, 1000);
});



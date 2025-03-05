console.log("js loaded");


// SET DEFAULT DATE TO CURRENT DATE
document.addEventListener("DOMContentLoaded", function () {
    let dateInput = document.getElementById("date");
    let today = new Date();
    let formattedDate = today.toISOString().split("T")[0];

    dateInput.value = formattedDate;

    if (dateInput.min && dateInput.value < dateInput.min) {
        dateInput.value = dateInput.min;
    }
});



// generate time option in 30 mins interval
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
function updateEndTimeOptions() {
    let startTime = document.getElementById("startTime").value;
    let endTimeSelect = document.getElementById("endTime");

    endTimeSelect.innerHTML = "";
    if (!startTime) return;

    let [startHour, startMinute] = startTime.split(':').map(Number);

    for (let hour = startHour; hour <= 18; hour++) {
        for (let minute = (hour === startHour ? startMinute + 30 : 0); minute < 60; minute += 30) {
            if (hour === 18 && minute > 0) break; // Stop at 18:00 (6:00 PM)
            
            let timeOption = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            let endOption = document.createElement("option");
            endOption.value = timeOption;
            endOption.textContent = timeOption;
            endTimeSelect.appendChild(endOption);
        }
    }
}

// Populate dropdowns when the page loads
document.addEventListener("DOMContentLoaded", function () {
    generateTimeOptions(); 
});


// update selected item in dropdown
function selectItem(element) {
    let building = element.textContent.trim(); // Get selected building name
    document.getElementById('selected-building-text').textContent = building;

    // AJAX request to fetch rooms
    fetch(`/get-rooms?building=${encodeURIComponent(building)}`)
        .then(response => response.json())
        .then(data => {
            updateRoomTable(data);
        })
        .catch(error => console.error('Error fetching rooms:', error));
}

function selectBuilding(building) {
    document.getElementById('selected-building-text').innerText = building;
    window.location.href = `/lab-select-building?building=${encodeURIComponent(building)}`;
}


let selectedBuilding = "Choose a Building";
let selectedDate = null;
let startTime = null;
let endTime = null;

document.addEventListener("DOMContentLoaded", function () {
    // Function to update selected building
    window.selectItem = function (item) {
        selectedBuilding = item.innerText.trim();
        document.getElementById('selected-building-text').innerText = selectedBuilding;
        getSelectedValues(); 
    };

    function getSelectedValues() {
        selectedDate = document.getElementById("date").value;
        startTime = document.getElementById("startTime").value;
        endTime = document.getElementById("endTime").value;

        console.log("Building:", selectedBuilding);
        console.log("Selected Date:", selectedDate);
        console.log("Start Time:", startTime);
        console.log("End Time:", endTime);
    }

    document.getElementById("date").addEventListener("change", getSelectedValues);
    document.getElementById("startTime").addEventListener("change", getSelectedValues);
    document.getElementById("endTime").addEventListener("change", getSelectedValues);
});

// room and home "Search" button
// LINK THIS TO DATABASE
document.getElementById('search-seat').addEventListener('click', () => {
    if (!selectedBuilding || selectedBuilding === "Choose a Building") {
        alert('Please select a building.');
        return;
    } 

    console.log('Redirecting with:', { selectedBuilding });
    window.location.href = `/lab-select-building?building=${encodeURIComponent(selectedBuilding)}`;
});


// update the room table dynamically
function updateRoomTable(rooms) {
    const roomList = document.getElementById('room-list');
    roomList.innerHTML = ''; // Clear existing table rows

    rooms.forEach(room => {
        const row = document.createElement('tr');
        row.classList.add('clickable-row');
        row.setAttribute('data-href', `/room/${room.building}/${room.room}`);
        row.innerHTML = `
            <td>${room.building}</td>
            <td>${room.room}</td>
            <td>${room.capacity}</td>
        `;
        roomList.appendChild(row);
    });
}

// redirect to room page
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("room-list").addEventListener("click", function (event) {
        let row = event.target.closest(".clickable-row"); // Get the clicked row
        if (row && row.dataset.href) {
            window.location.href = row.dataset.href;
        }
    });
});


// update profile photo
function previewImage(event) {
    const file = event.target.files[0];
    // Check if the file is an image
    if (file && file.type.startsWith("image/")) {
        // Create a URL for the selected file
        const reader = new FileReader();
        reader.onload = function(e) {
            // Set the new image as the source of the profile image
            document.getElementById('profileImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please select a valid image file.");
    }
}

// confirm deletion of account 
function deleteAccount() {
    // delete from database
    alert("Your account has been deleted.");
    var modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    modal.hide();
    window.location.href = "login.html" // change to login page 
}

// redirect table rows
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".clickable-row").forEach(row => {
        row.addEventListener("click", function () {
            window.location.href = this.dataset.href;
        });
    });
});

// confirm deletion of reservation 
function deleteReservation() {
    // delete from database
    alert("Your reservation has been deleted.");
    var modal = bootstrap.Modal.getInstance(document.getElementById('deleteReservationModal'));
    modal.hide();
    window.location.href = "reservations.html" // change to reservations page 
}

// real-time clock
function updateClock() {
    const now = new Date();
    const clock = document.getElementById('clock');
    clock.textContent = now.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).replace(' at ', ' | ');
}

// Update immediately
updateClock();

// Update every second
setInterval(updateClock, 1000);

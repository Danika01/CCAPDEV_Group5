// Function to generate time options with 30-minute intervals
function generateTimeOptions() {
    let startTimeSelect = document.getElementById("startTime");
    let endTimeSelect = document.getElementById("endTime");
    // Function to format time as HH:mm
    function formatTime(hour, minute) {
        return (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute;
    }
    // Generate options for start and end time from 8 AM to 6 PM
    for (let hour = 8; hour <= 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            let timeOption = formatTime(hour, minute);
            // Add option to start time dropdown
            let startOption = document.createElement("option");
            startOption.value = timeOption;
            startOption.textContent = timeOption;
            startTimeSelect.appendChild(startOption);
        }
    }
    // Populate end time dropdown initially with all options
    updateEndTimeOptions();
}

// Update end time options based on selected start time
function updateEndTimeOptions() {
    let startTime = document.getElementById("startTime").value;
    let endTimeSelect = document.getElementById("endTime");

    // Clear current options
    endTimeSelect.innerHTML = "";

    // Function to format time as HH:mm
    function formatTime(hour, minute) {
        return (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute;
    }

    // If no start time is selected, reset end time
    if (!startTime) return;
    let [startHour, startMinute] = startTime.split(':').map(Number);
    for (let hour = startHour; hour <= 18; hour++) {
        for (let minute = (hour === startHour ? startMinute + 30 : 0); minute < 60; minute += 30) {
            let timeOption = formatTime(hour, minute);
            
            let endOption = document.createElement("option");
            endOption.value = timeOption;
            endOption.textContent = timeOption;
            endTimeSelect.appendChild(endOption);
        }
    }
}

// update selected item in dropdown
function selectItem(element) {
    document.getElementById('building-dropdown').textContent = element.textContent;
}

// Update character count when editing about page
document.addEventListener("DOMContentLoaded", function () {
    const textarea = document.getElementById("editableText");
    const charCount = document.getElementById("charCount");
    function updateCharacterCount() { // count character in text area
        charCount.textContent = textarea.value.length + " / 300";
    }
    textarea.addEventListener("input", updateCharacterCount);
    updateCharacterCount();
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
    window.location.href = "home.html" // change to login page 
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
        hour12: true
    }).replace(' at ', ' - ');
}

// Update immediately
updateClock();

// Update every second
setInterval(updateClock, 1000);

// Function to generate time options with 30-minute intervals
function generateTimeOptions() {
    let startTimeSelect = document.getElementById("startTime");
    let endTimeSelect = document.getElementById("endTime");

    // Function to format time as HH:mm
    function formatTime(hour, minute) {
        return (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute;
    }

    // Generate options for start and end time from 8 AM to 6 PM
    for (let hour = 8; hour <= 18; hour++) {
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




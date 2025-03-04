document.addEventListener('DOMContentLoaded', () => {
   // lab-select-building seat clicks
   document.querySelectorAll('.seat').forEach(seat => {
       seat.addEventListener('click', () => {
           // Get the seat number from the clicked seat's data attribute
           const seatNumber = seat.getAttribute('data-seat-number');

           // Get the selected date, start time, and end time from the form
           const date = document.getElementById('date').value;
           const startTime = document.getElementById('startTime').value;
           const endTime = document.getElementById('endTime').value;

           // Update the modal content with the selected values
           document.getElementById('modalSeatNumber').innerText = seatNumber;
           document.getElementById('modalDate').innerText = date;
           document.getElementById('modalTime').innerText = `${startTime} to ${endTime}`;
       });
   });

   // room and home "Search" button
   document.getElementById('search-seat').addEventListener('click', () => {
       const date = document.getElementById('date').value;
       const startTime = document.getElementById('startTime').value;
       const endTime = document.getElementById('endTime').value;

       if (!date || !startTime || !endTime) {
           alert('Please fill out all fields (date, start time, and end time).');
           return;
       }

       // Optional
       console.log('Searching for seats with:', { date, startTime, endTime });

       // Display a message if no seats are available
       const availableSeats = document.querySelectorAll('.seat:not(.reserved)');
       if (availableSeats.length === 0) {
           alert('No available seats for the selected date and time.');
       } else {
           alert(`Found ${availableSeats.length} available seats.`);
       }
   });

   // lab-select-building - filter table rows based on selected building
   function selectItem(item) {
        // Get the selected building name
        const selectedBuilding = item.innerText;

        // Update the dropdown button text
        document.getElementById('building-dropdown').innerText = selectedBuilding;

        // Filter the table to show only rooms in the selected building
        const rows = document.querySelectorAll('.clickable-row');
            rows.forEach(row => {
                const buildingName = row.querySelector('td').innerText;
                if (buildingName === selectedBuilding) {
                    row.style.display = ''; // Show row
                } else {
                    row.style.display = 'none'; // Hide row
                }
            });
    }

    // "Confirm" button event in the modals
    document.querySelector('#reserveSeat .btn-success').addEventListener('click', () => {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const idNumber = document.getElementById('idNumber').value;
        const reserveAnonymously = document.getElementById('reserveAnonymously').checked;
        const seatNumber = document.getElementById('modalSeatNumber').innerText;
        const date = document.getElementById('modalDate').innerText;
        const time = document.getElementById('modalTime').innerText;

        // Perform reservation logic (e.g., send data to the server)
        console.log('Reserving seat:', {
            firstName,
            lastName,
            idNumber,
            reserveAnonymously,
            seatNumber,
            date,
            time
        });

        alert(`Seat ${seatNumber} reserved for ${firstName} ${lastName} (ID: ${idNumber}) on ${date} at ${time}.`);
    });

    function deleteReservation(reservationId) {
        if (confirm('Are you sure you want to delete this reservation?')) {
            // Perform deletion logic (e.g., send a request to the server)
            console.log('Deleting reservation:', reservationId);
            alert('Reservation deleted.');
            window.location.href = '/reservations'; // Redirect to reservations page
        }
    }
    window.deleteReservation = deleteReservation; // Make the function globally accessible

    // row clicks and redirect to another page
    document.querySelectorAll('.clickable-row').forEach(row => {
        row.addEventListener('click', () => {
            const href = row.getAttribute('data-href');
            if (href) {
                window.location.href = href; // Redirect to different page
            }
        });
    });

});

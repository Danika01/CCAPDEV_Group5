document.addEventListener('DOMContentLoaded', () => {
  
   // count text box characters
   window.onload = function () {
        const textarea = document.getElementById("editableText");
        const charCount = document.getElementById("charCount");

        if (!textarea || !charCount) {
            console.error("Textarea or charCount element NOT FOUND.");
            return;
        }

        function updateCharacterCount() { 
            charCount.textContent = textarea.value.length + " / 300";
        }

        textarea.addEventListener("input", updateCharacterCount);
        updateCharacterCount();
    };
            
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

    

});

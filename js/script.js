// Function 1: Check Room Capacity & Dynamic Behavior
function checkRoomCapacity() {
    const roomType = document.getElementById('roomType').value;
    const guestsInput = document.getElementById('guests');
    const guestError = document.getElementById('guestError');
    
    let maxGuests = 1;
    if (roomType === 'Single') {
        maxGuests = 1;
    } else if (roomType === 'Double') {
        maxGuests = 2;
    } else if (roomType === 'Family') {
        maxGuests = 4;
    }

    guestsInput.max = maxGuests;
    
    let currentGuests = parseInt(guestsInput.value) || 1;
    if (currentGuests > maxGuests) {
        guestError.textContent = `Warning: ${roomType} room allows a maximum of ${maxGuests} guest(s).`;
        guestsInput.value = maxGuests;
    } else {
        guestError.textContent = "";
    }
}

// Function 2: Automated Bill Calculator
function calculateBill() {
    const roomType = document.getElementById('roomType').value;
    const nights = parseInt(document.getElementById('nights').value) || 0;
    const guests = parseInt(document.getElementById('guests').value) || 0;
    const hasBreakfast = document.getElementById('breakfast').checked;
    const hasTransfer = document.getElementById('transfer').checked;
    const hasLateCheckout = document.getElementById('lateCheckout').checked;

    let roomRate = 0;
    if (roomType === 'Single') roomRate = 3500;
    else if (roomType === 'Double') roomRate = 5000;
    else if (roomType === 'Family') roomRate = 7500;

    let roomCost = roomRate * nights;
    let breakfastCost = hasBreakfast ? (700 * guests * nights) : 0;
    let transferCost = hasTransfer ? 2000 : 0;
    let lateCheckoutCost = hasLateCheckout ? 2000 : 0;

    let total = roomCost + breakfastCost + transferCost + lateCheckoutCost;

    // Update UI display
    document.getElementById('displayRoomCost').textContent = "KSh " + roomCost.toLocaleString();
    document.getElementById('displayBreakfastCost').textContent = "KSh " + breakfastCost.toLocaleString();
    document.getElementById('displayTransferCost').textContent = "KSh " + transferCost.toLocaleString();
    document.getElementById('displayLateCheckoutCost').textContent = "KSh " + lateCheckoutCost.toLocaleString();
    document.getElementById('displayTotal').textContent = "KSh " + total.toLocaleString();
}

// Function 3: Comprehensive Form Validation
function validateBooking() {
    let isValid = true;

    // Clear previous errors
    document.getElementById('nameError').textContent = "";
    document.getElementById('idError').textContent = "";
    document.getElementById('emailError').textContent = "";
    document.getElementById('phoneError').textContent = "";
    document.getElementById('dateError').textContent = "";
    document.getElementById('nightsError').textContent = "";
    document.getElementById('roomError').textContent = "";

    // 1. Customer name not empty
    const name = document.getElementById('customerName').value.trim();
    if (name === "") {
        document.getElementById('nameError').textContent = "Customer name cannot be empty.";
        isValid = false;
    }

    // National ID/Passport not empty
    const idNum = document.getElementById('idNumber').value.trim();
    if (idNum === "") {
        document.getElementById('idError').textContent = "National ID or Passport number is required.";
        isValid = false;
    }

    // 2. Email format validation
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = "Please enter a valid email address.";
        isValid = false;
    }

    // 3. Phone number exactly 10 digits
    const phone = document.getElementById('phone').value.trim();
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById('phoneError').textContent = "Phone number must contain exactly 10 digits.";
        isValid = false;
    }

    // Check-in date not empty
    const checkinDate = document.getElementById('checkinDate').value;
    if (checkinDate === "") {
        document.getElementById('dateError').textContent = "Please select a check-in date.";
        isValid = false;
    }

    // 4. Number of nights between 1 and 14
    const nights = parseInt(document.getElementById('nights').value);
    if (isNaN(nights) || nights < 1 || nights > 14) {
        document.getElementById('nightsError').textContent = "Number of nights must be between 1 and 14.";
        isValid = false;
    }

    // 6. Room type selected
    const roomType = document.getElementById('roomType').value;
    if (roomType === "") {
        document.getElementById('roomError').textContent = "Please select a room type.";
        isValid = false;
    }

    // 5. Guests greater than zero
    const guests = parseInt(document.getElementById('guests').value);
    if (isNaN(guests) || guests < 1) {
        document.getElementById('guestError').textContent = "Number of guests must be greater than zero.";
        isValid = false;
    }

    return isValid;
}

// Event Listeners (Demonstrating change, input, click events)
document.addEventListener('DOMContentLoaded', function() {
    const fieldsToWatch = ['roomType', 'nights', 'guests', 'breakfast', 'transfer', 'lateCheckout'];
    
    fieldsToWatch.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', () => {
                checkRoomCapacity();
                calculateBill();
            });
            element.addEventListener('input', () => {
                checkRoomCapacity();
                calculateBill();
            });
        }
    });

    // Initial calculation call
    calculateBill();
});
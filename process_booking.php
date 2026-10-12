<?php
// process_booking.php - Server-side validation and fee verification

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Retrieve submitted values securely
    $customerName = trim($_POST['customerName'] ?? '');
    $idNumber = trim($_POST['idNumber'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $checkinDate = trim($_POST['checkinDate'] ?? '');
    $nights = intval($_POST['nights'] ?? 0);
    $roomType = trim($_POST['roomType'] ?? '');
    $guests = intval($_POST['guests'] ?? 0);
    
    $hasBreakfast = isset($_POST['breakfast']) ? true : false;
    $hasTransfer = isset($_POST['transfer']) ? true : false;
    $hasLateCheckout = isset($_POST['lateCheckout']) ? true : false;

    // 2. Server-side validation check
    $errors = [];
    if (empty($customerName)) $errors[] = "Customer name is required.";
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required.";
    if (empty($phone) || !preg_match('/^\d{10}$/', $phone)) $errors[] = "Phone number must be exactly 10 digits.";
    if ($nights < 1 || $nights > 14) $errors[] = "Number of nights must be between 1 and 14.";
    if ($guests < 1) $errors[] = "Number of guests must be greater than zero.";
    if (!in_array($roomType, ['Single', 'Double', 'Family'])) $errors[] = "Invalid room type selected.";

    if (!empty($errors)) {
        echo "<h2>Server Validation Failed:</h2><ul>";
        foreach ($errors as $err) {
            echo "<li>" . htmlspecialchars($err) . "</li>";
        }
        echo "</ul><p><a href='booking.html'>Go back to form</a></p>";
        exit;
    }

    // 3. Independent Fee Calculation / Verification (Do not trust JS blindly)
    $roomRate = 0;
    if ($roomType === 'Single') {
        $roomRate = 3500;
    } elseif ($roomType === 'Double') {
        $roomRate = 5000;
    } elseif ($roomType === 'Family') {
        $roomRate = 7500;
    }

    $roomCost = $roomRate * $nights;
    $breakfastCost = $hasBreakfast ? (700 * $guests * $nights) : 0;
    $transferCost = $hasTransfer ? 2000 : 0;
    $lateCheckoutCost = $hasLateCheckout ? 2000 : 0; // Digit 9 requirement

    $totalAmount = $roomCost + $breakfastCost + $transferCost + $lateCheckoutCost;

    // Format boolean options for display
    $breakfastDisplay = $hasBreakfast ? "Yes" : "No";
    $transferDisplay = $hasTransfer ? "Yes" : "No";
    $lateCheckoutDisplay = $hasLateCheckout ? "Yes" : "No";

} else {
    header("Location: booking.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <h1>Sunrise Hotel</h1>
        <p>Reservation Confirmation</p>
    </header>
    
    <nav>
        <a href="index.html">Home</a>
        <a href="booking.html">Book Another Room</a>
    </nav>

    <div class="container">
        <h2>BOOKING CONFIRMED</h2>
        <p><strong>Customer:</strong> <?php echo htmlspecialchars($customerName); ?></p>
        <p><strong>ID/Passport:</strong> <?php echo htmlspecialchars($idNumber); ?></p>
        <p><strong>Email:</strong> <?php echo htmlspecialchars($email); ?></p>
        <p><strong>Phone:</strong> <?php echo htmlspecialchars($phone); ?></p>
        <p><strong>Check-in Date:</strong> <?php echo htmlspecialchars($checkinDate); ?></p>
        <p><strong>Room:</strong> <?php echo htmlspecialchars($roomType); ?> Room</p>
        <p><strong>Guests:</strong> <?php echo htmlspecialchars($guests); ?></p>
        <p><strong>Number of Nights:</strong> <?php echo htmlspecialchars($nights); ?></p>
        <p><strong>Breakfast:</strong> <?php echo $breakfastDisplay; ?></p>
        <p><strong>Airport Transfer:</strong> <?php echo $transferDisplay; ?></p>
        <p><strong>Late Checkout:</strong> <?php echo $lateCheckoutDisplay; ?></p>
        <hr>
        <h3>TOTAL AMOUNT: KSh <?php echo number_format($totalAmount); ?></h3>
        <br>
        <p><em>Thank you for choosing Sunrise Hotel[cite: 8].</em></p>
        <br>
        <a href="booking.html"><button>Make Another Booking</button></a>
    </div>
</body>
</html>
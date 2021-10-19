<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/Database.php';

// instantiate all objects
include_once '../objects/Booking.php';

$database = new Database();
$db = $database->getConnection();

$booking = new Booking($db);

$stmt = $booking->readList();
$num = $stmt->rowCount();

if ($num > 0) {
    $bookings_array = array();
    $bookings_array["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $booking_item = array(
            "idBooking" => $idBooking,
            "dateOfBooking" => $dateOfBooking,
            "comment" => $comment,
            "idContact" => $idContact,
            "typeOfBooking" => $typeOfBooking,

            "idContact" => $idContact,
            "lastName" => $lastName,
            "firstName" => $firstName,
            "organisation" => $organisation,
            "phoneNumber" => $phoneNumber,
            "mail" => $mail,
            "address" => $address,
            "postalCode" => $postalCode,
            "city" => $city,
        );
        array_push($bookings_array["records"], $booking_item);
    }
        // set response code - 200 OK
        http_response_code(200);
        // show products data in json format
        echo json_encode($bookings_array);
    
} else {
    // set response code - 404 Not found
    http_response_code(404);
    // tell the user no products found
    echo json_encode(
        array("message" => "No booking found.")
    );
}

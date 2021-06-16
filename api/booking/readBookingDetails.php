<?php

// Display all errors
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/database.php';

// instantiate all object
include_once '../objects/booking.php';

$database = new Database();
$db = $database->getConnection();

$booking = new Booking($db);

// On recup l'id depuis l'url
$booking->idBooking = isset($_GET['idBooking']) ? $_GET['idBooking'] : die();

$stmt = $booking->readDetails();
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

            "lastName" => $lastName,
            "firstName" => $firstName,
            "organisation" => $organisation,
            "phoneNumber" => $phoneNumber,
            "mail" => $mail,
            "adress" => $adress,
            "postalCode" => $postalCode,
            "city" => $city,

            "codeActivity" => $codeActivity,
            "dateActivity" => $dateActivity,
            "halfDaySelect" => $halfDaySelect,

            "nameActivity" => $nameActivity,

            "uLastName" => $uLastName,
            "uFirstName" => $uFirstName
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
        array("message" => "No bookings found.")
    );
}

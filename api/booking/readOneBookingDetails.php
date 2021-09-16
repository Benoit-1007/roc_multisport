<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/database.php';

// instantiate all objects
include_once '../objects/booking.php';

$database = new Database();
$db = $database->getConnection();

$booking = new Booking($db);

// get booking ID from url
$booking->idBooking = isset($_GET['idBooking']) ? $_GET['idBooking'] : die();

$booking->readOne();

if ($booking->idContact > 0) {
    $booking_item = array(
        "idBooking" => $booking->idBooking,
        "dateOfBooking" => $booking->dateOfBooking,
        "comment" => $booking->comment,
        "idContact" => $booking->idContact,
        "typeOfBooking" => $booking->typeOfBooking
    );
    // set response code - 200 OK
    http_response_code(200);
    // show products data in json format
    echo json_encode($booking_item);
} else {
    // set response code - 404 Not found
    http_response_code(404);
    // tell the user no products found
    echo json_encode(
        array("message" => "No booking found.")
    );
}

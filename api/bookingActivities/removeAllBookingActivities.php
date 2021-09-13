<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/database.php';

// instantiate all object
include_once '../objects/bookingActivity.php';

$database = new Database();
$db = $database->getConnection();

$bookingActivity = new bookingActivity($db);

// get ID from url
$bookingActivity->idBooking = isset($_GET['idBooking']) ? $_GET['idBooking'] : die();

$removedBookingActivities = $bookingActivity->removeAll();

if ($removedBookingActivities === 0) {
    // set response code - 400 bad request
    http_response_code(400);
    // tell the user
    echo json_encode(array("message" => "Unable to remove activities."));
} else {
    // set response code 200 - ok
    http_response_code(200);
    // tell the user
    echo json_encode(array("message" => "activities removed."));
}
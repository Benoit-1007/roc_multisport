<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/Database.php';

// instantiate all objects
include_once '../objects/BookingActivity.php';

$database = new Database();
$db = $database->getConnection();

$bookingActivity = new bookingActivity($db);

// get bookingActivity ID from url
$bookingActivity->idBookingActivity = isset($_GET['idBookingActivity']) ? $_GET['idBookingActivity'] : die();

$removedBookingActivity = $bookingActivity->removeOne();

if ($removedBookingActivity === 0) {
    // set response code - 400 bad request
    http_response_code(400);
    // tell the user
    echo json_encode(array("message" => "Unable to remove activity."));
} else {
    // set response code 200 - ok
    http_response_code(200);
    // tell the user
    echo json_encode(array("message" => "activity removed."));
}

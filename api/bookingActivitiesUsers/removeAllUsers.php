<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/database.php';

// instantiate all object
include_once '../objects/bookingactivityuser.php';

$database = new Database();
$db = $database->getConnection();

$bookingactivityuser = new Bookingactivityuser($db);

// get BookingActivity ID from url
$bookingactivityuser->idBookingActivity = isset($_GET['idBookingActivity']) ? $_GET['idBookingActivity'] : die();

$removedUsers = $bookingactivityuser->removeAllUsers();

if ($removedUsers === 0) {
    // set response code - 400 bad request
    http_response_code(400);
    // tell the user
    echo json_encode(array("message" => "Unable to remove users."));
} else {
    // set response code 200 - ok
    http_response_code(200);
    // tell the user
    echo json_encode(array("message" => "users removed."));
}
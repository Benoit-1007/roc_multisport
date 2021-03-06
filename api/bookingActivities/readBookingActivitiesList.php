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

$bookingActivity = new BookingActivity($db);

// get booking ID from url
$bookingActivity->idBooking = isset($_GET['idBooking']) ? $_GET['idBooking'] : die();

$stmt = $bookingActivity->readActivitiesDetails();
$num = $stmt->rowCount();

if ($num > 0) {
    $activities_array = array();
    $activities_array["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $activity_item = array(
            "idBooking" => $idBooking,
            "codeActivity" => $codeActivity,
            "dateActivity" => $dateActivity,
            "halfDaySelect" => $halfDaySelect,
            "nameActivity" => $nameActivity,
            "idBookingActivity" => $idBookingActivity
        );
        array_push($activities_array["records"], $activity_item);
    }
        // set response code - 200 OK
        http_response_code(200);
        // show products data in json format
        echo json_encode($activities_array);
} else {
    // set response code - 404 Not found
    http_response_code(404);
    // tell the user no products found
    echo json_encode(
        array("message" => "No activity found.")
    );
}

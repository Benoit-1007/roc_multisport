<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/database.php';

// instantiate all objects
include_once '../objects/bookingActivity.php';

$database = new Database();
$db = $database->getConnection();

$bookingActivity = new bookingActivity($db);

// get bookingActivity ID from url
$bookingActivity->idBookingActivity = isset($_GET[idBookingActivity]) ? $_GET[idBookingActivity] : die();

$stmt = $bookingActivity->readOne();
$num = $stmt->rowCount();

if ($num > 0) {

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $activity_item = array(
            "idBookingActivity" => $idBookingActivity,
            "codeActivity" => $codeActivity,
            "dateActivity" => $dateActivity,
            "halfDaySelect" => $halfDaySelect,
            "nameActivity" => $nameActivity,
        );
    }
        // set response code - 200 OK
        http_response_code(200);
        // show products data in json format
        echo json_encode($activity_item);
} else {
    // set response code - 404 Not found
    http_response_code(404);
    // tell the user no products found
    echo json_encode(
        array("message" => "No activity found.")
    );
}

<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/database.php';

// instantiate all object
include_once '../objects/BookingActivity.php';

$database = new Database();
$db = $database->getConnection();

// get posted data
$data = json_decode(file_get_contents("php://input"));

$bookingActivitiesError = [];

foreach ($data->activities as $activity) {

    $bookingActivity = new BookingActivity($db);

    // update the bookingActivity
    $bookingActivity->idBookingActivity = $activity->idActivity;
    $bookingActivity->codeActivity = $activity->nameActivity;
    $bookingActivity->dateActivity = $activity->dateActivity;
    if (isset($activity->halfDay)) {
        $bookingActivity->halfDaySelect = $activity->halfDay;
    } else {
        $bookingActivity->halfDaySelect = "Journée";
    }
    $updatedBookingActivity = $bookingActivity->updateOne();

    if ($updatedBookingActivity === 0 ) {
        array_push($bookingActivitiesError, $updatedBookingActivity);
    }
}

if(count($bookingActivitiesError) !== 0) {
    // set response code - 400 bad request
        http_response_code(400);
    //     // tell the admin
        echo json_encode(array("message" => "Unable to update activities."));
}else {
       // set response code 200 - ok
        http_response_code(200);

        // tell the admin
        echo json_encode(array("message" => "Actvities updated."));
}

function isValid($date, $format = 'Y-m-d'){
    $dt = DateTime::createFromFormat($format, $date);
    return $dt && $dt->format($format) === $date;
}


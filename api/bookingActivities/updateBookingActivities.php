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

// get posted data
$data = json_decode(file_get_contents("php://input"));
$bookingActivitiesError = [];

if (!isset($data->activities)) {
    if(isValid($data->dateActivity)) {
        $bookingActivity = new BookingActivity($db);
    
        // update the bookingActivity
        $bookingActivity->idBookingActivity = $data->idActivity;
        $bookingActivity->codeActivity = $data->nameActivity;
        $bookingActivity->dateActivity = $data->dateActivity;
        if (isset($data->halfDay)) {
            $bookingActivity->halfDaySelect = $data->halfDay;
        } else {
            $bookingActivity->halfDaySelect = "Journée";
        }
        $updatedBookingActivity = $bookingActivity->updateOne();

        if( $updatedBookingActivity === 0) {
            // set response code - 400 bad request
                http_response_code(400);
            //     // tell the admin
                echo json_encode(array("message" => "Unable to update activity. Technical error."));
        }else {
            // set response code 200 - ok
                http_response_code(200);
                // tell the admin
                echo json_encode(array("message" => "Actvity updated."));
        }
    } else {
        // set response code - 400 bad request
        http_response_code(400);
        //     // tell the admin
            echo json_encode(array("message" => "Unable to update activity."));
    }
} else {
    foreach ($data->activities as $activity) {
        if(isValid($activity->dateActivity)) {
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
        

        } else {
            // set response code - 400 bad request
            http_response_code(400);
            //     // tell the admin
            echo json_encode(array("message" => "Unable to update activities."));
        }

    }
    if(count($bookingActivitiesError) !== 0) {
        // set response code - 400 bad request
            http_response_code(400);
        //     // tell the admin
            echo json_encode(array("message" => "Unable to update activities. Technical error."));
    }else {
        // set response code 200 - ok
            http_response_code(200);
            // tell the admin
            echo json_encode(array("message" => "Activities updated."));
    }
}



function isValid($date, $format = 'Y-m-d'){
    $dt = DateTime::createFromFormat($format, $date);
    return $dt && $dt->format($format) === $date;
}


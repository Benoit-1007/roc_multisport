<?php

// Display all errors
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get database connection
include_once '../config/database.php';

// instantiate all object
include_once '../objects/booking.php';
include_once '../objects/contact.php';
include_once '../objects/bookingActivity.php';
include_once '../objects/bookingactivityuser.php';
include_once '../objects/user.php';

$database = new Database();
$db = $database->getConnection();

$booking = new Booking($db);
$contact = new Contact($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));



// make sure data is not empty
if (
    !empty($data->contact->contact_lastName) &&
    !empty($data->contact->contact_firstName) &&
    !empty($data->contact->contact_phone) &&
    !empty($data->contact->contact_mail) &&
    !empty($data->contact->contact_adress) &&
    !empty($data->contact->contact_postalCode) &&
    !empty($data->contact->contact_city)
) {

    // create the contact
    // ==================
    $contact->lastName = $data->contact->contact_lastName;
    $contact->firstName = $data->contact->contact_firstName;
    $contact->organisation = $data->contact->contact_society;
    $contact->phoneNumber = $data->contact->contact_phone;
    $contact->mail = $data->contact->contact_mail;
    $contact->adress = $data->contact->contact_adress;
    $contact->postalCode = $data->contact->contact_postalCode;
    $contact->city = $data->contact->contact_city;

    $contactId = $contact->create();

    if ($contactId == 0) {
        // set response code - 400 bad request
        http_response_code(400);
        // tell the user
        echo json_encode(array("message" => "Unable to create contact."));
    } else {

        // Create booking
        // ==============

        $comment = "";
        if (isset($data->activities)) {
            $typeOfBooking = "singleActivity";
        } else {
            $typeOfBooking = $data->coktail{0}->formula;
        }

        $booking->comment = $data->comment->comment;
        $booking->idContact = $contactId;
        $booking->typeOfBooking = $typeOfBooking;

        $bookingId = $booking->create();

        if ($bookingId == 0) {
            // set response code - 400 bad request
            http_response_code(400);
            // tell the user
            echo json_encode(array("message" => "Unable to create booking."));
        } else {

            // Create Booking activity
            // =======================

            foreach ($data->activities as $activity) {
                $bookingActivity = new BookingActivity($db);

                $bookingActivity->idBooking = $bookingId;
                $bookingActivity->codeActivity = $activity->name;
                $bookingActivity->dateActivity = $activity->dateActivity;
                if (isset($activity->halfDay)) {
                    $bookingActivity->halfDaySelect = $activity->halfDay;
                } else {
                    $bookingActivity->halfDaySelect = "allday";
                }
                $bookingActivityId = $bookingActivity->create();


                // Create Users

                foreach ($activity->participants as $participant) {
                    $user = new  User($db);
                    $user->lastName = $participant->lastName;
                    $user->firstName = $participant->firstName;
                    $user->birthdate = $participant->birthdate;
                    $user->size = $participant->size;
                    $user->level = $participant->level;
                    $userId =  $user->create();

                    $bookingActivityUser = new Bookingactivityuser($db);
                    $bookingActivityUser->idBookingActivity = $bookingActivityId;
                    $bookingActivityUser->idUser = $userId;
                    $bookingActivityUser->create();
                }
            }

            http_response_code(201);

            // tell the user

            echo json_encode(array("message" => "Job done."));
        }



        // if ($bookingId > 0) {

        //     // set response code - 201 created
        //     http_response_code(201);

        //     // tell the user
        //     echo json_encode(array("message" => "booking was created."));
        // } else {

        //     // set response code - 503 service unavailable
        //     http_response_code(503);

        //     // tell the user
        //     echo json_encode(array("message" => "Unable to create contact."));
        // }
    }
}

// tell the user data is incomplete
else {

    // set response code - 400 bad request
    http_response_code(400);

    // tell the user
    echo json_encode(array("message" => "Unable to create booking. Data is incomplete."));
}
//BF
// foreach ($data->activities as $key => $value) {
//     $bookingActivity->idBooking = $bookingId;
//     // $bookingActivity->codeActivity = ;
//     $bookingActivity->dateActivity = $data->activities{key}->date;
//     $booking->halfDaySelect = $data->activities{key}->halfDay;

//     $bookingActivityId = $bookingActivity->create();

// }

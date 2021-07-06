<?php

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
include_once '../objects/Mail.php';


$database = new Database();
$db = $database->getConnection();

$contact = new Contact($db);
$booking = new Booking($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if (
    !empty($data->contact->contact_lastName) && 
    preg_match("/^[A-Za-z\à\â\ä\é\è\ê\ë\ö\ô\î\ï\ù\û\ü\ -]+$/", $data->contact->contact_lastName) &&
    !empty($data->contact->contact_firstName) &&
    preg_match("/^[A-Za-z\à\â\ä\é\è\ê\ë\ö\ô\î\ï\ù\û\ü\ -]+$/", $data->contact->contact_firstName) &&
    !empty($data->contact->contact_phone) &&
    preg_match("/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/", $data->contact->contact_phone) &&
    !empty($data->contact->contact_mail) &&
    filter_var($data->contact->contact_mail, FILTER_VALIDATE_EMAIL) &&
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


    if ($contactId === 0) {
        // set response code - 400 bad request
        http_response_code(400);
        // tell the user
        echo json_encode(array("message" => "Unable to create contact.")); die;
    } else {

        // Create booking
        // ==============

        $comment = "";
        
        if (isset($data->activities)) {
            $typeOfBooking = "singleActivity";


            $booking->comment = $data->comment->comment;
            $booking->idContact = $contactId;
            $booking->typeOfBooking = $typeOfBooking;

            $bookingId = $booking->create();

            if ($bookingId === 0) {
                // set response code - 400 bad request
                http_response_code(400);
                // tell the user
                echo json_encode(array("message" => "Unable to create booking. Technical error.")); die;
            } else {

                // Create Booking activity
                // =======================

                foreach ($data->activities as $activity) {
                    if(isValid($activity->dateActivity)){

                        $bookingActivity = new BookingActivity($db);

                        $bookingActivity->idBooking = $bookingId;
                        $bookingActivity->codeActivity = $activity->name;
                        $bookingActivity->dateActivity = $activity->dateActivity;
                        if (isset($activity->halfDay)) {
                            $bookingActivity->halfDaySelect = $activity->halfDay;
                        } else {
                            $bookingActivity->halfDaySelect = "Journée";
                        }
                        $bookingActivityId = $bookingActivity->create();

                        if ($bookingActivityId === 0) {
                            // set response code - 400 bad request
                            http_response_code(400);
                            // tell the user
                            echo json_encode(array("message" => "Unable to create booking activity. Technical error.")); die;
                        } else {
                            
                            // Create Users
                            // ============
                            
                            foreach ($activity->participants as $participant) {

                                if(
                                    !empty($participant->lastName) && 
                                    preg_match("/^[A-Za-z\à\â\ä\é\è\ê\ë\ö\ô\î\ï\ù\û\ü\ -]+$/", $participant->lastName) &&
                                    !empty($participant->firstName) &&
                                    preg_match("/^[A-Za-z\à\â\ä\é\è\ê\ë\ö\ô\î\ï\ù\û\ü\ -]+$/", $participant->firstName) &&
                                    !empty($participant->birthdate) &&
                                    isValid($participant->birthdate,'d/m/Y') &&
                                    !empty($participant->size) &&
                                    is_int(intval($participant->size)) &&
                                    strlen($participant->size) <= 3 &&
                                    !empty($participant->level) &&
                                    $participant->level === 'Débutant' || $participant->level === 'Intermédiaire' || $participant->level === 'Confirmé' || $participant->level === 'Expert'
                                ) {
                                
                                    $user = new User($db);

                                    $user->lastName = $participant->lastName;
                                    $user->firstName = $participant->firstName;
                                    $user->birthdate = $participant->birthdate;
                                    $user->size = $participant->size;
                                    $user->level = $participant->level;
                                    $userId = $user->create();
                                    
                                    if ($userId === 0) {
                                        // set response code - 400 bad request
                                        http_response_code(400);
                                        // tell the user
                                        echo json_encode(array("message" => "Unable to create participants List. Technical error."));die;
                                    } else {
                                        
                                        // Create Activities Users
                                        // =======================      
                                        
                                        $bookingActivityUser = new Bookingactivityuser($db);

                                        $bookingActivityUser->idBookingActivity = $bookingActivityId;
                                        $bookingActivityUser->idUser = $userId;
                                        $bookingActivityUserId = $bookingActivityUser->create();
                                        
                                        if ($bookingActivityUserId === 0) {
                                            // set response code - 400 bad request
                                            http_response_code(400);
                                            // tell the user
                                            echo json_encode(array("message" => "Unable to create bookingActivityUser. Technical error.")); die;
                                        } 
                                        
                                    } 
                                } else {
                                    // set response code - 400 bad request
                                http_response_code(400);
                                // tell the user
                                echo json_encode(array("message" => "Unable to create participants List.")); die;
                                }
                            }
                        }
                    } else {
                        // set response code - 400 bad request
                        http_response_code(400);
                        // tell the user
                        echo json_encode(array("message" => "Unable to create booking activity. invalid date")); die;
                    }
                }
            }
        } else {
            if ($data->cocktail[0]->formula !== "cocktailOneDay" && $data->cocktail[0]->formula !== "cocktailTwoDay") {
                // set response code - 400 bad request
                http_response_code(400);
                // tell the user
                echo json_encode(array("message" => "Unable to create booking. Invalid formula")); die;
            } else {
                $typeOfBooking = $data->cocktail[0]->formula;
    
                $booking->comment = $data->comment->comment;
                $booking->idContact = $contactId;
                $booking->typeOfBooking = $typeOfBooking;
    
                $bookingId = $booking->create();
    
                if ($bookingId === 0) {
                    // set response code - 400 bad request
                    http_response_code(400);
                    // tell the user
                    echo json_encode(array("message" => "Unable to create booking. Technical error.")); die;
                } else {
    
                    $bookingActivitiesId_Array = [];
    
                    // Create Booking activity
                    // =======================
                    if(isValid($data->cocktail[0]->date)){
                        foreach ($data->cocktail[0]->activities as $activity) {
                            $bookingActivity = new BookingActivity($db);
    
                            $bookingActivity->idBooking = $bookingId;
                            $bookingActivity->codeActivity = $activity->activity;
                            $bookingActivity->dateActivity = $data->cocktail[0]->date;
    
                            if (count($data->cocktail[0]->activities) === 2) {
                                if ($typeOfBooking === "cocktailOneDay") {
                                    $bookingActivity->halfDaySelect = "1/2 journée";
                                } else {
                                    $bookingActivity->halfDaySelect = "journée";
                                }
                            } else if (count($data->cocktail[0]->activities) === 3) {
                                if (strpos($activity->activity, 'All') !== false) {
                                    $bookingActivity->halfDaySelect = "journée";
                                } else {
                                    $bookingActivity->halfDaySelect = "1/2 journée";
                                }
                            } else {
                                $bookingActivity->halfDaySelect = "1/2 journée";
                            }
    
                            $bookingActivityId = $bookingActivity->create();
    
                            if ($bookingActivityId === 0) {
                                // set response code - 400 bad request
                                http_response_code(400);
                                // tell the user
                                echo json_encode(array("message" => "Unable to create booking activity. Technical error.")); die;
                            } else {
                            array_push($bookingActivitiesId_Array, $bookingActivityId);
                            }
                        }
                    } else {
                        // set response code - 400 bad request
                        http_response_code(400);
                        // tell the user
                        echo json_encode(array("message" => "Unable to create booking activity. invalid date")); die;
                    }
                    // Create Users
                    // ============
                    foreach ($data->cocktail[0]->participants as $participant) {
                        if(
                            !empty($participant->lastName) && 
                            preg_match("/^[A-Za-z\à\â\ä\é\è\ê\ë\ö\ô\î\ï\ù\û\ü\ -]+$/", $participant->lastName) &&
                            !empty($participant->firstName) &&
                            preg_match("/^[A-Za-z\à\â\ä\é\è\ê\ë\ö\ô\î\ï\ù\û\ü\ -]+$/", $participant->firstName) &&
                            !empty($participant->birthdate) &&
                            isValid($participant->birthdate,'d/m/Y') &&
                            !empty($participant->size) &&
                            is_int(intval($participant->size)) &&
                            strlen($participant->size) <= 3
                        ) {
                            $user = new User($db);
    
                            $user->lastName = $participant->lastName;
                            $user->firstName = $participant->firstName;
                            $user->birthdate = $participant->birthdate;
                            $user->size = $participant->size;
                            $user->level = "useless";
                            $userId = $user->create();
    
                            if ($userId === 0) {
                                // set response code - 400 bad request
                                http_response_code(400);
                                // tell the user
                                echo json_encode(array("message" => "Unable to create participants List.  Technical error.")); die;
                            } else {
                                foreach ($bookingActivitiesId_Array as $bookingActivityId) {
                                    // Create Activities Users
                                    // =======================
                                    $bookingActivityUser = new Bookingactivityuser($db);
                                    $bookingActivityUser->idUser = $userId;
                                    $bookingActivityUser->idBookingActivity = $bookingActivityId;
                                    $bookingActivityUserId = $bookingActivityUser->create();
                                }
                                
                                if ($bookingActivityUserId === 0) {
                                    // set response code - 400 bad request
                                    http_response_code(400);
                                    // tell the user
                                    echo json_encode(array("message" => "Unable to create bookingActivityUser. Technical error.")); die;
                                }
                            }
                        } else {
                            // set response code - 400 bad request
                            http_response_code(400);
                            // tell the user
                            echo json_encode(array("message" => "Unable to create participants List.")); die;
                        }
                    }
                }
            }
        }
    }

    $email = new Mail($data->contact->contact_lastName, $data->contact->contact_firstName, $data->contact->contact_mail, $bookingId);

    $confirmationMail = $email->sendMail();

    if($confirmationMail){
        // set response code - 201 created
        http_response_code(201);
        // tell the user
        echo json_encode(array("message" => "Job done."));
    } else {
        // set response code - 201 created
        http_response_code(201);
        // tell the user
        echo json_encode(array("message" => "Job done. No mail."));
    }
}
// tell the user data is incomplete
else {
   // set response code - 400 bad request
    http_response_code(400);
    // tell the user
    echo json_encode(array("message" => "Unable to create contact."));
}

function isValid($date, $format = 'Y-m-d'){
    $dt = DateTime::createFromFormat($format, $date);
    return $dt && $dt->format($format) === $date;
}


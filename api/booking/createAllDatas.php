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
// include_once '../objects/bookingsactivities.php';
// include_once '../objects/bookingactivitiesusers.php';
// include_once '../objects/users.php';

$database = new Database();
$db = $database->getConnection();

$booking = new Booking($db);
$contact = new Contact($db);
// ... 

// get posted data
$data = json_decode(file_get_contents("php://input"));

$dataAreOk = true;

// make sure data is not empty
if (
    !empty($data->contact->contact_firstName) &&
    !empty($data->contact->contact_lastName) &&
    !empty($data->contact->contact_society) &&
    !empty($data->contact->contact_phone) &&
    !empty($data->contact->contact_mail) &&
    !empty($data->contact->contact_adress) &&
    !empty($data->contact->contact_postalCode) &&
    !empty($data->contact->contact_city)
) {

    // set contact property values
    $contact->firstName = $data->contact->contact_firstName;
    $contact->lastName = $data->contact->contact_lastName;
    $contact->organisation = $data->contact->contact_society;
    $contact->phoneNumber = $data->contact->contact_phone;
    $contact->mail = $data->contact->contact_mail;
    $contact->adress = $data->contact->contact_adress;
    $contact->postalCode = $data->contact->contact_postalCode;
    $contact->city = $data->contact->contact_city;
} else {

    // set response code - 400 bad request
    http_response_code(400);

    // tell the user
    echo json_encode(array("message" => "Unable to create booking. Data is incomplete."));
}

if ($dataAreOk) {

    // create the contact
    $contactId = $contact->create();

    // Create booking
    $typeBooking = "";
    $comment="";
    if($data->activities != null){
        $typeBooking = $data->activities{0}->name;
    }else{
        $typeBooking = $data->coktail{0}->formula;
    }

    $booking->comment = $comment;
    $booking->idContact = $contactId;
    $booking->typeBooking = $typeBooking;

    $bookingId = $booking->create();



    if ($bookingId > 0) {

        // set response code - 201 created
        http_response_code(201);

        // tell the user

        echo json_encode(array("message" => "booking was created.", "id" => $bookingId));
    } else {

        // set response code - 503 service unavailable
        http_response_code(503);

        // tell the user
        echo json_encode(array("message" => "Unable to create contact."));
    }
} else {

    // set response code - 400 bad request
    http_response_code(400);

    // tell the user
    echo json_encode(array("message" => "Unable to create booking. Data is incomplete."));
}
?>




// => Simple
/* for each activity

Insert BookingsActivities
=> last IDBookingsActivities

for each participants
=> insert user
=> last IDuser
=> insert BookingsActivitiesUsers



// => cocktail

foreach participants
=> insert
=> store idUser dans un tableau

=> store dateOfActivities

/* for each activity
Insert BookingsActivities
=> last IDBookingsActivities

for each idUser
=> Insert BookingsActivitiesUsers
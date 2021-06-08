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

//Create contact (if not exists)
// => Validate data
// => Insert in db
// => get last id

$idContact = $contact->create();

// Create booking

// => Simple
/* for each activity




// => cocktailOneDay



// => cocktailTwoDay
<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// get database connection
include_once '../config/database.php';
  
// instantiate contact object
include_once '../objects/contact.php';
  
$database = new Database();
$db = $database->getConnection();
  
$contact = new Contact($db);
  
// get posted data
$data = json_decode(file_get_contents("php://input"));
  
// make sure data is not empty
if(
    !empty($data->firstName) &&
    !empty($data->lastName) &&
    !empty($data->organisation) &&
    !empty($data->phoneNumber) &&
    !empty($data->mail) &&
    !empty($data->adress) &&
    !empty($data->postalCode) &&
    !empty($data->city) 
){
  
    // set contact property values
    $contact->firstName = $data->firstName;
    $contact->comment = $data->comment;
    $contact->organisation = $data->organisation;
    $contact->phoneNumber = $data->phoneNumber;
    $contact->mail = $data->mail;
    $contact->adress = $data->adress;
    $contact->postalCode = $data->postalCode;
    $contact->city = $data->city;
  
    // create the contact

    $lastId = $contact->create();

    if($lastId>0){
  
        // set response code - 201 created
        http_response_code(201);
  
        // tell the user
        
        echo json_encode(array("message" => "contact was created.", "id" => $lastId));
    }
  
    // if unable to create the contact, tell the user
    else{
  
        // set response code - 503 service unavailable
        http_response_code(503);
  
        // tell the user
        echo json_encode(array("message" => "Unable to create contact."));
    }
}
  
// tell the user data is incomplete
else{
  
    // set response code - 400 bad request
    http_response_code(400);
  
    // tell the user
    echo json_encode(array("message" => "Unable to create contact. Data is incomplete."));
}
?>
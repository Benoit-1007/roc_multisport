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
    !empty($data->contact->contact_firstName) &&
    !empty($data->contact->contact_lastName) &&
    !empty($data->contact->contact_society) &&
    !empty($data->contact->contact_phone) &&
    !empty($data->contact->contact_mail) &&
    !empty($data->contact->contact_adress) &&
    !empty($data->contact->contact_postalCode) &&
    !empty($data->contact->contact_city) 
){
  
    // set contact property values
    $contact->firstName = $data->contact->contact_firstName;
    $contact->comment = $data->contact->contact_comment;
    $contact->organisation = $data->contact->contact_society;
    $contact->phoneNumber = $data->contact->contact_phone;
    $contact->mail = $data->contact->contact_mail;
    $contact->adress = $data->contact->contact_adress;
    $contact->postalCode = $data->contact->contact_postalCode;
    $contact->city = $data->contact->contact_city;
  
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
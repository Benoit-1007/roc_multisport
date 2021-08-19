<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/database.php';

// instantiate all object
include_once '../objects/contact.php';

$database = new Database();
$db = $database->getConnection();

$contact = new Contact($db);

// var_dump($_SERVER['REQUEST_METHOD']);
// var_dump($_POST);

extract($_POST);



// get id from url
$contact->idContact = $contact_id;
$contact->lastName = $contact_lastName;
$contact->firstName = $contact_firstName;
$contact->organisation = $contact_society;
$contact->phoneNumber = $contact_phone;
$contact->mail = $contact_mail;
$contact->adress = $contact_adress;
$contact->postalCode = $contact_postalCode;
$contact->city = $contact_city;

$updatedContact = $contact->updateOne();

if ($updatedContact === 0 ) {
    // set response code - 400 bad request
    http_response_code(400);
    // tell the user
    echo json_encode(array("message" => "Unable to update contact."));
} else {
    // set response code 200 - ok
    http_response_code(200);
    // tell the user
    echo json_encode(array("message" => "contact updated."));
}

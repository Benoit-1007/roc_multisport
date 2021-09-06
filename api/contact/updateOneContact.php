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

extract($_POST);

if (
    !empty($contact_id) &&
    !empty($contact_lastName) && 
    preg_match("/^[A-Za-z\à\â\ä\é\è\ê\ë\ö\ô\î\ï\ù\û\ü\ -]+$/", $contact_lastName) &&
    !empty($contact_firstName) &&
    preg_match("/^[A-Za-z\à\â\ä\é\è\ê\ë\ö\ô\î\ï\ù\û\ü\ -]+$/", $contact_firstName) &&
    !empty($contact_phone) &&
    preg_match("/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/", $contact_phone) &&
    !empty($contact_mail) &&
    filter_var($contact_mail, FILTER_VALIDATE_EMAIL) &&
    !empty($contact_adress) &&
    !empty($contact_postalCode) &&
    !empty($contact_city)
) {

    // update the contact
    // ==================
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
        // tell the admin
        echo json_encode(array("message" => "Unable to update contact."));
    } else {
        // set response code 200 - ok
        http_response_code(200);
        // tell the admin
        echo json_encode(array("message" => "contact updated."));
    }
} else {
    // set response code - 400 bad request
    http_response_code(400);
    // tell the admin
    echo json_encode(array("message" => "Unable to update contact."));
}
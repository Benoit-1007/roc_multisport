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

// On recup l'id depuis l'url
$contact->idContact = isset($_GET['idContact']) ? $_GET['idContact'] : die();

$contact->readOne();

if ($contact->idContact > 0) {
    $contact_item = array(
        "idContact" => $contact->idContact,
        "lastName" => $contact->lastName,
        "firstName" => $contact->firstName,
        "organisation" => $contact->organisation,
        "phoneNumber" => $contact->phoneNumber,
        "mail" => $contact->mail,
        "adress" => $contact->adress,
        "postalCode" => $contact->postalCode,
        "city" => $contact->city
    );

    // set response code - 200 OK
    http_response_code(200);

    // show products data in json format
    echo json_encode($contact_item);
} else {
    // set response code - 404 Not found
    http_response_code(404);

    // tell the user no products found
    echo json_encode(
        array("message" => "No contact found.")
    );
}

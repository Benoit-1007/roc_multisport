<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/database.php';

// instantiate all objects
include_once '../objects/contact.php';

$database = new Database();
$db = $database->getConnection();

$contact = new Contact($db);

// get ID from url
$contact->idContact = isset($_GET['idContact']) ? $_GET['idContact'] : die();

$removedContact = $contact->removeOne();

if ($removedContact === 0) {
    // set response code - 400 bad request
    http_response_code(400);
    // tell the user
    echo json_encode(array("message" => "Unable to remove contact."));
} else {
    // set response code 200 - ok
    http_response_code(200);
    // tell the user
    echo json_encode(array("message" => "contact removed."));
}

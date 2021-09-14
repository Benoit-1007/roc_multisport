<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/database.php';

// instantiate all objects
include_once '../objects/user.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

// get user ID from url
$user->idUser = isset($_GET['idUser']) ? $_GET['idUser'] : die();

$removedUser = $user->remove();

if ($removedUser === 0) {
    // set response code - 400 bad request
    http_response_code(400);
    // tell the user
    echo json_encode(array("message" => "Unable to remove user."));
} else {
    // set response code 200 - ok
    http_response_code(200);
    // tell the user
    echo json_encode(array("message" => "user removed."));
}

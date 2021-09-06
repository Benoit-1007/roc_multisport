<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/database.php';

// instantiate all object
include_once '../objects/user.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

// get id from url
$user->idUser = isset($_GET['idUser']) ? $_GET['idUser'] : die();

$user->readOne();

if($user->idUser > 0) {
    $user_item = array(
        "idUser" => $user->idUser,
        "lastName" => $user->lastName,
        "firstName" => $user->firstName,
        "birthdate" => $user->birthdate,
        "size" => $user->size
    );

    // set response code - 200 OK
    http_response_code(200);

    // show products data in json format
    echo json_encode($user_item);
} else {
    // set response code - 404 Not found
    http_response_code(404);

    // tell the user no products found
    echo json_encode(
        array("message" => "No user found.")
    );
}
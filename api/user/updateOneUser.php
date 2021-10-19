<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/Database.php';

// instantiate all objects
include_once '../objects/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

extract($_POST);

if (
    !empty($participant_lastName) && 
    preg_match("/^[A-Za-z\à\â\ä\ç\é\è\ê\ë\ö\ô\î\ï\ù\û\ü\ -]+$/", $participant_lastName) &&
    !empty($participant_firstName) &&
    preg_match("/^[A-Za-z\à\â\ä\ç\é\è\ê\ë\ö\ô\î\ï\ù\û\ü\ -]+$/", $participant_firstName) &&
    !empty($participant_birthdate) &&
    isValid($participant_birthdate,'d/m/Y') &&
    !empty($participant_size) &&
    is_int(intval($participant_size)) &&
    strlen($participant_size) <= 3
) {

    // update the user
    // ==================
    $user->idUser = $participant_id;
    $user->lastName = $participant_lastName;
    $user->firstName = $participant_firstName;
    $user->birthdate = $participant_birthdate;
    $user->size = $participant_size;

    $updateduser = $user->updateOne();

    if ($updateduser === 0 ) {
        // set response code - 400 bad request
        http_response_code(400);
        // tell the admin
        echo json_encode(array("message" => "Unable to update user."));
    } else {
        // set response code 200 - ok
        http_response_code(200);
        // tell the admin
        echo json_encode(array("message" => "user updated."));
    }
} else {
    // set response code - 400 bad request
    http_response_code(400);
    // tell the admin
    echo json_encode(array("message" => "Unable to update user."));
}

function isValid($date, $format = 'Y-m-d'){
    $dt = DateTime::createFromFormat($format, $date);
    return $dt && $dt->format($format) === $date;
}
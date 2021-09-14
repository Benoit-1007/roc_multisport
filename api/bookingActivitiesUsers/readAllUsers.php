<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/database.php';

// instantiate all objects
include_once '../objects/bookingactivityuser.php';

$database = new Database();
$db = $database->getConnection();

$bookingactivityuser = new Bookingactivityuser($db);

// get bookingActivity ID from l'url
$bookingactivityuser->idBookingActivity = isset($_GET['idBookingActivity']) ? $_GET['idBookingActivity'] : die();

$stmt = $bookingactivityuser->readAllUsers();
$num = $stmt->rowCount();

if ($num > 0) {
    $users_array = array();
    $users_array["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $user_item = array(
            "idBookingActivity" => $idBookingActivity,
            "idUser" => $idUser,
            "lastName" => $lastName,
            "firstName" => $firstName,
            "birthdate" => $birthdate,
            "size" => $size,
            "level" => $level,
            "idBooking" => $idBooking
        );
        array_push($users_array["records"], $user_item);
    }
    // set response code - 200 OK
    http_response_code(200);
    // show products data in json format
    echo json_encode($users_array);
} else {
    // set response code - 404 Not found
    http_response_code(404);
    // tell the user no products found
    echo json_encode(
        array("message" => "No user found.")
    );
}

<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/database.php';

// instantiate all objects
include_once '../objects/activity.php';

$database = new Database();
$db = $database->getConnection();

$activity = new Activity($db);

// get codeActivity from url
$activity->codeActivity = isset($_GET['codeActivity']) ? $_GET['codeActivity'] : die();

$stmt = $activity->readOne();
$num = $stmt->rowCount();

if ($num > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    extract($row);

    $activity_item = array(
        "codeActivity" => $codeActivity,
        "name" => $name,
        "price" => $price,
        "minCount" => $minCount,
        "maxCount" => $maxCount
    );
    // set response code - 200 OK
    http_response_code(200);
    // show products data in json format
    echo json_encode($activity_item);
} else {
    // set response code - 404 Not found
    http_response_code(404);
    // tell the user no products found
    echo json_encode(
        array("message" => "No activity found.")
    );
}
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

extract($_POST);

if (
    !empty($name) &&
    !empty($price) &&
    is_int(intval($price)) &&
    !empty($minCount) &&
    is_int(intval($minCount)) &&
    !empty($maxCount) &&
    is_int(intval($maxCount))
) {
    //update the activity
    // ==================
    $activity->codeActivity = $codeActivity;
    $activity->name = $name;
    $activity->price = $price;
    $activity->minCount = $minCount;
    $activity->maxCount = $maxCount;

    $updatedActivity = $activity->updateOne();

    if ($updatedActivity === 0 ) {
        // set response code - 400 bad request
        http_response_code(400);
        // tell the admin
        echo json_encode(array("message" => "Unable to update activity. Technical error."));
    } else {
        // set response code 200 - ok
        http_response_code(200);
        // tell the admin
        echo json_encode(array("message" => "Activity updated."));
    }
} else {
    // set response code - 400 bad request
    http_response_code(400);
    // tell the admin
    echo json_encode(array("message" => "Unable to update activity."));
}
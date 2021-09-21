<?php 

// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get database connection
include_once '../config/database.php';

//imports
include_once '../objects/Activity.php';

$database = new Database();
$db = $database->getConnection();

$activity = new Activity($db);

$stmt = $activity->readAll();
$num = $stmt->rowCount();

if ($num > 0) {
    $activities = array();
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $activities[$codeActivity] = array(
            "codeActivity" => $codeActivity,
            "name" => $name,
            "price" => $price,
            "minCount" => $minCount,
            "maxCount" => $maxCount
        );
    }
    // set response code - 200 OK
    http_response_code(200);
    // show products data in json format
    echo json_encode($activities);
} else {
    // set response code - 404 Not found
    http_response_code(404);
    // tell the user no products found
    echo json_encode(
        array("message" => "No activity found.")
    );
}

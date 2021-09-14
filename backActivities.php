<?php 

// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get database connection
include_once 'api/config/database.php';

//imports
include_once 'api/objects/Admin.php';
include_once 'Session.php';
include_once 'api/objects/Activity.php';

$database = new Database();
$db = $database->getConnection();

// Fill Session
Session::init();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
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
    }
}


require 'views/backActivities.phtml';
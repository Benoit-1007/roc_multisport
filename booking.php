<?php

// required headers
header("Access-Control-Allow-Origin: *");

// get database connection
include_once 'api/config/database.php';

// instantiate all objects
include_once 'api/objects/Activity.php';

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
}

// Appels de dépendances
require 'views/booking.phtml';
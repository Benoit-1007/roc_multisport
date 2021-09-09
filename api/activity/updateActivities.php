<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/database.php';

// instantiate all object
include_once '../objects/BookingActivity.php';

$database = new Database();
$db = $database->getConnection();

// get posted data
// $data = json_decode(file_get_contents("php://input"));

var_dump($_POST);die;
// extract($_POST);
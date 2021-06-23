<?php
// required headers
header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


//get database connection
include_once 'api/config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    
    // var_dump($_POST);
    include_once 'api/objects/Admin.php';

    
    $database = new Database();
    $db = $database->getConnection();

    $admin = new Admin($db);

    extract($_POST);

    $admin->lastName = $lastName;
    $admin->firstName = $firstName;
    $admin->mail = $mail;
    $admin->password = $password;

    $adminId = $admin->create();

    // var_dump($adminId);

    
}

require 'views/register.phtml';



<?php

// Display all errors
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
// header("Access-Control-Allow-Methods: SESSION");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get database connection
include_once 'api/config/database.php';

//imports
include_once 'api/objects/Admin.php';
include_once 'Session.php';

$database = new Database();
$db = $database->getConnection();


// Fill Session
Session::init();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    var_dump($_POST);

    if (isset($_POST) && !empty($_POST)) {
        
        $errors = [];

        // test inputs
        foreach($_POST as $key => $value) {
            if(empty($value)){
                
                array_push($errors, "Le champ $key est vide");
            }
        }
        
        if (count($errors) > 0) {
            $_SESSION['error'] = $errors;
            var_dump($_SESSION);

        } else {

            extract($_POST);

            $admin = new Admin($db);         

            if (!$user = $admin->findByEmail($mail)) {
                array_push($errors, "Email inconnu");
            } else {

                if (!password_verify($password, $user['password'])) {
                    array_push($errors, "Mot de passe incorrect"); 
                }
            }

            if (count($errors) > 0) {
                $_SESSION['error'] = $errors;  
                var_dump($_SESSION);
            }  else {
                Session::login($user);
            } 
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    var_dump($_GET);
    // Delete messages
    // unset($_SESSION['error']);
    // unset($_SESSION['user']);
    Session::logout();
}


require 'views/backBookings.phtml';
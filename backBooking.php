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

$database = new Database();
$db = $database->getConnection();


// Fill Session
Session::init();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    unset($_SESSION['info']);

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
            }  else {
                Session::login($user);
                unset($_SESSION['error']);
            } 
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Delete messages
    unset($_SESSION['error']);
    unset($_SESSION['info']);
}


require 'views/backBookings.phtml';
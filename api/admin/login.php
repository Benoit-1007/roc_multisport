<?php

// Display all errors
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Methods: SESSION");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get database connection
include_once '../config/database.php';

//imports
include_once '../objects/Admin.php';
include_once '../../Session.php';

$database = new Database();
$db = $database->getConnection();


// Fill Session
Session::init();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST) && !empty($_POST)) {
        
        // $errors = [];

        // test inputs
        foreach($_POST as $key => $value) {
            if(empty($value)){
                
                // array_push($errors, "Le champ $key est vide");
                echo json_encode(array("message" => "Merci de remplir tous les champs.")); die;
            }
        }
        
        // if (count($errors) > 0) {
        //     $_SESSION['error'] = $errors;
        //     // var_dump($_SESSION['error'][0]);
        //     // http_response_code(400);
        //     echo json_encode(array("message" => "Merci de remplir tous les champs.")); die;

        // } else {

            extract($_POST);

            $admin = new Admin($db);

            if (!$user = $admin->findByEmail($mail)) {
                // array_push($errors, "Email inconnu");
                // $_SESSION['error'] = $errors;
                // var_dump($_SESSION['error'][0]);
                echo json_encode(array("message" => "Email inconnu.")); die;
            } 
            if (!password_verify($password, $user['password'])) {
                // array_push($errors, "Mot de passe incorrect"); 
                // $_SESSION['error'] = $errors;
                // var_dump($_SESSION['error'][0]);
                echo json_encode(array("message" => "Mot de passe incorrect.")); die;
            }

            // if (count($errors) > 0) {
            //     $_SESSION['error'] = $errors;

                // var_dump($_SESSION);
            
                // Session : add user to session
                // Session::login($user);
                // var_dump[$user];
                echo json_encode([$user['firstName']]);   
        // }   
    }
}


    
    
    
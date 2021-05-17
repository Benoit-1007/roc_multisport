<?php

// Display all errors
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// call dependencies
require_once 'Session.php';

// Fill Session
Session::init();

var_dump($_SERVER);

// display form
if ($_SERVER['REQUEST_METHOD'] === 'GET')
{
    // Suppression des msg errors
    unset($_SESSION['error']);
}




if ($_SERVER['REQUEST_METHOD']=== 'POST'){
    if(isset($_POST) && !empty($_POST)){
        var_dump($_POST);

        //error table
        $errors = [];
        //test inputs
        foreach($_POST as $key => $input) {
            if(empty($input)) {
                array_push($errors, "Le champ $key est vide");
            }
        }
        if (count($errors) > 0)
        {
            // Accéder à la session, afin d'y référencer les erreurs trouvées
            $_SESSION['error'] = $errors;
        }
    }
}
        
        
require 'views/contact.phtml';
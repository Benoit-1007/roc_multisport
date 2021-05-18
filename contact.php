<?php

// Display all errors
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// call dependencies
require_once 'Session.php';

// Fill Session
Session::init();

// var_dump($_SERVER);

// display form
if ($_SERVER['REQUEST_METHOD'] === 'GET')
{
    // Suppression des msg
    unset($_SESSION);
}


if ($_SERVER['REQUEST_METHOD']=== 'POST'){
    if(isset($_POST) && !empty($_POST)){
        // var_dump($_POST);
        unset($_SESSION);

        //error table
        $errors = [];
        //mail
        $body_message = "";
        
        //test inputs
        foreach($_POST as $key => $input) {
            if($key !== "téléphone" && empty($input)) {
                array_push($errors, "Le champ $key est vide");
            }
            else {
                //check mail
                if($key === "email"){
                    if(filter_var($input, FILTER_VALIDATE_EMAIL)){
                        $body_message .= 'E-mail: '.$input."\n";
                    } else {
                        array_push($errors, "Cet email n'est pas valide");
                    }
                }
                // //check Lastname
                else if($key === "nom"){
                    if(preg_match("/^[a-zA-Z -]+$/", $input) === 0){
                        array_push($errors, "Le nom est incorrect. Merci de ne saisir que des lettres, espaces ou tirets");
                    } else {
                        $body_message .= 'Nom: '.$input."\n";
                    }
                }
                // check Firstname
                else if($key === "prénom"){
                    if(preg_match("/^[a-zA-Z -]+$/", $input) === 0){
                        array_push($errors, "Le prénom est incorrect. Merci de ne saisir que des lettres, espaces ou tirets");
                    } else {
                        $body_message .= 'Prénom: '.$input."\n";
                    }
                }
                else if($key === "téléphone"){
                    if(empty($input)){
                        $body_message .= 'Téléphone: non renseigné'."\n";
                    } else {
                        $body_message .= 'Téléphone: '.$input."\n";
                    }
                }
                else if($key === "message"){
                    $body_message .= 'Message: '.$input."\n";
                }
            }
            
        }
        if (count($errors) > 0){
            // Accéder à la session, afin d'y référencer les erreurs trouvées
            $_SESSION['error'] = $errors;
        } else {

            extract($_POST);
        
            $mail_to = 'benoit.flipot1007@gmail.com';
            $subject = 'Demande de renseignement de '.$prénom .$nom;

            $headers = 'From: '.$email."\r\n";
            $headers .= 'Reply-To: '.$email."\r\n";

            $mail_status = mail($mail_to, $subject, $body_message, $headers);
                    
            if($mail_status){
                $info = "Merci pour votre message. On vous recontacte très vite!";
            } else {
                $info = "Erreur dans l'envoi de votre mail. Merci d'envoyer un email à roc.multisport@gmail.com";
            }
            $_SESSION['info'] = $info;
        }
    }
    var_dump($_SESSION);
    var_dump($body_message);
}
        
        
require 'views/contact.phtml';
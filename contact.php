<?php

// call dependencies
require_once 'Session.php';

// Fill Session
Session::init();

// display form
if ($_SERVER['REQUEST_METHOD'] === 'GET')
{
    // delete msg
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
            if($key !== "telephone" && empty($input)) {
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
                    if(preg_match("/^[A-Za-z\à\â\ä\é\è\ê\ë\ö\ô\î\ï\ù\û\ü\ -]+$/", $input) === 0){
                        array_push($errors, "Le nom est incorrect. Merci de ne saisir que des lettres, espaces ou tirets");
                    } else {
                        $body_message .= 'Nom: '.$input."\n";
                    }
                }
                // check Firstname
                else if($key === "prenom"){
                    if(preg_match("/^[A-Za-z\à\â\ä\é\è\ê\ë\ö\ô\î\ï\ù\û\ü\ -]+$/", $input) === 0){
                        array_push($errors, "Le prénom est incorrect. Merci de ne saisir que des lettres, espaces ou tirets");
                    } else {
                        $body_message .= 'Prénom: '.$input."\n";
                    }
                }
                else if($key === "telephone"){
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
        
            $mail_to = 'remi@rocmultisport.com, benoit.flipot1007@gmail.com';
            $subject = 'Demande de renseignement de '.$prenom .$nom;

            $headers = 'From: '.$email."\r\n";
            $headers .= 'Reply-To: '.$email."\r\n";

            $mail_status = mail($mail_to, $subject, $body_message, $headers);
                    
            if($mail_status){
                $info = "Merci pour votre message " .$prenom. ". On vous recontacte très vite!";
            } else {
                $info = "Erreur dans l'envoi de votre mail. Merci d'envoyer un email à roc.multisport@gmail.com";
            }
            $_SESSION['info'] = $info;
        }
    }
}
        
        
require 'views/contact.phtml';
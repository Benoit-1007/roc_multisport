<?php

class Mail

{
    public $contact_lastName;
    public $contact_firstName;
    public $contact_mail;
    public $booking;
    
    public function __construct(string $lastName, string $firstName, string $email, int $bookingId)
    {
        $this->$contact_firstName = $lastName; 
        $this->$contact_firstName = $firstName; 
        $this->$contact_mail = $email; 
        $this->$booking = $bookingId; 
    }
    
    public function sendMailToContact()
    {
        $mail_to = $this->$contact_mail;
        $subject = 'Demande de reservation N°'. $this->$booking;
        $message = 'Bonjour '. $this->$contact_firstName .'. Votre demande de réservation N°' . $this->$booking .' a bien été prise en compte. Nous vous recontacterons dans les plus brefs délais pour la finaliser.';
        
        $headers = 'From: remi@rocmultisport.fr\r\n';
        $headers .= 'Reply-To: remi@rocmultisport.fr\r\n';
        
        $mail_status = mail($mail_to, $subject, $message, $headers);
        
        if($mail_status){
            $info = "Merci pour votre réservation. On vous recontacte très vite!";
        } else {
            $info = "Erreur dans l'envoi de votre demande de réservation. Merci d'envoyer un email à remi@rocmultisport.fr ou nous contacter au 06.58.35.51.66.";
        }
        $_SESSION['info'] = $info;
    }
    
    public function sendMailToAdmin()
    {
        $mail_to = 'remi@rocmultisport.fr';
        $subject = 'Demande de reservation N°'. $this->$booking;
        $message = 'Nouvelle demande de réservation N°' . $this->$booking .' reçue de '. $this->$contact_firstName . $this->$contact_firstName;
        
        $headers = 'From: '. $this->$contact_mail .'\r\n';
        $headers .= 'Reply-To: '. $this->$contact_mail .'\r\n';
        
        $mail_status = mail($mail_to, $subject, $message, $headers);
    }
}
    
    
    







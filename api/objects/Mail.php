<?php

class Mail {
    // object properties
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
    
    public function sendMail(){
        $mail_admin = 'benoit@rocmultisport.fr';
        $subject_mail_admin = 'Demande de reservation N°'. $this->$booking;
        $message_mail_admin = 'Nouvelle demande de réservation N°' . $this->$booking .' reçue de '. $this->$contact_firstName . $this->$contact_firstName;

        $headers_mail_admin = 'From: '. $this->$contact_mail .'\r\n';
        $headers_mail_admin .= 'Reply-To: '. $this->$contact_mail .'\r\n';

        $mail_admin_status = mail($mail_admin, $subject_mail_admin, $message_mail_admin, $headers_mail_admin);

        if($mail_admin_status) {
            $mail_contact = $this->$contact_mail;
            $subject_mail_contact = 'Demande de reservation N°'. $this->$booking;
            $message_mail_contact = 'Bonjour '. $this->$contact_firstName .'. Votre demande de réservation N°' . $this->$booking .' a bien été prise en compte. Nous vous recontacterons dans les plus brefs délais pour la finaliser.';

            $headers_mail_contact = 'From: benoit@rocmultisport.fr\r\n';
            $headers_mail_contact .= 'Reply-To: benoit@rocmultisport.fr\r\n';

            $mail_contact_status = mail($mail_contact, $subject_mail_contact, $message_mail_contact, $headers_mail_contact);

            if($mail_contact_status) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
    







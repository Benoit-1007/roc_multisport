<?php

class Mail {
    // object properties
    public $contact_lastName;
    public $contact_firstName;
    public $contact_mail;
    public $booking;
    
    public function __construct(string $lastName, string $firstName, string $email, int $bookingId)
    {
        $this->contact_lastName = $lastName; 
        $this->contact_firstName = $firstName; 
        $this->contact_mail = $email; 
        $this->booking = $bookingId; 
    }
    
    public function sendMail(){
        $mail_admin = 'remi@rocmultisport.fr';
        $subject_mail_admin = 'Demande de reservation N°'. $this->booking;
        $message_mail_admin = 'Nouvelle demande de réservation portant le N°' . $this->booking .' reçue de '. $this->contact_firstName . ' ' . $this->contact_lastName . "\r\n" . "\r\n" . 'Pour consulter le detail de cette réservation: https://rocmultisport.fr/backBookings.php';

        $headers_mail_admin = 'From: '. $this->contact_mail . "\r\n";
        $headers_mail_admin .= 'Reply-To: '. $this->contact_mail . "\r\n";

        $mail_admin_status = mail($mail_admin, $subject_mail_admin, $message_mail_admin, $headers_mail_admin);

        if($mail_admin_status) {
            $mail_contact = $this->contact_mail;
            $subject_mail_contact = 'Demande de reservation N°'. $this->booking;
            $message_mail_contact = 'Bonjour '. $this->contact_firstName . '.' . "\r\n" . "\r\n" . 'Votre demande de réservation portant le N°' . $this->booking .' a bien été prise en compte.'. "\r\n" . 'Nous vous recontacterons dans les plus brefs délais pour la finaliser.'. "\r\n" . "\r\n" .'L\'équipe Roc multisport';

            $headers_mail_contact = 'From: remi@rocmultisport.fr' . "\r\n";
            $headers_mail_contact .= 'Reply-To: remi@rocmultisport.fr' . "\r\n";

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
    







<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get database connection
include_once 'api/config/Database.php';

// get html2pdf
require_once 'html2pdf/src/Html2Pdf.php';

//imports
include_once 'api/objects/Activity.php';
include_once 'api/objects/Booking.php';
include_once 'api/objects/Contact.php';
include_once 'api/objects/BookingActivity.php';
include_once 'api/objects/Bookingactivityuser.php';

$database = new Database();
$db = $database->getConnection();

if ($num > 0) {
    $activities = array();
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $activities[$codeActivity] = array(
            // "codeActivity" => $codeActivity,
            "name" => $name,
            "price" => $price,
            // "minCount" => $minCount,
            // "maxCount" => $maxCount
        );
    }
}

var_dump($_GET);

if ($_SERVER[REQUEST_METHOD] === 'GET')
{
    $booking->readLast();

    if ($booking->idBooking === $_GET['idBooking']) {
        
        $booking->readOne();

        if ($booking->idContact > 0) {

            $newDate = date('d/m/Y', strtotime($booking->dateOfBooking));

            $booking_item = array(
                "idBooking" => $booking->idBooking,
                "dateOfBooking" => $newDate,
                "comment" => $booking->comment,
                // "idContact" => $booking->idContact,
                "typeOfBooking" => $booking->typeOfBooking
            );
        }

        $contact = new Contact($db);

        $contact->idContact = $booking->idContact;

        $contact->readOne();

        if ($contact->idContact > 0) {
            $contact_item = array(
                // "idContact" => $contact->idContact,
                "lastName" => $contact->lastName,
                "firstName" => $contact->firstName,
                "organisation" => $contact->organisation,
                "phoneNumber" => $contact->phoneNumber,
                "mail" => $contact->mail,
                "address" => $contact->address,
                "postalCode" => $contact->postalCode,
                "city" => $contact->city
            );
        }

        $bookingActivity = new BookingActivity($db);

        $bookingActivity->idBooking = $booking->idBooking;

        $stmt = $bookingActivity->readActivitiesDetails();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $activities_array = array();
            $activities_array["records"] = array();
            $activities_array["totalPrice"] = '';

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                
                extract($row);

                $newDate = date('d/m/Y', strtotime($dateActivity));

                $activity_item = array(
                    // "codeActivity" => $codeActivity,
                    "dateActivity" => $newDate,
                    "halfDaySelect" => $halfDaySelect,
                    "nameActivity" => $nameActivity,
                    // "idBookingActivity" => $idBookingActivity
                    "price" => $activities[$codeActivity]['price'],
                    "users" => array(),
                    "numberOfParticipants" => 0,
                    "totalActivityPrice" => 0
                );
                
                $bookingActivityUser = new Bookingactivityuser($db);

                $bookingActivityUser->idBookingActivity = $idBookingActivity;

                $stmt2 = $bookingActivityUser->readAllUsers();
                $num = $stmt->rowCount();

                if ($num > 0) {
                    $users_array = array();
                    // $users_array["records"] = array();

                    while ($row = $stmt2->fetch(PDO::FETCH_ASSOC)) {
                        extract($row);

                        $user_item = array(
                            // "idBookingActivity" => $idBookingActivity,
                            // "idUser" => $idUser,
                            "lastName" => $lastName,
                            "firstName" => $firstName,
                            // "birthdate" => $birthdate,
                            // "size" => $size,
                            // "level" => $level,
                            // "idBooking" => $idBooking
                        );

                        array_push($activity_item["users"], $user_item);
                        $activity_item["numberOfParticipants"]++;
                    };

                    $activity_item["totalActivityPrice"] = ($activity_item["numberOfParticipants"] * $activities[$codeActivity]['price']);
                    
                    array_push($activities_array[records], $activity_item);
                };

                $activities_array["numberOfActivities"]++;
                
                $activities_array["totalPrice"] += $activity_item["totalActivityPrice"];
            }
        }
    } else {
        header('Location:index.php');
        exit();
    }
}

// $pdf = new HTML2PDF("p","A4","fr");

require 'views/pdf.phtml';
<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get database connection
include_once 'api/config/database.php';

//imports
include_once 'api/objects/Activity.php';
include_once 'api/objects/booking.php';
include_once 'api/objects/contact.php';
include_once 'api/objects/bookingActivity.php';
include_once 'api/objects/bookingactivityuser.php';
// include_once 'api/objects/user.php';

$database = new Database();
$db = $database->getConnection();

$activity = new Activity($db);

    $stmt = $activity->readAll();
    $num = $stmt->rowCount();

    if ($num > 0) {
        $activities = array();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $activities[$codeActivity] = array(
                // "codeActivity" => $codeActivity,
                // "name" => $name,
                "price" => $price,
                // "minCount" => $minCount,
                // "maxCount" => $maxCount
            );
        }
    }

$booking = new Booking($db);

var_dump($_GET);

if ($_SERVER[REQUEST_METHOD] === 'GET')
{
    try {
        $booking->readLast();

        if ($booking->idBooking === $_GET['idBooking']) {
            
            $booking->readOne();

            if ($booking->idContact > 0) {

                $newDate = date('d/m/Y', strtotime($booking->dateOfBooking));

                $booking_item = array(
                    // "idBooking" => $booking->idBooking,
                    "dateOfBooking" => $newDate,
                    "comment" => $booking->comment,
                    // "idContact" => $booking->idContact,
                    "typeOfBooking" => $booking->typeOfBooking
                );
            }

            var_dump($booking_item);

            $contact = new Contact($db);

            $contact->idContact = $booking->idContact;

            $contact->readOne();

            if ($contact->idContact > 0) {
                $contact_item = array(
                    // "idContact" => $contact->idContact,
                    "lastName" => $contact->lastName,
                    "firstName" => $contact->firstName,
                    "organisation" => $contact->organisation,
                    // "phoneNumber" => $contact->phoneNumber,
                    // "mail" => $contact->mail,
                    // "adress" => $contact->adress,
                    // "postalCode" => $contact->postalCode,
                    // "city" => $contact->city
                );
            }

            var_dump($contact_item);

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
                        "totalActivityPrice" => 0
                    );


                    $bookingActivityUser = new Bookingactivityuser($db);

                    $bookingActivityUser->idBookingActivity = $idBookingActivity;

                    $stmt = $bookingActivityUser->readAllUsers();
                    $num = $stmt->rowCount();

                    // var_dump($num);

                    if ($num > 0) {
                        $users_array = array();
                        $users_array["records"] = array();

                        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
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
                            array_push($users_array["records"], $user_item);
                            $users_array["numberOfParticipants"]++;

                            
                            array_push($activity_item["users"], $user_item);
                            
                        };

                        // $totalActivityPrice = $users_array["numberOfParticipants"] * $activities[$codeActivity]['price'];
                        // var_dump($totalActivityPrice);
                        $activity_item["totalActivityPrice"] = ($users_array["numberOfParticipants"] * $activities[$codeActivity]['price']);
                        var_dump($users_array);
                        array_push($activities_array[records], $activity_item);
                        
                        var_dump($activities_array);
                    };


                    
                    $activities_array["numberOfActivities"]++;

                    // $activities_array["totalPrice"] +=  
                    
                    $activities_array["totalPrice"] .= $activity_item["totalActivityPrice"];
                }
            }

            var_dump($activities_array["records"][0]["users"]);

            // $bookingActivityUser = new Bookingactivityuser($db);

            // $bookingActivityUser->idBookingActivity = $idBookingActivity;

            // $stmt = $bookingActivityUser->readAllUsers();
            // $num = $stmt->rowCount();

            // var_dump($num);

            // if ($num > 0) {
            //     $users_array = array();
            //     $users_array["records"] = array();

            //     while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            //         extract($row);

            //         $user_item = array(
            //             // "idBookingActivity" => $idBookingActivity,
            //             // "idUser" => $idUser,
            //             "lastName" => $lastName,
            //             "firstName" => $firstName,
            //             // "birthdate" => $birthdate,
            //             // "size" => $size,
            //             // "level" => $level,
            //             // "idBooking" => $idBooking
            //         );
            //         array_push($users_array["records"], $user_item);
            //         $users_array["numberOfParticipants"]++;
            //     };

                // var_dump($users_array);
            // }
        }
    } catch (PDOException $e) {
        echo $e->getMessage();
        die;
    } 
}

require 'views/print.phtml';
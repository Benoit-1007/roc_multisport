<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get database connection
include_once 'api/config/Database.php';

// html2pdf
require 'vendor/autoload.php';
use Spipu\Html2Pdf\Html2Pdf;

//imports
include_once 'api/objects/Activity.php';
include_once 'api/objects/Booking.php';
include_once 'api/objects/Contact.php';
include_once 'api/objects/BookingActivity.php';
include_once 'api/objects/Bookingactivityuser.php';

include_once 'Session.php';

Session::init();

unset($_SESSION['idBooking']);
unset($_SESSION['mail']);

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
            "name" => $name,
            "price" => $price,
            // "minCount" => $minCount,
            // "maxCount" => $maxCount
        );
    }
}

$booking = new Booking($db);

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




// require 'views/pdf.phtml';
ob_start();
?>

<style type="text/css">
    table{width:100%; color:black; font-family:'dejavusans'; line-height:6mm; margin-bottom:5mm;}
    img{width:250px;}
    td,th{padding:2mm 1mm;}
    .table2{margin-bottom:0;}
    .right{text-align:right;}
</style>

<page backtop="5mm" backleft="5mm" backright="5mm" backbottom=5mm footer="page; date">  
    <table>
        <tr>
            <td style="width:50%; padding-left:-5mm;"><img src="img/logo.png" class="img" alt="Logo ROC Multisport"></td>
            <td style="width:50%; color:#0375be;"><h1 style="font-size:18px">Récapitulatif réservation N°<?= $booking_item['idBooking'] ?></h1></td>
        </tr> 
    </table>
    
    <table style="vertical-align:top;">
        <tr>
            <td style="width:70%; padding-left:3mm">
                <strong>ROC MULTISPORT SAS</strong><br/>
                Monsieur Rémi SPERA<br/>
                165 Route des Tappes<br/>
                74230 DINGY-SAINT-CLAIR<br/>
                Port. : 06 58 35 51 66<br/>
                remi@rocmultisport.com
            </td>
            <td style="width:30%">
                <strong><?= $contact_item['firstName']?> <?= $contact_item['lastName']?></strong><br/>
                <?php if (!empty($contact_item['organisation'])): ?>
                    <?= $contact_item['organisation']?><br/>
                <?php endif; ?>
                <?= $contact_item['address']?><br/>
                <?= $contact_item['postalCode']?> <?= $contact_item['city']?><br/>
                <?= $contact_item['phoneNumber']?><br/>
                <?= $contact_item['mail']?><br/>
            </td>
        </tr>
    </table>

    <?php if ($booking_item['typeOfBooking'] === "singleActivity"): ?>
        <table>
            <tr>
                <td style="width:100%;">
                    Date de réservation: <em><?= $booking_item['dateOfBooking'] ?></em><br/>
                    Type de réservation: <em>activité(s) simple(s)</em><br/>
                    <?php if (!empty($booking_item['comment'])): ?>
                        Commentaire: 
                            <em><?= $booking_item['comment']?></em><br/>
                    <?php endif; ?>
                </td>
            </tr>
        </table>

        <?php foreach ($activities_array["records"] as $activity): ?>
            <table style="border: dotted 1px #009641;margin-bottom:10mm">
                <tr>
                    <td style="padding:0 1mm;">
                        <table class="table2">
                            <tr>
                                <td style="width:100%;">
                                    Activité: <em><?= $activity['nameActivity'] ?></em><br/>
                                    <?php if ($activity['halfDaySelect'] !== "Journée"): ?>
                                        Date d'activité: <em><?= $activity['dateActivity'] ?> <?= $activity['halfDaySelect']?></em>
                                    <?php else: ?>
                                        Date d'activité: <em><?= $activity['dateActivity'] ?></em>
                                    <?php endif; ?><br/>
                                    <?php if ($activity["numberOfParticipants"] === 1): ?>
                                        Participant: <em><?= $activity['users'][0]['firstName'] .' '. $activity['users'][0]['lastName']?></em>
                                    <?php else: ?>
                                        Participants:
                                            <?php foreach ($activity['users'] as $user): ?>
                                                <em style="margin-left:2mm;"><?= $user['firstName'] .' '. $user['lastName']?></em>
                                            <?php endforeach; ?>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        <?php endforeach; ?>
        
        <table style="border:solid 1px #0375be;">
            <tr>
                <td style="padding:0 1mm 1mm 1mm;">
                    <table class="table2" style="border-collapse:collapse;">
                        <thead>
                            <tr>
                                <th colspan="4" style="border-bottom: solid 2px #0375be; color:#0375be;">
                                    MON PANIER
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach($activities_array['records'] as $activity): ?>    
                                <tr>
                                    <td style="width:70%"><?= $activity['nameActivity']?></td>
                                    <td style="width:10%" class="right"><?= $activity['numberOfParticipants']. x?></td>
                                    <td style="width:10%" class="right"><?= $activity['price'].€?></td>
                                    <td style="width:10%" class="right"><?= $activity['totalActivityPrice'].€?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                        <tfoot>
                            <tr style="background:#0375be;">
                                <td  colspan='3' style="color:#FFF; border-right: solid 3mm #0375be;">TOTAL RESERVATION :</td>
                                <td class="right" style="width:10%; color:#FFF; border-left: solid 3mm #0375be;"><?= $activities_array["totalPrice"].€ ?></td>
                            </tr>
                        </tfoot>
                    </table>
                </td>
            </tr>
        </table>
    <?php else: ?>
        <table>
            <tr>
                <td style="width:100%;">
                    Date de réservation: <em><?= $booking_item['dateOfBooking'] ?></em><br/>
                    Type de réservation: 
                        <?php if ($booking_item['typeOfBooking'] === "cocktailOneDay"): ?>
                            <em>Cocktail Roc Day</em>
                        <?php else: ?>
                            <em>Cocktail Roc Week-end</em>
                        <?php endif; ?><br/>
                    <?php if (!empty($booking_item['comment'])): ?>
                        Commentaire: 
                            <em><?= $booking_item['comment']?></em><br/>
                    <?php endif; ?>
                </td>
            </tr>
        </table>

        <table style="border: dotted 1px #009641;margin-bottom:10mm">
            <tr>
                <td style="padding:0 1mm;">
                    <table class="table2">
                        <tr>
                            <td style="width:100%;">
                                Activités:<br/>
                                <?php foreach ($activities_array['records'] as $activity): ?>
                                    <em style="margin-left:5mm;"><?= $activity['nameActivity'] ?></em><br/>
                                <?php endforeach; ?>
                                <?php if ($booking_item['typeOfBooking'] === "cocktailOneDay"): ?>
                                    Date d'activités: 
                                        <em><?= $activities_array['records'][0]['dateActivity'] ?></em><br/>
                                <?php else: ?>
                                    Dates d'activités: 
                                        <em>Week-end du <?= $activities_array['records'][0]['dateActivity'] ?></em><br/>
                                <?php endif; ?>
                                Participants:
                                <?php foreach ($activities_array['records'][0]['users'] as $user): ?>
                                    <em style="margin-left:2mm;"><?= $user['firstName'] .' '. $user['lastName']?></em>
                                <?php endforeach; ?>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <table style="border:solid 1px #0375be;">
            <tr>
                <td style="padding:0 1mm 1mm 1mm;">
                    <table class="table2" style="border-collapse:collapse;">
                        <thead>
                            <tr>
                                <th colspan="4" style="border-bottom: solid 2px #0375be; color:#0375be;">
                                    MON PANIER;
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach($activities_array['records'] as $activity): ?>    
                                <tr>
                                    <td style="width:70%"><?= $activity['nameActivity']?></td>
                                    <td style="width:10%" class="right"><?= $activity['numberOfParticipants']. x?></td>
                                    <td style="width:10%" class="right"><?= $activity['price'].€?></td>
                                    <td style="width:10%" class="right"><?= $activity['totalActivityPrice'].€?></td>
                                </tr>
                            <?php endforeach; ?>
                            <tr>
                                <td colspan="3"><?= $activities[$booking_item['typeOfBooking']]['name'] ?></td>
                                <td class="right"><?= "-".$activities_array['totalPrice']*$activities[$booking_item['typeOfBooking']]['price']/100 .€ ?></td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr style="background:#0375be;">
                                <td  colspan='3' style="color:#FFF; border-right: solid 3mm #0375be;">TOTAL RESERVATION :</td>
                                <td class="right" style="width:10%; color:#FFF; border-left: solid 3mm #0375be;"><?= $activities_array['totalPrice']-$activities_array['totalPrice']*$activities[$booking_item['typeOfBooking']]['price']/100 .€ ?></td>
                            </tr>
                        </tfoot>
                    </table>
                </td>
            </tr>
        </table>
    <?php endif; ?>
</page>

<?php
$content = ob_get_clean();
try {
    $pdf = new HTML2PDF('p','A4','fr','true','UTF-8');
    $pdf->pdf->SetDisplayMode('fullpage'); 
    $pdf->writeHTML($content);
    $pdf->output('Récapitulatif de reservation Roc Multisport.pdf');
} catch(HTML2PDF_exception $e){
    die($e);
}


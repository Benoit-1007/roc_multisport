'use strict';

// imports
import Errors from './Errors.js';
import Menu from './Menu.js';


// use by basket function
const bookingData = [
    { 'value': 'bikeAllDayNoLoc', 'name': 'VTTAE sans location VTT - journée', 'price': '80' },
    { 'value': 'bikeHalfDayNoLoc', 'name': 'VTTAE sans location VTT - 1/2 journée', 'price': '45' },
    { 'value': 'bikeHalfDay', 'name': 'VTTAE avec location VTT - 1/2 journée', 'price': '80' },
    { 'value': 'bikeAllDay', 'name': 'VTTAE avec location VTT - journée', 'price': '130' },
    { 'value': 'paddleHalfDay', 'name': 'Paddle - 1/2 journée', 'price': '55' },
    { 'value': 'paddleAllDay', 'name': 'Paddle - journée', 'price': '100' },
    { 'value': 'kayak', 'name': 'Kayak - 1/2 journée', 'price': '50' },
    { 'value': 'climbingHalfDay', 'name': 'Escalade - 1/2 journée', 'price': '50' },
    { 'value': 'climbingAllDay', 'name': 'Escalade - journée', 'price': '90' },
    { 'value': 'viaHalfDay', 'name': 'Via Ferrata - 1/2 journée', 'price': '60' },
    { 'value': 'viaAllDay', 'name': 'Via Ferrata - journée (2 via ferrata)', 'price': '110' },
    { 'value': 'archery', 'name': 'Tir à l\'arc - 1/2 journée', 'price': '50' },
    { 'value': 'snowboardRookeasy', 'name': 'Rookeasy - 3 x 1/2 journée (débutant snow)', 'price': '180' },
    { 'value': 'snowboardHalfDay', 'name': 'Snowboard - 1/2 journée', 'price': '160' },
    { 'value': 'snowboardAllDay', 'name': 'Snowboard - journée', 'price': '330' },
    { 'value': 'splitboardHalfDay', 'name': 'Splitboard - 1/2 journée', 'price': '180' },
    { 'value': 'splitboardAllDay', 'name': 'Splitboard - journée', 'price': '330' },
    { 'value': 'cocktailOneDay', 'name': 'ROC DAY (10% de remise sur vos activités)' },
    { 'value': 'cocktailTwoDay', 'name': 'ROC WEEK-END (15% de remise sur vos activités)' }

];

document.addEventListener("DOMContentLoaded", function (event) {

    // show list of product on first load
    showBookings();

});

// Generate jsonData
function showBookings() {

    // get list of products from the API

    fetch('api/booking/readAllDatas.php')
        .then(res => res.json())
        .then((data) => {

            // html for listing products
            var read_bookings_html = `

<!-- start table -->
<table class='table table-bordered table-hover'>
 
    <!-- creating our table heading -->
    <tr>
        <th class='w-25-pct'>Date</th>
        <th class='w-10-pct'>Nom</th>
        <th class='w-15-pct'>Prenom</th>
        <th class='w-25-pct text-align-center'>Action</th>
    </tr>`;

            // loop through returned list of data
            (data.records.forEach((key, val) => {

                console.log(key)
                // creating new table row per record
                read_bookings_html += `
        <tr>
 
            <td>` + key.dateOfBooking + `</td>
            <td>` + key.lastName + `</td>
            <td>` + key.firstName + `</td>
 
            <!-- 'action' buttons -->
            <td>
                <!-- read product button -->
                <button class='btn btn-primary m-r-10px read-one-product-button' data-id='` + key.idBooking + `'>
                    <span class='glyphicon glyphicon-eye-open'></span> Read
                </button>
 
                <!-- edit button -->
                <button class='btn btn-info m-r-10px update-product-button' data-id='` + key.idBooking + `'>
                    <span class='glyphicon glyphicon-edit'></span> Edit
                </button>
 
                <!-- delete button -->
                <button class='btn btn-danger delete-product-button' data-id='` + key.idBooking + `'>
                    <span class='glyphicon glyphicon-remove'></span> Delete
                </button>
            </td>
 
        </tr>`;
            }));

            // end table
            read_bookings_html += `</table>`;

            // inject to 'page-content' of our app
            document.querySelector("#page-content").innerHTML = read_bookings_html;




        });
}
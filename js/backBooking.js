'use strict';

// On charge les resa quand la page est prete :
document.addEventListener("DOMContentLoaded", function (event) {
    showBookings();
});



function showBookings() {

    // On recupere les données
    fetch('api/booking/readBookingsList.php')
        .then(res => res.json())
        .then((data) => {

            // html for listing products
            var read_bookings_html = `

            <!-- start table -->
            <table>
            
                <tr>
                    <th>Date</th>
                    <th>Nom</th>
                    <th>Prenom</th>
                    <th>Action</th>
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
                        <button  onclick='showDetails(this)' data-id='` + key.idBooking + `'>
                            Read
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

function showDetails(identifier) {


    // get booking id
    var id = identifier.getAttribute('data-id');

    var whereToWrite = document.querySelector("#page-content");

    // read booking record based on given booking ID
    fetch('api/booking/readOneBookingDetails.php?idBooking=' + id)
        .then(res => res.json())
        .then((data) => {

            var read_one_product_html = `
 
            
            <button id='read-bookings' onclick='showBookings()' >
                Back
            </button>

            <h3>Reservation</h3>
            <!-- booking data will be shown in this table -->
            <table>
            
                <!-- Booking Id -->
                <tr>
                    <td>ID</td>
                    <td>` + data.idBooking + `</td>
                </tr>
            
                <!-- Booking Date -->
                <tr>
                    <td>Date de reservation</td>
                    <td>` + data.dateOfBooking + `</td>
                </tr>
            
                <!-- Booking Type -->
                <tr>
                    <td>Type de reservation</td>
                    <td>` + data.typeOfBooking + `</td>
                </tr>
            

            
            </table>`;

            whereToWrite.innerHTML = read_one_product_html;

            // read contact record based on given contact ID
            fetch('api/contact/readOneContactDetails.php?idContact=' + id)
                .then(res => res.json())
                .then((data) => {
                    console.log(data)
                    var read_one_contact_html = `
        <h3>Contact</h3>
        <!-- contact data will be shown in this table -->
        <table>
        
            <!-- Contact Id -->
            <tr>
                <td>ID</td>
                <td>` + data.idContact + `</td>
            </tr>
        
            <!-- Contact details -->
            <tr>
                <td>Nom</td>
                <td>` + data.lastName + `</td>
            </tr>

            <tr>
                <td>Prénom</td>
                <td>` + data.firstName + `</td>
            </tr>
        
            <tr>
                <td>Société</td>
                <td>` + data.organisation + `</td>
            </tr>

            <tr>
                <td>Téléphone</td>
                <td>` + data.phoneNumber + `</td>
            </tr>

            <tr>
                <td>Mail</td>
                <td>` + data.mail + `</td>
            </tr>

            <tr>
                <td>Adresse</td>
                <td>` + data.adress + `</td>
            </tr>

            <tr>
                <td>Code Postal</td>
                <td>` + data.postalCode + `</td>
            </tr>

            <tr>
                <td>Ville</td>
                <td>` + data.city + `</td>
            </tr>  
        
        </table>`;

                    whereToWrite.innerHTML += read_one_contact_html;

                    // read activities record based on given booking ID
                    fetch('api/activity/readActivitiesList.php?idBooking=' + id)
                        .then(res => res.json())
                        .then((data) => {

                            var read_activities_html = `

    <h3>Activities</h3>
    <!-- start table -->
    <table>
    
        <tr>
            <th>Code</th>
            <th>Nom</th>
            <th>Date</th>
            <th>Journée</th>
        </tr>`;

                            // loop through returned list of data
                            (data.records.forEach((key, val) => {

                                console.log(key)
                                // creating new table row per record
                                read_activities_html += `
        <tr>

            <td>` + key.codeActivity + `</td>
            <td>` + key.nameActivity + `</td>
            <td>` + key.dateActivity + `</td>
            <td>` + key.halfDaySelect + `</td>       


        </tr>`;
                            }));

                            // end table
                            read_activities_html += `</table>`;

                            whereToWrite.innerHTML += read_activities_html;
                        });

                });

        });




}



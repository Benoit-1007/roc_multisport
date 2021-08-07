'use strict';

// On charge les resa quand la page est prete :
document.addEventListener("DOMContentLoaded", function() {
    
    // menu management for mobile phone 
    toggleMenu();

    let showBookingsButton = document.querySelector('.showBookings');
    
    if(showBookingsButton){
        showBookingsButton.addEventListener('click', function(){
            showBookingsButton.classList.add('hide');
            showBookings();
        });
    }

    
});

function showBookings() {
    
    // get data
    fetch('api/booking/readBookingsList.php')
    .then(res => res.json())
    .then((data) => {

        if(data.message === "No bookings found.") {
            let message = "Pas de réservation à afficher"

            // inject to 'page-content' of our app
        document.querySelector("#page-content").innerHTML = message;
        } else {

            // html for listing products
            let read_bookings_html = `
            
            <!-- start table -->
            <table>
            
            <tr>
            <th>Date de réservation</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Commentaire</th>
            <th>Action</th>
            </tr>`;
            
            // loop through returned list of data
            (data.records.forEach((key, val) => {
                
                // creating new table row per record
                read_bookings_html += `
                <tr>
                
                <td>` + convertDate(key.dateOfBooking) + `</td>
                <td>` + key.lastName + `</td>
                <td>` + key.firstName + `</td>
                <td>` + key.comment + `</td>       
                <!-- 'action' buttons -->
                <td>
                <!-- read product button -->
                <button class="more"  onclick='showDetails(this)' data-id='` + key.idBooking + `'>
                consulter
                </button>
                
                <!-- delete product button -->
                <button class="more"  onclick='remove(this)' data-id='` + key.idBooking + `'>
                supprimer
                </button>
                </td>
                
                </tr>`;
            }));
            
            // end table
            read_bookings_html += `</table>`;
            
            // inject to 'page-content' of our app
            document.querySelector("#page-content").innerHTML = read_bookings_html;
        }
    });
}

async function remove(identifier) {

    // get booking id
    let id = identifier.getAttribute('data-id');

    // remove booking record based on given booking ID
    fetch('api/contact/removeOneContact.php?idContact=' + id)
    // fetch('api/contact/removeOneContact.php?idContact=33')
        .then(res => res.json())
        .then( data => {
            if(data.message === "Unable to remove contact.") {
                console.log("test");
                let modale = document.querySelector(".modale");
                modale.classList.remove('hide');
                modale.classList.add('red-border');

                let modaleButton = document.querySelector("#modaleButton");
                modaleButton.addEventListener('click', function(){
                    modale.classList.add('hide');
                    modale.classList.remove('red-border');
                });

            } else if (data.message === "contact removed."){
                showBookings();
            }
        })
}

async function showDetails(identifier) {

    // get booking id
    let id = identifier.getAttribute('data-id');

    let typeBooking = "";
    let read_activities_html = ""
    let whereToWrite = document.querySelector("#page-content");

    // read booking record based on given booking ID
    fetch('api/booking/readOneBookingDetails.php?idBooking=' + id)
        .then(res => res.json())
        .then((data) => {

            typeBooking = data.typeOfBooking

            let read_one_booking_html = `
            <button class='readBookings' onclick='showBookings()' >
                Retour
            </button>

            <h3>Reservation</h3>
            <!-- booking data will be shown in this table -->
            <table>
                <!-- Booking Date -->
                <tr>
                    <td>Date de reservation</td>
                    <td>` + convertDate(data.dateOfBooking) + `</td>
                </tr>
            
                <!-- Booking Type -->
                <tr>
                    <td>Type de reservation</td>
                    <td>` + data.typeOfBooking + `</td>
                </tr>
            </table>`;

            whereToWrite.innerHTML = read_one_booking_html;

            // read contact record based on given contact ID
            fetch('api/contact/readOneContactDetails.php?idContact=' + data.idContact)
                .then(res => res.json())
                .then((data) => {
                    
                    let read_one_contact_html = `
                    <h3>Contact</h3>
                    <!-- contact data will be shown in this table -->
                    <table>
                    
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
                            <td><a href="tel:` + data.phoneNumber +`">` + data.phoneNumber + `</a></td>
                        </tr>

                        <tr>
                            <td>Mail</td>
                            <td><a href="mailto:` + data.mail + `" target="_blank">` + data.mail + `</a></td>
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

                    let crtIdBookingActivity = 0

                    // read activities record based on given booking ID
                    fetch('api/activity/readActivitiesList.php?idBooking=' + id)
                        .then(res => res.json())
                        .then((data) => {

                            read_activities_html = `<h3>Activité(s)</h3>`;

                            // loop through returned list of data
                            (data.records.forEach((key, val) => {
                                // creating new table row per record
                                read_activities_html += '<p>' + key.nameActivity + ` , ` + convertDate(key.dateActivity) + ` , ` + key.halfDaySelect + '</p>';
                                read_activities_html += '<div id="usersActivity'+key.idBookingActivity+'"></div>';

                                whereToWrite.innerHTML += read_activities_html;
                                read_activities_html = ''

                                crtIdBookingActivity = key.idBookingActivity

                                let read_users_html = ''

                                if (typeBooking === "singleActivity") {


                                    //read activities record based on given booking ID

                                    fetch('api/bookingActivitiesUsers/readAllUsers.php?idBookingActivity=' + crtIdBookingActivity)
                                        .then(res => res.json())
                                        .then((dataUsers) => {
                                            
                                            read_users_html = `
                                                
                                                <table class="backParticipantsList`+ key.idBookingActivity +`">
                                                    <tr>
                                                        <th>Nom</th>
                                                        <th>Prénom</th>
                                                        <th>Date de naissance</th>
                                                        <th>Taille</th>
                                                        <th>Niveau</th>
                                                    </tr>
                                                    
                                                </table>
                                                `;
                                                

                                            (dataUsers.records.forEach((keyUser, valUser) => {

                                                let user = `
                                                    <tr>
                                                        <td>` + keyUser.lastName + `</td>
                                                        <td>` + keyUser.firstName + `</td>
                                                        <td>` + keyUser.birthdate + `</td>
                                                        <td>` + keyUser.size + `</td>
                                                        <td>` + keyUser.level + `</td>
                                                    </tr>
                                                `;

                                                document.querySelector("#usersActivity"+keyUser.idBookingActivity).innerHTML += read_users_html;

                                                let table = document.querySelector('.backParticipantsList'+key.idBookingActivity);

                                                table.innerHTML += user;

                                                read_users_html='';

                                            }))
                                        })
                                }
                            }));
                            
                            if (typeBooking !== "singleActivity") {
                                fetch('api/bookingActivitiesUsers/readAllUsers.php?idBookingActivity=' + crtIdBookingActivity)
                                    .then(res => res.json())
                                    .then((dataUsers) => {

                                        let read_users_html = `
                                        
                                        <table class="backParticipantsList">
                                        <tr>
                                        <th>Nom</th>
                                        <th>Prénom</th>
                                        <th>Date de naissance</th>
                                        <th>Taille</th>
                                        </tr>
                                        
                                        </table>
                                        `;
                                        
                                        whereToWrite.innerHTML += read_users_html

                                        let table = document.querySelector('.backParticipantsList');

                                        (dataUsers.records.forEach((keyUser, valUser) => {

                                            let user = `
                                                    <tr>
                                                        <td>` + keyUser.lastName + `</td>
                                                        <td>` + keyUser.firstName + `</td>
                                                        <td>` + keyUser.birthdate + `</td>
                                                        <td>` + keyUser.size + `</td>
                                                    </tr>
                                                `;

                                            table.innerHTML += user;

                                            user='';

                                        }))
                                    })
                            }
                        });
                });
        });
}

function convertDate(date) {
    let dateToConvert = new Date(date);
    let split = dateToConvert.toLocaleString().split(',');
    let myDate = split[0];

    return myDate;
}

function toggleMenu(){
    const navbar = document.querySelector('.navbar');
    const burger = document.querySelector('.burger');
    const links = document.querySelectorAll('a');
    let width = window.innerWidth;
    
    
    burger.addEventListener('click', () => {
        navbar.classList.toggle('show_nav');
    })
    
    if(width < 767){
        links.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.toggle('show_nav');
            })
        });
    } 
}




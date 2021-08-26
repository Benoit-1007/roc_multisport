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
                <button type="button" class="more" onclick='showDetails(this)'  data-id='` + key.idBooking + `'>
                consulter
                </button>
                
                <!-- delete product button -->
                <button type="button" class="more"  onclick='checkRemove(this)' data-id='` + key.idBooking + `' data-lastName='`+ key.lastName +`' data-firstName='`+ key.firstName + `'>
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
            <button class='back' onclick='showBookings()' >
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
                    <h3>Contact<button class="update fas fa-pen" onclick='showContact(this)' data-id='`+ data.idContact +`'</button></h3>

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

                                    //read activities record based on given bookingActivity ID
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

function checkRemove(identifier){

    // get booking ID
    let id = identifier.getAttribute('data-id');
    let lastName = identifier.getAttribute('data-lastName');
    let firstName = identifier.getAttribute('data-firstName');

    let check_message = `<p>Etes-vous sûr de vouloir supprimer la réservation de ` + firstName + ` ` + lastName + `?
    <div>
        <button type="button" onclick='remove(this)' class="validateButton" data-id='` + id + `'>oui</button> 
        <button type="button" onclick="hideModale()" class="cancelButton">non</button> 
    </div>
    `;

    displayModale(check_message);
}

async function remove(identifier) {

    hideModale();

    // get booking ID
    let id = identifier.getAttribute('data-id');

    let crtIdBookingActivity = 0

    // read activities record based on given booking ID
    fetch('api/activity/readActivitiesList.php?idBooking=' + id)
    .then(res => res.json())
    .then((data) => {

        // loop through returned list of data
        (data.records.forEach((key, val) => {

            crtIdBookingActivity = key.idBookingActivity;
        
            //read activities record based on given bookingActivity ID
            fetch('api/bookingActivitiesUsers/readAllUsers.php?idBookingActivity=' + crtIdBookingActivity)
            .then(res => res.json())
            .then((dataUsers) => {

                let n = 0;

                (dataUsers.records.forEach((keyUser, valUser) => {

                    let crtUserId = keyUser.idUser 
                    
                    // remove user record based on given user ID
                    fetch('api/user/removeOneUser.php?idUser=' + crtUserId)
                        .then(res => res.json())
                        .then(data => {

                            if (data.message === "Unable to remove user.") {
                                let error_message = `<p>Problème lors de la suppression d'un participant.</p><p>Merci de contacter l'administrateur du site.</p>`
                            
                                displayModale(error_message);

                            } else if (data.message === "user removed.") {

                                n++

                                if (dataUsers.records.length === n) {
                                    // remove booking record based on given booking ID
                                    fetch('api/contact/removeOneContact.php?idContact=' + id)
                                        .then(res => res.json())
                                        .then(data => {

                                            console.log('remove contact')

                                            if(data.message === "Unable to remove contact.") {
                                                let error_message = `<p>Impossible de supprimer cette réservation.</p><p>Merci de contacter l'administrateur du site.</p>`;

                                                displayModale(error_message);

                                            } else if (data.message === "contact removed."){
                                                let success_message = `<p>La réservation et les participants associés ont été supprimés avec succès.</p>`;

                                                displayModale(success_message);

                                            }
                                            showBookings();
                                        })
                                }
                            }
                        })
                }))
            })
        }));
    });

    // // remove booking record based on given booking ID
    // fetch('api/contact/removeOneContact.php?idContact=' + id)
    // .then(res => res.json())
    // .then(data => {

    //     if(data.message === "Unable to remove contact.") {
    //         let error_message = `<p>Impossible de supprimer cette réservation.</p><p>Merci de contacter l'administrateur du site.</p>`;

    //         displayModale(error_message);

    //     } else if (data.message === "contact removed."){
    //         let success_message = `<p>La réservation et les participants associés ont été supprimés avec succès.</p>`;

    //         displayModale(success_message);

    //     }
    //     showBookings();
    // })
}

function showContact(identifier) {

    // get contact ID
    let id = identifier.getAttribute('data-id');
    let whereToWrite = document.querySelector("#page-content");

    // read contact record based on given contact ID
    fetch('api/contact/readOneContactDetails.php?idContact=' + id)
    .then(res => res.json())
    .then((data) => {

        let update_one_contact_html = `

        <button class='back' onclick='showDetails(this)' data-id='` + id + `'>
            Retour
        </button>

        <!-- contact data will be shown in this form -->
        <!-- <form method="post" action="api/contact/updateOneContact.php"> -->
        <form>
            <!-- Contact details -->
                <label>Nom</label>
                <input type="text" name="contact_lastName" value='` + data.lastName + `'>
                <label>Prénom</label>
                <input type="text" name="contact_firstName" value='` + data.firstName + `'>
                <label>Société</label>
                <input type="text" name="contact_society" value='` + data.organisation + `'>
                <label>Téléphone</label>
                <input type="tel" name="contact_phone" value='` + data.phoneNumber + `'>
                <label>Mail</label>
                <input type="mail" name="contact_mail" value=` + data.mail + `>
                <label>Adresse</label>
                <input type="text" name="contact_adress" value='` + data.adress + `'>
                <label>Code Postal</label>
                <input type="Number" name="contact_postalCode" value='` + data.postalCode + `'>
                <label>Ville</label>
                <input type="text" name="contact_city" value='` + data.city + `'>
                <input type="hidden" id="idContact" name="contact_id" data-id = `+ id +` value=` + id + `>
                <button type="submit" class="updateContact" data-id= `+ id +` >Modifier</button> 
        
        </form>`;
        
        whereToWrite.innerHTML = update_one_contact_html;

        let form = document.querySelector('form');

        form.addEventListener('submit',e => {
            e.preventDefault();

            updateContact();
        })

    })
}

function updateContact() {

    // get contact ID
    let id = document.querySelector('#idContact').value;

    console.log(id);

    let form = document.querySelector('form');
    let dataContact = new FormData(form);

    // update contact
    fetch('api/contact/updateOneContact.php', {
        method: 'post',
        body: dataContact
    })
        .then(res => res.json())
        .then(data => {
            console.log(data.message)

            if (data.message === "Unable to update contact."){
                let error_message = `<p>Impossible de modifier ce contact.</p><p>Votre saisie est erronée.</p>`;

                displayModale(error_message);

            } else if (data.message === "contact updated."){
                let success_message = `<p>Le contacta été modifié avec succès.</p>`;

                displayModale(success_message);
            }

            showDetails(idContact)
        })
}

function displayModale(message) {
    console.log('test display');
    console.log(message);
    let modale = document.querySelector(".modale");
    let modale_message = document.querySelector("#modale-message");

    if (message === `<p>La réservation et les participants associés ont été supprimés avec succès.</p>` || message === `<p>Le contacta été modifié avec succès.</p>`) {
        console.log('test if')
        modale.classList.remove('hide');
        modale.classList.remove('red-border');
        modale.classList.add('green-border');
        modale_message.innerHTML = message;
    } else if (message ===`<p>Impossible de supprimer cette réservation.</p><p>Merci de contacter l'administrateur du site.</p>` 
    || message === `<p>Impossible de modifier ce contact.</p><p>Votre saisie est erronée.</p>`) {
        modale.classList.remove('hide');
        modale.classList.add('red-border');
        modale_message.innerHTML = message;
    } else if (message.startsWith(`<p>Etes-vous sûr de vouloir supprimer la réservation de `)){
        modale.classList.remove('hide');
        modale.classList.add('red-border');
        modale_message.innerHTML = message;
    }
}

function hideModale() {
    console.log('hide');
    let modale = document.querySelector(".modale");
    modale.classList.add('hide');
    if (modale.classList.contains('red-border')){
        modale.classList.remove('red-border');
    } else {
        modale.classList.remove('green-border');
    }
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




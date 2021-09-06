'use strict';

//NB: for every booking, idBooking & idContact are the same

// We load the resa when the page is ready :
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

// Actions on reservation

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
                <button type="button" class="more"  onclick='confirmRemovation(this)' data-id='` + key.idBooking + `' data-lastName='`+ key.lastName +`' data-firstName='`+ key.firstName + `' data-typeOfBooking='`+ key.typeOfBooking +`'>
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

    // get booking ID (same as contact ID) 
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
                    <h3>Contact<button class="action fas fa-pen" onclick='showContact(this)' data-idContact='`+ data.idContact +`'</button></h3>

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
                                            

                                            console.log(dataUsers)
                                            read_users_html = `
                                                
                                                <table class="backParticipantsList`+ key.idBookingActivity +`">
                                                    <tr>
                                                        <th>Nom</th>
                                                        <th>Prénom</th>
                                                        <th>Date de naissance</th>
                                                        <th>Taille</th>
                                                        <th>Niveau</th>
                                                        <th>Action</th>
                                                    </tr>
                                                    
                                                </table>
                                                `;
                                                

                                            (dataUsers.records.forEach((keyUser, valUser) => {

                                                let user = `
                                                    <tr id='`+ keyUser.idUser +`'>
                                                        <td>` + keyUser.lastName + `</td>
                                                        <td>` + keyUser.firstName + `</td>
                                                        <td>` + keyUser.birthdate + `</td>
                                                        <td>` + keyUser.size + `</td>
                                                        <td>` + keyUser.level + `</td>
                                                        <td>
                                                            <button class="action fas fa-pen" onclick='showOneUser(this)' data-id='`+ keyUser.idBooking +`' data-idUser='`+ keyUser.idUser +`'</button>
                                                            <button class="action fas fa-trash" onclick='removeOneUser(this)' data-id='`+ keyUser.idBooking +`' data-id='`+ keyUser.idUser +`'</button>
                                                        </td>
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

                                        console.log(dataUsers)

                                        let read_users_html = `
                                        
                                        <table class="backParticipantsList">
                                        <tr>
                                        <th>Nom</th>
                                        <th>Prénom</th>
                                        <th>Date de naissance</th>
                                        <th>Taille</th>
                                        <th>Action</th>
                                        </tr>
                                        
                                        </table>
                                        `;
                                        
                                        whereToWrite.innerHTML += read_users_html

                                        let table = document.querySelector('.backParticipantsList');

                                        (dataUsers.records.forEach((keyUser, valUser) => {

                                            let user = `
                                                    <tr id='`+ keyUser.idUser +`'>
                                                        <td>` + keyUser.lastName + `</td>
                                                        <td>` + keyUser.firstName + `</td>
                                                        <td>` + keyUser.birthdate + `</td>
                                                        <td>` + keyUser.size + `</td>
                                                        <td>
                                                            <button class="action fas fa-pen" onclick='showOneUser(this)' data-id='`+ keyUser.idBooking +`' data-idUser='`+ keyUser.idUser +`'</button>
                                                            <button class="action fas fa-trash" onclick='removeOneUser(this)' data-id='`+ keyUser.idBooking +`' data-idUser='`+ keyUser.idUser +`'</button>
                                                        </td>
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

function confirmRemovation(identifier){

    // get booking ID
    let id = identifier.getAttribute('data-id');
    let lastName = identifier.getAttribute('data-lastName');
    let firstName = identifier.getAttribute('data-firstName');
    let typeOfBooking = identifier.getAttribute('data-typeOfBooking');

    let check_message = `<p>Etes-vous sûr de vouloir supprimer la réservation de ` + firstName + ` ` + lastName + `?
    <div>
        <button type="button" onclick='remove(this)' class="validateButton" data-id='` + id + `' data-typeOfBooking='`+ typeOfBooking +`'>oui</button> 
        <button type="button" onclick="hideModale()" class="cancelButton">non</button> 
    </div>
    `;

    displayModale(check_message);
}

async function remove(identifier) {

    hideModale();

    // get contact ID
    let idContact = identifier.getAttribute('data-idContact');
    // get typde of booking
    let typeOfBooking = identifier.getAttribute('data-typeOfBooking');

    let crtIdBookingActivity = 0

    // read activities record based on given booking ID
    fetch('api/activity/readActivitiesList.php?idBooking=' + idContact)
    .then(res => res.json())
    .then((data) => {

        if (typeOfBooking === "singleActivity") {

        // to remove ?
            // loop through returned list of data
            (data.records.forEach((key, val) => {

                crtIdBookingActivity = key.idBookingActivity;
            
                //read users record based on given bookingActivity ID
                fetch('api/bookingActivitiesUsers/readAllUsers.php?idBookingActivity=' + crtIdBookingActivity)
                .then(res => res.json())
                .then((dataUsers) => {

                    console.log(dataUsers.records)

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
                                    console.log('participant '+n+' supprimé')

                                    if (dataUsers.records.length === n) {
                                        // remove booking record based on given contact ID
                                        fetch('api/contact/removeOneContact.php?idContact=' + idContact)
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
        // endto remove ?
        } else {

            console.log('cock');

            crtIdBookingActivity = data.records[0].idBookingActivity;
            
            //read users record based on given bookingActivity ID
            fetch('api/bookingActivitiesUsers/readAllUsers.php?idBookingActivity=' + crtIdBookingActivity)
            .then(res => res.json())
            .then((dataUsers) => {

                console.log(dataUsers.records)

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
                                console.log('participant '+n+' supprimé')

                                if (dataUsers.records.length === n) {
                                    // remove booking record based on given booking ID
                                    fetch('api/contact/removeOneContact.php?idContact=' + idContact)
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
        }
    });
}

// Actions on contact

function showContact(identifier) {

    // get contact ID
    let idContact = identifier.getAttribute('data-idContact');
    let whereToWrite = document.querySelector("#page-content");

    // read contact record based on given contact ID
    fetch('api/contact/readOneContactDetails.php?idContact=' + idContact)
    .then(res => res.json())
    .then((data) => {

        let update_one_contact_html = `

        <button class='back' onclick='showDetails(this)' data-id='` + idContact + `'>
            Retour
        </button>

        <p>Informations de contact</p>
        <!-- contact data will be shown in this form -->
        <form>
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
            <input type="hidden" id="idContact" name="contact_id" data-id=` + idContact + ` value=` + idContact + `>
            <button type="submit" class="update">Modifier</button> 
        
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
    let idContact = document.querySelector('#idContact');

    let form = document.querySelector('form');
    let dataContact = new FormData(form);

    for (let key of dataContact.keys()) {
        console.log(key + " : "+ dataContact.get(key));
        }

    // update contact
    fetch('api/contact/updateOneContact.php', {
        method: 'post',
        body: dataContact
    })
        .then(res => res.json())
        .then(data => {

            if (data.message === "Unable to update contact."){
                let error_message = `<p>Impossible de modifier ce contact.</p><p>Votre saisie est erronée.</p>`;

                displayModale(error_message);

            } else if (data.message === "contact updated."){
                let success_message = `<p>Le contact a été modifié avec succès.</p>`;

                displayModale(success_message);

                showDetails(idContact);
            }
        })
}

// Actions on user (or participant)

function showOneUser(identifier){
    
    let idContact = identifier.getAttribute('data-id');
    let idUser = identifier.getAttribute('data-idUser');

    // read user record based on given user ID
    fetch('api/user/readOneUserDetails.php?idUser=' + idUser)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            let update_one_user_html =`

            <button class='back' onclick='showDetails(this)' data-id='` + idContact + `'>
                Retour
            </button>

            <p>Informations du participant</p>
            <!-- user data will be shown in this form -->
            <form>
                <input type="text" name="participant_lastName" value='` + data.lastName + `'>
                <input type="text" name="participant_firstName" value='` + data.firstName + `'>
                <input type="text" name="participant_birthdate" value='` + data.birthdate + `'>
                <input type="text" name="participant_size" value='` + data.size + `'>
                <input type="hidden" name="participant_id" value='` + idUser + `'>
                <input type="hidden" id="idContact" data-id=` + idContact + `>
                <button type="submit" class="update">Modifier</button> 
            </form>`;

            let whereToWrite = document.querySelector("#page-content");
            whereToWrite.innerHTML = update_one_user_html;

            let form = document.querySelector('form');

            form.addEventListener('submit',e => {
                e.preventDefault();

                updateOneUser();
            })
        })
}
    
function updateOneUser() {

    // get contact ID
    let idContact = document.querySelector('#idContact');

    let form = document.querySelector('form');
    let dataParticipant = new FormData(form);

    // update contact
    fetch('api/user/updateOneUser.php', {
        method: 'post',
        body: dataParticipant
    })
        .then(res => res.json())
        .then(data => {

            if (data.message === "Unable to update user."){
                let error_message = `<p>Impossible de modifier ce participant.</p><p>Votre saisie est erronée.</p>`;

                displayModale(error_message);

            } else if (data.message === "user updated."){
                let success_message = `<p>Le  participant a été modifié avec succès.</p>`;

                displayModale(success_message);

                showDetails(idContact);
            }

        })
}

function removeOneUser(identifier) {

    console.log(identifier);
    let idUser = identifier.getAttribute('data-idUser');

    // remove user record based on given user ID
    fetch('api/user/removeOneUser.php?idUser=' + idUser)
    .then(res => res.json())
    .then(data => {

        if (data.message === "Unable to remove user.") {
            let error_message = `<p>Problème lors de la suppression d'un participant.</p><p>Merci de contacter l'administrateur du site.</p>`
        
            displayModale(error_message);

        } else if (data.message === "user removed.") {
            let success_message = `<p>Le  participant a été supprimé avec succès.</p>`;

            displayModale(success_message);

            showDetails(identifier);
        }
    })
}

// // Actions on reservation

function displayModale(message) {
    console.log(message);
    let modale = document.querySelector(".modale");
    let modale_message = document.querySelector("#modale-message");

    if (message.includes('succès')) {
        modale.classList.remove('hide');
        modale.classList.remove('red-border');
        modale.classList.add('green-border');
        modale_message.innerHTML = message;
    } else if (message.startsWith('<p>Impossible')) {
        modale.classList.remove('hide');
        modale.classList.add('red-border');
        modale_message.innerHTML = message;
    } else if (message.startsWith('<p>Etes-vous sûr de vouloir supprimer la réservation de ')){
        modale.classList.remove('hide');
        modale.classList.add('red-border');
        modale_message.innerHTML = message;
    }
}

function hideModale() {
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




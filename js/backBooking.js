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
                <button type="button" class="more" onclick='showDetails(this)'  data-idBooking='` + key.idBooking + `'>
                consulter
                </button>
                
                <!-- delete product button -->
                <button type="button" class="more"  onclick='confirmBookingRemovation(this)' data-idBooking='` + key.idBooking + `' data-idContact='` + key.idContact + `' data-lastName='`+ key.lastName +`' data-firstName='`+ key.firstName + `' data-typeOfBooking='`+ key.typeOfBooking +`'>
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
    let idBooking = identifier.getAttribute('data-idBooking');

    let typeOfBooking = "";
    let read_activities_html = ""
    let whereToWrite = document.querySelector("#page-content");

    // read booking record based on given booking ID
    fetch('api/booking/readOneBookingDetails.php?idBooking=' + idBooking)
        .then(res => res.json())
        .then((dataBooking) => {

            typeOfBooking = dataBooking.typeOfBooking

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
                    <td>` + convertDate(dataBooking.dateOfBooking) + `</td>
                </tr>
            
                <!-- Booking Type -->
                <tr>
                    <td>Type de reservation</td>
                    <td>` + dataBooking.typeOfBooking + `</td>
                </tr>
            </table>`;

            whereToWrite.innerHTML = read_one_booking_html;

            // read contact record based on given contact ID
            fetch('api/contact/readOneContactDetails.php?idContact=' + dataBooking.idContact)
                .then(res => res.json())
                .then((dataContact) => {
                    
                    let read_one_contact_html = `
                    <h3>Contact<button class="action fas fa-pen" onclick='showContact(this)' data-idBooking='`+ idBooking + `' data-idContact='`+ dataContact.idContact +`'</button></h3>

                    <!-- contact data will be shown in this table -->
                    <table>
                    
                        <!-- Contact details -->
                        <tr>
                            <td>Nom</td>
                            <td>` + dataContact.lastName + `</td>
                        </tr>

                        <tr>
                            <td>Prénom</td>
                            <td>` + dataContact.firstName + `</td>
                        </tr>
                    
                        <tr>
                            <td>Société</td>
                            <td>` + dataContact.organisation + `</td>
                        </tr>

                        <tr>
                            <td>Téléphone</td>
                            <td><a href="tel:` + dataContact.phoneNumber +`">` + dataContact.phoneNumber + `</a></td>
                        </tr>

                        <tr>
                            <td>Mail</td>
                            <td><a href="mailto:` + dataContact.mail + `" target="_blank">` + dataContact.mail + `</a></td>
                        </tr>

                        <tr>
                            <td>Adresse</td>
                            <td>` + dataContact.adress + `</td>
                        </tr>

                        <tr>
                            <td>Code Postal</td>
                            <td>` + dataContact.postalCode + `</td>
                        </tr>

                        <tr>
                            <td>Ville</td>
                            <td>` + dataContact.city + `</td>
                        </tr>  
                    
                    </table>`;

                    whereToWrite.innerHTML += read_one_contact_html;

                    let crtIdBookingActivity = 0

                    // read activities record based on given booking ID
                    fetch('api/bookingActivities/readActivitiesList.php?idBooking=' + idBooking)
                        .then(res => res.json())
                        .then((dataActivities) => {

                            if (typeOfBooking === "singleActivity") {
                                read_activities_html = `<h3>Activité(s)</h3>`;

                                // loop through returned list of data
                                (dataActivities.records.forEach((keyActivity, valActivity) => {
                                    // creating new table row per record
                                    read_activities_html += `<p>` + keyActivity.nameActivity + ` , ` + convertDate(keyActivity.dateActivity) + ` , ` + keyActivity.halfDaySelect + `
                                                            <button class="action fas fa-pen" onclick='showBookingActivities(this)' data-idBooking='`+ idBooking +`' data-idBookingActivity='` + keyActivity.idBookingActivity +`' data-typeOfBooking='` + typeOfBooking + `'></button>
                                                            <button class="action fas fa-trash" onclick='removeBookingActivity(this)' data-idBooking='`+ idBooking +`' data-idBookingActivity='` + keyActivity.idBookingActivity +`' data-typeOfBooking='` + typeOfBooking + `'></button></p>`;
                                    read_activities_html += `<div id="usersActivity` + keyActivity.idBookingActivity + `"></div>`;

                                    whereToWrite.innerHTML += read_activities_html;
                                    read_activities_html = ''

                                    crtIdBookingActivity = keyActivity.idBookingActivity

                                    let read_users_html = ''

                                    //read activities record based on given bookingActivity ID
                                    fetch('api/bookingActivitiesUsers/readAllUsers.php?idBookingActivity=' + crtIdBookingActivity)
                                        .then(res => res.json())
                                        .then((dataUsers) => {
                                            
                                            read_users_html = `
                                                
                                                <table class="backParticipantsList`+ keyActivity.idBookingActivity +`">
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
                                                            <button class="action fas fa-pen" onclick='showOneUser(this)' data-idBooking='`+ keyUser.idBooking +`' data-idUser='`+ keyUser.idUser +`'</button>
                                                            <button class="action fas fa-trash" onclick='confirmUserRemovation(this)' data-idBooking='` + keyUser.idBooking + `' data-idUser='`+ keyUser.idUser +`' data-lastName='`+ keyUser.lastName +`' data-firstName='`+ keyUser.firstName +`'</button>
                                                        </td>
                                                    </tr>
                                                `;

                                                document.querySelector("#usersActivity"+keyUser.idBookingActivity).innerHTML += read_users_html;

                                                let table = document.querySelector('.backParticipantsList'+keyActivity.idBookingActivity);

                                                table.innerHTML += user;

                                                read_users_html='';

                                            }))
                                        })
                                }));
                            }
                            
                            if (typeOfBooking !== "singleActivity") {

                                read_activities_html = `<h3>Activité(s)<button class="action fas fa-pen" onclick='showBookingActivities(this)' data-idBooking='`+ idBooking +`' data-typeOfBooking='` + typeOfBooking + `'></button></h3>`;

                                // loop through returned list of data
                                (dataActivities.records.forEach((keyActivity, valActivity) => {
                                    // creating new table row per record
                                    read_activities_html += `<p>` + keyActivity.nameActivity + ` , ` + convertDate(keyActivity.dateActivity) + ` , ` + keyActivity.halfDaySelect + `
                                    <button class="action fas fa-trash" onclick='removeBookingActivity(this)' data-idBooking='`+ idBooking +`' data-idBookingActivity='` + keyActivity.idBookingActivity +`' data-typeOfBooking='` + typeOfBooking + `'></button></p>`;
                                    read_activities_html += `<div id="usersActivity` + keyActivity.idBookingActivity + `"></div>`;

                                    whereToWrite.innerHTML += read_activities_html;
                                    read_activities_html = ''

                                    crtIdBookingActivity = keyActivity.idBookingActivity

                                }))

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
                                                        <button class="action fas fa-pen" onclick='showOneUser(this)' data-idBooking='`+ keyUser.idBooking +`' data-idUser='`+ keyUser.idUser +`'</button>
                                                        <button class="action fas fa-trash" onclick='confirmUserRemovation(this)' data-idBooking='` + keyUser.idBooking + `' data-idUser='`+ keyUser.idUser +`' data-lastName='`+ keyUser.lastName +`' data-firstName='`+ keyUser.firstName +`'</button>
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

function confirmBookingRemovation(identifier){

    // get booking informations
    let idBooking = identifier.getAttribute('data-idBooking');
    let typeOfBooking = identifier.getAttribute('data-typeOfBooking');

    // get contact informations
    let idContact = identifier.getAttribute('data-idContact');
    let lastName = identifier.getAttribute('data-lastName');
    let firstName = identifier.getAttribute('data-firstName');

    let check_message = `<p>Etes-vous sûr de vouloir supprimer la réservation de ` + firstName + ` ` + lastName + `?</p>
    <small>Cette action est irréversible.</small>
    <div>
        <button type="button" onclick='removeBooking(this)' class="validateButton" data-idBooking='` + idBooking + `' data-idContact='` + idContact + `' data-typeOfBooking='`+ typeOfBooking +`'>oui</button> 
        <button type="button" onclick="hideModale()" class="cancelButton">non</button> 
    </div>
    `;

    displayModale(check_message);
}

async function removeBooking(identifier) {

    hideModale();

    // get booking informations
    let idBooking = identifier.getAttribute('data-idBooking');
    let typeOfBooking = identifier.getAttribute('data-typeOfBooking');
    
    // get contact ID
    let idContact = identifier.getAttribute('data-idContact');

    // read activities record based on given booking ID
    fetch('api/activity/readActivitiesList.php?idBooking=' + idBooking)
    .then(res => res.json())
    .then((dataActivities) => {
        console.log(dataActivities)

        let length = dataActivities.records.length;
        let lastid = dataActivities.records[length-1].idBookingActivity
        if (typeOfBooking === "singleActivity") {
            for (let index = 0; index < length; index++) {
                let activity = dataActivities.records[index];

                console.log(activity.idBookingActivity);

                fetch('api/bookingActivitiesUsers/removeAllUsers.php?idBookingActivity=' + activity.idBookingActivity)
                    .then(res =>res.json())
                    .then((dataUsers) => {
                        console.log(dataUsers.message)

                        if (dataUsers.message === "Unable to remove users.") {
                            let error_message = `<p>Impossible de supprimer cette réservation (problème lors de la suppression des participants).</p><p>Merci de contacter l'administrateur du site.</p>`;
        
                            displayModale(error_message);

                        } else if (dataUsers.message === "users removed.") {
                            if (lastid === activity.idBookingActivity) {

                                // remove booking record based on given contact ID
                                fetch('api/contact/removeOneContact.php?idContact=' + idContact)
                                    .then(res => res.json())
                                    .then(dataContact => {

                                        console.log(dataContact.message)

                                        if(dataContact.message === "Unable to remove contact.") {
                                            let error_message = `<p>Impossible de supprimer cette réservation.</p><p>Merci de contacter l'administrateur du site.</p>`;

                                            displayModale(error_message);

                                        } else if (dataContact.message === "contact removed."){
                                            let success_message = `<p>La réservation et les participants associés ont été supprimés avec succès.</p>`;

                                            displayModale(success_message);
                                        }
                                        showBookings();
                                    })
                            }
                        }
                    })
                
            }

        // }
    // })

    // to remove ?
            // loop through returned list of data
            // (data.records.forEach((key, val) => {

            //     crtIdBookingActivity = key.idBookingActivity;
            
            //     //read users record based on given bookingActivity ID
            //     fetch('api/bookingActivitiesUsers/readAllUsers.php?idBookingActivity=' + crtIdBookingActivity)
            //     .then(res => res.json())
            //     .then((dataUsers) => {

            //         console.log(dataUsers.records)

            //         let n = 0;

            //         (dataUsers.records.forEach((keyUser, valUser) => {

            //             let crtUserId = keyUser.idUser 
                        
            //             // remove user record based on given user ID
            //             fetch('api/user/removeOneUser.php?idUser=' + crtUserId)
            //                 .then(res => res.json())
            //                 .then(dataUser => {

            //                     if (dataUser.message === "Unable to remove user.") {
            //                         let error_message = `<p>Problème lors de la suppression d'un participant.</p><p>Merci de contacter l'administrateur du site.</p>`
                                
            //                         displayModale(error_message);

            //                     } else if (dataUser.message === "user removed.") {
                                    
            //                         n++
            //                         console.log('participant '+n+' supprimé')

            //                         if (dataUsers.records.length === n && keyUser.idBookingActivity === testid) {
            //                             // remove booking record based on given contact ID
            //                             fetch('api/contact/removeOneContact.php?idContact=' + id)
            //                                 .then(res => res.json())
            //                                 .then(data => {

            //                                     console.log('remove contact')

            //                                     if(data.message === "Unable to remove contact.") {
            //                                         let error_message = `<p>Impossible de supprimer cette réservation.</p><p>Merci de contacter l'administrateur du site.</p>`;

            //                                         displayModale(error_message);

            //                                     } else if (data.message === "contact removed."){
            //                                         let success_message = `<p>La réservation et les participants associés ont été supprimés avec succès.</p>`;

            //                                         displayModale(success_message);

            //                                     }
            //                                     showBookings();
            //                                 })
            //                         }
            //                     }
            //                 })
            //         }))
            //     })
            // }));
    // endto remove ?
        
        } else {

            console.log('cock');

            let crtIdBookingActivity = dataActivities.records[0].idBookingActivity;

            fetch('api/bookingActivitiesUsers/removeAllUsers.php?idBookingActivity=' + crtIdBookingActivity)
                    .then(res =>res.json())
                    .then((dataUsers) => {
                        console.log(dataUsers.message)

                        if (dataUsers.message === "Unable to remove users.") {
                            let error_message = `<p>Impossible de supprimer cette réservation (problème lors de la suppression des participants).</p><p>Merci de contacter l'administrateur du site.</p>`;
        
                            displayModale(error_message);

                        } else if (dataUsers.message === "users removed.") {

                            // remove booking record based on given contact ID
                            fetch('api/contact/removeOneContact.php?idContact=' + idContact)
                                .then(res => res.json())
                                .then(dataContact => {

                                    console.log(dataContact.message)

                                    if(dataContact.message === "Unable to remove contact.") {
                                        let error_message = `<p>Impossible de supprimer cette réservation.</p><p>Merci de contacter l'administrateur du site.</p>`;

                                        displayModale(error_message);

                                    } else if (dataContact.message === "contact removed."){
                                        let success_message = `<p>La réservation et les participants associés ont été supprimés avec succès.</p>`;

                                        displayModale(success_message);
                                    }
                                    showBookings();
                                })
                        }
                    })
            
            // to remove ?
            // //read users record based on given bookingActivity ID
            // fetch('api/bookingActivitiesUsers/readAllUsers.php?idBookingActivity=' + crtIdBookingActivity)
            // .then(res => res.json())
            // .then((dataUsers) => {

            //     console.log(dataUsers.records)

            //     let n = 0;

            //     (dataUsers.records.forEach((keyUser, valUser) => {

            //         let crtUserId = keyUser.idUser 
                    
            //         // remove user record based on given user ID
            //         fetch('api/user/removeOneUser.php?idUser=' + crtUserId)
            //             .then(res => res.json())
            //             .then(data => {

            //                 if (data.message === "Unable to remove user.") {
            //                     let error_message = `<p>Problème lors de la suppression d'un participant.</p><p>Merci de contacter l'administrateur du site.</p>`
                            
            //                     displayModale(error_message);

            //                 } else if (data.message === "user removed.") {
                                
            //                     n++
            //                     console.log('participant '+n+' supprimé')

            //                     if (dataUsers.records.length === n) {
            //                         // remove booking record based on given contact ID
            //                         fetch('api/contact/removeOneContact.php?idContact=' + idContact)
            //                             .then(res => res.json())
            //                             .then(data => {

            //                                 console.log('remove contact')

            //                                 if(data.message === "Unable to remove contact.") {
            //                                     let error_message = `<p>Impossible de supprimer cette réservation.</p><p>Merci de contacter l'administrateur du site.</p>`;

            //                                     displayModale(error_message);

            //                                 } else if (data.message === "contact removed."){
            //                                     let success_message = `<p>La réservation et les participants associés ont été supprimés avec succès.</p>`;

            //                                     displayModale(success_message);

            //                                 }
            //                                 showBookings();
            //                             })
            //                     }
            //                 }
            //             })
            //     }))
            // })    
        }
    });
}

// Actions on contact

function showContact(identifier) {

    let idBooking = identifier.getAttribute('data-idBooking');
    let idContact = identifier.getAttribute('data-idContact');
    let whereToWrite = document.querySelector("#page-content");

    // read contact record based on given contact ID
    fetch('api/contact/readOneContactDetails.php?idContact=' + idContact)
        .then(res => res.json())
        .then((dataContact) => {

            let update_one_contact_html = `

            <button class='back' onclick='showDetails(this)' data-idBooking='` + idBooking + `'>
                Retour
            </button>

            <p>Informations de contact</p>
            <!-- contact data will be shown in this form -->
            <form>
                <label>Nom</label>
                <input type="text" name="contact_lastName" value='` + dataContact.lastName + `'>
                <label>Prénom</label>
                <input type="text" name="contact_firstName" value='` + dataContact.firstName + `'>
                <label>Société</label>
                <input type="text" name="contact_society" value='` + dataContact.organisation + `'>
                <label>Téléphone</label>
                <input type="tel" name="contact_phone" value='` + dataContact.phoneNumber + `'>
                <label>Mail</label>
                <input type="mail" name="contact_mail" value=` + dataContact.mail + `>
                <label>Adresse</label>
                <input type="text" name="contact_adress" value='` + dataContact.adress + `'>
                <label>Code Postal</label>
                <input type="Number" name="contact_postalCode" value='` + dataContact.postalCode + `'>
                <label>Ville</label>
                <input type="text" name="contact_city" value='` + dataContact.city + `'>
                <input type="hidden" id="idBooking" name="contact_id" data-idBooking=` + idBooking + ` value=` + idBooking + `>
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
    let idBooking = document.querySelector('#idBooking');

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

                showDetails(idBooking);
            }
        })
}

// Actions on Activities

function showBookingActivities(identifier) {

    let idBooking = identifier.getAttribute('data-idBooking');
    let idBookingActivity = identifier.getAttribute('data-idBookingActivity');
    let typeOfBooking = identifier.getAttribute('data-typeOfBooking');
    let whereToWrite = document.querySelector("#page-content");

    if (typeOfBooking === "singleActivity") {

        // read activity record based on given bookingActivity ID
        fetch('api/bookingActivities/readOneActivity.php?idBookingActivity=' + idBookingActivity)
            .then(res => res.json())
            .then((dataActivity) => {
            console.log("🚀 ~ file: backBooking.js ~ line 680 ~ .then ~ dataActivity", dataActivity)

                let update_activity_html = `
                    <button class='back' onclick='showDetails(this)' data-idBooking='` + idBooking + `'>
                        Retour
                    </button>

                    <p>Activité à modifier</p>
                    <!-- activity data will be shown in this form -->
                    <form>
                        <div id="activity">
                        </div>
                        <input type="hidden" id="idBooking" name="booking_id" data-idBooking=` + idBooking + ` value=` + idBooking + `>
                        <button type="submit" class="update">Modifier</button> 
                    </form>
                `;

                whereToWrite.innerHTML = update_activity_html;

                let activity = document.querySelector('#activity');
                console.log("🚀 " , activity)

                if (dataActivity.halfDaySelect === "Journée") {
                    let activity_html = `
                        <input type="hidden" name="bookingActivity_id_activity_` + dataActivity.idBookingActivity + `" value=` + dataActivity.idBookingActivity + `>
                        <select class="field singleActivitySelector" name="activity_` + dataActivity.idBookingActivity + `">
                            <option value="` + dataActivity.codeActivity + `">` + dataActivity.nameActivity + `</option>
                            <option value="bikeAllDayNoLoc" name="VTTAE sans location VTT - journée" data-price="80" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="april/october">VTTAE sans location VTT - journée - 80€/pers.</option>
                            <option value="bikeAllDay" name="VTTAE avec location VTT - journée" data-price="130" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="april/october">VTTAE avec location VTT - journée - 130€/pers.</option>
                            <option value="paddleAllDay" name="Paddle - journée" data-price="100" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="may/october">Paddle - journée - 100€/pers.</option>
                            <option value="climbingAllDay" name="Escalade - journée" data-price="90" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="may/october">Escalade - journée - 90€/pers.</option>
                            <option value="viaAllDay" name="Via Ferrata - journée (2 via ferrata)" data-price="110" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="may/october">Via Ferrata - journée (2 via ferrata) - 110€/pers.</option>
                            <option value="snowboardAllDay" name="Snowboard - journée" data-price="330" data-minParticipants="2" data-maxParticipants="8" data-duration="allDay" data-period="december-april">Snowboard - journée - 300€/pers.</option>
                            <option value="splitboardAllDay" name="Splitboard - journée" data-price="330" data-minParticipants="2" data-maxParticipants="6" data-duration="allDay" data-period="december-april">Splitboard - journée - 330€/pers.</option>
                        </select>
                        <input class="field singleActivityDate" type="date" name="date_activity_` + dataActivity.idBookingActivity + `" value=` + dataActivity.dateActivity + `>
                    `;
                    activity.innerHTML += activity_html;
                } else {
                    let activity_html = `
                        <input type="hidden" name="bookingActivity_id_activity_` + dataActivity.idBookingActivity + `" value=` + dataActivity.idBookingActivity + `>
                        <select class="field singleActivitySelector" name="activity_` + dataActivity.idBookingActivity + `">
                            <option value="` + dataActivity.codeActivity + `">` + dataActivity.nameActivity + `</option>
                            <option value="bikeHalfDayNoLoc" name="VTTAE sans location VTT - 1/2 journée" data-price="45" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="april/october">VTTAE sans location VTT - 1/2 journée - 45€/pers.</option>
                            <option value="bikeHalfDay" name="VTTAE avec location VTT - 1/2 journée" data-price="80" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="april/october">VTTAE avec location VTT - 1/2 journée - 80€/pers.</option>
                            <option value="paddleHalfDay" name="Paddle - 1/2 journée" data-price="55" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Paddle - 1/2 journée - 55€/pers.</option>
                            <option value="kayak" name="Kayak - 1/2 journée" data-price="50" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Kayak - 1/2 journée - 50€/pers.</option>
                            <option value="climbingHalfDay" name="Escalade - 1/2 journée" data-price="50" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Escalade - 1/2 journée - 50€/pers.</option>
                            <option value="viaHalfDay" name="Via Ferrata - 1/2 journée" data-price="60" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Via Ferrata - 1/2 journée - 60€/pers.</option>
                            <option value="archery" name="Tir à l'arc - 1/2 journée" data-price="50" data-minParticipants="6" data-maxParticipants="12" data-duration="halfDay" data-period="may/october">Tir à l'arc - 1/2 journée - 50€/pers.</option>
                            <option value="snowboardRookeasy" name="Rookeasy - 3 x 1/2 journée (débutant snow)" data-price="180" data-minParticipants="1" data-maxParticipants="8" data-duration="threeHalfDay" data-period="december-april">Rookeasy - 3 x 1/2 journée (débutant snow) - 180€/pers.</option>
                            <option value="snowboardHalfDay" name="Snowboard - 1/2 journée" data-price="160" data-minParticipants="2" data-maxParticipants="8" data-duration="halfDay" data-period="december-april">Snowboard - 1/2 journée - 160€/pers.</option>
                            <option value="splitboardHalfDay" name="Splitboard - 1/2 journée" data-price="180" data-minParticipants="2" data-maxParticipants="6" data-duration="halfDay" data-period="december-april">Splitboard - 1/2 journée - 180€/pers.</option>
                        </select>
                        <select class=field name="halfDaySelector_activity_` + dataActivity.idBookingActivity + `" value="`+ dataActivity.halfDaySelect + `">
                            <option value='Matinée'>Matin</option>
                            <option value='Après-midi'>Après-midi</option>
                        </select>
                        <input class="field singleActivityDate" type="date" name="date_activity_` + dataActivity.idBookingActivity + `" value=` + dataActivity.dateActivity + `>
                    `;
                    activity.innerHTML += activity_html;
                }
                let form = document.querySelector('form');

                form.addEventListener('submit',e => {
                    e.preventDefault();

                    updateBookingActivities();
                })
            })
    } else {

    // read activities record based on given booking ID
    fetch('api/bookingActivities/readActivitiesList.php?idBooking=' + idBooking)
        .then(res => res.json())
        .then((dataActivities) => {

            console.log(dataActivities);

            let update_activities_html = `
            <button class='back' onclick='showDetails(this)' data-idBooking='` + idBooking + `'>
                Retour
            </button>
            
            <p>Liste des activités</p>
            <!-- activities data will be shown in this form -->
            <form>
                <div id="activities">
                </div>
                <input type="hidden" id="idBooking" name="booking_id" data-idBooking=` + idBooking + ` value=` + idBooking + `>
                <button type="submit" class="update">Modifier</button> 
            </form>
            `;

            whereToWrite.innerHTML = update_activities_html;

            let activities = document.querySelector('#activities');
            console.log("🚀 " , activities)
            
            dataActivities.records.forEach((keyActivity,valActivity) => {

                if (keyActivity.halfDaySelect === "Journée") {
                    let activity_html = `
                        <input type="hidden" name="bookingActivity_id_rocCocktail_activity_` + keyActivity.idBookingActivity + `" value=` + keyActivity.idBookingActivity + `>
                        <select class="field singleActivitySelector" name="activity_` + keyActivity.idBookingActivity + `">
                            <option value="` + keyActivity.codeActivity + `">` + keyActivity.nameActivity + `</option>
                            <option value="bikeAllDayNoLoc" name="VTTAE sans location VTT - journée" data-price="80" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="april/october">VTTAE sans location VTT - journée - 80€/pers.</option>
                            <option value="bikeAllDay" name="VTTAE avec location VTT - journée" data-price="130" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="april/october">VTTAE avec location VTT - journée - 130€/pers.</option>
                            <option value="paddleAllDay" name="Paddle - journée" data-price="100" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="may/october">Paddle - journée - 100€/pers.</option>
                            <option value="climbingAllDay" name="Escalade - journée" data-price="90" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="may/october">Escalade - journée - 90€/pers.</option>
                            <option value="viaAllDay" name="Via Ferrata - journée (2 via ferrata)" data-price="110" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="may/october">Via Ferrata - journée (2 via ferrata) - 110€/pers.</option>
                            <option value="snowboardAllDay" name="Snowboard - journée" data-price="330" data-minParticipants="2" data-maxParticipants="8" data-duration="allDay" data-period="december-april">Snowboard - journée - 300€/pers.</option>
                            <option value="splitboardAllDay" name="Splitboard - journée" data-price="330" data-minParticipants="2" data-maxParticipants="6" data-duration="allDay" data-period="december-april">Splitboard - journée - 330€/pers.</option>
                        </select>
                    `;
                    activities.innerHTML += activity_html;
                } else {
                    let activity_html = `
                        <input type="hidden" name="bookingActivity_id_rocCocktail_activity_` + keyActivity.idBookingActivity + `" value=` + keyActivity.idBookingActivity + `>
                        <select class="field singleActivitySelector" name="rocCocktail_activity_` + keyActivity.idBookingActivity + `">
                            <option value="` + keyActivity.codeActivity + `">` + keyActivity.nameActivity + `</option>
                            <option value="bikeHalfDayNoLoc" name="VTTAE sans location VTT - 1/2 journée" data-price="45" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="april/october">VTTAE sans location VTT - 1/2 journée - 45€/pers.</option>
                            <option value="bikeHalfDay" name="VTTAE avec location VTT - 1/2 journée" data-price="80" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="april/october">VTTAE avec location VTT - 1/2 journée - 80€/pers.</option>
                            <option value="paddleHalfDay" name="Paddle - 1/2 journée" data-price="55" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Paddle - 1/2 journée - 55€/pers.</option>
                            <option value="kayak" name="Kayak - 1/2 journée" data-price="50" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Kayak - 1/2 journée - 50€/pers.</option>
                            <option value="climbingHalfDay" name="Escalade - 1/2 journée" data-price="50" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Escalade - 1/2 journée - 50€/pers.</option>
                            <option value="viaHalfDay" name="Via Ferrata - 1/2 journée" data-price="60" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Via Ferrata - 1/2 journée - 60€/pers.</option>
                            <option value="archery" name="Tir à l'arc - 1/2 journée" data-price="50" data-minParticipants="6" data-maxParticipants="12" data-duration="halfDay" data-period="may/october">Tir à l'arc - 1/2 journée - 50€/pers.</option>
                            <option value="snowboardRookeasy" name="Rookeasy - 3 x 1/2 journée (débutant snow)" data-price="180" data-minParticipants="1" data-maxParticipants="8" data-duration="threeHalfDay" data-period="december-april">Rookeasy - 3 x 1/2 journée (débutant snow) - 180€/pers.</option>
                            <option value="snowboardHalfDay" name="Snowboard - 1/2 journée" data-price="160" data-minParticipants="2" data-maxParticipants="8" data-duration="halfDay" data-period="december-april">Snowboard - 1/2 journée - 160€/pers.</option>
                            <option value="splitboardHalfDay" name="Splitboard - 1/2 journée" data-price="180" data-minParticipants="2" data-maxParticipants="6" data-duration="halfDay" data-period="december-april">Splitboard - 1/2 journée - 180€/pers.</option>
                        </select>
                        <input type="hidden"  name="halfDaySelector_rocCocktail_activity_` + keyActivity.idBookingActivity + `" value="`+ keyActivity.halfDaySelect + `">
                        `;
                    activities.innerHTML += activity_html;
                }
            });

            let date_html =`
                <input class="field rocDate" type="date" name="date_rocCocktail" value=` + dataActivities.records[0].dateActivity + `>
            `;
            activities.innerHTML += date_html;

            let form = document.querySelector('form');

            form.addEventListener('submit',e => {
                e.preventDefault();

                updateBookingActivities();
            })
            
        })
        
    }
}

function updateBookingActivities() {
    console.log('updateBookingActivities');

    let idBooking = document.querySelector('#idBooking');
    let jsondata = JSON.parse('{ }');
    let form = document.querySelector('form');
    let dataActivities = new FormData(form);
    let activitiesJson = JSON.parse('[]');

    for (let key of dataActivities.keys()) {
        console.log(key + " : "+ dataActivities.get(key));

        // Manage Activity
        if (key.startsWith('activity')) {
            // Adding activity x
            let activityDetailsJson = JSON.parse('{ }');

            // get activity name
            activityDetailsJson["nameActivity"] = dataActivities.get(key);
            // get activity date 
            activityDetailsJson["dateActivity"] = dataActivities.get("date_" + key);
            // get activity half day 
            if (dataActivities.has("halfDaySelector_" + key)) {
                activityDetailsJson["halfDay"] = dataActivities.get("halfDaySelector_" + key);
            }
            // get activity id 
            activityDetailsJson["idActivity"] = dataActivities.get("bookingActivity_id_" + key);
            
            jsondata["activities"] = activitiesJson;

            activitiesJson.push(activityDetailsJson);
        }

        // Manage RocActivities
        if (key.startsWith('rocCocktail')) {

            let cocktailActivitiesDetailsJson = JSON.parse('{ }');

            // get activity name
            cocktailActivitiesDetailsJson["nameActivity"] = dataActivities.get(key);
            // get activity date 
            cocktailActivitiesDetailsJson["dateActivity"] = dataActivities.get("date_rocCocktail");
            // get activity half day 
            if (dataActivities.has("halfDaySelector_" + key)) {
                cocktailActivitiesDetailsJson["halfDay"] = dataActivities.get("halfDaySelector_" + key);
            }
            // get activity id 
            cocktailActivitiesDetailsJson["idActivity"] = dataActivities.get("bookingActivity_id_" + key);
            
            jsondata["activities"] = activitiesJson;

            activitiesJson.push(cocktailActivitiesDetailsJson);
        }
    }
    console.log(jsondata);
    
    let crtFormData = JSON.stringify(jsondata);
    console.log("🚀 ~ file: backBooking.js ~ line 801 ~ updateBookingActivities ~ crtFormData", crtFormData)
    
    // update activities
    fetch('api/bookingActivities/updateActivities.php', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: crtFormData
    })
        .then(res => res.json())
        .then(data => {

            console.log(data.message);
            // if (data.message === "Unable to update activities."){
            //     let error_message = `<p>Modification impossible.</p><p>Votre saisie est erronée.</p>`;

            //     displayModale(error_message);

            // } else if (data.message === "Actvities updated."){
            //     let success_message = `<p>Modification effectuée avec succès.</p>`;

            //     displayModale(success_message);

                showDetails(idBooking);
            // }

        })
}

function removeBookingActivity(identifier) {

}

// Actions on users (or participant)

function showOneUser(identifier){
    
    let idBooking = identifier.getAttribute('data-idBooking');
    let idUser = identifier.getAttribute('data-idUser');
    let whereToWrite = document.querySelector("#page-content");

    // read user record based on given user ID
    fetch('api/user/readOneUserDetails.php?idUser=' + idUser)
        .then(res => res.json())
        .then(dataUser => {
            console.log(dataUser);

            let update_one_user_html =`

            <button class='back' onclick='showDetails(this)' data-idBooking='` + idBooking + `'>
                Retour
            </button>

            <p>Informations du participant</p>
            <!-- user data will be shown in this form -->
            <form>
                <input type="text" name="participant_lastName" value='` + dataUser.lastName + `'>
                <input type="text" name="participant_firstName" value='` + dataUser.firstName + `'>
                <input type="text" name="participant_birthdate" value='` + dataUser.birthdate + `'>
                <input type="text" name="participant_size" value='` + dataUser.size + `'>
                <input type="hidden" name="participant_id" value='` + idUser + `'>
                <input type="hidden" id="idBooking" data-idBooking='` + idBooking + `'>
                <button type="submit" class="update">Modifier</button> 
            </form>`;

            whereToWrite.innerHTML = update_one_user_html;

            let form = document.querySelector('form');

            form.addEventListener('submit',e => {
                e.preventDefault();

                updateOneUser();
            })
        })
}
    
function updateOneUser() {

    let idBooking = document.querySelector('#idBooking');
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

                showDetails(idBooking);
            }

        })
}

function confirmUserRemovation(identifier){

    //get booking ID
    let idBooking = identifier.getAttribute('data-idBooking');

    // get user informations
    let idUser = identifier.getAttribute('data-idUser');
    let lastName = identifier.getAttribute('data-lastName');
    let firstName = identifier.getAttribute('data-firstName');

    let check_message = `<p>Etes-vous sûr de vouloir supprimer ` + firstName + ` ` + lastName + `?</p>
    <small>Cette action est irréversible.</small>
    <div>
        <button type="button" onclick='removeOneUser(this)' class="validateButton" data-idBooking='` + idBooking + `' data-idUser='` + idUser + `'>oui</button> 
        <button type="button" onclick="hideModale()" class="cancelButton">non</button> 
    </div>
    `;

    displayModale(check_message);
}

function removeOneUser(identifier) {

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

// others actions

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
    } else if (message.startsWith('<p>Etes-vous sûr ')){
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
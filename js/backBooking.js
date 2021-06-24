'use strict';

// On charge les resa quand la page est prete :
document.addEventListener("DOMContentLoaded", function (event) {

    // menu management for mobile phone 
    toggleMenu();

    let showBookingsButton = document.querySelector('.showBookings');
    
    if(showBookingsButton){
        showBookingsButton.addEventListener('click', function(e){

            showBookingsButton.classList.add('hide');
            showBookings();

        });
    }

    
});


// function login(form) {
//     // console.log('login')

//     fetch('api/admin/login.php', {
//         method: 'post',
//         body: form
//     })
//         .then(res => res.text())
//         .then(msg => {
//             console.log(msg)
//             if (msg.includes('[')) {
//                 let user = JSON.parse(msg);
//                 console.log("🚀 user", user[0])
//                 document.querySelector('.alert').innerHTML = 'Salut ' + user[0] + ' !';
//                 document.querySelector('form').classList.add('hide');
//                 document.querySelector('.logout').classList.remove('hide');
//                 showBookings();
//             };
//         })
//         .catch(err =>{
//             console.log('Error: ', err);
//         })
// }

function showBookings() {

    // On recupere les données
    fetch('api/booking/readBookingsList.php')
        .then(res => res.json())
        .then((data) => {

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

                // console.log(key)
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
                    </td>
        
                </tr>`;
            }));

            // end table
            read_bookings_html += `</table>`;

            // inject to 'page-content' of our app
            document.querySelector("#page-content").innerHTML = read_bookings_html;
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
                    console.log(data)
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
                                // read_activities_html += '<h5>' + key.codeActivity + ` ` + key.nameActivity + ` ` + key.dateActivity + ` ` + key.halfDaySelect + '</h5>';
                                // let date = new Date(key.dateActivity);
                                // let split = date.toLocaleString().split(',');
                                // let myDate = split[0];
                                // console.log("🚀 ~ file: backBooking.js ~ line 220 ~ myDate", myDate)
                                read_activities_html += '<p>' + key.nameActivity + ` , ` + convertDate(key.dateActivity) + ` , ` + key.halfDaySelect + '</p>';
                                read_activities_html += '<div id="usersActivity'+key.idBookingActivity+'"></div>';

                                whereToWrite.innerHTML += read_activities_html;
                                read_activities_html = ''

                                crtIdBookingActivity = key.idBookingActivity

                                let read_users_html = ''

                                if (typeBooking === "singleActivity") {

                                    console.log('Single Activity')

                                    //read activities record based on given booking ID

                                    fetch('api/bookingActivitiesUsers/readAllUsers.php?idBookingActivity=' + crtIdBookingActivity)
                                        .then(res => res.json())
                                        .then((dataUsers) => {

                                            // console.log(dataUsers)

                                            // read_users_html = '<h3>Participants</h3>';
                                            read_users_html = `
                                                
                                                <table class="participantsList`+ key.idBookingActivity +`">
                                                    <tr>
                                                        <td>Nom</td>
                                                        <td>Prénom</td>
                                                        <td>Date de naissance</td>
                                                        <td>Taille</td>
                                                        <td>Niveau</td>
                                                    </tr>
                                                    
                                                </table>
                                                `;
                                                

                                            (dataUsers.records.forEach((keyUser, valUser) => {

                                                // // console.log(keyUser.lastName)
                                                // read_users_html += keyUser.firstName + " " + keyUser.lastName + " / ";
                                                // // console.log(read_users_html)

                                                // document.querySelector("#usersActivity"+keyUser.idBookingActivity).innerHTML += read_users_html;
                                                // read_users_html = ''

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

                                                let table = document.querySelector('.participantsList'+key.idBookingActivity);
                                                console.log("🚀 ~ file: backBooking.js ~ line 276 ~ table", table)
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

                                        console.log("coktail")

                                        let read_users_html = `<h3>Users</h3>`;

                                        (dataUsers.records.forEach((keyUser, valUser) => {

                                            // console.log(keyUser.lastName)
                                            read_users_html += keyUser.lastName + " " + keyUser.firstName + " / ";
                                            // console.log(read_users_html)

                                        }))

                                        read_activities_html += read_users_html
                                        console.log(read_activities_html)
                                        whereToWrite.innerHTML += read_activities_html;
                                    })
                            }


                        });

                });

        });

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

function convertDate(date) {
    let dateToConvert = new Date(date);
    let split = dateToConvert.toLocaleString().split(',');
    let myDate = split[0];

    return myDate;
}




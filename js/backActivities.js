'use strict'

document.addEventListener("DOMContentLoaded", function() {
    
    // menu management for mobile phone 
    toggleMenu();

});

function showActivity(identifier) {
    let activity = identifier.getAttribute('data-codeActivity');
    let dashboard = document.querySelector('.backButton');
    let whereToWrite = document.querySelector("#backActivities-content");

    // read activity record based on given codeActivity
    fetch(`api/activity/readOneActivity.php?codeActivity=${activity}`)
    .then(res => res.json())
    .then(dataActivity => {
        console.log(dataActivity);

        if(dataActivity.message === "No activity found.") {
            let error_message = `<p>Impossible d'afficher cette activité.</p><p>Merci de contacter l'administrateur du site.</p>`
                    
            displayModale(error_message);
        } else {
            let update_one_activity_html =`<button class="backButton" onclick="window.location.href = 'backActivities.php';">
                                                Retour
                                            </button>

                                            <h3>Activité sélectionnée</h3>
                                            <!-- activity data will be shown in this form -->
                                            <form>
                                                <input type="hidden" name="codeActivity" value="${dataActivity.codeActivity}">
                                                <label>Nom</label>
                                                <input type="text" name="name" value="${dataActivity.name}">
                                                <label>Tarif/pers.</label>
                                                <input type="number" name="price" value="${dataActivity.price}">
                                                <label>Nombre de participants minimum</label>
                                                <input type="number" name="minCount" value="${dataActivity.minCount}">
                                                <label>Nombre de participants maximum</label>
                                                <input type="number" name="maxCount" value="${dataActivity.maxCount}">
                                                <button type="submit" class="update">Modifier</button> 
                                            </form>`;
            
            whereToWrite.innerHTML = update_one_activity_html;

            dashboard.classList.add('hide');

            let form = document.querySelector('form');

            form.addEventListener('submit',e => {
                e.preventDefault();
    
                updateActivity();
            })
        }
    })
}

function updateActivity(){

    let form = document.querySelector('form');
    let dataActivity = new FormData(form);

    // update contact
    fetch('api/activity/updateOneactivity.php', {
        method: 'post',
        body: dataActivity
    })
    .then(res => res.json())
    .then(data => {
        if (data.message === "Unable to update activity. Technical error."){
            let error_message = `<p>Impossible de modifier cette activité en raison d'un problème technique.</p><p>Merci de contacter l'administrateur du site.</p>`;

            displayModale(error_message);

        } else if (data.message === "Unable to update activity."){
            let error_message = `<p>Impossible de modifier cette activité.</p><p>Votre saisie est erronée.</p>`;

            displayModale(error_message);

        } else if (data.message === "Activity updated."){
            let success_message = `<p>L'activité a été modifié avec succès.</p>`;

            displayModale(success_message);
            window.location.href = 'backActivities.php';

        }
    })
}

// others actions

function displayModale(message) {
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
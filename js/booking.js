'use strict';

document.addEventListener('DOMContentLoaded', function(){


    
    let bookingForm = document.querySelector('#bookingForm');

    let inputs = bookingForm.querySelectorAll('.field');

    let addActivityBtn = document.querySelector('#addActivityButton');

    let validateReservationBtn = document.querySelector('#validateReservation');


    validateReservationBtn.addEventListener('click', function(){
        inputs.forEach(input => {
            console.log(input.getAttribute("name"));
        });
    })

    addActivityBtn.addEventListener('click', addActivity);




    function addActivity(){

        let x = document.querySelector('.activities').childElementCount + 1;

        let newActivity = document.createElement('div');
        
        newActivity.innerHTML = `
            <div class="activityItem">
                <p>Activité `+ x +`</p>
                <select class="field" name="activity_`+ x +`">
                    <option value="">Séléctionnez votre activité `+ x +`</option>
                    <optogroup label="bike"> 
                        <option value="bikeHalfDayNoLoc" name="VTTAE sans location VTT - 1/2 journée" data-price="45">VTTAE sans location VTT - 1/2 journée - 45€/pers.</option>
                        <option value="bikeAllDayNoLoc" name="VTTAE sans location VTT - journée" data-price="80">VTTAE sans location VTT - journée - 80€/pers.</option>
                        <option value="bikeHalfDay" name="VTTAE avec location VTT - 1/2 journée" data-price="70">VTTAE avec location VTT - 1/2 journée - 70€/pers.</option>
                        <option value="bikeAllDay" name="VTTAE avec location VTT - journée" data-price="120">VTTAE avec location VTT - journée - 120€/pers.</option>
                    </optogroup> 
                    <optogroup label="paddle">
                        <option value="paddleHalfDay" name="Paddle - 1/2 journée" data-price="65">Paddle - 1/2 journée - 65€/pers.</option>
                        <option value="paddleAllDay" name="Paddle - journée" data-price="110">Paddle - journée - 110€/pers.</option>
                        <option value="kayak" name="Kayak - 1/2 journée" data-price="60">Kayak - 1/2 journée - 60€/pers.</option>
                    </optogroup> 
                    <optogroup label="climbing">
                        <option value="climbingHalfDay" name="Escalade - 1/2 journée" data-price="50">Escalade - 1/2 journée - 50€/pers.</option>
                        <option value="climbingAllDay" name="Escalade - journée" data-price="90">Escalade - journée - 90€/pers.</option>
                        <option value="viaHalfDay" name="Via Ferrata - 1/2 journée" data-price="60">Via Ferrata - 1/2 journée - 60€/pers.</option>
                        <option value="viaAllDay" name="Via Ferrata - journée (2 via ferrata)" data-price="110">Via Ferrata - journée (2 via ferrata) - 110€/pers.</option>
                        </optogroup> 
                        <optogroup label="archery">
                        <option value="archery" name="Tir à l'arc - 1/2 journée" data-price="50">Tir à l'arc - 1/2 journée - 50€/pers.</option>
                    </optogroup> 
                    <optogroup label="snowboard">
                        <option value="rookeasy" name="Rookeasy - 3 x 1/2 journée (débutant snow)" data-price="180">Rookeasy - 3 x 1/2 journée (débutant snow) - 180€/pers.</option>
                        <option value="snowboardHalfDay" name="Snowboard - 1/2 journée" data-price="160">Snowboard - 1/2 journée - 160€/pers.</option>
                        <option value="snowboarAllfDay" name="Snowboard - journée" data-price="330">Snowboard - journée - 300€/pers.</option>
                        <option value="splitboardHalfDay" name="Splitboard - 1/2 journée" data-price="180">Splitboard - 1/2 journée - 180€/pers.</option>
                        <option value="splitboarAllfDay" name="Splitboard - journée" data-price="330">Splitboard - journée - 330€/pers.</option>
                    </optogroup> 
                    <optogroup label="cocktail">
                        <option value="cocktailOneDay">Cocktail ROC - ROC DAY - à partir de 120€/pers.</option>
                        <option value="cocktailTwoDay">Cocktail ROC - ROC WEEK-END - à partir de 220€/pers.</option>
                    </optogroup> 
                </select>
                <input class="field" type="date" name="date_activity_`+ x +`">
                <input class="field" type="number" name="numberparticipantsCount_activity_`+ x +`" min="2" max="12" placeholder="Nombre de participants">

                <p>Participants à l'activité `+ x +`</p>
                <input class="field" type="text" name="firstName_activity_`+ x +`_participant_1" required placeholder="Nom*">
                <input class="field" type="text" name="lastName_activity_`+ x +`_participant_1" required placeholder="Prénom*">
                <input class="field" type="text" name="birthdate_activity_`+ x +`_participant_1" required placeholder="Date de naissance* (jj/mm/aaaa)">
                <input class="field" type="number" name="size_activity_`+ x +`_participant_1" required placeholder="Taille (cm)*">
                <select class="field" name="level_activity_`+ x +`_participant_1">
                    <option value="">Niveau*</option>
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="expert">Expert</option>
                </select>

                <input class="field" type="text" name="firstName_activity_`+ x +`_participant_2" required placeholder="Nom*">
                <input class="field" type="text" name="lastName_activity_`+ x +`_participant_2" required placeholder="Prénom*">
                <input class="field" type="text" name="birthdate_activity_`+ x +`_participant_2" required placeholder="Date de naissance* (jj/mm/aaaa)">
                <input class="field" type="number" name="size_activity_`+ x +`_participant_2" required placeholder="Taille (cm)*">
                <select class="field" name="level_activity_`+ x +`_participant_2">
                    <option value="">Niveau*</option>
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="expert">Expert</option>
                </select>
            </div>
        `;

        //append newActivity to button
        document.querySelector(".activities").appendChild(newActivity);
    }

});




    // **test
    // const select = document.querySelectorAll('select');

    // for (let i = 0; i < select.length; i++) {
    //     const element = select[i];

    
    //     element.addEventListener('change',function(){
    //         //get price activity
    //         let price = Number(this.options[element.selectedIndex].getAttribute('data-price'));
    //         console.log(price)

    //         //get name activity
    //         let activity = this.options[element.selectedIndex].getAttribute('name');
    //         console.log(activity);

    //         const activitiesList = document.querySelector('#selection');
    //         console.log(activitiesList);

    //         activitiesList.innerHTML = `<p>${activity}: ${price}</p>`;
    //         // <td>participants</td><td>sum</td>


    //         // let price = Number(this.querySelector(':checked').getAttribute('data-price'));
    //         // console.log(price);

            
    //         // const chosenActivities = Array.from(document.querySelectorAll("option:checked"));
            
    //         // const priceCalculation = chosenActivities.reduce((total, price) => total + price)
            
    //         // document.querySelector('#activity').textContent = activity + " : " ;
    //         // document.querySelector('#price').textContent = price ;
    //     })
    // }
    // **fin test

    // test addActivity
    // let activities = document.querySelector('.activities');
    
    // let activity = document.querySelector('.activityItem');

    // let addActivityBtn = document.querySelector('#addActivityButton');

    // addActivityBtn.addEventListener('click', addActivity);
    
    // function addActivity(){
    //     let clone = activity.cloneNode(true);
        
    //     activities.appendChild(clone);
    // }
    
    // fin test addActivity
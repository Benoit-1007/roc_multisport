'use strict';

document.addEventListener('DOMContentLoaded', function () {

    // VARIABLES
    let bookingForm = document.querySelector('#bookingForm');

    let select = bookingForm.querySelectorAll('.selector');
    // console.log("🚀 ~ file: booking.js ~ line 10 ~ document.addEventListener ~ select", select)

    let singleActivityFieldset = bookingForm.querySelector('#singleActivity');

    let rocCocktailFieldset = bookingForm.querySelector('#rocCocktail');
    
    let activitiesbtn = document.querySelectorAll('#formulaSelector button');

    let singleActivityBtn = bookingForm.querySelector('#singleActivityButton');

    let rocCocktailBtn = bookingForm.querySelector('#rocCocktailButton');

    let returnBtn = bookingForm.querySelector('#returnButton');

    let addActivityBtn = bookingForm.querySelector('#addActivityButton');

    let validateReservationBtn = bookingForm.querySelector('#validateReservation');

    //Choose between single activity or cocktail ROC
    chooseFormula(activitiesbtn);
    
    //add a new single activity
    addActivityBtn.addEventListener('click', addActivity);
    


    let inputs = bookingForm.querySelectorAll('.field');

    //VERIF RECUPERATION INPUTS
    validateReservationBtn.addEventListener('click', function () {
        inputs.forEach(input => {
            console.log(input.getAttribute('name'));
        });
    })




    //FUNCTIONS
    function chooseFormula(buttons){
        for (let i = 0; i < buttons.length; i++) {
            const btn = buttons[i];

            btn.addEventListener('click', function(){
                let currentBtn = btn.id;

                switch(currentBtn){
                    case "singleActivityButton":
                        singleActivityBtn.classList.add('hide');
                        rocCocktailBtn.classList.add('hide');
                        returnBtn.classList.remove('hide');
                        singleActivityFieldset.classList.remove("hide");
                        chooseActivity(select);
                        break;
                    case "rocCocktailButton":
                        singleActivityBtn.classList.add('hide');
                        rocCocktailBtn.classList.add('hide');
                        returnBtn.classList.remove('hide');
                        rocCocktailFieldset.classList.remove("hide");
                        chooseRocActivities(select);
                        break;
                    default:
                        singleActivityBtn.classList.remove('hide');
                        rocCocktailBtn.classList.remove('hide');
                        returnBtn.classList.add('hide');
                        singleActivityFieldset.classList.add("hide");
                        rocCocktailFieldset.classList.add("hide");
                        break;
                }
            })
        }
    }

    function addActivity() {
        let x = document.querySelector('.activities').childElementCount + 1;

        let newActivity = document.createElement('div');
        newActivity.classList.add('activityItem');

        newActivity.innerHTML = `
            <div class="activity_`+ x + `">
                <p>Activité `+ x + `</p>
                <select class="field selector" name="activity_`+ x + `">
                    <option value="">Séléctionnez votre activité `+ x + `</option>
                    <optogroup label="bike"> 
                        <option value="bikeHalfDayNoLoc" name="VTTAE sans location VTT - 1/2 journée" data-price="45" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay">VTTAE sans location VTT - 1/2 journée - 45€/pers.</option>
                        <option value="bikeAllDayNoLoc" name="VTTAE sans location VTT - journée" data-price="80" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay">VTTAE sans location VTT - journée - 80€/pers.</option>
                        <option value="bikeHalfDay" name="VTTAE avec location VTT - 1/2 journée" data-price="70" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay">VTTAE avec location VTT - 1/2 journée - 70€/pers.</option>
                        <option value="bikeAllDay" name="VTTAE avec location VTT - journée" data-price="120" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay">VTTAE avec location VTT - journée - 120€/pers.</option>
                    </optogroup> 
                    <optogroup label="paddle">
                        <option value="paddleHalfDay" name="Paddle - 1/2 journée" data-price="55" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay">Paddle - 1/2 journée - 55€/pers.</option>
                        <option value="paddleAllDay" name="Paddle - journée" data-price="100" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay">Paddle - journée - 100€/pers.</option>
                        <option value="kayak" name="Kayak - 1/2 journée" data-price="50" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay">Kayak - 1/2 journée - 50€/pers.</option>
                    </optogroup> 
                    <optogroup label="climbing">
                        <option value="climbingHalfDay" name="Escalade - 1/2 journée" data-price="50" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay">Escalade - 1/2 journée - 50€/pers.</option>
                        <option value="climbingAllDay" name="Escalade - journée" data-price="90" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay">Escalade - journée - 90€/pers.</option>
                        <option value="viaHalfDay" name="Via Ferrata - 1/2 journée" data-price="60" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay">Via Ferrata - 1/2 journée - 60€/pers.</option>
                        <option value="viaAllDay" name="Via Ferrata - journée (2 via ferrata)" data-price="110" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay">Via Ferrata - journée (2 via ferrata) - 110€/pers.</option>
                        </optogroup> 
                        <optogroup label="archery">
                        <option value="archery" name="Tir à l'arc - 1/2 journée" data-price="45" data-minParticipants="6" data-maxParticipants="12" data-duration="halfDay">Tir à l'arc - 1/2 journée - 45€/pers.</option>
                    </optogroup> 
                    <optogroup label="snowboard">
                        <option value="rookeasy" name="Rookeasy - 3 x 1/2 journée (débutant snow)" data-price="180" data-minParticipants="3" data-maxParticipants="8" data-duration="threeHalfDay">Rookeasy - 3 x 1/2 journée (débutant snow) - 180€/pers.</option>
                        <option value="snowboardHalfDay" name="Snowboard - 1/2 journée" data-price="160" data-minParticipants="2" data-maxParticipants="8" data-duration="halfDay">Snowboard - 1/2 journée - 160€/pers.</option>
                        <option value="snowboardAllDay" name="Snowboard - journée" data-price="330" data-minParticipants="2" data-maxParticipants="8" data-duration="allDay">Snowboard - journée - 300€/pers.</option>
                        <option value="splitboardHalfDay" name="Splitboard - 1/2 journée" data-price="180" data-minParticipants="4" data-maxParticipants="6" data-duration="halfDay">Splitboard - 1/2 journée - 180€/pers.</option>
                        <option value="splitboarAllfDay" name="Splitboard - journée" data-price="330" data-minParticipants="4" data-maxParticipants="6" data-duration="allDay">Splitboard - journée - 330€/pers.</option>
                    </optogroup> 
                </select>
                <input class="field" type="date" name="date_activity_`+ x + `">
                <input class="field" type="number" name="numberParticipantsCount_activity_`+ x + `" placeholder="Nombre de participants" min="2" max="12">
            </div>
            <div class="activity_`+ x + `_participants">
                <p>Participants à l'activité `+ x + `</p>
                <input class="field" type="text" name="firstName_activity_`+ x + `_participant_1" required placeholder="Nom*">
                <input class="field" type="text" name="lastName_activity_`+ x + `_participant_1" required placeholder="Prénom*">
                <input class="field" type="text" name="birthdate_activity_`+ x + `_participant_1" required placeholder="Date de naissance* (jj/mm/aaaa)">
                <input class="field" type="number" name="size_activity_`+ x + `_participant_1" required placeholder="Taille (cm)*">
                <select class="field" name="level_activity_`+ x + `_participant_1">
                    <option value="">Niveau*</option>
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="expert">Expert</option>
                </select>

                <input class="field" type="text" name="firstName_activity_`+ x + `_participant_2" required placeholder="Nom*">
                <input class="field" type="text" name="lastName_activity_`+ x + `_participant_2" required placeholder="Prénom*">
                <input class="field" type="text" name="birthdate_activity_`+ x + `_participant_2" required placeholder="Date de naissance* (jj/mm/aaaa)">
                <input class="field" type="number" name="size_activity_`+ x + `_participant_2" required placeholder="Taille (cm)*">
                <select class="field" name="level_activity_`+ x + `_participant_2">
                    <option value="">Niveau*</option>
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="expert">Expert</option>
                </select>
            </div>
        `;

        //append newActivity to button
        document.querySelector('.activities').appendChild(newActivity);

        let select = document.querySelectorAll('.selector');
        console.log("🚀select", select);

        chooseActivity(select);

    }

    function chooseActivity(field) {

        for (let i = 0; i < field.length; i++) {

            const element = field[i];

            element.addEventListener('change', function () {
                //get activity number
                let activityNumber = element.getAttribute('name').replace(/\D/g,'');
                // let split = element.getAttribute('name').split('_');
                // console.log("🚀 split", split)
                // let activityNumber = split[split.length - 1];
                console.log("🚀 activityNumber", activityNumber)
                //get name activity
                let activityName = this.options[element.selectedIndex].getAttribute('name');
                console.log("🚀 activityName", activityName);
                //get value activity
                let activityValue = this.options[element.selectedIndex].getAttribute('value');
                console.log("🚀 activityValue", activityValue);
                //get price activity
                let price = Number(this.options[element.selectedIndex].getAttribute('data-price'));
                console.log("🚀 price", price);
                //get activity duration
                let activityDuration = this.options[element.selectedIndex].getAttribute('data-duration');
                console.log("🚀 ~ file: booking.js ~ line 186 ~ activityDuration", activityDuration)
                //get min numberparticipants
                let numberMinParticipants = Number(this.options[element.selectedIndex].getAttribute('data-minParticipants'));
                console.log("🚀 ~ file: booking.js ~ line 189 ~ numberMinParticipants", numberMinParticipants)
                //get max numberparticipants
                let numberMaxParticipants = Number(this.options[element.selectedIndex].getAttribute('data-maxParticipants'));
                console.log("🚀 ~ file: booking.js ~ line 192 ~ numberMaxParticipants", numberMaxParticipants)
                //get input date
                let dateSelector = document.querySelector(`input[name="date_activity_` + activityNumber + `"]`);
                console.log("🚀 dateSelector", dateSelector)
                //get input numberparticipants
                let participantsNumberSelector = document.querySelector(`input[name="numberParticipantsCount_activity_` + activityNumber + `"]`);
                console.log("🚀 numberParticipantsCount", participantsNumberSelector);
                // get numberparticipants
                let currentParticipantsNumber = document.querySelectorAll(`div[class*="activity_` + activityNumber + `_participant_"]`).length;
                console.log("🚀currentParticipantsNumber", currentParticipantsNumber)
                //get div current activity
                let currentActivity = document.querySelector('.activity_' + activityNumber);
                console.log("🚀 currentActivity", currentActivity)


                participantsNumberSelector.setAttribute('min', numberMinParticipants);
                participantsNumberSelector.setAttribute('max', numberMaxParticipants);

                participantsNumberSelector.value = numberMinParticipants;

                switch (activityDuration) {
                    case "halfDay":
                        if (!dateSelector.nextElementSibling.classList.contains('activity_' + activityNumber + '_halfDaySelector')) {
                            addHalfDaySelector(activityNumber, currentActivity, participantsNumberSelector);
                        }
                        break;
                    default:
                        if (dateSelector.nextElementSibling.classList.contains('activity_' + activityNumber + '_halfDaySelector')) {
                            removeHalfDaySelector(activityNumber);
                        }
                        break;
                }
                displayParticipants(activityNumber, numberMinParticipants);

                participantsNumberSelector.addEventListener('keyup', function(){
                    console.log('test');
                    let newParticipantsNumber = participantsNumberSelector.value;
                    displayParticipants(activityNumber, newParticipantsNumber);
                })
            })
        }
    }

    function addHalfDaySelector(numActivity, divActivity,participantsNumberInput) {
        let halfDaySelector = document.createElement('select');
        halfDaySelector.classList.add('activity_' + numActivity + '_halfDaySelector')
        halfDaySelector.innerHTML = `
        <option value='morning'>Matin</option>
        <option value='afternoon'>Après-midi</option>
        `;
        divActivity.insertBefore(halfDaySelector, participantsNumberInput);
    }
    
    function removeHalfDaySelector(numActivity) {
        //get half day selector to remove
        let halfDaySelectorToRemove = document.querySelector('.activity_' + numActivity + '_halfDaySelector');
        //remove half day selector
        document.querySelector('.activity_' + numActivity).removeChild(halfDaySelectorToRemove);
    }

    function displayParticipants(numActivity, NumberParticipants){
        let participantsField = document.querySelector('.activity_' + numActivity + '_participants');
        let currentParticipantsNumber = document.querySelectorAll(`div[class*="activity_` + numActivity + `_participant_"]`).length;
        let differenceParticipants = NumberParticipants-currentParticipantsNumber;
        console.log("🚀 ~ file: booking.js ~ line 225 ~ differenceParticipants", differenceParticipants)
        if(differenceParticipants > 0){
            for (let i = 0; i < differenceParticipants; i++) {
                let currentParticipant = currentParticipantsNumber+i+1;
                let newParticipant = document.createElement('div');
                newParticipant.classList.add('activity_' + numActivity + '_participant_'+ currentParticipant)
                newParticipant.innerHTML = ` 
                    <input class="field" type="text" name="firstName_activity_` + numActivity + `_participant_` + currentParticipant + `" required placeholder="Nom*">
                    <input class="field" type="text" name="lastName_activity_` + numActivity + `_participant_` + currentParticipant + `" required placeholder="Prénom*">
                    <input class="field" type="text" name="birthdate_activity_` + numActivity + `_participant_` + currentParticipant + `" required placeholder="Date de naissance* (jj/mm/aaaa)">
                    <input class="field" type="number" name="size_activity_` + numActivity + `_participant_` + currentParticipant + `" required placeholder="Taille (cm)*">
                    <select class="field" name="level_activity_` + numActivity + `_participant_` + currentParticipant + `">
                        <option value="">Niveau*</option>
                        <option value="beginner">Débutant</option>
                        <option value="intermediate">Intermédiaire</option>
                        <option value="confirmed">Confirmé</option>
                        <option value="expert">Expert</option>
                    </select>
                `;
                participantsField.appendChild(newParticipant);
            }
            
        } else if(differenceParticipants < 0){
            for (let i = 0; i < Math.abs(differenceParticipants); i++) {
                let participantToRemove = document.querySelector('.activity_' + numActivity + '_participant_'+ (currentParticipantsNumber-i));
                participantsField.removeChild(participantToRemove);
            }
        }
    };

    function chooseRocActivities(field) {
        console.log('enter roc function');
        
        for (let i = 0; i < field.length; i++) {

            const element = field[i];

            element.addEventListener('change', function () {
                //get div rocCocktailActivities for add activity
                let rocCocktailActivities = document.querySelector('.rocCocktailActivities');
                console.log("🚀 rocCocktailActivities", rocCocktailActivities)
                //get name activity
                let rocActivityName = this.options[element.selectedIndex].getAttribute('name');
                console.log("🚀 rocActivityName", rocActivityName);
                //get value activity
                let activityValue = this.options[element.selectedIndex].getAttribute('value');
                console.log("🚀 activityValue", activityValue);
                //get activity duration
                let activityDuration = this.options[element.selectedIndex].getAttribute('data-duration');
                //get min numberparticipants
                let numberMinParticipants = Number(this.options[element.selectedIndex].getAttribute('data-minParticipants'));
                //get max numberparticipants
                let numberMaxParticipants = Number(this.options[element.selectedIndex].getAttribute('data-maxParticipants'));
                //get input date
                let dateSelector = document.querySelector(`input[name="date_rocActivity"]`)
                console.log("🚀 dateSelector", dateSelector)
                //get input numberparticipants
                let participantsNumberInput = document.querySelector(`input[name="numberParticipantsCount_rocActivity"]`)
                console.log("🚀 numberParticipantsCount", numberParticipantsInput);

                numberParticipantsInput.setAttribute('min', numberMinParticipants);
                numberParticipantsInput.setAttribute('max', numberMaxParticipants);

                numberParticipantsInput.value = numberMinParticipants;

                switch(activityDuration){
                    case "rocDay":
                        addHalfDayActivity();
                        break;
                    default:
                        addAllActivity();
                        break;
                }
                // ADD ROC ACTIVITY
                function addHalfDayActivity() {
                    console.log("ok");
                    let select = document.querySelectorAll('.selector');

                    chooseRocActivities(select);
                };

                function addAllActivity() {
                    let rocActivityNumber = 1;
                    let newRocActivity = document.createElement('div');
                    // if (document.querySelector("rocActivity_` + rocActivityNumber +") === null) {
                    //     newRocActivity.classList.add("activity_" + activityNumber + "_rocActivityItem");
                        newRocActivity.innerHTML = `
                        <p>ROC Activité `+ rocActivityNumber + `</p>
                        <select class="field selector" name="rocActivity_` + rocActivityNumber + `">
                            <option value="">Séléctionnez votre ROC activité `+ rocActivityNumber + `</option>
                            <optogroup label="bike"> 
                                <option value="bikeHalfDayNoLoc" name="VTTAE sans location VTT - 1/2 journée" data-price="45">VTTAE sans location VTT - 1/2 journée</option>
                                <option value="bikeAllDayNoLoc" name="VTTAE sans location VTT - journée" data-price="80">VTTAE sans location VTT - journée</option>
                                <option value="bikeHalfDay" name="VTTAE avec location VTT - 1/2 journée" data-price="70">VTTAE avec location VTT - 1/2 journée</option>
                                <option value="bikeAllDay" name="VTTAE avec location VTT - journée" data-price="120">VTTAE avec location VTT - journée</option>
                            </optogroup> 
                            <optogroup label="paddle">
                                <option value="paddleHalfDay" name="Paddle - 1/2 journée" data-price="55">Paddle - 1/2 journée</option>
                                <option value="paddleAllDay" name="Paddle - journée" data-price="100">Paddle - journée</option>
                                <option value="kayak" name="Kayak - 1/2 journée" data-price="50">Kayak - 1/2 journée</option>
                            </optogroup> 
                            <optogroup label="climbing">
                                <option value="climbingHalfDay" name="Escalade - 1/2 journée" data-price="50">Escalade - 1/2 journée</option>
                                <option value="climbingAllDay" name="Escalade - journée" data-price="90">Escalade - journée</option>
                                <option value="viaHalfDay" name="Via Ferrata - 1/2 journée" data-price="60">Via Ferrata - 1/2 journée</option>
                                <option value="viaAllDay" name="Via Ferrata - journée (2 via ferrata)" data-price="110">Via Ferrata - journée (2 via ferrata)</option>
                                </optogroup> 
                                <optogroup label="archery">
                                <option value="archery" name="Tir à l'arc - 1/2 journée" data-price="45">Tir à l'arc - 1/2 journée</option>
                            </optogroup> 
                            <optogroup label="snowboard">
                                <option value="snowboardHalfDay" name="Snowboard - 1/2 journée" data-price="160">Snowboard - 1/2 journée</option>
                                <option value="snowboarAllfDay" name="Snowboard - journée" data-price="330">Snowboard - journée</option>
                                <option value="splitboardHalfDay" name="Splitboard - 1/2 journée" data-price="180">Splitboard - 1/2 journée</option>
                                <option value="splitboardAllDay" name="Splitboard - journée" data-price="330">Splitboard - journée</option>
                            </optogroup> 
                        `;
                        rocCocktailActivities.appendChild(newRocActivity);

                        let select = document.querySelectorAll('.selector');

                        // chooseRocActivities(select);
                    // }
                }
            })
        }    
    }
});

// REMOVE ROC ACTIVITY
function removeRocActivity() {
    //get activity to remove
    let activityToRemove = document.querySelector(".activity_" + activityNumber + "_rocActivityItem")
    //remove activity
    document.querySelector(`.activity_` + activityNumber).removeChild(activityToRemove);
}




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
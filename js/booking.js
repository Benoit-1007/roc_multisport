'use strict';

document.addEventListener('DOMContentLoaded', function () {

    // VARIABLES
    let bookingForm = document.querySelector('#bookingForm');

    let select = bookingForm.querySelectorAll('.selector');
    console.log("🚀 select", select)

    let singleActivityFieldset = bookingForm.querySelector('#singleActivity');

    let rocCocktailFieldset = bookingForm.querySelector('#rocCocktail');
    
    let activitiesbtn = document.querySelectorAll('#formulaSelector button');

    let singleActivityBtn = bookingForm.querySelector('#singleActivityButton');

    let rocCocktailBtn = bookingForm.querySelector('#rocCocktailButton');

    let returnBtn = bookingForm.querySelector('#returnButton');

    let addActivityBtn = bookingForm.querySelector('#addActivityButton');

    let singleActivityBasket = booking.querySelector('.singleActivityBasket_1');

    let rocActivityBasket = booking.querySelector('.rocActivityBasket_1');

    let validateReservationBtn = bookingForm.querySelector('#validateReservation');

    //Choose between single activity or cocktail ROC
    chooseFormula(activitiesbtn);
    
    //add a new single activity
    addActivityBtn.addEventListener('click', addActivity);
    


    
    //VERIF RECUPERATION INPUTS
    validateReservationBtn.addEventListener('click', function (e) {
        let inputs = bookingForm.querySelectorAll('.field');
        e.preventDefault();
        inputs.forEach(input => {
            console.log(input.name);
        });
    })



    //FUNCTIONS

    /** display div singleActivity + returnButton or div rocCocktail + returnButton or singleActivityButton + rocCocktailButton
    * @param {NodeList} buttons singleActivityButton, rocCocktailButton, returnButton
    */
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
                        singleActivityBasket.classList.remove("hide");
                        chooseActivity(select);
                        break;
                    case "rocCocktailButton":
                        singleActivityBtn.classList.add('hide');
                        rocCocktailBtn.classList.add('hide');
                        returnBtn.classList.remove('hide');
                        rocCocktailFieldset.classList.remove("hide");
                        rocActivityBasket.classList.remove("hide");
                        chooseRocFormula(select);
                        break;
                    default:
                        singleActivityBtn.classList.remove('hide');
                        rocCocktailBtn.classList.remove('hide');
                        returnBtn.classList.add('hide');
                        singleActivityFieldset.classList.add("hide");
                        rocCocktailFieldset.classList.add("hide");
                        singleActivityBasket.classList.add("hide");
                        rocActivityBasket.classList.add("hide");
                        break;
                }
            })
        }
    }

    /** Update form booking elements(min & max participants authorized, display input half day selector for half day activities, update div basket) according to chosen activity
     * @param {NodeList} field All inputs select
     */
    function chooseActivity(field) {

        for (let i = 0; i < field.length; i++) {

            const element = field[i];

            element.addEventListener('change', function () {
                //get activity
                let activity = element.getAttribute('name');
                console.log("🚀activity", activity)
                //get activity number
                let activityNumber = activity.replace(/\D/g,'');
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
                console.log("🚀 activityDuration", activityDuration)
                //get min numberparticipants
                let numberMinParticipants = Number(this.options[element.selectedIndex].getAttribute('data-minParticipants'));
                console.log("🚀 numberMinParticipants", numberMinParticipants)
                //get max numberparticipants
                let numberMaxParticipants = Number(this.options[element.selectedIndex].getAttribute('data-maxParticipants'));
                console.log("🚀 numberMaxParticipants", numberMaxParticipants)
                //get period (display available dates according to chosen activity)
                let activityPeriod = this.options[element.selectedIndex].getAttribute('data-period')
                console.log("🚀 activityPeriod", activityPeriod)
                //get input date
                let dateSelector = document.querySelector(`input[name="date_activity_` + activityNumber + `"]`);
                console.log("🚀 dateSelector", dateSelector)
                //get input numberparticipants
                let participantsNumberSelector = document.querySelector(`input[name="participantsCount_activity_` + activityNumber + `"]`);
                console.log("🚀 participantsNumberSelector", participantsNumberSelector);
                //get div current activity
                let currentActivity = document.querySelector('.activity_' + activityNumber);
                console.log("🚀 currentActivity", currentActivity)


                participantsNumberSelector.setAttribute('min', numberMinParticipants);
                participantsNumberSelector.setAttribute('max', numberMaxParticipants);

                participantsNumberSelector.value = numberMinParticipants;

                displayAvailableDates(activityPeriod, dateSelector);

                document.querySelector('.name_singleActivityBasket_' + activityNumber).innerHTML = activityName;
                document.querySelector('.participantsCount_singleActivityBasket_' + activityNumber).innerHTML = `${participantsNumberSelector.value}x`;
                document.querySelector('.price_singleActivityBasket_' + activityNumber).innerHTML = `${price}€`;
                document.querySelector('.total_singleActivityBasket_' + activityNumber).innerHTML = Number(participantsNumberSelector.value * price) +'€';
                document.querySelector('.totalPrice').innerHTML = Number(document.querySelector('.totalPrice').textContent.replace(/\D/g,'')) + Number(participantsNumberSelector.value * price) +'€';

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
                displayParticipants(activity, numberMinParticipants);

                validateParticipantsNumber(activity, participantsNumberSelector)

                // participantsNumberSelector.addEventListener('focusout', function(){

                //     let newParticipantsNumber;

                //     if (Math.floor(participantsNumberSelector.value) < participantsNumberSelector.min) {

                //         console.log('test min');
                //         participantsNumberSelector.value = participantsNumberSelector.min;
                //         console.log("🚀 participantsNumberSelector.value", participantsNumberSelector.value)
                //         newParticipantsNumber = participantsNumberSelector.value
                //         console.log("🚀 newParticipantsNumber", newParticipantsNumber)

                //     } else if (Math.floor(participantsNumberSelector.value) > participantsNumberSelector.max) {

                //         console.log('test max');
                //         participantsNumberSelector.value = participantsNumberSelector.max;
                //         newParticipantsNumber = participantsNumberSelector.max;

                //     } else {

                //         newParticipantsNumber = participantsNumberSelector.value;
                //     }

                //     displayParticipants(activity, newParticipantsNumber);
                // })

                // participantsNumberSelector.addEventListener('click', function(){

                //     let newParticipantsNumber;

                //     if (Math.floor(participantsNumberSelector.value) < participantsNumberSelector.min) {

                //         console.log('test min');
                //         participantsNumberSelector.value = participantsNumberSelector.min;
                //         console.log("🚀 participantsNumberSelector.value", participantsNumberSelector.value)
                //         newParticipantsNumber = participantsNumberSelector.value
                //         console.log("🚀 newParticipantsNumber", newParticipantsNumber)

                //     } else if (Math.floor(participantsNumberSelector.value) > participantsNumberSelector.max) {

                //         console.log('test max');
                //         participantsNumberSelector.value = participantsNumberSelector.max;
                //         newParticipantsNumber = participantsNumberSelector.max;

                //     } else {

                //         newParticipantsNumber = participantsNumberSelector.value;
                //     }

                //     displayParticipants(activity, newParticipantsNumber);

                    
                //     // let newParticipantsNumber = participantsNumberSelector.value;
                //     // displayParticipants(activity, newParticipantsNumber);
                // })
            })
        }
    }

    /**
     * 
     * @param {*} currentActivity name of current activity
     * @param {*} inputParticipantsNumberSelector input participants number selector of current activity
     */
    function validateParticipantsNumber(currentActivity, inputParticipantsNumberSelector){
        inputParticipantsNumberSelector.addEventListener('focusout', function(){

            let newParticipantsNumber;

            if (Math.floor(inputParticipantsNumberSelector.value) < inputParticipantsNumberSelector.min) {

                console.log('test min');
                inputParticipantsNumberSelector.value = inputParticipantsNumberSelector.min;
                console.log("🚀 inputParticipantsNumberSelector.value", inputParticipantsNumberSelector.value)
                newParticipantsNumber = inputParticipantsNumberSelector.value
                console.log("🚀 newParticipantsNumber", newParticipantsNumber)

            } else if (Math.floor(inputParticipantsNumberSelector.value) > inputParticipantsNumberSelector.max) {

                console.log('test max');
                inputParticipantsNumberSelector.value = inputParticipantsNumberSelector.max;
                newParticipantsNumber = inputParticipantsNumberSelector.max;

            } else {

                newParticipantsNumber = inputParticipantsNumberSelector.value;
            }

            displayParticipants(currentActivity, newParticipantsNumber);
        })

        inputParticipantsNumberSelector.addEventListener('click', function(){

            let newParticipantsNumber;

            if (Math.floor(inputParticipantsNumberSelector.value) < inputParticipantsNumberSelector.min) {

                console.log('test min');
                inputParticipantsNumberSelector.value = inputParticipantsNumberSelector.min;
                console.log("🚀 inputParticipantsNumberSelector.value", inputParticipantsNumberSelector.value)
                newParticipantsNumber = inputParticipantsNumberSelector.value
                console.log("🚀 newParticipantsNumber", newParticipantsNumber)

            } else if (Math.floor(inputParticipantsNumberSelector.value) > inputParticipantsNumberSelector.max) {

                console.log('test max');
                inputParticipantsNumberSelector.value = inputParticipantsNumberSelector.max;
                newParticipantsNumber = inputParticipantsNumberSelector.max;

            } else {

                newParticipantsNumber = inputParticipantsNumberSelector.value;
            }

            displayParticipants(currentActivity, newParticipantsNumber);

        })

    }


    /** display input half day selector according to chosen activity
     * @param {*} numActivity number of current activity (1, 2, ...)
     * @param {*} divActivity div of current activity
     * @param {*} inputParticipantsNumberSelector input participants number selector of current activity
     */
    function addHalfDaySelector(numActivity, divActivity, inputParticipantsNumberSelector) {
        let halfDaySelector = document.createElement('select');
        halfDaySelector.classList.add('activity_' + numActivity + '_halfDaySelector')
        halfDaySelector.innerHTML = `
        <option value='morning'>Matin</option>
        <option value='afternoon'>Après-midi</option>
        `;
        divActivity.insertBefore(halfDaySelector, inputParticipantsNumberSelector);
    }
    
    /** remove input half day selector according to chosen activity
     * @param {*} numActivity number of current activity (1, 2, ...)
     */
    function removeHalfDaySelector(numActivity) {
        //get half day selector to remove
        let halfDaySelectorToRemove = document.querySelector('.activity_' + numActivity + '_halfDaySelector');
        //remove half day selector
        document.querySelector('.activity_' + numActivity).removeChild(halfDaySelectorToRemove);
    }

    /**display number of div activity_participant_X according to number of participants selected for current activity
     * @param {*} numActivity number of current activity (1, 2, ...)
     * @param {*} numberOfParticipants number of participants selected
     */
    function displayParticipants(currentActivity, numberOfParticipants){
        let participantsField = document.querySelector('.' + currentActivity + '_participantsList');
        console.log("🚀 ~ file: booking.js ~ line 323 ~ displayParticipants ~ participantsField", participantsField)
        let currentParticipantsNumber = document.querySelectorAll(`div[class*="` + currentActivity + `_participant_"]`).length;
        let differenceParticipants = numberOfParticipants-currentParticipantsNumber;
        console.log("🚀 ~ file: booking.js ~ line 225 ~ differenceParticipants", differenceParticipants)
        if(differenceParticipants > 0){
            for (let i = 0; i < differenceParticipants; i++) {
                let currentParticipant = currentParticipantsNumber+i+1;
                let newParticipant = document.createElement('div');
                newParticipant.classList.add(currentActivity + '_participant_'+ currentParticipant)
                newParticipant.innerHTML = ` 
                    <input class="field" type="text" name="firstName_` + currentActivity + `_participant_` + currentParticipant + `" required placeholder="Nom*">
                    <input class="field" type="text" name="lastName_` + currentActivity + `_participant_` + currentParticipant + `" required placeholder="Prénom*">
                    <input class="field" type="text" name="birthdate_` + currentActivity + `_participant_` + currentParticipant + `" required placeholder="Date de naissance* (jj/mm/aaaa)">
                    <input class="field" type="number" name="size_` + currentActivity + `_participant_` + currentParticipant + `" required placeholder="Taille (cm)*">
                    <select class="field" name="level_` + currentActivity + `_participant_` + currentParticipant + `">
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
                let participantToRemove = document.querySelector('.' + currentActivity + '_participant_'+ (currentParticipantsNumber-i));
                participantsField.removeChild(participantToRemove);
            }
        }
    };

    /** display available dates according to chosen activity
     * @param {*} periodCurrentActivity available period of current activity
     * @param {*} inputDateSelectorCurrentActivity input date selector of current activity
     */
    function displayAvailableDates(periodCurrentActivity, inputDateSelectorCurrentActivity){
        if(periodCurrentActivity === "april/october"){
            inputDateSelectorCurrentActivity.setAttribute('min', new Date().getFullYear() + '-04-01');
            inputDateSelectorCurrentActivity.setAttribute('max', new Date().getFullYear() + '-10-31');
        } else if(periodCurrentActivity === "may/october"){
            inputDateSelectorCurrentActivity.setAttribute('min', new Date().getFullYear() + '-05-01');
            inputDateSelectorCurrentActivity.setAttribute('max', new Date().getFullYear() + '-10-31');
        } else {
            inputDateSelectorCurrentActivity.setAttribute('min', new Date().getFullYear() + '-12-15');
            inputDateSelectorCurrentActivity.setAttribute('max', new Date().getFullYear()+1 + '-04-30');
        }
    };

    /** display new div activityItem in div singleActivity
     */
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
                        <option value="bikeHalfDayNoLoc" name="VTTAE sans location VTT - 1/2 journée" data-price="45" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="april/october">VTTAE sans location VTT - 1/2 journée - 45€/pers.</option>
                        <option value="bikeAllDayNoLoc" name="VTTAE sans location VTT - journée" data-price="80" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="april/october">VTTAE sans location VTT - journée - 80€/pers.</option>
                        <option value="bikeHalfDay" name="VTTAE avec location VTT - 1/2 journée" data-price="80" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="april/october">VTTAE avec location VTT - 1/2 journée - 80€/pers.</option>
                        <option value="bikeAllDay" name="VTTAE avec location VTT - journée" data-price="130" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="april/october">VTTAE avec location VTT - journée - 130€/pers.</option>
                    </optogroup> 
                    <optogroup label="paddle">
                        <option value="paddleHalfDay" name="Paddle - 1/2 journée" data-price="55" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Paddle - 1/2 journée - 55€/pers.</option>
                        <option value="paddleAllDay" name="Paddle - journée" data-price="100" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="may/october">Paddle - journée - 100€/pers.</option>
                        <option value="kayak" name="Kayak - 1/2 journée" data-price="50" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Kayak - 1/2 journée - 50€/pers.</option>
                    </optogroup> 
                    <optogroup label="climbing">
                        <option value="climbingHalfDay" name="Escalade - 1/2 journée" data-price="50" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Escalade - 1/2 journée - 50€/pers.</option>
                        <option value="climbingAllDay" name="Escalade - journée" data-price="90" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="may/october">Escalade - journée - 90€/pers.</option>
                        <option value="viaHalfDay" name="Via Ferrata - 1/2 journée" data-price="60" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Via Ferrata - 1/2 journée - 60€/pers.</option>
                        <option value="viaAllDay" name="Via Ferrata - journée (2 via ferrata)" data-price="110" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="may/october">Via Ferrata - journée (2 via ferrata) - 110€/pers.</option>
                        </optogroup> 
                    <optogroup label="archery">
                        <option value="archery" name="Tir à l'arc - 1/2 journée" data-price="50" data-minParticipants="6" data-maxParticipants="12" data-duration="halfDay" data-period="may/october">Tir à l'arc - 1/2 journée - 50€/pers.</option>
                    </optogroup> 
                    <optogroup label="snowboard">
                        <option value="snowboardRookeasy" name="Rookeasy - 3 x 1/2 journée (débutant snow)" data-price="180" data-minParticipants="3" data-maxParticipants="8" data-duration="threeHalfDay" data-period="december-april">Rookeasy - 3 x 1/2 journée (débutant snow) - 180€/pers.</option>
                        <option value="snowboardHalfDay" name="Snowboard - 1/2 journée" data-price="160" data-minParticipants="2" data-maxParticipants="8" data-duration="halfDay" data-period="december-april">Snowboard - 1/2 journée - 160€/pers.</option>
                        <option value="snowboardAllDay" name="Snowboard - journée" data-price="330" data-minParticipants="2" data-maxParticipants="8" data-duration="allDay" data-period="december-april">Snowboard - journée - 300€/pers.</option>
                        <option value="splitboardHalfDay" name="Splitboard - 1/2 journée" data-price="180" data-minParticipants="4" data-maxParticipants="6" data-duration="halfDay" data-period="december-april">Splitboard - 1/2 journée - 180€/pers.</option>
                        <option value="splitboarAllfDay" name="Splitboard - journée" data-price="330" data-minParticipants="4" data-maxParticipants="6" data-duration="allDay" data-period="december-april">Splitboard - journée - 330€/pers.</option>
                    </optogroup> 
                </select>
                <input class="field" type="date" name="date_activity_`+ x + `">
                <input class="field" type="number" name="participantsCount_activity_`+ x + `" placeholder="Nombre de participants" min="2" max="12">
            </div>
            <div class="activity_`+ x + `_participantsList">
                <p>Participants activité `+ x + `</p>
            </div>
            `;

            //append newActivity to button
            document.querySelector('.activities').appendChild(newActivity);


            let newSingleActivityBasket = document.createElement('tr');
            newSingleActivityBasket.classList.add('singleActivityBasket_'+ x);
            newSingleActivityBasket.innerHTML=`
                <td class="name_singleActivityBasket_`+ x + `"></td>
                <td class="participantsCount_singleActivityBasket_`+ x + `"></td>
                <td class="price_singleActivityBasket_`+ x + `"></td>
                <td class="total_singleActivityBasket_`+ x + `"></td>
            `;

            document.querySelector('tbody').appendChild(newSingleActivityBasket);




        let select = document.querySelectorAll('.selector');
        console.log("🚀select", select);

        chooseActivity(select);

    }

    function chooseRocFormula(field) {
        console.log("🚀 field", field)
        console.log('enter roc function');
        
        
        for (let i = 0; i < field.length; i++) {

            const element = field[i];

            element.addEventListener('change', function () {
                //get activity (for display participants)
                let activity = document.querySelector('#rocCocktail').id;
                console.log("🚀activity", activity)
                //get div rocCocktailActivities (for add activity)
                let rocCocktailActivities = document.querySelector('.rocCocktailActivities');
                console.log("🚀 rocCocktailActivities", rocCocktailActivities)
                //get formula value (day or week-end)
                let formulaValue = this.options[element.selectedIndex].getAttribute('value');
                console.log("🚀 formulaValue", formulaValue);
                //get min numberparticipants
                let numberMinParticipants = Number(this.options[element.selectedIndex].getAttribute('data-minParticipants'));
                console.log("🚀 numberMinParticipants", numberMinParticipants)
                //get input numberparticipants
                let participantsNumberSelector = document.querySelector(`input[name="participantsCount_rocActivity"]`);
                console.log("🚀 numberParticipantsSelector", participantsNumberSelector);
                //get div myRocActivities
                let myRocActivities = document.querySelector('.myRocActivities');

                participantsNumberSelector.value = numberMinParticipants;

                
                switch(formulaValue){
                    case "cocktailOneDay":
                        reset(myRocActivities);
                        addHalfDayActivity(myRocActivities);

                        let currentRocActivity = document.querySelector(`select[name='rocActivity_1']`);
                        console.log("🚀 currentRocActivity", currentRocActivity)
                        currentRocActivity.addEventListener('change', function () {
                            addHalfDayActivity(myRocActivities);
                            let activity1 = document.querySelector('.rocActivity_1 select');
                            console.log("🚀 ~ file: booking.js ~ line 428 ~ activity1", activity1)
                            let activityToHide = activity1.value;
                            console.log("🚀 ~ file: booking.js ~ line 429 ~ activityToHide", activityToHide)
                            let options = document.querySelectorAll('.rocActivity_2 option');
                            options.forEach(option => {
                                if(option.value === activityToHide){
                                    option.classList.add('hide');
                                } else {
                                    option.classList.remove('hide');
                                }
                            })
                        })
                        break;
                    default:
                        reset(myRocActivities);
                        addAllActivities(myRocActivities);


                        break;
                }
                        
                displayParticipants(activity, numberMinParticipants);

                participantsNumberSelector.addEventListener('keyup', function(){
                    let newParticipantsNumber;
                    if (Math.floor(participantsNumberSelector.value) < participantsNumberSelector.min) {
                        console.log('test min');
                        participantsNumberSelector.value = participantsNumberSelector.min;
                        console.log("🚀  participantsNumberSelector.value", participantsNumberSelector.value)
                        newParticipantsNumber = participantsNumberSelector.value
                        console.log("🚀  newParticipantsNumber", newParticipantsNumber)
                        displayParticipants(activity, newParticipantsNumber);
                    } else if (Math.floor(participantsNumberSelector.value) > participantsNumberSelector.max) {
                        console.log('test max');
                        newParticipantsNumber = participantsNumberSelector.max;
                        displayParticipants(activity, newParticipantsNumber);
                    } else {
                        newParticipantsNumber = participantsNumberSelector.value;
                        displayParticipants(activity, newParticipantsNumber);
                    }
                })

                participantsNumberSelector.addEventListener('click', function(){
                    let newParticipantsNumber = participantsNumberSelector.value;
                    console.log("🚀 newParticipantsNumber", newParticipantsNumber)
                    displayParticipants(activity, newParticipantsNumber);
                })

                
                
            })
        }    
    }

    /** remove HTML element content
     * @param {HTMLElement} 
     */
    function reset(HTMLElement){
        console.log('test reset');
        HTMLElement.innerHTML='';
        }

    // ADD ROC ACTIVITY
    function addHalfDayActivity(divMyRocActivities) {
        if(document.querySelector('.rocActivity_1') === null){
            let newRocActivity = document.createElement('div');
            newRocActivity.classList.add('rocActivity_1');
            newRocActivity.innerHTML = `
            <p>Activité 1</p>
                    <select class="field selector" name="rocActivity_1">
                        <option value="">Séléctionnez votre activité 1</option>
                        <optogroup label="bike"> 
                            <option value="bikeHalfDayNoLoc" name="VTTAE sans location VTT - 1/2 journée" data-price="45">VTTAE sans location VTT - 1/2 journée - 45€/pers.</option>
                            <option value="bikeHalfDay" name="VTTAE avec location VTT - 1/2 journée" data-price="80">VTTAE avec location VTT - 1/2 journée - 80€/pers.</option>
                        </optogroup> 
                        <optogroup label="paddle">
                            <option value="paddleHalfDay" name="Paddle - 1/2 journée" data-price="55">Paddle - 1/2 journée - 55€/pers.</option>
                            <option value="kayak" name="Kayak - 1/2 journée" data-price="50">Kayak - 1/2 journée - 50€/pers.</option>
                        </optogroup> 
                        <optogroup label="climbing">
                            <option value="climbingHalfDay" name="Escalade - 1/2 journée" data-price="50">Escalade - 1/2 journée - 50€/pers.</option>
                            <option value="viaHalfDay" name="Via Ferrata - 1/2 journée" data-price="60">Via Ferrata - 1/2 journée - 60€/pers.</option>
                            </optogroup> 
                        <optogroup label="archery">
                            <option value="archery" name="Tir à l'arc - 1/2 journée" data-price="50">Tir à l'arc - 1/2 journée - 50€/pers.</option>
                        </optogroup> 
                    </select>
            `;
            divMyRocActivities.appendChild(newRocActivity);
            
        } else {
            if(document.querySelector('.rocActivity_2') === null){
                let newRocActivity = document.createElement('div');
                newRocActivity.classList.add('rocActivity_2');
                newRocActivity.innerHTML = `
                <p>Activité 2</p>
                        <select class="field selector" name="rocActivity_2">
                            <option value="">Séléctionnez votre activité 2</option>
                            <optogroup label="bike"> 
                                <option value="bikeHalfDayNoLoc" name="VTTAE sans location VTT - 1/2 journée" data-price="45">VTTAE sans location VTT - 1/2 journée - 45€/pers.</option>
                                <option value="bikeHalfDay" name="VTTAE avec location VTT - 1/2 journée" data-price="80">VTTAE avec location VTT - 1/2 journée - 80€/pers.</option>
                            </optogroup> 
                            <optogroup label="paddle">
                                <option value="paddleHalfDay" name="Paddle - 1/2 journée" data-price="55">Paddle - 1/2 journée - 55€/pers.</option>
                                <option value="kayak" name="Kayak - 1/2 journée" data-price="50">Kayak - 1/2 journée - 50€/pers.</option>
                            </optogroup> 
                            <optogroup label="climbing">
                                <option value="climbingHalfDay" name="Escalade - 1/2 journée" data-price="50">Escalade - 1/2 journée - 50€/pers.</option>
                                <option value="viaHalfDay" name="Via Ferrata - 1/2 journée" data-price="60">Via Ferrata - 1/2 journée - 60€/pers.</option>
                                </optogroup> 
                            <optogroup label="archery">
                                <option value="archery" name="Tir à l'arc - 1/2 journée" data-price="50">Tir à l'arc - 1/2 journée - 50€/pers.</option>
                            </optogroup> 
                        </select>
                `;

                divMyRocActivities.appendChild(newRocActivity);
            };
        }
    };

    function addAllActivities(divMyRocActivities) {
        for (let i = 0; i < 4; i++) {
            let x = i+1;
            let newRocActivity = document.createElement('div');
                newRocActivity.innerHTML = `
                <p>Activité ` + x + `</p>
                <select class="field selector" name="rocActivity_` + x + `">
                    <option value="">Séléctionnez votre activité ` + x + `</option>
                    <optogroup label="bike"> 
                        <option value="bikeHalfDayNoLoc" name="VTTAE sans location VTT - 1/2 journée" data-price="45" data-duration="halfDay">VTTAE sans location VTT - 1/2 journée</option>
                        <option value="bikeAllDayNoLoc" name="VTTAE sans location VTT - journée" data-price="80" data-duration="allDay">VTTAE sans location VTT - journée</option>
                        <option value="bikeHalfDay" name="VTTAE avec location VTT - 1/2 journée" data-price="80" data-duration="halfDay">VTTAE avec location VTT - 1/2 journée</option>
                        <option value="bikeAllDay" name="VTTAE avec location VTT - journée" data-price="130" data-duration="allDay">VTTAE avec location VTT - journée</option>
                    </optogroup> 
                    <optogroup label="paddle">
                        <option value="paddleHalfDay" name="Paddle - 1/2 journée" data-price="55" data-duration="halfDay">Paddle - 1/2 journée</option>
                        <option value="paddleAllDay" name="Paddle - journée" data-price="100" data-duration="allDay">Paddle - journée</option>
                        <option value="kayak" name="Kayak - 1/2 journée" data-price="50" data-duration="halfDay">Kayak - 1/2 journée</option>
                    </optogroup> 
                    <optogroup label="climbing">
                        <option value="climbingHalfDay" name="Escalade - 1/2 journée" data-price="50" data-duration="halfDay">Escalade - 1/2 journée</option>
                        <option value="climbingAllDay" name="Escalade - journée" data-price="90" data-duration="allDay">Escalade - journée</option>
                        <option value="viaHalfDay" name="Via Ferrata - 1/2 journée" data-price="60" data-duration="halfDay">Via Ferrata - 1/2 journée</option>
                        <option value="viaAllDay" name="Via Ferrata - journée (2 via ferrata)" data-price="110" data-duration="allDay">Via Ferrata - journée (2 via ferrata)</option>
                        </optogroup> 
                        <optogroup label="archery">
                        <option value="archery" name="Tir à l'arc - 1/2 journée" data-price="50" data-duration="halfDay">Tir à l'arc - 1/2 journée</option>
                    </optogroup> 
                    <optogroup label="snowboard">
                        <option value="snowboardHalfDay" name="Snowboard - 1/2 journée" data-price="160">Snowboard - 1/2 journée</option>
                        <option value="snowboarAllfDay" name="Snowboard - journée" data-price="330" data-duration="allDay">Snowboard - journée</option>
                        <option value="splitboardHalfDay" name="Splitboard - 1/2 journée" data-price="180">Splitboard - 1/2 journée</option>
                        <option value="splitboardAllDay" name="Splitboard - journée" data-price="330" data-duration="allDay">Splitboard - journée</option>
                    </optogroup> 
                `;

            divMyRocActivities.appendChild(newRocActivity);
        };
    }

    // function updateBasket()


});


// REMOVE ROC ACTIVITY
function removeRocActivity() {
    //get activity to remove
    let activityToRemove = document.querySelector(".activity_" + activityNumber + "_rocActivityItem")
    //remove activity
    document.querySelector(`.activity_` + activityNumber).removeChild(activityToRemove);
}

'use strict';

// imports
import Errors from './Errors.js';
import * as menu from './menu.js';

// use by basket function
const bookingData = [
    { 'value': 'bikeAllDayNoLoc', 'name': 'VTTAE sans location VTT - journée', 'price': '80' },
    { 'value': 'bikeHalfDayNoLoc', 'name': 'VTTAE sans location VTT - 1/2 journée', 'price': '45' },
    { 'value': 'bikeHalfDay', 'name': 'VTTAE avec location VTT - 1/2 journée', 'price': '80' },
    { 'value': 'bikeAllDay', 'name': 'VTTAE avec location VTT - journée', 'price': '130' },
    { 'value': 'paddleHalfDay', 'name': 'Paddle - 1/2 journée', 'price': '55' },
    { 'value': 'paddleAllDay', 'name': 'Paddle - journée', 'price': '100' },
    { 'value': 'kayak', 'name': 'Kayak - 1/2 journée', 'price': '50' },
    { 'value': 'climbingHalfDay', 'name': 'Escalade - 1/2 journée', 'price': '50' },
    { 'value': 'climbingAllDay', 'name': 'Escalade - journée', 'price': '90' },
    { 'value': 'viaHalfDay', 'name': 'Via Ferrata - 1/2 journée', 'price': '60' },
    { 'value': 'viaAllDay', 'name': 'Via Ferrata - journée (2 via ferrata)', 'price': '110' },
    { 'value': 'archery', 'name': 'Tir à l\'arc - 1/2 journée', 'price': '50' },
    { 'value': 'snowboardRookeasy', 'name': 'Rookeasy - 3 x 1/2 journée (débutant snow)', 'price': '180' },
    { 'value': 'snowboardHalfDay', 'name': 'Snowboard - 1/2 journée', 'price': '160' },
    { 'value': 'snowboardAllDay', 'name': 'Snowboard - journée', 'price': '330' },
    { 'value': 'splitboardHalfDay', 'name': 'Splitboard - 1/2 journée', 'price': '180' },
    { 'value': 'splitboardAllDay', 'name': 'Splitboard - journée', 'price': '330' },
    { 'value': 'cocktailOneDay', 'name': 'ROC DAY (10% de remise sur vos activités)' },
    { 'value': 'cocktailTwoDay', 'name': 'ROC WEEK-END (15% de remise sur vos activités)' }

];

document.addEventListener('DOMContentLoaded', function () {
    // VARIABLES
    let bookingForm = document.querySelector('#bookingForm');

    // let select = bookingForm.querySelectorAll('.selector');
    let singleActivitySelector = bookingForm.querySelectorAll('.singleActivitySelector');

    let singleActivityFieldset = bookingForm.querySelector('#singleActivity');

    let rocCocktailFieldset = bookingForm.querySelector('#rocCocktail');

    let rocFormulaSelector = bookingForm.querySelector('.rocFormulaSelector');

    let myRocActivities = booking.querySelector('.myRocActivities');

    let activitiesbtn = document.querySelectorAll('.formulaSelector button');

    let singleActivityBtn = bookingForm.querySelector('#singleActivityButton');

    let rocCocktailBtn = bookingForm.querySelector('#rocCocktailButton');

    let returnBtn = bookingForm.querySelector('#returnButton');

    let addActivityBtn = bookingForm.querySelector('#addActivityButton');

    let deletActivityBtn = bookingForm.querySelector('#deletActivityButton');

    let validateReservationBtn = bookingForm.querySelector('#validateReservation');

    // menu management for mobile phone 
    menu.toggleMenu();

    // Choose between single activity or cocktail ROC
    chooseFormula(activitiesbtn);

    // add a new single activity
    addActivityBtn.addEventListener('click', addActivity);

    // remove a new single activity
    deletActivityBtn.addEventListener('click', removeActivity);

    // validate form
    validateReservationBtn.addEventListener('click', function(e) {

        e.preventDefault();
        
        let inputs = bookingForm.querySelectorAll('.field');

        checkValues(inputs);
        
    });

    // SELECTION FUNCTIONS

    /** display div singleActivity + returnButton or div rocCocktail + returnButton or singleActivityButton + rocCocktailButton
    * @param {NodeList} buttons singleActivityButton, rocCocktailButton, returnButton
    */
    function chooseFormula(buttons) {
        for (let i = 0; i < buttons.length; i++) {
            const btn = buttons[i];

            btn.addEventListener('click', function () {
                let currentBtn = btn.id;

                switch (currentBtn) {
                    case "singleActivityButton":
                        singleActivityBtn.classList.add('hide');
                        rocCocktailBtn.classList.add('hide');
                        returnBtn.classList.remove('hide');
                        singleActivityFieldset.classList.remove("hide");
                        document.querySelector('.rocFormulaSelector').disabled = true;
                        document.querySelector('.rocDate').disabled = true;
                        document.querySelector('.rocParticipantsCount').disabled = true;
                        bookingForm.querySelectorAll(`[name*='activity_']`).forEach(element => {
                            element.setAttribute("required","required");
                        });
                        chooseActivity(singleActivitySelector);
                        break;
                    case "rocCocktailButton":
                        singleActivityBtn.classList.add('hide');
                        rocCocktailBtn.classList.add('hide');
                        returnBtn.classList.remove('hide');
                        rocCocktailFieldset.classList.remove("hide");
                        document.querySelector('.singleActivitySelector').disabled = true;
                        document.querySelector('.singleActivityDate').disabled = true;
                        document.querySelector('.singleActivityParticipantsCount').disabled = true;
                        bookingForm.querySelectorAll(`[name*='rocCocktail']`).forEach(element => {
                            element.setAttribute("required","required");
                        });
                        bookingForm.querySelectorAll(`[name*='rocActivity']`).forEach(element => {
                            element.setAttribute("required");
                        });
                        chooseRocFormula(rocFormulaSelector);
                        break;
                    default:
                        singleActivityBtn.classList.remove('hide');
                        rocCocktailBtn.classList.remove('hide');
                        returnBtn.classList.add('hide');
                        singleActivityFieldset.classList.add("hide");
                        document.querySelector('.singleActivitySelector').disabled = false;
                        document.querySelector('.singleActivityDate').disabled = false;
                        document.querySelector('.singleActivityParticipantsCount').disabled = false;
                        rocCocktailFieldset.classList.add("hide");
                        document.querySelector('.rocFormulaSelector').disabled = false;
                        document.querySelector('.rocDate').disabled = false;
                        document.querySelector('.rocParticipantsCount').disabled = false;
                        reset(myRocActivities);
                        let currentSelect = bookingForm.querySelectorAll(`[class*='Selector']`);
                        currentSelect.forEach(element => {
                            element.value = "empty"
                        });
                        bookingForm.querySelectorAll(`[name*='_activity']`).forEach(element => {
                            element.removeAttribute("required");
                        });
                        bookingForm.querySelectorAll(`[name*='rocCocktail']`).forEach(element => {
                            element.removeAttribute("required");
                        });
                        bookingForm.querySelectorAll(`[name*='rocActivity']`).forEach(element => {
                            element.removeAttribute("required");
                        });
                        updateBasket();
                        break;
                }
            })
        }
    }

    /** remove HTML element content
     * @param {HTMLElement} 
     */
    function reset(HTMLElement) {
        HTMLElement.innerHTML = '';
    }

    /** Update form booking elements(min & max participants authorized, display input half day selector for half day activities, update div basket) according to chosen activity
     * @param {NodeList} field All inputs select
     */
    function chooseActivity(selectors) {
        for (let i = 0; i < selectors.length; i++) {

            const selector = selectors[i];

            selector.addEventListener('change', function () {
                //get activity
                let activity = selector.getAttribute('name');
                //get activity number
                let activityNumber = activity.replace(/\D/g, '');
                //get activity duration
                let activityDuration = this.options[selector.selectedIndex].getAttribute('data-duration');
                //get min numberparticipants
                let numberMinParticipants = Number(this.options[selector.selectedIndex].getAttribute('data-minParticipants'));
                //get max numberparticipants
                let numberMaxParticipants = Number(this.options[selector.selectedIndex].getAttribute('data-maxParticipants'));
                //get period (display available dates according to chosen activity)
                let activityPeriod = this.options[selector.selectedIndex].getAttribute('data-period')
                //get input date
                let dateSelector = document.querySelector(`input[name="date_activity_` + activityNumber + `"]`);
                //get input numberparticipants
                let participantsNumberSelector = document.querySelector(`input[name="participantsCount_activity_` + activityNumber + `"]`);
                //get rookeasy message
                let rookeasyMessage = document.querySelector('.rookeasy');
                //get div current activity
                let currentActivity = document.querySelector('.activity_' + activityNumber);

                participantsNumberSelector.setAttribute('min', numberMinParticipants);
                participantsNumberSelector.setAttribute('max', numberMaxParticipants);

                participantsNumberSelector.value = numberMinParticipants;

                displayAvailableDates(activityPeriod, dateSelector);

                switch (activityDuration) {
                    case "halfDay":
                        if (!dateSelector.nextElementSibling.classList.contains('activity_' + activityNumber + '_halfDaySelector')) {
                            addHalfDaySelector(activityNumber, currentActivity, participantsNumberSelector);
                        }
                        if (!rookeasyMessage.classList.contains('hide')) {
                            rookeasyMessage.classList.add('hide');
                        }
                        break;
                    case "threeHalfDay":
                        rookeasyMessage.classList.remove('hide');
                        if (!dateSelector.nextElementSibling.classList.contains('activity_' + activityNumber + '_halfDaySelector')) {
                            addHalfDaySelector(activityNumber, currentActivity, participantsNumberSelector);
                        }
                        break;
                    default:
                        if (dateSelector.nextElementSibling.classList.contains('activity_' + activityNumber + '_halfDaySelector')) {
                            removeHalfDaySelector(activityNumber);
                        }
                        if (!rookeasyMessage.classList.contains('hide')) {
                            rookeasyMessage.classList.add('hide');
                        }
                        break;
                }
                displayParticipants(activity, numberMinParticipants);

                validateParticipantsNumber(activity, participantsNumberSelector)

            })
        }
    }

    /** check if number of participants selected is allowed
     * @param {*} currentActivity name of current activity
     * @param {*} inputParticipantsNumberSelector input participants number selector of current activity
     */
    function validateParticipantsNumber(currentActivity, inputParticipantsNumberSelector) {
        inputParticipantsNumberSelector.addEventListener('focusout', function () {

            let newParticipantsNumber;

            if (Math.floor(inputParticipantsNumberSelector.value) < inputParticipantsNumberSelector.min) {
                inputParticipantsNumberSelector.value = inputParticipantsNumberSelector.min;
                newParticipantsNumber = inputParticipantsNumberSelector.value
            } else if (Math.floor(inputParticipantsNumberSelector.value) > inputParticipantsNumberSelector.max) {
                inputParticipantsNumberSelector.value = inputParticipantsNumberSelector.max;
                newParticipantsNumber = inputParticipantsNumberSelector.max;
            } else {
                newParticipantsNumber = inputParticipantsNumberSelector.value;
            }

            displayParticipants(currentActivity, newParticipantsNumber);
        })

        inputParticipantsNumberSelector.addEventListener('click', function () {

            let newParticipantsNumber;

            if (Math.floor(inputParticipantsNumberSelector.value) < inputParticipantsNumberSelector.min) {
                inputParticipantsNumberSelector.value = inputParticipantsNumberSelector.min;
                newParticipantsNumber = inputParticipantsNumberSelector.value
            } else if (Math.floor(inputParticipantsNumberSelector.value) > inputParticipantsNumberSelector.max) {
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
        halfDaySelector.name = 'halfDaySelector' + '_activity_' + numActivity;
        halfDaySelector.classList.add('field');
        halfDaySelector.classList.add('activity_' + numActivity + '_halfDaySelector');
        halfDaySelector.innerHTML = `
        <option value='Matinée'>Matin</option>
        <option value='Après-midi'>Après-midi</option>
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

    /** display number of div activity_participant_X according to number of participants selected for current activity
     * @param {*} numActivity number of current activity (1, 2, ...)
     * @param {*} numberOfParticipants number of participants selected
     */
    function displayParticipants(currentActivity, numberOfParticipants) {
        let participantsField = document.querySelector('.' + currentActivity + '_participantsList');
        let currentParticipantsNumber = document.querySelectorAll(`div[class*="` + currentActivity + `_participant_"]`).length;
        let differenceParticipants = numberOfParticipants - currentParticipantsNumber;
        if (differenceParticipants > 0) {
            for (let i = 0; i < differenceParticipants; i++) {
                let currentParticipant = currentParticipantsNumber + i + 1;
                let newParticipant = document.createElement('div');
                newParticipant.classList.add(currentActivity + '_participant_' + currentParticipant);
                newParticipant.classList.add("participant"); // for css properties
                if (currentActivity !== 'rocCocktail') {
                    newParticipant.innerHTML = ` 
                        <input class="field" type="text" name="lastName_` + currentActivity + `_participant_` + currentParticipant + `" required placeholder="Nom*">
                        <input class="field" type="text" name="firstName_` + currentActivity + `_participant_` + currentParticipant + `" required placeholder="Prénom*">
                        <input class="field" type="text" name="birthdate_` + currentActivity + `_participant_` + currentParticipant + `" required placeholder="Date de naissance* (jj/mm/aaaa)">
                        <input class="field" type="text" name="size_` + currentActivity + `_participant_` + currentParticipant + `" required placeholder="Taille (cm)*">
                        <select class="field" name="level_` + currentActivity + `_participant_` + currentParticipant + `" required>
                            <option value="empty">Niveau*</option>
                            <option value="Débutant">Débutant</option>
                            <option value="Intermédiaire">Intermédiaire</option>
                            <option value="Confirmé">Confirmé</option>
                            <option value="Expert">Expert</option>
                        </select>
                    `;
                } else {
                    newParticipant.innerHTML = ` 
                        <input class="field" type="text" name="lastName_` + currentActivity + `_participant_` + currentParticipant + `" required placeholder="Nom*">
                        <input class="field" type="text" name="firstName_` + currentActivity + `_participant_` + currentParticipant + `" required placeholder="Prénom*">
                        <input class="field" type="text" name="birthdate_` + currentActivity + `_participant_` + currentParticipant + `" required placeholder="Date de naissance* (jj/mm/aaaa)">
                        <input class="field" type="text" name="size_` + currentActivity + `_participant_` + currentParticipant + `" required placeholder="Taille (cm)*">
                    `;
                }

                participantsField.appendChild(newParticipant);
            }

        } else if (differenceParticipants < 0) {
            for (let i = 0; i < Math.abs(differenceParticipants); i++) {
                let participantToRemove = document.querySelector('.' + currentActivity + '_participant_' + (currentParticipantsNumber - i));
                participantsField.removeChild(participantToRemove);
            }
        }
        updateBasket();
    };

    /** display available dates according to chosen activity
     * @param {*} periodCurrentActivity available period of current activity
     * @param {*} inputDateSelectorCurrentActivity input date selector of current activity
     */
    function displayAvailableDates(periodCurrentActivity, inputDateSelectorCurrentActivity) {
        if (periodCurrentActivity === "april/october") {
            inputDateSelectorCurrentActivity.setAttribute('min', new Date().getFullYear() + '-04-01');
            inputDateSelectorCurrentActivity.setAttribute('max', new Date().getFullYear() + '-10-31');
        } else if (periodCurrentActivity === "may/october") {
            inputDateSelectorCurrentActivity.setAttribute('min', new Date().getFullYear() + '-05-01');
            inputDateSelectorCurrentActivity.setAttribute('max', new Date().getFullYear() + '-10-31');
        } else {
            inputDateSelectorCurrentActivity.setAttribute('min', new Date().getFullYear() + '-12-15');
            inputDateSelectorCurrentActivity.setAttribute('max', new Date().getFullYear() + 1 + '-04-30');
        }
    };

    /** display new div activityItem in div singleActivity */
    function addActivity() {
        let x = document.querySelector('.activities').childElementCount + 1;

        let newActivity = document.createElement('div');
        newActivity.classList.add('activityItem_' + x);

        newActivity.innerHTML = `
            <div class="activity_`+ x + `">
                <p>Activité `+ x + `</p>
                <select class="field singleActivitySelector" name="activity_`+ x + `">
                    <option value="">Séléctionnez votre activité `+ x + `</option>
                    <option value="bikeHalfDayNoLoc" name="VTTAE sans location VTT - 1/2 journée" data-price="45" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="april/october">VTTAE sans location VTT - 1/2 journée - 45€/pers.</option>
                    <option value="bikeAllDayNoLoc" name="VTTAE sans location VTT - journée" data-price="80" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="april/october">VTTAE sans location VTT - journée - 80€/pers.</option>
                    <option value="bikeHalfDay" name="VTTAE avec location VTT - 1/2 journée" data-price="80" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="april/october">VTTAE avec location VTT - 1/2 journée - 80€/pers.</option>
                    <option value="bikeAllDay" name="VTTAE avec location VTT - journée" data-price="130" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="april/october">VTTAE avec location VTT - journée - 130€/pers.</option>
                    <option value="paddleHalfDay" name="Paddle - 1/2 journée" data-price="55" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Paddle - 1/2 journée - 55€/pers.</option>
                    <option value="paddleAllDay" name="Paddle - journée" data-price="100" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="may/october">Paddle - journée - 100€/pers.</option>
                    <option value="kayak" name="Kayak - 1/2 journée" data-price="50" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Kayak - 1/2 journée - 50€/pers.</option>
                    <option value="climbingHalfDay" name="Escalade - 1/2 journée" data-price="50" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Escalade - 1/2 journée - 50€/pers.</option>
                    <option value="climbingAllDay" name="Escalade - journée" data-price="90" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="may/october">Escalade - journée - 90€/pers.</option>
                    <option value="viaHalfDay" name="Via Ferrata - 1/2 journée" data-price="60" data-minParticipants="4" data-maxParticipants="8" data-duration="halfDay" data-period="may/october">Via Ferrata - 1/2 journée - 60€/pers.</option>
                    <option value="viaAllDay" name="Via Ferrata - journée (2 via ferrata)" data-price="110" data-minParticipants="4" data-maxParticipants="8" data-duration="allDay" data-period="may/october">Via Ferrata - journée (2 via ferrata) - 110€/pers.</option>
                    <option value="archery" name="Tir à l'arc - 1/2 journée" data-price="50" data-minParticipants="6" data-maxParticipants="12" data-duration="halfDay" data-period="may/october">Tir à l'arc - 1/2 journée - 50€/pers.</option>
                    <option value="snowboardRookeasy" name="Rookeasy - 3 x 1/2 journée (débutant snow)" data-price="180" data-minParticipants="1" data-maxParticipants="8" data-duration="threeHalfDay" data-period="december-april">Rookeasy - 3 x 1/2 journée (débutant snow) - 180€/pers.</option>
                    <option value="snowboardHalfDay" name="Snowboard - 1/2 journée" data-price="160" data-minParticipants="2" data-maxParticipants="8" data-duration="halfDay" data-period="december-april">Snowboard - 1/2 journée - 160€/pers.</option>
                    <option value="snowboardAllDay" name="Snowboard - journée" data-price="330" data-minParticipants="2" data-maxParticipants="8" data-duration="allDay" data-period="december-april">Snowboard - journée - 300€/pers.</option>
                    <option value="splitboardHalfDay" name="Splitboard - 1/2 journée" data-price="180" data-minParticipants="2" data-maxParticipants="6" data-duration="halfDay" data-period="december-april">Splitboard - 1/2 journée - 180€/pers.</option>
                    <option value="splitboardAllDay" name="Splitboard - journée" data-price="330" data-minParticipants="2" data-maxParticipants="6" data-duration="allDay" data-period="december-april">Splitboard - journée - 330€/pers.</option>
                </select>
                <input class="field" type="date" name="date_activity_`+ x + `">
                <input class="field" type="number" name="participantsCount_activity_`+ x + `" placeholder="Nombre de participants" min="2" max="12">
            </div>
            <div class="activity_`+ x + `_participantsList participantsList">
                <p>Participants activité `+ x + `</p>
            </div>
            `;

        document.querySelector('.activities').appendChild(newActivity);

        let singleActivitySelectors = document.querySelectorAll('.singleActivitySelector');

        chooseActivity(singleActivitySelectors);

        deletActivityBtn.classList.remove('hide');

    }

    /** remove last single activity */
    function removeActivity() {
        let activities = document.querySelector('.activities')
        let activityToRemove = document.querySelector('.activities').lastChild;
        activities.removeChild(activityToRemove);

        updateBasket();
    }

    /** allows to choose between ROC Day & Roc Week-end, display form according to chosen formula
     * @param {*} field input ROC formula selector
     */
    function chooseRocFormula(selector) {
        selector.addEventListener('change', function () {
            //get activity (for display participants)
            let activity = document.querySelector('#rocCocktail').id;
            //get formula value (day or week-end)
            let formulaValue = this.options[selector.selectedIndex].getAttribute('value');
            //get min numberparticipants
            let numberMinParticipants = Number(this.options[selector.selectedIndex].getAttribute('data-minParticipants'));
            //get input numberparticipants
            let participantsNumberSelector = document.querySelector(`input[name="participantsCount_rocCocktail"]`);
            //get div myRocActivities
            let myRocActivities = document.querySelector('.myRocActivities');
            //get input date
            let dateSelector = document.querySelector(`input[name="date_rocCocktail"]`);
            //get roc week-end message
            let rocmessage = document.querySelector('.rocWeekend')
            participantsNumberSelector.value = numberMinParticipants;

            switch (formulaValue) {
                case "cocktailOneDay":
                    reset(myRocActivities);
                    chooseRocDayActivities(myRocActivities);
                    dateSelector.removeAttribute('step');
                    rocmessage.classList.add('hide');

                    let activity1 = document.querySelector('.rocActivity_1 select');
                    activity1.addEventListener('change', function () {
                        chooseRocDayActivities(myRocActivities);
                        let activityToHide = activity1.value;
                        let options = document.querySelectorAll('.rocActivity_2 option');
                        options.forEach(option => {
                            if (option.value === activityToHide) {
                                option.classList.add('hide');
                            } else {
                                option.classList.remove('hide');
                            }
                            let activity2 = document.querySelector('.rocActivity_2 select')
                            activity2.addEventListener('change', updateBasket);

                        })
                    })
                    break;
                default:
                    reset(myRocActivities);
                    addAllActivities(myRocActivities);
                    chooseRocWeekEndActivities(myRocActivities)
                    dateSelector  .setAttribute('step', '7');
                    rocmessage.classList.remove('hide');
                    break;
            }

            displayParticipants(activity, numberMinParticipants);

            validateParticipantsNumber(activity, participantsNumberSelector);

        })
    }

    /** allows to choose ROC day activities
     * @param {*} divMyRocActivities where to display choices
     */
    function chooseRocDayActivities(divMyRocActivities) {
        if (document.querySelector('.rocActivity_1') === null) {
            let newRocActivity = document.createElement('div');
            newRocActivity.classList.add('rocActivity_1');
            newRocActivity.innerHTML = `
            <p>Activité 1</p>
                    <select class="field rocActivitySelector" name="rocActivity_1" required>
                        <option value="empty">Séléctionnez votre activité 1</option>
                        <option value="bikeHalfDayNoLoc" name="VTTAE sans location VTT - 1/2 journée" data-price="45">VTTAE sans location VTT - 1/2 journée - 45€/pers.</option>
                        <option value="bikeHalfDay" name="VTTAE avec location VTT - 1/2 journée" data-price="80">VTTAE avec location VTT - 1/2 journée - 80€/pers.</option>
                        <option value="paddleHalfDay" name="Paddle - 1/2 journée" data-price="55">Paddle - 1/2 journée - 55€/pers.</option>
                        <option value="kayak" name="Kayak - 1/2 journée" data-price="50">Kayak - 1/2 journée - 50€/pers.</option>
                        <option value="climbingHalfDay" name="Escalade - 1/2 journée" data-price="50">Escalade - 1/2 journée - 50€/pers.</option>
                        <option value="viaHalfDay" name="Via Ferrata - 1/2 journée" data-price="60">Via Ferrata - 1/2 journée - 60€/pers.</option>
                        <option value="archery" name="Tir à l'arc - 1/2 journée" data-price="50">Tir à l'arc - 1/2 journée - 50€/pers.</option>
                    </select>
            `;
            divMyRocActivities.appendChild(newRocActivity);
        } else {
            if (document.querySelector('.rocActivity_2') === null) {
                let newRocActivity = document.createElement('div');
                newRocActivity.classList.add('rocActivity_2');
                newRocActivity.innerHTML = `
                <p>Activité 2</p>
                        <select class="field rocActivitySelector" name="rocActivity_2" required>
                            <option value="empty">Séléctionnez votre activité 2</option>
                            <option value="bikeHalfDayNoLoc" name="VTTAE sans location VTT - 1/2 journée" data-price="45">VTTAE sans location VTT - 1/2 journée - 45€/pers.</option>
                            <option value="bikeHalfDay" name="VTTAE avec location VTT - 1/2 journée" data-price="80">VTTAE avec location VTT - 1/2 journée - 80€/pers.</option>
                            <option value="paddleHalfDay" name="Paddle - 1/2 journée" data-price="55">Paddle - 1/2 journée - 55€/pers.</option>
                            <option value="kayak" name="Kayak - 1/2 journée" data-price="50">Kayak - 1/2 journée - 50€/pers.</option>
                            <option value="climbingHalfDay" name="Escalade - 1/2 journée" data-price="50">Escalade - 1/2 journée - 50€/pers.</option>
                            <option value="viaHalfDay" name="Via Ferrata - 1/2 journée" data-price="60">Via Ferrata - 1/2 journée - 60€/pers.</option>
                            <option value="archery" name="Tir à l'arc - 1/2 journée" data-price="50">Tir à l'arc - 1/2 journée - 50€/pers.</option>
                        </select>
                `;

                divMyRocActivities.appendChild(newRocActivity);
            };
        }
        updateBasket();
    };

    /** display ROC week-end activities selectors
     * @param {*} divMyRocActivities divMyRocActivities where to display choices
     */
    function addAllActivities(divMyRocActivities) {
        for (let i = 0; i < 4; i++) {
            let x = i + 1;
            let newRocActivity = document.createElement('div');
            newRocActivity.innerHTML = `
                <p>Activité ` + x + `</p>
                <select class="field rocActivitySelector" name="rocActivity_` + x + `"required>
                    <option value="empty">Séléctionnez votre activité ` + x + `</option> 
                    <option value="bikeHalfDayNoLoc" name="VTTAE sans location VTT - 1/2 journée" data-price="45" data-duration="0.5">VTTAE sans location VTT - 1/2 journée</option>
                    <option value="bikeAllDayNoLoc" name="VTTAE sans location VTT - journée" data-price="80" data-duration="1">VTTAE sans location VTT - journée</option>
                    <option value="bikeHalfDay" name="VTTAE avec location VTT - 1/2 journée" data-price="80" data-duration="0.5">VTTAE avec location VTT - 1/2 journée</option>
                    <option value="bikeAllDay" name="VTTAE avec location VTT - journée" data-price="130" data-duration="1">VTTAE avec location VTT - journée</option>
                    <option value="paddleHalfDay" name="Paddle - 1/2 journée" data-price="55" data-duration="0.5">Paddle - 1/2 journée</option>
                    <option value="paddleAllDay" name="Paddle - journée" data-price="100" data-duration="1">Paddle - journée</option>
                    <option value="kayak" name="Kayak - 1/2 journée" data-price="50" data-duration="0.5">Kayak - 1/2 journée</option>
                    <option value="climbingHalfDay" name="Escalade - 1/2 journée" data-price="50" data-duration="0.5">Escalade - 1/2 journée</option>
                    <option value="climbingAllDay" name="Escalade - journée" data-price="90" data-duration="1">Escalade - journée</option>
                    <option value="viaHalfDay" name="Via Ferrata - 1/2 journée" data-price="60" data-duration="0.5">Via Ferrata - 1/2 journée</option>
                    <option value="viaAllDay" name="Via Ferrata - journée (2 via ferrata)" data-price="110" data-duration="1">Via Ferrata - journée (2 via ferrata)</option>
                    <option value="archery" name="Tir à l'arc - 1/2 journée" data-price="50" data-duration="0.5">Tir à l'arc - 1/2 journée</option>
                `;

            divMyRocActivities.appendChild(newRocActivity);
            if (x > 1) {
                newRocActivity.querySelector(`select[name="rocActivity_` + x + `"]`).disabled = true;
            }
        };
    }

    /** allows to choose ROC week-end activities
     * @param {*} divMyRocActivities where to display choices
     */
    function chooseRocWeekEndActivities(divMyRocActivities) {
        let selectors = divMyRocActivities.querySelectorAll('.rocActivitySelector');
        for (let i = 0; i < selectors.length; i++) {
            const selector = selectors[i];

            selector.addEventListener('change', function () {
                let selectedDays = 0;
                let emptySelector = [];
                let currentSelectors = divMyRocActivities.querySelectorAll('.rocActivitySelector')
                currentSelectors.forEach(currentSelector => {
                    if (currentSelector.value !== 'empty') {
                        selectedDays += Number(this.options[currentSelector.selectedIndex].getAttribute('data-duration'));
                    } else {
                        emptySelector.push(currentSelector);
                    }
                });
                if (selectedDays === 0.5 || selectedDays === 1 && emptySelector.length === 3 || selectedDays === 1 && emptySelector.length === 2) {
                    emptySelector[0].disabled = false;

                } else if (selectedDays === 1.5) {
                    if (emptySelector.length === 2) {
                        let activitiesToHide = emptySelector[0].querySelectorAll(`option[data-duration="1"]`);
                        activitiesToHide.forEach(activity => {
                            activity.classList.add('hide');
                        })
                        emptySelector[0].disabled = false;
                    } else if (emptySelector.length === 1) {
                        let activitiesToHide = currentSelectors[3].querySelectorAll(`option[data-duration="1"]`);
                        activitiesToHide.forEach(activity => {
                            activity.classList.add('hide');
                        })
                        emptySelector[0].disabled = false;
                    } else if (emptySelector.length > 1) {
                        let activitiesToHide = currentSelectors[2].querySelectorAll(`option[data-duration="1"]`);
                        activitiesToHide.forEach(activity => {
                            activity.classList.add('hide');
                        })
                        currentSelectors[3].value = 'empty';
                        currentSelectors[3].disabled = true;
                    }
                } else if (selectedDays === 2 && emptySelector.length === 2) {
                    currentSelectors[2].value = 'empty';
                    currentSelectors[2].disabled = true;
                } else if (selectedDays > 2) {
                    if (emptySelector.length === 1) {
                        if (Number(this.options[currentSelectors[0].selectedIndex].getAttribute('data-duration')) + Number(currentSelectors[1].options[currentSelectors[1].selectedIndex].getAttribute('data-duration')) === 2) {
                            currentSelectors[2].value = 'empty';
                            currentSelectors[2].disabled = true;
                        } else if (emptySelector.length === 1) {
                            currentSelectors[2].value = 'empty';
                            currentSelectors[3].value = 'empty';
                            currentSelectors[3].disabled = true;
                        }
                    } else if (emptySelector.length !== 1) {
                        currentSelectors[2].value = 'empty';
                        let activitiesToHide = currentSelectors[2].querySelectorAll(`option[data-duration="1"]`);
                        activitiesToHide.forEach(activity => {
                            activity.classList.add('hide');
                        })
                        currentSelectors[3].value = 'empty';
                        currentSelectors[3].disabled = true;
                    }
                }
                updateBasket();
            })
        }
    }

    function updateBasket() {
        // Get data from form
        let formData = document.querySelector('#bookingForm');
        let data = new FormData(formData);
        let tableBody = document.querySelector('tbody');
        tableBody.innerHTML = "";
        let bookingSummaryElmt = document.querySelector('.totalPrice');
        let totalPrice = 0;
        let totalDiscount = 0;

        for (let key of data.keys()) {
            // search activities
            if (key.startsWith('activity')) {
                let activityName = data.get(key).toString();

                if (activityName !== 'empty') {

                    // get number of participants
                    let activityNumberParticipants = data.get("participantsCount_" + key);

                    //get name & price from obj activity of bookingData 
                    let crtActivity = bookingData.find(activity => activity.value === activityName);

                    // get activity price & total price
                    let linePrice = crtActivity.price * activityNumberParticipants;
                    totalPrice += linePrice;

                    // display
                    let newActivityLine = document.createElement('tr');
                    newActivityLine.innerHTML = `
                        <td>`+ crtActivity.name + `</td>
                        <td>`+ activityNumberParticipants + `x</td>
                        <td>`+ crtActivity.price + `€</td>
                        <td>`+ linePrice + `€</td>
                    `;
                    tableBody.appendChild(newActivityLine);
                }

            } else if (key.startsWith('rocCocktail')) {
                let activityName = data.get(key).toString();
                if (activityName !== 'empty') {

                    // display
                    let newActivityLine = document.createElement('tr');
                    newActivityLine.classList.add("rocFormulaBasket")

                    //get name & price from obj activity of bookingData 
                    let crtActivity = bookingData.find(activity => activity.value === activityName);

                    // display
                    newActivityLine.innerHTML = `
                        <td colspan="3">`+ crtActivity.name + `</td>
                        <td class="discount"></td>
                    `;
                    tableBody.appendChild(newActivityLine);
                }

            } else if (key.startsWith('rocActivity')) {

                let activityName = data.get(key).toString();

                if (activityName !== 'empty') {

                    // get number of participants
                    let activityNumberParticipants = data.get("participantsCount_rocCocktail");

                    //get name & price from obj activity of bookingData 
                    let crtActivity = bookingData.find(activity => activity.value === activityName);

                    // get activity price & total price
                    let linePrice = crtActivity.price * activityNumberParticipants;

                    // get discount to apply
                    let rocFormula = document.querySelector('.rocFormulaSelector')
                    let discountToApply = Number(rocFormula.options[rocFormula.selectedIndex].getAttribute('data-price'));
                    let lineDiscount = linePrice * discountToApply;

                    totalDiscount += lineDiscount
                    totalPrice += (linePrice - lineDiscount);

                    // display
                    document.querySelector('.discount').innerText = '-' + totalDiscount + '€';

                    let newActivityLine = document.createElement('tr');
                    newActivityLine.innerHTML = `
                        <td>`+ crtActivity.name + `</td>
                        <td>`+ activityNumberParticipants + `x</td>
                        <td>`+ crtActivity.price + `€</td>
                        <td>`+ linePrice + `€</td>
                    `;
                    let lineRocFormulaBasket = document.querySelector('.rocFormulaBasket')

                    tableBody.insertBefore(newActivityLine, lineRocFormulaBasket);
                }
            }
        }
        bookingSummaryElmt.innerText = totalPrice + "€";
    }
});


// VALIDATION FUNCTIONS

/** check the value all inputs before submit
 * @param {NodeList} all required form inputs
 */
function checkValues(inputs) {
        
    let error = new Errors;

    inputs.forEach(input => {

        if(input.hasAttribute('required')) {
            if(input.name !== "contact_society" && input.name !== 'comment') {
                if (!input.disabled) {
                    if(input.value === '' || input.value === 'empty') {
                        input.classList.add('red-border');
                        error.record({validateReservation: 'Merci de renseigner tous les champs obligatoires.'})
                    }
                }
            }          

            if (input.name === 'contact_lastName'){
                if(!validateName(input.value)){
                    error.record({contact_lastName: 'Nom invalide'});
                }
            }
            if (input.name === 'contact_firstName'){
                if(!validateName(input.value)){
                    error.record({contact_firstName: 'Prénom invalide'});
                }
            }
            if (input.name === 'contact_phone'){
                if(!validatePhone(input.value)){
                    error.record({contact_phone: 'Téléphone invalide'});
                }
            }
            if (input.name === 'contact_mail'){
                if(!validateEmail(input.value)){
                    error.record({contact_mail: 'Email invalide'});
                }
            }
            if (input.name === 'cgv' && input.checked === false){
                error.record({cgv: 'Merci daccepter nos conditions générales de vente.'});
            }
            if(input.name.includes('halfDaySelector_activity')) {
                if(input.value !== 'Matinée' && input.value !== 'Après-midi') {
                    input.classList.add('red-border');
                    error.record({validateReservation: 'Demi-journée sélectionnée non valide'});
                }
            }
            if (input.name.includes('lastName_activity') || input.name.includes('lastName_rocCocktail')) {
                if(!validateName(input.value)) {
                    input.classList.add('red-border');
                    error.record({validateReservation: 'Nom invalide'});
                }
            }
            if (input.name.includes('firstName_activity') || input.name.includes('firstName_rocCocktail')) {
                if(!validateName(input.value)) {
                    input.classList.add('red-border');
                    error.record({validateReservation: 'Prénom invalide'});
                }
            }
            if (input.name.includes('birthdate') && validatedate(input.value) === false) {
                input.classList.add('red-border');
                error.record({validateReservation: 'Date de naissance erronée pour l\'un des participants. Merci de respecter le format jj/mm/aaaa.'});
            }
            if (input.name.includes('size')){
                if (isNaN(parseInt(input.value))){
                    input.classList.add('red-border');
                    error.record({validateReservation: 'Taille erronée pour l\'un des participants. Merci de renseigner une taille en cm.'});
                } else if (parseInt(input.value) < 50 || parseInt(input.value) > 250){
                    input.classList.add('red-border');
                    error.record({validateReservation: 'La taille renseignée pour l\'un des participants semble erronées. Merci de vérifier vos saisies.'});
                }
            }
            if (input.name.includes('level')) {
                if(input.value !== 'Débutant' && input.value !== 'Intermédiaire' && input.value !== 'Confirmé' && input.value !== 'Expert') {
                    input.classList.add('red-border');
                    error.record({validateReservation: 'Le niveau renseignée pour l\'un des participants semble erronée. Merci de vérifier vos saisies.'});
                }
            }
        }
    });

    if (error.errors.messages.length > 0) {

        error.createError();

        if(error.errors.messages[0].hasOwnProperty('validateReservation')) {
            setTimeout(hide, 5000);
        }
    } else {
        submitform();
    }
    inputs.forEach.call(inputs, input => {
        input.addEventListener('keydown', removeError(input));
    });
}

/** Generate jsonData */ 
function submitform() {
    let messageArea = document.querySelector('.message');

    let jsondata = JSON.parse('{ }');;
    let formData = document.querySelector('#bookingForm');
    let data = new FormData(formData);

    // Contact :
    let contactJson = JSON.parse('{ }');

    // Activities :
    let activitiesJson = JSON.parse('[]');

    // Comment
    let commentJson = JSON.parse('{}');

    for (let key of data.keys()) {

        // Manage contact
        if (key.startsWith('contact')) {
            // Adding contact informations
            contactJson[key] = data.get(key).toString();
        }

        // Manage comment
        if (key.startsWith('comment')) {
            // Adding comment
            commentJson[key] = data.get(key).toString();
        }

        // Manage Activity
        if (key.startsWith('activity')) {
            // Adding activity x
            let activityDetailsJson = JSON.parse('{ }');

            // If name is empty, we do nothing !
            if (data.get(key) != "empty") {

                // get activity name
                activityDetailsJson["name"] = data.get(key);
                // get activity date 
                activityDetailsJson["dateActivity"] = data.get("date_" + key);
                // get activity participants number
                activityDetailsJson["participantsCount"] = data.get("participantsCount_" + key);
                // get activity half day 
                if (data.has("halfDaySelector_" + key)) {
                    activityDetailsJson["halfDay"] = data.get("halfDaySelector_" + key);
                }

                // Adding participants for activity x
                let participantsJson = JSON.parse('[]');

                for (let i = 1; i <= data.get("participantsCount_" + key); i++) {
                    let participantJson = JSON.parse('{}');
                    participantJson["lastName"] = data.get("lastName_" + key + "_participant_" + i);
                    participantJson["firstName"] = data.get("firstName_" + key + "_participant_" + i);
                    participantJson["birthdate"] = data.get("birthdate_" + key + "_participant_" + i);
                    participantJson["size"] = data.get("size_" + key + "_participant_" + i);
                    participantJson["level"] = data.get("level_" + key + "_participant_" + i);
                    participantsJson.push(participantJson);
                }

                activityDetailsJson["participants"] = participantsJson;

                activitiesJson.push(activityDetailsJson);

                jsondata["contact"] = contactJson;
                jsondata["activities"] = activitiesJson;
                jsondata["comment"] = commentJson;

            }

        }

        // Manage RocActivities
        if (key.startsWith('rocCocktail')) {

            let cocktailDetailsJson = JSON.parse('{ }');

            // If name is empty, we do nothing !
            if (data.get("rocCocktail_Formula") != "empty") {

                // get formula
                cocktailDetailsJson["formula"] = data.get("rocCocktail_Formula");
                // get date
                cocktailDetailsJson["date"] = data.get("date_rocCocktail");
                // get activity participants number
                let participantsCount = data.get("participantsCount_rocCocktail")
                cocktailDetailsJson["participantsCount"] = data.get("participantsCount_rocCocktail");

                // Adding activities
                let cocktailActivitiesJson = JSON.parse('[]');

                for (let i = 1; i < 5; i++) {

                    if (data.get('rocActivity_' + i) !== null) {
                        let activityJson = JSON.parse('{ }');
                        activityJson["activity"] = data.get("rocActivity_" + i);
                        cocktailActivitiesJson.push(activityJson);
                    }
                }

                cocktailDetailsJson["activities"] = cocktailActivitiesJson;

                // Adding participants for activity x
                let cocktailParticipantsJson = JSON.parse('[]');

                for (let i = 1; i <= participantsCount; i++) {
                    let participantJson = JSON.parse('{}');
                    participantJson["firstName"] = data.get("firstName_rocCocktail_participant_" + i);
                    participantJson["lastName"] = data.get("lastName_rocCocktail_participant_" + i);
                    participantJson["birthdate"] = data.get("birthdate_rocCocktail_participant_" + i);
                    participantJson["size"] = data.get("size_rocCocktail_participant_" + i);
                    participantJson["level"] = data.get("level_rocCocktail_participant_" + i);
                    cocktailParticipantsJson.push(participantJson);
                }

                cocktailDetailsJson["participants"] = cocktailParticipantsJson;

                activitiesJson.push(cocktailDetailsJson);


                jsondata["contact"] = contactJson;
                jsondata["cocktail"] = activitiesJson;
                jsondata["comment"] = commentJson;
            }
        }
    }

    let crtFormData = JSON.stringify(jsondata);

    fetchBookingJson(crtFormData)
    .then((data)=>{
        if(data.message === "Job done.") {
            messageArea.classList.remove('form-error');
            messageArea.classList.add('validate');
            messageArea.innerText = "Votre demande a bien été enregistrée. Un mail récapitulatif vous a été envoyé à l'adresse mail " + jsondata.contact.contact_mail + ". Nos équipes vous recontactent au plus vite pour finaliser votre réservation.";
        } else if(data.message === "Job done. No mail.") {
            messageArea.classList.remove('form-error');
            messageArea.classList.add('validate');
            messageArea.innerText = "Votre demande a bien été enregistrée mais nous rencontrons un problème lors de l'envoi du mail récapitulatif. Nos équipes vous recontactent au plus vite pour finaliser votre réservation.";
        } else {
            messageArea.classList.add('form-error');
            if (data.message === "Unable to create contact.") {
                messageArea.innerText = "Impossible d'enregistrer votre réservation. Coordonnées de contact manquantes ou erronées.";
            } else if (data.message === "Unable to create booking activity. invalid date") {
                messageArea.innerText = "Impossible d'enregistrer votre réservation. Date d'activité invalide.";
            } else if (data.message === "Unable to create booking activity.") {
                messageArea.innerText = "Impossible d'enregistrer votre réservation. Activité(s) incomplète(s).";
            } else if (data.message === "Unable to create booking. Invalid formula") {
                messageArea.innerText = "Impossible d'enregistrer votre réservation. Formule invalide.";
            } else if (data.message === "Unable to create participants List.") {
                messageArea.innerText = "Impossible d'enregistrer les participants. Données manquantes ou erronées.";
                message = 'test message';
            } else if (
                data.message === "Unable to create booking. Technical error." || 
                data.message === "Unable to create booking activity. Technical error." ||
                data.message === "Unable to create participants List.  Technical error." ||
                data.message === "Unable to create bookingActivityUser. Technical error.." 
                ) {
                    messageArea.innerText = "Impossible d'enregistrer votre réservation. Merci de nous contacter par mail ou téléphone.";
            }
        } 
        setTimeout(refresh, 8000);
    })
    .catch(err => {
        console.log('Error: ', err);
    })
}

/** Send data to server */
async function fetchBookingJson(formData) {
    let response = await fetch('api/booking/createAllDatas.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: formData
    })
    let reponse = await response.json();

    return reponse;
}

/** redirection to home page after validation of the form */
function refresh(){
    window.location.href="index.php";
}

/**check name of participant
 * @param {string} name to check 
 */
function validateName(string) {
    const stringRegex = /^[A-Za-z\à\â\ä\é\è\ê\ë\ö\ô\î\ï\ù\û\ü\ -]+$/;
    return stringRegex.test(string)
}

/**check email of participant
 * @param {string} email to check 
 */
function validateEmail(email) {
    const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return mailRegex.test(String(email).toLowerCase());
}

/**check phone number of participant
 * @param {string} phone number to check 
 */
function validatePhone(phoneNumber) {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phoneNumber);
}

/** validate birthdate of participant */
function validatedate(value) {
    let dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    // Match the date format through regular expression
    if(value.match(dateformat)) {
        let pdate = value.split('/');
        let dd = parseInt(pdate[0]);
        let mm  = parseInt(pdate[1]);
        let yy = parseInt(pdate[2]);
        // Create list of days of a month [assume there is no leap year by default]
        let ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
        if (mm==1 || mm>2) {
            if (dd>ListofDays[mm-1]) {
                return false;
            }
        }
        if (mm==2) {
            let lyear = false;
            if ( (!(yy % 4) && yy % 100) || !(yy % 400)) {
                lyear = true; 
            }
            if ((lyear==false) && (dd>=29)) {   
                return false;
            }
            if ((lyear==true) && (dd>29)) {
                return false;
            }
        }
    } else {
        return false;
    }
}

/** remove error messages
 * @param {*} field input in error
 */
function removeError(field) {
    field.addEventListener('focusout', function () {
        field.classList.remove('red-border');
        if (field.nextElementSibling !== null && field.nextElementSibling.classList.contains('form-error')) {
            field.nextElementSibling.remove();
        }
    })
};

/** hide error message 'field empty' */
function hide() {
    document.querySelector('#validateReservation').nextElementSibling.remove();
    document.querySelector('#validateReservation').classList.remove('red-border');
}


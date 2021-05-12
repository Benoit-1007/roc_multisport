'use strict';

document.addEventListener('DOMContentLoaded', function(){

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

    let activities = document.querySelector('#activities');
    
    let activity = document.querySelector('#activityItem');

    let addActivityBtn = document.querySelector('#addActivityButton');

    // let deletActivityBtn = document.querySelector('#deletActivityButton');
    

    // let x = document.querySelector('#activities').childElementCount + 1;

    addActivityBtn.addEventListener('click', addActivity);
    
    function addActivity(){
        let clone = activity.cloneNode(true);
    
        activities.appendChild(clone);
    }

    // deletActivityBtn.addEventListener('click',deletActivity);

    // function deletActivity(){
    //     let currentActivities = document.querySelectorAll('#activityItem');
    //     console.log("🚀 ~ file: booking.js ~ line 65 ~ deletActivity ~ currentActivities", currentActivities)
    // }

});
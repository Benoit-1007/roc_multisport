'use strict';

document.addEventListener("DOMContentLoaded", function(){

    const activities = document.querySelectorAll('select');

    activities.forEach(activity => {
        activity.addEventListener('change',function(){
            //get number activty
            let myActivity = activity.getAttribute('name');
            console.log(myActivity);

            //get price activity
            let price = Number(this.options[activity.selectedIndex].getAttribute('data-price'));
            console.log(price)

            //get name activity
            let chosenActivity = this.options[activity.selectedIndex].getAttribute('name');
            console.log(chosenActivity);

            //update basket


            const choice = document.getElementById(`${myActivity}`);
            console.log(choice);

            choice.classList.remove('hide');

            choice.textContent = '';

            choice.innerHTML += chosenActivity + " " + price;
            
        })            
    })

    
    
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

    document.addEventListener("scroll", handleScroll);
    // get a reference to our predefined button
    let scrollToTopBtn = document.querySelector(".scrollToTopBtn");
    console.log(scrollToTopBtn);


    function handleScroll() {
        let scrollableHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let ratio = 0.1;

        if ((document.documentElement.scrollTop / scrollableHeight ) > ratio) {
            //show button
            // scrollToTopBtn.style.display = "block";
            scrollToTopBtn.classList.remove('hide');
            
            
        // } else {
        // //hide button
        // // scrollToTopBtn.style.display = "none";
        // scrollToTopBtn.classList.add('hide');
        }
        if(scrollToTopBtn.classList.value === 'scrollToTopBtn'){
                
            let timeoutID = window.setTimeout( hide,4000);

            function hide(){
                scrollToTopBtn.classList.add('hide');
            }
        }
    };




    scrollToTopBtn.addEventListener("click", scrollToTop);

    function scrollToTop() {
        window.scrollTo({
        top: 0,
        behavior: "smooth"
        });
    }
})
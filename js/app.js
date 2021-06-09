'use strict';

// imports
import Contact from './Contact.js';

// import Bookingform from './Bookingform(test).js';

document.addEventListener("DOMContentLoaded", function(){
    
    // BURGER MENU //

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
    toggleMenu();

    // FORM 

    // test

    // let form = document.querySelector('form');

    // if(form !== null){

    //     if(form.id === 'bookingForm'){
    //         let booking = new Bookingform;
    //         let activitiesbtn = document.querySelectorAll('.formulaSelector button');

    //         //Choose between single activity or cocktail ROC
    //         booking.chooseFormula(activitiesbtn);

    //         let addActivityBtn = document.querySelector('#addActivityButton');
    //         //add a new single activity
    //         addActivityBtn.addEventListener('click', booking.addActivity);

    //         let deletActivityBtn = document.querySelector('#deletActivityButton');
    //         //remove a new single activity
    //         deletActivityBtn.addEventListener('click', booking.removeActivity);
    //     }
        
            
    //     form.addEventListener('submit', event => {
            
    //         // Get action to do (from form id)
    //         if(form.id === 'contactForm'){
    //             let inputs = form.querySelectorAll('.field');
    //             console.log("🚀 inputs", inputs)
                
    //             let contactForm = new Contactform();
    //             console.log("🚀 contactForm", contactForm)
    //             if(!contactForm.validate(inputs)){
    //                 // Block form auto refresh
    //                 event.preventDefault();
    //                 // console.log(contactForm.error.errors.messages, "form ko");
    //                 contactForm.createError();
    //             };
    //             inputs.forEach.call(inputs, input => {
    //                 input.addEventListener('keydown', contactForm.removeError);
    //             });
                
    //         } else {
    //             // validate bookingForm
    //         }
    //     })    
    // }

    // fin test
            
    let form = document.querySelector('form')
    console.log(form)

    const inputs = form.querySelectorAll('.field');
    console.log("🚀 ~ file: app.js ~ line 82 ~ document.addEventListener ~ inputs", inputs)
    
    form.addEventListener('submit', event => {
        // Get action to do (from form id)
        if(form.id = 'contactForm'){
            let contactForm = new Contact();
            console.log("🚀 ~ file: app.js ~ line 93 ~ document.addEventListener ~ contactForm", contactForm)
            
            if(!contactForm.validate(inputs)){
                // Block form auto refresh
                event.preventDefault();
                // console.log(contactForm.error.errors.messages, "form ko");
                contactForm.createError();
            };
            inputs.forEach.call(inputs, input => {
                input.addEventListener('keydown', contactForm.removeError);
            });
        }
        // TODO gestion form booking

    })
    
    
})
'use strict';

// imports
import Contact from './Contact.js';
import Menu from './Menu.js';

document.addEventListener("DOMContentLoaded", function(){

    let menu = new Menu;
    
    // menu management for mobile phone 
    menu.toggleMenu();
            
    let form = document.querySelector('form')
    
    if(form !== null){

        const inputs = form.querySelectorAll('.field');
        
        form.addEventListener('submit', event => {
            // Get action to do (from form id)
            let contactForm = new Contact();
            
            if(!contactForm.validate(inputs)){
                // Block form auto refresh
                event.preventDefault();
                // console.log(contactForm.error.errors.messages, "form ko");
                contactForm.createError();
            };
            inputs.forEach.call(inputs, input => {
                input.addEventListener('keydown', contactForm.removeError);
            });
        })
    }

    // /** menu management for mobile phone */
    // function toggleMenu(){
    //     const navbar = document.querySelector('.navbar');
    //     const burger = document.querySelector('.burger');
    //     const links = document.querySelectorAll('a');
    //     let width = window.innerWidth;
        
        
    //     burger.addEventListener('click', () => {
    //         navbar.classList.toggle('show_nav');
    //     })
        
    //     if(width < 767){
    //         links.forEach(link => {
    //             link.addEventListener('click', () => {
    //                 navbar.classList.toggle('show_nav');
    //             })
    //         });
    //     } 
    // }
    
})

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
'use strict';

// imports
import Contact from './Contact.js';
import * as menu from './menu.js';

document.addEventListener("DOMContentLoaded", function(){

    // menu management for mobile phone 
    menu.toggleMenu();
            
    let form = document.querySelector('form')
    
    if(form !== null){

        const inputs = form.querySelectorAll('.field');
        
        form.addEventListener('submit', event => {
            
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
})

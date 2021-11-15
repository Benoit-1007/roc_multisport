'use strict';

// imports
import Contact from './Contact.js';
import * as menu from './menu.js';

document.addEventListener("DOMContentLoaded", function(){

    // menu management for mobile phone 
    menu.toggleMenu();
            
    let form = document.querySelector('form');

    if(form !== null){

        const inputs = form.querySelectorAll('.field');
        
        form.addEventListener('submit', event => {
            
            let contactForm = new Contact();
            
            if(!contactForm.validate(inputs)){
                // Block form auto refresh
                event.preventDefault();
                
                contactForm.createError();
            }
            inputs.forEach.call(inputs, input => {
                input.addEventListener('keydown', contactForm.removeError);
            });
        })
    }

    let modaleButton = document.querySelector('.modaleButton');

    modaleButton.addEventListener('click', hideModale);
})

function hideModale() {
    let modale = document.querySelector(".modale");
    modale.classList.add('hide');
    if (modale.classList.contains('red-border')){
        modale.classList.remove('red-border');
    } else {
        modale.classList.remove('green-border');
    }
}


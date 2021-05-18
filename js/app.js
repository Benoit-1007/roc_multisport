'use strict';

// imports
import Contactform from './Contactform.js';

document.addEventListener("DOMContentLoaded", function(){

    // // topButton 
    // document.addEventListener("scroll", handleScroll);
    // // get a reference to our predefined button
    // let scrollToTopBtn = document.querySelector(".scrollToTopBtn");
    // console.log(scrollToTopBtn);


    // function handleScroll() {
    //     let scrollableHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    //     let ratio = 0.1;

    //     if ((document.documentElement.scrollTop / scrollableHeight ) > ratio) {
    //         //show button
    //         // scrollToTopBtn.style.display = "block";
    //         scrollToTopBtn.classList.remove('hide');
            
            
    //     // } else {
    //     // //hide button
    //     // // scrollToTopBtn.style.display = "none";
    //     // scrollToTopBtn.classList.add('hide');
    //     }
    //     if(scrollToTopBtn.classList.value === 'scrollToTopBtn'){
                
    //         let timeoutID = window.setTimeout( hide,4000);

    //         function hide(){
    //             scrollToTopBtn.classList.add('hide');
    //         }
    //     }
    // };




    // scrollToTopBtn.addEventListener("click", scrollToTop);

    // function scrollToTop() {
    //     window.scrollTo({
    //     top: 0,
    //     behavior: "smooth"
    //     });
    // }

    
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

    let form = document.querySelector('form')
    console.log(form)

    const inputs = form.querySelectorAll('.field');
    console.log("🚀 ~ file: app.js ~ line 82 ~ document.addEventListener ~ inputs", inputs)
    
    form.addEventListener('submit', event => {
        // Get action to do (from form id)
        if(form.id = 'contactForm'){
            let contactForm = new Contactform();
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
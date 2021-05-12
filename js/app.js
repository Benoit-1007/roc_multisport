'use strict';

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

    

    //burger menu
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
})
'use strict';

document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#printButton').addEventListener('click',() => print_page());

});

function print_page() {
    window.print();
}
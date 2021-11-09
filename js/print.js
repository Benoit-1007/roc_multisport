'use strict';

document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#printButton').addEventListener('click',() => print_page());
    document.querySelector('#pdfButton').addEventListener('click',() => pdf_page());

});

function print_page() {
    window.print();
}

function pdf_page() {
    console.log('test pdf');
    let idBooking = document.querySelector('#pdfButton').getAttribute('data-idBooking');
    window.location.href=`pdf.php?idBooking=${idBooking}`;
}
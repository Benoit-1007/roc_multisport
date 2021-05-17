'use strict'

import Errors from './Errors.js';

class Contactform {
    constructor(){
        this.error = new Errors();
        this.isValid = false;
        this.allowed = ['email', 'lastName', 'firstName', 'phone', 'message'];
        this.email='';
        this.lastName='';
        this.firstName='';
        this.phone='';
        this.message='';
    }

    validate(fields){
        fields.forEach(field => {
            if (!this.allowed.includes(field.name)) {
                return this.error.record(`Le champ ${field.name} n'est pas valide`);
            }
            if (field.name === 'email') {
                if (this.validateEmail(field.value)) {
                    this.isValid = true;
                    this.email = field.value;
                } else {
                    this.error.record({ email: 'Email invalide' });
                }
            }
            if (field.name === 'lastName'){
                if(!field.value || !typeof field.value === 'string'){
                    this.error.record({lastName: 'Nom invalide'});
                }
                this.firstName = field.value;
            }
            if (field.name === 'firstName'){
                if(!field.value || !typeof field.value === 'string'){
                    this.error.record({firstName: 'Prénom invalide'});
                }
                this.lastName = field.value;
            }
            if (field.name === 'phone'){
                // if(!field.value || verifyPhoneNumber(field.value) === false){
                //     // this.error.record({ phone: 'Numéro de téléphone invalide' });
                //     alert('Tél invalide')
                // }
                this.phone = field.value;
            }
            if (field.name === 'message'){
                if(!field.value){
                    this.error.record({message: 'Message vide'});
                }
                this.message = field.value;
            }
        });
        if (this.error.errors.messages.length > 0) {
            this.isValid = false;
            console.log(this.isValid);
        } else {
            this.isValid = true;
        }
        return this.isValid;
    };

    createError() {
        return this.error.createError();
    }

    removeError() {
        if (this.nextElementSibling.classList.contains('form-error')) {
            this.nextElementSibling.remove();
        }
    }


    // function verifyPhoneNumber(phoneNumber){
    //     // Definition du motif a matcher
    //     var regex = new RegExp(/^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/);
        
    //     // Definition de la variable booleene match
    //     var match = false;
        
    //     // Test sur le motif
    //     if(regex.test(phoneNumber))
    //     {
    //         match = true;
    //     }
    //     else
    //     {
    //         match = false;
    //     }
        
    //     // On renvoie match
    //     return match;
    // }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}

export default Contactform;

'use strict'

import Errors from './Errors.js';

class Contact {
    constructor(){
        this.error = new Errors();
        this.isValid = false;
        this.allowed = ['email', 'nom', 'prenom', 'telephone', 'message'];
        this.email='';
        this.lastName='';
        this.firstName='';
        this.phone='';
        this.message='';
    }

    /**check if inputs of contactForm are allowed & not empty
     * @param {*} fields all inputs of contactForm
     * @returns a Boolean value that indicates if form is valid or not
     */
    validate(fields){
        fields.forEach(field => {
            if (!this.allowed.includes(field.name)) {
                alert(`Le champ ${field.name} n'est pas valide`)
            }
            if (field.name === 'email') {
                if (this.validateEmail(field.value)) {
                    this.email = field.value;
                } else {
                    this.error.record({ email: 'Email invalide' });
                }
            }
            if (field.name === 'nom'){
                if(!field.value || !this.validateName(field.value)){
                    this.error.record({lastName: 'Nom invalide'});
                }
                this.firstName = field.value;
            }
            if (field.name === 'prenom'){
                if(!field.value || !this.validateName(field.value)){
                    this.error.record({firstName: 'Prénom invalide'});
                }
                this.lastName = field.value;
            }
            if (field.name === 'telephone'){
                if(field.value && !this.validatePhone(field.value)){
                    this.error.record({phone: 'Téléphone invalide'});
                }
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
            this.classList.remove('red-border')
        }
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    validateName(string) {
        const reg = /^[A-Za-z\à\â\ä\ç\é\è\ê\ë\ö\ô\î\ï\ù\û\ü\ -]+$/;
        return reg.test(string)
    }

    validatePhone(phoneNumber) {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phoneNumber);
    }
}

export default Contact;

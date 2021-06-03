'use strict'

import Errors from './Errors.js';

class Contactform {
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

    validate(fields){
        fields.forEach(field => {
            if (!this.allowed.includes(field.name)) {
                return this.error.record(`Le champ ${field.name} n'est pas valide`);
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
                if(!field.value){
                    this.phone = field.value;
                }
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
            this.classList.remove('red-border')
        }
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    validateName(string) {
        const reg = /^[A-Za-z\à\â\ä\é\è\ê\ë\ê\ô\î-]+$/;
        return reg.test(string)
    }
}

export default Contactform;

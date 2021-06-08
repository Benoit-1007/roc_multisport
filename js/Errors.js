class Errors {
    constructor() {
        this.errors = {
            messages: [],
        };
    }

    record(error) {
        this.errors.messages.push(error);
    }

    createError() {
        console.log(this.errors.messages.length)
        for (let error of this.errors.messages) {
            for (let field in error) {
                if (error.hasOwnProperty(field)) {
                    const div = document.createElement('div');
                    div.innerText = error[field];
                    div.classList.add('form-error');
                    const input = document.getElementById(`${field}`)
                    if (!input.nextElementSibling.classList.contains('form-error')) {
                        input.parentNode.insertBefore(div, input.nextSibling);
                    }
                input.classList.add('red-border');
                }
            }
        }
    }
}

export default Errors;

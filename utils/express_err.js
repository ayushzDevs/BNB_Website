class errors extends Error{
    constructor(status, message, messages = null){
        super(message);
        this.status = status;
        this.messages = messages;
    }
}

module.exports = errors;

class ApiError extends Errors  {
    constructor(
        statusCode,
        message= "something went wrong ",
        errors= [],
        stack= ""
    ){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.data = null;
        this.sucess = false;

        //if stack is provided then use it otherwise capture the stack
        if (stack) {
            this.stack = stack;
        } else {    
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
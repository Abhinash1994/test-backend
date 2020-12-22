import stackTrace from 'stack-trace';

global.RequestError =  class RequestError extends Error {
    copyObject(requestError) {
        this.errorList = requestError.errorList;
    }

    constructor(message, code, realError) {
        if(realError instanceof RequestError){
            super(realError.message, realError.code)
            this.copyObject(realError)
            return;
        }
        if(!code)
            code = 500;
        super(message, code);
        this.status = code;
        this.errorList = [];
        if(message instanceof Array){
            for(var i=0;i<message.length;i++){
                this.errorList.push(message[i])
            }
        }else{
            this.errorList.push(message);
        }
        var trace = stackTrace.get();
        var consoleMessage = message;
        if(realError)
            consoleMessage = realError;
        console.error('\x1b[31mRequestError\x1b[0m', '\x1b[35m'+trace[1].getFileName().replace(__dirname, '')+'\x1b[0m', '\x1b[32m'+trace[1].getLineNumber()+':'+trace[1].getColumnNumber()+'\x1b[0m', consoleMessage);
    }
};
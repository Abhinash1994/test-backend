export var sanitize = function(ignore=[]){
    return (req, res, next) => {
        var data = [];
        if(req.body){
            data = Object.keys(req.body);
            for(var i=0;i<data.length;i++){
                if(ignore.indexOf(data[i]) == -1 && typeof req.body[data[i]] == 'string')
                    req.body[data[i]] = req.sanitize(req.body[data[i]]).trim();
            }
        }
        if(req.params){
            data = Object.keys(req.params);
            for(var i=0;i<data.length;i++){
                if(ignore.indexOf(data[i]) == -1 && typeof req.params[data[i]] == 'string')
                    req.params[data[i]] = req.sanitize(req.params[data[i]]).trim();
            }
        }
        if(req.query){
            data = Object.keys(req.query);
            for(var i=0;i<data.length;i++){
                if(ignore.indexOf(data[i]) == -1 && typeof req.query[data[i]] == 'string')
                    req.query[data[i]] = req.sanitize(req.query[data[i]]).trim();
            }
        } 
        next();
    }
}; 
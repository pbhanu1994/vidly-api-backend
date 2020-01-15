// We don't want to repeat try, catch in every route handler.. -
// so we create a separate function to take care of try, catch blocks..
// Explanation:
// - asyncMiddleware is like a factory funciton / or separate function that takes
// - an argument and return the standard route handler function with (req, res, next) 
// - which the express will call that in the runtime later. 
// - since the handler async function has the req, and res arguments, we will pass
// - it in the handler funciton (when calling the handler argument).
module.exports = handler => {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch(ex) {
            next(ex);
        }
    }
}
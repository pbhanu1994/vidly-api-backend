module.exports = (req, res, next) => {
    // 401 - UnAuthorized -> Try to access protected resource, but provides invalid JWT Token
    //  - and we give chance to provide the valid JWT Token
    // 403 - Forbidden -> Even though the user provides the valid JWT, still not allowed to access the - 
    //  - target resource, this is where we use 403 (Forbidden). (They can't just try that resource)
    // 404 - Not Found -> Info Not Found

    if(!req.user.isAdmin) return res.status(403).send('Access denied.');
    
    next();
}
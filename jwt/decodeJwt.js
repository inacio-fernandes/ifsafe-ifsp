const jwt = require('jsonwebtoken');

function decodeJwt(token) {
    try {
        const decoded = jwt.verify(token, 'ifsp');
        return decoded._id;
    } catch (error) {
        console.error('Failed to decrypt JWT:', error);
        return null;
    }
}


const userId = decryptJwt(token);
console.log('User ID:', userId);
module.exports = decodeJwt;
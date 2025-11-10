"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPrivyToken = verifyPrivyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const client = (0, jwks_rsa_1.default)({
    jwksUri: 'https://auth.privy.io/.well-known/jwks.json'
});
function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key === null || key === void 0 ? void 0 : key.getPublicKey();
        callback(null, signingKey);
    });
}
function verifyPrivyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'No token provided' });
    jsonwebtoken_1.default.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err)
            return res.status(403).json({ error: 'Invalid token' });
        req.user = decoded;
        next();
    });
}

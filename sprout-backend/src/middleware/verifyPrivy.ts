import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';

const client = jwksClient({
  jwksUri: 'https://auth.privy.io/.well-known/jwks.json'
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export function verifyPrivyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    (req as any).user = decoded;
    next();
  });
}

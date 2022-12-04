import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// interface TokenPayload {
//     id: number;
//     iat: number;
//     exp: number
// }

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.sendStatus(401);
    }

    const token = authorization.replace('Bearer', '').trim();

    try {
        const data = jwt.verify(token, 'secret');

        if (!data) {
            return res.sendStatus(401);
        }

        // const { id } = data as TokenPayload;
        // req.userId = id;
        
        return next();
    } catch (error) {
        return res.sendStatus(401);
    }
}

export default authMiddleware;
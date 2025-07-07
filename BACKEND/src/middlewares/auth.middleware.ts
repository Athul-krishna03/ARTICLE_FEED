import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyAccessToken } from '../utils/jwt.service';
import { STATUS_CODE } from '../constants/statusCodes';
import { ERROR_MESSAGES } from '../constants/messages';

export interface AuthRequest extends Request {
    user: {
        id: string;
        email: string;
    };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log("cookie",req.cookies)
    const token = req.cookies['x-access-token'];
    console.log("token ",token)

    if (!token) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
            message: ERROR_MESSAGES.TOKEN_MISSING
        });
        return;
    }

    try {
        const decoded = verifyAccessToken(token);
        console.log("decode data",decoded);
        (req as AuthRequest).user = decoded;
        next();
    } catch (error) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
            message: 'Invalid token'
        });
        return;
    }
};

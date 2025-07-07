// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IAuthService } from '../interfaces/serviceInterfaces/IAuthService';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ICategoryService } from '../interfaces/serviceInterfaces/ICategoryService';
import { setCookies } from '../utils/helpers/setCookie.helper';
import { AppError } from '../appError';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/messages';
import { STATUS_CODE } from '../constants/statusCodes';
import { verifyAccessToken } from '../utils/jwt.service';
import { handleErrorResponse } from '../utils/helpers/handleError.helper';


@injectable()
export class AuthController {
    constructor(
        @inject("IAuthService") private authService:IAuthService,
        @inject('ICategoryService') private categoryService:ICategoryService
    ) {}

    async register(req: Request, res: Response) {
        try {
            console.log("body",req.body)
        const user = await this.authService.register(req.body);
        res.status(201).json(user);
        } catch (error) {
        res.status(400).json({ message: (error as Error).message });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        console.log("login",req.body)
        const result = await this.authService.login(email, password);
        console.log("login result",result)
        if (!result) return res.status(401).json({ message: 'Invalid credentials' });
        setCookies(res,result.access_token,result.refresh_token)
        res.json({ user: result.user });
    }

    async logoutUser(req: Request, res: Response){
        res.clearCookie("x-access-token");
        res.clearCookie("x-refresh-token");
        res.status(STATUS_CODE.OK).json({ success: true, message: SUCCESS_MESSAGES.LOGOUT_SUCCESS });
    }

    async updateProfile(req: Request, res: Response) {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing' });
        }
        const user = await this.authService.updateProfile(userId, req.body);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }

    async getCategories(req: Request, res: Response){
        const data= await this.categoryService.getAllCategories()
        return res.status(200).json({message:"cat data",data})
    }

    async getRefreshToken(req: Request, res: Response){
        const accessToken = req.cookies["x-access-token"];
        const refreshToken = req.cookies["x-refresh-token"];

        if (!refreshToken) {
            throw new AppError(ERROR_MESSAGES.TOKEN_MISSING, STATUS_CODE.UNAUTHORIZED);
        }
        let shouldRefresh = false;
        try {
            verifyAccessToken(accessToken);
            res.status(STATUS_CODE.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.TOKEN_VALID,
            });
            return;
        } catch (err: any) {
            if (err.name === "TokenExpiredError") {
            shouldRefresh = true;
            } else {
            throw new AppError(
                ERROR_MESSAGES.TOKEN_INVALID,
                STATUS_CODE.UNAUTHORIZED
            );
            }
        }
        if(shouldRefresh){
            try{
                const {newAccessToken, newRefreshToken}=await this.authService.refreshTokenVerify(refreshToken,accessToken)
                setCookies(res, newAccessToken, newRefreshToken);
                res.status(STATUS_CODE.OK).json({
                    success: true,
                    message: SUCCESS_MESSAGES.SESSION_RENEWED,
                })
            }catch(error){
                handleErrorResponse(error);
            }
        }
        
    }
}
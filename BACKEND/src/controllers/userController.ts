import { inject , injectable} from "tsyringe";
import { Request, Response } from 'express';
import { IArticleService } from "../interfaces/serviceInterfaces/IArticleService";
import { STATUS_CODE } from "../constants/statusCodes";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/messages";
import { handleErrorResponse } from "../utils/helpers/handleError.helper";
import { AuthRequest } from "../middlewares/auth.middleware";


@injectable()
export class UserController{
    constructor(
        @inject("IArticleService") private _IArticleService:IArticleService
    ){}

    async getUserArticles(req:Request,res:Response){
        try {
            const userId = (req as AuthRequest).user.id
            console.log("userId",userId)
            const articleData = await this._IArticleService.getArticlesByPreferences(userId)
            if(articleData){
                res.status(STATUS_CODE.OK).json({message:SUCCESS_MESSAGES.DATA_FETCHED,data:articleData})
                return 
            }else{
                res.status(STATUS_CODE.NOT_FOUND).json({message:ERROR_MESSAGES.ARTICLE_NOT_FOUND})
                return
            }
        } catch (error) {
            handleErrorResponse(error)
        }
    }

    async getMyArticles(req:Request,res:Response){
        try {
            const userId = (req as AuthRequest).user.id
            const articleData = await this._IArticleService.getUserArticles(userId)
            return res.status(STATUS_CODE.OK).json({message:SUCCESS_MESSAGES.DATA_FETCHED,data:articleData})
        } catch (error) {
            handleErrorResponse(error)
        }
    }

    async addArticle(req:Request,res:Response){
        try {
            const userId = (req as AuthRequest).user.id
            const data = {...req.body,author:userId}
            console.log("article data ",data)

            const article = await this._IArticleService.createArticle(data)
            if(article){
                res.status(STATUS_CODE.CREATED).json({message:SUCCESS_MESSAGES.CREATED_SUCCESS})
                return
            }else{
                res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({message:ERROR_MESSAGES.ARTICLE_NOT_FOUND})
            }
        } catch (error) {
            handleErrorResponse(error)
        }
    }

    async updateArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        const userId = (req as AuthRequest).user.id;
        const updateData = req.body;
        console.log(req.body)
        const updateType = req.body.updateType

        const updated = await this._IArticleService.updateArticle(articleId, updateData,updateType, userId);
        if (updated) {
            res.status(200).json({ message: SUCCESS_MESSAGES.UPDATED_SUCCESS });
        } else {
            res.status(404).json({ message: ERROR_MESSAGES.ARTICLE_NOT_FOUND });
        }
    }
    async deleteArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        const userId = (req as AuthRequest).user.id;
        console.log("articleId", articleId, "userId", userId);
        const deleted = await this._IArticleService.deleteArticle(articleId, userId);
        if (deleted) {
            res.status(200).json({ message: SUCCESS_MESSAGES.DELETED_SUCCESS });
        } else {
            res.status(404).json({ message: ERROR_MESSAGES.ARTICLE_NOT_FOUND });
        }
    }
}
import { Router ,Request,Response} from "express";
import {userController} from "../di"
import { authMiddleware } from "../middlewares/auth.middleware";

export class UserRoutes{
    public router : Router;
    constructor(){
        this.router = Router();
        this.initializeRoutes();
    }
    initializeRoutes(){
        this.router.get('/feeds', authMiddleware, (req: Request, res: Response) => {
            userController.getUserArticles(req, res);
        }),
        this.router.get('/my-articles',authMiddleware,(req:Request,res:Response)=>{
            userController.getMyArticles(req,res)
        }),
        this.router.post('/addArticle',authMiddleware,(req:Request,res:Response)=>{
            userController.addArticle(req,res)
        }),
        this.router.put('/update/:id', authMiddleware, (req: Request, res: Response) => {
            userController.updateArticle(req, res);
        }),
        this.router.delete('/delete/:id', authMiddleware, (req: Request, res: Response) => {
            userController.deleteArticle(req, res);
        })

    }
}

export default new UserRoutes().router;
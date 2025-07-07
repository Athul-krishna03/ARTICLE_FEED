import { Router ,Request,Response} from "express";
import { authController } from "../di";
import { authMiddleware } from "../middlewares/auth.middleware";

export class AuthRoutes{
    public router : Router;

    constructor(){
        this.router = Router();
        this.initializeRoutes();
    }

    initializeRoutes(){
        this.router.post('/register',(req:Request,res:Response)=>{
            authController.register(req,res)
        }),
        this.router.post('/login',(req:Request,res:Response)=>{
            authController.login(req,res)
        }),
        this.router.get('/categories',(req:Request,res:Response)=>{
            authController.getCategories(req,res)
        }),
        this.router.post('/refresh-token',(req:Request,res:Response)=>{
            authController.getRefreshToken(req,res)
        }),
        this.router.post('/logout',(req:Request,res:Response)=>{
            authController.logoutUser(req,res)
        }),
        this.router.put('/profile', authMiddleware, (req: Request, res: Response) => {
            authController.updateProfile(req, res);
        })
    }
}

export default new AuthRoutes().router;
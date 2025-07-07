import { container } from "tsyringe";
import { IAuthService } from "../interfaces/serviceInterfaces/IAuthService";
import { AuthService } from "../service/auth.service";
import { ICategoryService } from "../interfaces/serviceInterfaces/ICategoryService";
import { CategoryService } from "../service/category.service";
import { IArticleService } from "../interfaces/serviceInterfaces/IArticleService";
import { ArticleService } from "../service/article.service";

export class ServicesRegistery{
    static registerServices():void{
        container.register<IAuthService>("IAuthService",{
            useClass:AuthService
        })
        container.register<ICategoryService>("ICategoryService",{
            useClass:CategoryService
        })
        container.register<IArticleService>("IArticleService",{
            useClass:ArticleService
        })
    }
}
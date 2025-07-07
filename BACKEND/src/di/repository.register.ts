import { container } from "tsyringe";
import { IUserRepository } from "../interfaces/repositoryInterfaces/IUserRepository";
import { UserRepository } from "../repository/user.repository";
import { IArticleRepository } from "../interfaces/repositoryInterfaces/IArticleRepository";
import { ArticleRepository } from "../repository/article.repository";
import { ICategoryRepository } from "../interfaces/repositoryInterfaces/ICategoryRepository";
import { CategoryRepository } from "../repository/category.repository";

export class RepositoryRegistry{
    static registerRepositories():void{
        container.register<IUserRepository>("IUserRepository",{
            useClass:UserRepository
        }),
        container.register<IArticleRepository>("IArticleRepository",{
            useClass:ArticleRepository
        }),
        container.register<ICategoryRepository>("ICategoryRepository",{
            useClass:CategoryRepository
        })
    }
}
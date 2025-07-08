import { inject, injectable } from 'tsyringe';
import { Article } from '../entities/article.entity';
import { IArticleRepository } from '../interfaces/repositoryInterfaces/IArticleRepository';
import { IArticleService } from '../interfaces/serviceInterfaces/IArticleService';
import { IUserRepository } from '../interfaces/repositoryInterfaces/IUserRepository';
import { ERROR_MESSAGES } from '../constants/messages';
import { handleErrorResponse } from '../utils/helpers/handleError.helper';

@injectable()
export class ArticleService implements IArticleService{
    constructor( 
        @inject("IArticleRepository")private _articleRepo: IArticleRepository,
        @inject("IUserRepository") private _userRepo:IUserRepository
    ) {}

    async getArticleById(id: string): Promise<Article | null> {
        return this._articleRepo.findById(id);
    }

    async getArticlesByPreferences(userId:string): Promise<Article[]> {
        try {
            console.log("id",userId)
            const userData = await this._userRepo.findBy(userId)
            console.log("userData",userData)
            if(!userData){
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND)
            }
            return await this._articleRepo.findByPreferences(userData?.preferences);
        } catch (error) {
            handleErrorResponse(error)
            return [];
        }
    }

    async getUserArticles(authorId: string): Promise<Article[]> {
        return this._articleRepo.findByAuthor(authorId);
    }

    async createArticle(article: Article): Promise<Article> {
        return this._articleRepo.create(article);
    }

    async updateArticle(id: string, article: Partial<Article>, updateType: string, userId: string): Promise<Article | null> {
        const existing = await this._articleRepo.findById(id);
        if (!existing) return null;

        const removeUserId = (arr: string[] = []) => arr.filter(uid => uid !== userId);

        if (updateType === "like") {
            const alreadyLiked = existing.likes.includes(userId);
            article.likes = alreadyLiked
                ? removeUserId(existing.likes) 
                : [...removeUserId(existing.likes), userId]; 
            article.dislikes = removeUserId(existing.dislikes);
        }

        if (updateType === "dislike") {
            const alreadyDisliked = existing.dislikes.includes(userId);
            article.dislikes = alreadyDisliked
                ? removeUserId(existing.dislikes)
                : [...removeUserId(existing.dislikes), userId];
            article.likes = removeUserId(existing.likes);
        }

        if (updateType === "block") {
            const alreadyBlocked = existing.blocks.includes(userId);
            article.blocks = alreadyBlocked
                ? removeUserId(existing.blocks)
                : [...removeUserId(existing.blocks), userId];
        }

        if (updateType === "edit" && existing.author !== userId) {
            return null;
        }
        return this._articleRepo.update(id, article);
    }
    async deleteArticle(id: string, userId: string): Promise<boolean> {
        const existing = await this._articleRepo.findById(id);
        console.log("existing",existing)
        if (!existing || existing.author !== userId) return false;
        return this._articleRepo.delete(id);
    }
    async reactToArticle(id: string, reaction: 'likes' | 'dislikes' | 'blocks', userId: string): Promise<Article | null> {
        return this._articleRepo.addReaction(id, reaction, userId);
    }
}
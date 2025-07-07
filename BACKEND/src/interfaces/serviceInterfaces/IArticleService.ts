import { Article } from "../../entities/article.entity"

export interface IArticleService{
    getArticleById(id: string): Promise<Article | null>
    getArticlesByPreferences(userId:string): Promise<Article[]>
    getUserArticles(authorId: string): Promise<Article[]> 
    createArticle(article: Article): Promise<Article>
    updateArticle(id: string, article: Partial<Article>, updateType:string,userId: string): Promise<Article | null>
    deleteArticle(id: string, userId: string): Promise<boolean>
    reactToArticle(id: string, reaction: 'likes' | 'dislikes' | 'blocks', userId: string): Promise<Article | null>
}
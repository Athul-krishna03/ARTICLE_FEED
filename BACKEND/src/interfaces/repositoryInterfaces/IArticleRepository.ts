import { Types } from 'mongoose';
import { Article } from '../../entities/article.entity';

export interface IArticleRepository {
    findById(id: string): Promise<Article | null>;
    findByPreferences(preferenceIds: Types.ObjectId[]): Promise<Article[]>;
    findByAuthor(authorId: string): Promise<Article[]>;
    create(article: Article): Promise<Article>;
    update(id: string, article: Partial<Article>): Promise<Article | null>;
    delete(id: string): Promise<boolean>;
    addReaction(id: string, reaction: 'likes' | 'dislikes' | 'blocks', userId: string): Promise<Article | null>;
}
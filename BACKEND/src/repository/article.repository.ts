import mongoose, { Types } from 'mongoose';
import { Article } from '../entities/article.entity';
import { IArticleRepository } from '../interfaces/repositoryInterfaces/IArticleRepository';
import { ArticleModel, ArticleDocument } from '../models/article.model';
import { BaseRepository } from './base.respository';


function toArticle(doc: ArticleDocument): Article {
    return {
        _id: doc._id.toString(),
        title: doc.title,
        description: doc.description,
        imageUrl: doc.imageUrl,
        tags: doc.tags,
        category: {_id:doc.category?._id? doc.category._id.toString() : doc.category.toString(),name:doc.category?.name},
        author: {_id:doc.author?._id ? doc.author._id.toString() : doc.author.toString(),
            firstName:doc.author.firstName,
            lastName:doc.author.lastName
        },
        likes: doc.likes.map((id: mongoose.Types.ObjectId) => id.toString()),
        dislikes: doc.dislikes.map((id: mongoose.Types.ObjectId) => id.toString()),
        blocks: doc.blocks.map((id: mongoose.Types.ObjectId) => id.toString()),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
}

export class ArticleRepository extends BaseRepository<Article, ArticleDocument> implements IArticleRepository {

    constructor() {
        super(ArticleModel, toArticle);
    }
    async findById(id: string): Promise<Article | null> {
        const doc = await ArticleModel.findById(id)
        .populate('category', 'name')
        .populate('author', 'firstName lastName')
        .lean();
        return doc ? toArticle(doc as ArticleDocument) : null;
    }

    async findByPreferences(preferenceIds: Types.ObjectId[]): Promise<Article[]> {
        const docs = await ArticleModel.find({ category: { $in: preferenceIds } })
        .populate('category', 'name')
        .populate('author', 'firstName lastName')
        .lean();
        return docs.map((doc)=>toArticle(doc as ArticleDocument));
    }

    async findByAuthor(authorId: string): Promise<Article[]> {
        const docs = await ArticleModel.find({ author: authorId })
        .populate('category', 'name')
        .populate('author', 'firstName lastName')
        .lean();
        return docs.map((doc)=>toArticle(doc as ArticleDocument));
    }
    async update(id: string, article: Partial<Article>): Promise<Article | null> {
        const update: any = { ...article, updatedAt: new Date() };
        if (article.category) {
        update.category = new mongoose.Types.ObjectId(
            typeof article.category === 'string'
                ? article.category
                : article.category._id
        );
        }
        if (article.author) {
        update.author = new mongoose.Types.ObjectId(article.author._id);
        }
        if (article.likes) {
        update.likes = article.likes.map((id) => new mongoose.Types.ObjectId(id));
        }
        if (article.dislikes) {
        update.dislikes = article.dislikes.map((id) => new mongoose.Types.ObjectId(id));
        }
        if (article.blocks) {
        update.blocks = article.blocks.map((id) => new mongoose.Types.ObjectId(id));
        }
        const doc = await ArticleModel.findByIdAndUpdate(id, update, { new: true })
        .populate('category', 'name')
        .populate('author', 'firstName lastName')
        .lean();
        return doc ? toArticle(doc as ArticleDocument) : null;
    }

    async addReaction(id: string, reaction: 'likes' | 'dislikes' | 'blocks', userId: string): Promise<Article | null> {
        const update: any = { $addToSet: { [reaction]: new mongoose.Types.ObjectId(userId) } };
        const doc = await ArticleModel.findByIdAndUpdate(id, update, { new: true })
        .populate('category', 'name')
        .populate('author', 'firstName lastName')
        .lean();
        return doc ? toArticle(doc as ArticleDocument) : null;
    }
}
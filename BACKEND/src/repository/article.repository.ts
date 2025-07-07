import mongoose, { Schema, Types } from 'mongoose';
import { Article } from '../entities/article.entity';
import { IArticleRepository } from '../interfaces/repositoryInterfaces/IArticleRepository';
import { ArticleModel } from '../models/article.model';


function toArticle(doc: any): Article {
    return {
        _id: doc._id.toString(),
        title: doc.title,
        description: doc.description,
        imageUrl: doc.imageUrl,
        tags: doc.tags,
        category: doc.category?._id ? doc.category._id.toString() : doc.category.toString(),
        author: doc.author?._id ? doc.author._id.toString() : doc.author.toString(),
        likes: doc.likes.map((id: mongoose.Types.ObjectId) => id.toString()),
        dislikes: doc.dislikes.map((id: mongoose.Types.ObjectId) => id.toString()),
        blocks: doc.blocks.map((id: mongoose.Types.ObjectId) => id.toString()),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
}

export class ArticleRepository implements IArticleRepository {
    async findById(id: string): Promise<Article | null> {
        const doc = await ArticleModel.findById(id)
        .populate('category', 'name')
        .populate('author', 'firstName lastName')
        .lean();
        return doc ? toArticle(doc) : null;
    }

    async findByPreferences(preferenceIds: Types.ObjectId[]): Promise<any[]> {
        const docs = await ArticleModel.find({ category: { $in: preferenceIds } })
        .populate('category', 'name')
        .populate('author', 'firstName lastName')
        .lean();
        return docs;
    }

    async findByAuthor(authorId: string): Promise<any[]> {
        const docs = await ArticleModel.find({ author: authorId })
        .populate('category', 'name')
        .populate('author', 'firstName lastName')
        .lean();
        return docs;
    }

    async create(article: Article): Promise<Article> {
        const doc = await ArticleModel.create({
        ...article,
        category: new mongoose.Types.ObjectId(article.category),
        author: new mongoose.Types.ObjectId(article.author),
        likes:[],
        dislikes:[],
        blocks:[]
        });
        return toArticle(doc);
    }

    async update(id: string, article: Partial<Article>): Promise<Article | null> {
        const update: any = { ...article, updatedAt: new Date() };
        if (article.category) {
        update.category = new mongoose.Types.ObjectId(article.category);
        }
        if (article.author) {
        update.author = new mongoose.Types.ObjectId(article.author);
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
        console.log("update in repo",update)
        const doc = await ArticleModel.findByIdAndUpdate(id, update, { new: true })
        .populate('category', 'name')
        .populate('author', 'firstName lastName')
        .lean();
        return doc ? toArticle(doc) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await ArticleModel.findByIdAndDelete(id);
        return !!result;
    }

    async addReaction(id: string, reaction: 'likes' | 'dislikes' | 'blocks', userId: string): Promise<Article | null> {
        const update: any = { $addToSet: { [reaction]: new mongoose.Types.ObjectId(userId) } };
        const doc = await ArticleModel.findByIdAndUpdate(id, update, { new: true })
        .populate('category', 'name')
        .populate('author', 'firstName lastName')
        .lean();
        return doc ? toArticle(doc) : null;
    }
}
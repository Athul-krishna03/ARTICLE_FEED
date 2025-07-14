import { Model, model, Schema, Types } from "mongoose";
import { Article } from "../entities/article.entity";

export interface ArticleDocument extends Document{
    _id: Types.ObjectId;
    title: string;
    description: string;
    imageUrl?: string;
    tags: string[];
    category: {_id: Types.ObjectId , name:string};
    author: { _id: Types.ObjectId , firstName:string , lastName:string };
    likes: Types.ObjectId[];
    dislikes: Types.ObjectId[];
    blocks: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const ArticleSchema = new Schema<ArticleDocument>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    tags: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    blocks: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export const ArticleModel: Model<ArticleDocument> = model<ArticleDocument>('Article', ArticleSchema);
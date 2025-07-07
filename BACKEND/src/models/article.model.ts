import { model, Schema } from "mongoose";

const articleSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String },
        tags: [{ type: String }],
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        blocks: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true,
    }
);

export const ArticleModel = model("Article", articleSchema);
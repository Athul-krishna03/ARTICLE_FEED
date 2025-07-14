import { Types } from "mongoose";

export interface Article {
    _id: string | Types.ObjectId;
    title: string;
    description: string;
    imageUrl?: string;
    tags: string[];
    category: {
        _id:string,
        name:string
    };
    author:{
        _id:string,
        firstName:string,
        lastName:string
    };
    likes: string[];
    dislikes: string[];
    blocks: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface Article {
    _id: string;
    title: string;
    description: string;
    imageUrl?: string;
    tags: string[];
    category: string;
    author: string;
    likes: string[];
    dislikes: string[];
    blocks: string[];
    createdAt: Date;
    updatedAt: Date;
}
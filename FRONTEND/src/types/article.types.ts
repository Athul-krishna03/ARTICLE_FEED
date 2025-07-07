export interface Article {
    _id: string;
    title: string;
    description: string;
    imageUrl?: string;
    tags: string[];
    category: { _id: string; name: string };
    author: { _id: string; firstName: string; lastName: string };
    likes: string[];
    dislikes: string[];
    blocks: string[];
    createdAt: string;
    updatedAt: string;
}
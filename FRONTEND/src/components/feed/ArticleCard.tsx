import type { Article } from "@/types/article.types";
import { getCurrentUser } from "@/utils/helpers/getCurrentUser.helper";
import { Ban, MoreHorizontal, ThumbsDown, ThumbsUp, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface ArticleCardProps {
    article: Article;
    onAction: (action: string, articleId: string) => void;
    showEditOption?: boolean;
    onArticleClick?: (articleId: string) => void;
}

const ArticleCard = ({ article, onAction, showEditOption = false, onArticleClick }: ArticleCardProps) => {
    const user = getCurrentUser()
    const [isLiked, setIsLiked] = useState(article.likes.some((val)=>val == user._id));
    const [isDisliked, setIsDisliked] = useState(article.dislikes.some((val)=>val == user._id));
    const [likes, setLikes] = useState(article.likes.length);
    const [showMoreOptions, setShowMoreOptions] = useState(false);

    const handleLike = () => {
        if (isLiked) {
        setLikes(likes - 1);
        setIsLiked(false);
        } else {
        setLikes(likes + (isDisliked ? 2 : 1));
        setIsLiked(true);
        setIsDisliked(false);
        }
        onAction("like", article._id);
    };

    const handleDislike = () => {
        if (isDisliked) {
        setLikes(likes + 1);
        setIsDisliked(false);
        } else {
        setLikes(likes - (isLiked ? 2 : 1));
        setIsDisliked(true);
        setIsLiked(false);
        }
        onAction("dislike", article._id);
    };
    const handleBlock = () => {
        onAction("block", article._id);
        setShowMoreOptions(false);
    };

    const handleEdit = () => {
        onAction("edit", article._id);
        setShowMoreOptions(false);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this article?")) {
            onAction("delete", article._id);
        }
        setShowMoreOptions(false);
    };
    const handleArticleClick = () => {
        if (onArticleClick) {
            onArticleClick(article._id);
        }
    };

    return (
        <div 
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={handleArticleClick}
        >
        {/* Article Header */}
        <div className="p-4 border-b border-gray-100">
            <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                    {article.author.firstName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                </div>
                <div>
                <h3 className="font-semibold text-gray-800">{article.author.firstName} {article.author.lastName}</h3>
                </div>
            </div>
            <div className="relative">
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    setShowMoreOptions(!showMoreOptions);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
                {showMoreOptions && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    {showEditOption && (
                    <>
                        <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit();
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-blue-600"
                        >
                        <Edit className="w-4 h-4" />
                        <span>Edit Article</span>
                        </button>
                        <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                        >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Article</span>
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                    </>
                    )}
                    {!showEditOption && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBlock();
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                        >
                        <Ban className="w-4 h-4" />
                        <span>Block</span>
                    </button>)}
                </div>
                )}
            </div>
            </div>
        </div>

        {/* Article Content */}
        <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {article.category.name}
            </span>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 cursor-pointer transition-colors">
            {article.title}
            </h2>

            <p className="text-gray-600 mb-4 leading-relaxed">
            {article.description}
            </p>

            {/* Article Image */}
            {article.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden">
            <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
            </div>
            )}
        </div>

        {/* Article Actions */}
        <div className="px-4 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleLike();
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isLiked
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
                >
                <ThumbsUp
                    className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                />
                <span className="text-sm font-medium">{likes}</span>
                </button>

                <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDislike();
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isDisliked
                    ? "bg-red-50 text-red-600"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
                >
                <ThumbsDown
                    className={`w-4 h-4 ${isDisliked ? "fill-current" : ""}`}
                />
                </button>
            </div>
            </div>
        </div>
        </div>
    );
};

export default ArticleCard;
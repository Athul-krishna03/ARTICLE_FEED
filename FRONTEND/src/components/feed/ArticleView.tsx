import React, { useState } from "react";
import type { Article } from "@/types/article.types";
import { getCurrentUser } from "@/utils/helpers/getCurrentUser.helper";
import { ArrowLeft, Calendar, User,Tag,ThumbsUp,ThumbsDown,Share2,MoreHorizontal,Ban,} from "lucide-react";

interface ArticleViewPageProps {
    article: Article;
    onBack: () => void;
    onAction: (action: string, articleId: string) => void;
}

const ArticleViewPage: React.FC<ArticleViewPageProps> = ({
    article,
    onBack,
    onAction,
}) => {
    const user = getCurrentUser();
    const [isLiked, setIsLiked] = useState(
        article.likes.some((val) => val == user._id)
    );
    const [isDisliked, setIsDisliked] = useState(
        article.dislikes.some((val) => val == user._id)
    );
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

    const handleShare = () => {
        if (navigator.share) {
        navigator.share({
            title: article.title,
            text: article.description,
            url: window.location.href,
        });
        } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Article link copied to clipboard!");
        }
        onAction("share", article._id);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Feed</span>
                </button>

                <div className="relative">
                <button
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
                {showMoreOptions && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <button
                        onClick={handleBlock}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                    >
                        <Ban className="w-4 h-4" />
                        <span>Block</span>
                    </button>
                    </div>
                )}
                </div>
            </div>
            </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Article Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">
                        {article.author.firstName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    </div>
                    <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-500" />
                        {article.author.firstName} {article.author.lastName}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(article.createdAt)}
                    </p>
                    </div>
                </div>
                </div>

                {/* Category */}
                <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {article.category.name}
                </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
                </h1>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                <div className="flex items-start gap-2 mb-6">
                    <Tag className="w-5 h-5 text-gray-500 mt-1" />
                    <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                        <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                        #{tag}
                        </span>
                    ))}
                    </div>
                </div>
                )}
            </div>

            {/* Article Image */}
            {article.imageUrl && (
                <div className="relative">
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-96 object-cover"
                />
                </div>
            )}

            {/* Article Body */}
            <div className="p-6">
                <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {article.description}
                </p>
                </div>
            </div>

            {/* Article Actions */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isLiked
                        ? "bg-blue-500 text-white"
                        : "hover:bg-white hover:shadow-sm text-gray-600 bg-white"
                    }`}
                    >
                    <ThumbsUp
                        className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                    />
                    <span className="font-medium">{likes}</span>
                    </button>

                    <button
                    onClick={handleDislike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isDisliked
                        ? "bg-red-500 text-white"
                        : "hover:bg-white hover:shadow-sm text-gray-600 bg-white"
                    }`}
                    >
                    <ThumbsDown
                        className={`w-5 h-5 ${isDisliked ? "fill-current" : ""}`}
                    />
                    </button>
                </div>

                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:shadow-sm text-gray-600 transition-all"
                >
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">Share</span>
                </button>
                </div>
            </div>
            </article>
        </div>
        </div>
    );
};

export default ArticleViewPage;

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ArticleCard from "./ArticleCard";
import type { Article } from "@/types/article.types";
import {
  FileText,
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { getCategories } from "@/services/api";
import { uploadProfileImageCloudinary } from "@/utils/uploadImagetoClaudinary";
import { articleSchema } from "@/utils/validators/articlevalidator";
import { useAddArticle } from "@/hooks/useAddArticle";
import ArticleViewPage from "./ArticleView";
import { toast } from "sonner";

interface Category {
    _id: string;
    name: string;
}

interface ContentTypes {
    articles: Article[];
    type: string;
}

const MainContentArea = ({articles, type}: ContentTypes) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [imageUploading, setImageUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>("");
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [showArticleView, setShowArticleView] = useState(false);
    const { mutate: addArticle } = useAddArticle();

    useEffect(() => {
        const fetchCategories = async () => {
            const categoryData = await getCategories();
            setCategories(categoryData);
        };
        fetchCategories();
    }, []);

    const handleArticleAction = (action: string, articleId: string) => {
        const articleData = articles.filter((val) => val._id == articleId)[0];
        const Data = {
            title: articleData.title,
            description: articleData.description,
            imageUrl: uploadedImageUrl || undefined,
            tags: articleData.tags,
            category: articleData.category._id,
        };

        if (action === "block") {
            articles.filter((article) => article._id !== articleId);
            toast.success("Article blocked successfully");
        }
        if (action == "like") {
            addArticle({_id: articleId, ...Data, updateType: "like"});
        }
        if (action == "dislike") {
            addArticle({_id: articleId, ...Data, updateType: "dislike"});
        }
        if (action == 'block') {
            addArticle({_id: articleId, ...Data, updateType: "block"});
        }
        if (action == "delete") {
            addArticle({_id: articleId, ...Data, updateType: "delete"});
        }
    };

    const initialValues = {
        title: "",
        description: "",
        tags: "",
        category: "",
    };

    const getInitialValues = () => {
        if (isEditMode && editingArticle) {
            return {
                title: editingArticle.title || "",
                description: editingArticle.description || "",
                tags: editingArticle.tags ? editingArticle.tags.join(", ") : "",
                category: editingArticle.category._id || "",
            };
        }
        return initialValues;
    };

    const handleEditArticle = (article: Article) => {
        setEditingArticle(article);
        setIsEditMode(true);
        setShowCreateForm(true);
        setUploadedImageUrl(article.imageUrl || "");
    };

    const handleBackFromArticleView = () => {
        setShowArticleView(false);
        setSelectedArticle(null);
    };

    const enhancedHandleArticleAction = (action: string, articleId: string) => {
        if (action === "edit") {
            const articleToEdit = articles.find(article => article._id === articleId);
            if (articleToEdit) {
                handleEditArticle(articleToEdit);
            }
        } else {
            handleArticleAction(action, articleId);
        }
    };

    const handleArticleClick = (articleId: string) => {
        const article = articles.find(a => a._id === articleId);
        if (article) {
            setSelectedArticle(article);
            setShowArticleView(true);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB");
            return;
        }

        setImageUploading(true);
        try {
            const imageUrl = await uploadProfileImageCloudinary(file);
            setUploadedImageUrl(imageUrl);
        } catch (error) {
            alert("Failed to upload image. Please try again.");
        } finally {
            setImageUploading(false);
        }
    };

    const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
        try {
            const tagsArray = values.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag);

            const articleData = {
                title: values.title,
                description: values.description,
                imageUrl: uploadedImageUrl || undefined,
                tags: tagsArray,
                category: values.category,
            };

            if (isEditMode && editingArticle) {
                addArticle({ ...articleData, _id: editingArticle._id });
            } else {
                addArticle(articleData);
                toast.success("Article created successfully");
            }

            resetForm();
            setUploadedImageUrl("");
            setShowCreateForm(false);
            setIsEditMode(false);
            setEditingArticle(null);
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} article:`, error);
            alert(`Failed to ${isEditMode ? 'update' : 'create'} article. Please try again.`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = (resetForm: () => void) => {
        resetForm();
        setUploadedImageUrl("");
        setShowCreateForm(false);
        setIsEditMode(false);
        setEditingArticle(null);
    };

    // Show Article View Page
    if (showArticleView && selectedArticle) {
        return (
            <ArticleViewPage
                article={selectedArticle}
                onBack={handleBackFromArticleView}
                onAction={enhancedHandleArticleAction}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {type === "feed" ? "Article Feed" : "My Articles"}
                        </h1>
                        {type === "feed" && (
                            <p className="text-gray-600 mt-2">
                                Discover personalized content tailored to your interests
                            </p>
                        )}
                    </div>

                    {type === "myarticle" && (
                        <button
                            onClick={() => {
                                setIsEditMode(false);
                                setEditingArticle(null);
                                setUploadedImageUrl("");
                                setShowCreateForm(!showCreateForm);
                            }}
                            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Article
                        </button>
                    )}
                </div>

                {/* Create/Edit Article Form */}
                {type === "myarticle" && showCreateForm && (
                    <div className="mb-8">
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <Formik
                                    initialValues={getInitialValues()}
                                    validationSchema={articleSchema}
                                    onSubmit={handleSubmit}
                                    enableReinitialize={true}
                                >
                                    {({ isSubmitting, resetForm, errors, touched }) => (
                                        <Form className="flex flex-col">
                                            {/* Form Header */}
                                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <h2 className="text-xl font-semibold text-gray-900">
                                                        {isEditMode ? "Edit Article" : "Create New Article"}
                                                    </h2>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCancel(resetForm)}
                                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        <X className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Image Upload Section */}
                                            <div className="relative h-64 bg-gray-100 border-b border-gray-200">
                                                {uploadedImageUrl ? (
                                                    <div className="relative h-full">
                                                        <img
                                                            src={uploadedImageUrl}
                                                            alt="Article preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setUploadedImageUrl("")}
                                                            className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center">
                                                        {imageUploading ? (
                                                            <div className="flex flex-col items-center">
                                                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-2" />
                                                                <p className="text-gray-600">Uploading image...</p>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
                                                                <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                                                                    <Upload className="w-5 h-5 inline mr-2" />
                                                                    Upload Cover Image
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={handleImageUpload}
                                                                        className="hidden"
                                                                        disabled={imageUploading}
                                                                    />
                                                                </label>
                                                                <p className="text-sm text-gray-500 mt-2">
                                                                    Max file size: 5MB
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Form Fields */}
                                            <div className="p-6 space-y-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Title
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        name="title"
                                                        placeholder="Enter article title..."
                                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                            errors.title && touched.title
                                                                ? "border-red-500 bg-red-50"
                                                                : "border-gray-300"
                                                        }`}
                                                    />
                                                    <ErrorMessage
                                                        name="title"
                                                        component="div"
                                                        className="text-red-500 text-sm mt-1"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Description
                                                    </label>
                                                    <Field
                                                        as="textarea"
                                                        name="description"
                                                        placeholder="Write your article description..."
                                                        rows={4}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                                                            errors.description && touched.description
                                                                ? "border-red-500 bg-red-50"
                                                                : "border-gray-300"
                                                        }`}
                                                    />
                                                    <ErrorMessage
                                                        name="description"
                                                        component="div"
                                                        className="text-red-500 text-sm mt-1"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Category
                                                    </label>
                                                    <Field
                                                        as="select"
                                                        name="category"
                                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                            errors.category && touched.category
                                                                ? "border-red-500 bg-red-50"
                                                                : "border-gray-300"
                                                        }`}
                                                    >
                                                        <option value="">Select a category</option>
                                                        {categories.map((category) => (
                                                            <option key={category._id} value={category._id}>
                                                                {category.name}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage
                                                        name="category"
                                                        component="div"
                                                        className="text-red-500 text-sm mt-1"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Tags
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        name="tags"
                                                        placeholder="Enter tags separated by commas (e.g., technology, programming, web)"
                                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                            errors.tags && touched.tags
                                                                ? "border-red-500 bg-red-50"
                                                                : "border-gray-300"
                                                        }`}
                                                    />
                                                    <ErrorMessage
                                                        name="tags"
                                                        component="div"
                                                        className="text-red-500 text-sm mt-1"
                                                    />
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting || imageUploading}
                                                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                    >
                                                        {isSubmitting 
                                                            ? (isEditMode ? "Updating..." : "Creating...") 
                                                            : (isEditMode ? "Update Article" : "Create Article")
                                                        }
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCancel(resetForm)}
                                                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                )}

                {/* Articles List */}
                {articles && articles.length > 0 ? (
                    <div className="max-w-2xl mx-auto space-y-6">
                        {articles.map((article) => (
                            <ArticleCard
                                key={article._id}
                                article={article}
                                onAction={enhancedHandleArticleAction}
                                showEditOption={type === "myarticle"}
                                onArticleClick={handleArticleClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="mx-auto w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <FileText className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            No articles to show
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            {type === "feed"
                                ? "All articles have been filtered out. Try adjusting your preferences or check back later for new content."
                                : "You haven't created any articles yet. Click 'Create Article' to share your first story with the world."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainContentArea;
import Header from '@/components/common/Header'
import MainContentArea from '@/components/feed/mainContentArea'
import { useGetArticleData } from '@/hooks/useGetUserArticleData';
import type { Article } from '@/types/article.types';
import { useEffect, useState } from 'react'

const MyArticlepage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const { data , isLoading } = useGetArticleData();

    useEffect(() => {
        if (data) {
            setArticles(()=>data);
        }
    }, [data]);
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header />

            {isLoading ? (
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800"></div>
                </div>
            ) : (
                <MainContentArea
                    articles={articles}
                    type="myarticle"
                />
            )}
        </div>
    );
}

export default MyArticlepage;

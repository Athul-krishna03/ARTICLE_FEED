import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import { useGetArticleData } from "@/hooks/useGetArticleData";
import type { Article } from "@/types/article.types";
import MainContentArea from "@/components/feed/mainContentArea";
import { getCurrentUser } from "@/utils/helpers/getCurrentUser.helper";
import type { User } from "@/types/user.types";

export default function ArticleFeedPage() {
  const user: User = getCurrentUser();
  const [articles, setArticles] = useState<Article[]>([]);
  const { data, isLoading } = useGetArticleData();
  useEffect(() => {
    if (data) {
      setArticles(() => data
        .filter((article: Article) => article.author?._id !== user?._id)
        .filter((article: Article) => !article.blocks.includes(user?._id ?? ""))
      );
    }
  }, [data]);

  console.log("article",data)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto scrollbar-hide">
      <Header/>
      {isLoading ? (
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800"></div>
                </div>
            ) : (
                <MainContentArea
                    articles={articles}
                    type="feed"
                />
            )}
    </div>
  );
}

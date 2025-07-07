import {  getUserArticles } from "@/services/api"
import { useQuery } from "@tanstack/react-query"

export const useGetArticleData=()=>{
    return  useQuery({
        queryKey:['userArticle'],
        queryFn:getUserArticles
    })

}
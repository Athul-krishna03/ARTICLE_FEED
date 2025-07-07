import { getDashboardArticles } from "@/services/api"
import { useQuery } from "@tanstack/react-query"

export const useGetArticleData=()=>{
    return  useQuery({
        queryKey:['article'],
        queryFn:getDashboardArticles
    })

}
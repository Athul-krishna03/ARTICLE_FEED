import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createArticle, deleteArticle, updateArticle } from "@/services/api";


export type ArticleInput = {
    _id?: string;
    title: string;
    description: string;
    imageUrl?: string;
    tags: string[];
    category: string;
    updateType?:string;
};

export const useAddArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ArticleInput) => {
            console.log("hook",data)
            if(data.updateType === 'delete') {
                const { _id } = data;
                deleteArticle(_id as string);
                return 
            }
            if (data._id) {
                const { _id, ...rest } = data;
                return updateArticle(_id, rest);
            } else {
                return createArticle(data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userArticle'] });
            queryClient.invalidateQueries({ queryKey: ['article'] });
        },
    });
};

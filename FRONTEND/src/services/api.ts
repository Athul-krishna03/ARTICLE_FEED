import { api } from "@/api/auth.axios";
import { axiosInstance } from "@/api/private.axios";
import { ARTICLE_ROUTES, AUTH_ROUTES } from "@/constants/routeConstants";
import type { ArticleInput } from "@/hooks/useAddArticle";
import type { User } from "@/types/user.types";


export const register = async (data: User) =>{
    const response = await api.post(AUTH_ROUTES.REGISTER, data)
    return response.data
};
export const login = async (data: { email: string; password: string }) => {
    const response =await api.post(AUTH_ROUTES.LOGIN, data)
    return response.data
};
export const logoutUser = async () => {
    const response = await api.post(AUTH_ROUTES.LOGOUT);
    return response.data;
};
export const updateProfile = async (data: Partial<User>) => {
    return await axiosInstance.put(AUTH_ROUTES.PROFILE, data)
};
export const getDashboardArticles = async () => {
    const feedsData = await axiosInstance.get(ARTICLE_ROUTES.FEED)
    console.log("api ",feedsData.data)
    return feedsData.data.data
};
export const getUserArticles = async () => {
    const userArticles=await axiosInstance.get(ARTICLE_ROUTES.USER_ARTICLES)
    console.log(userArticles.data)
    return userArticles.data.data
};
export const getArticle = (id: string) => {
    api.get(`/articles/${id}`)
};
export const createArticle = async (data: ArticleInput) => {
    const addArticle=await axiosInstance.post(ARTICLE_ROUTES.ADD, data)
    return addArticle
};
export const updateArticle = async (id: string, data: ArticleInput) =>{
    return (await axiosInstance.put(ARTICLE_ROUTES.UPDATE(id), data)).data.data
};
export const deleteArticle = async (id: string) =>{ 
    return await axiosInstance.delete(ARTICLE_ROUTES.DELETE(id))
};
export const getCategories = async () => {
    const response = await api.get(AUTH_ROUTES.CATEGORIES)
    console.log(response.data.data)
    return response.data.data
};
export const createCategory = (data: { name: string }) => {
    api.post('/categories', data)
};
import { Category } from "../../entities/category.entity";

export interface ICategoryService{
    getAllCategories(): Promise<Category[]>
    createCategory(category: Category): Promise<Category>
}
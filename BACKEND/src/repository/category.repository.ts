import { Category } from "../entities/category.entity";

import { ICategoryRepository } from "../interfaces/repositoryInterfaces/ICategoryRepository";
import { CategoryModel } from "../models/category.model";


export class CategoryRepository implements ICategoryRepository{
        async findAll(): Promise<Category[]> {
        const categories =await CategoryModel.find().lean();
        return categories.map((val)=>{
            return {
                _id:val._id.toString(),
                name:val.name
            }
            
        })
    }

    async create(category: Category): Promise<Category> {
        const newCategory = await CategoryModel.create(category);
        const newCat = newCategory.toObject();
        return {_id:newCat._id.toString(),name:newCat.name}

    }
}
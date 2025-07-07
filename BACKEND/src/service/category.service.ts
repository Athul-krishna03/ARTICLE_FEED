import { inject, injectable } from 'tsyringe';
import { Category } from '../entities/category.entity';
import { ICategoryRepository } from '../interfaces/repositoryInterfaces/ICategoryRepository';
import { ICategoryService } from '../interfaces/serviceInterfaces/ICategoryService';

@injectable()
export class CategoryService implements ICategoryService{
    constructor(
        @inject("ICategoryRepository") private _categoryRepo: ICategoryRepository
    ) {}

    async getAllCategories(): Promise<Category[]> {
        return this._categoryRepo.findAll();
    }

    async createCategory(category: Category): Promise<Category> {
        return this._categoryRepo.create(category);
    }
}
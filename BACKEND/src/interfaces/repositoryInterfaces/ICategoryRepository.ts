import { Category } from '../../entities/category.entity';

export interface ICategoryRepository {
    findAll(): Promise<Category[]>;
    create(category: Category): Promise<Category>;
}
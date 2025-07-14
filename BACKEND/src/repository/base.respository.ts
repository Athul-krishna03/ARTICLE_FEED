
import { Model, Document, UpdateQuery } from 'mongoose';

export interface IBaseRepository<T, D> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    update(id: string, data: UpdateQuery<D>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}

export class BaseRepository<T, D> implements IBaseRepository<T,D> {
  protected model: Model<D>;
  protected toEntity: (doc: D ) => T;

  constructor(model: Model<D>, toEntity: (doc: D ) => T) {
    this.model = model;
    this.toEntity = toEntity;
  }

  async create(data: Partial<T>): Promise<T> {
    const doc = await this.model.create(data);
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<T | null> {
    const doc = await this.model.findById(id).lean<D>();
    return doc ? this.toEntity(doc as D) : null;
  }

  async findAll(): Promise<T[]> {
    const docs = await this.model.find().lean<D[]>();
    return docs.map(this.toEntity);
  }

  async update(id: string, data: UpdateQuery<D>): Promise<T | null> {
    const doc = await this.model.findByIdAndUpdate(id, data, { new: true }).lean<D>();
    return doc ? this.toEntity(doc as D) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}

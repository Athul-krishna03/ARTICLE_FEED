import { User } from "../../entities/user.entity";

export interface IUserRepository {
  findBy(id: string): Promise<User | null>;
  findByEmailOrPhone(identifier: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User | null>;
}
